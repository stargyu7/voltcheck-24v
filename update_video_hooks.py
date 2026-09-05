# -*- coding: utf-8 -*-
"""
=============================================================================
🔥 [VIRAL HOOK OVERHAUL ENGINE] Re-index Low-View Videos & Maximize CTR
=============================================================================
1. Revamps 7 low-view public videos with high-stakes curiosity gap titles,
   English global tags, and affiliate/calc backlinks to trigger YouTube feed re-recommendation.
2. Supercharges scheduled global videos with high-CTR formulas.
=============================================================================
"""

import sys
import time
from pathlib import Path
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", line_buffering=True)
    except Exception:
        pass

token_file = Path("youtube_token.json")
SCOPES = ["https://www.googleapis.com/auth/youtube.upload", "https://www.googleapis.com/auth/youtube.force-ssl"]
creds = Credentials.from_authorized_user_file(str(token_file), SCOPES)
if not creds.valid:
    if creds.expired and creds.refresh_token:
        creds.refresh(Request())
        with open(str(token_file), "w", encoding="utf-8") as f:
            f.write(creds.to_json())

youtube = build("youtube", "v3", credentials=creds)

# =============================================================================
# OPTIMIZATION DICTIONARY
# =============================================================================
REVAMP_TARGETS = [
    # --- 1. Low-View Public Videos to Revive ---
    {
        "id": "TAp99EeOSvI",
        "title": "Why Engineers NEVER Pull Cables Before Checking This! ⚡ ($100k Disaster) #Shorts",
        "description": (
            "At 2 AM, an automated manufacturing line tripped because of a 0.75 sq cable sizing mistake!\n"
            "Never pull long cable runs across the plant floor without verifying 24V line voltage drop.\n\n"
            "Free 3-second 24V voltage drop & wire size calculator:\n"
            "👉 https://voltcheck24.com/?calc=volt_drop_dc&lang=en\n\n"
            "⚡ Fix high ping & network lag spikes (GearUP Booster Free):\n"
            "👉 https://www.dpbolvw.net/click-101877144-17327791\n\n"
            "#electrician #smartfactory #automation #cablesizing #voltagedrop #plc #voltcheck #Shorts"
        ),
        "tags": ["electrician", "smart factory", "automation", "cable sizing", "voltage drop", "plc", "voltcheck", "Shorts"]
    },
    {
        "id": "iBzn3n_YIh4",
        "title": "The 24V Line Drop Mistake That Kills Optical Sensors at 2 AM! 💥 #Shorts",
        "description": (
            "Optical sensors stopped detecting parts in the middle of the night shift.\n"
            "Line voltage collapsed from 24V down to 18.2V over an 80m cable run!\n"
            "Upgrading from 1.5 sq to 4.0 sq wire restored normal operation in seconds.\n\n"
            "Free 3-second 24V voltage drop calculator:\n"
            "👉 https://voltcheck24.com/?calc=volt_drop_dc&lang=en\n\n"
            "⚡ Boost gaming & remote engineering connection (GearUP Booster):\n"
            "👉 https://www.dpbolvw.net/click-101877144-17327791\n\n"
            "#electrician #automation #sensors #voltagedrop #robotics #engineering #voltcheck #Shorts"
        ),
        "tags": ["electrician", "automation", "sensors", "voltage drop", "robotics", "engineering", "voltcheck", "Shorts"]
    },
    {
        "id": "pYbK_ZyHdkE",
        "title": "DON'T RESET THAT BREAKER! 💥 The Deadly Arc Flash Mistake #Shorts",
        "description": (
            "When an industrial circuit breaker trips, resetting it without checking can trigger a deadly arc flash explosion!\n"
            "Always verify motor inrush currents, short circuit capacity, and trip curves before re-energizing.\n\n"
            "Free motor breaker sizing & trip curve tool:\n"
            "👉 https://voltcheck24.com/?calc=motor_current&lang=en\n\n"
            "⚡ Download GearUP Booster Free:\n"
            "👉 https://www.dpbolvw.net/click-101877144-17327791\n\n"
            "#electrician #circuitbreaker #electricalsafety #arcflash #inrushcurrent #voltcheck #Shorts"
        ),
        "tags": ["electrician", "circuit breaker", "electrical safety", "arc flash", "inrush current", "voltcheck", "Shorts"]
    },
    {
        "id": "nzT8RjhxYvA",
        "title": "Hear That Screeching Noise? Your Shaft Is About to SNAP! ⚙️ (ISO 281) #Shorts",
        "description": (
            "That horrific metallic screeching isn't just dry grease—it's catastrophic bearing fatigue!\n"
            "Vibration levels hit 12.8 mm/s, on the verge of snapping the drive shaft and causing a $30,000 disaster.\n"
            "Calculate ISO 281 L10h bearing life before metal-on-metal destruction occurs.\n\n"
            "Free ISO 281 bearing fatigue life calculator:\n"
            "👉 https://voltcheck24.com/?calc=bearing_life&lang=en\n\n"
            "⚡ Download GearUP Booster Free:\n"
            "👉 https://www.dpbolvw.net/click-101877144-17327791\n\n"
            "#bearing #machinist #iso281 #vibrationanalysis #mechanicalengineering #voltcheck #Shorts"
        ),
        "tags": ["bearing", "machinist", "iso281", "vibration analysis", "mechanical engineering", "voltcheck", "Shorts"]
    },
    {
        "id": "W_mJiyUzzMg",
        "title": "Why Electricians NEVER Flip a Tripped Breaker Right Away! ⚡ (Explosion Hazard) #Shorts",
        "description": (
            "A tripped 480V breaker is warning you of an extreme short circuit or motor overload!\n"
            "Flipping it back on can release 10,000 amps of instantaneous arc flash plasma.\n"
            "Always size Type-D breaker curves for heavy motor inrush loads.\n\n"
            "Free industrial motor & breaker calculator:\n"
            "👉 https://voltcheck24.com/?calc=motor_current&lang=en\n\n"
            "⚡ Download GearUP Booster Free:\n"
            "👉 https://www.dpbolvw.net/click-101877144-17327791\n\n"
            "#electrician #electricalengineering #circuitbreaker #safetyfirst #arcflash #voltcheck #Shorts"
        ),
        "tags": ["electrician", "electrical engineering", "circuit breaker", "safety first", "arc flash", "voltcheck", "Shorts"]
    },
    {
        "id": "q4QT455H2q4",
        "title": "Why 15kW Motors Trip Breakers on Startup! ⚡ (600% Inrush Spike) #Shorts",
        "description": (
            "You flip the motor switch and BANG! The main breaker trips instantly!\n"
            "The motor isn't damaged—it draws 600% starting current (182A in the first 100ms)!\n"
            "Why Type-D breaker trip curves and MC contactor sizing are mandatory for induction motors.\n\n"
            "Free motor sizing & inrush calculator:\n"
            "👉 https://voltcheck24.com/?calc=motor_current&lang=en\n\n"
            "⚡ GearUP Booster Free Download:\n"
            "👉 https://www.dpbolvw.net/click-101877144-17327791\n\n"
            "#electricmotor #circuitbreaker #electrician #inrushcurrent #automation #voltcheck #Shorts"
        ),
        "tags": ["electric motor", "circuit breaker", "electrician", "inrush current", "automation", "voltcheck", "Shorts"]
    },
    {
        "id": "33bDCkgcR7Q",
        "title": "Rookie vs 30-Year Veteran Engineer Speed Challenge! ⚡ (30m vs 5m vs 3s) #Shorts",
        "description": (
            "Engineering Speed Challenge:\n"
            "- Rookie: 500-page textbook (30 minutes)\n"
            "- 30-Year Veteran: Scientific calculator (5 minutes)\n"
            "- VoltCheck User: 2 taps on smartphone (2.8 seconds DONE!)\n\n"
            "78+ Free industrial engineering calculators for electrical, mechanical, and fluid power:\n"
            "👉 https://voltcheck24.com/?lang=en\n\n"
            "⚡ Optimize gaming & remote CAD latency (GearUP Booster):\n"
            "👉 https://www.dpbolvw.net/click-101877144-17327791\n\n"
            "#engineering #electrician #stem #speedchallenge #smartfactory #mechanicalengineering #voltcheck #Shorts"
        ),
        "tags": ["engineering", "electrician", "stem", "speed challenge", "smart factory", "mechanical engineering", "voltcheck", "Shorts"]
    },

    # --- 2. Scheduled Global Videos: Upgraded to Maximum Curiosity Hooks ---
    {
        "id": "0sbRa8fcKyU",
        "title": "Why Engineers NEVER Guess Bolt Torque by Hand! ⚙️ (T = k·d·F Formula) #Shorts",
        "description": (
            "Master the universal bolt tightening torque equation: T = k × d × F\n"
            "- T: Tightening Torque (N·m)\n"
            "- k: Torque Coefficient (Dry: 0.20 vs Lubricated: 0.15)\n"
            "- d: Nominal Bolt Diameter (m)\n"
            "- F: Clamping Preload Force (N)\n\n"
            "Using the wrong torque coefficient creates a 30%+ error in clamping force, leading to bolt fatigue or sudden mold fracture!\n\n"
            "78+ Free Engineering Calculators for Mechanical & Electrical Design:\n"
            "👉 https://voltcheck24.com/?calc=bolt_torque&lang=en\n\n"
            "⚡ GearUP Booster Free Download:\n"
            "👉 https://www.dpbolvw.net/click-101877144-17327791\n\n"
            "#bolttorque #mechanicalengineering #machinist #torqueformula #clampingforce #machining #voltcheck #Shorts"
        ),
        "tags": ["bolt torque", "mechanical engineering", "machinist", "torque formula", "clamping force", "machining", "voltcheck", "Shorts"]
    },
    {
        "id": "Q6Vb7ob2KUE",
        "title": "Why Electricians BANNED 0-10V in Factories! ⚡ (The 4-20mA Secret) #Shorts",
        "description": (
            "Why do automation engineers NEVER use 0-10V for long sensor runs?\n"
            "Wire resistance distorts voltage over 50m, but 4-20mA delivers exact current over 500m!\n"
            "Kirchhoff's loop law & transmitter compliance voltage explained in 50 seconds.\n\n"
            "Free 3-second 4-20mA loop & burden resistance calculator:\n"
            "👉 https://voltcheck24.com/?calc=analog_loop&lang=en\n\n"
            "⚡ GearUP Booster Free Download:\n"
            "👉 https://www.dpbolvw.net/click-101877144-17327791\n\n"
            "#instrumentation #plc #electrician #420ma #automation #electricalengineering #voltcheck #Shorts"
        ),
        "tags": ["instrumentation", "plc", "electrician", "4-20ma", "automation", "electrical engineering", "voltcheck", "Shorts"]
    },
    {
        "id": "4-s7fVmWIoU",
        "title": "Why 480V Inverters Create 1,500V Death Spikes! ⚡ (Motor Destroyer) #Shorts",
        "description": (
            "Why does a 480V VFD inverter create 1,500V ringing spikes at motor terminals?\n"
            "Fast IGBT switching (dv/dt over 10,000 V/µs) and cable-to-motor surge impedance mismatch!\n"
            "How to calculate critical cable distance and size dv/dt reactors in 50 seconds.\n\n"
            "Free industrial motor & drive calculator:\n"
            "👉 https://voltcheck24.com/?calc=motor_current&lang=en\n\n"
            "⚡ Download GearUP Booster Free:\n"
            "👉 https://www.dpbolvw.net/click-101877144-17327791\n\n"
            "#vfd #electricmotor #electrician #electricalengineering #powerelectronics #inverter #voltcheck #Shorts"
        ),
        "tags": ["vfd", "electric motor", "electrician", "electrical engineering", "power electronics", "inverter", "voltcheck", "Shorts"]
    },
    {
        "id": "GfoYN-XbAKs",
        "title": "The 0.5mm Mistake That Snapped a $45,000 Solid Steel Shaft! ⚙️ #Shorts",
        "description": (
            "A tiny 0.5mm sharp shoulder radius snapped a $45,000 industrial drive shaft in 3 weeks!\n"
            "Neuber's stress concentration factor (Kt) multiplies shear stress by 320%.\n"
            "Increasing fillet radius from 0.5mm to 3.0mm multiplies fatigue life 10-fold!\n\n"
            "Free mechanical shaft stress & fatigue calculator:\n"
            "👉 https://voltcheck24.com/?lang=en\n\n"
            "⚡ Download GearUP Booster Free:\n"
            "👉 https://www.dpbolvw.net/click-101877144-17327791\n\n"
            "#mechanicalengineering #machinist #fatigue #stressconcentration #solidworks #fea #voltcheck #Shorts"
        ),
        "tags": ["mechanical engineering", "machinist", "fatigue", "stress concentration", "solidworks", "fea", "voltcheck", "Shorts"]
    },
    {
        "id": "7MaG3UUZD8o",
        "title": "Cold Oil Boiling at Room Temp? The 10,000 Bar Pump Destroyer! 🛢️ #Shorts",
        "description": (
            "How does cold room-temperature oil boil into 10,000 bar micro-jets?\n"
            "When pump inlet suction drops below fluid vapor pressure, oil spontaneously vaporizes!\n"
            "The bubbles collapse violently, chewing stainless steel impellers into Swiss cheese.\n\n"
            "Free hydraulic pump NPSH & pipe sizing calculator:\n"
            "👉 https://voltcheck24.com/?lang=en\n\n"
            "⚡ Download GearUP Booster Free:\n"
            "👉 https://www.dpbolvw.net/click-101877144-17327791\n\n"
            "#hydraulics #fluidpower #mechanicalengineering #cavitation #pumps #piping #voltcheck #Shorts"
        ),
        "tags": ["hydraulics", "fluid power", "mechanical engineering", "cavitation", "pumps", "piping", "voltcheck", "Shorts"]
    },
    {
        "id": "3ua_q4rW5xU",
        "title": "Why Setting Control Panel AC to 18°C Causes Indoor Rain! 🌧️ ($50k Fire) #Shorts",
        "description": (
            "Setting your electrical cabinet air conditioner to 18°C creates internal 'indoor rain'!\n"
            "When the factory floor is 32°C at 80% humidity, the dew point is 28.2°C.\n"
            "Moisture condenses out of thin air onto PLC racks, causing catastrophic short-circuit fires!\n\n"
            "Free electrical enclosure cooling & dew point calculator:\n"
            "👉 https://voltcheck24.com/?lang=en\n\n"
            "⚡ Download GearUP Booster Free:\n"
            "👉 https://www.dpbolvw.net/click-101877144-17327791\n\n"
            "#electrician #smartfactory #automation #plc #hvac #controlpanel #dewpoint #voltcheck #Shorts"
        ),
        "tags": ["electrician", "smart factory", "automation", "plc", "hvac", "control panel", "dewpoint", "voltcheck", "Shorts"]
    },
    {
        "id": "4MglSUP76vg",
        "title": "Why Robot Arms Shake Like Earthquakes! 🤖 (The 10:1 Ratio Trap) #Shorts",
        "description": (
            "Why does a powerful servo motor shake like an earthquake when attached to a robotic arm?\n"
            "When load-to-rotor inertia ratio exceeds 10:1, velocity control loops hit mechanical resonance!\n"
            "How a 5:1 planetary gearbox cuts reflected inertia by 25 times (i^2) for sub-millimeter precision.\n\n"
            "Free servo motor & robotic inertia calculator:\n"
            "👉 https://voltcheck24.com/?lang=en\n\n"
            "⚡ Download GearUP Booster Free:\n"
            "👉 https://www.dpbolvw.net/click-101877144-17327791\n\n"
            "#robotics #servomotor #motioncontrol #automation #engineering #mechatronics #voltcheck #Shorts"
        ),
        "tags": ["robotics", "servo motor", "motion control", "automation", "engineering", "mechatronics", "voltcheck", "Shorts"]
    }
]


