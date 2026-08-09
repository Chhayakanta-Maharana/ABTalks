"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
  Lock,
  ArrowRight,
} from "lucide-react";
import { MOCK_DAY_12_TASK, MOCK_ACTIVITY_FEED } from "@/data/mockData";
import AtmosphericBackground from "@/components/AtmosphericBackground";
import Logo from "@/components/Logo";
import { getApiBaseUrl } from "@/lib/config";

const getTaskForDay = (numStr: string) => {
  const dayNum = parseInt(numStr, 10) || 1;
  if (dayNum === 1) {
    return {
      dayNumber: 1,
      title: "Build & Deploy Personal Developer Portfolio",
      track: "Fullstack Web & AI Systems",
      difficulty: "Beginner" as const,
      estimatedTime: "2 hours",
      description:
        "Kick off your 60-day challenge by constructing a modern, responsive personal developer portfolio showcasing your technical stack, bio, GitHub repositories, and live project cards.",
      techStack: [
        "Next.js 15 App Router",
        "TypeScript 5",
        "Tailwind CSS v4",
        "Lucide React Icons",
        "Vercel Deployment",
      ],
      requirements: [
        "Set up Next.js App Router repository with Tailwind CSS styling",
        "Deploy live site to Vercel/Netlify with custom domain",
        "Push initial clean commit to public GitHub repository",
        "Share Day 1 proof post on LinkedIn with #ABTalks hashtag",
      ],
      starterRepoUrl: "https://github.com/Chhayakanta-Maharana/ABTalks/",
      resources: [
        { title: "Next.js 15 App Router Documentation", url: "https://nextjs.org/docs" },
        { title: "Tailwind CSS v4 Quickstart & Tokens", url: "https://tailwindcss.com/docs" },
        { title: "TypeScript Handbook & Language Reference", url: "https://www.typescriptlang.org/docs/" },
        { title: "Vercel Deployment & Custom Domain Guide", url: "https://vercel.com/docs" },
      ],
      isSubmitted: false,
    };
  } else if (dayNum === 2) {
    return {
      dayNumber: 2,
      title: "Design System & CSS Component Tokens",
      track: "Fullstack Web & AI Systems",
      difficulty: "Beginner" as const,
      estimatedTime: "2 hours",
      description:
        "Build a reusable UI design system with dark mode color tokens, glassmorphism cards, custom typography, and accessible button components.",
      techStack: [
        "React 19",
        "Tailwind CSS Tokens",
        "CSS Variables",
        "WAI-ARIA Accessibility",
        "TypeScript Interfaces",
      ],
      requirements: [
        "Define CSS color variables for primary, secondary, and surface accents",
        "Create reusable Card, Button, and Badge React components",
        "Implement responsive layout container wrapper with padding breakpoints",
        "Publish design system storybook or documentation page",
      ],
      starterRepoUrl: "https://github.com/Chhayakanta-Maharana/ABTalks/",
      resources: [
        { title: "W3C Accessible Rich Internet Applications (WAI-ARIA)", url: "https://www.w3.org/WAI/ARIA/apg/" },
        { title: "Design System Architecture Best Practices", url: "https://micro-frontends.org/" },
        { title: "React 19 Component Reference", url: "https://react.dev/reference/react" },
        { title: "CSS Custom Properties & Color Systems", url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Storage" },
      ],
      isSubmitted: false,
    };
  } else if (dayNum === 12) {
    return {
      ...MOCK_DAY_12_TASK,
      techStack: [
        "Next.js 15",
        "Golang Gin API",
        "Neon PostgreSQL",
        "Prisma ORM",
        "JWT Security",
      ],
    };
  } else {
    return {
      dayNumber: dayNum,
      title: `Day ${dayNum} Engineering Challenge`,
      track: "Fullstack Web & AI Systems",
      difficulty: dayNum > 30 ? ("Advanced" as const) : ("Intermediate" as const),
      estimatedTime: "2 hours",
      description: `Complete the Day ${dayNum} hands-on build task. Implement core features, write clean modular code, push commits to GitHub, and share your proof of work.`,
      techStack: [
        "Next.js 15 App Router",
        "TypeScript 5",
        "Tailwind CSS v4",
        "Golang REST API",
        "PostgreSQL",
      ],
      requirements: [
        `Implement main functional features for Day ${dayNum} challenge`,
        "Ensure full responsive layout scaling across mobile and desktop viewports",
        "Commit clean code to public GitHub repository with descriptive commit message",
        `Post public proof update on LinkedIn highlighting Day ${dayNum} build learnings`,
      ],
      starterRepoUrl: "https://github.com/Chhayakanta-Maharana/ABTalks/",
      resources: [
        { title: "ABTalks Challenge Guidelines & Standards", url: "/guidelines" },
        { title: "Next.js App Router Documentation", url: "https://nextjs.org/docs" },
        { title: "GitHub Commit Best Practices", url: "https://git-scm.com/doc" },
        { title: "MDN Web Docs & JavaScript Reference", url: "https://developer.mozilla.org" },
      ],
      isSubmitted: false,
    };
  }
};

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
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const rawId = params?.id;
  const dayId = typeof rawId === "string" ? rawId : Array.isArray(rawId) ? rawId[0] : "1";
  const requestedDayNum = parseInt(dayId, 10) || 1;
  const currentTask = getTaskForDay(dayId);

  const [unlockedDay, setUnlockedDay] = useState<number>(1);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [msUntilNext, setMsUntilNext] = useState<number>(86400000);

  // Authentication & 24-Hour Day Lock Protection Check
  useEffect(() => {
    if (typeof window === "undefined") return;

    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!loggedIn) {
      router.push("/login");
      return;
    }

    let startDateStr = localStorage.getItem("challengeStartDate");
    if (!startDateStr) {
      startDateStr = new Date().toISOString();
      localStorage.setItem("challengeStartDate", startDateStr);
    }

    const checkLock = () => {
      const startMs = new Date(startDateStr!).getTime();
      const nowMs = Date.now();
      const elapsedMs = Math.max(0, nowMs - startMs);
      const DAY_MS = 24 * 60 * 60 * 1000;

      const currentCalendarDay = Math.min(Math.max(Math.floor(elapsedMs / DAY_MS) + 1, 1), 60);
      const msElapsedToday = elapsedMs % DAY_MS;
      const msRemaining = DAY_MS - msElapsedToday;

      setUnlockedDay(currentCalendarDay);
      setMsUntilNext(msRemaining);

      // Future days beyond current 24-hour calendar day are strictly locked
      if (requestedDayNum > currentCalendarDay) {
        setIsLocked(true);
      } else {
        setIsLocked(false);
      }
    };

    checkLock();
    const interval = setInterval(checkLock, 1000);
    return () => clearInterval(interval);
  }, [router, requestedDayNum]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubUrl || !linkedinUrl) return;

    setIsSubmitting(true);
    try {
      const API_BASE = getApiBaseUrl();
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_BASE}/submissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          dayNumber: Number(dayId),
          githubCommitUrl: githubUrl,
          linkedinPostUrl: linkedinUrl,
          demoUrl: demoUrl || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save submission");
      }

      setSubmitted(true);
    } catch (err: any) {
      alert(err.message || "Failed to submit proof. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimeRemaining = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const hours = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hours.toString().padStart(2, "0")}h ${mins
      .toString()
      .padStart(2, "0")}m ${secs.toString().padStart(2, "0")}s`;
  };

  const handleCopyRepo = () => {
    const repoUrl = "https://github.com/Chhayakanta-Maharana/ABTalks/";
    navigator.clipboard.writeText(repoUrl);
    setCopiedRepo(true);
    setTimeout(() => setCopiedRepo(false), 2000);
    window.open(repoUrl, "_blank");
  };

  if (isLocked) {
    return (
      <div className="min-h-screen bg-[#030712] text-[#F8FAFC] flex flex-col justify-between relative overflow-hidden font-sans">
        <AtmosphericBackground />

        {/* Top Header */}
        <header className="relative z-20 px-6 py-6 max-w-7xl mx-auto w-full flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#07111F]/80 border border-slate-800 text-xs font-semibold text-[#94A3B8] hover:text-white transition-all backdrop-blur-xl group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Dashboard</span>
          </Link>

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center bg-[#030712]">
              <Logo size={32} className="w-full h-full" />
            </div>
            <span className="text-xs font-black tracking-[0.3em] text-[#F8FAFC] uppercase">
              ABTALKS
            </span>
          </Link>
        </header>

        {/* Locked Guard Card with Live 24-Hour Countdown */}
        <main className="relative z-10 max-w-md mx-auto w-full px-4 py-12 flex flex-col items-center justify-center text-center">
          <div className="w-full navy-card p-8 rounded-2xl border border-slate-800 space-y-6 shadow-2xl backdrop-blur-xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[11px] font-bold uppercase tracking-wider">
                🔒 Future Challenge Locked
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white">
                Day {requestedDayNum} is Locked
              </h1>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                {requestedDayNum === unlockedDay + 1 ? (
                  <>
                    You are currently on <strong className="text-white font-bold">Day {unlockedDay}</strong>. Day {requestedDayNum} will unlock automatically in <strong className="text-amber-300 font-bold">{formatTimeRemaining(msUntilNext)}</strong> when tomorrow&apos;s 24-hour cycle begins!
                  </>
                ) : (
                  <>
                    Day {requestedDayNum} is a future milestone. Challenges unlock sequentially <strong className="text-white font-bold">1 day at a time every 24 hours</strong>. Tomorrow, Day {unlockedDay + 1} will unlock first!
                  </>
                )}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#07111F]/80 border border-slate-800 text-xs text-amber-300 flex items-center justify-center gap-2 font-mono shadow-inner">
              <Clock className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: "6s" }} />
              <span>
                {requestedDayNum === unlockedDay + 1
                  ? `Day ${requestedDayNum} Unlocks In: ${formatTimeRemaining(msUntilNext)}`
                  : `Day ${unlockedDay + 1} (Tomorrow) Unlocks In: ${formatTimeRemaining(msUntilNext)}`}
              </span>
            </div>

            <div className="pt-2 space-y-3">
              <Link
                href={`/day/${unlockedDay}`}
                className="w-full py-3.5 rounded-xl bg-[linear-gradient(135deg,#2563EB,#1D4ED8)] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(37,99,235,0.4)] hover:shadow-[0_0_35px_rgba(59,130,246,0.6)] hover:scale-[1.02] transition-all"
              >
                <span>Go to Day {unlockedDay} Challenge (Active Today)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/dashboard"
                className="block text-xs font-semibold text-slate-400 hover:text-white transition-colors py-1"
              >
                Return to Student Dashboard
              </Link>
            </div>
          </div>
        </main>

        <footer className="relative z-20 py-4 text-center text-xs text-[#64748B]">
          &copy; {new Date().getFullYear()} ABTalks Engine. Built for ambitious developers.
        </footer>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-[#030712] text-[#F8FAFC] pb-24 font-sans selection:bg-[#3B82F6]/30">
      <AtmosphericBackground />
      {/* Top Fixed Nav Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#07111F]/95 backdrop-blur-xl border-b border-slate-800/80 shadow-[0_10px_30px_rgba(0,0,0,0.8)] px-3 py-2.5 sm:px-8 sm:py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-7 h-7 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center bg-[#030712] shadow-sm">
                <Logo size={26} className="w-full h-full" />
              </div>
              <span className="text-xs font-black tracking-widest text-white uppercase hidden md:inline">
                ABTALKS
              </span>
            </Link>
            <div className="h-4 w-[1px] bg-slate-800" />
            <div className="flex items-center gap-2 shrink-0">
              <span className="px-2 py-0.5 rounded bg-[#2563EB]/20 border border-[#3B82F6]/30 text-[#3B82F6] font-mono text-[11px] sm:text-xs font-bold">
                DAY {dayId}
              </span>
              <span className="text-xs font-bold text-white truncate hidden md:inline max-w-xs">
                {currentTask.title}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              href="/dashboard"
              className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] sm:text-xs font-bold text-[#94A3B8] hover:text-white hover:border-[#3B82F6]/40 transition-all flex items-center gap-1"
            >
              <span>DASHBOARD</span>
            </Link>
            <div className="flex items-center gap-1 bg-[#0B1F3A] px-2 py-1 sm:px-2.5 rounded-lg border border-slate-800 text-[10px] sm:text-xs font-bold text-white">
              <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 animate-pulse" />
              <span className="hidden sm:inline">Streak Active</span>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 pt-20 sm:pt-24 space-y-6">
        {/* Task Header Banner */}
        <section className="dash-card navy-card rounded-2xl p-6 relative overflow-hidden border border-[#3B82F6]/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-[#3B82F6] tracking-widest uppercase font-mono">
                  CHALLENGE DAY {dayId} / 60
                </span>
                <span className="text-[11px] text-slate-400 font-mono">• {currentTask.track}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {currentTask.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Est. {currentTask.estimatedTime}
                </span>
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-[#3B82F6]" />
                  {currentTask.difficulty}
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
            <section className="dash-card navy-card rounded-2xl p-6 space-y-5">
              <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <BookOpen className="w-4 h-4 text-[#3B82F6]" />
                Overview & Problem Statement
              </h2>

              {/* High-level Problem Statement & Scope */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  PROJECT SCOPE & OBJECTIVE
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#030712]/60 p-3.5 rounded-xl border border-slate-800/80">
                  {currentTask.description}
                </p>
              </div>

              {/* Tech Stack Specification */}
              <div className="space-y-2 pt-1">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#3B82F6]" />
                  TECH STACK SPECIFICATION & TOOLS REQUIRED
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentTask.techStack?.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/25 text-[#3B82F6] text-xs font-mono font-semibold"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Requirements Checklist */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                  REQUIRED FEATURES & DELIVERABLE CHECKLIST
                </h3>
                <div className="space-y-2">
                  {currentTask.requirements.map((req, idx) => {
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
                  DOCUMENTATION & TECH STACK REFERENCES
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentTask.resources.map((res, idx) => (
                    <a
                      key={idx}
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-[#3B82F6]/40 text-xs text-slate-300 hover:text-white flex items-center justify-between transition-all group"
                    >
                      <span className="truncate pr-2 font-medium">{res.title}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#3B82F6] shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
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
                    <h3 className="text-base font-bold text-white">Day {dayId} Submission Locked!</h3>
                    <p className="text-xs text-emerald-300/80">
                      Your streak increased to <span className="font-bold text-white">Day {dayId}</span> 🔥. Great work building today!
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
                      placeholder={`https://linkedin.com/posts/chhayakanta-maharana_abtalks-day${dayId}...`}
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
                          <span>Submit Proof & Lock Day {dayId}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
