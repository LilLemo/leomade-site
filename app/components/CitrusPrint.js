"use client";

import { useEffect, useRef } from "react";

// A two-ink illustration on a fixed printing grid. The seed keeps the grain stable.
export default function CitrusPrint() {
  const canvas = useRef(null);
  useEffect(() => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    const ink = "#352b48", flesh = "#ffdb53", cream = "#fff2ca";
    let seed = 3041;
    const noise = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
    const shape = (path, fill, stroke = ink, width = 3) => {
      ctx.fillStyle = fill;
      ctx.fill(path);
      ctx.strokeStyle = stroke;
      ctx.lineWidth = width;
      ctx.stroke(path);
    };
    ctx.clearRect(0, 0, 1000, 780);
    ctx.save();
    ctx.scale(2, 2);
    // Offset ink shadow, printed as elliptical halftone dots.
    ctx.fillStyle = ink;
    for (let y = 266; y < 343; y += 4) {
      for (let x = 54; x < 459; x += 4) {
        const depth = 1 - ((x - 257) / 202) ** 2 - ((y - 303) / 36) ** 2;
        if (depth <= 0) continue;
        ctx.beginPath(); ctx.arc(x, y, 1.7 * depth, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.save();
    ctx.translate(222, 205);
    ctx.rotate(-0.34);
    const fruit = new Path2D("M-133 -7 C-116 -16 -116 -48 -87 -69 C-28 -112 57 -93 104 -54 C125 -36 120 -22 139 -15 Q156 -7 147 7 C141 18 129 13 119 32 C87 94 -17 109 -85 65 C-113 47 -112 25 -135 19 Q-153 5 -133 -7Z");
    shape(fruit, flesh);
    ctx.save(); ctx.clip(fruit); ctx.fillStyle = ink;
    for (let i = 0; i < 19500; i++) {
      const x = noise() * 310 - 155, y = noise() * 218 - 109;
      const density = Math.max(0.015, 0.03 + 0.55 * ((y + 83) / 178) ** 3 + 0.22 * (Math.abs(x) / 154) ** 4);
      if (noise() > density) continue;
      ctx.beginPath(); ctx.ellipse(x, y, .35 + noise() * 1.25, .35 + noise() * .55, -.18, 0, 2 * Math.PI); ctx.fill();
    }
    ctx.restore(); ctx.restore();
    const leaf = new Path2D("M258 117 Q261 47 367 35 Q345 107 258 117Z");
    shape(leaf, ink);
    ctx.strokeStyle = flesh; ctx.lineWidth = 1.4;
    ctx.stroke(new Path2D("M259 116 Q309 76 360 39"));
    for (let i = 0; i < 9; i++) {
      const x = 269 + 9 * i, y = 107 - i * 6.6;
      ctx.stroke(new Path2D("M" + x + " " + y + " q3 -10 11 -23 M" + x + " " + y + " q13 1 23 -5"));
    }
    ctx.save(); ctx.translate(343, 245); ctx.rotate(.30); ctx.scale(1, .84);
    const circle = r => { const p = new Path2D(); p.arc(0, 0, r, 0, Math.PI * 2); return p; };
    ctx.save(); ctx.translate(1, 10); shape(circle(83), ink); ctx.restore();
    shape(circle(84), flesh); shape(circle(77), cream, ink, 1);
    for (let i = 0; i < 10; i++) {
      ctx.save(); ctx.rotate(i * Math.PI / 5);
      const wedge = new Path2D("M8 0 Q6 -2 12 -4 L66 -19 Q73 -21 73 -13 Q76 0 72 15 Q71 20 65 18 L13 4 Q7 3 8 0Z");
      shape(wedge, flesh, ink, 1.4);
      ctx.clip(wedge); ctx.strokeStyle = "#635044"; ctx.lineWidth = .65;
      for (let j = 0; j < 92; j++) {
        const x = 10 + noise() * 65, y = (noise() - .5) * .58 * x;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 2 + noise() * 5, y + y * .1); ctx.stroke();
      }
      ctx.restore();
    }
    ctx.restore(); ctx.restore();
  }, []);
  return <canvas className="citrusPrint" ref={canvas} width="1000" height="780" role="img" aria-label="Gravura de um limão-siciliano com uma folha e uma fatia em corte" />;
}
