"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Vote,
  Flag,
  Activity,
  PlusCircle,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  RefreshCw,
  Search,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [parties, setParties] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "parties" | "users" | "audit">("overview");
  const [loading, setLoading] = useState(true);

  // New Party Form
  const [showAddPartyModal, setShowAddPartyModal] = useState(false);
  const [newPartyName, setNewPartyName] = useState("");
  const [newPartyCode, setNewPartyCode] = useState("");
  const [newPartyDesc, setNewPartyDesc] = useState("");
  const [newPartyLogo, setNewPartyLogo] = useState("https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=300&q=80");
  const [newPartyColor, setNewPartyColor] = useState("#3b82f6");
  const [partyError, setPartyError] = useState("");

  const loadData = () => {
    setLoading(true);
    Promise.all([
      fetch("/api/admin/stats").then((res) => (res.status === 403 ? null : res.json())),
      fetch("/api/admin/parties").then((res) => (res.status === 403 ? null : res.json())),
      fetch(`/api/admin/users?search=${encodeURIComponent(userSearch)}`).then((res) =>
        res.status === 403 ? null : res.json()
      ),
    ])
      .then(([statsData, partiesData, usersData]) => {
        if (!statsData || !partiesData) {
          router.push("/admin/login");
          return;
        }
        setStats(statsData);
        setParties(partiesData.parties || []);
        setUsers(usersData?.users || []);
        setLoading(false);
      })
      .catch(() => router.push("/admin/login"));
  };

  useEffect(() => {
    loadData();
  }, [userSearch]);

  const handleToggleParty = async (id: string, currentActive: boolean) => {
    await fetch("/api/admin/parties", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isActive: !currentActive }),
    });
    loadData();
  };

  const handleToggleUserSuspension = async (userId: string, currentSuspended: boolean) => {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, isSuspended: !currentSuspended }),
    });
    loadData();
  };

  const handleCreateParty = async (e: React.FormEvent) => {
    e.preventDefault();
    setPartyError("");

    try {
      const res = await fetch("/api/admin/parties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newPartyName,
          code: newPartyCode,
          description: newPartyDesc,
          logoUrl: newPartyLogo,
          color: newPartyColor,
          isActive: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create party");

      setShowAddPartyModal(false);
      setNewPartyName("");
      setNewPartyCode("");
      setNewPartyDesc("");
      loadData();
    } catch (err: any) {
      setPartyError(err.message);
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full border border-amber-500/40 bg-amber-950/30 text-amber-300 font-mono text-[10px] uppercase font-bold tracking-wider">
              Electoral Commission
            </span>
            <span className="text-xs text-slate-500">• Administration Control</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">BIOVOTE Electoral Dashboard</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl text-xs flex items-center gap-1.5"
            title="Refresh Real-time Metrics"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>
          <button
            onClick={() => setShowAddPartyModal(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-amber-950/40"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Political Party</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 space-x-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 border-b-2 transition-all ${
            activeTab === "overview"
              ? "border-amber-400 text-amber-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Election Analytics
        </button>
        <button
          onClick={() => setActiveTab("parties")}
          className={`pb-3 border-b-2 transition-all ${
            activeTab === "parties"
              ? "border-amber-400 text-amber-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Party Registry ({parties.length})
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`pb-3 border-b-2 transition-all ${
            activeTab === "users"
              ? "border-amber-400 text-amber-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Voter Registry ({users.length})
        </button>
        <button
          onClick={() => setActiveTab("audit")}
          className={`pb-3 border-b-2 transition-all ${
            activeTab === "audit"
              ? "border-amber-400 text-amber-400"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Audit Logs
        </button>
      </div>

      {/* TAB 1: OVERVIEW & ELECTION METRICS */}
      {activeTab === "overview" && stats && (
        <div className="space-y-8">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border border-slate-800 bg-[#0c101a] space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Total Voters</span>
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">{stats.metrics.totalUsers}</div>
              <p className="text-[11px] text-slate-500">
                {stats.metrics.verifiedUsers} email verified
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-800 bg-[#0c101a] space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Ballots Cast</span>
                <Vote className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">{stats.metrics.totalBallots}</div>
              <p className="text-[11px] text-slate-500">Verified unique ballots</p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-800 bg-[#0c101a] space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Voter Turnout</span>
                <Activity className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">
                {stats.metrics.turnoutPercentage}%
              </div>
              <p className="text-[11px] text-slate-500">Turnout rate</p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-800 bg-[#0c101a] space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Active Parties</span>
                <Flag className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">
                {stats.metrics.activeParties}
              </div>
              <p className="text-[11px] text-slate-500">of {stats.metrics.totalParties} registered</p>
            </div>
          </div>

          {/* Aggregate Election Results Chart */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-[#0c101a] space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Live Aggregate Election Returns</h3>
                <p className="text-xs text-slate-400">
                  Fully decoupled ballot tally. Individual voter choices are not stored.
                </p>
              </div>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/50 px-2.5 py-1 rounded-full border border-cyan-500/30">
                Total Ballots: {stats.metrics.totalBallots}
              </span>
            </div>

            <div className="space-y-4">
              {stats.results.map((r: any) => (
                <div key={r.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-white">
                      {r.name} ({r.code})
                    </span>
                    <span className="font-mono text-slate-300">
                      {r.votes} votes ({r.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${r.percentage}%`,
                        backgroundColor: r.color || "#3b82f6",
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PARTY MANAGEMENT */}
      {activeTab === "parties" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {parties.map((p) => (
            <div
              key={p.id}
              className="p-6 rounded-2xl border border-slate-800 bg-[#0c101a] flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={p.logoUrl}
                      alt={p.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700"
                    />
                    <div>
                      <h3 className="text-base font-bold text-white">{p.name}</h3>
                      <span className="text-xs font-mono text-cyan-400 font-semibold">{p.code}</span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono ${
                      p.isActive
                        ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {p.isActive ? "ACTIVE" : "INACTIVE"}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">{p.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">
                  Recorded Votes: <strong>{p._count?.votes ?? 0}</strong>
                </span>
                <button
                  onClick={() => handleToggleParty(p.id, p.isActive)}
                  className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800"
                >
                  {p.isActive ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4 text-slate-500" />}
                  <span>{p.isActive ? "Deactivate" : "Activate"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: USER REGISTRY */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search registered voters..."
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
              />
            </div>
            <div className="text-xs text-slate-400">
              Note: Voter choices are decoupled & completely hidden from admin records.
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">Voter Name</th>
                  <th className="p-3">Username</th>
                  <th className="p-3">Email Status</th>
                  <th className="p-3">Ballot Status</th>
                  <th className="p-3">Registered At</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-[#0c101a]">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-900/50">
                    <td className="p-3 font-semibold text-white">{u.name}</td>
                    <td className="p-3 font-mono text-slate-400">@{u.username}</td>
                    <td className="p-3">
                      {u.emailVerified ? (
                        <span className="text-emerald-400">Verified</span>
                      ) : (
                        <span className="text-amber-400">Pending</span>
                      )}
                    </td>
                    <td className="p-3">
                      {u.ballotReceipt ? (
                        <span className="text-cyan-400 font-mono">Voted (Receipt Created)</span>
                      ) : (
                        <span className="text-slate-500">Not Voted</span>
                      )}
                    </td>
                    <td className="p-3 text-slate-400">{formatDate(u.createdAt)}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleToggleUserSuspension(u.id, u.isSuspended)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
                          u.isSuspended
                            ? "bg-rose-950/60 border-rose-500/40 text-rose-300"
                            : "bg-slate-800 border-slate-700 text-slate-300 hover:text-white"
                        }`}
                      >
                        {u.isSuspended ? "Suspended (Click to Unsuspend)" : "Suspend"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOGS */}
      {activeTab === "audit" && stats && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Admin</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-[#0c101a]">
                {stats.recentLogs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-slate-900/50">
                    <td className="p-3 text-slate-400 font-mono">{formatDate(log.createdAt)}</td>
                    <td className="p-3 font-semibold text-white">{log.adminName}</td>
                    <td className="p-3 font-mono text-amber-400">{log.action}</td>
                    <td className="p-3 text-slate-300">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Party Modal */}
      {showAddPartyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0d131f] p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Register Political Party</h3>
              <button
                onClick={() => setShowAddPartyModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Close
              </button>
            </div>

            {partyError && <p className="text-xs text-rose-400">{partyError}</p>}

            <form onSubmit={handleCreateParty} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Party Name</label>
                <input
                  type="text"
                  required
                  value={newPartyName}
                  onChange={(e) => setNewPartyName(e.target.value)}
                  placeholder="Future Democracy Front"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Ballot Code (Abbreviation)
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={newPartyCode}
                  onChange={(e) => setNewPartyCode(e.target.value)}
                  placeholder="FDF"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Manifesto / Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={newPartyDesc}
                  onChange={(e) => setNewPartyDesc(e.target.value)}
                  placeholder="Key political commitments and objectives..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Logo URL</label>
                <input
                  type="url"
                  required
                  value={newPartyLogo}
                  onChange={(e) => setNewPartyLogo(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Brand Color (Hex)</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={newPartyColor}
                    onChange={(e) => setNewPartyColor(e.target.value)}
                    className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={newPartyColor}
                    onChange={(e) => setNewPartyColor(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddPartyModal(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-700 text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl"
                >
                  Save & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
