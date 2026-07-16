"""Supabase (Postgres) persistence for research runs.

One table, `research_runs` (see schema.sql). If Supabase isn't configured,
saving is a no-op and the list/get endpoints return empty so the app still runs.
"""

import os

from dotenv import load_dotenv

load_dotenv()  # load .env before reading keys — don't rely on import order

_url = os.getenv("SUPABASE_URL")
_key = os.getenv("SUPABASE_KEY")

if _url and _key:
    from supabase import create_client

    _client = create_client(_url, _key)
else:
    _client = None  # persistence disabled — app runs without it

TABLE = "research_runs"


def save_run(query: str, report: str, citations: list[str], critic_score: int) -> dict | None:
    """Insert a completed run and return the stored row (with id, created_at)."""
    if _client is None:
        return None
    row = {
        "query": query,
        "report": report,
        "citations": citations,
        "critic_score": critic_score,
    }
    result = _client.table(TABLE).insert(row).execute()
    return result.data[0] if result.data else None


def list_runs() -> list[dict]:
    """Return past runs, newest first (id, query, critic_score, created_at)."""
    if _client is None:
        return []
    result = (
        _client.table(TABLE)
        .select("id, query, critic_score, created_at")
        .order("created_at", desc=True)
        .execute()
    )
    return result.data or []


def get_run(run_id: str) -> dict | None:
    """Return a single full run by id, or None if not found."""
    if _client is None:
        return None
    result = _client.table(TABLE).select("*").eq("id", run_id).execute()
    return result.data[0] if result.data else None
