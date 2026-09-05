const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const siteOrigin = 'https://voltcheck24.com';

const pages = [
  {
    slug: '4-20ma-loop-calculator', calc: 'tab-analogloop',
    title: '4-20mA Loop Voltage Margin Calculator | VoltCheck24',
    description: 'Check transmitter voltage margin, loop resistance, shunt resistor loading, and cable losses for industrial 4-20mA current loops.',
    secondary: ['tab-plcscaling', 'PLC Scaling Calculator'],
    formula: 'Loop margin = supply voltage - transmitter minimum voltage - cable resistance drop - barrier and shunt voltage drop.',
    use: 'Use this tool for pressure, flow, temperature, and level transmitters connected to PLC or DCS analog input cards.',
    note: 'Verify the transmitter minimum operating voltage, barrier entity parameters, shunt resistor tolerance, and worst-case supply voltage from manufacturer data.',
    faq: [['Why is 250 ohms common in a 4-20mA loop?', 'A 250 ohm shunt converts 4-20mA into 1-5V using Ohm’s law, which matches many analog input modules.'], ['What causes a 4-20mA loop to fail at 20mA?', 'The loop may run out of voltage compliance because cable, barrier, shunt, and device losses exceed the available supply margin.']]
  },
  {
    slug: 'plc-analog-scaling-calculator', calc: 'tab-plcscaling',
    title: 'PLC Analog Scaling Calculator for 4-20mA and ADC Inputs | VoltCheck24',
    description: 'Generate engineering-unit scaling formulas for 4-20mA, 0-10V, and common PLC ADC raw ranges used in industrial automation.',
    secondary: ['tab-analogloop', '4-20mA Loop Calculator'],
    formula: 'EU = EUmin + (Raw - Rawmin) x (EUmax - EUmin) / (Rawmax - Rawmin).',
    use: 'Use this page when commissioning Siemens, Rockwell, Mitsubishi, Omron, or custom PLC analog input ranges.',
    note: 'Confirm the card’s actual raw count range, under-range and over-range behavior, signal type, and engineering-unit limits before downloading code.',
    faq: [['Which raw range should I use?', 'Use the exact range documented for the installed analog input module, not a generic 12-bit or 16-bit assumption.'], ['Can I generate PLC code from the result?', 'The interactive calculator provides a scaling equation and vendor-oriented code guidance for commissioning.']]
  },
  {
    slug: 'rs485-termination-calculator', calc: 'tab-rs485',
    title: 'RS-485 Termination and Cable Distance Calculator | VoltCheck24',
    description: 'Estimate RS-485 and Modbus cable distance, baud-rate limits, node loading, stub length, and 120 ohm termination requirements.',
    secondary: ['tab-otethernet', 'Industrial OT Ethernet Calculator'],
    formula: 'The practical bus limit is evaluated from baud rate, cable length, node count, and maximum stub length against signal-integrity margins.',
    use: 'Use this tool when designing Modbus RTU, drive networks, remote I/O, meters, and multi-drop industrial serial buses.',
    note: 'Install termination only at the two physical ends of the trunk, keep stubs short, and follow the cable manufacturer’s impedance and shielding recommendations.',
    faq: [['Where should 120 ohm termination resistors go?', 'Place them at the two ends of the main bus trunk, not at every device or branch.'], ['What is the most common RS-485 wiring mistake?', 'Long T-shaped stubs, incorrect reference wiring, and termination placed in the middle of the bus are frequent causes of intermittent faults.']]
  },
  {
    slug: 'control-panel-cooling-calculator', calc: 'tab-cabinetcooling',
    title: 'Control Panel Cooling and Enclosure Heat Load Calculator | VoltCheck24',
    description: 'Calculate control cabinet heat load and select filter fans, air conditioners, or cooling capacity for industrial enclosures.',
    secondary: ['tab-hvacblower', 'HVAC Blower Calculator'],
    formula: 'Required cooling capacity is estimated from internal heat dissipation, ambient temperature, target enclosure temperature, and enclosure conditions.',
    use: 'Use this calculator for PLC panels, inverter cabinets, servo cabinets, battery equipment, and sealed industrial control boxes.',
    note: 'Include losses from power supplies, drives, contactors, transformers, and external heat transfer. Check dust, oil mist, IP rating, and altitude derating.',
    faq: [['When should I use a panel air conditioner?', 'Use an air conditioner when ambient temperature approaches or exceeds the target internal temperature, or when the enclosure must remain sealed.'], ['Should I calculate heat from motor output power?', 'Use the electrical losses that become heat inside the enclosure, not the full mechanical output power.']]
  },
  {
    slug: 'pneumatic-air-consumption-calculator', calc: 'tab-pneumatics',
    title: 'Pneumatic Cylinder Air Consumption Calculator | VoltCheck24',
    description: 'Calculate compressed-air consumption, cylinder flow demand, and compressor capacity for pneumatic actuators and automation machines.',
    secondary: ['tab-hydraulics', 'Hydraulic Cylinder Force Calculator'],
    formula: 'Air demand is derived from cylinder bore, rod size, stroke, operating pressure, cycles per minute, and actuator quantity.',
    use: 'Use this tool for pneumatic cylinders, valve manifolds, pick-and-place machines, clamps, and factory automation lines.',
    note: 'Add leakage, pressure drop, simultaneous operation, receiver volume, and compressor duty-cycle margin to the final plant-air specification.',
    faq: [['Why is air consumption shown as normal liters per minute?', 'Normal liters per minute references air volume at a defined standard condition, allowing compressor capacity to be compared consistently.'], ['Should the compressor equal the calculated flow exactly?', 'No. Include peak simultaneity, leakage, pressure losses, and reserve capacity.']]
  },
  {
    slug: 'pump-head-calculator', calc: 'tab-pumphead',
    title: 'Pump Head and Pipe Friction Loss Calculator | VoltCheck24',
    description: 'Calculate total dynamic head, Darcy-Weisbach pipe friction loss, fitting losses, and pump motor power for fluid systems.',
    secondary: ['tab-valvecv', 'Control Valve Cv Calculator'],
    formula: 'Total dynamic head combines static head, pipe friction, fitting losses, equipment pressure loss, and required terminal pressure.',
    use: 'Use this tool for cooling-water loops, process pumps, chemical lines, HVAC circulation, and industrial utility piping.',
    note: 'Confirm fluid density, viscosity, pipe roughness, elevation, fitting count, operating temperature, and pump efficiency before selecting a pump.',
    faq: [['What is total dynamic head?', 'It is the total pressure or energy the pump must provide to overcome elevation, friction, fittings, and system equipment losses.'], ['Why can a pump with enough flow still fail?', 'The pump may not provide sufficient head at the actual system operating point.']]
  },
  {
    slug: 'control-valve-cv-calculator', calc: 'tab-valvecv',
    title: 'Control Valve Cv and Kv Sizing Calculator | VoltCheck24',
    description: 'Estimate required control valve Cv or Kv, fluid velocity, pressure drop, and nominal valve size for industrial process systems.',
    secondary: ['tab-pumphead', 'Pump Head Calculator'],
    formula: 'Required Cv is calculated from flow, fluid specific gravity, and available pressure drop using standard valve sizing relationships.',
    use: 'Use this page for water, oil, compressed air, steam, and process control valve preliminary sizing.',
    note: 'Final selection requires cavitation, flashing, choked-flow, noise, actuator force, trim characteristic, and manufacturer sizing verification.',
    faq: [['Is a larger Cv always better?', 'No. An oversized valve can operate near its seat and lose controllability. Select a practical operating range around the normal flow point.'], ['What is the difference between Cv and Kv?', 'Cv is commonly expressed in US flow units while Kv uses metric flow conventions; the calculator provides the selected basis.']]
  },
  {
    slug: 'battery-thermal-calculator', calc: 'tab-batterythermal',
    title: 'Battery Pack Thermal Load and Cooling Calculator | VoltCheck24',
    description: 'Estimate battery pack I²R heat generation, C-rate thermal load, cooling capacity, and coolant flow for EV and industrial battery systems.',
    secondary: ['tab-agvbattery', 'AGV Battery Runtime Calculator'],
    formula: 'Resistive heat is estimated from current squared multiplied by pack internal resistance, with duty and cooling margin applied to the system load.',
    use: 'Use this calculator for battery packs, AGVs, ESS cabinets, rapid charging systems, and early-stage thermal management sizing.',
    note: 'Use measured resistance versus temperature and state of charge for final design. Include tab, busbar, connector, inverter, and imbalance losses.',
    faq: [['Why does heat increase rapidly at higher C-rate?', 'Resistive heat follows I²R, so doubling current can increase the resistive component by roughly four times.'], ['Does this replace cell-level thermal simulation?', 'No. It is a preliminary pack-level sizing tool; detailed CFD, abuse testing, and BMS validation remain necessary.']]
  },
  {
    slug: 'hvac-duct-pressure-loss-calculator', calc: 'tab-hvacblower',
    title: 'HVAC Duct Pressure Loss and Fan Motor Calculator | VoltCheck24',
    description: 'Estimate duct friction loss, total static pressure, airflow velocity, and fan motor power for HVAC and cleanroom ventilation systems.',
    secondary: ['tab-cleanroomdp', 'Cleanroom Differential Pressure Calculator'],
    formula: 'Total pressure loss combines straight-duct friction, fittings, filters, coils, dampers, and terminal-device losses.',
    use: 'Use this page for factory ventilation, cleanrooms, exhaust systems, process air, and industrial supply-air design.',
    note: 'Use certified fan curves at the actual airflow and static pressure. Check filter loading, leakage class, noise, temperature, and fire-damper requirements.',
    faq: [['Why does a dirty filter change fan selection?', 'Filter pressure drop rises as the filter loads, so the design point must include a clean-to-dirty operating range.'], ['Should I use nominal or actual airflow?', 'Use the required operating airflow at the design temperature and pressure condition.']]
  },
  {
    slug: 'servo-regen-resistor-calculator', calc: 'tab-servoregen',
    title: 'Servo Regeneration Energy and Braking Resistor Calculator | VoltCheck24',
    description: 'Calculate servo deceleration energy, DC-bus capacitor absorption, braking resistor power, and regeneration margin.',
    secondary: ['tab-motioninertia', 'Load Inertia Calculator'],
    formula: 'Kinetic energy is estimated from reflected inertia and angular speed, then compared with the drive DC-bus absorption capacity.',
    use: 'Use this calculator for servo axes, indexing tables, conveyors, winders, hoists, and repeated high-speed deceleration.',
    note: 'Check the servo drive manufacturer’s minimum resistance, peak power, continuous power, duty cycle, and thermal installation limits.',
    faq: [['Why is peak resistor power different from continuous power?', 'Deceleration energy may arrive in short pulses, while the resistor’s average thermal rating depends on repetition and duty cycle.'], ['Can the drive capacitor absorb all regeneration energy?', 'Sometimes, but the result depends on bus voltage, capacitance, speed, inertia, and deceleration profile.']]
  },
  {
    slug: 'safety-light-curtain-distance-calculator', calc: 'tab-safetylight',
    title: 'Safety Light Curtain Minimum Distance Calculator | VoltCheck24',
    description: 'Estimate minimum safety distance using detection resolution, approach speed, sensor response, and machine stopping time.',
    secondary: ['tab-iolinksafety', 'IO-Link and Safety Circuit Calculator'],
    formula: 'Minimum distance is derived from approach speed multiplied by total response and stopping time, plus the applicable intrusion and resolution factors.',
    use: 'Use this tool for robot cells, presses, conveyors, guarded automation, and machine access protection studies.',
    note: 'Final safety validation must use the current risk assessment, ISO 13855, ISO 13849-1 or IEC 62061, measured stopping time, and the certified safety device manual.',
    faq: [['Can I use a nominal machine stop time?', 'Use the worst measured stopping time, including brake wear, load variation, temperature, and control-system response.'], ['Does this calculator certify a safety function?', 'No. It supports preliminary distance review; a competent safety engineer must validate the complete safety function.']]
  },
  {
    slug: 'short-circuit-current-calculator', calc: 'tab-shortcircuit',
    title: 'Transformer Short-Circuit Current and Breaking Capacity Calculator | VoltCheck24',
    description: 'Estimate transformer-based short-circuit current and check preliminary breaker interrupting capacity for industrial power systems.',
    secondary: ['tab-transformer', 'Control Transformer Sizing Calculator'],
    formula: 'Prospective short-circuit current is estimated from transformer rating, impedance, system voltage, and upstream or cable impedance.',
    use: 'Use this tool for switchboards, control panels, MCCs, transformer secondaries, and breaker kA rating prechecks.',
    note: 'Final fault studies must follow the project method and current IEC 60909 or local standard, including motor contribution, X/R ratio, arc-flash requirements, and utility data.',
    faq: [['Why is transformer percent impedance important?', 'Lower impedance allows higher fault current; percent impedance is a key input for preliminary transformer-secondary fault calculations.'], ['Does the calculated current equal the breaker rating?', 'The breaker interrupting rating must be equal to or greater than the available fault current under the applicable certification and installation conditions.']]
  },
  {
    slug: 'cable-bending-radius-calculator', calc: 'tab-bendingradius',
    title: 'Cable Bending Radius and Cable Carrier Calculator | VoltCheck24',
    description: 'Calculate minimum cable bending radius and cable-carrier clearance for moving industrial cables and drag-chain applications.',
    secondary: ['tab-cabletable', 'Industrial Cable Gauge Table'],
    formula: 'Minimum bending radius is estimated from cable outer diameter and the manufacturer’s static or dynamic bend-radius multiplier.',
    use: 'Use this page for robot dress packs, machine tools, linear axes, cable carriers, and repeated flexing applications.',
    note: 'Always use the cable manufacturer’s dynamic rating. Check travel speed, acceleration, torsion, unsupported length, separation, and carrier fill.',
    faq: [['Is static bend radius suitable for a drag chain?', 'No. Moving applications require the manufacturer’s dynamic bend radius and cycle-life rating.'], ['How much free space should a cable carrier have?', 'Leave enough clearance for movement and heat, and follow the carrier and cable manufacturer’s fill and separation guidance.']]
  }
];

