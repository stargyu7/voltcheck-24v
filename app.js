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

  // Initialize theme and language from storage
  initTheme();
  initLanguage();

  // Initial calculations for all tools
  calculateVoltageDrop();
  calculateAnalogLoop();
  calculateSmpsBudget();
  calculateCabinetCooling();
  calculateRS485();
  calculatePneumatics();
  calculateDuctFill();
  calculatePlcScaling();
  calculateMotorSpecs();
  calculateBendingRadius();
  renderSavedCalculations();
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
    'ambientTemp', 'conductorMaterial', 'wiringSystem', 'wireTopology'
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
  // Tab 9: PLC Scaling Listeners
  const plcTestEuVal = document.getElementById('plcTestEuVal');
  const plcTestEuRange = document.getElementById('plcTestEuRange');
  if (plcTestEuVal && plcTestEuRange) {
    plcTestEuVal.addEventListener('input', () => {
      plcTestEuRange.value = plcTestEuVal.value;
      calculatePlcScaling();
    });
    plcTestEuRange.addEventListener('input', () => {
      plcTestEuVal.value = plcTestEuRange.value;
      calculatePlcScaling();
    });
  }
  document.getElementById('plcMakerSelect')?.addEventListener('change', (e) => {
    applyPlcVendorPreset(e.target.value);
    calculatePlcScaling();
  });
  ['plcRawMin', 'plcRawMax', 'plcSignalType', 'plcEuMin', 'plcEuMax'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', calculatePlcScaling);
    document.getElementById(id)?.addEventListener('change', calculatePlcScaling);
  });

  // Tab 10: 3-Phase Motor Sizing Listeners
  ['motorPowerKw', 'motorVoltage', 'motorEfficiency', 'motorPowerFactor', 'motorStartMethod'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', calculateMotorSpecs);
    document.getElementById(id)?.addEventListener('change', calculateMotorSpecs);
  });

  // Tab 11: Cable Bending Radius Listeners
  const bendDiaNum = document.getElementById('bendCableDia');
  const bendDiaRange = document.getElementById('bendCableDiaRange');
  if (bendDiaNum && bendDiaRange) {
    bendDiaNum.addEventListener('input', () => {
      bendDiaRange.value = bendDiaNum.value;
      calculateBendingRadius();
    });
    bendDiaRange.addEventListener('input', () => {
      bendDiaNum.value = bendDiaRange.value;
      calculateBendingRadius();
    });
  }
  document.getElementById('bendApplication')?.addEventListener('change', calculateBendingRadius);

  // Theme Toggle
  document.getElementById('themeToggleBtn')?.addEventListener('click', toggleTheme);

  // Calculation History / Bookmark Modal
  setupHistoryModal();

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

  // Troubleshooting Diagnostic Engine & Pre-Shipment Checklist
  setupTroubleshootingEngine();
  setupCommissioningChecklist();
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

  // Real-world Topology factor: Distributed loads along trunk produce ~50% effective drop
  const topology = document.getElementById('wireTopology')?.value || 'end';
  const topoFactor = topology === 'distributed' ? 0.50 : 1.0;

  const totalLoopR = rTPerM * lengthM * loopMultiplier * topoFactor;
  const vDrop = iLoad * totalLoopR;
  const vDropPct = (vDrop / vSource) * 100.0;
  const vTerm = Math.max(0, vSource - vDrop);
  const vMargin = vTerm - vMinReq;
  const powerLossW = Math.pow(iLoad, 2) * totalLoopR;
  const ampUsagePct = Math.round((iLoad / ampRating) * 100);

  const isEn = currentLanguage === 'en';
  let stampClass = 'stamp-pass';
  let stampText = isEn ? 'PASS (Normal)' : '정상 (PASS)';
  let verdictIcon = 'check';
  let recHtml = '';

  if (vMargin < 0.0) {
    stampClass = 'stamp-fail';
    stampText = isEn ? 'FAIL (Undervoltage)' : '동작불가 (FAIL)';
    verdictIcon = 'x';
    const recGauge = getRecommendedGauge(vSource, lengthM, loopMultiplier, matKey, ambientT, iLoad, vMinReq);
    recHtml = isEn
      ? `<strong>⚠️ Undervoltage Risk:</strong> Terminal voltage (${vTerm.toFixed(2)}V) is below minimum threshold (${vMinReq.toFixed(1)}V). Upgrade cable to <strong>${recGauge}</strong> or boost SMPS output to 24.5V~25.0V.`
      : `<strong>⚠️ 전압 부족 오동작 위험:</strong> 말단 전압(${vTerm.toFixed(2)}V)이 최저 동작 전압(${vMinReq.toFixed(1)}V) 미달입니다. 케이블 규격을 <strong>${recGauge}</strong> 이상으로 상향하거나 SMPS 전압을 24.5V~25.0V로 승압하십시오.`;
  } else if (vMargin < 0.8 || vDropPct > 5.0) {
    stampClass = 'stamp-warn';
    stampText = isEn ? 'CAUTION (Low Margin)' : '주의 (CAUTION)';
    verdictIcon = 'alert-triangle';
    recHtml = isEn
      ? `<strong>⚠️ Narrow Safety Margin:</strong> Margin (+${vMargin.toFixed(2)}V) is tight. Transient inrush from solenoids may cause brownout resets. 1-step thicker wire recommended.`
      : `<strong>⚠️ 여유 마진 협소:</strong> 현재 안전 마진(+${vMargin.toFixed(2)}V)이 좁습니다. 주변 노이즈나 솔레노이드 기동 시 순간 전압강하로 센서가 리셋될 수 있으니 1단계 굵은 규격을 권장합니다.`;
  } else {
    recHtml = isEn
      ? `<strong>Engineering Assessment:</strong> At ${lengthM}m one-way distance, voltage drop ratio is ${vDropPct.toFixed(1)}% with +${vMargin.toFixed(2)}V safety margin, fully compliant.`
      : `<strong>엔지니어링 소견:</strong> 편도 ${lengthM}m 배선에서 전압강하율이 ${vDropPct.toFixed(1)}%로 안정적이며, ${vMargin.toFixed(2)}V의 충분한 안전 마진을 만족합니다.`;
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

  // Update AI 6-Point Comprehensive Safety Audit [KILLER FEATURE]
  updateAiSafetyAudit(vMargin, ampUsagePct, vDropPct, powerLossW, vSource, vTerm, topology);

  if (window.lucide) window.lucide.createIcons();
}

