import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "ECP | Expiration Critical Path",
  description:
    "Mathmatically optimal meal prep generation mapped across a Directed Acyclic Graph. Generates 0% waste timelines.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased text-[var(--color-text-primary)]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
