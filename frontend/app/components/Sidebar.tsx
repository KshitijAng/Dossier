"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import HistoryIcon from "@mui/icons-material/History";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ThemeSwitch from "./ThemeSwitch";
import ToolBadges from "./ToolBadges";
import { GITHUB_URL, LINKEDIN_URL } from "../lib/config";

const NAV = [
  { label: "New research", href: "/", icon: <AutoAwesomeIcon fontSize="small" /> },
  { label: "History", href: "/history", icon: <HistoryIcon fontSize="small" /> },
];

// Plain-language guidance for a non-technical user.
const TIPS = [
  "Ask one clear question at a time.",
  "Be specific — add names, places, or years.",
  "Use a full sentence, e.g. “What are the benefits of green tea?”",
  "Ask “how”, “why”, or “what” rather than yes/no questions.",
];

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();
  const pathname = usePathname();

  const go = (href: string) => {
    router.push(href);
    onNavigate?.();
  };

  return (
    <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", p: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 1, py: 1.5 }}>
        <AutoAwesomeIcon sx={{ color: "secondary.main" }} />
        <Typography variant="subtitle1" fontWeight={700} letterSpacing="-0.02em">
          Dossier
        </Typography>
        {/* Close arrow — only shown in the mobile drawer */}
        {onNavigate && (
          <>
            <Box sx={{ flexGrow: 1 }} />
            <Tooltip title="Close menu">
              <IconButton size="small" onClick={onNavigate} aria-label="Close menu">
                <ArrowForwardIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Stack>

      <List sx={{ mt: 1 }}>
        {NAV.map((item) => {
          const active =
            pathname === item.href ||
            (item.href === "/history" && pathname.startsWith("/report"));
          return (
            <ListItemButton
              key={item.href}
              selected={active}
              onClick={() => go(item.href)}
              disableRipple
              sx={{
                borderRadius: 2,
                mb: 0.5,
                transition: "background-color 150ms",
                "&.Mui-selected": {
                  bgcolor: "action.selected",
                  "&:hover": { bgcolor: "action.selected" },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primaryTypographyProps={{ fontSize: 14, fontWeight: active ? 600 : 500 }}
                primary={item.label}
              />
            </ListItemButton>
          );
        })}
      </List>

      {/* How to get good results */}
      <Box sx={{ mt: 2, p: 1.75, borderRadius: 2, bgcolor: "var(--mui-palette-AppField)" }}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
          Tips for good results
        </Typography>
        <Box component="ul" sx={{ m: 0, pl: 2, "& li": { mb: 0.75 } }}>
          {TIPS.map((tip) => (
            <Typography
              key={tip}
              component="li"
              variant="caption"
              color="text.secondary"
              sx={{ display: "list-item", lineHeight: 1.5 }}
            >
              {tip}
            </Typography>
          ))}
        </Box>
      </Box>

      <ToolBadges />

      <Box sx={{ flexGrow: 1, minHeight: 16 }} />

      <Divider sx={{ mb: 2 }} />
      <Stack alignItems="center" spacing={1.5} sx={{ pb: 0.5 }}>
        <ThemeSwitch />
        <Stack direction="row" spacing={1} justifyContent="center">
          <Tooltip title="GitHub">
            <IconButton size="small" component="a" href={GITHUB_URL} target="_blank" rel="noopener">
              <GitHubIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="LinkedIn">
            <IconButton size="small" component="a" href={LINKEDIN_URL} target="_blank" rel="noopener">
              <LinkedInIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Box>
  );
}