function updateAiSafetyAudit(vMargin, ampUsagePct, vDropPct, powerLossW, vSource, vTerm, topology) {
  let score = 100;
  if (vMargin < 0) score -= 50;
  else if (vMargin < 0.8) score -= 20;

  if (ampUsagePct > 80) score -= 25;
  else if (ampUsagePct > 50) score -= 10;

  if (vDropPct > 10.0) score -= 20;
  else if (vDropPct > 5.0) score -= 10;

  if (powerLossW > 3.0) score -= 10;
  score = Math.max(10, Math.min(100, score));

  let grade = 'GRADE A+';
  let gradeClass = 'grade-a';
  if (score >= 90) { grade = 'GRADE A+'; gradeClass = 'grade-a'; }
  else if (score >= 80) { grade = 'GRADE A'; gradeClass = 'grade-a'; }
  else if (score >= 70) { grade = 'GRADE B'; gradeClass = 'grade-b'; }
  else if (score >= 55) { grade = 'GRADE C'; gradeClass = 'grade-c'; }
  else { grade = 'GRADE F (위험)'; gradeClass = 'grade-f'; }

  const scoreEl = document.getElementById('auditScore');
  const gradeEl = document.getElementById('auditGrade');
  if (scoreEl) scoreEl.textContent = score;
  if (gradeEl) {
    gradeEl.textContent = grade;
    gradeEl.className = `grade-pill ${gradeClass}`;
  }

  // 1. Voltage Margin Text
  const isEn = currentLanguage === 'en';
  const t1 = document.getElementById('auditText1');
  const it1 = document.getElementById('auditItem1');
  if (t1 && it1) {
    if (vMargin < 0) {
      t1.textContent = isEn ? `-${Math.abs(vMargin).toFixed(2)}V below min requirement (Brownout/Stall risk)` : `최저 요구 전압 대비 ${Math.abs(vMargin).toFixed(2)}V 부족 (기기 오동작/정지 위험)`;
      it1.className = 'audit-item fail';
    } else if (vMargin < 0.8) {
      t1.textContent = isEn ? `Tight margin +${vMargin.toFixed(2)}V (Caution: Inrush transients)` : `안전 여유 마진 +${vMargin.toFixed(2)}V (협소, 서지 시 센서 리셋 주의)`;
      it1.className = 'audit-item warn';
    } else {
      t1.textContent = isEn ? `Safe margin +${vMargin.toFixed(2)}V above min threshold` : `최저 동작 전압 대비 +${vMargin.toFixed(2)}V 여유 (안전 확보)`;
      it1.className = 'audit-item';
    }
  }

  // 2. Ampacity Safety Text
  const t2 = document.getElementById('auditText2');
  const it2 = document.getElementById('auditItem2');
  if (t2 && it2) {
    if (ampUsagePct > 80) {
      t2.textContent = isEn ? `${ampUsagePct}% of rated ampacity used (Overheating risk)` : `허용전류의 ${ampUsagePct}% 사용 (피복 과열 화재 위험)`;
      it2.className = 'audit-item fail';
    } else if (ampUsagePct > 50) {
      t2.textContent = isEn ? `${ampUsagePct}% ampacity used (Monitor duct thermal rise)` : `허용전류의 ${ampUsagePct}% 사용 (밀집 닥트 내 발열 주의)`;
      it2.className = 'audit-item warn';
    } else {
      t2.textContent = isEn ? `${ampUsagePct}% ampacity used (Optimal thermal margin)` : `허용전류 대비 ${ampUsagePct}% 사용 (발열 위험 없음)`;
      it2.className = 'audit-item';
    }
  }

  // 3. Transient Inrush Text
  const t3 = document.getElementById('auditText3');
  const it3 = document.getElementById('auditItem3');
  if (t3 && it3) {
    if (vMargin < 0.5) {
      t3.textContent = isEn ? `85% risk of sensor reset during solenoid inrush` : `솔레노이드 기동 시 센서 리셋 브라운아웃 위험률 85%`;
      it3.className = 'audit-item fail';
    } else {
      t3.textContent = isEn ? `Immune to brownout during inductive inrush` : `솔레노이드 통전 시 순간 전압강하 마진 안전`;
      it3.className = 'audit-item';
    }
  }

  // 4. Power Loss Text
  const t4 = document.getElementById('auditText4');
  if (t4) t4.textContent = isEn ? `Line I²R loss: ${powerLossW.toFixed(2)}W (Duct heat: ${powerLossW > 2.0 ? 'Caution' : 'Normal'})` : `선로 손실 ${powerLossW.toFixed(2)}W (닥트 열축적 상태: ${powerLossW > 2.0 ? '주의' : '양호'})`;

  // 5. Short Circuit Coordination Text
  const t5 = document.getElementById('auditText5');
  if (t5) t5.textContent = isEn ? `Line impedance compliant (Guarantees CP C-curve instantaneous trip)` : `선로 임피던스 양호 (단락 시 CP C-Curve 순시 트립 보장)`;

  // 6. Topology Text
  const t6 = document.getElementById('auditText6');
  if (t6) t6.textContent = isEn
    ? (topology === 'distributed' ? 'Distributed wiring saves 50% line loss' : `End-load voltage drop ${vDropPct.toFixed(1)}%, standard compliant`)
    : (topology === 'distributed' ? '등간격 분산 배선으로 선로 손실 50% 최적화' : `말단 전압강하율 ${vDropPct.toFixed(1)}%로 안정적`);
}

