import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { ScrollProvider } from "@/components/providers/ScrollProvider";

/* ==========================================================================
   FONT CONFIGURATIONS (spec §3.1)
   -----------------------------------------------------------------------
   Space Grotesk  — Display/Headings: 400, 500, 600, 700
   Inter          — Body/UI:          300, 400, 500, 600  (NO 700)
   JetBrains Mono — Code literals:    400 only             (NO 500/600)

   Preload: Space Grotesk 700 + Inter 400 are the critical above-fold
   weights.  next/font preloads all weights in a single instance, so we
   accept the minor overhead of the extra 3 Space Grotesk weights rather
   than splitting into duplicate font-face declarations.
   JetBrains Mono is lazy-loaded (preload: false).
   ========================================================================== */

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-space-grotesk",
  preload: true,
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-jetbrains-mono",
  preload: false,
});

/* ==========================================================================
   METADATA & VIEWPORT
   ========================================================================== */

export const metadata: Metadata = {
  title: {
    default: "IHI — Innovative Hack Intelligence",
    template: "%s | IHI",
  },
  description:
    "The AI operating system for hackathons. Orchestrate registrations, teams, judging rubrics, and final outcomes.",
  applicationName: "Innovative Hack Intelligence",
  keywords: [
    "Hackathon",
    "AI",
    "Orchestration",
    "Judging Rubric",
    "IHI",
  ],
  authors: [{ name: "Innovative Hack Intelligence Team" }],
  creator: "IHI",
  publisher: "IHI",
  icons: {
    icon: "/brand/logo.png",
    apple: "/brand/logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#F7F8FA", /* surface-base — single light theme per spec */
};

/* ==========================================================================
   ROOT LAYOUT
   ========================================================================== */

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-surface-base text-ink-primary font-body antialiased">
        {/*
          MotionProvider MUST wrap ScrollProvider because
          ScrollProvider consumes useReducedMotion() internally.
        */}
        <MotionProvider>
          <ScrollProvider>
            {children}
          </ScrollProvider>
        </MotionProvider>
      </body>
    </html>
  );
}