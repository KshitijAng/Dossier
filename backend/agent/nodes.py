"""The five agent nodes: planner, searcher, reader, synthesizer, critic.

Each node takes the state and returns the fields it wants to update; LangGraph
merges them back in.
"""

import os
from typing import List

from dotenv import load_dotenv
from langfuse.decorators import observe   # traces the node it decorates
from langfuse.openai import OpenAI 

from agent.state import ResearchState
from agent.tools import read_page, web_search
from schemas import (
    CitedReport,
    CriticResult,
    SubQuestionList,
)

load_dotenv()

MODEL = os.getenv("GITHUB_MODEL", "gpt-4o-mini")
BASE_URL = os.getenv("GITHUB_MODELS_BASE_URL", "https://models.inference.ai.azure.com")


client = OpenAI(base_url=BASE_URL, api_key=os.getenv("GITHUB_TOKEN"))


def _structured(system: str, user: str, schema):
    """Make one LLM call and get the answer back as a Pydantic object."""
    completion = client.beta.chat.completions.parse(
        model=MODEL,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        response_format=schema,
    )
    return completion.choices[0].message.parsed


@observe()
def planner_node(state: ResearchState) -> dict:
    """Break the query into 3-5 focused sub-questions."""
    query = state["query"]
    result: SubQuestionList = _structured(
        "You are a research planner. Break the user's question into 3 to 5 focused, "
        "non-overlapping sub-questions that together fully answer it.",
        query,
        SubQuestionList,
    )
    return {
        "sub_questions": [sq.question for sq in result.sub_questions],
        "iteration": state.get("iteration", 0) + 1,
    }


@observe()
def searcher_node(state: ResearchState) -> dict:
    """Run a web search for each sub-question."""
    results: List[dict] = []
    for q in state["sub_questions"]:
        for r in web_search(q, max_results=3):
            results.append({**r.model_dump(), "sub_question": q})
    return {"search_results": results}


@observe()
def reader_node(state: ResearchState) -> dict:
    """Fetch and extract the top 2 URLs per sub-question (deduped globally)."""
    by_question: dict[str, List[str]] = {}
    for r in state["search_results"]:
        by_question.setdefault(r["sub_question"], []).append(r["url"])

    pages: List[dict] = []
    seen: set[str] = set()
    for urls in by_question.values():
        taken = 0
        for url in urls:
            if taken >= 2:
                break
            if url in seen:
                continue
            seen.add(url)
            page = read_page(url)
            if page:
                pages.append(page.model_dump())
                taken += 1
    return {"page_contents": pages}


@observe()
def synthesizer_node(state: ResearchState) -> dict:
    """Merge all page content into a structured, cited report."""
    pages = state["page_contents"]
    source_urls = [p["url"] for p in pages]

    # Numbered sources so the model can cite [1], [2], ... inline.
    context = "\n\n".join(
        f"[{i}] {p['title']} ({p['url']})\n{p['text'][:2000]}"
        for i, p in enumerate(pages, 1)
    )

    report: CitedReport = _structured(
        "You are a research writer. Using ONLY the numbered sources provided, write a "
        "structured report answering the user's question. Cite sources inline as [n]. "
        "Populate `citations` with the source URLs in numeric order.",
        f"Question: {state['query']}\n\nSources:\n{context}",
        CitedReport,
    )
    if not report.citations:
        report.citations = source_urls
    return {"report": report.to_markdown(), "citations": report.citations}


@observe()
def critic_node(state: ResearchState) -> dict:
    """Score report completeness 0-10; suggest a refined query if it falls short."""
    result: CriticResult = _structured(
        "You are a critical reviewer. Score how completely the report answers the "
        "question from 0 to 10. If below 7, propose a refined query to research next.",
        f"Question: {state['query']}\n\nReport:\n{state['report']}",
        CriticResult,
    )
    out: dict = {"critic_score": result.score}
    if result.score < 7 and result.refined_query:
        out["query"] = result.refined_query  # planner picks this up on the next loop
    return out
