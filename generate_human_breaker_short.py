# -*- coding: utf-8 -*-
"""
=============================================================================
🎬 [휴먼 엔지니어링] 공장 차단기 트립 안전 수칙 숏츠 생성기
=============================================================================
- 실제 고화질 산업 현장 다큐멘터리 사진 기반
- Microsoft Azure 최신 다국어 음성(HyunsuMultilingualNeural) 적용
- 모던 프리미어/애프터이펙트 스타일 텍스트 및 자막 렌더링
- AI 티 없는 자연스러운 현장 엔지니어 브리핑
=============================================================================
"""

import os
import sys
import math
import wave
import struct
import subprocess
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
FONT_PATH = r"C:\Windows\Fonts\malgunbd.ttf"

PHOTO1_PATH = r"C:\Users\jiwan\.gemini\antigravity\brain\383c856a-190f-4e51-a071-50d194e1c260\breaker_panel_photo_1788596780742.jpg"
PHOTO2_PATH = r"C:\Users\jiwan\.gemini\antigravity\brain\383c856a-190f-4e51-a071-50d194e1c260\multimeter_inspection_1788596797684.jpg"

OUTPUT_MP4 = BASE_DIR / "shorts_human_breaker_safety.mp4"

# 4개 세그먼트 시간 (사전 측정값)
SEG_DURATIONS = [10.99, 13.08, 17.33, 11.98]
TOTAL_DURATION = sum(SEG_DURATIONS)  # 53.38초

