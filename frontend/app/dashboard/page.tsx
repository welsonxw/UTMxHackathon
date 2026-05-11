'use client';

import { usePersona } from '@/lib/persona-context';
import { PERSONAS } from '@/lib/types';

export default function Dashboard() {
  const { activePersona } = usePersona();
  const { name, incomeTier } = PERSONAS[activePersona];

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">{name}</h2>
        <p className="text-slate-400 mt-1">
          Income tier: <span className="text-emerald-400 font-medium">{incomeTier}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Creature placeholder */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col items-center justify-center min-h-[320px]">
          <div className="w-40 h-40 rounded-full bg-slate-800 border-2 border-dashed border-slate-700 flex items-center justify-center text-slate-600 text-sm">
            Creature (Phase 5)
          </div>
        </div>

        {/* Constellation placeholder */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col items-center justify-center min-h-[320px]">
          <div className="w-full h-48 rounded-xl bg-slate-800 border-2 border-dashed border-slate-700 flex items-center justify-center text-slate-600 text-sm">
            Constellation (Phase 6)
          </div>
        </div>

        {/* Stat bars placeholder */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-4">5-Axis Discipline Profile</h3>
          <div className="space-y-3">
            {['Restraint', 'Consistency', 'Resilience', 'Foresight', 'Recovery'].map((axis) => (
              <div key={axis} className="flex items-center gap-3">
                <span className="w-24 text-sm text-slate-400 shrink-0">{axis}</span>
                <div className="flex-1 h-2 bg-slate-800 rounded-full">
                  <div className="h-2 rounded-full bg-emerald-600 w-1/2" />
                </div>
                <span className="text-sm text-slate-500 w-8 text-right">—</span>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <button className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors">
              Simulate This Week (Phase 7)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
