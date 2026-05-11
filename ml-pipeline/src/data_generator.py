"""Synthetic Malaysian transaction data generator for 4 demo personas.

Phase 1 — must run before anything else. Each persona produces behaviorally
distinct data so the ML pipeline can separate them on all 5 stat axes.
"""

import json
import random
import uuid
from collections import Counter, defaultdict
from datetime import datetime, timedelta
from pathlib import Path

OUTPUT_DIR = Path(__file__).parent.parent / "output"

# ── Merchant lookup per category ───────────────────────────────────────────────

MERCHANTS: dict[str, list[str]] = {
    "food_mamak":             ["Mamak Pelita", "Old Town White Coffee"],
    "food_grab":              ["Grab Food"],
    "food_groceries":         ["Mydin", "Tesco"],
    "transport_grab":         ["Grab"],
    "transport_tng":          ["Touch n Go eWallet"],
    "shopping_online_shopee": ["Shopee"],
    "shopping_online_lazada": ["Lazada"],
    "shopping_offline_mall":  ["Mr. DIY", "Watson's", "Guardian"],
    "subscription":           ["Netflix", "Spotify", "Disney+", "Apple One",
                               "Adobe CC", "GitHub Copilot", "Maxis", "Celcom"],
    "utilities":              ["TNB", "Maxis", "Celcom"],
    "salary":                 ["Mydin HR", "Tech Corp HR", "Grab Earnings", "Hospital HR"],
    "savings_transfer":       ["GXBank Savings", "Maybank Savings", "CIMB Savings"],
    "flexicredit_drawdown":   ["GXBank FlexiCredit"],
    "flexicredit_repayment":  ["GXBank FlexiCredit"],
    "medical":                ["Watson's", "Guardian", "Klinik Kesihatan", "Pantai Hospital"],
    "entertainment":          ["TGV Cinemas", "GSC Cinemas"],
    "travel":                 ["AirAsia", "Petronas", "Shell"],
    "family_transfer":        ["GXBank Transfer", "Maybank Transfer"],
}

_HOUR_RANGES: dict[str, tuple[int, int]] = {
    "morning":    (6,  11),
    "afternoon":  (12, 16),
    "evening":    (17, 21),
    "late_night": (22, 23),
}

# ── Primitive helpers ──────────────────────────────────────────────────────────

def _hour(bucket: str, rng: random.Random) -> int:
    lo, hi = _HOUR_RANGES[bucket]
    return rng.randint(lo, hi)


def _ts(date: datetime, hour: int, rng: random.Random) -> str:
    return date.replace(
        hour=hour,
        minute=rng.randint(0, 59),
        second=rng.randint(0, 59),
        microsecond=0,
    ).isoformat()


def _tx(
    account_id: str,
    amount: float,
    category: str,
    merchant: str,
    timestamp: str,
    is_recurring: bool,
    tx_type: str,
    rng: random.Random,
) -> dict:
    return {
        "transaction_id":   str(uuid.UUID(int=rng.getrandbits(128))),
        "account_id":       account_id,
        "amount":           round(amount, 2),
        "category":         category,
        "merchant":         merchant,
        "timestamp":        timestamp,
        "is_recurring":     is_recurring,
        "transaction_type": tx_type,
    }


# ── Persona 1: Aisyah Binti Hassan ────────────────────────────────────────────
# B40 · RM2,200/month · disciplined saver · strong recurring motifs
# Target stats: Restraint 78 · Consistency 82 · Resilience 70 · Foresight 75 · Recovery 65

