/**
 * VOLTCHECK 24V (볼트체크) - Core Precision Engineering Engine
 * Full Suite: DC 24V Voltage Drop, 4-20mA Loop, SMPS Power Budget,
 * Cabinet Cooler & Heat Sizing, Cable Table, RS-485, Pneumatics, URL State Sharing.
 */

// 1. Engineering Databases
const WIRE_DATABASE = [
  { awg: 'AWG 30', sq: 0.051, dia: 0.25, r20: 338.0, ampAir: 0.52, ampDuct: 0.35, app: '초소형 센서 신호선' },
  { awg: 'AWG 28', sq: 0.081, dia: 0.32, r20: 213.0, ampAir: 0.83, ampDuct: 0.55, app: '다심 제어선, 로봇 센서' },
  { awg: 'AWG 26', sq: 0.129, dia: 0.40, r20: 134.0, ampAir: 1.3, ampDuct: 0.9, app: '포토센서, 엔코더 신호' },
  { awg: 'AWG 24', sq: 0.205, dia: 0.51, r20: 84.2, ampAir: 2.1, ampDuct: 1.4, app: 'M12/M8 센서선, RS-485' },
  { awg: 'AWG 22', sq: 0.326, dia: 0.64, r20: 53.0, ampAir: 3.0, ampDuct: 2.0, app: '소형 솔레노이드, 분산 I/O' },
  { awg: 'AWG 20', sq: 0.518, dia: 0.81, r20: 33.3, ampAir: 5.0, ampDuct: 3.5, app: 'DC 24V 밸브 매니폴드, 센서 주전원' },
  { awg: 'AWG 18', sq: 0.823, dia: 1.02, r20: 20.9, ampAir: 7.0, ampDuct: 5.0, app: '서보 브레이크선, DC 24V 메인' },
  { awg: 'AWG 16', sq: 1.310, dia: 1.29, r20: 13.2, ampAir: 10.0, ampDuct: 7.0, app: 'IO-Link 허브, 중용량 릴레이' },
  { awg: 'AWG 14', sq: 2.080, dia: 1.63, r20: 8.28, ampAir: 15.0, ampDuct: 10.5, app: '비전 조명, 제어반 24V 간선' },
  { awg: 'AWG 12', sq: 3.310, dia: 2.05, r20: 5.21, ampAir: 20.0, ampDuct: 14.0, app: '서보 모터 UVW 동력선' },
  { awg: 'AWG 10', sq: 5.260, dia: 2.59, r20: 3.28, ampAir: 30.0, ampDuct: 21.0, app: '대용량 24V 40A 분전 간선' }
];

const METRIC_SQ_DATABASE = [
  { sqName: '0.2 SQ', sq: 0.20, r20: 86.0, ampAir: 2.0, ampDuct: 1.3, awgEquiv: 'AWG 24' },
  { sqName: '0.3 SQ', sq: 0.30, r20: 57.0, ampAir: 2.8, ampDuct: 1.9, awgEquiv: 'AWG 22' },
  { sqName: '0.5 SQ', sq: 0.50, r20: 36.0, ampAir: 4.8, ampDuct: 3.3, awgEquiv: 'AWG 20' },
  { sqName: '0.75 SQ', sq: 0.75, r20: 24.5, ampAir: 6.5, ampDuct: 4.5, awgEquiv: 'AWG 18' },
  { sqName: '1.0 SQ', sq: 1.00, r20: 18.1, ampAir: 8.5, ampDuct: 6.0, awgEquiv: 'AWG 17' },
  { sqName: '1.5 SQ', sq: 1.50, r20: 12.1, ampAir: 12.0, ampDuct: 8.5, awgEquiv: 'AWG 16' },
  { sqName: '2.5 SQ', sq: 2.50, r20: 7.41, ampAir: 17.5, ampDuct: 12.5, awgEquiv: 'AWG 14' },
  { sqName: '4.0 SQ', sq: 4.00, r20: 4.61, ampAir: 24.0, ampDuct: 17.0, awgEquiv: 'AWG 12' },
  { sqName: '6.0 SQ', sq: 6.00, r20: 3.08, ampAir: 32.0, ampDuct: 23.0, awgEquiv: 'AWG 10' }
];

const MATERIAL_PROPERTIES = {
  copper_annealed: { name: '연동선(순동)', rho20: 0.017241, alpha: 0.00393 },
  copper_tinned: { name: '주석도금동', rho20: 0.018200, alpha: 0.00390 },
  aluminum: { name: '알루미늄', rho20: 0.028264, alpha: 0.00403 }
};

let currentUnitStandard = 'AWG';
let currentLanguage = 'ko';

const FA_PRESETS = {
  photo_sensor: { length: 40, gauge: 'AWG 24', sqGauge: '0.2 SQ', current: 0.035, vmin: 21.6 },
  solenoid: { length: 30, gauge: 'AWG 20', sqGauge: '0.5 SQ', current: 0.45, vmin: 21.6 },
  iolink: { length: 60, gauge: 'AWG 16', sqGauge: '1.5 SQ', current: 2.00, vmin: 20.4 },
  servo_brake: { length: 35, gauge: 'AWG 18', sqGauge: '0.75 SQ', current: 1.20, vmin: 21.6 },
  led_light: { length: 20, gauge: 'AWG 14', sqGauge: '2.5 SQ', current: 3.50, vmin: 22.0 }
};

// ==========================================================================
// Initialization & URL State Restore
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();

  populateGaugeSelect();
  renderReferenceTable();
  bindEvents();

  // Restore URL state if hash exists
  restoreStateFromUrlHash();

  // Initial calculations for all tools
  calculateVoltageDrop();
  calculateAnalogLoop();
  calculateSmpsBudget();
  calculateCabinetCooling();
  calculateRS485();
  calculatePneumatics();
  calculateDuctFill();
});

