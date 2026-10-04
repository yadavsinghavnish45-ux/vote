import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BIOVOTE - Futuristic Face Detection Voting Demonstration",
  description:
    "Your Identity. Your Voice. Your Vote. An educational demonstration prototype showcasing secure browser-side facial verification and duplicate-resistant electoral democracy.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#080c14] text-slate-100 min-h-screen flex flex-col selection:bg-blue-600/30 selection:text-blue-200`}
      >
        {/* Prototype Educational Warning Banner */}
        <div className="bg-gradient-to-r from-blue-900/50 via-indigo-950/60 to-purple-900/50 border-b border-blue-500/20 px-4 py-1.5 text-center text-xs text-blue-200 flex items-center justify-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>
            <strong>EDUCATIONAL DEMO PROTOTYPE:</strong> Camera face scanning is a simulated browser-side demonstration. No biometric data or facial embeddings are ever recorded or stored.
          </span>
        </div>

        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
