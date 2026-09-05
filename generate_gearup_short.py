# -*- coding: utf-8 -*-
"""
=============================================================================
🎮 [GEARUP BOOSTER] Global Gaming Affiliate Short (English Edition)
=============================================================================
- High-energy viral short for GearUP Booster affiliate campaign
- American English voiceover (en-US-AndrewMultilingualNeural)
- Dynamic Ping Drop HUD (180ms Red -> 18ms Green)
- Official GearUP banner creative & animated CTA
- Target: Global FPS Gamers (Valorant, Warzone, Apex, CS2, Fortnite)
=============================================================================
"""

import os
import sys
import math
import wave
import struct
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
BANNER_PATH = SCRATCH / "gearup_banner.png"

OUTPUT_MP4 = BASE_DIR / "shorts_gearup_affiliate_global.mp4"

SEG_DURATIONS = [8.52, 7.80, 11.81, 8.09]
TOTAL_DURATION = sum(SEG_DURATIONS)  # 36.22s


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


def prepare_audio():
    print("🎵 Mastering High-Energy Gaming Soundtrack (Voice + BGM + SFX)...")

    # Combine TTS
    concat_txt = SCRATCH / "gearup_concat.txt"
    with open(concat_txt, "w", encoding="utf-8") as f:
        for i in range(4):
            f.write(f"file '{SCRATCH / f'gearup_tts_{i}.mp3'}'\n")

    combined_mp3 = SCRATCH / "gearup_combined_voice.mp3"
    subprocess.run([FFMPEG, "-y", "-f", "concat", "-safe", "0", "-i", str(concat_txt), "-c", "copy", str(combined_mp3)],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    voice_wav = SCRATCH / "gearup_voice.wav"
    subprocess.run([FFMPEG, "-y", "-i", str(combined_mp3), "-ar", "44100", "-ac", "1", str(voice_wav)],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    # Generate high-energy electronic gaming beat (128 BPM)
    bgm_wav = SCRATCH / "gearup_gaming_bgm.wav"
    sr = 44100
    n_samples = int(sr * (TOTAL_DURATION + 2))
    wav = wave.open(str(bgm_wav), "w")
    wav.setparams((2, 2, sr, n_samples, "NONE", "not compressed"))

    bpm = 128
    spb = 60.0 / bpm
    data = []
    for i in range(n_samples):
        t = i / sr
        bt = t % spb
        # Punchy kick drum
        kick = math.sin(2 * math.pi * (65 - 45 * (bt / spb)) * bt) * math.exp(-bt * 16) if bt < 0.22 else 0
        # Crisp hi-hat
        ht = t % (spb / 2)
        hat = ((i % 11) / 5.5 - 1.0) * math.exp(-ht * 45) * 0.09 if ht < 0.05 else 0
        # Electro bassline (Am: A, C, D, E)
        bar = int(t / (spb * 2)) % 4
        notes = [110.0, 130.81, 146.83, 164.81]
        f0 = notes[bar]
        bass = (math.sin(2 * math.pi * f0 * t) * 0.22 + math.sin(2 * math.pi * f0 * 2 * t) * 0.1) * (1 - (bt / spb) * 0.4)

        val = int((kick * 0.4 + hat + bass) * 32767 * 0.22)
        val = max(-32767, min(32767, val))
        data.append(struct.pack("<hh", val, val))

    wav.writeframes(b"".join(data))
    wav.close()

    sr_v, voice = load_wav(voice_wav)
    _, bgm = load_wav(bgm_wav)

    master = np.zeros((len(voice), 2), dtype=np.float32)
    master += voice * 1.35
    bgm_trimmed = bgm[:len(voice)] if len(bgm) >= len(voice) else np.pad(bgm, ((0, len(voice) - len(bgm)), (0, 0)))
    master += bgm_trimmed * 0.22

    # SFX Cues
    sfx_cues = [
        ("sfx_whoosh.wav", 0.00, 0.65),
        ("sfx_alert.wav", 0.15, 0.50),
        ("sfx_impact.wav", 4.00, 0.75),       # "BAM! 180ms spike"
        ("sfx_whoosh.wav", 8.52, 0.65),       # Scene 2
        ("sfx_spark.wav", 13.00, 0.60),       # "packet loss"
        ("sfx_whoosh.wav", 16.32, 0.65),      # Scene 3
        ("sfx_pop.wav", 20.00, 0.70),         # Ping drops
        ("sfx_pop.wav", 22.50, 0.70),         # 18ms reached
        ("sfx_whoosh.wav", 28.13, 0.65),      # Scene 4 CTA
        ("sfx_pop.wav", 32.00, 0.65)          # Button pop
    ]

    for sfx_name, start_t, vol in sfx_cues:
        _, sfx_data = load_wav(SCRATCH / sfx_name)
        start_idx = int(start_t * sr_v)
        end_idx = min(start_idx + len(sfx_data), len(voice))
        actual_len = end_idx - start_idx
        if actual_len > 0:
            master[start_idx:end_idx] += sfx_data[:actual_len] * vol

    master = np.tanh(master * 0.92)

    master_wav = SCRATCH / "gearup_master_audio.wav"
    with wave.open(str(master_wav), "w") as f:
        f.setnchannels(2)
        f.setsampwidth(2)
        f.setframerate(sr_v)
        f.writeframes((master * 32767).astype(np.int16).tobytes())

    return master_wav, len(master) / sr_v


def render_video():
    master_audio, dur = prepare_audio()
    fps = 30
    total_frames = int(dur * fps)
    print(f"🎬 Full HD Rendering: {total_frames} frames ({dur:.2f}s @ 30fps)")

    banner = Image.open(BANNER_PATH).convert("RGBA")
    bw, bh = banner.size
    scale = 960 / bw
    banner_w, banner_h = int(bw * scale), int(bh * scale)
    banner_scaled = banner.resize((banner_w, banner_h), Image.Resampling.LANCZOS)

    f_badge = ImageFont.truetype(FONT_BOLD, 30)
    f_title = ImageFont.truetype(FONT_TITLE, 56)
    f_sub1 = ImageFont.truetype(FONT_BOLD, 44)
    f_sub2 = ImageFont.truetype(FONT_BOLD, 48)
    f_hud = ImageFont.truetype(FONT_TITLE, 64)
    f_card_h = ImageFont.truetype(FONT_BOLD, 40)
    f_small = ImageFont.truetype(FONT_BOLD, 30)

    cmd = [
        FFMPEG, "-y", "-f", "rawvideo", "-vcodec", "rawvideo", "-s", "1080x1920",
        "-pix_fmt", "rgb24", "-r", str(fps), "-i", "-", "-i", str(master_audio),
        "-c:v", "libx264", "-preset", "fast", "-crf", "20", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k", "-shortest", str(OUTPUT_MP4)
    ]
    pipe = subprocess.Popen(cmd, stdin=subprocess.PIPE)

    # Durations: [8.52, 7.80, 11.81, 8.09]
    t_cues = [8.52, 16.32, 28.13, 36.22]

    for i in range(total_frames):
        t = i / fps
        im = Image.new("RGB", (1080, 1920), (10, 14, 26))
        draw = ImageDraw.Draw(im)

        # Ambient gaming grid
        for gx in range(0, 1080, 120):
            draw.line([(gx, 0), (gx, 1920)], fill=(18, 24, 42), width=1)
        for gy in range(0, 1920, 120):
            draw.line([(0, gy), (1080, gy)], fill=(18, 24, 42), width=1)

        # SCENE 1: The Frustration Hook (0 ~ 8.52s)
        if t < t_cues[0]:
            seg_t = t
            draw.rounded_rectangle([(230, 110), (850, 175)], radius=30, fill=(235, 30, 30), outline=(255, 100, 100), width=2)
            draw.text((540, 142), "[ GAMING NETWORK WARNING ]", font=f_badge, fill=(255, 255, 255), anchor="mm")
            draw.text((540, 270), "Tired of 180ms Ping Spikes?\nNever Lose a Gunfight Again!", font=f_title, fill=(255, 255, 255), anchor="mm", align="center")

            # Center: Big Red Lag HUD
            draw.rounded_rectangle([(120, 390), (960, 890)], radius=32, fill=(28, 14, 22), outline=(255, 50, 50), width=3)
            draw.text((540, 480), "CURRENT LATENCY", font=f_small, fill=(255, 120, 120), anchor="mm")
            
            # Pulsing 180 ms Ping
            pulse = int(5 * math.sin(t * 12))
            draw.text((540, 600), "180 ms", font=ImageFont.truetype(FONT_TITLE, 90 + pulse), fill=(255, 40, 40), anchor="mm")
            
            draw.rounded_rectangle([(200, 720), (880, 820)], radius=20, fill=(180, 20, 20))
            draw.text((540, 770), "⚠️ HIGH PING & PACKET LOSS", font=f_card_h, fill=(255, 255, 255), anchor="mm")

            draw.rounded_rectangle([(70, 1500), (1010, 1710)], radius=24, fill=(0, 0, 0), outline=(255, 60, 60), width=2)
            if seg_t < 4.5:
                draw.text((540, 1565), "You're 1 kill away from victory, and BAM!", font=f_sub1, fill=(255, 255, 255), anchor="mm")
                draw.text((540, 1640), "A 180ms ping spike freezes your screen!", font=f_sub2, fill=(255, 50, 50), anchor="mm")
            else:
                draw.text((540, 1565), "You're dead. Unfair latency loss.", font=f_sub1, fill=(255, 255, 255), anchor="mm")
                draw.text((540, 1640), "SOUNDS FAMILIAR?", font=f_sub2, fill=(255, 220, 0), anchor="mm")

        # SCENE 2: The Cause - Congested ISP Routing (8.52 ~ 16.32s)
        elif t < t_cues[1]:
            seg_t = t - t_cues[0]
            draw.rounded_rectangle([(250, 110), (830, 175)], radius=30, fill=(210, 80, 0), outline=(255, 160, 0), width=2)
            draw.text((540, 142), "[ WHY DO LAG SPIKES HAPPEN? ]", font=f_badge, fill=(255, 255, 255), anchor="mm")
            draw.text((540, 270), "Crowded ISP Server Hops\nCause Jitter & Packet Loss!", font=f_title, fill=(255, 255, 255), anchor="mm", align="center")

            # Diagram: Congested Route vs Direct Route
            draw.rounded_rectangle([(100, 390), (980, 890)], radius=28, fill=(18, 24, 44), outline=(255, 140, 0), width=2)
            draw.text((540, 460), "STANDARD ISP ROUTING", font=f_small, fill=(255, 160, 0), anchor="mm")

            # Congested route hops
            hops = ["PC (You)", "Local ISP", "Crowded Node", "Cross-Region", "Game Server"]
            for h_idx, hop in enumerate(hops):
                hx = 160 + h_idx * 185
                hy = 580 if h_idx % 2 == 0 else 660
                draw.ellipse([(hx - 30, hy - 30), (hx + 30, hy + 30)], fill=(40, 25, 35), outline=(255, 80, 80), width=2)
                draw.text((hx, hy), str(h_idx + 1), font=f_small, fill=(255, 200, 200), anchor="mm")
                draw.text((hx, hy + 50), hop, font=ImageFont.truetype(FONT_BOLD, 22), fill=(180, 190, 210), anchor="mm")
                if h_idx < len(hops) - 1:
                    nx = 160 + (h_idx + 1) * 185
                    ny = 580 if (h_idx + 1) % 2 == 0 else 660
                    draw.line([(hx + 30, hy), (nx - 30, ny)], fill=(255, 60, 60), width=3)

            draw.rounded_rectangle([(180, 770), (900, 850)], radius=16, fill=(180, 30, 30))
            draw.text((540, 810), "❌ Unstable Routing = Missed Shots & High Latency", font=f_small, fill=(255, 255, 255), anchor="mm")

            draw.rounded_rectangle([(70, 1490), (1010, 1715)], radius=24, fill=(0, 0, 0), outline=(255, 140, 0), width=2)
            draw.text((540, 1560), "Standard ISPs route game packets through crowded hops,", font=f_sub1, fill=(255, 255, 255), anchor="mm")
            draw.text((540, 1640), "Causing jitter & packet loss right when you shoot!", font=f_sub2, fill=(255, 220, 0), anchor="mm")

        # SCENE 3: The Solution - GearUP Booster (16.32 ~ 28.13s)
        elif t < t_cues[2]:
            seg_t = t - t_cues[1]
            draw.rounded_rectangle([(230, 110), (850, 175)], radius=30, fill=(0, 160, 220), outline=(0, 230, 255), width=2)
            draw.text((540, 142), "[ THE PRO GAMER SOLUTION ]", font=f_badge, fill=(255, 255, 255), anchor="mm")
            draw.text((540, 270), "GearUP Booster: Multi-Path\nDirect High-Speed Game Tunnel!", font=f_title, fill=(255, 255, 255), anchor="mm", align="center")

            # Paste official GearUP Banner
            im.paste(banner_scaled, (60, 380), banner_scaled)

            # Dropping Ping Meter Box
            draw.rounded_rectangle([(120, 780), (960, 1020)], radius=24, fill=(14, 30, 48), outline=(0, 230, 255), width=3)
            draw.text((540, 835), "GEARUP OPTIMIZED LATENCY", font=f_small, fill=(0, 210, 255), anchor="mm")

            # Interpolate ping drop: 180 down to 18
            if seg_t < 4.0:
                cur_ping = int(180 - (180 - 18) * (seg_t / 4.0))
            else:
                cur_ping = 18
            
            ping_col = (0, 255, 120) if cur_ping <= 25 else (255, 220, 0)
            draw.text((540, 920), f"{cur_ping} ms", font=ImageFont.truetype(FONT_TITLE, 76), fill=ping_col, anchor="mm")
            draw.text((540, 985), "✓ STABLE DIRECT ROUTE (ZERO PACKET LOSS)", font=f_small, fill=(180, 255, 200), anchor="mm")

            draw.rounded_rectangle([(70, 1490), (1010, 1715)], radius=24, fill=(0, 0, 0), outline=(0, 230, 255), width=2)
            if seg_t < 6.0:
                draw.text((540, 1560), "Competitive gamers use GearUP Booster!", font=f_sub1, fill=(255, 255, 255), anchor="mm")
                draw.text((540, 1640), "Patented multi-path bypasses crowded routes!", font=f_sub2, fill=(0, 230, 255), anchor="mm")
            else:
                draw.text((540, 1560), "Slashing ping from 180ms down to 18ms flat,", font=f_sub1, fill=(255, 255, 255), anchor="mm")
                draw.text((540, 1640), "Giving you pure, buttery-smooth gunfights!", font=f_sub2, fill=(0, 255, 120), anchor="mm")

        # SCENE 4: CTA & Affiliate Link Instructions (28.13 ~ 36.22s)
        else:
            seg_t = t - t_cues[2]
            draw.rounded_rectangle([(270, 110), (810, 175)], radius=30, fill=(0, 180, 100), outline=(0, 255, 160), width=2)
            draw.text((540, 142), "[ CUT LAG & WIN FIGHTS ]", font=f_badge, fill=(255, 255, 255), anchor="mm")

            # Big Card
            draw.rounded_rectangle([(100, 310), (980, 930)], radius=32, fill=(12, 22, 42), outline=(0, 220, 255), width=3)
            draw.text((540, 395), "GEARUP BOOSTER", font=f_title, fill=(0, 230, 255), anchor="mm")
            draw.text((540, 470), "Official FPS Game Booster", font=f_card_h, fill=(255, 255, 255), anchor="mm")

            # Benefits
            benefits = [
                ("⚡ Lower Ping for Valorant, Warzone & Apex", (255, 225, 0)),
                ("🛡️ Eliminate Packet Loss & Micro-Stutters", (0, 230, 255)),
                ("🎮 Works on PC, Console & Mobile", (100, 255, 130))
            ]
            for b_idx, (b_txt, b_col) in enumerate(benefits):
                by = 540 + b_idx * 90
                draw.rounded_rectangle([(140, by), (940, by + 72)], radius=16, fill=(22, 36, 64), outline=(0, 160, 220), width=1)
                draw.text((540, by + 36), b_txt, font=f_small, fill=b_col, anchor="mm")

            # Giant Click Link Indicator
            draw.rounded_rectangle([(140, 830), (940, 910)], radius=20, fill=(0, 190, 255))
            draw.text((540, 870), "CLICK LINK IN PINNED COMMENT!", font=f_card_h, fill=(10, 20, 40), anchor="mm")

            draw.rounded_rectangle([(70, 1500), (1010, 1715)], radius=24, fill=(0, 0, 0), outline=(0, 230, 255), width=2)
            draw.text((540, 1565), "Cut your lag and win more gunfights!", font=f_sub1, fill=(255, 255, 255), anchor="mm")
            draw.text((540, 1640), "Click the pinned link below & try GearUP!", font=f_sub2, fill=(255, 220, 0), anchor="mm")

        # Progress bar
        prog = min(1.0, max(0.0, t / dur))
        draw.line([(0, 1912), (int(1080 * prog), 1912)], fill=(0, 240, 255), width=8)

        pipe.stdin.write(im.tobytes())

    pipe.stdin.close()
    pipe.wait()
    print("🎉 GearUP Short Finished:", OUTPUT_MP4)
    return OUTPUT_MP4


def main():
    render_video()


if __name__ == "__main__":
    main()
