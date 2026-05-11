'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence, animate } from 'framer-motion';

import { PERSONA_FALLBACK } from '@/lib/personas-fallback';
import { resolveBattle, axisScore } from '@/lib/battle-engine';
import type { PersonaId, BattleResult, AxisResult, StatAxes } from '@/lib/types';

const Creature = dynamic(() => import('@/components/Creature'), { ssr: false });

// ─── Types ────────────────────────────────────────────────────────────────────

interface BattleArenaProps {
  personaA: PersonaId;
  personaB: PersonaId;
  onReset?: () => void;
}

type Phase = 'idle' | 'resolving' | 'complete';

// ─── Axis row with count-up animation ─────────────────────────────────────────

const AXIS_LABELS: Record<string, string> = {
  restraint: 'Restraint', consistency: 'Consistency',
  resilience: 'Resilience', foresight: 'Foresight', recovery: 'Recovery',
};

function AnimatedScore({ target, delay = 0 }: { target: number; delay?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      ref.current = animate(0, target, {
        duration: 0.6,
        ease: 'easeOut',
        onUpdate: (v) => setDisplay(Math.round(v)),
      });
    }, delay);
    return () => {
      clearTimeout(timer);
      ref.current?.stop();
    };
  }, [target, delay]);

  return <span>{display}</span>;
}

