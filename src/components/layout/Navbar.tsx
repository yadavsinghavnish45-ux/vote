"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ScanFace, Vote, ShieldCheck, LogOut, User, LayoutDashboard, Menu, X } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : { authenticated: false }))
      .then((data) => {
        if (data.authenticated) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/auth/me", { method: "POST" });
    setUser(null);
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#080c14]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Wordmark & Icon */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-400 p-[1.5px] shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300">
            <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
              <ScanFace className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
              BIOVOTE
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] uppercase tracking-widest text-cyan-400/80 font-mono px-1.5 py-0.5 rounded border border-cyan-500/30 bg-cyan-950/30">
              PROTOTYPE
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-cyan-400 ${
              pathname === "/" ? "text-cyan-400" : "text-slate-300"
            }`}
          >
            Overview
          </Link>

          {user ? (
            <>
              <Link
                href="/dashboard"
                className={`text-sm font-medium transition-colors hover:text-cyan-400 flex items-center gap-1.5 ${
                  pathname === "/dashboard" ? "text-cyan-400" : "text-slate-300"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Voter Desk
              </Link>
              <Link
                href="/vote"
                className={`text-sm font-medium transition-colors hover:text-cyan-400 flex items-center gap-1.5 ${
                  pathname === "/vote" ? "text-cyan-400" : "text-slate-300"
                }`}
              >
                <Vote className="w-4 h-4" />
                Cast Demo Vote
              </Link>
              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className={`text-sm font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-amber-500/30 bg-amber-950/20`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin Console
                </Link>
              )}
            </>
          ) : (
            <Link
              href="/#features"
              className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors"
            >
              Security Architecture
            </Link>
          )}
        </nav>

        {/* User / Auth Action Controls */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700/80 bg-slate-900/60 hover:bg-slate-800 transition-all text-xs text-slate-200"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-5 h-5 rounded-full object-cover border border-cyan-400/50"
                  />
                ) : (
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                )}
                <span className="font-medium max-w-[120px] truncate">{user.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-400 transition-colors rounded-lg hover:bg-slate-800"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-medium text-slate-300 hover:text-white px-3.5 py-1.5 rounded-lg transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="text-sm font-medium text-white px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 transition-all shadow-md shadow-blue-500/20 active:scale-95"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#080c14] px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-slate-300 hover:text-cyan-400"
          >
            Overview
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm text-slate-300 hover:text-cyan-400"
              >
                Voter Desk
              </Link>
              <Link
                href="/vote"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm text-slate-300 hover:text-cyan-400"
              >
                Cast Demo Vote
              </Link>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm text-slate-300 hover:text-cyan-400"
              >
                My Profile
              </Link>
              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm text-amber-400"
                >
                  Admin Console
                </Link>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left py-2 text-sm text-rose-400"
              >
                Log Out
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2 text-center text-sm font-medium border border-slate-700 rounded-lg text-slate-200"
              >
                Log In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2 text-center text-sm font-medium bg-blue-600 rounded-lg text-white"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
