"use client";

import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { keyframes } from "@mui/system";
import { RADIUS } from "../theme";

// The agent takes ~30s; cycle the stage label so the wait feels alive.
const STAGES = [
  "Planning the research",
  "Searching the web",
  "Reading sources",
  "Synthesizing findings",
  "Reviewing the report",
];

// A soft spotlight glides across the dot grid, brightening dots as it passes —
// like ChatGPT's image-generation placeholder.
const glide = keyframes`
  0%   { -webkit-mask-position: 0% 20%; mask-position: 0% 20%; }
  100% { -webkit-mask-position: 100% 80%; mask-position: 100% 80%; }
`;

const dots = (cssVar: string) =>
  `radial-gradient(var(${cssVar}) 1.5px, transparent 1.5px)`;

export default function ResearchLoader() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setStage((s) => Math.min(s + 1, STAGES.length - 1)),
      6000
    );
    return () => clearInterval(id);
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        minHeight: 340,
        mt: 4,
        p: 2.5,
        borderRadius: RADIUS,
        border: "1px solid",
        borderColor: "divider",
        // dots cover the whole card
        backgroundColor: "var(--mui-palette-AppField)",
        backgroundImage: dots("--mui-palette-LoaderDotDim"),
        backgroundSize: "16px 16px",
        // brighter dots revealed by a moving spotlight, drifting all around
        "&::after": {
          content: "''",
          position: "absolute",
          inset: 0,
          zIndex: 0,
          backgroundImage: dots("--mui-palette-LoaderDotBright"),
          backgroundSize: "16px 16px",
          WebkitMaskImage:
            "radial-gradient(circle, #000 0%, rgba(0,0,0,0.35) 32%, transparent 58%)",
          maskImage:
            "radial-gradient(circle, #000 0%, rgba(0,0,0,0.35) 32%, transparent 58%)",
          WebkitMaskSize: "200% 200%",
          maskSize: "200% 200%",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          animation: `${glide} 2.6s ease-in-out infinite alternate`,
        },
      }}
    >
      {/* opaque patch keeps the label clear while dots surround it */}
      <Typography
        variant="body1"
        sx={{
          position: "relative",
          zIndex: 1,
          display: "inline-block",
          px: 1,
          py: 0.5,
          borderRadius: 1,
          bgcolor: "var(--mui-palette-AppField)",
          color: "text.secondary",
          fontWeight: 500,
        }}
      >
        {STAGES[stage]}
        <Box
          component="span"
          sx={{ animation: `${keyframes`0%,100%{opacity:0}50%{opacity:1}`} 1.2s infinite` }}
        >
          …
        </Box>
      </Typography>
    </Box>
  );
}