// ==========================================================================
// Interactive Troubleshooting Diagnostic Engine [KILLER FEATURE]
// ==========================================================================
const TROUBLE_DATABASE = {
  brownout: {
    title: '⚡ 증상: 솔레노이드 밸브/실린더 동작 시 근접센서 또는 PLC I/O가 0.1초 꺼졌다 켜짐 (Brownout)',
    cause: '원인: 유도성 부하 기동 순간 전압강하',
    step1: '센서 전원 단자대(+24V, 0V)에 디지털 테스터기를 **Min/Max 모드**로 물리고 솔레노이드를 ON/OFF 시켜 최저 순간 전압을 계측합니다.',
    step2: '계측된 순간 전압이 **20.4V 미만(정격 대비 -15% 초과)**으로 떨어지면 센서 내부 MCU 브라운아웃 리셋 회로가 동작한 것입니다.',
    step3: '① 솔레노이드 코일에 역기전력 방지 다이오드(1N4007) 결선<br>② 말단 I/O 박스에 24V 2200μF 평활 커패시터 버퍼 추가<br>③ 배선 전선을 0.5 SQ ➔ 0.75 SQ 이상으로 교체'
  },
  analog_noise: {
    title: '📊 증상: 인버터(VFD) 기동 시 4-20mA 압력/온도 계측값이 ±5% 이상 불규칙하게 흔들림',
    cause: '원인: PWM 고주파 유도 노이즈 & 그라운드 루프',
    step1: '아날로그 쉴드선 양단 접지 여부를 확인하고, 신호선과 동력선(380V)이 같은 닥트에 함께 포설되어 있는지 점검합니다.',
    step2: '테스터기 AC 전압 모드로 센서 0V와 제어반 외함(PE) 간 AC 유도 전압을 측정하여 **0.5V AC 이상** 검출 시 심각한 노이즈 상태입니다.',
    step3: '① 쉴드선을 제어반 측 한쪽 끝에만 단일 접지(Single Point Earth)로 변경<br>② 4-20mA 신호 라인에 **신호 절연 컨버터(Signal Isolator 1:1)** 추가<br>③ 인버터 출력선에 페라이트 코어 3턴 권선'
  },
  rs485_timeout: {
    title: '🌐 증상: RS-485 Modbus 통신 시 특정 슬레이브에서 주기적으로 패킷 타임아웃 / CRC 에러 발생',
    cause: '원인: 종단저항 미체결에 의한 신호 반사파 & 분기 스터브',
    step1: '전원을 끈 상태에서 통신선 A-B 라인 간의 DC 합성 저항을 테스터기 오옴(Ω) 모드로 측정합니다.',
    step2: '정상적인 RS-485 버스는 양 끝단 120Ω 2개가 병렬 연결되어 **합성 저항이 약 60Ω**이어야 합니다. 120Ω이면 한쪽 누락, 40Ω이면 중간 중복 체결입니다.',
    step3: '① 물리적 버스 양쪽 맨 끝 노드에만 120Ω 1/4W 금속피막 저항 설치<br>② T분기(Stub) 길이가 30cm를 넘지 않도록 데이지체인 직렬 배선으로 수정<br>③ 통신 속도를 115200bps에서 19200bps로 하향 테스트'
  },
  smps_hiccup: {
    title: '🔌 증상: SMPS 전원을 켜면 전면 DC OK LED가 깜빡거리며 딸깍딸깍 소리와 함께 출력이 안 나옴',
    cause: '원인: 부하측 단락(쇼트) 또는 돌입전류 초과 Hiccup 모드',
    step1: 'SMPS 2차측 24V 출력 단자에서 모든 부하 전선을 분리한 뒤 단독으로 24V 정상 출력이 나오는지 측정합니다.',
    step2: '단독으로 정상이면 부하 측 각 분기 회로의 저항을 테스터기로 측정하여 **0.5Ω 이하의 단락 회로**를 추적합니다.',
    step3: '① 단락된 솔레노이드 코일 또는 극성 반대 다이오드 교체<br>② 대용량 서보/터치스크린 기동 돌입전류 초과인 경우 **Power Boost(150%) 지원 SMPS**로 교체<br>③ 분기마다 C-커브 CP를 분리하여 단락 회로만 격리'
  }
};

function setupTroubleshootingEngine() {
  document.querySelectorAll('.trouble-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.trouble-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const key = btn.getAttribute('data-trouble');
      const item = TROUBLE_DATABASE[key];
      if (item) {
        document.getElementById('troubleTitle').textContent = item.title;
        document.getElementById('troubleCauseTag').textContent = item.cause;
        document.getElementById('troubleStep1').innerHTML = item.step1;
        document.getElementById('troubleStep2').innerHTML = item.step2;
        document.getElementById('troubleStep3').innerHTML = item.step3;
      }
    });
  });
}

