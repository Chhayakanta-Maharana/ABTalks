"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import {
  Flame,
  Trophy,
  CheckCircle2,
  Lock,
  ArrowRight,
  Calendar,
  AlertTriangle,
  Award,
  Sparkles,
  Zap,
  ChevronRight,
  Clock,
  ArrowLeft,
  Edit3,
  X,
  Save,
  Heart,
} from "lucide-react";
import {
  INITIAL_STUDENT_PROFILE,
  MOCK_ACHIEVEMENTS,
  MOCK_DAY_12_TASK,
  MOCK_ACTIVITY_FEED,
  StudentProfile,
} from "@/data/mockData";
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

export default function StudentDashboard() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Edge Case Simulator State
  const [simulationMode, setSimulationMode] = useState<"standard" | "day0" | "missed" | "empty">("standard");

  // Editable Profile State (Username locked per requirement)
  const [customProfile, setCustomProfile] = useState({
    name: INITIAL_STUDENT_PROFILE.name,
    track: INITIAL_STUDENT_PROFILE.track,
    avatar: INITIAL_STUDENT_PROFILE.avatar,
    githubHandle: INITIAL_STUDENT_PROFILE.githubHandle,
    linkedinHandle: INITIAL_STUDENT_PROFILE.linkedinHandle,
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tempProfile, setTempProfile] = useState({ ...customProfile });

  // Reactions state for activity feed
  const [reactions, setReactions] = useState<{ [key: string]: number }>({
    "act-1": 14,
    "act-2": 28,
    "act-3": 19,
  });

  // Selected Day Tile State
  const [selectedDayNum, setSelectedDayNum] = useState<number>(12);

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

  // Dynamic Profile calculation
  const profile: StudentProfile = {
    ...INITIAL_STUDENT_PROFILE,
    name: customProfile.name,
    track: customProfile.track,
    avatar: customProfile.avatar,
    githubHandle: simulationMode === "empty" ? "" : customProfile.githubHandle,
    linkedinHandle: simulationMode === "empty" ? "" : customProfile.linkedinHandle,
    currentStreak:
      simulationMode === "day0" ? 0 : simulationMode === "missed" ? 0 : INITIAL_STUDENT_PROFILE.currentStreak,
    completedDays:
      simulationMode === "day0" ? 0 : simulationMode === "missed" ? 10 : INITIAL_STUDENT_PROFILE.completedDays,
    standingRank:
      simulationMode === "day0"
        ? "New Contender"
        : simulationMode === "empty"
        ? "Setup Pending"
        : INITIAL_STUDENT_PROFILE.standingRank,
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomProfile({ ...tempProfile });
    setIsEditModalOpen(false);
  };

  const handleReactionClick = (id: string) => {
    setReactions((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#030712] text-[#F8FAFC] pb-24 font-sans selection:bg-[#3B82F6]/30">
      <AtmosphericBackground />

      {/* Top Mobile-First Header Nav */}
      <header className="sticky top-0 z-40 bg-[#07111F]/80 backdrop-blur-xl border-b border-[rgba(148,163,184,0.12)] px-4 py-3 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Landing</span>
            </Link>
            <div className="h-4 w-[1px] bg-slate-800" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[linear-gradient(135deg,#2563EB,#0B1F3A)] p-[1px]">
                <div className="w-full h-full bg-[#030712] rounded-[6px] flex items-center justify-center font-black text-[10px] text-[#3B82F6]">
                  AB
                </div>
              </div>
              <span className="text-xs font-black tracking-widest text-white uppercase">STUDENT DASHBOARD</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/day/12"
              className="px-3.5 py-1.5 rounded-lg bg-[linear-gradient(135deg,#2563EB,#1D4ED8)] text-white text-xs font-bold tracking-wider uppercase flex items-center gap-1 shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:scale-105 transition-all"
            >
              <span>DAY 12 TASK</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
        {/* Real-World Edge Case Simulator Panel */}
        <section className="dash-card navy-card rounded-2xl p-4 sm:p-5 border border-[#3B82F6]/20 bg-[linear-gradient(135deg,rgba(11,31,58,0.4),rgba(7,17,31,0.9))]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#3B82F6]" />
              <span className="text-xs font-bold tracking-wider text-slate-300 uppercase">
                EDGE CASE SIMULATOR (TRY DEMO SCENARIOS)
              </span>
            </div>
            <span className="text-[11px] text-slate-400">Select state to test UI resilience</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => setSimulationMode("standard")}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all text-center ${
                simulationMode === "standard"
                  ? "bg-[#2563EB] text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                  : "bg-[#07111F] text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              🔥 Active Student (Day 12)
            </button>
            <button
              onClick={() => setSimulationMode("day0")}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all text-center ${
                simulationMode === "day0"
                  ? "bg-[#2563EB] text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                  : "bg-[#07111F] text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              🌱 Day 0 (No Streak)
            </button>
            <button
              onClick={() => setSimulationMode("missed")}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all text-center ${
                simulationMode === "missed"
                  ? "bg-[#EF4444] text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                  : "bg-[#07111F] text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              ⚠️ Missed Day Alert
            </button>
            <button
              onClick={() => setSimulationMode("empty")}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all text-center ${
                simulationMode === "empty"
                  ? "bg-[#2563EB] text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                  : "bg-[#07111F] text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              👤 Empty Profile Config
            </button>
          </div>
        </section>

        {/* Missed Day Alert Notification (Edge Case) */}
        {simulationMode === "missed" && (
          <div className="rounded-2xl p-4 bg-red-950/40 border border-red-500/30 flex items-start gap-3.5 shadow-lg animate-pulse">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-red-200">Streak at Risk! You missed yesterday&apos;s build.</h4>
              <p className="text-xs text-red-300/80 leading-relaxed">
                Submit today&apos;s build before 11:59 PM IST to activate your Streak Freeze and maintain your cohort standing.
              </p>
            </div>
          </div>
        )}

        {/* Student Profile Overview Header with Editable Details */}
        <section className="dash-card navy-card rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-[#3B82F6]"
              />
              <button
                onClick={() => {
                  setTempProfile({ ...customProfile });
                  setIsEditModalOpen(true);
                }}
                className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-semibold"
              >
                Edit
              </button>
              <span className="absolute -bottom-1 -right-1 bg-[#3B82F6] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-slate-900">
                Lvl 12
              </span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-black text-white">{profile.name}</h1>
                <span className="text-xs text-[#3B82F6] font-mono bg-[#3B82F6]/10 px-2 py-0.5 rounded-full border border-[#3B82F6]/20">
                  {profile.username}
                </span>

                {/* Edit Profile Trigger Button */}
                <button
                  onClick={() => {
                    setTempProfile({ ...customProfile });
                    setIsEditModalOpen(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-[#3B82F6]/40 text-[11px] font-semibold text-slate-300 hover:text-white flex items-center gap-1 transition-all"
                >
                  <Edit3 className="w-3 h-3 text-[#3B82F6]" />
                  <span>Edit Profile</span>
                </button>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-1">{profile.track}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                <span className="flex items-center gap-1 text-slate-300">
                  <GithubIcon className="w-3.5 h-3.5" />
                  {profile.githubHandle ? `@${profile.githubHandle}` : "Not Linked"}
                </span>
                <span className="flex items-center gap-1 text-slate-300">
                  <LinkedinIcon className="w-3.5 h-3.5 text-blue-400" />
                  {profile.linkedinHandle || "Not Linked"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Standing & Streak Stats */}
          <div className="flex items-center gap-3 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-slate-800">
            <div className="flex-1 md:flex-none navy-card px-4 py-3 rounded-xl border border-slate-800 text-center sm:text-left">
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">CURRENT STREAK</span>
              <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-0.5">
                <Flame className="w-5 h-5 text-orange-500 fill-orange-500 animate-pulse" />
                <span className="text-xl font-black text-white">{profile.currentStreak} Days</span>
              </div>
            </div>

            <div className="flex-1 md:flex-none navy-card px-4 py-3 rounded-xl border border-slate-800 text-center sm:text-left">
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">COHORT STANDING</span>
              <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-0.5">
                <Award className="w-5 h-5 text-[#3B82F6]" />
                <span className="text-sm font-black text-white">{profile.standingRank}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Primary Action Card: Today's Task (Day 12) */}
        <section className="dash-card relative rounded-2xl p-6 bg-[linear-gradient(135deg,#0B1F3A,#07111F)] border border-[#3B82F6]/30 shadow-[0_0_35px_rgba(37,99,235,0.15)] overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-[#2563EB]/10 blur-2xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-[#2563EB]/20 border border-[#3B82F6]/30 text-[#3B82F6] text-[11px] font-bold tracking-wider uppercase">
                  TODAY&apos;S CHALLENGE — DAY 12
                </span>
                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Clock className="w-3 h-3 text-slate-400" />
                  Due in 7h 24m
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {MOCK_DAY_12_TASK.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {MOCK_DAY_12_TASK.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                <span>⏱️ {MOCK_DAY_12_TASK.estimatedTime}</span>
                <span>🎯 {MOCK_DAY_12_TASK.difficulty}</span>
                <span>📋 {MOCK_DAY_12_TASK.requirements.length} Core Requirements</span>
              </div>
            </div>

            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
              <Link
                href="/day/12"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[linear-gradient(135deg,#2563EB,#1D4ED8)] text-white text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(37,99,235,0.4)] hover:shadow-[0_0_35px_rgba(59,130,246,0.6)] hover:scale-[1.02] transition-all"
              >
                <span>OPEN DAY 12 WORKSPACE</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 60-Day Progress Grid & Completion Breakdown */}
        <section className="dash-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#3B82F6]" />
                60-Day Challenge Progress Roadmap
              </h3>
              <p className="text-xs text-slate-400">
                {profile.completedDays} of 60 Days Completed ({Math.round((profile.completedDays / 60) * 100)}%)
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-[#3B82F6] font-bold">
                PHASE 01: BUILD CONSISTENCY
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
            <div
              className="h-full bg-[linear-gradient(90deg,#2563EB,#3B82F6)] rounded-full transition-all duration-500"
              style={{ width: `${(profile.completedDays / 60) * 100}%` }}
            />
          </div>

          {/* 60 Tile Responsive Grid */}
          <div className="navy-card rounded-2xl p-4 sm:p-5">
            <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 gap-2">
              {Array.from({ length: 60 }).map((_, index) => {
                const dayNum = index + 1;
                const isCompleted = dayNum <= profile.completedDays;
                const isCurrent = dayNum === 12;
                const isSelected = selectedDayNum === dayNum;

                return (
                  <button
                    key={dayNum}
                    onClick={() => setSelectedDayNum(dayNum)}
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all relative ${
                      isCurrent
                        ? "bg-[#2563EB] text-white border-2 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.6)] animate-pulse"
                        : isCompleted
                        ? "bg-[#0B1F3A]/80 text-[#3B82F6] border border-[#3B82F6]/30 hover:bg-[#3B82F6]/20"
                        : "bg-[#07111F]/50 text-slate-600 border border-slate-800/80"
                    } ${isSelected ? "ring-2 ring-white scale-105" : ""}`}
                  >
                    <span>{dayNum}</span>
                    {isCompleted ? (
                      <CheckCircle2 className="w-3 h-3 text-[#3B82F6] mt-0.5" />
                    ) : isCurrent ? (
                      <Flame className="w-3 h-3 text-orange-400 mt-0.5 fill-orange-400" />
                    ) : (
                      <Lock className="w-2.5 h-2.5 text-slate-700 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Preview Selected Day Banner */}
            {selectedDayNum && (
              <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-300">
                  Selected Tile: <span className="font-bold text-white">Day {selectedDayNum}</span> —{" "}
                  {selectedDayNum <= profile.completedDays
                    ? "Completed Proof Submitted"
                    : selectedDayNum === 12
                    ? "Active Build Task Today"
                    : "Locked Build"}
                </span>
                <Link
                  href={`/day/${selectedDayNum}`}
                  className="text-[#3B82F6] hover:text-white font-bold flex items-center gap-1"
                >
                  <span>Open Day {selectedDayNum} →</span>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Achievements & Badges Grid */}
        <section className="dash-card space-y-4 pt-2">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            Achievements & Badges
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {MOCK_ACHIEVEMENTS.map((ach) => (
              <div
                key={ach.id}
                className={`navy-card p-4 rounded-xl flex items-start gap-3 border transition-all ${
                  ach.unlockedAt
                    ? "border-[#3B82F6]/30 bg-[linear-gradient(135deg,rgba(11,31,58,0.5),rgba(7,17,31,0.8))]"
                    : "border-slate-800/60 opacity-60 grayscale"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-xl shrink-0 border border-slate-800">
                  {ach.icon}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white">{ach.title}</h4>
                    {ach.unlockedAt && (
                      <span className="text-[9px] font-mono font-bold text-[#3B82F6] bg-[#3B82F6]/10 px-1.5 py-0.5 rounded">
                        {ach.unlockedAt}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">{ach.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Community Proof Activity Feed */}
        <section className="dash-card space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#3B82F6]" />
              Live Public Proof Submissions (Day 12 Cohort)
            </h3>
            <span className="text-xs text-slate-400">142 Submitted Today</span>
          </div>

          <div className="space-y-3">
            {MOCK_ACTIVITY_FEED.map((item) => (
              <div
                key={item.id}
                className="navy-card p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-slate-800/80 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.avatar}
                    alt={item.studentName}
                    className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{item.studentName}</span>
                      <span className="text-[10px] font-mono text-[#3B82F6] bg-[#3B82F6]/10 px-1.5 py-0.5 rounded">
                        Day {item.dayNumber}
                      </span>
                      <span className="text-[10px] text-slate-500">{item.timeAgo}</span>
                    </div>
                    <p className="text-xs font-mono text-slate-300 mt-0.5">{item.commitMessage}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <button
                    onClick={() => handleReactionClick(item.id)}
                    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 bg-rose-950/30 px-2.5 py-1 rounded-lg border border-rose-900/40 transition-transform active:scale-90"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span>{reactions[item.id] || 0}</span>
                  </button>
                  <a
                    href={item.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    Commit
                  </a>
                  <a
                    href={item.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-blue-950/40 px-2.5 py-1 rounded-lg border border-blue-900/50"
                  >
                    <LinkedinIcon className="w-3.5 h-3.5" />
                    Post
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Interactive Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="navy-card w-full max-w-lg rounded-2xl p-6 border border-[#3B82F6]/30 shadow-2xl relative space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#3B82F6]" />
                <h3 className="text-base font-bold text-white">Edit Student Profile Details</h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Full Name</label>
                <input
                  type="text"
                  required
                  value={tempProfile.name}
                  onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#07111F] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
                />
              </div>

              {/* Locked Username */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 flex items-center justify-between">
                  <span>Username (Unique ID)</span>
                  <span className="text-[10px] text-amber-400 font-mono">🔒 Locked Handle</span>
                </label>
                <input
                  type="text"
                  disabled
                  value={INITIAL_STUDENT_PROFILE.username}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-500 cursor-not-allowed"
                />
              </div>

              {/* Track */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Engineering Track</label>
                <input
                  type="text"
                  required
                  value={tempProfile.track}
                  onChange={(e) => setTempProfile({ ...tempProfile, track: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#07111F] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
                />
              </div>

              {/* Avatar URL */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Avatar Image URL</label>
                <input
                  type="url"
                  required
                  value={tempProfile.avatar}
                  onChange={(e) => setTempProfile({ ...tempProfile, avatar: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#07111F] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
                />
              </div>

              {/* GitHub Handle */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">GitHub Username</label>
                <input
                  type="text"
                  value={tempProfile.githubHandle}
                  onChange={(e) => setTempProfile({ ...tempProfile, githubHandle: e.target.value })}
                  placeholder="Chhayakanta-Maharana"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#07111F] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
                />
              </div>

              {/* LinkedIn Handle */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">LinkedIn Handle</label>
                <input
                  type="text"
                  value={tempProfile.linkedinHandle}
                  onChange={(e) => setTempProfile({ ...tempProfile, linkedinHandle: e.target.value })}
                  placeholder="in/chhayakanta-maharana"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#07111F] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center gap-1.5 shadow-lg"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