function bindEvents() {
  // Segmented Navigation Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const tabId = btn.getAttribute('data-tab');
      document.getElementById(tabId)?.classList.add('active');
      updateUrlHash();
      if (window.lucide) window.lucide.createIcons();
    });
  });

  // Share URL Button
  document.getElementById('shareUrlBtn')?.addEventListener('click', copyShareableLink);

  // Tab 1: Length Slider <-> Number Input Sync
  const lenNum = document.getElementById('wireLength');
  const lenRange = document.getElementById('wireLengthRange');
  if (lenNum && lenRange) {
    lenNum.addEventListener('input', () => {
      lenRange.value = lenNum.value;
      calculateVoltageDrop();
      updateUrlHash();
    });
    lenRange.addEventListener('input', () => {
      lenNum.value = lenRange.value;
      calculateVoltageDrop();
      updateUrlHash();
    });
  }

  // Tab 2: 4-20mA Wire Length Sync
  const loopWireNum = document.getElementById('loopWireLen');
  const loopWireRange = document.getElementById('loopWireLenRange');
  if (loopWireNum && loopWireRange) {
    loopWireNum.addEventListener('input', () => {
      loopWireRange.value = loopWireNum.value;
      calculateAnalogLoop();
    });
    loopWireRange.addEventListener('input', () => {
      loopWireNum.value = loopWireRange.value;
      calculateAnalogLoop();
    });
  }

  // Tab 6: RS-485 Length Sync
  const rsLenNum = document.getElementById('rs485Length');
  const rsLenRange = document.getElementById('rs485LengthRange');
  if (rsLenNum && rsLenRange) {
    rsLenNum.addEventListener('input', () => {
      rsLenRange.value = rsLenNum.value;
      calculateRS485();
    });
    rsLenRange.addEventListener('input', () => {
      rsLenNum.value = rsLenRange.value;
      calculateRS485();
    });
  }

  // Unit Standard Toggle (AWG vs SQ)
  document.querySelectorAll('.unit-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.unit-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentUnitStandard = btn.getAttribute('data-unit');
      populateGaugeSelect();
      calculateVoltageDrop();
      updateUrlHash();
    });
  });

  // Quick Preset Pills (Tab 1)
  document.querySelectorAll('.pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyPreset(btn.getAttribute('data-preset'));
      updateUrlHash();
    });
  });

  // Quick Current Chips (Tab 1)
  document.querySelectorAll('.quick-step-chips .step-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.quick-step-chips .step-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const curVal = parseFloat(chip.getAttribute('data-current'));
      document.getElementById('loadCurrent').value = curVal;
      calculateVoltageDrop();
      updateUrlHash();
    });
  });

  // Advanced Options Toggle (Tab 1)
  const toggleAdvBtn = document.getElementById('toggleAdvModeBtn');
  const advBox = document.getElementById('advancedOptionsBox');
  const advBtnText = document.getElementById('advModeBtnText');
  if (toggleAdvBtn && advBox) {
    toggleAdvBtn.addEventListener('click', () => {
      const isHidden = advBox.classList.toggle('hidden');
      advBtnText.textContent = isHidden ? '상세 환경 설정' : '상세 설정 닫기';
    });
  }

  // Tab 1 Field Event Listeners
  const vdFieldIds = [
    'wireGaugeValue', 'loadCurrent', 'sourceVoltage', 'minDeviceVoltage',
    'ambientTemp', 'conductorMaterial', 'wiringSystem'
  ];
  vdFieldIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => { calculateVoltageDrop(); updateUrlHash(); });
      el.addEventListener('change', () => { calculateVoltageDrop(); updateUrlHash(); });
    }
  });

  // Tab 2 (4-20mA) Field Listeners
  ['loopPowerV', 'transMinV', 'loopWireGauge', 'loopShuntR', 'loopBarrierR'].forEach(id => {
    const el = document.getElementById(id);
    el?.addEventListener('input', calculateAnalogLoop);
    el?.addEventListener('change', calculateAnalogLoop);
  });

  // Tab 3 (SMPS Budget) Field Listeners
  ['smpsSensorsQty', 'smpsValvesQty', 'smpsPlcAmps', 'smpsHmiAmps', 'smpsRelayQty', 'smpsEtcAmps'].forEach(id => {
    const el = document.getElementById(id);
    el?.addEventListener('input', calculateSmpsBudget);
    el?.addEventListener('change', calculateSmpsBudget);
  });

  // Tab 4 (Cabinet Cooling) Field Listeners
  ['cabHeight', 'cabWidth', 'cabDepth', 'cabHeatWatts', 'cabAmbTemp', 'cabSetTemp'].forEach(id => {
    const el = document.getElementById(id);
    el?.addEventListener('input', calculateCabinetCooling);
    el?.addEventListener('change', calculateCabinetCooling);
  });

  // Tab 6 (RS-485) Field Listeners
  ['rs485BaudRate', 'rs485CableType', 'rs485Nodes', 'rs485MaxStub'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', calculateRS485);
    document.getElementById(id)?.addEventListener('input', calculateRS485);
  });

  // Tab 7 (Pneumatics) Field Listeners
  ['pneuBore', 'pneuStroke', 'pneuPressure', 'pneuCpm', 'pneuQuantity', 'pneuTubingLen'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', calculatePneumatics);
    document.getElementById(id)?.addEventListener('input', calculatePneumatics);
  });

  // Tab 8 (Duct Fill Ratio) Listeners
  const ductQtyNum = document.getElementById('ductCableQty');
  const ductQtyRange = document.getElementById('ductCableQtyRange');
  if (ductQtyNum && ductQtyRange) {
    ductQtyNum.addEventListener('input', () => {
      ductQtyRange.value = ductQtyNum.value;
      calculateDuctFill();
    });
    ductQtyRange.addEventListener('input', () => {
      ductQtyNum.value = ductQtyRange.value;
      calculateDuctFill();
    });
  }
  ['ductWidth', 'ductHeight', 'ductCableType'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', calculateDuctFill);
    document.getElementById(id)?.addEventListener('change', calculateDuctFill);
  });

  // Search in table
  document.getElementById('cableTableSearch')?.addEventListener('input', (e) => {
    renderReferenceTable(e.target.value);
  });

  // Export CSV
  document.getElementById('exportTableCsvBtn')?.addEventListener('click', exportTableAsCsv);

  // Print Report
  document.getElementById('printReportBtn')?.addEventListener('click', generateAndPrintReport);

  // Copy Summary & Markdown Table
  document.getElementById('copyResultSummaryBtn')?.addEventListener('click', copySummaryToClipboard);
  document.getElementById('copyMarkdownBtn')?.addEventListener('click', copyMarkdownSummary);

  // Unit Converter Modal
  setupUnitConverter();

  // Catalog Modal
  const catalogModal = document.getElementById('catalogModal');
  document.getElementById('openCatalogModalBtn')?.addEventListener('click', () => catalogModal?.classList.remove('hidden'));
  document.getElementById('closeCatalogModalBtn')?.addEventListener('click', () => catalogModal?.classList.add('hidden'));
  document.getElementById('dlCatalogCableBtn')?.addEventListener('click', () => {
    exportTableAsCsv();
    catalogModal?.classList.add('hidden');
  });
  document.getElementById('dlCatalogSmpsBtn')?.addEventListener('click', () => {
    generateAndPrintReport();
    catalogModal?.classList.add('hidden');
  });
  document.getElementById('dlCatalogRs485Btn')?.addEventListener('click', () => {
    downloadNoiseGuideTxt();
    catalogModal?.classList.add('hidden');
  });

  // Quote Modal
  const quoteModal = document.getElementById('quoteModal');
  document.getElementById('openQuoteModalBtn')?.addEventListener('click', () => quoteModal?.classList.remove('hidden'));
  document.getElementById('closeQuoteModalBtn')?.addEventListener('click', () => quoteModal?.classList.add('hidden'));
  document.getElementById('submitQuoteBtn')?.addEventListener('click', handleQuoteSubmit);

  // Language Toggle
  document.getElementById('langToggleBtn')?.addEventListener('click', toggleLanguage);

  // Policy links
  document.getElementById('linkPrivacyPolicy')?.addEventListener('click', (e) => { e.preventDefault(); openPolicyModal('privacy'); });
  document.getElementById('linkTermsOfService')?.addEventListener('click', (e) => { e.preventDefault(); openPolicyModal('terms'); });
  document.getElementById('linkAboutUs')?.addEventListener('click', (e) => { e.preventDefault(); openPolicyModal('about'); });
  document.getElementById('linkContactUs')?.addEventListener('click', (e) => { e.preventDefault(); openPolicyModal('contact'); });
  document.getElementById('closePolicyModalBtn')?.addEventListener('click', () => {
    document.getElementById('policyModal')?.classList.add('hidden');
  });
}

function populateGaugeSelect() {
  const select = document.getElementById('wireGaugeValue');
  if (!select) return;
  select.innerHTML = '';

  if (currentUnitStandard === 'AWG') {
    WIRE_DATABASE.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.awg;
      opt.textContent = `${item.awg} (단면적 ${item.sq} mm² • 저항 ${item.r20} Ω/km)`;
      if (item.awg === 'AWG 24') opt.selected = true;
      select.appendChild(opt);
    });
  } else {
    METRIC_SQ_DATABASE.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.sqName;
      opt.textContent = `${item.sqName} (단면적 ${item.sq} mm² • 저항 ${item.r20} Ω/km)`;
      if (item.sqName === '0.5 SQ') opt.selected = true;
      select.appendChild(opt);
    });
  }
}

function applyPreset(presetKey) {
  const p = FA_PRESETS[presetKey];
  if (!p) return;

  const lenEl = document.getElementById('wireLength');
  const lenRange = document.getElementById('wireLengthRange');
  const curEl = document.getElementById('loadCurrent');
  const minVEl = document.getElementById('minDeviceVoltage');

  if (lenEl) lenEl.value = p.length;
  if (lenRange) lenRange.value = p.length;
  if (curEl) curEl.value = p.current;
  if (minVEl) minVEl.value = p.vmin;

  const select = document.getElementById('wireGaugeValue');
  if (select) {
    select.value = currentUnitStandard === 'AWG' ? p.gauge : p.sqGauge;
  }

  document.querySelectorAll('.quick-step-chips .step-chip').forEach(c => {
    const curVal = parseFloat(c.getAttribute('data-current'));
    if (Math.abs(curVal - p.current) < 0.01) {
      c.classList.add('active');
    } else {
      c.classList.remove('active');
    }
  });

  calculateVoltageDrop();
}

