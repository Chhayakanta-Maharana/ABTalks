"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { gsap } from "gsap";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Flame,
  Sparkles,
  Zap,
  Code2,
  FileCheck,
  Send,
  HelpCircle,
  Clock,
  BookOpen,
  Award,
  AlertCircle,
  Copy,
} from "lucide-react";
import { MOCK_DAY_12_TASK, MOCK_ACTIVITY_FEED } from "@/data/mockData";
import AtmosphericBackground from "@/components/AtmosphericBackground";

const GithubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function ChallengeDayPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const rawId = params?.id;
  const dayId = typeof rawId === "string" ? rawId : Array.isArray(rawId) ? rawId[0] : "12";

  // Form Submission State
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [copiedRepo, setCopiedRepo] = useState(false);

  // Requirements checklist state
  const [completedReqs, setCompletedReqs] = useState<number[]>([0, 1]);

  // GSAP Entrance Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".dash-card",
        { opacity: 0, y: 35, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const toggleReq = (index: number) => {
    if (completedReqs.includes(index)) {
      setCompletedReqs(completedReqs.filter((i) => i !== index));
    } else {
      setCompletedReqs([...completedReqs, index]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubUrl || !linkedinUrl) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  const handleCopyRepo = () => {
    const repoUrl = "https://github.com/Chhayakanta-Maharana/ABTalks/";
    navigator.clipboard.writeText(repoUrl);
    setCopiedRepo(true);
    setTimeout(() => setCopiedRepo(false), 2000);
    window.open(repoUrl, "_blank");
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#030712] text-[#F8FAFC] pb-24 font-sans selection:bg-[#3B82F6]/30">
      <AtmosphericBackground />

      {/* Top Mobile Nav Header */}
      <header className="sticky top-0 z-40 bg-[#07111F]/80 backdrop-blur-xl border-b border-[rgba(148,163,184,0.12)] px-4 py-3 sm:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <div className="h-4 w-[1px] bg-slate-800" />
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#2563EB]/20 border border-[#3B82F6]/30 text-[#3B82F6] font-mono text-xs font-bold">
                DAY {dayId}
              </span>
              <span className="text-xs font-bold text-slate-300 hidden sm:inline">
                {MOCK_DAY_12_TASK.title}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[#0B1F3A] px-2.5 py-1 rounded-lg border border-slate-800 text-xs font-bold text-white">
              <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 animate-pulse" />
              <span>11 Streak</span>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
        {/* Task Header Banner */}
        <section className="dash-card navy-card rounded-2xl p-6 relative overflow-hidden border border-[#3B82F6]/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-[#3B82F6] tracking-widest uppercase font-mono">
                  CHALLENGE DAY {dayId} / 60
                </span>
                <span className="text-[11px] text-slate-400 font-mono">• {MOCK_DAY_12_TASK.track}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {MOCK_DAY_12_TASK.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Est. {MOCK_DAY_12_TASK.estimatedTime}
                </span>
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-[#3B82F6]" />
                  {MOCK_DAY_12_TASK.difficulty}
                </span>
                <span className="flex items-center gap-1 text-emerald-400 font-mono">
                  +100 XP & Streak Increment
                </span>
              </div>
            </div>

            {/* Quick Template Copy & Open Button */}
            <div className="w-full md:w-auto">
              <button
                onClick={handleCopyRepo}
                title="Click to copy & open https://github.com/Chhayakanta-Maharana/ABTalks/"
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-[#3B82F6]/50 hover:bg-slate-850 flex items-center justify-center gap-2 transition-all group"
              >
                <Code2 className="w-4 h-4 text-[#3B82F6]" />
                <span>{copiedRepo ? "Copied & Opening..." : "Starter Template Repo"}</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
              </button>
            </div>
          </div>
        </section>

        {/* Task Brief & Requirements Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Brief, Guidelines, Resources */}
          <div className="lg:col-span-7 space-y-6">
            <section className="dash-card navy-card rounded-2xl p-6 space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <BookOpen className="w-4 h-4 text-[#3B82F6]" />
                Overview & Objective
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {MOCK_DAY_12_TASK.description}
              </p>

              {/* Requirements Checklist */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                  DELIVERABLE CHECKLIST
                </h3>
                <div className="space-y-2">
                  {MOCK_DAY_12_TASK.requirements.map((req, idx) => {
                    const checked = completedReqs.includes(idx);
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleReq(idx)}
                        className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-3 ${
                          checked
                            ? "bg-[#0B1F3A]/60 border-[#3B82F6]/40 text-slate-200"
                            : "bg-[#07111F]/40 border-slate-800 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border shrink-0 ${
                            checked
                              ? "bg-[#3B82F6] border-[#3B82F6] text-white"
                              : "border-slate-700 bg-slate-900"
                          }`}
                        >
                          {checked && <CheckCircle2 className="w-3 h-3" />}
                        </div>
                        <span className={checked ? "line-through opacity-80" : ""}>{req}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reference Resources */}
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                  RECOMMENDED RESOURCES
                </h3>
                <div className="space-y-1.5">
                  {MOCK_DAY_12_TASK.resources.map((res, idx) => (
                    <a
                      key={idx}
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white flex items-center justify-between transition-all"
                    >
                      <span>{res.title}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    </a>
                  ))}
                </div>
              </div>
            </section>

            {/* Thoughtful Feature: Late-Night AI Coding Assistant Hint */}
            <section className="dash-card navy-card rounded-2xl p-5 border border-indigo-500/20 bg-[linear-gradient(135deg,rgba(15,23,42,0.8),rgba(11,31,58,0.4))] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold text-indigo-200">
                    Late-Night Code Debugging Assistant
                  </span>
                </div>
                <button
                  onClick={() => setShowAiAssistant(!showAiAssistant)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  {showAiAssistant ? "Hide Assistant" : "Ask Assistant →"}
                </button>
              </div>

              {showAiAssistant ? (
                <div className="space-y-3 pt-2 text-xs border-t border-slate-800">
                  <div className="bg-indigo-950/40 p-3 rounded-xl border border-indigo-900/50 space-y-1 text-indigo-200">
                    <p className="font-bold">💡 Tip for Mobile-First Grid Layouts:</p>
                    <p className="text-indigo-300/80 leading-relaxed">
                      Always style your default CSS baseline for 390px screens (`grid-cols-1`), then use `sm:grid-cols-2` and `md:grid-cols-12` progressive layout overrides.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Stuck late at night? Ask a question..."
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                    <button className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs">
                      Ask
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400">
                  Building after college late at night? Get instant layout debugging tips or submission sanity checks.
                </p>
              )}
            </section>
          </div>

          {/* Right Column: Interactive Proof of Work Submission Form */}
          <div className="lg:col-span-5 space-y-6">
            <section className="dash-card navy-card rounded-2xl p-6 space-y-5 border border-[#3B82F6]/30 relative overflow-hidden">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-[#3B82F6]" />
                    Submit Proof of Work
                  </h2>
                  <span className="text-[10px] font-bold text-orange-400 bg-orange-950/40 px-2 py-0.5 rounded border border-orange-900/50 flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-current" /> +1 Day Streak
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Submit your GitHub commit & LinkedIn post link to lock in your daily streak.
                </p>
              </div>

              {submitted ? (
                <div className="bg-emerald-950/30 border border-emerald-500/40 p-5 rounded-xl space-y-4 text-center animate-fade-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white">Day 12 Submission Locked!</h3>
                    <p className="text-xs text-emerald-300/80">
                      Your streak increased to <span className="font-bold text-white">12 Days</span> 🔥. Great work building today!
                    </p>
                  </div>
                  <div className="pt-2">
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:scale-105 transition-all"
                    >
                      Return to Dashboard →
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* GitHub URL Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <GithubIcon className="w-3.5 h-3.5 text-white" />
                      GitHub Repository / Commit URL <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="url"
                      required
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/Chhayakanta-Maharana/ABTalks"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111F] border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#3B82F6] transition-colors"
                    />
                  </div>

                  {/* LinkedIn Post URL Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <LinkedinIcon className="w-3.5 h-3.5 text-blue-400" />
                      LinkedIn Post URL <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="url"
                      required
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/posts/chhayakanta-maharana_abtalks-day12..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111F] border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#3B82F6] transition-colors"
                    />
                  </div>

                  {/* Optional Live Demo URL */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                        Live Deployment Demo URL
                      </span>
                      <span className="text-[10px] text-slate-500 font-normal">Optional</span>
                    </label>
                    <input
                      type="url"
                      value={demoUrl}
                      onChange={(e) => setDemoUrl(e.target.value)}
                      placeholder="https://abtalks.vercel.app"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#07111F] border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#3B82F6] transition-colors"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 rounded-xl bg-[linear-gradient(135deg,#2563EB,#1D4ED8)] text-white text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(37,99,235,0.4)] hover:shadow-[0_0_35px_rgba(59,130,246,0.6)] active:scale-95 disabled:opacity-50 transition-all"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Verifying Commit & Post...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Proof & Lock Day 12</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </section>

            {/* Peer Submissions Preview */}
            <section className="dash-card navy-card rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-[#3B82F6]" />
                Recent Peer Submissions (Day 12)
              </h3>

              <div className="space-y-2.5">
                {MOCK_ACTIVITY_FEED.slice(0, 2).map((peer) => (
                  <div
                    key={peer.id}
                    className="p-3 rounded-xl bg-[#07111F]/70 border border-slate-800 flex items-center gap-3"
                  >
                    <img
                      src={peer.avatar}
                      alt={peer.studentName}
                      className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0"
                    />
                    <div className="flex-1 min-w-0 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white truncate">{peer.studentName}</span>
                        <span className="text-[10px] text-slate-500">{peer.timeAgo}</span>
                      </div>
                      <p className="text-[11px] font-mono text-slate-400 truncate">{peer.commitMessage}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