def generate_aisyah(start: datetime, rng: random.Random) -> list[dict]:
    AID = "aisyah_001"
    txs: list[dict] = []

    for n in range(90):
        d = start + timedelta(days=n)
        dow = d.weekday()       # 0=Mon … 6=Sun
        week_num = n // 7

        # ── Monthly fixed events ───────────────────────────────────
        if d.day == 1:
            # Salary arrives 1st of month
            txs.append(_tx(AID, 2200.00, "salary", "Mydin HR",
                           _ts(d, 9, rng), True, "credit", rng))

        if d.day == 10:
            # Maxis phone bill
            txs.append(_tx(AID, rng.uniform(52, 65), "utilities", "Maxis",
                           _ts(d, _hour("morning", rng), rng), True, "debit", rng))

        if d.day == 15:
            # Netflix — only subscription she has
            txs.append(_tx(AID, 18.00, "subscription", "Netflix",
                           _ts(d, _hour("morning", rng), rng), True, "debit", rng))

        if d.day == 20:
            # Contributes to parents' TNB bill
            txs.append(_tx(AID, rng.uniform(30, 50), "utilities", "TNB",
                           _ts(d, _hour("morning", rng), rng), True, "debit", rng))

        # ── Weekly fixed events ────────────────────────────────────
        if dow == 4:
            # Every Friday: RM50 savings transfer (the strongest recurring motif)
            txs.append(_tx(AID, 50.00, "savings_transfer", "GXBank Savings",
                           _ts(d, 9, rng), True, "transfer", rng))

        if dow == 3:
            # Every Thursday: mamak outing with friends
            txs.append(_tx(AID, rng.uniform(15, 30), "food_mamak", "Mamak Pelita",
                           _ts(d, _hour("evening", rng), rng), False, "debit", rng))

        # Touch n Go reload every 2 weeks (even-numbered weeks, Monday)
        if dow == 0 and week_num % 2 == 0:
            txs.append(_tx(AID, rng.uniform(50, 80), "transport_tng", "Touch n Go eWallet",
                           _ts(d, _hour("morning", rng), rng), True, "debit", rng))

        # ── Daily stochastic events ────────────────────────────────
        # Grab to work on weekdays (60 %)
        if dow < 5 and rng.random() < 0.60:
            txs.append(_tx(AID, rng.uniform(8, 15), "transport_grab", "Grab",
                           _ts(d, _hour("morning", rng), rng), False, "debit", rng))

        # Groceries Tue / Fri / Sun (75 %)
        if dow in (1, 4, 6) and rng.random() < 0.75:
            txs.append(_tx(AID, rng.uniform(20, 60), "food_groceries",
                           rng.choice(["Mydin", "Tesco"]),
                           _ts(d, _hour("afternoon", rng), rng), False, "debit", rng))

        # Grab food (20 % — she mostly eats mamak / groceries)
        if rng.random() < 0.20:
            txs.append(_tx(AID, rng.uniform(10, 20), "food_grab", "Grab Food",
                           _ts(d, _hour("afternoon", rng), rng), False, "debit", rng))

        # Shopee — very limited, ~1-2× per month (3 % / day)
        if rng.random() < 0.03:
            txs.append(_tx(AID, rng.uniform(30, 100), "shopping_online_shopee", "Shopee",
                           _ts(d, _hour("late_night", rng), rng), False, "debit", rng))

        # Watson's / Guardian (2 % / day)
        if rng.random() < 0.02:
            txs.append(_tx(AID, rng.uniform(20, 50), "medical",
                           rng.choice(["Watson's", "Guardian"]),
                           _ts(d, _hour("afternoon", rng), rng), False, "debit", rng))

    txs.sort(key=lambda t: t["timestamp"])
    return txs


# ── Persona 2: Daniel Tan Wei Ming ────────────────────────────────────────────
# T20 · RM9,500/month · subscription creep · heavy Grab/Shopee/Lazada · inconsistent saver
# Target stats: Restraint 42 · Consistency 38 · Resilience 55 · Foresight 60 · Recovery 50

