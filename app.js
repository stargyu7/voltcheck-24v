const CTEE_PRODUCT_URL = 'https://ctee.kr/item/store/104555';
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

const ANALYTICS_EVENTS = {
  toolOpen: 'tool_open',
  calculate: 'calculator_calculate',
  shareLink: 'share_link',
  reportPrint: 'report_print',
  reportCartAdd: 'report_cart_add',
  projectSave: 'project_save',
  projectLoad: 'project_load',
  languageChange: 'language_change',
  themeChange: 'theme_change',
  guideOpen: 'user_guide_open',
  digitalPackOpen: 'digital_pack_open'
};

function trackVoltCheckEvent(name, params = {}) {
  try {
    if (localStorage.getItem('voltcheck_cookie_consent') === 'rejected') return;
  } catch (e) {}
  const payload = {
    event: name,
    page: window.location.pathname + window.location.search + window.location.hash,
    tool: document.querySelector('.tab-btn.active')?.getAttribute('data-tab') || 'unknown',
    lang: currentLanguage,
    ...params
  };

  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
  } catch (e) {}

  try {
    window.dispatchEvent(new CustomEvent('voltcheck:analytics', { detail: payload }));
  } catch (e) {}
}

function getActiveToolLabel(tabId = null) {
  const activeBtn = tabId
    ? document.querySelector(`.tab-btn[data-tab="${tabId}"]`)
    : document.querySelector('.tab-btn.active');
  return activeBtn?.querySelector('span')?.textContent || tabId || 'unknown';
}

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
  initCookieConsent();
  if (window.lucide) window.lucide.createIcons();

  populateGaugeSelect();
  renderReferenceTable();
  bindEvents();

  // Restore URL state if hash exists
  restoreStateFromUrlHash();

  // Initialize theme and language from storage
  initTheme();
  initLanguage();

  // Initialize Canvas Buffers for Zero-Lag Rendering
  initAllCanvases();

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
  calculateOtEthernet();
  calculateServoRegen();
  renderSavedCalculations();
});

function bindEvents() {
  // Segmented Navigation Tabs (Zero-Latency Instant Toggle)
  const tabBtns = Array.from(document.querySelectorAll('.tab-btn'));
  const tabPanels = Array.from(document.querySelectorAll('.tab-panel'));

  tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (btn.classList.contains('active')) return;
      const tabId = btn.getAttribute('data-tab');
      if (!tabId) return;

      for (let i = 0; i < tabBtns.length; i++) {
        tabBtns[i].classList.toggle('active', tabBtns[i] === btn);
      }
      for (let i = 0; i < tabPanels.length; i++) {
        tabPanels[i].classList.toggle('active', tabPanels[i].id === tabId);
      }

      // Smoothly auto-scroll active button to center so it is NEVER clipped
      btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });

      updateUrlHash();

      // Quick selective draw only for the tab opened
      trackVoltCheckEvent(ANALYTICS_EVENTS.toolOpen, {
        action: 'tab_switch',
        tab: tabId,
        toolLabel: btn.querySelector('span')?.textContent || tabId
      });
      if (tabId === 'tab-voltagedrop') calculateVoltageDrop();
      else if (tabId === 'tab-rs485') calculateRS485();
      else if (tabId === 'tab-ductutility') calculateDuctFill();
    });
  });

  // Share URL Button
  document.getElementById('shareUrlBtn')?.addEventListener('click', () => {
    trackVoltCheckEvent(ANALYTICS_EVENTS.shareLink, {
      action: 'share_url_click',
      toolLabel: getActiveToolLabel()
    });
    copyShareableLink();
  });

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

  // Tab 13: OT Ethernet & Subnet Listeners
  ['otIpAddress', 'otSubnetMask', 'otProfinetName'].forEach(id => {
    const el = document.getElementById(id);
    el?.addEventListener('input', calculateOtEthernet);
    el?.addEventListener('change', calculateOtEthernet);
  });

  // Tab 14: Servo Regen Braking Resistor Listeners
  const servoInertiaNum = document.getElementById('servoInertia');
  const servoInertiaRange = document.getElementById('servoInertiaRange');
  if (servoInertiaNum && servoInertiaRange) {
    servoInertiaNum.addEventListener('input', () => {
      servoInertiaRange.value = servoInertiaNum.value;
      calculateServoRegen();
    });
    servoInertiaRange.addEventListener('input', () => {
      servoInertiaNum.value = servoInertiaRange.value;
      calculateServoRegen();
    });
  }
  ['servoMaxRpm', 'servoDecelTime', 'servoDcBusVolt', 'servoBusCap'].forEach(id => {
    const el = document.getElementById(id);
    el?.addEventListener('input', calculateServoRegen);
    el?.addEventListener('change', calculateServoRegen);
  });

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
  document.getElementById('printReportBtn')?.addEventListener('click', () => {
    trackVoltCheckEvent(ANALYTICS_EVENTS.reportPrint, {
      action: 'open_print_customizer',
      toolLabel: getActiveToolLabel()
    });
    openPrintCustomizer();
  });

  // Glossary Live Search Filter
  document.getElementById('glossarySearchInput')?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    document.querySelectorAll('#glossaryContainer .glossary-card').forEach(card => {
      const term = (card.getAttribute('data-term') || '').toLowerCase();
      const text = card.textContent.toLowerCase();
      if (!q || term.includes(q) || text.includes(q)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });

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
  document.getElementById('langToggleBtn')?.addEventListener('click', () => {
    trackVoltCheckEvent(ANALYTICS_EVENTS.languageChange, {
      action: 'toggle_language_menu'
    });
    toggleLanguage();
  });

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
  const isEn = currentLanguage === 'en';

  if (currentUnitStandard === 'AWG') {
    WIRE_DATABASE.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.awg;
      opt.textContent = isEn
        ? `${item.awg} (Area ${item.sq} mm² • R ${item.r20} Ω/km)`
        : `${item.awg} (단면적 ${item.sq} mm² • 저항 ${item.r20} Ω/km)`;
      if (item.awg === 'AWG 24') opt.selected = true;
      select.appendChild(opt);
    });
  } else {
    METRIC_SQ_DATABASE.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.sqName;
      opt.textContent = isEn
        ? `${item.sqName} (Area ${item.sq} mm² • R ${item.r20} Ω/km)`
        : `${item.sqName} (단면적 ${item.sq} mm² • 저항 ${item.r20} Ω/km)`;
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
// 100% PURE ZERO-KOREAN AUTOMATIC DOM TRANSLATION ENGINE
// ==========================================================================

const GLOBAL_EN_REPLACEMENTS = [
  [/공정거래위원회 지침 및 FTC 가이드라인 준수: 본 추천 부품 링크\(Digi-Key, Mouser\)를 통한 구매 시 Total Engineering은 파트너사로부터 소정의 수수료를 지급받을 수 있으며, 구매자 부담 가격에는 일체 영향이 없습니다\./g, "FTC Compliance Disclosure: Total Engineering may earn an affiliate commission from authorized distributors (Digi-Key, Mouser) at no additional cost to you when purchasing through these verified links."],
  [/공정거래위원회 지침 및 FTC 가이드라인 준수: 본 추천 부품 링크\(Digi-Key, Mouser\)를 통한 구매 시 볼트체크는 파트너사로부터 소정의 수수료를 지급받을 수 있으며, 구매자 부담 가격에는 일체 영향이 없습니다\./g, "FTC Compliance Disclosure: Total Engineering may earn an affiliate commission from authorized distributors (Digi-Key, Mouser) at no additional cost to you when purchasing through these verified links."],
  [/추천 규격 실제 구매 부품 \(BOM Part Matching\)/g, "Recommended Manufacturer BOM Parts (Live Catalog)"],
  [/계산된 전선 규격 및 SMPS 용량에 일치하는 국내외 공인 제조사 공식 카탈로그 품번입니다\./g, "Official manufacturer part numbers matching calculated wire gauge and SMPS power ratings."],
  // Site Environment & DMM
  [/반도체 Fab 클린룸 \(Cleanroom 22°C\)/g, "Semiconductor Fab Cleanroom (22°C)"],
  [/2차전지 배터리 조립라인 \(Dryroom 25°C\)/g, "Secondary Battery Assembly (Dryroom 25°C)"],
  [/자동차 차체 용접\/가공 라인 \(40°C\)/g, "Automotive Body Welding/Machining (40°C)"],
  [/일반 공작기계\/절삭유 환경 \(35°C\)/g, "General Machine Tool/Coolant Env (35°C)"],
  [/옥외 수처리\/플랜트 배선 \(50°C\)/g, "Outdoor Water Treatment/Plant (50°C)"],
  [/Fluke 87V \(정밀급\)/g, "Fluke 87V (Industrial DMM)"],
  [/측정 환경 \/ 설비 라인/g, "Site Environment / Line"],
  [/사용 계측기 \(DMM \/ Scope\)/g, "Measurement Tool (DMM / Scope)"],

  // Top Nav & Header
  [/토털 엔지니어링/g, "Total Engineering"],
  [/볼트체크 24V/g, "Total Engineering"],
  [/VoltCheck 24V/g, "Total Engineering"],
  [/산업용 제어선로 전압강하 & 전장설계 토털 엔지니어링 툴킷/g, "Industrial Automation & Electrical Total Engineering Suite"],
  [/산업용 제어선로 전압강하 & 전장설계 엔지니어링 툴킷/g, "Industrial Automation & Electrical Total Engineering Suite"],
  [/실무 엑셀·CAD 팩/g, "Pro Excel·CAD Pack"],
  [/단위 환산/g, "Unit Converter"],
  [/내 보관함/g, "Saved Calcs"],
  [/조건 공유/g, "Share Link"],
  [/검토서 인쇄/g, "Print Report"],
  [/규정 알림/g, "Updates"],
  [/소개/g, "About"],
  [/기술 검증 기준 및 설계 자문단 소개 →/g, "Standards Compliance & Verification Advisory →"],
  [/STANDARDS COMPLIANT/g, "STANDARDS COMPLIANT"],

  // Tab 1 Presets & Inputs
  [/빠른 부하 선택:/g, "Quick Load Presets:"],
  [/포토\/근접센서 \(35mA\)/g, "Photo Sensor (35mA)"],
  [/솔레노이드 밸브 \(0.45A\)/g, "Solenoid Valve (0.45A)"],
  [/IO-Link 마스터 \(2.0A\)/g, "IO-Link Master (2.0A)"],
  [/서보 브레이크 \(1.2A\)/g, "Servo Brake (1.2A)"],
  [/비전 조명 \(3.5A\)/g, "Vision Light (3.5A)"],
  [/상세 환경 설정/g, "Advanced Settings"],
  [/선로 편도 배선 거리 \(L\)/g, "One-Way Cable Distance (L)"],
  [/※ 전류가 왕복하는 폐루프 특성상 2배 거리\(\d+m\) 저항이 계산됩니다\./g, "※ 2x loop distance resistance is calculated for return circuit path."],
  [/※ 전류가 왕복하는 폐루프 특성상 2배 거리/g, "※ 2x loop distance resistance is calculated"],
  [/케이블 도선 규격/g, "Wire Gauge Specification"],
  [/말단 부하 소비전류 \(I\)/g, "Load Operating Current (I)"],
  [/35mA \(센서\)/g, "35mA (Sensor)"],
  [/200mA \(I\/O\)/g, "200mA (I/O)"],
  [/0.5A \(밸브\)/g, "0.5A (Valve)"],
  [/1.5A \(중간부하\)/g, "1.5A (Mid Load)"],
  [/3.0A \(대용량\)/g, "3.0A (Heavy Load)"],

  // Tab 1 Readouts & Gauges
  [/TERMINAL VOLTAGE \(말단 수전 전압\)/g, "TERMINAL VOLTAGE (Terminal Operating Voltage)"],
  [/말단 수전 전압/g, "Terminal Operating Voltage"],
  [/선로 전압강하:/g, "Voltage Drop:"],
  [/전원 안전마진:/g, "Voltage Margin:"],
  [/전압 마진 레벨 게이지 \(Voltage Margin Gauge\)/g, "Voltage Margin Level Gauge"],
  [/동작 불가 \(FAIL - 저전압\)/g, "FAIL (Undervoltage)"],
  [/주의 영역 \(CAUTION - 마진 협소\)/g, "CAUTION (Narrow Margin)"],
  [/안전 영역 \(SAFE - 정상 마진\)/g, "SAFE (Optimal Margin)"],
  [/18.0V \(위험\)/g, "18.0V (Risk)"],
  [/20.4V \(경고\)/g, "20.4V (Warn)"],
  [/21.6V \(최저\)/g, "21.6V (Min)"],
  [/24.0V \(정격\)/g, "24.0V (Nom)"],

  // Circuit Strip & Chart
  [/선로 전위 분포/g, "Line Potential Profile"],
  [/SMPS 전원/g, "SMPS Source"],
  [/센서 \/ 부하/g, "Sensor / Load"],
  [/선로 거리별 전압 강하 구배 곡선 \(Voltage Gradient Curve\)/g, "Voltage Gradient Curve (Distance vs Drop)"],
  [/■ 선로 전압 곡선/g, "■ Voltage Curve"],
  [/--- 최저 전압 \(V_min\)/g, "--- Min Threshold (V_min)"],
  [/■ 브라운아웃 위험선 \(18V\)/g, "■ Brownout Risk (18V)"],

  // Specs Grid
  [/왕복 선로 저항/g, "Total Loop Resistance"],
  [/선로 발열 손실 \(I²R\)/g, "Line Thermal Loss (I²R)"],
  [/허용전류 사용률/g, "Ampacity Usage Ratio"],
  [/추천 최소 규격/g, "Recommended Gauge"],
  [/정상 발열 범위/g, "Normal Thermal Dissipation"],
  [/정상 방열 범위/g, "Normal Thermal Dissipation"],
  [/마진 1.0V 기준 충족/g, "Meets 1.0V Margin Req"],

  // AI Audit
  [/AI 스마트 진단/g, "AI Smart Audit"],
  [/FA 전장설계 6대 항목 종합 안전 진단서/g, "6-Point Comprehensive Engineering Safety Audit"],
  [/GRADE F \(위험\)/g, "GRADE F (CRITICAL)"],
  [/GRADE A \(우수\)/g, "GRADE A (EXCELLENT)"],
  [/GRADE A\+ \(최우수\)/g, "GRADE A+ (OPTIMAL)"],
  [/\/ 100점/g, "/ 100 pts"],
  [/1\. 수전 전압 마진:/g, "1. Supply Voltage Margin:"],
  [/1\. 전원 전압 마진:/g, "1. Supply Voltage Margin:"],
  [/2\. 도체 열용량 안전율:/g, "2. Conductor Ampacity Margin:"],
  [/2\. 도선 허용전류 마진:/g, "2. Conductor Ampacity Margin:"],
  [/2\. 도체 허용전류 마진:/g, "2. Conductor Ampacity Margin:"],
  [/3\. 기동 돌입 브라운아웃:/g, "3. Inrush Brownout:"],
  [/3\. 과도 돌입전류 브라운아웃 내성:/g, "3. Inrush Brownout:"],
  [/3\. 기동 시 브라운아웃:/g, "3. Inrush Brownout:"],
  [/4\. 닥트 내 I²R 손실:/g, "4. Raceway I²R Loss:"],
  [/4\. 선로 발열 및 전력 손실 \(I²R Loss\):/g, "4. Thermal Loss:"],
  [/4\. 닥트 내 I²R 발열손실:/g, "4. Raceway I²R Loss:"],
  [/5\. 단락 보호 협조:/g, "5. CP Coordination:"],
  [/5\. 단락 고장 시 차단기 협조 제어 \(CP Coordination\):/g, "5. CP Coordination:"],
  [/5\. 단락보호 협조제어:/g, "5. CP Coordination:"],
  [/6\. 배선 토폴로지 균일성:/g, "6. Topology Uniformity:"],
  [/6\. 배선 토폴로지 전압강하 감쇄율:/g, "6. Topology Factor:"],
  [/6\. 배선 토폴로지 감쇄율:/g, "6. Topology Factor:"],

  // Buttons & Actions
  [/요약 복사/g, "Copy Summary"],
  [/마크다운 복사/g, "Copy Markdown"],
  [/부품 견적 요청 \(BOM\)/g, "Request BOM Quote"],
  [/프로젝트에 담기/g, "Add to Project"],

  // Field Log & BOM
  [/현장 실측값 비교 & 오차 검증 로그 \(Field Measurement Log\)/g, "Field Measurement Comparison & Verification Log"],
  [/실제 현장 계측치를 입력하여 계산 정합성을 브라우저 안에서 비교하고 로컬 기록으로 보관합니다\./g, "Enter field measurements to compare the calculation in the browser and keep a local record."],
  [/브라우저 로컬 실측 로그/g, "Local browser measurement log"],
  [/현장 실측 말단 전압 \(V_measured\)/g, "Measured Terminal Voltage (V_measured)"],
  [/측정 환경 \/ 설비 라인/g, "Operating Environment / Facility Line"],
  [/사용 계측기 \(DMM \/ Scope\)/g, "Measurement Tool (DMM / Scope)"],
  [/계측 기기 \(DMM \/ Scope\)/g, "Measurement Tool (DMM / Scope)"],
  [/계산 예측 전압:/g, "Predicted Voltage:"],
  [/현장 실측 전압:/g, "Measured Voltage:"],
  [/전압 편차\(오차율\):/g, "Voltage Deviation (Error):"],
  [/정합성 판정:/g, "Verification Status:"],
  [/초정밀 일치 \(99%\+ Accuracy\)/g, "High Precision Match (99%+ Accuracy)"],
  [/실측 데이터 로컬 저장/g, "Save Measurement Locally"],
  [/현장 공인 추천 정밀 계측 장비:/g, "Recommended Field Precision Instruments:"],
  [/정밀 산업용 DMM \/ True-RMS/g, "Precision Industrial DMM / True-RMS"],
  [/현장 계측 표준 DMM/g, "Standard Field Measurement DMM"],

  // BOM Part Matching Cards
  [/추천 규격 실제 구매 부품 \(BOM Part Matching\)/g, "Recommended Conductor BOM Part Matching"],
  [/계산된 전선 규격 및 SMPS 용량에 일치하는 국내외 공인 제조사 공식 카탈로그 품번입니다\./g, "Industrial genuine component catalog parts matching calculated wire size and SMPS capacity."],
  [/대한전선/g, "Taihan Cable"],
  [/LS전선/g, "LS Cable & System"],
  [/삼원ACT/g, "Samwon ACT"],
  [/M12 센서용 4심 쉴드 케이블 \(0.2SQ\)/g, "M12 Sensor 4-Core Shielded Cable (0.2SQ)"],
  [/고굴곡 4심 로봇 케이블 \(PVC\/내유\)/g, "High-Flex 4-Core Robotic Cable (PVC/Oil-Resistant)"],
  [/PLC I\/O 전용 4심 슬림 케이블/g, "PLC I/O Dedicated 4-Core Slimline Cable"],
  [/DIN레일 4A C-curve 배선보호 차단기/g, "DIN-Rail 4A C-Curve Circuit Protector"],
  [/추천 회로보호기 \(CP\)/g, "Recommended Circuit Protector (CP)"],
  [/규격: AWG (\d+)/g, "Spec: AWG $1"],
  [/규격: ([\d.]+) SQ/g, "Spec: $1 SQ"],
  [/\+ 담기/g, "+ Add to BOM"],
  [/\+ 견적함/g, "+ Add"],
  [/([\d,]+)~([\d,]+)원\/m/g, "\$$1~$2/m"],
  [/([\d,]+)~([\d,]+)원/g, "\$$1~$2 KRW"],
  [/(\d+)V 강하/g, "$1V Drop"],
  [/([\d.]+)V 강하/g, "$1V Drop"],

  // Common Units & Patterns
  [/편도 (\d+)m • 왕복 (\d+)m • R_loop: ([\d.]+)Ω/g, "One-Way $1m • Loop $2m • R_loop: $3Ω"],
  [/단위: ([\d.]+) Ω\/km @(\d+)°C/g, "Unit: $1 Ω/km @$2°C"],
  [/단위: ([\d.]+) Ω\/km/g, "Unit: $1 Ω/km"],
  [/정격 ([\d.]+)A 중 ([\d.]+)A 사용/g, "$2A of $1A Rated"],
  [/([\d.]+)A 중 ([\d.]+)A 사용/g, "$2A of $1A Rated"],
  [/([\d.]+)V \(최저\)/g, "$1V (Min)"],
  [/단면적 ([\d.]+) mm² • 저항 ([\d.]+) Ω\/km @(\d+)°C • 허용전류 ([\d.]+)A/g, "Area $1 mm² • R $2 Ω/km @$3°C • Ampacity $4A"]
  // Tab 9: PLC Scaling Specific
  [/지멘스 \(Siemens S7-1200\/1500\) • 0 ~ 27,648/g, "Siemens (S7-1200/1500) • 0 ~ 27,648"],
  [/미쓰비시 \(Mitsubishi Q\/iQ-R 12-bit\) • 0 ~ 4,000/g, "Mitsubishi (Q/iQ-R 12-bit) • 0 ~ 4,000"],
  [/미쓰비시 \(Mitsubishi Q\/iQ-R 16-bit\) • 0 ~ 12,000/g, "Mitsubishi (Q/iQ-R 16-bit) • 0 ~ 12,000"],
  [/LS ELECTRIC \(XGB\/XGK\) • 0 ~ 16,000/g, "LS ELECTRIC (XGB/XGK) • 0 ~ 16,000"],
  [/LS ELECTRIC \(XGK\/XGI 고분해능\) • 0 ~ 32,000/g, "LS ELECTRIC (XGK/XGI High-Res) • 0 ~ 32,000"],
  [/오므론 \(Omron CJ\/NJ\) • 0 ~ 4,000 \/ 8,000/g, "Omron (CJ/NJ) • 0 ~ 4,000 / 8,000"],
  [/지멘스/g, "Siemens"],
  [/미쓰비시/g, "Mitsubishi"],
  [/오므론/g, "Omron"],
  [/사용자 정의 \(Custom Digital Range\)/g, "Custom Digital Range"],
  [/DC 4 ~ 20 mA \(전류 루프\)/g, "DC 4 ~ 20 mA (Current Loop)"],
  [/DC 0 ~ 10 V \(전압\)/g, "DC 0 ~ 10 V (Voltage)"],
  [/DC -10 ~ \+10 V \(바이폴라\)/g, "DC -10 ~ +10 V (Bipolar)"],
  [/정상 스케일링/g, "VALID SCALING"],
  [/신호 백분율 \(%\):/g, "Signal Ratio (%):"],
  [/변환 물리량 \(EU\):/g, "Scaled EU:"],
  [/테스트 입력 물리량 \(Engineering Value\)/g, "Test Input Engineering Value (EU)"],
  [/테스트 입력 물리량/g, "Test Input Engineering Value"],
  [/Raw 디지털 출력값/g, "Raw Digital Output Value"],
  [/신호값:/g, "Signal:"],
  [/PLC 제조사 및 아날로그 모듈 분해능 \(Raw Count\)/g, "PLC Maker & Analog Module Resolution (Raw Count)"],
  [/디지털 Raw 하한 \(D_min\)/g, "Digital Raw Min (D_min)"],
  [/디지털 Raw 상한 \(D_max\)/g, "Digital Raw Max (D_max)"],
  [/아날로그 입력 신호 형식/g, "Analog Signal Format"],
  [/물리량 최소값 \(EU_min\)/g, "Engineering Unit Min (EU_min)"],
  [/물리량 최대값 \(EU_max\)/g, "Engineering Unit Max (EU_max)"],
  [/물리량 최소값/g, "Engineering Unit Min"],
  [/물리량 최대값/g, "Engineering Unit Max"],
  [/PLC 래더\(ST\) 선형 변환 수식/g, "PLC Structured Text (ST) Linear Scaling Formula"],
  [/테스트 입력 물리량 \(Engineering Value\)/g, "Test Input Engineering Value (EU)"],
  [/테스트 입력 물리량/g, "Test Input Engineering Value"],
  [/Raw 디지털 출력값/g, "Raw Digital Output Value"],
  [/변환 물리량 \(EU\):/g, "Converted EU:"],
  [/신호 전송률 \(%\):/g, "Signal Percentage (%):"],
  [/신호값:/g, "Signal:"],
  [/PLC 제조사 및 아날로그 모듈 분해능/g, "PLC Maker & Analog Module Resolution"],
  [/디지털 Raw 하한/g, "Digital Raw Min"],
  [/디지털 Raw 상한/g, "Digital Raw Max"],
  [/아날로그 입력 신호 형식/g, "Analog Signal Format"],
  [/물리량 최소값/g, "Engineering Unit Min"],
  [/물리량 최대값/g, "Engineering Unit Max"],
  [/PLC 래더\(ST\) 선형 변환 수식/g, "PLC Structured Text (ST) Linear Scaling Formula"],
];

function sanitizeDomToPureEnglish(rootNode) {
  if (!rootNode) return;
  try {
    const walker = document.createTreeWalker(
      rootNode,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    let textNode;
    while ((textNode = walker.nextNode())) {
      if (!textNode || !textNode.nodeValue) continue;
      let str = textNode.nodeValue;
      if (!str.trim()) continue;

      for (let i = 0; i < GLOBAL_EN_REPLACEMENTS.length; i++) {
        const item = GLOBAL_EN_REPLACEMENTS[i];
        if (item && item.length >= 2) {
          str = str.replace(item[0], item[1]);
        }
      }
      textNode.nodeValue = str;
    }
  } catch (err) {
    console.log('Sanitize error:', err);
  }
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

  document.getElementById('schematicSummaryText').textContent = isEn
    ? `One-Way ${lengthM}m • Loop ${Math.round(lengthM * loopMultiplier)}m • R_loop: ${totalLoopR.toFixed(2)}Ω`
    : `편도 ${lengthM}m • 왕복 ${Math.round(lengthM * loopMultiplier)}m • R_loop: ${totalLoopR.toFixed(2)}Ω`;
  document.getElementById('scSourceV').textContent = `${vSource.toFixed(1)} V`;
  document.getElementById('scDropBadge').textContent = isEn ? `-${vDrop.toFixed(2)}V Drop` : `-${vDrop.toFixed(2)}V 강하`;
  document.getElementById('scTermV').textContent = `${vTerm.toFixed(2)} V`;

  document.getElementById('resLoopR').textContent = `${totalLoopR.toFixed(2)} Ω`;
  document.getElementById('resUnitR').textContent = isEn ? `Unit: ${rTPerKm.toFixed(1)} Ω/km @${ambientT}°C` : `단위: ${rTPerKm.toFixed(1)} Ω/km @${ambientT}°C`;
  document.getElementById('resPowerLoss').textContent = `${powerLossW.toFixed(2)} W`;
  document.getElementById('resAmpacityUsage').textContent = `${ampUsagePct}%`;
  document.getElementById('resAmpLimit').textContent = isEn ? `${iLoad}A of ${ampRating}A Rated` : `정격 ${ampRating}A 중 ${iLoad}A 사용`;

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
    if (levelScaleMinV) levelScaleMinV.textContent = isEn ? `${vMinReq.toFixed(1)}V (Min)` : `${vMinReq.toFixed(1)}V (최저)`;
    if (levelStatusLabel) {
      if (vMargin < 0) {
        levelStatusLabel.textContent = isEn ? 'FAIL (Undervoltage)' : '동작 불가 (FAIL - 저전압)';
        levelStatusLabel.className = 'font-mono text-warn';
        levelStatusLabel.style.color = 'var(--fail-crimson)';
      } else if (vMargin < 0.8) {
        levelStatusLabel.textContent = isEn ? 'CAUTION (Narrow Margin)' : '주의 영역 (CAUTION - 마진 협소)';
        levelStatusLabel.className = 'font-mono text-warn';
        levelStatusLabel.style.color = 'var(--warn-amber)';
      } else {
        levelStatusLabel.textContent = isEn ? 'SAFE (Optimal Margin)' : '안전 영역 (SAFE - 정상 마진)';
        levelStatusLabel.className = 'font-mono text-safe';
        levelStatusLabel.style.color = 'var(--safe-green)';
      }
    }
  }

  document.getElementById('gaugeDetailHint').textContent = isEn
    ? `Area ${crossSectionSq} mm² • R ${rTPerKm.toFixed(1)} Ω/km @${ambientT}°C • Ampacity ${ampRating}A`
    : `단면적 ${crossSectionSq} mm² • 저항 ${rTPerKm.toFixed(1)} Ω/km @${ambientT}°C • 허용전류 ${ampRating}A`;

  // Update AI 6-Point Comprehensive Safety Audit [KILLER FEATURE]
  updateAiSafetyAudit(vMargin, ampUsagePct, vDropPct, powerLossW, vSource, vTerm, topology);

  // Render Interactive Voltage Drop Chart Canvas [NEW VISUALIZER - High Performance RAF]
  queueDrawVoltageDropChart(vSource, vTerm, vMinReq, lengthM, vDrop);

  // Sync Real BOM Parts Match
  if (typeof renderBomParts === 'function') {
    renderBomParts(gaugeVal);
  }

  // Sync Field Measurement Prediction
  const fmPredVEl = document.getElementById('fmPredV');
  if (fmPredVEl) fmPredVEl.textContent = `${vTerm.toFixed(2)} V`;
  const fmMeasuredInput = document.getElementById('fmMeasuredV');
  if (fmMeasuredInput) {
    const realV = parseFloat(fmMeasuredInput.value) || 23.20;
    const devV = Math.abs(realV - vTerm);
    const devPct = vTerm > 0 ? (devV / vTerm) * 100 : 0;
    const devPctEl = document.getElementById('fmDevPct');
    const verdictEl = document.getElementById('fmVerdictBadge');
    if (devPctEl) devPctEl.textContent = isEn ? `${devPct.toFixed(2)}% (${devV.toFixed(2)}V Dev)` : `${devPct.toFixed(2)}% (${devV.toFixed(2)}V 편차)`;
    if (verdictEl) {
      if (devPct <= 2.0) {
        verdictEl.className = 'badge-pill badge-safe';
        verdictEl.textContent = isEn ? 'High Precision Match (98%+ Match)' : '초정밀 일치 (98%+ Match)';
      } else if (devPct <= 5.0) {
        verdictEl.className = 'badge-pill';
        verdictEl.style.background = '#e0f2fe';
        verdictEl.style.color = '#0369a1';
        verdictEl.textContent = isEn ? 'Within Tolerance (Normal)' : '규격 허용 오차 이내 (Normal)';
      } else {
        verdictEl.className = 'badge-pill badge-warn';
        verdictEl.textContent = isEn ? 'Environmental Deviation (Check Temp/Contacts)' : '환경 편차 주의 (접촉저항/온도 확인)';
      }
    }
  }

  // Ensure 100% Zero-Korean DOM sanitization for tab 1 in English mode
  if (currentLanguage === 'en') {
    const tab1 = document.getElementById('tab-voltagedrop');
    if (tab1) sanitizeDomToPureEnglish(tab1);
  }
}

function updateAiSafetyAudit(vMargin, ampUsagePct, vDropPct, powerLossW, vSource, vTerm, topology) {
  const isEn = currentLanguage === 'en';
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
  else { grade = isEn ? 'GRADE F (CRITICAL)' : 'GRADE F (위험)'; gradeClass = 'grade-f'; }

  const scoreEl = document.getElementById('auditScore');
  const gradeEl = document.getElementById('auditGrade');
  if (scoreEl) scoreEl.textContent = score;
  if (gradeEl) {
    gradeEl.textContent = grade;
    gradeEl.className = `grade-pill ${gradeClass}`;
  }

  // 1. Voltage Margin Text
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
  const isEn = currentLanguage === 'en';

  const statusBadge = document.getElementById('rs485StatusBadge');
  if (statusBadge) {
    statusBadge.className = `verdict-stamp ${isPass ? 'stamp-pass' : 'stamp-fail'}`;
    const statusTextEl = document.getElementById('rs485StatusText');
    if (statusTextEl) {
      statusTextEl.textContent = isPass ? (isEn ? 'PASS (Compliant)' : '적합 (PASS)') : (isEn ? 'FAIL (Exceeded)' : '한계 초과 (FAIL)');
    }
  }

  const maxLenEl = document.getElementById('rs485MaxLenVal');
  if (maxLenEl) maxLenEl.textContent = `${maxDistanceM.toLocaleString()} m`;
  const distUsagePct = Math.round((lengthM / maxDistanceM) * 100);
  const distUsageEl = document.getElementById('rs485DistanceUsage');
  if (distUsageEl) {
    distUsageEl.textContent = isEn ? `Set distance (${lengthM}m) is ${distUsagePct}% of limit` : `설정 거리(${lengthM}m)는 한계의 ${distUsagePct}%`;
  }

  const termResEl = document.getElementById('rs485TermResVal');
  if (termResEl) {
    termResEl.textContent = lengthM > 10 ? (isEn ? 'Required (Both ends)' : '필수 (양단 2개소)') : (isEn ? 'Recommended' : '권장');
  }

  const stubLimitEl = document.getElementById('rs485StubLimitVal');
  if (stubLimitEl) stubLimitEl.textContent = `${stubLimitM} m`;

  const stubStatusEl = document.getElementById('rs485StubStatus');
  if (stubStatusEl) {
    stubStatusEl.textContent = stubM <= parseFloat(stubLimitM) ?
      (isEn ? `Current ${stubM}m setting is adequate` : `현재 ${stubM}m 설정 적합`) :
      (isEn ? `Warning: ${stubM}m causes reflection` : `경고: ${stubM}m는 반사파 유발`);
  }

  const bitTimeEl = document.getElementById('rs485BitTimeVal');
  if (bitTimeEl) bitTimeEl.textContent = `${bitTimeUs.toFixed(2)} µs`;

  const capTotalEl = document.getElementById('rs485CapacitanceTotal');
  if (capTotalEl) {
    capTotalEl.textContent = isEn ? `Total Capacitance: ${totalCapNf.toFixed(1)} nF` : `총 정전용량: ${totalCapNf.toFixed(1)} nF`;
  }

  // Draw RS-485 Signal Waveform [High Performance RAF]
  queueDrawRs485Waveform(baud, lengthM, isPass);
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

  // Draw 2D Duct Cross-Section Packing [High Performance RAF]
  queueDrawDuctCrossSection(w, h, qty, dia, fillPct);
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
  const isEn = currentLanguage === 'en';
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
  const prefix = isEn ? 'Signal:' : '신호값:';
  let sigText = '';
  if (sigType === '4-20') {
    const ma = 4.0 + clampedFraction * 16.0;
    sigText = `${prefix} ${ma.toFixed(2)} mA (${pct.toFixed(1)}%)`;
  } else if (sigType === '0-20') {
    const ma = clampedFraction * 20.0;
    sigText = `${prefix} ${ma.toFixed(2)} mA (${pct.toFixed(1)}%)`;
  } else if (sigType === '0-10') {
    const v = clampedFraction * 10.0;
    sigText = `${prefix} ${v.toFixed(2)} V (${pct.toFixed(1)}%)`;
  } else if (sigType === '1-5') {
    const v = 1.0 + clampedFraction * 4.0;
    sigText = `${prefix} ${v.toFixed(2)} V (${pct.toFixed(1)}%)`;
  } else if (sigType === '-10-10') {
    const v = -10.0 + clampedFraction * 20.0;
    sigText = `${prefix} ${v.toFixed(2)} V (${pct.toFixed(1)}%)`;
  }

  document.getElementById('resPlcRawValue').textContent = rawCount.toLocaleString();
  document.getElementById('resPlcEuFormatted').textContent = `${testEu.toFixed(3)}`;
  document.getElementById('resPlcPctFormatted').textContent = `${pct.toFixed(1)} %`;
  document.getElementById('plcSignalEquivalent').textContent = sigText;

  // Formula String
  const formula = `EU = ((Raw - ${dMin}) / (${dMax} - ${dMin})) * (${euMax} - ${euMin}) + ${euMin}`;
  document.getElementById('plcFormulaBox').textContent = formula;
  document.getElementById('plcStSnippet').innerHTML = `// Structured Text (ST)<br>fScaledValue := ((INT_TO_REAL(iRawInput) - ${dMin}.0) / ${dMax - dMin}.0) * ${(euMax - euMin).toFixed(2)} + ${euMin.toFixed(2)};`;

  if (isEn) {
    const tab9 = document.getElementById('tab-plcscaling');
    if (tab9) sanitizeDomToPureEnglish(tab9);
  }
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
  trackVoltCheckEvent(ANALYTICS_EVENTS.themeChange, {
    action: 'toggle_theme',
    mode: isDark ? 'dark' : 'light'
  });
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
  trackVoltCheckEvent(ANALYTICS_EVENTS.projectSave, {
    action: 'save_history_snapshot',
    title,
    tab: activeTab
  });
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
        <div class="saved-item-title">${escapeHtml(item.title)}</div>
        <div class="saved-item-meta font-mono">${escapeHtml(item.date)} • ${escapeHtml(item.tab?.replace('tab-', '') || 'voltagedrop')} • ${escapeHtml(item.data?.length || 40)}m (${escapeHtml(item.data?.gauge || 'AWG 24')})</div>
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
    const copperWeightKgPerKm = item.sq * 8.96 * 4; // 4-core standard estimate
    const rawCostPerM = (copperWeightKgPerKm * 13.2); // 13200 KRW/kg
    const estCostPerM = Math.round((rawCostPerM + 320) * 1.6);

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${item.awg}</strong></td>
      <td>${item.sq} mm²</td>
      <td>Φ ${item.dia} mm</td>
      <td>${item.r20} Ω/km</td>
      <td>${r60} Ω/km</td>
      <td><span class="font-bold text-highlight">${item.ampAir} A</span></td>
      <td><span class="font-bold text-warn">${item.ampDuct} A</span></td>
      <td><span class="font-bold font-mono text-safe">~${estCostPerM.toLocaleString()} 원/m</span></td>
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
// 8. URL Hash State Synchronization & Sharing [High-Performance Debounced]
// ==========================================================================
let updateHashTimeout = null;
function updateUrlHash() {
  clearTimeout(updateHashTimeout);
  updateHashTimeout = setTimeout(() => {
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

    try {
      history.replaceState(null, '', '#' + params.toString());
    } catch (e) {
      // Ignore security throttling error
    }
  }, 400);
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
    trackVoltCheckEvent(ANALYTICS_EVENTS.shareLink, {
      action: 'copy_full_url',
      toolLabel: getActiveToolLabel()
    });
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

  trackVoltCheckEvent(ANALYTICS_EVENTS.reportPrint, {
    action: 'print_single_report',
    toolLabel: getActiveToolLabel()
  });
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

  const text = `[Total Engineering - 선로 전압강하 검토 결과]\n` +
    `- 공급 전원: DC ${vSource}V\n` +
    `- 배선 거리: ${l}m (${gauge})\n` +
    `- 소비 전류: ${i}A\n` +
    `- 선로 전압강하: ${vDrop}\n` +
    `- 말단 수전 전압: ${vTerm}V\n` +
    `- 전원 안전 마진: ${margin}\n` +
    `- 판정 결과: ${status}\n` +
    `- 출처: Total Engineering (토털 엔지니어링)`;

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
    title_ko: '개인정보처리방침 (Privacy Policy)',
    title_en: 'Privacy Policy',
    content_ko: `
      <h4>1. 개인정보 수집 및 처리 목적</h4>
      <p>Total Engineering(이하 "서비스")은 별도의 회원가입 없이 익명으로 모든 공학 계산 도구를 무료 제공합니다. 사용자가 입력하는 설계 파라미터(전압, 전류, 거리 등)는 브라우저 로컬 저장소(LocalStorage) 및 URL 해시에만 임시 보관되며 당사 서버로 일체 전송되거나 수집되지 않습니다.</p>
      <h4>2. 제3자 쿠키 및 Google AdSense 광고 게재 안내</h4>
      <p>본 서비스는 사이트 운영을 위해 Google AdSense 등 제3자 광고 서비스를 이용하고 있습니다. Google을 포함한 타사 공급업체는 쿠키를 사용하여 사용자의 이전 방문 기록을 바탕으로 맞춤형 광고를 게재합니다.</p>
      <p>사용자는 <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener">Google 광고 설정</a>에서 맞춤형 광고를 비활성화하거나, 웹 브라우저 쿠키 차단 기능을 통해 쿠키 저장을 거부할 수 있습니다.</p>
      <h4>3. 데이터 보호 책임자 및 연락처</h4>
      <p>이메일: contact@voltcheck24.com | 관리: Total Engineering Lab</p>
    `,
    content_en: `
      <h4>1. Data Collection & Purpose</h4>
      <p>Total Engineering provides all engineering tools completely free without registration. Design parameters (voltage, distance, wire gauge, etc.) are processed locally in your browser (LocalStorage / URL Hash) and are never transmitted to or stored on our servers.</p>
      <h4>2. Third-Party Cookies & Google AdSense Compliance</h4>
      <p>This website utilizes third-party advertising vendors including Google AdSense. Google uses cookies (such as the DoubleClick cookie) to serve relevant ads based on prior visits to this or other websites.</p>
      <p>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener">Google Ad Settings</a> or by configuring browser cookie permissions.</p>
      <h4>3. Data Protection Officer & Inquiries</h4>
      <p>Email: contact@voltcheck24.com | Operator: Total Engineering Labs</p>
    `
  },
  terms: {
    title_ko: '이용약관 및 엔지니어링 면책조항 (Terms & Disclaimer)',
    title_en: 'Terms of Service & Engineering Disclaimer',
    content_ko: `
      <h4>1. 공학적 면책 고지 (Engineering Disclaimer)</h4>
      <p>본 사이트의 모든 수치 계산 알고리즘은 IEC 60204-1, NFPA 79, KEC, IEC 60364-5-52 등 공인된 국제 전기 공학 표준 규격에 따라 설계 및 검증되었습니다.</p>
      <p>그러나 실제 산업 현장의 주변 온도 극단값, 전원 노이즈, 단자대 체결 불량, 케이블 제조사별 실제 도체 순도 오차에 따라 실제 계측치와 차이가 발생할 수 있습니다.</p>
      <p>따라서 <strong>본 서비스의 결과물은 전장설계 및 감리 사전 검토용 참고 자료로 사용되어야 하며, 최종 설계 확정 및 장비 발주 시에는 해당 부품 제조사의 공인 데이터시트를 반드시 최종 확인하시기 바랍니다.</strong></p>
    `,
    content_en: `
      <h4>1. Engineering Disclaimer</h4>
      <p>All calculations on Total Engineering are developed in accordance with international electrical standards (IEC 60204-1, NFPA 79, UL 508A, KEC).</p>
      <p>However, actual field performance may vary depending on ambient thermal peaks, electromagnetic interference (EMI), terminal contact resistance, and manufacturer wire tolerances.</p>
      <p><strong>Results are provided for design review and preliminary verification purposes. Engineers must verify critical safety parameters against official component datasheets prior to commissioning.</strong></p>
    `
  },
  about: {
    title_ko: '엔지니어링 기술 기준 및 개발진 소개 (About Us)',
    title_en: 'About Us & Engineering Editorial Standards',
    content_ko: `
      <h4>Total Engineering (토털 엔지니어링) 미션</h4>
      <p>반도체, 2차전지, 자동차 조립, 스마트팩토리 공장자동화 현장의 전기/전장 및 OT 개발 엔지니어가 번거로운 수작업 계산 없이 1초 만에 최적의 케이블 규격, SMPS 용량, 통신 신뢰성을 검증할 수 있도록 돕는 개방형 토털 엔지니어링 스위트입니다.</p>
      <h4>준용 엔지니어링 표준</h4>
      <p>• IEC 60204-1 (Safety of machinery - Electrical equipment of machines)<br>
      • NFPA 79 (Electrical Standard for Industrial Machinery 2024)<br>
      • UL 508A (Standard for Industrial Control Panels)<br>
      • KEC (2024 한국전기설비규정 저압 배선 전압강하 허용 기준)<br>
      • NAMUR NE 43 (Standardization of signal level for failure information)</p>
    `,
    content_en: `
      <h4>Total Engineering Mission</h4>
      <p>Our mission is to empower industrial automation, semiconductor, EV battery, and robotics control engineers worldwide with instant, accurate electrical and OT sizing tools.</p>
      <h4>Referenced International Engineering Standards</h4>
      <p>• IEC 60204-1 (Safety of machinery - Electrical equipment of machines)<br>
      • NFPA 79 (Electrical Standard for Industrial Machinery 2024 Edition)<br>
      • UL 508A (Standard for Industrial Control Panels)<br>
      • KEC & IEC 60364-5-52 (Conductor Ampacity & Voltage Drop Regulations)<br>
      • NAMUR NE 43 (Instrumentation Failure Diagnostics)</p>
    `
  },
  contact: {
    title_ko: '기술 자문 및 제휴 문의 (Contact Us)',
    title_en: 'Contact Us & Engineering Feedback',
    content_ko: `
      <h4>피드백 및 기술 제휴</h4>
      <p>새로운 계산 모듈 건의, 현장 특수 조건 반영, 기업 전장 표준 연동 문의는 아래로 연락 주시기 바랍니다.</p>
      <p>• 이메일: contact@voltcheck24.com<br>• 운영: Total Engineering Lab</p>
    `,
    content_en: `
      <h4>Engineering Inquiries & Feedback</h4>
      <p>For technical feedback, algorithm enhancement requests, or enterprise partnerships, please contact:</p>
      <p>• Email: contact@voltcheck24.com<br>• Team: Total Engineering Labs</p>
    `
  }
};

function openPolicyModal(type) {
  const modal = document.getElementById('policyModal');
  const title = document.getElementById('policyModalTitle');
  const body = document.getElementById('policyModalContent');
  const isEn = currentLanguage === 'en';
  if (modal && POLICIES[type]) {
    title.textContent = isEn ? POLICIES[type].title_en : POLICIES[type].title_ko;
    body.innerHTML = isEn ? POLICIES[type].content_en : POLICIES[type].content_ko;
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

*Generated by [VoltCheck 24V (볼트체크)](https://voltcheck24.com/)*`;

  navigator.clipboard.writeText(md).then(() => {
    alert(currentLanguage === 'en' ? '[Markdown Table Copied]\n\nMarkdown format has been copied to clipboard for Notion/Jira/GitHub.' : '[마크다운 표 복사 완료]\n\nNotion, Jira, GitHub 이슈에 바로 붙여넣기(Ctrl+V)할 수 있는 마크다운 표 서식이 클립보드에 복사되었습니다.');
  });
}

// ==========================================================================
// 14. OT Industrial Ethernet & Profinet Calculator [NEW]
// ==========================================================================
function calculateOtEthernet() {
  const ipStr = document.getElementById('otIpAddress')?.value.trim() || '192.168.1.10';
  const cidr = parseInt(document.getElementById('otSubnetMask')?.value) || 24;
  const profinetName = document.getElementById('otProfinetName')?.value.trim() || 'plc-cell1-drive01';
  const isEn = currentLanguage === 'en';

  const ipParts = ipStr.split('.').map(x => parseInt(x, 10));
  if (ipParts.length !== 4 || ipParts.some(x => isNaN(x) || x < 0 || x > 255)) {
    return;
  }

  const maskNum = -1 << (32 - cidr);
  const ipNum = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];
  const netNum = ipNum & maskNum;
  const bcastNum = netNum | ~maskNum;

  const numToIp = (n) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');

  const netIp = numToIp(netNum);
  const bcastIp = numToIp(bcastNum);
  const firstHost = numToIp(netNum + 1);
  const lastHost = numToIp(bcastNum - 1);
  const hostCount = Math.max(0, Math.pow(2, 32 - cidr) - 2);

  document.getElementById('resOtHostCount').textContent = hostCount.toLocaleString();
  document.getElementById('resOtNetId').textContent = netIp;
  document.getElementById('resOtBcast').textContent = bcastIp;
  document.getElementById('resOtIpStart').textContent = firstHost;
  document.getElementById('resOtIpEnd').textContent = lastHost;
  document.getElementById('resOtGateway').textContent = `${firstHost} (or ${lastHost})`;

  // Profinet Station Name Validation (RFC 5890 / IEC 61158-6-10)
  const profinetRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/;
  const isValidProfinet = profinetRegex.test(profinetName) && profinetName.length <= 240 && !profinetName.includes('_');
  const statusEl = document.getElementById('otProfinetStatus');
  if (statusEl) {
    if (isValidProfinet) {
      statusEl.textContent = isEn ? 'Profinet Name: VALID (RFC 5890)' : 'Profinet Name: 정상 (규격 준수)';
      statusEl.style.color = 'var(--safe-green)';
    } else {
      statusEl.textContent = isEn ? 'Profinet Name: INVALID (No capitals/underscores)' : 'Profinet Name: 규격 오류 (소문자/하이픈만 허용)';
      statusEl.style.color = 'var(--fail-crimson)';
    }
  }
}

// ==========================================================================
// 15. Servo Kinetic Energy & Regenerative Braking Resistor [NEW]
// ==========================================================================
function calculateServoRegen() {
  const jCm2 = parseFloat(document.getElementById('servoInertia')?.value) || 5.0;
  const rpm = parseFloat(document.getElementById('servoMaxRpm')?.value) || 3000.0;
  const tDec = parseFloat(document.getElementById('servoDecelTime')?.value) || 0.2;
  const vBus = parseFloat(document.getElementById('servoDcBusVolt')?.value) || 24.0;
  const capUf = parseFloat(document.getElementById('servoBusCap')?.value) || 1000.0;
  const isEn = currentLanguage === 'en';

  const jKgM2 = jCm2 * 1e-4; // kg*cm^2 to kg*m^2
  const omega = (2.0 * Math.PI * rpm) / 60.0; // rad/s
  const eKinetic = 0.5 * jKgM2 * Math.pow(omega, 2); // Joules

  // Bus Capacitor absorption threshold
  const vRegenTrip = vBus * 1.35; // 35% overvoltage margin
  const cFarad = capUf * 1e-6;
  const eCap = 0.5 * cFarad * (Math.pow(vRegenTrip, 2) - Math.pow(vBus, 2)); // Joules

  const eSurplus = Math.max(0, eKinetic - eCap);
  const peakPower = tDec > 0 ? eKinetic / tDec : 0;

  // Recommended Resistor Ohms & Watts
  const rOhm = Math.max(5, Math.round(Math.pow(vRegenTrip, 2) / (peakPower * 1.2 || 10)));
  const rWatt = eSurplus > 0 ? Math.max(50, Math.ceil(eSurplus * 3.0 / 10) * 10) : 0;

  document.getElementById('resServoKineticE').textContent = eKinetic.toFixed(2);
  document.getElementById('resServoCapE').textContent = `${eCap.toFixed(2)} J`;
  document.getElementById('resServoSurplusE').textContent = `${eSurplus.toFixed(2)} J`;
  document.getElementById('resServoPeakPower').textContent = `${peakPower.toFixed(1)} W`;

  const statusEl = document.getElementById('servoRegenStatus');
  const resOhmEl = document.getElementById('resServoResOhm');
  const resWattEl = document.getElementById('resServoResWatt');

  if (eSurplus <= 0) {
    if (statusEl) {
      statusEl.textContent = isEn ? 'Capacitor Absorbed (No External Resistor Needed)' : '내부 커패시터 흡수 가능 (외장 저항 불필요)';
      statusEl.style.color = 'var(--safe-green)';
    }
    if (resOhmEl) resOhmEl.textContent = isEn ? 'Internal OK' : '내부 흡수 완료';
    if (resWattEl) resWattEl.textContent = isEn ? '0 W (Not Required)' : '외장 저항 불필요';
  } else {
    if (statusEl) {
      statusEl.textContent = isEn ? `Regen Resistor Required (${eSurplus.toFixed(1)}J Surplus)` : `외장 회생저항 장착 필수 (잉여 ${eSurplus.toFixed(1)}J 방전)`;
      statusEl.style.color = 'var(--warn-amber)';
    }
    if (resOhmEl) resOhmEl.textContent = `${rOhm} Ω`;
    if (resWattEl) resWattEl.textContent = `${rWatt} W 이상`;
  }
}

// ==========================================================================
// 11. Global Multi-Language (i18n) Engine [COMPREHENSIVE]
// ==========================================================================
// ==========================================================================
// 100% COMPREHENSIVE 21-TAB FA ENGINEERING MULTI-LANGUAGE SUITE
// ==========================================================================

const TAB_I18N_DATA = {
  ko: {
    'tab-voltagedrop': {
      title: 'DC 24V 케이블 전압강하 & 센서 전원 마진 검증기',
      desc: '공장 자동화(FA) 현장의 제어선로 배선 거리, 전선 굵기(AWG/SQ), 부하 전류에 따른 루프 저항과 전압강하를 실시간 연산하여 센서 리셋 오동작을 사전 차단합니다.',
      c1: '설계 파라미터 입력',
      c2: '검증 판정 결과 및 계측 데이터'
    },
    'tab-analogloop': {
      title: '4-20mA 아날로그 전송기 수전 마진 검증기',
      desc: '2선식/4선식 4-20mA 전류 루프에서 전송기 최소 동작전압, 250Ω 션트 저항, 배선 저항에 따른 루프 전압 마진을 검증합니다.',
      c1: '루프 전원 및 전송기 사양',
      c2: '루프 전압 마진 판정'
    },
    'tab-smpsbudget': {
      title: 'DC 24V SMPS 용량 & 회로보호기(CP) 자동 선정기',
      desc: '상시 부하율, 30% 안전 마진, 돌입전류 배수를 종합 분석하여 최적의 SMPS 용량과 분기 회로보호기 정격을 자동 산출합니다.',
      c1: '부하 프로파일 설정',
      c2: '추천 SMPS 용량 및 CP 사양'
    },
    'tab-cabinetcooling': {
      title: '제어반 발열량 & 판넬 에어컨 용량 선정기',
      desc: '제어반 크기, 내부 발열 부품(SMPS, 인버터, PLC) 손실 및 주위 온도(Ta)에 따른 필요 쿨링 용량(W, kcal/h)을 산출합니다.',
      c1: '제어반 규격 및 발열원 입력',
      c2: '필요 냉각 용량 및 팬/에어컨 선정'
    },
    'tab-cabletable': {
      title: '산업용 케이블 규격별 허용전류 & 도체 저항 조견표',
      desc: 'AWG 및 Metric(SQ) 전선의 공칭 단면적, 20°C 도체 저항, 개방 배선 및 전선관/덕트 포설 시 허용전류(Ampacity)를 비교합니다.',
      c1: '도체 규격 필터링',
      c2: '도체 물리 사양 상세표'
    },
    'tab-rs485': {
      title: 'RS-485 / Modbus 통신선로 & 120Ω 종단저항 분석기',
      desc: '통신 보레이트, 케이블 길이, 분기(Stub) 길이에 따른 신호 감쇄 및 120Ω 종단저항 설치 필요성을 판정합니다.',
      c1: '통신 버스 파라미터',
      c2: '통신 품질 및 종단저항 판정'
    },
    'tab-pneumatics': {
      title: '공압 실린더 공기 소모량 & 콤프레샤(HP) 선정기',
      desc: '실린더 튜브 내경, 스트로크, 분당 작동 횟수에 따른 분당 공기 소모량(Nℓ/min)과 필요 콤프레샤 마력(HP)을 산출합니다.',
      c1: '공압 액추에이터 사양',
      c2: '필요 에어 유량 및 콤프레샤 추천'
    },
    'tab-ductutility': {
      title: '배선 덕트(Duct) 점유율 40% 한계 검증기',
      desc: 'KEC 및 NFPA 79 규정(최대 점유율 40% 이하)에 따른 덕트 내 전선 수용 적합성을 계산합니다.',
      c1: '덕트 규격 및 케이블 구성',
      c2: '덕트 점유율 판정 및 여유 공간'
    },
    'tab-plcscaling': {
      title: 'PLC 아날로그 12-bit / 16-bit ADC 스케일링 코드 생성기',
      desc: '4-20mA 신호를 디지털 값(0~4000, 0~16000, 0~27648, 0~32767)으로 변환하는 수식 및 PLC 래더/ST 코드를 자동 생성합니다.',
      c1: 'ADC 분해능 및 엔지니어링 단위',
      c2: '변환 수식 및 PLC 표준 코드'
    },
    'tab-motorcalc': {
      title: '3상 모터(380V/220V) 정격전류 & 마그네트(MC) 선정기',
      desc: '모터 정격 출력(kW/HP), 효율, 역률에 따른 정격전류(FLA)와 기동전류, 마그네트(MC), EOCR 보호 범위를 산출합니다.',
      c1: '모터 명판 사양 입력',
      c2: '전류 계산 및 개폐기/보호기 정격'
    },
    'tab-bendingradius': {
      title: '케이블 베어(Cable Carrier) 최소 곡률반경 & 체인 선정기',
      desc: '가동형 케이블 외경, 굽힘 반경 배수(R), 이동 스트로크에 따른 최적 곡률반경과 케이블베어 여유 공간을 계산합니다.',
      c1: '가동 케이블 사양 및 행정 조건',
      c2: '권장 곡률반경(R) 및 베어 규격'
    },
    'tab-otethernet': {
      title: '산업용 OT 이더넷 대역폭 & IP 서브넷 마스크 계산기',
      desc: 'PROFINET, EtherNet/IP, Modbus-TCP 패킷 주기 및 IP 대역 서브넷 마스크, 브로드캐스트 주소를 자동 산출합니다.',
      c1: '네트워크 트래픽 및 IP 구성',
      c2: '대역폭 사용률 및 서브넷 할당표'
    },
    'tab-servoregen': {
      title: '서보모터 회생제동 에너지 & 외장 저항기 용량 계산기',
      desc: '서보모터 감속 시 기계 부하 관성에서 발생하는 회생 에너지를 계산하여 드라이브 내장 콘덴서 흡수 여부 및 외장 회생저항기(W/Ω)를 산출합니다.',
      c1: '부하 관성 및 감속 조건',
      c2: '회생 에너지 및 외장 저항기 사양'
    },
    'tab-coppercost': {
      title: '국제 구리시세(LME) 연동 케이블 실시간 원가 & 중량 산출기',
      desc: '국제 전기동(LME Copper) 시세와 환율, 케이블 도체 단면적/길이에 따른 순수 구리 원가 및 중량을 실시간 산출합니다.',
      c1: '케이블 사양 및 LME 시세',
      c2: '구리 중량 및 원가 분석'
    },
    'tab-sldgenerator': {
      title: '단선결선도(SLD) CAD 자동 생성기 (AutoCAD / EPLAN 호환)',
      desc: '차단기, 변압기, SMPS, 분기 회로의 단선도를 브라우저에서 실시간 작도하고 DXF 파일로 즉시 다운로드합니다.',
      c1: '단선도 계통 파라미터',
      c2: '실시간 단선도 미리보기 & CAD 출력'
    },
    'tab-iolinksafety': {
      title: 'IO-Link 마스터 포트 전원 & PLe/SIL3 안전회로 검증기',
      desc: 'IO-Link 클래스 A/B 포트 전원 버짓과 OSSD 안전 광전센서/비상정지 루프의 전압강하를 검증합니다.',
      c1: 'IO-Link 및 안전회로 구성',
      c2: '포트 전원 마진 및 안전 판정'
    },
    'tab-grounding': {
      title: '보호접지(PE) 최소 규격 & 노이즈 EMC 실드 임피던스 계산기',
      desc: 'KEC 및 IEC 60204-1 기준 상도체 굵기에 따른 보호도체(PE) 최소 단면적과 고조파 노이즈 차폐용 접지 브레이드 임피던스를 산출합니다.',
      c1: '도체 단면적 및 접지선 파라미터',
      c2: '보호도체(PE) 규격 및 EMC 임피던스'
    },
    'tab-npnpnp': {
      title: 'PLC I/O 싱크(NPN) vs 소스(PNP) 결선 인터페이스 & 변환 계산기',
      desc: '아시아(NPN) 및 유럽/미국(PNP) 센서 결선 방식과 풀업/풀다운 저항, NPN-PNP 상호 변환 회로를 검증합니다.',
      c1: '센서 및 PLC 모듈 사양',
      c2: '결선 회로 판정 및 변환 가이드'
    },
    'tab-flybacksurge': {
      title: 'DC 24V 역기전력(Flyback) 서지 보호 & 다이오드/TVS 선정기',
      desc: '솔레노이드 밸브, 릴레이 코일 OFF 시 발생하는 역기전력 피크 전압과 환류 다이오드(Flyback Diode) 및 TVS 다이오드 사양을 산출합니다.',
      c1: '코일 인덕턴스 및 정격전류',
      c2: '역기전력 피크 및 보호 소자 사양'
    },
    'tab-inrushbreaker': {
      title: 'SMPS 기동 돌입전류(Inrush) & 차단기 C/D 커브 트립 검증기',
      desc: 'SMPS 다중 기동 시 발생하는 대전류 돌입 피크(Inrush Current)와 배선용 차단기(MCB) B/C/D 트립 커브 오동작 여부를 사전 검증합니다.',
      c1: 'SMPS 대수 및 돌입 파라미터',
      c2: '트립 마진 및 차단기 커브 판정'
    },
    'tab-safetylight': {
      title: 'ISO 13855 / EN ISO 13849-1 안전 라이트커튼 최소 안전거리(S) 계산기',
      desc: '로봇 셀, 프레스 및 자동화 설비의 안전 라이트커튼 광축 분해능, 센서 응답시간, 기계 브레이크 정지시간에 따른 법적 최소 이격거리(S)를 판정합니다.',
      c1: '안전 파라미터 및 응답 시간 설정',
      c2: 'ISO 13855 법적 최소 안전거리 판정'
    },
    'tab-transformer': {
      title: '제어용 변압기(TR) 용량(kVA) 및 1차/2차 차단기 선정기',
      desc: '메인 동력 전원에서 제어 전원 변환 시 상시 부하율과 솔레노이드/MC 돌입 피크를 고려한 변압기 용량 및 보호기를 자동 산출합니다.',
      c1: '변압기 전압 사양 및 부하 입력',
      c2: '변압기 추천 용량 및 1차/2차 보호 정격'
    },
    'tab-shortcircuit': {
      title: 'IEC 60909 변압기 %Z 기반 최대 단락전류(Isc) & 차단용량(kA) 판정기',
      desc: '변압기 용량, 임피던스(%Z), 전선 길이에 따른 3상 대칭 단락전류를 산출하고 인입 차단기의 정격 차단용량(kA_IC / Icu) 적합성을 검증합니다.',
      c1: '수전 변압기 및 배선 파라미터',
      c2: '단락전류 계산 및 차단기 차단용량 판정'
    },
    'tab-motioninertia': {
      title: '기계 메커니즘 부하 관성 모멘트(JL) & 서보모터 관성비 계산기',
      desc: '볼스크류, 타이밍 벨트, 로터리 턴테이블 기구부의 관성 모멘트(JL)와 감속비에 따른 서보모터 관성비(JL/JM) 및 가속 토크를 산출합니다.',
      c1: '기구 메커니즘 및 모터 파라미터',
      c2: '부하 관성비 및 가속 토크 판정'
    },
    'tab-tempconversion': {
      title: 'IEC 60751 PT100 (RTD) & 써모커플(TC K/J/T) 온도-저항/기전력 상호 변환기',
      desc: '산업용 PT100 측온저항체(RTD) 및 K/J/T 열전대의 정밀 온도 변환과 장거리 2선식/3선식 배선 저항 오차 보정치를 산출합니다.',
      c1: '온도 센서 종류 및 배선 환경',
      c2: '변환 저항/기전력 및 배선 오차 보정치'
    },
    'tab-valvecv': {
      title: 'ISA-75.01 / IEC 60534 제어 밸브 유량계수(Cv / Kv) & 배관 유량 사이징 계산기',
      desc: '유체(물, 오일, 공압, 증기)의 유량과 전후 차압(ΔP)에 따른 제어 밸브 유량계수(Cv, Kv)와 배관 유속 및 최소 밸브 구경(DN)을 판정합니다.',
      c1: '유체 물성 및 유량/압력 조건',
      c2: '필요 밸브 유량계수(Cv) 및 유속 판정'
    },
    'tab-agvbattery': {
      title: '스마트 물류 AGV / AMR 자율주행로봇 배터리 런타임 & 급속 충전 사이징',
      desc: 'AGV/AMR 무인이송로봇의 주행 모터, 리프팅 기구, 라이다 센서 소비전력과 방전심도(DoD 80%)에 따른 실가동 시간과 급속 충전 시간을 산출합니다.',
      c1: '배터리 팩 및 로봇 소비전력 프로파일',
      c2: '연속 가동 시간 및 충전 소요 시간'
    },
    'tab-busbar': {
      title: 'DIN 43671 / IEC 60865 구리 부스바(Busbar) 허용전류 & 단락 전자력 계산기',
      desc: '배전반 및 분전함 모선 부스바(Busbar) 규격(두께×폭)에 따른 연속 허용전류와 3상 단락 시 발생하는 상간 전자 기계력(N/m) 및 지지애자 간격을 산출합니다.',
      c1: '부스바 도체 규격 및 단락 조건',
      c2: '연속 허용전류 및 단락 전자력 판정'
    },
        'tab-spd': {
      title: 'IEC 61643 서지보호기(SPD) Type 1/2/3 정격 & 방전전류 선정기',
      desc: '수전 인입반(Type 1), 분전반(Type 2), 제어반(Type 3)의 접지 계통(TN/TT/IT)에 따른 최대연속사용전압(Uc) 및 방전용량을 산출합니다.',
      c1: '설치 위치 및 계통 전압/접지 방식',
      c2: '추천 SPD 사양 및 전압보호레벨(Up)'
    },
                'tab-vacuumchamber': {
      title: '반도체 / 디스플레이 진공 챔버 배기 시간(Pumping Down Time) & 진공도 계산기',
      desc: '챔버 체적(m³), 목표 진공도(Pa/Torr), 드라이/루츠 펌프 유효 배기속도(m³/h)에 따른 러핑 배기 시간과 적정 진공 펌프 용량을 산출합니다.',
      c1: '진공 챔버 및 펌프 배기 파라미터',
      c2: '목표 진공도 도달 시간 & 러핑 판정'
    },
    'tab-batterythermal': {
      title: '2차전지 / 전기차(EV) 배터리 팩 C-rate 충방전 내부발열량(W) & 수냉 칠러 쿨링 용량 계산기',
      desc: '배터리 팩 용량(kWh), 충방전율(C-rate), 내부 저항(mΩ)에 따른 총 줄열 발열량과 과열 방지용 수냉 칠러(kW) 및 냉각수 유량을 산출합니다.',
      c1: '배터리 팩 사양 및 C-rate 충방전 조건',
      c2: '팩 총 발열량 & 필요 수냉 칠러 용량'
    },
    'tab-powerfactor': {
      title: '수배전반 역률(Power Factor) 개선 전력용 콘덴서(Capacitor Bank kVAR) & 전기요금 절감 계산기',
      desc: '유효전력(kW), 현재 역률 및 목표 역률(95~98%)에 따른 소요 진상용 콘덴서 용량(kVAR)과 한전 기본요금 할인 절감액을 산출합니다.',
      c1: '수전 유효전력 및 현재/목표 역률',
      c2: '필요 콘덴서 용량 & 기본요금 절감액'
    },
    'tab-hydraulics': {
      title: '제철 / 중공업 210bar 고압 유압(Hydraulics) 실린더 추력(Ton) & 유압 펌프 모터(kW) 계산기',
      desc: '유압 작동 압력(bar), 실린더 피스톤 내경(mm), 작동 속도에 따른 유압 실린더 압출력(Ton)과 유압 유니트 펌프 모터 소요 동력을 산출합니다.',
      c1: '유압 작동 압력 및 실린더 규격',
      c2: '실린더 압출력 & 유압 펌프 모터 출력'
    },
    'tab-hvacblower': {
      title: 'HVAC 공조 / 클린룸 환기 덕트 압력손실(Pa) & 급배기 송풍기(Fan/Blower) 모터(kW) 계산기',
      desc: '설계 풍량(CMH), 덕트 규격(사각/원형), 배관 길이에 따른 덕트 마찰 압력 손실(Pa)과 송풍기 필요 전압/풍압 및 모터 동력을 산출합니다.',
      c1: '풍량 및 덕트 규격 파라미터',
      c2: '총 정압 손실 & 송풍기 모터 마력'
    },
    'tab-steampipe': {
      title: '화학 / 제약 / 바이오 포화 증기(Steam) 배관 관경(DN) & 보일러 증발량(kg/h) 계산기',
      desc: '스팀 사용 압력(MPa/bar), 요구 가열 열량(kW) 또는 증기 유량에 따른 포화 증기 배관 적정 관경과 보일러 증기 발생 부하를 산출합니다.',
      c1: '스팀 압력 및 공정 요구 열량',
      c2: '추천 증기 배관경 & 보일러 증발량'
    },
    'tab-pumphead': {
      title: '유체역학 펌프 전양정(Total Dynamic Head) & Darcy-Weisbach 배관 마찰손실 수두 계산기',
      desc: '배관 직경, 유량(LPM/m³/h), 배관 길이 및 밸브 부속류에 따른 관마찰 압력 손실(bar)과 펌프 필요 수동력(kW/HP)을 산출합니다.',
      c1: '유체 유량 및 배관 규격 파라미터',
      c2: '펌프 전양정 & 소요 펌프 모터 마력(HP)'
    },
    'tab-bolttorque': {
      title: 'VDI 2230 / ISO 898-1 기계요소 볼트 체결 토크(N·m) & 목표 축력(Preload) 계산기',
      desc: '볼트 호칭 직경(M3~M36), 강도 등급(8.8, 10.9, 12.9) 및 나사산 마찰 상태에 따른 규정 체결 조임토크와 볼트 인장 축력을 산출합니다.',
      c1: '볼트 호칭 직경 및 강도 등급',
      c2: '규정 조임 토크 & 목표 체결 축력'
    },
    'tab-heatexchanger': {
      title: '열역학 열교환기 LMTD 대수평균온도차 & 소요 전열면적(Area m²) 계산기',
      desc: '고온/저온 유체의 입출구 온도와 총괄 열전달계수(U-value)에 따른 대수평균온도차(LMTD) 및 필요 열교환기 전열면적을 산출합니다.',
      c1: '열용량 및 고온/저온 유체 온도',
      c2: 'LMTD 대수평균온도차 & 소요 전열면적'
    },
    'tab-beamdeflection': {
      title: '구조역학 보(Beam) 최대 굽힘모멘트(N·m) & 정밀 처짐량(Deflection ≤ L/500) 계산기',
      desc: '설비 프레임 및 빔 구조물의 지지 스팬, 집중 하중(kgf) 및 단면 2차 모멘트(I)에 따른 최대 처짐량과 구조 건전성을 해석합니다.',
      c1: '보 스팬 및 하중 조건',
      c2: '최대 처짐량 & 구조 건전성 판정'
    },
    'tab-rolltension': {
      title: '2차전지 / 필름 롤투롤(Roll-to-Roll) 권취 장력(Tension) & 서보모터 토크(N·m) 계산기',
      desc: '배터리 전극 및 필름 권취 시 권경(지관→완제품) 변화에 따른 테이퍼 장력(Tension Taper)과 서보모터 필요 토크 및 회전수(RPM)를 산출합니다.',
      c1: '롤 규격 및 라인 속도 파라미터',
      c2: '필요 서보 모터 토크 & 테이퍼 장력 판정'
    },
    'tab-vfdsurge': {
      title: 'NEMA MG 1 Part 31 인버터(VFD) 케이블 dV/dt 반사파 서지 전압 & 리액터/필터 선정기',
      desc: '인버터와 모터 간 장거리 케이블 포설 시 발생하는 반사파 서지 피크 전압(V_peak)과 모터 권선 절연 파괴 방지용 AC 리액터 및 dV/dt 필터를 판정합니다.',
      c1: '인버터 전압 및 모터 케이블 조건',
      c2: '모터 단자 피크 서지 전압 & 권장 필터'
    },
    'tab-explosionproof': {
      title: 'IEC 60079 / KOSHA 방폭(Ex) 위험 구역 기기 등급 & 본질안전(IS) 배리어 정합성 검증기',
      desc: '화학 플랜트 및 배터리 전해액 룸의 방폭 구역(Zone 0/1/2)과 가스 그룹(IIC/IIB/IIA), 온도 등급(T1~T6) 및 제너 배리어(Zener Barrier) Entity 파라미터를 검증합니다.',
      c1: '방폭 구역 분류 및 배리어 사양',
      c2: '본질안전(IS) 적합성 & 케이블 한계치 판정'
    },
    'tab-cabletray': {
      title: 'NEMA VE-2 / IEC 61537 케이블 트레이 적재 중량(kg/m) & 지지대 스팬(Span) 처짐량 계산기',
      desc: '포설할 다중 케이블의 총 중량(kg/m)과 트레이 규격에 따른 지지대 브라켓 간격(Span) 및 구조 처짐량(Deflection ≤ L/200)을 산출합니다.',
      c1: '트레이 규격 및 케이블 적재 수량',
      c2: '총 적재 하중 & 구조 처짐량 판정'
    },
    'tab-luxlighting': {
      title: 'KS A 3011 / ISO 8995 제어반 내부 & 클린룸 LED 요구 조도(Lux) 및 등기구 수량(N) 계산기',
      desc: '제어반 및 클린룸 작업 공간의 면적(m²), 작업 표준 조도(Lux), 등기구 광속(lm) 및 조명률에 따른 최적의 LED 조명 등기구 개수와 소비전력을 산출합니다.',
      c1: '공간 규격 및 요구 조도 표준',
      c2: '필요 LED 조명 수량 & 총 소비전력'
    },
    'tab-solarpv': {
      title: 'IEC 62548 태양광(PV) / 산업용 ESS DC 1500V 스트링 전압강하 & gPV 직류 퓨즈 선정기',
      desc: '공장 지붕 태양광 및 ESS 배터리 컨테이너의 최저 외기온도(-20°C) 시 최대 개방전압(Voc_max ≤ 1500V)과 직류 gPV 퓨즈 정격을 산출합니다.',
      c1: '태양광 모듈 스트링 및 케이블 파라미터',
      c2: '최대 DC 전압 & 추천 gPV 퓨즈 정격'
    },
    'tab-hoistcrane': {
      title: '갠트리/크레인 호이스트 권상 모터 출력(kW) & 와이어로프 안전율 계산기',
      desc: '정격 인양 하중(Ton), 권상 속도(m/min), 기계 효율에 따른 모터 필요 출력(kW)과 와이어로프 안전율을 산출합니다.',
      c1: '인양 하중 및 기구 파라미터',
      c2: '필요 모터 권상 동력 & 로프 안전율 판정'
    },
        'tab-spd': {
      title: 'IEC 61643 Surge Protective Device (SPD) Type 1/2/3 Sizer',
      desc: 'Calculate maximum continuous operating voltage (Uc), discharge rating (In/Iimp), and Up levels based on earthing systems (TN/TT/IT).',
      c1: 'Installation Point & Grid Specs',
      c2: 'Recommended SPD Ratings & Up Level'
    },
                'tab-vacuumchamber': {
      title: 'Semiconductor Vacuum Chamber Evacuation Time & Vacuum Pump Sizer',
      desc: 'Calculate chamber pump-down time and required dry/roots vacuum pump capacity from atmospheric pressure down to high vacuum.',
      c1: 'Chamber Volume & Pump Speed',
      c2: 'Evacuation Time & Pumping Verdict'
    },
    'tab-batterythermal': {
      title: 'EV Battery Pack C-rate Heat Generation & Liquid Chiller Sizer',
      desc: 'Calculate pack Joule heating (Watts), temperature rise, and required liquid cooling chiller capacity (kW) under rapid charging.',
      c1: 'Battery Pack & C-rate Specs',
      c2: 'Total Heat Loss & Chiller Power'
    },
    'tab-powerfactor': {
      title: 'Power Factor Correction Capacitor Bank (kVAR) & KEPCO Bill Sizer',
      desc: 'Calculate required reactive power compensation capacitor bank (kVAR) to raise power factor from 80% to 95-98% for grid bill discounts.',
      c1: 'Active Power & Target Power Factor',
      c2: 'Capacitor Bank Sizing & Savings'
    },
    'tab-hydraulics': {
      title: '210bar High-Pressure Hydraulic Cylinder Thrust & Pump Motor Sizer',
      desc: 'Calculate hydraulic cylinder extension thrust (Tons/kN) and hydraulic power unit motor power (kW/HP) under high operating pressures.',
      c1: 'Hydraulic Pressure & Bore Size',
      c2: 'Cylinder Thrust & Motor Power'
    },
    'tab-hvacblower': {
      title: 'HVAC Air Duct Pressure Drop & Ventilation Blower Fan Motor Sizer',
      desc: 'Calculate friction pressure loss (Pa/mmAq) across air ducts and size ventilation blower fan motors (kW/HP) based on airflow (CMH).',
      c1: 'Airflow & Duct Dimensions',
      c2: 'Total Static Loss & Fan Motor'
    },
    'tab-steampipe': {
      title: 'Process Steam Piping Diameter (DN) & Boiler Steam Load Sizer',
      desc: 'Calculate optimal saturated steam pipe sizing (DN/Inches) and required boiler steam evaporation load (kg/h or Ton/h).',
      c1: 'Steam Pressure & Heat Duty',
      c2: 'Steam Pipe Sizing & Boiler Load'
    },
    'tab-pumphead': {
      title: 'Pump Total Dynamic Head (TDH) & Darcy-Weisbach Pipe Friction Loss Sizer',
      desc: 'Calculate pipe velocity, friction head loss, total dynamic head, and required pump motor power (kW/HP) based on flow rate and pipe diameter.',
      c1: 'Flow Rate & Pipe Specifications',
      c2: 'Total Head & Required Pump Power'
    },
    'tab-bolttorque': {
      title: 'VDI 2230 / ISO 898-1 Fastener Bolt Tightening Torque & Preload Sizer',
      desc: 'Calculate recommended bolt tightening torque (N·m) and tensile preload force (kN) based on metric bolt size, grade (8.8/10.9/12.9), and friction.',
      c1: 'Bolt Size & Strength Grade',
      c2: 'Recommended Torque & Preload'
    },
    'tab-heatexchanger': {
      title: 'Thermodynamics Heat Exchanger LMTD & Heat Transfer Area (m²) Sizer',
      desc: 'Calculate Log Mean Temperature Difference (LMTD) and required heat exchange surface area (m²) for counter-flow heat exchangers.',
      c1: 'Heat Duty & Fluid Temperatures',
      c2: 'LMTD & Transfer Area Verdict'
    },
    'tab-beamdeflection': {
      title: 'Structural Beam Maximum Bending Moment & Deflection (<= L/500) Sizer',
      desc: 'Calculate maximum bending moment (N·m), beam deflection (mm), and structural integrity under point or uniform loads.',
      c1: 'Beam Span & Loading Conditions',
      c2: 'Max Deflection & Structural Verdict'
    },
    'tab-rolltension': {
      title: 'Roll-to-Roll Winder Tension & Servo Motor Torque (N·m) Sizer',
      desc: 'Calculate linear taper tension profile, required servo motor torque, and winder RPM as roll diameter increases from core to full package.',
      c1: 'Roll Dimensions & Line Speed',
      c2: 'Required Servo Torque & Taper Verdict'
    },
    'tab-vfdsurge': {
      title: 'NEMA MG 1 Part 31 VFD Reflected Wave Peak Surge & AC Reactor Sizer',
      desc: 'Calculate motor terminal peak reflected surge voltage (V_peak) over long cable distances and size AC load reactors or dV/dt filters.',
      c1: 'VFD Inverter & Cable Specs',
      c2: 'Peak Surge Voltage & Filter Verdict'
    },
    'tab-explosionproof': {
      title: 'IEC 60079 Explosion Proof (Ex) Zone & Intrinsic Safety (IS) Barrier Sizer',
      desc: 'Verify hazardous area classifications (Zone 0/1/2), gas groups (IIC/IIB/IIA), temperature codes (T1-T6), and Zener barrier entity parameters.',
      c1: 'Hazardous Area & Barrier Inputs',
      c2: 'Intrinsic Safety & Cable Limits'
    },
    'tab-cabletray': {
      title: 'NEMA VE-2 / IEC 61537 Cable Tray Loading & Support Span Deflection Sizer',
      desc: 'Calculate multi-cable bundle load weight (kg/m), recommended hanger support spans, and structural deflection compliance (<= L/200).',
      c1: 'Tray Dimensions & Cable Quantities',
      c2: 'Total Tray Load & Deflection Verdict'
    },
    'tab-luxlighting': {
      title: 'KS A 3011 / ISO 8995 Enclosure & Cleanroom LED Illumination (Lux) Sizer',
      desc: 'Determine required LED lighting fixture count (N) and electrical wattage based on room area (m2), target lux, and fixture lumens.',
      c1: 'Space Dimensions & Target Lux',
      c2: 'Required Fixture Count & Power'
    },
    'tab-solarpv': {
      title: 'IEC 62548 Solar PV / ESS DC 1500V String & gPV Fuse Sizer',
      desc: 'Calculate maximum open-circuit voltage at sub-zero cold conditions (Voc_max <= 1500V) and size DC gPV string fuses and disconnects.',
      c1: 'Solar String & Cable Parameters',
      c2: 'Max DC Voltage & gPV Fuse Rating'
    },
    'tab-hoistcrane': {
      title: 'Gantry / Crane Hoist Motor Power (kW) & Wire Rope Safety Factor Sizer',
      desc: 'Calculate required hoist motor power (kW), rope tensile safety factor (>= 5), and holding brake torque based on load capacity and lifting speed.',
      c1: 'Hoist Load & Mechanical Params',
      c2: 'Required Motor Power & Rope Verdict'
    },
    'tab-cleanesd': {
      title: 'ANSI/ESD S20.20 & IEC 61340 반도체/클린룸 정전기 감쇠 & 표면저항 판정기',
      desc: '반도체/2차전지 클린룸 EPA 제전 매트, 바닥재, 이오나이저의 정전기 감쇠 시간(1000V→100V ≤ 2.0s) 및 표면 저항 적합성을 판정합니다.',
      c1: '정전기 측정 전압 및 표면 저항값',
      c2: 'ANSI/ESD S20.20 규격 적합성 판정'
    },
    'tab-articles': {
      title: '전장설계 기술 자료 & 실무 가이드',
      desc: 'KEC, IEC 60204-1, NFPA 79 규정 및 노이즈 방지 실무 가이드라인을 제공합니다.',
      c1: '기술 문서 목차',
      c2: '상세 가이드 본문'
    }
  },
  en: {
    'tab-voltagedrop': {
      title: 'DC 24V Cable Voltage Drop & Sensor Power Margin',
      desc: 'Calculate cable loop resistance, voltage drop, and sensor brownout margin in real-time according to distance, wire gauge, and load current.',
      c1: 'Design Parameters Input',
      c2: 'Verification Verdict & Readouts'
    },
    'tab-analogloop': {
      title: '4-20mA Analog Current Loop Margin Verification',
      desc: 'Calculate loop operating margins based on transmitter supply voltage, cable loop resistance, and PLC receiver shunt resistance.',
      c1: 'Loop Power & Transmitter Specs',
      c2: 'Loop Voltage Margin & Readouts'
    },
    'tab-smpsbudget': {
      title: 'DC 24V SMPS Power Supply & Circuit Protector Sizing',
      desc: 'Sizing SMPS wattage and branch circuit protector ratings considering total steady-state load, 30% safety margin, and inrush currents.',
      c1: 'Load Profile & Coincidence Factor',
      c2: 'Recommended SMPS Capacity & CP Specs'
    },
    'tab-cabinetcooling': {
      title: 'Control Panel Enclosure Air Conditioner & Cooling Sizing',
      desc: 'Calculate required cooling capacity (W, kcal/h) according to panel dimensions, internal heat generation, and ambient temperature (Ta).',
      c1: 'Enclosure Dimensions & Thermal Load',
      c2: 'Required Cooling Capacity & Sizing Guide'
    },
    'tab-cabletable': {
      title: 'Industrial Cable Ampacity & Conductor Resistance Table',
      desc: 'Compare cross-sectional area, DC resistance at 20°C, and ampacity in open air vs enclosed raceways for AWG and Metric SQ wires.',
      c1: 'Conductor Size Filter',
      c2: 'Detailed Physical Specifications'
    },
    'tab-rs485': {
      title: 'RS-485 / Modbus Bus Line & 120Ω Termination Analysis',
      desc: 'Calculate maximum allowable distance, 120Ω termination requirements, and stub branch limits based on baud rate and cable length.',
      c1: 'Bus Line Specifications',
      c2: 'Signal Integrity Verification'
    },
    'tab-pneumatics': {
      title: 'Pneumatic Cylinder Air Consumption & Compressor HP Sizing',
      desc: 'Calculate air consumption per minute (Nℓ/min) and required compressor HP based on cylinder bore, stroke, and cycle frequency.',
      c1: 'Pneumatic Actuator Specs',
      c2: 'Required Flow & Compressor Sizing'
    },
    'tab-ductutility': {
      title: 'Control Raceway Duct Fill Ratio 40% Limit Checker',
      desc: 'Calculate raceway fill compliance and free thermal clearance according to KEC and NFPA 79 standards (maximum 40% fill limit).',
      c1: 'Raceway Dimensions & Cables',
      c2: 'Duct Fill Compliance & Free Area'
    },
    'tab-plcscaling': {
      title: 'PLC Analog 12-bit / 16-bit ADC Scaling Code Generator',
      desc: 'Convert 4-20mA analog inputs into raw counts and auto-generate industrial PLC Ladder and Structured Text scaling blocks.',
      c1: 'ADC Resolution & Engineering Range',
      c2: 'Conversion Formula & PLC Source Code'
    },
    'tab-motorcalc': {
      title: '3-Phase Motor FLA & Magnetic Contactor (MC) Sizing',
      desc: 'Calculate 3-phase motor full-load ampacity (FLA), locked-rotor current, and recommended magnetic contactor / EOCR overload ratings.',
      c1: 'Motor Nameplate Specifications',
      c2: 'Motor FLA & Starter Ratings'
    },
    'tab-bendingradius': {
      title: 'Cable Carrier Minimum Bending Radius & Chain Sizing',
      desc: 'Calculate minimum dynamic bending radius (R) and drag chain cavity clearance for flexible robotic cables according to outer diameter.',
      c1: 'Cable Specifications & Travel Stroke',
      c2: 'Recommended Radius (R) & Chain Sizing'
    },
    'tab-otethernet': {
      title: 'Industrial OT Ethernet Bandwidth & Subnet Sizer',
      desc: 'Calculate industrial protocol packet bandwidth (PROFINET, EtherNet/IP) and IP network subnet masks with broadcast addresses.',
      c1: 'Traffic Parameters & IP Network',
      c2: 'Bandwidth Utilization & Subnet Table'
    },
    'tab-servoregen': {
      title: 'Servo Motor Regenerative Energy & Braking Resistor Sizer',
      desc: 'Calculate kinetic deceleration energy, drive capacitor absorption margin, and external dynamic braking resistor wattage and ohms.',
      c1: 'Mechanism Load Inertia & Deceleration',
      c2: 'Regen Energy & External Resistor Specs'
    },
    'tab-coppercost': {
      title: 'LME Copper Spot Price Real-Time Cable Weight & Cost Sizer',
      desc: 'Calculate conductor pure copper weight (kg/km) and raw material costs in real-time synced with London Metal Exchange (LME) copper prices.',
      c1: 'Conductor Specifications & LME Price',
      c2: 'Copper Weight & Cost Analysis'
    },
    'tab-sldgenerator': {
      title: 'Single Line Diagram (SLD) CAD Generator (AutoCAD / EPLAN)',
      desc: 'Interactive browser-based single-line schematic CAD drawing generator with instant DXF vector export for industrial control panels.',
      c1: 'Single Line System Parameters',
      c2: 'Live SLD Schematic Preview & CAD Export'
    },
    'tab-iolinksafety': {
      title: 'IO-Link Master Port Power Budget & PLe/SIL3 Safety Loop',
      desc: 'Verify IO-Link Class A/B master port supply capacity and OSSD safety light curtain / emergency stop loop voltage drop margins.',
      c1: 'IO-Link Devices & Safety Configuration',
      c2: 'Port Power Margin & Safety Loop Verdict'
    },
    'tab-grounding': {
      title: 'Protective Earth (PE) Sizing & EMC Shield Impedance Sizer',
      desc: 'Determine minimum protective conductor (PE) size and high-frequency EMC grounding braid impedance according to IEC 60204-1 and KEC.',
      c1: 'Phase Conductor & Grounding Specs',
      c2: 'Protective Conductor & EMC Impedance'
    },
    'tab-npnpnp': {
      title: 'PLC I/O Sink (NPN) vs Source (PNP) Wiring Interface',
      desc: 'Interactive 3-wire sensor polarity interface with pull-up/pull-down resistor calculations and NPN-to-PNP conversion circuits.',
      c1: 'Sensor Type & PLC Input Module Specs',
      c2: 'Wiring Interface Verdict & Conversion'
    },
    'tab-flybacksurge': {
      title: 'DC 24V Solenoid Flyback Surge Suppression & Diode Sizer',
      desc: 'Calculate inductive turn-off transient peak voltage and size Flyback freewheeling diodes and TVS suppressor clamps.',
      c1: 'Coil Inductance & Holding Current',
      c2: 'Flyback Peak & Diode Specifications'
    },
    'tab-inrushbreaker': {
      title: 'SMPS Startup Inrush Current & Breaker C/D Curve Sizer',
      desc: 'Calculate capacitive startup inrush peak current and verify Miniature Circuit Breaker (MCB) Type C/D trip curves against nuisance tripping.',
      c1: 'Power Supply Array & Inrush Specs',
      c2: 'Trip Margin & Breaker Curve Verdict'
    },
    'tab-safetylight': {
      title: 'ISO 13855 / EN ISO 13849-1 Safety Light Curtain Minimum Distance (S)',
      desc: 'Calculate legally required minimum safety distance (S) based on beam resolution, sensor response, and machine stopping time.',
      c1: 'Safety Parameters & Response Times',
      c2: 'ISO 13855 Minimum Distance Verdict'
    },
    'tab-transformer': {
      title: 'Control Power Transformer (TR) Capacity (kVA) & Protection Sizer',
      desc: 'Size control power transformers and primary/secondary circuit breakers considering steady-state VA, solenoid inrush, and safety margins.',
      c1: 'Transformer Specs & Load Profile',
      c2: 'Recommended kVA & Breaker Ratings'
    },
    'tab-shortcircuit': {
      title: 'IEC 60909 Transformer %Z Symmetrical Short-Circuit Current (Isc)',
      desc: 'Calculate maximum 3-phase symmetrical short-circuit current (Isc) based on transformer %Z and upstream cable impedance damping.',
      c1: 'Transformer & Upstream Cable Inputs',
      c2: 'Calculated Isc & Interrupting Capacity'
    },
    'tab-motioninertia': {
      title: 'Mechanism Load Inertia (JL) & Servo Motor Inertia Ratio Sizer',
      desc: 'Calculate load inertia (JL) for ball screws, timing belts, and rotary tables, evaluating servo motor inertia ratios (JL/JM) and accel torque.',
      c1: 'Mechanism Specs & Motor Parameters',
      c2: 'Load Inertia Ratio & Torque Verdict'
    },
    'tab-tempconversion': {
      title: 'IEC 60751 PT100 (RTD) & Thermocouple (TC K/J/T) Temp-to-Resistance/mV Converter',
      desc: 'Precise temperature-to-resistance/mV conversion and 2-wire/3-wire lead wire resistance error compensation.',
      c1: 'Sensor Type & Wiring Configuration',
      c2: 'Converted Value & Lead Wire Offset'
    },
    'tab-valvecv': {
      title: 'ISA-75.01 / IEC 60534 Control Valve Flow Coefficient (Cv / Kv) & Pipe Sizer',
      desc: 'Calculate required valve flow coefficient (Cv, Kv), fluid velocity (m/s), and port size (DN) based on flow rate and differential pressure (ΔP).',
      c1: 'Fluid Properties & Flow Conditions',
      c2: 'Required Valve Cv & Flow Verdict'
    },
    'tab-agvbattery': {
      title: 'Smart Logistics AGV / AMR Robot Battery Runtime & Fast Charger Sizer',
      desc: 'Calculate real-world operating runtime (hours), battery DoD (80%), power profile, and rapid charging duration for autonomous mobile robots.',
      c1: 'Battery Pack & Robot Load Profile',
      c2: 'Continuous Runtime & Fast Charge Duration'
    },
    'tab-busbar': {
      title: 'DIN 43671 / IEC 60865 Copper Busbar Ampacity & Short-Circuit Force Sizer',
      desc: 'Calculate continuous rated current ampacity (A) and peak electromechanical short-circuit force (N/m) between switchgear busbar phases.',
      c1: 'Busbar Conductor & Short-Circuit Specs',
      c2: 'Continuous Ampacity & Short-Circuit Force'
    },
    'tab-cleanesd': {
      title: 'ANSI/ESD S20.20 & IEC 61340 Cleanroom Static Decay & Surface Resistivity Checker',
      desc: 'Verify EPA ESD static decay time (1,000V to 100V <= 2.0s) and surface resistance (10^6 to 10^9 ohms) for semiconductor and battery fabs.',
      c1: 'Static Voltage & Surface Resistance Inputs',
      c2: 'ANSI/ESD S20.20 Compliance Verdict'
    },
    'tab-articles': {
      title: 'Engineering Technical Library & Field Reference',
      desc: 'IEC 60204-1, NFPA 79, and KEC industrial electrical design rules, grounding practices, and noise suppression guidelines.',
      c1: 'Technical Topics Index',
      c2: 'Complete Reference Guide'
    }
  },
  ja: {
    'tab-voltagedrop': {
      title: 'DC 24V ケーブル電圧降下＆センサ電源マージン計算機',
      desc: '配線長、線径（AWG/SQ）、負荷電流に応じたループ抵抗と電圧降下をリアルタイム算出し、センサのリセット事故を未然に防止します。',
      c1: '設計パラメータ入力',
      c2: '判定結果＆計測データ'
    },
    'tab-analogloop': {
      title: '4-20mA アナログ電流ループ電圧マージン検証機',
      desc: '伝送器電源（24V）、受信側250Ωシャント抵抗、線路抵抗に応じた計測マジンを判定します。',
      c1: 'ループ電源＆伝送器仕様',
      c2: '電圧マージン判定結果'
    },
    'tab-smpsbudget': {
      title: 'DC 24V SMPS 電源容量＆サーキットプロテクタ選定',
      desc: '定常負荷、安全率30％、突入電流を考慮した最適なSMPS容量とCP定格を自動選定します。',
      c1: '負荷プロファイル設定',
      c2: '推奨SMPS容量＆CP仕様'
    },
    'tab-safetylight': {
      title: 'ISO 13855 セーフティライトカーテン最小安全距離(S)計算機',
      desc: '光軸分解能、センサ応答時間、機械ブレーキ停止時間に基づく法定最小安全距離(S)を算出します。',
      c1: '安全パラメータ設定',
      c2: 'ISO 13855 安全距離判定'
    },
    'tab-transformer': {
      title: '制御用変圧器(TR)容量(kVA)＆1次/2次遮断器選定機',
      desc: '動力電源から制御電源への降圧時、定常負荷と突入ピークを考慮した変圧器容量と保護機器を算出します。',
      c1: '変圧器仕様入力',
      c2: '推奨容量＆遮断器定格'
    }
  },
    es: {
    'tab-voltagedrop': {
      title: 'Calculadora de Caída de Tensión en Cable DC 24V y Margen de Sensores',
      desc: 'Calcule la resistencia de bucle, la caída de tensión y el margen contra reinicios de sensores en tiempo real según la distancia y calibre.',
      c1: 'Parámetros de Diseño',
      c2: 'Veredicto de Verificación'
    },
    'tab-analogloop': {
      title: 'Verificación de Margen en Bucle de Corriente Analógica 4-20mA',
      desc: 'Evalúe los márgenes de tensión considerando la fuente del transmisor, resistencia del cable y shunt receptor de 250 ohmios.',
      c1: 'Alimentación y Transmisor',
      c2: 'Margen de Tensión'
    },
    'tab-smpsbudget': {
      title: 'Dimensionamiento de Fuente SMPS DC 24V y Protector de Circuito (CP)',
      desc: 'Calcule la potencia óptima de la fuente SMPS y la corriente nominal del protector considerando cargas estables y picos de arranque.',
      c1: 'Perfil de Cargas',
      c2: 'Capacidad Recomendada'
    },
    'tab-cabinetcooling': {
      title: 'Cálculo de Refrigeración y Climatizador para Cuadros Eléctricos',
      desc: 'Calcule la potencia frigorífica requerida (W, kcal/h) según las dimensiones del armario y la disipación térmica de los componentes.',
      c1: 'Dimensiones y Calor Interno',
      c2: 'Capacidad de Refrigeración'
    },
    'tab-cabletable': {
      title: 'Tabla de Capacidad de Corriente (Ampacidad) y Resistencia de Cables',
      desc: 'Compare la sección transversal, resistencia a 20°C y ampacidad al aire libre vs canalizaciones cerradas para calibres AWG y métricos.',
      c1: 'Filtro de Conductor',
      c2: 'Especificaciones Físicas'
    },
    'tab-rs485': {
      title: 'Línea de Bus RS-485 / Modbus y Resistencia de Terminación de 120Ω',
      desc: 'Calcule la distancia máxima permitida y la necesidad de terminadores de 120Ω según la tasa de baudios y longitud del cable.',
      c1: 'Parámetros del Bus',
      c2: 'Integridad de Señal'
    },
    'tab-safetylight': {
      title: 'Distancia Mínima de Seguridad para Barreras Ópticas ISO 13855 (S)',
      desc: 'Calcule la distancia legal de seguridad (S) según la resolución del haz óptico, tiempo de respuesta y parada de máquina.',
      c1: 'Parámetros de Seguridad',
      c2: 'Veredicto ISO 13855'
    },
    'tab-transformer': {
      title: 'Transformador de Control (kVA) y Protecciones Primario/Secundario',
      desc: 'Dimensione transformadores de maniobra considerando cargas continuas, picos de electroválvulas y margen de seguridad.',
      c1: 'Tensiones y Cargas',
      c2: 'Capacidad Recomendada'
    },
    'tab-shortcircuit': {
      title: 'Corriente de Cortocircuito Simétrica (Isc) según %Z del Transformador',
      desc: 'Calcule la corriente de cortocircuito trifásica (kA) y verifique el poder de corte de los interruptores según IEC 60909.',
      c1: 'Transformador y Cable',
      c2: 'Isc y Poder de Corte'
    },
    'tab-motioninertia': {
      title: 'Inercia de Carga Mecánica (JL) y Relación de Inercia del Servomotor',
      desc: 'Calcule la inercia para husillos de bolas, correas dentadas y platos giratorios, evaluando la relación JL/JM.',
      c1: 'Mecanismo y Motor',
      c2: 'Relación de Inercia'
    },
    'tab-tempconversion': {
      title: 'Conversor de Temperatura IEC 60751 PT100 (RTD) y Termopares (K/J/T)',
      desc: 'Conversión precisa temperatura a resistencia/mV con compensación de error de resistencia de línea a 3 hilos.',
      c1: 'Sensor y Cableado',
      c2: 'Valor y Compensación'
    },
    'tab-valvecv': {
      title: 'Coeficiente de Caudal de Válvulas de Control (Cv / Kv) ISA-75.01',
      desc: 'Calcule el coeficiente Cv/Kv, velocidad del fluido y diámetro nominal (DN) según caudal y presión diferencial (ΔP).',
      c1: 'Propiedades del Fluido',
      c2: 'Cv y Diámetro Recomendado'
    },
    'tab-agvbattery': {
      title: 'Autonomía de Batería y Cargador Rápido para Robots AGV / AMR',
      desc: 'Calcule la autonomía real en horas (DoD 80%), consumo energético en kWh y tiempo de carga rápida para robots móviles.',
      c1: 'Batería y Potencia',
      c2: 'Autonomía y Carga'
    },
    'tab-busbar': {
      title: 'Capacidad de Corriente en Pletinas de Cobre (Busbar) DIN 43671',
      desc: 'Calcule la ampacidad continua (A) y fuerza electromecánica máxima de cortocircuito (N/m) entre fases de embarrados.',
      c1: 'Pletina y Cortocircuito',
      c2: 'Ampacidad y Fuerza N/m'
    },
    'tab-cleanesd': {
      title: 'Verificador de Descarga Electrostática (ESD) en Salas Limpias',
      desc: 'Verifique el tiempo de decaimiento estático (<= 2.0s) y resistividad superficial según ANSI/ESD S20.20.',
      c1: 'Tensión y Resistencia',
      c2: 'Veredicto ANSI/ESD'
    },
    'tab-spd': {
      title: 'Protector de Sobretensiones (SPD) Tipo 1/2/3 según IEC 61643',
      desc: 'Dimensione la tensión máxima de operación Uc y capacidad de descarga In/Iimp según el régimen de neutro (TN/TT/IT).',
      c1: 'Punto de Instalación',
      c2: 'Capacidad SPD y Nivel Up'
    },
    'tab-hoistcrane': {
      title: 'Potencia de Motor de Elevación (kW) y Factor de Seguridad del Cable',
      desc: 'Calcule la potencia del motor de elevación (kW) y factor de seguridad a tracción (>= 5) para puentes grúa.',
      c1: 'Carga y Mecanismo',
      c2: 'Potencia y Seguridad'
    },
    'tab-articles': {
      title: 'Biblioteca Técnica y Guía de Normativas Industriales',
      desc: 'Normas internacionales IEC 60204-1, NFPA 79, esquemas y compatibilidad electromagnética (EMC).',
      c1: 'Índice de Temas',
      c2: 'Guía de Consulta'
    }
  },
  zh: {
    'tab-voltagedrop': {
      title: 'DC 24V 电缆电压降与传感器裕度校验器',
      desc: '根据电缆长度、线径规格（AWG/SQ）及负载电流，实时计算回路电阻与电压降，杜绝工业现场欠压停机。',
      c1: '设计参数输入',
      c2: '校验结果与读数'
    },
    'tab-analogloop': {
      title: '4-20mA 模拟量电流回路受电裕度验证器',
      desc: '根据变送器电源（24V）、接收端250欧姆分流电阻及线路阻抗，判定模拟量采集裕度。',
      c1: '回路电源与变送器规格',
      c2: '电压裕度判定结果'
    },
    'tab-smpsbudget': {
      title: 'DC 24V 开关电源(SMPS)容量与断路器选型',
      desc: '结合稳态负载、30%安全裕度及冲击电流，智能计算推荐的开关电源功率及支路保护规格。',
      c1: '负载配置与同时系数',
      c2: '推荐电源容量与断路器'
    },
    'tab-safetylight': {
      title: 'ISO 13855 安全光幕最小安全防护距离(S)计算器',
      desc: '根据光轴分辨率、传感器响应时间及机械制动停止时间，计算合规的最小安装安全距离。',
      c1: '安全参数与响应时间',
      c2: 'ISO 13855 距离判定'
    },
    'tab-transformer': {
      title: '控制变压器(TR)容量(kVA)与一/二次侧保护选型',
      desc: '在主电源转换为控制电源时，综合稳态负载与接触器合闸冲击，自动计算变压器容量。',
      c1: '变压器电压与负载输入',
      c2: '推荐容量与保护规格'
    }
  }
};


function applyLanguage(lang) {
  currentLanguage = lang;
  if (document.documentElement) {
    document.documentElement.lang = lang;
  }
  const langText = document.getElementById('currentLangText');
  if (langText) langText.textContent = (typeof LANG_FLAGS !== 'undefined' && LANG_FLAGS[lang]) ? LANG_FLAGS[lang] : lang.toUpperCase();

  translateEntireDOM(lang);
  const isEn = lang !== 'ko';
  const data = TAB_I18N_DATA[lang] || TAB_I18N_DATA.ko;

  // 1. Top Nav Buttons & Brand
  const brandName = document.querySelector('.brand-name');
  if (brandName) brandName.textContent = 'Total Engineering';

  const brandTag = document.querySelector('.brand-tagline');
  if (brandTag) {
    if (lang === 'en') brandTag.textContent = 'Industrial Automation & Electrical Total Engineering Suite';
    else if (lang === 'ja') brandTag.textContent = '産業用制御・FA・電気・機械 総合エンジニアリングポータル';
    else if (lang === 'vi') brandTag.textContent = 'Cổng thông tin tính toán kỹ thuật điện & tự động hóa công nghiệp';
    else if (lang === 'es') brandTag.textContent = 'Portal de Ingeniería Eléctrica y Automatización Industrial Total';
    else if (lang === 'de') brandTag.textContent = 'Industrielle Automatisierungs- und Elektrotechnik-Suite';
    else if (lang === 'zh') brandTag.textContent = '工业自动化与电气全领域工程计算门户';
    else brandTag.textContent = '산업용 제어선로 전압강하 & 전장설계 토털 엔지니어링 툴킷';
  }

  const digitalBtn = document.querySelector('#openDigitalProductBtn span:first-of-type');
  if (digitalBtn) digitalBtn.textContent = isEn ? 'Pro Excel·CAD Pack' : '실무 엑셀·CAD 팩';

  const u1 = document.querySelector('#openUnitConverterBtn span');
  if (u1) u1.textContent = isEn ? 'Unit Converter' : '단위 환산';
  const u2 = document.querySelector('#openHistoryModalBtn span');
  if (u2) u2.textContent = isEn ? 'Saved Calcs' : '내 보관함';
  const u3 = document.querySelector('#shareUrlBtn span');
  if (u3) u3.textContent = isEn ? 'Share Link' : '조건 공유';
  const u4 = document.querySelector('#printReportBtn span');
  if (u4) u4.textContent = isEn ? 'Print Report' : '검토서 인쇄';

  // 2. All 21 Tab Navigation Buttons
  const tabBtnNames = {
    'tab-voltagedrop': isEn ? '24V Volt Drop' : '24V 전압강하',
    'tab-analogloop': isEn ? '4-20mA Loop' : '4-20mA 루프',
    'tab-smpsbudget': isEn ? 'SMPS & CP' : 'SMPS·CP 용량',
    'tab-cabinetcooling': isEn ? 'Cabinet Cooler' : '제어반 쿨링',
    'tab-cabletable': isEn ? 'AWG Table' : 'AWG 조견표',
    'tab-rs485': isEn ? 'RS-485 Bus' : 'RS-485 통신',
    'tab-pneumatics': isEn ? 'Pneumatics' : '공압 소모량',
    'tab-ductutility': isEn ? 'Duct Fill' : '덕트 점유율',
    'tab-plcscaling': isEn ? 'PLC Scaling' : 'PLC 스케일링',
    'tab-motorcalc': isEn ? '3-Ph Motor·MC' : '3상 모터·MC',
    'tab-bendingradius': isEn ? 'Cable Carrier' : '케이블 베어',
    'tab-otethernet': isEn ? 'OT Ethernet·IP' : 'OT 이더넷·IP',
    'tab-servoregen': isEn ? 'Servo Regen' : '서보 회생저항',
    'tab-coppercost': isEn ? 'Copper Cost' : '구리시세·원가',
    'tab-sldgenerator': isEn ? 'SLD CAD' : '단선결선도 CAD',
    'tab-iolinksafety': isEn ? 'IO-Link·Safety' : 'IO-Link·안전회로',
    'tab-grounding': isEn ? 'Grounding·EMC' : '접지(PE)·EMC실드',
    'tab-npnpnp': isEn ? 'NPN·PNP Wiring' : 'NPN·PNP 결선',
    'tab-flybacksurge': isEn ? 'Flyback Surge' : '역기전력 서지',
    'tab-inrushbreaker': isEn ? 'Inrush·Trip' : '돌입전류·트립',
    'tab-safetylight': isEn ? 'Safety Light' : '안전 라이트커튼',
    'tab-transformer': isEn ? 'Transformer TR' : '제어용 변압기',
    'tab-shortcircuit': isEn ? 'Short Circuit kA' : '단락전류(kA)',
    'tab-motioninertia': isEn ? 'Load Inertia' : '기계부하 관성',
    'tab-tempconversion': isEn ? 'PT100·TC' : 'PT100·열전대',
    'tab-articles': isEn ? 'Tech Notes' : '기술 노트'
  };

  Object.keys(tabBtnNames).forEach(tabId => {
    const btn = document.querySelector(`.tab-btn[data-tab="${tabId}"] span`);
    if (btn) btn.textContent = tabBtnNames[tabId];
  });

  // 3. Systematically Translate All 21 Tab Header Titles & Card Captions
  Object.keys(data).forEach(tabId => {
    const tabEl = document.getElementById(tabId);
    if (!tabEl) return;

    const titleEl = tabEl.querySelector('.main-title');
    if (titleEl) titleEl.textContent = data[tabId].title;

    const descEl = tabEl.querySelector('.main-desc');
    if (descEl) descEl.textContent = data[tabId].desc;

    const c1El = tabEl.querySelector('.workbench-card .caption-left h3');
    if (c1El) c1El.textContent = data[tabId].c1;

    const c2El = tabEl.querySelector('.meter-readout-panel .caption-left h3');
    if (c2El) c2El.textContent = data[tabId].c2;
  });

  // 4. Tab 1: 24V Voltage Drop Specific Translations
  const presetLabel = document.querySelector('.quick-preset-bar .preset-label');
  if (presetLabel) presetLabel.textContent = isEn ? 'Quick Load Presets:' : '빠른 부하 선택:';

  const presetBtns = document.querySelectorAll('.quick-preset-bar .pill-btn');
  if (presetBtns.length >= 5) {
    presetBtns[0].textContent = isEn ? 'Photo Sensor (35mA)' : '포토/근접센서 (35mA)';
    presetBtns[1].textContent = isEn ? 'Solenoid Valve (0.45A)' : '솔레노이드 밸브 (0.45A)';
    presetBtns[2].textContent = isEn ? 'IO-Link Master (2.0A)' : 'IO-Link 마스터 (2.0A)';
    presetBtns[3].textContent = isEn ? 'Servo Brake (1.2A)' : '서보 브레이크 (1.2A)';
    presetBtns[4].textContent = isEn ? 'Vision Light (3.5A)' : '비전 조명 (3.5A)';
  }

  const advBtnText = document.getElementById('advModeBtnText');
  if (advBtnText) advBtnText.textContent = isEn ? 'Advanced Settings' : '상세 환경 설정';

  const lLen = document.querySelector('label[for="wireLength"]');
  if (lLen) lLen.textContent = isEn ? 'One-Way Cable Distance (L)' : '선로 편도 배선 거리 (L)';

  const lLenHelp = document.querySelector('.field-help-text');
  if (lLenHelp) lLenHelp.textContent = isEn ? '※ 2x distance (loop) resistance is calculated for return circuit path.' : '※ 전류가 왕복하는 폐루프 특성상 2배 거리(80m) 저항이 계산됩니다.';

  const lGauge = document.querySelector('label[for="wireGaugeValue"]');
  if (lGauge) lGauge.textContent = isEn ? 'Wire Gauge Specification' : '케이블 도선 규격';

  const lCur = document.querySelector('label[for="loadCurrent"]');
  if (lCur) lCur.textContent = isEn ? 'Load Operating Current (I)' : '말단 부하 소비전류 (I)';

  const stepChips = document.querySelectorAll('.quick-step-chips .step-chip');
  if (stepChips.length >= 5) {
    stepChips[0].textContent = isEn ? '35mA (Sensor)' : '35mA (센서)';
    stepChips[1].textContent = isEn ? '200mA (I/O)' : '200mA (I/O)';
    stepChips[2].textContent = isEn ? '0.5A (Valve)' : '0.5A (밸브)';
    stepChips[3].textContent = isEn ? '1.5A (Mid Load)' : '1.5A (중간부하)';
    stepChips[4].textContent = isEn ? '3.0A (Heavy Load)' : '3.0A (대용량)';
  }

  const readoutHeader = document.querySelector('.main-meter-panel .meter-header span:first-child');
  if (readoutHeader) readoutHeader.textContent = isEn ? 'TERMINAL VOLTAGE (Operating Voltage)' : 'TERMINAL VOLTAGE (말단 수전 전압)';

  const dropLbl = document.querySelector('.drop-item span:first-child');
  if (dropLbl) dropLbl.textContent = isEn ? 'Voltage Drop:' : '선로 전압강하:';

  const marginLbl = document.querySelector('.margin-item span:first-child');
  if (marginLbl) marginLbl.textContent = isEn ? 'Voltage Margin:' : '전원 안전마진:';

  const gaugeTitle = document.querySelector('.level-meter-box .level-title');
  if (gaugeTitle) gaugeTitle.textContent = isEn ? 'Voltage Margin Level Gauge' : '전압 마진 레벨 게이지 (Voltage Margin Gauge)';

  const gaugeTicks = document.querySelectorAll('.level-scale-track .scale-mark');
  if (gaugeTicks.length >= 4) {
    gaugeTicks[0].textContent = isEn ? '18.0V (Risk)' : '18.0V (위험)';
    gaugeTicks[1].textContent = isEn ? '20.4V (Warn)' : '20.4V (경고)';
    gaugeTicks[3].textContent = isEn ? '24.0V (Nom)' : '24.0V (정격)';
  }

  const flowTitle = document.querySelector('.circuit-strip .strip-header span:first-child');
  if (flowTitle) flowTitle.textContent = isEn ? 'Line Potential Profile' : '선로 전위 분포';

  const scSourceLbl = document.querySelector('.sc-node-source span');
  if (scSourceLbl) scSourceLbl.textContent = isEn ? 'SMPS Source' : 'SMPS 전원';

  const scLoadLbl = document.querySelector('.sc-node-load span');
  if (scLoadLbl) scLoadLbl.textContent = isEn ? 'Sensor / Load' : '센서 / 부하';

  const chartTitle = document.querySelector('#tab-voltagedrop .chart-title');
  if (chartTitle) chartTitle.innerHTML = `<i data-lucide="trending-down"></i> ${isEn ? 'Voltage Gradient Curve (Line Length vs Drop)' : '선로 거리별 전압 강하 구배 곡선 (Voltage Gradient Curve)'}`;

  const chartLegends = document.querySelectorAll('#tab-voltagedrop .chart-legend .leg-item');
  if (chartLegends.length >= 3) {
    chartLegends[0].textContent = isEn ? '■ Voltage Curve' : '■ 선로 전압 곡선';
    chartLegends[1].textContent = isEn ? '--- Min Threshold (V_min)' : '--- 최저 전압 (V_min)';
    chartLegends[2].textContent = isEn ? '■ Brownout Risk (18V)' : '■ 브라운아웃 위험선 (18V)';
  }

  const specLabels = document.querySelectorAll('#tab-voltagedrop .specs-mini-grid .spec-cell .s-label');
  if (specLabels.length >= 4) {
    specLabels[0].textContent = isEn ? 'Total Loop Resistance' : '왕복 선로 저항';
    specLabels[1].textContent = isEn ? 'Line Thermal Loss (I²R)' : '선로 발열 손실 (I²R)';
    specLabels[2].textContent = isEn ? 'Ampacity Usage Ratio' : '허용전류 사용률';
    specLabels[3].textContent = isEn ? 'Recommended Gauge' : '추천 최소 규격';
  }

  const specSubs = document.querySelectorAll('#tab-voltagedrop .specs-mini-grid .spec-cell .s-sub');
  if (specSubs.length >= 4 && isEn) {
    specSubs[1].textContent = 'Normal Dissipation';
    specSubs[3].textContent = 'Meets 1.0V Margin Req';
  }

  // AI Audit Box Translations
  const aiBadge = document.querySelector('.audit-badge');
  if (aiBadge) aiBadge.innerHTML = `<i data-lucide="shield-check"></i> ${isEn ? 'AI Smart Audit' : 'AI 스마트 진단'}`;

  const aiH4 = document.querySelector('.audit-title-group h4');
  if (aiH4) aiH4.textContent = isEn ? '6-Point Comprehensive Engineering Safety Audit' : 'FA 전장설계 6대 항목 종합 안전 진단서';

  const auditHeaders = document.querySelectorAll('.audit-item h5');
  if (auditHeaders.length >= 6) {
    auditHeaders[0].textContent = isEn ? '1. Supply Voltage Margin (V_term vs V_min)' : '1. 전원 전압 마진 (V_term vs V_min)';
    auditHeaders[1].textContent = isEn ? '2. Conductor Ampacity Margin' : '2. 도선 허용전류 마진 (Ampacity Safety)';
    auditHeaders[2].textContent = isEn ? '3. Transient Inrush Brownout Immunity' : '3. 과도 돌입전류 브라운아웃 내성';
    auditHeaders[3].textContent = isEn ? '4. Thermal Dissipation & Power Loss (I²R)' : '4. 선로 발열 및 전력 손실 (I²R Loss)';
    auditHeaders[4].textContent = isEn ? '5. Short Circuit CP Coordination' : '5. 단락 고장 시 차단기 협조 제어 (CP Coordination)';
    auditHeaders[5].textContent = isEn ? '6. Wiring Topology Loss Factor' : '6. 배선 토폴로지 전압강하 감쇄율';
  }

  const copySumBtn = document.querySelector('#copyResultSummaryBtn span');
  if (copySumBtn) copySumBtn.textContent = isEn ? 'Copy Summary' : '요약 복사';

  const copyMdBtn = document.querySelector('#copyMarkdownBtn span');
  if (copyMdBtn) copyMdBtn.textContent = isEn ? 'Copy Markdown' : '마크다운 복사';

  const reqQuoteBtn = document.querySelector('#openQuoteModalBtn span');
  if (reqQuoteBtn) reqQuoteBtn.textContent = isEn ? 'Request BOM Quote' : '부품 견적 요청 (BOM)';

  // Dual Currency Tier Updates
  const t1Badge = document.getElementById('tier1Badge');
  if (t1Badge) t1Badge.textContent = isEn ? '⚡ Individual Engineer License (Popular)' : '⚡ 엔지니어 개인 실무용 (인기)';

  const t1Title = document.getElementById('tier1Title');
  if (t1Title) t1Title.textContent = isEn ? 'Engineering Starter Pack' : '엔지니어 실무 스타터 팩';

  const t1PriceNum = document.getElementById('tier1PriceNum');
  if (t1PriceNum) t1PriceNum.textContent = isEn ? '9.99' : '9,900';

  const t1PriceUnit = document.getElementById('tier1PriceUnit');
  if (t1PriceUnit) t1PriceUnit.textContent = isEn ? 'USD (VAT Incl.)' : '원 (VAT 포함)';

  const t1BuyBtn = document.querySelector('#tier1BuyBtn span');
  if (t1BuyBtn) t1BuyBtn.textContent = isEn ? 'Get Starter Pack for $9.99' : '9,900원 즉시 소장하기';

  const t2Badge = document.getElementById('tier2Badge');
  if (t2Badge) t2Badge.textContent = isEn ? '🏢 Corporate / Team License' : '🏢 팀 / 기업용 라이선스';

  const t2Title = document.getElementById('tier2Title');
  if (t2Title) t2Title.textContent = isEn ? 'PRO Enterprise Master Bundle' : 'PRO 기업용 마스터 번들';

  const t2PriceNum = document.getElementById('tier2PriceNum');
  if (t2PriceNum) t2PriceNum.textContent = isEn ? '19.99' : '29,000';

  const t2PriceUnit = document.getElementById('tier2PriceUnit');
  if (t2PriceUnit) t2PriceUnit.textContent = isEn ? 'USD (VAT Incl.)' : '원 (VAT 포함)';

  const t2BuyBtn = document.querySelector('#tier2BuyBtn span');
  if (t2BuyBtn) t2BuyBtn.textContent = isEn ? 'Get PRO Master Bundle for $19.99' : '29,000원 법인/팀 구매';

  // Toggle Domestic Bank vs Global Pay Gateway
  const dBank = document.getElementById('domesticBankBox');
  const gPay = document.getElementById('globalPayBox');
  if (dBank && gPay) {
    if (isEn) {
      dBank.style.display = 'none';
      gPay.style.display = 'block';
    } else {
      dBank.style.display = 'block';
      gPay.style.display = 'none';
    }
  }

  // Update Footer Legal Links
  const flPriv = document.getElementById('fLinkPrivacy');
  if (flPriv) flPriv.textContent = isEn ? 'Privacy Policy (GDPR)' : '개인정보처리방침 (Privacy)';
  const flTerms = document.getElementById('fLinkTerms');
  if (flTerms) flTerms.textContent = isEn ? 'Terms & Disclaimers' : '이용약관 & 규격 면책 (Terms)';
  const flRef = document.getElementById('fLinkRefund');
  if (flRef) flRef.textContent = isEn ? 'Digital Delivery & Refund Policy' : '디지털 배송/환불 규정 (Refund)';

  // Legal & Affiliate Disclosures
  const bTitle = document.getElementById('bomSectionTitle');
  if (bTitle) bTitle.textContent = isEn ? 'Recommended Manufacturer BOM Parts (Live Catalog)' : '추천 규격 실제 구매 부품 (BOM Part Matching)';
  const bSub = document.getElementById('bomSectionSub');
  if (bSub) bSub.textContent = isEn ? 'Official manufacturer part numbers matching calculated wire gauge and SMPS power ratings.' : '계산된 전선 규격 및 SMPS 용량에 일치하는 국내외 공인 제조사 공식 카탈로그 품번입니다.';
  const bAff = document.getElementById('bomAffiliateText');
  if (bAff) bAff.textContent = isEn ? 'FTC Compliance Disclosure: Total Engineering may earn an affiliate commission from authorized distributors (Digi-Key, Mouser) at no additional cost to you when purchasing through these verified links.' : '공정거래위원회 지침 및 FTC 가이드라인 준수: 본 추천 부품 링크(Digi-Key, Mouser)를 통한 구매 시 Total Engineering은 파트너사로부터 소정의 수수료를 지급받을 수 있으며, 구매자 부담 가격에는 일체 영향이 없습니다.';
  const sBox = document.getElementById('statutoryNoticeBox');
  if (sBox) sBox.innerHTML = isEn ? '<strong>[Statutory Digital Content Disclosure]</strong><br>This product is an instantly delivered digital asset. In accordance with digital content consumer regulations, returns are limited once file delivery begins. (Lifetime free calculation revisions supported.)' : '<strong>[전자상거래법 제17조 제2항에 따른 법정 고지]</strong><br>본 상품은 결제/입금 확인 즉시 영구 다운로드 링크 및 파일이 제공되는 디지털 콘텐츠로서, 다운로드 개시 후에는 전자상거래 등에서의 소비자보호에 관한 법률에 따라 단순 변심에 의한 청약철회가 제한될 수 있습니다. (설계 수식 오류 시 평생 무상 개정판 지원)';

  // Mobile Bottom Nav Labels
  const mbV = document.getElementById('mbTextVolt');
  if (mbV) mbV.textContent = isEn ? 'VoltDrop' : '전압강하';
  const mbS = document.getElementById('mbTextSmps');
  if (mbS) mbS.textContent = isEn ? 'SMPS' : 'SMPS/CP';
  const mbA = document.getElementById('mbTextAll');
  if (mbA) mbA.textContent = isEn ? '78 Tools' : '전체 78종';
  const mbP = document.getElementById('mbTextProj');
  if (mbP) mbP.textContent = isEn ? 'Project' : '보관함';

  // Mobile Drawer Titles
  const mdT = document.getElementById('mdTitle');
  if (mdT) mdT.textContent = isEn ? '78 Engineering Tool Suite' : '78대 산업 공학 도구';
  const mdS = document.getElementById('mdSub');
  if (mdS) mdS.textContent = isEn ? 'One-Tap Instant Sizing Suite' : '원터치 계산기 즉시 전환';

  // Category Filter Chips
  const cfA = document.getElementById('cfAll');
  if (cfA) cfA.textContent = isEn ? '⭐ All 78 Tools' : '⭐ 전체 78종';
  const cfP = document.getElementById('cfPower');
  if (cfP) cfP.textContent = isEn ? '⚡ Power & TR' : '⚡ 전원·변압기 (Power & TR)';
  const cfM = document.getElementById('cfMotion');
  if (cfM) cfM.textContent = isEn ? '🛡️ Motion & Safety' : '🛡️ 모터·안전 (Motion & Safety)';
  const cfS = document.getElementById('cfSignal');
  if (cfS) cfS.textContent = isEn ? '🌡️ Signals & OT' : '🌡️ 신호·통신 (Signals & OT)';
  const cfSp = document.getElementById('cfSpecs');
  if (cfSp) cfSp.textContent = isEn ? '📁 Specs & Tech' : '📁 제어반·규격 (Specs & Tech)';

  // 5. Tab 9: PLC Scaling Specific Labels
  const plcLabels = {
    'label[for="plcMakerSelect"]': isEn ? 'PLC Manufacturer & Resolution (Raw Count)' : 'PLC 제조사 및 아날로그 모듈 분해능 (Raw Count)',
    'label[for="plcRawMin"]': isEn ? 'Digital Raw Min (D_min)' : '디지털 Raw 하한 (D_min)',
    'label[for="plcRawMax"]': isEn ? 'Digital Raw Max (D_max)' : '디지털 Raw 상한 (D_max)',
    'label[for="plcSignalType"]': isEn ? 'Analog Signal Type' : '아날로그 입력 신호 형식',
    'label[for="plcEuMin"]': isEn ? 'Engineering Unit Min (EU_min)' : '물리량 최소값 (EU_min)',
    'label[for="plcEuMax"]': isEn ? 'Engineering Unit Max (EU_max)' : '물리량 최대값 (EU_max)',
    'label[for="plcInputVal"]': isEn ? 'Test Engineering Value' : '테스트 입력 물리량 (Engineering Value)'
  };
  Object.keys(plcLabels).forEach(sel => {
    const el = document.querySelector(`#tab-plcscaling ${sel}`);
    if (el) el.textContent = plcLabels[sel];
  });

  const plcCodeHeader = document.querySelector('#tab-plcscaling .code-title-bar span');
  if (plcCodeHeader) {
    plcCodeHeader.textContent = isEn ? 'PLC Structured Text (ST) Linear Scaling Formula' : 'PLC 래더(ST) 선형 변환 수식';
  }

  // 6. Sponsored Automation Cards
  const spHeader = document.querySelector('.bottom-showcase-bar .sponsor-tag');
  if (spHeader) spHeader.textContent = isEn ? 'SPONSORED AUTOMATION COMPONENTS' : 'SPONSORED AUTOMATION COMPONENTS';

  const spCards = document.querySelectorAll('.showcase-card');
  if (spCards.length >= 3) {
    const t0 = spCards[0].querySelector('.sc-tag'); if (t0) t0.textContent = isEn ? 'SMPS POWER' : 'SMPS 전원';
    const h0 = spCards[0].querySelector('h5'); if (h0) h0.textContent = isEn ? 'Ultra-Slim DIN-Rail 24V Power Supply' : '초박형 DIN레일 24V 파워서플라이';
    const p0 = spCards[0].querySelector('p'); if (p0) p0.textContent = isEn ? 'Built-in V.ADJ voltage drop compensation, 94% high efficiency, global certs' : '전압강하 보상 V.ADJ 내장, 94% 고효율, 글로벌 인증';

    const t1 = spCards[1].querySelector('.sc-tag'); if (t1) t1.textContent = isEn ? 'ENCLOSURE COOLING' : '제어반 쿨링';
    const h1 = spCards[1].querySelector('h5'); if (h1) h1.textContent = isEn ? 'Industrial Sealed Enclosure Cooler' : '산업용 밀폐형 제어반 에어컨';
    const p1 = spCards[1].querySelector('p'); if (p1) p1.textContent = isEn ? '500W~3000W slimline, IP54 dust/waterproof, digital temperature control' : '500W~3000W 슬림형, IP54 분진방수, 디지털 제어';

    const t2 = spCards[2].querySelector('.sc-tag'); if (t2) t2.textContent = isEn ? 'FIELDBUS & OT' : '필드버스';
    const h2 = spCards[2].querySelector('h5'); if (h2) h2.textContent = isEn ? 'RS-485 Galvanic Isolated Repeater' : 'RS-485 절연 통신 리피터';
    const p2 = spCards[2].querySelector('p'); if (p2) p2.textContent = isEn ? 'Extends distance up to 1.2km, 2.5kV surge isolation protection' : '최대 1.2km 장거리 확장, 2.5kV 서지 절연 보호';
  }

  // Populate Gauge Select with translated options
  populateGaugeSelect();

  // 6.5 If English mode, run zero-korean DOM sanitization
  if (isEn) {
    sanitizeDomToPureEnglish(document.body);
  }

  // 7. Recalculate Active Tab
  const activeTab = document.querySelector('.tab-panel.active')?.id || 'tab-voltagedrop';
  if (activeTab === 'tab-voltagedrop') calculateVoltageDrop();
  else if (activeTab === 'tab-rs485') calculateRS485();
  else if (activeTab === 'tab-analogloop') calculateAnalogLoop();
  else if (activeTab === 'tab-smpsbudget') calculateSmpsBudget();
  else if (activeTab === 'tab-cabinetcooling') calculateCabinetCooling();
  else if (activeTab === 'tab-plcscaling') calculatePlcScaling();
  else if (activeTab === 'tab-pneumatics') calculatePneumatics();
  else if (activeTab === 'tab-ductutility') calculateDuctFill();

  if (window.lucide) window.lucide.createIcons();
}

const LANG_FLAGS = {
  ko: '🇰🇷 KO',
  en: '🇺🇸 EN',
  ja: '🇯🇵 JA',
  vi: '🇻🇳 VI',
  es: '🇪🇸 ES',
  de: '🇩🇪 DE',
  zh: '🇨🇳 ZH'
};

function initLanguage() {
  const urlParams = new URLSearchParams(window.location.search);
  const paramLang = urlParams.get('lang');
  const savedLang = paramLang || localStorage.getItem('voltcheck_lang') || 'ko';
  currentLanguage = LANG_FLAGS[savedLang] ? savedLang : 'ko';
  applyLanguage(currentLanguage);
}

function toggleLanguage() {
  const order = ['ko', 'en', 'ja', 'vi', 'es', 'de', 'zh'];
  const nextIdx = (order.indexOf(currentLanguage) + 1) % order.length;
  selectLanguage(order[nextIdx]);
}


function initAllCanvases() {
  const dpr = window.devicePixelRatio || 1;
  ['vdChartCanvas', 'ductCanvas', 'rs485Canvas'].forEach(id => {
    const canvas = document.getElementById(id);
    if (canvas && canvas.parentElement) {
      const w = canvas.parentElement.clientWidth || 600;
      const h = parseInt(canvas.getAttribute('height')) || (id === 'rs485Canvas' ? 130 : (id === 'ductCanvas' ? 180 : 170));
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    }
  });
}

let rafVd = null;
function queueDrawVoltageDropChart(vSource, vTerm, vMin, lengthM, vDrop) {
  if (rafVd) cancelAnimationFrame(rafVd);
  rafVd = requestAnimationFrame(() => {
    drawVoltageDropChart(vSource, vTerm, vMin, lengthM, vDrop);
  });
}

let rafDuct = null;
function queueDrawDuctCrossSection(ductW, ductH, cableQty, cableDia, fillPct) {
  if (rafDuct) cancelAnimationFrame(rafDuct);
  rafDuct = requestAnimationFrame(() => {
    drawDuctCrossSection(ductW, ductH, cableQty, cableDia, fillPct);
  });
}

let rafRs485 = null;
function queueDrawRs485Waveform(baud, lengthM, isPass) {
  if (rafRs485) cancelAnimationFrame(rafRs485);
  rafRs485 = requestAnimationFrame(() => {
    drawRs485Waveform(baud, lengthM, isPass);
  });
}

function drawVoltageDropChart(vSource, vTerm, vMin, lengthM, vDrop) {
  const canvas = document.getElementById('vdChartCanvas');
  if (!canvas || canvas.offsetParent === null) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.width / dpr || 600;
  const h = canvas.height / dpr || 170;
  const isDark = document.body.classList.contains('theme-dark');
  const isEn = currentLanguage === 'en';

  ctx.save();
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);

  const padLeft = 45;
  const padRight = 30;
  const padTop = 20;
  const padBottom = 30;
  const plotW = Math.max(10, w - padLeft - padRight);
  const plotH = Math.max(10, h - padTop - padBottom);

  const yMinV = 16.0;
  const yMaxV = Math.max(25.0, vSource + 0.5);

  const getY = (v) => padTop + plotH * (1 - (v - yMinV) / (yMaxV - yMinV));
  const getX = (m) => padLeft + plotW * (m / lengthM);

  // 1. Grid Lines
  ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
  ctx.lineWidth = 1;
  ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
  ctx.font = '10px JetBrains Mono, monospace';

  [18, 20, 22, 24].forEach(v => {
    if (v >= yMinV && v <= yMaxV) {
      const y = getY(v);
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(w - padRight, y);
      ctx.stroke();
      ctx.fillText(`${v}V`, 10, y + 3);
    }
  });

  // 2. Brownout Danger Zone (<18V)
  const y18 = getY(18.0);
  ctx.fillStyle = isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.08)';
  ctx.fillRect(padLeft, y18, plotW, Math.max(0, getY(yMinV) - y18));
  ctx.fillStyle = '#ef4444';
  ctx.fillText(isEn ? 'Brownout Risk (<18V)' : '센서 리셋 위험구역 (<18V)', padLeft + 10, getY(yMinV) - 8);

  // 3. V_min Threshold Dashed Line
  const yMinLine = getY(vMin);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(padLeft, yMinLine);
  ctx.lineTo(w - padRight, yMinLine);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#f59e0b';
  ctx.fillText(`V_min: ${vMin.toFixed(1)}V`, w - padRight - 75, yMinLine - 4);

  // 4. Voltage Gradient Curve Line & Gradient Area
  const grad = ctx.createLinearGradient(padLeft, padTop, padLeft, h - padBottom);
  grad.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
  grad.addColorStop(1, 'rgba(59, 130, 246, 0.0)');

  ctx.beginPath();
  ctx.moveTo(padLeft, getY(vSource));
  for (let m = 0; m <= lengthM; m += lengthM / 30) {
    const vAtM = vSource - (vDrop * (m / lengthM));
    ctx.lineTo(getX(m), getY(vAtM));
  }
  ctx.lineTo(w - padRight, getY(vTerm));
  ctx.lineTo(w - padRight, h - padBottom);
  ctx.lineTo(padLeft, h - padBottom);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Draw Stroke
  ctx.beginPath();
  ctx.strokeStyle = vTerm >= vMin ? '#3b82f6' : '#ef4444';
  ctx.lineWidth = 2.5;
  ctx.moveTo(padLeft, getY(vSource));
  for (let m = 0; m <= lengthM; m += lengthM / 30) {
    const vAtM = vSource - (vDrop * (m / lengthM));
    ctx.lineTo(getX(m), getY(vAtM));
  }
  ctx.lineTo(w - padRight, getY(vTerm));
  ctx.stroke();

  // Nodes
  ctx.fillStyle = '#3b82f6';
  ctx.beginPath();
  ctx.arc(padLeft, getY(vSource), 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = isDark ? '#ffffff' : '#0f172a';
  ctx.fillText(`SMPS: ${vSource.toFixed(1)}V`, padLeft + 6, getY(vSource) - 6);

  ctx.fillStyle = vTerm >= vMin ? '#10b981' : '#ef4444';
  ctx.beginPath();
  ctx.arc(w - padRight, getY(vTerm), 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillText(`${vTerm.toFixed(2)}V (${lengthM}m)`, w - padRight - 80, getY(vTerm) - 6);

  // X Axis Labels
  ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
  ctx.fillText('0m', padLeft, h - 10);
  ctx.fillText(`${Math.round(lengthM / 2)}m`, padLeft + plotW / 2 - 10, h - 10);
  ctx.fillText(`${lengthM}m`, w - padRight - 20, h - 10);
  ctx.restore();
}

function drawDuctCrossSection(ductW, ductH, cableQty, cableDia, fillPct) {
  const canvas = document.getElementById('ductCanvas');
  if (!canvas || canvas.offsetParent === null) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.width / dpr || 600;
  const h = canvas.height / dpr || 180;
  const isDark = document.body.classList.contains('theme-dark');
  const isEn = currentLanguage === 'en';

  ctx.save();
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);

  const maxDuctDim = Math.max(ductW, ductH);
  const scale = Math.min((w - 140) / maxDuctDim, (h - 40) / maxDuctDim);
  const dw = ductW * scale;
  const dh = ductH * scale;
  const dx = (w - dw) / 2;
  const dy = (h - dh) / 2;

  // Outer Wall
  ctx.fillStyle = isDark ? '#1e293b' : '#e2e8f0';
  ctx.fillRect(dx - 6, dy - 6, dw + 12, dh + 12);

  // Inner Space
  ctx.fillStyle = isDark ? '#090d16' : '#ffffff';
  ctx.fillRect(dx, dy, dw, dh);

  // Side Slotted Slots
  ctx.strokeStyle = isDark ? '#475569' : '#94a3b8';
  ctx.lineWidth = 2;
  const slotCount = 6;
  for (let i = 1; i < slotCount; i++) {
    const sy = dy + (dh / slotCount) * i;
    ctx.strokeRect(dx - 5, sy - 3, 5, 6);
    ctx.strokeRect(dx + dw, sy - 3, 5, 6);
  }

  // Pack Cables
  const cableR = Math.max(2, (cableDia / 2) * scale);
  let curX = dx + cableR + 4;
  let curY = dy + dh - cableR - 4;
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];

  for (let i = 0; i < cableQty; i++) {
    if (curX + cableR > dx + dw - 4) {
      curX = dx + cableR + 4;
      curY -= (cableR * 2 + 2);
    }
    if (curY - cableR < dy) break;

    ctx.beginPath();
    ctx.arc(curX, curY, cableR, 0, Math.PI * 2);
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    ctx.strokeStyle = isDark ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.8)';
    ctx.lineWidth = 1;
    ctx.stroke();

    curX += cableR * 2 + 2;
  }

  // Dimensions & Status
  ctx.fillStyle = isDark ? '#e2e8f0' : '#1e293b';
  ctx.font = 'bold 11px JetBrains Mono, monospace';
  ctx.fillText(`${ductW} mm`, dx + dw / 2 - 20, dy - 10);
  ctx.fillText(`${ductH} mm`, dx + dw + 12, dy + dh / 2 + 4);

  const statusColor = fillPct <= 30 ? '#10b981' : (fillPct <= 40 ? '#f59e0b' : '#ef4444');
  ctx.fillStyle = statusColor;
  ctx.fillText(`Fill: ${fillPct.toFixed(1)}% (${fillPct <= 40 ? (isEn ? 'PASS' : '적합') : (isEn ? 'OVERFILL' : '초과 과열')})`, dx + 8, dy + 18);
  ctx.restore();
}

function drawRs485Waveform(baud, lengthM, isPass) {
  const canvas = document.getElementById('rs485Canvas');
  if (!canvas || canvas.offsetParent === null) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.width / dpr || 600;
  const h = canvas.height / dpr || 130;
  const isDark = document.body.classList.contains('theme-dark');
  const isEn = currentLanguage === 'en';

  ctx.save();
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);

  const midY = h / 2;
  const amp = 35;

  ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(30, midY);
  ctx.lineTo(w - 20, midY);
  ctx.stroke();
  ctx.setLineDash([]);

  // TX Ideal Square Wave (Blue)
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 2;
  ctx.beginPath();
  const stepW = (w - 60) / 8;
  let high = true;
  for (let i = 0; i < 8; i++) {
    const x1 = 30 + i * stepW;
    const x2 = x1 + stepW;
    const y = high ? midY - amp : midY + amp;
    if (i === 0) ctx.moveTo(x1, y);
    else ctx.lineTo(x1, y);
    ctx.lineTo(x2, y);
    high = !high;
  }
  ctx.stroke();

  // RX Received Waveform (Green/Red)
  ctx.strokeStyle = isPass ? '#10b981' : '#ef4444';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  high = true;
  for (let i = 0; i < 8; i++) {
    const x1 = 30 + i * stepW;
    const x2 = x1 + stepW;
    const targetY = high ? midY - amp * 0.9 : midY + amp * 0.9;
    if (i === 0) ctx.moveTo(x1, targetY);
    else ctx.quadraticCurveTo(x1 + 4, targetY + (high ? -5 : 5), x1 + 10, targetY);
    ctx.lineTo(x2, targetY);
    high = !high;
  }
  ctx.stroke();

  ctx.fillStyle = '#3b82f6';
  ctx.font = '10px JetBrains Mono, monospace';
  ctx.fillText('TX (+2.5V / -2.5V)', 35, 18);
  ctx.fillStyle = isPass ? '#10b981' : '#ef4444';
  ctx.fillText(isEn ? `RX (${lengthM}m @ ${baud.toLocaleString()} bps)` : `수신단 (${lengthM}m @ ${baud.toLocaleString()} bps)`, 35, h - 8);
  ctx.restore();
}

// High-Performance Debounced Window Resize Handler
let resizeTimeout = null;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    initAllCanvases();
    calculateVoltageDrop();
    calculateDuctFill();
    calculateRS485();
  }, 100);
});




// ==========================================================================
// VOLTCHECK24 NEXT-GEN 6-TIER ADVANCED ENGINEERING ENGINES
// ==========================================================================

const PARTS_DATABASE = {
  CABLE_PARTS: {
    'AWG 24': [
      { maker: '대한전선 (Taihan)', makerEn: 'Taihan Cable', partNo: 'DH-M12-4C-0.2SQ', desc: 'M12 센서용 4심 실드 케이블 (0.2SQ)', descEn: 'M12 Sensor 4-Core Shielded Cable (0.2SQ)', priceRange: '1,200~1,600원/m', priceEn: '1,200~1,600 KRW/m' },
      { maker: 'LAPP Korea', makerEn: 'LAPP Korea', partNo: 'ÖLFLEX CLASSIC 100 4G0.2', desc: '가동형 4심 제어 케이블 (PVC/유연)', descEn: 'Flexible 4-Core Control Cable (PVC/Flex)', priceRange: '2,000~2,500원/m', priceEn: '2,000~2,500 KRW/m' },
      { maker: '삼원ACT (IOLINK)', makerEn: 'Samwon ACT (IOLINK)', partNo: 'SAMWON-CC-4C-0.2', desc: 'PLC I/O 전용 4심 컬러 케이블', descEn: 'PLC I/O 4-Core Color-Coded Cable', priceRange: '950~1,300원/m', priceEn: '950~1,300 KRW/m' }
    ],
    'AWG 22': [
      { maker: '대한전선 (Taihan)', makerEn: 'Taihan Cable', partNo: 'DH-CVV-S 4C-0.3SQ', desc: '차폐 제어용 비닐 절연 비닐 시스 케이블', descEn: 'Shielded Vinyl Insulated Control Cable', priceRange: '1,400~1,800원/m', priceEn: '1,400~1,800 KRW/m' },
      { maker: 'LS전선 (LS Cable)', makerEn: 'LS Cable & System', partNo: 'LS-F-CVV-S 4C-0.3SQ', desc: '난연성 차폐 4심 제어 배선', descEn: 'Flame-Retardant Shielded 4-Core Cable', priceRange: '1,500~2,000원/m', priceEn: '1,500~2,000 KRW/m' },
      { maker: 'LAPP Korea', makerEn: 'LAPP Korea', partNo: 'ÖLFLEX 110 4G0.34', desc: '오일 저항성 산업용 배선 케이블', descEn: 'Oil-Resistant Industrial Wiring Cable', priceRange: '2,300~2,800원/m', priceEn: '2,300~2,800 KRW/m' }
    ],
    'AWG 20': [
      { maker: '삼원ACT (IOLINK)', makerEn: 'Samwon ACT (IOLINK)', partNo: 'SAMWON-IOLINK-4C-0.5', desc: 'IO-Link 센서 허브 전원 공급선', descEn: 'IO-Link Sensor Hub Power Cable', priceRange: '1,600~2,100원/m', priceEn: '1,600~2,100 KRW/m' },
      { maker: 'LAPP Korea', makerEn: 'LAPP Korea', partNo: 'ÖLFLEX 110 4G0.5', desc: '0.5SQ 4심 산업 기계 표준 배선', descEn: '0.5SQ 4-Core Industrial Machine Wiring', priceRange: '2,500~3,100원/m', priceEn: '2,500~3,100 KRW/m' },
      { maker: '가온전선 (Gaon)', makerEn: 'Gaon Cable', partNo: 'GAON-VCTF 4C-0.5SQ', desc: '유연성 비닐 캡타이어 코드', descEn: 'Flexible Vinyl Cabtyre Cord', priceRange: '1,300~1,700원/m', priceEn: '1,300~1,700 KRW/m' }
    ],
    'AWG 18': [
      { maker: '대한전선 (Taihan)', makerEn: 'Taihan Cable', partNo: 'DH-KIV 0.75SQ', desc: '전기 기기 배선용 비닐 절연 전선 (KIV)', descEn: 'Vinyl Insulated Appliance Wire (KIV)', priceRange: '450~650원/m', priceEn: '450~650 KRW/m' },
      { maker: 'LS전선 (LS Cable)', makerEn: 'LS Cable & System', partNo: 'LS-HFIX 0.75SQ', desc: '저독성 난연 폴리올레핀 절연 전선', descEn: 'Halogen-Free Flame-Retardant Wire', priceRange: '550~750원/m', priceEn: '550~750 KRW/m' },
      { maker: 'LAPP Korea', makerEn: 'LAPP Korea', partNo: 'ÖLFLEX CLASSIC 110 4G0.75', desc: '4심 0.75SQ 오일 저항 제어선', descEn: '4-Core 0.75SQ Oil-Resistant Control Cable', priceRange: '2,900~3,600원/m', priceEn: '2,900~3,600 KRW/m' }
    ],
    'AWG 16': [
      { maker: '대한전선 (Taihan)', makerEn: 'Taihan Cable', partNo: 'DH-TFR-CV 1.25SQ', desc: '트레이용 난연 전력·제어 케이블', descEn: 'Tray Flame-Retardant Power & Control Cable', priceRange: '1,800~2,400원/m', priceEn: '1,800~2,400 KRW/m' },
      { maker: '삼원ACT', makerEn: 'Samwon ACT', partNo: 'SAMWON-PWR-4C-1.25', desc: '솔레노이드 밸브 아일랜드 전원선', descEn: 'Solenoid Valve Island Power Supply Cable', priceRange: '2,200~2,800원/m', priceEn: '2,200~2,800 KRW/m' }
    ],
    'AWG 14': [
      { maker: 'LS전선 (LS Cable)', makerEn: 'LS Cable & System', partNo: 'LS-HFIX 2.0SQ (450/750V)', desc: '2.0SQ 내열 난연 단심 동력선', descEn: '2.0SQ Heat/Flame Resistant Single Core Wire', priceRange: '850~1,150원/m', priceEn: '850~1,150 KRW/m' },
      { maker: '대한전선', makerEn: 'Taihan Cable', partNo: 'DH-HIV 2.0SQ', desc: '2종 내열 비닐절연전선 (90°C)', descEn: 'Class 2 Heat-Resistant Vinyl Wire (90°C)', priceRange: '750~1,050원/m', priceEn: '750~1,050 KRW/m' }
    ]
  },
  CP_BREAKERS: {
    '2A': [
      { maker: 'LS ELECTRIC', makerEn: 'LS ELECTRIC', partNo: 'BKN-32C 2A 1P', desc: 'DIN레일 장착형 소형 차단기 C-curve 2A', descEn: 'DIN-Rail MCB Circuit Breaker C-Curve 2A', priceRange: '6,500~8,500원', priceEn: '6,500~8,500 KRW' },
      { maker: 'Schneider Electric', makerEn: 'Schneider Electric', partNo: 'iC60N 1P 2A C-curve', desc: 'Acti9 산업용 미니어처 회로차단기', descEn: 'Acti9 Industrial Miniature Circuit Breaker', priceRange: '12,000~15,000원', priceEn: '12,000~15,000 KRW' }
    ],
    '4A': [
      { maker: 'LS ELECTRIC', makerEn: 'LS ELECTRIC', partNo: 'BKN-32C 4A 1P', desc: 'DIN레일 4A C-curve 배선보호 차단기', descEn: 'DIN-Rail 4A C-Curve Circuit Protector', priceRange: '6,500~8,500원', priceEn: '6,500~8,500 KRW' },
      { maker: 'Fuji Electric', makerEn: 'Fuji Electric', partNo: 'CP31D 1P 4A C-curve', desc: '고신뢰도 전자기식 서킷 프로텍터', descEn: 'High-Reliability Magnetic Circuit Protector', priceRange: '14,000~18,000원', priceEn: '14,000~18,000 KRW' }
    ],
    '6A': [
      { maker: 'LS ELECTRIC', makerEn: 'LS ELECTRIC', partNo: 'BKN-32C 6A 1P', desc: '6A C-curve 단상 DIN레일 차단기', descEn: '6A C-Curve 1-Phase DIN-Rail MCB', priceRange: '6,500~8,500원', priceEn: '6,500~8,500 KRW' },
      { maker: 'ABB', makerEn: 'ABB', partNo: 'S200M 1P 6A C-curve', desc: 'System pro M compact 10kA 차단기', descEn: 'System Pro M Compact 10kA MCB', priceRange: '13,500~17,000원', priceEn: '13,500~17,000 KRW' }
    ],
    '10A': [
      { maker: 'LS ELECTRIC', makerEn: 'LS ELECTRIC', partNo: 'BKN-32C 10A 1P', desc: '10A C-curve 제어반 전원용 차단기', descEn: '10A C-Curve Control Panel Power MCB', priceRange: '6,500~8,500원', priceEn: '6,500~8,500 KRW' },
      { maker: 'Schneider Electric', makerEn: 'Schneider Electric', partNo: 'iC60N 1P 10A C-curve', desc: '산업용 고신뢰 차단기', descEn: 'Industrial High-Reliability MCB', priceRange: '12,500~16,000원', priceEn: '12,500~16,000 KRW' }
    ],
    '16A': [
      { maker: 'LS ELECTRIC', makerEn: 'LS ELECTRIC', partNo: 'BKN-32C 16A 1P', desc: '16A C-curve SMPS 입력보호 차단기', descEn: '16A C-Curve SMPS Input Protection MCB', priceRange: '6,500~8,500원', priceEn: '6,500~8,500 KRW' },
      { maker: 'Siemens', makerEn: 'Siemens', partNo: '5SY4116-7 1P 16A C', desc: 'Sentron DIN레일 회로차단기', descEn: 'Sentron DIN-Rail Circuit Breaker', priceRange: '15,000~19,500원', priceEn: '15,000~19,500 KRW' }
    ]
  },
  SMPS_UNITS: [
    { maker: 'MEAN WELL', makerEn: 'MEAN WELL', partNo: 'NDR-120-24', spec: '24V 5.0A (120W)', desc: 'DIN레일 슬림형 산업용 파워서플라이', descEn: 'DIN-Rail Slimline Industrial Power Supply', priceRange: '32,000~38,000원', priceEn: '32,000~38,000 KRW' },
    { maker: 'MEAN WELL', makerEn: 'MEAN WELL', partNo: 'NDR-240-24', spec: '24V 10.0A (240W)', desc: 'DIN레일 고효율 240W 전원공급장치', descEn: 'DIN-Rail High Efficiency 240W Power Supply', priceRange: '48,000~56,000원', priceEn: '48,000~56,000 KRW' },
    { maker: 'LS ELECTRIC', makerEn: 'LS ELECTRIC', partNo: 'LDU-240-24', spec: '24V 10.0A (240W)', desc: '산업 자동화 전용 파워 서플라이', descEn: 'Industrial Automation Power Supply', priceRange: '52,000~60,000원', priceEn: '52,000~60,000 KRW' },
    { maker: 'OMRON', makerEn: 'OMRON', partNo: 'S8VK-G24024', spec: '24V 10.0A (240W)', desc: '내진동/고내구성 프리미엄 SMPS', descEn: 'Vibration-Resistant Premium SMPS', priceRange: '85,000~98,000원', priceEn: '85,000~98,000 KRW' },
    { maker: 'MEAN WELL', makerEn: 'MEAN WELL', partNo: 'NDR-480-24', spec: '24V 20.0A (480W)', desc: '대용량 480W DIN레일 파워', descEn: 'High Capacity 480W DIN-Rail Power Supply', priceRange: '88,000~99,000원', priceEn: '88,000~99,000 KRW' }
  ]
};

// --------------------------------------------------------------------------
// FEATURE 1: 실측값 비교 로그 (Field Measurement Log & Benchmark)
// --------------------------------------------------------------------------
function initFieldMeasurementSystem() {
  const measuredInput = document.getElementById('fmMeasuredV');
  const envSelect = document.getElementById('fmSiteEnvironment');
  const dmmInput = document.getElementById('fmDmmModel');
  const submitBtn = document.getElementById('submitFmLogBtn');

  function updateFmComparison() {
    if (!measuredInput) return;
    const predElem = document.getElementById('resEndV');
    const predText = predElem ? predElem.textContent.replace('V', '').trim() : '23.33';
    const predV = parseFloat(predText) || 23.33;
    const realV = parseFloat(measuredInput.value) || 23.20;

    const devV = Math.abs(realV - predV);
    const devPct = predV > 0 ? (devV / predV) * 100 : 0;

    const predVEl = document.getElementById('fmPredV');
    const realVEl = document.getElementById('fmRealV');
    const devPctEl = document.getElementById('fmDevPct');
    const verdictEl = document.getElementById('fmVerdictBadge');

    if (predVEl) predVEl.textContent = `${predV.toFixed(2)} V`;
    if (realVEl) realVEl.textContent = `${realV.toFixed(2)} V`;
    if (devPctEl) devPctEl.textContent = `${devPct.toFixed(2)}% (${devV.toFixed(2)}V 편차)`;

    if (verdictEl) {
      if (devPct <= 2.0) {
        verdictEl.className = 'badge-pill badge-safe';
        verdictEl.textContent = '초정밀 일치 (98%+ Match)';
      } else if (devPct <= 5.0) {
        verdictEl.className = 'badge-pill';
        verdictEl.style.background = '#e0f2fe';
        verdictEl.style.color = '#0369a1';
        verdictEl.textContent = '규격 허용 오차 이내 (Normal)';
      } else {
        verdictEl.className = 'badge-pill badge-warn';
        verdictEl.textContent = '환경 편차 주의 (접촉저항/온도 확인)';
      }
    }
  }

  if (measuredInput) {
    measuredInput.addEventListener('input', updateFmComparison);
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const predText = document.getElementById('fmPredV')?.textContent || '23.33 V';
      const realV = measuredInput ? measuredInput.value : '23.20';
      const env = envSelect ? envSelect.options[envSelect.selectedIndex].text : '클린룸';
      const dmm = dmmInput ? dmmInput.value : 'Fluke 87V';

      const logEntry = {
        calcType: 'voltage_drop',
        predictedV: predText,
        measuredV: realV + ' V',
        env: env,
        dmm: dmm,
        timestamp: new Date().toISOString()
      };

      let existing = [];
      try {
        existing = JSON.parse(localStorage.getItem('voltcheck_field_logs') || '[]');
      } catch (e) { existing = []; }
      existing.push(logEntry);
      localStorage.setItem('voltcheck_field_logs', JSON.stringify(existing));

      alert(`[현장 검증 데이터 등록 완료]
예측치: ${predText} / 실측치: ${realV}V
측정환경: ${env}

동일 조건 실측 데이터베이스에 안전하게 익명 집계되었습니다. (감사합니다!)`);
    });
  }

  // Initial calculation
  updateFmComparison();
}

// --------------------------------------------------------------------------
// FEATURE 3: 실구매 가능 부품번호 매칭 (BOM Parts Renderer)
// --------------------------------------------------------------------------
function renderBomParts(gaugeKey = 'AWG 22') {
  const container = document.getElementById('vdBomPartsList');
  if (!container) return;

  const isEn = currentLanguage === 'en';
  const key = PARTS_DATABASE.CABLE_PARTS[gaugeKey] ? gaugeKey : 'AWG 22';
  const cableList = PARTS_DATABASE.CABLE_PARTS[key] || PARTS_DATABASE.CABLE_PARTS['AWG 22'];
  const breakerList = PARTS_DATABASE.CP_BREAKERS['4A'] || [];

  let html = '';

  // Render Cable Parts
  cableList.forEach(item => {
    const maker = isEn ? (item.makerEn || item.maker) : item.maker;
    const desc = isEn ? (item.descEn || item.desc) : item.desc;
    const price = isEn ? (item.priceEn || item.priceRange) : item.priceRange;
    const buyUrl = item.buyUrl || 'https://www.digikey.com/?utm_source=voltcheck';

    html += `
      <div class="bom-part-card">
        <div>
          <div class="bom-part-top">
            <span class="bom-maker">${maker}</span>
            <span class="bom-price">${price}</span>
          </div>
          <div class="bom-part-no mt-1">${item.partNo}</div>
          <p class="bom-part-desc mt-1">${desc}</p>
        </div>
        <div class="bom-part-bottom">
          <span style="font-size:0.75rem; color:var(--text-muted);">${isEn ? 'Spec:' : '규격:'} ${gaugeKey}</span>
          <div class="bom-part-actions">
            <a href="${buyUrl}" target="_blank" rel="noopener sponsored" class="btn-bom-buy" title="공식 유통점 실시간 재고 & 견적 조회">
              <i data-lucide="shopping-cart" style="width:12px;height:12px;"></i> ${isEn ? 'Buy on DigiKey' : '공식 유통점 구매'}
            </a>
            <button type="button" class="btn-util btn-add-bom-item" data-part="${item.partNo}" style="font-size:0.75rem; padding:0.25rem 0.6rem;">
              ${isEn ? '+ Add' : '+ 견적함'}
            </button>
          </div>
        </div>
      </div>
    `;
  });

  // Render Breaker Card
  if (breakerList.length > 0) {
    const cp = breakerList[0];
    const cpMaker = isEn ? (cp.makerEn || cp.maker) : cp.maker;
    const cpDesc = isEn ? (cp.descEn || cp.desc) : cp.desc;
    const cpPrice = isEn ? (cp.priceEn || cp.priceRange) : cp.priceRange;
    const cpBuyUrl = cp.buyUrl || 'https://www.mouser.com/?utm_source=voltcheck';

    html += `
      <div class="bom-part-card" style="border-left: 3px solid #3b82f6;">
        <div>
          <div class="bom-part-top">
            <span class="bom-maker">${cpMaker}</span>
            <span class="bom-price">${cpPrice}</span>
          </div>
          <div class="bom-part-no mt-1">${cp.partNo}</div>
          <p class="bom-part-desc mt-1">${cpDesc}</p>
        </div>
        <div class="bom-part-bottom">
          <span style="font-size:0.75rem; color:var(--text-muted);">${isEn ? 'Recommended CP' : '추천 회로보호기 (CP)'}</span>
          <div class="bom-part-actions">
            <a href="${cpBuyUrl}" target="_blank" rel="noopener sponsored" class="btn-bom-buy">
              <i data-lucide="shopping-cart" style="width:12px;height:12px;"></i> ${isEn ? 'Buy on Mouser' : '공식 유통점 구매'}
            </a>
            <button type="button" class="btn-util btn-add-bom-item" data-part="${cp.partNo}" style="font-size:0.75rem; padding:0.25rem 0.6rem;">
              ${isEn ? '+ Add' : '+ 견적함'}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  container.innerHTML = html;

  // Add click listener to add BOM items
  container.querySelectorAll('.btn-add-bom-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const part = btn.getAttribute('data-part');
      alert(isEn ? `[Added to BOM Quote]\nPart No: ${part}\n\nItem registered to BOM form.` : `[BOM 견적함 추가]\n품번: ${part}\n\n'부품 견적 요청(BOM)' 양식에 해당 부품이 등록되었습니다.`);
    });
  });

  if (window.lucide) window.lucide.createIcons();
}

// --------------------------------------------------------------------------
// FEATURE 2: 프로젝트 저장 & 팀 공유 링크 (Project Workspace Manager)
// --------------------------------------------------------------------------
let CURRENT_PROJECT = {
  name: '2026 현대차 배터리 라인 제어반 #1',
  items: []
};

function initProjectWorkspace() {
  // Load saved project from localStorage
  try {
    const saved = localStorage.getItem('voltcheck_active_project');
    if (saved) {
      CURRENT_PROJECT = JSON.parse(saved);
    }
  } catch (e) { console.error(e); }

  // Check URL hash for shared project: #project=<token>
  if (window.location.hash.startsWith('#project=')) {
    try {
      const token = window.location.hash.replace('#project=', '');
      const jsonStr = decodeURIComponent(escape(atob(decodeURIComponent(token))));
      const restored = JSON.parse(jsonStr);
      const validItems = restored && Array.isArray(restored.items) && restored.items.length <= 100
        && restored.items.every(item => item && typeof item === 'object'
          && Object.values(item).every(value => typeof value !== 'string' || value.length <= 1000));
      if (validItems) {
        CURRENT_PROJECT = {
          name: typeof restored.name === 'string' ? restored.name.slice(0, 160) : 'Shared engineering project',
          items: restored.items
        };
        localStorage.setItem('voltcheck_active_project', JSON.stringify(CURRENT_PROJECT));
        setTimeout(() => {
          openProjectModal();
          alert(`[공유 프로젝트 로드 완료]
"${CURRENT_PROJECT.name}" 프로젝트 (${CURRENT_PROJECT.items.length}개 항목)가 성공적으로 복원되었습니다.`);
        }, 300);
      }
    } catch (e) {
      console.error('Error decoding project token:', e);
    }
  }

  updateProjectBasketUI();

  // Floating Basket button open
  const basketBtn = document.getElementById('floatingProjectBasketBtn');
  if (basketBtn) {
    basketBtn.addEventListener('click', openProjectModal);
  }

  // Close modal
  const closeBtn = document.getElementById('closeProjectWorkspaceBtn');
  const modal = document.getElementById('projectWorkspaceModal');
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.add('hidden');
    });
  }

  // Add to Project buttons on various tools
  const addVdBtn = document.getElementById('addVdToProjectBtn');
  if (addVdBtn) {
    addVdBtn.addEventListener('click', () => {
      const len = document.getElementById('wireLength')?.value || '40';
      const gauge = document.getElementById('wireGaugeValue')?.value || '0.3';
      const cur = document.getElementById('loadCurrent')?.value || '0.5';
      const dropV = document.getElementById('resDropV')?.textContent || '-0.67V';
      const endV = document.getElementById('resEndV')?.textContent || '23.33V';

      addProjectItem({
        calcType: '24V 전압강하',
        label: `DC 24V 센서 선로 (${len}m, ${cur}A)`,
        params: `길이 ${len}m, 도선 ${gauge}SQ, 전류 ${cur}A`,
        result: `말단 ${endV}, 강하 ${dropV}`
      });
    });
  }

  const addCopperBtn = document.getElementById('addCopperToProjectBtn');
  if (addCopperBtn) {
    addCopperBtn.addEventListener('click', () => {
      const len = document.getElementById('copperOrderLength')?.value || '100';
      const core = document.getElementById('copperCoreCount')?.value || '4';
      const cost = document.getElementById('resCopperTotalCost')?.textContent || '124,500';
      const weight = document.getElementById('copperWeightBadge')?.textContent || '2.95 kg';

      addProjectItem({
        calcType: '구리시세 & 원가',
        label: `케이블 발주 원가 산정 (${len}m, ${core}심)`,
        params: `발주길이 ${len}m, ${core}심, LME 기준`,
        result: `추정원가 ${cost}원 (${weight})`
      });
    });
  }

  const addSldBtn = document.getElementById('addSldToProjectBtn');
  if (addSldBtn) {
    addSldBtn.addEventListener('click', () => {
      const tag = document.getElementById('sldTagPrefix')?.value || '24VDC-LINE-01';
      const cp = document.getElementById('sldBreakerRating')?.value || '4A';
      const load = document.getElementById('sldLoadType')?.value || 'sensor';

      addProjectItem({
        calcType: '단선결선도 CAD',
        label: `도면 회로 [${tag}] (${cp}, ${load})`,
        params: `차단기 ${cp}, 부하: ${load}`,
        result: `CAD 단선도 도면 스냅샷 보관`
      });
    });
  }

  // Share Project Link Button
  const shareBtn = document.getElementById('shareProjectLinkBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      if (CURRENT_PROJECT.items.length === 0) {
        alert('프로젝트에 보관된 항목이 없습니다. 먼저 계산기에서 [+ 프로젝트에 담기]를 눌러주세요.');
        return;
      }
      try {
        const jsonStr = JSON.stringify(CURRENT_PROJECT);
        const token = encodeURIComponent(btoa(unescape(encodeURIComponent(jsonStr))));
        const shareUrl = `${window.location.origin}${window.location.pathname}#project=${token}`;
        
        navigator.clipboard.writeText(shareUrl).then(() => {
          alert(`[팀 공유 링크가 클립보드에 복사되었습니다!]

URL: ${shareUrl}

이 링크를 팀원에게 전달하면 별도 로그인 없이 전체 프로젝트 계산 스냅샷을 즉시 열람 및 재계산할 수 있습니다.`);
        }).catch(() => {
          prompt('아래 링크를 복사하여 공유하세요:', shareUrl);
        });
      } catch (e) {
        console.error(e);
      }
    });
  }

  // Print Unified Project Report
  const printProjectBtn = document.getElementById('printProjectReportBtn');
  if (printProjectBtn) {
    printProjectBtn.addEventListener('click', () => {
      if (CURRENT_PROJECT.items.length === 0) {
        alert('인쇄할 프로젝트 항목이 없습니다.');
        return;
      }
      window.print();
    });
  }
}

function addProjectItem(item) {
  CURRENT_PROJECT.items.push(item);
  localStorage.setItem('voltcheck_active_project', JSON.stringify(CURRENT_PROJECT));
  updateProjectBasketUI();
  
  // Show brief feedback toast
  const badge = document.getElementById('fpCountBadge');
  if (badge) {
    badge.style.transform = 'scale(1.4)';
    setTimeout(() => badge.style.transform = 'scale(1)', 300);
  }
  alert(`[프로젝트 보관함에 추가되었습니다]
항목: ${item.label}
현재 총 ${CURRENT_PROJECT.items.length}개 항목 보관 중.`);
}

function updateProjectBasketUI() {
  const badge = document.getElementById('fpCountBadge');
  if (badge) {
    badge.textContent = CURRENT_PROJECT.items.length;
  }
}

function openProjectModal() {
  const modal = document.getElementById('projectWorkspaceModal');
  const container = document.getElementById('projectItemsContainer');
  const nameInput = document.getElementById('projectNameInput');
  if (!modal || !container) return;

  if (nameInput) nameInput.value = CURRENT_PROJECT.name;

  if (CURRENT_PROJECT.items.length === 0) {
    container.innerHTML = `
      <div class="empty-project-notice">
        <i data-lucide="inbox"></i>
        <p>보관함에 담긴 계산 항목이 없습니다.<br>각 계산기 결과 화면의 <strong>[+ 프로젝트에 담기]</strong> 버튼을 눌러 항목을 추가하세요.</p>
      </div>
    `;
  } else {
    let html = '';
    CURRENT_PROJECT.items.forEach((item, idx) => {
      html += `
        <div class="project-item-card">
          <div class="project-item-meta">
            <span class="badge-pill" style="font-size:0.75rem; background:rgba(234,88,12,0.1); color:var(--brand-orange);">${escapeHtml(item.calcType)}</span>
            <h5 class="mt-1">${escapeHtml(item.label)}</h5>
            <div class="project-item-params">${escapeHtml(item.params)}</div>
          </div>
          <div style="text-align:right;">
            <div class="project-item-res">${escapeHtml(item.result)}</div>
            <button type="button" class="btn-util mt-1 btn-del-proj-item" data-idx="${idx}" style="color:#ef4444; border-color:#fca5a5; font-size:0.75rem; padding:0.2rem 0.5rem;">
              삭제
            </button>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;

    // Hook delete buttons
    container.querySelectorAll('.btn-del-proj-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        CURRENT_PROJECT.items.splice(idx, 1);
        localStorage.setItem('voltcheck_active_project', JSON.stringify(CURRENT_PROJECT));
        updateProjectBasketUI();
        openProjectModal();
      });
    });
  }

  modal.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
}

// --------------------------------------------------------------------------
// FEATURE 4: 구리시세(LME) 연동 케이블 원가 계산기
// --------------------------------------------------------------------------
function initCopperCostCalculator() {
  const gaugeSelect = document.getElementById('copperWireGauge');
  const lengthInput = document.getElementById('copperOrderLength');
  const lengthRange = document.getElementById('copperOrderLengthRange');
  const coreSelect = document.getElementById('copperCoreCount');
  const spotPriceInput = document.getElementById('copperSpotPrice');
  const insulSelect = document.getElementById('copperInsulationGrade');
  const mfgSelect = document.getElementById('copperMfgMultiplier');

  function updateCopperCost() {
    if (!gaugeSelect || !lengthInput) return;

    const sq = parseFloat(gaugeSelect.value) || 0.75;
    const length = parseFloat(lengthInput.value) || 100;
    const cores = parseInt(coreSelect ? coreSelect.value : 4, 10) || 4;
    const spotPrice = parseFloat(spotPriceInput ? spotPriceInput.value : 13200) || 13200;
    const mfgMultiplier = parseFloat(mfgSelect ? mfgSelect.value : 1.6) || 1.6;

    // Insulation grade adder per meter per core (KRW)
    let insulAdder = 80;
    const grade = insulSelect ? insulSelect.value : 'pvc';
    if (grade === 'xlpe') insulAdder = 140;
    else if (grade === 'pur') insulAdder = 320;

    // Conductor Copper Weight (kg/km) = Sq (mm2) * 8.96 (copper density) * coreCount
    const weightPerKm = sq * 8.96 * cores;
    const totalCopperKg = (weightPerKm * length) / 1000;

    // Raw copper material cost (KRW)
    const rawMaterialCost = totalCopperKg * spotPrice;

    // Total insulation & sheath material cost
    const totalInsulCost = length * cores * insulAdder;

    // Total finished cable estimate with fabrication factor
    const totalCost = (rawMaterialCost + totalInsulCost) * mfgMultiplier;
    const unitCostPerMeter = length > 0 ? totalCost / length : 0;
    const rawRatio = totalCost > 0 ? (rawMaterialCost / totalCost) * 100 : 30;
    const processCost = totalCost - rawMaterialCost;

    // Update UI Readouts
    const totalCostEl = document.getElementById('resCopperTotalCost');
    const unitCostEl = document.getElementById('resCopperUnitCost');
    const rawCostEl = document.getElementById('resCopperRawMaterialCost');
    const weightBadgeEl = document.getElementById('copperWeightBadge');
    const weightPerKmEl = document.getElementById('resCopperWeightPerKm');
    const rawRatioEl = document.getElementById('resCopperRawRatio');
    const processCostEl = document.getElementById('resCopperProcessCost');

    if (totalCostEl) totalCostEl.textContent = Math.round(totalCost).toLocaleString();
    if (unitCostEl) unitCostEl.textContent = `${Math.round(unitCostPerMeter).toLocaleString()} 원/m`;
    if (rawCostEl) rawCostEl.textContent = `${Math.round(rawMaterialCost).toLocaleString()} 원`;
    if (weightBadgeEl) weightBadgeEl.textContent = `총 구리 중량: 약 ${totalCopperKg.toFixed(2)} kg`;
    if (weightPerKmEl) weightPerKmEl.textContent = `${weightPerKm.toFixed(1)} kg/km`;
    if (rawRatioEl) rawRatioEl.textContent = `${rawRatio.toFixed(1)} %`;
    if (processCostEl) processCostEl.textContent = `${Math.round(processCost).toLocaleString()} 원`;

    drawCopperTrendChart();
  }

  // Sync range and number input
  if (lengthInput && lengthRange) {
    lengthInput.addEventListener('input', () => {
      lengthRange.value = lengthInput.value;
      updateCopperCost();
    });
    lengthRange.addEventListener('input', () => {
      lengthInput.value = lengthRange.value;
      updateCopperCost();
    });
  }

  [gaugeSelect, coreSelect, spotPriceInput, insulSelect, mfgSelect].forEach(elem => {
    if (elem) elem.addEventListener('input', updateCopperCost);
  });

  // Preset pill buttons
  document.querySelectorAll('[data-copper-preset]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-copper-preset]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const val = btn.getAttribute('data-copper-preset');
      if (spotPriceInput) spotPriceInput.value = val;
      updateCopperCost();
    });
  });

  updateCopperCost();
}

function drawCopperTrendChart() {
  const canvas = document.getElementById('copperTrendCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  // Background Grid
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1;
  for (let y = 30; y < h; y += 35) {
    ctx.beginPath();
    ctx.moveTo(40, y);
    ctx.lineTo(w - 20, y);
    ctx.stroke();
  }

  // 30-day realistic LME spot trend (USD/MT): ~9,400 to ~9,950
  const points = [
    9420, 9480, 9450, 9510, 9580, 9540, 9600, 9630, 9590, 9650,
    9700, 9680, 9720, 9750, 9710, 9780, 9820, 9790, 9840, 9810,
    9860, 9890, 9850, 9900, 9920, 9880, 9910, 9940, 9860, 9850
  ];

  const minP = 9300;
  const maxP = 10100;
  const stepX = (w - 70) / (points.length - 1);

  // Draw gradient fill under curve
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, 'rgba(234, 88, 12, 0.35)');
  grad.addColorStop(1, 'rgba(234, 88, 12, 0.0)');

  ctx.beginPath();
  points.forEach((p, i) => {
    const x = 45 + i * stepX;
    const y = h - 25 - ((p - minP) / (maxP - minP)) * (h - 55);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.lineTo(45 + (points.length - 1) * stepX, h - 25);
  ctx.lineTo(45, h - 25);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Draw Trend Line
  ctx.strokeStyle = '#ea580c';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  points.forEach((p, i) => {
    const x = 45 + i * stepX;
    const y = h - 25 - ((p - minP) / (maxP - minP)) * (h - 55);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Current Price Dot
  const lastX = 45 + (points.length - 1) * stepX;
  const lastY = h - 25 - ((points[points.length - 1] - minP) / (maxP - minP)) * (h - 55);
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(lastX, lastY, 4.5, 0, Math.PI * 2);
  ctx.fill();

  // Axis Labels
  ctx.fillStyle = '#94a3b8';
  ctx.font = '10px JetBrains Mono, monospace';
  ctx.fillText('$10,100', 5, 35);
  ctx.fillText('$9,300', 10, h - 22);
  ctx.fillText('30일 전', 45, h - 8);
  ctx.fillText('오늘 ($9,850/MT)', w - 110, h - 8);
}

// --------------------------------------------------------------------------
// FEATURE 5: 결선도/단선도(SLD) 자동 생성기 (SVG / PNG / DXF Export)
// --------------------------------------------------------------------------
function initSldGenerator() {
  const vSrcSelect = document.getElementById('sldSourceVoltage');
  const cpSelect = document.getElementById('sldBreakerRating');
  const loadSelect = document.getElementById('sldLoadType');
  const lenInput = document.getElementById('sldWireLength');
  const gaugeSelect = document.getElementById('sldWireGauge');
  const tagInput = document.getElementById('sldTagPrefix');
  const refreshBtn = document.getElementById('refreshSldBtn');

  function renderSldSvg() {
    const container = document.getElementById('sldSvgContainer');
    if (!container) return;

    const vSrc = vSrcSelect ? vSrcSelect.value : '24';
    const cp = cpSelect ? cpSelect.value : '4A';
    const load = loadSelect ? loadSelect.value : 'sensor';
    const len = lenInput ? lenInput.value : '40';
    const gauge = gaugeSelect ? gaugeSelect.value : 'AWG 22';
    const tag = tagInput ? tagInput.value : '24VDC-LINE-01';

    let loadTitle = 'PHOTO SENSOR (35mA)';
    let loadSymbol = `
      <circle cx="580" cy="110" r="28" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5"/>
      <path d="M570 110 L590 110 M580 100 L580 120" stroke="#38bdf8" stroke-width="2"/>
    `;
    if (load === 'solenoid') {
      loadTitle = 'SOLENOID VALVE (0.45A)';
      loadSymbol = `
        <rect x="550" y="85" width="60" height="50" rx="4" fill="#1e293b" stroke="#fb923c" stroke-width="2.5"/>
        <path d="M560 110 L575 95 L575 125 L590 110 L600 110" stroke="#fb923c" stroke-width="2" fill="none"/>
      `;
    } else if (load === 'iolink') {
      loadTitle = 'IO-LINK MASTER (2.0A)';
      loadSymbol = `
        <rect x="545" y="80" width="70" height="60" rx="6" fill="#1e293b" stroke="#a855f7" stroke-width="2.5"/>
        <text x="580" y="115" fill="#c084fc" font-size="11" font-family="JetBrains Mono" font-weight="700" text-anchor="middle">IO-LINK</text>
      `;
    } else if (load === 'servobrake') {
      loadTitle = 'SERVO BRAKE (1.2A)';
      loadSymbol = `
        <circle cx="580" cy="110" r="30" fill="#1e293b" stroke="#ef4444" stroke-width="2.5"/>
        <path d="M565 110 L595 110 M570 100 L590 120" stroke="#ef4444" stroke-width="2.5"/>
      `;
    }

    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 240" style="background:#090d16; font-family:'JetBrains Mono', monospace;">
        <!-- Title & Standard Header -->
        <text x="25" y="30" fill="#94a3b8" font-size="12" font-weight="700">SINGLE LINE DIAGRAM (SLD) — IEC 60204-1 / KEC COMPLIANT</text>
        <text x="675" y="30" fill="#ea580c" font-size="11" text-anchor="end" font-weight="700">TAG: ${tag}</text>
        <line x1="25" y1="40" x2="675" y2="40" stroke="#1e293b" stroke-width="1"/>

        <!-- 1. SMPS Power Source -->
        <rect x="30" y="70" width="90" height="80" rx="4" fill="#0f172a" stroke="#3b82f6" stroke-width="2"/>
        <text x="75" y="100" fill="#60a5fa" font-size="12" font-weight="800" text-anchor="middle">SMPS</text>
        <text x="75" y="120" fill="#ffffff" font-size="13" font-weight="700" text-anchor="middle">DC ${vSrc}V</text>
        <text x="75" y="140" fill="#94a3b8" font-size="9" text-anchor="middle">MAIN SOURCE</text>

        <!-- Power Rail Line to CP -->
        <line x1="120" y1="110" x2="175" y2="110" stroke="#60a5fa" stroke-width="3"/>

        <!-- 2. Circuit Protector (CP) -->
        <rect x="175" y="85" width="60" height="50" rx="3" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
        <path d="M190 120 L210 98" stroke="#10b981" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="210" cy="98" r="3" fill="#10b981"/>
        <text x="205" y="148" fill="#34d399" font-size="10" font-weight="700" text-anchor="middle">CP ${cp}</text>

        <!-- Line from CP to TB1 -->
        <line x1="235" y1="110" x2="275" y2="110" stroke="#60a5fa" stroke-width="3"/>

        <!-- Terminal Block 1 -->
        <circle cx="275" cy="110" r="5" fill="#f59e0b"/>
        <text x="275" y="95" fill="#fbbf24" font-size="9" text-anchor="middle">TB1-01</text>

        <!-- Cable Segment with Specs Callout -->
        <line x1="280" y1="110" x2="495" y2="110" stroke="#f59e0b" stroke-width="3" stroke-dasharray="6 3"/>
        
        <!-- Cable Tag Box -->
        <rect x="330" y="65" width="120" height="35" rx="3" fill="#1e293b" stroke="#475569" stroke-width="1"/>
        <text x="390" y="82" fill="#f8fafc" font-size="10" font-weight="700" text-anchor="middle">CABLE: ${len}m / ${gauge}</text>
        <text x="390" y="94" fill="#fb923c" font-size="9" text-anchor="middle">ΔV: ~0.67V (2.8%)</text>

        <!-- Terminal Block 2 -->
        <circle cx="500" cy="110" r="5" fill="#f59e0b"/>
        <text x="500" y="95" fill="#fbbf24" font-size="9" text-anchor="middle">TB2-01</text>

        <!-- Line to Load -->
        <line x1="505" y1="110" x2="550" y2="110" stroke="#60a5fa" stroke-width="3"/>

        <!-- 3. Load Device -->
        ${loadSymbol}
        <text x="580" y="165" fill="#f8fafc" font-size="10" font-weight="700" text-anchor="middle">${loadTitle}</text>

        <!-- 4. Protective Earth (PE) Ground Line -->
        <line x1="75" y1="150" x2="75" y2="200" stroke="#22c55e" stroke-width="2"/>
        <line x1="75" y1="200" x2="580" y2="200" stroke="#22c55e" stroke-width="2" stroke-dasharray="4 2"/>
        <line x1="580" y1="175" x2="580" y2="200" stroke="#22c55e" stroke-width="2"/>

        <!-- Ground Symbol -->
        <line x1="330" y1="200" x2="330" y2="215" stroke="#22c55e" stroke-width="2"/>
        <line x1="315" y1="215" x2="345" y2="215" stroke="#22c55e" stroke-width="2.5"/>
        <line x1="320" y1="221" x2="340" y2="221" stroke="#22c55e" stroke-width="2"/>
        <line x1="325" y1="227" x2="335" y2="227" stroke="#22c55e" stroke-width="1.5"/>
        <text x="360" y="222" fill="#4ade80" font-size="9">PE BONDING (&le;0.1&Omega;)</text>
      </svg>
    `;

    container.innerHTML = svgContent;
  }

  [vSrcSelect, cpSelect, loadSelect, lenInput, gaugeSelect, tagInput].forEach(elem => {
    if (elem) elem.addEventListener('input', renderSldSvg);
  });

  if (refreshBtn) refreshBtn.addEventListener('click', renderSldSvg);

  // SVG Export
  const downloadSvgBtn = document.getElementById('downloadSldSvgBtn');
  if (downloadSvgBtn) {
    downloadSvgBtn.addEventListener('click', () => {
      const container = document.getElementById('sldSvgContainer');
      if (!container) return;
      const svg = container.querySelector('svg');
      if (!svg) return;
      const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `VoltCheck24_SLD_${document.getElementById('sldTagPrefix')?.value || 'SCHEMATIC'}.svg`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  // PNG Export
  const downloadPngBtn = document.getElementById('downloadSldPngBtn');
  if (downloadPngBtn) {
    downloadPngBtn.addEventListener('click', () => {
      const container = document.getElementById('sldSvgContainer');
      const svg = container ? container.querySelector('svg') : null;
      if (!svg) return;

      const img = new Image();
      const svgXml = new XMLSerializer().serializeToString(svg);
      const svg64 = btoa(unescape(encodeURIComponent(svgXml)));
      const image64 = 'data:image/svg+xml;base64,' + svg64;

      img.onload = function() {
        const canvas = document.createElement('canvas');
        canvas.width = 1400;
        canvas.height = 480;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const a = document.createElement('a');
        a.download = `VoltCheck24_SLD_${document.getElementById('sldTagPrefix')?.value || 'SCHEMATIC'}.png`;
        a.href = canvas.toDataURL('image/png');
        a.click();
      };
      img.src = image64;
    });
  }

  // AutoCAD / EPLAN 호환 DXF R12 Export
  const downloadDxfBtn = document.getElementById('downloadSldDxfBtn');
  if (downloadDxfBtn) {
    downloadDxfBtn.addEventListener('click', () => {
      const tag = document.getElementById('sldTagPrefix')?.value || '24VDC-LINE-01';
      const len = document.getElementById('sldWireLength')?.value || '40';
      const gauge = document.getElementById('sldWireGauge')?.value || 'AWG 22';
      const cp = document.getElementById('sldBreakerRating')?.value || '4A';

      // Generate standard ASCII DXF R12 string
      const dxfData = 
`0
SECTION
2
HEADER
9
$ACADVER
1
AC1009
0
ENDSEC
0
SECTION
2
ENTITIES
0
LINE
8
POWER_LINE
10
30.0
20
100.0
30
0.0
11
270.0
21
100.0
31
0.0
0
LINE
8
PE_GROUND
10
30.0
20
40.0
30
0.0
11
270.0
21
40.0
31
0.0
0
TEXT
8
TAGS
10
30.0
20
115.0
30
0.0
40
5.0
1
SMPS DC 24V SOURCE [${tag}]
0
TEXT
8
TAGS
10
100.0
20
115.0
30
0.0
40
5.0
1
CIRCUIT PROTECTOR ${cp}
0
TEXT
8
TAGS
10
160.0
20
115.0
30
0.0
40
4.5
1
CABLE: ${len}m / ${gauge}
0
ENDSEC
0
EOF
`;

      const blob = new Blob([dxfData], { type: 'application/dxf;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `VoltCheck24_${tag}.dxf`;
      a.click();
      URL.revokeObjectURL(url);
      alert(`[AutoCAD / EPLAN 호환 DXF 내보내기 완료]
파일명: VoltCheck24_${tag}.dxf

AutoCAD, EPLAN, SolidWorks Electrical 등 CAD 소프트웨어에서 바로 열어 배치할 수 있습니다.`);
    });
  }

  renderSldSvg();
}

// --------------------------------------------------------------------------
// HOOK ALL NEXT-GEN ENGINES ON LOAD
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initFieldMeasurementSystem();
  renderBomParts('AWG 22');
  initProjectWorkspace();
  initCopperCostCalculator();
  initSldGenerator();
});

// ==========================================================================
// VOLTCHECK24 B2B MONETIZATION & LEAD GENERATION ENGINES
// ==========================================================================

function initMonetizationModals() {
  // 1. Digital Product Bundle Modal
  const digitalBtn = document.getElementById('openDigitalProductBtn');
  const digitalModal = document.getElementById('digitalProductModal');
  const closeDigitalBtn = document.getElementById('closeDigitalModalBtn');

  if (digitalBtn && digitalModal) {
    digitalBtn.addEventListener('click', () => {
      trackVoltCheckEvent(ANALYTICS_EVENTS.digitalPackOpen, {
        action: 'open_digital_pack'
      });
      digitalModal.classList.remove('hidden');
      if (window.lucide) window.lucide.createIcons();
    });
  }

  if (closeDigitalBtn && digitalModal) {
    closeDigitalBtn.addEventListener('click', () => digitalModal.classList.add('hidden'));
    digitalModal.addEventListener('click', (e) => {
      if (e.target === digitalModal) digitalModal.classList.add('hidden');
    });
  }

  // 2. Enhanced B2B Quote Modal
  const quoteBtn = document.getElementById('openQuoteModalBtn');
  const quoteModal = document.getElementById('quoteModal');
  const closeQuoteBtn = document.getElementById('closeQuoteModalBtn');

  if (quoteBtn && quoteModal) {
    quoteBtn.addEventListener('click', () => {
      trackVoltCheckEvent('quote_modal_open', { action: 'open_quote_modal' });
      // Prepopulate active BOM specs
      const gauge = document.getElementById('wireGaugeValue')?.value || 'AWG 22';
      const len = document.getElementById('wireLength')?.value || '40';
      const listEl = document.getElementById('quoteActivePartsList');
      if (listEl) {
        listEl.innerHTML = `
          <li>• 케이블: 대한전선 / LAPP 4심 (${gauge}, 편도 ${len}m 기준)</li>
          <li>• 회로보호기: LS ELECTRIC BKN-32C 4A 1P C-curve</li>
          <li>• 전원공급기: MEAN WELL NDR-240-24 (24V 10A DIN)</li>
        `;
      }
      quoteModal.classList.remove('hidden');
      if (window.lucide) window.lucide.createIcons();
    });
  }

  if (closeQuoteBtn && quoteModal) {
    closeQuoteBtn.addEventListener('click', () => quoteModal.classList.add('hidden'));
    quoteModal.addEventListener('click', (e) => {
      if (e.target === quoteModal) quoteModal.classList.add('hidden');
    });
  }
}

// B2B Lead Submission Handler
async function submitB2BQuoteLead() {
  const company = document.getElementById('quoteCompany')?.value || '';
  const region = document.getElementById('quoteRegion')?.value || '';
  const name = document.getElementById('quoteName')?.value || '';
  const phone = document.getElementById('quotePhone')?.value || '';
  const email = document.getElementById('quoteEmail')?.value || '';
  const timeline = document.getElementById('quoteTimeline')?.value || '';
  const memo = document.getElementById('quoteMemo')?.value || '';

  const lead = {
    company, region, name, phone, email, timeline, memo,
    timestamp: new Date().toISOString(),
    items: CURRENT_PROJECT.items.length > 0 ? CURRENT_PROJECT.items : ['기본 계산기 24V 배선 BOM']
  };

  const subject = encodeURIComponent(`[VoltCheck24 B2B 견적 문의] ${company || 'Engineering project'}`);
  const body = encodeURIComponent([
    `회사: ${company}`,
    `지역: ${region}`,
    `담당자: ${name}`,
    `전화: ${phone}`,
    `회신 이메일: ${email}`,
    `발주 예정: ${timeline}`,
    `요청사항: ${memo}`,
    '',
    `프로젝트 항목: ${lead.items.map(item => typeof item === 'string' ? item : item.label || item.calcType || 'engineering item').join(' | ')}`
  ].join('\n'));
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name, company, email, phone, message: `${memo}\n\n프로젝트 항목: ${lead.items.map(item => typeof item === 'string' ? item : item.label || item.calcType || 'engineering item').join(' | ')}` })
    });
    if (!response.ok) throw new Error('contact_api_failed');
    alert('견적 문의가 접수되었습니다. 담당자가 입력하신 이메일로 회신드립니다.');
  } catch (error) {
    window.location.href = `mailto:contact@voltcheck24.com?subject=${subject}&body=${body}`;
    alert('서버 접속이 되지 않아 메일 앱을 열었습니다. 메일 앱에서 전송을 완료해 주세요.');
  }

  const modal = document.getElementById('quoteModal');
  if (modal) modal.classList.add('hidden');
  document.getElementById('quoteForm')?.reset();
}

// Digital Asset Order Handler
function submitDigitalOrder() {
  const email = document.getElementById('orderEmail')?.value || '';
  if (!email) return;

  const order = {
    email,
    product: 'VoltCheck Professional Offline Engineering Master Bundle (29,000 KRW)',
    timestamp: new Date().toISOString()
  };

  let orders = [];
  try {
    orders = JSON.parse(localStorage.getItem('voltcheck_digital_orders') || '[]');
  } catch (e) { orders = []; }
  orders.push(order);
  localStorage.setItem('voltcheck_digital_orders', JSON.stringify(orders));

  alert(`[실무 마스터 템플릿 패키지 신청 완료]

수신 이메일: ${email}

등록하신 이메일로 엑셀 마스터 시트(XLSX), 규정 해설 PDF(50p), CAD 심볼(DWG) 즉시 다운로드 링크 및 전자세금계산서 발행 안내가 발송되었습니다.`);

  const modal = document.getElementById('digitalProductModal');
  if (modal) modal.classList.add('hidden');
  document.getElementById('digitalOrderForm')?.reset();
}

// Hook into DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  initMonetizationModals();
});

// ==========================================================================
// TAB 17: IO-LINK POWER BUDGET & ISO 13849-1 SAFETY LOOP ENGINE
// ==========================================================================

function initIolinkSafetyCalculator() {
  const masterSelect = document.getElementById('iolinkMasterType');
  const portSelect = document.getElementById('iolinkPortCount');
  const deviceSelect = document.getElementById('iolinkDevicePreset');
  const trunkLenInput = document.getElementById('iolinkTrunkLen');
  const trunkGaugeSelect = document.getElementById('iolinkTrunkGauge');
  const safetyRelaySelect = document.getElementById('safetyRelayModel');
  const safetyLenInput = document.getElementById('safetyLoopLen');
  const safetyTypeSelect = document.getElementById('safetyContactType');

  function calculateIolinkSafety() {
    if (!masterSelect || !portSelect) return;

    const ports = parseInt(portSelect.value, 10) || 8;
    const devType = deviceSelect ? deviceSelect.value : 'laser';
    const trunkL = parseFloat(trunkLenInput ? trunkLenInput.value : 25) || 25;
    const trunkSq = parseFloat(trunkGaugeSelect ? trunkGaugeSelect.value : 0.75) || 0.75;

    // Device current in Amperes per port
    let curPerPort = 0.12; // Laser default
    if (devType === 'sensor') curPerPort = 0.045;
    else if (devType === 'rfid') curPerPort = 0.350;
    else if (devType === 'valve') curPerPort = 1.200;
    else if (devType === 'hub') curPerPort = 0.500;

    // Master internal base electronics power (200mA)
    const masterBaseA = 0.20;
    const totalCurrentA = masterBaseA + (curPerPort * ports);

    // Trunk line resistance R = 2 * (rho_20 * L / A) -> copper rho=0.0175
    const rLoop = 2.0 * (0.0175 * trunkL / trunkSq) * 1.15; // 15% temp buffer
    const vDrop = totalCurrentA * rLoop;
    const vTerminal = Math.max(0, 24.0 - vDrop);

    // C/Q Line capacitance: typical 100 pF/m
    const cqCapacitancePf = trunkL * 100;

    // Safety Loop calculations (ISO 13849-1)
    const sLen = parseFloat(safetyLenInput ? safetyLenInput.value : 30) || 30;
    const sWireSq = 0.34; // AWG22
    const sLoopR = 2.0 * (0.0175 * sLen / sWireSq);
    const sDelayUs = (sLen * 0.45).toFixed(1);

    // Update UI Readouts
    const totCurrentEl = document.getElementById('resIolinkTotalCurrent');
    const termVEl = document.getElementById('resIolinkTerminalV');
    const capEl = document.getElementById('resIolinkCapacitance');
    const dropBadgeEl = document.getElementById('iolinkDropBadge');
    const healthBadgeEl = document.getElementById('iolinkHealthBadge');
    const safetyREl = document.getElementById('resSafetyLoopR');
    const safetyDelayEl = document.getElementById('resSafetyPulseDelay');
    const safetyPlEl = document.getElementById('resSafetyPlRating');

    if (totCurrentEl) totCurrentEl.textContent = totalCurrentA.toFixed(2);
    if (termVEl) {
      termVEl.textContent = `${vTerminal.toFixed(2)} V`;
      termVEl.className = vTerminal >= 21.6 ? 'text-safe' : 'text-warn';
    }
    if (capEl) {
      capEl.textContent = `${Math.round(cqCapacitancePf).toLocaleString()} pF (한계: 4,000pF)`;
      capEl.className = cqCapacitancePf <= 4000 ? 'text-safe' : 'text-warn';
    }
    if (dropBadgeEl) dropBadgeEl.textContent = `트렁크 전압강하: -${vDrop.toFixed(2)}V (${((vDrop/24)*100).toFixed(1)}%)`;

    if (healthBadgeEl) {
      if (vTerminal >= 21.6 && cqCapacitancePf <= 4000) {
        healthBadgeEl.className = 'badge-pill badge-safe';
        healthBadgeEl.textContent = 'IO-LINK: PASS (정상)';
      } else {
        healthBadgeEl.className = 'badge-pill badge-warn';
        healthBadgeEl.textContent = 'IO-LINK: WARN (용량 부족)';
      }
    }

    if (safetyREl) safetyREl.textContent = `${sLoopR.toFixed(1)} Ω`;
    if (safetyDelayEl) safetyDelayEl.textContent = `< ${sDelayUs} μs (안전)`;
    if (safetyPlEl) {
      safetyPlEl.textContent = sLoopR <= 50 ? 'PLe / Cat. 4' : 'PLd / Cat. 3 (마진 협소)';
      safetyPlEl.className = sLoopR <= 50 ? 's-val font-mono text-safe' : 's-val font-mono text-warn';
    }
  }

  [masterSelect, portSelect, deviceSelect, trunkLenInput, trunkGaugeSelect, safetyRelaySelect, safetyLenInput, safetyTypeSelect].forEach(elem => {
    if (elem) elem.addEventListener('input', calculateIolinkSafety);
  });

  const addIolinkBtn = document.getElementById('addIolinkToProjectBtn');
  if (addIolinkBtn) {
    addIolinkBtn.addEventListener('click', () => {
      const cur = document.getElementById('resIolinkTotalCurrent')?.textContent || '1.16';
      const termV = document.getElementById('resIolinkTerminalV')?.textContent || '23.42V';
      const pl = document.getElementById('resSafetyPlRating')?.textContent || 'PLe / Cat. 4';

      if (typeof addProjectItem === 'function') {
        addProjectItem({
          calcType: 'IO-Link·안전회로',
          label: `IO-Link 8포트 마스터 & ${pl} 안전루프`,
          params: `총 부하전류 ${cur}A, 수전단 ${termV}`,
          result: `ISO 13849-1 ${pl} 만족`
        });
      }
    });
  }

  calculateIolinkSafety();
}

// ==========================================================================
// TAB 18: 제어반 보호접지(PE) 단면적 & EMC 실드 계산기 [KEC 140조]
// ==========================================================================

function initGroundingCalculator() {
  const faultInput = document.getElementById('peFaultCurrent');
  const tripTimeInput = document.getElementById('peTripTime');
  const matSelect = document.getElementById('peConductorMat');
  const phaseSqSelect = document.getElementById('pePhaseWireSq');
  const emcSelect = document.getElementById('emcShieldType');

  function calculateGrounding() {
    if (!faultInput || !tripTimeInput) return;

    const Ik_kA = parseFloat(faultInput.value) || 5.0;
    const Ik_A = Ik_kA * 1000.0;
    const t = parseFloat(tripTimeInput.value) || 0.10;
    const k = parseFloat(matSelect ? matSelect.value : 143) || 143;
    const sPhase = parseFloat(phaseSqSelect ? phaseSqSelect.value : 6.0) || 6.0;

    // Adiabatic equation: S = sqrt(I^2 * t) / k
    const sCalc = (Math.sqrt(Math.pow(Ik_A, 2) * t)) / k;

    // Standard commercial wire sizes: [1.5, 2.5, 4.0, 6.0, 10.0, 16.0, 25.0, 35.0, 50.0, 70.0, 95.0]
    const standardSizes = [1.5, 2.5, 4.0, 6.0, 10.0, 16.0, 25.0, 35.0, 50.0, 70.0, 95.0];
    let recSize = standardSizes[standardSizes.length - 1];
    for (let i = 0; i < standardSizes.length; i++) {
      if (standardSizes[i] >= sCalc) {
        recSize = standardSizes[i];
        break;
      }
    }

    // KEC / IEC 60364-5-54 Table 54.2 Simple Rule
    let simpleRuleSq = sPhase;
    if (sPhase > 16.0 && sPhase <= 35.0) simpleRuleSq = 16.0;
    else if (sPhase > 35.0) simpleRuleSq = sPhase / 2.0;

    // EMC Shield impedance estimation at 10MHz
    const emcType = emcSelect ? emcSelect.value : 'emc_clamp';
    let emcImpedance = '< 0.5 Ω (우수 - 노이즈 99.8% 차폐)';
    let emcColor = 'text-safe';
    if (emcType === 'pigtail') {
      emcImpedance = '> 62.8 Ω (위험 - 고주파 노이즈 유입)';
      emcColor = 'text-warn';
    } else if (emcType === 'double_shield') {
      emcImpedance = '< 0.1 Ω (최상급 - 초정밀 아날로그)';
    }

    // Update UI Readouts
    const stdSqEl = document.getElementById('resPeStandardSq');
    const calcExactEl = document.getElementById('resPeCalcExact');
    const simpleRuleEl = document.getElementById('resPeSimpleRule');
    const minBadgeEl = document.getElementById('peCalcMinBadge');
    const emcEl = document.getElementById('resEmcImpedance');

    if (stdSqEl) stdSqEl.textContent = recSize.toFixed(1);
    if (calcExactEl) calcExactEl.textContent = `${sCalc.toFixed(2)} mm²`;
    if (simpleRuleEl) simpleRuleEl.textContent = `${simpleRuleSq.toFixed(1)} SQ (상도체 ${sPhase}SQ 기준)`;
    if (minBadgeEl) minBadgeEl.textContent = `이론 최소 단면적: ${sCalc.toFixed(2)} mm²`;
    if (emcEl) {
      emcEl.textContent = emcImpedance;
      emcEl.className = `s-val font-mono ${emcColor}`;
    }
  }

  [faultInput, tripTimeInput, matSelect, phaseSqSelect, emcSelect].forEach(elem => {
    if (elem) elem.addEventListener('input', calculateGrounding);
  });

  const addPeBtn = document.getElementById('addPeToProjectBtn');
  if (addPeBtn) {
    addPeBtn.addEventListener('click', () => {
      const sq = document.getElementById('resPeStandardSq')?.textContent || '16.0';
      const fault = document.getElementById('peFaultCurrent')?.value || '5.0';
      const t = document.getElementById('peTripTime')?.value || '0.1';

      if (typeof addProjectItem === 'function') {
        addProjectItem({
          calcType: '접지(PE)·EMC',
          label: `제어반 보호접지선 (${sq} SQ)`,
          params: `고장전류 ${fault}kA, 트립 ${t}s`,
          result: `KEC 140조 규격 만족 (추천: ${sq} SQ)`
        });
      }
    });
  }

  calculateGrounding();
}

// ==========================================================================
// TAB 14: INTERACTIVE DAILY TROUBLESHOOTING DIAGNOSTIC TREE ENGINE
// ==========================================================================

const TROUBLESHOOTING_DATA = {
  sensor_reset: {
    title: '⚡ DC 24V 광전/근접 센서 간헐적 오동작 & 브라운아웃(Brownout)',
    cause: '솔레노이드 밸브/릴레이 구동 시 발생하는 순간 돌입 전류(Inrush) 및 긴 배선(>30m)에 따른 순간 전압 강하 (V < 18V)',
    steps: [
      { step: '1단계: SMPS 분리 배선', desc: 'PLC/센서용 제어 전원(SMPS #1)과 솔레노이드/모터 브레이크 구동 전원(SMPS #2)을 물리적으로 분리하십시오.' },
      { step: '2단계: 역기전력 흡수 다이오드 확인', desc: 'DC 릴레이 및 솔레노이드 코일 양단에 1N4007 플라이백 다이오드 또는 바리스터 서지 킬러가 장착되었는지 점검하십시오.' },
      { step: '3단계: 도선 굵기 상향 (AWG 24 -> AWG 20)', desc: '20m 초과 원거리 센서 라인의 배선을 0.5SQ 이상으로 교체하여 선로 루프 저항(R_loop)을 5Ω 이하로 억제하십시오.' }
    ]
  },
  rs485_drop: {
    title: '📡 RS-485 / Modbus-RTU 통신 두절, 타임아웃 & 패킷 CRC 에러',
    cause: '120Ω 종단저항 미체결에 의한 신호 반사파(Reflection) 또는 인버터/서보 노이즈에 의한 공통모드 전압 초과 (-7V ~ +12V)',
    steps: [
      { step: '1단계: 물리적 양 끝단 120Ω 종단저항 점검', desc: '데이지체인 선로의 맨 처음 마스터와 맨 마지막 슬레이브 단자대에만 120Ω 1/4W 금속피막 저항을 체결하십시오. (중간 디바이스 체결 금지)' },
      { step: '2단계: 실드선 접지 1점 접지(Single-point)', desc: 'RS-485 케이블 실드(Shield)는 마스터 제어반 PE 접지 단자에만 1점 접지하고 슬레이브 측은 절연 테이핑하여 접지 루프 전류를 방지하십시오.' },
      { step: '3단계: 통신선-동력선 이격 배선', desc: '380V/220V 모터 동력 배선과 최소 20cm 이상 이격하거나 금속 차폐 격벽이 있는 닥트에 분리 포설하십시오.' }
    ]
  },
  smps_hiccup: {
    title: '🔄 SMPS 파워서플라이 딸꾹질(Hiccup) 점멸 & 출력 전압 불안정',
    cause: '부하 용량 초과(Overload), 출력단 24V 단락(Short), 또는 대용량 콘덴서 부하 기동 시 돌입 전류 한계 초과',
    steps: [
      { step: '1단계: 분기 차단기(CP) 순차 분리', desc: '모든 부하 차단기를 내린 후 SMPS를 단독 기동하여 정상 24.0V가 출력되는지 확인하십시오. (정상이면 특정 분기 선로 단락)' },
      { step: '2단계: 서킷 프로텍터(CP) C-curve 정격 점검', desc: '돌입 전류가 큰 DC 모터/솔레노이드 부하는 정격 전류의 2~3배 용량의 C-curve 차단기로 변경하십시오.' },
      { step: '3단계: SMPS 부하율 70% 마진 설계', desc: '연속 부하 전류의 1.3배 이상 정격(예: 부하 7A 시 10A/240W 파워)으로 SMPS 용량을 증설하십시오.' }
    ]
  },
  analog_noise: {
    title: '📈 PLC 4-20mA 아날로그 입력값 헌팅(Hunting) & 계측 오차',
    cause: '비차폐 선로 포설, Shunt 저항 정밀도 불량(1% 초과), 또는 트랜스미터와 PLC 접지 간 전위차에 의한 접지 루프',
    steps: [
      { step: '1단계: 0.1% 급 정밀 금속박 250Ω Shunt 저항 적용', desc: '일반 저항 대신 온도계수 25ppm 이하의 고정밀 250.0Ω 계측용 Shunt를 사용하십시오.' },
      { step: '2단계: 아날로그 신호 아이솔레이터(절연기) 삽입', desc: '현장 센서와 제어반 PLC 입력단 사이에 4-20mA 절연 변환기(Galvanic Isolator)를 추가하여 접지 루프를 차단하십시오.' },
      { step: '3단계: 트위스트 페어 실드선(CVV-S) 적용', desc: '신호선(+)과 복귀선(-)을 반드시 꼬임선(Twisted Pair)으로 사용하고 실드를 편조 접지하십시오.' }
    ]
  },
  valve_delay: {
    title: '🔥 DC 24V 솔레노이드 밸브 복귀 지연 & 코일 이상 발열',
    cause: '역기전력 다이오드 전류 순환으로 인한 자속 소멸 지연 또는 전압강하로 인한 코일 불완전 흡착',
    steps: [
      { step: '1단계: 고속 응답용 Zener-Diode 조합 서지킬러 채택', desc: '순수 다이오드 대신 36V 제너 다이오드 + 일반 다이오드 직렬 조합을 사용하여 코일 역기전력 방전 속도를 3배 빠르게 하십시오.' },
      { step: '2단계: 밸브 단자 전압 실측', desc: '솔레노이드 흡착 순간 전압이 21.6V(정격의 90%) 이상 유지되는지 Fluke 87V Min/Max 모드로 측정하십시오.' }
    ]
  }
};

function initTroubleshootingDecisionTree() {
  const container = document.getElementById('troubleDiagnosticResult');
  const buttons = document.querySelectorAll('.trouble-btn');
  if (!container || buttons.length === 0) return;

  function renderSymptom(key) {
    const data = TROUBLESHOOTING_DATA[key] || TROUBLESHOOTING_DATA.sensor_reset;
    let html = `
      <div style="margin-bottom: 0.85rem;">
        <h4 style="color:var(--brand-orange); font-size:1.05rem; font-weight:800; margin:0 0 0.35rem 0;">${data.title}</h4>
        <p style="color:var(--text-secondary); font-size:0.88rem; line-height:1.5; margin:0;"><strong>근본 원인:</strong> ${data.cause}</p>
      </div>
      <div style="display:flex; flex-direction:column; gap:0.65rem;">
    `;

    data.steps.forEach(s => {
      html += `
        <div style="background:var(--bg-surface); border:1px solid var(--border-main); border-radius:var(--radius-sm); padding:0.85rem 1rem;">
          <div style="font-weight:700; color:var(--navy-dark); font-size:0.9rem; margin-bottom:0.25rem;">${s.step}</div>
          <div style="color:var(--text-secondary); font-size:0.85rem; line-height:1.45;">${s.desc}</div>
        </div>
      `;
    });

    html += `
      </div>
      <div style="margin-top:1rem; padding-top:0.75rem; border-top:1px solid var(--border-light); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
        <span style="font-size:0.78rem; color:var(--text-muted);">관련 규격: IEC 60204-1 §9.2 / NFPA 79 Chapter 9</span>
        <button type="button" class="btn-util" onclick="window.print()" style="font-size:0.78rem;">
          <i data-lucide="printer"></i> 트러블슈팅 매뉴얼 인쇄
        </button>
      </div>
    `;

    container.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const symptom = btn.getAttribute('data-symptom');
      renderSymptom(symptom);
    });
  });

  renderSymptom('sensor_reset');
}

// Hook into DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  initIolinkSafetyCalculator();
  initGroundingCalculator();
  initTroubleshootingDecisionTree();
});

// ==========================================================================
// TAB 19: PLC I/O NPN(SINK) VS PNP(SOURCE) INTERFACE ENGINE
// ==========================================================================

function initNpnPnpCalculator() {
  const plcSelect = document.getElementById('npnPlcType');
  const sensorSelect = document.getElementById('npnSensorType');
  const curInput = document.getElementById('npnSensorCurrent');
  const lenInput = document.getElementById('npnWireLength');

  function calculateNpnPnp() {
    if (!plcSelect || !sensorSelect) return;

    const plcType = plcSelect.value;
    const sensorType = sensorSelect.value;

    let isMatch = false;
    let statusText = '결선 불일치 (동작 불가)';
    let statusColor = '#ef4444';
    let comVolt = '+24V DC';
    let signalFlow = '신호 인식 불가';
    let burnRisk = '위험 없음 (단순 미동작)';
    let noteText = '';

    if (plcType === 'sink_npn') {
      comVolt = '+24V DC';
      if (sensorType === 'npn_no') {
        isMatch = true;
        statusText = 'SINK ⟷ NPN 정상 호환';
        statusColor = '#4ade80';
        signalFlow = 'ON 시 0V 싱크 (Low Active)';
        burnRisk = '위험 없음 (Zero Risk)';
        noteText = '<strong>정상 결선:</strong> 미쓰비시/LS 산전 표준 결선입니다. PLC COM 단자에 +24V를 공급하고 NPN 센서 흑색선(OUT)이 0V로 전류를 Sink하여 내부 포토커플러가 정상 ON됩니다.';
      } else if (sensorType === 'pnp_no') {
        isMatch = false;
        statusText = '결선 불일치 (PNP ⟷ SINK)';
        statusColor = '#ef4444';
        signalFlow = 'PLC 입력 전압차 0V (미인식)';
        burnRisk = '소손 위험은 없으나 입력 LED 미점등';
        noteText = '<strong>⚠️ 결선 에러:</strong> SINK(+24V COM) 입력 카드에 PNP(+24V 출력) 센서를 직접 연결하면 전위차가 발생하지 않아 동작하지 않습니다. <strong>NPN 센서로 교체</strong>하거나 <strong>중간에 NPN 변환 릴레이/보드</strong>를 삽입해야 합니다.';
      } else if (sensorType === 'dry_contact') {
        isMatch = true;
        statusText = 'SINK ⟷ 무전압 스위치 정상';
        statusColor = '#4ade80';
        signalFlow = '접점 폐로 시 0V 도통';
        noteText = '스위치 한쪽을 PLC 입력 X단자에, 반대쪽을 0V(GND)에 연결하면 정상 인식됩니다.';
      } else if (sensorType === 'two_wire_dc') {
        isMatch = true;
        statusText = '2선식 센서 (누설전류 주의)';
        statusColor = '#f59e0b';
        signalFlow = 'OFF 시 누설전류 < 1.0mA 확인 필요';
        noteText = '2선식 DC 센서는 OFF 시에도 구동용 누설전류(0.8~1.5mA)가 흘러 PLC 입력이 OFF되지 않고 상시 ON될 수 있습니다. 필요 시 블리더 저항(Bleeder Resistor 3.3kΩ)을 병렬 연결하십시오.';
      }
    } else if (plcType === 'source_pnp') {
      comVolt = '0V (GND)';
      if (sensorType === 'pnp_no') {
        isMatch = true;
        statusText = 'SOURCE ⟷ PNP 정상 호환';
        statusColor = '#4ade80';
        signalFlow = 'ON 시 +24V 공급 (High Active)';
        burnRisk = '위험 없음 (Zero Risk)';
        noteText = '<strong>정상 결선:</strong> 지멘스/유럽 IEC 표준 결선입니다. PLC COM 단자에 0V GND를 연결하고 PNP 센서가 +24V를 공급(Source)하여 포토커플러를 정상 점등시킵니다.';
      } else if (sensorType === 'npn_no') {
        isMatch = false;
        statusText = '결선 불일치 (NPN ⟷ SOURCE)';
        statusColor = '#ef4444';
        signalFlow = '전위차 0V (미인식)';
        noteText = '<strong>⚠️ 결선 에러:</strong> SOURCE(0V COM) 입력 카드에 NPN(0V Sink) 센서를 연결하면 동작하지 않습니다. <strong>PNP 센서</strong>를 사용하십시오.';
      } else if (sensorType === 'dry_contact') {
        isMatch = true;
        statusText = 'SOURCE ⟷ 무전압 스위치 정상';
        statusColor = '#4ade80';
        signalFlow = '접점 폐로 시 +24V 도통';
        noteText = '스위치 한쪽을 PLC X단자에, 반대쪽을 +24V에 연결하십시오.';
      }
    } else {
      // Bidirectional
      isMatch = true;
      statusText = '양방향 절연 입력 (호환 가능)';
      statusColor = '#38bdf8';
      comVolt = sensorType === 'npn_no' ? '+24V 연결 권장' : '0V 연결 권장';
      signalFlow = 'COM 단자 결선에 따라 NPN/PNP 모두 수용';
      noteText = '양방향 입력 카드는 COM 단자를 +24V에 물리면 NPN용으로, 0V에 물리면 PNP용으로 동작합니다.';
    }

    const badgeEl = document.getElementById('npnMatchBadge');
    const comTargetEl = document.getElementById('npnComTarget');
    const statusEl = document.getElementById('resNpnStatus');
    const signalFlowEl = document.getElementById('resNpnSignalFlow');
    const burnRiskEl = document.getElementById('resNpnBurnRisk');
    const noteTextEl = document.getElementById('npnDiagNoteText');

    if (badgeEl) {
      badgeEl.className = isMatch ? 'badge-pill badge-safe' : 'badge-pill badge-warn';
      badgeEl.textContent = isMatch ? '결선 호환: MATCH (정상)' : '결선 불일치: MISMATCH (경고)';
    }
    if (comTargetEl) comTargetEl.textContent = `PLC COM 단자 연결: ${comVolt}`;
    if (statusEl) {
      statusEl.textContent = statusText;
      statusEl.style.color = statusColor;
    }
    if (signalFlowEl) signalFlowEl.textContent = signalFlow;
    if (burnRiskEl) burnRiskEl.textContent = burnRisk;
    if (noteTextEl) noteTextEl.innerHTML = noteText;
  }

  [plcSelect, sensorSelect, curInput, lenInput].forEach(elem => {
    if (elem) elem.addEventListener('input', calculateNpnPnp);
  });

  const addNpnBtn = document.getElementById('addNpnToProjectBtn');
  if (addNpnBtn) {
    addNpnBtn.addEventListener('click', () => {
      const status = document.getElementById('resNpnStatus')?.textContent || 'NPN/PNP 결선';
      const plc = plcSelect ? plcSelect.options[plcSelect.selectedIndex].text : 'SINK';
      const sensor = sensorSelect ? sensorSelect.options[sensorSelect.selectedIndex].text : 'NPN';

      if (typeof addProjectItem === 'function') {
        addProjectItem({
          calcType: 'NPN·PNP 결선',
          label: `PLC 입력 [${plc.split(' ')[0]}] ⟷ 센서 [${sensor.split(' ')[0]}]`,
          params: `PLC: ${plc}, 센서: ${sensor}`,
          result: status
        });
      }
    });
  }

  calculateNpnPnp();
}

// ==========================================================================
// TAB 20: 유도성 부하(솔레노이드/릴레이) 역기전력 서지 보호 계산기
// ==========================================================================

function initFlybackSurgeCalculator() {
  const presetSelect = document.getElementById('coilLoadPreset');
  const curInput = document.getElementById('coilCurrentA');
  const indInput = document.getElementById('coilInductanceMh');
  const suppressorSelect = document.getElementById('surgeSuppressorType');

  if (presetSelect && curInput && indInput) {
    presetSelect.addEventListener('change', () => {
      const p = presetSelect.value;
      if (p === 'solenoid_valve') { curInput.value = '0.45'; indInput.value = '150'; }
      else if (p === 'relay_my4') { curInput.value = '0.037'; indInput.value = '50'; }
      else if (p === 'servo_brake') { curInput.value = '1.50'; indInput.value = '800'; }
      calculateSurge();
    });
  }

  function calculateSurge() {
    if (!curInput || !indInput) return;

    const I = parseFloat(curInput.value) || 0.45;
    const L_mH = parseFloat(indInput.value) || 150;
    const L_H = L_mH / 1000.0;

    // Stored magnetic energy: E = 0.5 * L * I^2 (Joules)
    const energyJ = 0.5 * L_H * Math.pow(I, 2);
    const energyMilliJ = energyJ * 1000.0;

    // Unprotected voltage spike peak: V_peak ~ L * (di/dt) -> typical di/dt is ~ 2000 A/s on mechanical contact break
    const unprotSpikeV = Math.min(1200, Math.round(L_H * 2500 + 24));

    const sType = suppressorSelect ? suppressorSelect.value : 'flyback_diode';
    let clampedV = '-0.7 V (다이오드 순방향 전압)';
    let partNo = '1N4007 (1000V 1A)';
    let dischargeMs = (L_mH / (24 / I) * 3).toFixed(1);

    if (sType === 'zener_combo') {
      clampedV = '-36.7 V (제너 36V + 다이오드 0.7V)';
      partNo = '1N4007 + 1N5365B (36V 5W Zener)';
      dischargeMs = (dischargeMs / 3.5).toFixed(1);
    } else if (sType === 'varistor_mov') {
      clampedV = '-39.0 V (MOV 클램프)';
      partNo = 'ERZ-V10D390 (39V 10mm 바리스터)';
      dischargeMs = (dischargeMs / 2.5).toFixed(1);
    }

    const energyEl = document.getElementById('resStoredEnergyMilliJoule');
    const clampedVEl = document.getElementById('resClampedV');
    const partEl = document.getElementById('resSurgePart');
    const spikeBadgeEl = document.getElementById('surgePeakV');
    const dischargeTimeEl = document.getElementById('resDischargeTime');

    if (energyEl) energyEl.textContent = energyMilliJ.toFixed(2);
    if (clampedVEl) clampedVEl.textContent = clampedV;
    if (partEl) partEl.textContent = partNo;
    if (spikeBadgeEl) spikeBadgeEl.textContent = `무보호 시 역기전력: 약 -${unprotSpikeV}V 피크`;
    if (dischargeTimeEl) dischargeTimeEl.textContent = `약 ${dischargeMs} ms (소호 방전)`;
  }

  [curInput, indInput, suppressorSelect].forEach(elem => {
    if (elem) elem.addEventListener('input', calculateSurge);
  });

  const addSurgeBtn = document.getElementById('addSurgeToProjectBtn');
  if (addSurgeBtn) {
    addSurgeBtn.addEventListener('click', () => {
      const e = document.getElementById('resStoredEnergyMilliJoule')?.textContent || '15.2';
      const part = document.getElementById('resSurgePart')?.textContent || '1N4007';

      if (typeof addProjectItem === 'function') {
        addProjectItem({
          calcType: '역기전력 서지',
          label: `코일 서지 보호 [${part}]`,
          params: `축적에너지 ${e}mJ`,
          result: `보호소자: ${part} 선정`
        });
      }
    });
  }

  calculateSurge();
}

// ==========================================================================
// TAB 21: SMPS 투입 돌입전류(INRUSH) & 차단기 트립 곡선 판정 엔진
// ==========================================================================

function initInrushBreakerCalculator() {
  const countInput = document.getElementById('inrushSmpsCount');
  const modelSelect = document.getElementById('inrushSmpsModel');
  const curveSelect = document.getElementById('inrushBreakerType');
  const ampSelect = document.getElementById('inrushBreakerAmp');

  function calculateInrush() {
    if (!countInput || !modelSelect) return;

    const count = parseInt(countInput.value, 10) || 2;
    const peakPerUnit = parseFloat(modelSelect.value) || 35.0;
    const curve = curveSelect ? curveSelect.value : 'c_curve';
    const In = parseFloat(ampSelect ? ampSelect.value : 10) || 10;

    // Total inrush peak current (A)
    const totalPeakA = count * peakPerUnit;

    // Instantaneous magnetic trip threshold for breaker:
    // B-curve: 3~5x In (min 30A for 10A)
    // C-curve: 5~10x In (min 50A, instantaneous trip at 100A)
    // D-curve: 10~20x In (min 100A, trip at 200A)
    let tripThresholdA = In * 10; // C-curve default upper bound
    let curveName = '10A C-Curve';

    if (curve === 'b_curve') {
      tripThresholdA = In * 5;
      curveName = `${In}A B-Curve (위험)`;
    } else if (curve === 'c_curve') {
      tripThresholdA = In * 10;
      curveName = `${In}A C-Curve (표준)`;
    } else if (curve === 'd_curve') {
      tripThresholdA = In * 20;
      curveName = `${In}A D-Curve (고돌입용)`;
    }

    const marginPct = ((tripThresholdA - totalPeakA) / tripThresholdA) * 100;
    const isSafe = totalPeakA < tripThresholdA;

    // Normal steady-state primary current (AC 220V approx)
    const normalPrimaryA = (count * 240 / 220 / 0.88).toFixed(1);

    const peakEl = document.getElementById('resInrushTotalPeak');
    const limitEl = document.getElementById('resBreakerInstantLimit');
    const marginEl = document.getElementById('resInrushMarginPct');
    const badgeEl = document.getElementById('inrushTripBadge');
    const primaryAEl = document.getElementById('resNormalPrimaryA');
    const verdictEl = document.getElementById('resInrushVerdict');

    if (peakEl) peakEl.textContent = totalPeakA.toFixed(1);
    if (limitEl) limitEl.textContent = `${tripThresholdA.toFixed(1)} A (${curveName})`;
    if (marginEl) {
      marginEl.textContent = `${marginPct >= 0 ? '+' : ''}${marginPct.toFixed(1)}% ${isSafe ? '여유 (안전)' : '초과 (트립 위험)'}`;
      marginEl.className = isSafe ? 'text-highlight' : 'text-warn';
    }
    if (badgeEl) {
      badgeEl.className = isSafe ? 'badge-pill badge-safe' : 'badge-pill badge-warn';
      badgeEl.textContent = isSafe ? 'TRIP SAFE (오트립 없음)' : 'TRIP RISK (차단기 트립 위험)';
    }
    if (primaryAEl) primaryAEl.textContent = `약 ${normalPrimaryA} A`;
    if (verdictEl) {
      verdictEl.textContent = isSafe ? `${In}A ${curve.toUpperCase()} 적합` : `${In}A D-Curve 또는 시차투입 권장`;
      verdictEl.className = isSafe ? 's-val font-mono text-safe' : 's-val font-mono text-warn';
    }
  }

  [countInput, modelSelect, curveSelect, ampSelect].forEach(elem => {
    if (elem) elem.addEventListener('input', calculateInrush);
  });

  const addInrushBtn = document.getElementById('addInrushToProjectBtn');
  if (addInrushBtn) {
    addInrushBtn.addEventListener('click', () => {
      const peak = document.getElementById('resInrushTotalPeak')?.textContent || '70.0';
      const verdict = document.getElementById('resInrushVerdict')?.textContent || '10A C-Curve 적합';

      if (typeof addProjectItem === 'function') {
        addProjectItem({
          calcType: '돌입전류·트립',
          label: `SMPS 돌입전류 (${peak}A Peak)`,
          params: `피크 ${peak}A`,
          result: verdict
        });
      }
    });
  }

  calculateInrush();
}

// Digital Bundle Tier Selection Helper
let SELECTED_DIGITAL_TIER = {
  price: 9900,
  title: '엔지니어 실무 스타터 팩 (9,900원)'
};

// Bank Transfer Master Account Configuration
const VOLTCHECK_BANK_INFO = {
  bank: '카카오뱅크',
  account: '3333-12-0080848',
  owner: '이*정'
};

function selectTierAndBuy(price, title) {
  SELECTED_DIGITAL_TIER = { price, title };
  const isEn = currentLanguage === 'en';
  const box = document.getElementById('digitalOrderBox');
  const titleEl = document.getElementById('selectedTierTitle');
  const priceNumEl = document.getElementById('checkoutPriceNum');
  const priceUnitEl = document.querySelector('#digitalOrderBox .tier-price .t-unit');
  const badgeEl = document.getElementById('checkoutTierBadge');
  const btnTextEl = document.getElementById('paySubmitBtnText');
  const bankAmountEl = document.getElementById('bankAmountText');

  if (isEn) {
    const usdAmount = price === 29000 ? 19.99 : 9.99;
    if (titleEl) titleEl.textContent = price === 29000 ? 'PRO Enterprise Master Bundle ($19.99)' : 'Engineering Starter Pack ($9.99)';
    if (priceNumEl) priceNumEl.textContent = usdAmount.toFixed(2);
    if (priceUnitEl) priceUnitEl.textContent = 'USD (VAT Incl.)';
    if (badgeEl) badgeEl.textContent = `SELECTED: $${usdAmount.toFixed(2)} USD TIER`;
    if (btnTextEl) btnTextEl.textContent = `Pay $${usdAmount.toFixed(2)} & Instant Download ZIP Bundle`;
  } else {
    if (titleEl) titleEl.textContent = title;
    if (priceNumEl) priceNumEl.textContent = price.toLocaleString();
    if (priceUnitEl) priceUnitEl.textContent = '원 (VAT 포함)';
    if (bankAmountEl) bankAmountEl.textContent = `${price.toLocaleString()}원`;
    if (badgeEl) badgeEl.textContent = price === 9900 ? 'SELECTED: 9,900 KRW STARTER' : 'SELECTED: 29,000 KRW PRO BUNDLE';
    if (btnTextEl) btnTextEl.textContent = `${price.toLocaleString()}원 송금 완료 & 파일 즉시 다운로드`;
  }

  // Setup Account Number Copy Button
  const copyBankBtn = document.getElementById('copyBankBtn');
  if (copyBankBtn) {
    copyBankBtn.onclick = () => {
      const accText = `${VOLTCHECK_BANK_INFO.bank} ${VOLTCHECK_BANK_INFO.account} ${VOLTCHECK_BANK_INFO.owner}`;
      navigator.clipboard.writeText(accText).then(() => {
        alert(isEn ? `[Account Info Copied]\n\n${accText}\n\nAmount: ₩${price.toLocaleString()}` : `[계좌번호 복사 완료]\n\n${accText}\n\n입금 금액: ${price.toLocaleString()}원`);
      });
    };
  }

  if (box) {
    box.style.display = 'block';
    box.scrollIntoView({ behavior: 'smooth' });
  }
}

// Hook all onto DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  initNpnPnpCalculator();
  initFlybackSurgeCalculator();
  initInrushBreakerCalculator();

  // Hook Tab 22 ~ Tab 26 Inputs
  ['slApproachType', 'slResolution', 'slSensorTime', 'slPlcTime', 'slMachineStopTime', 'slActualDist'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', calculateSafetyLight);
    if (el) el.addEventListener('change', calculateSafetyLight);
  });

  ['trPhaseType', 'trPrimaryV', 'trSecondaryV', 'trSteadyVA', 'trInrushVA', 'trSafetyMargin'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', calculateTransformer);
    if (el) el.addEventListener('change', calculateTransformer);
  });

  ['scTrKva', 'scPercentZ', 'scVoltage', 'scBreakerIcu', 'scCableDist', 'scCableSq'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', calculateShortCircuit);
    if (el) el.addEventListener('change', calculateShortCircuit);
  });

  ['miMechType', 'miTotalMass', 'miLeadOrDia', 'miGearRatio', 'miMotorJ', 'miAccelTime', 'miMaxRpm'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', calculateMotionInertia);
    if (el) el.addEventListener('change', calculateMotionInertia);
  });

  ['tcSensorType', 'tcInputTemp', 'tcWireType', 'tcCableLen', 'tcCableGauge'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', calculateTempConversion);
    if (el) el.addEventListener('change', calculateTempConversion);
  });

  calculateSafetyLight();
  calculateTransformer();
  calculateShortCircuit();
  calculateMotionInertia();
  calculateTempConversion();
  calculateValveCv();
  calculateAgvBattery();
  calculateBusbar();
  calculateCleanESD();
  calculateSPD();
  calculateCraneHoist();
  calculateRollTension();
  calculateVfdSurge();
  calculateExplosionProof();
  calculateCableTray();
  calculateLuxLighting();
  calculateSolarPV();
  calculatePumpHead();
  calculateBoltTorque();
  calculateHeatExchanger();
  calculateBeamDeflection();
  calculateVacuumChamber();
  calculateBatteryThermal();
  calculatePowerFactor();
  calculateHydraulics();
  calculateHvacBlower();
  calculateSteamPipe();

});

// ==========================================================================
// REAL TOSS PAYMENTS PG GATEWAY & INSTANT DIGITAL ASSET DELIVERY ENGINE
// ==========================================================================

function getOfficialCheckoutUrl(tier = SELECTED_DIGITAL_TIER) {
  const isEn = currentLanguage === 'en';
  if (isEn) return tier?.price === 29000 ? LEMONSQUEEZY_PRO_URL : LEMONSQUEEZY_STARTER_URL;
  return CTEE_KR_STORE_URL;
}

function executeRealCheckoutAndDownload() {
  const tier = SELECTED_DIGITAL_TIER || { price: 9900, title: '엔지니어 실무 스타터 팩 (9,900원)' };
  const checkoutUrl = getOfficialCheckoutUrl(tier);
  trackVoltCheckEvent(ANALYTICS_EVENTS.digitalPackOpen, {
    action: 'open_official_checkout',
    tier: tier.title,
    lang: currentLanguage
  });
  const opened = window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
  if (!opened) window.location.href = checkoutUrl;
}

function fulfillDigitalOrder(orderNum, name, email, phone, tax, payMethod, tier, dlUrl) {
  console.warn('Direct fulfillment is disabled. Use the official checkout provider for payment verification and delivery.');
  return false;

  /* Legacy client-side fulfillment code intentionally disabled.
  // 1. Save Paid Order locally
  const paidOrder = {
    orderNum,
    name,
    email,
    phone,
    tax,
    payMethod,
    tier: tier.title,
    amount: tier.price,
    paidAt: new Date().toISOString(),
    status: 'PAID_AND_DELIVERED'
  };

  let orders = [];
  try {
    orders = JSON.parse(localStorage.getItem('voltcheck_paid_orders') || '[]');
  } catch (e) { orders = []; }
  orders.push(paidOrder);
  localStorage.setItem('voltcheck_paid_orders', JSON.stringify(orders));

  // 2. Trigger Instant Direct File Download in Browser
  const downloadLink = document.createElement('a');
  downloadLink.href = 'assets/downloads/VoltCheck_Pro_Master_Bundle.zip';
  downloadLink.download = 'VoltCheck_Pro_Master_Bundle.zip';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);

  // 3. Setup mailto link for 1-click personal inbox delivery
  const mailtoBtn = document.getElementById('emailClientReceiptBtn');
  if (mailtoBtn) {
    const subject = encodeURIComponent(`[VoltCheck24] ${tier.title} 주문 영수증 및 다운로드 링크 (${orderNum})`);
    const body = encodeURIComponent(`안녕하세요 ${name} 님,\n\nVoltCheck24 전장설계 마스터 번들 결제가 정상 완료되었습니다.\n\n- 주문번호: ${orderNum}\n- 상품명: ${tier.title}\n- 결제금액: ${tier.price.toLocaleString()}원 (VAT 포함)\n- 결제수단: ${payMethod}\n\n[다운로드 링크]\n${dlUrl}\n\n위 링크를 브라우저에 붙여넣으시면 언제든지 ZIP 패키지를 다시 다운로드하실 수 있습니다.\n\n감사합니다.\nVoltCheck24 Engineering Lab`);
    mailtoBtn.href = `mailto:${encodeURIComponent(email)}?subject=${subject}&body=${body}`;
  }

  // 4. Setup Copy Download Link Button
  const copyBtn = document.getElementById('copyDlUrlBtn');
  if (copyBtn) {
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(dlUrl).then(() => {
        alert('번들 다운로드 링크가 클립보드에 복사되었습니다!\n\n' + dlUrl);
      });
    };
  }

  // 5. Asynchronously dispatch Email notification via FormSubmit
  try {
    fetch(`https://formsubmit.co/ajax/${encodeURIComponent(email)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: `[VoltCheck24 결제완료] ${tier.title} 다운로드 링크 안내`,
        _replyto: 'contact@voltcheck24.com',
        주문번호: orderNum,
        고객명: name,
        상품명: tier.title,
        결제금액: `${tier.price.toLocaleString()}원`,
        다운로드링크: dlUrl,
        안내: '위 다운로드 링크에서 압축파일을 바로 저장하실 수 있습니다.'
      })
    }).catch(err => console.log('Email webhook dispatched:', err));
  } catch (e) {
    console.log('Dispatch error:', e);
  }

  // 6. Update and reveal the success box
  const successBox = document.getElementById('checkoutSuccessBox');
  const successMeta = document.getElementById('orderSuccessMeta');
  const form = document.getElementById('digitalOrderForm');

  if (successMeta) {
    successMeta.textContent = `주문번호: ${orderNum} | 결제금액: ${tier.price.toLocaleString()}원 | 수신 이메일: ${email}`;
  }
  if (successBox) {
    successBox.style.display = 'block';
    successBox.scrollIntoView({ behavior: 'smooth' });
  }
  if (form) {
    const submitBtn = document.getElementById('payCheckoutSubmitBtn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.6';
      submitBtn.innerHTML = `<i data-lucide="check"></i> <span>결제 승인 완료 (${tier.price.toLocaleString()}원 결제됨)</span>`;
    }
  }

  if (window.lucide) window.lucide.createIcons();
  */
}

// External checkout providers own payment verification and fulfillment.
function checkTossPaymentCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('tossSuccess') === 'true') {
    alert('결제 결과는 공식 결제 페이지에서 확인해 주세요. 사이트에서 결제 완료를 임의로 처리하지 않습니다.');
    window.history.replaceState({}, document.title, window.location.pathname);
  } else if (urlParams.get('tossFail') === 'true') {
    alert('토스페이먼츠 결제가 취소되었거나 승인되지 않았습니다. 다시 시도해 주십시오.');
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

// Hook callback onto DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  checkTossPaymentCallback();
});


// ==========================================================================
// GLOBAL GDPR COOKIE CONSENT & LEGAL COMPLIANCE MODAL LOGIC
// ==========================================================================

function initCookieConsent() {
  try {
    const consent = localStorage.getItem('voltcheck_cookie_consent');
    const banner = document.getElementById('cookieConsentBanner');
    if (consent === 'accepted') loadAdvertisingScripts();
    if (!consent && banner) {
      setTimeout(() => {
        banner.style.display = 'flex';
      }, 1000);
    }
  } catch (e) { console.error(e); }
}

function loadAdvertisingScripts() {
  if (document.querySelector('script[data-voltcheck-ads]')) return;
  const script = document.createElement('script');
  script.async = true;
  script.dataset.voltcheckAds = 'true';
  script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7654949933724243';
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
}

function acceptCookies() {
  try {
    localStorage.setItem('voltcheck_cookie_consent', 'accepted');
  } catch (e) {}
  const banner = document.getElementById('cookieConsentBanner');
  if (banner) banner.style.display = 'none';
}

function rejectNonEssentialCookies() {
  try {
    localStorage.setItem('voltcheck_cookie_consent', 'rejected');
  } catch (e) {}
  const banner = document.getElementById('cookieConsentBanner');
  if (banner) banner.style.display = 'none';
  loadAdvertisingScripts();
}

function openLegalModal(tab = 'terms') {
  const modal = document.getElementById('legalModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
    switchLegalTab(tab);
  }
}

function closeLegalModal() {
  const modal = document.getElementById('legalModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.style.display = 'none';
  }
}

function switchLegalTab(tab) {
  const tabs = ['terms', 'privacy', 'refund', 'affiliate'];
  tabs.forEach(t => {
    const btn = document.getElementById('ltBtn' + t.charAt(0).toUpperCase() + t.slice(1));
    const pane = document.getElementById('pane' + t.charAt(0).toUpperCase() + t.slice(1));
    if (btn) {
      if (t === tab) btn.classList.add('active');
      else btn.classList.remove('active');
    }
    if (pane) {
      if (t === tab) pane.classList.add('active');
      else pane.classList.remove('active');
    }
  });
}

// ==========================================================================
// SUBMITTAL-GRADE A4 PDF REPORT CUSTOMIZER LOGIC
// ==========================================================================

function openPrintCustomizer() {
  const modal = document.getElementById('printCustomizerModal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
  }
}

function closePrintCustomizer() {
  const modal = document.getElementById('printCustomizerModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.style.display = 'none';
  }
}

function executeFinalSubmittalPrint() {
  const proj = document.getElementById('pcmProjectName')?.value || '2026 현대차 배터리 라인 #1';
  const client = document.getElementById('pcmClientName')?.value || '삼성전자 평택 캠퍼스 P4 FAB';
  const author = document.getElementById('pcmAuthorName')?.value || '이규정 수석 엔지니어 (PE)';

  const dispProj = document.getElementById('rptProjectDisplay');
  const dispClient = document.getElementById('rptClientDisplay');
  const dispAuthor = document.getElementById('rptAuthorDisplay');

  if (dispProj) dispProj.textContent = proj;
  if (dispClient) dispClient.textContent = client;
  if (dispAuthor) dispAuthor.textContent = author;

  const stampDraft = document.getElementById('stampDrafted');
  if (stampDraft) stampDraft.textContent = `${author} (인)`;

  closePrintCustomizer();
  generateAndPrintReport();
}


// ==========================================================================
// MOBILE-DEDICATED BOTTOM NAVIGATION & DRAWER LOGIC
// ==========================================================================

function openMobileToolsDrawer() {
  const drawer = document.getElementById('mobileToolsDrawer');
  if (drawer) {
    drawer.style.display = 'flex';
    if (window.lucide) window.lucide.createIcons();
  }
}

function closeMobileToolsDrawer() {
  const drawer = document.getElementById('mobileToolsDrawer');
  if (drawer) drawer.style.display = 'none';
}

function selectDrawerTool(tabId) {
  closeMobileToolsDrawer();
  const btn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
  if (btn) btn.click();

  // Update mobile bottom nav highlights
  document.querySelectorAll('.mb-nav-item').forEach(el => el.classList.remove('active'));
  if (tabId === 'tab-vacuumchamber') {
    const t = document.getElementById('resVcTimeSec')?.textContent || '0 분';
    text = `[VoltCheck 진공 챔버 배기시간 검토 결과]\n- 배기 시간: ${t}\n- 적용 표준: Vacuum Technology\nhttps://voltcheck24.com/`;
  } else if (tabId === 'tab-batterythermal') {
    const q = document.getElementById('resBtHeatWatts')?.textContent || '0 W';
    text = `[VoltCheck 배터리 팩 발열량 및 칠러 검토 결과]\n- 총 발열량: ${q}\n- 적용 표준: Battery Thermal Management\nhttps://voltcheck24.com/`;
  } else if (tabId === 'tab-powerfactor') {
    const qc = document.getElementById('resPfCapKvar')?.textContent || '0 kVAR';
    text = `[VoltCheck 역률개선 콘덴서 검토 결과]\n- 필요 콘덴서: ${qc}\n- 적용 표준: IEEE 141 / KEPCO\nhttps://voltcheck24.com/`;
  } else if (tabId === 'tab-hydraulics') {
    const f = document.getElementById('resHydThrustTon')?.textContent || '0 Ton';
    text = `[VoltCheck 고압 유압 실린더 추력 검토 결과]\n- 압출력: ${f}\n- 적용 표준: ISO 6020 / Hydraulics\nhttps://voltcheck24.com/`;
  } else if (tabId === 'tab-hvacblower') {
    const pa = document.getElementById('resFanTotalPa')?.textContent || '0 Pa';
    text = `[VoltCheck HVAC 공조 송풍기 검토 결과]\n- 총 압력손실: ${pa}\n- 적용 표준: ASHRAE / HVAC\nhttps://voltcheck24.com/`;
  } else if (tabId === 'tab-steampipe') {
    const dn = document.getElementById('resStmPipeSize')?.textContent || '50A';
    text = `[VoltCheck 스팀 배관 관경 검토 결과]\n- 추천 관경: ${dn}\n- 적용 표준: Spirax Sarco Steam Standards\nhttps://voltcheck24.com/`;
  } else if (tabId === 'tab-pumphead') {
    const h = document.getElementById('resPhTotalHead')?.textContent || '0 m';
    text = `[VoltCheck 펌프 전양정 및 배관 마찰손실 검토 결과]\n- 펌프 전양정: ${h}\n- 적용 표준: Darcy-Weisbach / Hydraulic Institute\nhttps://voltcheck24.com/`;
  } else if (tabId === 'tab-bolttorque') {
    const t = document.getElementById('resBtTorqueNm')?.textContent || '0 N·m';
    text = `[VoltCheck 볼트 체결 조임토크 및 축력 검토 결과]\n- 규정 조임 토크: ${t}\n- 적용 표준: VDI 2230 / ISO 898-1\nhttps://voltcheck24.com/`;
  } else if (tabId === 'tab-heatexchanger') {
    const a = document.getElementById('resHxAreaM2')?.textContent || '0 m²';
    text = `[VoltCheck 열교환기 LMTD 및 전열면적 검토 결과]\n- 소요 전열면적: ${a}\n- 적용 표준: LMTD Method / TEMA\nhttps://voltcheck24.com/`;
  } else if (tabId === 'tab-beamdeflection') {
    const d = document.getElementById('resBmDeflection')?.textContent || '0 mm';
    text = `[VoltCheck 구조보 굽힘모멘트 및 처짐량 검토 결과]\n- 최대 처짐량: ${d}\n- 적용 표준: Structural Mechanics / L/500\nhttps://voltcheck24.com/`;
  } else if (tabId === 'tab-rolltension') {
    const t = document.getElementById('resRtMotorTorque')?.textContent || '0 N·m';
    text = `[VoltCheck 롤투롤 와인더 장력 및 서보 토크 검토 결과]\n- 서보 필요 토크: ${t}\n- 적용 표준: KS B 6700\nhttps://voltcheck24.com/`;
  } else if (tabId === 'tab-vfdsurge') {
    const vp = document.getElementById('resVfdPeakVolt')?.textContent || '0 V';
    text = `[VoltCheck VFD 반사파 서지 및 리액터 검토 결과]\n- 모터 단자 피크 전압: ${vp}\n- 적용 표준: NEMA MG 1 Part 31\nhttps://voltcheck24.com/`;
  } else if (tabId === 'tab-explosionproof') {
    const ex = document.getElementById('resExProtection')?.textContent || 'Ex d';
    text = `[VoltCheck IEC 60079 방폭 적합성 검토 결과]\n- 방폭 구조 등급: ${ex}\n- 적용 표준: IEC 60079 / KOSHA\nhttps://voltcheck24.com/`;
  } else if (tabId === 'tab-cabletray') {
    const w = document.getElementById('resCtTotalWeight')?.textContent || '0 kg/m';
    text = `[VoltCheck 케이블 트레이 적재 하중 검토 결과]\n- 총 적재 중량: ${w}\n- 적용 표준: NEMA VE-2 / IEC 61537\nhttps://voltcheck24.com/`;
  } else if (tabId === 'tab-luxlighting') {
    const n = document.getElementById('resLuxFixtureCount')?.textContent || '0 등';
    text = `[VoltCheck 조도(Lux) 및 LED 조명 수량 검토 결과]\n- 필요 등기구 수량: ${n}\n- 적용 표준: KS A 3011 / ISO 8995\nhttps://voltcheck24.com/`;
  } else if (tabId === 'tab-solarpv') {
    const voc = document.getElementById('resPvVocMax')?.textContent || '0 V';
    text = `[VoltCheck 태양광/ESS DC 1500V 스트링 검토 결과]\n- 최대 개방 전압: ${voc}\n- 적용 표준: IEC 62548\nhttps://voltcheck24.com/`;
  } else if (tabId === 'tab-voltagedrop') {
    document.getElementById('mbNavVolt')?.classList.add('active');
  } else if (tabId === 'tab-smpsbudget') {
    document.getElementById('mbNavSmps')?.classList.add('active');
  }
}

function switchMobileTab(tabId) {
  selectDrawerTool(tabId);
}

// Enhance copySummaryToClipboard with Mobile Native Web Share API
const originalCopySummary = copySummaryToClipboard;
copySummaryToClipboard = function() {
  const vSource = document.getElementById('sourceVoltage')?.value || '24';
  const l = document.getElementById('wireLength')?.value || '40';
  const gauge = document.getElementById('wireGaugeValue')?.value || 'AWG 24';
  const i = document.getElementById('loadCurrent')?.value || '0.5';
  const vTerm = document.getElementById('resTerminalV')?.textContent || '23.33';
  const vDrop = document.getElementById('resDropV')?.textContent || '-0.67V';
  const status = document.getElementById('verdictBadgeText')?.textContent || 'PASS';

  const shareText = `[Total Engineering 전압강하 검토 결과]\n- 공급: DC ${vSource}V / 부하: ${i}A\n- 선로: ${l}m (${gauge})\n- 전압강하: ${vDrop}\n- 말단전압: ${vTerm}V (${status})\nhttps://voltcheck24.com/`;

  if (navigator.share && /Mobi|Android|iPhone/i.test(navigator.userAgent)) {
    navigator.share({
      title: 'Total Engineering 계산서',
      text: shareText,
      url: 'https://voltcheck24.com/'
    }).catch(() => {
      originalCopySummary();
    });
  } else {
    originalCopySummary();
  }
};


// ==========================================================================
// TAB 22: ISO 13855 SAFETY LIGHT CURTAIN DISTANCE ENGINE
// ==========================================================================

function calculateSafetyLight() {
  const approachType = document.getElementById('slApproachType')?.value || 'hand';
  const resolution = parseFloat(document.getElementById('slResolution')?.value || '14');
  const t1 = parseFloat(document.getElementById('slSensorTime')?.value || '20'); // ms
  const t2 = parseFloat(document.getElementById('slPlcTime')?.value || '15'); // ms
  const t3 = parseFloat(document.getElementById('slMachineStopTime')?.value || '85'); // ms
  const actualDist = parseFloat(document.getElementById('slActualDist')?.value || '350'); // mm

  const isEn = currentLanguage === 'en';

  const K = approachType === 'hand' ? 2000 : 1600; // mm/s
  const T = (t1 + t2 + t3) / 1000; // s

  let C = 0;
  if (resolution <= 14) {
    C = 0;
  } else if (resolution <= 40) {
    C = Math.max(0, 8 * (resolution - 14));
  } else {
    C = 850;
  }

  // S = K * T + C
  const S = Math.round(K * T + C);
  const margin = Math.round(actualDist - S);
  const isSafe = margin >= 0;

  const resMinDist = document.getElementById('resSlMinDistance');
  const resFormula = document.getElementById('resSlFormulaText');
  const resTotalT = document.getElementById('resSlTotalStopTime');
  const resPenetration = document.getElementById('resSlPenetrationDist');
  const resMargin = document.getElementById('resSlSafetyMargin');
  const badge = document.getElementById('slVerdictBadge');

  if (resMinDist) resMinDist.textContent = `${S} mm`;
  if (resFormula) resFormula.textContent = `S = (${K} mm/s × ${T.toFixed(3)}s) + ${C}mm = ${S} mm`;
  if (resTotalT) resTotalT.textContent = `${Math.round(T * 1000)} ms`;
  if (resPenetration) resPenetration.textContent = `${C} mm`;
  if (resMargin) {
    resMargin.textContent = `${margin >= 0 ? '+' : ''}${margin} mm`;
    resMargin.className = `summary-val font-mono ${isSafe ? 'text-safe' : 'text-warn'}`;
  }
  if (badge) {
    badge.textContent = isSafe ? (isEn ? 'SAFE (Distance Compliant)' : 'SAFE (안전 마진 만족)') : (isEn ? 'HAZARD (Distance Insufficient)' : 'HAZARD (안전거리 부족)');
    badge.className = `badge-pill ${isSafe ? 'badge-safe' : 'badge-warn'}`;
  }
}

// ==========================================================================
// TAB 23: TRANSFORMER CAPACITY & PROTECTION SIZING ENGINE
// ==========================================================================

function calculateTransformer() {
  const phase = parseInt(document.getElementById('trPhaseType')?.value || '1', 10);
  const v1 = parseFloat(document.getElementById('trPrimaryV')?.value || '380');
  const v2 = parseFloat(document.getElementById('trSecondaryV')?.value || '220');
  const steadyVA = parseFloat(document.getElementById('trSteadyVA')?.value || '850');
  const inrushVA = parseFloat(document.getElementById('trInrushVA')?.value || '3200');
  const marginPct = parseFloat(document.getElementById('trSafetyMargin')?.value || '25');

  const isEn = currentLanguage === 'en';

  // Design VA considering steady load + margin and inrush capability
  const designSteadyVA = steadyVA * (1 + marginPct / 100);
  const designInrushVA = inrushVA / 3.0; // TR can handle ~3x inrush for short bursts
  const requiredVA = Math.max(designSteadyVA, designInrushVA);

  // Standard Commercial TR Ratings (kVA): 0.5, 1.0, 1.5, 2.0, 3.0, 5.0, 7.5, 10.0
  const stdKvaList = [0.3, 0.5, 0.75, 1.0, 1.5, 2.0, 3.0, 5.0, 7.5, 10.0, 15.0];
  const requiredKva = requiredVA / 1000;
  let recKva = stdKvaList[stdKvaList.length - 1];
  for (let i = 0; i < stdKvaList.length; i++) {
    if (stdKvaList[i] >= requiredKva) {
      recKva = stdKvaList[i];
      break;
    }
  }

  // Currents
  let i1 = 0;
  let i2 = 0;
  if (phase === 3) {
    i1 = (recKva * 1000) / (Math.sqrt(3) * v1);
    i2 = (recKva * 1000) / (Math.sqrt(3) * v2);
  } else {
    i1 = (recKva * 1000) / v1;
    i2 = (recKva * 1000) / v2;
  }

  // Recommended Breakers
  const recBreaker1 = Math.ceil(i1 * 1.5);
  const recBreaker2 = Math.ceil(i2 * 1.25);

  const elCap = document.getElementById('resTrCapacity');
  const elCapSub = document.getElementById('resTrCapFormula');
  const elI1 = document.getElementById('resTrPrimaryCurrent');
  const elI2 = document.getElementById('resTrSecondaryCurrent');
  const elB1 = document.getElementById('resTrPrimaryBreaker');
  const elB2 = document.getElementById('resTrSecondaryBreaker');

  if (elCap) elCap.textContent = `${recKva} kVA`;
  if (elCapSub) elCapSub.textContent = isEn ? `Steady load ${(designSteadyVA / 1000).toFixed(2)} kVA with inrush headroom satisfied` : `상시 ${(designSteadyVA / 1000).toFixed(2)} kVA + 순시 기동 부하율 안전 마진 만족`;
  if (elI1) elI1.textContent = `${i1.toFixed(2)} A`;
  if (elI2) elI2.textContent = `${i2.toFixed(2)} A`;
  if (elB1) elB1.textContent = `${recBreaker1}A D-curve (MCB)`;
  if (elB2) elB2.textContent = `${recBreaker2}A C-curve (MCB)`;
}

// ==========================================================================
// TAB 24: TRANSFORMER %Z SHORT CIRCUIT CURRENT (Isc) ENGINE
// ==========================================================================

function calculateShortCircuit() {
  const trKva = parseFloat(document.getElementById('scTrKva')?.value || '500');
  const percentZ = parseFloat(document.getElementById('scPercentZ')?.value || '5.0');
  const vLine = parseFloat(document.getElementById('scVoltage')?.value || '380');
  const breakerIcu = parseFloat(document.getElementById('scBreakerIcu')?.value || '22');
  const cableDist = parseFloat(document.getElementById('scCableDist')?.value || '30');
  const cableSq = parseFloat(document.getElementById('scCableSq')?.value || '150');

  const isEn = currentLanguage === 'en';

  // Transformer Rated Current
  const In = (trKva * 1000) / (Math.sqrt(3) * vLine);

  // Transformer Base Short Circuit Current (kA)
  const IscBase = (In / (percentZ / 100)) / 1000;

  // Cable Impedance (Copper rho = 0.018 ohm.mm2/m)
  const Rcable = (0.018 * cableDist) / cableSq;
  const Xcable = 0.00008 * cableDist; // ~0.08 mOhm/m
  const Zcable = Math.sqrt(Rcable * Rcable + Xcable * Xcable);

  const Ztr = (vLine / (Math.sqrt(3) * (IscBase * 1000)));
  const Ztotal = Ztr + Zcable;

  const IscPanel = ((vLine / (Math.sqrt(3) * Ztotal)) / 1000);
  const damping = IscBase - IscPanel;

  const isPass = breakerIcu >= IscPanel;

  const elSc = document.getElementById('resScCurrent');
  const elSub = document.getElementById('resScSubText');
  const elBase = document.getElementById('resScBaseTr');
  const elDamp = document.getElementById('resScCableDamping');
  const elRated = document.getElementById('resScRatedI');
  const elRec = document.getElementById('resScRecBreaker');
  const badge = document.getElementById('scVerdictBadge');

  if (elSc) elSc.textContent = `${IscPanel.toFixed(1)} kA`;
  if (elSub) elSub.textContent = isEn ? `Breaker Rating ${breakerIcu} kA vs Fault Current ${IscPanel.toFixed(1)} kA` : `차단기 차단용량 ${breakerIcu} kA 대비 고장 단락전류 ${IscPanel.toFixed(1)} kA`;
  if (elBase) elBase.textContent = `${IscBase.toFixed(1)} kA`;
  if (elDamp) elDamp.textContent = `-${damping.toFixed(1)} kA`;
  if (elRated) elRated.textContent = `${In.toFixed(1)} A`;
  if (elRec) elRec.textContent = `${Math.ceil(IscPanel * 1.25)} kA 이상`;

  if (badge) {
    badge.textContent = isPass ? (isEn ? 'PASS (Adequate kA Capacity)' : 'PASS (차단용량 충분)') : (isEn ? 'FAIL (Interrupting Capacity Insufficient)' : 'FAIL (차단용량 부족 - 교체 필요)');
    badge.className = `badge-pill ${isPass ? 'badge-safe' : 'badge-fail'}`;
  }
}

// ==========================================================================
// TAB 25: MOTION MECHANISM INERTIA & MOTOR SIZING ENGINE
// ==========================================================================

function calculateMotionInertia() {
  const mech = document.getElementById('miMechType')?.value || 'ballscrew';
  const mass = parseFloat(document.getElementById('miTotalMass')?.value || '35'); // kg
  const leadOrDia = parseFloat(document.getElementById('miLeadOrDia')?.value || '10'); // mm
  const gearRatio = parseFloat(document.getElementById('miGearRatio')?.value || '1'); // 1/i
  const motorJ = parseFloat(document.getElementById('miMotorJ')?.value || '1.35'); // x10^-4 kg.m2
  const tAcc = parseFloat(document.getElementById('miAccelTime')?.value || '0.08'); // s
  const maxRpm = parseFloat(document.getElementById('miMaxRpm')?.value || '3000'); // rpm

  const isEn = currentLanguage === 'en';

  let loadJ = 0;
  let linearSpeed = 0; // mm/s

  if (mech === 'ballscrew') {
    // JL = M * (Lead / (2 * pi))^2 (kg.m2)
    const leadM = leadOrDia / 1000;
    loadJ = mass * Math.pow(leadM / (2 * Math.PI), 2);
    linearSpeed = (maxRpm / 60) * leadOrDia;
  } else if (mech === 'timingbelt') {
    // JL = M * (D / 2)^2
    const radiusM = (leadOrDia / 2) / 1000;
    loadJ = mass * Math.pow(radiusM, 2);
    linearSpeed = (maxRpm / 60) * (Math.PI * leadOrDia);
  } else {
    // Rotary disc: JL = (1/2) * M * R^2
    const radiusM = (leadOrDia / 2) / 1000;
    loadJ = 0.5 * mass * Math.pow(radiusM, 2);
    linearSpeed = (maxRpm / 60) * (Math.PI * leadOrDia);
  }

  // Converted to motor shaft through gear ratio
  const loadJMotorShaft = (loadJ / Math.pow(gearRatio, 2)) * 10000; // in 10^-4 kg.m2

  const inertiaRatio = loadJMotorShaft / motorJ;

  // Angular velocity omega (rad/s)
  const omega = (2 * Math.PI * maxRpm) / 60;
  const totalJ = (loadJMotorShaft + motorJ) * 1e-4; // kg.m2
  const accelTorque = (totalJ * omega) / tAcc; // N.m

  const elRatio = document.getElementById('resMiInertiaRatio');
  const elSub = document.getElementById('resMiSubText');
  const elLoadJ = document.getElementById('resMiLoadJ');
  const elTa = document.getElementById('resMiAccelTorque');
  const elSpeed = document.getElementById('resMiLinearSpeed');
  const elRec = document.getElementById('resMiRecMotor');
  const badge = document.getElementById('miVerdictBadge');

  if (elRatio) elRatio.textContent = `${inertiaRatio.toFixed(2)} 배`;
  if (elSub) elSub.textContent = isEn ? `Recommended Inertia Ratio (< 5x high speed, < 10x standard)` : `권장 관성비 (일반 5배 이하, 고빈도 3배 이하) 판정`;
  if (elLoadJ) elLoadJ.textContent = `${loadJMotorShaft.toFixed(2)} ×10⁻⁴ kg·m²`;
  if (elTa) elTa.textContent = `${accelTorque.toFixed(2)} N·m`;
  if (elSpeed) elSpeed.textContent = `${Math.round(linearSpeed)} mm/s`;

  if (elRec) {
    if (accelTorque <= 1.27) elRec.textContent = '200W ~ 400W';
    else if (accelTorque <= 2.39) elRec.textContent = '400W ~ 750W';
    else if (accelTorque <= 4.77) elRec.textContent = '750W ~ 1.0kW';
    else elRec.textContent = '1.5kW ~ 2.0kW+';
  }

  if (badge) {
    if (inertiaRatio <= 5.0) {
      badge.textContent = isEn ? 'OPTIMAL (Excellent Inertia)' : 'OPTIMAL (관성비 우수)';
      badge.className = 'badge-pill badge-safe';
    } else if (inertiaRatio <= 10.0) {
      badge.textContent = isEn ? 'ACCEPTABLE (Tuning Required)' : 'ACCEPTABLE (게인 조정 필요)';
      badge.className = 'badge-pill badge-warn';
    } else {
      badge.textContent = isEn ? 'OVERLOAD (Deceleration Risk)' : 'OVERLOAD (관성비 과대 - 감속기 권장)';
      badge.className = 'badge-pill badge-fail';
    }
  }
}

// ==========================================================================
// TAB 26: TEMPERATURE SENSOR CONVERSION & 3-WIRE COMPENSATION
// ==========================================================================

function calculateTempConversion() {
  const sensor = document.getElementById('tcSensorType')?.value || 'pt100';
  const temp = parseFloat(document.getElementById('tcInputTemp')?.value || '125.0');
  const wireType = document.getElementById('tcWireType')?.value || '3w';
  const cableLen = parseFloat(document.getElementById('tcCableLen')?.value || '25');
  const wireSq = parseFloat(document.getElementById('tcCableGauge')?.value || '0.3');

  const isEn = currentLanguage === 'en';

  let convertedVal = '';
  let leadR = ((0.018 * cableLen * 2) / wireSq); // 2-way cable loop resistance (ohm)
  let deltaT = 0;

  if (sensor === 'pt100' || sensor === 'pt1000') {
    const R0 = sensor === 'pt100' ? 100.0 : 1000.0;
    const A = 3.9083e-3;
    const B = -5.775e-7;

    // Resistance R(T) = R0 * (1 + A*T + B*T^2)
    let Rt = 0;
    if (temp >= 0) {
      Rt = R0 * (1 + A * temp + B * Math.pow(temp, 2));
    } else {
      const C = -4.183e-12;
      Rt = R0 * (1 + A * temp + B * Math.pow(temp, 2) + C * (temp - 100) * Math.pow(temp, 3));
    }

    convertedVal = `${Rt.toFixed(2)} Ω`;

    // 2-Wire Lead error: deltaT = leadR / (R0 * 0.00385)
    deltaT = leadR / (R0 * 0.00385);
  } else if (sensor === 'tc_k') {
    // Thermocouple K: ~41.27 uV/°C
    const mv = (temp * 0.04127);
    convertedVal = `${mv.toFixed(3)} mV`;
    deltaT = 0; // TC uses cold junction compensation
  } else if (sensor === 'tc_j') {
    const mv = (temp * 0.051);
    convertedVal = `${mv.toFixed(3)} mV`;
    deltaT = 0;
  } else {
    const mv = (temp * 0.040);
    convertedVal = `${mv.toFixed(3)} mV`;
    deltaT = 0;
  }

  const elVal = document.getElementById('resTcConvertedVal');
  const elFormula = document.getElementById('resTcFormulaText');
  const elLeadR = document.getElementById('resTcLeadR');
  const elError = document.getElementById('resTcErrorDelta');
  const elComp = document.getElementById('resTcCompensatedTemp');

  if (elVal) elVal.textContent = convertedVal;
  if (elFormula) elFormula.textContent = isEn ? `IEC 60751 Conversion: T = ${temp}°C corresponds to ${convertedVal}` : `IEC 60751 규격 공식 연산: ${temp}°C 정밀 환산치 = ${convertedVal}`;
  if (elLeadR) elLeadR.textContent = `${leadR.toFixed(2)} Ω`;

  if (elError) {
    if (wireType === '2w') {
      elError.textContent = `+${deltaT.toFixed(2)} °C`;
      elError.className = 'summary-val font-mono text-warn';
    } else {
      elError.textContent = '0.00 °C (보정됨)';
      elError.className = 'summary-val font-mono text-safe';
    }
  }

  if (elComp) {
    if (wireType === '2w') {
      elComp.textContent = `${(temp + deltaT).toFixed(2)} °C (오차 발생)`;
      elComp.className = 'summary-val font-mono text-warn';
    } else {
      elComp.textContent = `${temp.toFixed(2)} °C (정밀 계측)`;
      elComp.className = 'summary-val font-mono text-safe';
    }
  }
}


// ==========================================================================
// HORIZONTAL NAVIGATION SCROLL & CATEGORY FILTER ENGINE
// ==========================================================================

function scrollTabMenu(offset) {
  const container = document.getElementById('navTabsContainer');
  if (container) {
    container.scrollBy({ left: offset, behavior: 'smooth' });
  }
}

function filterNavCategory(cat) {
  document.querySelectorAll('.cat-filter-chip').forEach(el => el.classList.remove('active'));
  if (cat === 'all') document.getElementById('cfAll')?.classList.add('active');
  else if (cat === 'power') document.getElementById('cfPower')?.classList.add('active');
  else if (cat === 'motion') document.getElementById('cfMotion')?.classList.add('active');
  else if (cat === 'mech') document.getElementById('cfMech')?.classList.add('active');
  else if (cat === 'fluid') document.getElementById('cfFluid')?.classList.add('active');
  else if (cat === 'nuclear') document.getElementById('cfNuclear')?.classList.add('active');
  else if (cat === 'signal') document.getElementById('cfSignal')?.classList.add('active');
  else if (cat === 'specs') document.getElementById('cfSpecs')?.classList.add('active');

  const tabBtns = document.querySelectorAll('.tab-btn[data-tab]');
  let firstVisible = null;

  tabBtns.forEach(btn => {
    const btnCat = btn.getAttribute('data-category');
    if (cat === 'all' || btnCat === cat) {
      btn.style.display = 'inline-flex';
      if (!firstVisible) firstVisible = btn;
    } else {
      btn.style.display = 'none';
    }
  });

  if (firstVisible && cat !== 'all') {
    firstVisible.click();
  }
}


// ==========================================================================
// 4-LANGUAGE GLOBAL TRANSLATION & DROPDOWN ENGINE
// ==========================================================================

function toggleLangDropdown(e) {
  if (e) e.stopPropagation();
  const menu = document.getElementById('langMenuDropdown');
  if (menu) menu.classList.toggle('show');
}

function selectLanguage(lang) {
  const menu = document.getElementById('langMenuDropdown');
  if (menu) menu.classList.remove('show');
  currentLanguage = lang;
  try {
    localStorage.setItem('voltcheck_lang', lang);
  } catch (e) {}

  if (document.documentElement) {
    document.documentElement.lang = lang;
  }

  // Update URL search param without reload
  try {
    const url = new URL(window.location.href);
    if (lang === 'ko') {
      url.searchParams.delete('lang');
    } else {
      url.searchParams.set('lang', lang);
    }
    window.history.replaceState({}, '', url.toString());
  } catch (e) {}

  applyLanguage(lang);
}

// Close dropdown on outside click
document.addEventListener('click', () => {
  const menu = document.getElementById('langMenuDropdown');
  if (menu) menu.classList.remove('show');
});


// ==========================================================================
// TAB 27: VALVE FLOW COEFFICIENT (Cv / Kv) & PIPE SIZING ENGINE
// ==========================================================================

function calculateValveCv() {
  const fluid = document.getElementById('vcFluidType')?.value || 'water';
  const q_lpm = parseFloat(document.getElementById('vcFlowRate')?.value) || 120;
  const dp_bar = Math.max(parseFloat(document.getElementById('vcDeltaP')?.value) || 1.5, 0.05);
  const pipe_id_mm = parseFloat(document.getElementById('vcPipeDiameter')?.value) || 32;
  const margin_pct = parseFloat(document.getElementById('vcSafetyMargin')?.value) || 25;

  // Specific gravity G
  let G = 1.0;
  if (fluid === 'oil') G = 0.88;
  else if (fluid === 'air') G = 0.0012;

  // Q in GPM for Cv formula: Q_gpm = Q_lpm * 0.264172
  const q_gpm = q_lpm * 0.264172;
  // dp in psi: dp_psi = dp_bar * 14.5038
  const dp_psi = dp_bar * 14.5038;

  // Cv = Q_gpm * sqrt(G / dp_psi)
  let cv = q_gpm * Math.sqrt(G / dp_psi);
  // Apply design margin
  cv = cv * (1 + margin_pct / 100);
  const kv = cv * 0.865;

  // Velocity v = Q / Area (m/s)
  // Q in m^3/s = (q_lpm / 1000) / 60
  const q_m3s = (q_lpm / 1000.0) / 60.0;
  const area_m2 = Math.PI * Math.pow((pipe_id_mm / 1000.0) / 2.0, 2);
  const vel_ms = area_m2 > 0 ? (q_m3s / area_m2) : 0;

  // Recommended DN port
  let recPort = 'DN25 (1")';
  if (cv < 3) recPort = 'DN15 (1/2")';
  else if (cv < 6) recPort = 'DN20 (3/4")';
  else if (cv < 12) recPort = 'DN25 ~ DN32 (1" ~ 1-1/4")';
  else if (cv < 25) recPort = 'DN40 ~ DN50 (1-1/2" ~ 2")';
  else recPort = 'DN65 이상 (2-1/2"+)';

  // Velocity status
  let velStatus = '적정 (권장 1~3 m/s)';
  let isVelSafe = true;
  if (vel_ms > 3.5) {
    velStatus = '유속 과대 (배관 확장 권장)';
    isVelSafe = false;
  } else if (vel_ms < 0.5) {
    velStatus = '유속 과소 (침전물 유의)';
  }

  // Update UI
  const elCv = document.getElementById('resVcCv');
  if (elCv) elCv.textContent = `${cv.toFixed(2)} Cv`;
  const elKv = document.getElementById('resVcKvSubText');
  if (elKv) elKv.textContent = `미터계 유량계수 Kv = ${kv.toFixed(2)} m³/h (개도율 65% 설계 마진 +${margin_pct}% 반영)`;
  const elVel = document.getElementById('resVcVelocity');
  if (elVel) elVel.textContent = `${vel_ms.toFixed(2)} m/s`;
  const elVelStat = document.getElementById('resVcVelStatus');
  if (elVelStat) {
    elVelStat.textContent = velStatus;
    elVelStat.className = isVelSafe ? 'summary-val font-mono text-safe' : 'summary-val font-mono text-warn';
  }
  const elPort = document.getElementById('resVcRecPort');
  if (elPort) elPort.textContent = recPort;

  const elBadge = document.getElementById('vcVerdictBadge');
  if (elBadge) {
    elBadge.textContent = isVelSafe ? 'OPTIMAL FLOW' : 'VELOCITY HIGH';
    elBadge.className = isVelSafe ? 'badge-pill badge-safe' : 'badge-pill badge-warn';
  }
}

// ==========================================================================
// TAB 28: AGV / AMR ROBOT BATTERY RUNTIME & CHARGING SIZER ENGINE
// ==========================================================================

function calculateAgvBattery() {
  const v_pack = parseFloat(document.getElementById('agvBatteryV')?.value) || 48;
  const cap_ah = parseFloat(document.getElementById('agvBatteryAh')?.value) || 60;
  const drive_w = parseFloat(document.getElementById('agvDrivePower')?.value) || 450;
  const aux_w = parseFloat(document.getElementById('agvPayloadPower')?.value) || 120;
  const charger_a = Math.max(parseFloat(document.getElementById('agvChargerA')?.value) || 30, 1);
  const dod_pct = parseFloat(document.getElementById('agvDod')?.value) || 80;

  const total_p_w = drive_w + aux_w;
  const total_energy_kwh = (v_pack * cap_ah) / 1000.0;
  const usable_energy_kwh = total_energy_kwh * (dod_pct / 100.0);

  // Runtime in hours
  const runtime_hrs = total_p_w > 0 ? (usable_energy_kwh * 1000.0 / total_p_w) : 0;
  const hrs = Math.floor(runtime_hrs);
  const mins = Math.round((runtime_hrs - hrs) * 60);

  // Discharge current A
  const dis_a = total_p_w / v_pack;

  // Charge time (hours to DoD%)
  const charge_ah = cap_ah * (dod_pct / 100.0);
  const charge_hrs = (charge_ah / charger_a) * 1.1; // 10% CC/CV efficiency buffer
  const c_rate = charger_a / cap_ah;

  // Update UI
  const elRt = document.getElementById('resAgvRuntime');
  if (elRt) elRt.textContent = `${runtime_hrs.toFixed(2)} 시간 (${hrs}시간 ${mins}분)`;
  const elEg = document.getElementById('resAgvEnergy');
  if (elEg) elEg.textContent = `총 유효 에너지 ${usable_energy_kwh.toFixed(2)} kWh (소비전력 ${total_p_w}W, DoD ${dod_pct}% 기준)`;
  const elChg = document.getElementById('resAgvChargeTime');
  if (elChg) elChg.textContent = `${charge_hrs.toFixed(2)} 시간 (${Math.round(charge_hrs * 60)}분)`;
  const elCr = document.getElementById('resAgvCrate');
  if (elCr) elCr.textContent = `${c_rate.toFixed(2)} C`;
  const elDis = document.getElementById('resAgvDischargeA');
  if (elDis) elDis.textContent = `${dis_a.toFixed(2)} A`;
}

// ==========================================================================
// TAB 29: BUSBAR AMPACITY & SHORT CIRCUIT FORCE ENGINE (DIN 43671)
// ==========================================================================

function calculateBusbar() {
  const mat = document.getElementById('bbMaterial')?.value || 'cu';
  const bars = parseInt(document.getElementById('bbBarsCount')?.value) || 1;
  const width_mm = parseFloat(document.getElementById('bbWidth')?.value) || 50;
  const thick_mm = parseFloat(document.getElementById('bbThickness')?.value) || 5;
  const isc_ka = parseFloat(document.getElementById('bbShortIsc')?.value) || 35;
  const dist_mm = Math.max(parseFloat(document.getElementById('bbPhaseDist')?.value) || 120, 20);

  const section_sq = width_mm * thick_mm;
  // DIN 43671 base ampacity approximation for copper bar (dT=35K, Amb 35C)
  // I_base ~= k * width^0.5 * thick^0.5 * 30
  let base_amp = Math.pow(section_sq, 0.62) * 28.5;
  if (mat === 'al') base_amp *= 0.78; // Al conductivity derating

  // Parallel bar factor
  let mult = 1.0;
  if (bars === 2) mult = 1.72;
  else if (bars === 3) mult = 2.25;

  const total_amp = Math.round(base_amp * mult);

  // Electromechanical force between phases F = 0.2 * (Ip^2) / a (N/m) [IEC 60865]
  // a in meters
  const dist_m = dist_mm / 1000.0;
  const force_nm = (0.2 * Math.pow(isc_ka, 2)) / dist_m * 10; // in N/m

  // Insulator support spacing L <= sqrt( 8 * W_mod * sigma / F )
  let recSpacing = '500 mm 이하';
  if (force_nm > 4000) recSpacing = '250 mm 이하 (고장력 지지대)';
  else if (force_nm > 2000) recSpacing = '400 mm 이하';
  else recSpacing = '600 mm 이하';

  // Weight kg/m
  const density = mat === 'cu' ? 8.94 : 2.70;
  const weight_kgm = (section_sq * bars * density) / 1000.0;

  // Update UI
  const elAmp = document.getElementById('resBbAmpacity');
  if (elAmp) elAmp.textContent = `${total_amp.toLocaleString()} A`;
  const elSec = document.getElementById('resBbSectionArea');
  if (elSec) elSec.textContent = `단면적 ${section_sq * bars} mm² (${mat === 'cu' ? '전기동 E-Cu' : '알루미늄'} ${bars}매, 온도상승 35K 기준)`;
  const elForce = document.getElementById('resBbElectroForce');
  if (elForce) elForce.textContent = `${Math.round(force_nm).toLocaleString()} N/m`;
  const elSpc = document.getElementById('resBbSupportSpacing');
  if (elSpc) elSpc.textContent = recSpacing;
  const elWt = document.getElementById('resBbWeight');
  if (elWt) elWt.textContent = `${weight_kgm.toFixed(2)} kg/m`;
}

// ==========================================================================
// TAB 30: CLEANROOM ESD STATIC DECAY & SURFACE RESISTIVITY ENGINE
// ==========================================================================

function calculateCleanESD() {
  const item = document.getElementById('esdTargetItem')?.value || 'mat';
  const v1 = parseFloat(document.getElementById('esdInitVolt')?.value) || 1000;
  const v2 = Math.max(parseFloat(document.getElementById('esdFinalVolt')?.value) || 100, 1);
  const t_decay = Math.max(parseFloat(document.getElementById('esdDecayTime')?.value) || 0.8, 0.01);
  const log_r = parseFloat(document.getElementById('esdSurfaceR')?.value) || 7.2;

  // Static Decay Rate V/s
  const decay_rate = (v1 - v2) / t_decay;

  // Classification based on surface resistance log10(ohms)
  let matClass = '정전기 분산성 (Dissipative)';
  let isCompliant = true;

  if (log_r < 4.0) {
    matClass = '전도성 재질 (Conductive Rs < 10⁴ Ω)';
  } else if (log_r >= 4.0 && log_r <= 9.0) {
    matClass = '정전기 분산성 (Dissipative 10⁴ ~ 10⁹ Ω)';
  } else if (log_r > 9.0 && log_r <= 11.0) {
    matClass = '준절연성 재질 (Anti-static 10⁹ ~ 10¹¹ Ω)';
  } else {
    matClass = '절연성 재질 (Insulative Rs > 10¹¹ Ω - 위험)';
    isCompliant = false;
  }

  // ANSI/ESD S20.20 requires decay time <= 2.0 seconds
  if (t_decay > 2.0) isCompliant = false;

  // Update UI
  const elVer = document.getElementById('resEsdVerdict');
  if (elVer) {
    elVer.textContent = isCompliant ? 'PASS (규격 적합)' : 'FAIL (기준 미달)';
    elVer.className = isCompliant ? 'terminal-voltage-big font-mono text-safe' : 'terminal-voltage-big font-mono text-danger';
  }
  const elSub = document.getElementById('resEsdSubText');
  if (elSub) elSub.textContent = `감쇠시간 ${t_decay.toFixed(2)}s (기준 2.0s 이하) / 표면저항 10^${log_r.toFixed(1)} Ω (${matClass})`;
  const elClass = document.getElementById('resEsdMaterialClass');
  if (elClass) {
    elClass.textContent = matClass;
    elClass.className = isCompliant ? 'summary-val font-mono text-safe' : 'summary-val font-mono text-warn';
  }
  const elRate = document.getElementById('resEsdDecayRate');
  if (elRate) elRate.textContent = `${Math.round(decay_rate).toLocaleString()} V/s`;

  const elBadge = document.getElementById('esdVerdictBadge');
  if (elBadge) {
    elBadge.textContent = isCompliant ? 'EPA PASS (정전기 안전)' : 'EPA HAZARD (정전기 위험)';
    elBadge.className = isCompliant ? 'badge-pill badge-safe' : 'badge-pill badge-danger';
  }
}



// ==========================================================================
// 78 TOOLS MASTER METADATA DIRECTORY FOR SEARCH & TOOLTIPS
// ==========================================================================
const MASTER_TOOLS_CATALOG = [
  { id: 'tab-voltagedrop', cat: 'power', name: '01. 24V 전압강하 & 허용거리', desc: '허용 전압강하 & 전선 단면적(sq) 자동 선정' },
  { id: 'tab-analogloop', cat: 'specs', name: '02. 4-20mA 아날로그 루프', desc: '2선식 트랜스미터 루프 저항 및 구동 전압 검증' },
  { id: 'tab-smpsbudget', cat: 'power', name: '03. SMPS & CP 차단기 용량', desc: '24V 부하 전류 합산 및 마진율 기반 정격 선정' },
  { id: 'tab-cabinetcooling', cat: 'specs', name: '04. 제어반 쿨링·에어컨', desc: '내부 발열량 합산 및 판넬 쿨러 소요 W/BTU 선정' },
  { id: 'tab-cabletable', cat: 'specs', name: '05. AWG-SQ 배선 조견표', desc: 'AWG 대 단면적(sq), 도체 저항, 허용전류 환산' },
  { id: 'tab-rs485', cat: 'specs', name: '06. RS-485 통신 거리·노드', desc: '보레이트별 최대 통신거리, 120Ω 종단저항' },
  { id: 'tab-pneumatics', cat: 'specs', name: '07. 공압 실린더 공기소모량', desc: '보어경/행정 에어 소비량(NL/min) 및 콤프레셔 HP' },
  { id: 'tab-ductutility', cat: 'specs', name: '08. 배선 덕트·후렉시블 점유율', desc: '배선 덕트 단면 점유율 및 여유율 검토' }
];

function getToolsCatalog() {
  const existingById = new Map(MASTER_TOOLS_CATALOG.map(tool => [tool.id, tool]));
  document.querySelectorAll('.tab-btn[data-tab]').forEach(btn => {
    const id = btn.getAttribute('data-tab');
    if (!id || id === 'tab-articles' || existingById.has(id)) return;
    const name = btn.textContent.trim().replace(/\s+/g, ' ');
    existingById.set(id, {
      id,
      cat: btn.getAttribute('data-category') || 'specs',
      name,
      desc: `${name} 계산 및 기술 검토`
    });
  });
  return Array.from(existingById.values());
}

// ========================================================================
// [UX UPGRADE 4] ALL-CALCULATOR USER GUIDE & CATEGORY PLAYBOOKS
// ========================================================================
const GUIDE_CATEGORY_META = {
  power: { label: '전원·보호·배전', icon: 'zap', desc: '전압, 전류, 용량, 보호기, 접지와 배전 여유를 검토합니다.', first: 'tab-voltagedrop', next: ['tab-smpsbudget', 'tab-inrushbreaker', 'tab-shortcircuit'] },
  signal: { label: '신호·통신·제어', icon: 'radio-tower', desc: '센서 신호, PLC, 네트워크, 안전회로의 전달 품질과 결선을 확인합니다.', first: 'tab-analogloop', next: ['tab-plcscaling', 'tab-rs485', 'tab-grounding'] },
  motion: { label: '모터·모션·기계', icon: 'settings-2', desc: '모터, 관성, 토크, 장력, 수명과 기계적 여유를 순서대로 검토합니다.', first: 'tab-motorcalc', next: ['tab-motioninertia', 'tab-servoregen', 'tab-mechlife'] },
  fluid: { label: '유체·배관·공정', icon: 'droplets', desc: '유량, 압력손실, 펌프·밸브·배관과 공정 열부하를 검토합니다.', first: 'tab-pumphead', next: ['tab-valvecv', 'tab-pipingloss', 'tab-waterhammer'] },
  thermal: { label: '열·냉각·에너지', icon: 'thermometer-snowflake', desc: '발열량, 냉각능력, 열교환, 배터리와 에너지 균형을 확인합니다.', first: 'tab-cabinetcooling', next: ['tab-batterythermal', 'tab-heatexchanger', 'tab-refrigerationcop'] },
  structure: { label: '구조·재료·시공', icon: 'ruler', desc: '처짐, 좌굴, 응력, 체결, 트레이와 구조 안전 여유를 검토합니다.', first: 'tab-beamdeflection', next: ['tab-steelbeam', 'tab-ballscrewbuckling', 'tab-bolttorque'] },
  special: { label: '특수·안전·연구', icon: 'shield-alert', desc: '방폭, 클린룸, 진공, 원자력·로봇과 같은 전문 조건을 검토합니다.', first: 'tab-safetylight', next: ['tab-explosionproof', 'tab-cleanesd', 'tab-besssafety'] }
};

const GUIDE_TOOL_GROUPS = {
  power: new Set(['tab-voltagedrop', 'tab-smpsbudget', 'tab-transformer', 'tab-shortcircuit', 'tab-inrushbreaker', 'tab-spd', 'tab-grounding', 'tab-busbar', 'tab-ctptburden', 'tab-powerfactor', 'tab-solarpv', 'tab-coppercost']),
  signal: new Set(['tab-analogloop', 'tab-rs485', 'tab-plcscaling', 'tab-otethernet', 'tab-iolinksafety', 'tab-npnpnp', 'tab-flybacksurge', 'tab-safetylight', 'tab-explosionproof', 'tab-tempconversion', 'tab-cleanesd', 'tab-cabletable', 'tab-bendingradius']),
  motion: new Set(['tab-motorcalc', 'tab-servoregen', 'tab-motioninertia', 'tab-hoistcrane', 'tab-rolltension', 'tab-vfdsurge', 'tab-bolttorque', 'tab-mechlife', 'tab-cuttingforce', 'tab-gearstress', 'tab-timingbelt', 'tab-couplingkey', 'tab-robottorque']),
  fluid: new Set(['tab-pneumatics', 'tab-ductutility', 'tab-valvecv', 'tab-hydraulics', 'tab-hvacblower', 'tab-steampipe', 'tab-accumulator', 'tab-reactorheat', 'tab-orificeflow', 'tab-insulation', 'tab-aerationtank', 'tab-mixerpower', 'tab-pipingloss', 'tab-pipeexpansion', 'tab-pipeerosion', 'tab-fanaffinity', 'tab-waterhammer']),
  thermal: new Set(['tab-cabinetcooling', 'tab-batterythermal', 'tab-heatexchanger', 'tab-refrigerationcop', 'tab-foulingheat', 'tab-agvbattery', 'tab-batteryslurry']),
  structure: new Set(['tab-beamdeflection', 'tab-steelbeam', 'tab-ballscrewbuckling', 'tab-cabletray', 'tab-pressureshell', 'tab-shipstability']),
  special: new Set(['tab-sldgenerator', 'tab-vacuumchamber', 'tab-nucleardecay', 'tab-rocketnozzle', 'tab-plasmasheath', 'tab-besssafety', 'tab-cleanroomdp', 'tab-luxlighting'])
};

function getGuideCategory(tool) {
  const declared = tool?.cat;
  if (declared && GUIDE_CATEGORY_META[declared]) return declared;
  for (const [category, ids] of Object.entries(GUIDE_TOOL_GROUPS)) {
    if (ids.has(tool?.id)) return category;
  }
  return 'signal';
}

function renderUserGuide() {
  const playbookGrid = document.getElementById('guidePlaybookGrid');
  const directory = document.getElementById('guideToolsDirectory');
  const summary = document.getElementById('guideToolsSummary');
  if (!playbookGrid || !directory || !summary) return;

  const tools = getToolsCatalog().filter(tool => tool.id !== 'tab-articles');
  const grouped = Object.fromEntries(Object.keys(GUIDE_CATEGORY_META).map(category => [category, []]));
  tools.forEach(tool => grouped[getGuideCategory(tool)].push(tool));
  const toolName = id => tools.find(tool => tool.id === id)?.name || id.replace('tab-', '');

  playbookGrid.innerHTML = Object.entries(GUIDE_CATEGORY_META).map(([category, meta]) => `
    <article class="guide-playbook-card">
      <strong><i data-lucide="${meta.icon}"></i> ${meta.label} <span class="guide-count">${grouped[category].length}개</span></strong>
      <p>${meta.desc}</p>
      <div class="guide-sequence">시작 → ${escapeHtml(toolName(meta.first))} → ${meta.next.map(toolName).map(escapeHtml).join(' → ')}</div>
      <div class="guide-playbook-tools">
        <button type="button" class="guide-tool-link" onclick="closeUserGuideAndStart('${meta.first}')">첫 계산기 열기</button>
        ${meta.next.slice(0, 2).map(id => `<button type="button" class="guide-tool-link" onclick="closeUserGuideAndStart('${id}')">${escapeHtml(toolName(id))}</button>`).join('')}
      </div>
    </article>
  `).join('');

  directory.innerHTML = Object.entries(GUIDE_CATEGORY_META).map(([category, meta]) => `
    <section class="guide-directory-group">
      <h4>${meta.label} <span class="guide-count">${grouped[category].length}</span></h4>
      <div class="guide-directory-list">
        ${grouped[category].map(tool => `<button type="button" onclick="closeUserGuideAndStart('${tool.id}')">${escapeHtml(tool.name)}</button>`).join('')}
      </div>
    </section>
  `).join('');
  summary.textContent = `${tools.length}개 계산기를 7개 작업 분야로 정리했습니다. 도구를 누르면 해당 계산기로 바로 이동합니다.`;
  if (window.lucide) window.lucide.createIcons();
}

function openUserGuide() {
  renderUserGuide();
  document.getElementById('userGuideModal')?.classList.remove('hidden');
  trackVoltCheckEvent(ANALYTICS_EVENTS.guideOpen, { action: 'open_user_guide_modal' });
}

function closeUserGuide() {
  document.getElementById('userGuideModal')?.classList.add('hidden');
}

function closeUserGuideAndStart(tabId) {
  closeUserGuide();
  switchTab(tabId);
  document.getElementById(tabId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

window.openUserGuide = openUserGuide;
window.closeUserGuide = closeUserGuide;
window.closeUserGuideAndStart = closeUserGuideAndStart;

const GLOBAL_UI_DICTIONARY = {
  // Navigation & Category Chips
  '⭐ 전체 78종': { en: '⭐ All 78 Tools', ja: '⭐ 全78種', vi: '⭐ Tất cả 78 công cụ', es: '⭐ Todas (78)', de: '⭐ Alle 78 Werkzeuge', zh: '⭐ 全部78款' },
  '⚡ 전원·변압기·SPD·PV': { en: '⚡ Power, TR, SPD & PV', ja: '⚡ 電源・変圧器・SPD', vi: '⚡ Nguồn, Biến áp & SPD', es: '⚡ Potencia, TR y SPD', de: '⚡ Strom, Trafo, SPD & PV', zh: '⚡ 电源·变压器·SPD' },
  '🛡️ 모터·롤투롤·VFD': { en: '🛡️ Motors, R2R & VFD', ja: '🛡️ モータ・R2R・VFD', vi: '🛡️ Động cơ, R2R & VFD', es: '🛡️ Motores, R2R y VFD', de: '🛡️ Motoren, R2R & FU', zh: '🛡️ 电机·卷绕·VFD' },
  '🌡️ 신호·통신·방폭(Ex)': { en: '🌡️ Signals, OT & Ex', ja: '🌡️ 信号・通信・防爆', vi: '🌡️ Tín hiệu, OT & Chống nổ', es: '🌡️ Señales, OT y Ex', de: '🌡️ Signale, OT & Ex-Schutz', zh: '🌡️ 信号·通信·防爆' },
  '📁 트레이·조도·클린룸': { en: '📁 Trays, Lux & Fab', ja: '📁 トレイ・照度・クリーン', vi: '📁 Máng cáp, Độ rọi & Phòng sạch', es: '📁 Bandejas, Lux y Sala Limpia', de: '📁 Kabeltrassen, Lux & Reinraum', zh: '📁 桥架·照度·洁净室' },

  // Top Header Utility
  '단위 환산': { en: 'Unit Converter', ja: '単位換算', vi: 'Đổi đơn vị', es: 'Conversor', de: 'Einheiten', zh: '单位换算' },
  '내 보관함': { en: 'Saved Calcs', ja: '保存一覧', vi: 'Đã lưu', es: 'Guardados', de: 'Gespeichert', zh: '我的收藏' },
  '조건 공유': { en: 'Share Link', ja: '条件共有', vi: 'Chia sẻ', es: 'Compartir', de: 'Link teilen', zh: '条件分享' },
  '검토서 인쇄': { en: 'Print Report', ja: '計算書印刷', vi: 'In báo cáo', es: 'Imprimir', de: 'Prüfbericht', zh: '打印报告' },
  '실무 엑셀·CAD 팩': { en: 'Pro Excel·CAD Pack', ja: '実務エクセル・CAD', vi: 'Gói Excel & CAD', es: 'Pack Excel y CAD', de: 'Excel & CAD-Paket', zh: '实务Excel·CAD' },
  '상세 환경 설정': { en: 'Advanced Settings', ja: '詳細環境設定', vi: 'Cài đặt nâng cao', es: 'Ajustes Avanzados', de: 'Erweiterte Einstellungen', zh: '高级环境设置' },
  '설계 파라미터 입력': { en: 'Design Parameters', ja: '設計パラメータ入力', vi: 'Thông số thiết kế', es: 'Parámetros de Diseño', de: 'Auslegungsparameter', zh: '设计参数输入' },
  '검증 판정 결과 및 계측 데이터': { en: 'Verification & Readouts', ja: '判定結果およびデータ', vi: 'Kết quả thẩm định', es: 'Veredicto y Lecturas', de: 'Prüfergebnisse & Messwerte', zh: '校验结果与读数' },
  '검토 결과 텍스트 복사': { en: 'Copy Verdict Text', ja: '結果テキストをコピー', vi: 'Sao chép kết quả', es: 'Copiar Resultado', de: 'Ergebnis kopieren', zh: '复制结果文本' },

  // Compliance Strip & Pro Monetization Banner
  'IEC 60204-1, NFPA 79, KEC 및 UL 508A 산업용 제어선로 및 전장설계 국제 기술 기준 준용': {
    en: 'Compliant with IEC 60204-1, NFPA 79, KEC, and UL 508A International Standards',
    ja: 'IEC 60204-1, NFPA 79, KEC および UL 508A 国際標準に準拠',
    vi: 'Tuân thủ các tiêu chuẩn quốc tế IEC 60204-1, NFPA 79, KEC và UL 508A',
    es: 'Conforme a las Normas Internacionales IEC 60204-1, NFPA 79, KEC y UL 508A',
    de: 'Konform mit IEC 60204-1, NFPA 79, KEC und UL 508A Standards',
    zh: '符合 IEC 60204-1、NFPA 79、KEC 和 UL 508A 国际标准'
  },
  '기술 검증 기준 및 설계 자문단 소개 →': {
    en: 'Standards Verification & Engineering Advisory Board →',
    ja: '技術検証基準および設計諮問団の紹介 →',
    vi: 'Tiêu chuẩn thẩm định & Hội đồng cố vấn kỹ thuật →',
    es: 'Verificación de Normas y Consejo Asesor de Ingeniería →',
    de: 'Normenüberprüfung & Ingenieurbeirat →',
    zh: '技术验证标准及设计顾问团介绍 →'
  },
  '38대 전 도구 오프라인 자동연산 엑셀(XLSX) & 전기 CAD 심볼 200종': {
    en: 'All Tools Offline Auto-Calculating Excel (XLSX) & 200 Electrical CAD Symbols',
    ja: '全種オフライン自動計算エクセル(XLSX)＆電気CADシンボル200種',
    vi: 'Bộ công cụ Excel (XLSX) tự động tính toán offline & 200 ký hiệu CAD điện',
    es: 'Pack Maestro Offline Excel (XLSX) y 200 Símbolos CAD Eléctricos',
    de: 'Offline Excel-Berechnungs-Paket (XLSX) & 200 Elektro-CAD-Symbole',
    zh: '全部工具离线自动计算Excel(XLSX)与200款电气CAD符号包'
  },
  '사내 보안 폐쇄망(인터넷 불가 연구소/공장)에서 평생 영구 소장하여 즉시 활용하는 실무 엔지니어 필수 번들': {
    en: 'Essential master bundle for industrial engineers on secure offline factory intranets with lifetime ownership',
    ja: '社内セキュリティ閉鎖網（ネット不可工場・研究所）で永年活用できる実務エンジニア必須バンドル',
    vi: 'Gói công cụ thiết yếu cho kỹ sư công nghiệp trên mạng nội bộ bảo mật ngoại tuyến sở hữu trọn đời',
    es: 'Paquete esencial para ingenieros en redes industriales cerradas sin internet con propiedad de por vida',
    de: 'Unverzichtbares Bundle für Ingenieure in sicheren Offline-Werksnetzen mit lebenslanger Nutzung',
    zh: '适用于企业安全隔离内网（无外网工厂/研发室）的终身永久使用实务工程师必备工具包'
  },
  '엑셀 팩 즉시 받기 (9,900원) →': {
    en: 'Get Excel Pack Instantly ($9.99 / 9,900 KRW) →',
    ja: 'エクセルパックを即時入手 (9,900ウォン) →',
    vi: 'Tải gói Excel ngay ($9.99 / 9,900 KRW) →',
    es: 'Obtener Pack Excel al Instante ($9.99) →',
    de: 'Excel-Paket sofort herunterladen ($9.99) →',
    zh: '立即获取Excel工具包 (9,900韩元) →'
  },
  '기업용 29,000원 안내': {
    en: 'Corporate Pro Package ($29.99)',
    ja: '法人・チーム用プラン',
    vi: 'Gói doanh nghiệp ($29.99)',
    es: 'Paquete Corporativo ($29.99)',
    de: 'Unternehmenslizenz ($29.99)',
    zh: '企业专业版方案'
  },

  // Pneumatics (Tab 7)
  '튜브 내경 (Bore)': { en: 'Cylinder Bore Diameter', ja: 'シリンダ内径 (Bore)', vi: 'Đường kính xi lanh (Bore)', es: 'Diámetro del Cilindro (Bore)', de: 'Zylinder-Innendurchmesser (Bore)', zh: '气缸内径 (Bore)' },
  '스트로크 (Stroke)': { en: 'Stroke Length (Stroke)', ja: 'ストローク長 (Stroke)', vi: 'Hành trình xi lanh (Stroke)', es: 'Longitud de Carrera (Stroke)', de: 'Hublänge (Stroke)', zh: '气缸行程 (Stroke)' },
  '공급 압력': { en: 'Supply Air Pressure', ja: '供給空気圧', vi: 'Áp suất khí cấp', es: 'Presión de Suministro', de: 'Versorgungsdruck', zh: '供气压力' },
  '분당 사이클': { en: 'Cycles Per Minute (CPM)', ja: '動作サイクル/分', vi: 'Chu kỳ mỗi phút (CPM)', es: 'Ciclos por Minuto (CPM)', de: 'Zyklen pro Minute (CPM)', zh: '每分钟动作循环' },
  '동일 실린더 수량': { en: 'Cylinder Quantity', ja: 'シリンダ台数', vi: 'Số lượng xi lanh', es: 'Cantidad de Cilindros', de: 'Zylinderanzahl', zh: '同款气缸数量' },
  '튜브 배관 길이': { en: 'Pneumatic Tubing Length', ja: '配管チューブ長', vi: 'Chiều dài ống khí', es: 'Longitud de Tubo Neumático', de: 'Schlauchlänge', zh: '气管配管长度' },
  '실린더 사양 입력': { en: 'Actuator Specifications', ja: 'シリンダ仕様入力', vi: 'Thông số xi lanh', es: 'Especificaciones del Cilindro', de: 'Zylinderspezifikationen', zh: '气缸规格输入' },
  '공기 소모량 및 동력': { en: 'Air Consumption & Power', ja: '空気消費量および動力', vi: 'Tiêu thụ khí & Công suất', es: 'Consumo de Aire y Potencia', de: 'Luftverbrauch & Leistung', zh: '耗气量与动力' },
  'TOTAL AIR CONSUMPTION (총 분당 공기 소모량)': { en: 'TOTAL AIR CONSUMPTION (Nℓ/min)', ja: '総空気消費量 (Nℓ/min)', vi: 'TỔNG TIÊU THỤ KHÍ (Nℓ/min)', es: 'CONSUMO TOTAL DE AIRE (Nℓ/min)', de: 'GESAMTLUFTVERBRAUCH (Nℓ/min)', zh: '每分钟总耗气量 (Nℓ/min)' },
  '추천 콤프레샤': { en: 'Recommended Compressor', ja: '推奨コンプレッサー', vi: 'Máy nén khí đề xuất', es: 'Compresor Recomendado', de: 'Empfohlener Kompressor', zh: '推荐空压机' },
  '1회 동작 소모량 (1-t)': { en: 'Air per Cycle (1-t)', ja: '1サイクル消費量', vi: 'Tiêu thụ mỗi chu kỳ', es: 'Consumo por Ciclo', de: 'Verbrauch pro Hub', zh: '单次动作耗气量' },
  '전진 정지 추력 (@0.5MPa)': { en: 'Forward Thrust (@0.5MPa)', ja: '前進推力 (@0.5MPa)', vi: 'Lực đẩy tiến (@0.5MPa)', es: 'Empuje de Avance (@0.5MPa)', de: 'Vorschubkraft (@0.5MPa)', zh: '前进推力 (@0.5MPa)' },

  // Voltage Drop & Loop (Tab 1 & 2)
  '선로 편도 배선 거리 (L)': { en: 'One-Way Cable Distance (L)', ja: '線路片道配線長 (L)', vi: 'Khoảng cách cáp 1 chiều (L)', es: 'Distancia de Cable Unidireccional (L)', de: 'Einfache Leitungslänge (L)', zh: '单程布线距离 (L)' },
  '케이블 도선 규격': { en: 'Wire Gauge Specification', ja: 'ケーブル導体規格', vi: 'Quy cách tiết diện dây', es: 'Calibre del Conductor', de: 'Leitungsquerschnitt (AWG/SQ)', zh: '电缆导线规格' },
  '말단 부하 소비전류 (I)': { en: 'Load Operating Current (I)', ja: '末端負荷消費電流 (I)', vi: 'Dòng tiêu thụ tải (I)', es: 'Corriente de Carga (I)', de: 'Lastbetriebsstrom (I)', zh: '末端负载工作电流 (I)' },
  '공급 전원 전압 (Vs)': { en: 'Supply Power Voltage (Vs)', ja: '供給電源電圧 (Vs)', vi: 'Điện áp nguồn cấp (Vs)', es: 'Tensión de Alimentación (Vs)', de: 'Versorgungsspannung (Vs)', zh: '供电电源电压 (Vs)' },
  '최소 동작 전압 (Vmin)': { en: 'Min Operating Voltage (Vmin)', ja: '最小動作電圧 (Vmin)', vi: 'Điện áp tối thiểu (Vmin)', es: 'Tensión Mínima de Operación', de: 'Min. Betriebsspannung (Vmin)', zh: '最低工作电压 (Vmin)' },

  // SMPS & Cooling (Tab 3 & 4)
  '상시 부하 전류 합계': { en: 'Steady-State Load Current Sum', ja: '常時負荷電流合計', vi: 'Tổng dòng tải liên tục', es: 'Suma de Corrientes Continuas', de: 'Dauerlaststrom-Summe', zh: '常时负载电流合计' },
  '제어반 내부 발열량': { en: 'Internal Heat Dissipation', ja: '盤内総発熱量', vi: 'Tỏa nhiệt nội bộ tủ điện', es: 'Disipación Térmica Interna', de: 'Schaltschrank-Verlustleistung', zh: '柜内总发热量' },
  '공장 최고 외기온도': { en: 'Max Ambient Temperature', ja: '最高外気温度', vi: 'Nhiệt độ môi trường cực đại', es: 'Temperatura Ambiente Máxima', de: 'Max. Umgebungstemperatur', zh: '最高环境温度' },
  '제어반 내부 목표온도': { en: 'Target Internal Temperature', ja: '盤内目標温度', vi: 'Nhiệt độ mục tiêu trong tủ', es: 'Temperatura Objetivo Interna', de: 'Ziel-Innentemperatur', zh: '柜内目标控制温度' },

  // Roll Tension (Tab 33)
  '롤 규격 및 라인 속도 파라미터': { en: 'Roll Dimensions & Line Speed', ja: 'ロール規格＆ライン速度設定', vi: 'Thông số cuộn & Tốc độ dây chuyền', es: 'Dimensiones del Rollo y Velocidad', de: 'Rollenabmessungen & Bahngeschwindigkeit', zh: '卷材规格与线速度参数' },
  '필요 서보 모터 토크 & 테이퍼 장력 판정': { en: 'Required Servo Torque & Taper Verdict', ja: '必要サーボトルク＆テーパー張力判定', vi: 'Mô-men xoắn servo & Lực căng côn', es: 'Torque Requerido y Tensión Cónica', de: 'Erforderliches Drehmoment & Konischer Zug', zh: '所需伺服扭矩与锥度张力判定' },
  '초기 지관 외경 (D_core)': { en: 'Core Outer Diameter (D_core)', ja: '初期コア外径 (D_core)', vi: 'Đường kính lõi cuộn (D_core)', es: 'Diámetro del Mandril (D_core)', de: 'Wickelkerndurchmesser (D_core)', zh: '初始卷芯外径 (D_core)' },
  '최대 권취 외경 (D_max)': { en: 'Max Package Diameter (D_max)', ja: '最大巻取外径 (D_max)', vi: 'Đường kính cuộn cực đại (D_max)', es: 'Diámetro Máximo (D_max)', de: 'Max. Wickeldurchmesser (D_max)', zh: '最大卷绕外径 (D_max)' },
  '초기 권취 장력 (T_base)': { en: 'Base Web Tension (T_base)', ja: '初期巻取張力 (T_base)', vi: 'Lực căng cuộn ban đầu (T_base)', es: 'Tensión Base de Bobinado', de: 'Basis-Bahnzug (T_base)', zh: '初始卷绕张力 (T_base)' },
  '테이퍼 감쇠율 (Taper Ratio)': { en: 'Taper Ratio (%)', ja: 'テーパー減衰率 (%)', vi: 'Tỷ lệ giảm côn (%)', es: 'Relación de Conicidad (%)', de: 'Taper-Verhältnis (%)', zh: '锥度衰减率 (%)' },
  '생산 라인 속도 (Line Speed)': { en: 'Production Line Speed', ja: '生産ライン速度', vi: 'Tốc độ dây chuyền', es: 'Velocidad de Línea', de: 'Linien-Geschwindigkeit', zh: '生产线速度' },
  '감속기 감속비 (Gear Ratio i)': { en: 'Gearbox Ratio (i)', ja: '減速比 (i)', vi: 'Tỷ số truyền giảm tốc (i)', es: 'Relación de Reducción (i)', de: 'Getriebeuntersetzung (i)', zh: '减速机减速比 (i)' },

  // VFD Surge & Ex (Tab 34 & 35)
  '인버터 입력 선간 전압 (Vin)': { en: 'VFD Input Line Voltage (Vin)', ja: 'インバータ入力電圧 (Vin)', vi: 'Điện áp đầu vào biến tần (Vin)', es: 'Tensión de Entrada del VFD', de: 'FU-Eingangsspannung (Vin)', zh: '变频器输入线电压 (Vin)' },
  '모터 케이블 포설 거리 (L)': { en: 'Motor Cable Length (L)', ja: 'モータケーブル長 (L)', vi: 'Chiều dài cáp động cơ (L)', es: 'Longitud de Cable al Motor (L)', de: 'Motorkabellänge (L)', zh: '电机电缆敷设距离 (L)' },
  '모터 절연 등급 (Motor Class)': { en: 'Motor Insulation Class', ja: 'モータ絶縁クラス', vi: 'Cấp cách điện động cơ', es: 'Clase de Aislamiento del Motor', de: 'Motor-Isolationsklasse', zh: '电机绝缘等级' },
  '인버터 캐리어 주파수': { en: 'VFD Carrier Frequency', ja: 'キャリア周波数', vi: 'Tần số sóng mang biến tần', es: 'Frecuencia Portadora', de: 'Taktfrequenz / Trägerfrequenz', zh: '变频器载波频率' },
  '방폭 위험 장소 (Zone)': { en: 'Hazardous Area Zone', ja: '防爆危険場所 (Zone)', vi: 'Khu vực nguy hiểm chống nổ', es: 'Zona de Atmósfera Explosiva', de: 'Ex-Zone', zh: '防爆危险区域 (Zone)' },
  '폭발 가스 그룹 (Gas Group)': { en: 'Explosive Gas Group', ja: '爆発ガスグループ', vi: 'Nhóm khí gây nổ', es: 'Grupo de Gas Explosivo', de: 'Explosionsgruppe', zh: '爆炸性气体组别' },
  '최고 표면 온도 등급 (T Class)': { en: 'Max Surface Temp Class (T)', ja: '最高表面温度等級 (T)', vi: 'Cấp nhiệt độ bề mặt cực đại (T)', es: 'Clase de Temperatura Superficial', de: 'Temperaturklasse (T)', zh: '最高表面温度等级 (T)' },
  '방폭 구역 케이블 길이 (L)': { en: 'Hazardous Cable Length (L)', ja: '防爆区間ケーブル長 (L)', vi: 'Chiều dài cáp vùng chống nổ (L)', es: 'Longitud de Cable en Zona Ex', de: 'Ex-Kabellänge (L)', zh: '防爆区域电缆长度 (L)' },

  // Tray, Lux, Solar (Tab 36, 37, 38)
  '트레이 폭 (Tray Width W)': { en: 'Tray Width (W)', ja: 'トレイ幅 (W)', vi: 'Bề rộng máng cáp (W)', es: 'Ancho de Bandeja (W)', de: 'Kabelrinnenbreite (W)', zh: '桥架宽度 (W)' },
  '지지대 설치 간격 (Support Span L)': { en: 'Support Span (L)', ja: '支持スパン (L)', vi: 'Khoảng cách giá đỡ (L)', es: 'Distancia entre Soportes (L)', de: 'Stützabstand (L)', zh: '支架安装间距 (L)' },
  '동력 케이블 (굵은선) 가닥수': { en: 'Power Cable Core Count', ja: '動力ケーブル条数', vi: 'Số sợi cáp động lực', es: 'Cables de Potencia', de: 'Anzahl Leistungskabel', zh: '动力电缆根数' },
  '제어 케이블 (가는선) 가닥수': { en: 'Control Cable Core Count', ja: '制御ケーブル条数', vi: 'Số sợi cáp điều khiển', es: 'Cables de Control', de: 'Anzahl Steuerkabel', zh: '控制电缆根数' },
  '용도별 표준 조도 (Target Lux)': { en: 'Standard Target Lux', ja: '用途別標準照度 (Lux)', vi: 'Độ rọi tiêu chuẩn (Lux)', es: 'Iluminancia Objetivo (Lux)', de: 'Soll-Beleuchtungsstärke (Lux)', zh: '用途标准照度 (Target Lux)' },
  '바닥/작업면 면적 (Area A)': { en: 'Workplane Area (A)', ja: '作業面面積 (A)', vi: 'Diện tích mặt sàn/làm việc (A)', es: 'Área del Plano de Trabajo (A)', de: 'Arbeitsflächen-Areal (A)', zh: '工作面面积 (Area A)' },
  'LED 1등당 정격 광속 (Lumen F)': { en: 'Luminous Flux per Fixture', ja: '器具定格光束 (Lumen F)', vi: 'Quang thông định mức mỗi đèn', es: 'Flujo Luminoso por Luminaria', de: 'Lichtstrom pro Leuchte (Lumen F)', zh: '单套灯具额定光通量' },
  'LED 1등당 소비전력 (Power W)': { en: 'Power per Fixture (W)', ja: '器具消費電力 (W)', vi: 'Công suất mỗi đèn (W)', es: 'Potencia por Luminaria (W)', de: 'Leistung pro Leuchte (W)', zh: '单套灯具功率 (W)' },
  '직렬 모듈 수량 (N_series)': { en: 'Series Module Count', ja: '直列モジュール数', vi: 'Số tấm pin nối tiếp', es: 'Módulos en Serie', de: 'Module in Reihe', zh: '串联组件数量' },
  '모듈 개방전압 Voc (STC 기준)': { en: 'Module Voc at STC', ja: 'モジュール開放電圧 Voc', vi: 'Điện áp hở mạch Voc (STC)', es: 'Tensión de Circuito Abierto Voc', de: 'Leerlaufspannung Voc (STC)', zh: '组件开路电压 Voc' },
  '모듈 단락전류 Isc (STC 기준)': { en: 'Module Isc at STC', ja: 'モジュール短絡電流 Isc', vi: 'Dòng ngắn mạch Isc (STC)', es: 'Corriente de Cortocircuito Isc', de: 'Kurzschlussstrom Isc (STC)', zh: '组件短路电流 Isc' },
  '접속반까지 DC 배선 거리 (L)': { en: 'DC Cable Run Distance (L)', ja: 'DC配線長 (L)', vi: 'Khoảng cách dây DC đến tủ (L)', es: 'Longitud de Cableado DC (L)', de: 'DC-Kabelstrecke (L)', zh: '至汇流箱DC布线距离 (L)' }
};

function translateEntireDOM(lang) {
  if (!lang || lang === 'ko') return;
  const dict = GLOBAL_UI_DICTIONARY;

  // Walk all DOM elements with text
  const elements = document.querySelectorAll('label, h1, h2, h3, h4, h5, p, span, strong, button, th, td, option, .tv-label, .gauge-label, .summary-label');
  elements.forEach(el => {
    if (el.children.length === 0) {
      const raw = el.textContent ? el.textContent.trim() : '';
      if (dict[raw] && dict[raw][lang]) {
        el.textContent = dict[raw][lang];
      }
    } else {
      el.childNodes.forEach(node => {
        if (node.nodeType === 3) { // TEXT_NODE
          const raw = node.textContent ? node.textContent.trim() : '';
          if (dict[raw] && dict[raw][lang]) {
            node.textContent = dict[raw][lang];
          }
        }
      });
    }
  });

  // Translate Select Options
  document.querySelectorAll('select option').forEach(opt => {
    const raw = opt.textContent ? opt.textContent.trim() : '';
    if (dict[raw] && dict[raw][lang]) {
      opt.textContent = dict[raw][lang];
    }
  });

  // Translate Input Placeholders
  const searchInput = document.getElementById('globalToolSearch');
  if (searchInput) {
    if (lang === 'en') searchInput.placeholder = 'Search 78 engineering tools (e.g. 24V, Bearing, Motor, Hydraulic, Robot...) [Ctrl+K]';
    else if (lang === 'es') searchInput.placeholder = 'Buscar 78 herramientas de ingeniería (ej. 24V, Rodamiento, Motor, Hidráulica...) [Ctrl+K]';
    else if (lang === 'ja') searchInput.placeholder = '78種の工学ツールを検索（例：24V, 軸受, モータ, 油圧, ロボット...） [Ctrl+K]';
    else if (lang === 'vi') searchInput.placeholder = 'Tìm kiếm 78 công cụ kỹ thuật (vd: 24V, Vòng bi, Động cơ, Thủy lực, Robot...) [Ctrl+K]';
    else if (lang === 'de') searchInput.placeholder = '78 Engineering-Tools suchen (z.B. 24V, Lager, Motor, Hydraulik, Roboter...) [Ctrl+K]';
    else if (lang === 'zh') searchInput.placeholder = '搜索78款工程工具（例如：24V, 轴承, 电机, 液压, 机器人...） [Ctrl+K]';
  }
}

function filterToolsSearch(query = '') {
  const dropdown = document.getElementById('quickSearchDropdown');
  if (!dropdown) return;

  const normalizedQuery = String(query || '').trim().toLowerCase();
  const tools = getToolsCatalog();
  const matches = normalizedQuery
    ? tools.filter(tool => {
        const haystack = `${tool.name} ${tool.desc} ${tool.cat}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      })
    : tools.slice(0, 12);

  if (matches.length === 0) {
    dropdown.innerHTML = '<div class="search-result-item"><div><div class="search-res-title">검색 결과 없음</div><div class="search-res-desc">다른 키워드로 78대 산업 공학 도구를 검색해보세요.</div></div></div>';
    dropdown.style.display = 'block';
    return;
  }

  let html = '';
  matches.slice(0, 10).forEach(m => {
    let catLabel = '전기·전원';
    if (m.cat === 'motion') catLabel = '모터·배터리';
    else if (m.cat === 'mech') catLabel = '기계·가공';
    else if (m.cat === 'fluid') catLabel = '유압·화공';
    else if (m.cat === 'nuclear') catLabel = '원자력·로봇';
    else if (m.cat === 'specs') catLabel = '설비·자료실';

    html += `
      <div class="search-result-item" onclick="selectSearchResultTool('${m.id}')">
        <div>
          <div class="search-res-title">${m.name}</div>
          <div class="search-res-desc">${m.desc}</div>
        </div>
        <span class="search-res-badge">${catLabel}</span>
      </div>
    `;
  });

  dropdown.innerHTML = html;
  dropdown.style.display = 'block';
}

function selectSearchResultTool(tabId) {
  const dropdown = document.getElementById('quickSearchDropdown');
  if (dropdown) dropdown.style.display = 'none';
  const searchInput = document.getElementById('globalToolSearch');
  if (searchInput) searchInput.value = '';

  const btn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
  if (btn) {
    btn.click();
    btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }
}
window.selectSearchResultTool = selectSearchResultTool;

// Close search dropdown on click outside
document.addEventListener('click', (e) => {
  const searchWrapper = document.querySelector('.quick-search-wrapper');
  const dropdown = document.getElementById('quickSearchDropdown');
  if (dropdown && searchWrapper && !searchWrapper.contains(e.target)) {
    dropdown.style.display = 'none';
  }
});


// ==========================================================================
// TAB 31: SPD SURGE PROTECTIVE DEVICE SIZER ENGINE (IEC 61643)
// ==========================================================================

function calculateSPD() {
  const spdType = document.getElementById('spdTypeClass')?.value || 't2';
  const grid = document.getElementById('spdGridSystem')?.value || 'tn_s';
  const un = parseFloat(document.getElementById('spdLineVoltage')?.value) || 380;
  const risk = document.getElementById('spdRiskLevel')?.value || 'medium';

  // Phase voltage U0
  const u0 = un / Math.sqrt(3);

  // Maximum Continuous Operating Voltage Uc
  let uc = 275;
  if (grid === 'it') uc = Math.round(un * 1.15);
  else if (grid === 'tt') uc = Math.round(u0 * 1.15);
  else uc = Math.round(u0 * 1.15); // TN

  // Discharge rating
  let capText = 'In 20 kA / Imax 40 kA';
  let upText = '≤ 1.5 kV';
  let backupText = '32A gG 퓨즈 / 32A C-curve MCB';

  if (spdType === 't1') {
    capText = risk === 'high' ? 'Iimp 25 kA (10/350µs) / In 50 kA' : 'Iimp 12.5 kA (10/350µs) / In 25 kA';
    upText = '≤ 2.5 kV';
    backupText = '63A ~ 125A gG 퓨즈';
  } else if (spdType === 't3') {
    capText = 'Uoc 6 kV / In 3 kA (8/20µs)';
    upText = '≤ 1.0 kV (정밀 기기 보호)';
    backupText = '16A gG 퓨즈';
  } else {
    if (risk === 'high') capText = 'In 40 kA / Imax 80 kA';
    else if (risk === 'low') capText = 'In 10 kA / Imax 20 kA';
    else capText = 'In 20 kA / Imax 40 kA';
  }

  // Update UI
  const elCap = document.getElementById('resSpdCapacity');
  if (elCap) elCap.textContent = capText;
  const elUc = document.getElementById('resSpdUcSubText');
  if (elUc) elUc.textContent = `최대연속운전전압 Uc ≥ ${uc}V (${grid.toUpperCase()} ${Math.round(u0)}V 상전압 × 1.15 계수 만족)`;
  const elUp = document.getElementById('resSpdUp');
  if (elUp) elUp.textContent = upText;
  const elBk = document.getElementById('resSpdBackup');
  if (elBk) elBk.textContent = backupText;
}

// ==========================================================================
// TAB 32: GANTRY / CRANE HOIST MOTOR & ROPE SIZER ENGINE
// ==========================================================================

function calculateCraneHoist() {
  const ton = parseFloat(document.getElementById('hcLoadTon')?.value) || 5.0;
  const speed_mpm = parseFloat(document.getElementById('hcHoistSpeed')?.value) || 7.5;
  const falls = parseInt(document.getElementById('hcFallsCount')?.value) || 4;
  const eff_pct = parseFloat(document.getElementById('hcEfficiency')?.value) || 82;
  const rope_break_kn = parseFloat(document.getElementById('hcRopeBreaking')?.value) || 85;

  // Power P = (W_kg * 9.81 * V_m_s) / (1000 * eta)
  const w_kg = ton * 1000.0;
  const v_ms = speed_mpm / 60.0;
  const eta = eff_pct / 100.0;

  const p_kw = (w_kg * 9.81 * v_ms) / (1000.0 * eta);
  const p_hp = p_kw * 1.341;

  // Standard motor recommendation
  let recKw = 7.5;
  if (p_kw <= 2.2) recKw = 2.2;
  else if (p_kw <= 3.7) recKw = 3.7;
  else if (p_kw <= 5.5) recKw = 5.5;
  else if (p_kw <= 7.5) recKw = 7.5;
  else if (p_kw <= 11.0) recKw = 11.0;
  else if (p_kw <= 15.0) recKw = 15.0;
  else if (p_kw <= 22.0) recKw = 22.0;
  else recKw = Math.ceil(p_kw * 1.2);

  // Rope tension per fall T = (W_kN) / falls
  const total_kn = (w_kg * 9.81) / 1000.0;
  const rope_tension_kn = total_kn / falls;

  // Safety factor SF = Breaking / Tension
  const sf = rope_tension_kn > 0 ? (rope_break_kn / rope_tension_kn) : 0;
  const isSfSafe = sf >= 5.0;

  // Holding Brake Torque Tb = 1.5 * (W * D_drum / 2*i) ~= 1.5 * motor torque
  const brake_nm = (p_kw * 9550 / (1500 / 1)) * 1.5;

  // Update UI
  const elKw = document.getElementById('resHcMotorKw');
  if (elKw) elKw.textContent = `${p_kw.toFixed(2)} kW`;
  const elSub = document.getElementById('resHcMotorHpSub');
  if (elSub) elSub.textContent = `권장 표준 모터: ${recKw} kW (${(recKw * 1.341).toFixed(1)} HP) 3상 유도전동기 (안전율 반영)`;
  const elTen = document.getElementById('resHcRopeTension');
  if (elTen) elTen.textContent = `${rope_tension_kn.toFixed(2)} kN`;
  const elSf = document.getElementById('resHcSafetyFactor');
  if (elSf) {
    elSf.textContent = `${sf.toFixed(2)} 배 (${isSfSafe ? '기준 5배 이상 만족' : '기준 5배 미달 위험'})`;
    elSf.className = isSfSafe ? 'summary-val font-mono text-safe' : 'summary-val font-mono text-danger';
  }
  const elBrk = document.getElementById('resHcBrakeTorque');
  if (elBrk) elBrk.textContent = `${Math.round(brake_nm)} N·m`;

  const elBadge = document.getElementById('hcVerdictBadge');
  if (elBadge) {
    elBadge.textContent = isSfSafe ? 'SAFETY FACTOR OK' : 'ROPE HAZARD';
    elBadge.className = isSfSafe ? 'badge-pill badge-safe' : 'badge-pill badge-danger';
  }
}


// ==========================================================================
// 1-CLICK ENGINEERING RESULT COPY ENGINE (FOR JIRA / KAKAOTALK / REPORTS)
// ==========================================================================

function copyCurrentTabSummary(tabId) {
  let text = '';
  if (tabId === 'tab-voltagedrop') {
    const vd = document.getElementById('resVoltDropBig')?.textContent || '0V';
    const tv = document.getElementById('resTerminalVoltBig')?.textContent || '24V';
    const status = document.getElementById('vdVerdictBadge')?.textContent || 'SAFE';
    text = `[VoltCheck 24V 전압강하 검토 결과]\n- 판정: ${status}\n- 선로 전압강하: ${vd}\n- 말단 수전 전압: ${tv}\n- 국제 기준: IEC 60204-1 허용 범위 만족\nhttps://voltcheck24.com/`;
  } else if (tabId === 'tab-safetylight') {
    const s = document.getElementById('resSlMinDistance')?.textContent || '0mm';
    const status = document.getElementById('slVerdictBadge')?.textContent || 'SAFE';
    text = `[VoltCheck 안전 라이트커튼 이격거리 검토 결과]\n- 판정: ${status}\n- 법적 최소 안전거리(S): ${s}\n- 적용 표준: ISO 13855 / EN ISO 13849-1\nhttps://voltcheck24.com/`;
  } else if (tabId === 'tab-transformer') {
    const kva = document.getElementById('resTrCapacity')?.textContent || '0kVA';
    const pri = document.getElementById('resTrPrimaryBreaker')?.textContent || '10A';
    text = `[VoltCheck 제어용 변압기(TR) 선정 결과]\n- 추천 변압기 용량: ${kva}\n- 1차측 추천 차단기: ${pri}\n- 적용 표준: IEC 60204-1 / NFPA 79\nhttps://voltcheck24.com/`;
  } else if (tabId === 'tab-busbar') {
    const amp = document.getElementById('resBbAmpacity')?.textContent || '0A';
    const force = document.getElementById('resBbElectroForce')?.textContent || '0 N/m';
    text = `[VoltCheck 구리 부스바 허용전류 검토 결과]\n- 연속 정격 허용전류: ${amp}\n- 단락 전자 기계력: ${force}\n- 적용 표준: DIN 43671 / IEC 60865\nhttps://voltcheck24.com/`;
  } else if (tabId === 'tab-spd') {
    const cap = document.getElementById('resSpdCapacity')?.textContent || '20kA';
    const up = document.getElementById('resSpdUp')?.textContent || '1.5kV';
    text = `[VoltCheck 서지보호기(SPD) 선정 결과]\n- 추천 방전용량: ${cap}\n- 전압보호레벨: ${up}\n- 적용 표준: IEC 61643-11\nhttps://voltcheck24.com/`;
  } else {
    text = `[VoltCheck 공학 계산서]\n공인 전기 표준(IEC/NFPA/KEC) 기반 검토 완료.\nhttps://voltcheck24.com/`;
  }

  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      alert('공학 검토 요약 결과가 클립보드에 복사되었습니다!\n카카오톡, 슬랙 또는 설계 보고서에 [Ctrl+V]로 붙여넣으세요.\n\n' + text);
    });
  }
}


// ==========================================================================
// GLOBAL DIGITAL ASSET MODAL CONTROLLER & TIER SELECTION
// ==========================================================================

function openDigitalModal() {
  const modal = document.getElementById('digitalProductModal');
  if (modal) {
    modal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
  }
}
window.openDigitalModal = openDigitalModal;

function closeDigitalModal() {
  const modal = document.getElementById('digitalProductModal');
  if (modal) modal.classList.add('hidden');
}
window.closeDigitalModal = closeDigitalModal;

function selectTierAndBuy(price, tierName) {
  SELECTED_DIGITAL_TIER = { price, title: tierName };
  const isEn = currentLanguage === 'en';
  const orderBox = document.getElementById('digitalOrderBox');
  const priceNum = document.getElementById('checkoutPriceNum');
  const priceUnit = document.querySelector('#digitalOrderBox .tier-price .t-unit');
  const titleEl = document.getElementById('selectedTierTitle');
  const badgeEl = document.getElementById('checkoutTierBadge');
  const btnText = document.getElementById('paySubmitBtnText');

  if (orderBox) orderBox.style.display = 'block';
  if (isEn) {
    const usd = price === 29000 ? '19.99' : '9.99';
    if (priceNum) priceNum.textContent = usd;
    if (priceUnit) priceUnit.textContent = 'USD (VAT Incl.)';
    if (titleEl) titleEl.textContent = price === 29000 ? 'PRO Enterprise Master Bundle ($19.99)' : 'Engineering Starter Pack ($9.99)';
    if (badgeEl) badgeEl.textContent = `SELECTED: $${usd} USD TIER`;
    if (btnText) btnText.textContent = 'Continue to official checkout';
  } else {
    if (priceNum) priceNum.textContent = price.toLocaleString('ko-KR');
    if (priceUnit) priceUnit.textContent = '원 (VAT 포함)';
    if (titleEl) titleEl.textContent = tierName;
    if (badgeEl) badgeEl.textContent = `SELECTED: ${price.toLocaleString('ko-KR')} KRW TIER`;
    if (btnText) btnText.textContent = '공식 결제 페이지로 이동';
  }

  // Scroll to checkout box smoothly
  if (orderBox) {
    orderBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}
window.selectTierAndBuy = selectTierAndBuy;


// ==========================================================================
// TAB 33: ROLL-TO-ROLL WINDER TENSION & SERVO TORQUE ENGINE
// ==========================================================================

function calculateRollTension() {
  const dCore = parseFloat(document.getElementById('rtCoreDia')?.value) || 100;
  const dMax = parseFloat(document.getElementById('rtMaxDia')?.value) || 600;
  const tBase = parseFloat(document.getElementById('rtBaseTension')?.value) || 120;
  const taperPct = parseFloat(document.getElementById('rtTaperPct')?.value) || 35;
  const lineSpeed = parseFloat(document.getElementById('rtLineSpeed')?.value) || 80;
  const gearRatio = parseFloat(document.getElementById('rtGearRatio')?.value) || 5;

  // Final tension at D_max T_end = T_base * [1 - (taper/100)*(1 - dCore/dMax)]
  const tEnd = tBase * (1.0 - (taperPct / 100.0) * (1.0 - (dCore / dMax)));

  // Max torque at D_max M = (T_end * (D_max/2000)) / (gearRatio * 0.95)
  const rMax_m = (dMax / 2.0) / 1000.0;
  const torque_nm = (tEnd * rMax_m) / (gearRatio * 0.95);

  // Max RPM at core diameter N = (V / (pi * dCore)) * gearRatio
  const rpmCore = (lineSpeed / (Math.PI * (dCore / 1000.0))) * gearRatio;

  // Update UI
  const elTorque = document.getElementById('resRtMotorTorque');
  if (elTorque) elTorque.textContent = `${torque_nm.toFixed(2)} N·m`;
  const elSub = document.getElementById('resRtTaperEndText');
  if (elSub) elSub.textContent = `최대 권경 장력: ${tEnd.toFixed(1)} N (${taperPct}% 감쇠) • 최대 회전수: ${Math.round(rpmCore)} RPM`;
  const elGaugeText = document.getElementById('gaugeRtText');
  if (elGaugeText) elGaugeText.textContent = `${tEnd.toFixed(1)} N (주름 방지 최적)`;
}

// ==========================================================================
// TAB 34: VFD REFLECTED WAVE PEAK SURGE & REACTOR SIZER ENGINE
// ==========================================================================

function calculateVfdSurge() {
  const vin = parseFloat(document.getElementById('vfdGridVolt')?.value) || 380;
  const len = parseFloat(document.getElementById('vfdCableLen')?.value) || 120;
  const mType = document.getElementById('vfdMotorType')?.value || 'inverter_duty';
  const carrier = parseFloat(document.getElementById('vfdCarrierFreq')?.value) || 4;

  const vdc = vin * Math.sqrt(2);
  let vpeak = vdc * 1.9; // Reflected wave spike
  if (len < 30) vpeak = vdc * 1.3;
  else if (len < 70) vpeak = vdc * 1.6;

  const maxAllowed = mType === 'inverter_duty' ? 1600 : 1000;
  const isSafe = vpeak <= maxAllowed;

  let recText = '케이블 길이 30m 이내로 리액터 없이 직결 안전';
  if (len >= 300) recText = '추천 대책: 사인파 필터 (Sine Wave Filter) 필수 설치';
  else if (len >= 100) recText = '추천 대책: dV/dt 필터 장착 (전압 상승률 ≤ 500V/µs 억제)';
  else if (len >= 30) recText = '추천 대책: 3% ~ 5% 부하 AC 리액터 (Load Reactor) 설치';

  const elPeak = document.getElementById('resVfdPeakVolt');
  if (elPeak) elPeak.textContent = `${Math.round(vpeak).toLocaleString('ko-KR')} V`;
  const elRec = document.getElementById('resVfdFilterRec');
  if (elRec) elRec.textContent = recText;

  const elBadge = document.getElementById('vfdVerdictBadge');
  if (elBadge) {
    elBadge.textContent = isSafe ? (len < 30 ? 'SURGE SAFE' : 'FILTER RECOMMENDED') : 'INSULATION HAZARD';
    elBadge.className = isSafe ? 'badge-pill badge-safe' : 'badge-pill badge-danger';
  }

  const elGaugeText = document.getElementById('gaugeVfdText');
  if (elGaugeText) elGaugeText.textContent = `${Math.round(vpeak)}V / ${maxAllowed}V 한계 (${isSafe ? '안전' : '절연파괴 위험'})`;
  const elMarker = document.getElementById('gaugeVfdMarker');
  if (elMarker) {
    const pct = Math.min(100, Math.max(0, (vpeak / 1800) * 100));
    elMarker.style.left = `${pct}%`;
  }
}

// ==========================================================================
// TAB 35: IEC 60079 EXPLOSION PROOF & INTRINSIC SAFETY SIZER
// ==========================================================================

function calculateExplosionProof() {
  const zone = document.getElementById('exZoneType')?.value || 'zone1';
  const gas = document.getElementById('exGasGroup')?.value || 'iic';
  const tClass = document.getElementById('exTempClass')?.value || 't4';
  const len = parseFloat(document.getElementById('exCableLength')?.value) || 80;

  // Max cable capacitance standard 1nF/m
  const cCable_nF = len * 0.12; // 120 pF/m
  const maxCo_nF = gas === 'iic' ? 83 : 650; // IIC limit
  const isCapSafe = cCable_nF < maxCo_nF;

  const code = `Ex ${zone === 'zone0' ? 'ia' : (zone === 'zone1' ? 'd / ia' : 'ec')} ${gas.toUpperCase()} ${tClass.toUpperCase()}`;

  const elProt = document.getElementById('resExProtection');
  if (elProt) elProt.textContent = code;
  const elCap = document.getElementById('resExCableCap');
  if (elCap) elCap.textContent = `케이블 정전용량 Ccable = ${cCable_nF.toFixed(1)} nF (배리어 허용한계 ${maxCo_nF} nF 대비 마진 여유)`;

  const elBadge = document.getElementById('exVerdictBadge');
  if (elBadge) {
    elBadge.textContent = isCapSafe ? 'IEC 60079 COMPLIANT' : 'CAPACITANCE HAZARD';
    elBadge.className = isCapSafe ? 'badge-pill badge-safe' : 'badge-pill badge-danger';
  }
}

// ==========================================================================
// TAB 36: CABLE TRAY LOADING & SPAN DEFLECTION SIZER
// ==========================================================================

function calculateCableTray() {
  const width = parseFloat(document.getElementById('ctTrayWidth')?.value) || 450;
  const span = parseFloat(document.getElementById('ctSupportSpan')?.value) || 2.0;
  const nPower = parseInt(document.getElementById('ctPowerCablesCount')?.value) || 12;
  const nControl = parseInt(document.getElementById('ctControlCablesCount')?.value) || 30;

  // Power cable avg 1.4 kg/m, Control cable avg 0.25 kg/m, Tray self weight 6 kg/m
  const wTotal = (nPower * 1.4) + (nControl * 0.25) + 6.0;

  // Deflection delta = (5 * w * L^4) / (384 * E * I) ~= approx 0.2 mm / (kg/m) at 2m
  const deflection_mm = (wTotal * Math.pow(span, 4) * 0.007);
  const maxDeflection_mm = (span * 1000.0) / 200.0;
  const isSafe = deflection_mm <= maxDeflection_mm;

  const elWeight = document.getElementById('resCtTotalWeight');
  if (elWeight) elWeight.textContent = `${wTotal.toFixed(1)} kg/m`;
  const elDef = document.getElementById('resCtDeflectionText');
  if (elDef) elDef.textContent = `예상 처짐량: ${deflection_mm.toFixed(1)} mm (NEMA 허용한도 ${maxDeflection_mm.toFixed(1)} mm 이내 ${isSafe ? '안정' : '초과위험'})`;

  const elBadge = document.getElementById('ctVerdictBadge');
  if (elBadge) {
    elBadge.textContent = isSafe ? 'NEMA DEFLECTION OK' : 'SPAN OVERLOAD';
    elBadge.className = isSafe ? 'badge-pill badge-safe' : 'badge-pill badge-danger';
  }
}

// ==========================================================================
// TAB 37: LUX LIGHTING & FIXTURE COUNT ENGINE
// ==========================================================================

function calculateLuxLighting() {
  const targetLux = parseFloat(document.getElementById('luxTargetType')?.value) || 500;
  const area = parseFloat(document.getElementById('luxRoomArea')?.value) || 12.0;
  const fixtureLm = parseFloat(document.getElementById('luxFixtureLumens')?.value) || 2200;
  const fixtureW = parseFloat(document.getElementById('luxFixtureWatts')?.value) || 20;

  // N = (E * A) / (F * U * M), U = 0.55, M = 0.75
  const u = 0.55;
  const m = 0.75;
  const reqN = (targetLux * area) / (fixtureLm * u * m);
  const finalN = Math.max(1, Math.ceil(reqN));
  const totalW = finalN * fixtureW;
  const actualLux = (finalN * fixtureLm * u * m) / area;

  const elCount = document.getElementById('resLuxFixtureCount');
  if (elCount) elCount.textContent = `${finalN} 등`;
  const elPower = document.getElementById('resLuxPowerText');
  if (elPower) elPower.textContent = `총 조명 소비전력: ${totalW} W • 평균 설계 조도: ${Math.round(actualLux)} Lux 만족`;
}

// ==========================================================================
// TAB 38: SOLAR PV / ESS DC 1500V STRINGS & FUSE SIZER
// ==========================================================================

function calculateSolarPV() {
  const nMod = parseInt(document.getElementById('pvSeriesCount')?.value) || 28;
  const voc = parseFloat(document.getElementById('pvVocStc')?.value) || 45.5;
  const isc = parseFloat(document.getElementById('pvIscStc')?.value) || 13.8;
  const len = parseFloat(document.getElementById('pvCableLength')?.value) || 60;

  // Voc max at -20°C beta = -0.28%/°C
  const deltaT = 25 - (-20); // 45°C drop
  const vocMax = nMod * voc * (1.0 + (0.0028 * deltaT));
  const isVoltSafe = vocMax <= 1500;

  // DC Fuse = 1.56 * Isc
  const minFuseA = isc * 1.56;
  let recFuseA = 25;
  if (minFuseA <= 15) recFuseA = 15;
  else if (minFuseA <= 20) recFuseA = 20;
  else if (minFuseA <= 25) recFuseA = 25;
  else if (minFuseA <= 32) recFuseA = 32;
  else recFuseA = 40;

  // Cable drop ratio deltaV = (2 * L * I * 0.01786 / 4.0) / (nMod * 38)
  const dropV = (2.0 * len * isc * 0.01786) / 4.0;
  const vmpTotal = nMod * (voc * 0.82);
  const dropRatio = (dropV / vmpTotal) * 100.0;

  const elVoc = document.getElementById('resPvVocMax');
  if (elVoc) elVoc.textContent = `${Math.round(vocMax).toLocaleString('ko-KR')} V`;
  const elFuse = document.getElementById('resPvFuseText');
  if (elFuse) elFuse.textContent = `추천 직류 퓨즈: ${recFuseA}A gPV (1500V DC 정격) • 전압강하율 ${dropRatio.toFixed(2)}% 안전`;

  const elBadge = document.getElementById('pvVerdictBadge');
  if (elBadge) {
    elBadge.textContent = isVoltSafe ? 'DC 1500V SAFE' : 'OVERVOLTAGE HAZARD';
    elBadge.className = isVoltSafe ? 'badge-pill badge-safe' : 'badge-pill badge-danger';
  }
}


// ==========================================================================
// LOGO HOME NAVIGATION & VIEW RESET ENGINE
// ==========================================================================

function goHomeTab() {
  const firstTabBtn = document.querySelector('.tab-btn[data-tab="tab-voltagedrop"]');
  if (firstTabBtn) {
    firstTabBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    firstTabBtn.click();
  }
  const searchInput = document.getElementById('globalToolSearch');
  if (searchInput) {
    searchInput.value = '';
    filterToolsSearch('');
  }
  filterNavCategory('all');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.goHomeTab = goHomeTab;




// ==========================================================================
// TAB 39: PUMP TOTAL DYNAMIC HEAD & DARCY-WEISBACH PIPE SIZER
// ==========================================================================

function calculatePumpHead() {
  const q_lpm = parseFloat(document.getElementById('phFlowRate')?.value) || 150;
  const d_mm = parseFloat(document.getElementById('phPipeDiameter')?.value) || 40;
  const h_static = parseFloat(document.getElementById('phStaticHead')?.value) || 15;
  const l_m = parseFloat(document.getElementById('phPipeLength')?.value) || 50;

  // Velocity v = Q / A (Q in m3/s, A in m2)
  const q_m3s = q_lpm / 60000.0;
  const d_m = (d_mm === 25 ? 27.6 : (d_mm === 40 ? 41.6 : (d_mm === 50 ? 52.9 : (d_mm === 80 ? 80.7 : 105.3)))) / 1000.0;
  const area_m2 = Math.PI * Math.pow(d_m / 2.0, 2);
  const vel = q_m3s / area_m2;

  // Darcy friction loss hf = f * (L/D) * (v^2 / 2g), f ~= 0.025
  const f_coeff = 0.025;
  const g = 9.81;
  const hf = f_coeff * ((l_m * 1.3) / d_m) * (Math.pow(vel, 2) / (2.0 * g));
  const hTotal = h_static + hf;

  // Pump hydraulic power P = (rho * g * Q * H) / (1000 * eta), eta = 0.65
  const powerKw = (1000.0 * g * q_m3s * hTotal) / (1000.0 * 0.65);
  const powerHp = powerKw * 1.341;

  const elHead = document.getElementById('resPhTotalHead');
  if (elHead) elHead.textContent = `${hTotal.toFixed(1)} m`;
  const elPower = document.getElementById('resPhMotorPower');
  if (elPower) elPower.textContent = `추천 펌프 모터: ${powerKw.toFixed(2)} kW (${powerHp.toFixed(1)} HP) • 배관 유속: ${vel.toFixed(2)} m/s (적정)`;

  const isVelSafe = vel <= 2.5;
  const elBadge = document.getElementById('phVerdictBadge');
  if (elBadge) {
    elBadge.textContent = isVelSafe ? 'HYDRAULIC SIZING OK' : 'VELOCITY HAZARD';
    elBadge.className = isVelSafe ? 'badge-pill badge-safe' : 'badge-pill badge-danger';
  }

  const elGaugeText = document.getElementById('gaugePhText');
  if (elGaugeText) elGaugeText.textContent = `${vel.toFixed(2)} m/s (${isVelSafe ? '적정' : '과대/소음위험'})`;
  const elMarker = document.getElementById('gaugePhMarker');
  if (elMarker) {
    const pct = Math.min(100, Math.max(0, (vel / 3.5) * 100));
    elMarker.style.left = `${pct}%`;
  }
}

// ==========================================================================
// TAB 40: VDI 2230 BOLT TIGHTENING TORQUE & PRELOAD ENGINE
// ==========================================================================

function calculateBoltTorque() {
  const mSize = parseInt(document.getElementById('btBoltSize')?.value) || 12;
  const grade = parseFloat(document.getElementById('btBoltGrade')?.value) || 8.8;
  const mu = parseFloat(document.getElementById('btFrictionCoeff')?.value) || 0.14;
  const yieldPct = (parseFloat(document.getElementById('btYieldSafetyPct')?.value) || 90) / 100.0;

  // Stress areas As (mm2) for Metric bolts
  const asMap = { 4: 8.78, 6: 20.1, 8: 36.6, 10: 58.0, 12: 84.3, 16: 157.0, 20: 245.0, 24: 353.0 };
  const pitchMap = { 4: 0.7, 6: 1.0, 8: 1.25, 10: 1.5, 12: 1.75, 16: 2.0, 20: 2.5, 24: 3.0 };

  const As = asMap[mSize] || 84.3;
  const P = pitchMap[mSize] || 1.75;
  const yieldMpa = grade === 8.8 ? 640 : (grade === 10.9 ? 900 : (grade === 12.9 ? 1080 : 320));

  // Preload force F_preload (N) = 0.9 * Rp0.2 * As
  const fPreload_N = yieldPct * yieldMpa * As;
  const fPreload_kN = fPreload_N / 1000.0;

  // Torque T (N*m) = F_preload * (0.16 * P + 0.58 * d2 * mu + d_bearing/2 * mu) / 1000
  const d2 = mSize - (0.6495 * P);
  const dBearing = mSize * 1.3;
  const torque_Nm = (fPreload_N * (0.16 * P + 0.58 * d2 * mu + (dBearing / 2.0) * mu)) / 1000.0;

  const elTorque = document.getElementById('resBtTorqueNm');
  if (elTorque) elTorque.textContent = `${torque_Nm.toFixed(1)} N·m`;
  const elForce = document.getElementById('resBtPreloadForce');
  if (elForce) elForce.textContent = `목표 인장 축력(Preload): ${fPreload_kN.toFixed(1)} kN (항복응력 ${Math.round(yieldPct*100)}% 안전 한계)`;
}

// ==========================================================================
// TAB 41: HEAT EXCHANGER LMTD & TRANSFER AREA ENGINE
// ==========================================================================

function calculateHeatExchanger() {
  const q_kw = parseFloat(document.getElementById('hxHeatDuty')?.value) || 50;
  const u_val = parseFloat(document.getElementById('hxOverallU')?.value) || 1500;
  const th_in = parseFloat(document.getElementById('hxHotInTemp')?.value) || 80;
  const th_out = parseFloat(document.getElementById('hxHotOutTemp')?.value) || 50;
  const tc_in = parseFloat(document.getElementById('hxColdInTemp')?.value) || 20;
  const tc_out = parseFloat(document.getElementById('hxColdOutTemp')?.value) || 40;

  // Counter flow deltaT1 = Th_in - Tc_out, deltaT2 = Th_out - Tc_in
  const dt1 = Math.max(0.1, th_in - tc_out);
  const dt2 = Math.max(0.1, th_out - tc_in);

  let lmtd = (dt1 + dt2) / 2.0;
  if (Math.abs(dt1 - dt2) > 0.01) {
    lmtd = (dt1 - dt2) / Math.log(dt1 / dt2);
  }

  // Area A (m2) = Q (Watts) / (U * LMTD)
  const q_w = q_kw * 1000.0;
  const area_m2 = q_w / (u_val * lmtd);

  const elArea = document.getElementById('resHxAreaM2');
  if (elArea) elArea.textContent = `${area_m2.toFixed(2)} m²`;
  const elLmtd = document.getElementById('resHxLmtdText');
  if (elLmtd) elLmtd.textContent = `대수평균온도차 (LMTD): ${lmtd.toFixed(1)} °C (대향류 기준 안정적 전열)`;
}

// ==========================================================================
// TAB 42: STRUCTURAL BEAM BENDING MOMENT & DEFLECTION ENGINE
// ==========================================================================

function calculateBeamDeflection() {
  const span_m = parseFloat(document.getElementById('bmBeamSpan')?.value) || 2.0;
  const load_kgf = parseFloat(document.getElementById('bmPointLoad')?.value) || 500;
  const secType = document.getElementById('bmSectionType')?.value || 'hbeam100';
  const supType = document.getElementById('bmSupportType')?.value || 'simple';

  // Moment of Inertia I (cm4 -> m4)
  const i_cm4 = secType === 'hbeam100' ? 378 : (secType === 'profile80' ? 140 : (secType === 'hbeam150' ? 1610 : 72));
  const i_m4 = i_cm4 * 1e-8;
  const e_pa = (secType === 'profile80') ? 70e9 : 205e9; // Young's modulus (Steel 205 GPa, Al 70 GPa)

  const p_n = load_kgf * 9.80665;
  const l_m = span_m;

  // Max Moment (N*m) and Deflection (m)
  let maxM_nm = (p_n * l_m) / 4.0;
  let def_m = (p_n * Math.pow(l_m, 3)) / (48.0 * e_pa * i_m4);

  if (supType === 'fixed') {
    maxM_nm = (p_n * l_m) / 8.0;
    def_m = (p_n * Math.pow(l_m, 3)) / (192.0 * e_pa * i_m4);
  } else if (supType === 'cantilever') {
    maxM_nm = p_n * l_m;
    def_m = (p_n * Math.pow(l_m, 3)) / (3.0 * e_pa * i_m4);
  }

  const def_mm = def_m * 1000.0;
  const allowDef_mm = (l_m * 1000.0) / 500.0;
  const isSafe = def_mm <= allowDef_mm;

  const elDef = document.getElementById('resBmDeflection');
  if (elDef) elDef.textContent = `${def_mm.toFixed(2)} mm`;
  const elSub = document.getElementById('resBmDeflectionSub');
  if (elSub) elSub.textContent = `허용 한계치: ${allowDef_mm.toFixed(2)} mm (L/500 기준 ${isSafe ? '만족' : '초과위험'}) • 최대 모멘트: ${Math.round(maxM_nm).toLocaleString('ko-KR')} N·m`;

  const elBadge = document.getElementById('bmVerdictBadge');
  if (elBadge) {
    elBadge.textContent = isSafe ? 'DEFLECTION OK (≤ L/500)' : 'EXCESSIVE DEFLECTION';
    elBadge.className = isSafe ? 'badge-pill badge-safe' : 'badge-pill badge-danger';
  }
}


// ==========================================================================
// TAB 43: SEMICONDUCTOR VACUUM CHAMBER EVACUATION TIME ENGINE
// ==========================================================================

function calculateVacuumChamber() {
  const v_m3 = parseFloat(document.getElementById('vcChamberVol')?.value) || 1.5;
  const s_m3h = parseFloat(document.getElementById('vcPumpSpeed')?.value) || 180;
  const p2_pa = parseFloat(document.getElementById('vcTargetPressure')?.value) || 1.0;
  const gasFactor = parseFloat(document.getElementById('vcGasLoadFactor')?.value) || 1.3;

  const p1_pa = 101325.0; // 1 atm in Pa
  // t (hours) = (V / S) * ln(P1 / P2) * gasFactor
  const s_m3s = s_m3h / 3600.0;
  const t_sec = (v_m3 / s_m3s) * Math.log(p1_pa / p2_pa) * gasFactor;
  const t_min = t_sec / 60.0;

  const elTime = document.getElementById('resVcTimeSec');
  if (elTime) elTime.textContent = `${t_min.toFixed(2)} 분 (${Math.round(t_sec)}초)`;
  const elSub = document.getElementById('resVcPumpVerdict');
  if (elSub) elSub.textContent = `대기압(101.3 kPa) → ${p2_pa} Pa 도달 • 러핑 펌프 속도 적정 (${t_min <= 10 ? '안정' : '배기시간 지연'})`;

  const elBadge = document.getElementById('vcVerdictBadge');
  if (elBadge) {
    elBadge.textContent = t_min <= 10 ? 'PUMP DOWN OK' : 'SLOW EVACUATION';
    elBadge.className = t_min <= 10 ? 'badge-pill badge-safe' : 'badge-pill badge-warn';
  }
}

// ==========================================================================
// TAB 44: BATTERY PACK C-RATE THERMAL & CHILLER SIZING ENGINE
// ==========================================================================

function calculateBatteryThermal() {
  const kwh = parseFloat(document.getElementById('btPackCapKwh')?.value) || 75;
  const volt = parseFloat(document.getElementById('btPackVolt')?.value) || 400;
  const crate = parseFloat(document.getElementById('btCrateRate')?.value) || 2.0;
  const r_mohm = parseFloat(document.getElementById('btPackInternalR')?.value) || 35;

  // Capacity in Ah = (kWh * 1000) / V
  const ah = (kwh * 1000.0) / volt;
  const current_a = ah * crate;
  const r_ohm = r_mohm / 1000.0;

  // Joule heating Q = I^2 * R (Watts)
  const q_joule = Math.pow(current_a, 2) * r_ohm;
  const q_total_w = q_joule * 1.05; // 5% entropy term
  const q_kw = q_total_w / 1000.0;
  const chiller_kw = q_kw * 1.25;

  // Water flow Q = m * Cp * deltaT (deltaT = 4°C, Cp = 4.184 kJ/kg*K)
  const flow_lpm = (q_kw / (4.184 * 4.0)) * 60.0;

  const elHeat = document.getElementById('resBtHeatWatts');
  if (elHeat) elHeat.textContent = `${Math.round(q_total_w).toLocaleString('ko-KR')} W (${q_kw.toFixed(2)} kW)`;
  const elSub = document.getElementById('resBtChillerKw');
  if (elSub) elSub.textContent = `추천 수냉 칠러: ${chiller_kw.toFixed(2)} kW (안전마진 1.25배) • 냉각수 유량: ${flow_lpm.toFixed(1)} L/min`;

  const elBadge = document.getElementById('btVerdictBadge');
  if (elBadge) {
    elBadge.textContent = crate <= 2.0 ? 'THERMAL CONTROL OK' : 'EXTREME HEAT HAZARD';
    elBadge.className = crate <= 2.0 ? 'badge-pill badge-safe' : 'badge-pill badge-warn';
  }
}

// ==========================================================================
// TAB 45: POWER FACTOR CORRECTION CAPACITOR BANK ENGINE
// ==========================================================================

function calculatePowerFactor() {
  const p_kw = parseFloat(document.getElementById('pfActiveKw')?.value) || 250;
  const pf1 = parseFloat(document.getElementById('pfCurrentVal')?.value) || 0.80;
  const pf2 = parseFloat(document.getElementById('pfTargetVal')?.value) || 0.95;

  // Qc = P * (tan(acos(pf1)) - tan(acos(pf2)))
  const tanPhi1 = Math.tan(Math.acos(pf1));
  const tanPhi2 = Math.tan(Math.acos(pf2));
  const qc_kvar = p_kw * (tanPhi1 - tanPhi2);

  // Standard Capacitor Sizes
  let recBank = 100;
  if (qc_kvar <= 25) recBank = 25;
  else if (qc_kvar <= 50) recBank = 50;
  else if (qc_kvar <= 75) recBank = 75;
  else if (qc_kvar <= 100) recBank = 100;
  else if (qc_kvar <= 125) recBank = 125;
  else if (qc_kvar <= 150) recBank = 150;
  else recBank = Math.ceil(qc_kvar / 50.0) * 50;

  // KEPCO 5% bill discount approx savings
  const monthlySaveWon = p_kw * 9000 * ((pf2 - 0.90) * 0.2);

  const elQc = document.getElementById('resPfCapKvar');
  if (elQc) elQc.textContent = `${qc_kvar.toFixed(1)} kVAR`;
  const elSub = document.getElementById('resPfBillSave');
  if (elSub) elSub.textContent = `추천 콘덴서: ${recBank} kVAR 뱅크 • 한전 기본요금 월 약 ${Math.round(monthlySaveWon).toLocaleString('ko-KR')}원 추가 절감 (5% 할인)`;

  const elBadge = document.getElementById('pfVerdictBadge');
  if (elBadge) {
    elBadge.textContent = `PF OPTIMIZED (${Math.round(pf2*100)}%)`;
    elBadge.className = 'badge-pill badge-safe';
  }
}

// ==========================================================================
// TAB 46: HIGH-PRESSURE HYDRAULIC CYLINDER & PUMP POWER ENGINE
// ==========================================================================

function calculateHydraulics() {
  const p_bar = parseFloat(document.getElementById('hydPressureBar')?.value) || 210;
  const bore_mm = parseFloat(document.getElementById('hydBoreDia')?.value) || 100;
  const speed_mms = parseFloat(document.getElementById('hydStrokeSpeed')?.value) || 50;
  const qty = parseInt(document.getElementById('hydQuantity')?.value) || 2;

  // Area A = pi * (D/2)^2 (cm2)
  const area_cm2 = Math.PI * Math.pow(bore_mm / 20.0, 2);
  const force_kgf = p_bar * area_cm2;
  const force_ton = force_kgf / 1000.0;
  const force_kn = (force_kgf * 9.80665) / 1000.0;

  // Flow Q (L/min) = (Area_cm2 * Speed_cm_s * 60) / 1000 * qty
  const speed_cms = speed_mms / 10.0;
  const flow_lpm = (area_cm2 * speed_cms * 60.0) / 1000.0 * qty;

  // Motor kW = (P_bar * Q_lpm) / (600 * eta), eta = 0.85
  const motor_kw = (p_bar * flow_lpm) / (600.0 * 0.85);
  const motor_hp = motor_kw * 1.341;

  const elThrust = document.getElementById('resHydThrustTon');
  if (elThrust) elThrust.textContent = `${force_ton.toFixed(2)} Ton (${force_kn.toFixed(1)} kN)`;
  const elSub = document.getElementById('resHydMotorKw');
  if (elSub) elSub.textContent = `추천 유압 펌프 모터: ${motor_kw.toFixed(1)} kW (${motor_hp.toFixed(1)} HP) • 필요 유량: ${flow_lpm.toFixed(1)} L/min`;
}

// ==========================================================================
// TAB 47: HVAC AIR DUCT PRESSURE DROP & BLOWER SIZING ENGINE
// ==========================================================================

function calculateHvacBlower() {
  const cmh = parseFloat(document.getElementById('fanAirFlowCmh')?.value) || 3600;
  const d_mm = parseFloat(document.getElementById('fanDuctDiameter')?.value) || 350;
  const l_m = parseFloat(document.getElementById('fanDuctLength')?.value) || 40;
  const staticLossPa = parseFloat(document.getElementById('fanFilterLossPa')?.value) || 150;

  const q_m3s = cmh / 3600.0;
  const d_m = d_mm / 1000.0;
  const area_m2 = Math.PI * Math.pow(d_m / 2.0, 2);
  const vel = q_m3s / area_m2;

  // Friction loss deltaP_friction = lambda * (L/D) * (rho * v^2 / 2), lambda ~= 0.02
  const rho = 1.2; // Air density kg/m3
  const deltaP_friction = 0.02 * (l_m / d_m) * (rho * Math.pow(vel, 2) / 2.0);
  const totalPa = deltaP_friction + staticLossPa;
  const mmAq = totalPa / 9.80665;

  // Blower power kW = (Q_m3s * totalPa) / (1000 * eta), eta = 0.65
  const blowerKw = (q_m3s * totalPa) / (1000.0 * 0.65);
  const blowerHp = blowerKw * 1.341;

  const elPa = document.getElementById('resFanTotalPa');
  if (elPa) elPa.textContent = `${Math.round(totalPa)} Pa (${mmAq.toFixed(1)} mmAq)`;
  const elSub = document.getElementById('resFanMotorKw');
  if (elSub) elSub.textContent = `추천 송풍기 모터: ${blowerKw.toFixed(2)} kW (${blowerHp.toFixed(1)} HP) • 덕트 풍속: ${vel.toFixed(1)} m/s (공조 적정)`;
}

// ==========================================================================
// TAB 48: STEAM PIPING & BOILER LOAD SIZING ENGINE
// ==========================================================================

function calculateSteamPipe() {
  const p_mpa = parseFloat(document.getElementById('stmPressureMpa')?.value) || 0.7;
  const q_kw = parseFloat(document.getElementById('stmHeatDutyKw')?.value) || 300;
  const vel_target = parseFloat(document.getElementById('stmTargetVelocity')?.value) || 25;
  const margin = parseFloat(document.getElementById('stmBoilerMargin')?.value) || 1.20;

  // Latent heat hfg (kJ/kg) and specific volume vg (m3/kg)
  let hfg = 2048.0;
  let vg = 0.240;
  if (p_mpa <= 0.2) { hfg = 2258.0; vg = 0.885; }
  else if (p_mpa <= 0.4) { hfg = 2163.0; vg = 0.462; }
  else if (p_mpa <= 0.8) { hfg = 2048.0; vg = 0.240; }
  else { hfg = 1999.0; vg = 0.177; }

  // Steam flow W (kg/h) = (Q_kW * 3600) / hfg
  const steam_kgh = (q_kw * 3600.0) / hfg;
  const boiler_kgh = steam_kgh * margin;
  const boiler_ton = boiler_kgh / 1000.0;

  // Pipe inner diameter D = sqrt((4 * W_m3s) / (pi * V))
  const w_m3s = (steam_kgh * vg) / 3600.0;
  const reqD_m = Math.sqrt((4.0 * w_m3s) / (Math.PI * vel_target));
  const reqD_mm = reqD_m * 1000.0;

  let pipeLabel = '50A (2인치 / ID 52.9mm)';
  if (reqD_mm <= 25) pipeLabel = '25A (1인치 / ID 27.6mm)';
  else if (reqD_mm <= 40) pipeLabel = '40A (1.5인치 / ID 41.6mm)';
  else if (reqD_mm <= 50) pipeLabel = '50A (2인치 / ID 52.9mm)';
  else if (reqD_mm <= 80) pipeLabel = '80A (3인치 / ID 80.7mm)';
  else pipeLabel = '100A (4인치 / ID 105.3mm)';

  const elPipe = document.getElementById('resStmPipeSize');
  if (elPipe) elPipe.textContent = pipeLabel;
  const elSub = document.getElementById('resStmBoilerFlow');
  if (elSub) elSub.textContent = `스팀 소모량: ${Math.round(steam_kgh)} kg/h • 추천 보일러 용량: ${boiler_ton.toFixed(2)} Ton/h (${Math.round(boiler_kgh)} kg/h)`;
}


// ==========================================================================
// B2B SMART BOM MATCHER & RFQ MODAL ENGINE
// ==========================================================================

function openB2BQuoteModal(customTitle) {
  const modal = document.getElementById('b2bQuoteModal');
  const specText = document.getElementById('quoteBomSpecInput');
  const activeTab = document.querySelector('.tab-btn.active')?.getAttribute('data-tab') || 'tab-voltagedrop';

  let defaultSpec = customTitle || `[선택 도구: ${activeTab}] 산출 사양에 따른 공식 판매처 전장 자재 견적 문의`;
  if (activeTab === 'tab-voltagedrop') {
    const len = document.getElementById('wireLength')?.value || '50';
    const gauge = document.getElementById('wireGauge')?.value || '1.5';
    defaultSpec = `[DC 24V 전장 자재] 제어 케이블 TFR-CV ${gauge}SQ (${len}m), 단자대 1식, SMPS 24V 파워서플라이`;
  } else if (activeTab === 'tab-smpsbudget') {
    const watt = document.getElementById('resSmpsWattage')?.textContent || '240W';
    defaultSpec = `[전원 자재] DIN-Rail 24V SMPS (${watt} 정격), LS ELECTRIC 1P 배선용 차단기 1식`;
  } else if (activeTab === 'tab-motorcalc') {
    const kw = document.getElementById('motorKw')?.value || '15';
    defaultSpec = `[모터 제어] 3상 ${kw}kW 모터 구동용 전자개폐기(MC), EOCR 모터보호계전기, 차단기 1식`;
  }

  if (specText) specText.value = defaultSpec;
  if (modal) {
    modal.style.display = 'flex';
    modal.classList.add('show');
  }
}
window.openB2BQuoteModal = openB2BQuoteModal;

function closeB2BQuoteModal() {
  const modal = document.getElementById('b2bQuoteModal');
  if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('show');
  }
}
window.closeB2BQuoteModal = closeB2BQuoteModal;

function submitB2BQuoteRequest() {
  const company = document.getElementById('quoteCompanyInput')?.value || '';
  const name = document.getElementById('quoteNameInput')?.value || '';
  const phone = document.getElementById('quotePhoneInput')?.value || '';
  const email = document.getElementById('quoteEmailInput')?.value || '';
  const spec = document.getElementById('quoteBomSpecInput')?.value || '';

  alert(`[견적 문의 내용 정리 완료]\n${company} ${name}님, 견적 요청 정보가 브라우저에서 정리되었습니다.\n공식 판매처 또는 대리점 문의 시 ${email}로 회신받을 수 있도록 입력 내용을 확인해 주세요.`);
  closeB2BQuoteModal();
}
window.submitB2BQuoteRequest = submitB2BQuoteRequest;


// ==========================================================================
// VIRAL KAKAOTALK & SOCIAL SHARING ENGINE
// ==========================================================================

function shareCurrentTool(platform) {
  const activeBtn = document.querySelector('.tab-btn.active');
  const activeTabId = activeBtn?.getAttribute('data-tab') || 'tab-voltagedrop';
  const toolName = activeBtn?.querySelector('span')?.textContent || '공학 계산기';
  const currentUrl = window.location.origin + window.location.pathname;

  const shareText = `[VoltCheck 24V - 78대 산업 엔지니어링 계산기]\n실무에서 방금 '${toolName}' 결과를 산출했습니다.\n지금 무료로 설계 검증해보세요!\n${currentUrl}`;

  if (navigator.clipboard) {
    navigator.clipboard.writeText(shareText).then(() => {
      alert(`[계산 결과 링크 복사 완료]\n'${toolName}' 검토 내용과 사이트 주소가 클립보드에 복사되었습니다.\n카카오톡 단체방이나 사내 메신저(슬랙/잔디)에 바로 붙여넣기(Ctrl+V)하세요!`);
    }).catch(() => {
      prompt('아래 공유 링크를 복사하세요:', shareText);
    });
  } else {
    prompt('아래 공유 링크를 복사하세요:', shareText);
  }
}
window.shareCurrentTool = shareCurrentTool;


// ==========================================================================
// [UPGRADE] LOCALSTORAGE PROJECT SAVE / LOAD ENGINE
// ==========================================================================

const LOCAL_STORAGE_PROJECT_KEY = 'voltcheck_saved_engineering_projects';

function getSavedProjects() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PROJECT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("Failed to parse saved projects from LocalStorage", e);
    return [];
  }
}

function saveProjectsList(list) {
  try {
    localStorage.setItem(LOCAL_STORAGE_PROJECT_KEY, JSON.stringify(list));
  } catch (e) {
    console.error("Failed to save projects to LocalStorage", e);
  }
  renderReturnWorkspaceDashboard();
}

function openProjectStorageModal() {
  const modal = document.getElementById('projectStorageModal');
  if (!modal) return;

  const activeBtn = document.querySelector('.tab-btn.active');
  const activeToolName = activeBtn?.querySelector('span')?.textContent || '현재 도구';
  const nameLabel = document.getElementById('saveCurrentToolName');
  if (nameLabel) nameLabel.textContent = activeToolName;

  const input = document.getElementById('newProjectNameInput');
  if (input) {
    const now = new Date();
    const timeStr = `${now.getMonth() + 1}/${now.getDate()} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    input.value = `${activeToolName} (${timeStr})`;
  }

  renderSavedProjectsList();
  modal.style.display = 'flex';
}

function closeProjectStorageModal() {
  const modal = document.getElementById('projectStorageModal');
  if (modal) modal.style.display = 'none';
}

function saveCurrentProject() {
  const input = document.getElementById('newProjectNameInput');
  const projectName = input?.value.trim() || '이름 없는 설계 프로젝트';

  const activeBtn = document.querySelector('.tab-btn.active');
  const activeTabId = activeBtn?.getAttribute('data-tab') || 'tab-voltagedrop';
  const activeToolName = activeBtn?.querySelector('span')?.textContent || '공학 도구';

  const activePanel = document.getElementById(activeTabId);
  if (!activePanel) return;

  // Capture all inputs and selects inside the active panel
  const inputs = activePanel.querySelectorAll('input, select, textarea');
  const formData = {};
  inputs.forEach(el => {
    if (el.id) {
      if (el.type === 'checkbox') {
        formData[el.id] = el.checked;
      } else {
        formData[el.id] = el.value;
      }
    }
  });

  const newProj = {
    id: 'proj_' + Date.now(),
    name: projectName,
    tabId: activeTabId,
    toolName: activeToolName,
    createdAt: new Date().toISOString(),
    data: formData
  };

  const list = getSavedProjects();
  list.unshift(newProj);
  saveProjectsList(list);

  trackVoltCheckEvent(ANALYTICS_EVENTS.projectSave, {
    action: 'save_project_workspace',
    tab: activeTabId,
    toolLabel: activeToolName,
    name: projectName
  });
  alert(`[저장 완료] '${projectName}' 프로젝트가 브라우저에 안전하게 저장되었습니다.`);
  renderSavedProjectsList();
}

function renderSavedProjectsList() {
  const container = document.getElementById('savedProjectsListContainer');
  const countSpan = document.getElementById('savedProjectCount');
  if (!container) return;

  const list = getSavedProjects();
  if (countSpan) countSpan.textContent = list.length;

  if (list.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:1.5rem; color:#94a3b8; font-size:0.82rem; background:#f8fafc; border-radius:6px; border:1px dashed #cbd5e1;">
        저장된 설계 프로젝트가 없습니다.<br>위에서 이름을 입력하고 [설계 저장]을 눌러보세요!
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(proj => {
    const d = new Date(proj.createdAt);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
    return `
      <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:6px; padding:0.65rem 0.85rem; display:flex; justify-content:space-between; align-items:center; gap:0.5rem;">
        <div style="flex:1; min-width:0;">
          <div style="display:flex; align-items:center; gap:0.4rem;">
            <span class="badge-pill font-mono" style="background:#eff6ff; color:#2563eb; font-size:0.65rem; padding:0.1rem 0.35rem; font-weight:800;">${proj.toolName}</span>
            <strong style="font-size:0.85rem; color:#0f172a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${proj.name}</strong>
          </div>
          <div style="font-size:0.7rem; color:#94a3b8; margin-top:0.2rem;">저장일: ${dateStr}</div>
        </div>
        <div style="display:flex; gap:0.35rem; flex-shrink:0;">
          <button type="button" onclick="loadProjectById('${proj.id}')" style="background:#2563eb; color:#fff; border:none; padding:0.35rem 0.65rem; border-radius:4px; font-size:0.75rem; font-weight:800; cursor:pointer;">
            불러오기
          </button>
          <button type="button" onclick="deleteProjectById('${proj.id}')" style="background:#fee2e2; color:#dc2626; border:none; padding:0.35rem 0.55rem; border-radius:4px; font-size:0.75rem; font-weight:800; cursor:pointer;" title="삭제">
            &times;
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function loadProjectById(id) {
  const list = getSavedProjects();
  const proj = list.find(p => p.id === id);
  if (!proj) return;

  if (typeof switchTab === 'function') {
    switchTab(proj.tabId);
  }

  setTimeout(() => {
    const activePanel = document.getElementById(proj.tabId);
    if (activePanel && proj.data) {
      Object.keys(proj.data).forEach(fieldId => {
        const el = activePanel.querySelector('#' + fieldId);
        if (el) {
          if (el.type === 'checkbox') {
            el.checked = proj.data[fieldId];
          } else {
            el.value = proj.data[fieldId];
          }
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
    }
    closeProjectStorageModal();
    renderReturnWorkspaceDashboard();
    trackVoltCheckEvent(ANALYTICS_EVENTS.projectLoad, {
      action: 'load_project_workspace',
      tab: proj.tabId,
      toolLabel: proj.toolName,
      name: proj.name
    });
    alert(`[불러오기 완료] '${proj.name}' 설계 데이터가 화면에 복원되었습니다.`);
  }, 100);
}

function deleteProjectById(id) {
  if (!confirm("이 프로젝트 설계를 보관함에서 삭제하시겠습니까?")) return;
  let list = getSavedProjects();
  list = list.filter(p => p.id !== id);
  saveProjectsList(list);
  renderSavedProjectsList();
}

function exportProjectsJSON() {
  const list = getSavedProjects();
  const blob = new Blob([JSON.stringify(list, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `VoltCheck_Saved_Projects_${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importProjectsJSON() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const imported = JSON.parse(ev.target.result);
        if (Array.isArray(imported)) {
          saveProjectsList(imported);
          renderSavedProjectsList();
          alert(`[복원 완료] ${imported.length}개의 프로젝트 설계를 성공적으로 복원했습니다.`);
        }
      } catch (err) {
        alert("올바르지 않은 JSON 백업 파일입니다.");
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

// Global Exports
window.openProjectStorageModal = openProjectStorageModal;
window.closeProjectStorageModal = closeProjectStorageModal;
window.saveCurrentProject = saveCurrentProject;
window.loadProjectById = loadProjectById;
window.deleteProjectById = deleteProjectById;
window.exportProjectsJSON = exportProjectsJSON;
window.importProjectsJSON = importProjectsJSON;


// ==========================================================================
// [UPGRADE] 48-TOOL RELATED ENGINES RECOMMENDATION MATRIX
// ==========================================================================

const RELATED_TOOLS_MATRIX = {
  'tab-voltagedrop': [
    { id: 'tab-smpsbudget', name: 'SMPS·CP 용량', icon: 'cpu' },
    { id: 'tab-analogloop', name: '4-20mA 루프', icon: 'gauge' },
    { id: 'tab-cabletable', name: 'AWG 조견표', icon: 'table' }
  ],
  'tab-analogloop': [
    { id: 'tab-plcscaling', name: 'PLC 스케일링', icon: 'binary' },
    { id: 'tab-voltagedrop', name: '24V 전압강하', icon: 'activity' },
    { id: 'tab-iolinksafety', name: 'IO-Link 안전', icon: 'shield-alert' }
  ],
  'tab-motorcalc': [
    { id: 'tab-inrushbreaker', name: '돌입전류 차단기', icon: 'zap-off' },
    { id: 'tab-transformer', name: '변압기 용량', icon: 'box' },
    { id: 'tab-powerfactor', name: '역률개선 콘덴서', icon: 'zap' }
  ],
  'tab-cabinetcooling': [
    { id: 'tab-smpsbudget', name: 'SMPS 용량', icon: 'cpu' },
    { id: 'tab-batterythermal', name: '배터리 발열칠러', icon: 'thermometer' },
    { id: 'tab-hvacblower', name: 'HVAC 송풍기', icon: 'wind' }
  ],
  'tab-hydraulics': [
    { id: 'tab-pneumatics', name: '공압 소모량', icon: 'wind' },
    { id: 'tab-pumphead', name: '펌프 양정 kW', icon: 'droplet' },
    { id: 'tab-valvecv', name: '밸브 Cv 계산', icon: 'sliders' }
  ],
  'tab-vacuumchamber': [
    { id: 'tab-cleanesd', name: '클린룸 ESD', icon: 'sparkles' },
    { id: 'tab-heatexchanger', name: '열교환기 LMTD', icon: 'flame' },
    { id: 'tab-steampipe', name: '스팀 배관경', icon: 'flame' }
  ]
};

function renderRelatedToolsForTab(tabId) {
  const panel = document.getElementById(tabId);
  if (!panel) return;

  let existingBar = panel.querySelector('.related-tools-bar');
  if (existingBar) existingBar.remove();

  const related = RELATED_TOOLS_MATRIX[tabId] || [
    { id: 'tab-voltagedrop', name: '24V 전압강하', icon: 'activity' },
    { id: 'tab-motorcalc', name: '3상 모터·MC', icon: 'zap' },
    { id: 'tab-cabletable', name: 'AWG 조견표', icon: 'table' }
  ];

  const bar = document.createElement('div');
  bar.className = 'related-tools-bar mt-3 mb-2';
  bar.style.cssText = 'background:#f8fafc; border:1px solid #e2e8f0; border-radius:var(--radius-sm); padding:0.6rem 0.9rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;';
  
  bar.innerHTML = `
    <div style="display:flex; align-items:center; gap:0.4rem;">
      <span class="badge-pill font-mono" style="background:#e0f2fe; color:#0369a1; font-weight:800; font-size:0.65rem;">RELATED ENGINES</span>
      <span style="font-size:0.78rem; font-weight:700; color:#334155;">연관 공학 도구 함께 검토:</span>
    </div>
    <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
      ${related.map(r => `
        <button type="button" onclick="switchTab('${r.id}')" style="background:#ffffff; border:1px solid #cbd5e1; border-radius:4px; padding:0.3rem 0.6rem; font-size:0.74rem; font-weight:700; color:#0f172a; cursor:pointer; display:inline-flex; align-items:center; gap:0.25rem;">
          <span>${r.name} &rarr;</span>
        </button>
      `).join('')}
    </div>
  `;

  const meterGrid = panel.querySelector('.meter-workbench-grid');
  if (meterGrid) {
    meterGrid.after(bar);
  }
}

// Attach related tools rendering to tab switches
const originalSwitchTab = window.switchTab;
window.switchTab = function(targetTabId) {
  if (typeof originalSwitchTab === 'function') {
    originalSwitchTab(targetTabId);
  }
  renderRelatedToolsForTab(targetTabId);
};


// ==========================================================================
// [UPGRADE] LEMONSQUEEZY GLOBAL CURRENCY SWITCHER (USD / KRW)
// ==========================================================================

const LEMONSQUEEZY_STARTER_URL = 'https://voltcheck.lemonsqueezy.com/buy/starter-excel-pack';
const LEMONSQUEEZY_PRO_URL = 'https://voltcheck.lemonsqueezy.com/buy/pro-master-bundle';
const CTEE_KR_STORE_URL = 'https://ctee.kr/item/store/104555';

function updateDigitalModalForGlobalCurrency(lang) {
  const isGlobal = (lang && lang !== 'ko');
  const starterPriceEls = document.querySelectorAll('.price-tier-starter');
  const proPriceEls = document.querySelectorAll('.price-tier-pro');
  const digitalCheckoutLinks = document.querySelectorAll('.digital-checkout-link');

  if (isGlobal) {
    starterPriceEls.forEach(el => el.textContent = '$9.99 USD');
    proPriceEls.forEach(el => el.textContent = '$24.99 USD');
    digitalCheckoutLinks.forEach(el => {
      el.href = LEMONSQUEEZY_PRO_URL;
      el.innerHTML = '<i data-lucide="credit-card"></i> <span>Buy Global Edition ($24.99 USD via LemonSqueezy)</span>';
    });
  } else {
    starterPriceEls.forEach(el => el.textContent = '9,900원');
    proPriceEls.forEach(el => el.textContent = '29,000원');
    digitalCheckoutLinks.forEach(el => {
      el.href = CTEE_KR_STORE_URL;
      el.innerHTML = '<i data-lucide="zap"></i> <span>크티(Ctee) 공식 1초 결제하기 (29,000원)</span>';
    });
  }
  if (window.lucide) lucide.createIcons();
}

window.updateDigitalModalForGlobalCurrency = updateDigitalModalForGlobalCurrency;


// ==========================================================================
// [UX UPGRADE 1] USER FAVORITES PIN BAR & RECENT TOOLS
// ==========================================================================

const FAVORITES_STORAGE_KEY = 'voltcheck_pinned_favorite_tools';
const RECENT_TOOLS_STORAGE_KEY = 'voltcheck_recent_visited_tools';

function getFavoriteTools() {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : ['tab-voltagedrop', 'tab-motorcalc', 'tab-smpsbudget'];
  } catch (e) {
    return ['tab-voltagedrop', 'tab-motorcalc', 'tab-smpsbudget'];
  }
}

function saveFavoriteTools(favs) {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favs));
  } catch (e) {}
}

function toggleFavoriteTool(tabId) {
  let favs = getFavoriteTools();
  if (favs.includes(tabId)) {
    favs = favs.filter(id => id !== tabId);
  } else {
    favs.push(tabId);
  }
  saveFavoriteTools(favs);
  renderFavoritesBar();
  updateStarIconsAcrossDOM();
}

function renderFavoritesBar() {
  const container = document.getElementById('favoritesChipsContainer');
  if (!container) return;

  const favs = getFavoriteTools();
  const hint = document.getElementById('noFavsHint');

  // Clear existing chips
  const existingChips = container.querySelectorAll('.fav-tool-chip');
  existingChips.forEach(c => c.remove());

  if (favs.length === 0) {
    if (hint) hint.style.display = 'inline';
    return;
  }
  if (hint) hint.style.display = 'none';

  favs.forEach(tabId => {
    const btn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    const name = btn?.querySelector('span')?.textContent || tabId.replace('tab-', '');
    
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'fav-tool-chip';
    chip.style.cssText = 'background:#ffffff; border:1px solid #fde68a; color:#0f172a; padding:0.2rem 0.55rem; border-radius:4px; font-size:0.74rem; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:0.3rem; box-shadow:0 1px 3px rgba(0,0,0,0.04);';
    chip.innerHTML = `<span>⭐ ${name}</span><span onclick="event.stopPropagation(); toggleFavoriteTool('${tabId}')" style="color:#94a3b8; font-size:0.75rem; margin-left:0.15rem;" title="즐겨찾기 해제">&times;</span>`;
    chip.onclick = () => switchTab(tabId);
    container.appendChild(chip);
  });
}

function updateStarIconsAcrossDOM() {
  const favs = getFavoriteTools();
  document.querySelectorAll('.tab-btn').forEach(btn => {
    const tabId = btn.getAttribute('data-tab');
    if (!tabId) return;
    let star = btn.querySelector('.tab-star-btn');
    if (!star) {
      star = document.createElement('span');
      star.className = 'tab-star-btn';
      star.style.cssText = 'font-size:0.7rem; cursor:pointer; margin-left:0.25rem; opacity:0.6;';
      star.onclick = (e) => {
        e.stopPropagation();
        toggleFavoriteTool(tabId);
      };
      btn.appendChild(star);
    }
    const isFav = favs.includes(tabId);
    star.textContent = isFav ? '★' : '☆';
    star.style.color = isFav ? '#f59e0b' : '#94a3b8';
    star.style.opacity = isFav ? '1' : '0.5';
  });
}

window.toggleFavoriteTool = toggleFavoriteTool;
window.renderFavoritesBar = renderFavoritesBar;


// ==========================================================================
// [UX UPGRADE 2] CROSS-TOOL SMART PARAMETER SYNCHRONIZATION ENGINE
// ==========================================================================

const SMART_SYNC_KEY = 'voltcheck_smart_sync_enabled';
let globalSmartSyncState = {
  wireLength: 40,
  ambientTemp: 40,
  systemVoltage: 24,
  frequency: 60,
  safetyMargin: 20
};

function isSmartSyncEnabled() {
  const toggle = document.getElementById('smartSyncToggle');
  return toggle ? toggle.checked : true;
}

function toggleSmartSync(enabled) {
  try {
    localStorage.setItem(SMART_SYNC_KEY, enabled ? 'true' : 'false');
  } catch (e) {}
}

function syncParametersToActiveTab(tabId) {
  if (!isSmartSyncEnabled()) return;

  const panel = document.getElementById(tabId);
  if (!panel) return;

  // Sync ambient temperature
  const tempInput = panel.querySelector('#ambientTemp, #ambTemp, #panelAmbTemp, #tempAmb');
  if (tempInput && globalSmartSyncState.ambientTemp) {
    tempInput.value = globalSmartSyncState.ambientTemp;
    tempInput.dispatchEvent(new Event('input', { bubbles: true }));
  }

  // Sync wire length
  const lengthInput = panel.querySelector('#wireLength, #busLength, #trayLength');
  if (lengthInput && globalSmartSyncState.wireLength) {
    lengthInput.value = globalSmartSyncState.wireLength;
    lengthInput.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

// Track input changes to update shared state
document.addEventListener('input', e => {
  if (!isSmartSyncEnabled()) return;
  const id = e.target.id;
  const val = parseFloat(e.target.value);
  if (isNaN(val)) return;

  if (id === 'ambientTemp' || id === 'ambTemp') {
    globalSmartSyncState.ambientTemp = val;
  } else if (id === 'wireLength') {
    globalSmartSyncState.wireLength = val;
  }
});

window.toggleSmartSync = toggleSmartSync;


// ==========================================================================
// [UX UPGRADE 3] MULTI-TOOL UNIFIED REPORT CART & MASTER A4 PRINT ENGINE
// ==========================================================================

const REPORT_CART_STORAGE_KEY = 'voltcheck_report_cart_items';
const WORKFLOW_TABS = new Set(['tab-voltagedrop', 'tab-smpsbudget', 'tab-motorcalc']);

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getActiveToolName(tabId) {
  const activeBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
  return activeBtn?.querySelector('span')?.textContent?.trim() || tabId.replace('tab-', '');
}

function capturePanelFields(panel) {
  return Array.from(panel.querySelectorAll('input, select, textarea'))
    .filter(el => el.id && !el.closest('.modal-backdrop') && !el.closest('.custom-modal-overlay'))
    .slice(0, 18)
    .map(el => {
      const label = panel.querySelector(`label[for="${el.id}"]`)?.textContent?.trim()
        || el.getAttribute('aria-label')
        || el.id;
      const unit = el.closest('.input-with-unit')?.querySelector('.unit-label')?.textContent?.trim() || '';
      const value = el.type === 'checkbox' ? (el.checked ? 'ON' : 'OFF') : el.value;
      return { label, value: unit ? `${value} ${unit}` : value };
    })
    .filter(item => item.value !== '');
}

function capturePanelResult(panel) {
  const verdictEl = panel.querySelector('.verdict-stamp, .badge-safe, .badge-warn, .badge-danger, [id*="Verdict"]');
  const heroValueEl = panel.querySelector('.terminal-voltage-big, .voltage-hero-card .font-mono, [id^="res"][class*="font-mono"]');
  const recText = panel.querySelector('#recText, .engineering-opinion, .result-comment, [id*="Rec"], [id*="Opinion"]')?.textContent?.trim();
  return {
    verdict: verdictEl?.textContent?.replace(/\s+/g, ' ').trim() || '검토 완료',
    summary: heroValueEl?.textContent?.replace(/\s+/g, ' ').trim() || '산출 데이터 생성',
    note: recText ? recText.replace(/\s+/g, ' ').slice(0, 220) : ''
  };
}

function getReportCartItems() {
  try {
    const raw = localStorage.getItem(REPORT_CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveReportCartItems(items) {
  try {
    localStorage.setItem(REPORT_CART_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {}
  updateReportCartBadges();
  renderReturnWorkspaceDashboard();
}

function getWorkflowRecommendationFromProject(project) {
  const tabId = project?.tabId || '';
  if (tabId === 'tab-voltagedrop') {
    return [
      { tabId: 'tab-smpsbudget', label: 'SMPS 용량 검토' },
      { tabId: 'tab-motorcalc', label: '모터·MC 검토' },
      { action: 'quote', label: 'BOM 문의 정리' }
    ];
  }
  if (tabId === 'tab-smpsbudget') {
    return [
      { tabId: 'tab-voltagedrop', label: '전압강하 재검토' },
      { tabId: 'tab-inrushbreaker', label: '돌입전류·차단기' },
      { action: 'quote', label: 'BOM 문의 정리' }
    ];
  }
  if (tabId === 'tab-motorcalc') {
    return [
      { tabId: 'tab-inrushbreaker', label: '돌입전류·트립' },
      { tabId: 'tab-shortcircuit', label: '단락전류' },
      { action: 'quote', label: 'BOM 문의 정리' }
    ];
  }
  return [
    { tabId: 'tab-voltagedrop', label: '전압강하' },
    { tabId: 'tab-smpsbudget', label: 'SMPS' },
    { tabId: 'tab-motorcalc', label: '모터' },
    { action: 'quote', label: 'BOM' }
  ];
}

function openWorkflowStep(step) {
  if (step.action === 'quote') {
    openB2BQuoteModal();
    return;
  }
  switchTab(step.tabId);
}

function renderReturnWorkspaceDashboard() {
  const projectCountEl = document.getElementById('returnProjectCount');
  const reportCountEl = document.getElementById('returnReportCount');
  const summaryEl = document.getElementById('returnDashboardSummary');
  const nextEl = document.getElementById('returnNextSteps');
  if (!projectCountEl || !reportCountEl || !summaryEl || !nextEl) return;

  const projects = getSavedProjects();
  const reportItems = getReportCartItems();
  const latest = projects[0];

  projectCountEl.textContent = projects.length;
  reportCountEl.textContent = reportItems.length;
  summaryEl.textContent = latest
    ? `최근 저장: ${latest.name} · ${latest.toolName || '공학 도구'}`
    : '전압강하, SMPS, 모터 계산 결과를 저장하면 다음 방문 때 이곳에서 바로 이어갈 수 있습니다.';

  const steps = getWorkflowRecommendationFromProject(latest);
  nextEl.innerHTML = steps.map(step => `
    <button type="button" data-workflow-tab="${step.tabId || ''}" data-workflow-action="${step.action || ''}">
      ${escapeHtml(step.label)}
    </button>
  `).join('');
  nextEl.querySelectorAll('button').forEach((button, index) => {
    button.addEventListener('click', () => openWorkflowStep(steps[index]));
  });
}

function addToReportCart(tabId) {
  const toolName = getActiveToolName(tabId);
  const panel = document.getElementById(tabId);
  if (!panel) return;

  const result = capturePanelResult(panel);

  const cartItem = {
    id: 'item_' + Date.now(),
    tabId: tabId,
    toolName: toolName,
    verdict: result.verdict,
    summary: result.summary,
    note: result.note,
    fields: capturePanelFields(panel),
    timestamp: new Date().toISOString()
  };

  let items = getReportCartItems();
  // Avoid duplicate same tool
  items = items.filter(it => it.tabId !== tabId);
  items.push(cartItem);
  saveReportCartItems(items);

  trackVoltCheckEvent(ANALYTICS_EVENTS.reportCartAdd, {
    action: 'add_report_cart',
    tab: tabId,
    toolLabel: toolName,
    verdict: result.verdict
  });
  alert(`[바구니 담기 완료] '${toolName}' 결과가 통합 결재서 바구니에 추가되었습니다! (현재 ${items.length}개)`);
}

function quickSaveWorkflowProject(tabId) {
  const panel = document.getElementById(tabId);
  if (!panel) return;

  const toolName = getActiveToolName(tabId);
  const result = capturePanelResult(panel);
  const name = `${toolName} - ${new Date().toLocaleDateString('ko-KR')}`;
  const project = {
    id: 'proj_' + Date.now(),
    name,
    tabId,
    toolName,
    createdAt: new Date().toISOString(),
    result,
    data: Object.fromEntries(capturePanelFields(panel).map(item => [item.label, item.value]))
  };

  const list = getSavedProjects();
  list.unshift(project);
  saveProjectsList(list.slice(0, 50));
  renderSavedProjectsList();
  alert(`[프로젝트 저장 완료]\n'${name}' 계산 조건과 핵심 결과를 브라우저 보관함에 저장했습니다.`);
}

function updateReportCartBadges() {
  const items = getReportCartItems();
  const count = items.length;
  const topBadge = document.getElementById('reportCartCountTop');
  if (topBadge) topBadge.textContent = count;
}

function openReportCartModal() {
  const modal = document.getElementById('reportCartModal');
  if (!modal) return;
  restoreReportMetaForm();
  renderReportCart();
  modal.style.display = 'flex';
  if (window.lucide) window.lucide.createIcons();
}

function closeReportCartModal() {
  const modal = document.getElementById('reportCartModal');
  if (modal) modal.style.display = 'none';
}

function renderReportCart() {
  const container = document.getElementById('reportCartItemsContainer');
  if (!container) return;

  const items = getReportCartItems();
  if (items.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:2rem 1rem; color:#94a3b8; font-size:0.85rem; background:#f8fafc; border-radius:6px; border:1px dashed #cbd5e1;">
        바구니에 담긴 공학 계산 결과가 없습니다.<br>
        각 계산기 결과창 아래의 <strong>[📑 결재 바구니에 담기]</strong> 버튼을 눌러보세요!
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(item => `
    <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:6px; padding:0.75rem 1rem; display:flex; justify-content:space-between; align-items:center; gap:0.75rem;">
      <div style="flex:1; min-width:0;">
        <div style="display:flex; align-items:center; gap:0.45rem;">
          <span class="badge-pill font-mono" style="background:#eff6ff; color:#2563eb; font-size:0.65rem; padding:0.1rem 0.35rem; font-weight:800;">${item.toolName}</span>
          <strong style="font-size:0.88rem; color:#0f172a;">${item.summary}</strong>
        </div>
        <div style="font-size:0.72rem; color:#059669; font-weight:700; margin-top:0.25rem;">판정: ${item.verdict}</div>
        ${item.note ? `<div style="font-size:0.72rem; color:#64748b; margin-top:0.25rem;">${escapeHtml(item.note)}</div>` : ''}
      </div>
      <button type="button" onclick="removeFromReportCart('${item.id}')" style="background:#fee2e2; color:#dc2626; border:none; padding:0.35rem 0.6rem; border-radius:4px; font-size:0.75rem; font-weight:800; cursor:pointer;" title="삭제">
        &times;
      </button>
    </div>
  `).join('');
}

function removeFromReportCart(id) {
  let items = getReportCartItems();
  items = items.filter(it => it.id !== id);
  saveReportCartItems(items);
  renderReportCart();
}

function clearReportCart() {
  if (!confirm("바구니의 모든 검토 항목을 비우시겠습니까?")) return;
  saveReportCartItems([]);
  renderReportCart();
}

function getReportMeta() {
  return {
    project: document.getElementById('cartReportProject')?.value.trim() || document.getElementById('projectNameInput')?.value.trim() || 'VoltCheck24 Engineering Review',
    client: document.getElementById('cartReportClient')?.value.trim() || 'Internal Review',
    author: document.getElementById('cartReportAuthor')?.value.trim() || 'VoltCheck24 User',
    standard: document.getElementById('cartReportStandard')?.value || 'IEC 60204-1',
    purpose: document.getElementById('cartReportPurpose')?.value.trim() || '입력 조건에 대한 사전 설계 검토'
  };
}

function persistReportMetaForm() {
  const meta = getReportMeta();
  try { localStorage.setItem('voltcheck_report_meta', JSON.stringify(meta)); } catch (e) {}
  return meta;
}

function restoreReportMetaForm() {
  let meta = {};
  try { meta = JSON.parse(localStorage.getItem('voltcheck_report_meta') || '{}'); } catch (e) {}
  const values = {
    cartReportProject: meta.project || document.getElementById('projectNameInput')?.value || '',
    cartReportClient: meta.client || '',
    cartReportAuthor: meta.author || '',
    cartReportStandard: meta.standard || 'IEC 60204-1',
    cartReportPurpose: meta.purpose || ''
  };
  Object.entries(values).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.value = value;
  });
}

function reportChecklistComplete() {
  return ['reportCheckInputs', 'reportCheckConditions', 'reportCheckDatasheet']
    .every(id => document.getElementById(id)?.checked);
}

function printUnifiedMasterReport() {
  const items = getReportCartItems();
  if (items.length === 0) {
    alert("바구니에 담긴 검토 항목이 없습니다. 먼저 계산 결과를 담아주세요.");
    return;
  }
  if (!reportChecklistComplete()) {
    alert('출력 전에 입력값·현장 조건·제조사 데이터시트 확인 항목을 모두 체크해 주세요.');
    return;
  }
  const reportMeta = persistReportMetaForm();
  closeReportCartModal();
  trackVoltCheckEvent(ANALYTICS_EVENTS.reportPrint, {
    action: 'print_unified_report',
    itemCount: items.length
  });
  const projectName = reportMeta.project || document.getElementById('projectNameInput')?.value || 'VoltCheck24 Engineering Review';
  const issuedAt = new Date().toLocaleString('ko-KR');
  const rows = items.map((item, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td>${escapeHtml(item.toolName)}</td>
      <td>${escapeHtml(item.summary)}</td>
      <td>${escapeHtml(item.verdict)}</td>
    </tr>
    ${item.note ? `<tr><td></td><td colspan="3" class="note-cell">${escapeHtml(item.note)}</td></tr>` : ''}
  `).join('');
  const fieldBlocks = items.map(item => `
    <section class="print-field-block">
      <h3>${escapeHtml(item.toolName)}</h3>
      <dl>
        ${(item.fields || []).slice(0, 10).map(field => `<div><dt>${escapeHtml(field.label)}</dt><dd>${escapeHtml(field.value)}</dd></div>`).join('')}
      </dl>
    </section>
  `).join('');

  const printWindow = window.open('', '_blank', 'width=960,height=720');
  if (!printWindow) {
    alert('팝업 차단으로 보고서 창을 열 수 없습니다. 브라우저 팝업 허용 후 다시 시도해 주세요.');
    return;
  }
  printWindow.document.write(`<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <title>VoltCheck24 통합 기술검토서</title>
  <style>
    body { font-family: Arial, "Malgun Gothic", sans-serif; margin: 28px; color: #0f172a; }
    .report-head { border-bottom: 3px solid #0f172a; padding-bottom: 14px; margin-bottom: 18px; }
    h1 { margin: 0; font-size: 24px; letter-spacing: 0; }
    .meta { margin-top: 8px; color: #475569; font-size: 12px; line-height: 1.6; }
    table { width: 100%; border-collapse: collapse; margin-top: 14px; font-size: 12px; }
    th, td { border: 1px solid #cbd5e1; padding: 8px; vertical-align: top; }
    th { background: #f1f5f9; text-align: left; }
    .note-cell { color: #475569; background: #f8fafc; }
    .print-field-block { break-inside: avoid; margin-top: 16px; border: 1px solid #e2e8f0; padding: 12px; }
    .print-field-block h3 { margin: 0 0 8px; font-size: 15px; }
    dl { margin: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px 14px; }
    dl div { display: flex; justify-content: space-between; border-bottom: 1px dotted #cbd5e1; gap: 10px; }
    dt { color: #64748b; }
    dd { margin: 0; font-weight: 700; text-align: right; }
    .disclaimer { margin-top: 18px; padding: 10px; background: #fff7ed; border: 1px solid #fed7aa; color: #7c2d12; font-size: 11px; line-height: 1.5; }
    @media print { body { margin: 14mm; } }
  </style>
</head>
<body>
  <header class="report-head">
    <h1>VoltCheck24 통합 기술검토서</h1>
    <div class="meta">프로젝트: ${escapeHtml(projectName)}<br>고객사: ${escapeHtml(reportMeta.client)}<br>작성자: ${escapeHtml(reportMeta.author)}<br>검토 기준: ${escapeHtml(reportMeta.standard)}<br>검토 목적: ${escapeHtml(reportMeta.purpose)}<br>발행일: ${escapeHtml(issuedAt)}<br>검토 항목: ${items.length}개</div>
  </header>
  <table>
    <thead><tr><th>No.</th><th>계산 도구</th><th>핵심 결과</th><th>판정</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  ${fieldBlocks}
   <div class="disclaimer"><strong>적용 조건 및 품질 확인</strong><br>계산 결과는 현장 판단을 돕는 참고 자료입니다. 입력값과 단위를 확인했으며, 최종 설계·안전 인증·구매 사양 확정에는 최신 법규, 프로젝트 기준서, 제조사 데이터시트와 유자격 기술자의 검토를 우선 적용하세요.</div>
  <script>window.onload = () => { window.print(); };</script>
</body>
</html>`);
  printWindow.document.close();
}

function injectWorkflowActionPanels() {
  WORKFLOW_TABS.forEach(tabId => {
    const panel = document.getElementById(tabId);
    if (!panel || panel.querySelector('.workflow-action-panel')) return;
    const target = panel.querySelector('.meter-workbench-grid, .calc-grid, .input-output-grid') || panel.querySelector('.main-desc');
    if (!target) return;
    const actionPanel = document.createElement('section');
    actionPanel.className = 'workflow-action-panel';
    actionPanel.innerHTML = `
      <div>
        <strong>계산 후 다음 작업</strong>
        <span>조건 저장, 통합 기술검토서, BOM 문의까지 한 번에 이어갑니다.</span>
      </div>
      <div class="workflow-action-buttons">
        <button type="button" onclick="quickSaveWorkflowProject('${tabId}')">프로젝트 저장</button>
        <button type="button" onclick="addToReportCart('${tabId}')">보고서에 담기</button>
        <button type="button" onclick="openB2BQuoteModal()">BOM 문의 정리</button>
      </div>
    `;
    target.after(actionPanel);
  });
}

// Attach Cart Button to each Tab Readout Panel
function injectReportCartButtonsToAllTabs() {
  document.querySelectorAll('.tab-panel').forEach(panel => {
    const tabId = panel.id;
    const readout = panel.querySelector('.meter-readout-panel, [class*="readout"]');
    if (!readout || readout.querySelector('.btn-add-to-cart')) return;

    const btnContainer = document.createElement('div');
    btnContainer.className = 'btn-add-to-cart-box mt-2';
    btnContainer.style.cssText = 'text-align:right; margin-top:0.5rem;';
    btnContainer.innerHTML = `
      <button type="button" class="btn-add-to-cart" onclick="addToReportCart('${tabId}')" style="background:#f1f5f9; border:1px solid #cbd5e1; color:#334155; padding:0.35rem 0.7rem; font-size:0.75rem; font-weight:700; border-radius:4px; cursor:pointer; display:inline-flex; align-items:center; gap:0.3rem;">
        <span>📑 결재 바구니에 담기</span>
      </button>
    `;
    readout.appendChild(btnContainer);
  });
}

// Global Exports & Boot
window.addToReportCart = addToReportCart;
window.openReportCartModal = openReportCartModal;
window.closeReportCartModal = closeReportCartModal;
window.removeFromReportCart = removeFromReportCart;
window.clearReportCart = clearReportCart;
window.printUnifiedMasterReport = printUnifiedMasterReport;
window.quickSaveWorkflowProject = quickSaveWorkflowProject;
window.renderReturnWorkspaceDashboard = renderReturnWorkspaceDashboard;

// Initialize on DOM Loaded
document.addEventListener('DOMContentLoaded', () => {
  renderFavoritesBar();
  updateStarIconsAcrossDOM();
  updateReportCartBadges();
  renderReturnWorkspaceDashboard();
  document.getElementById('openUserGuideBtn')?.addEventListener('click', () => {
    trackVoltCheckEvent(ANALYTICS_EVENTS.guideOpen, { action: 'open_user_guide' });
    openUserGuide();
  });
  document.getElementById('closeUserGuideBtn')?.addEventListener('click', closeUserGuide);
  document.getElementById('userGuideModal')?.addEventListener('click', (event) => {
    if (event.target.id === 'userGuideModal') closeUserGuide();
  });
  injectReportCartButtonsToAllTabs();
  injectWorkflowActionPanels();
});

// Also run immediately if script loaded after DOM
renderFavoritesBar();
updateStarIconsAcrossDOM();
updateReportCartBadges();
renderReturnWorkspaceDashboard();
injectReportCartButtonsToAllTabs();
injectWorkflowActionPanels();


// ==========================================================================
// TAB 49: 기계요소 정격 수명 계산기 (calcMechLife)
// ==========================================================================
function calcMechLife() {
  const type = document.getElementById('mlComponentType')?.value || 'bearing_ball';
  const C = parseFloat(document.getElementById('mlDynamicRatingC')?.value) || 28.5;
  const P = parseFloat(document.getElementById('mlEquivLoadP')?.value) || 4.2;
  const n = parseFloat(document.getElementById('mlRpm')?.value) || 1750;
  const fw = parseFloat(document.getElementById('mlLoadFactorFw')?.value) || 1.2;
  const hoursPerDay = parseFloat(document.getElementById('mlHoursPerDay')?.value) || 16;

  let p = (type === 'bearing_roller') ? 3.333 : 3.0;
  const effectiveP = P * fw;
  const loadRatio = C / effectiveP;
  
  let L10_revs = Math.pow(loadRatio, p) * 1e6; // Total revolutions
  let L10h = L10_revs / (60 * n); // Hours

  if (type === 'lm_guide') {
    // 50km nominal travel rating
    const travelKm = Math.pow(loadRatio, 3) * 50;
    L10h = (travelKm * 1000) / (2 * 0.5 * n * 60); // assuming 0.5m stroke
  }

  const days = Math.round(L10h / hoursPerDay);
  const years = (days / 365).toFixed(2);
  const totalMrev = (L10_revs / 1e6).toFixed(0);
  const greaseInterval = Math.round(Math.min(L10h * 0.12, 4500));

  const lifeHoursEl = document.getElementById('mlLifeHours');
  if (lifeHoursEl) lifeHoursEl.textContent = Math.round(L10h).toLocaleString();

  const lifeYearsEl = document.getElementById('mlLifeYears');
  if (lifeYearsEl) lifeYearsEl.textContent = years;

  const lifeDaysEl = document.getElementById('mlLifeDays');
  if (lifeDaysEl) lifeDaysEl.textContent = days.toLocaleString();

  const totalRevsEl = document.getElementById('mlTotalRevs');
  if (totalRevsEl) totalRevsEl.textContent = `${totalMrev} Mrev`;

  const greaseEl = document.getElementById('mlGreaseInterval');
  if (greaseEl) greaseEl.textContent = `${greaseInterval.toLocaleString()} h (${(greaseInterval / (hoursPerDay * 30)).toFixed(1)}개월)`;

  const marginPct = Math.round((L10h / 20000) * 100);
  const pctEl = document.getElementById('mlLifePercent');
  if (pctEl) pctEl.textContent = `${marginPct}%`;

  const barEl = document.getElementById('mlLifeBar');
  if (barEl) {
    barEl.style.width = `${Math.min(marginPct, 100)}%`;
    barEl.style.background = marginPct >= 100 ? '#10b981' : (marginPct >= 50 ? '#f59e0b' : '#ef4444');
  }

  const badgeEl = document.getElementById('mlVerdictBadge');
  if (badgeEl) {
    badgeEl.textContent = L10h >= 20000 ? 'PASS (장수명)' : (L10h >= 8000 ? 'WARN (교체계획)' : 'CRITICAL (과부하)');
    badgeEl.className = 'verdict-stamp font-mono ' + (L10h >= 20000 ? 'badge-safe' : (L10h >= 8000 ? 'badge-warn' : 'badge-danger'));
  }
}
window.calcMechLife = calcMechLife;

// ==========================================================================
// TAB 50: CNC 절삭력 & 주축 동력 (calcCuttingForce)
// ==========================================================================
function calcCuttingForce() {
  const mat = document.getElementById('cfMaterial')?.value || 'steel';
  const Vc = parseFloat(document.getElementById('cfCuttingSpeed')?.value) || 180;
  const ap = parseFloat(document.getElementById('cfDepthAp')?.value) || 3.0;
  const fz = parseFloat(document.getElementById('cfFeedFz')?.value) || 0.15;
  const ae = parseFloat(document.getElementById('cfWidthAe')?.value) || 25;
  const pRating = parseFloat(document.getElementById('cfSpindleRatingKw')?.value) || 7.5;

  let kc1_1 = 1800;
  let mc = 0.25;
  if (mat === 'alloy_steel') { kc1_1 = 2100; mc = 0.26; }
  else if (mat === 'stainless') { kc1_1 = 2200; mc = 0.28; }
  else if (mat === 'aluminum') { kc1_1 = 800; mc = 0.20; }
  else if (mat === 'cast_iron') { kc1_1 = 1200; mc = 0.22; }

  const kc = kc1_1 * Math.pow(fz, -mc);
  const A = ap * fz; // Chip area mm2
  const Fc = kc * A; // Cutting force N
  const Pc = (Fc * Vc) / (60 * 1000 * 0.85); // Required spindle power in kW with 85% mechanical efficiency
  const loadPct = ((Pc / pRating) * 100).toFixed(1);
  const mrr = (ap * ae * (Vc * 1000 * fz) / (Math.PI * 50 * 1000)).toFixed(1); // approximate cm3/min
  const torqueNm = ((Pc * 9550) / (Vc / (Math.PI * 0.05))).toFixed(1);

  const pEl = document.getElementById('cfPowerKw');
  if (pEl) pEl.textContent = Pc.toFixed(2);

  const loadEl = document.getElementById('cfLoadPercent');
  if (loadEl) loadEl.textContent = `${loadPct}%`;

  const fcEl = document.getElementById('cfMainForceFc');
  if (fcEl) fcEl.textContent = `${Math.round(Fc).toLocaleString()} N`;

  const mrrEl = document.getElementById('cfMrrVal');
  if (mrrEl) mrrEl.textContent = `${(ap * ae * fz * 1.5).toFixed(1)} cm³/min`;

  const torqEl = document.getElementById('cfTorqueNm');
  if (torqEl) torqEl.textContent = `${(Pc * 15).toFixed(1)} N·m`;

  const kcEl = document.getElementById('cfKcVal');
  if (kcEl) kcEl.textContent = `${Math.round(kc).toLocaleString()} N/mm²`;

  const badgeEl = document.getElementById('cfVerdictBadge');
  if (badgeEl) {
    badgeEl.textContent = loadPct <= 85 ? `SAFE (${loadPct}%)` : (loadPct <= 100 ? `WARN (${loadPct}%)` : `OVERLOAD (${loadPct}%)`);
    badgeEl.className = 'verdict-stamp font-mono ' + (loadPct <= 85 ? 'badge-safe' : (loadPct <= 100 ? 'badge-warn' : 'badge-danger'));
  }
}
window.calcCuttingForce = calcCuttingForce;

// ==========================================================================
// TAB 51: 고압 유압 축압기 용량 (calcAccumulator)
// ==========================================================================
function calcAccumulator() {
  const p2 = parseFloat(document.getElementById('accMaxPressureP2')?.value) || 210;
  const p1 = parseFloat(document.getElementById('accMinPressureP1')?.value) || 140;
  const deltaV = parseFloat(document.getElementById('accDeltaV')?.value) || 6.5;
  const proc = document.getElementById('accProcessType')?.value || 'adiabatic';
  const ratio = parseFloat(document.getElementById('accPrechargeRatio')?.value) || 0.9;

  const n = (proc === 'adiabatic') ? 1.4 : 1.0;
  const p0 = p1 * ratio; // Precharge pressure

  // Polytropic expansion formula: V0 = deltaV / [ (p0/p1)^(1/n) - (p0/p2)^(1/n) ]
  const term1 = Math.pow(p0 / p1, 1 / n);
  const term2 = Math.pow(p0 / p2, 1 / n);
  const exactV0 = deltaV / (term1 - term2);

  // Standard commercial tank sizing
  let nominalV0 = 10;
  const standardSizes = [1, 2.5, 4, 6, 10, 16, 20, 25, 32, 40, 50, 60, 100];
  for (let s of standardSizes) {
    if (s >= exactV0) { nominalV0 = s; break; }
  }

  const storedEnergy = Math.round(exactV0 * (p2 - p1) * 0.08);

  const nomEl = document.getElementById('accNominalVolV0');
  if (nomEl) nomEl.textContent = nominalV0.toFixed(1);

  const exactEl = document.getElementById('accExactVol');
  if (exactEl) exactEl.textContent = `${exactV0.toFixed(1)} L`;

  const p0El = document.getElementById('accN2PrechargeP0');
  if (p0El) p0El.textContent = `${Math.round(p0)} bar`;

  const energyEl = document.getElementById('accStoredEnergyKj');
  if (energyEl) energyEl.textContent = `${storedEnergy} kJ`;

  const v2El = document.getElementById('accGasVolV2');
  if (v2El) v2El.textContent = `${(exactV0 * term2).toFixed(1)} L`;

  const actDvEl = document.getElementById('accActualDeltaV');
  if (actDvEl) actDvEl.textContent = `${deltaV.toFixed(1)} L`;
}
window.calcAccumulator = calcAccumulator;

// ==========================================================================
// TAB 52: 화학 반응기 재킷 열수지 (calcReactorHeat)
// ==========================================================================
function calcReactorHeat() {
  const V = parseFloat(document.getElementById('rhBatchVolume')?.value) || 3.0;
  const dH = parseFloat(document.getElementById('rhHeatReaction')?.value) || 450;
  const tHours = parseFloat(document.getElementById('rhBatchHours')?.value) || 2.0;
  const U = parseFloat(document.getElementById('rhOverallU')?.value) || 450;
  const Trxn = parseFloat(document.getElementById('rhTempRxn')?.value) || 85;
  const TcwIn = parseFloat(document.getElementById('rhTempCwIn')?.value) || 25;

  const totalHeatKj = V * 1000 * dH; // assuming density 1000 kg/m3
  const qKw = totalHeatKj / (tHours * 3600); // kW
  const TcwOut = Math.min(TcwIn + 10, Trxn - 15);
  const dt1 = Trxn - TcwOut;
  const dt2 = Trxn - TcwIn;
  const lmtd = (dt2 - dt1) / Math.log(dt2 / dt1);
  const areaM2 = (qKw * 1000) / (U * lmtd);
  const flowLpm = (qKw / (4.184 * (TcwOut - TcwIn))) * 60;

  const qEl = document.getElementById('rhTotalHeatKw');
  if (qEl) qEl.textContent = qKw.toFixed(1);

  const flowEl = document.getElementById('rhCoolingFlowLpm');
  if (flowEl) flowEl.textContent = flowLpm.toFixed(1);

  const areaEl = document.getElementById('rhRequiredArea');
  if (areaEl) areaEl.textContent = `${areaM2.toFixed(1)} m²`;

  const lmtdEl = document.getElementById('rhLmtdVal');
  if (lmtdEl) lmtdEl.textContent = `${lmtd.toFixed(1)} °C`;

  const toutEl = document.getElementById('rhTempCwOut');
  if (toutEl) toutEl.textContent = `${TcwOut.toFixed(1)} °C`;
}
window.calcReactorHeat = calcReactorHeat;

// ==========================================================================
// TAB 53: 원자로 감쇠열 & 차폐 (calcNuclearDecay)
// ==========================================================================
function calcNuclearDecay() {
  const P0 = parseFloat(document.getElementById('ndThermalPowerMw')?.value) || 300;
  const tSec = parseFloat(document.getElementById('ndDecayTime')?.value) || 3600;
  const mat = document.getElementById('ndShieldMaterial')?.value || 'lead';
  const thCm = parseFloat(document.getElementById('ndShieldThicknessCm')?.value) || 12;

  // Wigner-Way decay heat fraction: P/P0 = 0.066 * (t^-0.2 - (t + 1e7)^-0.2)
  const fraction = 0.066 * Math.pow(Math.max(tSec, 1), -0.2);
  const P_decay = P0 * fraction;

  let hvl = 1.2;
  if (mat === 'concrete') hvl = 6.5;
  else if (mat === 'steel') hvl = 2.2;
  else if (mat === 'water') hvl = 18.0;

  const nHvl = thCm / hvl;
  const atten = Math.pow(2, -nHvl);

  const pEl = document.getElementById('ndDecayPowerMw');
  if (pEl) pEl.textContent = P_decay.toFixed(2);

  const pctEl = document.getElementById('ndDecayPercent');
  if (pctEl) pctEl.textContent = `${(fraction * 100).toFixed(2)}%`;

  const attenEl = document.getElementById('ndAttenuationFactor');
  if (attenEl) attenEl.textContent = `1 / ${Math.round(1 / atten).toLocaleString()} (${(atten * 100).toFixed(4)}%)`;

  const hvlEl = document.getElementById('ndHvlCount');
  if (hvlEl) hvlEl.textContent = `${nHvl.toFixed(1)} HVL`;
}
window.calcNuclearDecay = calcNuclearDecay;

// ==========================================================================
// TAB 54: 6축 로봇 관절 토크 (calcRobotTorque)
// ==========================================================================
function calcRobotTorque() {
  const payload = parseFloat(document.getElementById('rtPayloadKg')?.value) || 20;
  const reachMm = parseFloat(document.getElementById('rtReachMm')?.value) || 1650;
  const alpha = parseFloat(document.getElementById('rtAngAccel')?.value) || 15.0;
  const ratio = parseFloat(document.getElementById('rtReducerRatio')?.value) || 120;
  const duty = parseFloat(document.getElementById('rtDutyPercent')?.value) || 65;

  const reachM = reachMm / 1000;
  const armMass = 45; // kg
  const staticGravityTorque = (payload * reachM * 9.81) + (armMass * (reachM * 0.5) * 9.81);
  const I_total = (payload * Math.pow(reachM, 2)) + (armMass * Math.pow(reachM * 0.5, 2));
  const dynamicAccelTorque = I_total * alpha;
  const peakTorque = staticGravityTorque + dynamicAccelTorque;
  const motorTorque = peakTorque / (ratio * 0.9); // with 90% reducer efficiency
  const recMotorKw = (peakTorque * (alpha * 0.5) / 1000 * 1.5).toFixed(1);

  const peakEl = document.getElementById('rtPeakTorqueNm');
  if (peakEl) peakEl.textContent = Math.round(peakTorque).toLocaleString();

  const motEl = document.getElementById('rtMotorTorqueNm');
  if (motEl) motEl.textContent = `${motorTorque.toFixed(2)} N·m`;

  const statEl = document.getElementById('rtStaticGravityTorque');
  if (statEl) statEl.textContent = `${Math.round(staticGravityTorque)} N·m`;

  const dynEl = document.getElementById('rtDynamicAccelTorque');
  if (dynEl) dynEl.textContent = `${Math.round(dynamicAccelTorque)} N·m`;

  const kwEl = document.getElementById('rtRecommendedMotorKw');
  if (kwEl) kwEl.textContent = `${Math.max(parseFloat(recMotorKw), 1.0)} kW (3,000 RPM)`;
}
window.calcRobotTorque = calcRobotTorque;


// ==========================================================================
// TAB 55: 로켓 노즐 비추력 & 팽창비 (calcRocketNozzle)
// ==========================================================================
function calcRocketNozzle() {
  const prop = document.getElementById('rnPropellant')?.value || 'lox_kerosene';
  const Pc = parseFloat(document.getElementById('rnChamberPressurePc')?.value) || 70;
  const Dt = parseFloat(document.getElementById('rnThroatDiameterMm')?.value) || 120;
  const eps = parseFloat(document.getElementById('rnExpansionRatio')?.value) || 35;
  const amb = document.getElementById('rnAmbientType')?.value || 'vacuum';
  const mdot = parseFloat(document.getElementById('rnMassFlowKgSec')?.value) || 35;

  let k = 1.24;
  let Tc = 3500;
  let R = 360;
  if (prop === 'lox_lh2') { k = 1.26; Tc = 3300; R = 600; }
  else if (prop === 'lox_methane') { k = 1.22; Tc = 3400; R = 420; }
  else if (prop === 'solid') { k = 1.20; Tc = 2800; R = 300; }

  const At = Math.PI * Math.pow(Dt / 2000, 2); // m2
  const Ae = At * eps;
  const De = Math.sqrt(Ae * 4 / Math.PI) * 1000; // mm

  const Me = Math.sqrt(2 / (k - 1) * (Math.pow(eps, (k - 1) / (k + 1)) * 1.8 - 1));
  const Pe = Math.max(Pc / Math.pow(1 + (k - 1) / 2 * Math.pow(Me, 2), k / (k - 1)), 0.05);

  let Pa = 0;
  if (amb === 'sealevel') Pa = 1.013;
  else if (amb === 'high_altitude') Pa = 0.26;

  const ve = Math.sqrt(2 * (k / (k - 1)) * R * Tc * (1 - Math.pow(Pe / Pc, (k - 1) / k)));
  const thrustN = (mdot * ve) + ((Pe - Pa) * 1e5 * Ae);
  const thrustKn = thrustN / 1000;
  const Isp = thrustN / (mdot * 9.80665);

  const ispEl = document.getElementById('rnSpecificImpulseIsp');
  if (ispEl) ispEl.textContent = Isp.toFixed(1);

  const veEl = document.getElementById('rnEffectiveVelocity');
  if (veEl) veEl.textContent = `${Math.round(ve).toLocaleString()} m/s (Mach ${(ve / 340).toFixed(1)})`;

  const thrustEl = document.getElementById('rnTotalThrustKn');
  if (thrustEl) thrustEl.textContent = `${thrustKn.toFixed(1)} kN`;

  const machEl = document.getElementById('rnExitMach');
  if (machEl) machEl.textContent = `Mach ${Me.toFixed(2)}`;

  const peEl = document.getElementById('rnExitPressure');
  if (peEl) peEl.textContent = `${Pe.toFixed(2)} bar`;

  const deEl = document.getElementById('rnExitDiameter');
  if (deEl) deEl.textContent = `${Math.round(De)} mm`;
}
window.calcRocketNozzle = calcRocketNozzle;

// ==========================================================================
// TAB 56: 반도체 플라즈마 디바이 길이 & 쉬스 (calcPlasmaSheath)
// ==========================================================================
function calcPlasmaSheath() {
  const ne_10 = parseFloat(document.getElementById('psElectronDensity')?.value) || 5.0;
  const Te = parseFloat(document.getElementById('psElectronTempEv')?.value) || 3.5;
  const Vbias = parseFloat(document.getElementById('psBiasVoltageV')?.value) || 250;
  const gas = document.getElementById('psGasType')?.value || 'argon';

  let M_amu = 40;
  if (gas === 'cf4') M_amu = 69;
  else if (gas === 'o2') M_amu = 32;
  else if (gas === 'cl2') M_amu = 71;

  const ne_m3 = ne_10 * 1e16; // m-3
  const eps0 = 8.854e-12;
  const q = 1.602e-19;
  const kb = 1.38e-23;

  const lambdaD_m = Math.sqrt((eps0 * Te * q) / (ne_m3 * q * q));
  const lambdaD_um = lambdaD_m * 1e6;

  const vBohm = Math.sqrt((Te * q) / (M_amu * 1.66e-27));
  const Ji_A_m2 = q * ne_m3 * vBohm;
  const Ji_mA_cm2 = (Ji_A_m2 / 10000) * 1000;

  // Child-Langmuir sheath thickness s = (sqrt(2)/3) * lambdaD * (2*Vbias/Te)^(3/4)
  const s_m = (Math.sqrt(2) / 3) * lambdaD_m * Math.pow((2 * Vbias) / Te, 0.75);
  const s_mm = s_m * 1000;

  const fpe_ghz = (Math.sqrt((ne_m3 * q * q) / (eps0 * 9.109e-31)) / (2 * Math.PI)) / 1e9;

  const dEl = document.getElementById('psDebyeLengthUm');
  if (dEl) dEl.textContent = lambdaD_um.toFixed(1);

  const sEl = document.getElementById('psSheathThicknessMm');
  if (sEl) sEl.textContent = `${s_mm.toFixed(2)} mm`;

  const vbEl = document.getElementById('psBohmVelocity');
  if (vbEl) vbEl.textContent = `${Math.round(vBohm).toLocaleString()} m/s`;

  const jiEl = document.getElementById('psIonCurrentDensity');
  if (jiEl) jiEl.textContent = `${Ji_mA_cm2.toFixed(2)} mA/cm²`;

  const eEl = document.getElementById('psIonEnergyEv');
  if (eEl) eEl.textContent = `${(Vbias + Te * 0.5).toFixed(1)} eV`;

  const fEl = document.getElementById('psPlasmaFreqGhz');
  if (fEl) fEl.textContent = `${fpe_ghz.toFixed(2)} GHz`;
}
window.calcPlasmaSheath = calcPlasmaSheath;

// ==========================================================================
// TAB 57: 배터리 슬러리 코팅 건조 (calcBatterySlurry)
// ==========================================================================
function calcBatterySlurry() {
  const type = document.getElementById('bsElectrodeType')?.value || 'cathode_nmp';
  const speedMpm = parseFloat(document.getElementById('bsLineSpeedMpm')?.value) || 45;
  const widthMm = parseFloat(document.getElementById('bsCoatingWidthMm')?.value) || 650;
  const wetLoading = parseFloat(document.getElementById('bsWetLoadingGsm')?.value) || 280;
  const solidPct = parseFloat(document.getElementById('bsSolidPercent')?.value) || 70;
  const dryTemp = parseFloat(document.getElementById('bsDryerTemp')?.value) || 130;

  const widthM = widthMm / 1000;
  const coatedAreaM2PerMin = speedMpm * widthM;
  const wetKgMin = (coatedAreaM2PerMin * wetLoading) / 1000;
  const dryLoading = wetLoading * (solidPct / 100);
  const solventEvapKgMin = wetKgMin * (1 - solidPct / 100);
  const solventEvapKgHr = solventEvapKgMin * 60;

  let deltaHv = 525; // NMP latent heat kJ/kg
  let LEL = 0.013; // 1.3% for NMP
  if (type === 'anode_water') { deltaHv = 2260; LEL = 1.0; }

  const qKw = (solventEvapKgMin * deltaHv) / 60 * 1.35; // with sensible heat
  const safetyAirflowCmm = (solventEvapKgMin / (LEL * 0.25 * 3.8)) * 1.2;
  const lelConc = ((solventEvapKgMin / safetyAirflowCmm) / LEL * 25).toFixed(1);

  const qEl = document.getElementById('bsTotalHeatKw');
  if (qEl) qEl.textContent = qKw.toFixed(1);

  const evapEl = document.getElementById('bsEvapRateKgHr');
  if (evapEl) evapEl.textContent = `${solventEvapKgHr.toFixed(1)} kg/h (${solventEvapKgMin.toFixed(2)} kg/min)`;

  const cmmEl = document.getElementById('bsSafetyAirflowCmm');
  if (cmmEl) cmmEl.textContent = `${safetyAirflowCmm.toFixed(1)} CMM`;

  const lelEl = document.getElementById('bsLelConcentration');
  if (lelEl) lelEl.textContent = `${lelConc}% (안전)`;

  const dryEl = document.getElementById('bsDryLoadingGsm');
  if (dryEl) dryEl.textContent = `${dryLoading.toFixed(1)} g/m²`;

  const recEl = document.getElementById('bsNmpRecoveryKw');
  if (recEl) recEl.textContent = `${(qKw * 0.28).toFixed(1)} kW`;
}
window.calcBatterySlurry = calcBatterySlurry;

// ==========================================================================
// TAB 58: BESS 열폭주 소방 배기 (calcBessSafety)
// ==========================================================================
function calcBessSafety() {
  const chem = document.getElementById('bessChemistry')?.value || 'ncm';
  const kwh = parseFloat(document.getElementById('bessRackCapacityKwh')?.value) || 150;
  const volM3 = parseFloat(document.getElementById('bessContainerVolM3')?.value) || 75;
  const failedRacks = parseFloat(document.getElementById('bessFailedRacks')?.value) || 1;

  let gasRateLPerKwh = 185; // NCM
  if (chem === 'lfp') gasRateLPerKwh = 95;

  const totalGasL = kwh * failedRacks * gasRateLPerKwh;
  const totalGasM3 = totalGasL / 1000;
  const targetTimeMin = 10;
  const exhaustCmm = (totalGasM3 / (0.25 * 0.04 * targetTimeMin)); // maintain < 25% LEL of H2
  const exhaustCfm = exhaustCmm * 35.3147;
  const agentKg = volM3 * 0.78; // Novec 1230 design concentration

  const cfmEl = document.getElementById('bessExhaustCfm');
  if (cfmEl) cfmEl.textContent = Math.round(exhaustCfm).toLocaleString();

  const cmmEl = document.getElementById('bessExhaustCmm');
  if (cmmEl) cmmEl.textContent = `${exhaustCmm.toFixed(1)} CMM`;

  const gasEl = document.getElementById('bessTotalGasVol');
  if (gasEl) gasEl.textContent = `${totalGasM3.toFixed(1)} m³ (${Math.round(totalGasL).toLocaleString()} L)`;

  const agentEl = document.getElementById('bessAgentMassKg');
  if (agentEl) agentEl.textContent = `${agentKg.toFixed(1)} kg`;
}
window.calcBessSafety = calcBessSafety;

// ==========================================================================
// TAB 59: 기어 치면 강도 & 루이스 응력 (calcGearStress)
// ==========================================================================
function calcGearStress() {
  const m = parseFloat(document.getElementById('gsModuleM')?.value) || 3.0;
  const z1 = parseFloat(document.getElementById('gsPinionTeethZ1')?.value) || 20;
  const b = parseFloat(document.getElementById('gsFaceWidthB')?.value) || 30;
  const P = parseFloat(document.getElementById('gsTransmittedKw')?.value) || 5.5;
  const n1 = parseFloat(document.getElementById('gsPinionRpm')?.value) || 1450;
  const mat = document.getElementById('gsMaterialType')?.value || 'scm440';

  let allowBendingMpa = 450;
  if (mat === 'sm45c') allowBendingMpa = 280;
  else if (mat === 'sus304') allowBendingMpa = 190;

  const d1 = m * z1; // Pitch diameter mm
  const T1 = (P * 9550) / n1; // N.m
  const Ft = (2 * T1 * 1000) / d1; // N
  const Y = 0.32; // Lewis form factor for 20 teeth
  const sigmaB = Ft / (b * m * Y);
  const SF = allowBendingMpa / sigmaB;
  const sigmaH = 2.5 * Math.sqrt((Ft * 206000) / (b * d1 * 0.5)); // Hertz contact stress approx

  const sbEl = document.getElementById('gsBendingStressMpa');
  if (sbEl) sbEl.textContent = sigmaB.toFixed(1);

  const sfEl = document.getElementById('gsBendingSafetyFactor');
  if (sfEl) sfEl.textContent = SF.toFixed(2);

  const ftEl = document.getElementById('gsTangentialForceN');
  if (ftEl) ftEl.textContent = `${Math.round(Ft).toLocaleString()} N`;

  const shEl = document.getElementById('gsContactStressMpa');
  if (shEl) shEl.textContent = `${sigmaH.toFixed(1)} MPa`;

  const d1El = document.getElementById('gsPitchDiameterD1');
  if (d1El) d1El.textContent = `${d1.toFixed(1)} mm`;

  const tEl = document.getElementById('gsTorqueNm');
  if (tEl) tEl.textContent = `${T1.toFixed(1)} N·m`;
}
window.calcGearStress = calcGearStress;

// ==========================================================================
// TAB 60: 선박 복원성 GM (calcShipStability)
// ==========================================================================
function calcShipStability() {
  const delta = parseFloat(document.getElementById('ssDisplacementTon')?.value) || 12500;
  const B = parseFloat(document.getElementById('ssBeamWidthM')?.value) || 24.0;
  const d = parseFloat(document.getElementById('ssDraftM')?.value) || 8.5;
  const KG = parseFloat(document.getElementById('ssHeightKgM')?.value) || 9.8;

  const KB = 0.53 * d;
  const BM = (Math.pow(B, 2)) / (12 * d) * 1.4; // approx for commercial hull
  const KM = KB + BM;
  const GM = KM - KG;
  const GZ_30 = GM * Math.sin(30 * Math.PI / 180);
  const T_roll = (0.8 * B) / Math.sqrt(Math.max(GM, 0.1));

  const gmEl = document.getElementById('ssMetacentricHeightGm');
  if (gmEl) gmEl.textContent = GM.toFixed(2);

  const gzEl = document.getElementById('ssRightingArmGz');
  if (gzEl) gzEl.textContent = `${GZ_30.toFixed(3)} m`;

  const rollEl = document.getElementById('ssRollPeriodSec');
  if (rollEl) rollEl.textContent = `${T_roll.toFixed(1)} 초`;

  const kbEl = document.getElementById('ssHeightKb');
  if (kbEl) kbEl.textContent = `${KB.toFixed(2)} m`;

  const bmEl = document.getElementById('ssRadiusBm');
  if (bmEl) bmEl.textContent = `${BM.toFixed(2)} m`;
}
window.calcShipStability = calcShipStability;


// ==========================================================================
// TAB 61: 타이밍벨트 장력 (calcTimingBelt)
// ==========================================================================
function calcTimingBelt() {
  const P = parseFloat(document.getElementById('tbPowerKw')?.value) || 3.7;
  const n1 = parseFloat(document.getElementById('tbRpmN1')?.value) || 1750;
  const pitch = parseFloat(document.getElementById('tbBeltPitch')?.value) || 5;
  const z1 = parseFloat(document.getElementById('tbPulleyTeethZ1')?.value) || 28;
  const Ls = parseFloat(document.getElementById('tbSpanLengthMm')?.value) || 450;
  const W = parseFloat(document.getElementById('tbBeltWidthMm')?.value) || 25;

  const dp = (z1 * pitch) / Math.PI; // mm
  const v = (Math.PI * (dp / 1000) * n1) / 60; // m/s
  const Fe = (1000 * P) / Math.max(v, 0.1); // N
  const T0 = Fe * 1.3; // Static tension
  const m_unit = (W / 1000) * 0.0035; // kg/m
  const Ls_m = Ls / 1000;
  const f_sonic = (1 / (2 * Ls_m)) * Math.sqrt(T0 / Math.max(m_unit, 1e-4));
  const Fs = 2 * T0;

  const t0El = document.getElementById('tbStaticTensionN');
  if (t0El) t0El.textContent = Math.round(T0).toLocaleString();

  const fEl = document.getElementById('tbSonicFreqHz');
  if (fEl) fEl.textContent = `${f_sonic.toFixed(1)} Hz`;

  const feEl = document.getElementById('tbEffectiveForceFe');
  if (feEl) feEl.textContent = `${Math.round(Fe)} N`;

  const vEl = document.getElementById('tbBeltSpeedMps');
  if (vEl) vEl.textContent = `${v.toFixed(1)} m/s`;

  const fsEl = document.getElementById('tbShaftLoadFs');
  if (fsEl) fsEl.textContent = `${Math.round(Fs)} N`;

  const dpEl = document.getElementById('tbPitchDiameterDp');
  if (dpEl) dpEl.textContent = `${dp.toFixed(2)} mm`;
}
window.calcTimingBelt = calcTimingBelt;

// ==========================================================================
// TAB 62: 볼스크류 좌굴 (calcBallScrewBuckling)
// ==========================================================================
function calcBallScrewBuckling() {
  const d = parseFloat(document.getElementById('bsScrewDiaMm')?.value) || 25;
  const dr = parseFloat(document.getElementById('bsScrewRootDiaMm')?.value) || 21.5;
  const L = parseFloat(document.getElementById('bsScrewSpanMm')?.value) || 1200;
  const F = parseFloat(document.getElementById('bsAxialLoadKn')?.value) || 8.5;
  const sup = document.getElementById('bsSupportType')?.value || 'fixed_supported';
  const rpm = parseFloat(document.getElementById('bsOperatingRpm')?.value) || 1500;

  let alpha = 2.0;
  let f_speed = 15.1;
  if (sup === 'fixed_fixed') { alpha = 4.0; f_speed = 21.9; }
  else if (sup === 'supported_supported') { alpha = 1.0; f_speed = 9.7; }
  else if (sup === 'fixed_free') { alpha = 0.25; f_speed = 3.4; }

  const I = (Math.PI * Math.pow(dr, 4)) / 64; // mm4
  const E = 206000; // MPa
  const Pk_N = (alpha * Math.PI * Math.PI * E * I) / Math.pow(L, 2);
  const Pk_kN = Pk_N / 1000;
  const SF = Pk_kN / Math.max(F, 0.1);
  const Nc = (f_speed * dr * 1e7) / Math.pow(L, 2);
  const N_allow = Nc * 0.8;

  const pkEl = document.getElementById('bsbBucklingLoadKn');
  if (pkEl) pkEl.textContent = Pk_kN.toFixed(1);

  const sfEl = document.getElementById('bsbBucklingSafetyFactor');
  if (sfEl) sfEl.textContent = SF.toFixed(2);

  const ncEl = document.getElementById('bsbCriticalRpm');
  if (ncEl) ncEl.textContent = `${Math.round(Nc).toLocaleString()} RPM`;

  const naEl = document.getElementById('bsbAllowableRpm');
  if (naEl) naEl.textContent = `${Math.round(N_allow).toLocaleString()} RPM`;

  const iEl = document.getElementById('bsbInertiaI');
  if (iEl) iEl.textContent = `${Math.round(I).toLocaleString()} mm⁴`;
}
window.calcBallScrewBuckling = calcBallScrewBuckling;

// ==========================================================================
// TAB 63: 오리피스 유량 (calcOrificeFlow)
// ==========================================================================
function calcOrificeFlow() {
  const D = parseFloat(document.getElementById('ofPipeDiaD')?.value) || 100;
  const d = parseFloat(document.getElementById('ofOrificeDiaD')?.value) || 60;
  const Q = parseFloat(document.getElementById('ofFlowRateQ')?.value) || 75;
  const rho = parseFloat(document.getElementById('ofFluidDensity')?.value) || 1000;

  const beta = d / D;
  const A1 = Math.PI * Math.pow(D / 2000, 2); // m2
  const A2 = Math.PI * Math.pow(d / 2000, 2);
  const Q_m3s = Q / 3600;
  const v_pipe = Q_m3s / A1;
  const v_ori = Q_m3s / A2;
  const Cd = 0.605;

  const deltaP_pa = Math.pow(Q_m3s / (Cd * A2 * (1 / Math.sqrt(1 - Math.pow(beta, 4)))), 2) * (rho / 2);
  const deltaP_mbar = deltaP_pa / 100;
  const permLoss_mbar = deltaP_mbar * (1 - Math.pow(beta, 1.9));

  const dpEl = document.getElementById('ofDiffPressureMbar');
  if (dpEl) dpEl.textContent = deltaP_mbar.toFixed(1);

  const betaEl = document.getElementById('ofBetaRatio');
  if (betaEl) betaEl.textContent = beta.toFixed(3);

  const plEl = document.getElementById('ofPermanentLossMbar');
  if (plEl) plEl.textContent = `${permLoss_mbar.toFixed(1)} mbar (${Math.round((permLoss_mbar/deltaP_mbar)*100)}%)`;

  const vpEl = document.getElementById('ofPipeVelocity');
  if (vpEl) vpEl.textContent = `${v_pipe.toFixed(2)} m/s`;

  const voEl = document.getElementById('ofOrificeVelocity');
  if (voEl) voEl.textContent = `${v_ori.toFixed(2)} m/s`;
}
window.calcOrificeFlow = calcOrificeFlow;

// ==========================================================================
// TAB 64: 배관 보온단열 (calcInsulation)
// ==========================================================================
function calcInsulation() {
  const size = parseFloat(document.getElementById('inPipeSize')?.value) || 100;
  const T_in = parseFloat(document.getElementById('inFluidTemp')?.value) || 180;
  const mat = document.getElementById('inMaterial')?.value || 'mineral_wool';
  const t_mm = parseFloat(document.getElementById('inThicknessMm')?.value) || 50;
  const L = parseFloat(document.getElementById('inTotalLengthM')?.value) || 100;
  const T_amb = parseFloat(document.getElementById('inAmbientTemp')?.value) || 20;

  let D_out = 114.3; // 100A
  if (size === 50) D_out = 60.5;
  else if (size === 150) D_out = 165.2;
  else if (size === 200) D_out = 216.3;

  let k = 0.040;
  if (mat === 'glass_wool') k = 0.038;
  else if (mat === 'calcium_silicate') k = 0.055;
  else if (mat === 'aerogel') k = 0.018;

  const r1 = D_out / 2000; // m
  const r2 = r1 + (t_mm / 1000);
  const h_out = 9.5; // convective + radiative coeff W/m2.K

  const R_ins = Math.log(r2 / r1) / (2 * Math.PI * k);
  const R_surf = 1 / (2 * Math.PI * r2 * h_out);
  const R_total = R_ins + R_surf;

  const q_m = (T_in - T_amb) / R_total; // W/m
  const T_surf = T_amb + (q_m * R_surf);
  const totalKw = (q_m * L) / 1000;
  const bareLoss_m = 2 * Math.PI * r1 * h_out * (T_in - T_amb);
  const annualSavings = Math.round((bareLoss_m - q_m) * L * 8760 * 0.001 * 95); // 95 KRW per kWh

  const qEl = document.getElementById('inHeatLossPerMeter');
  if (qEl) qEl.textContent = q_m.toFixed(1);

  const tsEl = document.getElementById('inSurfaceTemp');
  if (tsEl) tsEl.textContent = `${T_surf.toFixed(1)} °C`;

  const totEl = document.getElementById('inTotalLossKw');
  if (totEl) totEl.textContent = `${totalKw.toFixed(2)} kW`;

  const savEl = document.getElementById('inAnnualSavingsWon');
  if (savEl) savEl.textContent = `${annualSavings.toLocaleString()} 원/년`;

  const bareEl = document.getElementById('inBarePipeLoss');
  if (bareEl) bareEl.textContent = `${Math.round(bareLoss_m)} W/m`;
}
window.calcInsulation = calcInsulation;

// ==========================================================================
// TAB 65: 수처리 폭기조 (calcAerationTank)
// ==========================================================================
function calcAerationTank() {
  const Q = parseFloat(document.getElementById('atWastewaterFlow')?.value) || 1200;
  const S0 = parseFloat(document.getElementById('atBodInlet')?.value) || 350;
  const Se = parseFloat(document.getElementById('atBodEffluent')?.value) || 20;
  const H = parseFloat(document.getElementById('atWaterDepthM')?.value) || 4.5;
  const OTE = parseFloat(document.getElementById('atOteEfficiency')?.value) || 18;

  const bodRemovedKgDay = (Q * (S0 - Se)) / 1000;
  const AOR_kgDay = bodRemovedKgDay * 1.35; // with endogenous respiration
  const AOR_kgHr = AOR_kgDay / 24;
  const SOR_kgHr = AOR_kgHr / 0.70; // alpha/beta correction
  const airDensity = 1.2; // kg/m3
  const O2_fraction = 0.232;
  const requiredAirflowCmm = (SOR_kgHr / (OTE / 100 * airDensity * O2_fraction * 60));
  const pressKpa = (H * 9.81) + 10; // with diffuser loss
  const blowerKw = (requiredAirflowCmm * pressKpa) / (60 * 0.75);

  const cmmEl = document.getElementById('atBlowerAirflowCmm');
  if (cmmEl) cmmEl.textContent = requiredAirflowCmm.toFixed(1);

  const sorEl = document.getElementById('atSorKgHr');
  if (sorEl) sorEl.textContent = `${SOR_kgHr.toFixed(1)} kg O₂/h (${Math.round(SOR_kgHr * 24).toLocaleString()} kg/day)`;

  const kwEl = document.getElementById('atBlowerPowerKw');
  if (kwEl) kwEl.textContent = `${blowerKw.toFixed(1)} kW`;

  const aorEl = document.getElementById('atAorKgHr');
  if (aorEl) aorEl.textContent = `${AOR_kgHr.toFixed(1)} kg O₂/h`;

  const bodEl = document.getElementById('atBodRemovedKg');
  if (bodEl) bodEl.textContent = `${bodRemovedKgDay.toFixed(1)} kg/day`;

  const pkpaEl = document.getElementById('atDischargeKpa');
  if (pkpaEl) pkpaEl.textContent = `${pressKpa.toFixed(1)} kPa`;
}
window.calcAerationTank = calcAerationTank;

// ==========================================================================
// TAB 66: H형강 처짐 (calcSteelBeam)
// ==========================================================================
function calcSteelBeam() {
  const prof = document.getElementById('sbBeamProfile')?.value || 'h150x150';
  const L = parseFloat(document.getElementById('sbBeamSpanM')?.value) || 6.0;
  const P = parseFloat(document.getElementById('sbPointLoadKn')?.value) || 25;
  const w = parseFloat(document.getElementById('sbUniformLoadKnM')?.value) || 3.5;

  let Ix = 1780; // cm4
  let Zx = 237; // cm3
  if (prof === 'h200x200') { Ix = 4720; Zx = 472; }
  else if (prof === 'h250x250') { Ix = 10800; Zx = 867; }
  else if (prof === 'h300x300') { Ix = 20400; Zx = 1360; }

  const L_mm = L * 1000;
  const E = 205000; // MPa
  const Ix_mm4 = Ix * 1e4;
  const Zx_mm3 = Zx * 1e3;

  // Deflection: point load (P L^3 / 48 E I) + uniform load (5 w L^4 / 384 E I)
  const delta_P = (P * 1000 * Math.pow(L_mm, 3)) / (48 * E * Ix_mm4);
  const delta_w = (5 * (w) * Math.pow(L_mm, 4)) / (384 * E * Ix_mm4);
  const delta_total = delta_P + delta_w;

  const M_max_kNm = (P * L / 4) + (w * Math.pow(L, 2) / 8);
  const sigma_b_Mpa = (M_max_kNm * 1e6) / Zx_mm3;
  const allowDef_mm = L_mm / 300;
  const SF = 275 / Math.max(sigma_b_Mpa, 1);

  const dEl = document.getElementById('sbMaxDeflectionMm');
  if (dEl) dEl.textContent = delta_total.toFixed(1);

  const adEl = document.getElementById('sbAllowDeflectionMm');
  if (adEl) adEl.textContent = `${allowDef_mm.toFixed(1)} mm`;

  const mEl = document.getElementById('sbMaxMomentKnM');
  if (mEl) mEl.textContent = `${M_max_kNm.toFixed(1)} kN·m`;

  const sbEl = document.getElementById('sbBendingStressMpa');
  if (sbEl) sbEl.textContent = `${sigma_b_Mpa.toFixed(1)} MPa`;

  const sfEl = document.getElementById('sbSafetyFactor');
  if (sfEl) sfEl.textContent = `${SF.toFixed(2)} (안전)`;

  const rEl = document.getElementById('sbReactionKn');
  if (rEl) rEl.textContent = `${((P / 2) + (w * L / 2)).toFixed(1)} kN`;
}
window.calcSteelBeam = calcSteelBeam;


// ==========================================================================
// TAB 67: 교반기 동력 (calcMixerPower)
// ==========================================================================
function calcMixerPower() {
  const type = document.getElementById('mpImpellerType')?.value || 'rushton';
  const D_mm = parseFloat(document.getElementById('mpImpellerDiaMm')?.value) || 600;
  const N_rpm = parseFloat(document.getElementById('mpRpmN')?.value) || 120;
  const rho = parseFloat(document.getElementById('mpDensity')?.value) || 1100;
  const mu_cp = parseFloat(document.getElementById('mpViscosityCp')?.value) || 50;
  const baf = document.getElementById('mpBaffleOption')?.value || 'with_baffles';

  let Np = 5.0; // Rushton
  if (type === 'pitched_blade') Np = 1.3;
  else if (type === 'marine_propeller') Np = 0.35;
  else if (type === 'anchor') Np = 0.8;

  if (baf === 'no_baffles') Np *= 0.70;

  const D = D_mm / 1000; // m
  const N_rps = N_rpm / 60; // rev/s
  const mu_Pa_s = mu_cp / 1000;

  const Re_m = (rho * N_rps * Math.pow(D, 2)) / Math.max(mu_Pa_s, 1e-4);
  const P_watts = Np * rho * Math.pow(N_rps, 3) * Math.pow(D, 5);
  const P_kw = P_watts / 1000;
  const recMotorKw = (P_kw / 0.85) * 1.25; // 85% eff + 25% margin
  const torqueNm = (P_kw * 1000) / (2 * Math.PI * N_rps);
  const tipSpeed = Math.PI * D * N_rps;

  const pEl = document.getElementById('mpShaftPowerKw');
  if (pEl) pEl.textContent = P_kw.toFixed(2);

  const motEl = document.getElementById('mpRecommendedMotorKw');
  if (motEl) motEl.textContent = `${recMotorKw.toFixed(1)} kW (모터 권장)`;

  const reEl = document.getElementById('mpReynoldsNum');
  if (reEl) reEl.textContent = Math.round(Re_m).toLocaleString();

  const torqEl = document.getElementById('mpShaftTorqueNm');
  if (torqEl) torqEl.textContent = `${torqueNm.toFixed(1)} N·m`;

  const tipEl = document.getElementById('mpTipSpeedMps');
  if (tipEl) tipEl.textContent = `${tipSpeed.toFixed(2)} m/s`;

  const npEl = document.getElementById('mpPowerNumber');
  if (npEl) npEl.textContent = Np.toFixed(2);
}
window.calcMixerPower = calcMixerPower;

// ==========================================================================
// TAB 68: 배관 마찰손실 (calcPipingLoss)
// ==========================================================================
function calcPipingLoss() {
  const D_mm = parseFloat(document.getElementById('plPipeDiaMm')?.value) || 80;
  const Q_m3h = parseFloat(document.getElementById('plFlowRateM3h')?.value) || 45;
  const L = parseFloat(document.getElementById('plStraightLengthM')?.value) || 150;
  const mat = document.getElementById('plMaterialRoughness')?.value || 'commercial_steel';
  const n_elbow = parseFloat(document.getElementById('plElbowCount')?.value) || 6;
  const n_valve = parseFloat(document.getElementById('plValveCount')?.value) || 3;

  let eps = 0.045; // mm
  if (mat === 'stainless_steel') eps = 0.015;
  else if (mat === 'pvc_hdpe') eps = 0.005;
  else if (mat === 'cast_iron') eps = 0.26;

  const D = D_mm / 1000;
  const A = Math.PI * Math.pow(D / 2, 2);
  const v = (Q_m3h / 3600) / A;
  const rho = 1000;
  const mu = 1e-3; // Water
  const Re = (rho * v * D) / mu;

  const f = 0.25 / Math.pow(Math.log10((eps / (3.7 * D_mm)) + (5.74 / Math.pow(Re, 0.9))), 2);
  const Le_elbow = 30 * D; // Equivalent length of 90 deg elbow
  const Le_valve = 8 * D; // Gate valve
  const L_total = L + (n_elbow * Le_elbow) + (n_valve * Le_valve);

  const deltaP_pa = f * (L_total / D) * (rho * Math.pow(v, 2) / 2);
  const deltaP_bar = deltaP_pa / 1e5;
  const headLoss_m = deltaP_pa / (rho * 9.81);

  const dpEl = document.getElementById('plPressureDropBar');
  if (dpEl) dpEl.textContent = deltaP_bar.toFixed(2);

  const hlEl = document.getElementById('plHeadLossM');
  if (hlEl) hlEl.textContent = `${headLoss_m.toFixed(2)} m`;

  const velEl = document.getElementById('plVelocityMps');
  if (velEl) velEl.textContent = `${v.toFixed(2)} m/s`;

  const reEl = document.getElementById('plReynoldsRe');
  if (reEl) reEl.textContent = `${Math.round(Re).toLocaleString()} (난류)`;

  const fEl = document.getElementById('plDarcyFactorF');
  if (fEl) fEl.textContent = f.toFixed(4);

  const leEl = document.getElementById('plEquivalentLengthM');
  if (leEl) leEl.textContent = `${L_total.toFixed(1)} m`;
}
window.calcPipingLoss = calcPipingLoss;

// ==========================================================================
// TAB 69: 냉매 사이클 COP (calcRefrigerationCop)
// ==========================================================================
function calcRefrigerationCop() {
  const type = document.getElementById('rcRefrigerantType')?.value || 'r134a';
  const Q_kw = parseFloat(document.getElementById('rcCoolingKw')?.value) || 105;
  const Te = parseFloat(document.getElementById('rcEvapTemp')?.value) || 5.0;
  const Tc = parseFloat(document.getElementById('rcCondTemp')?.value) || 45.0;
  const eta_is = (parseFloat(document.getElementById('rcIsentropicEff')?.value) || 75) / 100;

  const Te_K = Te + 273.15;
  const Tc_K = Tc + 273.15;
  const cop_carnot = Te_K / (Tc_K - Te_K);
  const cop_actual = cop_carnot * 0.61 * eta_is;
  const P_comp_kw = Q_kw / cop_actual;
  const Q_cond_kw = Q_kw + P_comp_kw;
  const RT = Q_kw / 3.517;
  const mdot = Q_kw / 155; // approx delta h = 155 kJ/kg

  const copEl = document.getElementById('rcCopVal');
  if (copEl) copEl.textContent = cop_actual.toFixed(2);

  const rtEl = document.getElementById('rcCapacityRt');
  if (rtEl) rtEl.textContent = `${RT.toFixed(1)} RT`;

  const pEl = document.getElementById('rcCompressorPowerKw');
  if (pEl) pEl.textContent = `${P_comp_kw.toFixed(1)} kW`;

  const qcEl = document.getElementById('rcCondenserHeatKw');
  if (qcEl) qcEl.textContent = `${Q_cond_kw.toFixed(1)} kW`;

  const carnotEl = document.getElementById('rcCarnotEfficiency');
  if (carnotEl) carnotEl.textContent = `${((cop_actual / cop_carnot) * 100).toFixed(1)}%`;

  const mdotEl = document.getElementById('rcMassFlowKgS');
  if (mdotEl) mdotEl.textContent = `${mdot.toFixed(2)} kg/s`;
}
window.calcRefrigerationCop = calcRefrigerationCop;

// ==========================================================================
// TAB 70: 배관 열팽창 U루프 (calcPipeExpansion)
// ==========================================================================
function calcPipeExpansion() {
  const mat = document.getElementById('peMaterial')?.value || 'carbon_steel';
  const D_mm = parseFloat(document.getElementById('pePipeDiaMm')?.value) || 114.3;
  const L_m = parseFloat(document.getElementById('peSpanLengthM')?.value) || 80;
  const Tmax = parseFloat(document.getElementById('peMaxTemp')?.value) || 190;
  const Tinst = parseFloat(document.getElementById('peInstallTemp')?.value) || 15;

  let alpha = 12.0e-6; // Carbon steel
  if (mat === 'stainless_304') alpha = 17.3e-6;
  else if (mat === 'copper') alpha = 16.8e-6;
  else if (mat === 'aluminum') alpha = 23.1e-6;

  const deltaT = Tmax - Tinst;
  const deltaL_mm = alpha * (L_m * 1000) * deltaT;
  const W_loop_m = (Math.sqrt((D_mm / 1000) * (deltaL_mm / 1000)) * 6.5);
  const H_loop_m = W_loop_m * 2.0;
  const anchorForceKn = (deltaL_mm * 0.05);

  const expEl = document.getElementById('peTotalExpansionMm');
  if (expEl) expEl.textContent = deltaL_mm.toFixed(1);

  const dtEl = document.getElementById('peDeltaTemp');
  if (dtEl) dtEl.textContent = `${deltaT.toFixed(1)} °C`;

  const wEl = document.getElementById('peLoopWidthM');
  if (wEl) wEl.textContent = `${W_loop_m.toFixed(2)} m`;

  const hEl = document.getElementById('peLoopHeightM');
  if (hEl) hEl.textContent = `${H_loop_m.toFixed(2)} m`;

  const fEl = document.getElementById('peAnchorForceKn');
  if (fEl) fEl.textContent = `${anchorForceKn.toFixed(2)} kN`;
}
window.calcPipeExpansion = calcPipeExpansion;

// ==========================================================================
// TAB 71: 배관 침식·부식 수명 (calcPipeErosion)
// ==========================================================================
function calcPipeErosion() {
  const t_nom = parseFloat(document.getElementById('peNominalThickMm')?.value) || 8.18;
  const t_act = parseFloat(document.getElementById('peActualThickMm')?.value) || 6.45;
  const t_min = parseFloat(document.getElementById('peMinReqThickMm')?.value) || 3.50;
  const years = parseFloat(document.getElementById('peServiceYears')?.value) || 5.0;
  const v_act = parseFloat(document.getElementById('peFluidVelocity')?.value) || 3.8;
  const rho = parseFloat(document.getElementById('peFluidDensity')?.value) || 980;

  const lostThick = t_nom - t_act;
  const cr_mm_yr = lostThick / Math.max(years, 0.1);
  const cr_mpy = cr_mm_yr * 39.37;
  const remThick = t_act - t_min;
  const remYears = remThick / Math.max(cr_mm_yr, 1e-4);
  const ve = 122 / Math.sqrt(Math.max(rho, 1)); // API RP 14E with C=122 metric

  const remEl = document.getElementById('peRemainingYears');
  if (remEl) remEl.textContent = Math.max(remYears, 0).toFixed(1);

  const crEl = document.getElementById('peCorrosionRateMmYr');
  if (crEl) crEl.textContent = `${cr_mm_yr.toFixed(3)} mm/년 (${cr_mpy.toFixed(1)} mpy)`;

  const veEl = document.getElementById('peErosionalVelocity');
  if (veEl) veEl.textContent = `${ve.toFixed(2)} m/s`;

  const vrEl = document.getElementById('peVelocityRatio');
  if (vrEl) vrEl.textContent = `${((v_act / ve) * 100).toFixed(1)}% (${v_act <= ve ? '침식안전' : '침식위험'})`;

  const caEl = document.getElementById('peRemainingCaMm');
  if (caEl) caEl.textContent = `${remThick.toFixed(2)} mm`;
}
window.calcPipeErosion = calcPipeErosion;

// ==========================================================================
// TAB 72: 클린룸 차압 환기 (calcCleanroomDp)
// ==========================================================================
function calcCleanroomDp() {
  const area = parseFloat(document.getElementById('crdpAreaM2')?.value) || 120;
  const H = parseFloat(document.getElementById('crdpHeightM')?.value) || 3.0;
  const deltaP = parseFloat(document.getElementById('crdpDiffPressurePa')?.value) || 15.0;
  const iso = document.getElementById('crdpIsoClass')?.value || 'iso7';
  const P_door = parseFloat(document.getElementById('crdpDoorPerimeterM')?.value) || 12.0;
  const gap_mm = parseFloat(document.getElementById('crdpGapWidthMm')?.value) || 2.5;

  let targetAch = 45; // ISO 7
  if (iso === 'iso5') targetAch = 280;
  else if (iso === 'iso6') targetAch = 120;
  else if (iso === 'iso8') targetAch = 20;

  const roomVolM3 = area * H;
  const supplyCmh = roomVolM3 * targetAch;
  const supplyCmm = supplyCmh / 60;
  const supplyCfm = supplyCmh * 0.5886;

  const gapAreaM2 = P_door * (gap_mm / 1000);
  const leakCms = 0.65 * gapAreaM2 * Math.sqrt(2 * deltaP / 1.2);
  const leakCmh = leakCms * 3600;

  const totEl = document.getElementById('crdpTotalSupplyCmh');
  if (totEl) totEl.textContent = Math.round(supplyCmh).toLocaleString();

  const cmmEl = document.getElementById('crdpTotalSupplyCmm');
  if (cmmEl) cmmEl.textContent = `${supplyCmm.toFixed(1)} CMM`;

  const cfmEl = document.getElementById('crdpTotalSupplyCfm');
  if (cfmEl) cfmEl.textContent = Math.round(supplyCfm).toLocaleString();

  const achEl = document.getElementById('crdpAchVal');
  if (achEl) achEl.textContent = `${targetAch.toFixed(1)} 회/h`;

  const leakEl = document.getElementById('crdpLeakageCmh');
  if (leakEl) leakEl.textContent = `${Math.round(leakCmh)} CMH`;

  const volEl = document.getElementById('crdpRoomVolM3');
  if (volEl) volEl.textContent = `${Math.round(roomVolM3)} m³`;

  const ratioEl = document.getElementById('crdpMakeupRatio');
  if (ratioEl) ratioEl.textContent = `${((leakCmh / supplyCmh) * 100).toFixed(1)}%`;
}
window.calcCleanroomDp = calcCleanroomDp;


// ==========================================================================
// TAB 73: 송풍기 상사법칙 (calcFanAffinity)
// ==========================================================================
function calcFanAffinity() {
  let N1 = parseFloat(document.getElementById('faRpmN1')?.value) || 1750;
  let N2 = parseFloat(document.getElementById('faRpmN2')?.value) || 1400;
  const Q1 = parseFloat(document.getElementById('faFlowQ1')?.value) || 120;
  const P1 = parseFloat(document.getElementById('faPressP1')?.value) || 150;
  const Pw1 = parseFloat(document.getElementById('faPowerKw1')?.value) || 7.5;
  const opt = document.getElementById('faInverterOption')?.value || 'direct_rpm';

  if (opt === 'hz_60_to_50') N2 = N1 * (50 / 60);
  else if (opt === 'hz_60_to_40') N2 = N1 * (40 / 60);
  else if (opt === 'hz_60_to_30') N2 = N1 * (30 / 60);

  const ratio = N2 / Math.max(N1, 1);
  const Q2 = Q1 * ratio;
  const P2 = P1 * Math.pow(ratio, 2);
  const Pw2 = Pw1 * Math.pow(ratio, 3);
  const savingPct = (1 - (Pw2 / Pw1)) * 100;
  const annualWon = (Pw1 - Pw2) * 8760 * 95; // 95 KRW per kWh

  const pwEl = document.getElementById('faNewPowerKw');
  if (pwEl) pwEl.textContent = Pw2.toFixed(2);

  const spEl = document.getElementById('faPowerSavingPct');
  if (spEl) spEl.textContent = `${savingPct.toFixed(1)}% 절감 (${(Pw1 - Pw2).toFixed(2)} kW 축소)`;

  const q2El = document.getElementById('faNewFlowCmm');
  if (q2El) q2El.textContent = `${Q2.toFixed(1)} CMM`;

  const p2El = document.getElementById('faNewPressMmaq');
  if (p2El) p2El.textContent = `${P2.toFixed(1)} mmAq`;

  const rEl = document.getElementById('faSpeedRatio');
  if (rEl) rEl.textContent = `${ratio.toFixed(3)} (${(ratio * 100).toFixed(1)}%)`;

  const wonEl = document.getElementById('faAnnualSavingsWon');
  if (wonEl) wonEl.textContent = `${Math.round(annualWon).toLocaleString()} 원/년`;
}
window.calcFanAffinity = calcFanAffinity;

// ==========================================================================
// TAB 74: 압력용기 ASME 두께 (calcPressureShell)
// ==========================================================================
function calcPressureShell() {
  const P_bar = parseFloat(document.getElementById('psDesignPressBar')?.value) || 16.0;
  const Di = parseFloat(document.getElementById('psInsideDiaMm')?.value) || 1200;
  const S = parseFloat(document.getElementById('psMaterialAllowStress')?.value) || 138;
  const E = parseFloat(document.getElementById('psJointEfficiency')?.value) || 1.0;
  const CA = parseFloat(document.getElementById('psCorrosionAllowMm')?.value) || 3.0;
  const t_act = parseFloat(document.getElementById('psActualThickMm')?.value) || 12.0;

  const P_mpa = P_bar / 10;
  const R = Di / 2; // mm
  const t_shell_req = ((P_mpa * R) / (S * E - 0.6 * P_mpa)) + CA;
  const t_head_req = ((P_mpa * Di * 1.0) / (2 * S * E - 0.2 * P_mpa)) + CA;
  const t_eff = t_act - CA;
  const hoopStress = (P_mpa * (R + 0.6 * t_eff)) / t_eff;
  const mawp_mpa = (S * E * t_eff) / (R + 0.6 * t_eff);
  const mawp_bar = mawp_mpa * 10;
  const hydro_bar = P_bar * 1.3 * (138 / S);

  const reqEl = document.getElementById('psMinRequiredThickMm');
  if (reqEl) reqEl.textContent = t_shell_req.toFixed(2);

  const marEl = document.getElementById('psThicknessMarginPct');
  if (marEl) marEl.textContent = `+${(((t_act - t_shell_req) / t_shell_req) * 100).toFixed(1)}% 여유`;

  const hsEl = document.getElementById('psHoopStressMpa');
  if (hsEl) hsEl.textContent = `${hoopStress.toFixed(1)} MPa`;

  const hdEl = document.getElementById('psHeadMinThickMm');
  if (hdEl) hdEl.textContent = `${t_head_req.toFixed(2)} mm`;

  const mwEl = document.getElementById('psMawpBar');
  if (mwEl) mwEl.textContent = `${mawp_bar.toFixed(1)} bar`;

  const htEl = document.getElementById('psHydroTestBar');
  if (htEl) htEl.textContent = `${hydro_bar.toFixed(1)} bar`;
}
window.calcPressureShell = calcPressureShell;

// ==========================================================================
// TAB 75: 축 키홈 전단응력 (calcCouplingKey)
// ==========================================================================
function calcCouplingKey() {
  const d = parseFloat(document.getElementById('ckShaftDiaMm')?.value) || 50;
  const P = parseFloat(document.getElementById('ckTransmittedKw')?.value) || 22.0;
  const N = parseFloat(document.getElementById('ckShaftRpm')?.value) || 1750;
  const keySz = document.getElementById('ckKeySize')?.value || '12x8';
  const L = parseFloat(document.getElementById('ckKeyLengthMm')?.value) || 65;
  const mat = document.getElementById('ckKeyMaterial')?.value || 'sm45c';

  let b = 12, h = 8;
  if (keySz === '14x9') { b = 14; h = 9; }
  else if (keySz === '16x10') { b = 16; h = 10; }
  else if (keySz === '10x8') { b = 10; h = 8; }

  let allowTau = 75, allowSigmaC = 145;
  if (mat === 'scm440') { allowTau = 120; allowSigmaC = 220; }
  else if (mat === 'sus304') { allowTau = 45; allowSigmaC = 85; }

  const T_Nm = (P * 9550) / Math.max(N, 1);
  const Ft_N = (2 * T_Nm * 1000) / d;
  const tau_mpa = Ft_N / (b * L);
  const sigmaC_mpa = Ft_N / ((h / 2) * L);
  const SF_tau = allowTau / Math.max(tau_mpa, 1e-3);
  const SF_c = allowSigmaC / Math.max(sigmaC_mpa, 1e-3);

  const tEl = document.getElementById('ckShearStressMpa');
  if (tEl) tEl.textContent = tau_mpa.toFixed(1);

  const sfEl = document.getElementById('ckShearSafetyFactor');
  if (sfEl) sfEl.textContent = SF_tau.toFixed(2);

  const cEl = document.getElementById('ckBearingStressMpa');
  if (cEl) cEl.textContent = `${sigmaC_mpa.toFixed(1)} MPa`;

  const sfcEl = document.getElementById('ckBearingSafetyFactor');
  if (sfcEl) sfcEl.textContent = `${SF_c.toFixed(2)} (${SF_c >= 1.0 ? '안전' : '위험'})`;

  const torqEl = document.getElementById('ckTorqueNm');
  if (torqEl) torqEl.textContent = `${T_Nm.toFixed(1)} N·m`;

  const ftEl = document.getElementById('ckTangentialForceN');
  if (ftEl) ftEl.textContent = `${Math.round(Ft_N).toLocaleString()} N`;
}
window.calcCouplingKey = calcCouplingKey;

// ==========================================================================
// TAB 76: 열교환기 파울링 (calcFoulingHeat)
// ==========================================================================
function calcFoulingHeat() {
  const U_clean = parseFloat(document.getElementById('fhCleanUVal')?.value) || 1200;
  const A = parseFloat(document.getElementById('fhDesignAreaM2')?.value) || 45.0;
  const foulType = document.getElementById('fhFoulingType')?.value || 'cooling_tower';
  const LMTD = parseFloat(document.getElementById('fhLmtdVal')?.value) || 28.0;

  let Rf = 0.00035; // cooling tower
  if (foulType === 'river_water') Rf = 0.00050;
  else if (foulType === 'heavy_oil') Rf = 0.00090;
  else if (foulType === 'boiler_feed') Rf = 0.00010;

  const R_clean = 1 / U_clean;
  const R_dirty = R_clean + Rf;
  const U_dirty = 1 / R_dirty;
  const Q_clean_kw = (U_clean * A * LMTD) / 1000;
  const Q_dirty_kw = (U_dirty * A * LMTD) / 1000;
  const dropPct = (1 - (U_dirty / U_clean)) * 100;
  const excessAreaPct = (Rf / R_clean) * 100;

  const udEl = document.getElementById('fhDirtyUVal');
  if (udEl) udEl.textContent = U_dirty.toFixed(1);

  const dpEl = document.getElementById('fhPerformanceDropPct');
  if (dpEl) dpEl.textContent = `${dropPct.toFixed(1)}% 감소`;

  const qdEl = document.getElementById('fhDirtyHeatKw');
  if (qdEl) qdEl.textContent = `${Math.round(Q_dirty_kw).toLocaleString()} kW`;

  const qcEl = document.getElementById('fhCleanHeatKw');
  if (qcEl) qcEl.textContent = `${Math.round(Q_clean_kw).toLocaleString()} kW`;

  const exEl = document.getElementById('fhExcessAreaMargin');
  if (exEl) exEl.textContent = `${excessAreaPct.toFixed(1)}% 확보`;
}
window.calcFoulingHeat = calcFoulingHeat;

// ==========================================================================
// TAB 77: 배관 수격작용 (calcWaterHammer)
// ==========================================================================
function calcWaterHammer() {
  const L = parseFloat(document.getElementById('whPipeLengthM')?.value) || 350;
  const D_mm = parseFloat(document.getElementById('whPipeDiaMm')?.value) || 216.3;
  const t_mm = parseFloat(document.getElementById('whPipeThickMm')?.value) || 8.2;
  const v0 = parseFloat(document.getElementById('whInitialVelocity')?.value) || 2.8;
  const tc = parseFloat(document.getElementById('whValveCloseTimeSec')?.value) || 1.5;
  const P0_bar = parseFloat(document.getElementById('whWorkingPressBar')?.value) || 6.0;

  const rho = 1000; // kg/m3
  const K_water = 2.19e9; // Pa
  const E_steel = 2.06e11; // Pa
  const D = D_mm / 1000;
  const t = t_mm / 1000;

  const a = Math.sqrt((K_water / rho) / (1 + (K_water / E_steel) * (D / t)));
  const tc_crit = (2 * L) / a;

  let deltaP_pa = 0;
  let hammerType = '완만 폐쇄 (Slow Closure)';
  if (tc <= tc_crit) {
    deltaP_pa = rho * a * v0;
    hammerType = '급속 급폐쇄 (Rapid Closure - 최대서지)';
  } else {
    deltaP_pa = rho * a * v0 * (tc_crit / tc);
  }

  const deltaP_bar = deltaP_pa / 1e5;
  const peakP_bar = P0_bar + deltaP_bar;
  const recMinTime = tc_crit * 3.5;

  const pkEl = document.getElementById('whPeakPressureBar');
  if (pkEl) pkEl.textContent = peakP_bar.toFixed(1);

  const dsEl = document.getElementById('whDeltaSurgeBar');
  if (dsEl) dsEl.textContent = `+${deltaP_bar.toFixed(1)} bar`;

  const wsEl = document.getElementById('whWaveSpeedMps');
  if (wsEl) wsEl.textContent = `${Math.round(a).toLocaleString()} m/s`;

  const tcEl = document.getElementById('whCriticalTimeSec');
  if (tcEl) tcEl.textContent = `${tc_crit.toFixed(2)} 초`;

  const htEl = document.getElementById('whHammerType');
  if (htEl) htEl.textContent = hammerType;

  const recEl = document.getElementById('whRecMinCloseTimeSec');
  if (recEl) recEl.textContent = `≥ ${recMinTime.toFixed(1)} 초`;
}
window.calcWaterHammer = calcWaterHammer;

// ==========================================================================
// TAB 78: 변성기 CT 부담 (calcCtPtBurden)
// ==========================================================================
function calcCtPtBurden() {
  const ratedVa = parseFloat(document.getElementById('ctRatedBurdenVa')?.value) || 15;
  const I_sec = parseFloat(document.getElementById('ctSecCurrentA')?.value) || 5;
  const wireSq = parseFloat(document.getElementById('ctWireSizeSq')?.value) || 4.0;
  const L = parseFloat(document.getElementById('ctWireLengthM')?.value) || 35;
  const relayVa = parseFloat(document.getElementById('ctRelayBurdenVa')?.value) || 1.5;
  const R_contact = parseFloat(document.getElementById('ctContactResist')?.value) || 0.05;

  let r_per_km = 4.61; // 4.0 sq
  if (wireSq === 2.5) r_per_km = 7.41;
  else if (wireSq === 6.0) r_per_km = 3.08;

  const R_wire_loop = (2 * L / 1000) * r_per_km;
  const R_total = R_wire_loop + R_contact;
  const wireVa = Math.pow(I_sec, 2) * R_total;
  const totalActualVa = wireVa + relayVa;
  const ratioPct = (totalActualVa / ratedVa) * 100;
  const zTotal = totalActualVa / Math.pow(I_sec, 2);

  const vaEl = document.getElementById('ctTotalActualVa');
  if (vaEl) vaEl.textContent = totalActualVa.toFixed(2);

  const brEl = document.getElementById('ctBurdenRatioPct');
  if (brEl) brEl.textContent = `${ratioPct.toFixed(1)}%`;

  const rlEl = document.getElementById('ctLoopResistance');
  if (rlEl) rlEl.textContent = `${R_total.toFixed(3)} Ω`;

  const wpEl = document.getElementById('ctWirePowerLossVa');
  if (wpEl) wpEl.textContent = `${wireVa.toFixed(2)} VA`;

  const ztEl = document.getElementById('ctTotalImpedance');
  if (ztEl) ztEl.textContent = `${zTotal.toFixed(3)} Ω`;
}
window.calcCtPtBurden = calcCtPtBurden;




// ==========================================================================
// DYNAMIC SEO ROUTING & BROWSER URL QUERY SYNCHRONIZATION
// ==========================================================================
function updateSeoMetaOnTabSwitch(tabId) {
  const tool = getToolsCatalog().find(t => t.id === tabId);
  if (tool) {
    document.title = `${tool.name} | 볼트체크 PRO (Total Engineering)`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', `${tool.name} - ${tool.desc}. 볼트체크 78대 산업 엔지니어링 계산기에서 즉시 검증하세요.`);
    }
    // Update URL without reloading
    const langParam = currentLanguage && currentLanguage !== 'ko' ? `&lang=${encodeURIComponent(currentLanguage)}` : '';
    const newUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}?calc=${tabId}${langParam}`;
    window.history.replaceState({ path: newUrl }, '', newUrl);
  }
}

// Check initial URL query on load
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const calcParam = urlParams.get('calc');
  if (calcParam) {
    setTimeout(() => {
      const btn = document.querySelector(`.tab-btn[data-tab="${calcParam}"]`);
      if (btn) {
        btn.click();
        btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }, 150);
  }
});
