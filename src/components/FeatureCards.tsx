"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Code2, GitPullRequest, Share2, Award, ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Code2,
    num: "01",
    title: "DAILY BUILD REGIMEN",
    desc: "Ship production code every single day. No passive tutorial watching. Real projects, real architectures.",
    tag: "EXECUTION",
  },
  {
    icon: GitPullRequest,
    num: "02",
    title: "VERIFIED COMMIT TRAIL",
    desc: "Automated GitHub verification system logs your commits to create an immutable proof-of-work timeline.",
    tag: "PROOFS",
  },
  {
    icon: Share2,
    num: "03",
    title: "PUBLIC BUILDING LOOP",
    desc: "Share daily progress across LinkedIn & Twitter. Transform stealth building into undeniable industry authority.",
    tag: "VISIBILITY",
  },
  {
    icon: Award,
    num: "04",
    title: "COMPLEXITY COMPOUNDING",
    desc: "Watch your daily habits transform from simple UI components into full-stack SaaS & WebGL applications.",
    tag: "MASTERY",
  },
];

export default function FeatureCards() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Heading & Info Timeline Reveal
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

      // 2. Feature Cards Entrance with Distinct Movements
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
            Four core pillars designed to take you from static learner to high-impact engineer.
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
                className={`${cardClass} navy-card p-8 md:p-10 rounded-2xl border border-[rgba(148,163,184,0.12)] relative group hover:border-[#3B82F6]/40 transition-all duration-500 overflow-hidden backdrop-blur-xl`}
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

                <div className="flex items-center gap-2 text-xs font-bold text-[#3B82F6] group-hover:translate-x-1.5 transition-transform duration-300">
                  <span>LEARN MORE ABOUT PHASE {feat.num}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
