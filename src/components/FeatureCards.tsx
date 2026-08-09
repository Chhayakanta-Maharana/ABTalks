"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Code2, GitPullRequest, Share2, Award, ArrowRight, X, CheckCircle2, Zap } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    id: 1,
    icon: Code2,
    num: "01",
    title: "DAILY BUILD REGIMEN",
    desc: "Ship production code every single day. No passive tutorial watching. Real projects, real architectures.",
    tag: "EXECUTION",
    subtitle: "Days 1–15: Building Foundations & Execution Habits",
    takeaway: "Transition from watching tutorials to shipping production-ready frontend & fullstack code daily. Develop unshakeable 24-hour build consistency.",
    deliverables: [
      "Personal Developer Portfolio Website & Component System",
      "Dynamic Landing Pages with Modern Glassmorphic CSS",
      "Responsive Multi-page Web Applications",
      "Interactive Forms with Real-time Client & Server Validation",
    ],
  },
  {
    id: 2,
    icon: GitPullRequest,
    num: "02",
    title: "VERIFIED COMMIT TRAIL",
    desc: "Automated GitHub verification system logs your commits to create an immutable proof-of-work timeline.",
    tag: "PROOFS",
    subtitle: "Days 16–30: Git Workflow & Automated Proof of Work",
    takeaway: "Build an immutable, verified GitHub commit trail. Every single day's submission is verified, logged, and publicly visible to recruiters.",
    deliverables: [
      "Modular REST API Endpoints with Golang & Node.js",
      "Relational Database Schemas with PostgreSQL & Neon DB",
      "Clean Git Commit Histories with Conventional Commits",
      "Dynamic API Integrations & State Management",
    ],
  },
  {
    id: 3,
    icon: Share2,
    num: "03",
    title: "PUBLIC BUILDING LOOP",
    desc: "Share daily progress across LinkedIn & Twitter. Transform stealth building into undeniable industry authority.",
    tag: "VISIBILITY",
    subtitle: "Days 31–45: Personal Branding & Developer Visibility",
    takeaway: "Turn stealth building into public authority. Learn to articulate your technical design choices, post proof updates, and attract recruiter inbound.",
    deliverables: [
      "Fullstack Web Applications with User Authentication (JWT)",
      "Public Project Architecture Diagrams & Documentation",
      "LinkedIn Technical Breakdown Posts & Progress Demos",
      "End-to-End Deployed Projects on Vercel & Render",
    ],
  },
  {
    id: 4,
    icon: Award,
    num: "04",
    title: "COMPLEXITY COMPOUNDING",
    desc: "Watch your daily habits transform from simple UI components into full-stack SaaS & WebGL applications.",
    tag: "MASTERY",
    subtitle: "Days 46–60: Fullstack SaaS Architecture & Advanced Systems",
    takeaway: "Watch your daily habits compound into complex engineering capabilities. Graduate with 60 verified projects and a portfolio built for senior roles.",
    deliverables: [
      "Production SaaS Platforms with Database ORM Integration",
      "Real-time Microservices & Background Worker Tasks",
      "Interactive Visual Systems & Optimized Web Applications",
      "Capstone Open-Source Fullstack Systems",
    ],
  },
];

