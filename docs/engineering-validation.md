# Engineering Validation Notes

This document records the validation standard for VoltCheck Pro calculators.

## Calculator Trust Rules

- Keep calculation formulas separate from DOM rendering whenever a calculator is touched.
- Validate impossible inputs before calculation, including zero or negative length, diameter, voltage, efficiency, pressure, and density values.
- Show the applied assumptions near the result when a formula depends on approximations.
- Prefer manufacturer datasheets, legally adopted codes, and recognized standards over generic rules of thumb.
- Treat all outputs as engineering review aids, not as a substitute for certified design approval.

## Priority Test Coverage

Start with the calculators most likely to affect field decisions:

1. DC 24V voltage drop and terminal voltage margin
2. 4-20mA loop burden and transmitter voltage margin
3. SMPS/control power budget
4. 3-phase motor current and contactor sizing
5. RS-485 cable length, termination, and stub checks
6. Pipe friction loss and total head
7. Pressure vessel shell thickness
8. CT/PT burden

## Required Test Shape

Each calculator should have at least:

- One nominal case with a hand-verified expected result
- One boundary case near the warning/fail threshold
- One invalid-input case
- One unit conversion case when the calculator supports mixed units

## SEO And Claims

- Do not publish unverifiable ratings, review counts, or "No.1" claims.
- Keep the public tool count consistent across HTML metadata, app copy, manifest, README, sitemap, RSS, and share text.
- Give high-risk domains such as pressure vessels, battery fire safety, nuclear calculations, and lifting/hoist calculations clear limitation notices.