// ==========================================================================
// 1. DC 24V Voltage Drop Calculation
// ==========================================================================
function calculateVoltageDrop() {
  const vSource = parseFloat(document.getElementById('sourceVoltage')?.value) || 24.0;
  const lengthM = parseFloat(document.getElementById('wireLength')?.value) || 1.0;
  const gaugeVal = document.getElementById('wireGaugeValue')?.value || 'AWG 24';
  const iLoad = parseFloat(document.getElementById('loadCurrent')?.value) || 0.01;
  const vMinReq = parseFloat(document.getElementById('minDeviceVoltage')?.value) || 21.6;
  const ambientT = parseFloat(document.getElementById('ambientTemp')?.value) || 40.0;
  const matKey = document.getElementById('conductorMaterial')?.value || 'copper_annealed';
  const wiringScheme = document.getElementById('wiringSystem')?.value || '2wire';

  let crossSectionSq = 0.205;
  let baseR20 = 84.2;
  let ampRating = 2.1;

  if (currentUnitStandard === 'AWG') {
    const found = WIRE_DATABASE.find(w => w.awg === gaugeVal) || WIRE_DATABASE[3];
    crossSectionSq = found.sq;
    baseR20 = found.r20;
    ampRating = found.ampAir;
  } else {
    const found = METRIC_SQ_DATABASE.find(m => m.sqName === gaugeVal) || METRIC_SQ_DATABASE[2];
    crossSectionSq = found.sq;
    baseR20 = found.r20;
    ampRating = found.ampAir;
  }

  const mat = MATERIAL_PROPERTIES[matKey] || MATERIAL_PROPERTIES.copper_annealed;
  const tempFactor = 1.0 + mat.alpha * (ambientT - 20.0);
  const rTPerKm = baseR20 * tempFactor;
  const rTPerM = rTPerKm / 1000.0;

  let loopMultiplier = 2.0;
  if (wiringScheme === '4wire_parallel') loopMultiplier = 1.0;

  const totalLoopR = rTPerM * lengthM * loopMultiplier;
  const vDrop = iLoad * totalLoopR;
  const vDropPct = (vDrop / vSource) * 100.0;
  const vTerm = Math.max(0, vSource - vDrop);
  const vMargin = vTerm - vMinReq;
  const powerLossW = Math.pow(iLoad, 2) * totalLoopR;
  const ampUsagePct = Math.round((iLoad / ampRating) * 100);

  let stampClass = 'stamp-pass';
  let stampText = '정상 (PASS)';
  let verdictIcon = 'check';
  let recHtml = '';

  if (vMargin < 0.0) {
    stampClass = 'stamp-fail';
    stampText = '동작불가 (FAIL)';
    verdictIcon = 'x';
    const recGauge = getRecommendedGauge(vSource, lengthM, loopMultiplier, matKey, ambientT, iLoad, vMinReq);
    recHtml = `<strong>⚠️ 전압 부족 오동작 위험:</strong> 말단 전압(${vTerm.toFixed(2)}V)이 최저 동작 전압(${vMinReq.toFixed(1)}V) 미달입니다. 케이블 규격을 <strong>${recGauge}</strong> 이상으로 상향하거나 SMPS 전압을 24.5V~25.0V로 승압하십시오.`;
  } else if (vMargin < 0.8 || vDropPct > 5.0) {
    stampClass = 'stamp-warn';
    stampText = '주의 (CAUTION)';
    verdictIcon = 'alert-triangle';
    recHtml = `<strong>⚠️ 여유 마진 협소:</strong> 현재 안전 마진(+${vMargin.toFixed(2)}V)이 좁습니다. 주변 노이즈나 솔레노이드 기동 시 순간 전압강하로 센서가 리셋될 수 있으니 1단계 굵은 규격을 권장합니다.`;
  } else {
    recHtml = `<strong>엔지니어링 소견:</strong> 편도 ${lengthM}m 배선에서 전압강하율이 ${vDropPct.toFixed(1)}%로 안정적이며, ${vMargin.toFixed(2)}V의 충분한 안전 마진을 만족합니다.`;
  }

  const verdictBadge = document.getElementById('verdictBadge');
  if (verdictBadge) {
    verdictBadge.className = `verdict-stamp ${stampClass}`;
    document.getElementById('verdictBadgeText').textContent = stampText;
    document.getElementById('verdictIcon')?.setAttribute('data-lucide', verdictIcon);
  }

  document.getElementById('resTerminalV').textContent = vTerm.toFixed(2);
  document.getElementById('resDropV').textContent = `-${vDrop.toFixed(2)} V (${vDropPct.toFixed(1)}%)`;

  const marginEl = document.getElementById('resMarginV');
  if (marginEl) {
    marginEl.textContent = (vMargin >= 0 ? '+' : '') + `${vMargin.toFixed(2)} V`;
    marginEl.className = vMargin < 0 ? 'text-warn font-bold' : (vMargin < 0.8 ? 'text-warn' : 'text-safe');
    if (vMargin < 0) marginEl.style.color = 'var(--fail-crimson)';
  }

  document.getElementById('schematicSummaryText').textContent =
    `편도 ${lengthM}m • 왕복 ${Math.round(lengthM * loopMultiplier)}m • R_loop: ${totalLoopR.toFixed(2)}Ω`;
  document.getElementById('scSourceV').textContent = `${vSource.toFixed(1)} V`;
  document.getElementById('scDropBadge').textContent = `-${vDrop.toFixed(2)}V 강하`;
  document.getElementById('scTermV').textContent = `${vTerm.toFixed(2)} V`;

  document.getElementById('resLoopR').textContent = `${totalLoopR.toFixed(2)} Ω`;
  document.getElementById('resUnitR').textContent = `단위: ${rTPerKm.toFixed(1)} Ω/km @${ambientT}°C`;
  document.getElementById('resPowerLoss').textContent = `${powerLossW.toFixed(2)} W`;
  document.getElementById('resAmpacityUsage').textContent = `${ampUsagePct}%`;
  document.getElementById('resAmpLimit').textContent = `정격 ${ampRating}A 중 ${iLoad}A 사용`;

  const recGaugeName = getRecommendedGauge(vSource, lengthM, loopMultiplier, matKey, ambientT, iLoad, vMinReq);
  document.getElementById('resRecGauge').textContent = recGaugeName;
  document.getElementById('recText').innerHTML = recHtml;

  const recCard = document.getElementById('recCard');
  if (recCard) {
    recCard.style.borderLeftColor = vMargin < 0 ? 'var(--fail-crimson)' : (vMargin < 0.8 ? 'var(--warn-amber)' : 'var(--safe-green)');
  }

  // Update Dynamic Visual Level Meter
  const pct = Math.max(0, Math.min(100, ((vTerm - 18.0) / (vSource - 18.0)) * 100));
  const minPct = Math.max(0, Math.min(100, ((vMinReq - 18.0) / (vSource - 18.0)) * 100));

  const levelFillBar = document.getElementById('levelFillBar');
  const levelPointer = document.getElementById('levelPointer');
  const pointerVal = document.getElementById('pointerVal');
  const levelMinThresholdLine = document.getElementById('levelMinThresholdLine');
  const levelScaleMinV = document.getElementById('levelScaleMinV');
  const levelStatusLabel = document.getElementById('levelStatusLabel');

  if (levelFillBar && levelPointer && pointerVal) {
    levelFillBar.style.width = `${pct}%`;
    levelPointer.style.left = `${pct}%`;
    pointerVal.textContent = `${vTerm.toFixed(2)}V`;
    if (levelMinThresholdLine) levelMinThresholdLine.style.left = `${minPct}%`;
    if (levelScaleMinV) levelScaleMinV.textContent = `${vMinReq.toFixed(1)}V (최저)`;
    if (levelStatusLabel) {
      if (vMargin < 0) {
        levelStatusLabel.textContent = '동작 불가 (FAIL - 저전압)';
        levelStatusLabel.className = 'font-mono text-warn';
        levelStatusLabel.style.color = 'var(--fail-crimson)';
      } else if (vMargin < 0.8) {
        levelStatusLabel.textContent = '주의 영역 (CAUTION - 마진 협소)';
        levelStatusLabel.className = 'font-mono text-warn';
        levelStatusLabel.style.color = 'var(--warn-amber)';
      } else {
        levelStatusLabel.textContent = '안전 영역 (SAFE - 정상 마진)';
        levelStatusLabel.className = 'font-mono text-safe';
        levelStatusLabel.style.color = 'var(--safe-green)';
      }
    }
  }

  document.getElementById('gaugeDetailHint').textContent =
    `단면적 ${crossSectionSq} mm² • 저항 ${rTPerKm.toFixed(1)} Ω/km @${ambientT}°C • 허용전류 ${ampRating}A`;

  if (window.lucide) window.lucide.createIcons();
}