def generate_daniel(start: datetime, rng: random.Random) -> list[dict]:
    AID = "daniel_001"
    txs: list[dict] = []

    # 8 subscriptions on fixed days — total ≈ RM480/month
    SUBS: list[tuple[int, float, str]] = [
        ( 1, 18.00,  "Netflix"),
        ( 3, 15.00,  "Spotify"),
        ( 5, 30.00,  "Disney+"),
        ( 7, 35.00,  "Apple One"),
        (10, 55.00,  "Adobe CC"),
        (12, 19.00,  "GitHub Copilot"),
        (15, 150.00, "SaaS Tool A"),
        (18, 158.00, "SaaS Tool B"),
    ]

    for n in range(90):
        d = start + timedelta(days=n)
        dow = d.weekday()

        # ── Monthly fixed events ───────────────────────────────────
        if d.day == 25:
            txs.append(_tx(AID, 9500.00, "salary", "Tech Corp HR",
                           _ts(d, 9, rng), True, "credit", rng))

        for sub_day, sub_amt, sub_name in SUBS:
            if d.day == sub_day:
                txs.append(_tx(AID, sub_amt, "subscription", sub_name,
                               _ts(d, _hour("morning", rng), rng), True, "debit", rng))

        if d.day == 20:
            txs.append(_tx(AID, rng.uniform(120, 200), "utilities", "TNB",
                           _ts(d, _hour("morning", rng), rng), True, "debit", rng))

        if d.day == 22:
            txs.append(_tx(AID, rng.uniform(80, 120), "utilities", "Celcom",
                           _ts(d, _hour("morning", rng), rng), True, "debit", rng))

        # Savings: irregular — only ~60 % of month-ends, wildly variable
        if d.day == 28 and rng.random() < 0.60:
            amt = rng.uniform(100, 2500)
            txs.append(_tx(AID, amt, "savings_transfer", "Maybank Savings",
                           _ts(d, _hour("morning", rng), rng), False, "transfer", rng))

        # ── Daily stochastic events ────────────────────────────────
        # Grab food every day (1–2 orders) — the defining motif
        for _ in range(rng.randint(1, 2)):
            bucket = rng.choice(["afternoon", "evening"])
            txs.append(_tx(AID, rng.uniform(25, 40), "food_grab", "Grab Food",
                           _ts(d, _hour(bucket, rng), rng), False, "debit", rng))

        # Eating out 5–6×/week (80 %)
        if rng.random() < 0.80:
            txs.append(_tx(AID, rng.uniform(15, 60), "food_mamak",
                           rng.choice(["Old Town White Coffee", "McDonald's Malaysia", "Mamak Pelita"]),
                           _ts(d, _hour(rng.choice(["morning", "afternoon", "evening"]), rng), rng),
                           False, "debit", rng))

        # Shopee ≈ 3 orders/week (45 % chance, 1–2 items)
        if rng.random() < 0.45:
            for _ in range(rng.randint(1, 2)):
                txs.append(_tx(AID, rng.uniform(50, 300), "shopping_online_shopee", "Shopee",
                               _ts(d, _hour("late_night", rng), rng), False, "debit", rng))

        # Lazada ≈ 2–3 orders/week (30 %)
        if rng.random() < 0.30:
            txs.append(_tx(AID, rng.uniform(100, 400), "shopping_online_lazada", "Lazada",
                           _ts(d, _hour("late_night", rng), rng), False, "debit", rng))

        # Grab transport (30 %)
        if rng.random() < 0.30:
            txs.append(_tx(AID, rng.uniform(15, 35), "transport_grab", "Grab",
                           _ts(d, _hour("morning", rng), rng), False, "debit", rng))

    txs.sort(key=lambda t: t["timestamp"])
    return txs


# ── Persona 3: Mei Ling Wong ───────────────────────────────────────────────────
# B40 gig worker · RM1,800-3,500/month variable · FlexiCredit · bursty spending
# Target stats: Restraint 50 · Consistency 35 · Resilience 45 · Foresight 40 · Recovery 75

