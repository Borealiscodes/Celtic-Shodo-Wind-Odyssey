/**
 * src/sea-chart-renderer.js — Cel-Shaded Archipelago Sea Chart, Boat Wake & Celestial Brush Overlay (Ledger 2)
 * Zero-flicker steady ocean gradient with Wind Waker wave curls, island shrines,
 * wind compass, and translucent parchment brush overlay in BRUSH mode.
 *
 * Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>
 */

import { fromQ16 } from "./core.js";

function drawStrokePolyline(ctx, pts, color) {
  if (!pts || pts.length === 0) return;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = color;

  if (pts.length === 1) {
    const p = pts.at(0);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(fromQ16(p.xQ16), fromQ16(p.yQ16), p.width * 0.5, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  for (let i = 1; i < pts.length; i++) {
    const a = pts.at(i - 1);
    const b = pts.at(i);
    ctx.lineWidth = (a.width + b.width) * 0.5;
    ctx.beginPath();
    ctx.moveTo(fromQ16(a.xQ16), fromQ16(a.yQ16));
    ctx.lineTo(fromQ16(b.xQ16), fromQ16(b.yQ16));
    ctx.stroke();
  }
}

export function renderSeaChart(ctx, state) {
  const { width, height } = ctx.canvas;

  // 1. Steady Wind Waker cerulean-turquoise ocean gradient (zero flicker)
  const sea = ctx.createLinearGradient(0, 0, 0, height);
  sea.addColorStop(0, "#0c4a6e");
  sea.addColorStop(0.5, "#0284c7");
  sea.addColorStop(1, "#0369a1");
  ctx.fillStyle = sea;
  ctx.fillRect(0, 0, width, height);

  // 2. Subtle cel-shaded sea chart grid & drifting wind wave curls
  ctx.strokeStyle = "rgba(186, 230, 253, 0.16)";
  ctx.lineWidth = 1;
  for (let x = 85; x < width; x += 170) {
    ctx.beginPath();
    ctx.moveTo(x, 16);
    ctx.lineTo(x, height - 16);
    ctx.stroke();
  }
  for (let y = 76; y < height; y += 152) {
    ctx.beginPath();
    ctx.moveTo(16, y);
    ctx.lineTo(width - 16, y);
    ctx.stroke();
  }

  // Animated wind-aligned wave crests
  ctx.strokeStyle = "rgba(224, 242, 254, 0.32)";
  ctx.lineWidth = 1.6;
  const wx = Math.cos(state.windAngleRad);
  const wy = Math.sin(state.windAngleRad);
  for (let i = 0; i < 14; i++) {
    const baseX = ((i * 97 + state.tick * wx * 0.9) % (width - 60) + (width - 60)) % (width - 60) + 30;
    const baseY = ((i * 73 + state.tick * wy * 0.9) % (height - 60) + (height - 60)) % (height - 60) + 30;
    ctx.beginPath();
    ctx.moveTo(baseX - wx * 12, baseY - wy * 12);
    ctx.quadraticCurveTo(baseX - wy * 6, baseY + wx * 6, baseX + wx * 12, baseY + wy * 12);
    ctx.stroke();
  }

  // 3. Four Sacred Archipelago Islands & Shrines
  for (const shrine of state.shrines) {
    const isSelected = shrine.id === state.activeShrineId;

    // Sandy shoal ring
    ctx.fillStyle = "#fde68a";
    ctx.beginPath();
    ctx.arc(shrine.x, shrine.y, 44, 0, Math.PI * 2);
    ctx.fill();

    // Emerald & moss island turf
    ctx.fillStyle = shrine.awakened ? "#16a34a" : "#15803d";
    ctx.beginPath();
    ctx.arc(shrine.x, shrine.y, 35, 0, Math.PI * 2);
    ctx.fill();

    // Active shrine highlight halo
    if (isSelected) {
      ctx.strokeStyle = "#fef08a";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(shrine.x, shrine.y, 50, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Shrine Standing Stone / Torii Beacon emblem
    ctx.fillStyle = shrine.awakened ? "#fde047" : "#f8fafc";
    ctx.font = "bold 15px serif";
    ctx.textAlign = "center";
    ctx.fillText(shrine.glyphIcon, shrine.x, shrine.y + 5);

    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 11px system-ui, sans-serif";
    ctx.fillText(shrine.name, shrine.x, shrine.y - 54);
    ctx.textAlign = "left";
  }

  // 4. Velocity-Tapered Calligraphy Boat Wake
  for (const wp of state.wakePoints) {
    const alpha = Math.max(0, 0.55 * (1 - wp.age / 90));
    ctx.fillStyle = `rgba(240, 249, 255, ${alpha})`;
    ctx.beginPath();
    ctx.arc(fromQ16(wp.xQ16), fromQ16(wp.yQ16), wp.width * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // 5. Cel-Shaded Wooden Curragh / Wasen Sailboat
  const bx = fromQ16(state.boat.xQ16);
  const by = fromQ16(state.boat.yQ16);
  ctx.save();
  ctx.translate(bx, by);
  ctx.rotate(state.boat.headingRad);

  // Boat hull
  ctx.fillStyle = "#92400e";
  ctx.strokeStyle = "#fef3c7";
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(18, 0);
  ctx.quadraticCurveTo(4, 11, -16, 8);
  ctx.lineTo(-16, -8);
  ctx.quadraticCurveTo(4, -11, 18, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Billowing crimson-and-gold sail
  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.moveTo(-2, -12);
  ctx.quadraticCurveTo(10, 0, -2, 12);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 6. Wind Waker Compass Rose (top-right corner)
  const cx = width - 48;
  const cy = 48;
  ctx.fillStyle = "rgba(15, 23, 42, 0.72)";
  ctx.beginPath();
  ctx.arc(cx, cy, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#fde047";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(state.windAngleRad);
  ctx.fillStyle = "#fde047";
  ctx.beginPath();
  ctx.moveTo(18, 0);
  ctx.lineTo(-10, 6);
  ctx.lineTo(-6, 0);
  ctx.lineTo(-10, -6);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 7. Celestial Brush Washi Parchment Overlay (when in BRUSH mode)
  if (state.mode === "BRUSH") {
    ctx.fillStyle = "rgba(247, 241, 225, 0.84)";
    ctx.fillRect(18, 18, width - 36, height - 36);
    ctx.strokeStyle = "#b45309";
    ctx.lineWidth = 2.5;
    ctx.strokeRect(18, 18, width - 36, height - 36);

    for (const s of state.activeStrokes) {
      drawStrokePolyline(ctx, s, "#1c1917");
    }
    if (state.currentStroke) {
      drawStrokePolyline(ctx, state.currentStroke, "#dc2626");
    }
  }
}