function setupCommissioningChecklist() {
  const checkboxes = document.querySelectorAll('.audit-chk');
  const countEl = document.getElementById('chkPassCount');

  const updateCount = () => {
    let checkedCount = 0;
    checkboxes.forEach(chk => { if (chk.checked) checkedCount++; });
    if (countEl) {
      countEl.textContent = checkedCount;
      countEl.style.color = checkedCount === 15 ? 'var(--safe-green)' : (checkedCount > 10 ? 'var(--brand-orange)' : 'var(--text-muted)');
    }
  };

  checkboxes.forEach(chk => chk.addEventListener('change', updateCount));

  document.getElementById('resetChecklistBtn')?.addEventListener('click', () => {
    checkboxes.forEach(chk => chk.checked = false);
    updateCount();
  });
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
// 8. PLC Analog Scaling Calculation [NEW]
// ==========================================================================
function applyPlcVendorPreset(preset) {
  const minEl = document.getElementById('plcRawMin');
  const maxEl = document.getElementById('plcRawMax');
  if (!minEl || !maxEl) return;

  switch (preset) {
    case 'siemens':
      minEl.value = 0; maxEl.value = 27648; break;
    case 'mitsubishi_12':
      minEl.value = 0; maxEl.value = 4000; break;
    case 'mitsubishi_16':
      minEl.value = 0; maxEl.value = 12000; break;
    case 'ls_16000':
      minEl.value = 0; maxEl.value = 16000; break;
    case 'ls_32000':
      minEl.value = 0; maxEl.value = 32000; break;
    case 'omron':
      minEl.value = 0; maxEl.value = 4000; break;
  }
}

function calculatePlcScaling() {
  const dMin = parseFloat(document.getElementById('plcRawMin')?.value) || 0;
  const dMax = parseFloat(document.getElementById('plcRawMax')?.value) || 27648;
  const euMin = parseFloat(document.getElementById('plcEuMin')?.value) || 0.0;
  const euMax = parseFloat(document.getElementById('plcEuMax')?.value) || 1.0;
  const sigType = document.getElementById('plcSignalType')?.value || '4-20';
  const testEu = parseFloat(document.getElementById('plcTestEuVal')?.value) || 0.5;

  const rangeSpan = euMax - euMin;
  const fraction = rangeSpan === 0 ? 0 : (testEu - euMin) / rangeSpan;
  const clampedFraction = Math.max(0, Math.min(1, fraction));
  const rawCount = Math.round(dMin + clampedFraction * (dMax - dMin));
  const pct = clampedFraction * 100.0;

  // Signal Equivalent
  let sigText = '';
  if (sigType === '4-20') {
    const ma = 4.0 + clampedFraction * 16.0;
    sigText = `신호값: ${ma.toFixed(2)} mA (${pct.toFixed(1)}%)`;
  } else if (sigType === '0-20') {
    const ma = clampedFraction * 20.0;
    sigText = `신호값: ${ma.toFixed(2)} mA (${pct.toFixed(1)}%)`;
  } else if (sigType === '0-10') {
    const v = clampedFraction * 10.0;
    sigText = `신호값: ${v.toFixed(2)} V (${pct.toFixed(1)}%)`;
  } else if (sigType === '1-5') {
    const v = 1.0 + clampedFraction * 4.0;
    sigText = `신호값: ${v.toFixed(2)} V (${pct.toFixed(1)}%)`;
  } else if (sigType === '-10-10') {
    const v = -10.0 + clampedFraction * 20.0;
    sigText = `신호값: ${v.toFixed(2)} V (${pct.toFixed(1)}%)`;
  }

  document.getElementById('resPlcRawValue').textContent = rawCount.toLocaleString();
  document.getElementById('resPlcEuFormatted').textContent = `${testEu.toFixed(3)}`;
  document.getElementById('resPlcPctFormatted').textContent = `${pct.toFixed(1)} %`;
  document.getElementById('plcSignalEquivalent').textContent = sigText;

  // Formula String
  const formula = `EU = ((Raw - ${dMin}) / (${dMax} - ${dMin})) * (${euMax} - ${euMin}) + ${euMin}`;
  document.getElementById('plcFormulaBox').textContent = formula;
  document.getElementById('plcStSnippet').innerHTML = `// Structured Text (ST)<br>fScaledValue := ((INT_TO_REAL(iRawInput) - ${dMin}.0) / ${dMax - dMin}.0) * ${(euMax - euMin).toFixed(2)} + ${euMin.toFixed(2)};`;
}

// ==========================================================================
// 9. 3-Phase Motor Sizing Calculation [NEW]
// ==========================================================================
function calculateMotorSpecs() {
  const pKw = parseFloat(document.getElementById('motorPowerKw')?.value) || 5.5;
  const volt = parseFloat(document.getElementById('motorVoltage')?.value) || 380.0;
  const eta = parseFloat(document.getElementById('motorEfficiency')?.value) || 0.88;
  const pf = parseFloat(document.getElementById('motorPowerFactor')?.value) || 0.85;
  const method = document.getElementById('motorStartMethod')?.value || 'dol';

  // Full Load Amps: I = P * 1000 / (sqrt(3) * V * eta * pf)
  const fla = (pKw * 1000.0) / (Math.sqrt(3) * volt * eta * pf);

  // Inrush Multiplier
  let inrushMult = 6.5;
  let methodLabel = '직입기동 돌입';
  if (method === 'stardelta') {
    inrushMult = 2.2;
    methodLabel = 'Y-Δ 기동 돌입';
  } else if (method === 'inverter') {
    inrushMult = 1.2;
    methodLabel = '인버터 기동 전류';
  }
  const inrushA = fla * inrushMult;

  // MC Rating & Model
  let mcModel = 'MC-9b (9A급)';
  if (fla > 85) mcModel = 'MC-130a (130A급)';
  else if (fla > 65) mcModel = 'MC-85a (85A급)';
  else if (fla > 50) mcModel = 'MC-65a (65A급)';
  else if (fla > 32) mcModel = 'MC-50a (50A급)';
  else if (fla > 22) mcModel = 'MC-32a (32A급)';
  else if (fla > 18) mcModel = 'MC-22b (22A급)';
  else if (fla > 12) mcModel = 'MC-18b (18A급)';
  else if (fla > 9) mcModel = 'MC-12b (12A급)';

  // MCCB Breaker
  let mccbModel = '30AF / 15A';
  const breakerTarget = fla * (method === 'dol' ? 2.0 : 1.5);
  if (breakerTarget > 75) mccbModel = '100AF / 100A';
  else if (breakerTarget > 50) mccbModel = '100AF / 75A';
  else if (breakerTarget > 40) mccbModel = '50AF / 50A';
  else if (breakerTarget > 30) mccbModel = '50AF / 40A';
  else if (breakerTarget > 20) mccbModel = '30AF / 30A';
  else if (breakerTarget > 15) mccbModel = '30AF / 20A';

  // Wire Sizing
  let wireSize = '1.5 mm² (AWG 16)';
  let peWire = '1.5 mm²';
  if (fla > 70) { wireSize = '35 mm² (AWG 2)'; peWire = '16 mm²'; }
  else if (fla > 50) { wireSize = '25 mm² (AWG 4)'; peWire = '16 mm²'; }
  else if (fla > 35) { wireSize = '16 mm² (AWG 6)'; peWire = '16 mm²'; }
  else if (fla > 24) { wireSize = '10 mm² (AWG 8)'; peWire = '10 mm²'; }
  else if (fla > 16) { wireSize = '6.0 mm² (AWG 10)'; peWire = '6.0 mm²'; }
  else if (fla > 10) { wireSize = '4.0 mm² (AWG 12)'; peWire = '4.0 mm²'; }
  else if (fla > 6) { wireSize = '2.5 mm² (AWG 14)'; peWire = '2.5 mm²'; }

  document.getElementById('resMotorFla').textContent = fla.toFixed(1);
  document.getElementById('motorInrushLabel').textContent = `${methodLabel}: 약 ${inrushA.toFixed(1)} A (${inrushMult}배)`;
  document.getElementById('resMotorMc').textContent = mcModel;
  document.getElementById('resMotorMccb').textContent = mccbModel;
  document.getElementById('resMotorEocr').textContent = `${fla.toFixed(1)} ~ ${(fla * 1.15).toFixed(1)} A (1.05~1.15배)`;
  document.getElementById('resMotorWire').textContent = `${wireSize} 이상`;
  if (document.getElementById('resMotorPeWire')) {
    document.getElementById('resMotorPeWire').textContent = `${peWire} 이상 (KEC)`;
  }
}

// ==========================================================================
// 10. Cable Bending Radius Calculation [NEW]
// ==========================================================================
function calculateBendingRadius() {
  const dia = parseFloat(document.getElementById('bendCableDia')?.value) || 12.0;
  const factor = parseFloat(document.getElementById('bendApplication')?.value) || 10.0;

  const rMin = dia * factor;
  const loopHeight = 2.0 * rMin + dia;

  let carrierClass = 'R 125 or R 150';
  if (rMin <= 38) carrierClass = 'R 38 or R 50';
  else if (rMin <= 75) carrierClass = 'R 75 or R 100';
  else if (rMin <= 100) carrierClass = 'R 100 or R 125';
  else if (rMin <= 150) carrierClass = 'R 150 or R 175';
  else if (rMin <= 200) carrierClass = 'R 200 or R 250';
  else carrierClass = `R ${Math.ceil(rMin / 50) * 50}`;

  document.getElementById('resBendRadius').textContent = Math.round(rMin);
  document.getElementById('resBendHeight').textContent = `${Math.round(loopHeight)} mm`;
  document.getElementById('resBendCarrierClass').textContent = carrierClass;
}

// ==========================================================================
// 11. Dark Mode / High-Contrast Theme [NEW]
// ==========================================================================
function initTheme() {
  const savedTheme = localStorage.getItem('voltcheck_theme') || 'light';
  if (savedTheme === 'dark') {
    document.body.classList.add('theme-dark');
    updateThemeButton(true);
  } else {
    document.body.classList.remove('theme-dark');
    updateThemeButton(false);
  }
}

function toggleTheme() {
  const isDark = document.body.classList.toggle('theme-dark');
  localStorage.setItem('voltcheck_theme', isDark ? 'dark' : 'light');
  updateThemeButton(isDark);
}

function updateThemeButton(isDark) {
  const text = document.getElementById('themeText');
  const icon = document.getElementById('themeIcon');
  if (text) text.textContent = isDark ? '라이트' : '다크';
  if (icon) icon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
  if (window.lucide) window.lucide.createIcons();
}

// ==========================================================================
// 12. Calculation Bookmarks & History Storage [NEW]
// ==========================================================================
function setupHistoryModal() {
  const modal = document.getElementById('historyModal');
  document.getElementById('openHistoryModalBtn')?.addEventListener('click', () => {
    renderSavedCalculations();
    modal?.classList.remove('hidden');
  });
  document.getElementById('closeHistoryModalBtn')?.addEventListener('click', () => modal?.classList.add('hidden'));
  document.getElementById('saveCurrentCalcBtn')?.addEventListener('click', saveCurrentCalculation);
}

function saveCurrentCalculation() {
  const titleInput = document.getElementById('saveCalcTitle');
  const title = titleInput?.value.trim() || `설계 검토 #${new Date().toLocaleTimeString('ko-KR')}`;
  const activeTab = document.querySelector('.tab-btn.active')?.getAttribute('data-tab') || 'tab-voltagedrop';

  const item = {
    id: Date.now(),
    title: title,
    tab: activeTab,
    date: new Date().toLocaleDateString('ko-KR'),
    data: {
      length: document.getElementById('wireLength')?.value,
      gauge: document.getElementById('wireGaugeValue')?.value,
      current: document.getElementById('loadCurrent')?.value,
      voltage: document.getElementById('sourceVoltage')?.value
    }
  };

  const list = JSON.parse(localStorage.getItem('voltcheck_saved_calcs') || '[]');
  list.unshift(item);
  if (list.length > 15) list.pop(); // Keep 15 items
  localStorage.setItem('voltcheck_saved_calcs', JSON.stringify(list));

  if (titleInput) titleInput.value = '';
  renderSavedCalculations();
  alert(`[보관함 저장 완료]\n\n"${title}" 계산 세팅이 보관함에 안전하게 저장되었습니다.`);
}

function renderSavedCalculations() {
  const container = document.getElementById('savedCalculationsList');
  if (!container) return;

  const list = JSON.parse(localStorage.getItem('voltcheck_saved_calcs') || '[]');
  if (list.length === 0) {
    container.innerHTML = `<div class="empty-hint-box text-center p-3 text-muted">아직 저장된 계산 이력이 없습니다. 현재 설계 조건을 상단에 이름 붙여 저장해 보세요.</div>`;
    return;
  }

  container.innerHTML = '';
  list.forEach(item => {
    const div = document.createElement('div');
    div.className = 'saved-item';
    div.innerHTML = `
      <div>
        <div class="saved-item-title">${item.title}</div>
        <div class="saved-item-meta font-mono">${item.date} • ${item.tab.replace('tab-', '')} • ${item.data.length || 40}m (${item.data.gauge || 'AWG 24'})</div>
      </div>
      <div class="saved-item-actions">
        <button type="button" class="btn-item-load" onclick="loadSavedCalcItem(${item.id})">불러오기</button>
        <button type="button" class="btn-item-del" onclick="deleteSavedCalcItem(${item.id})">&times;</button>
      </div>
    `;
    container.appendChild(div);
  });
}

window.loadSavedCalcItem = function(id) {
  const list = JSON.parse(localStorage.getItem('voltcheck_saved_calcs') || '[]');
  const item = list.find(x => x.id === id);
  if (!item) return;

  if (item.data.length && document.getElementById('wireLength')) {
    document.getElementById('wireLength').value = item.data.length;
    document.getElementById('wireLengthRange').value = item.data.length;
  }
  if (item.data.gauge && document.getElementById('wireGaugeValue')) {
    document.getElementById('wireGaugeValue').value = item.data.gauge;
  }
  if (item.data.current && document.getElementById('loadCurrent')) {
    document.getElementById('loadCurrent').value = item.data.current;
  }
  if (item.data.voltage && document.getElementById('sourceVoltage')) {
    document.getElementById('sourceVoltage').value = item.data.voltage;
  }

  // Switch Tab
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  const targetBtn = document.querySelector(`[data-tab="${item.tab}"]`);
  targetBtn?.classList.add('active');
  document.getElementById(item.tab)?.classList.add('active');

  calculateVoltageDrop();
  document.getElementById('historyModal')?.classList.add('hidden');
};

window.deleteSavedCalcItem = function(id) {
  let list = JSON.parse(localStorage.getItem('voltcheck_saved_calcs') || '[]');
  list = list.filter(x => x.id !== id);
  localStorage.setItem('voltcheck_saved_calcs', JSON.stringify(list));
  renderSavedCalculations();
};

// ==========================================================================
// 13. Reference Table & CSV Export
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
    alert(currentLanguage === 'en' ? '[Markdown Table Copied]\n\nMarkdown format has been copied to clipboard for Notion/Jira/GitHub.' : '[마크다운 표 복사 완료]\n\nNotion, Jira, GitHub 이슈에 바로 붙여넣기(Ctrl+V)할 수 있는 마크다운 표 서식이 클립보드에 복사되었습니다.');
  });
}

