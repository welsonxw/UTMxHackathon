'use client';

import { usePersona } from '@/lib/persona-context';
import { PERSONAS, type PersonaId } from '@/lib/types';

const TIER_COLOR: Record<'B40' | 'T20', string> = {
  B40: 'text-emerald-400',
  T20: 'text-violet-400',
};

export default function PersonaSwitcher() {
  const { activePersona, setActivePersona } = usePersona();
  const active = PERSONAS[activePersona];

  return (
    <div className="flex items-center gap-2">
      <span className={`text-xs font-semibold ${TIER_COLOR[active.incomeTier]}`}>
        {active.incomeTier}
      </span>
      <select
        value={activePersona}
        onChange={(e) => setActivePersona(e.target.value as PersonaId)}
        className="bg-slate-800 border border-slate-700 text-slate-100 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
      >
        {(Object.keys(PERSONAS) as PersonaId[]).map((id) => (
          <option key={id} value={id}>
            {PERSONAS[id].name}
          </option>
        ))}
      </select>
    </div>
  );
}
