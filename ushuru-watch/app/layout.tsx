import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ushuru Watch · Finance Bill 2026 Personal Impact",
  description:
    "Four questions. One honest number. The exact extra tax that lands in your pocket each month if Parliament passes the Finance Bill 2026 as drafted.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