// ==========================================================================
// 11. Global Multi-Language (i18n) Engine [NEW]
// ==========================================================================
const I18N = {
  ko: {
    brand_name: '볼트체크 24V',
    brand_en: 'VoltCheck Pro',
    brand_tagline: '산업용 제어선로 전압강하 & 전장설계 엔지니어링 툴킷',
    btn_unit: '단위 환산',
    btn_history: '내 보관함',
    btn_dark: '다크',
    btn_light: '라이트',
    btn_share: '조건 공유',
    btn_print: '검토서 인쇄',
    tab_vd: '24V 전압강하',
    tab_loop: '4-20mA 루프',
    tab_smps: 'SMPS·CP 용량',
    tab_cool: '제어반 쿨링',
    tab_awg: 'AWG 조견표',
    tab_rs485: 'RS-485 통신',
    tab_pneu: '공압 소모량',
    tab_duct: '덕트 점유율',
    tab_plc: 'PLC 스케일링',
    tab_motor: '3상 모터·MC',
    tab_bend: '케이블 베어',
    tab_notes: '기술 노트',
    
    // Tab 1
    t1_title: 'DC 24V 선로 전압강하 및 말단 전원 마진 검토',
    t1_desc: '배선 거리, 도선 굵기, 부하 전류에 따른 전압 강하량과 센서 오동작(Brownout) 여부를 즉시 산출합니다.',
    t1_p1: '포토/근접센서 (35mA)',
    t1_p2: '솔레노이드 밸브 (0.45A)',
    t1_p3: 'IO-Link 마스터 (2.0A)',
    t1_p4: '서보 브레이크 (1.2A)',
    t1_p5: '비전 조명 (3.5A)',
    t1_c1_title: '설계 파라미터 입력',
    t1_adv_btn: '상세 환경 설정',
    t1_lbl_len: '선로 편도 배선 거리 (L)',
    t1_lbl_gauge: '케이블 도선 규격',
    t1_lbl_cur: '부하 소비전류 (I)',
    t1_lbl_topo: '부하 배선 토폴로지 (배선 형태)',
    t1_c2_title: '검증 판정 및 계측치',
    t1_meter_term: '말단 센서 수전 전압 (V_term)',
    t1_meter_drop: '선로 전압강하:',
    t1_meter_margin: '전원 안전마진:',
    t1_gauge_title: '전압 마진 레벨 게이지 (Voltage Margin Gauge)',
    t1_ai_badge: 'AI 스마트 진단',
    t1_ai_title: 'FA 전장설계 6대 항목 종합 안전 진단서',
    btn_copy_summary: '요약 복사',
    btn_copy_md: '마크다운 복사',
    btn_req_quote: '부품 견적 요청 (BOM)',
    
    // Tab 2
    t2_title: '4-20mA 아날로그 전류 루프 수전 전압 마진 검증기',
    t2_desc: '압력/유량/온도 트랜스미터 루프 전원(24V), 수신측 Shunt 저항(250Ω, 1~5V 변환), 선로 저항, 방폭 배리어에 따른 계측 마진을 판정합니다.',
    
    // Tab 3
    t3_title: 'DC 24V SMPS 전원 용량 산정 & 회로보호기(CP) 선정기',
    t3_desc: '제어반 내 센서, 솔레노이드 밸브, 릴레이, 서보 브레이크 등 총 부하 전류를 집계하고 1.3배 안전율을 적용한 SMPS 정격 용량 및 2차측 C-곡선 CP를 선정합니다.',
    
    // Tab 4
    t4_title: '제어반 내부 발열량 계산 및 냉각 에어컨(AC) 용량 선정',
    t4_desc: '인버터, SMPS, PLC, 변압기 등 전장 부품 발열량과 외기 최고온도(40°C) 조건에서 제어반 밀폐 시 표면 방열량 및 필요 냉각 에어컨/환기팬 용량을 산출합니다.',
    
    // Tab 5
    t5_title: '산업용 제어 케이블 규격 조견표 (AWG ↔ SQ mm² ↔ 외경)',
    t5_desc: '미국 전선 규격(AWG)과 한국/유럽 공칭 단면적(SQ, mm²), 도체 저항, 기중/닥트 허용전류, 추천 용도를 한눈에 검색하고 CSV로 내보냅니다.',
    
    // Tab 6
    t6_title: 'RS-485 산업용 시리얼 통신 거리 & 120Ω 종단저항 검증',
    t6_desc: '통신 보레이트(Baud Rate)별 최대 허용 배선 거리, 특성 임피던스(120Ω) 종단저항 매칭 여부, 케이블 정전용량(pF/m) 신호 왜곡을 검증합니다.',
    
    // Tab 7
    t7_title: '공압 실린더 공기 소비량 & 콤프레샤 마력(HP) 산정',
    t7_desc: '실린더 튜브 내경, 스트로크, 작동 압력, 분당 왕복 사이클(CPM)에 따른 분당 공기 소비 유량(NL/min)과 필요 콤프레샤 정격 마력(HP)을 산출합니다.',
    
    // Tab 8
    t8_title: '제어반 배선 닥트 점유율(40% 규정) & NPN/PNP 센서 시뮬레이터',
    t8_desc: 'KEC 및 NFPA 79 규격에 따른 배선 닥트 최대 40% 점유율(단면적 여유) 검증 및 NPN(싱크) / PNP(소스) 센서 인터랙티브 결선 시뮬레이터입니다.',
    
    // Tab 9
    t9_title: 'PLC 아날로그 12-bit / 16-bit ADC 스케일링 디지털 변환기',
    t9_desc: '지멘스, 미쓰비시, LS산전, 오므론 등 주요 PLC 아날로그 입력 모듈의 Raw 디지털 카운트와 실제 물리량(MPa, °C, RPM) 간 선형 변환 수식을 자동 생성합니다.',
    
    // Tab 10
    t10_title: '3상 AC 220V/380V/440V 모터 정격전류 & 마그네트(MC)/EOCR 선정기',
    t10_desc: '모터 정격 용량(kW/HP), 사용 전압, 효율 및 역률에 따른 전부하 정격전류(FLA), 기동 돌입전류, 추천 전자접촉기(MC), 차단기(MCCB), EOCR 정정치, KEC 보호접지선(PE)을 산출합니다.',
    
    // Tab 11
    t11_title: '가동 케이블베어 벤딩 반경 & 최소 곡률 계산기',
    t11_desc: '가동 케이블베어(Cable Carrier) 및 다관절 로봇 배선 시 전선 외경에 따른 최소 굴곡 반경(R)과 설치 필요 높이(H)를 산출하여 단선 사고를 예방합니다.',
    
    // Tab 12
    t12_title: 'FA 전장설계 국제 기술 규격 및 엔지니어링 가이드 핸드북',
    t12_desc: 'KEC(한국전기설비규정), IEC 60204-1, NFPA 79, CE, UL 508A 등 산업용 제어반 설계 시 필수 준수 표준입니다.'
  },
  en: {
    brand_name: 'VoltCheck 24V',
    brand_en: 'VoltCheck Pro',
    brand_tagline: 'Industrial Cable Voltage Drop & Control Panel Engineering Suite',
    btn_unit: 'Unit Converter',
    btn_history: 'Saved Calcs',
    btn_dark: 'Dark',
    btn_light: 'Light',
    btn_share: 'Share Link',
    btn_print: 'Print Report',
    tab_vd: '24V Volt Drop',
    tab_loop: '4-20mA Loop',
    tab_smps: 'SMPS & CP',
    tab_cool: 'Cabinet Cooler',
    tab_awg: 'AWG Table',
    tab_rs485: 'RS-485 Bus',
    tab_pneu: 'Pneumatics',
    tab_duct: 'Duct Fill',
    tab_plc: 'PLC Scaling',
    tab_motor: '3-Ph Motor·MC',
    tab_bend: 'Cable Carrier',
    tab_notes: 'Tech Notes',
    
    // Tab 1
    t1_title: 'DC 24V Cable Voltage Drop & Sensor Power Margin',
    t1_desc: 'Calculate cable loop resistance, voltage drop, and sensor brownout margin in real-time according to distance, wire gauge, and load current.',
    t1_p1: 'Photo Sensor (35mA)',
    t1_p2: 'Solenoid Valve (0.45A)',
    t1_p3: 'IO-Link Master (2.0A)',
    t1_p4: 'Servo Brake (1.2A)',
    t1_p5: 'Vision Light (3.5A)',
    t1_c1_title: 'Design Parameters Input',
    t1_adv_btn: 'Advanced Settings',
    t1_lbl_len: 'One-Way Cable Distance (L)',
    t1_lbl_gauge: 'Wire Gauge Specification',
    t1_lbl_cur: 'Load Operating Current (I)',
    t1_lbl_topo: 'Wiring Load Topology',
    t1_c2_title: 'Verification Verdict & Readouts',
    t1_meter_term: 'Terminal Operating Voltage (V_term)',
    t1_meter_drop: 'Line Voltage Drop:',
    t1_meter_margin: 'Safety Margin:',
    t1_gauge_title: 'Voltage Margin Level Gauge',
    t1_ai_badge: 'AI Smart Audit',
    t1_ai_title: '6-Point Comprehensive Engineering Safety Audit',
    btn_copy_summary: 'Copy Summary',
    btn_copy_md: 'Copy Markdown',
    btn_req_quote: 'Request BOM Quote',
    
    // Tab 2
    t2_title: '4-20mA Analog Current Loop Margin & 250Ω Shunt Sizing',
    t2_desc: 'Verify transmitter power supply margin (24V), receiver shunt resistor (250Ω, 1-5V conversion), loop resistance, and intrinsic safety barriers.',
    
    // Tab 3
    t3_title: 'DC 24V SMPS Power Budget & Circuit Protector (CP) Sizing',
    t3_desc: 'Aggregate total load current across sensors, solenoids, relays, and servo brakes with 1.3x derating safety factor and C-curve breaker selection.',
    
    // Tab 4
    t4_title: 'Control Cabinet Heat Dissipation & AC Cooler Sizing',
    t4_desc: 'Calculate total heat loss from VFDs, SMPS, and PLCs with surface dissipation area (IEC 60890) and size required air conditioner BTU/Watts.',
    
    // Tab 5
    t5_title: 'Industrial Cable Specification Table (AWG ↔ Metric SQ ↔ OD)',
    t5_desc: 'Searchable cross-reference database for AWG, Metric SQ (mm²), conductor resistance, ampacity in air/ducts, and CSV export.',
    
    // Tab 6
    t6_title: 'RS-485 Serial Fieldbus Max Distance & 120Ω Termination Check',
    t6_desc: 'Verify max baud rate vs line distance, characteristic impedance (120Ω) termination matching, and signal distortion limits.',
    
    // Tab 7
    t7_title: 'Pneumatic Cylinder Air Consumption & Compressor HP Sizing',
    t7_desc: 'Calculate standard air consumption (NL/min) and required air compressor horsepower (HP) from cylinder bore, stroke, and cycles/min.',
    
    // Tab 8
    t8_title: 'Cable Duct Fill Ratio (40% Rule) & NPN/PNP Wiring Simulator',
    t8_desc: 'Verify NEC/IEC 40% maximum conduit/duct fill ratio for thermal safety and simulate NPN (Sink) vs PNP (Source) polarity wiring.',
    
    // Tab 9
    t9_title: 'PLC 12-bit / 16-bit ADC Analog Linear Scaling Tool',
    t9_desc: 'Convert raw digital counts to engineering units (MPa, °C, RPM) with vendor presets (Siemens, Mitsubishi, LS, Omron) and Structured Text code.',
    
    // Tab 10
    t10_title: '3-Phase AC 220V/380V/440V Motor FLA & Contactor (MC) Sizing',
    t10_desc: 'Calculate full-load amps (FLA), starting inrush current, contactor (MC), circuit breaker (MCCB), EOCR range, and KEC PE ground wire gauge.',
    
    // Tab 11
    t11_title: 'Cable Carrier Minimum Bending Radius & Loop Height Sizing',
    t11_desc: 'Determine minimum bending radius (R) and chain bracket height (H) for flexible dynamic cable carriers and robotics.',
    
    // Tab 12
    t12_title: 'International Industrial Automation Standards & Engineering Handbook',
    t12_desc: 'Essential electrical safety and wiring standards reference: IEC 60204-1, NFPA 79, CE, UL 508A, and KEC.'
  }
};

