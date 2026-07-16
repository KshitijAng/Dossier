import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ThemeRegistry from "./ThemeRegistry";
import AppShell from "./components/AppShell";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Dossier — AI Research Agent",
  description: "Ask a question, get a cited research report.",
};

// Runs synchronously before first paint: reads the saved mode (the same
// `mui-mode` key MUI persists to) and sets the color-scheme attribute, so the
// page paints in the right theme immediately — no light-to-dark flash.
const initColorScheme = `
(function () {
  try {
    var mode = localStorage.getItem('mui-mode') || 'light';
    if (mode === 'system') {
      mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-mui-color-scheme', mode);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: initColorScheme }} />
        <ThemeRegistry>
          <AppShell>{children}</AppShell>
        </ThemeRegistry>
      </body>
    </html>
  );
}
