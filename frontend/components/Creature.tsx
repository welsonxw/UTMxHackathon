'use client';

import { useEffect, useRef } from 'react';
import type p5 from 'p5';
import type { CreatureParams, RiskFlagLocation } from '@/lib/types';

interface CreatureProps {
  params: CreatureParams;
  size?: number;
}

function buildAngularVerts(p: p5, bodyRadius: number): [number, number][] {
  const numVerts = 8;
  return Array.from({ length: numVerts }, (_, i) => {
    const angle = (i / numVerts) * p.TWO_PI - p.HALF_PI;
    const nv = p.noise(i * 0.71 + 42.3);
    const r  = bodyRadius * (0.65 + nv * 0.6);
    return [r * p.cos(angle), r * p.sin(angle)];
  });
}

function buildCrystalVerts(p: p5, bodyRadius: number) {
  const n = 6;
  const outer: [number, number][] = [];
  const inner: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const a  = (i / n) * p.TWO_PI - p.HALF_PI;
    const ai = a + p.TWO_PI / (n * 2);
    const jitter = 0.9 + p.noise(i * 1.3 + 99) * 0.2;
    outer.push([bodyRadius * jitter * p.cos(a), bodyRadius * jitter * p.sin(a)]);
    inner.push([bodyRadius * 0.42 * p.cos(ai), bodyRadius * 0.42 * p.sin(ai)]);
  }
  return { outer, inner };
}

function flagPos(loc: RiskFlagLocation, r: number) {
  if (loc === 'head') return { x: 0,        y: -r * 0.85 };
  if (loc === 'body') return { x: r * 0.42, y: -r * 0.28 };
  return                      { x: r * 1.05, y: -r * 0.45 };
}

export default function Creature({ params, size = 300 }: CreatureProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    let myP5: p5 | null = null;
    let cancelled = false;

    void import('p5').then(({ default: P5 }) => {
      if (cancelled) return;

      const {
        bodyShape, bodySize, paletteHue: H, paletteSaturation: S,
        appendageCount, auraIntensity, textureDensity,
        hasRiskFlag, riskFlagLocation,
      } = params;
      const bodyRadius = bodySize / 2;

      const sketch = (p: p5) => {
        let noiseTime  = 0;
        let breathTime = 0;
        let riskTime   = 0;
        let angVerts:    [number, number][] = [];
        let cryOuter:    [number, number][] = [];
        let cryInner:    [number, number][] = [];

        p.setup = () => {
          const cnv = p.createCanvas(size, size);
          cnv.parent(container);
          p.colorMode(p.HSL, 360, 100, 100, 1.0);
          p.noStroke();
          p.frameRate(60);

          if (bodyShape === 'angular')     angVerts = buildAngularVerts(p, bodyRadius);
          if (bodyShape === 'crystalline') {
            const cv = buildCrystalVerts(p, bodyRadius);
            cryOuter = cv.outer;
            cryInner = cv.inner;
          }
        };

        p.draw = () => {
          p.clear();
          noiseTime  += 0.004;
          breathTime += 0.0083;
          riskTime   += 0.06;

          const breathScale = 0.95 + 0.05 * Math.sin(breathTime * Math.PI * 2);
          p.translate(size / 2, size / 2);
          p.scale(breathScale);

          // ── AURA ───────────────────────────────────────────────────────
          if (auraIntensity > 0.05) {
            p.noStroke();
            for (let i = 7; i >= 1; i--) {
              p.fill(H, S, 75, auraIntensity * 0.22 * (1 - i / 8));
              p.circle(0, 0, bodyRadius * (1.25 + i * 0.2) * 2);
            }
          }

          // ── APPENDAGES (behind body) ───────────────────────────────────
          const appLen   = bodyRadius * 1.1;
          const appWidth = bodyRadius * 0.22;
          p.noStroke();
          for (let i = 0; i < appendageCount; i++) {
            const ang = (i / appendageCount) * p.TWO_PI - p.HALF_PI;
            p.push();
            p.translate(bodyRadius * 0.78 * p.cos(ang), bodyRadius * 0.78 * p.sin(ang));
            p.rotate(ang);
            p.fill(H, S, 45, 0.88);
            p.ellipse(0, 0, appWidth, appLen);
            p.fill(H, S, 70, 0.4);
            p.ellipse(0, -appLen * 0.42, appWidth * 0.55, appWidth * 0.55);
            p.pop();
          }

          // ── BODY ───────────────────────────────────────────────────────
          p.noStroke();
          if      (bodyShape === 'blob')        drawBlob(p, bodyRadius, noiseTime, H, S, textureDensity);
          else if (bodyShape === 'angular')     drawAngular(p, angVerts, H, S, textureDensity);
          else if (bodyShape === 'spiked')      drawSpiked(p, bodyRadius, H, S, textureDensity);
          else                                  drawCrystalline(p, cryOuter, cryInner, H, S);

          // ── RISK FLAG ──────────────────────────────────────────────────
          if (hasRiskFlag) {
            const pulse = 0.5 + 0.5 * Math.sin(riskTime);
            const fp    = flagPos(riskFlagLocation, bodyRadius);
            p.noFill();
            p.stroke(0, 90, 58, 0.35 + 0.55 * pulse);
            p.strokeWeight(2 + pulse * 3.5);
            p.circle(fp.x, fp.y, 18 + pulse * 10);
            p.noStroke();
            p.fill(0, 90, 58, 0.9);
            p.circle(fp.x, fp.y, 11);
            p.fill(0, 0, 100, 0.95);
            p.circle(fp.x, fp.y, 4.5);
          }
        };
      };

      myP5 = new P5(sketch) as p5;
    });

    return () => {
      cancelled = true;
      if (myP5) myP5.remove();
    };
  }, [params, size]);

  return <div ref={containerRef} style={{ width: size, height: size, display: 'inline-block' }} />;
}

