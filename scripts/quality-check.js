const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const indexHtml = read('index.html');
const appJs = read('app.js');
const readme = read('README.md');
const manifest = read('manifest.json');
const sitemap = read('sitemap.xml');
const englishLandingPages = [
  'en/index.html',
  'en/24v-voltage-drop-calculator/index.html',
  'en/dc-wire-size-calculator/index.html',
  'en/smps-capacity-calculator/index.html',
  'en/motor-breaker-sizing-calculator/index.html',
  'en/bolt-tightening-torque-calculator/index.html',
  'en/bearing-fatigue-life-calculator/index.html',
  'en/hydraulic-accumulator-calculator/index.html',
  'en/4-20ma-loop-calculator/index.html',
  'en/plc-analog-scaling-calculator/index.html',
  'en/rs485-termination-calculator/index.html',
  'en/control-panel-cooling-calculator/index.html',
  'en/pneumatic-air-consumption-calculator/index.html',
  'en/pump-head-calculator/index.html',
  'en/control-valve-cv-calculator/index.html',
  'en/battery-thermal-calculator/index.html',
  'en/hvac-duct-pressure-loss-calculator/index.html',
  'en/servo-regen-resistor-calculator/index.html',
  'en/safety-light-curtain-distance-calculator/index.html',
  'en/short-circuit-current-calculator/index.html',
  'en/cable-bending-radius-calculator/index.html',
];

const publicText = [indexHtml, appJs, readme, manifest, sitemap, ...englishLandingPages.map(read)].join('\n');

const forbiddenPatterns = [
  /aggregateRating/,
  /reviewCount/,
  /ratingValue/,
  /대한민국 No\.1/,
  /48대/,
  /전체 21종/,
  /26대 공학/,
  /26종/,
  /30대 전장/,
  /38종/,
  /38 Tools/,
  /38款/,
  /누적 \d+건 실측/,
  /평균 오차 [\d.]+%/,
  /1시간 이내 최저가/,
  /1시간 내 .*최저가/,
  /커뮤니티 벤치마크/,
  /1차 대리점 네트워크 실시간 매칭/,
  /구로\/안양 유통단지 1차 대리점 직결/,
];

const failures = [];

for (const pattern of forbiddenPatterns) {
  if (pattern.test(publicText)) {
    failures.push(`Forbidden public claim or stale count remains: ${pattern}`);
  }
}

const allTabButtons = [...indexHtml.matchAll(/<button[^>]*class="[^"]*tab-btn[^"]*"[^>]*data-tab="([^"]+)"/g)]
  .map((match) => match[1]);

const tabButtons = allTabButtons.filter((id) => id !== 'tab-articles');

const allTabPanels = [...indexHtml.matchAll(/<section[^>]*id="([^"]+)"[^>]*class="[^"]*tab-panel[^"]*"/g)]
  .map((match) => match[1]);

const tabPanels = allTabPanels.filter((id) => id !== 'tab-articles');
const englishHub = read('en/index.html');
const englishHubCalcLinks = [...englishHub.matchAll(/[?&]calc=([^&"]+)/g)].map((match) => match[1]);

if (new Set(allTabButtons).size !== 78) {
  failures.push(`Expected 78 public navigation tabs including technical notes, found ${new Set(allTabButtons).size}.`);
}

if (new Set(tabButtons).size !== 77) {
  failures.push(`Expected 77 calculator tab buttons plus one technical-notes tab, found ${new Set(tabButtons).size} calculator buttons.`);
}

if (new Set(tabPanels).size !== 77) {
  failures.push(`Expected 77 calculator panels plus one technical-notes panel, found ${new Set(tabPanels).size} calculator panels.`);
}

for (const id of new Set(tabButtons)) {
  if (!tabPanels.includes(id)) {
    failures.push(`Tab button has no matching panel: ${id}`);
  }
}

for (const id of new Set(tabPanels)) {
  if (!tabButtons.includes(id)) {
    failures.push(`Tab panel has no matching button: ${id}`);
  }
}

for (const calcId of new Set(englishHubCalcLinks)) {
  if (!tabButtons.includes(calcId)) {
    failures.push(`English hub links to a missing calculator tab: ${calcId}`);
  }
}

if (!indexHtml.includes('engineering-disclaimer-strip')) {
  failures.push('Engineering disclaimer strip is missing from the public page.');
}

const workflowRequiredSnippets = [
  'workflow-action-panel',
  'quickSaveWorkflowProject',
  'capturePanelFields',
  'capturePanelResult',
  'VoltCheck24 통합 기술검토서',
  'print-field-block',
  'return-workspace-dashboard',
  'renderReturnWorkspaceDashboard',
  'getWorkflowRecommendationFromProject',
  'returnProjectCount',
  'returnReportCount',
  'userGuideModal',
  'renderUserGuide',
  'GUIDE_CATEGORY_META',
  'closeUserGuideAndStart',
];

for (const snippet of workflowRequiredSnippets) {
  if (!publicText.includes(snippet)) {
    failures.push(`Workflow retention/report feature snippet is missing: ${snippet}`);
  }
}

for (const page of englishLandingPages) {
  const html = read(page);
  const publicUrl = `https://voltcheck24.com/${page.replace(/index\.html$/, '')}`;
  if (!html.includes('<html lang="en">')) {
    failures.push(`${page} is missing lang="en".`);
  }
  if (!html.includes(`rel="canonical" href="${publicUrl}"`)) {
    failures.push(`${page} is missing the expected canonical URL: ${publicUrl}`);
  }
  if (!html.includes('application/ld+json')) {
    failures.push(`${page} is missing JSON-LD structured data.`);
  }
  if (!sitemap.includes(`<loc>${publicUrl}</loc>`)) {
    failures.push(`${page} is missing from sitemap.xml.`);
  }
}

JSON.parse(manifest);

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Quality check passed: 78 public tabs, 77 calculator panels, no stale count/claim metadata, valid manifest.');
