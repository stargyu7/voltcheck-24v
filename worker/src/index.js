const JSON_HEADERS = { 'content-type': 'application/json; charset=utf-8' };
const MAX_BODY_BYTES = 256 * 1024;

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...JSON_HEADERS, ...extraHeaders }
  });
}

function corsHeaders(request, env) {
  const origin = request.headers.get('Origin');
  const allowed = env.SITE_ORIGIN || 'https://voltcheck24.com';
  return origin === allowed ? {
    'access-control-allow-origin': allowed,
    'access-control-allow-headers': 'content-type, x-requested-with',
    'access-control-allow-methods': 'GET, POST, OPTIONS',
    'vary': 'Origin'
  } : {};
}

function withCors(response, request, env) {
  const headers = new Headers(response.headers);
  Object.entries(corsHeaders(request, env)).forEach(([key, value]) => headers.set(key, value));
  return new Response(response.body, { status: response.status, headers });
}

async function readJson(request) {
  const length = Number(request.headers.get('content-length') || 0);
  if (length > MAX_BODY_BYTES) throw new Error('request_too_large');
  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) throw new Error('request_too_large');
  return JSON.parse(raw || '{}');
}

function clean(value, max = 1000) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function hex(buffer) {
  return [...new Uint8Array(buffer)].map(byte => byte.toString(16).padStart(2, '0')).join('');
}

async function hmacHex(secret, body) {
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  return hex(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body)));
}

