#!/usr/bin/env python3
"""
Syncs pricing and context window for the tracked models from OpenRouter's
free public API — no API key required.

What it updates automatically:  inputPricePer1M, outputPricePer1M, contextWindow
What stays manual:              description, capabilities, icons, releaseDate,
                                consumerPlan, vision, thinking, openSource

Run locally:  python scripts/update_models.py
CI:           triggered weekly by .github/workflows/update-models.yml
"""
import json
import os
import sys
import urllib.request
from pathlib import Path

import yaml

MODELS_FILE = Path(__file__).parent.parent / "models-data.yml"
OPENROUTER_API = "https://openrouter.ai/api/v1/models"

# Providers whose new models we want to be alerted about
TRACKED_PREFIXES = (
    "anthropic/",
    "openai/",
    "google/",
    "meta-llama/",
    "mistralai/",
    "deepseek/",
    "x-ai/",
    "qwen/",
)

# Maps our site model id  →  OpenRouter model id
# Verify / update IDs at: https://openrouter.ai/models
# (raw list: curl https://openrouter.ai/api/v1/models | python3 -m json.tool | grep '"id"')
OPENROUTER_ID_MAP: dict[str, str | None] = {
    "claude-opus-4-7":   "anthropic/claude-opus-4.7",
    "claude-sonnet-4-6": "anthropic/claude-sonnet-4.6",
    "claude-haiku-4-5":  "anthropic/claude-haiku-4.5",
    "gpt-4o":            "openai/gpt-4o",
    "gpt-4o-mini":       "openai/gpt-4o-mini",
    "o3":                "openai/o3",
    "o4-mini":           "openai/o4-mini",
    "gemini-3-1-pro":    "google/gemini-2.5-pro-preview",
    "gemini-2-5-flash":  "google/gemini-2.5-flash",
    "llama-3-3-70b":     "meta-llama/llama-3.3-70b-instruct",
    "llama-4-maverick":  "meta-llama/llama-4-maverick",
    "mistral-large-2":   "mistralai/mistral-large",
    "deepseek-v3":       "deepseek/deepseek-chat-v3-0324",
    "deepseek-r1":       "deepseek/deepseek-r1",
    "grok-3":            "x-ai/grok-3",
    "deepseek-v4":       "deepseek/deepseek-v4-pro",
    "glm-5-1":           "z-ai/glm-5.1",
    "mimo-v2-5-pro":     None,  # not on OpenRouter — update manually
    "qwen3-6-plus":      "qwen/qwen-plus",
    "minimax-m2-7":      None,  # not on OpenRouter — update manually
}


