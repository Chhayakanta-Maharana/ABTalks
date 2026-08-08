"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Lock,
  User,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  AlertCircle,
} from "lucide-react";
import AtmosphericBackground from "@/components/AtmosphericBackground";

const GithubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} width={16} height={16} style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    remember: true,
    agreeTerms: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      if (mode === "register" && formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
      const endpoint = mode === "login" ? `${API_BASE}/auth/login` : `${API_BASE}/auth/register`;

      const payload =
        mode === "login"
          ? { email: formData.email, password: formData.password }
          : {
              name: formData.name,
              username: formData.username,
              email: formData.email,
              password: formData.password,
            };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Authentication failed");
      }

      // Save Auth Token & User Profile in LocalStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userProfile", JSON.stringify(data.user));
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 900);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to authenticate. Please check your details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-[#F8FAFC] flex flex-col justify-between relative overflow-hidden selection:bg-[#3B82F6] selection:text-white">
      <AtmosphericBackground />

      {/* Top Header / Back Button */}
      <header className="relative z-20 px-6 py-6 max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#07111F]/80 border border-slate-800 text-xs font-semibold text-[#94A3B8] hover:text-white hover:border-slate-700 hover:bg-slate-900/60 transition-all duration-200 backdrop-blur-xl group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Landing</span>
        </Link>

        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-[linear-gradient(135deg,#2563EB,#0B1F3A)] p-[1px]">
            <div className="w-full h-full bg-[#030712] rounded-[7px] flex items-center justify-center font-black text-xs text-[#3B82F6] group-hover:text-white transition-colors">
              AB
            </div>
          </div>
          <span className="text-xs font-black tracking-[0.3em] text-[#F8FAFC] uppercase">
            ABTALKS
          </span>
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Side: Brand Value Prop (Desktop visible) */}
          <div className="hidden lg:block lg:col-span-6 space-y-6 pr-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2563EB]/15 border border-[#3B82F6]/30 text-[#3B82F6] text-xs font-bold tracking-widest uppercase">
              <Zap className="w-3.5 h-3.5 fill-[#3B82F6]" />
              <span>Join the 60-Day Engine</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Build in public. <br />
              <span className="bg-gradient-to-r from-[#3B82F6] via-[#60A5FA] to-[#93C5FD] bg-clip-text text-transparent">
                Prove your authority.
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Track daily tasks, verify code on-chain, and join an elite group of developers building 60 projects in 60 days.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#07111F]/60 border border-slate-800/80 backdrop-blur-md">
                <div className="w-8 h-8 rounded-lg bg-[#2563EB]/20 border border-[#3B82F6]/30 flex items-center justify-center text-[#3B82F6] flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">GitHub Proof Verification</h4>
                  <p className="text-[11px] text-[#64748B]">Automated daily commit checking</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#07111F]/60 border border-slate-800/80 backdrop-blur-md">
                <div className="w-8 h-8 rounded-lg bg-[#2563EB]/20 border border-[#3B82F6]/30 flex items-center justify-center text-[#3B82F6] flex-shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Streak & Leaderboard</h4>
                  <p className="text-[11px] text-[#64748B]">Compete with consistency compounding</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Auth Card (Professional Compact Size) */}
          <div className="lg:col-span-6 flex justify-center w-full">
            <div className="w-full max-w-[420px] navy-card p-6 sm:p-7 rounded-2xl border border-slate-800/90 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl relative overflow-hidden">
              {/* Top Mode Selector Tabs */}
              <div className="flex items-center p-1 rounded-xl bg-[#030712]/90 border border-slate-800 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setErrorMessage("");
                  }}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all duration-200 ${
                    mode === "login"
                      ? "bg-[linear-gradient(135deg,#2563EB,#1D4ED8)] text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                      : "text-[#94A3B8] hover:text-white"
                  }`}
                >
                  SIGN IN
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setErrorMessage("");
                  }}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all duration-200 ${
                    mode === "register"
                      ? "bg-[linear-gradient(135deg,#2563EB,#1D4ED8)] text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                      : "text-[#94A3B8] hover:text-white"
                  }`}
                >
                  NEW ACCOUNT
                </button>
              </div>

              {/* Title & Description */}
              <div className="mb-4">
                <h2 className="text-xl font-bold tracking-tight text-white">
                  {mode === "login" ? "Welcome Back, Developer" : "Join ABTalks 60-Day Challenge"}
                </h2>
                <p className="text-xs text-[#94A3B8] mt-1">
                  {mode === "login"
                    ? "Enter your credentials to access your student dashboard."
                    : "Create your account to start tracking your daily builds."}
                </p>
              </div>

              {/* Error Message Box */}
              {errorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center gap-2 text-xs text-red-300">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Success Overlay Feedback */}
              {isSuccess ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 animate-fade-in">
                  <div className="w-14 h-14 rounded-full bg-[#2563EB]/20 border border-[#3B82F6] flex items-center justify-center text-[#3B82F6] shadow-[0_0_25px_rgba(59,130,246,0.4)]">
                    <CheckCircle2 className="w-8 h-8 animate-bounce" />
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {mode === "login" ? "Authentication Successful!" : "Account Created Successfully!"}
                  </h3>
                  <p className="text-xs text-[#94A3B8]">Redirecting to your student dashboard...</p>
                </div>
              ) : (
                <>
                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Full Name & Username (Register only) */}
                    {mode === "register" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                            Full Name
                          </label>
                          <div className="relative">
                            <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              name="name"
                              required
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Chhayakanta Maharana"
                              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#030712]/80 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#3B82F6] transition-colors"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                            GitHub Username
                          </label>
                          <div className="relative">
                            <GithubIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              name="username"
                              required
                              value={formData.username}
                              onChange={handleChange}
                              placeholder="chhayakanta"
                              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#030712]/80 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#3B82F6] transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Email Input */}
                    <div>
                      <label className="block text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="developer@abtalks.com"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#030712]/80 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#3B82F6] transition-colors"
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
                          Password
                        </label>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          required
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="••••••••••••"
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#030712]/80 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#3B82F6] transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password (Register only) */}
                    {mode === "register" && (
                      <div>
                        <label className="block text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type={showPassword ? "text" : "password"}
                            name="confirmPassword"
                            required
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••••••"
                            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#030712]/80 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#3B82F6] transition-colors"
                          />
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 rounded-xl bg-[linear-gradient(135deg,#2563EB,#1D4ED8)] text-white text-xs font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>{mode === "login" ? "Sign In to Dashboard" : "Create Developer Account"}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Toggle Mode Footer */}
                  <div className="mt-6 text-center text-xs text-[#94A3B8]">
                    {mode === "login" ? (
                      <p>
                        New to ABTalks?{" "}
                        <button
                          type="button"
                          onClick={() => {
                            setMode("register");
                            setErrorMessage("");
                          }}
                          className="text-[#3B82F6] font-bold hover:underline"
                        >
                          Create an account
                        </button>
                      </p>
                    ) : (
                      <p>
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => {
                            setMode("login");
                            setErrorMessage("");
                          }}
                          className="text-[#3B82F6] font-bold hover:underline"
                        >
                          Sign In
                        </button>
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 py-4 text-center text-xs text-[#64748B]">
        &copy; {new Date().getFullYear()} ABTalks Engine. Built for ambitious developers.
      </footer>
    </div>
  );
}
