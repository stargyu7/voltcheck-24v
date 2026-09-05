# -*- coding: utf-8 -*-
"""
=============================================================================
🌍 [DAY 1 GLOBAL] Bolt Torque Dual Shorts Rendering Pipeline (English Edition)
=============================================================================
1. Global Marketing Short: Overtightening Bolts Snapped a $250k Mold! (40.2s)
2. Global Engineering Short: Bolt Torque Formula T = k·d·F Masterclass (42.9s)
- 100% English Audio, Subtitles, SFX, and Motion Graphics
- Prepared for tomorrow's scheduled global reservation (22:00 & 22:05 KST)
=============================================================================
"""

import os
import sys
import math
import wave
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


def mix_audio_with_sfx(voice_files, sfx_cues, bgm_path, out_path, total_dur):
    # Combine voice files
    concat_txt = SCRATCH / "tmp_concat.txt"
    with open(concat_txt, "w", encoding="utf-8") as f:
        for vf in voice_files:
            f.write(f"file '{vf}'\n")

    tmp_voice_mp3 = SCRATCH / "tmp_voice.mp3"
    subprocess.run([FFMPEG, "-y", "-f", "concat", "-safe", "0", "-i", str(concat_txt), "-c", "copy", str(tmp_voice_mp3)],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    tmp_voice_wav = SCRATCH / "tmp_voice.wav"
    subprocess.run([FFMPEG, "-y", "-i", str(tmp_voice_mp3), "-ar", "44100", "-ac", "1", str(tmp_voice_wav)],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    sr, voice = load_wav(tmp_voice_wav)
    sr_bgm, bgm = load_wav(bgm_path)

    n_samples = len(voice)
    master = np.zeros((n_samples, 2), dtype=np.float32)

    master += voice * 1.35

    bgm_trimmed = bgm[:n_samples] if len(bgm) >= n_samples else np.pad(bgm, ((0, n_samples - len(bgm)), (0, 0)))
    master += bgm_trimmed * 0.18

    for sfx_name, start_t, vol in sfx_cues:
        _, sfx_data = load_wav(SCRATCH / sfx_name)
        start_idx = int(start_t * sr)
        end_idx = min(start_idx + len(sfx_data), n_samples)
        actual_len = end_idx - start_idx
        if actual_len > 0:
            master[start_idx:end_idx] += sfx_data[:actual_len] * vol

    master = np.tanh(master * 0.92)

    with wave.open(str(out_path), "w") as f:
        f.setnchannels(2)
        f.setsampwidth(2)
        f.setframerate(sr)
        f.writeframes((master * 32767).astype(np.int16).tobytes())

    return out_path, len(master) / sr


# =============================================================================
# 1. RENDER GLOBAL MARKETING SHORT: Bolt Overtorque Disaster (40.25s)
# =============================================================================
def render_mkt_video():
    out_mp4 = BASE_DIR / "shorts_global_mkt_bolt_torque.mp4"
    voice_files = [SCRATCH / f"global_bolt_mkt_tts_{i}.mp3" for i in range(4)]
    sfx_cues = [
        ("sfx_whoosh.wav", 0.00, 0.65),
        ("sfx_alert.wav", 0.15, 0.50),
        ("sfx_impact.wav", 5.50, 0.70),
        ("sfx_whoosh.wav", 8.83, 0.65),
        ("sfx_spark.wav", 15.00, 0.70),
        ("sfx_impact.wav", 15.20, 0.65),
        ("sfx_whoosh.wav", 20.40, 0.65),
        ("sfx_pop.wav", 24.50, 0.70),
        ("sfx_whoosh.wav", 28.49, 0.65),
        ("sfx_pop.wav", 34.00, 0.65)
    ]
    master_audio, dur = mix_audio_with_sfx(voice_files, sfx_cues, SCRATCH / "bolt_mkt_bgm.wav", SCRATCH / "mkt_audio.wav", 40.25)

    fps = 30
    total_frames = int(dur * fps)
    print(f"🎬 Rendering Global MKT Short: {total_frames} frames ({dur:.2f}s)")

    f_badge = ImageFont.truetype(FONT_BOLD, 32)
    f_title = ImageFont.truetype(FONT_TITLE, 54)
    f_sub1 = ImageFont.truetype(FONT_BOLD, 44)
    f_sub2 = ImageFont.truetype(FONT_BOLD, 48)
    f_card_h = ImageFont.truetype(FONT_BOLD, 38)
    f_small = ImageFont.truetype(FONT_BOLD, 30)

    cmd = [
        FFMPEG, "-y", "-f", "rawvideo", "-vcodec", "rawvideo", "-s", "1080x1920",
        "-pix_fmt", "rgb24", "-r", str(fps), "-i", "-", "-i", str(master_audio),
        "-c:v", "libx264", "-preset", "fast", "-crf", "20", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k", "-shortest", str(out_mp4)
    ]
    pipe = subprocess.Popen(cmd, stdin=subprocess.PIPE)

    # Durations: [8.83, 11.57, 8.09, 11.76]
    t_cues = [8.83, 20.40, 28.49, 40.25]

    for i in range(total_frames):
        t = i / fps
        im = Image.new("RGB", (1080, 1920), (14, 18, 30))
        draw = ImageDraw.Draw(im)

        # Background grid pattern
        for gx in range(0, 1080, 120):
            draw.line([(gx, 0), (gx, 1920)], fill=(22, 28, 45), width=1)
        for gy in range(0, 1920, 120):
            draw.line([(0, gy), (1080, gy)], fill=(22, 28, 45), width=1)

        # Scene 1: Hook (0 ~ 8.83s)
        if t < t_cues[0]:
            draw.rounded_rectangle([(230, 110), (850, 175)], radius=30, fill=(230, 75, 0), outline=(255, 170, 0), width=2)
            draw.text((540, 142), "[ ⚠️ REAL SHOP FLOOR INCIDENT ]", font=f_badge, fill=(255, 255, 255), anchor="mm")
            draw.text((540, 270), "Impact Wrench on M16 Bolts:\nA $250,000 Fatal Mistake!", font=f_title, fill=(255, 255, 255), anchor="mm", align="center")

            # Graphic: Big Bolt Warning Card
            draw.rounded_rectangle([(140, 380), (940, 880)], radius=28, fill=(20, 30, 50), outline=(255, 120, 0), width=2)
            draw.text((540, 480), "BOLT SPECIFICATION", font=f_small, fill=(255, 160, 0), anchor="mm")
            draw.text((540, 560), "M16 - Grade 10.9", font=f_title, fill=(255, 255, 255), anchor="mm")
            draw.text((540, 640), "Target Torque: 284 N·m", font=f_card_h, fill=(0, 230, 255), anchor="mm")
            draw.rounded_rectangle([(200, 720), (880, 810)], radius=18, fill=(180, 20, 20))
            draw.text((540, 765), "❌ Impact Wrench Over-Torqued!", font=f_card_h, fill=(255, 255, 255), anchor="mm")

            draw.rounded_rectangle([(70, 1500), (1010, 1710)], radius=24, fill=(0, 0, 0), outline=(255, 140, 0), width=2)
            if t < 4.5:
                draw.text((540, 1565), "At a precision manufacturing plant...", font=f_sub1, fill=(255, 255, 255), anchor="mm")
                draw.text((540, 1640), "Operator tightened M16 10.9 bolts with an impact!", font=f_sub2, fill=(255, 220, 0), anchor="mm")
            else:
                draw.text((540, 1565), "BIG MISTAKE!", font=f_sub2, fill=(255, 75, 75), anchor="mm")
                draw.text((540, 1640), "Never guess high-tensile torque by feel!", font=f_sub1, fill=(255, 255, 255), anchor="mm")

        # Scene 2: Disaster / Fracture (8.83 ~ 20.40s)
        elif t < t_cues[1]:
            seg_t = t - t_cues[0]
            draw.rounded_rectangle([(250, 110), (830, 175)], radius=30, fill=(210, 25, 25), outline=(255, 80, 80), width=2)
            draw.text((540, 142), "[ 💥 CATASTROPHIC FRACTURE ]", font=f_badge, fill=(255, 255, 255), anchor="mm")
            draw.text((540, 270), "Yield Stress Exceeded\nBolt Head Sheared Off!", font=f_title, fill=(255, 255, 255), anchor="mm", align="center")

            # Stress-Strain Curve Graphic
            draw.rounded_rectangle([(120, 370), (960, 930)], radius=24, fill=(18, 25, 45), outline=(255, 60, 60), width=2)
            draw.text((540, 430), "CLAMP LOAD vs TORQUE CURVE", font=f_small, fill=(200, 210, 230), anchor="mm")
            # Graph axes
            draw.line([(220, 820), (860, 820)], fill=(120, 140, 170), width=2)
            draw.line([(220, 820), (220, 500)], fill=(120, 140, 170), width=2)
            # Curve: Elastic then yield
            pts = [(220 + int(x * 4.5), int(820 - math.sin(x / 140 * math.pi * 0.7) * 280)) for x in range(140)]
            for p_idx in range(len(pts) - 1):
                col = (0, 230, 255) if p_idx < 90 else (255, 50, 50)
                draw.line([pts[p_idx], pts[p_idx + 1]], fill=col, width=4)
            # Fracture point
            fx, fy = pts[-1]
            draw.ellipse([(fx - 15, fy - 15), (fx + 15, fy + 15)], fill=(255, 20, 20), outline=(255, 255, 255), width=2)
            draw.text((fx - 100, fy - 35), "SNAP! (Fracture)", font=f_small, fill=(255, 70, 70), anchor="mm")

            draw.rounded_rectangle([(70, 1490), (1010, 1715)], radius=24, fill=(0, 0, 0), outline=(230, 40, 40), width=2)
            if seg_t < 6.0:
                draw.text((540, 1560), "Over-torquing stressed bolt past yield point...", font=f_sub1, fill=(255, 255, 255), anchor="mm")
                draw.text((540, 1640), "Bolt head violently sheared off under load!", font=f_sub2, fill=(255, 220, 0), anchor="mm")
            else:
                draw.text((540, 1560), "The die slammed shut completely unaligned,", font=f_sub1, fill=(255, 255, 255), anchor="mm")
                draw.text((540, 1640), "DESTROYING A $250,000 INJECTION MOLD!", font=f_sub2, fill=(255, 60, 60), anchor="mm")

        # Scene 3: The Golden Rule (20.40 ~ 28.49s)
        elif t < t_cues[2]:
            seg_t = t - t_cues[1]
            draw.rounded_rectangle([(270, 110), (810, 175)], radius=30, fill=(0, 130, 230), outline=(0, 220, 255), width=2)
            draw.text((540, 142), "[ ⚙️ MECHANICAL ENG RULE ]", font=f_badge, fill=(255, 255, 255), anchor="mm")
            draw.text((540, 270), "Never Guess Torque by Hand!\nUse Calibrated Torque Wrenches", font=f_title, fill=(255, 255, 255), anchor="mm", align="center")

            draw.rounded_rectangle([(140, 390), (940, 870)], radius=24, fill=(18, 28, 50), outline=(0, 200, 255), width=2)
            draw.text((540, 470), "CRITICAL TORQUE TOLERANCE", font=f_small, fill=(0, 220, 255), anchor="mm")
            draw.text((540, 560), "Grade 8.8 / 10.9 / 12.9", font=f_title, fill=(255, 255, 255), anchor="mm")
            draw.text((540, 660), "Even a 15% Error = Fatigue Failure!", font=f_card_h, fill=(255, 220, 0), anchor="mm")
            draw.text((540, 750), "Always calculate preload: F_p = 0.9 × R_p0.2 × A_s", font=f_small, fill=(180, 200, 230), anchor="mm")

            draw.rounded_rectangle([(70, 1500), (1010, 1715)], radius=24, fill=(0, 0, 0), outline=(0, 210, 255), width=2)
            draw.text((540, 1565), "With high-tensile fasteners,", font=f_sub1, fill=(255, 255, 255), anchor="mm")
            draw.text((540, 1640), "A small torque error causes sudden fracture!", font=f_sub2, fill=(255, 220, 0), anchor="mm")

        # Scene 4: VoltCheck Solution & CTA (28.49 ~ 40.25s)
        else:
            seg_t = t - t_cues[2]
            draw.rounded_rectangle([(270, 110), (810, 175)], radius=30, fill=(0, 165, 115), outline=(0, 255, 170), width=2)
            draw.text((540, 142), "[ 🚀 3-SECOND TORQUE TOOL ]", font=f_badge, fill=(255, 255, 255), anchor="mm")

            draw.rounded_rectangle([(100, 310), (980, 890)], radius=32, fill=(12, 22, 42), outline=(0, 220, 255), width=3)
            draw.text((540, 395), "VOLTCHECK ⚡", font=f_title, fill=(0, 230, 255), anchor="mm")
            draw.text((540, 480), "Precision Fastener Torque Calculator", font=f_card_h, fill=(255, 255, 255), anchor="mm")

            features = [
                ("⚙️ M4 to M36 Bolt Torque & Clamp Sizing", (255, 225, 0)),
                ("🧪 Dry (k=0.20) vs Lubricated (k=0.15) Modes", (0, 230, 255)),
                ("📱 100% Free · No Sign-Up · Mobile Ready", (100, 255, 130))
            ]
            for f_idx, (text, f_color) in enumerate(features):
                box_y = 560 + f_idx * 95
                draw.rounded_rectangle([(140, box_y), (940, box_y + 75)], radius=16, fill=(22, 38, 68), outline=(0, 160, 220), width=1)
                draw.text((540, box_y + 37), text, font=f_small, fill=f_color, anchor="mm")

            draw.rounded_rectangle([(70, 1500), (1010, 1715)], radius=24, fill=(0, 0, 0), outline=(0, 230, 255), width=2)
            if seg_t < 6.0:
                draw.text((540, 1565), "Smart engineers calculate torque in 3 seconds!", font=f_sub1, fill=(255, 255, 255), anchor="mm")
                draw.text((540, 1640), "Select bolt size, grade, and friction factor!", font=f_sub2, fill=(255, 220, 0), anchor="mm")
            else:
                draw.text((540, 1565), "Protect your molds and equipment!", font=f_sub1, fill=(255, 255, 255), anchor="mm")
                draw.text((540, 1640), "Visit voltcheck24.com today!", font=f_sub2, fill=(0, 230, 255), anchor="mm")

        # Progress bar
        prog = min(1.0, max(0.0, t / dur))
        draw.line([(0, 1912), (int(1080 * prog), 1912)], fill=(0, 240, 255), width=8)

        pipe.stdin.write(im.tobytes())

    pipe.stdin.close()
    pipe.wait()
    print("✅ Global MKT Video Done:", out_mp4)
    return out_mp4


# =============================================================================
# 2. RENDER GLOBAL ENGINEERING SHORT: Torque Formula Masterclass (42.91s)
# =============================================================================
def render_eng_video():
    out_mp4 = BASE_DIR / "shorts_global_eng_bolt_formula.mp4"
    voice_files = [SCRATCH / f"global_bolt_eng_tts_{i}.mp3" for i in range(4)]
    sfx_cues = [
        ("sfx_whoosh.wav", 0.00, 0.65),
        ("sfx_alert.wav", 0.15, 0.50),
        ("sfx_whoosh.wav", 7.63, 0.65),
        ("sfx_pop.wav", 11.50, 0.70),
        ("sfx_pop.wav", 14.50, 0.70),
        ("sfx_whoosh.wav", 17.78, 0.65),
        ("sfx_spark.wav", 24.50, 0.70),
        ("sfx_impact.wav", 25.00, 0.65),
        ("sfx_whoosh.wav", 31.92, 0.65),
        ("sfx_pop.wav", 37.00, 0.65)
    ]
    master_audio, dur = mix_audio_with_sfx(voice_files, sfx_cues, SCRATCH / "bolt_eng_bgm.wav", SCRATCH / "eng_audio.wav", 42.91)

    fps = 30
    total_frames = int(dur * fps)
    print(f"🎬 Rendering Global ENG Short: {total_frames} frames ({dur:.2f}s)")

    f_badge = ImageFont.truetype(FONT_BOLD, 32)
    f_title = ImageFont.truetype(FONT_TITLE, 54)
    f_formula = ImageFont.truetype(FONT_TITLE, 76)
    f_sub1 = ImageFont.truetype(FONT_BOLD, 44)
    f_sub2 = ImageFont.truetype(FONT_BOLD, 48)
    f_card_h = ImageFont.truetype(FONT_BOLD, 38)
    f_small = ImageFont.truetype(FONT_BOLD, 30)

    cmd = [
        FFMPEG, "-y", "-f", "rawvideo", "-vcodec", "rawvideo", "-s", "1080x1920",
        "-pix_fmt", "rgb24", "-r", str(fps), "-i", "-", "-i", str(master_audio),
        "-c:v", "libx264", "-preset", "fast", "-crf", "20", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k", "-shortest", str(out_mp4)
    ]
    pipe = subprocess.Popen(cmd, stdin=subprocess.PIPE)

    # Durations: [7.63, 10.15, 14.14, 10.99]
    t_cues = [7.63, 17.78, 31.92, 42.91]

    for i in range(total_frames):
        t = i / fps
        im = Image.new("RGB", (1080, 1920), (10, 16, 28))
        draw = ImageDraw.Draw(im)

        for gx in range(0, 1080, 120):
            draw.line([(gx, 0), (gx, 1920)], fill=(18, 25, 42), width=1)
        for gy in range(0, 1920, 120):
            draw.line([(0, gy), (1080, gy)], fill=(18, 25, 42), width=1)

        # Scene 1: The Master Formula (0 ~ 7.63s)
        if t < t_cues[0]:
            draw.rounded_rectangle([(240, 110), (840, 175)], radius=30, fill=(0, 130, 230), outline=(0, 220, 255), width=2)
            draw.text((540, 142), "[ 📐 CORE MECHANICAL FORMULA ]", font=f_badge, fill=(255, 255, 255), anchor="mm")
            draw.text((540, 270), "Bolt Tightening Torque Equation\nT = k · d · F", font=f_title, fill=(255, 255, 255), anchor="mm", align="center")

            # Giant Glowing Formula Box
            draw.rounded_rectangle([(120, 420), (960, 820)], radius=32, fill=(16, 26, 48), outline=(0, 230, 255), width=3)
            draw.text((540, 520), "UNIVERSAL TORQUE EQUATION", font=f_small, fill=(0, 210, 255), anchor="mm")
            draw.text((540, 640), "T = k · d · F", font=f_formula, fill=(255, 230, 0), anchor="mm")
            draw.text((540, 740), "Torque = Friction Factor × Diameter × Preload", font=f_card_h, fill=(200, 215, 240), anchor="mm")

            draw.rounded_rectangle([(70, 1500), (1010, 1710)], radius=24, fill=(0, 0, 0), outline=(0, 200, 255), width=2)
            draw.text((540, 1565), "The universal bolt tightening torque formula", font=f_sub1, fill=(255, 255, 255), anchor="mm")
            draw.text((540, 1640), "Every mechanical engineer must master: T = k·d·F!", font=f_sub2, fill=(255, 220, 0), anchor="mm")

        # Scene 2: Variable Breakdown (7.63 ~ 17.78s)
        elif t < t_cues[1]:
            seg_t = t - t_cues[0]
            draw.rounded_rectangle([(270, 110), (810, 175)], radius=30, fill=(0, 170, 120), outline=(0, 255, 180), width=2)
            draw.text((540, 142), "[ 🔬 VARIABLE BREAKDOWN ]", font=f_badge, fill=(255, 255, 255), anchor="mm")
            draw.text((540, 270), "T: Torque  |  d: Diameter  |  F: Preload\nk: The Critical Friction Factor!", font=f_title, fill=(255, 255, 255), anchor="mm", align="center")

            vars_list = [
                ("T", "Required Tightening Torque (N·m)", (0, 230, 255)),
                ("k", "Torque Factor: Dry (0.20) vs Lube (0.15)", (255, 220, 0)),
                ("d", "Nominal Bolt Diameter (m)", (200, 220, 255)),
                ("F", "Target Clamping Preload Force (N)", (100, 255, 130))
            ]
            for v_idx, (sym, desc, col) in enumerate(vars_list):
                vy = 400 + v_idx * 115
                draw.rounded_rectangle([(120, vy), (960, vy + 95)], radius=20, fill=(18, 28, 50), outline=col, width=2)
                draw.text((180, vy + 47), sym, font=f_formula, fill=col, anchor="mm")
                draw.text((250, vy + 47), desc, font=f_small, fill=(255, 255, 255), anchor="lm")

            draw.rounded_rectangle([(70, 1490), (1010, 1715)], radius=24, fill=(0, 0, 0), outline=(0, 230, 255), width=2)
            if seg_t < 5.0:
                draw.text((540, 1560), "T is torque, d is diameter, F is preload...", font=f_sub1, fill=(255, 255, 255), anchor="mm")
                draw.text((540, 1640), "All standard engineering units.", font=f_sub2, fill=(255, 255, 255), anchor="mm")
            else:
                draw.text((540, 1560), "BUT THE MOST CRITICAL FACTOR IS k!", font=f_sub2, fill=(255, 220, 0), anchor="mm")
                draw.text((540, 1640), "Friction dictates 90% of torque!", font=f_sub1, fill=(255, 255, 255), anchor="mm")

        # Scene 3: Dry vs Lubricated Danger (17.78 ~ 31.92s)
        elif t < t_cues[2]:
            seg_t = t - t_cues[1]
            draw.rounded_rectangle([(240, 110), (840, 175)], radius=30, fill=(220, 40, 40), outline=(255, 100, 100), width=2)
            draw.text((540, 142), "[ ⚠️ THE LUBRICATION TRAP ]", font=f_badge, fill=(255, 255, 255), anchor="mm")
            draw.text((540, 270), "Dry (k=0.20) vs Lubricated (k=0.15)\n30%+ Preload Error Can Snap Bolts!", font=f_title, fill=(255, 255, 255), anchor="mm", align="center")

            # Comparison cards
            draw.rounded_rectangle([(120, 390), (520, 850)], radius=24, fill=(20, 30, 55), outline=(0, 200, 255), width=2)
            draw.text((320, 450), "DRY THREADS", font=f_card_h, fill=(0, 210, 255), anchor="mm")
            draw.text((320, 540), "k = 0.20", font=f_title, fill=(255, 255, 255), anchor="mm")
            draw.text((320, 630), "Torque: 100%", font=f_small, fill=(200, 220, 240), anchor="mm")
            draw.text((320, 720), "Preload: Normal", font=f_small, fill=(100, 255, 130), anchor="mm")

            draw.rounded_rectangle([(560, 390), (960, 850)], radius=24, fill=(40, 20, 30), outline=(255, 80, 80), width=2)
            draw.text((760, 450), "LUBRICATED", font=f_card_h, fill=(255, 100, 100), anchor="mm")
            draw.text((760, 540), "k = 0.15", font=f_title, fill=(255, 220, 0), anchor="mm")
            draw.text((760, 630), "+33% CLAMP FORCE!", font=f_small, fill=(255, 80, 80), anchor="mm")
            draw.text((760, 720), "⚠️ RISK OF SNAPPING", font=f_small, fill=(255, 60, 60), anchor="mm")

            draw.rounded_rectangle([(70, 1490), (1010, 1715)], radius=24, fill=(0, 0, 0), outline=(255, 80, 80), width=2)
            if seg_t < 7.0:
                draw.text((540, 1560), "For dry threads, k is roughly 0.20.", font=f_sub1, fill=(255, 255, 255), anchor="mm")
                draw.text((540, 1640), "With oil or anti-seize, k drops to 0.15!", font=f_sub2, fill=(255, 220, 0), anchor="mm")
            else:
                draw.text((540, 1560), "Same torque on lubricated threads causes a +33% spike,", font=f_sub1, fill=(255, 255, 255), anchor="mm")
                draw.text((540, 1640), "SNAPPING THE FASTENER INSTANTLY!", font=f_sub2, fill=(255, 60, 60), anchor="mm")

        # Scene 4: VoltCheck Solution & CTA (31.92 ~ 42.91s)
        else:
            seg_t = t - t_cues[2]
            draw.rounded_rectangle([(270, 110), (810, 175)], radius=30, fill=(0, 165, 115), outline=(0, 255, 170), width=2)
            draw.text((540, 142), "[ 🚀 FASTENER CHEAT CODE ]", font=f_badge, fill=(255, 255, 255), anchor="mm")

            draw.rounded_rectangle([(100, 310), (980, 890)], radius=32, fill=(12, 22, 42), outline=(0, 220, 255), width=3)
            draw.text((540, 395), "VOLTCHECK ⚡", font=f_title, fill=(0, 230, 255), anchor="mm")
            draw.text((540, 480), "Precision Bolt Torque Calculator", font=f_card_h, fill=(255, 255, 255), anchor="mm")

            features = [
                ("📐 Exact Bolt Preload & Tightening Torque", (255, 225, 0)),
                ("🔩 Metric & Imperial Fastener Standards", (0, 230, 255)),
                ("📱 100% Free · No Sign-Up · Mobile Ready", (100, 255, 130))
            ]
            for f_idx, (text, f_color) in enumerate(features):
                box_y = 560 + f_idx * 95
                draw.rounded_rectangle([(140, box_y), (940, box_y + 75)], radius=16, fill=(22, 38, 68), outline=(0, 160, 220), width=1)
                draw.text((540, box_y + 37), text, font=f_small, fill=f_color, anchor="mm")

            draw.rounded_rectangle([(70, 1500), (1010, 1715)], radius=24, fill=(0, 0, 0), outline=(0, 230, 255), width=2)
            if seg_t < 5.5:
                draw.text((540, 1565), "Stop digging through thick machinery handbooks!", font=f_sub1, fill=(255, 255, 255), anchor="mm")
                draw.text((540, 1640), "Calculate bolt torque in 3 seconds with VoltCheck!", font=f_sub2, fill=(255, 220, 0), anchor="mm")
            else:
                draw.text((540, 1565), "Work safe on every assembly job!", font=f_sub1, fill=(255, 255, 255), anchor="mm")
                draw.text((540, 1640), "Bookmark voltcheck24.com today!", font=f_sub2, fill=(0, 230, 255), anchor="mm")

        prog = min(1.0, max(0.0, t / dur))
        draw.line([(0, 1912), (int(1080 * prog), 1912)], fill=(0, 240, 255), width=8)

        pipe.stdin.write(im.tobytes())

    pipe.stdin.close()
    pipe.wait()
    print("✅ Global ENG Video Done:", out_mp4)
    return out_mp4


def main():
    print("🚀 [GLOBAL DUAL SHORTS] Starting Render Pipeline...")
    mkt = render_mkt_video()
    eng = render_eng_video()
    print(f"🎉 Both Global Videos Successfully Rendered:\n1. {mkt}\n2. {eng}")


if __name__ == "__main__":
    main()