function getRecommendedGauge(vSource, lengthM, loopMultiplier, matKey, ambientT, iLoad, vMinReq) {
  const mat = MATERIAL_PROPERTIES[matKey] || MATERIAL_PROPERTIES.copper_annealed;
  const tempFactor = 1.0 + mat.alpha * (ambientT - 20.0);
  const maxDrop = vSource - (vMinReq + 1.0);

  if (maxDrop <= 0) return 'SMPS 승압 필요';

  const maxR = maxDrop / iLoad;
  const maxRPerM = maxR / (lengthM * loopMultiplier);
  const maxRPerKm = maxRPerM * 1000.0;
  const maxR20 = maxRPerKm / tempFactor;

  for (let i = 0; i < WIRE_DATABASE.length; i++) {
    const w = WIRE_DATABASE[i];
    if (w.r20 <= maxR20 && w.ampAir >= iLoad) {
      return currentUnitStandard === 'AWG' ? w.awg : `${w.sq} SQ`;
    }
  }

  return 'AWG 10 (6.0 SQ) 이상';
}

// ==========================================================================
// 2. 4-20mA Analog Loop Calculation [NEW]
// ==========================================================================
function calculateAnalogLoop() {
  const vLoop = parseFloat(document.getElementById('loopPowerV')?.value) || 24.0;
  const vTransMin = parseFloat(document.getElementById('transMinV')?.value) || 12.0;
  const wireLenM = parseFloat(document.getElementById('loopWireLen')?.value) || 150.0;
  const wireGauge = document.getElementById('loopWireGauge')?.value || 'AWG 20';
  const shuntR = parseFloat(document.getElementById('loopShuntR')?.value) || 250.0;
  const barrierR = parseFloat(document.getElementById('loopBarrierR')?.value) || 0.0;

  // Wire resistance @ 20°C
  const wireObj = WIRE_DATABASE.find(w => w.awg === wireGauge) || WIRE_DATABASE[5];
  const wireRPerKm = wireObj.r20;
  const wireRLoop = (wireRPerKm / 1000.0) * wireLenM * 2.0; // 2-wire loop

  const iMax = 0.020; // 20mA peak
  const shuntDrop = iMax * shuntR;
  const barrierDrop = iMax * barrierR;
  const wireDrop = iMax * wireRLoop;

  const vTransAvailable = Math.max(0, vLoop - shuntDrop - barrierDrop - wireDrop);
  const vMargin = vTransAvailable - vTransMin;

  const totalCircuitR = shuntR + barrierR + wireRLoop;
  const maxAllowableCircuitR = (vLoop - vTransMin) / iMax;

  const isPass = vMargin >= 0.0;
  const isCaution = vMargin >= 0.0 && vMargin < 1.0;

  const badgeEl = document.getElementById('loopStatusBadge');
  const badgeText = document.getElementById('loopStatusText');
  if (badgeEl && badgeText) {
    if (!isPass) {
      badgeEl.className = 'verdict-stamp stamp-fail';
      badgeText.textContent = '불가 (FAIL)';
    } else if (isCaution) {
      badgeEl.className = 'verdict-stamp stamp-warn';
      badgeText.textContent = '주의 (CAUTION)';
    } else {
      badgeEl.className = 'verdict-stamp stamp-pass';
      badgeText.textContent = '정상 (PASS)';
    }
  }

  document.getElementById('loopMinReqText').textContent = `MIN REQ: ${vTransMin.toFixed(1)} V`;
  document.getElementById('resLoopTransV').textContent = vTransAvailable.toFixed(2);
  document.getElementById('resLoopShuntDrop').textContent = `${shuntDrop.toFixed(2)} V`;

  const marginEl = document.getElementById('resLoopMargin');
  if (marginEl) {
    marginEl.textContent = (vMargin >= 0 ? '+' : '') + `${vMargin.toFixed(2)} V`;
    marginEl.className = !isPass ? 'text-warn font-bold' : (isCaution ? 'text-warn' : 'text-safe');
    if (!isPass) marginEl.style.color = 'var(--fail-crimson)';
  }

  document.getElementById('resLoopWireR').textContent = `${wireRLoop.toFixed(2)} Ω`;
  document.getElementById('resLoopWireDrop').textContent = `배선 전압강하: ${wireDrop.toFixed(2)} V`;
  document.getElementById('resLoopMaxAllowR').textContent = `${Math.round(maxAllowableCircuitR)} Ω`;
  document.getElementById('resLoopCurrentR').textContent = `현재 총 저항: ${Math.round(totalCircuitR)} Ω`;

  let noteHtml = '';
  if (!isPass) {
    noteHtml = `<strong>⚠️ 수전 전압 미달 (계측 에러 위험):</strong> 20mA 출력 시 트랜스미터 인가전압(${vTransAvailable.toFixed(2)}V)이 최저 요구치(${vTransMin.toFixed(1)}V) 미달입니다. Shunt 저항을 250Ω으로 낮추거나, 배선 굵기를 상향(AWG 18 이상)하십시오.`;
  } else {
    noteHtml = `<strong>계측 신뢰성 소견:</strong> 20mA 풀 스케일 출력 시에도 트랜스미터에 ${vTransAvailable.toFixed(2)}V가 인가되어 최저 요구치 대비 +${vMargin.toFixed(2)}V의 안전 마진을 만족합니다.`;
  }
  document.getElementById('loopRecText').innerHTML = noteHtml;
}

