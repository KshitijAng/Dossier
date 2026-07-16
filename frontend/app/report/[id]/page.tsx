"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getRun, ResearchResult } from "../../lib/api";
import { RADIUS } from "../../theme";
import ReportView from "../../components/ReportView";

export default function ReportPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getRun(id)
      .then(setResult)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load report."));
  }, [id]);

  return (
    <Container maxWidth="md" sx={{ pt: { xs: 8, md: 8 }, pb: 12, px: { xs: 2, md: 3 } }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => router.push("/history")}
        color="inherit"
        sx={{ color: "text.secondary", mb: 3, ml: { xs: 5, md: 0 } }}
      >
        Back to history
      </Button>

      {error && <Alert severity="error">{error}</Alert>}

      {!result && !error && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={28} />
        </Box>
      )}

      {result && (
        <Paper variant="outlined" sx={{ p: { xs: 3, md: 5 }, borderRadius: RADIUS }}>
          <Typography variant="h4" sx={{ mb: 3 }}>
            {result.query}
          </Typography>
          <ReportView result={result} />
        </Paper>
      )}
    </Container>
  );
}
