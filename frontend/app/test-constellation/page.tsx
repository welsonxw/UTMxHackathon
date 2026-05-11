'use client';

import { useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import type { Transaction } from '@/lib/types';
import { CATEGORY_COLORS } from '@/components/Constellation';

// SSR-safe: framer-motion uses browser APIs
const Constellation = dynamic(() => import('@/components/Constellation'), { ssr: false });

// ─── Aisyah's base transaction set ───────────────────────────────────────────
// Spread across realistic hours; distinct categories so clusters form visually.

const BASE: Transaction[] = [
  // Salary (09:00)
  { transactionId: 'a01', accountId: 'aisyah', amount: 2200, category: 'salary',         merchant: 'Mydin JB',        timestamp: '2024-01-25T09:00:00+08:00', isRecurring: true,  transactionType: 'credit'   },
  // Friday savings transfers (20:00)
  { transactionId: 'a02', accountId: 'aisyah', amount: 50,   category: 'savings_transfer', merchant: 'GXBank Savings', timestamp: '2024-01-05T20:00:00+08:00', isRecurring: true,  transactionType: 'transfer' },
  { transactionId: 'a03', accountId: 'aisyah', amount: 50,   category: 'savings_transfer', merchant: 'GXBank Savings', timestamp: '2024-01-12T20:05:00+08:00', isRecurring: true,  transactionType: 'transfer' },
  { transactionId: 'a04', accountId: 'aisyah', amount: 50,   category: 'savings_transfer', merchant: 'GXBank Savings', timestamp: '2024-01-19T19:58:00+08:00', isRecurring: true,  transactionType: 'transfer' },
  // Thursday mamak (19:30)
  { transactionId: 'a05', accountId: 'aisyah', amount: 18,   category: 'food_mamak',       merchant: 'Mamak Pelita',   timestamp: '2024-01-04T19:30:00+08:00', isRecurring: false, transactionType: 'debit'    },
  { transactionId: 'a06', accountId: 'aisyah', amount: 22,   category: 'food_mamak',       merchant: 'Mamak Pelita',   timestamp: '2024-01-11T19:25:00+08:00', isRecurring: false, transactionType: 'debit'    },
  { transactionId: 'a07', accountId: 'aisyah', amount: 15,   category: 'food_mamak',       merchant: 'Mamak Pelita',   timestamp: '2024-01-18T19:40:00+08:00', isRecurring: false, transactionType: 'debit'    },
  { transactionId: 'a08', accountId: 'aisyah', amount: 28,   category: 'food_mamak',       merchant: 'Old Town WC',   timestamp: '2024-01-25T20:00:00+08:00', isRecurring: false, transactionType: 'debit'    },
  // Grab food (various daytime)
  { transactionId: 'a09', accountId: 'aisyah', amount: 14,   category: 'food_grab',        merchant: 'GrabFood',      timestamp: '2024-01-08T12:15:00+08:00', isRecurring: false, transactionType: 'debit'    },
  { transactionId: 'a10', accountId: 'aisyah', amount: 17,   category: 'food_grab',        merchant: 'GrabFood',      timestamp: '2024-01-15T12:30:00+08:00', isRecurring: false, transactionType: 'debit'    },
  // Groceries at Mydin (weekends, ~10:00)
  { transactionId: 'a11', accountId: 'aisyah', amount: 72,   category: 'food_groceries',   merchant: 'Mydin',         timestamp: '2024-01-06T10:20:00+08:00', isRecurring: false, transactionType: 'debit'    },
  { transactionId: 'a12', accountId: 'aisyah', amount: 65,   category: 'food_groceries',   merchant: 'Mydin',         timestamp: '2024-01-13T10:45:00+08:00', isRecurring: false, transactionType: 'debit'    },
  { transactionId: 'a13', accountId: 'aisyah', amount: 80,   category: 'food_groceries',   merchant: 'Tesco',         timestamp: '2024-01-20T11:00:00+08:00', isRecurring: false, transactionType: 'debit'    },
  // Touch n Go reload (biweekly, 08:00)
  { transactionId: 'a14', accountId: 'aisyah', amount: 50,   category: 'transport_tng',    merchant: 'Touch n Go',    timestamp: '2024-01-07T08:10:00+08:00', isRecurring: true,  transactionType: 'debit'    },
  { transactionId: 'a15', accountId: 'aisyah', amount: 50,   category: 'transport_tng',    merchant: 'Touch n Go',    timestamp: '2024-01-21T08:05:00+08:00', isRecurring: true,  transactionType: 'debit'    },
  // Netflix (monthly, 22:00)
  { transactionId: 'a16', accountId: 'aisyah', amount: 18,   category: 'subscription',     merchant: 'Netflix',       timestamp: '2024-01-01T22:00:00+08:00', isRecurring: true,  transactionType: 'debit'    },
  // Utilities (TNB, 09:30)
  { transactionId: 'a17', accountId: 'aisyah', amount: 42,   category: 'utilities',        merchant: 'TNB',           timestamp: '2024-01-10T09:30:00+08:00', isRecurring: true,  transactionType: 'debit'    },
  // Light online shopping (rare)
  { transactionId: 'a18', accountId: 'aisyah', amount: 38,   category: 'shopping_online_shopee', merchant: 'Shopee',  timestamp: '2024-01-14T21:10:00+08:00', isRecurring: false, transactionType: 'debit'    },
  // Grab transport (morning commute, ~07:30)
  { transactionId: 'a19', accountId: 'aisyah', amount: 12,   category: 'transport_grab',   merchant: 'Grab',          timestamp: '2024-01-08T07:35:00+08:00', isRecurring: false, transactionType: 'debit'    },
  { transactionId: 'a20', accountId: 'aisyah', amount: 11,   category: 'transport_grab',   merchant: 'Grab',          timestamp: '2024-01-15T07:40:00+08:00', isRecurring: false, transactionType: 'debit'    },
  // Watson's / Guardian (evening errand, ~18:00)
  { transactionId: 'a21', accountId: 'aisyah', amount: 24,   category: 'medical',          merchant: "Watson's",      timestamp: '2024-01-09T18:20:00+08:00', isRecurring: false, transactionType: 'debit'    },
];

// ─── 8 simulated "this week" transactions (Magic Moment 1) ───────────────────
// Aisyah saved RM70 instead of RM50 (+40%), plus normal weekly activity.

const SIMULATED: Transaction[] = [
  { transactionId: 'sim01', accountId: 'aisyah', amount: 70,  category: 'savings_transfer',     merchant: 'GXBank Savings', timestamp: '2024-02-02T20:02:00+08:00', isRecurring: true,  transactionType: 'transfer' },
  { transactionId: 'sim02', accountId: 'aisyah', amount: 25,  category: 'food_mamak',            merchant: 'Mamak Pelita',   timestamp: '2024-02-01T19:32:00+08:00', isRecurring: false, transactionType: 'debit'    },
  { transactionId: 'sim03', accountId: 'aisyah', amount: 13,  category: 'transport_grab',        merchant: 'Grab',           timestamp: '2024-01-29T07:42:00+08:00', isRecurring: false, transactionType: 'debit'    },
  { transactionId: 'sim04', accountId: 'aisyah', amount: 68,  category: 'food_groceries',        merchant: 'Mydin',          timestamp: '2024-02-03T10:30:00+08:00', isRecurring: false, transactionType: 'debit'    },
  { transactionId: 'sim05', accountId: 'aisyah', amount: 18,  category: 'subscription',          merchant: 'Netflix',        timestamp: '2024-02-01T22:00:00+08:00', isRecurring: true,  transactionType: 'debit'    },
  { transactionId: 'sim06', accountId: 'aisyah', amount: 15,  category: 'food_grab',             merchant: 'GrabFood',       timestamp: '2024-01-31T12:20:00+08:00', isRecurring: false, transactionType: 'debit'    },
  { transactionId: 'sim07', accountId: 'aisyah', amount: 50,  category: 'transport_tng',         merchant: 'Touch n Go',     timestamp: '2024-01-28T08:05:00+08:00', isRecurring: true,  transactionType: 'debit'    },
  { transactionId: 'sim08', accountId: 'aisyah', amount: 8,   category: 'food_mamak',            merchant: 'Mamak Pelita',   timestamp: '2024-01-30T07:55:00+08:00', isRecurring: false, transactionType: 'debit'    },
];

const SIM_IDS = SIMULATED.map((t) => t.transactionId);
const ANIMATION_DURATION_MS = SIM_IDS.length * 250 + 800; // stagger + last animation

// ─── Legend ───────────────────────────────────────────────────────────────────

const LEGEND_ITEMS: { category: string; label: string; color: string }[] = [
  { category: 'savings_transfer',  label: 'Savings transfer', color: CATEGORY_COLORS.savings_transfer  },
  { category: 'food_mamak',        label: 'Mamak',            color: CATEGORY_COLORS.food_mamak        },
  { category: 'food_grab',         label: 'GrabFood',         color: CATEGORY_COLORS.food_grab         },
  { category: 'food_groceries',    label: 'Groceries',        color: CATEGORY_COLORS.food_groceries    },
  { category: 'transport_tng',     label: 'Touch n Go',       color: CATEGORY_COLORS.transport_tng     },
  { category: 'transport_grab',    label: 'Grab ride',        color: CATEGORY_COLORS.transport_grab    },
  { category: 'subscription',      label: 'Netflix',          color: CATEGORY_COLORS.subscription      },
  { category: 'utilities',         label: 'Utilities',        color: CATEGORY_COLORS.utilities         },
  { category: 'salary',            label: 'Salary',           color: CATEGORY_COLORS.salary            },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TestConstellationPage() {
  const [transactions, setTransactions]       = useState<Transaction[]>(BASE);
  const [animatingIds, setAnimatingIds]       = useState<string[]>([]);
  const [simulated, setSimulated]             = useState(false);
  const [animating, setAnimating]             = useState(false);
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSimulate = useCallback(() => {
    if (animating || simulated) return;
    setAnimating(true);

    // Add all simulated transactions at once; IDs drive the stagger delay
    setTransactions((prev) => [...prev, ...SIMULATED]);
    setAnimatingIds(SIM_IDS);

    // Clear animating state after all animations complete
    clearTimer.current = setTimeout(() => {
      setAnimatingIds([]);
      setAnimating(false);
      setSimulated(true);
    }, ANIMATION_DURATION_MS);
  }, [animating, simulated]);

  const handleReset = useCallback(() => {
    if (clearTimer.current) clearTimeout(clearTimer.current);
    setTransactions(BASE);
    setAnimatingIds([]);
    setAnimating(false);
    setSimulated(false);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10">
      <h1 className="text-2xl font-bold text-white mb-1">
        Constellation Test — Phase 6
      </h1>
      <p className="text-slate-400 text-sm mb-8">
        Aisyah's transactions as a polar time-of-day / log(amount) field.
        Connected points are same-category within 30° and 50px.
      </p>

      <div className="flex flex-col xl:flex-row gap-8 items-start">
        {/* SVG */}
        <div className="flex-shrink-0">
          <Constellation
            transactions={transactions}
            newTransactionIds={animatingIds}
            width={540}
            height={540}
          />
        </div>

        {/* Controls + legend */}
        <div className="flex flex-col gap-6">
          {/* Simulate button */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
            <h2 className="text-base font-semibold text-white mb-1">
              Magic Moment 1
            </h2>
            <p className="text-slate-400 text-sm mb-4">
              Click to simulate this week — 8 new transactions animate in sequentially over ~2 seconds.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleSimulate}
                disabled={animating || simulated}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  animating || simulated
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {animating ? 'Animating…' : simulated ? 'Simulated ✓' : '✦ Simulate this week'}
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Reset
              </button>
            </div>
            {simulated && (
              <p className="text-emerald-400 text-xs mt-3">
                RM70 savings transfer visible — larger radius than usual RM50
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
              Current
            </p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Points</span>
                <span className="text-white">{transactions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Angle</span>
                <span className="text-slate-500 text-xs">hour ÷ 24 × 360°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Radius</span>
                <span className="text-slate-500 text-xs">log₁₀(RM + 1) × 40</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">
              Category colours
            </p>
            <div className="grid grid-cols-1 gap-y-2">
              {LEGEND_ITEMS.map(({ category, label, color }) => (
                <div key={category} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-slate-400 text-xs">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
