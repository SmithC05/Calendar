import type { ReactNode } from "react";

import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Playfair_Display } from "next/font/google";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair"
});

export const metadata: Metadata = {
  title: "WallStory Calendar",
  description: "A premium interactive wall calendar with date-range notes and a monthly hero image."
};

const themeScript = `
  try {
    var storedTheme = window.localStorage.getItem('wallstory-theme');
    var theme = storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : 'light';
    document.documentElement.dataset.theme = theme;
  } catch (error) {
    document.documentElement.dataset.theme = 'light';
  }
`;

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} bg-canvas text-ink antialiased`}>
        <Script id="wallstory-theme-init" strategy="beforeInteractive">
          {themeScript}
        </Script>
        {children}
      </body>
    </html>
  );
}
