'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import type { PersonaId } from '@/lib/types';

// SSR-safe: BattleArena uses p5 + framer-motion
const BattleArena = dynamic(() => import('@/components/BattleArena'), { ssr: false });

type MatchupId = 'headline' | 'alt';

const MATCHUPS: Record<MatchupId, {
  label:    string;
  sub:      string;
  a:        PersonaId;
  b:        PersonaId;
  tagA:     string;
  tagB:     string;
}> = {
  headline: {
    label: 'Aisyah vs Daniel',
    sub:   'The headline match — B40 saver vs T20 drifter',
    a: 'aisyah',
    b: 'daniel',
    tagA: 'B40 · RM 2,200/mo',
    tagB: 'T20 · RM 9,500/mo',
  },
  alt: {
    label: 'Mei Ling vs Hafiz',
    sub:   'Chaotic improver vs disciplined plateau',
    a: 'mei_ling',
    b: 'hafiz',
    tagA: 'B40 · RM ~2,650/mo',
    tagB: 'T20 · RM 7,200/mo',
  },
};

export default function BattlePage() {
  const [activeMatchup, setActiveMatchup] = useState<MatchupId>('headline');
  // Bump key on matchup change to fully remount BattleArena (resets state)
  const [arenaKey, setArenaKey] = useState(0);

  const selectMatchup = useCallback((id: MatchupId) => {
    setActiveMatchup(id);
    setArenaKey((k) => k + 1);
  }, []);

  const { a, b, sub } = MATCHUPS[activeMatchup];

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Header */}
      <h2 className="text-2xl font-bold text-white mb-1">Battle Arena</h2>
      <p className="text-slate-400 text-sm mb-6">
        Income-fair PvP — scores are delta-from-baseline only. No income amounts are compared.
      </p>

      {/* Match selector */}
      <div className="flex gap-3 mb-8">
        {(Object.entries(MATCHUPS) as [MatchupId, typeof MATCHUPS[MatchupId]][]).map(([id, m]) => (
          <button
            key={id}
            onClick={() => selectMatchup(id)}
            className={`flex-1 rounded-xl px-4 py-3 text-left transition-all border ${
              activeMatchup === id
                ? 'border-rose-600 bg-rose-950/40 text-white'
                : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-600'
            }`}
          >
            <p className="font-semibold text-sm">{m.label}</p>
            <p className="text-xs mt-0.5 opacity-70">{m.sub}</p>
          </button>
        ))}
      </div>

      {/* Match sub-label */}
      <p className="text-center text-slate-500 text-xs mb-4 font-medium uppercase tracking-widest">
        {sub}
      </p>

      {/* Arena — key forces full remount when matchup changes */}
      <BattleArena
        key={arenaKey}
        personaA={a}
        personaB={b}
      />

      {/* Explainer footer */}
      <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/50 px-5 py-4 text-xs text-slate-500 leading-relaxed">
        <p className="font-semibold text-slate-400 mb-1">How scoring works</p>
        <p>
          Each axis score = 50 + (Δ% from personal baseline × 1.5). A user who improves
          22% beats one who plateaued — even with 4× lower income. Rewards are cosmetic only.
        </p>
      </div>
    </div>
  );
}
