"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Vote,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
  Sparkles,
} from "lucide-react";
import { FaceScannerModal } from "@/components/verification/FaceScannerModal";

interface Party {
  id: string;
  name: string;
  code: string;
  description: string;
  logoUrl: string;
  color: string;
}

export default function VotePage() {
  const router = useRouter();
  const [parties, setParties] = useState<Party[]>([]);
  const [user, setUser] = useState<any>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [existingReceipt, setExistingReceipt] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Selected party for voting
  const [selectedParty, setSelectedParty] = useState<Party | null>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [submittingVote, setSubmittingVote] = useState(false);
  const [submittedReceipt, setSubmittedReceipt] = useState<any>(null);
  const [voteError, setVoteError] = useState("");
  const [verificationMethod, setVerificationMethod] = useState<"camera_simulated" | "alternative_passphrase" | null>(null);

  useEffect(() => {
    // 1. Check voter status
    fetch("/api/vote/status")
      .then((res) => {
        if (res.status === 401) {
          router.push("/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setUser(data.user);
          setHasVoted(data.hasVoted);
          setExistingReceipt(data.receipt);
        }
      });

    // 2. Fetch parties
    fetch("/api/parties")
      .then((res) => res.json())
      .then((data) => {
        if (data.parties) setParties(data.parties);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  const handleSelectParty = (party: Party) => {
    setSelectedParty(party);
    setVerificationMethod(null);
    setVoteError("");
  };

  const handleStartVerification = () => {
    if (!selectedParty) return;
    setScannerOpen(true);
  };

  const handleVerificationCompleted = async (method: "camera_simulated" | "alternative_passphrase") => {
    setScannerOpen(false);
    setVerificationMethod(method);
  };

  const handleSubmitDemoVote = async () => {
    if (!selectedParty || !verificationMethod) return;
    setSubmittingVote(true);
    setVoteError("");

    try {
      const res = await fetch("/api/vote/cast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partyId: selectedParty.id,
          verificationMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit ballot");
      }

      setSubmittedReceipt(data);
      setHasVoted(true);
    } catch (err: any) {
      setVoteError(err.message);
    } finally {
      setSubmittingVote(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Final Success Confirmation Screen
  if (submittedReceipt) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-2xl border border-emerald-500/40 bg-[#0b1219] p-8 text-center space-y-6 shadow-2xl shadow-emerald-950/40 animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-white">Demonstration Vote Cast!</h2>
            <p className="text-xs text-slate-300">
              Your demonstration vote has been submitted successfully. Account participation and party counts are stored separately in this prototype; this is not a certified secret ballot.
            </p>
          </div>

          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 text-left space-y-2 font-mono text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Receipt Token:</span>
              <span className="text-cyan-400 font-bold">{submittedReceipt.receiptNumber}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Status:</span>
              <span className="text-emerald-400 font-semibold">Demo record created</span>
            </div>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl text-xs font-semibold shadow-lg hover:brightness-110"
          >
            Return to Voter Desk
          </button>
        </div>
      </div>
    );
  }

  // Already Voted Guard
  if (hasVoted) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0b101b] p-8 text-center space-y-5">
          <div className="w-14 h-14 rounded-full bg-blue-950/60 border border-blue-500/30 flex items-center justify-center mx-auto text-blue-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Ballot Already Submitted</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            In accordance with democratic electoral protocols, each registered voter is strictly limited to one demonstration vote.
          </p>
          {existingReceipt && (
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 font-mono text-xs text-cyan-400">
              Receipt: {existingReceipt.receiptNumber}
            </div>
          )}
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (verificationMethod && selectedParty) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <section aria-labelledby="confirm-vote-title" className="w-full max-w-lg rounded-2xl border border-cyan-500/30 bg-[#0b101b] p-7 sm:p-9 space-y-6 shadow-2xl shadow-blue-950/30">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-300 font-mono">Final review · demonstration only</p>
            <h1 id="confirm-vote-title" className="text-2xl font-bold text-white">Review your selection</h1>
            <p className="text-sm text-slate-400">The previous step was a scripted interface demo. It did not verify your identity or liveness.</p>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4 flex items-center gap-4">
            <img src={selectedParty.logoUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />
            <div>
              <p className="text-xs text-slate-400">Selected party</p>
              <p className="font-semibold text-white">{selectedParty.name}</p>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">Submitting creates one demo ballot for this account. This educational prototype is not a real election service or a certified secret-ballot system.</p>
          {voteError && <p role="alert" className="text-sm text-rose-300">{voteError}</p>}
          <button onClick={handleSubmitDemoVote} disabled={submittingVote} className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold disabled:opacity-60">
            {submittingVote ? "Submitting…" : "Submit Demonstration Vote"}
          </button>
          <button onClick={() => setVerificationMethod(null)} disabled={submittingVote} className="w-full py-2 text-sm text-slate-300 hover:text-white disabled:opacity-60">
            Cancel and return to party selection
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-950/30 text-xs text-cyan-400 font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Official Ballot Options</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Select Political Party</h1>
        <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
          Review and choose a party to continue to the simulated verification demo. Your selection is not submitted until you confirm on the next screen.
        </p>
      </div>

      {voteError && (
        <div className="p-4 rounded-xl border border-rose-500/40 bg-rose-950/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{voteError}</span>
        </div>
      )}

      {/* Party Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {parties.map((party) => {
          const isSelected = selectedParty?.id === party.id;
          return (
            <div
              key={party.id}
              className={`relative rounded-2xl border p-6 transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? "border-cyan-400 bg-slate-900/90 shadow-xl shadow-cyan-950/50"
                  : "border-slate-800 bg-[#0b101b] hover:border-slate-700 hover:bg-slate-900/50"
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={party.logoUrl}
                      alt={party.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                    />
                    <div>
                      <h3 className="text-base font-bold text-white">{party.name}</h3>
                      <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                        Code: {party.code}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">{party.description}</p>
              </div>

              <div className="pt-6 border-t border-slate-800/80 mt-6 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Demonstration Candidate</span>
                <button
                  onClick={() => handleSelectParty(party)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-cyan-500 text-slate-950 font-bold"
                      : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                  }`}
                >
                  {isSelected ? "Selected ✓" : "Choose Party"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Sticky Action Bar when a party is picked */}
      {selectedParty && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-40">
          <div className="p-4 rounded-2xl border border-cyan-500/50 bg-[#080d17]/95 backdrop-blur-xl shadow-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs font-mono">
                {selectedParty.code}
              </div>
              <div>
                <p className="text-xs text-slate-400">Chosen Candidate:</p>
                <p className="text-sm font-bold text-white">{selectedParty.name}</p>
              </div>
            </div>

            <button
              onClick={handleStartVerification}
              disabled={submittingVote}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/30 flex items-center gap-2"
            >
              <span>Continue to demo verification</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Face Scanner Modal */}
      <FaceScannerModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onVerified={handleVerificationCompleted}
        userName={user?.name || "Voter"}
      />
    </div>
  );
}
