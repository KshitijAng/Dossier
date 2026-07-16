"use client";

import { ReactNode, useState } from "react";
import { Box, Drawer, IconButton, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "./Sidebar";

const SIDEBAR_WIDTH = 260;

export default function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Desktop: permanent sidebar */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          height: "100vh",
          position: "sticky",
          top: 0,
          borderRight: "1px solid",
          borderColor: "divider",
        }}
      >
        <Sidebar />
      </Box>

      {/* Mobile / tablet: slide-in drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: SIDEBAR_WIDTH, boxSizing: "border-box" },
        }}
      >
        <Sidebar onNavigate={() => setMobileOpen(false)} />
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, minWidth: 0, position: "relative" }}>
        {/* Menu button — mobile / tablet only */}
        <IconButton
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          sx={{
            display: { xs: "inline-flex", md: "none" },
            position: "fixed",
            top: 8,
            left: 8,
            zIndex: 1200,
            bgcolor: "background.default",
            "&:hover": { bgcolor: "action.hover" },
          }}
        >
          <MenuIcon />
        </IconButton>

        {children}

        {/* Disclaimer: gradient mask so scrolled text fades out behind it */}
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: { xs: 0, md: `${SIDEBAR_WIDTH}px` },
            right: 0,
            py: 1,
            textAlign: "center",
            pointerEvents: "none",
            zIndex: 5,
            background:
              "linear-gradient(to top, var(--mui-palette-background-default) 55%, transparent)",
          }}
        >
          <Typography variant="caption" color="text.disabled">
            Tool can make mistakes. Check important info.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