function AxisRow({
  result,
  nameA,
  nameB,
}: {
  result: AxisResult;
  nameA: string;
  nameB: string;
}) {
  const [showWinner, setShowWinner] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowWinner(true), 680);
    return () => clearTimeout(t);
  }, []);

  const aWins = result.winner === 'A';
  const bWins = result.winner === 'B';

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden"
    >
      {/* Axis label bar */}
      <div className="text-center py-1.5 text-xs font-bold uppercase tracking-widest text-slate-400 bg-slate-800/60">
        {AXIS_LABELS[result.axis]}
      </div>

      {/* Scores row */}
      <div className="grid grid-cols-3 items-center px-4 py-3 gap-2">
        {/* Side A */}
        <motion.div
          className={`flex flex-col items-center gap-1 rounded-lg px-3 py-2 transition-colors ${
            showWinner && aWins ? 'bg-emerald-900/40 ring-1 ring-emerald-600' : ''
          }`}
          animate={showWinner && aWins ? { scale: [1, 1.07, 1] } : {}}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <span className="text-xs text-slate-500 truncate max-w-[80px] text-center">
            {nameA.split(' ')[0]}
          </span>
          <span
            className={`text-2xl font-extrabold tabular-nums ${
              showWinner && aWins ? 'text-emerald-400' : 'text-slate-200'
            }`}
          >
            <AnimatedScore target={result.aScore} />
          </span>
          {showWinner && aWins && (
            <motion.span
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-xs text-emerald-400 font-bold"
            >
              ▲ WINS
            </motion.span>
          )}
        </motion.div>

        {/* VS */}
        <div className="text-center text-slate-600 text-xs font-bold">vs</div>

        {/* Side B */}
        <motion.div
          className={`flex flex-col items-center gap-1 rounded-lg px-3 py-2 transition-colors ${
            showWinner && bWins ? 'bg-emerald-900/40 ring-1 ring-emerald-600' : ''
          }`}
          animate={showWinner && bWins ? { scale: [1, 1.07, 1] } : {}}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <span className="text-xs text-slate-500 truncate max-w-[80px] text-center">
            {nameB.split(' ')[0]}
          </span>
          <span
            className={`text-2xl font-extrabold tabular-nums ${
              showWinner && bWins ? 'text-emerald-400' : 'text-slate-200'
            }`}
          >
            <AnimatedScore target={result.bScore} />
          </span>
          {showWinner && bWins && (
            <motion.span
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-xs text-emerald-400 font-bold"
            >
              ▲ WINS
            </motion.span>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Compact pre-battle stat mini-display ────────────────────────────────────

function MiniStats({ stats, baseline }: { stats: StatAxes; baseline: StatAxes }) {
  const axes: (keyof StatAxes)[] = ['restraint', 'consistency', 'resilience', 'foresight', 'recovery'];
  return (
    <div className="w-full space-y-1.5 mt-3">
      {axes.map((ax) => {
        const score = Math.round(axisScore(stats[ax], baseline[ax]));
        const pct   = Math.min(100, Math.max(0, score));
        return (
          <div key={ax} className="flex items-center gap-2">
            <span className="text-xs text-slate-500 w-20 shrink-0 capitalize">{ax}</span>
            <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-600/70"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs text-slate-400 w-6 text-right tabular-nums">{score}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function BattleArena({ personaA, personaB, onReset }: BattleArenaProps) {
  const dataA = PERSONA_FALLBACK[personaA];
  const dataB = PERSONA_FALLBACK[personaB];

  const [phase, setPhase]               = useState<Phase>('idle');
  const [result, setResult]             = useState<BattleResult | null>(null);
  const [revealedCount, setRevealedCount] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Cleanup all timers on unmount / reset
  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const handleBattle = useCallback(() => {
    if (phase !== 'idle') return;

    const userA = { ...dataA.simulatedDelta.stats, baseline: dataA.baselineStats };
    const userB = { ...dataB.simulatedDelta.stats, baseline: dataB.baselineStats };
    const battleResult = resolveBattle(userA, userB);
    setResult(battleResult);
    setRevealedCount(0);
    setPhase('resolving');

    // Reveal one axis every 800ms
    for (let i = 0; i < 5; i++) {
      timers.current.push(
        setTimeout(() => setRevealedCount(i + 1), i * 800),
      );
    }
    // 1-second dramatic pause after all axes, then winner
    timers.current.push(
      setTimeout(() => setPhase('complete'), 5 * 800 + 1000),
    );
  }, [phase, dataA, dataB]);

  const handleReset = useCallback(() => {
    clearTimers();
    setPhase('idle');
    setResult(null);
    setRevealedCount(0);
    onReset?.();
  }, [clearTimers, onReset]);

  const winner = result
    ? (result.overallWinner === 'A' ? dataA : dataB)
    : null;
  const loser = result
    ? (result.overallWinner === 'A' ? dataB : dataA)
    : null;

  // Income gap display
  const incomeGap    = Math.round(dataB.incomeRM / dataA.incomeRM);
  const showGapBanner = personaA === 'aisyah' && personaB === 'daniel';

  return (
    <div className="w-full space-y-6">

      {/* ── Income gap callout (MM3 setup) ── */}
      {showGapBanner && (
        <div className="rounded-xl border border-amber-900/50 bg-amber-950/30 px-5 py-3 flex items-center justify-center gap-3 text-sm">
          <span className="text-amber-400 font-bold">
            RM {dataA.incomeRM.toLocaleString()}/mo
          </span>
          <span className="text-slate-500">vs</span>
          <span className="text-amber-400 font-bold">
            RM {dataB.incomeRM.toLocaleString()}/mo
          </span>
          <span className="text-slate-500">—</span>
          <span className="text-amber-300">
            {dataB.name.split(' ')[0]} earns <strong>{incomeGap}×</strong> more
          </span>
        </div>
      )}

      {/* ── Persona cards ── */}
      <div className="grid grid-cols-2 gap-4">
        {/* Side A */}
        <motion.div
          className={`rounded-2xl bg-slate-900 border p-5 flex flex-col items-center transition-colors duration-500 ${
            phase === 'complete' && result?.overallWinner === 'A'
              ? 'border-emerald-600 shadow-lg shadow-emerald-900/30'
              : phase === 'complete'
              ? 'border-slate-800 opacity-60'
              : 'border-slate-800'
          }`}
        >
          <Creature params={dataA.creatureParams} size={180} />
          <p className="mt-3 font-bold text-white text-sm text-center">{dataA.name}</p>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-semibold mt-1 ${
              dataA.incomeTier === 'B40'
                ? 'bg-emerald-900 text-emerald-300'
                : 'bg-violet-900 text-violet-300'
            }`}
          >
            {dataA.incomeTier} · RM {dataA.incomeRM.toLocaleString()}/mo
          </span>
          {dataA.riskFlags.length > 0 && (
            <span className="text-xs text-rose-400 mt-1">
              ⚠ {dataA.riskFlags[0].type.replace(/_/g, ' ')}
            </span>
          )}
          <MiniStats stats={dataA.simulatedDelta.stats} baseline={dataA.baselineStats} />
        </motion.div>

        {/* Side B */}
        <motion.div
          className={`rounded-2xl bg-slate-900 border p-5 flex flex-col items-center transition-colors duration-500 ${
            phase === 'complete' && result?.overallWinner === 'B'
              ? 'border-emerald-600 shadow-lg shadow-emerald-900/30'
              : phase === 'complete'
              ? 'border-slate-800 opacity-60'
              : 'border-slate-800'
          }`}
        >
          <Creature params={dataB.creatureParams} size={180} />
          <p className="mt-3 font-bold text-white text-sm text-center">{dataB.name}</p>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-semibold mt-1 ${
              dataB.incomeTier === 'B40'
                ? 'bg-emerald-900 text-emerald-300'
                : 'bg-violet-900 text-violet-300'
            }`}
          >
            {dataB.incomeTier} · RM {dataB.incomeRM.toLocaleString()}/mo
          </span>
          {dataB.riskFlags.length > 0 && (
            <span className="text-xs text-rose-400 mt-1">
              ⚠ {dataB.riskFlags[0].type.replace(/_/g, ' ')}
            </span>
          )}
          <MiniStats stats={dataB.simulatedDelta.stats} baseline={dataB.baselineStats} />
        </motion.div>
      </div>

      {/* ── Battle / Reset button ── */}
      {phase === 'idle' ? (
        <div className="flex justify-center">
          <motion.button
            onClick={handleBattle}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="px-10 py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-lg tracking-wide shadow-xl shadow-rose-900/40 transition-colors"
          >
            ⚔ BATTLE
          </motion.button>
        </div>
      ) : phase === 'complete' ? (
        <div className="flex justify-center">
          <button
            onClick={handleReset}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition-colors"
          >
            ↺ Rematch
          </button>
        </div>
      ) : (
        <div className="flex justify-center">
          <div className="text-slate-500 text-sm font-semibold animate-pulse">
            Resolving…
          </div>
        </div>
      )}

      {/* ── Axis resolution rows ── */}
      {result && revealedCount > 0 && (
        <div className="space-y-2">
          {result.axisResults.slice(0, revealedCount).map((axisResult) => (
            <AxisRow
              key={axisResult.axis}
              result={axisResult}
              nameA={dataA.name}
              nameB={dataB.name}
            />
          ))}
        </div>
      )}

      {/* ── Winner banner ── */}
      <AnimatePresence>
        {phase === 'complete' && result && winner && loser && (
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="rounded-2xl border border-emerald-700 bg-emerald-950/60 px-6 py-8 text-center"
          >
            {/* Win record badges */}
            <div className="flex justify-center gap-3 mb-4">
              <motion.span
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.15 }}
                className="text-4xl font-extrabold text-emerald-400 tabular-nums"
              >
                {result.overallWinner === 'A' ? result.aWins : result.bWins}
              </motion.span>
              <span className="text-4xl font-extrabold text-slate-600">—</span>
              <motion.span
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.25 }}
                className="text-4xl font-extrabold text-slate-500 tabular-nums"
              >
                {result.overallWinner === 'A' ? result.bWins : result.aWins}
              </motion.span>
            </div>

            {/* Winner name */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-extrabold text-white mb-1 tracking-tight"
            >
              ✦ {winner.name} wins ✦
            </motion.h2>

            {/* The headline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-emerald-400 font-semibold text-base mb-3"
            >
              on improvement velocity, not income
            </motion.p>

            {/* Income gap callout */}
            {showGapBanner && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-slate-400 text-sm"
              >
                {loser.name.split(' ')[0]} earns{' '}
                <strong className="text-slate-300">{incomeGap}× more</strong>
                {' '}— income amounts are never compared. Only improvement velocity is.
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
