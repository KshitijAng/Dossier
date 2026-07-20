"use client";

import { createContext, useCallback, useContext, useState, ReactNode } from "react";
import { runResearch, ResearchResult } from "./api";

/**
 * Holds the in-progress/last research run. Lives in the root layout (see
 * AppShell) so switching to History and back does NOT wipe the query or the
 * report — and an in-flight request keeps running instead of being orphaned
 * when the home page unmounts.
 */
type ResearchState = {
  query: string;
  setQuery: (q: string) => void;
  result: ResearchResult | null;
  loading: boolean;
  error: string | null;
  submit: (q: string) => void;
};

const ResearchContext = createContext<ResearchState | null>(null);

export function ResearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (q: string) => {
      const trimmed = q.trim();
      if (!trimmed || loading) return;
      setQuery(trimmed);
      setLoading(true);
      setError(null);
      setResult(null);
      try {
        setResult(await runResearch(trimmed));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    },
    [loading]
  );

  return (
    <ResearchContext.Provider
      value={{ query, setQuery, result, loading, error, submit }}
    >
      {children}
    </ResearchContext.Provider>
  );
}

export function useResearch(): ResearchState {
  const ctx = useContext(ResearchContext);
  if (!ctx) throw new Error("useResearch must be used inside ResearchProvider");
  return ctx;
}
