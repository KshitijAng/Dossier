"use client";

import { KeyboardEvent } from "react";
import { Box, Tooltip } from "@mui/material";
import { styled, useColorScheme } from "@mui/material/styles";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

// Toggle style ported from the csm-dashboard project. Styled entirely off the
// `data-mui-color-scheme` attribute (set before first paint) rather than React
// state — so it renders in the correct theme immediately, with no flicker.
const TRACK_WIDTH = 80;
const TRACK_HEIGHT = 40;
const THUMB_SIZE = 32;
const TRACK_PADDING = 4;
const ICON = 18;
const OFFSET = 10;

// Matches when <html> carries the dark attribute (set before first paint).
const DARK = '[data-mui-color-scheme="dark"] &';

const Track = styled(Box)({
  width: TRACK_WIDTH,
  height: TRACK_HEIGHT,
  borderRadius: TRACK_HEIGHT / 2,
  position: "relative",
  cursor: "pointer",
  flexShrink: 0,
  backgroundColor: "#E0E0E0",
  transition: "background-color 0.25s ease",
  "& .MuiSvgIcon-root": { fontSize: ICON },
  [DARK]: { backgroundColor: "#4A3E62" },
});

const Thumb = styled(Box)({
  position: "absolute",
  width: THUMB_SIZE,
  height: THUMB_SIZE,
  borderRadius: "50%",
  top: TRACK_PADDING,
  left: TRACK_PADDING,
  transition: "left 0.25s ease, background-color 0.25s ease, box-shadow 0.25s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#FFFFFF",
  boxShadow: "0px 3px 8px rgba(0,0,0,0.15), 0px 3px 1px rgba(0,0,0,0.06)",
  zIndex: 1,
  "& .sun": { color: "#F5A623" },
  "& .moon": { display: "none", color: "#fff" },
  [DARK]: {
    left: TRACK_WIDTH - THUMB_SIZE - TRACK_PADDING,
    backgroundColor: "#9B7AE8",
    boxShadow: "0 2px 8px rgba(155,122,232,0.45), 0 2px 4px rgba(0,0,0,0.2)",
    "& .sun": { display: "none" },
    "& .moon": { display: "flex" },
  },
});

// Faint "target" icon on the empty side (sun on the left, moon on the right).
const StandbyLeft = styled(Box)({
  position: "absolute",
  top: "50%",
  left: OFFSET,
  transform: "translateY(-50%)",
  display: "flex",
  pointerEvents: "none",
  "& .MuiSvgIcon-root": { fontSize: ICON, color: "transparent" },
  [DARK]: { "& .MuiSvgIcon-root": { color: "#7A728A" } },
});

const StandbyRight = styled(Box)({
  position: "absolute",
  top: "50%",
  right: OFFSET,
  transform: "translateY(-50%)",
  display: "flex",
  pointerEvents: "none",
  "& .MuiSvgIcon-root": { fontSize: ICON, color: "#9E9E9E" },
  [DARK]: { "& .MuiSvgIcon-root": { color: "transparent" } },
});

export default function ThemeSwitch() {
  const { setMode } = useColorScheme();

  // Read the live attribute (set before paint) so the click is always correct.
  const toggle = () => {
    const current = document.documentElement.getAttribute("data-mui-color-scheme");
    setMode(current === "dark" ? "light" : "dark");
  };
  const onKeyDown = (e: KeyboardEvent) => e.key === "Enter" && toggle();

  return (
    <Tooltip title="Toggle theme">
      <Track role="button" tabIndex={0} onClick={toggle} onKeyDown={onKeyDown} aria-label="Toggle theme">
        <StandbyLeft aria-hidden>
          <LightModeIcon />
        </StandbyLeft>
        <StandbyRight aria-hidden>
          <DarkModeIcon />
        </StandbyRight>
        <Thumb>
          <LightModeIcon className="sun" />
          <DarkModeIcon className="moon" />
        </Thumb>
      </Track>
    </Tooltip>
  );
}