def generate_mei_ling(start: datetime, rng: random.Random) -> list[dict]:
    AID = "mei_ling_001"
    txs: list[dict] = []
    fc_balance = 0.0

    # Two FlexiCredit drawdowns: day 15 (car repair) and day 52 (medical)
    FC_EVENTS: list[tuple[int, float]] = [(15, 600.00), (52, 350.00)]

    for n in range(90):
        d = start + timedelta(days=n)
        dow = d.weekday()

        # ── FlexiCredit drawdowns ──────────────────────────────────
        for fc_day, fc_amt in FC_EVENTS:
            if n == fc_day:
                fc_balance += fc_amt
                txs.append(_tx(AID, fc_amt, "flexicredit_drawdown", "GXBank FlexiCredit",
                               _ts(d, _hour("morning", rng), rng), False, "credit", rng))
                # Spend the drawdown the same day (medical / repair)
                txs.append(_tx(AID, fc_amt * rng.uniform(0.75, 0.95), "medical",
                               rng.choice(["Klinik Kesihatan", "Pantai Hospital"]),
                               _ts(d, _hour("afternoon", rng), rng), False, "debit", rng))

        # ── Monthly FlexiCredit repayment (28th) ──────────────────
        if d.day == 28 and fc_balance > 0:
            repay = min(fc_balance, rng.uniform(100, 200))
            fc_balance = max(0.0, fc_balance - repay)
            txs.append(_tx(AID, repay, "flexicredit_repayment", "GXBank FlexiCredit",
                           _ts(d, _hour("morning", rng), rng), True, "debit", rng))

        # ── Grab driver payout: Tue / Thu / Sat, 75 % chance ──────
        # Income is erratic in size and arrival — hallmark of gig economy
        if dow in (1, 3, 5) and rng.random() < 0.75:
            payout = rng.uniform(180, 580)
            txs.append(_tx(AID, payout, "salary", "Grab Earnings",
                           _ts(d, rng.randint(18, 22), rng), True, "credit", rng))

            # Bursty grocery spend right after payout (70 %)
            if rng.random() < 0.70:
                txs.append(_tx(AID, rng.uniform(30, 80), "food_groceries",
                               rng.choice(["Mydin", "Tesco"]),
                               _ts(d, rng.randint(19, 23), rng), False, "debit", rng))

            # Impulse Shopee after payout (30 %)
            if rng.random() < 0.30:
                txs.append(_tx(AID, rng.uniform(30, 150), "shopping_online_shopee", "Shopee",
                               _ts(d, _hour("late_night", rng), rng), False, "debit", rng))

        # ── Spotify (irregular — only 70 % of months) ─────────────
        if d.day == 5 and rng.random() < 0.70:
            txs.append(_tx(AID, 7.90, "subscription", "Spotify",
                           _ts(d, _hour("morning", rng), rng), True, "debit", rng))

        # ── Weekly TnG for car (Monday, 65 %) ─────────────────────
        if dow == 0 and rng.random() < 0.65:
            txs.append(_tx(AID, rng.uniform(40, 80), "transport_tng", "Touch n Go eWallet",
                           _ts(d, _hour("morning", rng), rng), False, "debit", rng))

        # ── Daily irregular spending (chaotic pattern = low Consistency) ──
        if rng.random() < 0.25:
            txs.append(_tx(AID, rng.uniform(10, 25), "food_grab", "Grab Food",
                           _ts(d, _hour("afternoon", rng), rng), False, "debit", rng))

        if rng.random() < 0.20:
            txs.append(_tx(AID, rng.uniform(8, 20), "food_mamak", "Mamak Pelita",
                           _ts(d, _hour("evening", rng), rng), False, "debit", rng))

        if rng.random() < 0.03:
            txs.append(_tx(AID, rng.uniform(30, 100), "medical", "Klinik Kesihatan",
                           _ts(d, _hour("morning", rng), rng), False, "debit", rng))

        if rng.random() < 0.04:
            txs.append(_tx(AID, rng.uniform(20, 80), "shopping_offline_mall",
                           rng.choice(["Mr. DIY", "Watson's"]),
                           _ts(d, _hour("afternoon", rng), rng), False, "debit", rng))

    txs.sort(key=lambda t: t["timestamp"])
    return txs


# ── Persona 4: Hafiz Bin Ramli ─────────────────────────────────────────────────
# T20 · RM7,200/month · highly disciplined · automated savings · predictable family spend
# Target stats: Restraint 88 · Consistency 92 · Resilience 85 · Foresight 90 · Recovery 70

