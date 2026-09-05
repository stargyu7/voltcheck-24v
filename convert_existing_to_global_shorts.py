# -*- coding: utf-8 -*-
"""
=============================================================================
🌍 [GLOBAL TRANSLATION ENGINE] Convert All Existing Core Shorts to English
=============================================================================
1. Ep 1: 24V Voltage Drop & $2M Line Shutdown (shorts_global_story_ep1_voltagedrop.mp4)
2. Ep 2: Motor 600% Inrush Spike & Breaker Tripping (shorts_global_story_ep2_motor_inrush.mp4)
3. Ep 3: Bearing Seizure & Broken Shaft ISO 281 (shorts_global_story_ep3_bearing_life.mp4)
4. Ep 4: 300 Bar Water Hammer & Hydraulic Rupture (shorts_global_story_ep4_hydraulic_hammer.mp4)
5. Ep 5: ESS Battery Room Thermal Runaway Safety (shorts_global_story_ep5_bess_safety.mp4)
=============================================================================
"""

import os
import sys
import math
import wave
import asyncio
import subprocess
import numpy as np
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", line_buffering=True)
        sys.stderr.reconfigure(encoding="utf-8", line_buffering=True)
    except Exception:
        pass

BASE_DIR = Path(r"c:\이규정 개인 프로젝트")
SCRATCH = Path(r"C:\Users\jiwan\.gemini\antigravity\brain\383c856a-190f-4e51-a071-50d194e1c260\scratch")
FFMPEG = r"C:\Users\jiwan\AppData\Local\Python\pythoncore-3.14-64\Lib\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe"
FONT_BOLD = r"C:\Windows\Fonts\segoeuib.ttf"
FONT_TITLE = r"C:\Windows\Fonts\arialbd.ttf"


# =============================================================================
# EPISODE SCRIPTS CONFIGURATION
# =============================================================================
EPISODES = [
    {
        "ep_id": "ep1_voltagedrop",
        "out_file": "shorts_global_story_ep1_voltagedrop.mp4",
        "voice": "en-US-AndrewMultilingualNeural",
        "bgm": "bolt_mkt_bgm.wav",
        "bgm_vol": 0.16,
        "scripts": [
            "At two AM, a two-million-dollar robotic production line suddenly faulted out and halted! Plant managers were sweating bullets in the middle of the night.",
            "The culprit? Someone tried to save thirty cents on copper and ran a thin 1.5 square millimeter cable over 80 meters on a 24V line. Voltage collapsed down to 18.2 volts, freezing the optical sensors!",
            "The senior engineer pulled out his phone, opened VoltCheck, and calculated 4.0 square millimeters in three seconds! Voltage drop plunged from 7.9% down to 2.9%, safely within standards.",
            "The line was back up immediately! Never guess cable sizes by hand. Calculate 24V voltage drop in 3 seconds at voltcheck24.com!"
        ],
        "badge": "[ 🚨 $2M LINE SHUTDOWN ]",
        "badge_color": (220, 30, 30),
        "title": "Undersized 24V Cable\nCaused a $2M Disaster!",
        "accent_color": (0, 230, 255)
    },
    {
        "ep_id": "ep2_motor_inrush",
        "out_file": "shorts_global_story_ep2_motor_inrush.mp4",
        "voice": "en-US-AndrewMultilingualNeural",
        "bgm": "story_bgm_ep2.wav",
        "bgm_vol": 0.18,
        "scripts": [
            "A junior engineer powered up a 15-kilowatt three-phase motor, flipped the switch, and BAM! The main breaker tripped immediately, shutting down the entire line!",
            "Everyone panicked thinking the brand new motor was fried. But the motor was fine! Sizing a breaker only for running current is a rookie mistake. Induction motors draw 600% starting inrush current, hitting 182 amps in the first 100 milliseconds!",
            "The plant supervisor opened VoltCheck on his smartphone and sized a Type-D breaker and an MC-32a contactor in 3 seconds! Swapped the breaker, and the motor spun up smooth as silk.",
            "Stop tripping breakers and blowing contactors. Size industrial motor breakers and starters in 3 seconds at voltcheck24.com!"
        ],
        "badge": "[ 💥 BREAKER EXPLOSION HAZARD ]",
        "badge_color": (230, 90, 0),
        "title": "Why Motors Trip Breakers:\nThe 600% Inrush Spike!",
        "accent_color": (255, 170, 0)
    },
    {
        "ep_id": "ep3_bearing_life",
        "out_file": "shorts_global_story_ep3_bearing_life.mp4",
        "voice": "en-US-BrianMultilingualNeural",
        "bgm": "story_bgm_ep3.wav",
        "bgm_vol": 0.18,
        "scripts": [
            "During the night shift, a heavy-duty industrial pump motor started emitting a horrific, metallic screeching noise! The entire pump skid began vibrating violently.",
            "The operator was about to just squirt grease on it. But a vibration analyzer registered 12.8 millimeters per second—extreme danger zone! An uncalculated 6205 bearing had exceeded its ISO 281 fatigue life, on the verge of snapping the drive shaft and causing a $30,000 disaster!",
            "Using VoltCheck, the engineer verified the L10h rating of 84,200 hours and a 4,200-hour relubrication interval. They swapped in a fresh bearing, and vibration dropped to 0.8 millimeters per second with zero noise!",
            "Never wait for bearings to seize and destroy your machinery. Calculate ISO 281 bearing life in 3 seconds at voltcheck24.com!"
        ],
        "badge": "[ ⚙️ MECHANICAL FAILURE ALERT ]",
        "badge_color": (200, 40, 40),
        "title": "Horrific Grinding Noise:\nBearing Fatigue Life (ISO 281)",
        "accent_color": (0, 220, 255)
    },
    {
        "ep_id": "ep4_hydraulic_hammer",
        "out_file": "shorts_global_story_ep4_hydraulic_hammer.mp4",
        "voice": "en-US-AndrewMultilingualNeural",
        "bgm": "story_bgm_ep4.wav",
        "bgm_vol": 0.18,
        "scripts": [
            "A high-speed hydraulic stamping press blew a high-pressure line with an explosive bang, spraying hot hydraulic fluid all over the shop floor!",
            "The technician assumed it was just a defective fitting. But the true culprit was water hammer! A directional valve slammed shut in 50 milliseconds, creating shockwaves that spiked 210 bar line pressure beyond 300 bar, blowing the pipe apart!",
            "The maintenance engineer opened VoltCheck and applied Boyle's Law to calculate the exact nitrogen gas pre-charge volume for a bladder accumulator. The accumulator dampened the surge shock wave completely!",
            "Protect your hydraulic lines and valves from violent pressure shocks. Size gas accumulators in 3 seconds at voltcheck24.com!"
        ],
        "badge": "[ 🚰 300 BAR PIPE BURST ]",
        "badge_color": (210, 20, 20),
        "title": "300 Bar Water Hammer Shock\nBlew the Hydraulic Pipe!",
        "accent_color": (0, 210, 255)
    },
    {
        "ep_id": "ep5_bess_safety",
        "out_file": "shorts_global_story_ep5_bess_safety.mp4",
        "voice": "en-US-BrianMultilingualNeural",
        "bgm": "story_bgm_ep5.wav",
        "bgm_vol": 0.18,
        "scripts": [
            "A commercial battery energy storage room triggered a critical flammable gas alarm, nearly causing a catastrophic explosion in the middle of a city!",
            "Lithium-ion cells entered thermal runaway, releasing dense toxic smoke and explosive hydrogen gas! Without calculated ventilation, gas concentration rapidly exceeded the 25% lower explosive limit, turning the room into a giant bomb.",
            "Following NFPA 855 and IEC standards, the safety team used VoltCheck to calculate the mandatory mechanical exhaust airflow in CFM. The continuous exhaust purged the gases before a single spark could ignite them!",
            "Never risk battery room explosions. Calculate NFPA 855 explosion limits and ventilation airflow in 3 seconds at voltcheck24.com!"
        ],
        "badge": "[ 🤖 BATTERY EXPLOSION HAZARD ]",
        "badge_color": (230, 60, 0),
        "title": "Lithium Battery Runaway:\nNFPA 855 Explosion Safety",
        "accent_color": (255, 100, 0)
    }
]


