# -*- coding: utf-8 -*-
"""
=============================================================================
🌍 [GLOBAL PRO] Industrial Circuit Breaker Safety Short (English Edition)
=============================================================================
- Targeted for Global YouTube Audience (USA, Europe, India, Worldwide)
- American English Natural Voice (en-US-AndrewMultilingualNeural)
- 12 Dynamic Sound Effects (SFX) + Full HD Cinematic Industrial Visuals
- High Retention, Global Algorithm & SEO Optimized
=============================================================================
"""

import os
import sys
import math
import wave
import random
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
SCRATCH_DIR = Path(r"C:\Users\jiwan\.gemini\antigravity\brain\383c856a-190f-4e51-a071-50d194e1c260\scratch")
FFMPEG = r"C:\Users\jiwan\AppData\Local\Python\pythoncore-3.14-64\Lib\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe"
FONT_BOLD = r"C:\Windows\Fonts\segoeuib.ttf"
FONT_TITLE = r"C:\Windows\Fonts\arialbd.ttf"

PHOTO1_PATH = r"C:\Users\jiwan\.gemini\antigravity\brain\383c856a-190f-4e51-a071-50d194e1c260\breaker_panel_photo_1788596780742.jpg"
PHOTO2_PATH = r"C:\Users\jiwan\.gemini\antigravity\brain\383c856a-190f-4e51-a071-50d194e1c260\multimeter_inspection_1788596797684.jpg"

OUTPUT_MP4 = BASE_DIR / "shorts_global_breaker_safety.mp4"

# 4개 세그먼트 시간 (사전 측정값)
SEG_DURATIONS = [7.82, 11.69, 15.82, 10.22]
TOTAL_DURATION = sum(SEG_DURATIONS)  # 45.55초


