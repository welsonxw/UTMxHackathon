# WealthDrop

> Income-fair gamified savings for GXBank. Built for UTMxHackathon 2026.

WealthDrop reads your GXBank transaction history for behavioral patterns that banks can see but never surface, generates a unique procedural creature that mirrors your financial discipline, and lets you battle friends on **improvement velocity** — never on absolute income. A B40 user who improves 20% beats a T20 user who plateaued, every time.

## Live demo

[Deploy URL — add after `vercel deploy`]

---

## What it does

WealthDrop extracts n-gram behavioral motifs from raw transaction streams, embeds each user in a continuous 2D behavior space via UMAP, and scores them on five discipline axes (Restraint, Consistency, Resilience, Foresight, Recovery). Each user gets a procedurally generated creature whose visual form is a direct read-out of their behavior profile. The social layer — income-fair PvP battles — lets low-income users win on improvement velocity, with no income amounts ever displayed across users.

## How it works

The Python ML pipeline runs offline: it generates 90 days of synthetic Malaysian transaction data for four personas, encodes each transaction as a discrete token, mines significant n-gram motifs, embeds all users via UMAP, and computes the five weekly axis scores. The outputs are precomputed and stored — either in Firestore (for live sync) or in a local TypeScript module (for offline-first demo reliability). The Next.js frontend reads this data, renders the creature via p5.js Perlin noise / polygon / spike / crystal algorithms, plots transactions as a polar constellation (angle = hour-of-day, radius = log₁₀(RM)), and resolves PvP battles by comparing each user's delta-from-personal-baseline on all five axes.

---

## Architecture

```mermaid
graph TD
  subgraph ML["ML Pipeline (Python / Jupyter)"]
    A[data_generator.py<br/>90-day synthetic transactions] --> B[encoder.py<br/>token sequences]
    B --> C[pattern_miner.py<br/>n-gram motifs · Consistency score]
    C --> D[embedder.py<br/>UMAP 2D + HDBSCAN clusters]
    D --> E[stats.py<br/>5-axis weekly scores]
    E --> F[firestore_writer.py<br/>upload to Firestore]
  end

  subgraph FE["Frontend (Next.js 14 · TypeScript · Tailwind)"]
    G[/ Persona selector landing]
    H[/dashboard Dashboard<br/>Creature · Constellation · StatBars]
    I[/battle Battle Arena<br/>sequential axis reveal]
  end

  subgraph Data["Data layer"]
    J[(Firestore<br/>real-time sync)]
    K[personas-fallback.ts<br/>precomputed · offline-first]
  end

  F --> J
  E --> K
  J -->|onSnapshot| H
  K -->|instant load| H
  K --> I
  H --> H1[Creature<br/>p5.js procedural]
  H --> H2[Constellation<br/>SVG · framer-motion]
  H --> H3[StatBars + SimulateButton]
```

---

## Quick start

### Prerequisites
- Node.js 18+
- Python 3.11+ (for ML pipeline only)
- Firebase project with Firestore enabled (optional — app runs offline without it)

### 1 — Clone and install

```bash
git clone <repo-url>
cd wealthdrop/frontend
npm install
```

### 2 — Configure environment

Copy the example and fill in your Firebase credentials:

```bash
cp frontend/.env.example frontend/.env.local
```

Required env vars (`frontend/.env.local`):

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

> The app runs fully offline with the precomputed persona data if Firebase is not configured. Leave the values as `placeholder` and the dashboard uses the local ML output instead.

### 3 — Run the dev server

```bash
cd frontend
npm run dev
# → http://localhost:3000
```

### 4 — (Optional) Seed Firestore

Run the ML pipeline notebooks in order to populate Firestore with live data:

```bash
cd ml-pipeline
pip install -r requirements.txt
# Run notebooks 01 → 06 in order via Jupyter
jupyter notebook
```

Set `FIREBASE_SERVICE_ACCOUNT_KEY` to your service-account JSON path before running notebook 06.

---

## Project structure

```
wealthdrop/
├── frontend/                   # Next.js 14 App Router
│   ├── app/
│   │   ├── page.tsx            # Persona selector landing
│   │   ├── dashboard/page.tsx  # Main dashboard (MM1 + MM2)
│   │   └── battle/page.tsx     # Battle Arena (MM3)
│   ├── components/
│   │   ├── Creature.tsx        # p5.js procedural renderer (4 body shapes)
│   │   ├── Constellation.tsx   # SVG polar transaction field
│   │   ├── StatBars.tsx        # 5-axis discipline bars with delta badges
│   │   ├── SimulateButton.tsx  # "Simulate this week" trigger
│   │   ├── BattleArena.tsx     # Cinematic PvP resolution UI
│   │   └── PersonaSwitcher.tsx # Demo persona dropdown
│   └── lib/
│       ├── battle-engine.ts    # resolveBattle() — delta-from-baseline PvP math
│       ├── creature-params.ts  # generateCreatureParams() — embedding → visual
│       ├── personas-fallback.ts# Precomputed data from ML pipeline
│       ├── firebase.ts         # Firestore + Auth client init
│       └── types.ts            # Shared TypeScript interfaces
├── ml-pipeline/
│   ├── notebooks/              # 01–06 Jupyter pipeline
│   ├── src/                    # Python modules
│   └── output/                 # Precomputed JSON (checked in for offline demo)
└── docs/
    ├── ARCHITECTURE.md
    ├── DEMO_SCRIPT.md
    └── PITCH_QA.md
```

---

## The 3 demo magic moments

| # | When | What happens |
|---|------|--------------|
| MM1 | 1:30 | Click **Simulate this week** on Aisyah's dashboard → 8 new transaction points animate into the constellation sequentially over 2 s; stat bars update with green ▲ deltas |
| MM2 | 2:15 | Switch to Daniel → subscription-creep risk flag pulses red on his creature; hover Foresight bar for tooltip |
| MM3 | 3:00 | Navigate to `/battle` → Aisyah vs Daniel; income gap (RM 2,200 vs RM 9,500) displayed prominently; click ⚔ BATTLE → 5-axis cinematic reveal (800 ms/axis); Aisyah wins; banner reads "on improvement velocity, not income" |

---

## Key design decisions

| Decision | Why |
|---|---|
| Delta-from-baseline scoring, not absolute | B40 user can beat T20 user on improvement velocity |
| Income amounts never shown across users | Regulatory + ethical requirement for B40 product |
| Procedural creature from UMAP embedding | No two users identical; creature form = behavioral diagnosis |
| Offline-first with Firestore upgrade | Demo reliability; no dependency on live API or WiFi |
| Battle rewards cosmetic-only | Clear of MAS/BNM gamified-gambling regulations |

---

## Team

[Add team names + roles here]

## Built for

GXBank case study · UTMxHackathon 2026
