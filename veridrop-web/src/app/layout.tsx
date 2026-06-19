import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Veridrop — Trust Commerce Infrastructure",
  description:
    "Escrow-protected payments, physical inspection at source, and managed logistics — the trust layer for verified commerce across Africa.",
  keywords: [
    "escrow",
    "inspection",
    "logistics",
    "trust commerce",
    "verified commerce",
    "Africa",
    "payment protection",
    "supply chain trust",
  ],
  openGraph: {
    title: "Veridrop — Trust Commerce Infrastructure",
    description:
      "Escrow-protected payments, physical inspection at source, and managed logistics — the trust layer for verified commerce across Africa.",
    type: "website",
    siteName: "Veridrop",
  },
  robots: { index: true, follow: true },
};

const themeScript = `
  (function() {
    try {
      var t = localStorage.getItem("veridrop-theme");
      if (t === "light" || t === "dark") {
        document.documentElement.className = document.documentElement.className
          .replace(/\\bdark\\b|\\blight\\b/g, "")
          .trim() + " " + t;
      } else {
        document.documentElement.className = document.documentElement.className
          .replace(/\\blight\\b/g, "")
          .trim() + " dark";
      }
    } catch(e) {
      document.documentElement.className = "dark";
    }
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <head>
        <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
