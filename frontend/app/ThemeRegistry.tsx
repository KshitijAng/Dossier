"use client";

import { ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./theme";

// CSS-variables theming: the color scheme is applied via a data attribute set
// before first paint (see the inline script in layout.tsx), so there's no
// light-to-dark flash on load. Preference is persisted automatically.
export default function ThemeRegistry({ children }: { children: ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <CssVarsProvider theme={theme} defaultMode="light">
        <CssBaseline />
        {children}
      </CssVarsProvider>
    </AppRouterCacheProvider>
  );
}
