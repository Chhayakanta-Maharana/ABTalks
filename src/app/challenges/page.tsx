"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import {
  Flame,
  Zap,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Shield,
  Target,
  Clock,
  Briefcase,
  Layers,
  BookOpen,
} from "lucide-react";
import AtmosphericBackground from "@/components/AtmosphericBackground";

const challengesData = [
  {
    id: "exams",
    num: "01",
    title: "College Exams & Assignment Overload",
    category: "TIME MANAGEMENT",
    problem:
      "Mid-terms, lab submissions, and semester exams pile up. You arrive back at your hostel or room at 10 PM exhausted, with no energy to code from scratch.",
    solution: "1-Hour Micro-Building Strategy & Modular Scoping",
    actionPlan: [
      "Use pre-scoped starter templates provided in ABTalks daily tasks.",
      "Timebox your daily build to 45–60 minutes strictly — focus on 1 core functional component rather than full app overhauls.",
      "Activate a Streak Freeze 24 hours in advance if an exam falls directly on a submission deadline.",
    ],
    proTip: "A 30-line clean, working commit on exam night preserves your 30-day streak and proves discipline.",
  },
  {
    id: "imposter",
    num: "02",
    title: "Imposter Syndrome & Tutorial Hell",
    category: "CONFIDENCE",
    problem:
      "Looking at other students' complex full-stack projects makes you feel left behind. You freeze up and go back to watching 10-hour YouTube tutorials passively.",
    solution: "Building in Public & Daily Proof Feedback Loop",
    actionPlan: [
      "Stop watching tutorials passively. Copy code, break it, fix the error logs, and understand why it broke.",
      "Post your raw, unfiltered progress on LinkedIn. Celebrate small wins like building a single modal or fixing a grid bug.",
      "Engage with cohort peers in the ABTalks activity feed — 90% of students face the exact same syntax struggles.",
    ],
    proTip: "Recruiters value candidates who document their real debugging journey over polished tutorial copypastes.",
  },
  {
    id: "burnout",
    num: "03",
    title: "Mid-Challenge Fatigue (Day 25–35 Slump)",
    category: "CONSISTENCY",
    problem:
      "The initial excitement wears off around Week 4. Motivation drops, code quality suffers, and the temptation to quit becomes overwhelming.",
    solution: "Cohort Accountability & Phase 2 Momentum Shift",
    actionPlan: [
      "Switch tracks or pair program with a cohort classmate for a 3-day sprint.",
      "Break your 60 days into 15-day micro-milestones (Phase 01: Consistency, Phase 02: Core Architecture, Phase 03: Production Shipping).",
      "Review your Day 01 commit vs your Day 30 commit to see your tangible engineering growth.",
    ],
    proTip: "Consistency beats talent when talent doesn't build daily.",
  },
  {
    id: "ghosting",
    num: "04",
    title: "Recruiters Ghosting Standard Resumes",
    category: "CAREER OPPORTUNITY",
    problem:
      "Applying to 100+ job openings on LinkedIn/Indeed with a standard text resume results in zero responses or automated rejection emails.",
    solution: "60-Day Public Evidence Log & Inbound Recruiter Attraction",
    actionPlan: [
      "Your ABTalks profile links directly to 60 verified GitHub commits and 60 public LinkedIn posts.",
      "Include your ABTalks Public Proof Link at the very top of your resume and GitHub profile README.",
      "Tag engineering managers and founders in your Day 45 and Day 60 milestone posts to generate inbound DMs.",
    ],
    proTip: "Founders hire proof of work, not PDF claims.",
  },
];

export default function ChallengesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<string>("exams");

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ch-card",
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

  return (
    <div ref={containerRef} className="min-h-screen bg-[#030712] text-[#F8FAFC] pb-24 font-sans selection:bg-[#3B82F6]/30">
      <AtmosphericBackground />

      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-[#07111F]/80 backdrop-blur-xl border-b border-[rgba(148,163,184,0.12)] px-4 py-3 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-[#2563EB]/20 border border-[#3B82F6]/30 text-[#3B82F6] font-mono text-xs font-bold uppercase tracking-wider">
              OBSTACLE & SOLUTION PLAYBOOK
            </span>
          </div>

          <Link
            href="/guidelines"
            className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1"
          >
            <span>Guidelines</span>
            <ChevronRight className="w-4 h-4 text-[#3B82F6]" />
          </Link>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 pt-10 space-y-10">
        {/* Title Banner */}
        <section className="ch-card text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full navy-glass border border-[#3B82F6]/30 text-[#3B82F6] text-xs font-bold uppercase tracking-widest">
            <Target className="w-4 h-4" />
            CHALLENGES & OVERCOME STRATEGY
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            How to Overcome Every Obstacle in 60 Days
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Building every day after college is hard. Here is your battle-tested playbook for handling exams, burnout, imposter syndrome, and recruiter ghosting.
          </p>
        </section>

        {/* Interactive Challenge Cards */}
        <section className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {challengesData.map((item) => {
              const isExpanded = selectedChallenge === item.id;

              return (
                <div
                  key={item.id}
                  className={`ch-card navy-card p-6 rounded-2xl border transition-all duration-300 space-y-4 cursor-pointer ${
                    isExpanded
                      ? "border-[#3B82F6]/50 bg-[linear-gradient(135deg,rgba(11,31,58,0.8),rgba(7,17,31,0.95))] shadow-[0_0_35px_rgba(37,99,235,0.2)] scale-[1.01]"
                      : "border-slate-800 hover:border-slate-700 bg-slate-900/40"
                  }`}
                  onClick={() => setSelectedChallenge(item.id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#3B82F6] bg-[#3B82F6]/10 px-2.5 py-1 rounded-lg border border-[#3B82F6]/20">
                      CHALLENGE {item.num}
                    </span>
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-900/50 uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.problem}
                    </p>
                  </div>

                  {/* Solution Box */}
                  <div className="p-4 rounded-xl bg-[#0B1F3A]/60 border border-[#3B82F6]/30 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#3B82F6]">
                      <Lightbulb className="w-4 h-4 text-[#3B82F6]" />
                      <span>THE OVERCOME SOLUTION:</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{item.solution}</h4>

                    <div className="space-y-1.5 pt-2">
                      {item.actionPlan.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-800 text-[11px] text-amber-300/90 font-mono italic">
                      💡 Pro-Tip: {item.proTip}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA Footer Card */}
        <section className="ch-card navy-card rounded-2xl p-6 sm:p-8 border border-[#3B82F6]/30 bg-[linear-gradient(135deg,#0B1F3A,#07111F)] text-center space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Turn Your Challenges into Your Public Portfolio
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Every challenge you overcome in 60 days becomes tangible evidence of your engineering discipline.
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[linear-gradient(135deg,#2563EB,#1D4ED8)] text-white text-xs font-bold tracking-wider uppercase shadow-[0_0_25px_rgba(37,99,235,0.4)] hover:scale-105 transition-all"
            >
              <span>Sign In to Access Dashboard</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
