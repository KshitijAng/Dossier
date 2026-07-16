import { API_URL } from "./config";

export interface ResearchResult {
  id: string | null;
  query: string;
  report: string;
  citations: string[];
  critic_score: number;
}

export interface RunSummary {
  id: string;
  query: string;
  critic_score: number;
  created_at: string;
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const detail = await res.json().catch(() => null);
    throw new Error(detail?.detail || `Request failed (${res.status})`);
  }
  return res.json();
}

export function runResearch(query: string): Promise<ResearchResult> {
  return fetch(`${API_URL}/research`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  }).then((res) => handle<ResearchResult>(res));
}

export function getRuns(): Promise<RunSummary[]> {
  return fetch(`${API_URL}/runs`).then((res) => handle<RunSummary[]>(res));
}

export function getRun(id: string): Promise<ResearchResult> {
  return fetch(`${API_URL}/runs/${id}`).then((res) => handle<ResearchResult>(res));
}
