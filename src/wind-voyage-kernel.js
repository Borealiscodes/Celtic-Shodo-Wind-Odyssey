/**
 * src/wind-voyage-kernel.js — Wind Waker Boat Steering, Calligraphy Wake & 4 Celestial Brush Recognizers (Ledger 1)
 *
 * Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>
 */

import { toQ16, fromQ16, qAdd, qSub, qMul, sha256Hex } from "./core.js";
import { ARCHIPELAGO_SHRINES } from "./lore-and-scales.js";

export const SEA_W = 680;
export const SEA_H = 460;

export function createVoyageState() {
  return {
    tick: 0,
    mode: "SAIL", // "SAIL" | "BRUSH"
    boat: {
      xQ16: toQ16(340),
      yQ16: toQ16(240),
      vxQ16: 0,
      vyQ16: 0,
      headingRad: 0,
    },
    windAngleRad: 0, // Eastward breeze initially
    wakePoints: [], // Tapered ink-and-foam boat wake [{ xQ16, yQ16, width, age }]
    activeStrokes: [], // Brush strokes drawn while in BRUSH mode
    currentStroke: null,
    shrines: ARCHIPELAGO_SHRINES.map((s) => ({ ...s, awakened: false })),
    activeShrineId: "bru-enso",
    lastGlyphDetected: "NONE",
    unlockedEnsembleLayers: 1,
  };
}

export function setVoyageMode(state, mode) {
  return {
    ...state,
    mode: mode === "BRUSH" ? "BRUSH" : "SAIL",
    activeStrokes: [],
    currentStroke: null,
  };
}

export function beginCelestialStroke(state, x, y) {
  if (state.mode !== "BRUSH") return state;
  return {
    ...state,
    currentStroke: [{ xQ16: toQ16(x), yQ16: toQ16(y), width: 13 }],
  };
}

export function extendCelestialStroke(state, x, y) {
  if (state.mode !== "BRUSH" || !state.currentStroke) return state;
  const last = state.currentStroke.at(-1);
  const dist = Math.hypot(x - fromQ16(last.xQ16), y - fromQ16(last.yQ16));
  if (dist < 1.5) return state;

  const width = Math.max(3, Math.min(15, 15 - dist * 0.32));
  return {
    ...state,
    currentStroke: [...state.currentStroke, { xQ16: toQ16(x), yQ16: toQ16(y), width }],
  };
}

/**
 * Deterministic Celestial Brush Gesture Classifier:
 *   - CROSS: Two intersecting strokes
 *   - CIRCLE: Closed single-loop Ensō / Triskele
 *   - WAVE: Curved S-wave with >= 2 horizontal/vertical inflections
 *   - SLASH: Straight directional Ogham / Kaze wind slash (also returns slash angle)
 */
export function classifyCelestialGlyph(strokes) {
  if (!strokes || strokes.length === 0) return { glyph: "NONE", angleRad: 0 };

  // 1. Two-stroke Cross / Solstice Star check
  if (strokes.length >= 2) {
    const s1 = strokes.at(-2);
    const s2 = strokes.at(-1);
    if (s1.length >= 2 && s2.length >= 2) {
      const c1x = (fromQ16(s1.at(0).xQ16) + fromQ16(s1.at(-1).xQ16)) * 0.5;
      const c1y = (fromQ16(s1.at(0).yQ16) + fromQ16(s1.at(-1).yQ16)) * 0.5;
      const c2x = (fromQ16(s2.at(0).xQ16) + fromQ16(s2.at(-1).xQ16)) * 0.5;
      const c2y = (fromQ16(s2.at(0).yQ16) + fromQ16(s2.at(-1).yQ16)) * 0.5;
      if (Math.hypot(c1x - c2x, c1y - c2y) < 55) {
        return { glyph: "CROSS", angleRad: 0 };
      }
    }
  }

  const pts = strokes.at(-1);
  if (!pts || pts.length < 4) return { glyph: "NONE", angleRad: 0 };

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  let pathLen = 0;

  for (let i = 0; i < pts.length; i++) {
    const px = fromQ16(pts.at(i).xQ16);
    const py = fromQ16(pts.at(i).yQ16);
    if (px < minX) minX = px;
    if (px > maxX) maxX = px;
    if (py < minY) minY = py;
    if (py > maxY) maxY = py;
    if (i > 0) {
      pathLen += Math.hypot(px - fromQ16(pts.at(i - 1).xQ16), py - fromQ16(pts.at(i - 1).yQ16));
    }
  }

  const startX = fromQ16(pts.at(0).xQ16);
  const startY = fromQ16(pts.at(0).yQ16);
  const endX = fromQ16(pts.at(-1).xQ16);
  const endY = fromQ16(pts.at(-1).yQ16);
  const chord = Math.hypot(endX - startX, endY - startY);
  const angleRad = Math.atan2(endY - startY, endX - startX);

  const boxW = maxX - minX;
  const boxH = maxY - minY;
  const avgDiam = (boxW + boxH) * 0.5;

  // 2. Closed Circle (Ensō / Triskele)
  if (pts.length >= 12 && boxW >= 48 && boxH >= 48) {
    const aspect = Math.min(boxW, boxH) / Math.max(boxW, boxH);
    if (aspect >= 0.6 && chord <= avgDiam * 0.42 && pathLen >= avgDiam * 2.1) {
      return { glyph: "CIRCLE", angleRad };
    }
  }

  // 3. Straight Directional Slash (Ogham / Kaze Wind) vs. Flowing S-Wave (Mizu / Kana)
  if (chord >= 55) {
    const straightness = chord / Math.max(1, pathLen);
    if (straightness >= 0.86) {
      return { glyph: "SLASH", angleRad };
    }
    if (straightness >= 0.45 && straightness < 0.86) {
      return { glyph: "WAVE", angleRad };
    }
  }

  return { glyph: "NONE", angleRad };
}