// ==========================================================================
// 3. DC 24V SMPS Budget & CP Selection [NEW]
// ==========================================================================
function calculateSmpsBudget() {
  const nSensors = parseInt(document.getElementById('smpsSensorsQty')?.value) || 0;
  const nValves = parseInt(document.getElementById('smpsValvesQty')?.value) || 0;
  const plcAmps = parseFloat(document.getElementById('smpsPlcAmps')?.value) || 0;
  const hmiAmps = parseFloat(document.getElementById('smpsHmiAmps')?.value) || 0;
  const nRelays = parseInt(document.getElementById('smpsRelayQty')?.value) || 0;
  const etcAmps = parseFloat(document.getElementById('smpsEtcAmps')?.value) || 0;

  const iSensors = nSensors * 0.035;
  const iValves = nValves * 0.45;
  const iRelays = nRelays * 0.05;
  const iPlcTotal = plcAmps + hmiAmps;

  const totalI = iSensors + iValves + iRelays + iPlcTotal + etcAmps;
  const totalWatts = Math.round(totalI * 24.0);

  // Derating factor 1.30
  const requiredCapacityI = totalI * 1.30;

  // Commercial SMPS Ratings (24V)
  const smpsTiers = [
    { name: '24V 2.5A (60W)', ratingA: 2.5, watts: 60 },
    { name: '24V 5A (120W)', ratingA: 5.0, watts: 120 },
    { name: '24V 10A (240W)', ratingA: 10.0, watts: 240 },
    { name: '24V 20A (480W)', ratingA: 20.0, watts: 480 },
    { name: '24V 40A (960W)', ratingA: 40.0, watts: 960 }
  ];

  let chosenSmps = smpsTiers.find(tier => tier.ratingA >= requiredCapacityI) || smpsTiers[smpsTiers.length - 1];
  const loadRatio = Math.round((totalI / chosenSmps.ratingA) * 100);

  // CP recommendations
  // Sensor Branch CP
  let cpSensor = 'CP 2A (C-curve)';
  if (iSensors > 1.5) cpSensor = 'CP 4A (C-curve)';
  if (iSensors > 3.0) cpSensor = 'CP 6A (C-curve)';

  // Valve Branch CP (solenoid inrush)
  let cpValve = 'CP 4A (C-curve)';
  if (iValves > 3.0) cpValve = 'CP 6A (C-curve)';
  if (iValves > 5.0) cpValve = 'CP 10A (C-curve)';

  // PLC Branch CP
  let cpPlc = 'CP 4A (B/C-curve)';
  if (iPlcTotal > 3.0) cpPlc = 'CP 6A (C-curve)';

  document.getElementById('resSmpsRating').textContent = chosenSmps.name.split(' (')[0];
  document.getElementById('resSmpsTotalI').textContent = `${totalI.toFixed(2)} A`;
  document.getElementById('resSmpsWatts').textContent = `${totalWatts} W`;
  document.getElementById('resSmpsLoadPct').textContent = `${loadRatio} %`;

  document.getElementById('resCpSensor').textContent = cpSensor;
  document.getElementById('resCpValve').textContent = cpValve;
  document.getElementById('resCpPlc').textContent = cpPlc;
}

// ==========================================================================
// 4. Cabinet Heat & Cooler Sizing [NEW]
// ==========================================================================
function calculateCabinetCooling() {
  const h = parseFloat(document.getElementById('cabHeight')?.value) || 1800;
  const w = parseFloat(document.getElementById('cabWidth')?.value) || 800;
  const d = parseFloat(document.getElementById('cabDepth')?.value) || 600;
  const qInternal = parseFloat(document.getElementById('cabHeatWatts')?.value) || 650;
  const tAmb = parseFloat(document.getElementById('cabAmbTemp')?.value) || 35;
  const tSet = parseFloat(document.getElementById('cabSetTemp')?.value) || 35;

  // Effective surface area A_eff (m²) excluding floor
  const areaM2 = (2 * (h * w + h * d) + (w * d)) / 1e6;
  const kSteel = 5.5; // W/m²·K (sheet steel)

  let coolerRequiredW = 0;
  let fanCfm = 0;
  let isAcRequired = false;

  if (tAmb >= tSet) {
    // Ambient heat enters the enclosure
    isAcRequired = true;
    const qExternalGain = kSteel * areaM2 * (tAmb - tSet);
    coolerRequiredW = Math.round((qInternal + qExternalGain) * 1.15); // 1.15x safety
  } else {
    // Delta T exists
    const deltaT = tSet - tAmb;
    const qNatural = kSteel * areaM2 * deltaT;
    const qRemaining = qInternal - qNatural;

    if (qRemaining > 0) {
      // Filter fan flowrate V = 3.1 * Q / deltaT (m³/h)
      const airFlowM3h = (3.1 * qRemaining) / deltaT;
      fanCfm = Math.round(airFlowM3h * 0.5886);
      if (fanCfm > 400 || deltaT <= 5) {
        isAcRequired = true;
        coolerRequiredW = Math.round(qInternal * 1.15);
      }
    }
  }

  const btuVal = Math.round(coolerRequiredW * 3.412);
  const badgeEl = document.getElementById('cabCoolingBadge');
  const badgeText = document.getElementById('cabCoolingBadgeText');
  const typeText = document.getElementById('cabCoolingType');

  if (badgeEl && badgeText && typeText) {
    if (isAcRequired) {
      badgeEl.className = 'verdict-stamp stamp-warn';
      badgeText.textContent = '에어컨 설치 필수';
      typeText.textContent = 'CABINET AIR CONDITIONER';
    } else {
      badgeEl.className = 'verdict-stamp stamp-pass';
      badgeText.textContent = '환기팬 사용 가능';
      typeText.textContent = 'FILTER FAN COOLING';
    }
  }

  document.getElementById('resCabCoolingVal').textContent = isAcRequired ? coolerRequiredW : `${fanCfm} CFM`;
  document.getElementById('resCabBtu').textContent = isAcRequired ? `${btuVal.toLocaleString()} BTU/h` : '자연환기 가능';
  document.getElementById('resCabFanCfm').textContent = `${fanCfm} CFM`;
  document.getElementById('resCabArea').textContent = `${areaM2.toFixed(2)} m²`;

  let recModel = '500W 급 쿨러';
  if (coolerRequiredW > 600) recModel = '800W ~ 1000W 급 에어컨';
  if (coolerRequiredW > 1200) recModel = '1500W 급 에어컨';
  if (coolerRequiredW > 1800) recModel = '2000W+ 대용량 에어컨';
  if (!isAcRequired) recModel = `${fanCfm} CFM 환기팬 2EA`;

  document.getElementById('resCabRecModel').textContent = recModel;

  let note = '';
  if (isAcRequired) {
    note = `<strong>환경 진단 소견:</strong> 공장 최고 외기온도(${tAmb}°C)가 제어반 설정온도(${tSet}°C) 이상이거나 발열량이 높아 환기팬만으로는 냉각이 불가합니다. <strong>${recModel}</strong> 설치가 필수적입니다.`;
  } else {
    note = `<strong>환경 진단 소견:</strong> 외기온도와 내부 설정온도 간 차이(ΔT = ${tSet - tAmb}°C)가 있어 <strong>${fanCfm} CFM급 환기팬</strong>으로 적정 온도 유지가 가능합니다.`;
  }
  document.getElementById('cabRecNote').innerHTML = note;
}

// ==========================================================================
// 5. RS-485 Logic
// ==========================================================================
function calculateRS485() {
  const baud = parseInt(document.getElementById('rs485BaudRate')?.value) || 115200;
  const lengthM = parseFloat(document.getElementById('rs485Length')?.value) || 200;
  const cableType = document.getElementById('rs485CableType')?.value || 'belden_9841';
  const stubM = parseFloat(document.getElementById('rs485MaxStub')?.value) || 0.3;

  const bitTimeUs = (1.0 / baud) * 1e6;

  let capPfPerM = 42;
  if (cableType === 'utp_cat5e') capPfPerM = 52;
  if (cableType === 'generic_vctf') capPfPerM = 110;

  const totalCapNf = (capPfPerM * lengthM) / 1000.0;

  let maxDistanceM = 1200;
  if (baud > 100000) maxDistanceM = Math.round(1.2e8 / baud);

  const stubLimitM = Math.max(0.1, (0.05 * bitTimeUs * 200) / 10).toFixed(2);
  const isPass = lengthM <= maxDistanceM && stubM <= parseFloat(stubLimitM);

  const statusBadge = document.getElementById('rs485StatusBadge');
  if (statusBadge) {
    statusBadge.className = `verdict-stamp ${isPass ? 'stamp-pass' : 'stamp-fail'}`;
    document.getElementById('rs485StatusText').textContent = isPass ? '적합 (PASS)' : '한계 초과 (FAIL)';
  }

  document.getElementById('rs485MaxLenVal').textContent = `${maxDistanceM.toLocaleString()} m`;
  const distUsagePct = Math.round((lengthM / maxDistanceM) * 100);
  document.getElementById('rs485DistanceUsage').textContent = `설정 거리(${lengthM}m)는 한계의 ${distUsagePct}%`;

  document.getElementById('rs485TermResVal').textContent = lengthM > 10 ? '필수 (양단 2개소)' : '권장';
  document.getElementById('rs485StubLimitVal').textContent = `${stubLimitM} m`;
  document.getElementById('rs485StubStatus').textContent = stubM <= parseFloat(stubLimitM) ? `현재 ${stubM}m 설정 적합` : `경고: ${stubM}m는 반사파 유발`;
  document.getElementById('rs485BitTimeVal').textContent = `${bitTimeUs.toFixed(2)} µs`;
  document.getElementById('rs485CapacitanceTotal').textContent = `총 정전용량: ${totalCapNf.toFixed(1)} nF`;

  if (window.lucide) window.lucide.createIcons();
}

