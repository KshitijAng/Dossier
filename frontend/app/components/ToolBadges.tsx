"use client";

import { Box, Stack, Tooltip, Typography } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

// Real brand logos (single-path marks from simple-icons; Langfuse served from
// /public). Each links to the tool's site.
function SupabaseLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#3ecf8e"
        d="M11.9 1.036c-.015-.986-1.26-1.41-1.874-.637L.764 12.05C-.33 13.427.65 15.455 2.409 15.455h9.579l.113 7.51c.014.985 1.259 1.408 1.873.636l9.262-11.653c1.093-1.375.113-3.403-1.645-3.403h-9.642z"
      />
    </svg>
  );
}

const TOOLS = [
  { name: "GitHub Models", role: "LLM inference", href: "https://github.com/marketplace/models", logo: <GitHubIcon sx={{ fontSize: 20, color: "text.primary" }} /> },
  { name: "Langfuse", role: "Tracing & observability", href: "https://langfuse.com", logo: <img src="/langfuse.svg" width={20} height={20} alt="" /> },
  { name: "Supabase", role: "Postgres persistence", href: "https://supabase.com", logo: <SupabaseLogo /> },
];

export default function ToolBadges() {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography
        variant="overline"
        color="text.secondary"
        sx={{ display: "block", mb: 1.25, textAlign: "center", letterSpacing: "0.08em" }}
      >
        Built with
      </Typography>
      <Stack direction="row" spacing={1.5} justifyContent="center">
        {TOOLS.map((t) => (
          <Tooltip key={t.name} title={`${t.name} — ${t.role}`}>
            <Box
              component="a"
              href={t.href}
              target="_blank"
              rel="noopener"
              sx={{
                width: 34,
                height: 34,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "var(--mui-palette-AppField)",
                transition: "transform 150ms, opacity 150ms",
                "&:hover": { transform: "translateY(-2px)", opacity: 0.85 },
              }}
            >
              {t.logo}
            </Box>
          </Tooltip>
        ))}
      </Stack>
    </Box>
  );
}
