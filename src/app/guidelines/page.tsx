"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import {
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  Flame,
  Clock,
  AlertTriangle,
  Zap,
  ArrowLeft,
  Sparkles,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import AtmosphericBackground from "@/components/AtmosphericBackground";

const GithubIcon = ({ className = "w-5 h-5 text-[#3B82F6]" }: { className?: string }) => (
  <svg className={className} width={20} height={20} style={{ width: 20, height: 20 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ className = "w-5 h-5 text-[#3B82F6]" }: { className?: string }) => (
  <svg className={className} width={20} height={20} style={{ width: 20, height: 20 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const rulesList = [
  {
    num: "01",
    title: "Daily Commit Rule",
    badge: "NON-NEGOTIABLE",
    icon: GithubIcon,
    desc: "You must commit working code to your public GitHub repository every single day before 11:59 PM IST. Empty commits or README tweaks do not count.",
    keyPoints: [
      "Must contain functional code additions or refactors",
      "Public repository visible to recruiters & cohort mentors",
      "Automated timestamp verification via ABTalks engine",
    ],
  },
  {
    num: "02",
    title: "Public Accountability (LinkedIn Post)",
    badge: "RECRUITER VISIBILITY",
    icon: LinkedinIcon,
    desc: "Tag ABTalks and post your daily progress on LinkedIn with what you built, what failed, and what you learned. This builds your proof of work in public.",
    keyPoints: [
      "Share screenshot or GIF of your daily build",
      "Include repository link & tag #ABTalks #60DaysOfCode",
      "Attract inbound internship & job opportunities",
    ],
  },
  {
    num: "03",
    title: "11:59 PM IST Cutoff & Streak Engine",
    badge: "STRICT DEADLINE",
    icon: Clock,
    desc: "The daily deadline is strict. Submissions close at 11:59 PM IST. Missed days reset your public streak count to zero unless a Streak Freeze is active.",
    keyPoints: [
      "Automated streak increment upon verified submission",
      "1 Streak Freeze available per 30-day phase for emergencies",
      "Cohort leaderboard ranks based on streak consistency",
    ],
  },
  {
    num: "04",
    title: "No Tutorial Hell — Ship Real Products",
    badge: "BUILDER MINDSET",
    icon: Zap,
    desc: "Stop watching 20-hour video tutorials passively. You must write code from scratch or modify starter templates to solve real engineering problems.",
    keyPoints: [
      "Scope daily tasks to 1-2 hours of focused execution",
      "Use official docs and AI debugging assistance",
      "Focus on shipping working UI & backend APIs daily",
    ],
  },
];

export default function GuidelinesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [checkedRules, setCheckedRules] = useState<number[]>([0, 1]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".rule-card",
        { opacity: 0, y: 35, scale: 0.96 },
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

  const toggleCheck = (idx: number) => {
    if (checkedRules.includes(idx)) {
      setCheckedRules(checkedRules.filter((i) => i !== idx));
    } else {
      setCheckedRules([...checkedRules, idx]);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#030712] text-[#F8FAFC] pb-24 font-sans selection:bg-[#3B82F6]/30">
      <AtmosphericBackground />

      {/* Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#07111F]/95 backdrop-blur-xl border-b border-slate-800/80 shadow-[0_10px_30px_rgba(0,0,0,0.8)] px-3 py-2.5 sm:px-8 sm:py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-white transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4 text-[#3B82F6]" />
            <span className="hidden xs:inline">Back to Home</span>
            <span className="xs:hidden">Home</span>
          </Link>

          <div className="flex items-center gap-2 min-w-0">
            <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded bg-[#2563EB]/20 border border-[#3B82F6]/30 text-[#3B82F6] font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider truncate">
              CODE OF CONDUCT
            </span>
          </div>

          <Link
            href="/challenges"
            className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1 shrink-0"
          >
            <span className="hidden sm:inline">Challenges Guide</span>
            <span className="sm:hidden">Challenges</span>
            <ChevronRight className="w-4 h-4 text-[#3B82F6]" />
          </Link>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 pt-20 sm:pt-24 space-y-10">
        {/* Title Banner */}
        <section className="rule-card text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full navy-glass border border-[#3B82F6]/30 text-[#3B82F6] text-xs font-bold uppercase tracking-widest">
            <BookOpen className="w-4 h-4" />
            CHALLENGE GUIDELINES & PROTOCOL
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            The Rules of the 60-Day Challenge
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            ABTalks is designed for Indian college students who want to break out of tutorial hell.
            These guidelines ensure your proof of work is bulletproof and respected by recruiters.
          </p>
        </section>

        {/* Rules Grid */}
        <section className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rulesList.map((rule, idx) => {
              const Icon = rule.icon;
              const isChecked = checkedRules.includes(idx);

              return (
                <div
                  key={rule.num}
                  className={`rule-card navy-card p-6 rounded-2xl border transition-all duration-300 relative space-y-4 ${
                    isChecked
                      ? "border-[#3B82F6]/40 shadow-[0_0_30px_rgba(37,99,235,0.15)] bg-[linear-gradient(135deg,rgba(11,31,58,0.7),rgba(7,17,31,0.9))]"
                      : "border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-black text-[#3B82F6] bg-[#3B82F6]/10 px-2.5 py-1 rounded-lg border border-[#3B82F6]/20">
                        RULE {rule.num}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 uppercase tracking-wider">
                        {rule.badge}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleCheck(idx)}
                      title="Mark as understood"
                      className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                        isChecked
                          ? "bg-[#3B82F6] border-[#3B82F6] text-white"
                          : "border-slate-700 bg-slate-900 text-slate-600 hover:border-slate-500"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Icon className="w-5 h-5 text-[#3B82F6]" />
                      {rule.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {rule.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                    {rule.keyPoints.map((point, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2 text-xs text-slate-400">
                        <span className="text-[#3B82F6] font-bold">✓</span>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Interactive Sanity Check Checklist */}
        <section className="rule-card navy-card rounded-2xl p-6 sm:p-8 border border-[#3B82F6]/30 bg-[linear-gradient(135deg,#0B1F3A,#07111F)] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Daily Submission Sanity Checklist
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Before hitting submit at 11:59 PM IST, run this quick check to prevent streak resets.
              </p>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
              {checkedRules.length} / {rulesList.length} Rules Accepted
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-[#07111F] border border-slate-800 text-xs text-slate-300 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Did you push your commits to the default `main` or `master` branch?</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#07111F] border border-slate-800 text-xs text-slate-300 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Is your GitHub repository set to <strong>Public</strong> visibility?</span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#07111F] border border-slate-800 text-xs text-slate-300 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Does your LinkedIn post link lead directly to your post (not profile main page)?</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
            <span className="text-xs text-slate-400">Ready to start your 60-day engineering transformation?</span>
            <Link
              href="/login"
              className="px-6 py-3 rounded-xl bg-[linear-gradient(135deg,#2563EB,#1D4ED8)] text-white text-xs font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:scale-105 transition-all"
            >
              Sign In / Register to Begin →
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