def generate_hafiz(start: datetime, rng: random.Random) -> list[dict]:
    AID = "hafiz_001"
    txs: list[dict] = []

    for n in range(90):
        d = start + timedelta(days=n)
        dow = d.weekday()

        # ── Monthly scheduled events (automated, drives Consistency & Foresight) ──
        if d.day == 1:
            txs.append(_tx(AID, 7200.00, "salary", "Hospital HR",
                           _ts(d, 9, rng), True, "credit", rng))

        if d.day == 2:
            # RM1,500 automated savings — fired day after salary, always
            txs.append(_tx(AID, 1500.00, "savings_transfer", "Maybank Savings",
                           _ts(d, 8, rng), True, "transfer", rng))

        if d.day == 3:
            # RM800 investment / unit trust transfer
            txs.append(_tx(AID, 800.00, "family_transfer", "Maybank Transfer",
                           _ts(d, 8, rng), True, "transfer", rng))

        if d.day == 5:
            # Kids' school fees (maps to utilities — closest enum match)
            txs.append(_tx(AID, rng.uniform(200, 400), "utilities", "SRK Penang",
                           _ts(d, _hour("morning", rng), rng), True, "debit", rng))

        if d.day == 10:
            txs.append(_tx(AID, rng.uniform(100, 150), "utilities", "TNB",
                           _ts(d, _hour("morning", rng), rng), True, "debit", rng))

        if d.day == 12:
            txs.append(_tx(AID, rng.uniform(85, 105), "utilities", "Maxis",
                           _ts(d, _hour("morning", rng), rng), True, "debit", rng))
            txs.append(_tx(AID, rng.uniform(60, 80), "utilities", "Celcom",
                           _ts(d, _hour("morning", rng), rng), True, "debit", rng))

        if d.day == 15:
            # Family insurance premium
            txs.append(_tx(AID, rng.uniform(200, 300), "subscription", "Great Eastern",
                           _ts(d, _hour("morning", rng), rng), True, "debit", rng))

        if d.day == 20:
            # Home broadband
            txs.append(_tx(AID, 89.00, "utilities", "Maxis",
                           _ts(d, _hour("morning", rng), rng), True, "debit", rng))

        # ── Weekly fixed events ────────────────────────────────────
        # Groceries Tue & Sat (consistent family shop)
        if dow in (1, 5):
            txs.append(_tx(AID, rng.uniform(100, 200), "food_groceries",
                           rng.choice(["Tesco", "Mydin"]),
                           _ts(d, _hour("afternoon", rng), rng), False, "debit", rng))

        # Family meal out every Sunday (85 %)
        if dow == 6 and rng.random() < 0.85:
            txs.append(_tx(AID, rng.uniform(80, 150), "food_mamak",
                           rng.choice(["Old Town White Coffee", "McDonald's Malaysia"]),
                           _ts(d, _hour("afternoon", rng), rng), False, "debit", rng))

        # Weekly TnG top-up (Monday commute)
        if dow == 0:
            txs.append(_tx(AID, rng.uniform(50, 100), "transport_tng", "Touch n Go eWallet",
                           _ts(d, _hour("morning", rng), rng), True, "debit", rng))

        # ── Daily (almost zero impulse spend) ─────────────────────
        # Online shopping: ~1–2× in entire 90 days (0.8 % / day)
        if rng.random() < 0.008:
            txs.append(_tx(AID, rng.uniform(50, 200), "shopping_online_shopee", "Shopee",
                           _ts(d, _hour("evening", rng), rng), False, "debit", rng))

        # Watson's / Guardian (family medicine needs, 2 % / day)
        if rng.random() < 0.02:
            txs.append(_tx(AID, rng.uniform(30, 80), "medical",
                           rng.choice(["Watson's", "Guardian"]),
                           _ts(d, _hour("afternoon", rng), rng), False, "debit", rng))

        # Very occasional Grab food (5 % / day — he mostly eats home / family meals)
        if rng.random() < 0.05:
            txs.append(_tx(AID, rng.uniform(15, 25), "food_grab", "Grab Food",
                           _ts(d, _hour("afternoon", rng), rng), False, "debit", rng))

    txs.sort(key=lambda t: t["timestamp"])
    return txs


# ── Gate-check printer ─────────────────────────────────────────────────────────

def print_stats(name: str, txs: list[dict]) -> None:
    print(f"\n{'-' * 56}")
    print(f"  {name.upper()}  ({len(txs)} transactions)")
    print(f"{'-' * 56}")

    cat_count: Counter = Counter()
    cat_spend: defaultdict[str, float] = defaultdict(float)

    for t in txs:
        cat_count[t["category"]] += 1
        if t["transaction_type"] in ("debit", "transfer"):
            cat_spend[t["category"]] += t["amount"]

    print("  Top 5 categories by transaction count:")
    for cat, cnt in cat_count.most_common(5):
        print(f"    {cat:<35} {cnt:>4} txs")

    print("  Top 5 categories by total spend (debit + transfer):")
    for cat, amt in sorted(cat_spend.items(), key=lambda x: -x[1])[:5]:
        print(f"    {cat:<35} RM {amt:>9.2f}")

    total_in  = sum(t["amount"] for t in txs if t["transaction_type"] == "credit")
    total_out = sum(t["amount"] for t in txs if t["transaction_type"] in ("debit", "transfer"))
    print(f"  Total income credited:  RM {total_in:>10.2f}")
    print(f"  Total debit+transfer:   RM {total_out:>10.2f}")


# ── Entry point ────────────────────────────────────────────────────────────────

def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    START = datetime(2025, 1, 1)

    personas: list[tuple[str, int, object]] = [
        ("aisyah",   1, generate_aisyah),
        ("daniel",   2, generate_daniel),
        ("mei_ling", 3, generate_mei_ling),
        ("hafiz",    4, generate_hafiz),
    ]

    for persona_name, seed, generator in personas:
        rng = random.Random(seed)
        txs: list[dict] = generator(START, rng)  # type: ignore[operator]
        out_path = OUTPUT_DIR / f"{persona_name}.json"
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(txs, f, indent=2, ensure_ascii=False)
        print_stats(persona_name, txs)

    print(f"\nAll 4 personas written to {OUTPUT_DIR.resolve()}\n")


if __name__ == "__main__":
    main()