export function endCelestialStroke(state) {
  if (state.mode !== "BRUSH" || !state.currentStroke) return state;
  const nextStrokes = [...state.activeStrokes, state.currentStroke];
  const result = classifyCelestialGlyph(nextStrokes);

  let windAngleRad = state.windAngleRad;
  if (result.glyph === "SLASH") {
    windAngleRad = result.angleRad;
  }

  // Awaken nearest shrine if its matching Celestial Brush glyph was drawn
  const bx = fromQ16(state.boat.xQ16);
  const by = fromQ16(state.boat.yQ16);

  let awakenedCount = 0;
  let activeShrineId = state.activeShrineId;
  const nextShrines = state.shrines.map((shrine) => {
    const nearBoat = Math.hypot(bx - shrine.x, by - shrine.y) < 135;
    if (nearBoat) activeShrineId = shrine.id;
    const awakened = shrine.awakened || (nearBoat && shrine.glyphType === result.glyph);
    if (awakened) awakenedCount++;
    return { ...shrine, awakened };
  });

  const unlockedEnsembleLayers = Math.min(4, Math.max(1, awakenedCount + 1));

  return {
    ...state,
    activeStrokes: nextStrokes,
    currentStroke: null,
    windAngleRad,
    shrines: nextShrines,
    activeShrineId,
    lastGlyphDetected: result.glyph,
    unlockedEnsembleLayers,
  };
}

export function stepVoyageFrame(state, steerXQ16 = 0, steerYQ16 = 0) {
  const tick = state.tick + 1;
  if (state.mode === "BRUSH") {
    return { ...state, tick };
  }

  const dtQ16 = toQ16(1.0 / 60.0);
  const dampQ16 = toQ16(0.94);

  // Wind Waker prevailing breeze assist in windAngleRad
  const windPushX = toQ16(Math.cos(state.windAngleRad) * 95);
  const windPushY = toQ16(Math.sin(state.windAngleRad) * 95);

  const ax = qAdd(steerXQ16, windPushX);
  const ay = qAdd(steerYQ16, windPushY);

  let vx = qMul(qAdd(state.boat.vxQ16, qMul(ax, dtQ16)), dampQ16);
  let vy = qMul(qAdd(state.boat.vyQ16, qMul(ay, dtQ16)), dampQ16);
  let x = qAdd(state.boat.xQ16, qMul(vx, dtQ16));
  let y = qAdd(state.boat.yQ16, qMul(vy, dtQ16));

  let fx = Math.max(36, Math.min(SEA_W - 36, fromQ16(x)));
  let fy = Math.max(36, Math.min(SEA_H - 36, fromQ16(y)));
  x = toQ16(fx);
  y = toQ16(fy);

  const fvx = fromQ16(vx);
  const fvy = fromQ16(vy);
  const speed = Math.hypot(fvx, fvy);
  const headingRad = speed > 2 ? Math.atan2(fvy, fvx) : state.boat.headingRad;

  // Record velocity-tapered calligraphy wake behind the boat
  let nextWake = state.wakePoints.map((w) => ({ ...w, age: w.age + 1 })).filter((w) => w.age < 90);
  if (speed > 4 && tick % 2 === 0) {
    const wakeWidth = Math.max(2.5, Math.min(11, 11 - speed * 0.04));
    nextWake.push({ xQ16: x, yQ16: y, width: wakeWidth, age: 0 });
  }

  // Highlight nearest shrine for cultural scroll HUD
  let activeShrineId = state.activeShrineId;
  let bestDist = 145;
  for (const s of state.shrines) {
    const d = Math.hypot(fx - s.x, fy - s.y);
    if (d < bestDist) {
      bestDist = d;
      activeShrineId = s.id;
    }
  }

  return {
    ...state,
    tick,
    boat: { xQ16: x, yQ16: y, vxQ16: vx, vyQ16: vy, headingRad },
    wakePoints: nextWake,
    activeShrineId,
  };
}

export function buildVoyageReceipt(state) {
  const awakened = state.shrines.filter((s) => s.awakened).map((s) => s.id);
  const payload = {
    schema: "ndh.celtic.shodo.wind.v1",
    tick: state.tick,
    windAngleDeg: Math.round((state.windAngleRad * 180) / Math.PI),
    awakenedShrines: awakened,
    ensembleLayers: state.unlockedEnsembleLayers,
  };
  return {
    ...payload,
    sha256: sha256Hex(JSON.stringify(payload)),
  };
}