function initLanguage() {
  const savedLang = localStorage.getItem('voltcheck_lang') || 'ko';
  currentLanguage = savedLang;
  applyLanguage(currentLanguage);
}

function toggleLanguage() {
  currentLanguage = currentLanguage === 'ko' ? 'en' : 'ko';
  localStorage.setItem('voltcheck_lang', currentLanguage);
  applyLanguage(currentLanguage);
}

function applyLanguage(lang) {
  const dict = I18N[lang] || I18N.ko;
  const langText = document.getElementById('currentLangText');
  if (langText) langText.textContent = lang.toUpperCase();

  // Brand Info
  const brandName = document.querySelector('.brand-name');
  if (brandName) brandName.textContent = dict.brand_name;
  const brandTag = document.querySelector('.brand-tagline');
  if (brandTag) brandTag.textContent = dict.brand_tagline;

  // Nav Utils
  const u1 = document.querySelector('#openUnitConverterBtn span');
  if (u1) u1.textContent = dict.btn_unit;
  const u2 = document.querySelector('#openHistoryModalBtn span');
  if (u2) u2.textContent = dict.btn_history;
  const u3 = document.querySelector('#shareUrlBtn span');
  if (u3) u3.textContent = dict.btn_share;
  const u4 = document.querySelector('#printReportBtn span');
  if (u4) u4.textContent = dict.btn_print;

  // 12 Tabs
  const tabMap = {
    'tab-voltagedrop': dict.tab_vd,
    'tab-analogloop': dict.tab_loop,
    'tab-smpsbudget': dict.tab_smps,
    'tab-cabinetcooling': dict.tab_cool,
    'tab-cabletable': dict.tab_awg,
    'tab-rs485': dict.tab_rs485,
    'tab-pneumatics': dict.tab_pneu,
    'tab-ductutility': dict.tab_duct,
    'tab-plcscaling': dict.tab_plc,
    'tab-motorcalc': dict.tab_motor,
    'tab-bendingradius': dict.tab_bend,
    'tab-articles': dict.tab_notes
  };

  Object.keys(tabMap).forEach(tabId => {
    const btn = document.querySelector(`.tab-btn[data-tab="${tabId}"] span`);
    if (btn) btn.textContent = tabMap[tabId];
  });

  // Tab Titles & Descriptions
  const titles = [
    { id: 'tab-voltagedrop', t: dict.t1_title, d: dict.t1_desc },
    { id: 'tab-analogloop', t: dict.t2_title, d: dict.t2_desc },
    { id: 'tab-smpsbudget', t: dict.t3_title, d: dict.t3_desc },
    { id: 'tab-cabinetcooling', t: dict.t4_title, d: dict.t4_desc },
    { id: 'tab-cabletable', t: dict.t5_title, d: dict.t5_desc },
    { id: 'tab-rs485', t: dict.t6_title, d: dict.t6_desc },
    { id: 'tab-pneumatics', t: dict.t7_title, d: dict.t7_desc },
    { id: 'tab-ductutility', t: dict.t8_title, d: dict.t8_desc },
    { id: 'tab-plcscaling', t: dict.t9_title, d: dict.t9_desc },
    { id: 'tab-motorcalc', t: dict.t10_title, d: dict.t10_desc },
    { id: 'tab-bendingradius', t: dict.t11_title, d: dict.t11_desc },
    { id: 'tab-articles', t: dict.t12_title, d: dict.t12_desc }
  ];

  titles.forEach(item => {
    const p = document.getElementById(item.id);
    if (p) {
      const h2 = p.querySelector('.main-title');
      if (h2) h2.textContent = item.t;
      const desc = p.querySelector('.main-desc');
      if (desc) desc.textContent = item.d;
    }
  });

  // Presets in Tab 1
  const pBtns = document.querySelectorAll('#tab-voltagedrop .pill-btn');
  if (pBtns.length >= 5) {
    pBtns[0].textContent = dict.t1_p1;
    pBtns[1].textContent = dict.t1_p2;
    pBtns[2].textContent = dict.t1_p3;
    pBtns[3].textContent = dict.t1_p4;
    pBtns[4].textContent = dict.t1_p5;
  }

  // Buttons in Tab 1
  const copySumBtn = document.querySelector('#copyResultSummaryBtn span');
  if (copySumBtn) copySumBtn.textContent = dict.btn_copy_summary;
  const copyMdBtn = document.querySelector('#copyMarkdownBtn span');
  if (copyMdBtn) copyMdBtn.textContent = dict.btn_copy_md;
  const reqQuoteBtn = document.querySelector('#openQuoteModalBtn span');
  if (reqQuoteBtn) reqQuoteBtn.textContent = dict.btn_req_quote;

  // AI Audit Title
  const aiBadge = document.querySelector('.audit-badge');
  if (aiBadge) aiBadge.innerHTML = `<i data-lucide="shield-check"></i> ${dict.t1_ai_badge}`;
  const aiH4 = document.querySelector('.audit-title-group h4');
  if (aiH4) aiH4.textContent = dict.t1_ai_title;

  // Recalculate everything to update verdicts and notes in current language
  calculateVoltageDrop();
  calculateAnalogLoop();
  calculateSmpsBudget();
  calculateCabinetCooling();
  calculateRS485();
  calculatePneumatics();
  calculateDuctFill();
  calculatePlcScaling();
  calculateMotorSpecs();
  calculateBendingRadius();

  if (window.lucide) window.lucide.createIcons();
}

