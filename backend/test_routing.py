"""Self-check for the critic loop guard — the one piece of non-trivial branching.

Run: python test_routing.py  (from backend/). No network, no LLM, no framework.
"""

from agent.state import should_replan


def main():
    assert should_replan(5, 0) is True,  "weak report, budget left -> replan"
    assert should_replan(5, 1) is True,  "still weak, still budget -> replan"
    assert should_replan(5, 2) is False, "budget exhausted -> stop"
    assert should_replan(8, 0) is False, "good report -> stop"
    assert should_replan(7, 1) is False, "score 7 is passing -> stop"
    print("routing guard OK")


if __name__ == "__main__":
    main()
