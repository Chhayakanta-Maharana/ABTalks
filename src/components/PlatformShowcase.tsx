"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckCircle2, GitBranch, Calendar, Terminal, Shield, Code, Flame } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const phases = [
  { day: 1,  name: "START",      pct: 2,   desc: "Set up repository, define 60-day scope, publish Day 01." },
  { day: 15, name: "BUILD",      pct: 25,  desc: "Core architecture established. 15 consecutive GitHub commits." },
  { day: 30, name: "MOMENTUM",   pct: 50,  desc: "Halfway point. Unstoppable muscle memory & public proof." },
  { day: 45, name: "VISIBILITY", pct: 75,  desc: "Inbound interest. Recruiters & founders taking notice." },
  { day: 60, name: "SHIP",       pct: 100, desc: "60 Builds completed. Proof of work impossible to ignore." },
];

export default function PlatformShowcase() {
  const containerRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [activePhaseIdx, setActivePhaseIdx] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 3D Physical Object Entrance & Scroll Movement
      gsap.fromTo(
        cardRef.current,
        {
          opacity: 0,
          scale: 0.75,
          rotateX: 18,
          translateY: 120,
          transformPerspective: 1200,
        },
        {
          opacity: 1,
          scale: 1,
          rotateX: 0,
          translateY: 0,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            end: "top 25%",
            scrub: 1,
          },
        }
      );

      // Spotlight breathing expansion
      gsap.to(spotlightRef.current, {
        scale: 1.25,
        opacity: 0.35,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const activePhase = phases[activePhaseIdx];

  return (
    <section ref={containerRef} id="showcase" className="relative pt-28 md:pt-36 pb-32 border-t border-[rgba(148,163,184,0.12)] overflow-hidden scroll-mt-24">
      {/* Background Radial Blue Spotlight */}
      <div
        ref={spotlightRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] rounded-full bg-[radial-gradient(ellipse,rgba(37,99,235,0.22)_0%,transparent_70%)] pointer-events-none blur-3xl"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 md:px-12 z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full navy-glass border border-[rgba(59,130,246,0.3)] mb-4">
            <Flame className="w-4 h-4 text-[#3B82F6]" />
            <span className="text-xs font-bold tracking-widest text-[#3B82F6] uppercase">
              ABTALKS DASHBOARD
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Engineered for physical momentum.
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8]">
            Track your 60-day streak, automate GitHub verification, and display your public evidence log.
          </p>
        </div>

        {/* 3D Dashboard Showcase Object */}
        <div
          ref={cardRef}
          className="navy-card rounded-2xl p-4 sm:p-6 md:p-10 border border-[rgba(148,163,184,0.18)] shadow-[0_25px_70px_rgba(0,0,0,0.6)] backdrop-blur-2xl relative"
        >
          {/* Top Bar Controls */}
          <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-[rgba(148,163,184,0.12)] mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#EF4444]/80" />
                <div className="w-3 h-3 rounded-full bg-[#F59E0B]/80" />
                <div className="w-3 h-3 rounded-full bg-[#10B981]/80" />
              </div>
              <span className="text-xs font-mono text-[#64748B] hidden sm:inline-block">
                abtalks.app/dashboard/streak
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-mono bg-[#2563EB]/20 text-[#3B82F6] border border-[#2563EB]/40 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
                DAY 12 ACTIVE
              </span>
            </div>
          </div>

          {/* Interactive Phase Selector */}
          <div className="mb-8 sm:mb-10">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[11px] sm:text-xs font-bold tracking-widest text-[#3B82F6] uppercase">
                CURRENT PHASE: {activePhase.name}
              </span>
              <span className="text-[11px] sm:text-xs font-mono text-[#94A3B8]">
                {activePhase.pct}% COMPLETED
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-[#0B1F3A] rounded-full overflow-hidden mb-6 p-[1px]">
              <div
                className="h-full bg-[linear-gradient(90deg,#2563EB,#3B82F6)] rounded-full transition-all duration-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]"
                style={{ width: `${activePhase.pct}%` }}
              />
            </div>

            {/* Milestone Markers */}
            <div className="grid grid-cols-5 gap-1 sm:gap-2">
              {phases.map((p, idx) => {
                const isActive = idx === activePhaseIdx;
                const isPast = idx <= activePhaseIdx;
                return (
                  <button
                    key={p.name}
                    onClick={() => setActivePhaseIdx(idx)}
                    className={`p-1.5 sm:p-3 rounded-xl border text-center sm:text-left min-w-0 transition-all duration-300 ${
                      isActive
                        ? "bg-[#2563EB]/20 border-[#3B82F6] shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                        : isPast
                        ? "bg-[#07111F] border-[#2563EB]/30 text-[#94A3B8]"
                        : "bg-[#030712] border-[rgba(148,163,184,0.1)] text-[#64748B]"
                    }`}
                  >
                    <div className="text-[9px] sm:text-[10px] font-mono text-[#64748B] mb-0.5 sm:mb-1 truncate">
                      DAY {String(p.day).padStart(2, "0")}
                    </div>
                    <div className={`text-[10px] sm:text-xs font-bold truncate ${isActive ? "text-white" : "text-[#94A3B8]"}`}>
                      {p.name}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Phase Description Card */}
          <div className="p-6 rounded-xl bg-[#030712]/80 border border-[rgba(148,163,184,0.1)] flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#3B82F6]" />
                {activePhase.name} Milestone Objective
              </h4>
              <p className="text-xs text-[#94A3B8]">{activePhase.desc}</p>
            </div>

            <button className="px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#3B82F6] text-white text-xs font-bold tracking-wider uppercase transition-colors flex-shrink-0">
              LOG TODAY'S BUILD
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
