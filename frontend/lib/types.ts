// ── Persona / Firestore schema ────────────────────────────────────────────────

export type PersonaId = 'aisyah' | 'daniel' | 'mei_ling' | 'hafiz';

export const PERSONAS: Record<PersonaId, { name: string; incomeTier: 'B40' | 'T20'; incomeRM: number }> = {
  aisyah:   { name: 'Aisyah Binti Hassan', incomeTier: 'B40', incomeRM: 2200 },
  daniel:   { name: 'Daniel Tan Wei Ming',  incomeTier: 'T20', incomeRM: 9500 },
  mei_ling: { name: 'Mei Ling Wong',         incomeTier: 'B40', incomeRM: 2650 },
  hafiz:    { name: 'Hafiz Bin Ramli',        incomeTier: 'T20', incomeRM: 7200 },
};

// ── 5-axis stats ──────────────────────────────────────────────────────────────

export interface StatAxes {
  restraint:   number; // 0-100
  consistency: number;
  resilience:  number;
  foresight:   number;
  recovery:    number;
}

// ── User profile ──────────────────────────────────────────────────────────────

export interface UserProfile {
  name:          string;
  incomeTier:    'B40' | 'T20';
  baselineStats: StatAxes;
}

export interface EmbeddingData {
  x:         number;
  y:         number;
  clusterId: number;
}

export type BodyShape = 'blob' | 'angular' | 'spiked' | 'crystalline';
export type RiskFlagLocation = 'head' | 'body' | 'limb';

export interface CreatureParams {
  bodyShape:         BodyShape;
  bodySize:          number;       // 80–120 px
  paletteHue:        number;       // 0–360
  paletteSaturation: number;       // 40–90 %
  appendageCount:    number;       // 1–6
  auraIntensity:     number;       // 0–1
  textureDensity:    number;       // 0–1
  hasRiskFlag:       boolean;
  riskFlagLocation:  RiskFlagLocation;
}

export interface RiskFlag {
  type:          string;
  severity:      'low' | 'medium' | 'high';
  affectedMotif: string;
  affected_area: RiskFlagLocation;
}

// ── Constellation ─────────────────────────────────────────────────────────────

export type TransactionCategory =
  | 'food_mamak' | 'food_grab' | 'food_groceries'
  | 'transport_grab' | 'transport_tng'
  | 'shopping_online_shopee' | 'shopping_online_lazada' | 'shopping_offline_mall'
  | 'subscription' | 'utilities' | 'salary' | 'savings_transfer'
  | 'flexicredit_drawdown' | 'flexicredit_repayment'
  | 'medical' | 'entertainment' | 'travel' | 'family_transfer';

export interface ConstellationPoint {
  angle:    number; // 0–360°, mapped from time-of-day
  radius:   number; // log-scale px
  color:    string;
  category: TransactionCategory;
  isNew:    boolean;
}

export interface Transaction {
  transactionId:   string;
  accountId:       string;
  amount:          number;
  category:        TransactionCategory;
  merchant:        string;
  timestamp:       string; // ISO 8601
  isRecurring:     boolean;
  transactionType: 'debit' | 'credit' | 'transfer';
}

// ── Simulated delta (the "Simulate this week" payload) ────────────────────────

export interface SimulatedDelta {
  stats:     StatAxes;
  newPoints: ConstellationPoint[];
}

// ── Full user document (Firestore sub-docs flattened) ─────────────────────────

export interface UserDocument {
  profile:          UserProfile;
  embedding:        EmbeddingData;
  currentWeekStats: StatAxes;
  creatureParams:   CreatureParams;
  riskFlags:        RiskFlag[];
  simulatedDelta:   SimulatedDelta;
}

// ── Battle engine (Section 6) ─────────────────────────────────────────────────

export interface UserStats extends StatAxes {
  baseline: StatAxes;
}

export type BattleAxis = keyof StatAxes;

export interface AxisResult {
  axis:   BattleAxis;
  aScore: number;
  bScore: number;
  winner: 'A' | 'B';
}

export interface BattleResult {
  axisResults:   AxisResult[];
  overallWinner: 'A' | 'B';
  aWins:         number;
  bWins:         number;
}