const inputChecklists = {
  '4-20ma-loop-calculator': ['Supply voltage and worst-case voltage', 'Transmitter minimum operating voltage', 'Cable length and conductor resistance', 'Barrier and shunt resistance'],
  'plc-analog-scaling-calculator': ['Signal type and range', 'PLC raw minimum and maximum', 'Engineering-unit minimum and maximum', 'Vendor card data sheet'],
  'rs485-termination-calculator': ['Baud rate and cable length', 'Node count and cable type', 'Maximum stub length', 'Trunk-end termination plan'],
  'control-panel-cooling-calculator': ['Panel dimensions and enclosure type', 'Internal electrical losses', 'Maximum ambient temperature', 'Target internal temperature'],
  'pneumatic-air-consumption-calculator': ['Cylinder bore, rod, and stroke', 'Operating pressure', 'Cycles per minute', 'Simultaneous actuator quantity'],
  'pump-head-calculator': ['Design flow rate', 'Static elevation or pressure', 'Pipe diameter and length', 'Fluid density and viscosity'],
  'control-valve-cv-calculator': ['Fluid and specific gravity', 'Normal and maximum flow', 'Available pressure drop', 'Temperature and phase condition'],
  'battery-thermal-calculator': ['Pack voltage and capacity', 'Charge or discharge C-rate', 'Internal resistance', 'Cooling target and duty cycle'],
  'hvac-duct-pressure-loss-calculator': ['Design airflow', 'Duct dimensions and length', 'Fittings, filters, and coils', 'Fan efficiency and operating temperature'],
  'servo-regen-resistor-calculator': ['Reflected inertia', 'Maximum speed', 'Deceleration time', 'DC bus voltage and capacitance'],
  'safety-light-curtain-distance-calculator': ['Detection resolution', 'Approach speed', 'Sensor and logic response time', 'Measured machine stopping time'],
  'short-circuit-current-calculator': ['Transformer kVA and voltage', 'Transformer percent impedance', 'Cable length and impedance', 'Breaker interrupting rating'],
  'cable-bending-radius-calculator': ['Cable outside diameter', 'Dynamic bend-radius multiplier', 'Travel stroke and speed', 'Carrier fill and separation']
};

