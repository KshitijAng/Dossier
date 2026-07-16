"""Search and page-reading helpers used by the agent nodes."""

from typing import List

import trafilatura # web-content extraction library
from langchain_community.utilities import DuckDuckGoSearchAPIWrapper

from schemas import PageContent, SearchResult

_ddg = DuckDuckGoSearchAPIWrapper()


def web_search(query: str, max_results: int = 4) -> List[SearchResult]:
    """Run a DuckDuckGo search. Returns [] on failure rather than crashing the run."""
    try:
        raw = _ddg.results(query, max_results=max_results)
    except Exception:
        return []
    return [
        SearchResult(
            title=r.get("title", ""),
            url=r.get("link", ""),
            snippet=r.get("snippet", ""),
        )
        for r in raw
        if r.get("link")
    ]


def read_page(url: str) -> PageContent | None:
    """Fetch a URL and extract its main text. Returns None if nothing usable."""
    downloaded = trafilatura.fetch_url(url)
    if not downloaded:
        return None
    text = trafilatura.extract(downloaded, include_comments=False, include_tables=False)
    if not text:
        return None
    meta = trafilatura.extract_metadata(downloaded)
    title = getattr(meta, "title", None) or url
    return PageContent(url=url, title=title, text=text)