def fetch_openrouter() -> dict[str, dict]:
    req = urllib.request.Request(
        OPENROUTER_API,
        headers={"User-Agent": "pickmodel-updater/1.0 (github.com/cloudcap10/pickmodel)"},
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.loads(resp.read())
    return {m["id"]: m for m in data["data"]}


def sync_model(model: dict, or_entry: dict) -> bool:
    """Update pricing and context from OpenRouter. Returns True if anything changed."""
    changed = False
    pricing = or_entry.get("pricing", {})

    # OpenRouter pricing is per-token as a string; we store per-1M tokens
    for our_key, or_key in [("inputPricePer1M", "prompt"), ("outputPricePer1M", "completion")]:
        raw = pricing.get(or_key)
        if raw is None:
            continue
        new_val = round(float(raw) * 1_000_000, 4)
        if model.get(our_key) != new_val:
            model[our_key] = new_val
            changed = True

    ctx = or_entry.get("context_length")
    if ctx is not None and model.get("contextWindow") != ctx:
        model["contextWindow"] = ctx
        changed = True

    return changed


def detect_new_models(or_models: dict[str, dict], tracked_or_ids: set[str]) -> list[dict]:
    """Return OpenRouter models from tracked providers that we don't have yet.

    Filters out variant/instruct/free suffixes to reduce noise — we only surface
    base model IDs (no ':free', ':extended', '-instruct', '-preview' suffixes that
    are just access-tier aliases of an existing model).
    """
    noise_suffixes = (":free", ":extended", ":nitro", ":floor", "-instruct", "-preview", "-latest")
    candidates = []
    for or_id, entry in or_models.items():
        if not any(or_id.startswith(p) for p in TRACKED_PREFIXES):
            continue
        if or_id in tracked_or_ids:
            continue
        if any(or_id.endswith(s) for s in noise_suffixes):
            continue
        candidates.append({
            "id": or_id,
            "name": entry.get("name", or_id),
            "context": entry.get("context_length"),
            "input_price": round(float(entry.get("pricing", {}).get("prompt", 0) or 0) * 1_000_000, 4),
            "output_price": round(float(entry.get("pricing", {}).get("completion", 0) or 0) * 1_000_000, 4),
        })
    return sorted(candidates, key=lambda x: x["id"])


def write_github_summary(updated: list, missing: list, new_models: list) -> None:
    """Write a Markdown summary to GITHUB_STEP_SUMMARY if running in CI."""
    summary_file = os.environ.get("GITHUB_STEP_SUMMARY")
    if not summary_file:
        return

    lines = ["## Autopilot model sync\n"]

    if updated:
        lines.append(f"### Updated ({len(updated)})\n")
        for mid in updated:
            lines.append(f"- `{mid}`")
        lines.append("")
    else:
        lines.append("**No pricing/context changes detected.**\n")

    if missing:
        lines.append(f"### ⚠️ Mapping broken ({len(missing)})\n")
        lines.append("These models are in `models-data.yml` but their OpenRouter ID was not found.\nCheck `OPENROUTER_ID_MAP` in `scripts/update_models.py`.\n")
        for mid in missing:
            lines.append(f"- `{mid}`")
        lines.append("")

    if new_models:
        lines.append(f"### 🆕 New models detected on OpenRouter ({len(new_models)})\n")
        lines.append("These models from tracked providers are **not yet in** `models-data.yml`.\nReview and add any that are relevant.\n")
        lines.append("| OpenRouter ID | Name | Context | Input $/1M | Output $/1M |")
        lines.append("|---|---|---|---|---|")
        for m in new_models:
            ctx = f"{m['context']:,}" if m['context'] else "—"
            lines.append(f"| `{m['id']}` | {m['name']} | {ctx} | ${m['input_price']} | ${m['output_price']} |")
        lines.append("")
    else:
        lines.append("**No new untracked models detected.**\n")

    with open(summary_file, "a") as f:
        f.write("\n".join(lines))


def main() -> None:
    print("Fetching OpenRouter model catalogue…")
    try:
        or_models = fetch_openrouter()
    except Exception as exc:
        print(f"ERROR: could not reach OpenRouter API: {exc}", file=sys.stderr)
        sys.exit(1)

    print(f"  {len(or_models)} models available on OpenRouter\n")

    raw = MODELS_FILE.read_text(encoding="utf-8")
    data = yaml.safe_load(raw)
    models: list[dict] = data["models"]

    updated, skipped, missing = [], [], []
    tracked_or_ids: set[str] = set()

    for model in models:
        mid = model["id"]
        or_id = OPENROUTER_ID_MAP.get(mid)

        if or_id is None:
            print(f"  SKIP     {mid:30s}  (no OpenRouter mapping)")
            skipped.append(mid)
            continue

        tracked_or_ids.add(or_id)
        or_entry = or_models.get(or_id)
        if or_entry is None:
            print(f"  MISSING  {mid:30s}  → {or_id} not found on OpenRouter")
            missing.append(mid)
            continue

        if sync_model(model, or_entry):
            print(f"  UPDATED  {mid:30s}  ← {or_id}")
            updated.append(mid)
        else:
            print(f"  OK       {mid:30s}  (no change)")

    print()
    if updated:
        MODELS_FILE.write_text(
            yaml.dump(data, allow_unicode=True, sort_keys=False, default_flow_style=False),
            encoding="utf-8",
        )
        print(f"Saved {len(updated)} update(s): {', '.join(updated)}")
    else:
        print("No changes — models-data.yml is already up to date.")

    if missing:
        print(
            f"\nWARNING: {len(missing)} model(s) not found on OpenRouter "
            "(check OPENROUTER_ID_MAP at the top of this script):\n  "
            + "\n  ".join(missing)
        )

    # Detect new models from tracked providers not yet in our list
    new_models = detect_new_models(or_models, tracked_or_ids)
    if new_models:
        print(f"\n🆕 {len(new_models)} new model(s) detected on OpenRouter (not yet tracked):")
        for m in new_models:
            ctx = f"{m['context']:,}" if m['context'] else "—"
            print(f"  {m['id']:50s}  ctx={ctx}  ${m['input_price']}/1M in")
    else:
        print("\nNo new untracked models detected.")

    write_github_summary(updated, missing, new_models)


if __name__ == "__main__":
    main()
