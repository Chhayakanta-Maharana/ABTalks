"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Flame } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
  const containerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const ctaBtnRef = useRef<HTMLAnchorElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Headline Masked Reveal
      gsap.fromTo(
        headlineRef.current,
        { opacity: 0, y: 80, filter: "blur(12px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // 2. CTA Button Scale Reveal
      gsap.fromTo(
        ctaBtnRef.current,
        { opacity: 0, scale: 0.88, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          delay: 0.3,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
          },
        }
      );

      // 3. Final Giant "ABTALKS" Typography Ticker Banner
      gsap.fromTo(
        bannerRef.current,
        { x: "20%" },
        {
          x: "-30%",
          ease: "none",
          scrollTrigger: {
            trigger: ".final-typography-wrap",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} id="cta" className="relative pt-32 pb-0 border-t border-[rgba(148,163,184,0.12)] bg-[#030712] overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[950px] h-[600px] rounded-full bg-[radial-gradient(ellipse,rgba(37,99,235,0.2)_0%,transparent_70%)] pointer-events-none blur-3xl" />

      <div className="relative max-w-5xl mx-auto px-6 text-center z-10 mb-28">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full navy-glass border border-[rgba(59,130,246,0.3)] mb-6">
          <Flame className="w-4 h-4 text-[#3B82F6]" />
          <span className="text-xs font-bold tracking-widest text-[#3B82F6] uppercase">
            DAY 01 STARTS RIGHT NOW
          </span>
        </div>

        <h2
          ref={headlineRef}
          className="font-black tracking-tight text-white leading-[0.92] uppercase mb-10"
          style={{ fontSize: "clamp(3rem, 7.5vw, 6.5rem)" }}
        >
          READY TO SHOW UP<br />
          <span className="bg-[linear-gradient(135deg,#3B82F6,#2563EB)] bg-clip-text text-transparent">
            FOR 60 DAYS?
          </span>
        </h2>

        <p className="text-base md:text-xl text-[#94A3B8] max-w-xl mx-auto mb-12">
          Your next breakthrough project starts with Day 01. Stop preparing to build — ship today.
        </p>

        <Link
          ref={ctaBtnRef}
          href="#"
          data-magnetic="true"
          className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-[linear-gradient(135deg,#2563EB,#1E40AF)] text-white font-extrabold text-base tracking-wider uppercase shadow-[0_0_40px_rgba(37,99,235,0.45)] hover:shadow-[0_0_60px_rgba(59,130,246,0.7)] hover:scale-105 transition-all duration-300 group"
        >
          <span>START DAY 01 NOW</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Final Giant Typography Scroll Banner */}
      <div className="final-typography-wrap w-full overflow-hidden border-t border-[rgba(148,163,184,0.12)] py-6 bg-[#07111F]/40">
        <div
          ref={bannerRef}
          className="font-black text-transparent uppercase tracking-tighter select-none whitespace-nowrap"
          style={{
            fontSize: "clamp(7rem, 20vw, 22rem)",
            WebkitTextStroke: "2px rgba(59, 130, 246, 0.22)",
            lineHeight: 0.8,
          }}
        >
          ABTALKS ABTALKS ABTALKS
        </div>
      </div>
    </section>
  );
}
