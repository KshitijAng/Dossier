"""LangGraph state machine wiring the five nodes together.

Flow: planner -> searcher -> reader -> synthesizer -> critic
The critic loops back to the planner while the report is weak and iteration
budget remains, otherwise ends.
"""

from langgraph.graph import END, START, StateGraph

from agent.nodes import (
    critic_node,
    planner_node,
    reader_node,
    searcher_node,
    synthesizer_node,
)
from agent.state import ResearchState, should_replan


def _route_after_critic(state: ResearchState) -> str:
    """Conditional edge: re-plan or finish."""
    if should_replan(state["critic_score"], state.get("iteration", 0)):
        return "planner"
    return END


def build_graph():
    """Compile and return the research agent graph."""
    g = StateGraph(ResearchState)
    g.add_node("planner", planner_node)
    g.add_node("searcher", searcher_node)
    g.add_node("reader", reader_node)
    g.add_node("synthesizer", synthesizer_node)
    g.add_node("critic", critic_node)

    g.add_edge(START, "planner")
    g.add_edge("planner", "searcher")
    g.add_edge("searcher", "reader")
    g.add_edge("reader", "synthesizer")
    g.add_edge("synthesizer", "critic")
    g.add_conditional_edges("critic", _route_after_critic, ["planner", END])

    return g.compile()


graph = build_graph()


def run_research(query: str) -> ResearchState:
    """Run the agent end to end for a single query."""
    return graph.invoke({"query": query, "iteration": 0})


if __name__ == "__main__":
    import sys

    q = " ".join(sys.argv[1:]) or "What are the health effects of intermittent fasting?"
    print(f"Researching: {q}\n")
    final = run_research(q)
    print(final["report"])
    print(f"\ncritic score: {final.get('critic_score')}  |  iterations: {final.get('iteration')}")