def update_video(item):
    vid_id = item["id"]
    # 1. Fetch current video resource
    vid_res = youtube.videos().list(id=vid_id, part="snippet,status").execute()
    if not vid_res.get("items"):
        print(f"❌ Video {vid_id} not found on YouTube.")
        return False

    current = vid_res["items"][0]
    snippet = current["snippet"]
    status = current["status"]

    # Sanitize title and description
    clean_title = item["title"].replace("<", "").replace(">", "")
    clean_desc = item["description"].replace("<", "").replace(">", "")

    snippet["title"] = clean_title
    snippet["description"] = clean_desc
    snippet["tags"] = item.get("tags", snippet.get("tags", []))
    snippet["categoryId"] = "28"
    snippet["defaultLanguage"] = "en"
    snippet["defaultAudioLanguage"] = "en"

    # Prepare update body
    update_body = {
        "id": vid_id,
        "snippet": snippet,
        "status": {
            "privacyStatus": status["privacyStatus"],
            "selfDeclaredMadeForKids": False
        }
    }
    if "publishAt" in status:
        update_body["status"]["publishAt"] = status["publishAt"]

    try:
        updated = youtube.videos().update(part="snippet,status", body=update_body).execute()
        print(f"✅ Updated [{vid_id}]: {clean_title[:55]}...")
        return True
    except Exception as e:
        print(f"❌ Failed to update [{vid_id}]: {e}")
        return False


def main():
    print("=" * 80)
    print("🔥 [VIRAL HOOK OVERHAUL] Updating YouTube Video Titles, Tags & Descriptions")
    print("=" * 80)
    success = 0
    for idx, item in enumerate(REVAMP_TARGETS, 1):
        print(f"\n[{idx}/{len(REVAMP_TARGETS)}] Updating {item['id']}...")
        if update_video(item):
            success += 1
        time.sleep(1.5)  # Gentle API spacing

    print("\n" + "=" * 80)
    print(f"🎉 Successfully updated {success} / {len(REVAMP_TARGETS)} videos with high-CTR viral hooks!")
    print("=" * 80)


if __name__ == "__main__":
    main()
