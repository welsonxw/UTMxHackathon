"""N-gram behavioral pattern miner.

For k = 3..7, extracts significant recurring motifs from a token sequence.
Significance test: chi-square (observed vs expected under independence) +
shuffled-baseline permutation threshold + minimum-count guard.

Returns raw chi2 sum and token entropy so the notebook can combine them into
the final motif_strength_score (= Consistency stat axis).
"""

import math
import random
from collections import Counter
from typing import Any

import numpy as np


# ── Internal helpers ───────────────────────────────────────────────────────────

def _ngrams(tokens: list[str], k: int) -> list[tuple[str, ...]]:
    return [tuple(tokens[i : i + k]) for i in range(len(tokens) - k + 1)]


def _expected_count(ngram: tuple[str, ...], probs: dict[str, float], n_positions: int) -> float:
    p = 1.0
    for tok in ngram:
        p *= probs.get(tok, 1e-9)
    return max(p * n_positions, 1e-9)


def _shuffled_threshold(tokens: list[str], k: int, n_shuffles: int, rng: random.Random) -> float:
    """95th-percentile of max n-gram count across random permutations."""
    buf = tokens[:]
    maxes: list[int] = []
    for _ in range(n_shuffles):
        rng.shuffle(buf)
        counts = Counter(_ngrams(buf, k))
        maxes.append(max(counts.values()) if counts else 0)
    return float(np.percentile(maxes, 95.0))


def token_entropy(tokens: list[str]) -> float:
    """Shannon entropy H in bits. Lower = more concentrated = more predictable."""
    n = len(tokens)
    if n == 0:
        return 0.0
    counts = Counter(tokens)
    return -sum((c / n) * math.log2(c / n) for c in counts.values())


# ── Public API ─────────────────────────────────────────────────────────────────

def compute_motifs(
    tokens: list[str],
    k_range: range = range(3, 8),
    n_shuffles: int = 100,
    seed: int = 42,
) -> tuple[list[dict[str, Any]], float]:
    """
    Returns (top_10_motifs, raw_chi2_sum).

    A motif is significant when its observed count exceeds both:
      1. The 95th-percentile of max counts from shuffled permutations (noise floor)
      2. 1 (must appear at least twice; count>threshold already implies this when
         threshold>=1, but kept explicit for clarity)

    Note: we intentionally allow count=2 motifs — some legitimate 6-gram
    behavioral sequences (e.g. Aisyah's Thursday-mamak/Friday-savings cluster)
    only complete twice across 90 days but are statistically highly significant.
    The chi2 score naturally weights these correctly relative to noisier patterns.
    """
    rng = random.Random(seed)
    n = len(tokens)

    if n < k_range.start:
        return [], 0.0

    counts_1: Counter[str] = Counter(tokens)
    probs: dict[str, float] = {t: c / n for t, c in counts_1.items()}

    all_motifs: list[dict[str, Any]] = []
    total_chi2 = 0.0

    for k in k_range:
        if n <= k:
            continue

        ngram_counts = Counter(_ngrams(tokens, k))
        n_positions = n - k + 1
        threshold = _shuffled_threshold(tokens, k, n_shuffles, rng)

        for ngram, obs in ngram_counts.items():
            if obs <= threshold:
                continue  # does not beat shuffled noise floor

            exp = _expected_count(ngram, probs, n_positions)
            chi2 = (obs - exp) ** 2 / exp
            total_chi2 += chi2

            all_motifs.append(
                {
                    "motif": " -> ".join(ngram),
                    "k": k,
                    "count": obs,
                    "expected": round(exp, 4),
                    "chi2": round(chi2, 4),
                }
            )

    all_motifs.sort(key=lambda m: m["chi2"], reverse=True)
    return all_motifs[:10], round(total_chi2, 2)


def normalise_scores(
    raw_chi2s: dict[str, float],
    entropies: dict[str, float],
    chi2_weight: float = 0.30,
    target_max: float = 92.0,
) -> dict[str, float]:
    """
    Combines log-scaled chi2 sum (structural motif strength) with inverse
    token entropy (distribution concentration) into a single 0-100 score.

    chi2_weight=0.80 keeps structural patterns primary while letting entropy
    break ties between personas whose chi2 sums are both near zero
    (e.g. Daniel vs Mei Ling).  Lower entropy = more predictable = higher score.
    """
    personas = list(raw_chi2s.keys())

    # chi2 component: log1p-scaled so Hafiz's extreme values don't crush others
    log_chi2 = {p: np.log1p(raw_chi2s[p]) for p in personas}
    max_log = max(log_chi2.values()) or 1.0
    chi2_comp = {p: log_chi2[p] / max_log for p in personas}

    # entropy component: (max_H - H) / range  =>  high = low entropy = predictable
    max_h = max(entropies.values())
    min_h = min(entropies.values())
    h_range = max_h - min_h or 1.0
    entropy_comp = {p: (max_h - entropies[p]) / h_range for p in personas}

    entropy_weight = 1.0 - chi2_weight
    combined = {
        p: chi2_weight * chi2_comp[p] + entropy_weight * entropy_comp[p]
        for p in personas
    }

    max_combined = max(combined.values()) or 1.0
    return {
        p: round(min(100.0, (combined[p] / max_combined) * target_max), 1)
        for p in personas
    }
