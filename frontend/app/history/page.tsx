"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { getRuns, RunSummary } from "../lib/api";
import { RADIUS } from "../theme";

export default function HistoryPage() {
  const router = useRouter();
  const [runs, setRuns] = useState<RunSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getRuns()
      .then(setRuns)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load history."));
  }, []);

  return (
    <Container maxWidth="md" sx={{ pt: { xs: 8, md: 8 }, pb: 12, px: { xs: 2, md: 3 }, maxWidth: { md: 1060 } }}>
      <Typography variant="h4" sx={{ mb: 1 }}>
        History
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Your past research runs.
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      {!runs && !error && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={28} />
        </Box>
      )}

      {runs && runs.length === 0 && (
        <Paper
          variant="outlined"
          sx={{ p: 6, textAlign: "center", borderRadius: RADIUS, bgcolor: "var(--mui-palette-AppField)" }}
        >
          <Typography color="text.secondary">
            No runs yet. Start one from “New research”.
          </Typography>
        </Paper>
      )}

      {runs && runs.length > 0 && (
        <Paper
          variant="outlined"
          sx={{
            borderRadius: RADIUS,
            // long histories scroll inside the card (header stays pinned)
            maxHeight: "62vh",
            overflow: "auto",
            bgcolor: "var(--mui-palette-AppField)",
            // MUI lightens table borders to near-white; keep row lines subtle
            // and darker than the AppField surface in both themes.
            "& .MuiTableCell-root": { borderBottom: "1px solid rgba(0,0,0,0.07)" },
            '[data-mui-color-scheme="dark"] & .MuiTableCell-root': {
              borderBottom: "1px solid rgba(255,255,255,0.07)",
            },
            // sticky header must carry the surface colour or rows show through
            "& .MuiTableCell-stickyHeader": { bgcolor: "var(--mui-palette-AppField)" },
          }}
        >
          <Table stickyHeader sx={{ minWidth: 420 }}>
            <TableHead>
              <TableRow>
                <TableCell>Query</TableCell>
                <TableCell align="right">Quality</TableCell>
                <TableCell align="right">Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {runs.map((run) => (
                <TableRow
                  key={run.id}
                  hover
                  onClick={() => router.push(`/report/${run.id}`)}
                  sx={{ cursor: "pointer", "&:last-child td": { border: 0 } }}
                >
                  <TableCell sx={{ maxWidth: 380 }}>
                    <Typography noWrap>{run.query}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      size="small"
                      variant="outlined"
                      label={`${run.critic_score}/10`}
                      color={run.critic_score >= 7 ? "success" : "warning"}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" color="text.secondary">
                      {new Date(run.created_at).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Container>
  );
}
