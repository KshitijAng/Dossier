"use client";

import { useState } from "react";
import { Box, Chip, Divider, IconButton, Link, Stack, Tooltip, Typography } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import ReactMarkdown from "react-markdown";
import { ResearchResult } from "../lib/api";

// The report markdown ends with a "## Sources" block; we render citations as
// chips instead, so strip that block to avoid showing sources twice.
function stripSources(md: string): string {
  const i = md.indexOf("## Sources");
  return i === -1 ? md : md.slice(0, i).trimEnd();
}

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function ReportView({ result }: { result: ResearchResult }) {
  const [copied, setCopied] = useState(false);

  // Copies the full markdown report (including the Sources list).
  const copyReport = async () => {
    try {
      await navigator.clipboard.writeText(result.report);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable (e.g. non-HTTPS) — silently ignore
    }
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Chip
          size="small"
          label={`Quality ${result.critic_score}/10`}
          color={result.critic_score >= 7 ? "success" : "warning"}
          variant="outlined"
        />
        <Tooltip title={copied ? "Copied!" : "Copy report"}>
          <IconButton size="small" onClick={copyReport} aria-label="Copy report">
            {copied ? (
              <CheckIcon fontSize="small" sx={{ color: "success.main" }} />
            ) : (
              <ContentCopyIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Map markdown elements to themed MUI typography */}
      <Box
        sx={{
          "& h2": { mt: 4, mb: 1.5 },
          "& p": { mb: 2, lineHeight: 1.8, color: "text.secondary" },
        }}
      >
        <ReactMarkdown
          components={{
            h2: ({ children }) => (
              <Typography variant="h5" fontWeight={600}>
                {children}
              </Typography>
            ),
            p: ({ children }) => <Typography variant="body1">{children}</Typography>,
            // Inline [n] citations render as markdown links; show them as small
            // muted superscript markers instead of default browser-blue links.
            a: ({ href, children }) => (
              <Box
                component="a"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "text.secondary",
                  textDecoration: "none",
                  fontSize: "0.7em",
                  fontWeight: 600,
                  verticalAlign: "super",
                  lineHeight: 0,
                  "&:hover": { color: "text.primary" },
                }}
              >
                {children}
              </Box>
            ),
          }}
        >
          {stripSources(result.report)}
        </ReactMarkdown>
      </Box>

      {result.citations.length > 0 && (
        <>
          <Divider sx={{ my: 4 }} />
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>
            Sources
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {result.citations.map((url, i) => (
              <Chip
                key={i}
                component={Link}
                href={url}
                target="_blank"
                rel="noopener"
                clickable
                variant="outlined"
                label={`${i + 1}. ${hostname(url)}`}
              />
            ))}
          </Stack>
        </>
      )}
    </Box>
  );
}
