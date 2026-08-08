"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Users, Rocket, Flame, ShieldCheck } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  {
    icon: Users,
    value: "2,847+",
    label: "STUDENTS ACTIVE",
    sub: "Engineers, creators & builders in public",
  },
  {
    icon: Rocket,
    value: "12,430+",
    label: "BUILDS SHIPPED",
    sub: "Verified repositories and live deployments",
  },
  {
    icon: Flame,
    value: "60 DAYS",
    label: "DAILY REGIMEN",
    sub: "Zero excuse consistency protocol",
  },
  {
    icon: ShieldCheck,
    value: "100%",
    label: "PROOF OF PROGRESS",
    sub: "GitHub commits & visible evidence",
  },
];

export default function StatsSection() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".stat-card",
        { opacity: 0, y: 50, scale: 0.9, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="stats" className="relative py-28 border-t border-[rgba(148,163,184,0.12)]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[2px] bg-[#3B82F6]" />
            <span className="text-xs font-bold tracking-[0.25em] text-[#94A3B8] uppercase">
              PLATFORM METRICS
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-[#F8FAFC] tracking-tight">
            Proof in numbers.<br />
            <span className="bg-[linear-gradient(135deg,#3B82F6,#2563EB)] bg-clip-text text-transparent">
              Consistency compounds.
            </span>
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="stat-card p-8 rounded-2xl navy-card backdrop-blur-xl relative group transition-all duration-300 overflow-hidden"
              >
                {/* Accent glow on hover */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle,rgba(59,130,246,0.15)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="w-12 h-12 rounded-xl bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center text-[#3B82F6] mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6" />
                </div>

                <div className="text-4xl lg:text-5xl font-black text-white tracking-tighter mb-2">
                  {stat.value}
                </div>

                <div className="text-xs font-bold tracking-widest text-[#3B82F6] uppercase mb-2">
                  {stat.label}
                </div>

                <p className="text-xs text-[#94A3B8] leading-relaxed">{stat.sub}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
