# -*- coding: utf-8 -*-
"""
=============================================================================
🔊 [LAB FOLEY SYNTHESIZER] Tactile Physical Sound Effects for Zero-AI Feel
=============================================================================
Synthesizes ultra-realistic test workbench sounds:
1. probe_tap.wav: Crisp multimeter probe metal-on-metal micro-contact
2. rotary_switch.wav: Heavy Fluke-style selector knob detent clack
3. relay_clack.wav: Industrial 24V DPDT electromagnetic contactor latch
4. flir_shutter.wav: Thermal camera NUC shutter solenoid double-click
5. ultrasound_hiss.wav: Fluid cavitation micro-bubble burst hiss
6. scope_beep.wav: Classic digital storage oscilloscope confirmation beep
=============================================================================
"""

import math
import wave
import numpy as np
from pathlib import Path

SCRATCH = Path(r"C:\Users\jiwan\.gemini\antigravity\brain\383c856a-190f-4e51-a071-50d194e1c260\scratch")
SCRATCH.mkdir(parents=True, exist_ok=True)
SR = 44100


def save_stereo_wav(filepath, data):
    # Ensure float32 normalized between -1.0 and 1.0
    data = np.clip(data, -0.98, 0.98)
    if data.ndim == 1:
        data = np.column_stack([data, data])
    int_data = (data * 32767).astype(np.int16)
    with wave.open(str(filepath), "w") as f:
        f.setnchannels(2)
        f.setsampwidth(2)
        f.setframerate(SR)
        f.writeframes(int_data.tobytes())
    print(f"Generated Foley: {filepath.name} ({len(data)/SR:.2f}s)")


# 1. Probe Metal Tap (Crisp metallic contact with micro-rebound)
def gen_probe_tap():
    dur = 0.15
    t = np.linspace(0, dur, int(SR * dur), endpoint=False)
    sig = np.zeros_like(t)
    # Primary tap
    env1 = np.exp(-t / 0.008)
    sig += (np.sin(2 * np.pi * 3800 * t) * 0.6 + np.sin(2 * np.pi * 6200 * t) * 0.4) * env1
    # Micro rebound at 14ms
    idx_reb = int(SR * 0.014)
    t_reb = t[idx_reb:] - 0.014
    env2 = np.exp(-t_reb / 0.005) * 0.35
    sig[idx_reb:] += (np.sin(2 * np.pi * 4200 * t_reb) * 0.7 + np.sin(2 * np.pi * 7100 * t_reb) * 0.3) * env2
    return sig


# 2. Rotary Switch Detent Clack (Heavy mechanical click)
def gen_rotary_switch():
    dur = 0.20
    t = np.linspace(0, dur, int(SR * dur), endpoint=False)
    sig = np.zeros_like(t)
    # Body resonance (thump)
    env_thump = np.exp(-t / 0.025)
    sig += np.sin(2 * np.pi * 480 * (1 - t * 2) * t) * 0.7 * env_thump
    # Plastic/metal ratchet snap
    env_snap = np.exp(-t / 0.006)
    sig += (np.sin(2 * np.pi * 2600 * t) * 0.5 + np.random.normal(0, 0.2, len(t))) * env_snap
    # Secondary follower latch at 22ms
    idx2 = int(SR * 0.022)
    t2 = t[idx2:] - 0.022
    env2 = np.exp(-t2 / 0.012) * 0.5
    sig[idx2:] += (np.sin(2 * np.pi * 1400 * t2) * 0.6 + np.sin(2 * np.pi * 3100 * t2) * 0.4) * env2
    return sig


# 3. 24V Relay Clack (Electromagnetic armature pull & contact slap)
def gen_relay_clack():
    dur = 0.25
    t = np.linspace(0, dur, int(SR * dur), endpoint=False)
    sig = np.zeros_like(t)
    # Armature acceleration thump
    env1 = np.exp(-t / 0.015)
    sig += np.sin(2 * np.pi * 320 * t) * 0.5 * env1
    # Contact leaf snap at 18ms
    idx_snap = int(SR * 0.018)
    t_snap = t[idx_snap:] - 0.018
    env_snap = np.exp(-t_snap / 0.008) * 0.85
    sig[idx_snap:] += (np.sin(2 * np.pi * 3500 * t_snap) * 0.6 + np.sin(2 * np.pi * 1800 * t_snap) * 0.4) * env_snap
    # Contact bounce at 31ms
    idx_bnc = int(SR * 0.031)
    t_bnc = t[idx_bnc:] - 0.031
    env_bnc = np.exp(-t_bnc / 0.005) * 0.3
    sig[idx_bnc:] += np.sin(2 * np.pi * 4000 * t_bnc) * env_bnc
    return sig


# 4. FLIR Thermal Shutter Click (Dual micro-solenoid actuation)
def gen_flir_shutter():
    dur = 0.35
    t = np.linspace(0, dur, int(SR * dur), endpoint=False)
    sig = np.zeros_like(t)
    # Shutter close click
    env1 = np.exp(-t / 0.010)
    sig += (np.sin(2 * np.pi * 2100 * t) * 0.6 + np.sin(2 * np.pi * 1200 * t) * 0.4) * env1
    # Shutter open click at 140ms
    idx2 = int(SR * 0.140)
    t2 = t[idx2:] - 0.140
    env2 = np.exp(-t2 / 0.009) * 0.8
    sig[idx2:] += (np.sin(2 * np.pi * 2400 * t2) * 0.6 + np.sin(2 * np.pi * 1500 * t2) * 0.4) * env2
    return sig


# 5. Cavitation Ultrasound Hiss (Stochastic micro-bubble implosion)
def gen_ultrasound_hiss():
    dur = 1.2
    t = np.linspace(0, dur, int(SR * dur), endpoint=False)
    # Bandpass filtered noise
    noise = np.random.normal(0, 0.4, len(t))
    # Modulate with acoustic surging
    surge = (np.sin(2 * np.pi * 8.5 * t) * 0.3 + 0.7)
    # High frequency bubble pops
    carrier = np.sin(2 * np.pi * 5800 * t) * 0.25 + np.sin(2 * np.pi * 8400 * t) * 0.2
    sig = (noise * 0.7 + carrier * 0.3) * surge
    # Smooth envelope
    env = np.sin(np.pi * t / dur) ** 0.5
    return sig * env * 0.7


# 6. Oscilloscope Confirmation Beep
def gen_scope_beep():
    dur = 0.08
    t = np.linspace(0, dur, int(SR * dur), endpoint=False)
    sig = np.sin(2 * np.pi * 2400 * t) * 0.5
    # Smooth trapezoid envelope
    fade = int(SR * 0.01)
    env = np.ones_like(t)
    env[:fade] = np.linspace(0, 1, fade)
    env[-fade:] = np.linspace(1, 0, fade)
    return sig * env


def main():
    save_stereo_wav(SCRATCH / "foley_probe_tap.wav", gen_probe_tap())
    save_stereo_wav(SCRATCH / "foley_rotary_switch.wav", gen_rotary_switch())
    save_stereo_wav(SCRATCH / "foley_relay_clack.wav", gen_relay_clack())
    save_stereo_wav(SCRATCH / "foley_flir_shutter.wav", gen_flir_shutter())
    save_stereo_wav(SCRATCH / "foley_ultrasound_hiss.wav", gen_ultrasound_hiss())
    save_stereo_wav(SCRATCH / "foley_scope_beep.wav", gen_scope_beep())
    print("\n✅ All 6 tactile lab foley sound effects successfully synthesized!")


if __name__ == "__main__":
    main()
