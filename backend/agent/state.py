"""LangGraph state schema.

TypedDict is what LangGraph merges between nodes. Each node returns a partial
dict; LangGraph shallow-merges it onto the running state.
"""

from typing import List, TypedDict


MAX_ITERATIONS = 2  # hard cap on planning passes; prevents infinite critic loops


def should_replan(critic_score: int, iteration: int) -> bool:
    """Loop back to the planner only if the report is weak and we have budget left."""
    return critic_score < 7 and iteration < MAX_ITERATIONS


class ResearchState(TypedDict, total=False):
    query: str                    # original user question
    sub_questions: List[str]      # planner output
    search_results: List[dict]    # searcher output (SearchResult dicts)
    page_contents: List[dict]     # reader output (PageContent dicts)
    report: str                   # synthesizer output, rendered markdown
    citations: List[str]          # source URLs referenced in the report
    critic_score: int             # 0-10 from the critic
    iteration: int                # planning passes so far; hard-capped at 2
