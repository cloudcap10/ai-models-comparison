#!/usr/bin/env python3
"""
Autopilot: fetch provider docs and use Claude to suggest updates to models-data.yml.
Writes an updated YAML in-place; the GitHub Actions workflow then diffs and PRs.
"""

import os
import sys
import json
import re
import time
from pathlib import Path

import anthropic
import yaml
import requests

REPO_ROOT = Path(__file__).parent.parent
MODELS_FILE = REPO_ROOT / "models-data.yml"

# Provider documentation pages to fetch
PROVIDER_PAGES = [
    {
        "provider": "Anthropic",
        "url": "https://www.anthropic.com/pricing",
        "note": "Claude model pricing",
    },
    {
        "provider": "OpenAI",
        "url": "https://openai.com/api/pricing/",
        "note": "GPT model pricing",
    },
    {
        "provider": "Google",
        "url": "https://ai.google.dev/gemini-api/docs/models/gemini",
        "note": "Gemini model specs",
    },
    {
        "provider": "Meta",
        "url": "https://llama.meta.com/",
        "note": "Llama model releases",
    },
    {
        "provider": "Mistral",
        "url": "https://mistral.ai/products/",
        "note": "Mistral model lineup",
    },
    {
        "provider": "DeepSeek",
        "url": "https://api-docs.deepseek.com/quick_start/pricing",
        "note": "DeepSeek pricing",
    },
    {
        "provider": "xAI",
        "url": "https://x.ai/grok",
        "note": "Grok model details",
    },
]

HEADERS = {
    "User-Agent": "PickModel-Autopilot/1.0 (+https://pickmodel.uk)",
    "Accept": "text/html,application/xhtml+xml",
}


def fetch_page(url: str, timeout: int = 15) -> str:
    try:
        r = requests.get(url, headers=HEADERS, timeout=timeout)
        r.raise_for_status()
        # Strip HTML tags roughly — Claude can read the raw text
        text = re.sub(r"<[^>]+>", " ", r.text)
        text = re.sub(r"\s{3,}", "\n\n", text)
        return text[:8000]  # Cap per page to keep context lean
    except Exception as exc:
        return f"[fetch failed: {exc}]"


def load_current_yaml() -> tuple[dict, str]:
    raw = MODELS_FILE.read_text()
    return yaml.safe_load(raw), raw


def build_provider_context(pages: list[dict]) -> str:
    parts = []
    for p in pages:
        print(f"  Fetching {p['provider']}: {p['url']}", flush=True)
        content = fetch_page(p["url"])
        parts.append(f"=== {p['provider']} ({p['note']}) ===\n{content}\n")
        time.sleep(0.5)  # Polite crawling
    return "\n".join(parts)


SYSTEM_PROMPT = """\
You are a data curator for pickmodel.uk, a website that compares AI language models.
Your job is to review the current models-data.yml and suggest accurate updates based on
freshly fetched provider documentation.

Rules:
1. Only change values you are confident about from the provided documentation.
2. Do NOT remove existing models — only update or add.
3. When adding a new model, include ALL fields present in existing entries.
4. Output ONLY valid YAML — the entire updated models-data.yml — with no markdown fences.
5. If nothing needs updating, output the YAML unchanged.
6. Be conservative: when in doubt, leave the existing value.
7. Prices are per 1M tokens in USD.
8. Dates use YYYY-MM format (e.g., "2025-04").
9. contextWindow and maxOutput are integers (token counts).
"""


def ask_claude(client: anthropic.Anthropic, current_yaml: str, provider_context: str) -> str:
    print("  Asking Claude to review changes...", flush=True)

    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=8192,
        system=SYSTEM_PROMPT,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Here is the current models-data.yml:\n\n```yaml\n"
                        + current_yaml
                        + "\n```",
                        "cache_control": {"type": "ephemeral"},
                    },
                    {
                        "type": "text",
                        "text": "Here is fresh documentation from provider websites:\n\n"
                        + provider_context,
                        "cache_control": {"type": "ephemeral"},
                    },
                    {
                        "type": "text",
                        "text": (
                            "Please output the complete updated models-data.yml. "
                            "Include only YAML — no explanation, no markdown fences."
                        ),
                    },
                ],
            }
        ],
        betas=["prompt-caching-2024-07-31"],
    )

    return response.content[0].text.strip()


def looks_like_valid_yaml(text: str) -> bool:
    try:
        data = yaml.safe_load(text)
        return isinstance(data, dict) and "models" in data and isinstance(data["models"], list)
    except yaml.YAMLError:
        return False


def main() -> None:
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("ERROR: ANTHROPIC_API_KEY environment variable not set.", file=sys.stderr)
        sys.exit(1)

    print("PickModel autopilot starting...", flush=True)

    current_data, current_yaml = load_current_yaml()
    print(f"  Loaded {len(current_data['models'])} models from models-data.yml", flush=True)

    print("Fetching provider documentation...", flush=True)
    provider_context = build_provider_context(PROVIDER_PAGES)

    client = anthropic.Anthropic(api_key=api_key)
    updated_yaml = ask_claude(client, current_yaml, provider_context)

    # Strip accidental markdown fences if Claude wrapped it anyway
    updated_yaml = re.sub(r"^```ya?ml\s*\n", "", updated_yaml, flags=re.MULTILINE)
    updated_yaml = re.sub(r"\n```\s*$", "", updated_yaml)

    if not looks_like_valid_yaml(updated_yaml):
        print("ERROR: Claude returned invalid YAML. Aborting to avoid corruption.", file=sys.stderr)
        print("--- Claude output ---", file=sys.stderr)
        print(updated_yaml[:500], file=sys.stderr)
        sys.exit(1)

    updated_data = yaml.safe_load(updated_yaml)
    new_count = len(updated_data["models"])
    old_count = len(current_data["models"])

    if new_count < old_count:
        print(
            f"ERROR: Model count dropped {old_count} → {new_count}. Aborting to prevent data loss.",
            file=sys.stderr,
        )
        sys.exit(1)

    MODELS_FILE.write_text(updated_yaml + "\n")
    print(
        f"Done. {old_count} → {new_count} models. Updated models-data.yml written.",
        flush=True,
    )


if __name__ == "__main__":
    main()
