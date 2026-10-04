"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  FileText,
  BadgeCheck,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [receipt, setReceipt] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Edit fields
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
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
          setName(data.user.name);
          setReceipt(data.receipt);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    setError("");

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      setUser(data.user);
      setMsg("Profile credentials updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white">Voter Profile & Security</h1>
        <p className="text-xs text-slate-400">
          Manage your verified credentials and inspect your demonstration ballot proof token
        </p>
      </div>

      {msg && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{msg}</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-950/40 border border-rose-500/40 text-rose-300 rounded-xl text-xs">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: ID Card */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-[#0b101b] space-y-4 text-center">
          <div className="w-24 h-24 rounded-full border-2 border-cyan-400/40 bg-slate-950 mx-auto overflow-hidden flex items-center justify-center">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-cyan-400" />
            )}
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center justify-center gap-1.5">
              <span>{user.name}</span>
              {user.emailVerified && <BadgeCheck className="w-4 h-4 text-cyan-400 inline" />}
            </h2>
            <p className="text-xs text-slate-400 font-mono">@{user.username}</p>
          </div>

          <div className="pt-2 border-t border-slate-800 text-left space-y-2 text-xs text-slate-400">
            <div className="flex justify-between">
              <span>Role:</span>
              <span className="text-slate-200 font-medium">{user.role}</span>
            </div>
            <div className="flex justify-between">
              <span>Email Verified:</span>
              <span className="text-emerald-400">Yes</span>
            </div>
            <div className="flex justify-between">
              <span>Ballot Cast:</span>
              <span className={receipt ? "text-cyan-400" : "text-slate-400"}>
                {receipt ? "Completed" : "Not Cast"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Update Settings & Ballot Token */}
        <div className="md:col-span-2 space-y-6">
          {/* Ballot Proof Token Box */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-[#0b101b] space-y-3">
            <div className="flex items-center gap-2 text-purple-400">
              <FileText className="w-4 h-4" />
              <h3 className="text-xs font-semibold uppercase tracking-wider">
                Cryptographic Ballot Receipt
              </h3>
            </div>
            {receipt ? (
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 font-mono text-xs space-y-1">
                <div className="text-cyan-400 font-bold">{receipt.receiptNumber}</div>
                <div className="text-slate-500 text-[11px]">Cast on: {formatDate(receipt.votedAt)}</div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                You have not cast a demonstration vote yet. Once submitted, your non-reversible ballot token will appear here.
              </p>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleUpdate} className="p-6 rounded-2xl border border-slate-800 bg-[#0b101b] space-y-4">
            <h3 className="text-sm font-bold text-white mb-2">Update Account Details</h3>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
              />
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-3">
              <h4 className="text-xs font-semibold text-slate-400">Change Password (Optional)</h4>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
