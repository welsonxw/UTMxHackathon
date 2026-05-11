'use client';

import { motion } from 'framer-motion';
import type { StatAxes } from '@/lib/types';

interface StatBarsProps {
  current:  StatAxes;
  baseline: StatAxes;
}

const AXES: { key: keyof StatAxes; label: string; color: string; desc: string }[] = [
  { key: 'restraint',   label: 'Restraint',   color: '#10b981', desc: 'Under own spending norms'         },
  { key: 'consistency', label: 'Consistency',  color: '#3b82f6', desc: 'Recurring behavioural motifs'    },
  { key: 'resilience',  label: 'Resilience',   color: '#f59e0b', desc: 'Stability during high-risk windows' },
  { key: 'foresight',   label: 'Foresight',    color: '#8b5cf6', desc: 'Scheduled vs. impulsive transfers'},
  { key: 'recovery',    label: 'Recovery',     color: '#ec4899', desc: 'Return speed after a bad week'   },
];

function DeltaBadge({ delta }: { delta: number }) {
  const rounded = Math.round(delta * 10) / 10;
  if (Math.abs(rounded) < 0.5) {
    return <span className="text-xs text-slate-600 w-12 text-right tabular-nums">—</span>;
  }
  const isPos = rounded > 0;
  return (
    <motion.span
      key={rounded}
      initial={{ opacity: 0, y: isPos ? 4 : -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`text-xs font-semibold w-12 text-right tabular-nums flex items-center justify-end gap-0.5 ${
        isPos ? 'text-emerald-400' : 'text-rose-400'
      }`}
    >
      {isPos ? '▲' : '▼'} {Math.abs(rounded).toFixed(0)}
    </motion.span>
  );
}

export default function StatBars({ current, baseline }: StatBarsProps) {
  return (
    <div className="space-y-4">
      {AXES.map(({ key, label, color, desc }) => {
        const score = Math.round(current[key] * 10) / 10;
        const delta = current[key] - baseline[key];

        return (
          <div key={key} className="group">
            <div className="flex items-center justify-between mb-1.5">
              <div>
                <span className="text-sm font-semibold text-slate-200">{label}</span>
                <span className="ml-2 text-xs text-slate-600 hidden group-hover:inline transition-opacity">
                  {desc}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tabular-nums w-8 text-right">
                  {score.toFixed(0)}
                </span>
                <DeltaBadge delta={delta} />
              </div>
            </div>

            {/* Track */}
            <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: color }}
                initial={false}
                animate={{ width: `${Math.min(Math.max(score, 0), 100)}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>

            {/* Baseline tick mark */}
            <div className="relative h-1 mt-0.5">
              <div
                className="absolute top-0 w-px h-1.5 bg-slate-600"
                style={{ left: `${Math.min(Math.max(baseline[key], 0), 100)}%` }}
                title={`Baseline: ${baseline[key].toFixed(0)}`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
