"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Camera, CheckCircle2, ArrowRight, ShieldCheck, KeyRound, Sparkles } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  // Wizard state: 1 = Details, 2 = Photo, 3 = OTP, 4 = Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form Fields
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  // OTP State
  const [userId, setUserId] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [devOtpHint, setDevOtpHint] = useState("");

  // Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !username || !email || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setStep(2);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size must be less than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegisterAccount = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          username,
          email,
          password,
          avatarUrl: avatarUrl || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed.");
      }

      setUserId(data.userId);
      if (data.devOtpCode) {
        setDevOtpHint(data.devOtpCode);
        setOtpCode(data.devOtpCode); // Auto-populate for seamless demo convenience
      }
      setStep(3);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          code: otpCode.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Verification failed.");
      }

      setStep(4);
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-[#0b101b] p-6 sm:p-8 shadow-2xl shadow-blue-950/40 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-950/30 text-xs text-cyan-400 font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>BIOVOTE Demo Registration</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Create Voter Account</h2>
          <p className="text-xs text-slate-400">Step {step} of 4</p>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-400 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>

        {error && (
          <div className="p-3 rounded-xl border border-rose-500/40 bg-rose-950/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* STEP 1: Personal Details */}
        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Legal Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Elena Rostova"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Unique Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="elena_rostova"
                className="w-full px-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="elena@university.edu"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>Continue to Photo Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: Profile Photo Upload */}
        {step === 2 && (
          <div className="space-y-6 text-center">
            <div className="space-y-2">
              <h3 className="text-base font-bold text-white">Upload Profile Photo</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Used strictly as an avatar on your voter credential card. Never used as an authentication secret.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="w-32 h-32 rounded-full border-2 border-dashed border-cyan-400/50 bg-slate-950 flex items-center justify-center overflow-hidden mb-4 relative group">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-8 h-8 text-cyan-400/60" />
                )}
              </div>

              <label className="cursor-pointer px-4 py-2 rounded-xl border border-slate-700 bg-slate-900 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-colors">
                Choose Image File
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-2.5 rounded-xl border border-slate-800 text-slate-400 text-xs hover:text-white"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleRegisterAccount}
                disabled={loading}
                className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs rounded-xl transition-all"
              >
                {loading ? "Registering..." : "Complete Registration"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: OTP Verification */}
        {step === 3 && (
          <form onSubmit={handleVerifyOtp} className="space-y-5 text-center">
            <div className="space-y-2">
              <KeyRound className="w-10 h-10 text-cyan-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">Verify Your Email</h3>
              <p className="text-xs text-slate-400">
                Enter the 6-digit confirmation code generated for <span className="text-cyan-300">{email}</span>.
              </p>
            </div>

            {devOtpHint && (
              <div className="p-3 rounded-xl border border-cyan-500/30 bg-cyan-950/30 text-cyan-200 text-xs flex items-center justify-between">
                <span>Demo Sandbox Code:</span>
                <span className="font-mono font-bold text-sm tracking-widest text-cyan-300">{devOtpHint}</span>
              </div>
            )}

            <input
              type="text"
              required
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="123456"
              className="w-full py-3 bg-slate-900 border border-slate-700 rounded-xl text-center text-2xl font-mono tracking-widest text-white focus:outline-none focus:border-cyan-400"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-sm rounded-xl shadow-lg transition-all"
            >
              {loading ? "Verifying..." : "Confirm & Enter Voter Desk"}
            </button>
          </form>
        )}

        {/* STEP 4: Registration Success */}
        {step === 4 && (
          <div className="py-8 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-xl font-bold text-white">Account Created & Verified!</h3>
            <p className="text-xs text-slate-400">
              Welcome to BIOVOTE. Establishing your cryptographic session...
            </p>
          </div>
        )}

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-500">
          Already registered?{" "}
          <Link href="/login" className="text-cyan-400 hover:underline font-medium">
            Log in to Voter Desk
          </Link>
        </p>
      </div>
    </div>
  );
}
