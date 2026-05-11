'use client';

import { usePersona } from '@/lib/persona-context';
import { PERSONAS } from '@/lib/types';

export default function Battle() {
  const { activePersona } = usePersona();
  const { name } = PERSONAS[activePersona];

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-white mb-2">Battle Arena</h2>
      <p className="text-slate-400 mb-10">
        Income-fair PvP — delta-from-baseline scores only
      </p>

      <div className="grid grid-cols-2 gap-6">
        {/* Side A */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col items-center gap-4">
          <div className="w-32 h-32 rounded-full bg-slate-800 border-2 border-emerald-700 border-dashed flex items-center justify-center text-slate-600 text-xs">
            Creature A
          </div>
          <span className="text-white font-semibold">{name}</span>
          <span className="text-xs text-slate-500">Challenger</span>
        </div>

        {/* Side B */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col items-center gap-4">
          <div className="w-32 h-32 rounded-full bg-slate-800 border-2 border-rose-700 border-dashed flex items-center justify-center text-slate-600 text-xs">
            Creature B
          </div>
          <span className="text-slate-400 font-semibold">Select opponent</span>
          <span className="text-xs text-slate-500">Opponent</span>
        </div>
      </div>

      <div className="mt-10 rounded-2xl bg-slate-900 border border-slate-800 p-6 text-center text-slate-600 text-sm">
        Battle resolution UI (Phase 8)
      </div>
    </div>
  );
}
