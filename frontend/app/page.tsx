"use client";

import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { runResearch, ResearchResult } from "./lib/api";
import { RADIUS } from "./theme";
import ResearchLoader from "./components/ResearchLoader";
import ReportView from "./components/ReportView";
import MicButton from "./components/MicButton";

const EXAMPLES = [
  "What are the health effects of intermittent fasting?",
  "How does retrieval-augmented generation work?",
  "Is nuclear energy a viable climate solution?",
  "What caused the 2008 financial crisis?",
  "How do mRNA vaccines work?",
  "What are the pros and cons of remote work?",
  "Is a four-day work week more productive?",
  "How does quantum computing threaten encryption?",
];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResearchResult | null>(null);

  async function submit(q: string) {
    const trimmed = q.trim();
    if (!trimmed || loading) return;
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
  }

  return (
    <Container maxWidth="md" sx={{ pt: { xs: 8, md: 10 }, pb: { xs: 12, md: 12 }, px: { xs: 2, md: 3 } }}>
      <Box sx={{ textAlign: "center", mb: 5 }}>
        <Typography variant="h3" sx={{ mb: 1.5, fontSize: { xs: "1.9rem", sm: "2.5rem", md: "3rem" } }}>
          What do you want to research?
        </Typography>
        <Typography variant="body1" color="text.secondary">
          A research agent that plans, searches, reads, and writes a cited report.
        </Typography>
      </Box>

      <Paper
        variant="outlined"
        sx={{
          p: 1,
          pl: 2.5,
          minHeight: 60,
          borderRadius: RADIUS,
          bgcolor: "var(--mui-palette-AppField)",
          display: "flex",
          gap: 0.5,
          alignItems: "center",
          transition: "border-color 150ms, box-shadow 150ms",
          "&:focus-within": {
            borderColor: "text.primary",
            boxShadow: (t) => `0 0 0 1px ${t.palette.text.primary}`,
          },
        }}
      >
        <TextField
          fullWidth
          placeholder="Ask anything…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              submit(query);
            }
          }}
          disabled={loading}
          InputProps={{ disableUnderline: true, sx: { py: 1.25, fontSize: 16 } }}
          variant="standard"
        />
        <MicButton onText={setQuery} disabled={loading} />
        <IconButton
          onClick={() => submit(query)}
          disabled={loading || !query.trim()}
          sx={{
            flexShrink: 0,
            bgcolor: "primary.main",
            color: "background.paper",
            width: 40,
            height: 40,
            transition: "opacity 150ms",
            "&:hover": { bgcolor: "primary.main", opacity: 0.85 },
            "&.Mui-disabled": { bgcolor: "action.disabledBackground", color: "action.disabled" },
          }}
        >
          <ArrowUpwardIcon fontSize="small" />
        </IconButton>
      </Paper>

      {!result && !loading && (
        <>
        <Stack direction="row" flexWrap="wrap" gap={1} justifyContent="center" sx={{ mt: 3 }}>
          {EXAMPLES.map((ex) => (
            <Button
              key={ex}
              size="small"
              variant="outlined"
              color="inherit"
              onClick={() => {
                setQuery(ex);
                submit(ex);
              }}
              sx={{
                borderColor: "divider",
                bgcolor: "var(--mui-palette-AppField)",
                color: "text.secondary",
                fontWeight: 500,
                "&:hover": { bgcolor: "var(--mui-palette-AppField)", borderColor: "text.disabled" },
              }}
            >
              {ex}
            </Button>
          ))}
        </Stack>
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ display: "block", textAlign: "center", mt: 4 }}
        >
          ⏳ First query after some inactivity can take up to a minute — the
          free-tier backend needs to wake up first.
        </Typography>
        </>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      )}

      {loading && <ResearchLoader />}

      {result && (
        <Paper variant="outlined" sx={{ p: { xs: 3, md: 5 }, mt: 4, borderRadius: RADIUS }}>
          <Typography variant="overline" color="text.secondary">
            {result.query}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <ReportView result={result} />
          </Box>
        </Paper>
      )}
    </Container>
  );
}
