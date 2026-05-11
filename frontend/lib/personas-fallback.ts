/**
 * Static fallback data derived from ml-pipeline/output/ JSON files.
 * Used when Firestore is unavailable or not yet populated.
 *
 * TODO: remove this module before demo once Firestore is seeded by Phase 3 pipeline.
 * Stats: baseline = 90-day rolling, currentWeekStats = latest computed week.
 * Creature params: hand-tuned per Section 10 for visual distinctiveness.
 * Simulated deltas: curated per Section 10 demo scenarios.
 */

import type {
  StatAxes, CreatureParams, RiskFlag,
  Transaction, SimulatedDelta, PersonaId,
} from './types';

export interface PersonaFallback {
  name:             string;
  incomeTier:       'B40' | 'T20';
  incomeRM:         number;
  baselineStats:    StatAxes;
  currentWeekStats: StatAxes;
  creatureParams:   CreatureParams;
  riskFlags:        RiskFlag[];
  simulatedDelta:   SimulatedDelta;
  transactions:     Transaction[];
}

// ─── Aisyah Binti Hassan ──────────────────────────────────────────────────────

const aisyahBase: Transaction[] = [
  { transactionId:'a-tx-01', accountId:'aisyah', amount:2200,  category:'salary',                 merchant:'Mydin HR',       timestamp:'2025-01-01T09:08:00', isRecurring:true,  transactionType:'credit'   },
  { transactionId:'a-tx-02', accountId:'aisyah', amount:50,    category:'savings_transfer',        merchant:'GXBank Savings', timestamp:'2025-01-03T09:27:00', isRecurring:true,  transactionType:'transfer' },
  { transactionId:'a-tx-03', accountId:'aisyah', amount:11.47, category:'transport_grab',          merchant:'Grab',           timestamp:'2025-01-01T09:30:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'a-tx-04', accountId:'aisyah', amount:8.72,  category:'transport_grab',          merchant:'Grab',           timestamp:'2025-01-02T08:01:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'a-tx-05', accountId:'aisyah', amount:24.11, category:'food_mamak',              merchant:'Mamak Pelita',   timestamp:'2025-01-02T17:44:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'a-tx-06', accountId:'aisyah', amount:12.84, category:'food_grab',               merchant:'Grab Food',      timestamp:'2025-01-05T15:54:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'a-tx-07', accountId:'aisyah', amount:31.86, category:'food_groceries',          merchant:'Tesco',          timestamp:'2025-01-05T16:59:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'a-tx-08', accountId:'aisyah', amount:18,    category:'subscription',            merchant:'Netflix',        timestamp:'2025-01-07T22:00:00', isRecurring:true,  transactionType:'debit'    },
  { transactionId:'a-tx-09', accountId:'aisyah', amount:50,    category:'transport_tng',           merchant:'Touch n Go',     timestamp:'2025-01-07T08:10:00', isRecurring:true,  transactionType:'debit'    },
  { transactionId:'a-tx-10', accountId:'aisyah', amount:50,    category:'savings_transfer',        merchant:'GXBank Savings', timestamp:'2025-01-10T20:00:00', isRecurring:true,  transactionType:'transfer' },
  { transactionId:'a-tx-11', accountId:'aisyah', amount:68.3,  category:'food_groceries',          merchant:'Mydin',          timestamp:'2025-01-11T10:20:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'a-tx-12', accountId:'aisyah', amount:18.5,  category:'food_mamak',              merchant:'Mamak Pelita',   timestamp:'2025-01-09T19:30:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'a-tx-13', accountId:'aisyah', amount:9.1,   category:'transport_grab',          merchant:'Grab',           timestamp:'2025-01-13T07:40:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'a-tx-14', accountId:'aisyah', amount:14.2,  category:'food_grab',               merchant:'Grab Food',      timestamp:'2025-01-14T12:15:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'a-tx-15', accountId:'aisyah', amount:42,    category:'utilities',               merchant:'TNB',            timestamp:'2025-01-15T09:30:00', isRecurring:true,  transactionType:'debit'    },
  { transactionId:'a-tx-16', accountId:'aisyah', amount:50,    category:'savings_transfer',        merchant:'GXBank Savings', timestamp:'2025-01-17T20:05:00', isRecurring:true,  transactionType:'transfer' },
  { transactionId:'a-tx-17', accountId:'aisyah', amount:22.4,  category:'food_mamak',              merchant:'Mamak Pelita',   timestamp:'2025-01-16T19:25:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'a-tx-18', accountId:'aisyah', amount:72.1,  category:'food_groceries',          merchant:'Tesco',          timestamp:'2025-01-18T10:45:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'a-tx-19', accountId:'aisyah', amount:38,    category:'shopping_online_shopee',  merchant:'Shopee',         timestamp:'2025-01-19T21:10:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'a-tx-20', accountId:'aisyah', amount:50,    category:'transport_tng',           merchant:'Touch n Go',     timestamp:'2025-01-21T08:05:00', isRecurring:true,  transactionType:'debit'    },
  { transactionId:'a-tx-21', accountId:'aisyah', amount:15.3,  category:'food_mamak',              merchant:'Old Town WC',    timestamp:'2025-01-23T19:40:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'a-tx-22', accountId:'aisyah', amount:50,    category:'savings_transfer',        merchant:'GXBank Savings', timestamp:'2025-01-24T20:00:00', isRecurring:true,  transactionType:'transfer' },
  { transactionId:'a-tx-23', accountId:'aisyah', amount:24,    category:'medical',                 merchant:"Watson's",       timestamp:'2025-01-22T18:20:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'a-tx-24', accountId:'aisyah', amount:10.5,  category:'transport_grab',          merchant:'Grab',           timestamp:'2025-01-27T07:35:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'a-tx-25', accountId:'aisyah', amount:16.8,  category:'food_grab',               merchant:'Grab Food',      timestamp:'2025-01-28T12:30:00', isRecurring:false, transactionType:'debit'    },
];

// Simulated "this week": saved RM70 instead of RM50, clear restraint+foresight gains
const aisyahSimTxs: Transaction[] = [
  { transactionId:'a-sim-01', accountId:'aisyah', amount:70,   category:'savings_transfer', merchant:'GXBank Savings', timestamp:'2025-02-07T20:02:00', isRecurring:true,  transactionType:'transfer' },
  { transactionId:'a-sim-02', accountId:'aisyah', amount:22,   category:'food_mamak',       merchant:'Mamak Pelita',  timestamp:'2025-02-06T19:32:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'a-sim-03', accountId:'aisyah', amount:12,   category:'transport_grab',   merchant:'Grab',          timestamp:'2025-02-03T07:42:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'a-sim-04', accountId:'aisyah', amount:65,   category:'food_groceries',   merchant:'Mydin',         timestamp:'2025-02-08T10:30:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'a-sim-05', accountId:'aisyah', amount:18,   category:'subscription',     merchant:'Netflix',       timestamp:'2025-02-01T22:00:00', isRecurring:true,  transactionType:'debit'    },
  { transactionId:'a-sim-06', accountId:'aisyah', amount:14,   category:'food_grab',        merchant:'Grab Food',     timestamp:'2025-02-05T12:20:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'a-sim-07', accountId:'aisyah', amount:50,   category:'transport_tng',    merchant:'Touch n Go',    timestamp:'2025-02-04T08:05:00', isRecurring:true,  transactionType:'debit'    },
  { transactionId:'a-sim-08', accountId:'aisyah', amount:8,    category:'food_mamak',       merchant:'Mamak Pelita',  timestamp:'2025-02-04T07:55:00', isRecurring:false, transactionType:'debit'    },
];

// ─── Daniel Tan Wei Ming ──────────────────────────────────────────────────────

const danielBase: Transaction[] = [
  { transactionId:'d-tx-01', accountId:'daniel', amount:9500,  category:'salary',                  merchant:'Tech Corp',      timestamp:'2025-01-25T09:00:00', isRecurring:true,  transactionType:'credit'   },
  { transactionId:'d-tx-02', accountId:'daniel', amount:18,    category:'subscription',            merchant:'Netflix',        timestamp:'2025-01-01T06:05:00', isRecurring:true,  transactionType:'debit'    },
  { transactionId:'d-tx-03', accountId:'daniel', amount:34.09, category:'food_grab',               merchant:'Grab Food',      timestamp:'2025-01-01T21:02:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'d-tx-04', accountId:'daniel', amount:37.06, category:'food_grab',               merchant:'Grab Food',      timestamp:'2025-01-02T13:32:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'d-tx-05', accountId:'daniel', amount:17,    category:'subscription',            merchant:'Spotify',        timestamp:'2025-01-03T06:10:00', isRecurring:true,  transactionType:'debit'    },
  { transactionId:'d-tx-06', accountId:'daniel', amount:243.5, category:'shopping_online_shopee',  merchant:'Shopee',         timestamp:'2025-01-04T14:22:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'d-tx-07', accountId:'daniel', amount:41.3,  category:'food_grab',               merchant:'Grab Food',      timestamp:'2025-01-04T20:15:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'d-tx-08', accountId:'daniel', amount:189,   category:'subscription',            merchant:'Adobe CC',       timestamp:'2025-01-05T08:00:00', isRecurring:true,  transactionType:'debit'    },
  { transactionId:'d-tx-09', accountId:'daniel', amount:38.2,  category:'food_grab',               merchant:'Grab Food',      timestamp:'2025-01-06T21:40:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'d-tx-10', accountId:'daniel', amount:362,   category:'shopping_online_lazada',  merchant:'Lazada',         timestamp:'2025-01-08T15:30:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'d-tx-11', accountId:'daniel', amount:29.5,  category:'food_mamak',              merchant:'Old Town WC',   timestamp:'2025-01-09T20:00:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'d-tx-12', accountId:'daniel', amount:44.8,  category:'food_grab',               merchant:'Grab Food',      timestamp:'2025-01-10T12:45:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'d-tx-13', accountId:'daniel', amount:16.9,  category:'subscription',            merchant:'GitHub Copilot', timestamp:'2025-01-12T06:00:00', isRecurring:true,  transactionType:'debit'    },
  { transactionId:'d-tx-14', accountId:'daniel', amount:38.5,  category:'food_mamak',              merchant:'Mamak 24hr',    timestamp:'2025-01-13T23:30:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'d-tx-15', accountId:'daniel', amount:276,   category:'shopping_online_shopee',  merchant:'Shopee',         timestamp:'2025-01-14T16:00:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'d-tx-16', accountId:'daniel', amount:85,    category:'subscription',            merchant:'Apple One',      timestamp:'2025-01-15T06:00:00', isRecurring:true,  transactionType:'debit'    },
  { transactionId:'d-tx-17', accountId:'daniel', amount:31.4,  category:'food_grab',               merchant:'Grab Food',      timestamp:'2025-01-16T19:50:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'d-tx-18', accountId:'daniel', amount:320,   category:'shopping_offline_mall',   merchant:'Pavilion KL',    timestamp:'2025-01-18T14:30:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'d-tx-19', accountId:'daniel', amount:36.7,  category:'food_grab',               merchant:'Grab Food',      timestamp:'2025-01-19T13:20:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'d-tx-20', accountId:'daniel', amount:39.1,  category:'food_mamak',              merchant:'Mamak 24hr',    timestamp:'2025-01-20T23:00:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'d-tx-21', accountId:'daniel', amount:149,   category:'shopping_online_lazada',  merchant:'Lazada',         timestamp:'2025-01-22T11:00:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'d-tx-22', accountId:'daniel', amount:42.6,  category:'food_grab',               merchant:'Grab Food',      timestamp:'2025-01-23T20:30:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'d-tx-23', accountId:'daniel', amount:33.9,  category:'food_grab',               merchant:'Grab Food',      timestamp:'2025-01-24T12:50:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'d-tx-24', accountId:'daniel', amount:480,   category:'entertainment',           merchant:'Bar & Grill KL', timestamp:'2025-01-25T21:00:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'d-tx-25', accountId:'daniel', amount:29.3,  category:'food_grab',               merchant:'Grab Food',      timestamp:'2025-01-27T13:15:00', isRecurring:false, transactionType:'debit'    },
];

// Simulated: flat week, slight decline — subscription creep continues
const danielSimTxs: Transaction[] = [
  { transactionId:'d-sim-01', accountId:'daniel', amount:39,   category:'food_grab',               merchant:'Grab Food',     timestamp:'2025-02-03T21:00:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'d-sim-02', accountId:'daniel', amount:195,  category:'shopping_online_shopee',  merchant:'Shopee',        timestamp:'2025-02-04T15:30:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'d-sim-03', accountId:'daniel', amount:36,   category:'food_grab',               merchant:'Grab Food',     timestamp:'2025-02-05T12:45:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'d-sim-04', accountId:'daniel', amount:18,   category:'subscription',            merchant:'Netflix',       timestamp:'2025-02-01T06:05:00', isRecurring:true,  transactionType:'debit'    },
  { transactionId:'d-sim-05', accountId:'daniel', amount:17,   category:'subscription',            merchant:'Spotify',       timestamp:'2025-02-03T06:10:00', isRecurring:true,  transactionType:'debit'    },
  { transactionId:'d-sim-06', accountId:'daniel', amount:44,   category:'food_grab',               merchant:'Grab Food',     timestamp:'2025-02-06T20:00:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'d-sim-07', accountId:'daniel', amount:228, category:'shopping_online_lazada', merchant:'Lazada', timestamp:'2025-02-07T16:00:00', isRecurring:false, transactionType:'debit' },
];

// ─── Mei Ling Wong ────────────────────────────────────────────────────────────

const meiLingBase: Transaction[] = [
  { transactionId:'m-tx-01', accountId:'mei_ling', amount:280,  category:'salary',                 merchant:'Grab Driver Pay', timestamp:'2025-01-05T21:34:00', isRecurring:false, transactionType:'credit'   },
  { transactionId:'m-tx-02', accountId:'mei_ling', amount:18.2, category:'food_grab',              merchant:'Grab Food',       timestamp:'2025-01-01T14:58:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'m-tx-03', accountId:'mei_ling', amount:71.9, category:'shopping_offline_mall',  merchant:'Mydin',           timestamp:'2025-01-01T16:46:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'m-tx-04', accountId:'mei_ling', amount:350,  category:'flexicredit_drawdown',   merchant:'GXBank Flexi',    timestamp:'2025-01-03T10:00:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'m-tx-05', accountId:'mei_ling', amount:410,  category:'salary',                 merchant:'Grab Driver Pay', timestamp:'2025-01-08T19:22:00', isRecurring:false, transactionType:'credit'   },
  { transactionId:'m-tx-06', accountId:'mei_ling', amount:45.3, category:'food_groceries',         merchant:'Tesco',           timestamp:'2025-01-09T11:00:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'m-tx-07', accountId:'mei_ling', amount:22.8, category:'food_mamak',             merchant:'Mamak Pelita',   timestamp:'2025-01-10T13:00:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'m-tx-08', accountId:'mei_ling', amount:88,   category:'medical',                merchant:'Klinik Ali',      timestamp:'2025-01-11T09:00:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'m-tx-09', accountId:'mei_ling', amount:320,  category:'salary',                 merchant:'Grab Driver Pay', timestamp:'2025-01-13T20:10:00', isRecurring:false, transactionType:'credit'   },
  { transactionId:'m-tx-10', accountId:'mei_ling', amount:68.5, category:'shopping_online_shopee', merchant:'Shopee',          timestamp:'2025-01-14T16:30:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'m-tx-11', accountId:'mei_ling', amount:55.2, category:'food_groceries',         merchant:'Tesco',           timestamp:'2025-01-15T10:30:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'m-tx-12', accountId:'mei_ling', amount:380,  category:'salary',                 merchant:'Grab Driver Pay', timestamp:'2025-01-18T21:00:00', isRecurring:false, transactionType:'credit'   },
  { transactionId:'m-tx-13', accountId:'mei_ling', amount:24.6, category:'food_mamak',             merchant:'Mamak Pelita',   timestamp:'2025-01-19T14:00:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'m-tx-14', accountId:'mei_ling', amount:200,  category:'flexicredit_repayment',  merchant:'GXBank Flexi',    timestamp:'2025-01-20T09:00:00', isRecurring:true,  transactionType:'debit'    },
  { transactionId:'m-tx-15', accountId:'mei_ling', amount:55,   category:'shopping_online_shopee', merchant:'Shopee',          timestamp:'2025-01-21T22:00:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'m-tx-16', accountId:'mei_ling', amount:290,  category:'salary',                 merchant:'Grab Driver Pay', timestamp:'2025-01-23T19:45:00', isRecurring:false, transactionType:'credit'   },
  { transactionId:'m-tx-17', accountId:'mei_ling', amount:62.3, category:'food_groceries',         merchant:'Mydin',           timestamp:'2025-01-24T11:00:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'m-tx-18', accountId:'mei_ling', amount:15.5, category:'transport_grab',         merchant:'Grab',            timestamp:'2025-01-25T08:30:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'m-tx-19', accountId:'mei_ling', amount:33.8, category:'food_grab',              merchant:'Grab Food',       timestamp:'2025-01-26T12:00:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'m-tx-20', accountId:'mei_ling', amount:440,  category:'salary',                 merchant:'Grab Driver Pay', timestamp:'2025-01-29T20:30:00', isRecurring:false, transactionType:'credit'   },
];

// Simulated: cut impulse purchases — restraint ↑ significantly
const meiLingSimTxs: Transaction[] = [
  { transactionId:'m-sim-01', accountId:'mei_ling', amount:320,  category:'salary',          merchant:'Grab Driver Pay', timestamp:'2025-02-05T20:30:00', isRecurring:false, transactionType:'credit'   },
  { transactionId:'m-sim-02', accountId:'mei_ling', amount:58,   category:'food_groceries',  merchant:'Tesco',           timestamp:'2025-02-01T10:30:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'m-sim-03', accountId:'mei_ling', amount:50,   category:'savings_transfer',merchant:'GXBank Savings',  timestamp:'2025-02-03T20:00:00', isRecurring:false, transactionType:'transfer' },
  { transactionId:'m-sim-04', accountId:'mei_ling', amount:12,   category:'food_mamak',      merchant:'Mamak Pelita',   timestamp:'2025-02-04T13:00:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'m-sim-05', accountId:'mei_ling', amount:8.5,  category:'transport_grab',  merchant:'Grab',            timestamp:'2025-02-06T08:30:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'m-sim-06', accountId:'mei_ling', amount:42,   category:'food_groceries',  merchant:'Mydin',           timestamp:'2025-02-07T11:00:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'m-sim-07', accountId:'mei_ling', amount:14,   category:'food_grab',       merchant:'Grab Food',       timestamp:'2025-02-08T12:30:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'m-sim-08', accountId:'mei_ling', amount:200,  category:'flexicredit_repayment', merchant:'GXBank Flexi', timestamp:'2025-02-02T09:00:00', isRecurring:true, transactionType:'debit' },
];

// ─── Hafiz Bin Ramli ──────────────────────────────────────────────────────────

const hafizBase: Transaction[] = [
  { transactionId:'h-tx-01', accountId:'hafiz', amount:7200,  category:'salary',          merchant:'Pharmaniaga',      timestamp:'2025-01-25T09:15:00', isRecurring:true,  transactionType:'credit'   },
  { transactionId:'h-tx-02', accountId:'hafiz', amount:1500,  category:'savings_transfer',merchant:'GXBank Savings',   timestamp:'2025-01-01T08:58:00', isRecurring:true,  transactionType:'transfer' },
  { transactionId:'h-tx-03', accountId:'hafiz', amount:800,   category:'family_transfer', merchant:'Maybank Invest',   timestamp:'2025-01-01T08:11:00', isRecurring:true,  transactionType:'transfer' },
  { transactionId:'h-tx-04', accountId:'hafiz', amount:185.4, category:'food_groceries',  merchant:'Tesco Penang',     timestamp:'2025-01-04T10:00:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'h-tx-05', accountId:'hafiz', amount:95,    category:'utilities',       merchant:'TNB',              timestamp:'2025-01-05T09:30:00', isRecurring:true,  transactionType:'debit'    },
  { transactionId:'h-tx-06', accountId:'hafiz', amount:80,    category:'transport_tng',   merchant:'Touch n Go',       timestamp:'2025-01-06T07:00:00', isRecurring:true,  transactionType:'debit'    },
  { transactionId:'h-tx-07', accountId:'hafiz', amount:250,   category:'family_transfer', merchant:'SJKC School Fees', timestamp:'2025-01-07T08:00:00', isRecurring:true,  transactionType:'transfer' },
  { transactionId:'h-tx-08', accountId:'hafiz', amount:55,    category:'food_mamak',      merchant:'Mamak Pelita',    timestamp:'2025-01-09T20:00:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'h-tx-09', accountId:'hafiz', amount:45,    category:'utilities',       merchant:'Unifi',            timestamp:'2025-01-10T09:00:00', isRecurring:true,  transactionType:'debit'    },
  { transactionId:'h-tx-10', accountId:'hafiz', amount:200.8, category:'food_groceries',  merchant:'Tesco Penang',     timestamp:'2025-01-11T10:30:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'h-tx-11', accountId:'hafiz', amount:18,    category:'subscription',    merchant:'Netflix',          timestamp:'2025-01-12T22:00:00', isRecurring:true,  transactionType:'debit'    },
  { transactionId:'h-tx-12', accountId:'hafiz', amount:175,   category:'utilities',       merchant:'AIA Insurance',    timestamp:'2025-01-15T09:00:00', isRecurring:true,  transactionType:'debit'    },
  { transactionId:'h-tx-13', accountId:'hafiz', amount:65,    category:'food_mamak',      merchant:'Old Town WC',     timestamp:'2025-01-16T20:00:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'h-tx-14', accountId:'hafiz', amount:190.2, category:'food_groceries',  merchant:'Tesco Penang',     timestamp:'2025-01-18T10:00:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'h-tx-15', accountId:'hafiz', amount:80,    category:'transport_tng',   merchant:'Touch n Go',       timestamp:'2025-01-20T07:00:00', isRecurring:true,  transactionType:'debit'    },
  { transactionId:'h-tx-16', accountId:'hafiz', amount:1500,  category:'savings_transfer',merchant:'GXBank Savings',   timestamp:'2025-02-01T08:58:00', isRecurring:true,  transactionType:'transfer' },
  { transactionId:'h-tx-17', accountId:'hafiz', amount:800,   category:'family_transfer', merchant:'Maybank Invest',   timestamp:'2025-02-01T08:11:00', isRecurring:true,  transactionType:'transfer' },
  { transactionId:'h-tx-18', accountId:'hafiz', amount:170.5, category:'food_groceries',  merchant:'Tesco Penang',     timestamp:'2025-01-25T10:30:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'h-tx-19', accountId:'hafiz', amount:28.5,  category:'food_mamak',      merchant:'Mamak Pelita',    timestamp:'2025-01-26T13:00:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'h-tx-20', accountId:'hafiz', amount:45,    category:'utilities',       merchant:'Unifi',            timestamp:'2025-01-27T09:00:00', isRecurring:true,  transactionType:'debit'    },
];

// Simulated: maintained baseline — illustrates that high-baseline performer can lose battle
const hafizSimTxs: Transaction[] = [
  { transactionId:'h-sim-01', accountId:'hafiz', amount:1500,  category:'savings_transfer',merchant:'GXBank Savings',   timestamp:'2025-02-07T08:58:00', isRecurring:true,  transactionType:'transfer' },
  { transactionId:'h-sim-02', accountId:'hafiz', amount:800,   category:'family_transfer', merchant:'Maybank Invest',   timestamp:'2025-02-07T08:11:00', isRecurring:true,  transactionType:'transfer' },
  { transactionId:'h-sim-03', accountId:'hafiz', amount:95,    category:'utilities',       merchant:'TNB',              timestamp:'2025-02-05T09:30:00', isRecurring:true,  transactionType:'debit'    },
  { transactionId:'h-sim-04', accountId:'hafiz', amount:182.5, category:'food_groceries',  merchant:'Tesco Penang',     timestamp:'2025-02-08T10:00:00', isRecurring:false, transactionType:'debit'    },
  { transactionId:'h-sim-05', accountId:'hafiz', amount:250,   category:'family_transfer', merchant:'SJKC School Fees', timestamp:'2025-02-03T08:00:00', isRecurring:true,  transactionType:'transfer' },
  { transactionId:'h-sim-06', accountId:'hafiz', amount:80,    category:'transport_tng',   merchant:'Touch n Go',       timestamp:'2025-02-03T07:00:00', isRecurring:true,  transactionType:'debit'    },
  { transactionId:'h-sim-07', accountId:'hafiz', amount:60,    category:'food_mamak',      merchant:'Old Town WC',     timestamp:'2025-02-06T20:00:00', isRecurring:false, transactionType:'debit'    },
];

// ─── Full fallback record ─────────────────────────────────────────────────────

export const PERSONA_FALLBACK: Record<PersonaId, PersonaFallback> = {
  aisyah: {
    name:      'Aisyah Binti Hassan',
    incomeTier: 'B40',
    incomeRM:  2200,
    // Real ML baseline stats (90-day rolling from stats_aisyah.json)
    baselineStats:    { restraint:84,   consistency:46.3, resilience:75.4, foresight:61.8, recovery:67.9 },
    // Real ML current-week stats (from stats_aisyah.json *_week fields)
    currentWeekStats: { restraint:83.3, consistency:48.5, resilience:74.9, foresight:72.7, recovery:67.7 },
    // Creature params per Section 10 — tuned for visual distinctiveness
    creatureParams: { bodyShape:'crystalline', bodySize:113, paletteHue:195, paletteSaturation:75, appendageCount:4, auraIntensity:0.78, textureDensity:0.82, hasRiskFlag:false, riskFlagLocation:'body' },
    riskFlags: [],
    simulatedDelta: {
      stats: { restraint:92, consistency:52, resilience:78, foresight:88, recovery:70 },
      newPoints: [],
      newTransactions: aisyahSimTxs,
    },
    transactions: aisyahBase,
  },

  daniel: {
    name:      'Daniel Tan Wei Ming',
    incomeTier: 'T20',
    incomeRM:  9500,
    // Real ML baseline stats (from stats_daniel.json)
    baselineStats:    { restraint:42,   consistency:16.3, resilience:64,   foresight:49,   recovery:50   },
    // Real ML current-week stats
    currentWeekStats: { restraint:40.4, consistency:20.4, resilience:62.9, foresight:45.1, recovery:49.5 },
    // Blob body, coral, subscription-creep risk flag on body
    creatureParams: { bodyShape:'blob', bodySize:95, paletteHue:15, paletteSaturation:72, appendageCount:3, auraIntensity:0.42, textureDensity:0.38, hasRiskFlag:true, riskFlagLocation:'body' },
    riskFlags: [
      { type:'subscription_creep', severity:'high', affectedMotif:'subscription|200-1000|morning|true', affected_area:'body' },
    ],
    simulatedDelta: {
      // Slight decline — flat week
      stats: { restraint:37, consistency:18, resilience:61, foresight:42, recovery:47 },
      newPoints: [],
      newTransactions: danielSimTxs,
    },
    transactions: danielBase,
  },

  mei_ling: {
    name:      'Mei Ling Wong',
    incomeTier: 'B40',
    incomeRM:  2650,
    // Real ML baseline stats
    baselineStats:    { restraint:59.5, consistency:11.5, resilience:45,   foresight:40,   recovery:75   },
    // Real ML current-week (already shows significant improvement)
    currentWeekStats: { restraint:70.5, consistency:13.8, resilience:52.6, foresight:60,   recovery:78.2 },
    // Spiked body, amber, income-volatility flag on limb
    creatureParams: { bodyShape:'spiked', bodySize:94, paletteHue:38, paletteSaturation:88, appendageCount:2, auraIntensity:0.50, textureDensity:0.35, hasRiskFlag:true, riskFlagLocation:'limb' },
    riskFlags: [
      { type:'income_volatility', severity:'medium', affectedMotif:'salary|200-1000|evening|false', affected_area:'limb' },
    ],
    simulatedDelta: {
      // Strong restraint improvement + first savings transfer
      stats: { restraint:82, consistency:16, resilience:58, foresight:65, recovery:81 },
      newPoints: [],
      newTransactions: meiLingSimTxs,
    },
    transactions: meiLingBase,
  },

  hafiz: {
    name:      'Hafiz Bin Ramli',
    incomeTier: 'T20',
    incomeRM:  7200,
    // Real ML baseline stats
    baselineStats:    { restraint:88,   consistency:92,   resilience:85,   foresight:90,   recovery:69.7 },
    // Real ML current-week
    currentWeekStats: { restraint:85.4, consistency:93.7, resilience:83.2, foresight:95,   recovery:68.9 },
    // Angular body, deep purple, no risk flags
    creatureParams: { bodyShape:'angular', bodySize:117, paletteHue:272, paletteSaturation:75, appendageCount:5, auraIntensity:0.88, textureDensity:0.92, hasRiskFlag:false, riskFlagLocation:'body' },
    riskFlags: [],
    simulatedDelta: {
      // Maintained baseline — illustrates income-fairness: even with high absolute stats,
      // near-zero delta means he can lose to Aisyah's +8/+26 improvements.
      stats: { restraint:86, consistency:93, resilience:84, foresight:92, recovery:69 },
      newPoints: [],
      newTransactions: hafizSimTxs,
    },
    transactions: hafizBase,
  },
};
