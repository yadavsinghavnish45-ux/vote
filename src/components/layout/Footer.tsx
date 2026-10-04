import React from "react";
import Link from "next/link";
import { ScanFace, ShieldAlert, Cpu, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-[#060910] text-slate-400 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center p-0.5">
                <div className="w-full h-full bg-[#090d16] rounded-[6px] flex items-center justify-center">
                  <ScanFace className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="font-bold text-lg text-white tracking-tight">BIOVOTE</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              An educational prototype for exploring account flows, voting interfaces, and accessible simulated verification.
            </p>
            <div className="text-[11px] text-cyan-400/90 font-mono">
              &quot;Your Identity. Your Voice. Your Vote.&quot;
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Voter Portal</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-cyan-400 transition-colors">
                  System Overview
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-cyan-400 transition-colors">
                  Voter Registration
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-cyan-400 transition-colors">
                  Voter Authentication
                </Link>
              </li>
              <li>
                <Link href="/vote" className="hover:text-cyan-400 transition-colors">
                  Live Ballot Simulation
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Architecture & Security */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Architecture</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-slate-400">
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
                <span>Next.js 15 App Router</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-400">
                <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                <span>No Face Matching</span>
              </li>
              <li className="text-slate-400">Prisma ORM with SQLite / Postgres</li>
              <li className="text-slate-400">Separate demonstration records</li>
            </ul>
          </div>

          {/* Col 4: Important Prototype Disclaimers */}
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <ShieldAlert className="w-4 h-4" />
              <span>Demonstration Prototype</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              BIOVOTE is for academic demonstration only. Its camera prompts do not verify identity or liveness, and its data model is not certified for secret ballots or real elections.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} BIOVOTE. Academic Research & Demonstration Prototype.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built for learning and demonstration</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