# =============================================================================
# AUDIO GENERATION & MIXING HELPERS
# =============================================================================
async def generate_voice_chunk(text, voice, out_mp3):
    import edge_tts
    comm = edge_tts.Communicate(text, voice, rate="+6%")
    await comm.save(str(out_mp3))


def get_audio_duration(file_path):
    cmd = [FFMPEG, "-i", str(file_path)]
    p = subprocess.run(cmd, stderr=subprocess.PIPE, stdout=subprocess.PIPE, text=True)
    for line in p.stderr.split("\n"):
        if "Duration" in line:
            parts = line.split("Duration:")[1].split(",")[0].strip().split(":")
            return float(parts[0]) * 3600 + float(parts[1]) * 60 + float(parts[2])
    return 8.0


def load_wav(path):
    with wave.open(str(path), "r") as f:
        sr = f.getframerate()
        n = f.getnframes()
        channels = f.getnchannels()
        raw = f.readframes(n)
        dt = np.int16 if f.getsampwidth() == 2 else np.int32
        data = np.frombuffer(raw, dtype=dt).astype(np.float32) / (32768.0 if dt == np.int16 else 2147483648.0)
        if channels == 2:
            data = data.reshape(-1, 2)
        else:
            data = np.column_stack([data, data])
        return sr, data


