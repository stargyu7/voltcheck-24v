# -*- coding: utf-8 -*-
"""
=============================================================================
🏆 [TIER-1 VIRAL BENCHMARK RENDERER] Split-Screen & 0.8s Hazard Hook Engine
=============================================================================
Benchmarks Applied:
1. The 0.8s Rule (Frame 0 Hazard Bar & Instant 80Hz Sub-Bass Impact Drop)
2. Project Farm Side-by-Side Split Screen (❌ FAIL / Left vs ✅ PASS / Right)
3. ElectroBOOM High-Energy Urgency & Smart Broadcast Audio Ducking
4. The Engineering Mindset 24-Band Reactive Phosphor Audio Visualizer
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
FONT_MONO = r"C:\Windows\Fonts\consola.ttf"

# =============================================================================
# EPISODE DEFINITIONS (SIDE-BY-SIDE BENCHMARK)
# =============================================================================
VIRAL_EPISODES = [
    # 1. Electrical & Power
    {
        "ep_id": "s1_420ma_loop",
        "out_file": "shorts_edu_s1_420ma_loop.mp4",
        "voice": "en-US-AndrewMultilingualNeural",
        "bgm": "bolt_mkt_bgm.wav",
        "hazard_label": "⚠️ CRITICAL 24V SIGNAL LOSS DETECTED ⚠️",
        "title": "Why Electricians BANNED 0-10V!\n(The 4-20mA Secret)",
        "accent_color": (0, 230, 255),
        "split_type": "current_loop",
        "scripts": [
            "Stop! Look right here! Why did industrial plants completely BAN zero to ten volt sensors? Because over 100 meters of wire, resistance drops your signal by fifteen percent, giving you dangerous false readings!",
            "Look at the right side: four to twenty milliamps uses Kirchhoff's closed series loop! Current cannot vanish. Whether your wire is ten meters or five hundred meters, current is identical at every single millimeter!",
            "The transmitter automatically ramps compliance voltage to push exact current through line resistance. At the PLC, a two-hundred-fifty ohm resistor converts twelve milliamps into exact three volts with zero signal drop!",
            "Never trust voltage loops for long runs. Calculate transmitter burden and line resistance in three seconds at voltcheck24.com!"
        ],
        "left_label": "❌ 0-10V (100m CABLE)",
        "right_label": "✅ 4-20mA (500m CABLE)",
        "foley_cues": [
            ("sfx_impact.wav", 0.00, 0.90),
            ("sfx_alert.wav", 0.05, 0.75),
            ("foley_probe_tap.wav", 3.2, 0.75),
            ("foley_rotary_switch.wav", 12.0, 0.70),
            ("foley_scope_beep.wav", 22.5, 0.65),
            ("sfx_whoosh.wav", 32.0, 0.60),
        ]
    },
    # 2. Motors & Drives
    {
        "ep_id": "s2_vfd_reflected_wave",
        "out_file": "shorts_edu_s2_vfd_reflected_wave.mp4",
        "voice": "en-US-BrianMultilingualNeural",
        "bgm": "story_bgm_ep2.wav",
        "hazard_label": "💥 1,480V LETHAL SPIKE IN MOTOR WINDING 💥",
        "title": "Why 480V Inverters Create\n1,500V Death Spikes!",
        "accent_color": (255, 170, 0),
        "split_type": "vfd_spike",
        "scripts": [
            "Look at the left oscilloscope trace! That is a fourteen-hundred-eighty volt spike on a four-hundred-eighty volt motor! And it's burning through slot insulation right now.",
            "Modern VFD inverters switch IGBTs in under one hundred nanoseconds! That extreme dv/dt shoots high-frequency pulse waves down the cable at half the speed of light.",
            "When the pulse hits the motor, surge impedance jumps from fifty ohms in cable to one thousand ohms in windings! That mismatch acts like a brick wall, reflecting the wave and doubling voltage at the terminals!",
            "Look at the right trace: adding a dv/dt reactor clamps voltage down to five hundred twenty volts! Calculate critical cable length in three seconds at voltcheck24.com!"
        ],
        "left_label": "❌ NO FILTER (1,480V ARC)",
        "right_label": "✅ dv/dt REACTOR (520V PASS)",
        "foley_cues": [
            ("sfx_impact.wav", 0.00, 0.90),
            ("sfx_alert.wav", 0.05, 0.75),
            ("sfx_spark.wav", 1.8, 0.85),
            ("foley_scope_beep.wav", 11.5, 0.65),
            ("foley_relay_clack.wav", 21.0, 0.70),
            ("sfx_whoosh.wav", 30.0, 0.60),
        ]
    },
    # 3. Mechanical & Structural
    {
        "ep_id": "s3_shaft_stress_notch",
        "out_file": "shorts_edu_s3_shaft_stress_notch.mp4",
        "voice": "en-US-AndrewMultilingualNeural",
        "bgm": "story_bgm_ep3.wav",
        "hazard_label": "⚙️ CATASTROPHIC FATIGUE FRACTURE WARNING ⚙️",
        "title": "The 0.5mm Mistake That Snapped\na $45,000 Solid Steel Shaft!",
        "accent_color": (255, 60, 80),
        "split_type": "stress_notch",
        "scripts": [
            "See this red stress hot-spot on the left? That sharp zero-point-five millimeter step just snapped a forty-five-thousand dollar drive shaft after only three weeks!",
            "The machinist thought a tiny corner radius didn't matter. But according to Neuber's stress concentration factor, that sharp ninety-degree corner multiplies nominal shear stress by three hundred twenty percent!",
            "Cyclic rotation created micro-cracks along the red line until sudden fracture. Now look at the right side: increasing fillet radius from zero-point-five to three millimeters drops Kt to one-point-three, multiplying fatigue life tenfold!",
            "Never machine sharp steps on rotating shafts. Calculate notch stress concentration factors in three seconds at voltcheck24.com!"
        ],
        "left_label": "❌ r=0.5mm (Kt=3.20 FAIL)",
        "right_label": "✅ r=3.0mm (Kt=1.30 PASS)",
        "foley_cues": [
            ("sfx_impact.wav", 0.00, 0.95),
            ("sfx_alert.wav", 0.05, 0.70),
            ("foley_probe_tap.wav", 2.2, 0.75),
            ("foley_rotary_switch.wav", 12.5, 0.65),
            ("foley_scope_beep.wav", 22.0, 0.65),
            ("sfx_whoosh.wav", 31.0, 0.60),
        ]
    },
    # 4. Hydraulics & Fluids
    {
        "ep_id": "s4_hydraulic_cavitation",
        "out_file": "shorts_edu_s4_hydraulic_cavitation.mp4",
        "voice": "en-US-BrianMultilingualNeural",
        "bgm": "story_bgm_ep4.wav",
        "hazard_label": "🛢️ 10,000 BAR CAVITATION SHOCKWAVE 🛢️",
        "title": "Cold Oil Boiling at Room Temp?\nThe 10,000 Bar Pump Destroyer!",
        "accent_color": (0, 220, 255),
        "split_type": "cavitation",
        "scripts": [
            "Listen to that gravel grinding sound! That is hydraulic cavitation, and it's chewing this stainless steel pump impeller into Swiss cheese right now!",
            "Oil doesn't need heat to boil! Look at the left gauge: when suction pressure drops below fluid vapor pressure at minus zero-point-eight bar, cold room-temperature oil spontaneously boils into vapor bubbles!",
            "When those bubbles travel into the high-pressure zone, they collapse in nanoseconds, unleashing supersonic micro-jets exceeding ten thousand bar! The right side sizes proper suction pipe diameter, eliminating bubbles completely.",
            "Protect your hydraulic pumps from cavitation pitting. Calculate Net Positive Suction Head and pipe velocity in three seconds at voltcheck24.com!"
        ],
        "left_label": "❌ VACUUM -0.82 BAR (BOILING)",
        "right_label": "✅ NPSH MARGIN (SMOOTH FLOW)",
        "foley_cues": [
            ("sfx_impact.wav", 0.00, 0.90),
            ("foley_ultrasound_hiss.wav", 0.10, 0.85),
            ("sfx_alert.wav", 2.5, 0.70),
            ("foley_rotary_switch.wav", 13.0, 0.65),
            ("foley_ultrasound_hiss.wav", 21.0, 0.70),
            ("sfx_whoosh.wav", 30.0, 0.60),
        ]
    },
    # 5. HVAC & Enclosures
    {
        "ep_id": "s5_panel_dewpoint",
        "out_file": "shorts_edu_s5_panel_dewpoint.mp4",
        "voice": "en-US-AndrewMultilingualNeural",
        "bgm": "story_bgm_ep5.wav",
        "hazard_label": "🌧️ INDOOR RAIN & $50,000 PLC FIRE HAZARD 🌧️",
        "title": "Why Setting Panel AC to 18°C\nCauses Indoor Rain! ($50k Fire)",
        "accent_color": (100, 200, 255),
        "split_type": "dewpoint",
        "scripts": [
            "Look at the thermal camera on the left! The maintenance crew set the panel air conditioner to eighteen degrees thinking cooler is better... and it blew up a fifty-thousand dollar PLC rack!",
            "Here's the deadly trap: the factory floor is thirty-two degrees at eighty percent humidity. That means the atmospheric dew point is twenty-eight-point-two degrees!",
            "When the cabinet interior drops below twenty-eight degrees, moisture condenses out of thin air, dripping indoor rain directly onto twenty-four volt power supplies and sparking short-circuit fires!",
            "Look at the right side: setting AC five degrees above dew point keeps components cool with zero condensation. Calculate panel cooling limits in three seconds at voltcheck24.com!"
        ],
        "left_label": "❌ SET 18°C (RAIN CONDENSING)",
        "right_label": "✅ SET 30°C (DRY & COOL PASS)",
        "foley_cues": [
            ("sfx_impact.wav", 0.00, 0.90),
            ("sfx_alert.wav", 0.05, 0.70),
            ("foley_flir_shutter.wav", 1.8, 0.85),
            ("sfx_spark.wav", 4.0, 0.75),
            ("foley_flir_shutter.wav", 14.5, 0.75),
            ("sfx_whoosh.wav", 30.0, 0.60),
        ]
    },
    # 6. Robotics & Automation
    {
        "ep_id": "s6_robot_inertia_ratio",
        "out_file": "shorts_edu_s6_robot_inertia_ratio.mp4",
        "voice": "en-US-BrianMultilingualNeural",
        "bgm": "bolt_eng_bgm.wav",
        "hazard_label": "🤖 VIOLENT SERVO RESONANCE OSCILLATION 🤖",
        "title": "Why Robot Arms Shake Like\nEarthquakes! (The 10:1 Trap)",
        "accent_color": (0, 255, 190),
        "split_type": "inertia_ratio",
        "scripts": [
            "Why is this high-speed robot arm violently shaking like an earthquake? The servo motor has plenty of torque, so what went wrong?",
            "Look at the left trace: load inertia is eighteen times greater than motor rotor inertia! When load-to-rotor inertia ratio exceeds ten to one, shaft elasticity creates anti-resonance, causing uncontrollable hunting oscillation!",
            "Now look at the right side: we inserted a five-to-one planetary gearbox. Reflected load inertia drops by the square of the gear ratio... a massive twenty-five-fold reduction!",
            "Inertia ratio plunges to zero-point-seven to one, stabilizing the robot arm with rock-solid sub-millimeter precision. Calculate servo inertia matching in three seconds at voltcheck24.com!"
        ],
        "left_label": "❌ DIRECT DRIVE (JL/JM=18:1)",
        "right_label": "✅ 5:1 GEARBOX (JL/JM=0.72:1)",
        "foley_cues": [
            ("sfx_impact.wav", 0.00, 0.90),
            ("sfx_alert.wav", 0.05, 0.75),
            ("foley_relay_clack.wav", 2.0, 0.75),
            ("foley_scope_beep.wav", 12.5, 0.65),
            ("foley_rotary_switch.wav", 21.0, 0.70),
            ("sfx_whoosh.wav", 31.0, 0.60),
        ]
    }
]


# =============================================================================
# AUDIO SYNTHESIS & DUCKING
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


async def generate_voice_files(ep):
    voice_files = []
    import edge_tts
    for idx, sentence in enumerate(ep["scripts"]):
        out_mp3 = SCRATCH / f"viral_{ep['ep_id']}_v{idx}.mp3"
        rate_str = "+4%" if idx == 0 else "+2%"
        communicate = edge_tts.Communicate(sentence, ep["voice"], rate=rate_str)
        await communicate.save(str(out_mp3))
        voice_files.append(str(out_mp3))
    return voice_files


def mix_viral_audio(voice_files, bgm_path, foley_cues, out_wav):
    concat_txt = SCRATCH / "tmp_concat_viral_mix.txt"
    with open(concat_txt, "w", encoding="utf-8") as f:
        for vf in voice_files:
            f.write(f"file '{vf}'\n")

    tmp_voice_mp3 = SCRATCH / "tmp_voice_viral_mix.mp3"
    subprocess.run([FFMPEG, "-y", "-f", "concat", "-safe", "0", "-i", str(concat_txt), "-c", "copy", str(tmp_voice_mp3)],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    tmp_voice_wav = SCRATCH / "tmp_voice_viral_mix.wav"
    subprocess.run([FFMPEG, "-y", "-i", str(tmp_voice_mp3), "-ar", "44100", "-ac", "1", str(tmp_voice_wav)],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    sr, voice = load_wav(tmp_voice_wav)
    sr_bgm, bgm = load_wav(bgm_path)

    # Prepend 0.1s silence to start voice instantly at 0.10s
    pad = int(sr * 0.10)
    voice_padded = np.zeros((len(voice) + pad, 2), dtype=np.float32)
    voice_padded[pad:] = voice

    n_samples = len(voice_padded)
    master = np.zeros((n_samples, 2), dtype=np.float32)

    # Broadcast Dynamic Ducking
    window_size = int(sr * 0.08)
    abs_voice = np.abs(voice_padded[:, 0])
    kernel = np.ones(window_size) / window_size
    envelope = np.convolve(abs_voice, kernel, mode='same')
    duck_gain = np.where(envelope > 0.03, 0.10, 0.23)
    duck_gain = np.column_stack([duck_gain, duck_gain])

    if len(bgm) < n_samples:
        repeats = int(math.ceil(n_samples / len(bgm)))
        bgm = np.tile(bgm, (repeats, 1))
    bgm_trimmed = bgm[:n_samples]

    master += voice_padded * 1.42
    master += bgm_trimmed * duck_gain

    # Layer Foley & SFX Cues
    for cue_name, t_sec, vol in foley_cues:
        p = SCRATCH / cue_name
        if not p.exists():
            continue
        _, sfx = load_wav(p)
        idx = int(t_sec * sr)
        if idx < n_samples:
            slen = min(len(sfx), n_samples - idx)
            master[idx:idx + slen] += sfx[:slen] * vol

    master = np.tanh(master * 0.95)

    with wave.open(str(out_wav), "w") as f:
        f.setnchannels(2)
        f.setsampwidth(2)
        f.setframerate(sr)
        f.writeframes((master * 32767).astype(np.int16).tobytes())

    return out_wav, n_samples / sr, master[:, 0]


# =============================================================================
# GRAPHICS ENGINE: 0.8S HAZARD FLASH & SPLIT-SCREEN TESTS
# =============================================================================
def draw_hazard_bar(draw, t, hazard_label, w=1080):
    """0.8s rule: Blinking high-contrast yellow/black hazard warning bar"""
    # Flash state (10Hz blink in first 1.8 seconds)
    is_flash = (int(t * 10) % 2 == 0) if t < 1.8 else True
    bar_h = 75
    # Striped hazard background
    stripe_w = 40
    for sx in range(0, w + bar_h, stripe_w):
        col = (255, 210, 0) if (sx // stripe_w) % 2 == 0 else (20, 20, 20)
        draw.polygon([(sx, 0), (sx + 25, 0), (sx + 25 - bar_h, bar_h), (sx - bar_h, bar_h)], fill=col)

    # Center banner badge
    bx1, bx2 = 60, w - 60
    badge_bg = (230, 20, 20) if is_flash else (180, 10, 10)
    draw.rounded_rectangle([(bx1, 10), (bx2, 65)], radius=10, fill=badge_bg, outline=(255, 255, 255), width=2)
    f_haz = ImageFont.truetype(FONT_TITLE, 28)
    draw.text((w // 2, 37), hazard_label, fill=(255, 255, 255), font=f_haz, anchor="mm")


def draw_split_screen_current_loop(draw, t, lx, rx, pw, ph, top_y):
    """S1: 0-10V (Left) vs 4-20mA (Right)"""
    # Left: 0-10V dropping over 100m
    v_drop = 8.42 + math.sin(t * 14) * 0.08
    draw.rounded_rectangle([(lx, top_y), (lx + pw, top_y + ph)], radius=16, fill=(35, 12, 16), outline=(240, 50, 50), width=3)
    # LCD Display Left
    draw.rounded_rectangle([(lx + 25, top_y + 80), (lx + pw - 25, top_y + 240)], radius=10, fill=(45, 18, 22), outline=(180, 40, 40), width=2)
    f_num = ImageFont.truetype(FONT_TITLE, 64)
    f_lbl = ImageFont.truetype(FONT_BOLD, 26)
    draw.text((lx + pw // 2, top_y + 135), f"{v_drop:.2f} V", fill=(255, 80, 80), font=f_num, anchor="mm")
    draw.text((lx + pw // 2, top_y + 200), "-1.58V (-15.8% ERROR)", fill=(255, 140, 140), font=f_lbl, anchor="mm")
    # Waveform / Distortion trace
    draw.text((lx + 35, top_y + 270), "WIRE RESISTANCE: 15.8Ω", fill=(240, 120, 120), font=f_lbl)
    draw.text((lx + 35, top_y + 320), "TERMINAL: SENSORS OFF", fill=(255, 60, 60), font=f_lbl)

    # Right: 4-20mA Rock-Solid 12.000mA
    ma_val = 12.000 + math.sin(t * 8) * 0.002
    draw.rounded_rectangle([(rx, top_y), (rx + pw, top_y + ph)], radius=16, fill=(12, 35, 24), outline=(0, 220, 100), width=3)
    # LCD Display Right
    draw.rounded_rectangle([(rx + 25, top_y + 80), (rx + pw - 25, top_y + 240)], radius=10, fill=(18, 48, 30), outline=(0, 180, 80), width=2)
    draw.text((rx + pw // 2, top_y + 135), f"{ma_val:.3f} mA", fill=(0, 255, 140), font=f_num, anchor="mm")
    draw.text((rx + pw // 2, top_y + 200), "0.00% ZERO SIGNAL LOSS", fill=(120, 255, 180), font=f_lbl, anchor="mm")
    # Technical Note
    draw.text((rx + 35, top_y + 270), "KIRCHHOFF SERIES LOOP", fill=(100, 255, 160), font=f_lbl)
    draw.text((rx + 35, top_y + 320), "250Ω BURDEN = 3.000V", fill=(0, 230, 255), font=f_lbl)


def draw_split_screen_vfd(draw, t, lx, rx, pw, ph, top_y):
    """S2: No Filter (Left: 1,480V) vs dv/dt Reactor (Right: 520V)"""
    f_num = ImageFont.truetype(FONT_TITLE, 60)
    f_lbl = ImageFont.truetype(FONT_BOLD, 26)

    # Left: High Voltage Ringing Arc
    draw.rounded_rectangle([(lx, top_y), (lx + pw, top_y + ph)], radius=16, fill=(35, 14, 18), outline=(240, 50, 50), width=3)
    draw.rounded_rectangle([(lx + 25, top_y + 80), (lx + pw - 25, top_y + 240)], radius=10, fill=(20, 8, 12), outline=(200, 40, 40), width=2)
    v_peak = int(1480 + math.sin(t * 20) * 35)
    draw.text((lx + pw // 2, top_y + 135), f"{v_peak} V", fill=(255, 60, 60), font=f_num, anchor="mm")
    draw.text((lx + pw // 2, top_y + 200), "INSULATION PUNCTURE!", fill=(255, 120, 120), font=f_lbl, anchor="mm")
    # Scope simulation left
    draw.text((lx + 35, top_y + 270), "dv/dt: 12,400 V/μs", fill=(255, 100, 100), font=f_lbl)
    draw.text((lx + 35, top_y + 320), "WAVE REFLECTION: +96%", fill=(255, 150, 50), font=f_lbl)

    # Right: dv/dt Clamped 520V
    draw.rounded_rectangle([(rx, top_y), (rx + pw, top_y + ph)], radius=16, fill=(12, 35, 25), outline=(0, 220, 100), width=3)
    draw.rounded_rectangle([(rx + 25, top_y + 80), (rx + pw - 25, top_y + 240)], radius=10, fill=(8, 24, 16), outline=(0, 180, 80), width=2)
    v_safe = int(520 + math.sin(t * 8) * 8)
    draw.text((rx + pw // 2, top_y + 135), f"{v_safe} V", fill=(0, 255, 140), font=f_num, anchor="mm")
    draw.text((rx + pw // 2, top_y + 200), "100% CLAMPED & SAFE", fill=(120, 255, 180), font=f_lbl, anchor="mm")
    draw.text((rx + 35, top_y + 270), "dv/dt: < 200 V/μs", fill=(100, 255, 160), font=f_lbl)
    draw.text((rx + 35, top_y + 320), "100,000h WINDING LIFE", fill=(0, 230, 255), font=f_lbl)


def draw_split_screen_notch(draw, t, lx, rx, pw, ph, top_y):
    """S3: r=0.5mm (Left: Kt=3.20) vs r=3.0mm (Right: Kt=1.30)"""
    f_num = ImageFont.truetype(FONT_TITLE, 60)
    f_lbl = ImageFont.truetype(FONT_BOLD, 26)

    # Left: Sharp step
    draw.rounded_rectangle([(lx, top_y), (lx + pw, top_y + ph)], radius=16, fill=(35, 14, 18), outline=(240, 50, 50), width=3)
    draw.rounded_rectangle([(lx + 25, top_y + 80), (lx + pw - 25, top_y + 240)], radius=10, fill=(20, 8, 12), outline=(200, 40, 40), width=2)
    draw.text((lx + pw // 2, top_y + 135), "Kt = 3.20", fill=(255, 60, 60), font=f_num, anchor="mm")
    draw.text((lx + pw // 2, top_y + 200), "STRESS TRIPLE PEAK!", fill=(255, 120, 120), font=f_lbl, anchor="mm")
    draw.text((lx + 35, top_y + 270), "FILLET RADIUS: 0.5mm", fill=(255, 100, 100), font=f_lbl)
    draw.text((lx + 35, top_y + 320), "FATIGUE: 3 WEEKS SNAP", fill=(255, 60, 60), font=f_lbl)

    # Right: Fillet 3.0mm
    draw.rounded_rectangle([(rx, top_y), (rx + pw, top_y + ph)], radius=16, fill=(12, 35, 25), outline=(0, 220, 100), width=3)
    draw.rounded_rectangle([(rx + 25, top_y + 80), (rx + pw - 25, top_y + 240)], radius=10, fill=(8, 24, 16), outline=(0, 180, 80), width=2)
    draw.text((rx + pw // 2, top_y + 135), "Kt = 1.30", fill=(0, 255, 140), font=f_num, anchor="mm")
    draw.text((rx + pw // 2, top_y + 200), "STRESS DROPPED 60%", fill=(120, 255, 180), font=f_lbl, anchor="mm")
    draw.text((rx + 35, top_y + 270), "FILLET RADIUS: 3.0mm", fill=(100, 255, 160), font=f_lbl)
    draw.text((rx + 35, top_y + 320), "FATIGUE: 10x MULTIPLIER", fill=(0, 230, 255), font=f_lbl)


def draw_split_screen_cavitation(draw, t, lx, rx, pw, ph, top_y):
    """S4: Boiling Cold Oil (Left: -0.82 bar) vs NPSH Sized (Right: Smooth Flow)"""
    f_num = ImageFont.truetype(FONT_TITLE, 56)
    f_lbl = ImageFont.truetype(FONT_BOLD, 26)

    # Left: Cavitation Boiling
    draw.rounded_rectangle([(lx, top_y), (lx + pw, top_y + ph)], radius=16, fill=(35, 15, 20), outline=(240, 50, 50), width=3)
    draw.rounded_rectangle([(lx + 25, top_y + 80), (lx + pw - 25, top_y + 240)], radius=10, fill=(20, 8, 12), outline=(200, 40, 40), width=2)
    draw.text((lx + pw // 2, top_y + 135), "-0.82 BAR", fill=(255, 60, 60), font=f_num, anchor="mm")
    draw.text((lx + pw // 2, top_y + 200), "10,000 BAR MICRO-JETS", fill=(255, 120, 120), font=f_lbl, anchor="mm")
    draw.text((lx + 35, top_y + 270), "P_suction < P_vapor", fill=(255, 100, 100), font=f_lbl)
    draw.text((lx + 35, top_y + 320), "IMPELLER PITTED & EATEN", fill=(255, 60, 60), font=f_lbl)

    # Right: Smooth Flow
    draw.rounded_rectangle([(rx, top_y), (rx + pw, top_y + ph)], radius=16, fill=(12, 35, 25), outline=(0, 220, 100), width=3)
    draw.rounded_rectangle([(rx + 25, top_y + 80), (rx + pw - 25, top_y + 240)], radius=10, fill=(8, 24, 16), outline=(0, 180, 80), width=2)
    draw.text((rx + pw // 2, top_y + 135), "-0.15 BAR", fill=(0, 255, 140), font=f_num, anchor="mm")
    draw.text((rx + pw // 2, top_y + 200), "LAMINAR ZERO BUBBLES", fill=(120, 255, 180), font=f_lbl, anchor="mm")
    draw.text((rx + 35, top_y + 270), "NPSH_avail > NPSH_req", fill=(100, 255, 160), font=f_lbl)
    draw.text((rx + 35, top_y + 320), "STEEL IMPELLER SAVED", fill=(0, 230, 255), font=f_lbl)


def draw_split_screen_dewpoint(draw, t, lx, rx, pw, ph, top_y):
    """S5: Set 18C (Left: Indoor Rain) vs Set 30C (Right: Dry & Cool)"""
    f_num = ImageFont.truetype(FONT_TITLE, 56)
    f_lbl = ImageFont.truetype(FONT_BOLD, 26)

    # Left: Indoor Rain
    draw.rounded_rectangle([(lx, top_y), (lx + pw, top_y + ph)], radius=16, fill=(20, 15, 35), outline=(240, 50, 50), width=3)
    draw.rounded_rectangle([(lx + 25, top_y + 80), (lx + pw - 25, top_y + 240)], radius=10, fill=(14, 10, 26), outline=(200, 40, 40), width=2)
    draw.text((lx + pw // 2, top_y + 135), "18.0°C (AC)", fill=(0, 180, 255), font=f_num, anchor="mm")
    draw.text((lx + pw // 2, top_y + 200), "DEW POINT: 28.2°C (RAIN!)", fill=(255, 80, 80), font=f_lbl, anchor="mm")
    draw.text((lx + 35, top_y + 270), "100% AIR CONDENSATION", fill=(255, 100, 100), font=f_lbl)
    draw.text((lx + 35, top_y + 320), "SHORT CIRCUIT FIRE!", fill=(255, 60, 60), font=f_lbl)

    # Right: Safe Setpoint
    draw.rounded_rectangle([(rx, top_y), (rx + pw, top_y + ph)], radius=16, fill=(12, 35, 25), outline=(0, 220, 100), width=3)
    draw.rounded_rectangle([(rx + 25, top_y + 80), (rx + pw - 25, top_y + 240)], radius=10, fill=(8, 24, 16), outline=(0, 180, 80), width=2)
    draw.text((rx + pw // 2, top_y + 135), "30.0°C (AC)", fill=(0, 255, 140), font=f_num, anchor="mm")
    draw.text((rx + pw // 2, top_y + 200), "ABOVE DEW POINT (DRY)", fill=(120, 255, 180), font=f_lbl, anchor="mm")
    draw.text((rx + 35, top_y + 270), "HUMIDITY CONTROLLED", fill=(100, 255, 160), font=f_lbl)
    draw.text((rx + 35, top_y + 320), "$50k PLC RACK PROTECTED", fill=(0, 230, 255), font=f_lbl)


def draw_split_screen_inertia(draw, t, lx, rx, pw, ph, top_y):
    """S6: Direct Drive (Left: Shaking) vs 5:1 Gearbox (Right: Precision)"""
    f_num = ImageFont.truetype(FONT_TITLE, 52)
    f_lbl = ImageFont.truetype(FONT_BOLD, 26)

    # Left: Shaking
    draw.rounded_rectangle([(lx, top_y), (lx + pw, top_y + ph)], radius=16, fill=(35, 15, 20), outline=(240, 50, 50), width=3)
    draw.rounded_rectangle([(lx + 25, top_y + 80), (lx + pw - 25, top_y + 240)], radius=10, fill=(20, 8, 12), outline=(200, 40, 40), width=2)
    draw.text((lx + pw // 2, top_y + 135), "JL/JM = 18:1", fill=(255, 60, 60), font=f_num, anchor="mm")
    draw.text((lx + pw // 2, top_y + 200), "VIOLENT RESONANCE!", fill=(255, 120, 120), font=f_lbl, anchor="mm")
    draw.text((lx + 35, top_y + 270), "ANTI-RESONANCE NOTCH", fill=(255, 100, 100), font=f_lbl)
    draw.text((lx + 35, top_y + 320), "ROBOT ARM HUNTING SHAKE", fill=(255, 60, 60), font=f_lbl)

    # Right: 5:1 Planetary Reducer
    draw.rounded_rectangle([(rx, top_y), (rx + pw, top_y + ph)], radius=16, fill=(12, 35, 25), outline=(0, 220, 100), width=3)
    draw.rounded_rectangle([(rx + 25, top_y + 80), (rx + pw - 25, top_y + 240)], radius=10, fill=(8, 24, 16), outline=(0, 180, 80), width=2)
    draw.text((rx + pw // 2, top_y + 135), "JL/JM = 0.72:1", fill=(0, 255, 140), font=f_num, anchor="mm")
    draw.text((rx + pw // 2, top_y + 200), "INERTIA DROPPED 25x", fill=(120, 255, 180), font=f_lbl, anchor="mm")
    draw.text((rx + 35, top_y + 270), "5:1 GEARBOX REDUCTION", fill=(100, 255, 160), font=f_lbl)
    draw.text((rx + 35, top_y + 320), "±0.01mm ROCK-SOLID PASS", fill=(0, 230, 255), font=f_lbl)


def draw_reactive_audio_visualizer(draw, audio_signal, t, sr=44100, num_bars=24):
    """The Engineering Mindset signature HUD visualizer"""
    idx = int(t * sr)
    chunk = audio_signal[max(0, idx - 1024):idx + 1024]
    energy = np.abs(chunk) if len(chunk) > 0 else np.zeros(10)
    mean_e = np.mean(energy) * 12.0

    base_y = 1760
    start_x = 110
    bar_width = 30
    gap = 6

    for b in range(num_bars):
        bx = start_x + b * (bar_width + gap)
        mod = math.sin(t * 15 + b * 0.5) * 0.4 + 0.6
        bar_h = int(12 + mean_e * 120 * mod + math.sin(b * 0.8) * 8)
        bar_h = max(8, min(95, bar_h))
        col = (0, int(200 + b * 2), 255) if b < 16 else (255, int(220 - (b-16)*20), 0)
        draw.rounded_rectangle([(bx, base_y - bar_h), (bx + bar_width, base_y)], radius=4, fill=col)


# =============================================================================
# MAIN RENDERER
# =============================================================================
def render_viral_video(ep):
    print("\n" + "=" * 85)
    print(f"🎬 [TIER-1 VIRAL OVERHAUL] Rendering: {ep['title'].replace(chr(10), ' ')}")
    print(f"   Episode ID: {ep['ep_id']} | Split: {ep['split_type']}")
    print("=" * 85)

    # 1. Voice generation
    voice_files = asyncio.run(generate_voice_files(ep))

    # 2. Master audio mixing
    bgm_path = SCRATCH / ep["bgm"]
    out_wav = SCRATCH / f"viral_{ep['ep_id']}_master.wav"
    _, total_dur, audio_signal = mix_viral_audio(voice_files, bgm_path, ep["foley_cues"], out_wav)
    print(f"   Master Audio Duration: {total_dur:.2f} seconds")

    # 3. Stream frames into FFmpeg
    out_mp4 = BASE_DIR / ep["out_file"]
    fps = 60
    total_frames = int(total_dur * fps)
    w, h = 1080, 1920

    cmd = [
        FFMPEG, "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{w}x{h}",
        "-pix_fmt", "rgb24",
        "-r", str(fps),
        "-i", "-",
        "-i", str(out_wav),
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-crf", "18",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        str(out_mp4)
    ]

    pipe = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    f_title = ImageFont.truetype(FONT_TITLE, 50)
    f_badge = ImageFont.truetype(FONT_BOLD, 28)
    f_sub = ImageFont.truetype(FONT_BOLD, 36)
    f_cta = ImageFont.truetype(FONT_TITLE, 40)
    f_split_hdr = ImageFont.truetype(FONT_TITLE, 28)

    num_sentences = len(ep["scripts"])
    seg_dur = total_dur / num_sentences

    lx, rx = 45, 555
    pw, ph = 480, 410
    split_top_y = 310

    for frame_idx in range(total_frames):
        t = frame_idx / fps
        img = Image.new("RGB", (w, h), (10, 14, 22))
        draw = ImageDraw.Draw(img)

        # 1. Background Grid & Corner brackets
        for gx in range(0, w, 80):
            draw.line([(gx, 0), (gx, h)], fill=(16, 22, 38), width=1)
        for gy in range(0, h, 80):
            draw.line([(0, gy), (w, gy)], fill=(16, 22, 38), width=1)

        # 2. 0.8s Hazard Bar & Title Header
        draw_hazard_bar(draw, t, ep["hazard_label"], w)
        draw.text((w // 2, 195), ep["title"], fill=(255, 255, 255), font=f_title, anchor="mm", align="center")

        # 3. Project Farm Side-by-Side Headers
        draw.text((lx + pw // 2, split_top_y + 40), ep["left_label"], fill=(255, 70, 70), font=f_split_hdr, anchor="mm")
        draw.text((rx + pw // 2, split_top_y + 40), ep["right_label"], fill=(0, 230, 120), font=f_split_hdr, anchor="mm")

        # 4. Split-Screen Graphic Engine
        st = ep["split_type"]
        if st == "current_loop":
            draw_split_screen_current_loop(draw, t, lx, rx, pw, ph, split_top_y)
        elif st == "vfd_spike":
            draw_split_screen_vfd(draw, t, lx, rx, pw, ph, split_top_y)
        elif st == "stress_notch":
            draw_split_screen_notch(draw, t, lx, rx, pw, ph, split_top_y)
        elif st == "cavitation":
            draw_split_screen_cavitation(draw, t, lx, rx, pw, ph, split_top_y)
        elif st == "dewpoint":
            draw_split_screen_dewpoint(draw, t, lx, rx, pw, ph, split_top_y)
        elif st == "inertia_ratio":
            draw_split_screen_inertia(draw, t, lx, rx, pw, ph, split_top_y)

        # 5. Dynamic Subtitle Box with Field Engineer Log
        cur_seg = min(int(t / seg_dur), num_sentences - 1)
        sub_text = ep["scripts"][cur_seg]

        sub_y = 760
        draw.rounded_rectangle([(50, sub_y), (w - 50, sub_y + 360)], radius=18, fill=(16, 22, 34), outline=(45, 65, 95), width=2)
        draw.text((80, sub_y + 38), f"LAB AUTOPSY LOG: STEP {cur_seg + 1} OF 4", fill=ep["accent_color"], font=f_badge)

        words = sub_text.split()
        lines = []
        cur_line = []
        for word in words:
            cur_line.append(word)
            if len(" ".join(cur_line)) > 38:
                lines.append(" ".join(cur_line))
                cur_line = []
        if cur_line:
            lines.append(" ".join(cur_line))

        for l_idx, line in enumerate(lines[:4]):
            draw.text((80, sub_y + 90 + l_idx * 50), line, fill=(245, 248, 255), font=f_sub)

        # 6. Call To Action Card
        cta_y = 1150
        draw.rounded_rectangle([(50, cta_y), (w - 50, cta_y + 200)], radius=18, fill=(18, 26, 42), outline=(0, 210, 255), width=3)
        draw.text((w // 2, cta_y + 55), "78+ FREE INDUSTRIAL CALCULATORS", fill=(0, 220, 255), font=f_badge, anchor="mm")
        draw.text((w // 2, cta_y + 130), "👉 voltcheck24.com", fill=(255, 255, 255), font=f_cta, anchor="mm")

        # 7. Reactive 24-Band Audio Visualizer
        draw_reactive_audio_visualizer(draw, audio_signal, t)

        pipe.stdin.write(img.tobytes())

        if frame_idx % 300 == 0:
            print(f"\r   Rendering Progress: {int(frame_idx / total_frames * 100)}%", end="")

    pipe.stdin.close()
    pipe.wait()
    print(f"\n✅ Completed: {out_mp4.name} ({out_mp4.stat().st_size / (1024*1024):.1f} MB)")
    return out_mp4


def main():
    print("=" * 85)
    print("🚀 [TIER-1 VIRAL BENCHMARK] Rendering All 6 Split-Screen Educational Shorts")
    print("=" * 85)
    for ep in VIRAL_EPISODES:
        render_viral_video(ep)
    print("\n" + "=" * 85)
    print("🎉 All 6 Split-Screen Forensic Shorts Successfully Rendered in Full HD!")
    print("=" * 85)


if __name__ == "__main__":
    main()
