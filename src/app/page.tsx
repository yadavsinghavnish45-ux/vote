import Link from "next/link";
import {
  ScanFace,
  ShieldCheck,
  Lock,
  Vote,
  Database,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  UserCheck,
  ServerOff,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden pt-20 pb-24 md:pt-32 md:pb-36 border-b border-slate-800/80">
        {/* Futuristic Background Accents */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none -z-10"></div>
        <div className="absolute top-20 right-[15%] w-[300px] h-[250px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-950/40 text-xs font-medium text-cyan-300 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Next-Gen College Engineering Showcase</span>
          </div>

          {/* Title & Tagline */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
              <span>Next-Gen Biometric</span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
                Voting Demonstration
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
              &quot;Your Identity. Your Voice. Your Vote.&quot;
            </p>
            <p className="text-sm text-slate-400 max-w-xl mx-auto">
              BIOVOTE demonstrates how client-side face verification and cryptographic ballot decoupling can preserve both 1-person-1-vote integrity and complete secret ballot privacy.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white font-semibold text-sm shadow-xl shadow-blue-600/25 hover:shadow-cyan-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
            >
              <span>Begin Demo Voting</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Voter Sign In</span>
            </Link>

            <Link
              href="/admin/login"
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-amber-500/30 bg-amber-950/20 hover:bg-amber-950/40 text-amber-300 font-medium text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Admin Portal</span>
            </Link>
          </div>

          {/* Metric Badges */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm">
              <div className="text-cyan-400 font-mono text-xl font-bold">100%</div>
              <div className="text-xs text-slate-400 mt-1">Client-Side Verification</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm">
              <div className="text-blue-400 font-mono text-xl font-bold">0 Raw</div>
              <div className="text-xs text-slate-400 mt-1">Biometrics Stored</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm">
              <div className="text-emerald-400 font-mono text-xl font-bold">1-to-1</div>
              <div className="text-xs text-slate-400 mt-1">Single Vote Constraint</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm">
              <div className="text-purple-400 font-mono text-xl font-bold">Zero-Leak</div>
              <div className="text-xs text-slate-400 mt-1">Decoupled Ballots</div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Step-by-Step Flow */}
      <section className="w-full py-20 bg-[#070a12] border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs uppercase tracking-widest font-mono text-cyan-400">Workflow</h2>
            <p className="text-3xl font-extrabold text-white">How BIOVOTE Operates</p>
            <p className="text-sm text-slate-400">
              A frictionless 4-step prototype demonstrating verifiable integrity from identity verification to secret ballot casting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="relative p-6 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-4 hover:border-blue-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
                1
              </div>
              <h3 className="text-base font-bold text-white">Register & Verify</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Create a demo voter account, set a secure password, and verify ownership via a 6-digit OTP code.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-6 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-4 hover:border-cyan-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
                2
              </div>
              <h3 className="text-base font-bold text-white">Select Party</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Browse official participating political parties published in real time by the electoral administration.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-6 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-4 hover:border-purple-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold">
                3
              </div>
              <h3 className="text-base font-bold text-white">Simulated Liveness</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Experience the futuristic camera face-detection HUD with simulated blink & head-tilt checks or an accessible PIN.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative p-6 rounded-2xl border border-slate-800 bg-slate-900/50 space-y-4 hover:border-emerald-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                4
              </div>
              <h3 className="text-base font-bold text-white">Cast Decoupled Vote</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receive an encrypted demonstration receipt while the database locks out duplicate voting without recording who you chose.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Architecture & Ethical Privacy */}
      <section id="features" className="w-full py-20 bg-[#060910]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs uppercase tracking-widest font-mono text-cyan-400">Privacy By Design</h2>
            <p className="text-3xl font-extrabold text-white">Engineered For Democratic Trust</p>
            <p className="text-sm text-slate-400">
              How BIOVOTE addresses the classic dilemma between biometric voter verification and secret ballot anonymity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/30 space-y-3">
              <ServerOff className="w-8 h-8 text-rose-400" />
              <h3 className="text-lg font-bold text-white">Zero Server-Side Biometrics</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Raw camera frames never leave the user&apos;s browser. The system performs simulated movement detection locally via HTML5 canvas and discards every frame instantaneously.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/30 space-y-3">
              <Lock className="w-8 h-8 text-cyan-400" />
              <h3 className="text-lg font-bold text-white">Decoupled Anonymous Ballots</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                The database stores a receipt proving <span className="text-slate-200">User X voted</span>, and separately records <span className="text-slate-200">Party Y received a vote</span>, with no join table or foreign key between them.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/30 space-y-3">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Atomic Double-Voting Guard</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Prisma database transactions combined with unique user constraints prevent race conditions and duplicate voting attempts across browser tabs and automated scripts.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
