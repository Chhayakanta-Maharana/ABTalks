"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShieldCheck, GitCommit, Zap, Trophy, ChevronDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const card4Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Choreographed Master Timeline
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // 1. Eyebrow
      tl.fromTo(
        ".hero-eyebrow",
        { opacity: 0, y: 30, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, delay: 0.4 }
      );

      // 2. Main Headline Masked & Blurred Reveal
      tl.fromTo(
        ".hero-title-line",
        { opacity: 0, y: 80, filter: "blur(12px)", scale: 1.05 },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          scale: 1,
          duration: 1.2,
          stagger: 0.15,
        },
        "-=0.6"
      );

      // 3. Subtitle & CTAs
      tl.fromTo(
        ".hero-sub",
        { opacity: 0, y: 30, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1 },
        "-=0.8"
      );

      tl.fromTo(
        ".hero-cta-group",
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8 },
        "-=0.6"
      );

      // 4. Floating 3D Depth Cards Entrance
      tl.fromTo(
        card1Ref.current,
        { opacity: 0, x: -60, y: -20, rotateY: -15, scale: 0.85, filter: "blur(8px)" },
        { opacity: 1, x: 0, y: 0, rotateY: 0, scale: 1, filter: "blur(0px)", duration: 1.2 },
        "-=1.0"
      );

      tl.fromTo(
        card2Ref.current,
        { opacity: 0, x: 60, y: 30, rotateY: 15, scale: 0.85, filter: "blur(8px)" },
        { opacity: 1, x: 0, y: 0, rotateY: 0, scale: 1, filter: "blur(0px)", duration: 1.2 },
        "-=1.0"
      );

      tl.fromTo(
        card3Ref.current,
        { opacity: 0, y: 60, scale: 0.8, filter: "blur(8px)" },
        { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 1.2 },
        "-=1.0"
      );

      tl.fromTo(
        card4Ref.current,
        { opacity: 0, x: 40, y: -40, scale: 0.8, filter: "blur(8px)" },
        { opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)", duration: 1.2 },
        "-=1.0"
      );

      // Scroll-bound 3D Parallax on floating elements
      gsap.to(card1Ref.current, {
        y: -120,
        x: -30,
        rotateZ: -4,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      gsap.to(card2Ref.current, {
        y: -180,
        x: 40,
        rotateZ: 6,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      gsap.to(card3Ref.current, {
        y: -90,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      gsap.to(headlineRef.current, {
        y: 80,
        opacity: 0.3,
        filter: "blur(6px)",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "70% top",
          scrub: 1,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[110vh] flex flex-col justify-center pt-32 pb-24 overflow-hidden perspective-container"
    >
      {/* Soft Center Radial Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[radial-gradient(ellipse,rgba(37,99,235,0.18)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Headline Column */}
        <div className="lg:col-span-8">
          {/* Eyebrow */}
          <div className="hero-eyebrow flex items-center gap-3 mb-6">
            <span className="w-8 h-[2px] bg-[#3B82F6] shadow-[0_0_12px_#3B82F6]" />
            <span className="text-xs font-bold tracking-[0.25em] text-[#94A3B8] uppercase">
              ABTALKS 60-DAY ENGINE
            </span>
          </div>

          {/* Headline */}
          <h1
            ref={headlineRef}
            className="font-black tracking-tighter text-[#F8FAFC] leading-[0.98] mb-8 break-words"
            style={{ fontSize: "clamp(2rem, 6.5vw, 7.2rem)" }}
          >
            <div className="clip-text-reveal overflow-hidden">
              <span className="hero-title-line block text-white">60 DAYS.</span>
            </div>
            <div className="clip-text-reveal overflow-hidden">
              <span className="hero-title-line block text-white">60 BUILDS.</span>
            </div>
            <div className="clip-text-reveal overflow-hidden">
              <span className="hero-title-line block bg-[linear-gradient(135deg,#3B82F6,#2563EB)] bg-clip-text text-transparent">
                ONE STRONGER YOU.
              </span>
            </div>
          </h1>

          {/* Subtitle */}
          <p className="hero-sub text-[#94A3B8] text-lg md:text-xl max-w-xl font-normal leading-relaxed mb-10">
            Build in public. Prove your progress on GitHub. Turn daily execution into undeniable visual authority.
          </p>

          {/* CTA Buttons */}
          <div className="hero-cta-group flex flex-wrap items-center gap-5">
            <Link
              href="/login"
              data-magnetic="true"
              className="px-8 py-4 rounded-xl bg-[linear-gradient(135deg,#2563EB,#1E40AF)] text-white font-bold text-sm tracking-wider uppercase shadow-[0_0_35px_rgba(37,99,235,0.4)] hover:shadow-[0_0_50px_rgba(59,130,246,0.6)] hover:scale-[1.02] transition-all duration-300 flex items-center gap-2"
            >
              <span>START NOW</span>
              <Zap className="w-4 h-4 fill-current" />
            </Link>

            <Link
              href="/day/12"
              className="px-8 py-4 rounded-xl border border-[rgba(148,163,184,0.18)] bg-[#07111F]/60 text-[#F8FAFC] font-semibold text-sm tracking-wide hover:border-[#3B82F6]/50 hover:bg-[#0B1F3A]/80 transition-all duration-300 backdrop-blur-md"
            >
              TRY DAY 12 WORKSPACE →
            </Link>
          </div>
        </div>

        {/* Right Floating 3D Cards Column */}
        <div className="lg:col-span-4 relative h-[480px] hidden md:block">
          {/* Card 1: Commit Status */}
          <div
            ref={card1Ref}
            className="absolute top-0 right-4 w-72 p-5 rounded-2xl navy-card backdrop-blur-xl border border-[rgba(148,163,184,0.12)]"
            style={{ transform: "rotateX(8deg) rotateY(-10deg)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <GitCommit className="w-4 h-4 text-[#3B82F6]" />
                <span className="text-xs font-mono text-[#94A3B8]">chhayakanta/day12</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#2563EB]/20 text-[#3B82F6] border border-[#2563EB]/30">
                main
              </span>
            </div>
            <p className="text-xs font-mono font-semibold text-[#F8FAFC] mb-2">
              feat: responsive dashboard layout
            </p>
            <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B]">
              <span>abc123f · 2h ago</span>
              <span className="text-[#34D399]">+248 -31</span>
            </div>
          </div>

          {/* Card 2: Streak Counter */}
          <div
            ref={card2Ref}
            className="absolute top-44 left-0 w-64 p-5 rounded-2xl navy-card backdrop-blur-xl border border-[rgba(59,130,246,0.25)] shadow-[0_12px_40px_rgba(37,99,235,0.25)]"
            style={{ transform: "rotateX(-6deg) rotateY(12deg)" }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold tracking-widest text-[#3B82F6] uppercase">
                STREAK ACTIVE
              </span>
              <Trophy className="w-4 h-4 text-[#3B82F6]" />
            </div>
            <div className="text-5xl font-black text-white tracking-tighter mb-1">11 DAYS</div>
            <p className="text-xs text-[#94A3B8]">Consistency compounds exponentially.</p>
          </div>

          {/* Card 3: Verification Badge */}
          <div
            ref={card3Ref}
            className="absolute bottom-6 right-8 w-60 p-4 rounded-xl navy-glass flex items-center gap-3 border border-[rgba(148,163,184,0.15)]"
          >
            <div className="w-10 h-10 rounded-full bg-[#2563EB]/20 flex items-center justify-center text-[#3B82F6] border border-[#2563EB]/40 flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#F8FAFC]">Submission Verified</p>
              <p className="text-[11px] text-[#64748B]">Day 12 Proof On-Chain</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#64748B] text-xs tracking-widest uppercase animate-bounce pointer-events-none">
        <span>SCROLL TO DISCOVER</span>
        <ChevronDown className="w-4 h-4 text-[#3B82F6]" />
      </div>
    </section>
  );
}