function pageTemplate(page) {
  const url = `${siteOrigin}/en/${page.slug}/`;
  const faqJson = page.faq.map(([question, answer]) => ({
    '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer }
  }));
  const softwareJson = {
    '@context': 'https://schema.org', '@type': 'SoftwareApplication',
    name: page.title.split(' | ')[0], applicationCategory: 'EngineeringApplication',
    operatingSystem: 'Web', url, description: page.description,
    isAccessibleForFree: true, dateModified: '2026-09-05',
    publisher: { '@type': 'Organization', name: 'Total Engineering Lab', url: siteOrigin },
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
  };
  const faqPageJson = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqJson };
  const breadcrumbJson = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'VoltCheck24 Global', item: `${siteOrigin}/en/` },
      { '@type': 'ListItem', position: 2, name: page.title.split(' | ')[0], item: url }
    ]
  };
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${page.title}</title>
  <meta name="description" content="${page.description}">
  <link rel="canonical" href="${url}">
  <link rel="alternate" hreflang="en" href="${url}">
  <link rel="alternate" hreflang="ko" href="${siteOrigin}/?calc=${page.calc}">
  <link rel="alternate" hreflang="x-default" href="${url}">
  <meta property="og:title" content="${page.title}">
  <meta property="og:description" content="${page.description}">
  <meta property="og:url" content="${url}">
  <meta property="og:type" content="website">
  <link rel="stylesheet" href="/styles.css?v=2.2.0">
  <script type="application/ld+json">${JSON.stringify([softwareJson, faqPageJson, breadcrumbJson])}</script>
