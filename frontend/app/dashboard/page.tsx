'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { doc, onSnapshot } from 'firebase/firestore';

import { usePersona } from '@/lib/persona-context';
import { db } from '@/lib/firebase';
import { PERSONA_FALLBACK, type PersonaFallback } from '@/lib/personas-fallback';
import { PERSONAS, type StatAxes, type Transaction } from '@/lib/types';

import StatBars      from '@/components/StatBars';
import SimulateButton from '@/components/SimulateButton';

// SSR-safe: p5.js and framer-motion SVG need the browser
const Creature = dynamic(() => import('@/components/Creature'), {
  ssr: false,
  loading: () => <div className="w-[252px] h-[252px] rounded-2xl bg-slate-800 animate-pulse" />,
});
const Constellation = dynamic(() => import('@/components/Constellation'), {
  ssr: false,
  loading: () => <div className="w-[460px] h-[460px] rounded-2xl bg-slate-800 animate-pulse" />,
});

// How long until the simulate animation finishes (8 points × 250ms + 800ms buffer)
const SIM_DURATION_MS = 8 * 250 + 800;

// ── Tier badge ─────────────────────────────────────────────────────────────────

const TIER_STYLE: Record<'B40' | 'T20', string> = {
  B40: 'bg-emerald-900 text-emerald-300 border-emerald-800',
  T20: 'bg-violet-900  text-violet-300  border-violet-800',
};

export default function Dashboard() {
  const { activePersona } = usePersona();
  const { incomeRM } = PERSONAS[activePersona];

  // ── Data state ──────────────────────────────────────────────────────────────
  const [data, setData]               = useState<PersonaFallback>(PERSONA_FALLBACK[activePersona]);
  const [displayStats, setDisplayStats] = useState<StatAxes>(PERSONA_FALLBACK[activePersona].currentWeekStats);
  const [transactions, setTransactions] = useState<Transaction[]>(PERSONA_FALLBACK[activePersona].transactions);
  const [animatingIds, setAnimatingIds] = useState<string[]>([]);

  // ── Simulate state ──────────────────────────────────────────────────────────
  const [isSimulated, setIsSimulated]   = useState(false);
  const [isAnimating, setIsAnimating]   = useState(false);
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Load / reset when persona changes ──────────────────────────────────────
  useEffect(() => {
    // Cancel any in-flight simulate timer
    if (clearTimerRef.current) clearTimeout(clearTimerRef.current);

    const fallback = PERSONA_FALLBACK[activePersona];

    // Instant load from local fallback (never shows loading spinner)
    setData(fallback);
    setDisplayStats(fallback.currentWeekStats);
    setTransactions(fallback.transactions);
    setAnimatingIds([]);
    setIsSimulated(false);
    setIsAnimating(false);

    // Attempt real-time Firestore upgrade — only when Firebase is configured.
    // If API key is the placeholder value, skip connection to avoid console warnings.
    const isConfigured = process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'placeholder';
    let unsubscribe: (() => void) | null = null;
    if (isConfigured) {
      try {
        unsubscribe = onSnapshot(
          doc(db, 'users', activePersona),
          (snap) => {
            if (!snap.exists()) return;
            const d = snap.data() as Partial<PersonaFallback>;
            if (d.currentWeekStats) setDisplayStats(d.currentWeekStats);
            if (d.transactions)     setTransactions(d.transactions);
            setData((prev) => ({ ...prev, ...d }));
          },
          () => { /* Firestore connection failed — precomputed data already shown */ },
        );
      } catch {
        // Firebase unavailable
      }
    }

    return () => unsubscribe?.();
  }, [activePersona]);

  // ── Simulate handler ────────────────────────────────────────────────────────
  const handleSimulate = useCallback(() => {
    if (isSimulated || isAnimating) return;
    setIsAnimating(true);

    const delta    = data.simulatedDelta;
    const newTxs   = delta.newTransactions ?? [];
    const newIds   = newTxs.map((t) => t.transactionId);

    // 1. Add new transactions to constellation → they animate in
    setTransactions((prev) => [...prev, ...newTxs]);
    setAnimatingIds(newIds);

    // 2. Swap stat bars after a short delay (let constellation start first)
    setTimeout(() => setDisplayStats(delta.stats), 300);

    // 3. Finish
    clearTimerRef.current = setTimeout(() => {
      setAnimatingIds([]);
      setIsAnimating(false);
      setIsSimulated(true);
    }, SIM_DURATION_MS);
  }, [data, isSimulated, isAnimating]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 px-6 py-8">

      {/* ── Header row ── */}
      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-2xl font-bold text-white">{data.name}</h2>
        <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${TIER_STYLE[data.incomeTier]}`}>
          {data.incomeTier}
        </span>
        <span className="text-slate-500 text-sm">
          RM {incomeRM.toLocaleString()}/mo
        </span>
        {data.riskFlags.length > 0 && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-rose-900/60 text-rose-300 border border-rose-800 animate-pulse">
            ⚠ {data.riskFlags[0].type.replace(/_/g, ' ')}
          </span>
        )}
      </div>

      {/* ── Main 3-column grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_300px] gap-6 items-start">

        {/* Left: Creature */}
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 w-full flex justify-center">
            <Creature params={data.creatureParams} size={252} />
          </div>
          {data.riskFlags.length > 0 && (
            <div className="w-full rounded-xl bg-rose-950/40 border border-rose-900/50 px-4 py-3 text-xs text-rose-300 leading-relaxed">
              <p className="font-semibold mb-1">⚠ Risk detected</p>
              {data.riskFlags.map((f) => (
                <p key={f.type} className="text-rose-400/80">
                  {f.type.replace(/_/g, ' ')} — {f.severity} severity
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Centre: Constellation */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 flex flex-col items-center gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 self-start">
            Behaviour Constellation
          </p>
          <Constellation
            transactions={transactions}
            newTransactionIds={animatingIds}
            width={460}
            height={460}
          />
          <p className="text-xs text-slate-600 self-start">
            Angle = hour of day · Radius = log(RM) · Color = category
          </p>
        </div>

        {/* Right: Stat bars + simulate button */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
            <div className="flex items-center justify-between mb-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                5-Axis Profile
              </p>
              <p className="text-xs text-slate-600">vs. 90-day baseline ↓</p>
            </div>
            <StatBars current={displayStats} baseline={data.baselineStats} />
          </div>

          <SimulateButton
            onSimulate={handleSimulate}
            isSimulated={isSimulated}
            isAnimating={isAnimating}
            personaName={data.name}
          />
        </div>
      </div>
    </div>
  );
}