export default function FeatureCards() {
  const containerRef = useRef<HTMLElement>(null);
  const [activeModal, setActiveModal] = useState<typeof features[0] | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const infoTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      infoTl.fromTo(
        ".feat-heading",
        { opacity: 0, y: 40, filter: "blur(6px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8 }
      );

      gsap.fromTo(
        ".feat-card-1",
        { opacity: 0, x: -80, rotateZ: -6, filter: "blur(8px)" },
        {
          opacity: 1,
          x: 0,
          rotateZ: 0,
          filter: "blur(0px)",
          duration: 1,
          scrollTrigger: { trigger: ".feat-card-1", start: "top 85%" },
        }
      );

      gsap.fromTo(
        ".feat-card-2",
        { opacity: 0, y: 80, scale: 0.85, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 1,
          scrollTrigger: { trigger: ".feat-card-2", start: "top 85%" },
        }
      );

      gsap.fromTo(
        ".feat-card-3",
        { opacity: 0, x: 80, rotateY: 15, filter: "blur(8px)" },
        {
          opacity: 1,
          x: 0,
          rotateY: 0,
          filter: "blur(0px)",
          duration: 1,
          scrollTrigger: { trigger: ".feat-card-3", start: "top 85%" },
        }
      );

      gsap.fromTo(
        ".feat-card-4",
        { opacity: 0, y: 90, scale: 0.88, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 1,
          scrollTrigger: { trigger: ".feat-card-4", start: "top 85%" },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="loop" className="relative py-32 border-t border-[rgba(148,163,184,0.12)]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Heading */}
        <div className="feat-heading max-w-2xl mb-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[2px] bg-[#3B82F6]" />
            <span className="text-xs font-bold tracking-[0.25em] text-[#94A3B8] uppercase">
              THE 4-STEP LOOP
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
            Built for relentless,<br />
            <span className="bg-[linear-gradient(135deg,#3B82F6,#2563EB)] bg-clip-text text-transparent">
              unshakeable execution.
            </span>
          </h2>
          <p className="text-base text-[#94A3B8]">
            Four core pillars designed to take you from static learner to high-impact engineer. Click any card to inspect phase details.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            const cardClass = `feat-card-${idx + 1}`;
            return (
              <div
                key={feat.num}
                onClick={() => setActiveModal(feat)}
                className={`${cardClass} navy-card p-8 md:p-10 rounded-2xl border border-[rgba(148,163,184,0.12)] relative group hover:border-[#3B82F6]/60 cursor-pointer transition-all duration-500 overflow-hidden backdrop-blur-xl shadow-lg hover:shadow-[0_0_35px_rgba(37,99,235,0.2)]`}
              >
                {/* Subtle Hover Radial Lighting */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-[radial-gradient(circle,rgba(59,130,246,0.25)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="flex items-center justify-between mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center text-[#3B82F6] group-hover:scale-110 group-hover:text-white transition-all duration-300">
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-mono font-bold tracking-widest px-3 py-1 rounded-full bg-[#030712] border border-[rgba(148,163,184,0.15)] text-[#3B82F6]">
                    PHASE {feat.num}
                  </span>
                </div>

                <div className="text-xs font-bold tracking-widest text-[#3B82F6] uppercase mb-2">
                  {feat.tag}
                </div>

                <h3 className="text-xl md:text-2xl font-extrabold text-white tracking-tight mb-4">
                  {feat.title}
                </h3>

                <p className="text-sm text-[#94A3B8] leading-relaxed mb-8">
                  {feat.desc}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveModal(feat);
                  }}
                  className="flex items-center gap-2 text-xs font-bold text-[#3B82F6] group-hover:translate-x-1.5 transition-transform duration-300"
                >
                  <span>LEARN MORE ABOUT PHASE {feat.num}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Phase Detail Modal Popup */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 bg-[#030712]/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="bg-[#07111F] border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle,rgba(37,99,235,0.15)_0%,transparent_70%)] pointer-events-none" />

            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#2563EB]/20 border border-[#3B82F6]/30 text-[#3B82F6] text-[11px] font-bold font-mono">
                    PHASE {activeModal.num}
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                    {activeModal.tag}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {activeModal.title}
                </h3>
                <p className="text-xs text-[#3B82F6] font-semibold">
                  {activeModal.subtitle}
                </p>
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Key Takeaway Banner */}
            <div className="p-4 rounded-2xl bg-[#030712]/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#3B82F6]" />
                PHASE GOAL & INTENT
              </span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                {activeModal.takeaway}
              </p>
            </div>

            {/* Deliverables Checklist */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                WHAT YOU WILL BUILD IN THIS PHASE
              </h4>
              <div className="space-y-2">
                {activeModal.deliverables.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#030712]/50 border border-slate-800 text-xs text-slate-200 flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-400 hover:text-white transition-all"
              >
                Close Window
              </button>

              <Link
                href="/login"
                className="px-6 py-2.5 rounded-xl bg-[linear-gradient(135deg,#2563EB,#1D4ED8)] text-white text-xs font-bold tracking-wider uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:scale-105 transition-all"
              >
                <span>START PHASE {activeModal.num} NOW</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
