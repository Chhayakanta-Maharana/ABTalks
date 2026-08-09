"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FullScreenStatement() {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const arcRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Text Masked & Blur Reveal
      gsap.fromTo(
        textRef.current,
        {
          opacity: 0,
          y: 70,
          scale: 0.92,
          filter: "blur(14px)",
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 65%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // 2. Horizon Arc Rise & Scale
      gsap.fromTo(
        arcRef.current,
        {
          y: 150,
          scale: 0.8,
          opacity: 0,
        },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
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
    <section
      ref={containerRef}
      className="relative min-h-[90vh] flex flex-col items-center justify-center py-32 overflow-hidden bg-[#030712]"
    >
      {/* Background Deep Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-[radial-gradient(ellipse,rgba(37,99,235,0.18)_0%,transparent_70%)] pointer-events-none" />

      {/* Main Statement Text */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <span className="text-xs font-bold tracking-[0.3em] text-[#3B82F6] uppercase mb-6 block">
          THE ABTALKS MANIFESTO
        </span>

        <h2
          ref={textRef}
          className="font-black tracking-tight text-white leading-[0.98] uppercase max-w-full break-words"
          style={{ fontSize: "clamp(1.75rem, 6.5vw, 6.8rem)" }}
        >
          THE CONVERSATION<br />
          <span className="bg-[linear-gradient(135deg,#3B82F6,#2563EB)] bg-clip-text text-transparent">
            STARTS HERE.
          </span>
        </h2>
      </div>

      {/* Large Blue Arc / Horizon SVG rising from bottom */}
      <svg
        ref={arcRef}
        viewBox="0 0 1440 320"
        className="absolute bottom-0 left-0 w-full h-auto pointer-events-none opacity-80"
      >
        <defs>
          <linearGradient id="horizonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(11, 31, 58, 0)" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="rgba(11, 31, 58, 0)" />
          </linearGradient>
        </defs>

        <path
          d="M 0 320 Q 720 40 1440 320"
          fill="none"
          stroke="url(#horizonGrad)"
          strokeWidth="3"
          className="drop-shadow-[0_0_25px_rgba(59,130,246,0.8)]"
        />
      </svg>
    </section>
  );
}