// ─── Body-shape renderers ─────────────────────────────────────────────────────

function drawBlob(p: p5, r: number, t: number, H: number, S: number, density: number) {
  const N = 90;
  const distortion = 0.18 + density * 0.32;

  p.fill(H, S, 55, 1.0);
  p.beginShape();
  for (let i = 0; i < N; i++) {
    const a  = (i / N) * p.TWO_PI;
    const nv = p.noise(p.cos(a) * 0.55 + 1.5 + t, p.sin(a) * 0.55 + 1.5 + t);
    const rr = r * (1 - distortion * 0.45 + nv * distortion);
    p.vertex(rr * p.cos(a), rr * p.sin(a));
  }
  p.endShape(p.CLOSE);

  // Shifting highlight glob (animated with noise)
  p.fill(H, S, 72, 0.4);
  p.beginShape();
  for (let i = 0; i < N; i++) {
    const a  = (i / N) * p.TWO_PI;
    const nv = p.noise(p.cos(a) * 0.4 + 2.5 + t * 0.7, p.sin(a) * 0.4 + 2.5 + t * 0.7);
    const rr = r * (0.42 + nv * 0.25);
    p.vertex(rr * p.cos(a - 0.5), rr * p.sin(a - 0.5));
  }
  p.endShape(p.CLOSE);
}

function drawAngular(p: p5, verts: [number,number][], H: number, S: number, density: number) {
  p.fill(H, S, 50, 1.0);
  p.beginShape();
  verts.forEach(([x, y]) => p.vertex(x, y));
  p.endShape(p.CLOSE);

  // Flat-face highlight — top facet
  p.fill(H, S, 68, 0.5);
  p.beginShape();
  verts.slice(0, 3).forEach(([x, y]) => p.vertex(x * 0.7, y * 0.7));
  p.endShape(p.CLOSE);

  // Interior facet lines
  if (density > 0.2) {
    p.stroke(H, S, 80, 0.3);
    p.strokeWeight(0.8);
    const n = verts.length;
    for (let i = 0; i < n; i++) {
      const j = (i + 3) % n;
      p.line(verts[i][0] * 0.22, verts[i][1] * 0.22, verts[j][0] * 0.62, verts[j][1] * 0.62);
    }
    for (let i = 0; i < n; i += 2) {
      p.line(0, 0, verts[i][0] * 0.52, verts[i][1] * 0.52);
    }
    p.noStroke();
  }
}

function drawSpiked(p: p5, r: number, H: number, S: number, density: number) {
  const numSpikes = 7 + Math.round(density * 3);

  // Back disc
  p.fill(H, S, 42, 1.0);
  p.circle(0, 0, r * 1.05);

  // Star burst
  p.fill(H, S, 58, 1.0);
  p.beginShape();
  for (let i = 0; i < numSpikes * 2; i++) {
    const a  = (i / (numSpikes * 2)) * p.TWO_PI - p.HALF_PI;
    const rr = i % 2 === 0 ? r * 1.62 : r * 0.52;
    p.vertex(rr * p.cos(a), rr * p.sin(a));
  }
  p.endShape(p.CLOSE);

  // Bright tip overlay
  p.fill(H, S, 76, 0.45);
  p.beginShape();
  for (let i = 0; i < numSpikes * 2; i++) {
    const a  = (i / (numSpikes * 2)) * p.TWO_PI - p.HALF_PI;
    const rr = i % 2 === 0 ? r * 1.62 : r * 1.05;
    p.vertex(rr * p.cos(a), rr * p.sin(a));
  }
  p.endShape(p.CLOSE);

  // Central core
  p.fill(H, S, 65, 1.0);
  p.circle(0, 0, r * 0.88);
}

function drawCrystalline(
  p: p5,
  outer: [number,number][],
  inner: [number,number][],
  H: number,
  S: number,
) {
  const n = outer.length;

  for (let i = 0; i < n; i++) {
    const ni = (i + 1) % n;

    // Outer facet (darker bands)
    p.fill(H, S, 35 + (i % 3) * 10, 1.0);
    p.beginShape();
    p.vertex(outer[i][0],  outer[i][1]);
    p.vertex(inner[i][0],  inner[i][1]);
    p.vertex(outer[ni][0], outer[ni][1]);
    p.endShape(p.CLOSE);

    // Inner facet (lighter, alternating)
    p.fill(H, S, 58 + (i % 2) * 14, 1.0);
    p.beginShape();
    p.vertex(0, 0);
    p.vertex(inner[i][0],  inner[i][1]);
    p.vertex(inner[ni][0], inner[ni][1]);
    p.endShape(p.CLOSE);
  }

  // Bright edge outline
  p.stroke(H, S, 88, 0.7);
  p.strokeWeight(1.2);
  p.beginShape();
  outer.forEach(([x, y]) => p.vertex(x, y));
  p.endShape(p.CLOSE);

  p.stroke(H, S, 88, 0.4);
  p.strokeWeight(0.8);
  p.beginShape();
  inner.forEach(([x, y]) => p.vertex(x, y));
  p.endShape(p.CLOSE);
  p.noStroke();

  // Centre sparkle
  p.fill(H, S, 92, 0.85);
  p.circle(0, 0, 10);
  p.fill(0, 0, 100, 0.7);
  p.circle(-2, -2, 4);
}
