# -*- coding: utf-8 -*-
"""
=============================================================================
🎬 [PRO ULTRA] 공장 차단기 트립 안전 수칙 고도화 숏츠 생성기
=============================================================================
- 고화질 실사 다큐멘터리 사진 기반
- 12개 전문 사운드 이펙트(SFX: 후쉬, 경보 비프, 시네마틱 임팩트, 아크 스파크, 팝)
- 다이내믹 시각 효과:
  * 트립 표시등 펄스 타겟 서클 및 포인터 콜아웃
  * 아크 폭발 시 적색 플래시 & 카메라 셰이크(흔들림) 효과
  * 단계별 활성화되는 스마트 점검 체크리스트
  * 볼트체크 글래스모피즘 브랜딩 카드
  * 실시간 프로그레스 바
- 유튜브 알고리즘 체류시간(Retention) 극대화 설계
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
FONT_PATH = r"C:\Windows\Fonts\malgunbd.ttf"

PHOTO1_PATH = r"C:\Users\jiwan\.gemini\antigravity\brain\383c856a-190f-4e51-a071-50d194e1c260\breaker_panel_photo_1788596780742.jpg"
PHOTO2_PATH = r"C:\Users\jiwan\.gemini\antigravity\brain\383c856a-190f-4e51-a071-50d194e1c260\multimeter_inspection_1788596797684.jpg"

OUTPUT_MP4 = BASE_DIR / "shorts_pro_breaker_safety.mp4"

# 오디오 마스터링 (보이스 + BGM + 12개 SFX 동기화)
def prepare_pro_audio():
    print("🎵 고도화 사운드트랙 마스터링 시작 (보이스 + BGM + SFX)...")
    
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

    sr, voice = load_wav(SCRATCH_DIR / "voice.wav")
    sr_bgm, bgm = load_wav(SCRATCH_DIR / "breaker_ambient_bgm.wav")

    n_samples = len(voice)
    master = np.zeros((n_samples, 2), dtype=np.float32)

    # 1. 보이스 (선명도 및 볼륨 강화)
    master += voice * 1.35

    # 2. 앰비언트 BGM (적절한 배경 레벨)
    bgm_trimmed = bgm[:n_samples] if len(bgm) >= n_samples else np.pad(bgm, ((0, n_samples - len(bgm)), (0, 0)))
    master += bgm_trimmed * 0.20

    # 3. SFX 정밀 동기화 레이어
    sfx_events = [
        ("sfx_whoosh.wav", 0.00, 0.65),      # 시작 전환 후쉬
        ("sfx_alert.wav", 0.15, 0.50),       # 긴급 경보 비프음
        ("sfx_impact.wav", 5.40, 0.75),      # '진짜 위험합니다' 시네마틱 임팩트
        ("sfx_whoosh.wav", 10.99, 0.65),     # 씬 2 전환
        ("sfx_spark.wav", 17.40, 0.70),      # '아크 폭발' 스파크 전기음
        ("sfx_impact.wav", 17.55, 0.60),     # '폭발' 서브 쿵 소리
        ("sfx_whoosh.wav", 24.07, 0.65),     # 씬 3 전환
        ("sfx_pop.wav", 28.50, 0.75),        # 1단계 체크 팝
        ("sfx_pop.wav", 32.80, 0.75),        # 2단계 체크 팝
        ("sfx_pop.wav", 37.00, 0.75),        # 3단계 체크 팝
        ("sfx_whoosh.wav", 41.40, 0.65),     # 씬 4 솔루션 전환
        ("sfx_pop.wav", 47.00, 0.65),        # 볼트체크 하이라이트 팝
    ]

    for sfx_name, start_t, vol in sfx_events:
        _, sfx_data = load_wav(SCRATCH_DIR / sfx_name)
        start_idx = int(start_t * sr)
        end_idx = min(start_idx + len(sfx_data), n_samples)
        actual_len = end_idx - start_idx
        if actual_len > 0:
            master[start_idx:end_idx] += sfx_data[:actual_len] * vol

    # 소프트 리미터 & 마스터링
    master = np.tanh(master * 0.92)

    master_wav = SCRATCH_DIR / "master_audio_pro_final.wav"
    with wave.open(str(master_wav), "w") as f:
        f.setnchannels(2)
        f.setsampwidth(2)
        f.setframerate(sr)
        f.writeframes((master * 32767).astype(np.int16).tobytes())

    print(f"✅ 오디오 마스터링 완료: {master_wav} ({len(master)/sr:.2f}초)")
    return master_wav, len(master) / sr


class ProVideoRenderer:
    def __init__(self, total_duration):
        self.w, self.h = 1080, 1920
        self.total_duration = total_duration

        self.p1 = Image.open(PHOTO1_PATH).convert("RGBA")
        self.p2 = Image.open(PHOTO2_PATH).convert("RGBA")

        self.f_badge = ImageFont.truetype(FONT_PATH, 34)
        self.f_title = ImageFont.truetype(FONT_PATH, 58)
        self.f_title_sub = ImageFont.truetype(FONT_PATH, 42)
        self.f_card_h = ImageFont.truetype(FONT_PATH, 42)
        self.f_sub1 = ImageFont.truetype(FONT_PATH, 46)
        self.f_sub2 = ImageFont.truetype(FONT_PATH, 52)
        self.f_small = ImageFont.truetype(FONT_PATH, 32)
        self.f_callout = ImageFont.truetype(FONT_PATH, 28)

        # 상단/하단 다크 그라데이션 마스크
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
        # SCENE 1: 문제 제기 & 현장 긴급 주의보 (0.00s ~ 10.99s)
        # -----------------------------------------------------------------
        if t < 10.99:
            seg_t = t
            zoom = 1.0 + 0.05 * (seg_t / 10.99)
            frame = self.get_bg(self.p1, zoom=zoom, pan_y=0)
            draw = ImageDraw.Draw(frame)

            # 상단 경보 뱃지
            draw.rounded_rectangle([(270, 110), (810, 175)], radius=30, fill=(235, 75, 0, 245), outline=(255, 170, 0), width=2)
            draw.text((540, 142), "[ ⚠️ 현장 긴급 실무 주의보 ]", font=self.f_badge, fill=(255, 255, 255), anchor="mm")

            # 헤드라인
            draw.text((540, 270), "공장 차단기 떨어졌을 때\n절대 바로 올리지 마세요!", font=self.f_title, fill=(255, 255, 255), anchor="mm", align="center", stroke_width=4, stroke_fill=(0, 0, 0))

            # 다이내믹 트립 표시등 타겟 서클 & 포인터 콜아웃 (실제 주황색 트립 램프 위치: 372, 1010)
            cx, cy = 372, 1010
            pulse_r = int(42 + 6 * math.sin(t * 8))
            draw.ellipse([(cx - pulse_r, cy - pulse_r), (cx + pulse_r, cy + pulse_r)], outline=(255, 50, 0, 255), width=5)
            draw.ellipse([(cx - pulse_r - 12, cy - pulse_r - 12), (cx + pulse_r + 12, cy + pulse_r + 12)], outline=(255, 210, 0, 180), width=2)
            # 포인터 라인 및 콜아웃 박스
            draw.line([(cx + pulse_r + 5, cy), (cx + pulse_r + 75, cy - 45)], fill=(255, 220, 0, 255), width=3)
            draw.rounded_rectangle([(cx + pulse_r + 75, cy - 75), (cx + pulse_r + 370, cy - 15)], radius=16, fill=(15, 20, 35, 235), outline=(255, 210, 0), width=2)
            draw.text((cx + pulse_r + 222, cy - 45), "⚡ [TRIP: 과부하/누전]", font=self.f_callout, fill=(255, 230, 0), anchor="mm")

            # 하단 다이내믹 자막 카드 (바운스 효과 적용)
            draw.rounded_rectangle([(70, 1500), (1010, 1710)], radius=24, fill=(0, 0, 0, 215), outline=(255, 140, 0), width=2)
            if seg_t < 5.5:
                draw.text((540, 1565), "공장이나 현장에서 차단기 툭 떨어지면...", font=self.f_sub1, fill=(255, 255, 255), anchor="mm")
                draw.text((540, 1640), "어? 뭐지? 하고 바로 올리시는 분들!", font=self.f_sub2, fill=(255, 220, 0), anchor="mm")
            else:
                draw.text((540, 1565), "여러분, 이거 진짜 위험합니다!", font=self.f_sub2, fill=(255, 75, 75), anchor="mm")
                draw.text((540, 1640), "절대 바로 올리시면 안 됩니다!", font=self.f_sub1, fill=(255, 255, 255), anchor="mm")

        # -----------------------------------------------------------------
        # SCENE 2: 위험 분석 & 아크 폭발 경고 (10.99s ~ 24.07s)
        # -----------------------------------------------------------------
        elif t < 24.07:
            seg_t = t - 10.99
            zoom = 1.06 + 0.05 * (seg_t / 13.08)

            # 아크 폭발 순간 (17.3s ~ 18.2s): 카메라 셰이크(흔들림) 및 적색 섬광
            shake_x, shake_y = 0, 0
            is_exploding = 6.4 <= seg_t <= 7.3
            if is_exploding:
                shake_x = int(random.uniform(-10, 10))
                shake_y = int(random.uniform(-10, 10))

            frame = self.get_bg(self.p1, zoom=zoom, pan_x=shake_x, pan_y=int(30 * (seg_t / 13.08)) + shake_y)

            if is_exploding:
                flash_alpha = int(70 + 40 * math.sin(seg_t * 25))
                red_flash = Image.new("RGBA", (w, h), (255, 20, 20, flash_alpha))
                frame = Image.alpha_composite(frame, red_flash)

            draw = ImageDraw.Draw(frame)

            draw.rounded_rectangle([(300, 110), (780, 175)], radius=30, fill=(220, 25, 25, 245), outline=(255, 100, 100), width=2)
            draw.text((540, 142), "[ 💥 대형 사고 원인 분석 ]", font=self.f_badge, fill=(255, 255, 255), anchor="mm")

            draw.text((540, 270), "선로 쇼트(단락) or 누전 경고\n무리하게 재투입 시 대폭발!", font=self.f_title, fill=(255, 255, 255), anchor="mm", align="center", stroke_width=4, stroke_fill=(0, 0, 0))

            draw.rounded_rectangle([(70, 1490), (1010, 1715)], radius=24, fill=(0, 0, 0, 220), outline=(230, 40, 40), width=2)
            if seg_t < 6.4:
                draw.text((540, 1560), "차단기가 떨어진 건 선로 어딘가에", font=self.f_sub1, fill=(255, 255, 255), anchor="mm")
                draw.text((540, 1640), "누전이나 쇼트가 났다는 신호입니다!", font=self.f_sub2, fill=(255, 220, 0), anchor="mm")
            else:
                draw.text((540, 1560), "원인도 안 찾고 억지로 올리면,", font=self.f_sub1, fill=(255, 255, 255), anchor="mm")
                draw.text((540, 1640), "내부 아크 폭발로 제어반 전체 전소!", font=self.f_sub2, fill=(255, 60, 60), anchor="mm")

        # -----------------------------------------------------------------
        # SCENE 3: 현장 3대 점검 수칙 & 스마트 체크리스트 (24.07s ~ 41.40s)
        # -----------------------------------------------------------------
        elif t < 41.40:
            seg_t = t - 24.07
            zoom = 1.0 + 0.04 * (seg_t / 17.33)
            frame = self.get_bg(self.p2, zoom=zoom, pan_y=0)
            draw = ImageDraw.Draw(frame)

            draw.rounded_rectangle([(280, 110), (800, 175)], radius=30, fill=(0, 125, 230, 245), outline=(0, 215, 255), width=2)
            draw.text((540, 142), "[ ⚡ 현장 3대 필수 점검 수칙 ]", font=self.f_badge, fill=(255, 255, 255), anchor="mm")

            draw.text((540, 270), "차단기 떨어졌을 때\n반드시 지켜야 할 3원칙", font=self.f_title, fill=(255, 255, 255), anchor="mm", align="center", stroke_width=4, stroke_fill=(0, 0, 0))

            # 중앙 인터랙티브 체크리스트 카드 박스
            # Step 1: 4.4s ~ | Step 2: 8.7s ~ | Step 3: 13.0s ~
            checklist = [
                ("1. 트립 표시창 색상 확인 (누전 vs 과부하)", seg_t >= 4.4, (255, 220, 0)),
                ("2. 의심 선로 절연저항계(메거) 측정", seg_t >= 8.7, (0, 230, 255)),
                ("3. 모터 기동 돌입전류(6배) 정격 확인", seg_t >= 13.0, (100, 255, 120))
            ]

            card_y_start = 380
            for idx, (label, is_active, color) in enumerate(checklist):
                cy = card_y_start + idx * 105
                bg_col = (15, 30, 55, 240) if is_active else (10, 15, 25, 190)
                border_col = color if is_active else (80, 95, 120, 150)
                draw.rounded_rectangle([(100, cy), (980, cy + 85)], radius=18, fill=bg_col, outline=border_col, width=3 if is_active else 1)

                icon = "[ ✓ ]" if is_active else "[   ]"
                icon_col = color if is_active else (140, 150, 170)
                draw.text((140, cy + 42), icon, font=self.f_card_h, fill=icon_col, anchor="lm")
                draw.text((230, cy + 42), label, font=self.f_small, fill=(255, 255, 255) if is_active else (160, 170, 185), anchor="lm")

            # 하단 자막
            draw.rounded_rectangle([(70, 1480), (1010, 1720)], radius=24, fill=(0, 0, 0, 220), outline=(0, 180, 255), width=2)
            if seg_t < 4.4:
                draw.text((540, 1555), "차단기 떨어졌을 땐", font=self.f_sub1, fill=(255, 255, 255), anchor="mm")
                draw.text((540, 1640), "딱 세 가지만 먼저 확인하세요!", font=self.f_sub2, fill=(0, 230, 255), anchor="mm")
            elif seg_t < 8.7:
                draw.text((540, 1555), "1. 트립 표시창 색상 확인", font=self.f_sub2, fill=(255, 220, 0), anchor="mm")
                draw.text((540, 1640), "'과부하'인지 '누전'인지 원인 구분", font=self.f_sub1, fill=(255, 255, 255), anchor="mm")
            elif seg_t < 13.0:
                draw.text((540, 1555), "2. 의심 선로 메거(절연저항) 측정", font=self.f_sub2, fill=(0, 230, 255), anchor="mm")
                draw.text((540, 1640), "0.2 MΩ 이하 누전 선로 확실히 색출", font=self.f_sub1, fill=(255, 255, 255), anchor="mm")
            else:
                draw.text((540, 1555), "3. 모터 기동 돌입전류 검증", font=self.f_sub2, fill=(100, 255, 120), anchor="mm")
                draw.text((540, 1640), "기동전류(정격 6배)가 정격 초과하는지 확인", font=self.f_sub1, fill=(255, 255, 255), anchor="mm")

        # -----------------------------------------------------------------
        # SCENE 4: 볼트체크 엔지니어링 솔루션 & CTA (41.40s ~ 53.38s)
        # -----------------------------------------------------------------
        else:
            seg_t = t - 41.40
            zoom = 1.04
            frame = self.get_bg(self.p2, zoom=zoom, pan_y=0)
            draw = ImageDraw.Draw(frame)

            draw.rounded_rectangle([(300, 110), (780, 175)], radius=30, fill=(0, 165, 115, 245), outline=(0, 255, 170), width=2)
            draw.text((540, 142), "[ 🚀 엔지니어 필수 치트키 ]", font=self.f_badge, fill=(255, 255, 255), anchor="mm")

            # 중앙 볼트체크 프리미엄 글래스모피즘 카드
            draw.rounded_rectangle([(100, 310), (980, 890)], radius=32, fill=(12, 22, 42, 245), outline=(0, 220, 255), width=3)
            
            # 글로시 하이라이트 라인
            shimmer_x = int(120 + ((seg_t * 220) % 800))
            draw.line([(shimmer_x, 320), (shimmer_x + 60, 320)], fill=(255, 255, 255, 180), width=4)

            draw.text((540, 395), "VOLTCHECK (볼트체크)", font=self.f_badge, fill=(0, 230, 255), anchor="mm")
            draw.text((540, 480), "대한민국 1위 엔지니어링 포털", font=self.f_title_sub, fill=(255, 255, 255), anchor="mm")

            # 3개 특장점 박스
            features = [
                ("⚡ 모터 돌입전류 & 기동 차단기 규격 산출", (255, 225, 0)),
                ("📐 KEC 전압강하 & 허용전류 3초 자동 검증", (0, 230, 255)),
                ("📱 스마트폰 / PC 회원가입 없이 평생 무료", (100, 255, 130))
            ]

            for f_idx, (text, f_color) in enumerate(features):
                box_y = 560 + f_idx * 95
                draw.rounded_rectangle([(150, box_y), (930, box_y + 75)], radius=16, fill=(22, 38, 68, 230), outline=(0, 160, 220), width=1)
                draw.text((540, box_y + 37), text, font=self.f_small, fill=f_color, anchor="mm")

            # 하단 자막
            draw.rounded_rectangle([(70, 1500), (1010, 1715)], radius=24, fill=(0, 0, 0, 220), outline=(0, 230, 255), width=2)
            if seg_t < 6.0:
                draw.text((540, 1565), "현장에서 모터 용량이나 전선 굵기 계산할 때,", font=self.f_sub1, fill=(255, 255, 255), anchor="mm")
                draw.text((540, 1640), "두꺼운 책 찾는 대신 스마트폰 켜세요!", font=self.f_sub2, fill=(255, 220, 0), anchor="mm")
            else:
                draw.text((540, 1565), "3초 만에 KEC 규격 자동 검증되는", font=self.f_sub1, fill=(255, 255, 255), anchor="mm")
                draw.text((540, 1640), "'볼트체크'로 안전하게 작업합시다!", font=self.f_sub2, fill=(0, 230, 255), anchor="mm")

        # 최하단 네온 프로그레스 바
        prog = min(1.0, max(0.0, t / self.total_duration))
        prog_w = int(w * prog)
        draw.line([(0, h - 8), (prog_w, h - 8)], fill=(0, 240, 255), width=8)

        return frame.convert("RGB")


def main():
    print("🚀 [고도화 숏츠] 마스터링 및 렌더링 파이프라인 시작...")
    master_audio, duration = prepare_pro_audio()

    renderer = ProVideoRenderer(duration)

    fps = 30
    total_frames = int(duration * fps)
    print(f"🎬 Full HD 렌더링 시작: 총 {total_frames} 프레임 ({duration:.2f}초 @ 30fps)")

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
            print(f"   렌더링 진행률: {pct}% ({i+1}/{total_frames})", flush=True)

    pipe.stdin.close()
    pipe.wait()

    size_mb = OUTPUT_MP4.stat().st_size / (1024 * 1024)
    print(f"🎉 고도화 숏츠 렌더링 완료: {OUTPUT_MP4} ({size_mb:.1f} MB)")


if __name__ == "__main__":
    main()
