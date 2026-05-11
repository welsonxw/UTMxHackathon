'use client';

import dynamic from 'next/dynamic';
import type { CreatureParams, RiskFlag } from '@/lib/types';

// SSR-safe: p5 cannot run server-side
const Creature = dynamic(() => import('@/components/Creature'), { ssr: false });

// Hardcoded params per Section 10 — tuned for maximum visual distinctiveness.
// These match what generateCreatureParams() would produce given correctly embedded
// UMAP coordinates + persona stats from the brief.
const CREATURES: {
  label: string;
  subtitle: string;
  incomeTag: string;
  tagColor: string;
  params: CreatureParams;
  riskNote?: string;
}[] = [
  {
    label: 'Aisyah Binti Hassan',
    subtitle: 'Crystalline · Teal · 4 appendages · High aura',
    incomeTag: 'B40 · RM 2,200/mo',
    tagColor: 'bg-teal-900 text-teal-300',
    params: {
      bodyShape:         'crystalline',
      bodySize:          113,       // 80 + (82/100)×40
      paletteHue:        195,       // cool teal-blue
      paletteSaturation: 75,
      appendageCount:    4,
      auraIntensity:     0.78,      // high — restraint 78
      textureDensity:    0.82,      // consistency 82
      hasRiskFlag:       false,
      riskFlagLocation:  'body',
    },
  },
  {
    label: 'Daniel Tan Wei Ming',
    subtitle: 'Blob · Coral · 3 appendages · Low aura · Risk flag',
    incomeTag: 'T20 · RM 9,500/mo',
    tagColor: 'bg-rose-900 text-rose-300',
    riskNote: '⚠ Subscription creep — RM 127/mo at risk',
    params: {
      bodyShape:         'blob',
      bodySize:          95,        // 80 + (38/100)×40
      paletteHue:        15,        // warm coral
      paletteSaturation: 72,
      appendageCount:    3,
      auraIntensity:     0.42,      // low — restraint 42
      textureDensity:    0.38,      // consistency 38
      hasRiskFlag:       true,
      riskFlagLocation:  'body',
    },
  },
  {
    label: 'Mei Ling Wong',
    subtitle: 'Spiked · Amber · 2 appendages · Medium aura · Risk flag',
    incomeTag: 'B40 · RM ~2,650/mo',
    tagColor: 'bg-amber-900 text-amber-300',
    riskNote: '⚠ Income volatility (gig economy)',
    params: {
      bodyShape:         'spiked',
      bodySize:          94,        // 80 + (35/100)×40
      paletteHue:        38,        // vibrant amber
      paletteSaturation: 88,
      appendageCount:    2,
      auraIntensity:     0.50,      // medium — restraint 50
      textureDensity:    0.35,      // consistency 35
      hasRiskFlag:       true,
      riskFlagLocation:  'limb',
    },
  },
  {
    label: 'Hafiz Bin Ramli',
    subtitle: 'Angular · Purple · 5 appendages · Very high aura',
    incomeTag: 'T20 · RM 7,200/mo',
    tagColor: 'bg-violet-900 text-violet-300',
    params: {
      bodyShape:         'angular',
      bodySize:          117,       // 80 + (92/100)×40
      paletteHue:        272,       // deep purple
      paletteSaturation: 75,
      appendageCount:    5,
      auraIntensity:     0.88,      // very high — restraint 88
      textureDensity:    0.92,      // consistency 92
      hasRiskFlag:       false,
      riskFlagLocation:  'body',
    },
  },
];

export default function TestCreaturesPage() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10">
      <h1 className="text-2xl font-bold text-white mb-1">
        Creature Visual Test — Phase 5
      </h1>
      <p className="text-slate-400 text-sm mb-10">
        All 4 personas rendered side-by-side. Each must be visually distinct at a glance.
      </p>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-8">
        {CREATURES.map(({ label, subtitle, incomeTag, tagColor, params, riskNote }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-4 rounded-2xl bg-slate-900 border border-slate-800 p-6"
          >
            {/* Canvas */}
            <div className="rounded-xl overflow-hidden bg-slate-950">
              <Creature params={params} size={260} />
            </div>

            {/* Meta */}
            <div className="text-center w-full">
              <div className="flex justify-center mb-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tagColor}`}>
                  {incomeTag}
                </span>
              </div>
              <p className="font-semibold text-white text-sm">{label}</p>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed">{subtitle}</p>
              {riskNote && (
                <p className="text-rose-400 text-xs mt-2 font-medium">{riskNote}</p>
              )}
            </div>

            {/* Stat readout */}
            <div className="w-full text-xs text-slate-600 space-y-1 border-t border-slate-800 pt-3">
              <div className="flex justify-between">
                <span>Shape</span>
                <span className="text-slate-400 capitalize">{params.bodyShape}</span>
              </div>
              <div className="flex justify-between">
                <span>Hue</span>
                <span className="text-slate-400">{Math.round(params.paletteHue)}°</span>
              </div>
              <div className="flex justify-between">
                <span>Appendages</span>
                <span className="text-slate-400">{params.appendageCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Aura</span>
                <span className="text-slate-400">{Math.round(params.auraIntensity * 100)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-10 text-slate-600 text-xs text-center">
        Distinct check: blob (coral) · angular (purple) · spiked (amber) · crystalline (teal) — 4 different colors, 4 different shapes, different appendage counts
      </p>
    </div>
  );
}
