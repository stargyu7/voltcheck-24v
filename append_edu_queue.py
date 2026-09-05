# -*- coding: utf-8 -*-
import json
from pathlib import Path

BASE_DIR = Path(r"c:\이규정 개인 프로젝트")
QUEUE_FILE = BASE_DIR / "shorts_content_queue.json"

with open(QUEUE_FILE, "r", encoding="utf-8") as f:
    data = json.load(f)

new_edu_items = [
    {
        "id": "edu_s1_420ma_loop",
        "type": "educational_electrical",
        "file": "shorts_edu_s1_420ma_loop.mp4",
        "title": "Why 4-20mA NEVER Drops Signal Over 500 Meters! ⚡ #Shorts",
        "description": "Why do automation engineers NEVER use 0-10V for long sensor runs?\nWire resistance distorts voltage over 50m, but 4-20mA delivers exact current over 500m!\nKirchhoff's loop law & transmitter compliance voltage explained in 50 seconds.\n\nFree 3-second 4-20mA loop & burden resistance calculator:\n👉 https://voltcheck24.com/?calc=analog_loop\n\n#instrumentation #plc #electrician #420ma #automation #electricalengineering #voltcheck #Shorts",
        "comment": "⚡ Instrumentation engineers: What loop burden resistance do you use at your PLC analog input?\n250 ohms (1-5V) or 500 ohms (2-10V)? Drop your shop standard below! 👇\n(Free 4-20mA loop calculator: https://voltcheck24.com/?calc=analog_loop )",
        "tags": ["instrumentation", "plc", "electrician", "4-20ma", "automation", "electrical engineering", "voltcheck", "Shorts"],
        "status": "pending",
        "publish_at": "2026-09-10 22:05:00 KST"
    },
    {
        "id": "edu_s2_vfd_reflected_wave",
        "type": "educational_motors",
        "file": "shorts_edu_s2_vfd_reflected_wave.mp4",
        "title": "The 1,500V Reflected Spike Destroying Your VFD Motor! ⚡ #Shorts",
        "description": "Why does a 480V VFD inverter create 1,500V ringing spikes at motor terminals?\nFast IGBT switching (dv/dt > 10,000 V/µs) and cable-to-motor surge impedance mismatch!\nHow to calculate critical cable distance and size dv/dt reactors in 50 seconds.\n\nFree industrial motor & drive calculator:\n👉 https://voltcheck24.com/?calc=motor_current\n\n#vfd #electricmotor #electrician #electricalengineering #powerelectronics #inverter #voltcheck #Shorts",
        "comment": "⚡ Have you seen motor slot insulation burn out from VFD reflected waves?\nWhat cable length triggers a dv/dt filter in your specs? Discuss below! 👇\n(Free motor sizing tool: https://voltcheck24.com/?calc=motor_current )",
        "tags": ["vfd", "electric motor", "electrician", "electrical engineering", "power electronics", "inverter", "voltcheck", "Shorts"],
        "status": "pending",
        "publish_at": "2026-09-11 22:00:00 KST"
    },
    {
        "id": "edu_s3_shaft_stress_notch",
        "type": "educational_mechanical",
        "file": "shorts_edu_s3_shaft_stress_notch.mp4",
        "title": "The 0.5mm Notch That Snapped a $45,000 Drive Shaft! ⚙️ #Shorts",
        "description": "A tiny 0.5mm sharp shoulder radius snapped a $45,000 industrial drive shaft in 3 weeks!\nNeuber's stress concentration factor (Kt) multiplies shear stress by 320%.\nIncreasing fillet radius from 0.5mm to 3.0mm multiplies fatigue life 10-fold!\n\nFree mechanical shaft stress & fatigue calculator:\n👉 https://voltcheck24.com/\n\n#mechanicalengineering #machinist #fatigue #stressconcentration #solidworks #fea #voltcheck #Shorts",
        "comment": "⚙️ Machinists & designers: What minimum fillet radius do you mandate on rotating step shafts?\nShare your shop drawing rules below! 👇\n(Free mechanical design calculators: https://voltcheck24.com/ )",
        "tags": ["mechanical engineering", "machinist", "fatigue", "stress concentration", "solidworks", "fea", "voltcheck", "Shorts"],
        "status": "pending",
        "publish_at": "2026-09-11 22:05:00 KST"
    },
    {
        "id": "edu_s4_hydraulic_cavitation",
        "type": "educational_fluids",
        "file": "shorts_edu_s4_hydraulic_cavitation.mp4",
        "title": "Why Boiling Cold Oil Destroys Hydraulic Pumps! (Cavitation) 🛢️ #Shorts",
        "description": "How does cold room-temperature oil boil into 10,000 bar micro-jets?\nWhen pump inlet suction drops below fluid vapor pressure, oil spontaneously vaporizes!\nThe bubbles collapse violently, chewing stainless steel impellers into Swiss cheese.\n\nFree hydraulic pump NPSH & pipe sizing calculator:\n👉 https://voltcheck24.com/\n\n#hydraulics #fluidpower #mechanicalengineering #cavitation #pumps #piping #voltcheck #Shorts",
        "comment": "🛢️ Fluid power technicians: Have you torn down a pump destroyed by cavitation?\nWhat was the suction vacuum reading? Let's talk hydraulic troubleshooting below! 👇\n(Free hydraulic calculation tools: https://voltcheck24.com/ )",
        "tags": ["hydraulics", "fluid power", "mechanical engineering", "cavitation", "pumps", "piping", "voltcheck", "Shorts"],
        "status": "pending",
        "publish_at": "2026-09-12 22:00:00 KST"
    },
    {
        "id": "edu_s5_panel_dewpoint",
        "type": "educational_thermal",
        "file": "shorts_edu_s5_panel_dewpoint.mp4",
        "title": "Setting Enclosure AC Too Cold Blew Up a $50,000 PLC Rack! ❄️ #Shorts",
        "description": "Setting your electrical cabinet air conditioner to 18°C creates internal 'indoor rain'!\nWhen the factory floor is 32°C at 80% humidity, the dew point is 28.2°C.\nMoisture condenses out of thin air onto PLC racks, causing catastrophic short-circuit fires!\n\nFree electrical enclosure cooling & dew point calculator:\n👉 https://voltcheck24.com/\n\n#electrician #smartfactory #automation #plc #hvac #controlpanel #dewpoint #voltcheck #Shorts",
        "comment": "❄️ Control engineers: What thermostat setpoint do you lock on your panel AC units?\nDo you calculate ambient dew point? Drop your control panel safety tips below! 👇\n(Free enclosure cooling calculator: https://voltcheck24.com/ )",
        "tags": ["electrician", "smart factory", "automation", "plc", "hvac", "control panel", "dewpoint", "voltcheck", "Shorts"],
        "status": "pending",
        "publish_at": "2026-09-12 22:05:00 KST"
    },
    {
        "id": "edu_s6_robot_inertia_ratio",
        "type": "educational_robotics",
        "file": "shorts_edu_s6_robot_inertia_ratio.mp4",
        "title": "The 10:1 Inertia Trap: Why Robot Arms Shake Violently! 🤖 #Shorts",
        "description": "Why does a powerful servo motor shake like an earthquake when attached to a robotic arm?\nWhen load-to-rotor inertia ratio exceeds 10:1, velocity control loops hit mechanical resonance!\nHow a 5:1 planetary gearbox cuts reflected inertia by 25 times (i^2) for sub-millimeter precision.\n\nFree servo motor & robotic inertia calculator:\n👉 https://voltcheck24.com/\n\n#robotics #servomotor #motioncontrol #automation #engineering #mechatronics #voltcheck #Shorts",
        "comment": "🤖 Robotics engineers: What is the maximum inertia ratio (JL/JM) your motion controller allows?\n5:1, 10:1, or 30:1 with notch filters? Share your tuning experience below! 👇\n(Free servo inertia calculator: https://voltcheck24.com/ )",
        "tags": ["robotics", "servo motor", "motion control", "automation", "engineering", "mechatronics", "voltcheck", "Shorts"],
        "status": "pending",
        "publish_at": "2026-09-13 22:00:00 KST"
    }
]

existing_ids = {it.get("id") for it in data["queue"]}
added = 0
for it in new_edu_items:
    if it["id"] not in existing_ids:
        data["queue"].append(it)
        added += 1

with open(QUEUE_FILE, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

import sys
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", line_buffering=True)
    except Exception:
        pass

print(f"Successfully appended {added} new educational forensic shorts to queue! Total items: {len(data['queue'])}")
