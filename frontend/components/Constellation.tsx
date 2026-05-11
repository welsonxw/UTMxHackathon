'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Transaction, TransactionCategory } from '@/lib/types';

// ─── Category colour palette (Section 9) ─────────────────────────────────────

export const CATEGORY_COLORS: Record<TransactionCategory, string> = {
  food_mamak:             '#F5C4B3',
  food_grab:              '#F0997B',
  food_groceries:         '#C0DD97',
  transport_grab:         '#85B7EB',
  transport_tng:          '#378ADD',
  shopping_online_shopee: '#D4537E',
  shopping_online_lazada: '#ED93B1',
  shopping_offline_mall:  '#F4C0D1',
  subscription:           '#7F77DD',
  utilities:              '#888780',
  salary:                 '#1D9E75',
  savings_transfer:       '#0F6E56',
  flexicredit_drawdown:   '#FF6B35',
  flexicredit_repayment:  '#E34B4B',
  medical:                '#B8E4F9',
  entertainment:          '#FFD166',
  travel:                 '#06D6A0',
  family_transfer:        '#F4E04D',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

interface PolarPoint {
  id:       string;
  x:        number;
  y:        number;
  angle:    number;
  radius:   number;
  color:    string;
  category: TransactionCategory;
  isNew:    boolean;
  newIdx:   number; // position in newTransactionIds (for stagger delay)
}

interface Connection {
  x1: number; y1: number;
  x2: number; y2: number;
  color: string;
}

function toPoint(
  tx: Transaction,
  cx: number,
  cy: number,
  isNew: boolean,
  newIdx: number,
): PolarPoint {
  const hour   = new Date(tx.timestamp).getHours();
  const angle  = (hour / 24) * 360;                   // 0–360°
  const radius = Math.log10(tx.amount + 1) * 40;      // Section 9 formula
  // Rotate so midnight is at top (−90°)
  const rad = ((angle - 90) / 360) * 2 * Math.PI;
  return {
    id:       tx.transactionId,
    x:        cx + radius * Math.cos(rad),
    y:        cy + radius * Math.sin(rad),
    angle,
    radius,
    color:    CATEGORY_COLORS[tx.category] ?? '#888780',
    category: tx.category,
    isNew,
    newIdx,
  };
}

function angularDist(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

function buildConnections(points: PolarPoint[]): Connection[] {
  const lines: Connection[] = [];
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const a = points[i];
      const b = points[j];
      if (a.category !== b.category) continue;
      if (angularDist(a.angle, b.angle) >= 30) continue;
      if (Math.abs(a.radius - b.radius) >= 50) continue;
      lines.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, color: a.color });
    }
  }
  return lines;
}

// Ring reference amounts (log-scale)
const RINGS = [
  { r: 50,  label: '~RM18'  },
  { r: 100, label: '~RM315' },
  { r: 150, label: '~RM5.6k' },
];

const HOUR_LABELS: { hour: number; label: string }[] = [
  { hour: 0,  label: 'midnight' },
  { hour: 6,  label: '6 am'     },
  { hour: 12, label: 'noon'     },
  { hour: 18, label: '6 pm'     },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface ConstellationProps {
  transactions:        Transaction[];
  newTransactionIds?:  string[];
  width?:              number;
  height?:             number;
}

export default function Constellation({
  transactions,
  newTransactionIds = [],
  width  = 600,
  height = 600,
}: ConstellationProps) {
  const cx = width  / 2;
  const cy = height / 2;

  const points = useMemo<PolarPoint[]>(() => {
    return transactions.map((tx) => {
      const newIdx = newTransactionIds.indexOf(tx.transactionId);
      return toPoint(tx, cx, cy, newIdx !== -1, newIdx);
    });
  }, [transactions, newTransactionIds, cx, cy]);

  const connections = useMemo<Connection[]>(() => buildConnections(points), [points]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="rounded-2xl bg-slate-950"
      style={{ display: 'block' }}
    >
      {/* ── Reference rings ── */}
      {RINGS.map(({ r, label }) => (
        <g key={r}>
          <circle
            cx={cx} cy={cy} r={r}
            fill="none" stroke="#ffffff" strokeOpacity={0.05} strokeWidth={1}
          />
          <text
            x={cx + r + 4} y={cy}
            fontSize={9} fill="#4B5563"
            dominantBaseline="middle"
          >
            {label}
          </text>
        </g>
      ))}

      {/* ── Hour spokes + labels ── */}
      {HOUR_LABELS.map(({ hour, label }) => {
        const rad = ((hour / 24) * 360 - 90) / 360 * 2 * Math.PI;
        const spokeR = 165;
        return (
          <g key={hour}>
            <line
              x1={cx} y1={cy}
              x2={cx + spokeR * Math.cos(rad)}
              y2={cy + spokeR * Math.sin(rad)}
              stroke="#ffffff" strokeOpacity={0.04} strokeWidth={1}
            />
            <text
              x={cx + (spokeR + 18) * Math.cos(rad)}
              y={cy + (spokeR + 18) * Math.sin(rad)}
              fontSize={10} fill="#6B7280"
              textAnchor="middle" dominantBaseline="middle"
            >
              {label}
            </text>
          </g>
        );
      })}

      {/* ── Connection lines ── */}
      {connections.map((ln, i) => (
        <line
          key={i}
          x1={ln.x1} y1={ln.y1} x2={ln.x2} y2={ln.y2}
          stroke={ln.color} strokeOpacity={0.3} strokeWidth={0.5}
        />
      ))}

      {/* ── Points ── */}
      {points.map((pt) => {
        // Stagger: 8 points over 2 s → 0.25 s apart
        const delay      = pt.isNew ? pt.newIdx * 0.25 : 0;
        const transition = pt.isNew
          ? { duration: 0.6, ease: 'easeOut' as const, delay }
          : undefined;

        return (
          <g key={pt.id}>
            {/* Soft glow halo (only for new points on entry, then stays subtle) */}
            <motion.circle
              cx={pt.x} cy={pt.y} r={10}
              fill={pt.color}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              initial={pt.isNew ? { scale: 0, opacity: 0 } : { opacity: 0.12 }}
              animate={{ scale: 1, opacity: 0.12 }}
              transition={transition}
            />
            {/* Main dot */}
            <motion.circle
              cx={pt.x} cy={pt.y} r={4.5}
              fill={pt.color}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              initial={pt.isNew ? { scale: 0, opacity: 0 } : { opacity: 0.92 }}
              animate={{ scale: 1, opacity: 0.92 }}
              transition={transition}
            />
          </g>
        );
      })}
    </svg>
  );
}
