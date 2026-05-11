'use client';

import Link from 'next/link';
import { usePersona } from '@/lib/persona-context';
import { PERSONAS, type PersonaId } from '@/lib/types';

const PERSONA_FLAVOUR: Record<PersonaId, { subtitle: string; tag: string; tagColor: string }> = {
  aisyah:   { subtitle: 'Retail assistant · Johor Bahru',    tag: 'B40 · RM 2,200/mo',  tagColor: 'bg-emerald-900 text-emerald-300' },
  daniel:   { subtitle: 'Software engineer · KL condo',       tag: 'T20 · RM 9,500/mo',  tagColor: 'bg-rose-900 text-rose-300'     },
  mei_ling: { subtitle: 'Grab driver · single mother',        tag: 'B40 · RM ~2,650/mo', tagColor: 'bg-amber-900 text-amber-300'   },
  hafiz:    { subtitle: 'Pharmacist · Penang',                 tag: 'T20 · RM 7,200/mo',  tagColor: 'bg-violet-900 text-violet-300' },
};

export default function Home() {
  const { activePersona, setActivePersona } = usePersona();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12">
      <h1 className="text-5xl font-extrabold text-white mb-2 tracking-tight">
        Wealth<span className="text-emerald-400">Drop</span>
      </h1>
      <p className="text-slate-400 text-lg mb-12 text-center max-w-md">
        Income-fair gamified savings for GXBank. Battle friends on improvement velocity — never on income.
      </p>

      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">
        Select demo persona
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mb-10">
        {(Object.keys(PERSONAS) as PersonaId[]).map((id) => {
          const { name, incomeRM } = PERSONAS[id];
          const { subtitle, tag, tagColor } = PERSONA_FLAVOUR[id];
          const isActive = id === activePersona;
          return (
            <button
              key={id}
              onClick={() => setActivePersona(id)}
              className={`text-left p-5 rounded-2xl border transition-all duration-150 ${
                isActive
                  ? 'border-emerald-500 bg-slate-800 ring-1 ring-emerald-500'
                  : 'border-slate-700 bg-slate-900 hover:border-slate-500'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="font-semibold text-white">{name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${tagColor}`}>
                  {tag}
                </span>
              </div>
              <p className="text-sm text-slate-400">{subtitle}</p>
            </button>
          );
        })}
      </div>

      <div className="flex gap-4">
        <Link
          href="/dashboard"
          className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors"
        >
          View Dashboard
        </Link>
        <Link
          href="/battle"
          className="px-6 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-colors"
        >
          Battle Arena
        </Link>
      </div>
    </div>
  );
}
