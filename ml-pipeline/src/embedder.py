"""UMAP + HDBSCAN behavior embedder.

Feature vector (~42 dims):
  [token_entropy, motif_strength, category_dist×18, volatility×18, time_dist×4]

Ghost users: 50 interpolated personas for UMAP stability with n=4.
Only the 4 real personas appear in the output embeddings.json.
"""

import json
import math
import random
from collections import Counter
from pathlib import Path
from typing import Any

import numpy as np
from sklearn.cluster import HDBSCAN
import umap

CATEGORIES = [
    "food_groceries", "food_mamak", "food_grab", "food_restaurant",
    "transport_grab", "transport_tng", "transport_petrol",
    "savings_transfer", "investment",
    "utilities", "subscription", "healthcare", "education",
    "shopping_shopee", "shopping_lazada", "shopping_fashion",
    "flexi_credit", "family_transfer",
]
CAT_INDEX = {c: i for i, c in enumerate(CATEGORIES)}
TIME_BUCKETS = ["morning", "afternoon", "evening", "late_night"]


def _parse_token(token: str) -> tuple[str, str, str, str]:
    parts = token.split("|")
    return parts[0], parts[1], parts[2], parts[3]


def _category_from_token(token: str) -> str:
    return token.split("|")[0]


def _time_from_token(token: str) -> str:
    return token.split("|")[2]


def _amount_midpoint(bucket: str) -> float:
    mapping = {"<10": 5.0, "10-50": 30.0, "50-200": 125.0, "200-1000": 600.0, ">1000": 1500.0}
    return mapping.get(bucket, 30.0)


def extract_features(
    tokens: list[str],
    motif_strength: float,
    entropy: float,
) -> np.ndarray:
    n = len(tokens)
    if n == 0:
        return np.zeros(2 + len(CATEGORIES) * 2 + len(TIME_BUCKETS))

    # Category distribution (18 dims)
    cat_counts = Counter(_category_from_token(t) for t in tokens)
    cat_dist = np.array([cat_counts.get(c, 0) / n for c in CATEGORIES])

    # Per-category amount volatility: std/mean of inferred amounts (18 dims)
    cat_amounts: dict[str, list[float]] = {c: [] for c in CATEGORIES}
    for tok in tokens:
        cat, amt_bucket, _, _ = _parse_token(tok)
        if cat in cat_amounts:
            cat_amounts[cat].append(_amount_midpoint(amt_bucket))
    volatilities = []
    for c in CATEGORIES:
        vals = cat_amounts[c]
        if len(vals) < 2:
            volatilities.append(0.0)
        else:
            mu = sum(vals) / len(vals)
            std = math.sqrt(sum((v - mu) ** 2 for v in vals) / len(vals))
            volatilities.append(std / mu if mu > 0 else 0.0)
    vol_vec = np.array(volatilities)

    # Time-of-day distribution (4 dims)
    time_counts = Counter(_time_from_token(t) for t in tokens)
    time_dist = np.array([time_counts.get(b, 0) / n for b in TIME_BUCKETS])

    # Scalar features (2 dims): normalised entropy + motif strength
    scalars = np.array([entropy / 6.0, motif_strength / 100.0])

    return np.concatenate([scalars, cat_dist, vol_vec, time_dist])


def _make_ghost_users(
    real_features: dict[str, np.ndarray],
    n_ghosts: int = 50,
    noise_std: float = 0.04,
    seed: int = 42,
) -> list[np.ndarray]:
    rng = np.random.RandomState(seed)
    personas = list(real_features.values())
    ghosts = []
    pairs = [(i, j) for i in range(len(personas)) for j in range(i + 1, len(personas))]
    for idx in range(n_ghosts):
        pi, pj = pairs[idx % len(pairs)]
        alpha = rng.uniform(0.1, 0.9)
        interp = alpha * personas[pi] + (1 - alpha) * personas[pj]
        noise = rng.normal(0, noise_std, size=interp.shape)
        ghosts.append(np.clip(interp + noise, 0, None))
    return ghosts


def embed_personas(
    real_features: dict[str, np.ndarray],
    n_ghosts: int = 50,
    seed: int = 42,
) -> dict[str, dict[str, Any]]:
    ghosts = _make_ghost_users(real_features, n_ghosts=n_ghosts, seed=seed)
    real_names = list(real_features.keys())
    all_vecs = [real_features[p] for p in real_names] + ghosts

    X = np.array(all_vecs)
    # Normalise each feature to [0,1] across all 54 users
    col_max = X.max(axis=0)
    col_max[col_max == 0] = 1.0
    X_norm = X / col_max

    n_total = len(X_norm)
    reducer = umap.UMAP(
        n_components=2,
        n_neighbors=min(10, n_total - 1),
        min_dist=0.3,
        random_state=seed,
        metric="euclidean",
    )
    embedding = reducer.fit_transform(X_norm)

    clusterer = HDBSCAN(min_cluster_size=3, min_samples=2)
    labels = clusterer.fit_predict(embedding)

    results: dict[str, dict[str, Any]] = {}
    for i, name in enumerate(real_names):
        results[name] = {
            "x": round(float(embedding[i, 0]), 4),
            "y": round(float(embedding[i, 1]), 4),
            "cluster_id": int(labels[i]),
        }
    return results
