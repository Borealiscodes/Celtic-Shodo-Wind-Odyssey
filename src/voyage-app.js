/**
 * src/voyage-app.js — Wind Waker Archipelago Sailing & Celestial Brush Controller
 *
 * Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>
 */

import { toQ16, fromQ16 } from "./core.js";
import {
  SEA_W,
  SEA_H,
  createVoyageState,
  setVoyageMode,
  beginCelestialStroke,
  extendCelestialStroke,
  endCelestialStroke,
  stepVoyageFrame,
  buildVoyageReceipt,
} from "./wind-voyage-kernel.js";
import { createCelticJapaneseAudio } from "./celtic-japanese-audio.js";
import { renderSeaChart } from "./sea-chart-renderer.js";

const FIXED_DT_MS = 1000 / 60;

function initWindOdyssey() {
  const canvas = document.getElementById("sea-canvas");
  const ctx = canvas ? canvas.getContext("2d") : null;
  const audio = createCelticJapaneseAudio();

  const shrineNameEl = document.getElementById("shrine-name");
  const shrinePromptEl = document.getElementById("shrine-prompt");
  const shrineLessonEl = document.getElementById("shrine-lesson");
  const ensembleBadgeEl = document.getElementById("hud-ensemble");
  const modeBtn = document.getElementById("btn-mode");
  const audioBtn = document.getElementById("btn-audio");
  const receiptBox = document.getElementById("receipt-output");

  let state = createVoyageState();
  let sailTarget = null;
  const keys = new Set();

  const syncHud = () => {
    const shrine = state.shrines.find((s) => s.id === state.activeShrineId) || state.shrines.at(0);
    if (shrineNameEl) {
      shrineNameEl.textContent = `${shrine.name} ${shrine.awakened ? "✅ (Awakened)" : ""}`;
    }
    if (shrinePromptEl) {
      shrinePromptEl.textContent = `${shrine.brushPrompt} • ${shrine.folkUnlock}`;
    }
    if (shrineLessonEl) {
      shrineLessonEl.textContent = shrine.lesson;
    }
    if (ensembleBadgeEl) {
      ensembleBadgeEl.textContent = `Folk Ensemble: ${state.unlockedEnsembleLayers} / 4 Layers`;
    }
    if (modeBtn) {
      modeBtn.textContent =
        state.mode === "BRUSH" ? "🖌️ Mode: Celestial Brush (Tap to Sail)" : "⛵ Mode: Sailing (Tap for Brush)";
    }
    audio.setLayers(state.unlockedEnsembleLayers);
  };

  syncHud();

  const toCanvasCoords = (ev) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((ev.clientX - rect.left) / rect.width) * SEA_W,
      y: ((ev.clientY - rect.top) / rect.height) * SEA_H,
    };
  };

  canvas?.addEventListener("pointerdown", (ev) => {
    ev.preventDefault();
    canvas.setPointerCapture?.(ev.pointerId);
    const { x, y } = toCanvasCoords(ev);

    if (state.mode === "BRUSH") {
      state = beginCelestialStroke(state, x, y);
    } else {
      sailTarget = { x, y };
    }
  });

  canvas?.addEventListener("pointermove", (ev) => {
    const { x, y } = toCanvasCoords(ev);
    if (state.mode === "BRUSH") {
      state = extendCelestialStroke(state, x, y);
    } else if (sailTarget) {
      sailTarget = { x, y };
    }
  });

  const handlePointerEnd = () => {
    if (state.mode === "BRUSH" && state.currentStroke) {
      const prevLayers = state.unlockedEnsembleLayers;
      state = endCelestialStroke(state);
      if (state.lastGlyphDetected !== "NONE" || state.unlockedEnsembleLayers > prevLayers) {
        audio.playGlyphMiracle();
      }
      syncHud();
    }
    sailTarget = null;
  };

  canvas?.addEventListener("pointerup", handlePointerEnd);
  canvas?.addEventListener("pointercancel", handlePointerEnd);

  modeBtn?.addEventListener("click", () => {
    state = setVoyageMode(state, state.mode === "SAIL" ? "BRUSH" : "SAIL");
    syncHud();
  });

  document.getElementById("btn-clear-brush")?.addEventListener("click", () => {
    state = { ...state, activeStrokes: [], currentStroke: null };
  });

  window.addEventListener("keydown", (ev) => {
    keys.add(ev.key.toLowerCase());
    if (ev.key === " ") {
      ev.preventDefault();
      state = setVoyageMode(state, state.mode === "SAIL" ? "BRUSH" : "SAIL");
      syncHud();
    }
  });

  window.addEventListener("keyup", (ev) => {
    keys.delete(ev.key.toLowerCase());
  });

  audioBtn?.addEventListener("click", () => {
    const muted = audio.toggleMute();
    audioBtn.textContent = muted ? "Sound: Muted" : "Sound: Irish-Japanese Folk (On)";
  });

  document.getElementById("btn-receipt")?.addEventListener("click", () => {
    const receipt = buildVoyageReceipt(state);
    if (receiptBox) receiptBox.value = JSON.stringify(receipt, null, 2);
  });

  let lastTime = performance.now();
  let accumulator = 0;

  function loop(now) {
    accumulator += Math.min(100, now - lastTime);
    lastTime = now;

    while (accumulator >= FIXED_DT_MS) {
      let sx = 0;
      let sy = 0;

      if (keys.has("arrowleft") || keys.has("a")) sx -= 320;
      if (keys.has("arrowright") || keys.has("d")) sx += 320;
      if (keys.has("arrowup") || keys.has("w")) sy -= 320;
      if (keys.has("arrowdown") || keys.has("s")) sy += 320;

      if (sailTarget && state.mode === "SAIL") {
        const dx = sailTarget.x - fromQ16(state.boat.xQ16);
        const dy = sailTarget.y - fromQ16(state.boat.yQ16);
        sx += Math.max(-360, Math.min(360, dx * 3.5));
        sy += Math.max(-360, Math.min(360, dy * 3.5));
      }

      state = stepVoyageFrame(state, toQ16(sx), toQ16(sy));
      accumulator -= FIXED_DT_MS;
    }

    syncHud();
    if (ctx) renderSeaChart(ctx, state);
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

window.addEventListener("DOMContentLoaded", initWindOdyssey);
