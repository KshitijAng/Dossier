"""Pydantic models for the research agent.
"""

from typing import List, Optional

from pydantic import BaseModel, Field


class SubQuestion(BaseModel):
    """A single focused sub-question the planner derives from the user query."""

    question: str = Field(description="A focused, self-contained research sub-question")


class SubQuestionList(BaseModel):
    """Container so the LLM can return List[SubQuestion] as one structured object."""

    sub_questions: List[SubQuestion] = Field(
        description="3 to 5 focused sub-questions covering the user's query"
    )


class SearchResult(BaseModel):
    """One web search hit."""

    title: str = Field(description="Title of the search result")
    url: str = Field(description="URL of the search result")
    snippet: str = Field(description="Short snippet/summary from the search engine")


class PageContent(BaseModel):
    """Extracted main text of a fetched page."""

    url: str = Field(description="Source URL the text was extracted from")
    title: str = Field(description="Title of the page")
    text: str = Field(description="Main article text, stripped of nav/boilerplate")


class ReportSection(BaseModel):
    """One section of the final report."""

    heading: str = Field(description="Section heading")
    content: str = Field(
        description="Section body with inline source citations like [1], [2]"
    )


class CitedReport(BaseModel):
    """The synthesized research report with sections and a citation list."""

    sections: List[ReportSection] = Field(description="Ordered report sections")
    citations: List[str] = Field(
        description="Numbered source URLs, in the order referenced inline"
    )

    def to_markdown(self) -> str:
        """Flatten to a markdown string for the state's `report` field."""
        parts = [f"## {s.heading}\n\n{s.content}" for s in self.sections]
        if self.citations:
            sources = "\n".join(f"[{i}] {u}" for i, u in enumerate(self.citations, 1))
            parts.append(f"## Sources\n\n{sources}")
        return "\n\n".join(parts)


class CriticResult(BaseModel):
    """The critic's verdict on report quality."""

    score: int = Field(description="Completeness score from 0 to 10", ge=0, le=10)
    feedback: str = Field(description="What is missing or weak, in one or two sentences")
    refined_query: Optional[str] = Field(
        default=None,
        description="If score < 7, a refined version of the original query to re-plan on",
    )
