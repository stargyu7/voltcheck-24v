# -*- coding: utf-8 -*-
"""
=============================================================================
🔬 [FORENSIC WORKBENCH AUTOPSY RENDERER] 100% Global Engineering Education
=============================================================================
Zero-AI-Feel Architectural Pillars:
1. Workbench Autopsy Visuals:
   - Real Tektronix Digital Storage Oscilloscope (DSO) with phosphor ringing
   - FLIR Thermal Ironbow heatmaps with crosshairs & spot temps
   - FEA Von Mises stress contour notch concentration
   - Fluke ProcessMeter 12.00mA LCD & circular vacuum gauges
2. Tactile Lab Foley:
   - Probe taps, rotary dials, thermal shutters, relays, cavitation hiss
3. Broadcast Smart Ducking:
   - Dynamic voice envelope tracking for professional balance
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
FONT_MONO = r"C:\Windows\Fonts\consola.ttf"

# =============================================================================
# 6-SECTOR EDUCATIONAL EPISODES CONFIGURATION
# =============================================================================
FORENSIC_EPISODES = [
    # 1. Electrical & Power
    {
        "ep_id": "s1_420ma_loop",
        "out_file": "shorts_edu_s1_420ma_loop.mp4",
        "voice": "en-US-AndrewMultilingualNeural",
        "bgm": "bolt_mkt_bgm.wav",
        "instrument": "fluke_meter",
        "scripts": [
            "Check this out... Why do engineers NEVER use 0 to 10 volts for long sensor runs in factories? Because over 100 meters, wire resistance drops your signal by 15%, giving you completely false readings!",
            "Instead, we use 4 to 20 milliamps. Look at Kirchhoff's Law: in a closed series loop, current is identical at EVERY single point! Whether your cable is 10 meters or 500 meters long, current cannot vanish.",
            "The transmitter automatically boosts compliance voltage from 12V to 24V to overcome wire resistance. At the PLC, a precision 250-ohm resistor converts 4 to 20mA into an exact 1 to 5 volts, with literally zero signal loss!",
            "Stop guessing analog loop limits. Calculate transmitter loop resistance and burden in 3 seconds at voltcheck24.com!"
        ],
        "badge": "[ ⚡ ELECTRICAL FORENSIC LAB ]",
        "badge_color": (0, 210, 255),
        "title": "Why 4-20mA NEVER Drops\nSignal Over 500 Meters!",
        "accent_color": (0, 230, 255),
        "foley_cues": [
            ("foley_rotary_switch.wav", 0.4, 0.8),
            ("foley_probe_tap.wav", 4.5, 0.7),
            ("foley_scope_beep.wav", 18.2, 0.6),
            ("sfx_spark.wav", 24.5, 0.65),
            ("foley_probe_tap.wav", 30.0, 0.7),
        ]
    },
    # 2. Motors & Drives
    {
        "ep_id": "s2_vfd_reflected_wave",
        "out_file": "shorts_edu_s2_vfd_reflected_wave.mp4",
        "voice": "en-US-BrianMultilingualNeural",
        "bgm": "story_bgm_ep2.wav",
        "instrument": "oscilloscope",
        "scripts": [
            "Look at this oscilloscope trace... That is a 1,480-volt peak ringing spike on a motor designed for only 480 volts! And it's destroying the slot insulation right now.",
            "Here's what happens: modern VFD inverters switch IGBTs in under 100 nanoseconds! That extreme dv/dt sends high-frequency pulse waves down the cable at half the speed of light.",
            "When the wave hits the motor, the surge impedance jumps from 50 ohms in the cable to 1,000 ohms in the winding! That impedance mismatch creates a reflection coefficient near positive one... doubling the voltage at the terminals!",
            "If your VFD cable exceeds 30 meters, you MUST size a dv/dt reactor or sine-wave filter. Calculate critical cable distance in 3 seconds at voltcheck24.com!"
        ],
        "badge": "[ 🛡️ MOTOR & DRIVE LAB ]",
        "badge_color": (255, 140, 0),
        "title": "The 1,500V Reflected Spike\nDestroying Your VFD Motor!",
        "accent_color": (255, 170, 0),
        "foley_cues": [
            ("foley_scope_beep.wav", 0.3, 0.7),
            ("sfx_spark.wav", 2.2, 0.75),
            ("foley_rotary_switch.wav", 11.5, 0.65),
            ("foley_relay_clack.wav", 20.0, 0.7),
            ("sfx_whoosh.wav", 28.5, 0.6),
        ]
    },
    # 3. Mechanical & Structural
    {
        "ep_id": "s3_shaft_stress_notch",
        "out_file": "shorts_edu_s3_shaft_stress_notch.mp4",
        "voice": "en-US-AndrewMultilingualNeural",
        "bgm": "story_bgm_ep3.wav",
        "instrument": "fea_contour",
        "scripts": [
            "See this red stress hot-spot right here? This 0.5-millimeter sharp shoulder just snapped a $45,000 industrial drive shaft in half after only three weeks of operation!",
            "The machinist thought a tiny corner radius wouldn't matter. But according to Neuber's stress concentration factor, that sharp 90-degree corner multiplies nominal shear stress by 320%!",
            "Under cyclic rotation, micro-cracks propagate along the stress concentration line until catastrophic fatigue fracture occurs. Look what happens when we increase the fillet radius from 0.5mm to 3.0mm: Kt plunges from 3.2 down to 1.3, multiplying shaft fatigue life by tenfold!",
            "Never design rotating shafts with sharp internal steps. Calculate notch stress concentration factors in 3 seconds at voltcheck24.com!"
        ],
        "badge": "[ ⚙️ MECHANICAL FORENSIC LAB ]",
        "badge_color": (240, 30, 60),
        "title": "The 0.5mm Notch That Snapped\na $45,000 Drive Shaft!",
        "accent_color": (255, 50, 80),
        "foley_cues": [
            ("foley_probe_tap.wav", 0.5, 0.7),
            ("sfx_impact.wav", 2.0, 0.85),
            ("foley_rotary_switch.wav", 13.0, 0.65),
            ("foley_scope_beep.wav", 23.5, 0.65),
            ("sfx_whoosh.wav", 31.0, 0.6),
        ]
    },
    # 4. Hydraulics & Fluids
    {
        "ep_id": "s4_hydraulic_cavitation",
        "out_file": "shorts_edu_s4_hydraulic_cavitation.mp4",
        "voice": "en-US-BrianMultilingualNeural",
        "bgm": "story_bgm_ep4.wav",
        "instrument": "cavitation_gauge",
        "scripts": [
            "Listen to that awful gravel-grinding sound... That is hydraulic cavitation, and it's literally chewing this stainless steel pump impeller into Swiss cheese!",
            "Most people think fluid only boils when it's hot. But when oil enters a constricted pump inlet, velocity spikes and static pressure plunges below the fluid's vapor pressure! The cold oil spontaneously boils into millions of micro-vapor bubbles.",
            "When those bubbles travel into the high-pressure zone, they collapse violently in nanoseconds, creating supersonic micro-jets with shockwave pressures exceeding 10,000 bar! That shockwave hammers the metal surface until it pits and shatters.",
            "Stop destroying expensive hydraulic pumps. Calculate Net Positive Suction Head and line friction in 3 seconds at voltcheck24.com!"
        ],
        "badge": "[ 🛢️ FLUID POWER LAB ]",
        "badge_color": (0, 200, 255),
        "title": "Why Boiling Cold Oil Destroys\nHydraulic Pumps! (Cavitation)",
        "accent_color": (0, 220, 255),
        "foley_cues": [
            ("foley_ultrasound_hiss.wav", 0.2, 0.85),
            ("sfx_alert.wav", 3.0, 0.6),
            ("foley_rotary_switch.wav", 12.0, 0.6),
            ("foley_ultrasound_hiss.wav", 20.0, 0.75),
            ("sfx_whoosh.wav", 30.0, 0.6),
        ]
    },
    # 5. HVAC & Enclosure Thermal
    {
        "ep_id": "s5_panel_dewpoint",
        "out_file": "shorts_edu_s5_panel_dewpoint.mp4",
        "voice": "en-US-AndrewMultilingualNeural",
        "bgm": "story_bgm_ep5.wav",
        "instrument": "flir_thermal",
        "scripts": [
            "Look at this FLIR thermal camera reading: 19 degrees Celsius inside the control cabinet. The maintenance crew set the air conditioner to maximum cooling thinking it was safe... and it blew up a $50,000 PLC rack!",
            "Here's the deadly trap: the factory floor is 32 degrees Celsius at 80% relative humidity. On the psychrometric chart, that means the dew point is 28.2 degrees!",
            "When the cabinet interior drops below 28 degrees, the humid air trapped inside reaches 100% saturation. Water vapor condenses out of thin air, creating indoor rain that drips directly onto 24V busbars, sparking short-circuit fires!",
            "Never set enclosure cooling below ambient dew point. Calculate cabinet cooling BTU and dew point limits in 3 seconds at voltcheck24.com!"
        ],
        "badge": "[ ❄️ THERMAL & ENCLOSURE LAB ]",
        "badge_color": (80, 180, 255),
        "title": "Setting Enclosure AC Too Cold\nBlew Up a $50,000 PLC Rack!",
        "accent_color": (100, 200, 255),
        "foley_cues": [
            ("foley_flir_shutter.wav", 0.3, 0.85),
            ("sfx_spark.wav", 3.2, 0.75),
            ("foley_flir_shutter.wav", 14.5, 0.75),
            ("foley_relay_clack.wav", 22.0, 0.7),
            ("sfx_whoosh.wav", 30.0, 0.6),
        ]
    },
    # 6. Robotics & Automation
    {
        "ep_id": "s6_robot_inertia_ratio",
        "out_file": "shorts_edu_s6_robot_inertia_ratio.mp4",
        "voice": "en-US-BrianMultilingualNeural",
        "bgm": "bolt_eng_bgm.wav",
        "instrument": "bode_plot",
        "scripts": [
            "Why is this high-speed robotic arm violently oscillating like an earthquake? The motor has plenty of torque, so what went wrong?",
            "Look at the inertia ratio: the load inertia is 18 times greater than the motor rotor inertia! When the load-to-rotor inertia ratio exceeds 10 to 1, the mechanical compliance of the shaft creates an anti-resonance peak in the control loop.",
            "No matter how high you crank the servo velocity gain, the controller chases its own mechanical lag, turning into severe violent resonance! Look what happens when we insert a 5-to-1 planetary gearbox: reflected load inertia drops by the square of the gear ratio... a massive 25-fold reduction!",
            "The inertia ratio drops to 0.7 to 1, and the robot positions with rock-solid sub-millimeter precision. Calculate servo inertia matching in 3 seconds at voltcheck24.com!"
        ],
        "badge": "[ 🤖 ROBOTICS & MOTION LAB ]",
        "badge_color": (0, 255, 180),
        "title": "The 10:1 Inertia Ratio Trap:\nWhy Robot Arms Shake Violently!",
        "accent_color": (0, 255, 190),
        "foley_cues": [
            ("foley_relay_clack.wav", 0.3, 0.8),
            ("sfx_alert.wav", 2.5, 0.65),
            ("foley_scope_beep.wav", 13.0, 0.65),
            ("foley_rotary_switch.wav", 21.0, 0.7),
            ("foley_scope_beep.wav", 31.0, 0.7),
        ]
    }
]


# =============================================================================
# AUDIO PIPELINE: EDGE-TTS & MASTER MIXER
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
        out_mp3 = SCRATCH / f"edu_{ep['ep_id']}_v{idx}.mp3"
        rate_str = "+4%" if idx == 0 else "+2%"
        communicate = edge_tts.Communicate(sentence, ep["voice"], rate=rate_str)
        await communicate.save(str(out_mp3))
        voice_files.append(str(out_mp3))
    return voice_files


def mix_forensic_audio(voice_files, bgm_path, foley_cues, out_wav):
    concat_txt = SCRATCH / "tmp_concat_edu.txt"
    with open(concat_txt, "w", encoding="utf-8") as f:
        for vf in voice_files:
            f.write(f"file '{vf}'\n")

    tmp_voice_mp3 = SCRATCH / "tmp_voice_edu.mp3"
    subprocess.run([FFMPEG, "-y", "-f", "concat", "-safe", "0", "-i", str(concat_txt), "-c", "copy", str(tmp_voice_mp3)],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    tmp_voice_wav = SCRATCH / "tmp_voice_edu.wav"
    subprocess.run([FFMPEG, "-y", "-i", str(tmp_voice_mp3), "-ar", "44100", "-ac", "1", str(tmp_voice_wav)],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    sr, voice = load_wav(tmp_voice_wav)
    sr_bgm, bgm = load_wav(bgm_path)

    n_samples = len(voice)
    master = np.zeros((n_samples, 2), dtype=np.float32)

    # Dynamic Broadcast Audio Ducking
    window_size = int(sr * 0.08)
    abs_voice = np.abs(voice[:, 0])
    kernel = np.ones(window_size) / window_size
    envelope = np.convolve(abs_voice, kernel, mode='same')
    duck_gain = np.where(envelope > 0.03, 0.11, 0.24)
    duck_gain = np.column_stack([duck_gain, duck_gain])

    if len(bgm) < n_samples:
        repeats = int(math.ceil(n_samples / len(bgm)))
        bgm = np.tile(bgm, (repeats, 1))
    bgm_trimmed = bgm[:n_samples]

    master += voice * 1.38
    master += bgm_trimmed * duck_gain

    # Layer Foley & SFX cues
    for cue_name, t_sec, vol in foley_cues:
        p = SCRATCH / cue_name
        if not p.exists():
            continue
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
# WORKBENCH INSTRUMENT SIMULATORS
# =============================================================================
def draw_hud_base(draw, w=1080, h=1920):
    """Clean dark engineering workbench background with subtle blueprint grid"""
    # Grid lines
    for gx in range(0, w, 80):
        draw.line([(gx, 0), (gx, h)], fill=(16, 22, 38), width=1)
    for gy in range(0, h, 80):
        draw.line([(0, gy), (w, gy)], fill=(16, 22, 38), width=1)

    # Frame border
    draw.rectangle([(25, 25), (w - 25, h - 25)], outline=(35, 48, 75), width=2)
    # Corner registration brackets
    corners = [(45, 45), (w - 45, 45), (45, h - 45), (w - 45, h - 45)]
    for cx, cy in corners:
        dx = 20 if cx < w // 2 else -20
        dy = 20 if cy < h // 2 else -20
        draw.line([(cx, cy), (cx + dx, cy)], fill=(0, 210, 255), width=2)
        draw.line([(cx, cy), (cx, cy + dy)], fill=(0, 210, 255), width=2)


def draw_fluke_processmeter(draw, t, total_dur):
    """Fluke 789 ProcessMeter simulation (12.00mA LCD & 250 ohm loop)"""
    bx, by, bw, bh = 140, 530, 800, 520
    # Yellow Fluke holster body
    draw.rounded_rectangle([(bx, by), (bx + bw, by + bh)], radius=24, fill=(245, 175, 10), outline=(20, 20, 20), width=6)
    # Inner dark bezel
    draw.rounded_rectangle([(bx + 25, by + 25), (bx + bw - 25, by + bh - 25)], radius=16, fill=(28, 30, 36))

    # LCD Screen Window
    lcd_x, lcd_y, lcd_w, lcd_h = bx + 50, by + 45, bw - 100, 210
    draw.rounded_rectangle([(lcd_x, lcd_y), (lcd_x + lcd_w, lcd_y + lcd_h)], radius=10, fill=(185, 205, 180), outline=(50, 60, 50), width=4)

    f_lcd = ImageFont.truetype(FONT_TITLE, 76)
    f_lcd_sm = ImageFont.truetype(FONT_BOLD, 26)

    # Calculate live reading
    jitter = math.sin(t * 12) * 0.003
    ma_val = 12.000 + jitter if t < total_dur * 0.7 else 12.000 + jitter
    pct_val = (ma_val - 4.0) / 16.0 * 100.0

    draw.text((lcd_x + 30, lcd_y + 15), "LOOP POWER  24V DC", fill=(30, 45, 30), font=f_lcd_sm)
    draw.text((lcd_x + 30, lcd_y + 60), f"{ma_val:.3f}", fill=(15, 25, 15), font=f_lcd)
    draw.text((lcd_x + 460, lcd_y + 95), "mA DC", fill=(25, 38, 25), font=f_lcd_sm)
    draw.text((lcd_x + 30, lcd_y + 155), f"PERCENT: {pct_val:.1f} %  [ 250Ω = {ma_val*0.25:.3f} V ]", fill=(30, 50, 30), font=f_lcd_sm)

    # Rotary dial below LCD
    dial_cx, dial_cy = bx + bw // 2, by + 375
    draw.ellipse([(dial_cx - 90, dial_cy - 90), (dial_cx + 90, dial_cy + 90)], fill=(45, 48, 55), outline=(15, 15, 18), width=5)
    # Dial pointer
    draw.line([(dial_cx, dial_cy), (dial_cx, dial_cy - 75)], fill=(240, 240, 240), width=8)
    draw.text((dial_cx - 55, dial_cy + 95), "mA OUTPUT / SIM", fill=(240, 180, 20), font=f_lcd_sm)


def draw_oscilloscope_trace(draw, t, total_dur):
    """Tektronix DSO screen with 1,480V reflected wave ringing"""
    bx, by, bw, bh = 90, 530, 900, 540
    # Dark DSO bezel
    draw.rounded_rectangle([(bx, by), (bx + bw, by + bh)], radius=18, fill=(18, 22, 30), outline=(0, 180, 255), width=3)

    # Phosphor grid area
    gx, gy, gw, gh = bx + 30, by + 30, bw - 60, bh - 60
    draw.rectangle([(gx, gy), (gx + gw, gy + gh)], fill=(6, 12, 18))

    # Grid divisions (10x8)
    for i in range(1, 10):
        x = gx + int(i * gw / 10)
        draw.line([(x, gy), (x, gy + gh)], fill=(20, 45, 55), width=1)
    for j in range(1, 8):
        y = gy + int(j * gh / 8)
        draw.line([(gx, y), (gx + gw, y)], fill=(20, 45, 55), width=1)

    # Dynamic waveform rendering (Reflected wave ringing)
    points = []
    center_y = gy + int(gh * 0.65)
    step_x = 4
    for px in range(0, gw, step_x):
        prog = px / gw
        # Pulse step with high dv/dt and damped ringing
        if prog < 0.25:
            sig = 0.0
        else:
            t_ring = (prog - 0.25) * 18.0
            ringing = math.exp(-t_ring * 0.4) * math.cos(t_ring * 16.0 - t * 8.0) * 1.8
            sig = 1.0 + ringing
        py = center_y - int(sig * 110)
        points.append((gx + px, py))

    if len(points) > 1:
        draw.line(points, fill=(0, 255, 220), width=4)

    f_dso = ImageFont.truetype(FONT_MONO, 28)
    draw.text((gx + 20, gy + 15), "CH1: 200V / div   500ns / div", fill=(0, 255, 200), font=f_dso)
    peak_v = int(1480 + math.sin(t * 15) * 22)
    draw.text((gx + 460, gy + 15), f"Vpeak: {peak_v} V [CRITICAL]", fill=(255, 50, 50), font=f_dso)
    draw.text((gx + 20, gy + gh - 40), "TRIG: 650V  dv/dt: 12,400 V/μs", fill=(200, 220, 255), font=f_dso)


def draw_fea_stress_contour(draw, t, total_dur):
    """FEA Von Mises stress contour heatmap at shaft corner step"""
    bx, by, bw, bh = 110, 530, 860, 530
    draw.rounded_rectangle([(bx, by), (bx + bw, by + bh)], radius=18, fill=(15, 18, 25), outline=(240, 50, 70), width=3)

    # Shaft profile outline
    # Large diameter (D=60mm) -> Step -> Small diameter (d=40mm)
    cx, cy = bx + bw // 2, by + bh // 2 + 20
    # Left shaft (large)
    draw.rectangle([(bx + 80, cy - 140), (cx - 20, cy + 140)], fill=(35, 45, 60), outline=(70, 90, 120), width=3)
    # Right shaft (small)
    draw.rectangle([(cx - 20, cy - 80), (bx + bw - 80, cy + 80)], fill=(35, 45, 60), outline=(70, 90, 120), width=3)

    # Stress notch hotspot at the fillet step
    pulse = math.sin(t * 10) * 0.15 + 0.85
    r_max = int(55 * pulse)
    for r in range(r_max, 5, -6):
        alpha = int((1.0 - r / r_max) * 255)
        # Gradient from crimson to bright yellow
        col = (255, int(220 * (1 - r / r_max)), 0)
        draw.ellipse([(cx - 20 - r, cy - 80 - r), (cx - 20 + r, cy - 80 + r)], fill=col)
        draw.ellipse([(cx - 20 - r, cy + 80 - r), (cx - 20 + r, cy + 80 + r)], fill=col)

    f_fea = ImageFont.truetype(FONT_BOLD, 30)
    draw.text((bx + 50, by + 30), "FEA STRESS CONCENTRATION (Von Mises)", fill=(255, 80, 80), font=f_fea)
    draw.text((bx + 50, by + 75), "r = 0.5mm: Kt = 3.20  |  σ_max = 482 MPa (FATIGUE FAIL)", fill=(255, 210, 0), font=f_fea)
    draw.text((bx + 50, by + bh - 55), "TARGET: r = 3.0mm  ->  Kt = 1.30 (PASS)", fill=(0, 240, 120), font=f_fea)


def draw_cavitation_vacuum_gauge(draw, t, total_dur):
    """Vacuum suction gauge and cavitation ultrasound FFT spectrum"""
    bx, by, bw, bh = 110, 530, 860, 530
    draw.rounded_rectangle([(bx, by), (bx + bw, by + bh)], radius=18, fill=(15, 20, 28), outline=(0, 190, 255), width=3)

    # Circular vacuum gauge on left
    gcx, gcy, gr = bx + 230, by + bh // 2 + 10, 160
    draw.ellipse([(gcx - gr, gcy - gr), (gcx + gr, gcy + gr)], fill=(235, 240, 245), outline=(30, 35, 45), width=8)

    # Red zone (cavitation vacuum < -0.6 bar)
    draw.pieslice([(gcx - gr + 10, gcy - gr + 10), (gcx + gr - 10, gcy + gr - 10)], 180, 270, fill=(255, 180, 180))

    # Needle angle (-0.8 bar with vibration)
    vib = math.sin(t * 30) * 4.0
    angle_deg = 235 + vib
    rad = math.radians(angle_deg)
    nx = gcx + math.cos(rad) * (gr - 30)
    ny = gcy + math.sin(rad) * (gr - 30)
    draw.line([(gcx, gcy), (nx, ny)], fill=(220, 20, 20), width=5)
    draw.ellipse([(gcx - 14, gcy - 14), (gcx + 14, gcy + 14)], fill=(40, 40, 40))

    f_sm = ImageFont.truetype(FONT_BOLD, 26)
    draw.text((gcx - 65, gcy + 55), "-0.82 BAR", fill=(200, 20, 20), font=f_sm)
    draw.text((gcx - 85, gcy + 90), "VAPOR BOILING", fill=(100, 20, 20), font=f_sm)

    # FFT Spectrum on right
    sx, sy, sw, sh = bx + 450, by + 80, 360, 380
    draw.rectangle([(sx, sy), (sx + sw, sy + sh)], fill=(8, 14, 22), outline=(40, 60, 80), width=2)
    draw.text((sx + 20, sy + 15), "ULTRASOUND SPECTRUM", fill=(0, 230, 255), font=f_sm)

    # Cavitation noise floor surge (20kHz - 80kHz)
    bars = 16
    for b in range(bars):
        bx_bar = sx + 25 + b * 20
        h_noise = int(35 + math.sin(t * 12 + b * 0.7) * 20 + (b ** 1.3) * 3)
        draw.rectangle([(bx_bar, sy + sh - 25 - h_noise), (bx_bar + 14, sy + sh - 25)], fill=(255, 90, 30))


def draw_flir_thermal_display(draw, t, total_dur):
    """FLIR thermal camera display with Ironbow palette and spot temp"""
    bx, by, bw, bh = 110, 530, 860, 530
    draw.rounded_rectangle([(bx, by), (bx + bw, by + bh)], radius=18, fill=(10, 14, 22), outline=(100, 180, 255), width=3)

    # Thermal viewport
    tx, ty, tw, th = bx + 40, by + 40, 680, 450
    # Simulate Ironbow heat distribution
    draw.rectangle([(tx, ty), (tx + tw, ty + th)], fill=(40, 10, 60))

    # Hot zone (power supply heat)
    draw.ellipse([(tx + 80, ty + 60), (tx + 300, ty + 280)], fill=(220, 60, 20))
    draw.ellipse([(tx + 120, ty + 100), (tx + 260, ty + 240)], fill=(255, 210, 40))

    # Dangerous cold condensation zone (evaporator coil drop at 18C)
    draw.rounded_rectangle([(tx + 380, ty + 120), (tx + 620, ty + 380)], radius=12, fill=(15, 30, 110))
    draw.rounded_rectangle([(tx + 430, ty + 170), (tx + 570, ty + 330)], radius=8, fill=(0, 160, 230))

    # Crosshair Spot 1 (Cold condensation spot)
    cx, cy = tx + 500, ty + 250
    draw.line([(cx - 20, cy), (cx + 20, cy)], fill=(255, 255, 255), width=2)
    draw.line([(cx, cy - 20), (cx, cy + 20)], fill=(255, 255, 255), width=2)

    f_flir = ImageFont.truetype(FONT_BOLD, 28)
    draw.text((cx + 25, cy - 15), "Sp1: 18.6°C [CONDENSING!]", fill=(0, 240, 255), font=f_flir)
    draw.text((tx + 25, ty + 15), "FLIR E76  ε = 0.95", fill=(220, 220, 220), font=f_flir)
    draw.text((tx + 25, ty + th - 45), "DEW POINT: 28.2°C  ->  RAIN FORMING!", fill=(255, 60, 60), font=f_flir)

    # Vertical Ironbow scale bar on right
    pal_x = bx + 750
    for py in range(th):
        ratio = py / th
        r = int(255 * (1 - ratio))
        g = int(180 * math.sin(ratio * math.pi))
        b = int(240 * ratio)
        draw.line([(pal_x, ty + py), (pal_x + 35, ty + py)], fill=(r, g, b), width=1)


def draw_bode_plot(draw, t, total_dur):
    """Servo frequency response Bode plot showing 10:1 inertia resonance peak"""
    bx, by, bw, bh = 110, 530, 860, 530
    draw.rounded_rectangle([(bx, by), (bx + bw, by + bh)], radius=18, fill=(14, 18, 26), outline=(0, 255, 180), width=3)

    # Bode Grid
    bx_g, by_g, bw_g, bh_g = bx + 50, by + 50, bw - 100, bh - 100
    draw.rectangle([(bx_g, by_g), (bx_g + bw_g, by_g + bh_g)], fill=(8, 12, 18), outline=(30, 45, 60), width=2)

    # Magnitude resonance curve
    points = []
    mid_y = by_g + bh_g // 2
    for px in range(bw_g):
        prog = px / bw_g
        # Anti-resonance notch + massive resonance peak at prog=0.55
        freq = prog * 100.0
        peak = 90.0 * math.exp(-((prog - 0.55) ** 2) / 0.003)
        notch = -45.0 * math.exp(-((prog - 0.45) ** 2) / 0.002)
        py = mid_y - int(peak + notch + math.sin(t * 8) * 4)
        points.append((bx_g + px, py))

    if len(points) > 1:
        draw.line(points, fill=(0, 255, 170), width=4)

    f_bode = ImageFont.truetype(FONT_BOLD, 28)
    draw.text((bx_g + 20, by_g + 15), "BODE PLOT: OPEN LOOP VELOCITY GAIN", fill=(0, 255, 180), font=f_bode)
    draw.text((bx_g + 320, by_g + 75), "RESONANCE PEAK: +18dB (JL/JM = 18:1)", fill=(255, 70, 70), font=f_bode)
    draw.text((bx_g + 20, by_g + bh_g - 45), "5:1 GEARBOX REDUCTION -> JL/JM = 0.72:1 (STABLE)", fill=(0, 240, 255), font=f_bode)


# =============================================================================
# MAIN FORENSIC VIDEO COMPILER
# =============================================================================
def render_forensic_video(ep):
    print("\n" + "=" * 80)
    print(f"🎬 [FORENSIC WORKBENCH] Rendering: {ep['title'].replace(chr(10), ' ')}")
    print(f"   Episode ID: {ep['ep_id']} | Instrument: {ep['instrument']}")
    print("=" * 80)

    # 1. Edge-TTS Audio Generation
    voice_files = asyncio.run(generate_voice_files(ep))

    # 2. Master Audio Mixing with Foley & Ducking
    bgm_path = SCRATCH / ep["bgm"]
    out_wav = SCRATCH / f"edu_{ep['ep_id']}_master.wav"
    _, total_dur, audio_signal = mix_forensic_audio(voice_files, bgm_path, ep["foley_cues"], out_wav)
    print(f"   Master Audio Duration: {total_dur:.2f} seconds")

    # 3. Stream Frames into FFmpeg
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

    f_title = ImageFont.truetype(FONT_TITLE, 52)
    f_badge = ImageFont.truetype(FONT_BOLD, 30)
    f_sub = ImageFont.truetype(FONT_BOLD, 36)
    f_cta = ImageFont.truetype(FONT_TITLE, 42)

    # Sentence timing breakdown
    num_sentences = len(ep["scripts"])
    seg_dur = total_dur / num_sentences

    for frame_idx in range(total_frames):
        t = frame_idx / fps
        img = Image.new("RGB", (w, h), (10, 14, 22))
        draw = ImageDraw.Draw(img)

        # 1. Base Blueprint HUD Grid
        draw_hud_base(draw, w, h)

        # 2. Top Forensic Badge & Title
        draw.text((w // 2, 130), ep["badge"], fill=ep["badge_color"], font=f_badge, anchor="mm")
        draw.text((w // 2, 235), ep["title"], fill=(255, 255, 255), font=f_title, anchor="mm", align="center")

        # 3. Dynamic Instrument Simulator
        inst = ep["instrument"]
        if inst == "fluke_meter":
            draw_fluke_processmeter(draw, t, total_dur)
        elif inst == "oscilloscope":
            draw_oscilloscope_trace(draw, t, total_dur)
        elif inst == "fea_contour":
            draw_fea_stress_contour(draw, t, total_dur)
        elif inst == "cavitation_gauge":
            draw_cavitation_vacuum_gauge(draw, t, total_dur)
        elif inst == "flir_thermal":
            draw_flir_thermal_display(draw, t, total_dur)
        elif inst == "bode_plot":
            draw_bode_plot(draw, t, total_dur)

        # 4. Animated Subtitle Box (Field Engineer Cadence)
        cur_seg = min(int(t / seg_dur), num_sentences - 1)
        sub_text = ep["scripts"][cur_seg]

        sub_box_y = 1130
        draw.rounded_rectangle([(80, sub_box_y), (w - 80, sub_box_y + 320)], radius=16, fill=(16, 22, 34), outline=(45, 60, 85), width=2)
        # Category tag
        draw.text((115, sub_box_y + 35), f"FIELD INVESTIGATION LOG: STEP {cur_seg + 1} OF 4", fill=ep["accent_color"], font=f_badge)

        # Wrap text nicely
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
            draw.text((115, sub_box_y + 85 + l_idx * 48), line, fill=(240, 245, 255), font=f_sub)

        # 5. Bottom Call To Action Banner
        cta_y = 1530
        draw.rounded_rectangle([(80, cta_y), (w - 80, cta_y + 190)], radius=18, fill=(18, 25, 40), outline=(0, 200, 255), width=3)
        draw.text((w // 2, cta_y + 55), "78+ FREE INDUSTRIAL CALCULATORS", fill=(0, 220, 255), font=f_badge, anchor="mm")
        draw.text((w // 2, cta_y + 125), "👉 voltcheck24.com", fill=(255, 255, 255), font=f_cta, anchor="mm")

        pipe.stdin.write(img.tobytes())

        if frame_idx % 300 == 0:
            print(f"\r   Rendering Progress: {int(frame_idx / total_frames * 100)}%", end="")

    pipe.stdin.close()
    pipe.wait()
    print(f"\n✅ Completed: {out_mp4.name} ({out_mp4.stat().st_size / (1024*1024):.1f} MB)")
    return out_mp4


def main():
    print("=" * 85)
    print("🚀 [VOLTCHECK] Starting 6-Sector Zero-AI-Feel Educational Shorts Production")
    print("=" * 85)
    for ep in FORENSIC_EPISODES:
        render_forensic_video(ep)
    print("\n" + "=" * 85)
    print("🎉 All 6 Forensic Engineering Shorts Successfully Rendered in Full HD!")
    print("=" * 85)


if __name__ == "__main__":
    main()
