"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Vote,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  User,
  AlertCircle,
  FileText,
  BadgeCheck,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function VoterDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/vote/status")
      .then((res) => {
        if (res.status === 401) {
          router.push("/login");
          return null;
        }
        return res.json();
      })
      .then((resData) => {
        if (resData) setData(resData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!data || !data.user) return null;

  const { user, hasVoted, receipt } = data;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 p-[1.5px] shadow-lg">
            <div className="w-full h-full bg-[#090d16] rounded-[14px] flex items-center justify-center overflow-hidden">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-7 h-7 text-cyan-400" />
              )}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-white">Welcome, {user.name}</h1>
              {user.emailVerified && (
                <span title="Verified Voter">
                  <BadgeCheck className="w-5 h-5 text-cyan-400 inline" />
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 font-mono">
              @{user.username} • Registered Voter Credential
            </p>
          </div>
        </div>

        <div>
          {hasVoted ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Ballot Cast & Recorded</span>
            </div>
          ) : (
            <Link
              href="/vote"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20"
            >
              <Vote className="w-4 h-4" />
              <span>Cast Your Vote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Status Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Voter Status */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-[#0b101b] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Electoral Status
            </span>
            <ShieldCheck className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-white">
            {hasVoted ? "Participation Complete" : "Eligible to Vote"}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {hasVoted
              ? "You have successfully submitted your single demonstration ballot."
              : "Your identity credentials have been verified. You may proceed to party selection."}
          </p>
        </div>

        {/* Card 2: Optional camera demonstration */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-[#0b101b] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Verification Mode
            </span>
            <Clock className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-white">Local Simulation</div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Camera access is optional and only used for a local preview. There is no face matching or identity assurance.
          </p>
        </div>

        {/* Card 3: Cryptographic Demo Receipt */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-[#0b101b] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Ballot Receipt
            </span>
            <FileText className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono text-sm sm:text-base truncate">
            {receipt ? receipt.receiptNumber : "No Ballot Submitted"}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {receipt
              ? `Cast timestamp: ${formatDate(receipt.votedAt)}`
              : "A cryptographic proof token will be generated once your vote is submitted."}
          </p>
        </div>
      </div>

      {/* Main Content Action Block */}
      <div className="p-8 rounded-2xl border border-slate-800 bg-gradient-to-br from-[#0c1322] to-[#080d18] relative overflow-hidden">
        <div className="max-w-2xl space-y-4">
          <h2 className="text-xl font-bold text-white">BIOVOTE Electoral Procedure</h2>
          <ol className="space-y-3 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
            <li>
              Review political party manifestos and platform commitments on the ballot list.
            </li>
            <li>
              When you choose a party, you can view an optional camera preview with simulated prompts or continue without a camera. Neither path verifies identity or liveness.
            </li>
            <li>
              An accessible non-camera path is always available.
            </li>
            <li>
              After the demo prompts, your demonstration ballot is recorded. Identity receipts and party counts are separate records, but this prototype does not provide certified secret-ballot privacy.
            </li>
          </ol>

          <div className="pt-2">
            {hasVoted ? (
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-cyan-400" />
                <span>You have already cast your ballot. Multiple voting is locked at the database level.</span>
              </div>
            ) : (
              <Link
                href="/vote"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-lg"
              >
                <span>Proceed to Party Selection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
