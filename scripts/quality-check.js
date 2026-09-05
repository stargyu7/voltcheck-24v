const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const indexHtml = read('index.html');
const appJs = read('app.js');
const readme = read('README.md');
const manifest = read('manifest.json');

const publicText = [indexHtml, appJs, readme, manifest].join('\n');

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

if (!indexHtml.includes('engineering-disclaimer-strip')) {
  failures.push('Engineering disclaimer strip is missing from the public page.');
}

JSON.parse(manifest);

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Quality check passed: 78 public tabs, 77 calculator panels, no stale count/claim metadata, valid manifest.');
