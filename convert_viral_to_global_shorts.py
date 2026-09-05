# -*- coding: utf-8 -*-
"""
=============================================================================
🌍 [GLOBAL VIRAL ENGINE] Convert Speed Challenge & RPG Battle to Global Shorts
=============================================================================
1. Viral 1: Engineering Speed Challenge (shorts_global_viral_speed_challenge.mp4)
2. Viral 2: 8-Bit Retro RPG Boss Battle (shorts_global_creative_rpg_battle.mp4)
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


async def generate_voice_chunk(text, voice, out_mp3):
    import edge_tts
    comm = edge_tts.Communicate(text, voice, rate="+7%")
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
    concat_txt = SCRATCH / "tmp_concat_viral.txt"
    with open(concat_txt, "w", encoding="utf-8") as f:
        for vf in voice_files:
            f.write(f"file '{vf}'\n")

    tmp_voice_mp3 = SCRATCH / "tmp_voice_viral.mp3"
    subprocess.run([FFMPEG, "-y", "-f", "concat", "-safe", "0", "-i", str(concat_txt), "-c", "copy", str(tmp_voice_mp3)],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    tmp_voice_wav = SCRATCH / "tmp_voice_viral.wav"
    subprocess.run([FFMPEG, "-y", "-i", str(tmp_voice_mp3), "-ar", "44100", "-ac", "1", str(tmp_voice_wav)],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    sr, voice = load_wav(tmp_voice_wav)
    sr_bgm, bgm = load_wav(bgm_path)

    n_samples = len(voice)
    master = np.zeros((n_samples, 2), dtype=np.float32)

    master += voice * 1.35

    if len(bgm) < n_samples:
        repeats = int(math.ceil(n_samples / len(bgm)))
        bgm = np.tile(bgm, (repeats, 1))
    bgm_trimmed = bgm[:n_samples]
    master += bgm_trimmed * bgm_vol

    # SFX
    for sfx_name in ["sfx_whoosh.wav", "sfx_alert.wav", "sfx_impact.wav", "sfx_pop.wav"]:
        p = SCRATCH / sfx_name
        if p.exists():
            _, sfx = load_wav(p)
            for t_sec in [0.05, 8.0, 19.0, 27.0]:
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
# 1. RENDER SPEED CHALLENGE SHORT
# =============================================================================
async def render_speed_challenge():
    out_mp4 = BASE_DIR / "shorts_global_viral_speed_challenge.mp4"
    voice = "en-US-AndrewMultilingualNeural"
    scripts = [
        "Who sizes industrial cables and motor circuit breakers faster? Let's find out in an epic engineering speed battle!",
        "Contestant one: The rookie engineer digging through a 500-page textbook—30 minutes in and totally lost! Contestant two: The 30-year veteran punching a scientific calculator—5 minutes in with a typo!",
        "Contestant three: The smart engineer sipping coffee, opening VoltCheck on his smartphone. Two taps on the screen—and BOOM! Exact cable gauge and breaker curve calculated in 2.8 seconds FLAT!",
        "Stop flipping through dusty textbooks and punching calculators. Put 78+ free engineering calculators in your pocket at voltcheck24.com!"
    ]

    print("=" * 75)
    print("⚡ Rendering Global Speed Challenge Short...")
    voice_files = []
    durations = []
    for idx, text in enumerate(scripts):
        p = SCRATCH / f"global_speed_tts_{idx}.mp3"
        await generate_voice_chunk(text, voice, p)
        dur = get_audio_duration(p)
        voice_files.append(p)
        durations.append(dur)

    accum = 0.0
    t_cues = []
    for d in durations:
        accum += d
        t_cues.append(accum)

    out_wav = SCRATCH / "master_speed_challenge.wav"
    master_audio, mixed_dur = mix_audio(voice_files, SCRATCH / "speed_sfx.wav", out_wav, 0.18)

    fps = 30
    total_frames = int(mixed_dur * fps)
    print(f"   Rendering {total_frames} frames ({mixed_dur:.2f}s)...")

    f_badge = ImageFont.truetype(FONT_BOLD, 30)
    f_title = ImageFont.truetype(FONT_TITLE, 52)
    f_sub1 = ImageFont.truetype(FONT_BOLD, 42)
    f_sub2 = ImageFont.truetype(FONT_BOLD, 46)
    f_card = ImageFont.truetype(FONT_BOLD, 36)
    f_small = ImageFont.truetype(FONT_BOLD, 28)

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

        for gx in range(0, 1080, 120):
            draw.line([(gx, 0), (gx, 1920)], fill=(22, 28, 45), width=1)
        for gy in range(0, 1920, 120):
            draw.line([(0, gy), (1080, gy)], fill=(22, 28, 45), width=1)

        seg_idx = 3
        for idx, cue in enumerate(t_cues):
            if t < cue:
                seg_idx = idx
                break

        # Header Badge
        draw.rounded_rectangle([(210, 100), (870, 165)], radius=30, fill=(230, 120, 0), outline=(255, 255, 255), width=1)
        draw.text((540, 132), "[ ⚡ SPEED CHALLENGE: WHO WINS? ]", font=f_badge, fill=(255, 255, 255), anchor="mm")
        draw.text((540, 260), "Rookie vs 30-Yr Veteran\nvs 3-Second Cheat Code", font=f_title, fill=(255, 255, 255), anchor="mm", align="center")

        # Visuals per segment
        if seg_idx == 0:
            # Battle Matchup
            draw.rounded_rectangle([(140, 410), (940, 920)], radius=26, fill=(25, 22, 40), outline=(255, 170, 0), width=3)
            draw.text((540, 480), "CALCULATION SPEED BATTLE", font=f_badge, fill=(255, 200, 0), anchor="mm")
            draw.text((540, 560), "3-Phase Voltage Drop & Breaker Sizing", font=f_card, fill=(255, 255, 255), anchor="mm")

            draw.rounded_rectangle([(180, 630), (900, 720)], radius=16, fill=(40, 30, 60))
            draw.text((540, 675), "⚡ Round 1: Who Gets Sizing Done First?", font=f_card, fill=(0, 230, 255), anchor="mm")

            draw.rounded_rectangle([(180, 750), (900, 850)], radius=16, fill=(180, 50, 0))
            draw.text((540, 800), "⏱️ Ready... SET... GO!", font=f_title, fill=(255, 255, 255), anchor="mm")

        elif seg_idx == 1:
            # Contestants 1 & 2
            draw.rounded_rectangle([(120, 380), (960, 630)], radius=20, fill=(28, 20, 25), outline=(255, 80, 80), width=2)
            draw.text((540, 430), "👨‍🎓 CONTESTANT 1: ROOKIE ENGINEER", font=f_badge, fill=(255, 100, 100), anchor="mm")
            draw.text((540, 495), "500-Page Textbook Search", font=f_card, fill=(255, 255, 255), anchor="mm")
            draw.text((540, 560), "⏱️ 30 Minutes Elapsed -> ❌ STUCK!", font=f_title, fill=(255, 60, 60), anchor="mm")

            draw.rounded_rectangle([(120, 670), (960, 920)], radius=20, fill=(28, 25, 20), outline=(255, 180, 0), width=2)
            draw.text((540, 720), "👴 CONTESTANT 2: 30-YEAR VETERAN", font=f_badge, fill=(255, 200, 0), anchor="mm")
            draw.text((540, 785), "Scientific Calculator Hand Punching", font=f_card, fill=(255, 255, 255), anchor="mm")
            draw.text((540, 850), "⏱️ 5 Minutes Elapsed -> ⚠️ TYPO ERROR!", font=f_title, fill=(255, 170, 0), anchor="mm")

        elif seg_idx == 2:
            # Contestant 3: VoltCheck WINNER
            draw.rounded_rectangle([(100, 370), (980, 930)], radius=28, fill=(15, 32, 50), outline=(0, 255, 170), width=3)
            draw.rounded_rectangle([(320, 410), (760, 470)], radius=20, fill=(0, 180, 100))
            draw.text((540, 440), "🏆 CONTESTANT 3: WINNER!", font=f_badge, fill=(255, 255, 255), anchor="mm")

            draw.text((540, 530), "VOLTCHECK SMART USER ⚡", font=f_title, fill=(0, 230, 255), anchor="mm")
            draw.text((540, 610), "2 Taps on Smartphone Screen", font=f_card, fill=(255, 255, 255), anchor="mm")

            draw.rounded_rectangle([(180, 670), (900, 780)], radius=20, fill=(0, 120, 70))
            draw.text((540, 725), "TIME: 2.8 SECONDS FLAT! 🚀", font=f_title, fill=(255, 255, 255), anchor="mm")

            draw.text((540, 830), "✅ 4.0 sq Cable Size Selected (2.9% Drop)", font=f_card, fill=(100, 255, 150), anchor="mm")
            draw.text((540, 880), "✅ Type-D Breaker & MC-32a Confirmed", font=f_card, fill=(0, 255, 200), anchor="mm")

        else:
            # CTA
            draw.rounded_rectangle([(100, 350), (980, 930)], radius=32, fill=(12, 22, 42), outline=(0, 220, 255), width=3)
            draw.text((540, 430), "VOLTCHECK ⚡", font=f_title, fill=(0, 230, 255), anchor="mm")
            draw.text((540, 510), "The Ultimate Engineering Cheat Code", font=f_card, fill=(255, 255, 255), anchor="mm")

            perks = [
                ("⚡ 78+ Free Engineering Calculators Online", (255, 225, 0)),
                ("📱 Electrical · Mechanical · Motors · Hydraulics", (0, 230, 255)),
                ("🚀 100% Free · Mobile Optimized · No Sign-Up", (100, 255, 130))
            ]
            for p_idx, (text, p_col) in enumerate(perks):
                by = 590 + p_idx * 95
                draw.rounded_rectangle([(140, by), (940, by + 75)], radius=16, fill=(22, 38, 68), outline=(0, 160, 220), width=1)
                draw.text((540, by + 37), text, font=f_small, fill=p_col, anchor="mm")

        # Subtitles
        draw.rounded_rectangle([(70, 1500), (1010, 1720)], radius=24, fill=(0, 0, 0), outline=(255, 180, 0), width=2)
        script_text = scripts[seg_idx]
        words = script_text.split()
        mid = len(words) // 2
        line1 = " ".join(words[:mid])
        line2 = " ".join(words[mid:])
        draw.text((540, 1565), line1, font=f_sub1, fill=(255, 255, 255), anchor="mm")
        draw.text((540, 1645), line2, font=f_sub2, fill=(255, 220, 0), anchor="mm")

        prog = min(1.0, max(0.0, t / mixed_dur))
        draw.line([(0, 1912), (int(1080 * prog), 1912)], fill=(255, 180, 0), width=8)

        pipe.stdin.write(im.tobytes())

    pipe.stdin.close()
    pipe.wait()
    print(f"✅ Speed Challenge Rendered: {out_mp4.name} ({out_mp4.stat().st_size / (1024*1024):.2f} MB)")


# =============================================================================
# 2. RENDER 8-BIT RETRO RPG BATTLE SHORT
# =============================================================================
async def render_rpg_battle():
    out_mp4 = BASE_DIR / "shorts_global_creative_rpg_battle.mp4"
    voice = "en-US-BrianMultilingualNeural"
    scripts = [
        "Deep in the industrial automation dungeon, a Level 80 Boss appears: The 24V Voltage Drop Monster!",
        "The rookie knight attacks with a 1.5 square millimeter copper sword! MISS! Line voltage collapses to 18.2V! The boss breathes the Two-Million-Dollar Line Shutdown Breath!",
        "The engineer summons the legendary artifact: VoltCheck! In three seconds, he casts KEC 4.0 square millimeter Meteor Slash! 999,999 CRITICAL HIT! Boss annihilated!",
        "Level 99 Electrical Safety Master achieved! Slay voltage drop monsters forever with 78+ free calculators at voltcheck24.com!"
    ]

    print("=" * 75)
    print("🎮 Rendering Global 8-Bit RPG Battle Short...")
    voice_files = []
    durations = []
    for idx, text in enumerate(scripts):
        p = SCRATCH / f"global_rpg_tts_{idx}.mp3"
        await generate_voice_chunk(text, voice, p)
        dur = get_audio_duration(p)
        voice_files.append(p)
        durations.append(dur)

    accum = 0.0
    t_cues = []
    for d in durations:
        accum += d
        t_cues.append(accum)

    out_wav = SCRATCH / "master_rpg_battle.wav"
    master_audio, mixed_dur = mix_audio(voice_files, SCRATCH / "rpg_bgm.wav", out_wav, 0.20)

    fps = 30
    total_frames = int(mixed_dur * fps)
    print(f"   Rendering {total_frames} frames ({mixed_dur:.2f}s)...")

    f_badge = ImageFont.truetype(FONT_BOLD, 30)
    f_title = ImageFont.truetype(FONT_TITLE, 52)
    f_sub1 = ImageFont.truetype(FONT_BOLD, 42)
    f_sub2 = ImageFont.truetype(FONT_BOLD, 46)
    f_card = ImageFont.truetype(FONT_BOLD, 36)
    f_small = ImageFont.truetype(FONT_BOLD, 28)

    cmd = [
        FFMPEG, "-y", "-f", "rawvideo", "-vcodec", "rawvideo", "-s", "1080x1920",
        "-pix_fmt", "rgb24", "-r", str(fps), "-i", "-", "-i", str(master_audio),
        "-c:v", "libx264", "-preset", "fast", "-crf", "20", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k", "-shortest", str(out_mp4)
    ]
    pipe = subprocess.Popen(cmd, stdin=subprocess.PIPE)

    for frame_idx in range(total_frames):
        t = frame_idx / fps
        im = Image.new("RGB", (1080, 1920), (10, 12, 26))
        draw = ImageDraw.Draw(im)

        # Pixel grid background
        for gx in range(0, 1080, 80):
            draw.line([(gx, 0), (gx, 1920)], fill=(18, 22, 38), width=1)
        for gy in range(0, 1920, 80):
            draw.line([(0, gy), (1080, gy)], fill=(18, 22, 38), width=1)

        seg_idx = 3
        for idx, cue in enumerate(t_cues):
            if t < cue:
                seg_idx = idx
                break

        # Pixel RPG Header
        draw.rounded_rectangle([(230, 100), (850, 165)], radius=12, fill=(180, 0, 180), outline=(255, 255, 255), width=2)
        draw.text((540, 132), "[ 🎮 8-BIT RETRO RPG BATTLE ]", font=f_badge, fill=(255, 255, 255), anchor="mm")
        draw.text((540, 260), "Defeat the LV.80\nVoltage Drop Monster!", font=f_title, fill=(255, 255, 255), anchor="mm", align="center")

        if seg_idx == 0:
            # Boss Encounter
            draw.rounded_rectangle([(140, 400), (940, 930)], radius=18, fill=(30, 12, 40), outline=(255, 0, 120), width=3)
            draw.text((540, 470), "⚔️ BOSS ENCOUNTER ⚔️", font=f_badge, fill=(255, 0, 180), anchor="mm")
            draw.text((540, 560), "LV.80 ΔV OVERLORD", font=f_title, fill=(255, 50, 80), anchor="mm")

            # HP Bar
            draw.text((540, 660), "HP: 1,000,000 / 1,000,000", font=f_card, fill=(255, 255, 255), anchor="mm")
            draw.rectangle([(200, 710), (880, 760)], fill=(40, 20, 40), outline=(255, 255, 255), width=2)
            draw.rectangle([(204, 714), (876, 756)], fill=(255, 0, 80))

            draw.text((540, 840), "Special: 24V Line Drain Aura!", font=f_card, fill=(255, 220, 0), anchor="mm")

        elif seg_idx == 1:
            # Miss / 18.2V Collapse
            draw.rounded_rectangle([(140, 400), (940, 930)], radius=18, fill=(35, 15, 25), outline=(255, 50, 50), width=3)
            draw.text((540, 470), "🗡️ ROOKIE ATTACKS WITH 1.5 sq SWORD", font=f_small, fill=(255, 200, 0), anchor="mm")

            draw.rounded_rectangle([(250, 540), (830, 640)], radius=16, fill=(180, 0, 0))
            draw.text((540, 590), "MISS! (0 DAMAGE)", font=f_title, fill=(255, 255, 255), anchor="mm")

            draw.text((540, 710), "VOLTAGE COLLAPSED TO 18.2V!", font=f_card, fill=(255, 80, 80), anchor="mm")
            draw.text((540, 780), "Optical Sensors Paralyzed! Turn Lost!", font=f_card, fill=(255, 220, 0), anchor="mm")
            draw.text((540, 860), "💥 Line Shutdown Breath Incoming!", font=f_small, fill=(255, 100, 100), anchor="mm")

        elif seg_idx == 2:
            # VoltCheck Meteor Slash
            draw.rounded_rectangle([(140, 400), (940, 930)], radius=18, fill=(12, 35, 45), outline=(0, 255, 200), width=3)
            draw.text((540, 460), "✨ SUMMON: SACRED TOOL VOLTCHECK ✨", font=f_small, fill=(0, 255, 255), anchor="mm")

            draw.rounded_rectangle([(200, 520), (880, 630)], radius=16, fill=(0, 160, 120))
            draw.text((540, 575), "KEC 4.0 sq METEOR SLASH!", font=f_title, fill=(255, 255, 255), anchor="mm")

            draw.text((540, 700), "💥 999,999 CRITICAL HIT! 💥", font=ImageFont.truetype(FONT_TITLE, 54), fill=(255, 255, 0), anchor="mm")
            draw.text((540, 790), "Boss Defeated in 2.8 Seconds!", font=f_card, fill=(100, 255, 150), anchor="mm")
            draw.text((540, 860), "+50,000 EXP · Factory Saved!", font=f_card, fill=(0, 255, 220), anchor="mm")

        else:
            # Victory Screen
            draw.rounded_rectangle([(100, 350), (980, 930)], radius=24, fill=(12, 22, 42), outline=(0, 220, 255), width=3)
            draw.text((540, 430), "QUEST COMPLETE! 🏆", font=f_title, fill=(255, 220, 0), anchor="mm")
            draw.text((540, 510), "VoltCheck 78+ Engineering Calculators", font=f_card, fill=(255, 255, 255), anchor="mm")

            perks = [
                ("⚡ Conquer Electrical, Mechanical & Hydraulic Calculations", (255, 225, 0)),
                ("🛡️ Slay Voltage Drops & Sizing Errors Forever", (0, 230, 255)),
                ("🎮 100% Free Forever · No Account Required", (100, 255, 130))
            ]
            for p_idx, (text, p_col) in enumerate(perks):
                by = 590 + p_idx * 95
                draw.rounded_rectangle([(140, by), (940, by + 75)], radius=12, fill=(22, 38, 68), outline=(0, 160, 220), width=1)
                draw.text((540, by + 37), text, font=f_small, fill=p_col, anchor="mm")

        # Subtitles
        draw.rounded_rectangle([(70, 1500), (1010, 1720)], radius=18, fill=(0, 0, 0), outline=(200, 0, 255), width=2)
        script_text = scripts[seg_idx]
        words = script_text.split()
        mid = len(words) // 2
        line1 = " ".join(words[:mid])
        line2 = " ".join(words[mid:])
        draw.text((540, 1565), line1, font=f_sub1, fill=(255, 255, 255), anchor="mm")
        draw.text((540, 1645), line2, font=f_sub2, fill=(255, 220, 0), anchor="mm")

        prog = min(1.0, max(0.0, t / mixed_dur))
        draw.line([(0, 1912), (int(1080 * prog), 1912)], fill=(200, 0, 255), width=8)

        pipe.stdin.write(im.tobytes())

    pipe.stdin.close()
    pipe.wait()
    print(f"✅ RPG Battle Rendered: {out_mp4.name} ({out_mp4.stat().st_size / (1024*1024):.2f} MB)")


async def main():
    await render_speed_challenge()
    await render_rpg_battle()


if __name__ == "__main__":
    asyncio.run(main())
