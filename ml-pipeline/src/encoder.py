"""Transaction → discrete token encoder.

Token format: f"{category}|{amount_bucket}|{time_of_day_bucket}|{is_recurring}"

Amount buckets (log-scale): <10 | 10-50 | 50-200 | 200-1000 | >1000
Time-of-day buckets:        morning (6-11) | afternoon (12-16) | evening (17-21) | late_night (22+)
"""

from datetime import datetime


def amount_bucket(amount: float) -> str:
    if amount < 10:
        return "<10"
    if amount < 50:
        return "10-50"
    if amount < 200:
        return "50-200"
    if amount < 1000:
        return "200-1000"
    return ">1000"


def time_bucket(hour: int) -> str:
    if 6 <= hour <= 11:
        return "morning"
    if 12 <= hour <= 16:
        return "afternoon"
    if 17 <= hour <= 21:
        return "evening"
    return "late_night"


def encode_transaction(tx: dict) -> str:
    hour = datetime.fromisoformat(tx["timestamp"]).hour
    return (
        f"{tx['category']}"
        f"|{amount_bucket(tx['amount'])}"
        f"|{time_bucket(hour)}"
        f"|{tx['is_recurring']}"
    )


def encode_persona(transactions: list[dict]) -> list[str]:
    """Returns time-ordered token list for one persona."""
    sorted_txs = sorted(transactions, key=lambda t: t["timestamp"])
    return [encode_transaction(tx) for tx in sorted_txs]