def mix_audio(voice_files, bgm_path, out_wav, bgm_vol=0.18):
    concat_txt = SCRATCH / "tmp_concat_auto.txt"
    with open(concat_txt, "w", encoding="utf-8") as f:
        for vf in voice_files:
            f.write(f"file '{vf}'\n")

    tmp_voice_mp3 = SCRATCH / "tmp_voice_auto.mp3"
    subprocess.run([FFMPEG, "-y", "-f", "concat", "-safe", "0", "-i", str(concat_txt), "-c", "copy", str(tmp_voice_mp3)],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    tmp_voice_wav = SCRATCH / "tmp_voice_auto.wav"
    subprocess.run([FFMPEG, "-y", "-i", str(tmp_voice_mp3), "-ar", "44100", "-ac", "1", str(tmp_voice_wav)],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    sr, voice = load_wav(tmp_voice_wav)
    sr_bgm, bgm = load_wav(bgm_path)

    n_samples = len(voice)
    master = np.zeros((n_samples, 2), dtype=np.float32)

    master += voice * 1.35

    # Loop BGM if necessary
    if len(bgm) < n_samples:
        repeats = int(math.ceil(n_samples / len(bgm)))
        bgm = np.tile(bgm, (repeats, 1))
    bgm_trimmed = bgm[:n_samples]
    master += bgm_trimmed * bgm_vol

    # Add SFX cues
    sfx_files = ["sfx_whoosh.wav", "sfx_alert.wav", "sfx_impact.wav", "sfx_pop.wav"]
    for sfx_name in sfx_files:
        p = SCRATCH / sfx_name
        if p.exists():
            _, sfx = load_wav(p)
            for t_sec in [0.05, 8.5, 18.0, 27.5]:
                idx = int(t_sec * sr)
                if idx < n_samples:
                    slen = min(len(sfx), n_samples - idx)
                    master[idx:idx + slen] += sfx[:slen] * 0.45

    master = np.tanh(master * 0.92)

    with wave.open(str(out_wav), "w") as f:
        f.setnchannels(2)
        f.setsampwidth(2)
        f.setframerate(sr)
        f.writeframes((master * 32767).astype(np.int16).tobytes())

    return out_wav, len(master) / sr


# =============================================================================
# SCENE GRAPHICS RENDERING
# =============================================================================
def draw_ep1_graphics(draw, t, seg_idx, f_title, f_card, f_small, f_badge):
    """Episode 1: 24V Voltage Drop & Undersized Cable"""
    if seg_idx == 0:
        draw.rounded_rectangle([(140, 420), (940, 920)], radius=24, fill=(25, 18, 30), outline=(255, 60, 60), width=3)
        draw.text((540, 490), "EMERGENCY SHUTDOWN", font=f_badge, fill=(255, 70, 70), anchor="mm")
        draw.text((540, 580), "ROBOT CELL #4: OFFLINE", font=f_title, fill=(255, 255, 255), anchor="mm")
        draw.text((540, 680), "Line Downtime Cost: $1,200/min", font=f_card, fill=(255, 200, 0), anchor="mm")
        pulse = int(math.sin(t * 8) * 40)
        draw.rounded_rectangle([(240, 760), (840, 850)], radius=18, fill=(180 + pulse, 20, 20))
        draw.text((540, 805), "🚨 2:14 AM FAULT CONFIRMED", font=f_card, fill=(255, 255, 255), anchor="mm")

    elif seg_idx == 1:
        draw.rounded_rectangle([(120, 390), (960, 950)], radius=26, fill=(18, 25, 45), outline=(255, 120, 0), width=2)
        draw.text((540, 450), "24V DC BUS LINE VOLTAGE DROP", font=f_small, fill=(255, 170, 0), anchor="mm")

        draw.rounded_rectangle([(200, 500), (880, 650)], radius=20, fill=(10, 15, 25), outline=(255, 60, 60), width=2)
        draw.text((540, 550), "MEASURED END VOLTAGE", font=f_small, fill=(180, 190, 210), anchor="mm")
        draw.text((540, 605), "18.2 V", font=ImageFont.truetype(FONT_TITLE, 64), fill=(255, 50, 50), anchor="mm")

        draw.text((540, 700), "CABLE GAUGE: 1.5 sq (80 Meters)", font=f_card, fill=(255, 220, 0), anchor="mm")
        draw.text((540, 760), "Voltage Drop: -5.8V (24.1% Loss!)", font=f_card, fill=(255, 80, 80), anchor="mm")
        draw.text((540, 830), "❌ Optical Sensors Communication Dead", font=f_small, fill=(255, 100, 100), anchor="mm")
        draw.text((540, 880), "Saved 30 Cents -> Lost $2,000,000!", font=f_card, fill=(255, 255, 255), anchor="mm")

    elif seg_idx == 2:
        draw.rounded_rectangle([(120, 390), (960, 950)], radius=26, fill=(15, 30, 48), outline=(0, 230, 255), width=2)
        draw.text((540, 450), "VOLTCHECK 3-SECOND OPTIMIZATION", font=f_small, fill=(0, 230, 255), anchor="mm")

        draw.rounded_rectangle([(180, 510), (900, 640)], radius=18, fill=(0, 140, 90))
        draw.text((540, 550), "RECOMMENDED CABLE SIZE", font=f_small, fill=(255, 255, 255), anchor="mm")
        draw.text((540, 600), "4.0 sq (Conductor Upgrade)", font=f_title, fill=(255, 255, 255), anchor="mm")

        draw.text((540, 700), "Formula: ΔV = (2 × L × I × ρ) / A", font=f_card, fill=(255, 220, 0), anchor="mm")
        draw.text((540, 770), "New Voltage Drop: 0.71V (2.9%)", font=f_card, fill=(100, 255, 150), anchor="mm")
        draw.text((540, 840), "Standard Limit: < 3.0% (PASSED ✅)", font=f_card, fill=(0, 255, 180), anchor="mm")
        draw.text((540, 900), "End Voltage Restored to 23.29V!", font=f_small, fill=(255, 255, 255), anchor="mm")

    else:
        draw.rounded_rectangle([(100, 350), (980, 930)], radius=32, fill=(12, 22, 42), outline=(0, 220, 255), width=3)
        draw.text((540, 430), "VOLTCHECK ⚡", font=f_title, fill=(0, 230, 255), anchor="mm")
        draw.text((540, 510), "Industrial Cable Sizing & Voltage Drop", font=f_card, fill=(255, 255, 255), anchor="mm")

        perks = [
            ("⚡ 12V / 24V / 48V DC & AC Line Sizing", (255, 225, 0)),
            ("📐 Automatic Distance & Ampacity Verification", (0, 230, 255)),
            ("📱 100% Free · Mobile Optimized · No Login", (100, 255, 130))
        ]
        for p_idx, (text, p_col) in enumerate(perks):
            by = 590 + p_idx * 95
            draw.rounded_rectangle([(140, by), (940, by + 75)], radius=16, fill=(22, 38, 68), outline=(0, 160, 220), width=1)
            draw.text((540, by + 37), text, font=f_small, fill=p_col, anchor="mm")


def draw_ep2_graphics(draw, t, seg_idx, f_title, f_card, f_small, f_badge):
    """Episode 2: Motor Inrush & Breaker Tripping"""
    if seg_idx == 0:
        draw.rounded_rectangle([(140, 420), (940, 920)], radius=24, fill=(30, 18, 18), outline=(255, 70, 0), width=3)
        draw.text((540, 490), "MAIN BREAKER TRIPPED", font=f_badge, fill=(255, 60, 60), anchor="mm")
        draw.text((540, 580), "15kW 3-Phase Motor Startup", font=f_title, fill=(255, 255, 255), anchor="mm")
        draw.text((540, 680), "Switch Turned ON -> BOOM! 💥", font=f_card, fill=(255, 200, 0), anchor="mm")
        draw.rounded_rectangle([(240, 760), (840, 850)], radius=18, fill=(180, 30, 0))
        draw.text((540, 805), "⚠️ Instantaneous Overcurrent Trip", font=f_card, fill=(255, 255, 255), anchor="mm")

    elif seg_idx == 1:
        draw.rounded_rectangle([(120, 380), (960, 950)], radius=26, fill=(18, 25, 45), outline=(255, 120, 0), width=2)
        draw.text((540, 440), "DOL MOTOR INRUSH CURRENT WAVEFORM", font=f_small, fill=(255, 170, 0), anchor="mm")

        draw.rounded_rectangle([(180, 490), (900, 750)], radius=16, fill=(10, 15, 25), outline=(100, 120, 150), width=1)
        draw.line([(220, 710), (860, 710)], fill=(120, 140, 170), width=2)
        draw.line([(220, 710), (220, 520)], fill=(120, 140, 170), width=2)

        pts = []
        for x in range(120):
            if x < 15:
                y = 710 - int((x / 15) * 170)
            elif x < 35:
                decay = math.exp(-(x - 15) / 10)
                y = 710 - int(50 + 120 * decay + math.sin(x * 0.8) * 15 * decay)
            else:
                y = 710 - 50 + int(math.sin(x * 0.4) * 8)
            pts.append((220 + int(x * 5.2), y))

        for p_idx in range(len(pts) - 1):
            col = (255, 50, 50) if p_idx < 30 else (0, 230, 255)
            draw.line([pts[p_idx], pts[p_idx + 1]], fill=col, width=3)

        draw.text((320, 520), "600% Inrush (182.4A!)", font=f_small, fill=(255, 60, 60), anchor="mm")
        draw.text((700, 640), "Running Amps: 30.4A", font=f_small, fill=(0, 230, 255), anchor="mm")

        draw.text((540, 800), "Standard Type C Breaker Tripped at 100ms!", font=f_card, fill=(255, 80, 80), anchor="mm")
        draw.text((540, 870), "Never size breakers purely on running amps!", font=f_card, fill=(255, 220, 0), anchor="mm")

    elif seg_idx == 2:
        draw.rounded_rectangle([(120, 390), (960, 950)], radius=26, fill=(15, 30, 48), outline=(0, 230, 255), width=2)
        draw.text((540, 450), "VOLTCHECK MOTOR SIZING SOLUTION", font=f_small, fill=(0, 230, 255), anchor="mm")

        draw.rounded_rectangle([(180, 510), (900, 640)], radius=18, fill=(0, 140, 90))
        draw.text((540, 550), "RECOMMENDED BREAKER TYPE", font=f_small, fill=(255, 255, 255), anchor="mm")
        draw.text((540, 600), "Type-D 50AF / 40AT Breaker", font=f_title, fill=(255, 255, 255), anchor="mm")

        draw.text((540, 700), "Contactor: MC-32a (AC-3 32A Rated)", font=f_card, fill=(255, 220, 0), anchor="mm")
        draw.text((540, 770), "Thermal Overload: Set to 30.4A (1.0x FLC)", font=f_card, fill=(100, 255, 150), anchor="mm")
        draw.text((540, 840), "Withstands 10-14x Inrush Spikes ✅", font=f_card, fill=(0, 255, 180), anchor="mm")
        draw.text((540, 900), "Motor spins up smoothly without tripping!", font=f_small, fill=(255, 255, 255), anchor="mm")

    else:
        draw.rounded_rectangle([(100, 350), (980, 930)], radius=32, fill=(12, 22, 42), outline=(0, 220, 255), width=3)
        draw.text((540, 430), "VOLTCHECK ⚡", font=f_title, fill=(0, 230, 255), anchor="mm")
        draw.text((540, 510), "3-Phase Motor & Breaker Sizing Tool", font=f_card, fill=(255, 255, 255), anchor="mm")

        perks = [
            ("⚡ Full Load Current (FLC) & Inrush Calculation", (255, 225, 0)),
            ("🛡️ Breaker Curve (Type B/C/D) & Contactor Selection", (0, 230, 255)),
            ("📱 100% Free · Engineering Field Tool · No Login", (100, 255, 130))
        ]
        for p_idx, (text, p_col) in enumerate(perks):
            by = 590 + p_idx * 95
            draw.rounded_rectangle([(140, by), (940, by + 75)], radius=16, fill=(22, 38, 68), outline=(0, 160, 220), width=1)
            draw.text((540, by + 37), text, font=f_small, fill=p_col, anchor="mm")


def draw_ep3_graphics(draw, t, seg_idx, f_title, f_card, f_small, f_badge):
    """Episode 3: Bearing Life & Shaft Fracture"""
    if seg_idx == 0:
        draw.rounded_rectangle([(140, 420), (940, 920)], radius=24, fill=(28, 18, 25), outline=(255, 60, 80), width=3)
        draw.text((540, 490), "VIBRATION & SCREECHING ALERT", font=f_badge, fill=(255, 60, 60), anchor="mm")
        draw.text((540, 580), "Pump Motor Bearing Seizure", font=f_title, fill=(255, 255, 255), anchor="mm")
        draw.text((540, 680), "Horrific Screeching Noise at Night!", font=f_card, fill=(255, 200, 0), anchor="mm")
        draw.rounded_rectangle([(240, 760), (840, 850)], radius=18, fill=(180, 20, 40))
        draw.text((540, 805), "⚠️ Impending Drive Shaft Snap", font=f_card, fill=(255, 255, 255), anchor="mm")

    elif seg_idx == 1:
        draw.rounded_rectangle([(120, 380), (960, 950)], radius=26, fill=(18, 25, 45), outline=(255, 80, 80), width=2)
        draw.text((540, 440), "BEARING VIBRATION SPECTRUM (ISO 10816)", font=f_small, fill=(255, 170, 0), anchor="mm")

        draw.rounded_rectangle([(180, 490), (900, 650)], radius=20, fill=(10, 15, 25), outline=(255, 60, 60), width=2)
        draw.text((540, 545), "MEASURED VIBRATION VELOCITY", font=f_small, fill=(180, 190, 210), anchor="mm")
        draw.text((540, 605), "12.8 mm/s (UNACCEPTABLE)", font=ImageFont.truetype(FONT_TITLE, 48), fill=(255, 50, 50), anchor="mm")

        draw.text((540, 720), "BEARING MODEL: 6205 Deep Groove", font=f_card, fill=(255, 220, 0), anchor="mm")
        draw.text((540, 790), "Fatigue Limit Exceeded: Inner Raceway Flaking", font=f_card, fill=(255, 80, 80), anchor="mm")
        draw.text((540, 860), "If ignored: Shaft snaps -> $30,000 damage!", font=f_small, fill=(255, 255, 255), anchor="mm")

    elif seg_idx == 2:
        draw.rounded_rectangle([(120, 390), (960, 950)], radius=26, fill=(15, 30, 48), outline=(0, 230, 255), width=2)
        draw.text((540, 450), "VOLTCHECK ISO 281 BEARING LIFE SIZING", font=f_small, fill=(0, 230, 255), anchor="mm")

        draw.rounded_rectangle([(180, 510), (900, 640)], radius=18, fill=(0, 140, 90))
        draw.text((540, 550), "CALCULATED L10h FATIGUE LIFE", font=f_small, fill=(255, 255, 255), anchor="mm")
        draw.text((540, 600), "84,200 Hours (9.6 Years)", font=f_title, fill=(255, 255, 255), anchor="mm")

        draw.text((540, 700), "Formula: L10h = (10^6 / 60·n) × (C/P)^p", font=f_card, fill=(255, 220, 0), anchor="mm")
        draw.text((540, 770), "Grease Interval: 4,200 Operating Hours", font=f_card, fill=(100, 255, 150), anchor="mm")
        draw.text((540, 840), "Post-Replacement Vibration: 0.8 mm/s ✅", font=f_card, fill=(0, 255, 180), anchor="mm")
        draw.text((540, 900), "Whisper quiet operation restored!", font=f_small, fill=(255, 255, 255), anchor="mm")

    else:
        draw.rounded_rectangle([(100, 350), (980, 930)], radius=32, fill=(12, 22, 42), outline=(0, 220, 255), width=3)
        draw.text((540, 430), "VOLTCHECK ⚡", font=f_title, fill=(0, 230, 255), anchor="mm")
        draw.text((540, 510), "ISO 281 Bearing Life & Relubrication", font=f_card, fill=(255, 255, 255), anchor="mm")

        perks = [
            ("⚙️ Radial (Fr) & Axial (Fa) Dynamic Load Rating", (255, 225, 0)),
            ("🧪 Grease vs Oil Relubrication Interval Optimizer", (0, 230, 255)),
            ("📱 100% Free · Essential for Reliability Engineers", (100, 255, 130))
        ]
        for p_idx, (text, p_col) in enumerate(perks):
            by = 590 + p_idx * 95
            draw.rounded_rectangle([(140, by), (940, by + 75)], radius=16, fill=(22, 38, 68), outline=(0, 160, 220), width=1)
            draw.text((540, by + 37), text, font=f_small, fill=p_col, anchor="mm")


def draw_ep4_graphics(draw, t, seg_idx, f_title, f_card, f_small, f_badge):
    """Episode 4: 300 Bar Hydraulic Water Hammer"""
    if seg_idx == 0:
        draw.rounded_rectangle([(140, 420), (940, 920)], radius=24, fill=(30, 15, 15), outline=(255, 50, 50), width=3)
        draw.text((540, 490), "HYDRAULIC LINE BLOWOUT", font=f_badge, fill=(255, 60, 60), anchor="mm")
        draw.text((540, 580), "300 Bar Water Hammer Shock!", font=f_title, fill=(255, 255, 255), anchor="mm")
        draw.text((540, 680), "Stamping Press Line Ruptured!", font=f_card, fill=(255, 200, 0), anchor="mm")
        draw.rounded_rectangle([(240, 760), (840, 850)], radius=18, fill=(190, 20, 20))
        draw.text((540, 805), "💥 Explosive Oil Discharge", font=f_card, fill=(255, 255, 255), anchor="mm")

    elif seg_idx == 1:
        draw.rounded_rectangle([(120, 380), (960, 950)], radius=26, fill=(18, 25, 45), outline=(255, 100, 0), width=2)
        draw.text((540, 440), "HYDRAULIC WATER HAMMER PRESSURE SURGE", font=f_small, fill=(255, 170, 0), anchor="mm")

        draw.rounded_rectangle([(180, 490), (900, 750)], radius=16, fill=(10, 15, 25), outline=(100, 120, 150), width=1)
        draw.line([(220, 710), (860, 710)], fill=(120, 140, 170), width=2)
        draw.line([(220, 710), (220, 520)], fill=(120, 140, 170), width=2)

        pts = []
        for x in range(120):
            if x < 20:
                y = 650
            elif x < 35:
                y = 650 - int((x - 20) / 15 * 140)
            else:
                decay = math.exp(-(x - 35) / 18)
                y = 650 - int(math.cos((x - 35) * 0.6) * 140 * decay)
            pts.append((220 + int(x * 5.2), y))

        for p_idx in range(len(pts) - 1):
            col = (255, 50, 50) if pts[p_idx][1] < 550 else (0, 230, 255)
            draw.line([pts[p_idx], pts[p_idx + 1]], fill=col, width=3)

        draw.text((400, 530), "PEAK SPIKE: 300+ BAR!", font=f_small, fill=(255, 60, 60), anchor="mm")
        draw.text((700, 630), "Normal Working: 210 Bar", font=f_small, fill=(0, 230, 255), anchor="mm")

        draw.text((540, 800), "Valve closed in 50ms -> Shockwave speed 1,200 m/s!", font=f_card, fill=(255, 80, 80), anchor="mm")
        draw.text((540, 870), "Rigid piping cannot absorb acoustic shock!", font=f_card, fill=(255, 220, 0), anchor="mm")

    elif seg_idx == 2:
        draw.rounded_rectangle([(120, 390), (960, 950)], radius=26, fill=(15, 30, 48), outline=(0, 230, 255), width=2)
        draw.text((540, 450), "VOLTCHECK ACCUMULATOR GAS PRECHARGE", font=f_small, fill=(0, 230, 255), anchor="mm")

        draw.rounded_rectangle([(180, 510), (900, 640)], radius=18, fill=(0, 140, 90))
        draw.text((540, 550), "RECOMMENDED GAS PRE-CHARGE", font=f_small, fill=(255, 255, 255), anchor="mm")
        draw.text((540, 600), "P0 = 0.9 × P_min (Boyle's Law)", font=f_title, fill=(255, 255, 255), anchor="mm")

        draw.text((540, 700), "Polytropic Sizing: P0 × V0^n = P1 × V1^n", font=f_card, fill=(255, 220, 0), anchor="mm")
        draw.text((540, 770), "Surge Pressure Cut by 70% (Peak < 225 Bar)", font=f_card, fill=(100, 255, 150), anchor="mm")
        draw.text((540, 840), "Zero Pipe Rupture & Zero Leaks ✅", font=f_card, fill=(0, 255, 180), anchor="mm")
        draw.text((540, 900), "Smooth hydraulic cycles restored!", font=f_small, fill=(255, 255, 255), anchor="mm")

    else:
        draw.rounded_rectangle([(100, 350), (980, 930)], radius=32, fill=(12, 22, 42), outline=(0, 220, 255), width=3)
        draw.text((540, 430), "VOLTCHECK ⚡", font=f_title, fill=(0, 230, 255), anchor="mm")
        draw.text((540, 510), "Hydraulic Accumulator & Flow Sizing", font=f_card, fill=(255, 255, 255), anchor="mm")

        perks = [
            ("🚰 Water Hammer Shock Absorption Sizing", (255, 225, 0)),
            ("⚙️ Isothermal vs Adiabatic Compression Modes", (0, 230, 255)),
            ("📱 100% Free · Professional Fluid Power Tool", (100, 255, 130))
        ]
        for p_idx, (text, p_col) in enumerate(perks):
            by = 590 + p_idx * 95
            draw.rounded_rectangle([(140, by), (940, by + 75)], radius=16, fill=(22, 38, 68), outline=(0, 160, 220), width=1)
            draw.text((540, by + 37), text, font=f_small, fill=p_col, anchor="mm")


def draw_ep5_graphics(draw, t, seg_idx, f_title, f_card, f_small, f_badge):
    """Episode 5: ESS Battery Room Thermal Runaway Safety"""
    if seg_idx == 0:
        draw.rounded_rectangle([(140, 420), (940, 920)], radius=24, fill=(32, 16, 16), outline=(255, 80, 0), width=3)
        draw.text((540, 490), "BESS ROOM EXPLOSION HAZARD", font=f_badge, fill=(255, 60, 60), anchor="mm")
        draw.text((540, 580), "Lithium Battery Thermal Runaway", font=f_title, fill=(255, 255, 255), anchor="mm")
        draw.text((540, 680), "Flammable Hydrogen Gas Alarm!", font=f_card, fill=(255, 200, 0), anchor="mm")
        draw.rounded_rectangle([(240, 760), (840, 850)], radius=18, fill=(190, 40, 0))
        draw.text((540, 805), "⚠️ LFL Limit Exceeded - Bomb Threat", font=f_card, fill=(255, 255, 255), anchor="mm")

    elif seg_idx == 1:
        draw.rounded_rectangle([(120, 380), (960, 950)], radius=26, fill=(18, 25, 45), outline=(255, 80, 0), width=2)
        draw.text((540, 440), "LITHIUM OFF-GAS RELEASE PROFILE (NFPA 855)", font=f_small, fill=(255, 170, 0), anchor="mm")

        draw.rounded_rectangle([(180, 490), (900, 650)], radius=20, fill=(10, 15, 25), outline=(255, 60, 60), width=2)
        draw.text((540, 545), "MEASURED LOWER EXPLOSIVE LIMIT", font=f_small, fill=(180, 190, 210), anchor="mm")
        draw.text((540, 605), "38% LFL (EXPLOSION RISK!)", font=ImageFont.truetype(FONT_TITLE, 48), fill=(255, 50, 50), anchor="mm")

        draw.text((540, 720), "OFF-GAS COMPOSITION: H2 (Hydrogen), CO, CH4", font=f_card, fill=(255, 220, 0), anchor="mm")
        draw.text((540, 790), "Mandatory Safety Threshold: Must Remain < 25% LFL", font=f_card, fill=(255, 100, 100), anchor="mm")
        draw.text((540, 860), "Without mechanical exhaust: Single spark = Explosion!", font=f_small, fill=(255, 255, 255), anchor="mm")

    elif seg_idx == 2:
        draw.rounded_rectangle([(120, 390), (960, 950)], radius=26, fill=(15, 30, 48), outline=(0, 230, 255), width=2)
        draw.text((540, 450), "VOLTCHECK NFPA 855 VENTILATION CALCULATION", font=f_small, fill=(0, 230, 255), anchor="mm")

        draw.rounded_rectangle([(180, 510), (900, 640)], radius=18, fill=(0, 140, 90))
        draw.text((540, 550), "MANDATORY EXHAUST AIRFLOW", font=f_small, fill=(255, 255, 255), anchor="mm")
        draw.text((540, 600), "Q = 4,850 CFM (Continuous)", font=f_title, fill=(255, 255, 255), anchor="mm")

        draw.text((540, 700), "Deflagration Safety Margin: LFL Kept Below 15%", font=f_card, fill=(255, 220, 0), anchor="mm")
        draw.text((540, 770), "Compliant with NFPA 855, IFC & IEC 62619", font=f_card, fill=(100, 255, 150), anchor="mm")
        draw.text((540, 840), "Explosion Hazard Neutralized ✅", font=f_card, fill=(0, 255, 180), anchor="mm")
        draw.text((540, 900), "Clean air balance restored safely!", font=f_small, fill=(255, 255, 255), anchor="mm")

    else:
        draw.rounded_rectangle([(100, 350), (980, 930)], radius=32, fill=(12, 22, 42), outline=(0, 220, 255), width=3)
        draw.text((540, 430), "VOLTCHECK ⚡", font=f_title, fill=(0, 230, 255), anchor="mm")
        draw.text((540, 510), "BESS Battery Explosion Safety Sizing", font=f_card, fill=(255, 255, 255), anchor="mm")

        perks = [
            ("🤖 NFPA 855 Hydrogen Off-Gas & CFM Ventilation", (255, 225, 0)),
            ("🛡️ Lower Flammability Limit (LFL) Deflagration Sizing", (0, 230, 255)),
            ("📱 100% Free · Critical for Battery & Energy Engineers", (100, 255, 130))
        ]
        for p_idx, (text, p_col) in enumerate(perks):
            by = 590 + p_idx * 95
            draw.rounded_rectangle([(140, by), (940, by + 75)], radius=16, fill=(22, 38, 68), outline=(0, 160, 220), width=1)
            draw.text((540, by + 37), text, font=f_small, fill=p_col, anchor="mm")


GRAPHIC_DISPATCH = {
    "ep1_voltagedrop": draw_ep1_graphics,
    "ep2_motor_inrush": draw_ep2_graphics,
    "ep3_bearing_life": draw_ep3_graphics,
    "ep4_hydraulic_hammer": draw_ep4_graphics,
    "ep5_bess_safety": draw_ep5_graphics
}


# =============================================================================
# SINGLE EPISODE RENDER WORKER
# =============================================================================
async def process_episode(ep_cfg):
    ep_id = ep_cfg["ep_id"]
    out_mp4 = BASE_DIR / ep_cfg["out_file"]
    print("=" * 75)
    print(f"🎬 Processing Global English Short: {ep_id}")
    print(f"   Target: {out_mp4.name}")

    # 1. Generate Voice MP3s
    voice_files = []
    durations = []
    for s_idx, text in enumerate(ep_cfg["scripts"]):
        chunk_mp3 = SCRATCH / f"global_{ep_id}_tts_{s_idx}.mp3"
        await generate_voice_chunk(text, ep_cfg["voice"], chunk_mp3)
        dur = get_audio_duration(chunk_mp3)
        voice_files.append(chunk_mp3)
        durations.append(dur)
        print(f"   TTS chunk {s_idx + 1}/4: {dur:.2f}s")

    t_cues = []
    accum = 0.0
    for d in durations:
        accum += d
        t_cues.append(accum)

    total_dur = accum
    print(f"   Total Duration: {total_dur:.2f}s")

    # 2. Mix Audio with BGM and SFX
    bgm_path = SCRATCH / ep_cfg["bgm"]
    out_wav = SCRATCH / f"master_{ep_id}.wav"
    master_audio, mixed_dur = mix_audio(voice_files, bgm_path, out_wav, ep_cfg["bgm_vol"])
    print(f"   Mixed Audio Ready: {mixed_dur:.2f}s")

    # 3. Video Rendering
    fps = 30
    total_frames = int(mixed_dur * fps)
    print(f"   Rendering {total_frames} video frames (1080x1920 Full HD)...")

    f_badge = ImageFont.truetype(FONT_BOLD, 30)
    f_title = ImageFont.truetype(FONT_TITLE, 50)
    f_sub1 = ImageFont.truetype(FONT_BOLD, 42)
    f_sub2 = ImageFont.truetype(FONT_BOLD, 46)
    f_card = ImageFont.truetype(FONT_BOLD, 36)
    f_small = ImageFont.truetype(FONT_BOLD, 28)

    draw_func = GRAPHIC_DISPATCH[ep_id]

    cmd = [
        FFMPEG, "-y", "-f", "rawvideo", "-vcodec", "rawvideo", "-s", "1080x1920",
        "-pix_fmt", "rgb24", "-r", str(fps), "-i", "-", "-i", str(master_audio),
        "-c:v", "libx264", "-preset", "fast", "-crf", "20", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k", "-shortest", str(out_mp4)
    ]
    pipe = subprocess.Popen(cmd, stdin=subprocess.PIPE)

    for frame_idx in range(total_frames):
        t = frame_idx / fps
        im = Image.new("RGB", (1080, 1920), (14, 18, 30))
        draw = ImageDraw.Draw(im)

        # Background grid
        for gx in range(0, 1080, 120):
            draw.line([(gx, 0), (gx, 1920)], fill=(22, 28, 45), width=1)
        for gy in range(0, 1920, 120):
            draw.line([(0, gy), (1080, gy)], fill=(22, 28, 45), width=1)

        # Determine segment
        seg_idx = 3
        for idx, cue in enumerate(t_cues):
            if t < cue:
                seg_idx = idx
                break

        # Top Badge & Title
        draw.rounded_rectangle([(230, 100), (850, 165)], radius=30, fill=ep_cfg["badge_color"], outline=(255, 255, 255), width=1)
        draw.text((540, 132), ep_cfg["badge"], font=f_badge, fill=(255, 255, 255), anchor="mm")
        draw.text((540, 260), ep_cfg["title"], font=f_title, fill=(255, 255, 255), anchor="mm", align="center")

        # Custom Episode Infographic
        draw_func(draw, t, seg_idx, f_title, f_card, f_small, f_badge)

        # Bottom Dynamic Subtitle Card
        draw.rounded_rectangle([(70, 1500), (1010, 1720)], radius=24, fill=(0, 0, 0), outline=ep_cfg["accent_color"], width=2)

        script_text = ep_cfg["scripts"][seg_idx]
        words = script_text.split()
        mid = len(words) // 2
        line1 = " ".join(words[:mid])
        line2 = " ".join(words[mid:])

        draw.text((540, 1565), line1, font=f_sub1, fill=(255, 255, 255), anchor="mm")
        draw.text((540, 1645), line2, font=f_sub2, fill=(255, 220, 0), anchor="mm")

        # Top Progress Bar
        prog = min(1.0, max(0.0, t / mixed_dur))
        draw.line([(0, 1912), (int(1080 * prog), 1912)], fill=ep_cfg["accent_color"], width=8)

        pipe.stdin.write(im.tobytes())

    pipe.stdin.close()
    pipe.wait()

    size_mb = out_mp4.stat().st_size / (1024 * 1024)
    print(f"✅ Render Complete: {out_mp4.name} ({size_mb:.2f} MB)")


# =============================================================================
# MAIN ORCHESTRATOR
# =============================================================================
async def main():
    print("=" * 80)
    print("🌍 [GLOBAL TRANSLATION ENGINE] Converting Existing Core Shorts to English")
    print(f"   Total Episodes: {len(EPISODES)}")
    print("=" * 80)

    for ep in EPISODES:
        await process_episode(ep)

    print("\n" + "#" * 80)
    print("🎉 ALL 5 EXISTING CORE SHORTS SUCCESSFULLY TRANSLATED AND RENDERED IN FULL HD!")
    print("#" * 80)


if __name__ == "__main__":
    asyncio.run(main())
