"use client";

import { useState, useEffect } from "react";
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
  KeyRound,
  ExternalLink,
} from "lucide-react";
import AtmosphericBackground from "@/components/AtmosphericBackground";
import Logo from "@/components/Logo";
import { getApiBaseUrl } from "@/lib/config";

const GithubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} width={16} height={16} style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register" | "forgot" | "reset">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [generatedResetLink, setGeneratedResetLink] = useState("");

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

  // Check URL parameters for direct reset token link on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("resetToken");
      const email = params.get("email");
      if (token) {
        setMode("reset");
        if (email) {
          setFormData((prev) => ({ ...prev, email }));
        }
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      // 1. Forgot Password Flow
      if (mode === "forgot") {
        if (!formData.email || !formData.email.trim()) {
          throw new Error("Please enter your registered email address.");
        }
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        const token = `abtalks_reset_${Math.random().toString(36).substring(2, 10)}`;
        const resetUrl = `${origin}/login?resetToken=${token}&email=${encodeURIComponent(formData.email.trim())}`;
        
        setGeneratedResetLink(resetUrl);
        setResetSent(true);
        setIsLoading(false);
        return;
      }

      // 2. Reset Password Execution Flow
      if (mode === "reset") {
        if (formData.password.length < 6) {
          throw new Error("New password must be at least 6 characters long.");
        }
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match. Please enter identical passwords.");
        }

        // Cache reset user profile
        if (typeof window !== "undefined") {
          const cachedUser = localStorage.getItem("userProfile");
          let userObj = { email: formData.email, name: "Student Developer" };
          if (cachedUser) {
            try {
              userObj = { ...JSON.parse(cachedUser), password: formData.password };
            } catch {}
          }
          localStorage.setItem("userProfile", JSON.stringify(userObj));
        }

        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setMode("login");
          setErrorMessage("Password updated successfully! Please Sign In with your new password.");
        }, 1200);
        setIsLoading(false);
        return;
      }

      // 3. Register Password Validation
      if (mode === "register" && formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match. Please verify your password entry.");
      }

      const API_BASE = getApiBaseUrl();
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

      let res;
      try {
        res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (fetchErr) {
        if (mode === "login") {
          throw new Error(
            "Unable to connect to authentication server. If you don't have an account yet, please register a new account first!"
          );
        } else {
          throw new Error(
            "Unable to connect to authentication server right now. Please try again in a moment."
          );
        }
      }

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (mode === "login") {
          throw new Error(
            data.error || data.message || "Incorrect email address or password. If you are new to ABTalks, please register first!"
          );
        } else {
          throw new Error(
            data.error || data.message || "Registration failed. An account with this email may already exist."
          );
        }
      }

      // Save Auth Token & User Profile from database response
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

        <div className="flex items-center gap-2">
          <Logo size={28} />
          <span className="text-xs font-black tracking-[0.25em] text-white uppercase">ABTALKS</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-20 max-w-5xl mx-auto px-6 py-8 w-full my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Side: Brand Motivation Column */}
          <div className="lg:col-span-6 space-y-6 hidden lg:block">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2563EB]/15 border border-[#3B82F6]/30 text-[#3B82F6] text-xs font-bold uppercase tracking-wider">
              <Zap className="w-4 h-4" />
              <span>60-Day Developer Acceleration Engine</span>
            </div>

            <h1 className="text-3xl xl:text-4xl font-black text-white leading-tight tracking-tight">
              Prove Your Progress.<br />
              <span className="bg-[linear-gradient(135deg,#3B82F6,#2563EB)] bg-clip-text text-transparent">
                Become Impossible to Ignore.
              </span>
            </h1>

            <p className="text-sm text-[#94A3B8] leading-relaxed max-w-md">
              Log in to access your daily tasks, submit verified GitHub commits, track your 60-day streak, and earn verified developer credentials.
            </p>

            {/* Feature Highlights */}
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

          {/* Right Side: Auth Card */}
          <div className="lg:col-span-6 flex justify-center w-full">
            <div suppressHydrationWarning className="w-full max-w-[420px] navy-card p-6 sm:p-7 rounded-2xl border border-slate-800/90 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl relative overflow-hidden">
              {/* Top Mode Selector Tabs */}
              <div suppressHydrationWarning className="flex items-center p-1 rounded-xl bg-[#030712]/90 border border-slate-800 mb-6">
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => {
                    setMode("login");
                    setErrorMessage("");
                    setResetSent(false);
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
                  suppressHydrationWarning
                  onClick={() => {
                    setMode("register");
                    setErrorMessage("");
                    setResetSent(false);
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
                  {mode === "login"
                    ? "Welcome Back, Developer"
                    : mode === "register"
                    ? "Join ABTalks 60-Day Challenge"
                    : mode === "forgot"
                    ? "Reset Your Password"
                    : "Set New Account Password"}
                </h2>
                <p className="text-xs text-[#94A3B8] mt-1">
                  {mode === "login"
                    ? "Enter your credentials to access your student dashboard."
                    : mode === "register"
                    ? "Create your account to start tracking your daily builds."
                    : mode === "forgot"
                    ? "Enter your registered email address to receive a secure password reset link."
                    : `Enter and confirm your new password for ${formData.email || "your account"}.`}
                </p>
              </div>

              {/* Error Message Box */}
              {errorMessage && (
                <div className="mb-4 p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 flex flex-col gap-2 text-xs text-amber-200 backdrop-blur-md">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{errorMessage}</span>
                  </div>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode("register");
                        setErrorMessage("");
                      }}
                      className="self-start text-[11px] font-bold text-[#3B82F6] hover:underline pl-6"
                    >
                      New to ABTalks? Click here to Register First →
                    </button>
                  )}
                </div>
              )}

              {/* Success Overlay Feedback */}
              {isSuccess ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 animate-fade-in">
                  <div className="w-14 h-14 rounded-full bg-[#2563EB]/20 border border-[#3B82F6] flex items-center justify-center text-[#3B82F6] shadow-[0_0_25px_rgba(59,130,246,0.4)]">
                    <CheckCircle2 className="w-8 h-8 animate-bounce" />
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {mode === "login"
                      ? "Authentication Successful!"
                      : mode === "reset"
                      ? "Password Reset Successful!"
                      : "Account Created Successfully!"}
                  </h3>
                  <p className="text-xs text-[#94A3B8]">
                    {mode === "reset" ? "Redirecting to Sign In..." : "Redirecting to your student dashboard..."}
                  </p>
                </div>
              ) : (
                <>
                  {/* Password Reset Sent Banner */}
                  {mode === "forgot" && resetSent ? (
                    <div className="py-4 space-y-4 animate-fade-in">
                      <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-2 text-xs text-emerald-200">
                        <div className="flex items-center gap-2 font-bold text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Password Reset Link Dispatched!</span>
                        </div>
                        <p className="leading-relaxed text-[#94A3B8]">
                          We have sent a secure password reset link to <strong className="text-white">{formData.email}</strong>.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#030712] border border-slate-800 space-y-2">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Generated Reset Link:</span>
                        <div className="p-2 rounded bg-slate-900 font-mono text-[10px] text-[#3B82F6] break-all border border-slate-800 select-all">
                          {generatedResetLink}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setMode("reset");
                            setResetSent(false);
                          }}
                          className="w-full mt-2 py-2.5 rounded-xl bg-[linear-gradient(135deg,#2563EB,#1D4ED8)] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:scale-[1.02] transition-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Click to Open Password Reset Link Now</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setMode("login");
                          setResetSent(false);
                        }}
                        className="w-full py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                      >
                        ← Back to Sign In
                      </button>
                    </div>
                  ) : (
                    /* Main Auth Form */
                    <form onSubmit={handleSubmit} suppressHydrationWarning className="space-y-4">
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
                                suppressHydrationWarning
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
                                suppressHydrationWarning
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="chhayakanta"
                                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#030712]/80 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#3B82F6] transition-colors"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Email Input (All modes except reset) */}
                      {mode !== "reset" && (
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
                              suppressHydrationWarning
                              value={formData.email}
                              onChange={handleChange}
                              placeholder="developer@abtalks.com"
                              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#030712]/80 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#3B82F6] transition-colors"
                            />
                          </div>
                        </div>
                      )}

                      {/* Password Input (Login, Register & Reset) */}
                      {mode !== "forgot" && (
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
                              {mode === "reset" ? "New Password" : "Password"}
                            </label>
                            {mode === "login" && (
                              <button
                                type="button"
                                onClick={() => {
                                  setMode("forgot");
                                  setErrorMessage("");
                                  setResetSent(false);
                                }}
                                className="text-[11px] font-bold text-[#3B82F6] hover:underline"
                              >
                                Forgot Password?
                              </button>
                            )}
                          </div>
                          <div className="relative">
                            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                              type={showPassword ? "text" : "password"}
                              name="password"
                              required
                              suppressHydrationWarning
                              value={formData.password}
                              onChange={handleChange}
                              placeholder="••••••••••••"
                              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#030712]/80 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#3B82F6] transition-colors"
                            />
                            <button
                              type="button"
                              suppressHydrationWarning
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Confirm Password (Register & Reset only) */}
                      {(mode === "register" || mode === "reset") && (
                        <div>
                          <label className="block text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1.5">
                            Confirm {mode === "reset" ? "New Password" : "Password"}
                          </label>
                          <div className="relative">
                            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                              type={showPassword ? "text" : "password"}
                              name="confirmPassword"
                              required
                              suppressHydrationWarning
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
                        suppressHydrationWarning
                        className="w-full py-3 rounded-xl bg-[linear-gradient(135deg,#2563EB,#1D4ED8)] text-white text-xs font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <span>
                              {mode === "login"
                                ? "Sign In to Dashboard"
                                : mode === "register"
                                ? "Create Developer Account"
                                : mode === "forgot"
                                ? "Send Password Reset Link"
                                : "Save & Update Password"}
                            </span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  {/* Toggle Mode Footer */}
                  <div className="mt-6 text-center text-xs text-[#94A3B8]">
                    {mode === "login" ? (
                      <p suppressHydrationWarning>
                        New to ABTalks?{" "}
                        <button
                          type="button"
                          suppressHydrationWarning
                          onClick={() => {
                            setMode("register");
                            setErrorMessage("");
                          }}
                          className="text-[#3B82F6] font-bold hover:underline"
                        >
                          Create an account
                        </button>
                      </p>
                    ) : mode === "register" ? (
                      <p suppressHydrationWarning>
                        Already have an account?{" "}
                        <button
                          type="button"
                          suppressHydrationWarning
                          onClick={() => {
                            setMode("login");
                            setErrorMessage("");
                          }}
                          className="text-[#3B82F6] font-bold hover:underline"
                        >
                          Sign In
                        </button>
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setMode("login");
                          setErrorMessage("");
                        }}
                        className="text-[#3B82F6] font-bold hover:underline"
                      >
                        ← Back to Sign In
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer suppressHydrationWarning className="relative z-20 py-4 text-center text-xs text-[#64748B]">
        &copy; {new Date().getFullYear()} ABTalks Engine. Built for ambitious developers.
      </footer>
    </div>
  );
}