# 오디오 합성
def prepare_audio():
    concat_list = SCRATCH_DIR / "breaker_audio_concat.txt"
    with open(concat_list, "w", encoding="utf-8") as f:
        for i in range(4):
            f.write(f"file '{SCRATCH_DIR / f'breaker_tts_{i}.mp3'}'\n")

    combined_voice = SCRATCH_DIR / "breaker_combined_voice.mp3"
    subprocess.run([
        FFMPEG, "-y", "-f", "concat", "-safe", "0",
        "-i", str(concat_list), "-c", "copy", str(combined_voice)
    ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    # 은은한 테크 앰비언트 BGM 생성
    bgm_wav = SCRATCH_DIR / "breaker_ambient_bgm.wav"
    sr = 44100
    n_samples = int(sr * (TOTAL_DURATION + 2))
    wav = wave.open(str(bgm_wav), "w")
    wav.setparams((2, 2, sr, n_samples, "NONE", "not compressed"))

    bpm = 124
    spb = 60.0 / bpm
    data = []
    for i in range(n_samples):
        t = i / sr
        bt = t % spb
        # 부드러운 킥
        kick = math.sin(2 * math.pi * (55 - 35 * (bt / spb)) * bt) * math.exp(-bt * 14) if bt < 0.2 else 0
        # 소프트 셰이커
        st = t % (spb / 2)
        shaker = ((i % 13) / 6.5 - 1.0) * math.exp(-st * 35) * 0.08 if st < 0.06 else 0
        # 따뜻한 앰비언트 신스 패드 (Cm7 chord: C, Eb, G, Bb)
        bar = int(t / (spb * 4)) % 4
        notes = [65.41, 77.78, 82.41, 98.00]
        f0 = notes[bar]
        pad = (math.sin(2 * math.pi * f0 * t) * 0.15 + math.sin(2 * math.pi * f0 * 1.5 * t) * 0.08)

        val = int((kick * 0.35 + shaker + pad) * 32767 * 0.18)
        val = max(-32767, min(32767, val))
        data.append(struct.pack("<hh", val, val))

    wav.writeframes(b"".join(data))
    wav.close()

    # 보이스 + BGM 믹싱 (보이스는 선명하게 0dB, BGM은 은은하게 -16dB)
    final_audio = SCRATCH_DIR / "breaker_final_audio.m4a"
    subprocess.run([
        FFMPEG, "-y",
        "-i", str(combined_voice),
        "-i", str(bgm_wav),
        "-filter_complex",
        "[0:a]volume=1.2[v];[1:a]volume=0.25[b];[v][b]amix=inputs=2:duration=first:dropout_transition=2[a]",
        "-map", "[a]",
        "-c:a", "aac", "-b:a", "192k",
        str(final_audio)
    ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print("오디오 믹싱 완료:", final_audio)
    return final_audio


# 프레임 렌더러
class VideoRenderer:
    def __init__(self):
        self.w, self.h = 1080, 1920
        self.p1 = Image.open(PHOTO1_PATH).convert("RGBA")
        self.p2 = Image.open(PHOTO2_PATH).convert("RGBA")
        
        self.f_badge = ImageFont.truetype(FONT_PATH, 34)
        self.f_title = ImageFont.truetype(FONT_PATH, 56)
        self.f_card_h = ImageFont.truetype(FONT_PATH, 42)
        self.f_sub1 = ImageFont.truetype(FONT_PATH, 46)
        self.f_sub2 = ImageFont.truetype(FONT_PATH, 50)
        self.f_small = ImageFont.truetype(FONT_PATH, 30)

        # 미리 상/하단 그라데이션 마스크 생성
        self.grad_mask = Image.new("RGBA", (self.w, self.h), (0, 0, 0, 0))
        gdraw = ImageDraw.Draw(self.grad_mask)
        for y in range(480):
            alpha = int(190 * (1 - y / 480))
            gdraw.line([(0, y), (self.w, y)], fill=(0, 0, 0, alpha))
        for y in range(1250, self.h):
            alpha = int(230 * ((y - 1250) / 670))
            gdraw.line([(0, y), (self.w, y)], fill=(0, 0, 0, alpha))

    def get_bg(self, photo, zoom=1.0, pan_y=0):
        # 줌 및 팬 적용
        pw, ph = photo.size
        crop_w = int(pw / zoom)
        crop_h = int(ph / zoom)
        x0 = (pw - crop_w) // 2
        y0 = max(0, min(ph - crop_h, (ph - crop_h) // 2 + pan_y))
        cropped = photo.crop((x0, y0, x0 + crop_w, y0 + crop_h))
        resized = cropped.resize((self.w, self.h), Image.Resampling.BILINEAR)
        return Image.alpha_composite(resized, self.grad_mask)

    def render_frame(self, t):
        w, h = self.w, self.h

        # 세그먼트 파악
        if t < 10.99:
            # Segment 0: 문제 제기 (0~10.99s)
            seg_t = t
            zoom = 1.0 + 0.05 * (seg_t / 10.99)
            frame = self.get_bg(self.p1, zoom=zoom, pan_y=0)
            draw = ImageDraw.Draw(frame)

            # 상단 뱃지
            draw.rounded_rectangle([(320, 110), (760, 175)], radius=30, fill=(230, 80, 0, 240))
            draw.text((540, 142), "[ 현장 실무 주의보 ]", font=self.f_badge, fill=(255, 255, 255), anchor="mm")

            # 헤드라인
            draw.text((540, 270), "공장 차단기 떨어졌을 때\n절대 바로 올리지 마세요!", font=self.f_title, fill=(255, 255, 255), anchor="mm", align="center", stroke_width=4, stroke_fill=(0, 0, 0))

            # 자막 카드
            draw.rounded_rectangle([(70, 1500), (1010, 1700)], radius=24, fill=(0, 0, 0, 210))
            if seg_t < 5.5:
                draw.text((540, 1565), "공장이나 현장에서 차단기 툭 떨어지면...", font=self.f_sub1, fill=(255, 255, 255), anchor="mm")
                draw.text((540, 1635), "어? 뭐지? 하고 바로 올리시는 분들!", font=self.f_sub2, fill=(255, 220, 0), anchor="mm")
            else:
                draw.text((540, 1565), "여러분, 이거 진짜 위험합니다!", font=self.f_sub2, fill=(255, 80, 80), anchor="mm")
                draw.text((540, 1635), "절대 바로 올리시면 안 됩니다!", font=self.f_sub1, fill=(255, 255, 255), anchor="mm")

        elif t < 24.07:
            # Segment 1: 위험 분석 (10.99~24.07s)
            seg_t = t - 10.99
            zoom = 1.05 + 0.05 * (seg_t / 13.08)
            frame = self.get_bg(self.p1, zoom=zoom, pan_y=int(30 * (seg_t / 13.08)))
            
            # 위험 구간 적색 비네트
            if seg_t > 6.5:
                red_tint = Image.new("RGBA", (w, h), (180, 0, 0, int(25 + 15 * math.sin(seg_t * 6))))
                frame = Image.alpha_composite(frame, red_tint)

            draw = ImageDraw.Draw(frame)

            draw.rounded_rectangle([(340, 110), (740, 175)], radius=30, fill=(210, 30, 30, 240))
            draw.text((540, 142), "[ 차단기 트립의 진실 ]", font=self.f_badge, fill=(255, 255, 255), anchor="mm")

            draw.text((540, 270), "선로 쇼트(단락) or 누전 경고\n무리하게 재투입 시 대폭발!", font=self.f_title, fill=(255, 255, 255), anchor="mm", align="center", stroke_width=4, stroke_fill=(0, 0, 0))

            draw.rounded_rectangle([(70, 1490), (1010, 1710)], radius=24, fill=(0, 0, 0, 215))
            if seg_t < 6.5:
                draw.text((540, 1560), "차단기가 떨어진 건 선로 어딘가에", font=self.f_sub1, fill=(255, 255, 255), anchor="mm")
                draw.text((540, 1635), "누전이나 쇼트가 났다는 신호입니다!", font=self.f_sub2, fill=(255, 220, 0), anchor="mm")
            else:
                draw.text((540, 1560), "원인도 안 찾고 억지로 올리면,", font=self.f_sub1, fill=(255, 255, 255), anchor="mm")
                draw.text((540, 1635), "내부 아크 폭발로 제어반 전체 전소!", font=self.f_sub2, fill=(255, 70, 70), anchor="mm")

        elif t < 41.40:
            # Segment 2: 현장 3대 점검 수칙 (24.07~41.40s)
            seg_t = t - 24.07
            zoom = 1.0 + 0.04 * (seg_t / 17.33)
            frame = self.get_bg(self.p2, zoom=zoom, pan_y=0)
            draw = ImageDraw.Draw(frame)

            draw.rounded_rectangle([(320, 110), (760, 175)], radius=30, fill=(0, 120, 220, 240))
            draw.text((540, 142), "[ 현장 3대 필수 점검 ]", font=self.f_badge, fill=(255, 255, 255), anchor="mm")

            draw.text((540, 270), "차단기 떨어졌을 때\n반드시 지켜야 할 3원칙", font=self.f_title, fill=(255, 255, 255), anchor="mm", align="center", stroke_width=4, stroke_fill=(0, 0, 0))

            draw.rounded_rectangle([(70, 1480), (1010, 1720)], radius=24, fill=(0, 0, 0, 215))
            if seg_t < 4.4:
                draw.text((540, 1555), "차단기 떨어졌을 땐", font=self.f_sub1, fill=(255, 255, 255), anchor="mm")
                draw.text((540, 1635), "딱 세 가지만 먼저 확인하세요!", font=self.f_sub2, fill=(0, 230, 255), anchor="mm")
            elif seg_t < 8.7:
                draw.text((540, 1555), "1. 트립 표시창 색상 확인", font=self.f_sub2, fill=(255, 220, 0), anchor="mm")
                draw.text((540, 1635), "'과부하'인지 '누전'인지 원인 구분", font=self.f_sub1, fill=(255, 255, 255), anchor="mm")
            elif seg_t < 13.0:
                draw.text((540, 1555), "2. 의심 선로 메거(절연저항) 측정", font=self.f_sub2, fill=(0, 230, 255), anchor="mm")
                draw.text((540, 1635), "0.2 MΩ 이하 누전 선로 확실히 색출", font=self.f_sub1, fill=(255, 255, 255), anchor="mm")
            else:
                draw.text((540, 1555), "3. 모터 기동 돌입전류 검증", font=self.f_sub2, fill=(255, 220, 0), anchor="mm")
                draw.text((540, 1635), "기동전류(정격 6배)가 정격 초과하는지 확인", font=self.f_sub1, fill=(255, 255, 255), anchor="mm")

        else:
            # Segment 3: 볼트체크 엔지니어링 솔루션 (41.40~53.38s)
            seg_t = t - 41.40
            zoom = 1.04
            frame = self.get_bg(self.p2, zoom=zoom, pan_y=0)
            draw = ImageDraw.Draw(frame)

            draw.rounded_rectangle([(320, 110), (760, 175)], radius=30, fill=(0, 170, 120, 240))
            draw.text((540, 142), "[ 엔지니어 필수 꿀팁 ]", font=self.f_badge, fill=(255, 255, 255), anchor="mm")

            # 중앙 깔끔한 글래스모피즘 정보 카드
            draw.rounded_rectangle([(120, 320), (960, 880)], radius=30, fill=(15, 25, 45, 235), outline=(0, 210, 255), width=3)
            draw.text((540, 410), "VOLTCHECK (볼트체크)", font=self.f_badge, fill=(0, 220, 255), anchor="mm")
            draw.text((540, 500), "대한민국 1위 엔지니어링 포털", font=self.f_card_h, fill=(255, 255, 255), anchor="mm")
            
            # 3개 특장점 박스
            draw.rounded_rectangle([(180, 570), (900, 645)], radius=16, fill=(25, 40, 70, 220))
            draw.text((540, 607), "⚡ 모터 돌입전류 & 차단기 용량 산출", font=self.f_small, fill=(255, 230, 0), anchor="mm")

            draw.rounded_rectangle([(180, 665), (900, 740)], radius=16, fill=(25, 40, 70, 220))
            draw.text((540, 702), "📐 KEC 전압강하 & 전선 굵기 3초 검증", font=self.f_small, fill=(0, 230, 255), anchor="mm")

            draw.rounded_rectangle([(180, 760), (900, 835)], radius=16, fill=(25, 40, 70, 220))
            draw.text((540, 797), "📱 PC / 스마트폰 회원가입 없이 평생 무료", font=self.f_small, fill=(255, 255, 255), anchor="mm")

            # 하단 자막
            draw.rounded_rectangle([(70, 1500), (1010, 1710)], radius=24, fill=(0, 0, 0, 215))
            if seg_t < 6.0:
                draw.text((540, 1565), "현장에서 모터 용량이나 전선 굵기 계산할 때,", font=self.f_sub1, fill=(255, 255, 255), anchor="mm")
                draw.text((540, 1635), "두꺼운 책 찾는 대신 스마트폰 켜세요!", font=self.f_sub2, fill=(255, 220, 0), anchor="mm")
            else:
                draw.text((540, 1565), "3초 만에 KEC 규격 자동 검증되는", font=self.f_sub1, fill=(255, 255, 255), anchor="mm")
                draw.text((540, 1635), "'볼트체크'로 안전하게 작업합시다!", font=self.f_sub2, fill=(0, 230, 255), anchor="mm")

        # 최하단 진행 표시줄 (Progress Bar)
        progress = min(1.0, max(0.0, t / TOTAL_DURATION))
        prog_w = int(w * progress)
        draw.line([(0, h - 8), (prog_w, h - 8)], fill=(0, 235, 255), width=8)

        return frame.convert("RGB")


def main():
    print("🚀 [첫 게시물] 자연스러운 엔지니어 숏츠 생성 시작...")
    final_audio = prepare_audio()

    renderer = VideoRenderer()

    fps = 30
    total_frames = int(TOTAL_DURATION * fps)
    print(f"🎬 렌더링 시작: 총 {total_frames} 프레임 ({TOTAL_DURATION:.2f}초)")

    cmd = [
        FFMPEG, "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", "1080x1920",
        "-pix_fmt", "rgb24",
        "-r", str(fps),
        "-i", "-",
        "-i", str(final_audio),
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "22",
        "-pix_fmt", "yuv420p",
        "-c:a", "copy",
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
            print(f"   진행률: {pct}% ({i+1}/{total_frames})", flush=True)

    pipe.stdin.close()
    pipe.wait()

    size_mb = OUTPUT_MP4.stat().st_size / (1024 * 1024)
    print(f"🎉 렌더링 완성: {OUTPUT_MP4} ({size_mb:.1f} MB)")


if __name__ == "__main__":
    main()
