/**
 * test/wind-voyage-kernel.test.mjs — Verification of 4 Celestial Brush Glyphs, Wind Shift & Shrine Awakening
 * Run: node --test test/wind-voyage-kernel.test.mjs
 *
 * Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>
 */

import test from "node:test";
import assert from "node:assert/strict";

import { toQ16 } from "../src/core.js";
import {
  createVoyageState,
  setVoyageMode,
  beginCelestialStroke,
  extendCelestialStroke,
  endCelestialStroke,
  buildVoyageReceipt,
} from "../src/wind-voyage-kernel.js";

test("1. Closed Circle Glyph Awakens Isle of Brú & Ensō", () => {
  let s = createVoyageState();
  s.boat.xQ16 = toQ16(175);
  s.boat.yQ16 = toQ16(135);
  s = setVoyageMode(s, "BRUSH");

  const cx = 340, cy = 230, r = 80;
  s = beginCelestialStroke(s, cx + r, cy);
  for (let i = 1; i <= 32; i++) {
    const t = (2 * Math.PI * i) / 32;
    s = extendCelestialStroke(s, cx + Math.cos(t) * r, cy + Math.sin(t) * r);
  }
  s = endCelestialStroke(s);

  assert.equal(s.lastGlyphDetected, "CIRCLE");
  assert.equal(s.shrines.at(0).awakened, true);
  assert.equal(s.unlockedEnsembleLayers, 2);
});

test("2. Directional Slash Shifts Wind Angle & Awakens Ogham & Kaze Ridge", () => {
  let s = createVoyageState();
  s.boat.xQ16 = toQ16(505);
  s.boat.yQ16 = toQ16(130);
  s = setVoyageMode(s, "BRUSH");

  s = beginCelestialStroke(s, 200, 120);
  for (let y = 140; y <= 340; y += 20) {
    s = extendCelestialStroke(s, 200, y);
  }
  s = endCelestialStroke(s);

  assert.equal(s.lastGlyphDetected, "SLASH");
  assert.ok(Math.abs(s.windAngleRad - Math.PI / 2) < 0.05);
  assert.equal(s.shrines.at(1).awakened, true);
});

test("3. Two-Stroke Cross Awakens Solstice & Tōrō Beacon and Emits SHA-256 Receipt", () => {
  let s = createVoyageState();
  s.boat.xQ16 = toQ16(175);
  s.boat.yQ16 = toQ16(345);
  s = setVoyageMode(s, "BRUSH");

  // Horizontal stroke
  s = beginCelestialStroke(s, 260, 230);
  for (let x = 280; x <= 420; x += 20) s = extendCelestialStroke(s, x, 230);
  s = endCelestialStroke(s);

  // Intersecting vertical stroke
  s = beginCelestialStroke(s, 340, 150);
  for (let y = 170; y <= 310; y += 20) s = extendCelestialStroke(s, 340, y);
  s = endCelestialStroke(s);

  assert.equal(s.lastGlyphDetected, "CROSS");
  assert.equal(s.shrines.at(3).awakened, true);
  assert.equal(buildVoyageReceipt(s).sha256.length, 64);
});
