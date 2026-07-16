import { experimental_extendTheme as extendTheme } from "@mui/material/styles";

// Shared corner radius for the input bar and every result/output card.
export const RADIUS = "24px";

// Subtle "field" background for the input, suggestion chips, and tips box —
// a touch darker than the page so they read as distinct surfaces. Exposed as a
// CSS variable (var(--mui-palette-AppField)) so it switches with the theme
// instantly, with no flash.
// Light mode is a three-level neutral system (no warm tint):
//   AppField (#e6e6eb) < page background (#f4f4f6) < cards/paper (#ffffff)
// so fields read darker, the page is a dim white, and cards float above it.
const lightPalette = {
  primary: { main: "#1a1a1a" },
  secondary: { main: "#5b5bd6" },
  background: { default: "#f4f4f6", paper: "#ffffff" },
  text: { primary: "#111111", secondary: "#6b6b6b" },
  divider: "#dfdfe4",
  AppField: "#e6e6eb",
  LoaderDotDim: "rgba(0,0,0,0.09)",
  LoaderDotBright: "rgba(0,0,0,0.38)",
};

const darkPalette = {
  primary: { main: "#fafafa" },
  secondary: { main: "#5b5bd6" },
  background: { default: "#0a0a0a", paper: "#141414" },
  text: { primary: "#f5f5f5", secondary: "#a1a1a1" },
  divider: "#262626",
  AppField: "#191919",
  LoaderDotDim: "rgba(255,255,255,0.07)",
  LoaderDotBright: "rgba(255,255,255,0.6)",
};

export const theme = extendTheme({
  colorSchemes: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    light: { palette: lightPalette as any },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dark: { palette: darkPalette as any },
  },
  shape: { borderRadius: 12 },
  typography: {
    // The var() fallback matters: without it, a missing --font-inter would
    // invalidate the whole declaration and drop the page to the browser serif.
    fontFamily: "var(--font-inter, -apple-system), -apple-system, BlinkMacSystemFont, sans-serif",
    h1: { fontWeight: 700, letterSpacing: "-0.03em" },
    h2: { fontWeight: 700, letterSpacing: "-0.02em" },
    h3: { fontWeight: 700, letterSpacing: "-0.02em" },
    h4: { fontWeight: 600, letterSpacing: "-0.01em" },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { borderRadius: 10, paddingInline: 20 } },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
    MuiChip: { styleOverrides: { root: { fontWeight: 500 } } },
    MuiTextField: { defaultProps: { variant: "outlined" } },
  },
});
