import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ValidQR — NusaPay Mobile Web (Anti-Fraud QRIS)",
  description: "Adaptive Real-Time Anti-Fraud SDK for QRIS — HackNusa 2026 by NusaPay",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0B0D1B",
};

import { Providers } from "@/components/Providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full antialiased dark">
      <body className="min-h-full bg-[#070913] text-slate-100 selection:bg-indigo-500 selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
