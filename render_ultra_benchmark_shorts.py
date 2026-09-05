# -*- coding: utf-8 -*-
"""
=============================================================================
🏆 [ULTRA-BENCHMARK RENDERING ENGINE] Tier-1 High-Production Global Shorts
=============================================================================
Benchmarks Applied:
1. The Engineering Mindset: Dynamic technical HUD, animated meters & schematics
2. Practical Engineering: High-stakes disaster forensic hooks & shockwave curves
3. ElectroBOOM: Broadcast-grade audio ducking, sub-bass impacts, electric arcs
4. Project Farm: Data-driven comparison charts with bold ❌ FAIL vs ✅ PASS stamps
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
from PIL import Image, ImageDraw, ImageFont, ImageFilter

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
# EPISODE CONFIGURATIONS (BENCHMARK-OPTIMIZED)
# =============================================================================
BENCHMARK_EPISODES = [
    {
        "ep_id": "ep1_voltagedrop",
        "out_file": "shorts_global_story_ep1_voltagedrop.mp4",
        "voice": "en-US-AndrewMultilingualNeural",
        "bgm": "bolt_mkt_bgm.wav",
        "scripts": [
            "At two AM, a two-million-dollar robotic production line suddenly faulted out and halted! Plant managers were sweating bullets in the middle of the night.",
            "The culprit? Someone tried to save thirty cents on copper and ran a thin 1.5 square millimeter cable over 80 meters on a 24V line. Voltage collapsed down to 18.2 volts, freezing the optical sensors!",
            "The senior engineer pulled out his phone, opened VoltCheck, and calculated 4.0 square millimeters in three seconds! Voltage drop plunged from 7.9% down to 2.9%, safely within standards.",
            "The line was back up immediately! Never guess cable sizes by hand. Calculate 24V voltage drop in 3 seconds at voltcheck24.com!"
        ],
        "badge": "[ 🚨 $2,000,000 LINE SHUTDOWN ]",
        "badge_color": (230, 25, 25),
        "title": "Undersized 24V Cable\nCaused a $2M Disaster!",
        "accent_color": (0, 240, 255)
    },
    {
        "ep_id": "ep2_motor_inrush",
        "out_file": "shorts_global_story_ep2_motor_inrush.mp4",
        "voice": "en-US-AndrewMultilingualNeural",
        "bgm": "story_bgm_ep2.wav",
        "scripts": [
            "A junior engineer powered up a 15-kilowatt three-phase motor, flipped the switch, and BAM! The main breaker tripped immediately, shutting down the entire line!",
            "Everyone panicked thinking the brand new motor was fried. But the motor was fine! Sizing a breaker only for running current is a rookie mistake. Induction motors draw 600% starting inrush current, hitting 182 amps in the first 100 milliseconds!",
            "The plant supervisor opened VoltCheck on his smartphone and sized a Type-D breaker and an MC-32a contactor in 3 seconds! Swapped the breaker, and the motor spun up smooth as silk.",
            "Stop tripping breakers and blowing contactors. Size industrial motor breakers and starters in 3 seconds at voltcheck24.com!"
        ],
        "badge": "[ 💥 600% INRUSH EXPLOSION ]",
        "badge_color": (240, 90, 0),
        "title": "Why Motors Trip Breakers:\nThe 600% Inrush Spike!",
        "accent_color": (255, 180, 0)
    },
    {
        "ep_id": "ep3_bearing_life",
        "out_file": "shorts_global_story_ep3_bearing_life.mp4",
        "voice": "en-US-BrianMultilingualNeural",
        "bgm": "story_bgm_ep3.wav",
        "scripts": [
            "During the night shift, a heavy-duty industrial pump motor started emitting a horrific, metallic screeching noise! The entire pump skid began vibrating violently.",
            "The operator was about to just squirt grease on it. But a vibration analyzer registered 12.8 millimeters per second—extreme danger zone! An uncalculated 6205 bearing had exceeded its ISO 281 fatigue life, on the verge of snapping the drive shaft and causing a $30,000 disaster!",
            "Using VoltCheck, the engineer verified the L10h rating of 84,200 hours and a 4,200-hour relubrication interval. They swapped in a fresh bearing, and vibration dropped to 0.8 millimeters per second with zero noise!",
            "Never wait for bearings to seize and destroy your machinery. Calculate ISO 281 bearing life in 3 seconds at voltcheck24.com!"
        ],
        "badge": "[ ⚙️ MECHANICAL SEIZURE HAZARD ]",
        "badge_color": (220, 30, 60),
        "title": "Horrific Grinding Noise:\nBearing Fatigue Life (ISO 281)",
        "accent_color": (0, 230, 255)
    },
    {
        "ep_id": "ep4_hydraulic_hammer",
        "out_file": "shorts_global_story_ep4_hydraulic_hammer.mp4",
        "voice": "en-US-AndrewMultilingualNeural",
        "bgm": "story_bgm_ep4.wav",
        "scripts": [
            "A high-speed hydraulic stamping press blew a high-pressure line with an explosive bang, spraying hot hydraulic fluid all over the shop floor!",
            "The technician assumed it was just a defective fitting. But the true culprit was water hammer! A directional valve slammed shut in 50 milliseconds, creating shockwaves that spiked 210 bar line pressure beyond 300 bar, blowing the pipe apart!",
            "The maintenance engineer opened VoltCheck and applied Boyle's Law to calculate the exact nitrogen gas pre-charge volume for a bladder accumulator. The accumulator dampened the surge shock wave completely!",
            "Protect your hydraulic lines and valves from violent pressure shocks. Size gas accumulators in 3 seconds at voltcheck24.com!"
        ],
        "badge": "[ 🚰 300 BAR PIPE BURST ]",
        "badge_color": (220, 20, 20),
        "title": "300 Bar Water Hammer Shock\nBlew the Hydraulic Pipe!",
        "accent_color": (0, 210, 255)
    },
    {
        "ep_id": "ep5_bess_safety",
        "out_file": "shorts_global_story_ep5_bess_safety.mp4",
        "voice": "en-US-BrianMultilingualNeural",
        "bgm": "story_bgm_ep5.wav",
        "scripts": [
            "A commercial battery energy storage room triggered a critical flammable gas alarm, nearly causing a catastrophic explosion in the middle of a city!",
            "Lithium-ion cells entered thermal runaway, releasing dense toxic smoke and explosive hydrogen gas! Without calculated ventilation, gas concentration rapidly exceeded the 25% lower explosive limit, turning the room into a giant bomb.",
            "Following NFPA 855 and IEC standards, the safety team used VoltCheck to calculate the mandatory mechanical exhaust airflow in CFM. The continuous exhaust purged the gases before a single spark could ignite them!",
            "Never risk battery room explosions. Calculate NFPA 855 explosion limits and ventilation airflow in 3 seconds at voltcheck24.com!"
        ],
        "badge": "[ 🤖 BATTERY THERMAL RUNAWAY ]",
        "badge_color": (240, 70, 0),
        "title": "Lithium Battery Runaway:\nNFPA 855 Explosion Safety",
        "accent_color": (255, 120, 0)
    }
]


# =============================================================================
# AUDIO ENGINEERING: DYNAMIC DUCKING & SFX LAYERING
# =============================================================================
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


def mix_master_audio(voice_files, bgm_path, out_wav):
    concat_txt = SCRATCH / "tmp_concat_master.txt"
    with open(concat_txt, "w", encoding="utf-8") as f:
        for vf in voice_files:
            f.write(f"file '{vf}'\n")

    tmp_voice_mp3 = SCRATCH / "tmp_voice_master.mp3"
    subprocess.run([FFMPEG, "-y", "-f", "concat", "-safe", "0", "-i", str(concat_txt), "-c", "copy", str(tmp_voice_mp3)],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    tmp_voice_wav = SCRATCH / "tmp_voice_master.wav"
    subprocess.run([FFMPEG, "-y", "-i", str(tmp_voice_mp3), "-ar", "44100", "-ac", "1", str(tmp_voice_wav)],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    sr, voice = load_wav(tmp_voice_wav)
    sr_bgm, bgm = load_wav(bgm_path)

    n_samples = len(voice)
    master = np.zeros((n_samples, 2), dtype=np.float32)

    # Broadcast-Grade Audio Ducking
    window_size = int(sr * 0.08)  # 80ms window
    abs_voice = np.abs(voice[:, 0])
    kernel = np.ones(window_size) / window_size
    envelope = np.convolve(abs_voice, kernel, mode='same')
    duck_gain = np.where(envelope > 0.03, 0.11, 0.25)
    duck_gain = np.column_stack([duck_gain, duck_gain])

    if len(bgm) < n_samples:
        repeats = int(math.ceil(n_samples / len(bgm)))
        bgm = np.tile(bgm, (repeats, 1))
    bgm_trimmed = bgm[:n_samples]

    master += voice * 1.40
    master += bgm_trimmed * duck_gain

    # Layered SFX Cues (ElectroBOOM & Practical Engineering Benchmark)
    sfx_timeline = [
        ("sfx_whoosh.wav", 0.00, 0.70),
        ("sfx_impact.wav", 1.60, 0.85),  # Hook impact sub-bass drop
        ("sfx_alert.wav", 8.80, 0.60),   # Disaster alarm
        ("sfx_whoosh.wav", 19.50, 0.65), # Transition to solution
        ("sfx_spark.wav", 23.00, 0.65),  # Technical calculation sound
        ("sfx_pop.wav", 27.50, 0.75),    # Verified stamp sound
        ("sfx_whoosh.wav", 34.00, 0.65), # Outro whoosh
    ]
    for sfx_name, t_sec, vol in sfx_timeline:
        p = SCRATCH / sfx_name
        if p.exists():
            _, sfx = load_wav(p)
            idx = int(t_sec * sr)
            if idx < n_samples:
                slen = min(len(sfx), n_samples - idx)
                master[idx:idx + slen] += sfx[:slen] * vol

    master = np.tanh(master * 0.94)

    with wave.open(str(out_wav), "w") as f:
        f.setnchannels(2)
        f.setsampwidth(2)
        f.setframerate(sr)
        f.writeframes((master * 32767).astype(np.int16).tobytes())

    return out_wav, n_samples / sr, master[:, 0]


# =============================================================================
# GRAPHICS SUITE: HUD, METERS, GAUGES, STAMPS
# =============================================================================
def draw_hud_grid(draw, w=1080, h=1920):
    """Futuristic engineering blueprint grid with crosshairs"""
    for gx in range(0, w, 90):
        draw.line([(gx, 0), (gx, h)], fill=(18, 25, 42), width=1)
    for gy in range(0, h, 90):
        draw.line([(0, gy), (w, gy)], fill=(18, 25, 42), width=1)
    # Target crosshairs
    crosshairs = [(90, 90), (990, 90), (90, 1830), (990, 1830)]
    for cx, cy in crosshairs:
        draw.line([(cx - 15, cy), (cx + 15, cy)], fill=(0, 200, 255), width=2)
        draw.line([(cx, cy - 15), (cx, cy + 15)], fill=(0, 200, 255), width=2)


def draw_reactive_audio_visualizer(draw, audio_signal, t, sr=44100, num_bars=24):
    """Live dancing audio visualizer bar (The Engineering Mindset HUD aesthetic)"""
    idx = int(t * sr)
    chunk = audio_signal[max(0, idx - 1024):idx + 1024]
    energy = np.abs(chunk) if len(chunk) > 0 else np.zeros(10)
    mean_e = np.mean(energy) * 12.0

    base_y = 1485
    start_x = 110
    bar_width = 30
    gap = 6

    for b in range(num_bars):
        bx = start_x + b * (bar_width + gap)
        mod = math.sin(t * 15 + b * 0.5) * 0.4 + 0.6
        bar_h = int(12 + mean_e * 140 * mod + math.sin(b * 0.8) * 8)
        bar_h = max(8, min(110, bar_h))
        col = (0, int(200 + b * 2), 255) if b < 16 else (255, int(220 - (b-16)*20), 0)
        draw.rounded_rectangle([(bx, base_y - bar_h), (bx + bar_width, base_y)], radius=4, fill=col)


def draw_verdict_stamp(draw, text, is_pass=True, x=540, y=860):
    """Project Farm-style high-contrast VERDICT stamp"""
    f_stamp = ImageFont.truetype(FONT_TITLE, 44)
    if is_pass:
        box_col = (0, 190, 100)
        bg_col = (10, 50, 30)
        prefix = "✅ VERIFIED: "
    else:
        box_col = (255, 40, 40)
        bg_col = (50, 10, 10)
        prefix = "❌ FAILED: "

    full_text = prefix + text
    draw.rounded_rectangle([(140, y - 45), (940, y + 45)], radius=18, fill=bg_col, outline=box_col, width=3)
    draw.text((x, y), full_text, font=f_stamp, fill=box_col, anchor="mm")


# =============================================================================
# EPISODE-SPECIFIC DYNAMIC INFOGRAPHICS
# =============================================================================
def draw_ep1_ultra_graphics(draw, t, seg_idx, f_title, f_card, f_small, f_badge):
    """Ep 1: Digital Multimeter Active Countdown from 24V to 18.2V"""
    f_lcd = ImageFont.truetype(FONT_TITLE, 76)
    if seg_idx == 0:
        # Factory Emergency Alarm & Live Loss Counter
        pulse = int(math.sin(t * 10) * 35)
        draw.rounded_rectangle([(120, 380), (960, 930)], radius=28, fill=(28, 16, 26), outline=(255, 50, 50), width=3)
        draw.rounded_rectangle([(200, 430), (880, 510)], radius=16, fill=(180 + pulse, 20, 20))
        draw.text((540, 470), "🚨 CRITICAL SYSTEM TRIP", font=f_badge, fill=(255, 255, 255), anchor="mm")

        draw.text((540, 580), "AUTOMATION LINE #2: SHUTDOWN", font=f_title, fill=(255, 255, 255), anchor="mm")

        # Loss ticking
        loss_val = int(min(2000000, max(120000, t * 180000)))
        draw.text((540, 680), f"ESTIMATED DOWNTIME LOSS: ${loss_val:,}", font=f_card, fill=(255, 210, 0), anchor="mm")

        draw.rounded_rectangle([(180, 750), (900, 850)], radius=20, fill=(15, 22, 38), outline=(255, 80, 80), width=1)
        draw.text((540, 800), "2:14 AM EMERGENCY DISPATCH", font=f_card, fill=(255, 100, 100), anchor="mm")

    elif seg_idx == 1:
        # Animated Digital Multimeter
        draw.rounded_rectangle([(120, 370), (960, 940)], radius=28, fill=(18, 26, 44), outline=(255, 140, 0), width=2)
        draw.text((540, 420), "INDUSTRIAL MULTIMETER (80M TERMINAL)", font=f_small, fill=(255, 180, 0), anchor="mm")

        # LCD Display Box
        draw.rounded_rectangle([(180, 460), (900, 630)], radius=20, fill=(8, 12, 20), outline=(255, 40, 40), width=3)
        # Animate voltage dropping from 24.0 down to 18.2V
        measured_v = max(18.2, 24.0 - (t - 9.0) * 1.5) if t > 9.0 else 24.0
        draw.text((540, 530), f"{measured_v:.1f} V DC", font=f_lcd, fill=(255, 40, 40), anchor="mm")
        draw.text((540, 600), "BROWNOUT SENSOR THRESHOLD: < 20.4V", font=f_small, fill=(180, 190, 210), anchor="mm")

        draw.text((540, 690), "Cable: 1.5 sq (AWG 16) | Load: 4.8A", font=f_card, fill=(255, 220, 0), anchor="mm")
        draw.text((540, 760), "Calculated Drop: -5.8V (24.1% Loss!)", font=f_card, fill=(255, 70, 70), anchor="mm")

        draw_verdict_stamp(draw, "VOLTAGE COLLAPSE (Brownout)", is_pass=False, y=860)

    elif seg_idx == 2:
        # Solution: VoltCheck 4.0 sq Upgrade
        draw.rounded_rectangle([(120, 370), (960, 940)], radius=28, fill=(14, 32, 48), outline=(0, 230, 255), width=2)
        draw.text((540, 420), "VOLTCHECK OPTIMIZATION ENGINE", font=f_small, fill=(0, 230, 255), anchor="mm")

        # Restored Voltage Display
        draw.rounded_rectangle([(180, 460), (900, 620)], radius=20, fill=(8, 24, 20), outline=(0, 255, 150), width=3)
        draw.text((540, 525), "23.29 V DC", font=f_lcd, fill=(0, 255, 170), anchor="mm")
        draw.text((540, 590), "RESTORED TERMINAL VOLTAGE (PASSED ✅)", font=f_small, fill=(160, 255, 200), anchor="mm")

        draw.text((540, 680), "Upgraded: 4.0 sq Conductor (AWG 11)", font=f_card, fill=(255, 220, 0), anchor="mm")
        draw.text((540, 750), "Voltage Drop: 0.71V (2.96% < 3.0% Limit)", font=f_card, fill=(100, 255, 180), anchor="mm")

        draw_verdict_stamp(draw, "100% KEC / IEC COMPLIANT", is_pass=True, y=860)

    else:
        # CTA Showcase
        draw.rounded_rectangle([(100, 350), (980, 930)], radius=32, fill=(12, 22, 42), outline=(0, 230, 255), width=3)
        draw.text((540, 430), "VOLTCHECK ⚡", font=f_title, fill=(0, 230, 255), anchor="mm")
        draw.text((540, 510), "Industrial Cable & Voltage Drop Tool", font=f_card, fill=(255, 255, 255), anchor="mm")

        perks = [
            ("⚡ 12V / 24V / 48V DC & 3-Phase AC Sizing", (255, 225, 0)),
            ("📐 Instant Conductor Gauge & Distance Limits", (0, 230, 255)),
            ("📱 100% Free · Mobile Optimized · Zero Sign-Up", (100, 255, 140))
        ]
        for p_idx, (text, p_col) in enumerate(perks):
            by = 590 + p_idx * 95
            draw.rounded_rectangle([(140, by), (940, by + 75)], radius=16, fill=(20, 36, 64), outline=(0, 160, 220), width=1)
            draw.text((540, by + 37), text, font=f_small, fill=p_col, anchor="mm")


def draw_ep2_ultra_graphics(draw, t, seg_idx, f_title, f_card, f_small, f_badge):
    """Ep 2: Analog Ammeter Needle Slamming into 182A Redline"""
    f_lcd = ImageFont.truetype(FONT_TITLE, 72)
    if seg_idx == 0:
        draw.rounded_rectangle([(120, 380), (960, 930)], radius=28, fill=(30, 16, 16), outline=(255, 70, 0), width=3)
        draw.rounded_rectangle([(200, 430), (880, 510)], radius=16, fill=(200, 40, 0))
        draw.text((540, 470), "💥 CIRCUIT BREAKER EXPLOSIVE TRIP", font=f_badge, fill=(255, 255, 255), anchor="mm")

        draw.text((540, 580), "15kW Motor Startup FAILED", font=f_title, fill=(255, 255, 255), anchor="mm")
        draw.text((540, 680), "Instant Switch Throw -> Loud BANG!", font=f_card, fill=(255, 210, 0), anchor="mm")
        draw.rounded_rectangle([(180, 750), (900, 850)], radius=20, fill=(15, 20, 35), outline=(255, 60, 60), width=1)
        draw.text((540, 800), "⚠️ Magnetic Instantaneous Element Tripped", font=f_card, fill=(255, 100, 100), anchor="mm")

    elif seg_idx == 1:
        # Inrush Surge Meter
        draw.rounded_rectangle([(120, 370), (960, 940)], radius=28, fill=(20, 25, 45), outline=(255, 120, 0), width=2)
        draw.text((540, 420), "3-PHASE DOL STARTING CURRENT WAVEFORM", font=f_small, fill=(255, 170, 0), anchor="mm")

        draw.rounded_rectangle([(180, 460), (900, 620)], radius=20, fill=(8, 12, 22), outline=(255, 50, 50), width=3)
        draw.text((540, 525), "182.4 A (600%!)", font=f_lcd, fill=(255, 40, 40), anchor="mm")
        draw.text((540, 590), "NORMAL RUNNING CURRENT: 30.4A", font=f_small, fill=(180, 190, 210), anchor="mm")

        draw.text((540, 690), "Type-C Breaker Magnetic Trip: 5 - 10x FLC", font=f_card, fill=(255, 220, 0), anchor="mm")
        draw.text((540, 760), "Tripped at 100 Milliseconds Due to Inrush Spike", font=f_card, fill=(255, 80, 80), anchor="mm")

        draw_verdict_stamp(draw, "TYPE-C BREAKER NUISANCE TRIP", is_pass=False, y=860)

    elif seg_idx == 2:
        draw.rounded_rectangle([(120, 370), (960, 940)], radius=28, fill=(14, 32, 48), outline=(0, 230, 255), width=2)
        draw.text((540, 420), "VOLTCHECK MOTOR SIZING SOLUTION", font=f_small, fill=(0, 230, 255), anchor="mm")

        draw.rounded_rectangle([(180, 460), (900, 620)], radius=20, fill=(8, 26, 22), outline=(0, 255, 150), width=3)
        draw.text((540, 525), "Type-D 50AF / 40AT", font=ImageFont.truetype(FONT_TITLE, 64), fill=(0, 255, 180), anchor="mm")
        draw.text((540, 590), "CONTACTOR: MC-32a (AC-3 RATED)", font=f_small, fill=(180, 255, 210), anchor="mm")

        draw.text((540, 685), "Thermal Overload Relay: Set to 30.4A FLC", font=f_card, fill=(255, 220, 0), anchor="mm")
        draw.text((540, 755), "Withstands 10-14x DOL Starting Inrush Spikes", font=f_card, fill=(100, 255, 180), anchor="mm")

        draw_verdict_stamp(draw, "SMOOTH MOTOR ACCELERATION", is_pass=True, y=860)

    else:
        draw.rounded_rectangle([(100, 350), (980, 930)], radius=32, fill=(12, 22, 42), outline=(0, 230, 255), width=3)
        draw.text((540, 430), "VOLTCHECK ⚡", font=f_title, fill=(0, 230, 255), anchor="mm")
        draw.text((540, 510), "Industrial Motor Breaker Sizing Tool", font=f_card, fill=(255, 255, 255), anchor="mm")

        perks = [
            ("⚡ 3-Phase DOL & Star-Delta FLC Calculations", (255, 225, 0)),
            ("🛡️ Breaker Curve Matching (Type B/C/D) & MC Sizing", (0, 230, 255)),
            ("📱 100% Free · Engineering Field Tool · Zero Login", (100, 255, 140))
        ]
        for p_idx, (text, p_col) in enumerate(perks):
            by = 590 + p_idx * 95
            draw.rounded_rectangle([(140, by), (940, by + 75)], radius=16, fill=(20, 36, 64), outline=(0, 160, 220), width=1)
            draw.text((540, by + 37), text, font=f_small, fill=p_col, anchor="mm")


def draw_ep3_ultra_graphics(draw, t, seg_idx, f_title, f_card, f_small, f_badge):
    """Ep 3: Vibration FFT Spectrum & ISO 281 L10h"""
    f_lcd = ImageFont.truetype(FONT_TITLE, 72)
    if seg_idx == 0:
        draw.rounded_rectangle([(120, 380), (960, 930)], radius=28, fill=(28, 14, 22), outline=(255, 50, 80), width=3)
        draw.rounded_rectangle([(200, 430), (880, 510)], radius=16, fill=(190, 20, 50))
        draw.text((540, 470), "⚙️ SEVERE VIBRATION ALARM", font=f_badge, fill=(255, 255, 255), anchor="mm")

        draw.text((540, 580), "Pump Motor Screeching Noise", font=f_title, fill=(255, 255, 255), anchor="mm")
        draw.text((540, 680), "Metallic Screeching on Graveyard Shift!", font=f_card, fill=(255, 210, 0), anchor="mm")
        draw.rounded_rectangle([(180, 750), (900, 850)], radius=20, fill=(15, 20, 35), outline=(255, 60, 80), width=1)
        draw.text((540, 800), "⚠️ Impending Drive Shaft Seizure & Snap", font=f_card, fill=(255, 100, 120), anchor="mm")

    elif seg_idx == 1:
        draw.rounded_rectangle([(120, 370), (960, 940)], radius=28, fill=(22, 22, 40), outline=(255, 80, 80), width=2)
        draw.text((540, 420), "VIBRATION SPECTRUM (ISO 10816 CLASS IV)", font=f_small, fill=(255, 170, 0), anchor="mm")

        draw.rounded_rectangle([(180, 460), (900, 620)], radius=20, fill=(10, 12, 24), outline=(255, 40, 60), width=3)
        draw.text((540, 525), "12.8 mm/s", font=f_lcd, fill=(255, 40, 60), anchor="mm")
        draw.text((540, 590), "ISO 10816 DANGER THRESHOLD: > 4.5 mm/s", font=f_small, fill=(180, 190, 210), anchor="mm")

        draw.text((540, 690), "Model: 6205 Deep Groove Ball Bearing", font=f_card, fill=(255, 220, 0), anchor="mm")
        draw.text((540, 760), "Raceway Spalling & Fatigue Life Expired", font=f_card, fill=(255, 80, 80), anchor="mm")

        draw_verdict_stamp(draw, "UNACCEPTABLE VIBRATION", is_pass=False, y=860)

    elif seg_idx == 2:
        draw.rounded_rectangle([(120, 370), (960, 940)], radius=28, fill=(14, 32, 48), outline=(0, 230, 255), width=2)
        draw.text((540, 420), "VOLTCHECK ISO 281 BEARING LIFE SIZING", font=f_small, fill=(0, 230, 255), anchor="mm")

        draw.rounded_rectangle([(180, 460), (900, 620)], radius=20, fill=(8, 26, 22), outline=(0, 255, 150), width=3)
        draw.text((540, 525), "84,200 Hours", font=f_lcd, fill=(0, 255, 180), anchor="mm")
        draw.text((540, 590), "RE-LUBRICATION INTERVAL: 4,200 HOURS", font=f_small, fill=(180, 255, 210), anchor="mm")

        draw.text((540, 685), "New 6205 Bearing Installed + Synthetic Grease", font=f_card, fill=(255, 220, 0), anchor="mm")
        draw.text((540, 755), "Post-Swap Vibration Dropped to 0.8 mm/s", font=f_card, fill=(100, 255, 180), anchor="mm")

        draw_verdict_stamp(draw, "WHISPER-QUIET OPERATION", is_pass=True, y=860)

    else:
        draw.rounded_rectangle([(100, 350), (980, 930)], radius=32, fill=(12, 22, 42), outline=(0, 230, 255), width=3)
        draw.text((540, 430), "VOLTCHECK ⚡", font=f_title, fill=(0, 230, 255), anchor="mm")
        draw.text((540, 510), "ISO 281 Bearing Life & Relubrication Tool", font=f_card, fill=(255, 255, 255), anchor="mm")

        perks = [
            ("⚙️ Radial (Fr) & Axial (Fa) Dynamic Equivalent Load", (255, 225, 0)),
            ("🧪 Grease vs Oil Relubrication Schedule Optimizer", (0, 230, 255)),
            ("📱 100% Free · Essential for Reliability Engineers", (100, 255, 140))
        ]
        for p_idx, (text, p_col) in enumerate(perks):
            by = 590 + p_idx * 95
            draw.rounded_rectangle([(140, by), (940, by + 75)], radius=16, fill=(20, 36, 64), outline=(0, 160, 220), width=1)
            draw.text((540, by + 37), text, font=f_small, fill=p_col, anchor="mm")


def draw_ep4_ultra_graphics(draw, t, seg_idx, f_title, f_card, f_small, f_badge):
    """Ep 4: Hydraulic 300 Bar Water Hammer Shock"""
    f_lcd = ImageFont.truetype(FONT_TITLE, 72)
    if seg_idx == 0:
        draw.rounded_rectangle([(120, 380), (960, 930)], radius=28, fill=(30, 14, 14), outline=(255, 40, 40), width=3)
        draw.rounded_rectangle([(200, 430), (880, 510)], radius=16, fill=(200, 20, 20))
        draw.text((540, 470), "🚰 HYDRAULIC LINE BLOWOUT", font=f_badge, fill=(255, 255, 255), anchor="mm")

        draw.text((540, 580), "Stamping Press Line Rupture", font=f_title, fill=(255, 255, 255), anchor="mm")
        draw.text((540, 680), "Hot Hydraulic Fluid Everywhere!", font=f_card, fill=(255, 210, 0), anchor="mm")
        draw.rounded_rectangle([(180, 750), (900, 850)], radius=20, fill=(15, 20, 35), outline=(255, 50, 50), width=1)
        draw.text((540, 800), "💥 50ms Valve Closure Shockwave", font=f_card, fill=(255, 100, 100), anchor="mm")

    elif seg_idx == 1:
        draw.rounded_rectangle([(120, 370), (960, 940)], radius=28, fill=(22, 22, 42), outline=(255, 90, 0), width=2)
        draw.text((540, 420), "HYDRAULIC SURGE PRESSURE PEAK", font=f_small, fill=(255, 170, 0), anchor="mm")

        draw.rounded_rectangle([(180, 460), (900, 620)], radius=20, fill=(10, 12, 22), outline=(255, 40, 40), width=3)
        draw.text((540, 525), "300+ BAR!", font=f_lcd, fill=(255, 40, 40), anchor="mm")
        draw.text((540, 590), "NORMAL SYSTEM WORKING PRESSURE: 210 BAR", font=f_small, fill=(180, 190, 210), anchor="mm")

        draw.text((540, 690), "Acoustic Shockwave Speed: 1,200 m/s in Steel", font=f_card, fill=(255, 220, 0), anchor="mm")
        draw.text((540, 760), "Rigid Piping Blown Apart by Water Hammer", font=f_card, fill=(255, 80, 80), anchor="mm")

        draw_verdict_stamp(draw, "PRESSURE SURGE PIPE RUPTURE", is_pass=False, y=860)

    elif seg_idx == 2:
        draw.rounded_rectangle([(120, 370), (960, 940)], radius=28, fill=(14, 32, 48), outline=(0, 230, 255), width=2)
        draw.text((540, 420), "VOLTCHECK ACCUMULATOR SIZING (BOYLE'S LAW)", font=f_small, fill=(0, 230, 255), anchor="mm")

        draw.rounded_rectangle([(180, 460), (900, 620)], radius=20, fill=(8, 26, 22), outline=(0, 255, 150), width=3)
        draw.text((540, 525), "P0 = 126 BAR", font=f_lcd, fill=(0, 255, 180), anchor="mm")
        draw.text((540, 590), "25-LITER BLADDER ACCUMULATOR", font=f_small, fill=(180, 255, 210), anchor="mm")

        draw.text((540, 685), "Gas Pre-charge: P0 = 0.9 × P_min (Nitrogen)", font=f_card, fill=(255, 220, 0), anchor="mm")
        draw.text((540, 755), "Surge Peak Dampened by 70% (Peak < 225 Bar)", font=f_card, fill=(100, 255, 180), anchor="mm")

        draw_verdict_stamp(draw, "WATER HAMMER NEUTRALIZED", is_pass=True, y=860)

    else:
        draw.rounded_rectangle([(100, 350), (980, 930)], radius=32, fill=(12, 22, 42), outline=(0, 230, 255), width=3)
        draw.text((540, 430), "VOLTCHECK ⚡", font=f_title, fill=(0, 230, 255), anchor="mm")
        draw.text((540, 510), "Hydraulic Accumulator Sizing Tool", font=f_card, fill=(255, 255, 255), anchor="mm")

        perks = [
            ("🚰 Water Hammer Shock Absorption Sizing", (255, 225, 0)),
            ("⚙️ Isothermal vs Adiabatic Polytropic Compression", (0, 230, 255)),
            ("📱 100% Free · Essential for Fluid Power Engineers", (100, 255, 140))
        ]
        for p_idx, (text, p_col) in enumerate(perks):
            by = 590 + p_idx * 95
            draw.rounded_rectangle([(140, by), (940, by + 75)], radius=16, fill=(20, 36, 64), outline=(0, 160, 220), width=1)
            draw.text((540, by + 37), text, font=f_small, fill=p_col, anchor="mm")


def draw_ep5_ultra_graphics(draw, t, seg_idx, f_title, f_card, f_small, f_badge):
    """Ep 5: Lithium Battery Thermal Runaway & NFPA 855 CFM Sizing"""
    f_lcd = ImageFont.truetype(FONT_TITLE, 72)
    if seg_idx == 0:
        draw.rounded_rectangle([(120, 380), (960, 930)], radius=28, fill=(32, 16, 16), outline=(255, 70, 0), width=3)
        draw.rounded_rectangle([(200, 430), (880, 510)], radius=16, fill=(200, 40, 0))
        draw.text((540, 470), "🤖 BESS ROOM EXPLOSION HAZARD", font=f_badge, fill=(255, 255, 255), anchor="mm")

        draw.text((540, 580), "Lithium Thermal Runaway", font=f_title, fill=(255, 255, 255), anchor="mm")
        draw.text((540, 680), "Flammable Hydrogen Gas Alarm!", font=f_card, fill=(255, 210, 0), anchor="mm")
        draw.rounded_rectangle([(180, 750), (900, 850)], radius=20, fill=(15, 20, 35), outline=(255, 60, 0), width=1)
        draw.text((540, 800), "⚠️ 120 L/min Hydrogen Off-Gas Venting", font=f_card, fill=(255, 100, 100), anchor="mm")

    elif seg_idx == 1:
        draw.rounded_rectangle([(120, 370), (960, 940)], radius=28, fill=(24, 20, 40), outline=(255, 80, 0), width=2)
        draw.text((540, 420), "LOWER EXPLOSIVE LIMIT (NFPA 855 / IFC)", font=f_small, fill=(255, 170, 0), anchor="mm")

        draw.rounded_rectangle([(180, 460), (900, 620)], radius=20, fill=(10, 12, 22), outline=(255, 40, 40), width=3)
        draw.text((540, 525), "38% LFL", font=f_lcd, fill=(255, 40, 40), anchor="mm")
        draw.text((540, 590), "MANDATORY SAFETY LIMIT: MUST REMAIN < 25% LFL", font=f_small, fill=(180, 190, 210), anchor="mm")

        draw.text((540, 690), "Combustible Gases: H2 (Hydrogen), CO, CH4", font=f_card, fill=(255, 220, 0), anchor="mm")
        draw.text((540, 760), "A Single Relay Spark Will Trigger Catastrophic Blast!", font=f_card, fill=(255, 80, 80), anchor="mm")

        draw_verdict_stamp(draw, "EXPLOSION LIMIT EXCEEDED", is_pass=False, y=860)

    elif seg_idx == 2:
        draw.rounded_rectangle([(120, 370), (960, 940)], radius=28, fill=(14, 32, 48), outline=(0, 230, 255), width=2)
        draw.text((540, 420), "VOLTCHECK NFPA 855 VENTILATION SIZING", font=f_small, fill=(0, 230, 255), anchor="mm")

        draw.rounded_rectangle([(180, 460), (900, 620)], radius=20, fill=(8, 26, 22), outline=(0, 255, 150), width=3)
        draw.text((540, 525), "Q = 4,850 CFM", font=f_lcd, fill=(0, 255, 180), anchor="mm")
        draw.text((540, 590), "1,250 CMH CONTINUOUS EXHAUST", font=f_small, fill=(180, 255, 210), anchor="mm")

        draw.text((540, 685), "Compliant with NFPA 855, IFC & IEC 62619", font=f_card, fill=(255, 220, 0), anchor="mm")
        draw.text((540, 755), "Hydrogen Concentration Held Safely Under 12% LFL", font=f_card, fill=(100, 255, 180), anchor="mm")

        draw_verdict_stamp(draw, "EXPLOSION HAZARD NEUTRALIZED", is_pass=True, y=860)

    else:
        draw.rounded_rectangle([(100, 350), (980, 930)], radius=32, fill=(12, 22, 42), outline=(0, 230, 255), width=3)
        draw.text((540, 430), "VOLTCHECK ⚡", font=f_title, fill=(0, 230, 255), anchor="mm")
        draw.text((540, 510), "BESS Explosion Ventilation Sizing Tool", font=f_card, fill=(255, 255, 255), anchor="mm")

        perks = [
            ("🤖 NFPA 855 Hydrogen Off-Gas & CFM Ventilation", (255, 225, 0)),
            ("🛡️ Lower Flammability Limit (LFL) Deflagration Sizing", (0, 230, 255)),
            ("📱 100% Free · Critical for Battery & Energy Engineers", (100, 255, 140))
        ]
        for p_idx, (text, p_col) in enumerate(perks):
            by = 590 + p_idx * 95
            draw.rounded_rectangle([(140, by), (940, by + 75)], radius=16, fill=(20, 36, 64), outline=(0, 160, 220), width=1)
            draw.text((540, by + 37), text, font=f_small, fill=p_col, anchor="mm")


ULTRA_GRAPHIC_DISPATCH = {
    "ep1_voltagedrop": draw_ep1_ultra_graphics,
    "ep2_motor_inrush": draw_ep2_ultra_graphics,
    "ep3_bearing_life": draw_ep3_ultra_graphics,
    "ep4_hydraulic_hammer": draw_ep4_ultra_graphics,
    "ep5_bess_safety": draw_ep5_ultra_graphics
}


# =============================================================================
# BENCHMARK EPISODE RENDER WORKER
# =============================================================================
async def render_benchmark_episode(ep_cfg):
    ep_id = ep_cfg["ep_id"]
    out_mp4 = BASE_DIR / ep_cfg["out_file"]
    print("=" * 80)
    print(f"🏆 Rendering Benchmark Ultra Short: {ep_id}")
    print(f"   Target: {out_mp4.name}")

    # 1. Voice Files
    voice_files = [SCRATCH / f"global_{ep_id}_tts_{i}.mp3" for i in range(4)]
    durations = [get_audio_duration(vf) for vf in voice_files]

    accum = 0.0
    t_cues = []
    for d in durations:
        accum += d
        t_cues.append(accum)

    # 2. Master Audio with Dynamic Ducking & Benchmark SFX
    bgm_path = SCRATCH / ep_cfg["bgm"]
    out_wav = SCRATCH / f"ultra_master_{ep_id}.wav"
    master_audio, mixed_dur, audio_signal = mix_master_audio(voice_files, bgm_path, out_wav)
    print(f"   Mixed Master Audio: {mixed_dur:.2f}s (Broadcast Audio Ducking & SFX applied)")

    # 3. Video Rendering
    fps = 30
    total_frames = int(mixed_dur * fps)
    print(f"   Rendering {total_frames} Ultra Frames (1080x1920 Full HD)...")

    f_badge = ImageFont.truetype(FONT_BOLD, 30)
    f_title = ImageFont.truetype(FONT_TITLE, 52)
    f_sub1 = ImageFont.truetype(FONT_BOLD, 42)
    f_sub2 = ImageFont.truetype(FONT_BOLD, 46)
    f_card = ImageFont.truetype(FONT_BOLD, 36)
    f_small = ImageFont.truetype(FONT_BOLD, 28)

    draw_func = ULTRA_GRAPHIC_DISPATCH[ep_id]

    cmd = [
        FFMPEG, "-y", "-f", "rawvideo", "-vcodec", "rawvideo", "-s", "1080x1920",
        "-pix_fmt", "rgb24", "-r", str(fps), "-i", "-", "-i", str(master_audio),
        "-c:v", "libx264", "-preset", "fast", "-crf", "19", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k", "-shortest", str(out_mp4)
    ]
    pipe = subprocess.Popen(cmd, stdin=subprocess.PIPE)

    for frame_idx in range(total_frames):
        t = frame_idx / fps
        im = Image.new("RGB", (1080, 1920), (12, 16, 28))
        draw = ImageDraw.Draw(im)

        # 1. Blueprint Grid & Crosshairs
        draw_hud_grid(draw)

        # Determine active segment
        seg_idx = 3
        for idx, cue in enumerate(t_cues):
            if t < cue:
                seg_idx = idx
                break

        # 2. Benchmark Top Hook Badge (Pulsing Glow)
        pulse = int(math.sin(t * 6) * 15)
        badge_fill = (
            min(255, ep_cfg["badge_color"][0] + pulse),
            ep_cfg["badge_color"][1],
            ep_cfg["badge_color"][2]
        )
        draw.rounded_rectangle([(210, 95), (870, 165)], radius=32, fill=badge_fill, outline=(255, 255, 255), width=2)
        draw.text((540, 130), ep_cfg["badge"], font=f_badge, fill=(255, 255, 255), anchor="mm")

        # Top Title with subtle shadow
        draw.text((542, 252), ep_cfg["title"], font=f_title, fill=(0, 0, 0), anchor="mm", align="center")
        draw.text((540, 250), ep_cfg["title"], font=f_title, fill=(255, 255, 255), anchor="mm", align="center")

        # 3. Dynamic Technical Infographic
        draw_func(draw, t, seg_idx, f_title, f_card, f_small, f_badge)

        # 4. Reactive Audio Visualizer Bars (Dancing to Voice)
        draw_reactive_audio_visualizer(draw, audio_signal, t)

        # 5. Dynamic Kinetic Subtitle Card
        draw.rounded_rectangle([(70, 1510), (1010, 1730)], radius=24, fill=(5, 8, 16), outline=ep_cfg["accent_color"], width=2)

        script_text = ep_cfg["scripts"][seg_idx]
        words = script_text.split()
        mid = len(words) // 2
        line1 = " ".join(words[:mid])
        line2 = " ".join(words[mid:])

        draw.text((540, 1572), line1, font=f_sub1, fill=(255, 255, 255), anchor="mm")
        draw.text((540, 1655), line2, font=f_sub2, fill=(255, 225, 0), anchor="mm")

        # 6. Ultra Progress Bar
        prog = min(1.0, max(0.0, t / mixed_dur))
        draw.line([(0, 1912), (int(1080 * prog), 1912)], fill=ep_cfg["accent_color"], width=8)

        pipe.stdin.write(im.tobytes())

    pipe.stdin.close()
    pipe.wait()

    size_mb = out_mp4.stat().st_size / (1024 * 1024)
    print(f"✅ Benchmark Render Complete: {out_mp4.name} ({size_mb:.2f} MB)")


def get_audio_duration(file_path):
    cmd = [FFMPEG, "-i", str(file_path)]
    p = subprocess.run(cmd, stderr=subprocess.PIPE, stdout=subprocess.PIPE, text=True)
    for line in p.stderr.split("\n"):
        if "Duration" in line:
            parts = line.split("Duration:")[1].split(",")[0].strip().split(":")
            return float(parts[0]) * 3600 + float(parts[1]) * 60 + float(parts[2])
    return 8.0


async def main():
    print("=" * 80)
    print("🏆 [ULTRA-BENCHMARK] Upgrading All 5 Core Global Shorts")
    print("=" * 80)

    for ep in BENCHMARK_EPISODES:
        await render_benchmark_episode(ep)

    print("\n" + "#" * 80)
    print("🎉 ALL 5 BENCHMARK MASTERPIECES RENDERED WITH AUDIO DUCKING, HUD & GAUGES!")
    print("#" * 80)


if __name__ == "__main__":
    asyncio.run(main())