def prepare_global_audio():
    print("🎵 Mastering Global English Soundtrack (Voice + BGM + 12 SFX)...")

    # 1. Combine 4 English TTS files
    concat_list = SCRATCH_DIR / "global_audio_concat.txt"
    with open(concat_list, "w", encoding="utf-8") as f:
        for i in range(4):
            f.write(f"file '{SCRATCH_DIR / f'global_tts_{i}.mp3'}'\n")

    combined_voice = SCRATCH_DIR / "global_combined_voice.mp3"
    subprocess.run([
        FFMPEG, "-y", "-f", "concat", "-safe", "0",
        "-i", str(concat_list), "-c", "copy", str(combined_voice)
    ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    voice_wav = SCRATCH_DIR / "global_voice.wav"
    subprocess.run([
        FFMPEG, "-y", "-i", str(combined_voice),
        "-ar", "44100", "-ac", "1", str(voice_wav)
    ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

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

    sr, voice = load_wav(voice_wav)
    sr_bgm, bgm = load_wav(SCRATCH_DIR / "breaker_ambient_bgm.wav")

    n_samples = len(voice)
    master = np.zeros((n_samples, 2), dtype=np.float32)

    # Voice
    master += voice * 1.35

    # BGM
    bgm_trimmed = bgm[:n_samples] if len(bgm) >= n_samples else np.pad(bgm, ((0, n_samples - len(bgm)), (0, 0)))
    master += bgm_trimmed * 0.18

    # SFX Event timeline (calibrated for English timings)
    sfx_events = [
        ("sfx_whoosh.wav", 0.00, 0.65),       # Intro whoosh
        ("sfx_alert.wav", 0.15, 0.50),        # Warning double beep
        ("sfx_impact.wav", 4.20, 0.75),       # "Stop! Extremely dangerous!"
        ("sfx_whoosh.wav", 7.82, 0.65),       # Scene 2 transition
        ("sfx_spark.wav", 13.80, 0.70),       # "massive arc flash" spark
        ("sfx_impact.wav", 14.00, 0.65),      # "explosion" sub thud
        ("sfx_whoosh.wav", 19.51, 0.65),      # Scene 3 transition
        ("sfx_pop.wav", 23.50, 0.75),         # Step 1 pop
        ("sfx_pop.wav", 27.50, 0.75),         # Step 2 pop
        ("sfx_pop.wav", 31.50, 0.75),         # Step 3 pop
        ("sfx_whoosh.wav", 35.33, 0.65),      # Scene 4 transition
        ("sfx_pop.wav", 40.50, 0.65),         # CTA pop
    ]

    for sfx_name, start_t, vol in sfx_events:
        _, sfx_data = load_wav(SCRATCH_DIR / sfx_name)
        start_idx = int(start_t * sr)
        end_idx = min(start_idx + len(sfx_data), n_samples)
        actual_len = end_idx - start_idx
        if actual_len > 0:
            master[start_idx:end_idx] += sfx_data[:actual_len] * vol

    master = np.tanh(master * 0.92)

    master_wav = SCRATCH_DIR / "global_master_audio.wav"
    with wave.open(str(master_wav), "w") as f:
        f.setnchannels(2)
        f.setsampwidth(2)
        f.setframerate(sr)
        f.writeframes((master * 32767).astype(np.int16).tobytes())

    print(f"✅ Global Audio Mastered: {master_wav} ({len(master)/sr:.2f}s)")
    return master_wav, len(master) / sr


class GlobalVideoRenderer:
    def __init__(self, total_duration):
        self.w, self.h = 1080, 1920
        self.total_duration = total_duration

        self.p1 = Image.open(PHOTO1_PATH).convert("RGBA")
        self.p2 = Image.open(PHOTO2_PATH).convert("RGBA")

        self.f_badge = ImageFont.truetype(FONT_BOLD, 32)
        self.f_title = ImageFont.truetype(FONT_TITLE, 56)
        self.f_title_sub = ImageFont.truetype(FONT_BOLD, 40)
        self.f_card_h = ImageFont.truetype(FONT_BOLD, 38)
        self.f_sub1 = ImageFont.truetype(FONT_BOLD, 44)
        self.f_sub2 = ImageFont.truetype(FONT_BOLD, 48)
        self.f_small = ImageFont.truetype(FONT_BOLD, 30)
        self.f_callout = ImageFont.truetype(FONT_BOLD, 26)

        # Gradient mask
        self.grad_mask = Image.new("RGBA", (self.w, self.h), (0, 0, 0, 0))
        gdraw = ImageDraw.Draw(self.grad_mask)
        for y in range(480):
            alpha = int(195 * (1 - y / 480))
            gdraw.line([(0, y), (self.w, y)], fill=(0, 0, 0, alpha))
        for y in range(1250, self.h):
            alpha = int(235 * ((y - 1250) / 670))
            gdraw.line([(0, y), (self.w, y)], fill=(0, 0, 0, alpha))

    def get_bg(self, photo, zoom=1.0, pan_x=0, pan_y=0):
        pw, ph = photo.size
        crop_w = int(pw / zoom)
        crop_h = int(ph / zoom)
        x0 = max(0, min(pw - crop_w, (pw - crop_w) // 2 + pan_x))
        y0 = max(0, min(ph - crop_h, (ph - crop_h) // 2 + pan_y))
        cropped = photo.crop((x0, y0, x0 + crop_w, y0 + crop_h))
        resized = cropped.resize((self.w, self.h), Image.Resampling.BILINEAR)
        return Image.alpha_composite(resized, self.grad_mask)

    def render_frame(self, t):
        w, h = self.w, self.h

        # -----------------------------------------------------------------
        # SCENE 1: Problem Hook (0.00s ~ 7.82s)
        # -----------------------------------------------------------------
        if t < 7.82:
            seg_t = t
            zoom = 1.0 + 0.05 * (seg_t / 7.82)
            frame = self.get_bg(self.p1, zoom=zoom, pan_y=0)
            draw = ImageDraw.Draw(frame)

            draw.rounded_rectangle([(230, 110), (850, 175)], radius=30, fill=(235, 75, 0, 245), outline=(255, 170, 0), width=2)
            draw.text((540, 142), "[ ⚠️ INDUSTRIAL SAFETY WARNING ]", font=self.f_badge, fill=(255, 255, 255), anchor="mm")

            draw.text((540, 270), "NEVER Reset a Tripped Breaker\nWithout Checking First!", font=self.f_title, fill=(255, 255, 255), anchor="mm", align="center", stroke_width=4, stroke_fill=(0, 0, 0))

            # Pulsing target callout on trip light
            cx, cy = 372, 1010
            pulse_r = int(42 + 6 * math.sin(t * 8))
            draw.ellipse([(cx - pulse_r, cy - pulse_r), (cx + pulse_r, cy + pulse_r)], outline=(255, 50, 0, 255), width=5)
            draw.ellipse([(cx - pulse_r - 12, cy - pulse_r - 12), (cx + pulse_r + 12, cy + pulse_r + 12)], outline=(255, 210, 0, 180), width=2)
            draw.line([(cx + pulse_r + 5, cy), (cx + pulse_r + 75, cy - 45)], fill=(255, 220, 0, 255), width=3)
            draw.rounded_rectangle([(cx + pulse_r + 75, cy - 75), (cx + pulse_r + 390, cy - 15)], radius=16, fill=(15, 20, 35, 235), outline=(255, 210, 0), width=2)
            draw.text((cx + pulse_r + 232, cy - 45), "⚡ [TRIP: FAULT DETECTED]", font=self.f_callout, fill=(255, 230, 0), anchor="mm")

            # Subtitle card
            draw.rounded_rectangle([(70, 1500), (1010, 1710)], radius=24, fill=(0, 0, 0, 215), outline=(255, 140, 0), width=2)
            if seg_t < 4.2:
                draw.text((540, 1565), "When an industrial breaker trips in a plant...", font=self.f_sub1, fill=(255, 255, 255), anchor="mm")
                draw.text((540, 1640), "People just flip it back on immediately!", font=self.f_sub2, fill=(255, 220, 0), anchor="mm")
            else:
                draw.text((540, 1565), "STOP! That is extremely dangerous!", font=self.f_sub2, fill=(255, 75, 75), anchor="mm")
                draw.text((540, 1640), "Never force a tripped breaker!", font=self.f_sub1, fill=(255, 255, 255), anchor="mm")

        # -----------------------------------------------------------------
        # SCENE 2: Cause & Arc Flash Hazard (7.82s ~ 19.51s)
        # -----------------------------------------------------------------
        elif t < 19.51:
            seg_t = t - 7.82
            zoom = 1.06 + 0.05 * (seg_t / 11.69)

            shake_x, shake_y = 0, 0
            is_exploding = 5.8 <= seg_t <= 6.8
            if is_exploding:
                shake_x = int(random.uniform(-10, 10))
                shake_y = int(random.uniform(-10, 10))

            frame = self.get_bg(self.p1, zoom=zoom, pan_x=shake_x, pan_y=int(30 * (seg_t / 11.69)) + shake_y)

            if is_exploding:
                flash_alpha = int(75 + 40 * math.sin(seg_t * 25))
                red_flash = Image.new("RGBA", (w, h), (255, 20, 20, flash_alpha))
                frame = Image.alpha_composite(frame, red_flash)

            draw = ImageDraw.Draw(frame)

            draw.rounded_rectangle([(250, 110), (830, 175)], radius=30, fill=(220, 25, 25, 245), outline=(255, 100, 100), width=2)
            draw.text((540, 142), "[ 💥 CATASTROPHIC ARC FLASH RISK ]", font=self.f_badge, fill=(255, 255, 255), anchor="mm")

            draw.text((540, 270), "DEAD SHORT OR GROUND FAULT\nForced Reset = Massive Explosion!", font=self.f_title, fill=(255, 255, 255), anchor="mm", align="center", stroke_width=4, stroke_fill=(0, 0, 0))

            draw.rounded_rectangle([(70, 1490), (1010, 1715)], radius=24, fill=(0, 0, 0, 220), outline=(230, 40, 40), width=2)
            if seg_t < 5.8:
                draw.text((540, 1560), "A tripped breaker is a critical warning...", font=self.f_sub1, fill=(255, 255, 255), anchor="mm")
                draw.text((540, 1640), "Dead short or ground fault on the line!", font=self.f_sub2, fill=(255, 220, 0), anchor="mm")
            else:
                draw.text((540, 1560), "Forcing it on causes a MASSIVE ARC FLASH,", font=self.f_sub1, fill=(255, 255, 255), anchor="mm")
                draw.text((540, 1640), "Destroying switchgear and injuring staff!", font=self.f_sub2, fill=(255, 60, 60), anchor="mm")

        # -----------------------------------------------------------------
        # SCENE 3: 3 Critical Safety Checks (19.51s ~ 35.33s)
        # -----------------------------------------------------------------
        elif t < 35.33:
            seg_t = t - 19.51
            zoom = 1.0 + 0.04 * (seg_t / 15.82)
            frame = self.get_bg(self.p2, zoom=zoom, pan_y=0)
            draw = ImageDraw.Draw(frame)

            draw.rounded_rectangle([(260, 110), (820, 175)], radius=30, fill=(0, 125, 230, 245), outline=(0, 215, 255), width=2)
            draw.text((540, 142), "[ ⚡ 3 CRITICAL SAFETY CHECKS ]", font=self.f_badge, fill=(255, 255, 255), anchor="mm")

            draw.text((540, 270), "Before Resetting A Breaker:\nAlways Follow These 3 Steps", font=self.f_title, fill=(255, 255, 255), anchor="mm", align="center", stroke_width=4, stroke_fill=(0, 0, 0))

            checklist = [
                ("1. Check Trip Flag (Overload vs Ground Fault)", seg_t >= 3.8, (255, 220, 0)),
                ("2. Megger Test Line Insulation Resistance", seg_t >= 7.8, (0, 230, 255)),
                ("3. Verify Motor Starting Inrush Current (<6x)", seg_t >= 11.8, (100, 255, 120))
            ]

            card_y_start = 380
            for idx, (label, is_active, color) in enumerate(checklist):
                cy = card_y_start + idx * 105
                bg_col = (15, 30, 55, 240) if is_active else (10, 15, 25, 190)
                border_col = color if is_active else (80, 95, 120, 150)
                draw.rounded_rectangle([(90, cy), (990, cy + 85)], radius=18, fill=bg_col, outline=border_col, width=3 if is_active else 1)

                icon = "[ ✓ ]" if is_active else "[   ]"
                icon_col = color if is_active else (140, 150, 170)
                draw.text((130, cy + 42), icon, font=self.f_card_h, fill=icon_col, anchor="lm")
                draw.text((220, cy + 42), label, font=self.f_small, fill=(255, 255, 255) if is_active else (160, 170, 185), anchor="lm")

            draw.rounded_rectangle([(70, 1480), (1010, 1720)], radius=24, fill=(0, 0, 0, 220), outline=(0, 180, 255), width=2)
            if seg_t < 3.8:
                draw.text((540, 1555), "Always follow these 3 critical steps first!", font=self.f_sub2, fill=(0, 230, 255), anchor="mm")
                draw.text((540, 1640), "Protect yourself and your equipment!", font=self.f_sub1, fill=(255, 255, 255), anchor="mm")
            elif seg_t < 7.8:
                draw.text((540, 1555), "Step 1: Check Trip Indicator", font=self.f_sub2, fill=(255, 220, 0), anchor="mm")
                draw.text((540, 1640), "Distinguish Overload vs Ground Fault", font=self.f_sub1, fill=(255, 255, 255), anchor="mm")
            elif seg_t < 11.8:
                draw.text((540, 1555), "Step 2: Megger Insulation Test", font=self.f_sub2, fill=(0, 230, 255), anchor="mm")
                draw.text((540, 1640), "Identify line faults before re-energizing", font=self.f_sub1, fill=(255, 255, 255), anchor="mm")
            else:
                draw.text((540, 1555), "Step 3: Motor Inrush Verification", font=self.f_sub2, fill=(100, 255, 120), anchor="mm")
                draw.text((540, 1640), "Ensure inrush doesn't exceed breaker rating", font=self.f_sub1, fill=(255, 255, 255), anchor="mm")

        # -----------------------------------------------------------------
        # SCENE 4: Global VoltCheck Tool & CTA (35.33s ~ 45.55s)
        # -----------------------------------------------------------------
        else:
            seg_t = t - 35.33
            zoom = 1.04
            frame = self.get_bg(self.p2, zoom=zoom, pan_y=0)
            draw = ImageDraw.Draw(frame)

            draw.rounded_rectangle([(270, 110), (810, 175)], radius=30, fill=(0, 165, 115, 245), outline=(0, 255, 170), width=2)
            draw.text((540, 142), "[ 🚀 PRO ENGINEERING TOOLKIT ]", font=self.f_badge, fill=(255, 255, 255), anchor="mm")

            draw.rounded_rectangle([(100, 310), (980, 890)], radius=32, fill=(12, 22, 42, 245), outline=(0, 220, 255), width=3)

            shimmer_x = int(120 + ((seg_t * 220) % 800))
            draw.line([(shimmer_x, 320), (shimmer_x + 60, 320)], fill=(255, 255, 255, 180), width=4)

            draw.text((540, 395), "VOLTCHECK ⚡", font=self.f_title_sub, fill=(0, 230, 255), anchor="mm")
            draw.text((540, 480), "Global Industrial Engineering Portal", font=self.f_card_h, fill=(255, 255, 255), anchor="mm")

            features = [
                ("⚡ Motor Starting Inrush & Breaker Sizing", (255, 225, 0)),
                ("📐 Cable Sizing & Voltage Drop in 3 Seconds", (0, 230, 255)),
                ("📱 100% Free Web App · No Sign-Up Required", (100, 255, 130))
            ]

            for f_idx, (text, f_color) in enumerate(features):
                box_y = 560 + f_idx * 95
                draw.rounded_rectangle([(140, box_y), (940, box_y + 75)], radius=16, fill=(22, 38, 68, 230), outline=(0, 160, 220), width=1)
                draw.text((540, box_y + 37), text, font=self.f_small, fill=f_color, anchor="mm")

            draw.rounded_rectangle([(70, 1500), (1010, 1715)], radius=24, fill=(0, 0, 0, 220), outline=(0, 230, 255), width=2)
            if seg_t < 5.0:
                draw.text((540, 1565), "Calculate cable size and voltage drop in seconds!", font=self.f_sub1, fill=(255, 255, 255), anchor="mm")
                draw.text((540, 1640), "Use VoltCheck right on your phone!", font=self.f_sub2, fill=(255, 220, 0), anchor="mm")
            else:
                draw.text((540, 1565), "Stay safe on the job site!", font=self.f_sub1, fill=(255, 255, 255), anchor="mm")
                draw.text((540, 1640), "Visit voltcheck24.com today!", font=self.f_sub2, fill=(0, 230, 255), anchor="mm")

        # Neon Progress Bar
        prog = min(1.0, max(0.0, t / self.total_duration))
        prog_w = int(w * prog)
        draw.line([(0, h - 8), (prog_w, h - 8)], fill=(0, 240, 255), width=8)

        return frame.convert("RGB")


def main():
    print("🚀 [GLOBAL SHORTS] Starting English Edition Rendering Pipeline...")
    master_audio, duration = prepare_global_audio()

    renderer = GlobalVideoRenderer(duration)

    fps = 30
    total_frames = int(duration * fps)
    print(f"🎬 Full HD Rendering: {total_frames} frames ({duration:.2f}s @ 30fps)")

    cmd = [
        FFMPEG, "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", "1080x1920",
        "-pix_fmt", "rgb24",
        "-r", str(fps),
        "-i", "-",
        "-i", str(master_audio),
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "20",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        str(OUTPUT_MP4)
    ]

    pipe = subprocess.Popen(cmd, stdin=subprocess.PIPE)

    for i in range(total_frames):
        t = i / fps
        frame = renderer.render_frame(t)
        pipe.stdin.write(frame.tobytes())

        if (i + 1) % 150 == 0 or i == total_frames - 1:
            pct = int((i + 1) / total_frames * 100)
            print(f"   Rendering: {pct}% ({i+1}/{total_frames})", flush=True)

    pipe.stdin.close()
    pipe.wait()

    size_mb = OUTPUT_MP4.stat().st_size / (1024 * 1024)
    print(f"🎉 Global English Short Finished: {OUTPUT_MP4} ({size_mb:.1f} MB)")


if __name__ == "__main__":
    main()
