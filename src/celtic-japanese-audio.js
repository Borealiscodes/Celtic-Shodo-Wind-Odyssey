/**
 * src/celtic-japanese-audio.js — Mute-by-Default Hybrid Irish & Japanese Folk Synthesizer (Ledger 2)
 * Uses the shared D–E–G–A–B pentatonic bridge (293.66..493.88 Hz) to layer:
 *   Layer 1: Irish Low Whistle & Japanese Shakuhachi Flute call-and-response
 *   Layer 2: Celtic Lever Harp & Japanese Koto arpeggio plucks
 *   Layer 3: Bodhrán Frame Drum & Taiko heartbeat pulse
 *   Layer 4: Uilleann Drone & Bonshō Temple Bell overtones
 *
 * Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>
 */

import { SHARED_D_YO_SCALE_HZ } from "./lore-and-scales.js";

export function createCelticJapaneseAudio() {
  let muted = true;
  let ctx = null;
  let timer = null;
  let beat = 0;
  let layers = 1;

  const ensureCtx = () => {
    if (!ctx && typeof window !== "undefined") {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (Ctor) ctx = new Ctor();
    }
    if (ctx && ctx.state === "suspended") ctx.resume();
    return ctx;
  };

  const playVoice = (freq, type, peak, attack, decay, cutoff = 1100) => {
    const ac = ensureCtx();
    if (!ac || muted) return;

    const now = ac.currentTime;
    const osc = ac.createOscillator();
    const filter = ac.createBiquadFilter();
    const gain = ac.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(cutoff, now);
    filter.frequency.exponentialRampToValueAtTime(240, now + decay);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(peak, now + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ac.destination);

    osc.start(now);
    osc.stop(now + decay + 0.05);
  };

  const stepEnsemble = () => {
    if (!muted) {
      const note = SHARED_D_YO_SCALE_HZ.at(beat % SHARED_D_YO_SCALE_HZ.length);

      // Layer 1: Irish Low Whistle (even phrases) + Shakuhachi Flute (odd phrases)
      if (layers >= 1 && beat % 3 === 0) {
        const isWhistle = Math.floor(beat / 3) % 2 === 0;
        playVoice(note * (isWhistle ? 2 : 1), "sine", 0.042, isWhistle ? 0.06 : 0.22, 1.4, 980);
      }

      // Layer 2: Celtic Lever Harp & Japanese Koto interlocking plucks
      if (layers >= 2) {
        const harpNote = SHARED_D_YO_SCALE_HZ.at((beat * 2) % SHARED_D_YO_SCALE_HZ.length);
        playVoice(harpNote, "triangle", 0.036, 0.01, 0.65, 1450);
      }

      // Layer 3: Bodhrán & Taiko 6/8 jig-festival heartbeat (beats 0, 3, 5)
      if (layers >= 3 && (beat % 6 === 0 || beat % 6 === 3 || beat % 6 === 5)) {
        playVoice(beat % 6 === 0 ? 73.42 : 110.0, "sine", 0.065, 0.012, 0.42, 240);
      }

      // Layer 4: Uilleann D3 Drone + Bonshō Temple Bell chime (every 12 beats)
      if (layers >= 4 && beat % 12 === 0) {
        playVoice(146.83, "sine", 0.035, 0.35, 3.8, 420); // D3 Uilleann drone
        playVoice(587.33, "sine", 0.03, 0.015, 2.4, 1600); // D5 Bonshō bell
      }
    }
    beat++;
  };

  return {
    isMuted: () => muted,
    setLayers: (n) => {
      layers = Math.max(1, Math.min(4, n | 0));
    },
    toggleMute: () => {
      muted = !muted;
      if (!muted) {
        ensureCtx();
        if (!timer && typeof window !== "undefined") {
          timer = window.setInterval(stepEnsemble, 360);
        }
        stepEnsemble();
      }
      return muted;
    },
    playGlyphMiracle: () => {
      if (muted) return;
      SHARED_D_YO_SCALE_HZ.forEach((f, idx) => {
        setTimeout(() => playVoice(f * 2, "sine", 0.045, 0.015, 1.2, 1700), idx * 55);
      });
    },
  };
}
