import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import React from "react";
import LiveBlocsProvider from "./LiveBlocksProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "LIVE DOCS",
  description: "Docs team editing in real time",
  icons: {
    icon: "/icons/note.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LiveBlocsProvider>
          {children}
        </LiveBlocsProvider>
      </body>
    </html>
  );
}