function sameSecret(left, right) {
  if (!left || !right || left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return difference === 0;
}

async function verifyWebhook(request, env, body) {
  const signature = request.headers.get('X-Signature') || '';
  if (!env.LEMON_SQUEEZY_WEBHOOK_SECRET || !signature) return false;
  return sameSecret(signature, await hmacHex(env.LEMON_SQUEEZY_WEBHOOK_SECRET, body));
}

function now() {
  return Math.floor(Date.now() / 1000);
}

async function receiveLemonWebhook(request, env) {
  const body = await request.text();
  if (new TextEncoder().encode(body).byteLength > MAX_BODY_BYTES) return json({ error: 'request_too_large' }, 413);
  if (!(await verifyWebhook(request, env, body))) return json({ error: 'invalid_signature' }, 401);

  const payload = JSON.parse(body);
  const eventName = request.headers.get('X-Event-Name') || payload?.meta?.event_name || 'unknown';
  const eventId = clean(payload?.data?.attributes?.identifier || payload?.data?.id, 120);
  if (!eventId) return json({ error: 'missing_event_id' }, 400);

  await env.DB.prepare(
    'INSERT OR IGNORE INTO webhook_events (event_id, event_name, payload, received_at) VALUES (?, ?, ?, ?)'
  ).bind(eventId, eventName, body, now()).run();

  const attributes = payload?.data?.attributes || {};
  const orderId = clean(payload?.data?.id, 80);
  const status = eventName.includes('refund') || attributes.status === 'refunded' ? 'refunded' : 'paid';
  const email = clean(attributes.user_email, 320).toLowerCase();
  const variantId = String(attributes.variant_id || '');
  const fileKey = variantId === String(env.LEMON_VARIANT_PRO_ID || '')
    ? 'pro/VoltCheck_Pro_Master_Bundle.zip'
    : 'starter/VoltCheck_Starter_Pack.zip';

  if (orderId && email) {
    await env.DB.prepare(`
      INSERT INTO orders (provider, provider_order_id, email, product_key, amount, currency, status, created_at, updated_at)
      VALUES ('lemonsqueezy', ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(provider, provider_order_id) DO UPDATE SET
        email=excluded.email, product_key=excluded.product_key, amount=excluded.amount,
        currency=excluded.currency, status=excluded.status, updated_at=excluded.updated_at
    `).bind(
      orderId, email, variantId === String(env.LEMON_VARIANT_PRO_ID || '') ? 'pro' : 'starter',
      Number(attributes.total || 0), clean(attributes.currency, 8), status, now(), now()
    ).run();
  }
  return json({ received: true });
}

async function issueDownloadLink(request, env) {
  const input = await readJson(request);
  const orderId = clean(input.orderId, 80);
  const email = clean(input.email, 320).toLowerCase();
  if (!orderId || !validEmail(email)) return json({ error: 'invalid_order_request' }, 400);

  const order = await env.DB.prepare(
    "SELECT provider_order_id, email, product_key, status FROM orders WHERE provider_order_id = ? AND email = ? LIMIT 1"
  ).bind(orderId, email).first();
  if (!order || order.status !== 'paid') return json({ error: 'order_not_available' }, 403);

  const rawToken = crypto.randomUUID();
  const tokenHash = await hmacHex(env.DOWNLOAD_TOKEN_SECRET || env.LEMON_SQUEEZY_WEBHOOK_SECRET, rawToken);
  const expiresAt = now() + Math.min(Math.max(Number(env.DOWNLOAD_TTL_SECONDS || 900), 300), 3600);
  await env.DB.prepare(
    'INSERT INTO download_tokens (token_hash, provider_order_id, expires_at, created_at) VALUES (?, ?, ?, ?)'
  ).bind(tokenHash, order.provider_order_id, expiresAt, now()).run();
  return json({ url: `${env.SITE_ORIGIN || 'https://voltcheck24.com'}/api/download?token=${encodeURIComponent(rawToken)}`, expiresAt });
}

async function downloadFile(request, env) {
  const token = clean(new URL(request.url).searchParams.get('token'), 120);
  if (!token) return new Response('Missing token', { status: 400 });
  const tokenHash = await hmacHex(env.DOWNLOAD_TOKEN_SECRET || env.LEMON_SQUEEZY_WEBHOOK_SECRET, token);
  const claimed = await env.DB.prepare(`
    UPDATE download_tokens SET used_at = ?
    WHERE token_hash = ? AND used_at IS NULL AND expires_at > ?
  `).bind(now(), tokenHash, now()).run();
  if (!claimed.meta?.changes) return new Response('Link expired or already used', { status: 410 });

  const record = await env.DB.prepare(
    'SELECT o.product_key FROM download_tokens t JOIN orders o ON o.provider_order_id = t.provider_order_id WHERE t.token_hash = ? LIMIT 1'
  ).bind(tokenHash).first();
  const key = record?.product_key === 'pro' ? 'pro/VoltCheck_Pro_Master_Bundle.zip' : 'starter/VoltCheck_Starter_Pack.zip';
  const object = await env.FILES.get(key);
  if (!object) return new Response('File is not available', { status: 503 });
  const headers = new Headers({
    'content-type': object.httpMetadata?.contentType || 'application/zip',
    'content-disposition': `attachment; filename="${key.split('/').pop()}"`,
    'cache-control': 'private, no-store'
  });
  return new Response(object.body, { headers });
}

async function receiveContact(request, env, ctx) {
  const input = await readJson(request);
  const email = clean(input.email, 320).toLowerCase();
  const message = clean(input.message, 4000);
  if (!validEmail(email) || !message) return json({ error: 'invalid_contact' }, 400);
  const id = crypto.randomUUID();
  await env.DB.prepare(`
    INSERT INTO contact_messages (id, name, company, email, phone, message, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(id, clean(input.name, 160), clean(input.company, 200), email, clean(input.phone, 80), message, now()).run();

  if (env.RESEND_API_KEY && env.ADMIN_EMAIL) {
    ctx.waitUntil(fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        from: env.MAIL_FROM || 'VoltCheck24 <onboarding@resend.dev>',
        to: [env.ADMIN_EMAIL],
        reply_to: email,
        subject: `[VoltCheck24] ${clean(input.company, 120) || 'New engineering inquiry'}`,
        text: `${clean(input.name, 160)}\n${email}\n\n${message}`
      })
    }));
  }
  return json({ received: true, id });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (request.method === 'OPTIONS') return withCors(new Response(null, { status: 204 }), request, env);
    try {
      let response;
      if (url.pathname === '/api/webhooks/lemonsqueezy' && request.method === 'POST') response = await receiveLemonWebhook(request, env);
      else if (url.pathname === '/api/download-link' && request.method === 'POST') response = await issueDownloadLink(request, env);
      else if (url.pathname === '/api/download' && request.method === 'GET') response = await downloadFile(request, env);
      else if (url.pathname === '/api/contact' && request.method === 'POST') response = await receiveContact(request, env, ctx);
      else response = json({ error: 'not_found' }, 404);
      return withCors(response, request, env);
    } catch (error) {
      console.error(JSON.stringify({ error: String(error?.message || error), path: url.pathname }));
      return withCors(json({ error: 'internal_error' }, 500), request, env);
    }
  }
};