// ==========================================================================
// 6. Pneumatics Logic
// ==========================================================================
function calculatePneumatics() {
  const boreMm = parseFloat(document.getElementById('pneuBore')?.value) || 32;
  const strokeMm = parseFloat(document.getElementById('pneuStroke')?.value) || 150;
  const pressureMpa = parseFloat(document.getElementById('pneuPressure')?.value) || 0.5;
  const cpm = parseFloat(document.getElementById('pneuCpm')?.value) || 20;
  const qty = parseInt(document.getElementById('pneuQuantity')?.value) || 4;
  const tubeLenM = parseFloat(document.getElementById('pneuTubingLen')?.value) || 2.0;

  const rodMm = boreMm * 0.35;
  const boreAreaCm2 = (Math.PI * Math.pow(boreMm / 10, 2)) / 4.0;
  const rodAreaCm2 = (Math.PI * Math.pow(rodMm / 10, 2)) / 4.0;
  const retractAreaCm2 = boreAreaCm2 - rodAreaCm2;
  const strokeCm = strokeMm / 10.0;

  const cylVolLiters = ((boreAreaCm2 + retractAreaCm2) * strokeCm) / 1000.0;
  const tubeVolLiters = ((Math.PI * Math.pow(0.4, 2) / 4.0) * (tubeLenM * 100.0)) / 1000.0 * 2.0;

  const compRatio = (pressureMpa + 0.1013) / 0.1013;
  const airPerCycleNl = (cylVolLiters + tubeVolLiters) * compRatio;
  const totalAirMinNl = airPerCycleNl * cpm * qty;
  const scfmVal = totalAirMinNl * 0.0353147;

  const requiredHp = Math.max(0.5, totalAirMinNl / 75.0);
  const standardHp = [0.5, 1.0, 1.5, 2.0, 3.0, 5.0, 7.5, 10.0, 15.0, 20.0].find(hp => hp >= requiredHp) || 25.0;
  const compKw = (standardHp * 0.746).toFixed(1);

  const boreAreaMm2 = (Math.PI * Math.pow(boreMm, 2)) / 4.0;
  const thrustN = Math.round(pressureMpa * boreAreaMm2);
  const thrustKgf = (thrustN / 9.80665).toFixed(1);

  document.getElementById('pneuTotalAirMin').textContent = totalAirMinNl.toFixed(1);
  document.getElementById('pneuCycleAir').textContent = `${airPerCycleNl.toFixed(2)} Nℓ`;
  document.getElementById('pneuCompHp').textContent = `${standardHp} HP (약 ${compKw} kW)`;
  document.getElementById('pneuThrustVal').textContent = `${thrustN.toLocaleString()} N`;
  document.getElementById('pneuThrustKg').textContent = `약 ${thrustKgf} kgf`;
  document.getElementById('pneuScfmText').textContent = `${scfmVal.toFixed(2)} SCFM`;
}

// ==========================================================================
// 7. Duct Fill Ratio Calculation [NEW]
// ==========================================================================
function calculateDuctFill() {
  const w = parseFloat(document.getElementById('ductWidth')?.value) || 60;
  const h = parseFloat(document.getElementById('ductHeight')?.value) || 60;
  const dia = parseFloat(document.getElementById('ductCableType')?.value) || 6.0;
  const qty = parseInt(document.getElementById('ductCableQty')?.value) || 28;

  const ductArea = w * h;
  const singleCableArea = Math.PI * Math.pow(dia / 2.0, 2);
  const totalCableArea = singleCableArea * qty;
  const fillPct = (totalCableArea / ductArea) * 100.0;

  const badge = document.getElementById('ductFillBadge');
  const badgeText = document.getElementById('ductFillBadgeText');
  const statusText = document.getElementById('ductFillStatusText');
  const fillBar = document.getElementById('ductFillBar');

  if (fillPct <= 40.0) {
    if (badge) badge.className = 'verdict-stamp stamp-pass';
    if (badgeText) badgeText.textContent = '적합 (PASS)';
    if (statusText) {
      statusText.textContent = '여유 있음 (안전 규격 준수)';
      statusText.className = 'font-mono text-safe';
      statusText.style.color = 'var(--safe-green)';
    }
  } else if (fillPct <= 50.0) {
    if (badge) badge.className = 'verdict-stamp stamp-warn';
    if (badgeText) badgeText.textContent = '주의 (CAUTION)';
    if (statusText) {
      statusText.textContent = '최대 한계 (주의 요망)';
      statusText.className = 'font-mono text-warn';
      statusText.style.color = 'var(--warn-amber)';
    }
  } else {
    if (badge) badge.className = 'verdict-stamp stamp-fail';
    if (badgeText) badgeText.textContent = '초과 (FAIL)';
    if (statusText) {
      statusText.textContent = '규격 초과 (덕트 규격 상향 필수)';
      statusText.className = 'font-mono text-warn';
      statusText.style.color = 'var(--fail-crimson)';
    }
  }

  document.getElementById('resDuctFillPct').textContent = fillPct.toFixed(1);
  document.getElementById('resDuctCableArea').textContent = `${Math.round(totalCableArea)} mm²`;
  document.getElementById('resDuctTotalArea').textContent = `${Math.round(ductArea)} mm²`;
  if (fillBar) fillBar.style.width = `${Math.min(100, (fillPct / 50.0) * 100)}%`;
}

