# VoltCheck commerce API

This Worker keeps payment verification and paid-file delivery outside the browser.

## Required secrets

Set these with Wrangler or the Cloudflare dashboard. Do not commit them:

- `LEMON_SQUEEZY_WEBHOOK_SECRET`
- `DOWNLOAD_TOKEN_SECRET`
- `RESEND_API_KEY` (optional, for admin email alerts)

The Worker also expects `ADMIN_EMAIL` and optionally `MAIL_FROM` as dashboard variables.

## Provisioning sequence

1. Copy `wrangler.example.jsonc` to a private deployment config and replace the D1 ID and Lemon Squeezy Variant IDs.
2. Create the D1 database and apply `schema.sql`.
3. Create the R2 bucket and upload paid files under `starter/` and `pro/` keys.
4. Set the secrets and variables in the Cloudflare environment.
5. Deploy the Worker to the `/api/*` route.
6. Create a Lemon Squeezy `order_created` and refund webhook pointing to `/api/webhooks/lemonsqueezy`.
7. Test a paid order, a duplicate webhook, a wrong email, an expired link, and a refund before public launch.

The current static checkout links remain the source of truth for payment pages. The Worker only marks an order paid after a signed provider webhook and issues a one-use download response from the private R2 bucket.
