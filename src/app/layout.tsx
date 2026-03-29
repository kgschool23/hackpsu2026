import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "ECP // Expiration Critical Path",
  description:
    "Minimizes household food waste by scheduling meals against item expiration dates. HackPSU 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${mono.variable} dark`}>
      <body className="min-h-dvh font-mono">{children}</body>
    </html>
  );
}