</head>
<body class="seo-page">
  <main class="seo-shell">
    <p class="seo-eyebrow">VoltCheck24 Engineering Calculator</p>
    <h1>${page.title.split(' | ')[0]}</h1>
    <p class="seo-lead">${page.description}</p>
    <div class="seo-actions">
      <a class="primary-action" href="/?calc=${page.calc}&amp;lang=en">Open Interactive Calculator</a>
      <a class="secondary-action" href="/?calc=${page.secondary[0]}&amp;lang=en">Open ${page.secondary[1]}</a>
    </div>
    <section class="seo-workflow">
      <h2>How to use this calculator</h2>
      <ol><li>Collect the values below from the equipment nameplate, data sheet, or field measurement.</li><li>Enter values using one consistent unit system and use worst-case operating conditions.</li><li>Review the result, margin, and engineering note before selecting hardware.</li><li>Cross-check the result with the related calculator and save the review for your project record.</li></ol>
    </section>
    <section class="seo-checklist">
      <h2>Input checklist</h2>
      <ul>${(inputChecklists[page.slug] || ['Equipment rating', 'Operating condition', 'Installation environment', 'Applicable project specification']).map(item => `<li>${item}</li>`).join('')}</ul>
    </section>
    <section class="seo-grid">
      <article><h2>Formula and Inputs</h2><p>${page.formula}</p></article>
      <article><h2>Industrial Use Cases</h2><p>${page.use}</p></article>
      <article><h2>Engineering Note</h2><p>${page.note}</p></article>
    </section>
    <section class="seo-faq"><h2>FAQ</h2>${page.faq.map(([q, a]) => `<h3>${q}</h3><p>${a}</p>`).join('')}</section>
    <nav class="seo-related" aria-label="Related engineering calculators"><strong>Related calculator:</strong> <a href="/?calc=${page.secondary[0]}&amp;lang=en">${page.secondary[1]}</a> · <a href="/en/">Browse all English calculators</a></nav>
    <p class="seo-disclaimer">Preliminary engineering reference only. Confirm final selections against current standards, project specifications, and manufacturer data.</p>
  </main>
</body>
</html>
`;
}

for (const page of pages) {
  const dir = path.join(root, 'en', page.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), pageTemplate(page), 'utf8');
}

const sitemapPath = path.join(root, 'sitemap.xml');
let sitemap = fs.readFileSync(sitemapPath, 'utf8');
for (const page of pages) {
  const url = `${siteOrigin}/en/${page.slug}/`;
  if (sitemap.includes(`<loc>${url}</loc>`)) continue;
  sitemap = sitemap.replace('</urlset>', `  <url><loc>${url}</loc><lastmod>2026-09-05</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>\n</urlset>`);
}
fs.writeFileSync(sitemapPath, sitemap, 'utf8');
console.log(`Generated ${pages.length} English calculator landing pages and updated sitemap.xml.`);
