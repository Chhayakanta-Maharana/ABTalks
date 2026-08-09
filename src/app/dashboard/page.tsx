"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  ShieldCheck,
  Target,
  BarChart3,
  TrendingUp,
  Mail,
  Check,
  LogOut,
  Upload,
  Camera,
  Plus,
  Download,
} from "lucide-react";
import {
  INITIAL_STUDENT_PROFILE,
  MOCK_ACHIEVEMENTS,
  MOCK_DAY_12_TASK,
  MOCK_ACTIVITY_FEED,
  StudentProfile,
} from "@/data/mockData";
import AtmosphericBackground from "@/components/AtmosphericBackground";
import Logo from "@/components/Logo";
import { getApiBaseUrl } from "@/lib/config";

const GithubIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} width={16} height={16} style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} width={16} height={16} style={{ width: 16, height: 16 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// 60-Day Pillar Mock Data for Vertical Bar Heights & Completion Percentages
const MOCK_PILLAR_DATA = Array.from({ length: 60 }).map((_, i) => {
  const day = i + 1;
  if (day < 12) {
    // Days 1-11 Completed
    const heights = [80, 95, 75, 90, 85, 100, 90, 80, 95, 100, 90];
    return { day, fill: heights[i % heights.length], status: "completed" };
  } else if (day === 12) {
    return { day, fill: 60, status: "active" };
  } else {
    return { day, fill: 0, status: "locked" };
  }
});

// Helper function to auto-generate username dynamically from student full name
const generateUsernameFromName = (name: string): string => {
  if (!name || !name.trim()) return "@student";
  const clean = name.toLowerCase().trim().replace(/[^a-z0-9\s]/g, "");
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "@student";
  return `@${parts[0]}`;
};

export default function StudentDashboard() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Authentication Protection Check
  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      if (!loggedIn) {
        router.push("/login");
      }
    }
  }, [router]);

  // Edge Case Simulator State
  const [simulationMode, setSimulationMode] = useState<"standard" | "day0" | "missed" | "empty">("standard");

  // Editable Profile State
  const [customProfile, setCustomProfile] = useState({
    name: INITIAL_STUDENT_PROFILE.name,
    email: "student@abtalks.app",
    track: INITIAL_STUDENT_PROFILE.track,
    avatar: INITIAL_STUDENT_PROFILE.avatar,
    githubHandle: INITIAL_STUDENT_PROFILE.githubHandle,
    linkedinHandle: INITIAL_STUDENT_PROFILE.linkedinHandle,
    thought: "Building 60 AI & Web systems in 60 days. Staying consistent every single day! 🚀",
    techStack: ["Next.js 15", "TypeScript", "Golang", "Neon PostgreSQL", "Tailwind CSS v4"],
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tempProfile, setTempProfile] = useState({ ...customProfile });
  const [newTechTag, setNewTechTag] = useState("");

  // Native Computer Image File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          const newAvatar = reader.result as string;
          setCustomProfile((prev) => ({ ...prev, avatar: newAvatar }));
          setTempProfile((prev) => ({ ...prev, avatar: newAvatar }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Activity Feed Reactions State
  const [reactions, setReactions] = useState<{ [key: string]: number }>({
    "act-1": 18,
    "act-2": 32,
    "act-3": 24,
  });

  // Selected Day Tile State (Default set to Day 1)
  const [selectedDayNum, setSelectedDayNum] = useState<number>(1);

  // Selected Graph Day Dot State & Hover Tooltip State & Graph Phase State (1 = Days 1-30, 2 = Days 31-60)
  const [selectedGraphDay, setSelectedGraphDay] = useState<number>(1);
  const [hoveredGraphDay, setHoveredGraphDay] = useState<number | null>(null);
  const [graphPhase, setGraphPhase] = useState<1 | 2>(1);

  // Active Pillar Phase State (1 = Days 1-30, 2 = Days 31-60)
  const [activePillarPhase, setActivePillarPhase] = useState<1 | 2>(1);

  // Client-side HTML5 Canvas High-Res Achievement Badge Certificate Downloader
  const downloadAchievementBadge = (badgeTitle: string, icon: string, dayTag: string) => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 500;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background Gradient
    const grad = ctx.createLinearGradient(0, 0, 800, 500);
    grad.addColorStop(0, "#07111F");
    grad.addColorStop(0.5, "#0F172A");
    grad.addColorStop(1, "#030712");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 500);

    // Border Frame
    ctx.strokeStyle = "#3B82F6";
    ctx.lineWidth = 6;
    ctx.strokeRect(20, 20, 760, 460);

    // Gold Inner Accent
    ctx.strokeStyle = "#F59E0B";
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, 740, 440);

    // Brand Header
    ctx.fillStyle = "#3B82F6";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("ABTALKS — 60 DAYS 60 BUILDS CHALLENGE", 400, 75);

    // Certificate Title
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 30px sans-serif";
    ctx.fillText("CERTIFICATE OF ACHIEVEMENT", 400, 125);

    // Icon Circle Background
    ctx.fillStyle = "#1E293B";
    ctx.beginPath();
    ctx.arc(400, 210, 48, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#F59E0B";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Emoji Icon
    ctx.font = "46px sans-serif";
    ctx.fillText(icon, 400, 226);

    // Badge Name
    ctx.fillStyle = "#F59E0B";
    ctx.font = "bold 28px sans-serif";
    ctx.fillText(badgeTitle, 400, 300);

    // Student Awardee Name
    ctx.fillStyle = "#94A3B8";
    ctx.font = "15px sans-serif";
    ctx.fillText("Awarded to Student:", 400, 340);

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText(customProfile.name, 400, 372);

    // Verification Footer
    ctx.fillStyle = "#10B981";
    ctx.font = "bold 14px monospace";
    ctx.fillText(`VERIFIED ON-CHAIN PROOF • UNLOCKED ${dayTag.toUpperCase()}`, 400, 420);

    // Trigger Download
    const link = document.createElement("a");
    link.download = `ABTalks_Achievement_${badgeTitle.replace(/\s+/g, "_")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // GSAP Entrance Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".dash-card",
        { opacity: 0, y: 30, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Fetch Database User Profile and Activity Feed
  const [dbUserStats, setDbUserStats] = useState<{
    completedDays?: number;
    currentStreak?: number;
    standingRank?: string;
  }>({});

  useEffect(() => {
    const fetchUserData = async () => {
      // 1. Try loading cached userProfile from localStorage first
      if (typeof window !== "undefined") {
        const cachedUser = localStorage.getItem("userProfile");
        if (cachedUser) {
          try {
            const parsed = JSON.parse(cachedUser);
            if (parsed) {
              setCustomProfile((prev) => ({
                ...prev,
                name: parsed.name || prev.name,
                email: parsed.email || prev.email,
                track: parsed.track || prev.track,
                avatar: parsed.avatar || prev.avatar,
                githubHandle: parsed.githubHandle || prev.githubHandle,
                linkedinHandle: parsed.linkedinHandle || prev.linkedinHandle,
                thought: parsed.thought || prev.thought,
                techStack: Array.isArray(parsed.techStack)
                  ? parsed.techStack
                  : typeof parsed.techStack === "string"
                  ? JSON.parse(parsed.techStack)
                  : prev.techStack,
              }));
            }
          } catch {}
        }
      }

      // 2. Fetch remote user profile from backend API
      try {
        const API_BASE = getApiBaseUrl();
        const token = localStorage.getItem("authToken");
        const res = await fetch(`${API_BASE}/user/profile`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!res.ok) {
          return;
        }

        const data = await res.json();
        if (data.user) {
          let parsedStack = ["Next.js", "TypeScript", "Golang", "Neon PostgreSQL"];
          try {
            if (typeof data.user.techStack === "string") {
              parsedStack = JSON.parse(data.user.techStack);
            } else if (Array.isArray(data.user.techStack)) {
              parsedStack = data.user.techStack;
            }
          } catch {}

          const loadedProfile = {
            name: data.user.name || INITIAL_STUDENT_PROFILE.name,
            email: data.user.email || "student@abtalks.app",
            track: data.user.track || INITIAL_STUDENT_PROFILE.track,
            avatar: data.user.avatar || INITIAL_STUDENT_PROFILE.avatar,
            githubHandle: data.user.githubHandle || "",
            linkedinHandle: data.user.linkedinHandle || "",
            thought: data.user.thought || "Building 60 AI & Web systems in 60 days. Staying consistent every single day! 🚀",
            techStack: parsedStack,
          };

          setCustomProfile(loadedProfile);
          setTempProfile(loadedProfile);
          setDbUserStats({
            completedDays: data.user.completedDays,
            currentStreak: data.user.currentStreak,
            standingRank: data.user.standingRank,
          });

          if (typeof window !== "undefined") {
            localStorage.setItem("userProfile", JSON.stringify(loadedProfile));
          }
        }
      } catch (err) {
        console.warn("Backend server (http://localhost:8080) is offline. Dashboard operating in local mode.");
      }
    };

    fetchUserData();
  }, []);

  // Dynamic Profile Data based on simulation mode & custom profile
  const profile: StudentProfile = {
    ...INITIAL_STUDENT_PROFILE,
    name: customProfile.name,
    username: generateUsernameFromName(customProfile.name),
    track: customProfile.track,
    avatar: customProfile.avatar,
    githubHandle: simulationMode === "empty" ? "" : customProfile.githubHandle,
    linkedinHandle: simulationMode === "empty" ? "" : customProfile.linkedinHandle,
    currentStreak:
      simulationMode === "day0"
        ? 0
        : simulationMode === "missed"
        ? 0
        : dbUserStats.currentStreak ?? INITIAL_STUDENT_PROFILE.currentStreak,
    completedDays:
      simulationMode === "day0"
        ? 0
        : simulationMode === "missed"
        ? 10
        : dbUserStats.completedDays ?? INITIAL_STUDENT_PROFILE.completedDays,
    standingRank:
      simulationMode === "day0"
        ? "New Contender"
        : simulationMode === "empty"
        ? "Setup Pending"
        : dbUserStats.standingRank ?? INITIAL_STUDENT_PROFILE.standingRank,
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setCustomProfile({ ...tempProfile });
    if (typeof window !== "undefined") {
      localStorage.setItem("userProfile", JSON.stringify(tempProfile));
    }
    setIsEditModalOpen(false);

    try {
      const API_BASE = getApiBaseUrl();
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_BASE}/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(tempProfile),
      });
      if (!res.ok) {
        console.warn("Backend returned non-OK status when updating profile:", res.status);
      }
    } catch (err) {
      console.warn("Backend server offline. Saved profile to local browser storage.");
    }
  };

  const handleReactionClick = (id: string) => {
    setReactions((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  // 24-Hour Calendar Cycle & Countdown State
  const [calendarInfo, setCalendarInfo] = useState<{ day: number; msUntilNext: number }>({
    day: 1,
    msUntilNext: 86400000,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    let startDateStr = localStorage.getItem("challengeStartDate");
    if (!startDateStr) {
      startDateStr = new Date().toISOString();
      localStorage.setItem("challengeStartDate", startDateStr);
    }

    const updateCalendar = () => {
      const startMs = new Date(startDateStr!).getTime();
      const nowMs = Date.now();
      const elapsedMs = Math.max(0, nowMs - startMs);
      const DAY_MS = 24 * 60 * 60 * 1000;

      const currentDay = Math.min(Math.max(Math.floor(elapsedMs / DAY_MS) + 1, 1), 60);
      const msElapsedToday = elapsedMs % DAY_MS;
      const msUntilNext = DAY_MS - msElapsedToday;

      setCalendarInfo({ day: currentDay, msUntilNext });
    };

    updateCalendar();
    const interval = setInterval(updateCalendar, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeDayNumber = calendarInfo.day;

  const formatCountdown = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const hours = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hours.toString().padStart(2, "0")}h ${mins
      .toString()
      .padStart(2, "0")}m ${secs.toString().padStart(2, "0")}s`;
  };

  // Task Details Lookup
  const getDayTaskInfo = (dayNum: number) => {
    if (dayNum === 1) {
      return {
        title: "Build & Deploy Personal Developer Portfolio",
        requirements: [
          "Set up Next.js App Router repository with Tailwind CSS styling",
          "Deploy live site to Vercel/Netlify with custom domain",
          "Push initial clean commit to public GitHub repository",
          "Share Day 1 proof post on LinkedIn with #ABTalks hashtag",
        ],
      };
    } else if (dayNum === 2) {
      return {
        title: "Design System & CSS Component Tokens",
        requirements: [
          "Define CSS color variables for primary, secondary, and surface accents",
          "Create reusable Card, Button, and Badge React components",
          "Implement responsive layout container wrapper with padding breakpoints",
          "Publish design system storybook or documentation page",
        ],
      };
    } else if (dayNum === 3) {
      return {
        title: "Responsive Navigation & Mobile Drawer System",
        requirements: [
          "Construct sticky top navigation header with blur backdrop effect",
          "Implement accessible mobile slide-over navigation drawer",
          "Add smooth page transition links and active route highlight indicators",
        ],
      };
    } else if (dayNum === 12) {
      return {
        title: MOCK_DAY_12_TASK.title,
        requirements: MOCK_DAY_12_TASK.requirements,
      };
    } else {
      return {
        title: `Day ${dayNum}: Build Challenge System`,
        requirements: [
          `Implement main functional features for Day ${dayNum} engineering challenge`,
          "Ensure full responsive layout scaling across mobile and desktop viewports",
          "Commit clean code to public GitHub repository with descriptive commit message",
          `Post public proof update on LinkedIn highlighting Day ${dayNum} build learnings`,
        ],
      };
    }
  };

  // Date-Based Unified Status Generator for Any Day Number
  const getDayStatus = (d: number) => {
    const isSubmitted = d <= profile.completedDays;
    const isToday = d === activeDayNumber;
    const isPast = d < activeDayNumber;
    const taskInfo = getDayTaskInfo(d);

    if (isSubmitted) {
      return {
        status: "completed",
        pct: 100,
        label: "100% Verified Completed",
        badgeText: "Completed & Verified",
        badgeColor: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
        pillarColor: "bg-[linear-gradient(180deg,#10B981,#059669)]",
        gridBg: "bg-emerald-500 text-slate-950 border border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.4)]",
        dotColor: "#2563EB",
        name: taskInfo.title,
        requirements: taskInfo.requirements,
      };
    } else if (isToday) {
      return {
        status: "in_progress",
        pct: 0,
        label: "In Progress Today",
        badgeText: "Active Build Today",
        badgeColor: "text-[#3B82F6] bg-[#3B82F6]/20 border-[#3B82F6]/30",
        pillarColor: "bg-[linear-gradient(180deg,#34D399,#10B981)] animate-pulse",
        gridBg: "bg-[#2563EB] text-white border-2 border-[#60A5FA] shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-pulse font-black scale-105",
        dotColor: "#3B82F6",
        name: taskInfo.title,
        requirements: taskInfo.requirements,
      };
    } else if (isPast) {
      return {
        status: "missed",
        pct: 0,
        label: "0% Missed Submission",
        badgeText: "Missed Submission",
        badgeColor: "text-rose-400 bg-rose-500/15 border-rose-500/30",
        pillarColor: "bg-rose-950/40 border border-rose-500/40",
        gridBg: "bg-rose-950/60 text-rose-400 border border-rose-500/50 hover:bg-rose-900/60",
        dotColor: "#F43F5E",
        name: taskInfo.title,
        requirements: taskInfo.requirements,
      };
    } else {
      return {
        status: "locked",
        pct: 0,
        label: "0% Locked (Upcoming)",
        badgeText: "Locked Build",
        badgeColor: "text-slate-500 bg-slate-800 border-slate-700",
        pillarColor: "bg-transparent",
        gridBg: "bg-[#07111F] text-slate-700 border border-slate-800/80 hover:border-slate-700",
        dotColor: "#030712",
        name: taskInfo.title,
        requirements: taskInfo.requirements,
      };
    }
  };

  const currentTodayTask = getDayTaskInfo(activeDayNumber);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#030712] text-[#F8FAFC] pb-24 font-sans selection:bg-[#3B82F6]/30">
      <AtmosphericBackground />

      {/* Top Fixed Header Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#07111F]/95 backdrop-blur-xl border-b border-slate-800/80 shadow-[0_10px_30px_rgba(0,0,0,0.8)] px-3 py-2.5 sm:px-8 sm:py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-7 h-7 rounded-lg overflow-hidden border border-slate-800 shadow-md group-hover:border-[#3B82F6]/50 transition-all flex items-center justify-center bg-[#030712]">
              <Logo size={26} className="w-full h-full" />
            </div>
            <span className="text-[11px] sm:text-xs font-black tracking-widest text-white uppercase hidden xs:inline">ABTALKS</span>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <Link
              href={`/day/${activeDayNumber}`}
              className="px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded-lg bg-[linear-gradient(135deg,#2563EB,#1D4ED8)] text-white text-[10px] sm:text-xs font-bold tracking-wider uppercase flex items-center gap-1 shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:scale-105 transition-all"
            >
              <span>DAY {activeDayNumber} TASK</span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </Link>

            <Link
              href="/"
              title="Logout"
              className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-400 hover:text-white hover:bg-red-900/60 text-[10px] sm:text-xs font-bold tracking-wider uppercase flex items-center gap-1 transition-all shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">LOGOUT</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 pt-20 sm:pt-24 space-y-6">

        {/* Missed Day Alert Notification */}
        {activeDayNumber > 1 && profile.completedDays < activeDayNumber - 1 && (
          <div className="rounded-2xl p-4 bg-red-950/40 border border-red-500/30 flex items-start gap-3.5 shadow-lg animate-pulse">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-red-200">Streak Alert! Missed submissions detected for past days.</h4>
              <p className="text-xs text-red-300/80 leading-relaxed">
                Submit today&apos;s Day {activeDayNumber} build before 11:59 PM IST to keep your active streak going.
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* WIREFRAME ROW 1: TOP PROFILE & 60-DAY SPLITS (2 CARDS) */}
        {/* ========================================================================= */}
        <section className="dash-card grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Row 1 Left Card: Student Profile Card */}
          <div className="lg:col-span-5 navy-card p-5 sm:p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
            {/* Native Computer Image File Picker Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            <div className="flex items-center gap-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative group shrink-0 cursor-pointer"
                title="Click to upload profile photo from computer"
              >
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#3B82F6] hover:brightness-110 transition-all shadow-md"
                />
                <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[9px] font-bold">
                  <Camera className="w-4 h-4 mb-0.5" />
                  <span>Upload</span>
                </div>
                <span className="absolute -bottom-1 -right-1 bg-[#3B82F6] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-slate-900">
                  Lvl {activeDayNumber}
                </span>
              </div>

              <div className="space-y-1">
                <h2 className="text-lg font-black text-white leading-snug">{profile.name}</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#3B82F6] font-mono bg-[#3B82F6]/10 px-2 py-0.5 rounded-full border border-[#3B82F6]/20">
                    {profile.username}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{profile.track}</p>
              </div>
            </div>

            {/* Tech Stack Badges Section */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3 h-3 text-[#3B82F6]" />
                TECH STACK
              </span>
              <div className="flex flex-wrap gap-1.5">
                {customProfile.techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-md bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20 shadow-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end">
              <button
                onClick={() => {
                  setTempProfile({ ...customProfile });
                  setIsEditModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-[#3B82F6]/40 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-all"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#3B82F6]" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>

          {/* Row 1 Right Card: 60-Day Splits Card (30 | 30) + Contact Handles */}
          <div className="lg:col-span-7 navy-card p-5 sm:p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
            {/* Split 30 | 30 Container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* First 30 Split Box (Days 1 - 30) */}
              <div className="bg-[#030712]/90 p-4 rounded-xl border border-slate-800/80 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">PHASE 1 (DAYS 1-30)</span>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <Flame className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                  </div>
                </div>

                {/* GitHub Contribution Graph Style 30 Blocks Grid (10x3) */}
                <div className="grid grid-cols-10 gap-1.5 pt-1">
                  {Array.from({ length: 30 }).map((_, idx) => {
                    const dayNum = idx + 1;
                    const status = getDayStatus(dayNum);

                    return (
                      <div
                        key={dayNum}
                        title={`Day ${dayNum}: ${status.label}`}
                        className={`aspect-square rounded-md flex items-center justify-center text-[9px] font-bold font-mono transition-all cursor-pointer ${status.gridBg}`}
                      >
                        {status.status === "completed" ? "✓" : dayNum}
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-end pt-1">
                  <span className="text-xs text-emerald-400 font-bold font-mono">{profile.completedDays}/30 Built</span>
                </div>
              </div>

              {/* Second 30 Split Box (Days 31 - 60) */}
              <div className="bg-[#030712]/90 p-4 rounded-xl border border-slate-800/80 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">PHASE 2 (DAYS 31-60)</span>
                  <Lock className="w-3.5 h-3.5 text-slate-600" />
                </div>

                {/* GitHub Contribution Graph Style 30 Blocks Grid (10x3) */}
                <div className="grid grid-cols-10 gap-1.5 pt-1">
                  {Array.from({ length: 30 }).map((_, idx) => {
                    const dayNum = idx + 31;
                    const status = getDayStatus(dayNum);
                    return (
                      <div
                        key={dayNum}
                        title={`Day ${dayNum}: ${status.label}`}
                        className={`aspect-square rounded-md flex items-center justify-center text-[9px] font-mono cursor-not-allowed opacity-60 ${status.gridBg}`}
                      >
                        {dayNum}
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-end pt-1">
                  <span className="text-xs text-slate-500 font-bold font-mono">0/30 Locked</span>
                </div>
              </div>
            </div>

            {/* Social Handles */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-800/80 pt-3">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-[#3B82F6]" />
                <span className="font-mono text-xs text-[#3B82F6] font-semibold">{customProfile.email}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <GithubIcon className="w-3.5 h-3.5 text-[#3B82F6]" />
                <span>{profile.githubHandle ? `@${profile.githubHandle}` : "Not Linked"}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <LinkedinIcon className="w-3.5 h-3.5 text-blue-400" />
                <span>{profile.linkedinHandle || "Not Linked"}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* WIREFRAME ROW 2: TODAY TASK CARD (FULL WIDTH & COUNTDOWN STATUS) */}
        {/* ========================================================================= */}
        <section className="dash-card navy-card rounded-2xl p-6 border border-[#3B82F6]/30 shadow-[0_0_35px_rgba(37,99,235,0.15)] relative overflow-hidden">
          {getDayStatus(activeDayNumber).status === "completed" || profile.completedDays >= activeDayNumber ? (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>🎉 Today&apos;s Day {activeDayNumber} Task Completed! Great job!</span>
              </div>
              <div className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950/80 px-3 py-1 rounded-lg border border-emerald-500/30 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: "6s" }} />
                <span>Next Task Unlocks In: {formatCountdown(calendarInfo.msUntilNext)}</span>
              </div>
            </div>
          ) : null}

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left Side: Today Task Title & Bulleted Requirements */}
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-[#2563EB]/20 border border-[#3B82F6]/30 text-[#3B82F6] text-[11px] font-bold tracking-wider uppercase">
                  TODAY TASK — DAY {activeDayNumber}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Clock className="w-3 h-3 text-slate-400" />
                  Due Today
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {currentTodayTask.title}
              </h2>

              {/* Requirements Bullets as shown in wireframe */}
              <ul className="space-y-1.5 text-xs text-slate-300 pt-1">
                {currentTodayTask.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#3B82F6] font-bold mt-0.5">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Side: Status Pills & Action Button */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
              <div className="flex flex-wrap items-center gap-2">
                {getDayStatus(activeDayNumber).status === "completed" || profile.completedDays >= activeDayNumber ? (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Completed</span>
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    <span>In Progress</span>
                  </span>
                )}
                <span className="px-3 py-1 rounded-full bg-[#07111F] border border-slate-800 text-xs font-mono font-bold text-amber-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Next Day Unlocks: {formatCountdown(calendarInfo.msUntilNext)}</span>
                </span>
              </div>

              <Link
                href={`/day/${activeDayNumber}`}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[linear-gradient(135deg,#2563EB,#1D4ED8)] text-white text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(37,99,235,0.4)] hover:shadow-[0_0_35px_rgba(59,130,246,0.6)] hover:scale-[1.02] transition-all"
              >
                <span>{getDayStatus(activeDayNumber).status === "completed" || profile.completedDays >= activeDayNumber ? "REVIEW DAY 1 SUBMISSION" : `OPEN DAY ${activeDayNumber} TASK`}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* WIREFRAME ROW 3: ANALYTICS GRAPH (FULL WIDTH & PHASE TOGGLES) */}
        {/* ========================================================================= */}
        <section className="dash-card navy-card rounded-2xl p-5 sm:p-6 border border-slate-800 space-y-6">
          {/* Header with Phase View Toggles (Phase 1 vs Phase 2) */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-2.5">
              <TrendingUp className="w-5 h-5 text-[#3B82F6]" />
              <div>
                <h3 className="text-lg font-black text-white tracking-tight uppercase">COMMITMENT TREND GRAPH</h3>
                <p className="text-xs text-slate-400">Showing Phase {graphPhase} ({graphPhase === 1 ? "Days 1–30" : "Days 31–60"}) progress curve. Hover or click any day dot.</p>
              </div>
            </div>

            {/* Phase Toggle Buttons & Status Badges */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Phase Switcher Buttons */}
              <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => {
                    setGraphPhase(1);
                    if (selectedGraphDay > 30) setSelectedGraphDay(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${graphPhase === 1
                      ? "bg-[#2563EB] text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                      : "text-slate-400 hover:text-white"
                    }`}
                >
                  <div className={`w-2 h-2 rounded-full ${graphPhase === 1 ? "bg-emerald-400 animate-pulse" : "bg-slate-600"}`} />
                  <span>PHASE 1 (DAYS 1–30)</span>
                </button>

                <button
                  onClick={() => {
                    setGraphPhase(2);
                    if (selectedGraphDay <= 30) setSelectedGraphDay(31);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1.5 ${graphPhase === 2
                      ? "bg-[#2563EB] text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                      : "text-slate-400 hover:text-white"
                    }`}
                >
                  <div className={`w-2 h-2 rounded-full ${graphPhase === 2 ? "bg-emerald-400 animate-pulse" : "bg-slate-600"}`} />
                  <span>PHASE 2 (DAYS 31–60)</span>
                </button>
              </div>

              <span className="text-xs font-mono font-bold text-[#3B82F6] bg-[#3B82F6]/10 px-3 py-1.5 rounded-xl border border-[#3B82F6]/20">
                DAY {selectedGraphDay} SELECTED
              </span>
            </div>
          </div>

          {/* SVG Vector Line Chart 📈 Spanning Entire Full Width for Current Phase */}
          <div className="overflow-x-auto pb-2">
            <div className="h-60 min-w-[600px] sm:min-w-0 w-full relative pt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 900 180" fill="none">
              {/* Background Y-Axis Grid Lines & Percentage Scale Labels */}
              {[
                { label: "100%", y: 15 },
                { label: "75%", y: 52 },
                { label: "50%", y: 90 },
                { label: "25%", y: 127 },
                { label: "0%", y: 165 },
              ].map((grid) => (
                <g key={grid.label}>
                  <text x="0" y={grid.y + 4} fill="#64748B" fontSize="10" fontFamily="monospace" fontWeight="bold">
                    {grid.label}
                  </text>
                  <line x1="45" y1={grid.y} x2="900" y2={grid.y} stroke="rgba(148,163,184,0.12)" strokeDasharray="4 4" />
                </g>
              ))}

              {/* Area Gradient Fill */}
              <defs>
                <linearGradient id="chartGradPhase" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* SVG Phase Progress Path Points (30 Days per Phase) */}
              {(() => {
                const getDynamicDayScore = (d: number) => {
                  const status = getDayStatus(d);
                  return {
                    pct: status.pct,
                    name: status.name,
                    label: status.label,
                    dotColor: status.dotColor,
                  };
                };

                const startDay = graphPhase === 1 ? 1 : 31;
                const daysInPhase = Array.from({ length: 30 }, (_, i) => startDay + i);

                const getCoords = (d: number, pct: number) => {
                  const dayOffset = d - startDay;
                  const cx = 50 + (dayOffset / 29) * 835;
                  const cy = 165 - (pct / 100) * 150;
                  return { cx, cy };
                };

                const points = daysInPhase.map((d) => {
                  const scoreInfo = getDynamicDayScore(d);
                  const percent = scoreInfo.pct;
                  const title = scoreInfo.name;
                  const { cx, cy } = getCoords(d, percent);
                  return { day: d, percent, title, cx, cy };
                });

                const pathString = points.reduce((acc, pt, i) => {
                  return i === 0 ? `M ${pt.cx} ${pt.cy}` : `${acc} L ${pt.cx} ${pt.cy}`;
                }, "");

                const areaString = `${pathString} L ${points[points.length - 1].cx} 165 L ${points[0].cx} 165 Z`;

                return (
                  <>
                    {/* Gradient Area Fill */}
                    <path d={areaString} fill="url(#chartGradPhase)" />

                    {/* Smooth Line Path */}
                    <path d={pathString} stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                    {/* All 30 Days Interactive Click & Hover Dots */}
                    {points.map((pt) => {
                      const isSelected = selectedGraphDay === pt.day;
                      const isHovered = hoveredGraphDay === pt.day;

                      return (
                        <g
                          key={pt.day}
                          className="cursor-pointer"
                          onClick={() => setSelectedGraphDay(pt.day)}
                          onMouseEnter={() => setHoveredGraphDay(pt.day)}
                          onMouseLeave={() => setHoveredGraphDay(null)}
                        >
                          {/* Invisible touch target for easy interaction */}
                          <circle cx={pt.cx} cy={pt.cy} r="14" fill="transparent" />

                          {/* Outer Glow Ring on Selected / Hovered */}
                          {(isSelected || isHovered) && (
                            <circle
                              cx={pt.cx}
                              cy={pt.cy}
                              r="8"
                              fill="#3B82F6"
                              fillOpacity={isSelected ? "0.4" : "0.2"}
                              stroke="#60A5FA"
                              strokeWidth="1"
                            />
                          )}

                          {/* Solid Dot Circle */}
                          <circle
                            cx={pt.cx}
                            cy={pt.cy}
                            r={isSelected ? "6" : isHovered ? "5" : "3.5"}
                            fill={isSelected ? "#FFFFFF" : isHovered ? "#3B82F6" : pt.percent > 0 ? "#2563EB" : "#030712"}
                            stroke={isSelected ? "#FFFFFF" : pt.percent > 0 ? "#3B82F6" : "#475569"}
                            strokeWidth={isSelected ? "2.5" : "1.5"}
                          />
                        </g>
                      );
                    })}
                  </>
                );
              })()}
            </svg>

            {/* Floating Hover Tooltip Card */}
            {hoveredGraphDay !== null && (() => {
              const getDynamicDayScore = (d: number) => {
                const isCompleted = d <= profile.completedDays;
                const isCurrent = d === activeDayNumber;
                if (isCompleted) {
                  return { pct: 100, name: d === 1 ? "Build & Deploy Personal Developer Portfolio" : `Day ${d}: Build Completed` };
                } else if (isCurrent) {
                  return { pct: 0, name: d === 1 ? "Build & Deploy Personal Developer Portfolio" : `Day ${d}: Active Build Today` };
                } else {
                  return { pct: 0, name: `Day ${d}: Locked Challenge` };
                }
              };
              const info = getDynamicDayScore(hoveredGraphDay);
              const startDay = graphPhase === 1 ? 1 : 31;
              const dayOffset = hoveredGraphDay - startDay;
              const leftPos = Math.min(Math.max((dayOffset / 29) * 88 + 6, 8), 90);

              return (
                <div
                  style={{ left: `${leftPos}%` }}
                  className="absolute top-2 z-20 -translate-x-1/2 pointer-events-none bg-[#07111F]/95 backdrop-blur-md border border-[#3B82F6]/40 px-3.5 py-2 rounded-xl shadow-2xl space-y-0.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#3B82F6]">Day {hoveredGraphDay}</span>
                    <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${info.pct > 0
                        ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                        : "text-slate-400 bg-slate-800/40 border-slate-700"
                      }`}>
                      {info.pct > 0 ? `${info.pct}% Completed` : "Upcoming"}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-white leading-tight max-w-[220px] truncate">{info.name}</p>
                </div>
              );
            })()}

            {/* X Axis Days Selector Buttons for Current Phase */}
            <div className="flex justify-between text-[11px] font-mono mt-3 pl-9 pr-2 overflow-x-auto">
              {(graphPhase === 1
                ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30]
                : [31, 32, 33, 34, 35, 38, 40, 42, 45, 48, 50, 52, 55, 58, 60]
              ).map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedGraphDay(d)}
                  onMouseEnter={() => setHoveredGraphDay(d)}
                  onMouseLeave={() => setHoveredGraphDay(null)}
                  className={`font-bold transition-all px-1.5 py-0.5 rounded-md ${selectedGraphDay === d
                      ? "text-white bg-[#3B82F6] shadow-md scale-105"
                      : "text-slate-500 hover:text-slate-200 hover:bg-slate-800/50"
                    }`}
                >
                  D{d}
                </button>
              ))}
            </div>
          </div>
        </div>

          {/* Clean Selected Day Inspector Strip - ONLY Day No, Day Task & Percentage Completed */}
          {(() => {
            const getDynamicDayScore = (d: number) => {
              const isCompleted = d <= profile.completedDays;
              const isCurrent = d === activeDayNumber;
              if (isCompleted) {
                return { pct: 100, name: d === 1 ? "Build & Deploy Personal Developer Portfolio" : `Day ${d}: Build Completed` };
              } else if (isCurrent) {
                return { pct: 0, name: d === 1 ? "Build & Deploy Personal Developer Portfolio" : `Day ${d}: Active Build Today` };
              } else {
                return { pct: 0, name: `Day ${d}: Locked Challenge` };
              }
            };

            const info = getDynamicDayScore(selectedGraphDay);

            return (
              <div className="pt-4 border-t border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#030712]/50 p-4 rounded-xl border border-slate-800/80">
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1.5 rounded-lg bg-[#3B82F6]/15 border border-[#3B82F6]/30 text-[#3B82F6] text-xs font-bold font-mono shrink-0">
                    DAY {selectedGraphDay}
                  </span>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">DAY TASK</span>
                    <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                      {info.name}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">PERCENTAGE COMPLETED</span>
                    <span className={`text-sm font-black font-mono ${info.pct > 0 ? "text-emerald-400" : "text-slate-400"}`}>
                      {info.pct > 0 ? `${info.pct}% Completed` : "Upcoming Task"}
                    </span>
                  </div>

                  <Link
                    href={`/day/${selectedGraphDay}`}
                    className="px-4 py-2.5 rounded-xl bg-[linear-gradient(135deg,#2563EB,#1D4ED8)] text-white text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-md hover:scale-105 transition-all shrink-0"
                  >
                    <span>OPEN WORKSPACE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })()}
        </section>

        {/* ========================================================================= */}
        {/* WIREFRAME ROW 4: OVERALL COMPLETION (30 BARS PER PHASE + SELECTED DAY INSPECTOR) */}
        {/* ========================================================================= */}
        <section className="dash-card navy-card rounded-2xl p-5 sm:p-6 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#3B82F6]" />
                OVERALL COMPLETION PROGRESS PILLARS
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                30-day phase progress bars with percentage fill heights. Click any pillar bar to inspect day details.
              </p>
            </div>

            {/* Phase 1 & Phase 2 Toggle Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActivePillarPhase(1)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${activePillarPhase === 1
                    ? "bg-[#2563EB] text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-blue-400/30"
                    : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                  }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>PHASE 1 (DAYS 1-30)</span>
              </button>
              <button
                onClick={() => setActivePillarPhase(2)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${activePillarPhase === 2
                    ? "bg-[#2563EB] text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-blue-400/30"
                    : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                  }`}
              >
                <Lock className="w-3 h-3 text-slate-500" />
                <span>PHASE 2 (DAYS 31-60)</span>
              </button>
            </div>
          </div>

          {/* TOP PART: 30 Equal Vertical Pillar Progress Bars for Active Phase */}
          <div className="bg-[#030712]/90 p-4 rounded-xl border border-slate-800 overflow-x-auto">
            <div className="flex items-end justify-between gap-1 sm:gap-2 min-w-[540px] sm:min-w-0 h-40 pt-6 pb-2 px-1">
              {(() => {
                const dynamicPillarData = Array.from({ length: 60 }).map((_, i) => {
                  const day = i + 1;
                  const isCompleted = day <= profile.completedDays;
                  const isCurrent = day === activeDayNumber;
                  if (isCompleted) {
                    return { day, fill: 100, status: "completed" };
                  } else if (isCurrent) {
                    return { day, fill: 40, status: "active" };
                  } else {
                    return { day, fill: 0, status: "locked" };
                  }
                });

                return (activePillarPhase === 1 ? dynamicPillarData.slice(0, 30) : dynamicPillarData.slice(30, 60)).map((item) => {
                  const isSelected = selectedDayNum === item.day;
                  const isCompleted = item.status === "completed";
                  const isActive = item.status === "active";

                  return (
                    <button
                      key={item.day}
                      onClick={() => setSelectedDayNum(item.day)}
                      className="flex-1 flex flex-col items-center justify-end h-full group relative focus:outline-none min-w-0"
                    >
                      {/* Fill percentage label on hover / top */}
                      <span className="text-[8px] sm:text-[9px] font-mono text-slate-400 mb-1 font-bold truncate">
                        {isCompleted ? `${item.fill}%` : isActive ? "Active" : ""}
                      </span>

                      {/* Outer Vertical Pillar Bar */}
                      <div
                        className={`w-full max-w-[22px] rounded-t-md bg-slate-900 border overflow-hidden relative flex flex-col justify-end transition-all ${isSelected
                            ? "border-white ring-2 ring-white scale-105"
                            : isActive
                              ? "border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.6)]"
                              : isCompleted
                                ? "border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.3)] hover:border-emerald-400"
                                : "border-slate-800 opacity-40"
                          }`}
                        style={{ height: "100px" }}
                      >
                        {/* Vertical Fill Height in GitHub Emerald Green */}
                        <div
                          className={`w-full rounded-t-xs transition-all duration-500 ${isActive
                              ? "bg-[linear-gradient(180deg,#34D399,#10B981)] animate-pulse"
                              : isCompleted
                                ? "bg-[linear-gradient(180deg,#10B981,#059669)]"
                                : "bg-transparent"
                            }`}
                          style={{ height: `${item.fill}%` }}
                        />
                      </div>

                      {/* Day Number Label */}
                      <span
                        className={`text-[9px] sm:text-[10px] font-bold font-mono mt-1.5 ${isSelected
                            ? "text-white font-black"
                            : isActive
                              ? "text-emerald-400"
                              : isCompleted
                                ? "text-slate-300"
                                : "text-slate-600"
                          }`}
                      >
                        {item.day}
                      </span>
                    </button>
                  );
                });
              })()}
            </div>
          </div>

          {/* BOTTOM PART: Selected Day Inspector Card */}
          <div className="bg-[#07111F]/90 p-5 rounded-xl border border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Left Box: [ Day X ] Tile Icon */}
            <div className="md:col-span-3 flex flex-col items-center justify-center p-4 rounded-xl bg-[#030712] border border-[#3B82F6]/30 text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SELECTED INSPECTOR</span>
              <div className="text-3xl font-black text-white font-mono">Day {selectedDayNum}</div>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${selectedDayNum <= profile.completedDays
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : selectedDayNum === activeDayNumber
                      ? "bg-[#3B82F6]/20 text-[#3B82F6] border border-[#3B82F6]/30"
                      : "bg-slate-800 text-slate-500"
                  }`}
              >
                {selectedDayNum <= profile.completedDays
                  ? "Completed & Verified"
                  : selectedDayNum === activeDayNumber
                    ? "Active Build Today"
                    : "Locked Build"}
              </span>
            </div>

            {/* Right Box: Day Details Bullets List & Workspace Button */}
            <div className="md:col-span-9 flex flex-col justify-between space-y-3">
              <div>
                <h4 className="text-sm font-bold text-white">
                  Day {selectedDayNum} Task:{" "}
                  {selectedDayNum === 1
                    ? "Build & Deploy Personal Developer Portfolio"
                    : selectedDayNum === 2
                      ? "Component Library & CSS Tokens System"
                      : selectedDayNum === 12
                        ? MOCK_DAY_12_TASK.title
                        : `Build Challenge Day ${selectedDayNum}`}
                </h4>
              </div>

              {/* Details List */}
              <ul className="space-y-1 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="text-[#3B82F6] font-bold">•</span>
                  <span>Submission Status: {selectedDayNum <= profile.completedDays ? "100% Verified On-Chain" : selectedDayNum === activeDayNumber ? "In Progress Today" : "Locked"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#3B82F6] font-bold">•</span>
                  <span>GitHub Commit: {selectedDayNum <= profile.completedDays ? `feat: completed build day ${selectedDayNum}` : "Pending"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#3B82F6] font-bold">•</span>
                  <span>Time Spent: {selectedDayNum <= profile.completedDays ? "2 Hours" : "2 Hours Est."}</span>
                </li>
              </ul>

              <div className="pt-2 flex justify-end">
                <Link
                  href={`/day/${selectedDayNum}`}
                  className="px-4 py-2 rounded-xl bg-[linear-gradient(135deg,#2563EB,#1D4ED8)] text-white text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-md hover:scale-105 transition-all"
                >
                  <span>OPEN DAY {selectedDayNum} WORKSPACE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Achievements of Student Showcase */}
        {(() => {
          const dynamicAchievements = [
            {
              id: "first_commit",
              title: "First Proof",
              description: "Submitted your very first day of public proof of work.",
              icon: "🚀",
              requiredDays: 1,
              unlockedAt: profile.completedDays >= 1 ? "Day 01" : null,
              category: "consistency",
            },
            {
              id: "streak_10",
              title: "Consistency Titan",
              description: "Maintained an unbroken 10-day coding streak.",
              icon: "🔥",
              requiredDays: 10,
              unlockedAt: profile.completedDays >= 10 ? "Day 10" : null,
              category: "consistency",
            },
            {
              id: "git_master",
              title: "Git Master",
              description: "Committed clean, documented code for 10 straight builds.",
              icon: "⚡",
              requiredDays: 10,
              unlockedAt: profile.completedDays >= 10 ? "Day 10" : null,
              category: "code",
            },
            {
              id: "halfway_hero",
              title: "Halfway Hero",
              description: "Reach Day 30 without missing a single submission.",
              icon: "👑",
              requiredDays: 30,
              unlockedAt: profile.completedDays >= 30 ? "Day 30" : null,
              category: "consistency",
            },
            {
              id: "ship_it_all",
              title: "60-Day Champion",
              description: "Complete all 60 builds and finish the challenge.",
              icon: "🏆",
              requiredDays: 60,
              unlockedAt: profile.completedDays >= 60 ? "Day 60" : null,
              category: "community",
            },
          ];

          const unlockedCount = dynamicAchievements.filter((a) => a.unlockedAt !== null).length;
          const totalXP = profile.completedDays * 100;

          return (
            <section className="dash-card navy-card rounded-2xl p-5 sm:p-6 border border-slate-800 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-2.5">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  <div>
                    <h3 className="text-lg font-black text-white tracking-tight uppercase">ACHIEVEMENTS</h3>
                    <p className="text-xs text-slate-400">Unlocked milestone badges & proof accomplishments</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-[#3B82F6] bg-[#3B82F6]/10 px-3 py-1 rounded-full border border-[#3B82F6]/20">
                    {unlockedCount} of {dynamicAchievements.length} Badges Unlocked
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                    {totalXP.toLocaleString()} Total XP
                  </span>
                </div>
              </div>

              {/* Grid of Student Achievements / Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {dynamicAchievements.map((ach) => {
                  const dayTag = ach.unlockedAt || `Target Day ${ach.requiredDays}`;
                  const isUnlocked = !!ach.unlockedAt;

                  return (
                    <div
                      key={ach.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                        isUnlocked
                          ? "bg-[#07111F] border-slate-700/80 shadow-[0_0_15px_rgba(37,99,235,0.15)] hover:border-[#3B82F6]/50"
                          : "bg-[#030712]/60 border-slate-800/60 opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                            isUnlocked
                              ? "bg-[linear-gradient(135deg,rgba(37,99,235,0.2),rgba(11,31,58,0.8))] border border-[#3B82F6]/40 shadow-inner"
                              : "bg-slate-900 border border-slate-800 text-slate-600"
                          }`}
                        >
                          {ach.icon}
                        </div>

                        <div className="space-y-1 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-sm font-bold text-white leading-tight">{ach.title}</h4>
                            <span
                              className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 ${
                                isUnlocked
                                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                  : "bg-slate-800 text-slate-500"
                              }`}
                            >
                              {isUnlocked ? `Unlocked ${dayTag}` : dayTag}
                            </span>
                          </div>

                          <p className="text-xs text-slate-400 leading-relaxed">{ach.description}</p>
                        </div>
                      </div>

                      {/* Download Badge Certificate Button for Unlocked Badges */}
                      {isUnlocked && (
                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                          <span className="text-[10px] font-mono text-emerald-400 font-bold">✓ Verified Achievement</span>
                          <button
                            onClick={() => downloadAchievementBadge(ach.title, ach.icon, dayTag)}
                            className="px-3 py-1 rounded-lg bg-[#3B82F6]/15 hover:bg-[#3B82F6]/30 border border-[#3B82F6]/30 text-[#3B82F6] text-[11px] font-bold font-mono flex items-center gap-1.5 transition-all shadow-sm hover:scale-105"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download Badge</span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })()}
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

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              {/* Profile Photo Upload Field */}
              <div>
                <label className="block text-slate-400 font-bold mb-1.5">Profile Photo</label>
                <div className="flex items-center gap-3.5">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative group shrink-0 cursor-pointer"
                    title="Click to change profile photo"
                  >
                    <img
                      src={tempProfile.avatar}
                      alt="Avatar Preview"
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#3B82F6] shrink-0 bg-slate-900 shadow-md hover:brightness-110 transition-all"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = INITIAL_STUDENT_PROFILE.avatar;
                      }}
                    />
                    <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[9px] font-bold">
                      <Camera className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-[#3B82F6]/50 text-xs font-semibold text-slate-200 hover:text-white flex items-center justify-center gap-2 transition-all shadow-sm"
                    >
                      <Upload className="w-4 h-4 text-[#3B82F6]" />
                      <span>Upload Photo from Computer</span>
                    </button>
                    <p className="text-[10px] text-slate-500">Supports JPG, PNG, GIF or WEBP from your device</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Student Full Name</label>
                <input
                  type="text"
                  value={tempProfile.name}
                  onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#07111F] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">
                  Registered Email Address <span className="text-[10px] text-amber-400 font-normal">(Primary Email — Locked)</span>
                </label>
                <input
                  type="email"
                  value={tempProfile.email || customProfile.email}
                  disabled
                  readOnly
                  className="w-full px-3.5 py-2 rounded-xl bg-[#030712] border border-slate-800 text-xs font-mono text-[#3B82F6] font-bold cursor-not-allowed select-none opacity-80"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">
                  Username <span className="text-[10px] text-[#3B82F6] font-normal">(Auto-generated from Name & Locked)</span>
                </label>
                <input
                  type="text"
                  value={generateUsernameFromName(tempProfile.name)}
                  disabled
                  className="w-full px-3.5 py-2 rounded-xl bg-[#030712] border border-slate-800 text-xs font-mono text-[#3B82F6] font-bold cursor-not-allowed select-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Specialized Engineering Track</label>
                <input
                  type="text"
                  value={tempProfile.track}
                  onChange={(e) => setTempProfile({ ...tempProfile, track: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#07111F] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
                  required
                />
              </div>



              {/* Interactive Tag Chip Manager for Tech Stack */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-slate-400 font-bold">Tech Stack Skills</label>
                  <span className="text-[10px] text-[#3B82F6] font-mono font-bold bg-[#3B82F6]/10 px-2 py-0.5 rounded-full border border-[#3B82F6]/20">
                    {tempProfile.techStack.length} Technologies
                  </span>
                </div>

                {/* Active Tag Chips List */}
                <div className="flex flex-wrap gap-1.5 p-2.5 rounded-xl bg-[#030712] border border-slate-800 mb-2 min-h-[46px] items-center">
                  {tempProfile.techStack.length === 0 ? (
                    <span className="text-xs text-slate-500 italic px-1">No technology tags added yet. Type below to add.</span>
                  ) : (
                    tempProfile.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-[#3B82F6]/15 text-[#3B82F6] border border-[#3B82F6]/30 flex items-center gap-1.5 shadow-sm group hover:border-red-500/50 hover:bg-red-950/30 transition-all"
                      >
                        <span>{tech}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setTempProfile({
                              ...tempProfile,
                              techStack: tempProfile.techStack.filter((_, i) => i !== idx),
                            })
                          }
                          className="hover:text-red-400 text-slate-400 p-0.5 rounded transition-colors"
                          title={`Remove ${tech}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {/* Input + Add Button */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newTechTag}
                    onChange={(e) => setNewTechTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (newTechTag.trim()) {
                          const tag = newTechTag.trim();
                          if (!tempProfile.techStack.includes(tag)) {
                            setTempProfile({
                              ...tempProfile,
                              techStack: [...tempProfile.techStack, tag],
                            });
                          }
                          setNewTechTag("");
                        }
                      }
                    }}
                    placeholder="Type tech name and press Enter (e.g. Docker, Rust, PyTorch)..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-[#07111F] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newTechTag.trim()) {
                        const tag = newTechTag.trim();
                        if (!tempProfile.techStack.includes(tag)) {
                          setTempProfile({
                            ...tempProfile,
                            techStack: [...tempProfile.techStack, tag],
                          });
                        }
                        setNewTechTag("");
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl bg-[#3B82F6] hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-1 transition-all shadow-md shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Tag</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">GitHub Handle</label>
                  <input
                    type="text"
                    value={tempProfile.githubHandle}
                    onChange={(e) => setTempProfile({ ...tempProfile, githubHandle: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#07111F] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">LinkedIn Profile</label>
                  <input
                    type="text"
                    value={tempProfile.linkedinHandle}
                    onChange={(e) => setTempProfile({ ...tempProfile, linkedinHandle: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#07111F] border border-slate-800 text-xs text-white focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[linear-gradient(135deg,#2563EB,#1D4ED8)] text-white text-xs font-bold flex items-center gap-1.5 shadow-lg hover:scale-105 transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