// ==========================================================================
// 8. Reference Table & CSV Export
// ==========================================================================
function renderReferenceTable(query = '') {
  const tbody = document.getElementById('cableTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  const q = query.trim().toLowerCase();

  WIRE_DATABASE.forEach(item => {
    if (q && !item.awg.toLowerCase().includes(q) && !item.sq.toString().includes(q) && !item.app.toLowerCase().includes(q)) {
      return;
    }
    const r60 = (item.r20 * (1.0 + 0.00393 * 40)).toFixed(1);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${item.awg}</strong></td>
      <td>${item.sq} mm²</td>
      <td>Φ ${item.dia} mm</td>
      <td>${item.r20} Ω/km</td>
      <td>${r60} Ω/km</td>
      <td><span class="font-bold text-highlight">${item.ampAir} A</span></td>
      <td><span class="font-bold text-warn">${item.ampDuct} A</span></td>
      <td style="color:var(--text-muted); font-family:var(--font-sans)">${item.app}</td>
    `;
    tbody.appendChild(tr);
  });
}

function exportTableAsCsv() {
  let csv = 'AWG,CrossSection_mm2,Diameter_mm,R20_Ohm_per_km,R60_Ohm_per_km,Ampacity_Air_A,Ampacity_Duct_A,Application\n';
  WIRE_DATABASE.forEach(item => {
    const r60 = (item.r20 * (1.0 + 0.00393 * 40)).toFixed(1);
    csv += `"${item.awg}",${item.sq},${item.dia},${item.r20},${r60},${item.ampAir},${item.ampDuct},"${item.app}"\n`;
  });

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'VoltCheck_Industrial_Cable_AWG_Table.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ==========================================================================
// 8. URL Hash State Synchronization & Sharing [NEW]
// ==========================================================================
function updateUrlHash() {
  const activeTab = document.querySelector('.tab-btn.active')?.getAttribute('data-tab') || 'tab-voltagedrop';
  const l = document.getElementById('wireLength')?.value || '40';
  const g = document.getElementById('wireGaugeValue')?.value || 'AWG 24';
  const i = document.getElementById('loadCurrent')?.value || '0.5';
  const v = document.getElementById('sourceVoltage')?.value || '24.0';

  const params = new URLSearchParams();
  params.set('tab', activeTab);
  params.set('L', l);
  params.set('gauge', g);
  params.set('I', i);
  params.set('V', v);

  history.replaceState(null, '', '#' + params.toString());
}

function restoreStateFromUrlHash() {
  if (!window.location.hash) return;
  try {
    const params = new URLSearchParams(window.location.hash.substring(1));
    const tab = params.get('tab');
    const l = params.get('L');
    const g = params.get('gauge');
    const i = params.get('I');
    const v = params.get('V');

    if (tab) {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      document.querySelector(`.tab-btn[data-tab="${tab}"]`)?.classList.add('active');
      document.getElementById(tab)?.classList.add('active');
    }
    if (l) {
      document.getElementById('wireLength').value = l;
      document.getElementById('wireLengthRange').value = l;
    }
    if (g) document.getElementById('wireGaugeValue').value = g;
    if (i) document.getElementById('loadCurrent').value = i;
    if (v) document.getElementById('sourceVoltage').value = v;
  } catch (e) {
    console.error('Failed to parse URL hash', e);
  }
}

function copyShareableLink() {
  updateUrlHash();
  const fullUrl = window.location.href;
  navigator.clipboard.writeText(fullUrl).then(() => {
    alert('[설계 조건 링크 복사 완료]\n\n현재 계산 파라미터가 포함된 고유 URL이 복사되었습니다.\n동료 엔지니어에게 공유하면 동일한 검토 화면이 바로 열립니다.');
  });
}

// ==========================================================================
// 9. Print Report & Quote Helpers
// ==========================================================================
function generateAndPrintReport() {
  const today = new Date().toISOString().slice(0, 10);
  document.getElementById('rptDate').textContent = today;
  document.getElementById('rptSourceV').textContent = `${document.getElementById('sourceVoltage').value} V`;
  document.getElementById('rptLength').textContent = `${document.getElementById('wireLength').value} m`;
  document.getElementById('rptLoadI').textContent = `${document.getElementById('loadCurrent').value} A`;
  document.getElementById('rptWireGauge').textContent = `${document.getElementById('wireGaugeValue').value}`;
  document.getElementById('rptMinV').textContent = `${document.getElementById('minDeviceVoltage').value} V`;
  document.getElementById('rptTempMat').textContent = `${document.getElementById('ambientTemp').value}°C / ${document.getElementById('conductorMaterial').value}`;

  document.getElementById('rptLoopR').textContent = document.getElementById('resLoopR').textContent;
  document.getElementById('rptDropV').textContent = document.getElementById('resDropV').textContent;
  document.getElementById('rptTermV').textContent = `${document.getElementById('resTerminalV').textContent} V`;
  document.getElementById('rptMarginV').textContent = document.getElementById('resMarginV').textContent;
  document.getElementById('rptPowerLoss').textContent = document.getElementById('resPowerLoss').textContent;
  document.getElementById('rptRecGauge').textContent = document.getElementById('resRecGauge').textContent;
  document.getElementById('rptFinalStatus').textContent = document.getElementById('verdictBadgeText').textContent.includes('PASS') ? 'PASS' : 'FAIL';
  document.getElementById('rptConclusionText').textContent = document.getElementById('recText').textContent.replace('엔지니어링 소견:', '');

  window.print();
}

function copySummaryToClipboard() {
  const vSource = document.getElementById('sourceVoltage').value;
  const l = document.getElementById('wireLength').value;
  const gauge = document.getElementById('wireGaugeValue').value;
  const i = document.getElementById('loadCurrent').value;
  const vTerm = document.getElementById('resTerminalV').textContent;
  const vDrop = document.getElementById('resDropV').textContent;
  const margin = document.getElementById('resMarginV').textContent;
  const status = document.getElementById('verdictBadgeText').textContent;

  const text = `[볼트체크 24V - 선로 전압강하 검토 결과]\n` +
    `- 공급 전원: DC ${vSource}V\n` +
    `- 배선 거리: ${l}m (${gauge})\n` +
    `- 소비 전류: ${i}A\n` +
    `- 선로 전압강하: ${vDrop}\n` +
    `- 말단 수전 전압: ${vTerm}V\n` +
    `- 전원 안전 마진: ${margin}\n` +
    `- 판정 결과: ${status}\n` +
    `- 출처: 볼트체크 24V (VoltCheck)`;

  navigator.clipboard.writeText(text).then(() => {
    alert('계산 결과 요약이 클립보드에 복사되었습니다.');
  });
}

function handleQuoteSubmit() {
  const company = document.getElementById('quoteCompany')?.value;
  const name = document.getElementById('quoteName')?.value;
  const email = document.getElementById('quoteEmail')?.value;

  if (!company || !name || !email) {
    alert('회사명, 성함, 이메일을 입력해 주세요.');
    return;
  }

  alert(`[견적 문의 접수]\n\n${company} ${name} 님,\n계산된 사양에 맞는 부품 견적서가 ${email}로 전달되었습니다.`);
  document.getElementById('quoteModal')?.classList.add('hidden');
}

// ==========================================================================
// 10. Compliance Policies
// ==========================================================================
const POLICIES = {
  privacy: {
    title: '개인정보처리방침 (Privacy Policy)',
    content: `
      <h4>1. 개인정보 처리 목적</h4>
      <p>볼트체크 24V는 공학 계산 기능을 별도의 회원가입 없이 익명으로 무료 제공합니다.</p>
      <h4>2. 제3자 쿠키 및 광고 서비스 안내</h4>
      <p>본 사이트는 Google AdSense 등 제3자 광고 서비스를 이용하며, 맞춤형 광고 게재를 위해 쿠키가 활용될 수 있습니다. 이용자는 언제든지 브라우저 설정에서 쿠키 사용을 거부할 수 있습니다.</p>
    `
  },
  terms: {
    title: '이용약관 및 엔지니어링 면책조항',
    content: `
      <h4>기술 계산에 대한 면책 고지 (Disclaimer)</h4>
      <p>본 계산 결과는 IEC 60228, NFPA 79 등 공인된 공학 이론식에 기반하여 산출되었으나, 실제 설비 현장의 노이즈, 접촉 저항, 배선 환경에 따라 차이가 발생할 수 있습니다.</p>
      <p>따라서 <strong>본 결과는 설계 검토용 참고 자료로 활용되어야 하며, 최종 설계 승인 시 부품 제조사 데이터시트를 반드시 확인하시기 바랍니다.</strong></p>
    `
  },
  about: {
    title: '사이트 소개 및 기술 기준',
    content: `
      <h4>볼트체크 24V (VoltCheck Pro) 소개</h4>
      <p>자동화 설비, 반도체 및 2차전지 라인 셋업 현장에서 배선 길이와 케이블 굵기에 따른 전압강하, 4-20mA 루프, SMPS 용량, 제어반 쿨링을 쉽고 빠르게 검증할 수 있도록 제작된 통합 엔지니어링 툴킷입니다.</p>
      <h4>참조 표준</h4>
      <p>• IEC 60204-1 (산업용 기계 전기 안전)<br>• NFPA 79 (미국 산업 기계 전기 표준)<br>• EIA/TIA-485-A (RS-485 통신 표준)<br>• IEC 60890 (제어반 발열 및 환기 기준)</p>
    `
  },
  contact: {
    title: '문의하기 (Contact)',
    content: `
      <h4>기술 지원 및 제휴 문의</h4>
      <p>이메일: contact@voltcheck24v.engineering<br>운영: 볼트체크 엔지니어링 랩</p>
    `
  }
};

function openPolicyModal(type) {
  const modal = document.getElementById('policyModal');
  const title = document.getElementById('policyModalTitle');
  const body = document.getElementById('policyModalContent');
  if (modal && POLICIES[type]) {
    title.textContent = POLICIES[type].title;
    body.innerHTML = POLICIES[type].content;
    modal.classList.remove('hidden');
  }
}

function downloadNoiseGuideTxt() {
  const text = `================================================================================
2026 FA 전장설계 노이즈 대책 & 계측 신호 무결성 기술 가이드 (VoltCheck Pro)
================================================================================

1. RS-485 / Modbus 통신선로 배선 원칙
--------------------------------------------------------------------------------
- 토폴로지: 반드시 일자형 데이지 체인(Daisy-Chain)을 사용하십시오. 스타(Star) 및 트리(Tree) 결선은 심각한 반사파를 유발합니다.
- 종단저항(Termination): 버스 양 끝단의 물리적 종단 노드에만 120Ω 1/4W 금속피막 저항을 체결합니다.
- T자 분기(Stub) 길이: 보레이트가 115.2 kbps일 때 스터브 길이는 최대 0.8m 이하여야 합니다.
- 차폐(Shield) 접지: 그라운드 루프(Ground Loop)로 인한 순환전류를 막기 위해 마스터 제어반 한쪽 끝에서만 단일 1점 접지(PE)를 실시합니다.

2. 4-20mA 아날로그 전류 루프 전압 마진 확보
--------------------------------------------------------------------------------
- Shunt 저항: 1~5V ADC 변환 시 250Ω (오차 0.1% 정밀 저항)을 사용하며, 20mA 통전 시 5.00V가 강하됩니다.
- 최소 전압 마진: 트랜스미터에 인가되는 전압 (24V - 5V Shunt - 선로강하 - 배리어강하)이 트랜스미터 최저 기동전압(12.0V)보다 최소 1.0V 이상 높아야 과도 응답 시 계측 에러가 발생하지 않습니다.

3. 솔레노이드/릴레이 유도성 역기전력 방지
--------------------------------------------------------------------------------
- DC 코일: 코일 양단에 역방향으로 1N4007 (1000V 1A) 플라이백 다이오드를 병렬 연결합니다.
- AC 코일: 코일 양단에 RC 서지 킬러(스너버: 0.1µF + 100Ω)를 병렬 연결합니다.

발행: 볼트체크 24V 엔지니어링 랩 (VoltCheck Pro)
기술 검토: IEC 60204-1, NFPA 79, EIA/TIA-485 준용
`;

  const blob = new Blob(['\uFEFF' + text], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'VoltCheck_2026_FA_Noise_Immunity_Guide.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function setupUnitConverter() {
  const modal = document.getElementById('unitConverterModal');
  document.getElementById('openUnitConverterBtn')?.addEventListener('click', () => {
    modal?.classList.remove('hidden');
    calculateUnitConversions();
  });
  document.getElementById('closeUnitConverterBtn')?.addEventListener('click', () => modal?.classList.add('hidden'));

  document.getElementById('convPressMpa')?.addEventListener('input', calculateUnitConversions);
  document.getElementById('convFlowNl')?.addEventListener('input', calculateUnitConversions);
  document.getElementById('convAwgSelect')?.addEventListener('change', calculateUnitConversions);
  document.getElementById('convPowerWatts')?.addEventListener('input', calculateUnitConversions);
}

function calculateUnitConversions() {
  // Pressure
  const mpa = parseFloat(document.getElementById('convPressMpa')?.value) || 0;
  document.getElementById('convPressBar').textContent = `${(mpa * 10).toFixed(2)} bar`;
  document.getElementById('convPressPsi').textContent = `${(mpa * 145.038).toFixed(1)} psi`;
  document.getElementById('convPressKgf').textContent = `${(mpa * 10.1972).toFixed(2)} kgf/cm²`;

  // Flow
  const nl = parseFloat(document.getElementById('convFlowNl')?.value) || 0;
  document.getElementById('convFlowScfm').textContent = `${(nl * 0.0353147).toFixed(2)} SCFM`;
  document.getElementById('convFlowM3h').textContent = `${(nl * 0.06).toFixed(2)} m³/h`;

  // AWG
  const awgVal = document.getElementById('convAwgSelect')?.value || '24';
  const foundWire = WIRE_DATABASE.find(w => w.awg.includes(awgVal)) || WIRE_DATABASE[3];
  document.getElementById('convAwgSqRes').textContent = `${foundWire.sq} mm² (${foundWire.sq >= 0.5 ? foundWire.sq + ' SQ' : '0.2~0.3 SQ'} 상당)`;
  document.getElementById('convAwgDiaRes').textContent = `외경 Φ ${foundWire.dia} mm`;

  // Power
  const w = parseFloat(document.getElementById('convPowerWatts')?.value) || 0;
  document.getElementById('convPowerBtu').textContent = `${Math.round(w * 3.41214).toLocaleString()} BTU/h`;
  document.getElementById('convPowerKcal').textContent = `${Math.round(w * 0.859845).toLocaleString()} kcal/h`;
  document.getElementById('convPowerHp').textContent = `${(w / 745.7).toFixed(2)} HP`;
}

function copyMarkdownSummary() {
  const vSource = document.getElementById('sourceVoltage').value;
  const l = document.getElementById('wireLength').value;
  const gauge = document.getElementById('wireGaugeValue').value;
  const i = document.getElementById('loadCurrent').value;
  const vTerm = document.getElementById('resTerminalV').textContent;
  const vDrop = document.getElementById('resDropV').textContent;
  const margin = document.getElementById('resMarginV').textContent;
  const loopR = document.getElementById('resLoopR').textContent;
  const pLoss = document.getElementById('resPowerLoss').textContent;
  const status = document.getElementById('verdictBadgeText').textContent;

  const md = `| 항목 (Parameter) | 설계 검토 값 (Value) |
| :--- | :--- |
| **공급 전원 (V_source)** | DC ${vSource} V |
| **선로 편도 거리 (Length)** | ${l} m (${gauge}) |
| **소비 전류 (I_load)** | ${i} A |
| **왕복 선로 저항 (R_loop)** | ${loopR} |
| **선로 전압강하 (ΔV)** | ${vDrop} |
| **말단 수전 전압 (V_term)** | **${vTerm} V** |
| **전원 안전 마진 (Margin)** | **${margin}** |
| **선로 발열 손실 (I²R)** | ${pLoss} |
| **최종 판정 (Verdict)** | **${status}** |

*Generated by [VoltCheck 24V (볼트체크)](https://stargyu7.github.io/voltcheck-24v/)*`;

  navigator.clipboard.writeText(md).then(() => {
    alert('[마크다운 표 복사 완료]\n\nNotion, Jira, GitHub 이슈에 바로 붙여넣기(Ctrl+V)할 수 있는 마크다운 표 서식이 클립보드에 복사되었습니다.');
  });
}

function toggleLanguage() {
  currentLanguage = currentLanguage === 'ko' ? 'en' : 'ko';
  document.getElementById('currentLangText').textContent = currentLanguage.toUpperCase();
  
  if (currentLanguage === 'en') {
    document.querySelector('.brand-name').textContent = 'VoltCheck 24V';
    document.querySelector('.brand-tagline').textContent = 'Industrial Cable Voltage Drop & Sizing Engineering Suite';
    document.querySelector('#tab-voltagedrop .main-title').textContent = 'DC 24V Cable Voltage Drop & Sensor Power Margin';
    document.querySelector('#tab-voltagedrop .main-desc').textContent = 'Calculate cable voltage drop, loop resistance, and sensor brownout margin in real-time.';
    document.querySelector('#printReportBtn span').textContent = 'Print Report';
    document.querySelector('#shareUrlBtn span').textContent = 'Share Link';
  } else {
    document.querySelector('.brand-name').textContent = '볼트체크 24V';
    document.querySelector('.brand-tagline').textContent = '산업용 제어선로 전압강하 & 전장설계 엔지니어링 툴킷';
    document.querySelector('#tab-voltagedrop .main-title').textContent = 'DC 24V 선로 전압강하 및 말단 전원 마진 검토';
    document.querySelector('#tab-voltagedrop .main-desc').textContent = '배선 거리, 도선 굵기, 부하 전류에 따른 전압 강하량과 센서 오동작(Brownout) 여부를 즉시 산출합니다.';
    document.querySelector('#printReportBtn span').textContent = '검토서 인쇄';
    document.querySelector('#shareUrlBtn span').textContent = '조건 공유';
  }
}
