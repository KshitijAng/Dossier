"""FastAPI app that exposes the research agent over HTTP.

Flow of POST /research:
  1. run the LangGraph agent
  2. save the run to Supabase (for the History view)

Persistence degrades gracefully: if Supabase isn't configured, the agent still
runs, just without saving.

Run:  uvicorn main:app --reload
Docs: http://127.0.0.1:8000/docs
"""

import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import db
from agent.graph import run_research

app = FastAPI(title="Dossier API")

# Which frontend origins may call this API from the browser.
# Local dev defaults to localhost:3000; in production set FRONTEND_ORIGINS to
# your Vercel URL (comma-separated if more than one).
origins = os.getenv("FRONTEND_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in origins],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ResearchRequest(BaseModel):
    query: str = Field(min_length=1, description="The research question to investigate")


class ResearchResponse(BaseModel):
    id: str | None = None
    query: str
    report: str
    citations: list[str]
    critic_score: int


@app.post("/research", response_model=ResearchResponse)
def research(req: ResearchRequest):
    """Run the agent for a query and persist the result."""
    try:
        result = run_research(req.query)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent failed: {e}")

    payload = {
        "query": req.query,
        "report": result["report"],
        "citations": result.get("citations", []),
        "critic_score": result.get("critic_score", 0),
    }

    saved = db.save_run(**payload)  # no-op if Supabase isn't configured
    if saved:
        payload["id"] = saved["id"]

    return ResearchResponse(**payload)


@app.get("/runs")
def list_runs():
    """List past research runs, newest first."""
    return db.list_runs()


@app.get("/runs/{run_id}")
def get_run(run_id: str):
    """Get one past run by id."""
    run = db.get_run(run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    return run
