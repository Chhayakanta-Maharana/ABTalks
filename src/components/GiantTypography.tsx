"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function GiantTypography() {
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const zoomTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Horizontal Motion Ticker across viewport
      gsap.fromTo(
        trackRef.current,
        { x: "10%" },
        {
          x: "-40%",
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );

      // 2. Pinned Zoom / Scale Effect (scale: 0.4 -> 1 -> 3.5)
      const zoomTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".zoom-section-container",
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 1,
        },
      });

      zoomTl.fromTo(
        zoomTextRef.current,
        { scale: 0.4, opacity: 0.2, filter: "blur(10px)" },
        { scale: 1, opacity: 1, filter: "blur(0px)", ease: "power2.inOut", duration: 1 }
      );

      zoomTl.to(zoomTextRef.current, {
        scale: 3.8,
        opacity: 0,
        filter: "blur(14px)",
        ease: "power2.in",
        duration: 1,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative overflow-hidden py-16 bg-[#030712]">
      {/* 1. Giant Horizontal Ticker Banner */}
      <div className="relative w-full overflow-hidden py-12 border-y border-[rgba(148,163,184,0.08)]">
        <div
          ref={trackRef}
          className="flex whitespace-nowrap gap-12 font-black text-transparent uppercase tracking-tighter select-none"
          style={{
            fontSize: "clamp(6rem, 15vw, 16rem)",
            WebkitTextStroke: "2px rgba(59, 130, 246, 0.25)",
            lineHeight: 0.85,
          }}
        >
          <span>CONNECT</span>
          <span className="text-[#3B82F6] opacity-90" style={{ WebkitTextStroke: "0px" }}>
            LEARN
          </span>
          <span>GROW</span>
          <span className="text-[#2563EB] opacity-90" style={{ WebkitTextStroke: "0px" }}>
            CONVERSE
          </span>
          <span>YOUR VOICE MATTERS</span>
        </div>
      </div>

      {/* 2. Pinned Giant Typography Scale Zoom Container */}
      <div className="zoom-section-container min-h-screen flex items-center justify-center relative overflow-hidden bg-[radial-gradient(ellipse,rgba(11,31,58,0.5)_0%,rgba(3,7,18,1)_80%)]">
        {/* Soft Ambient Light Backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(37,99,235,0.15)_0%,transparent_65%)] pointer-events-none" />

        <div
          ref={zoomTextRef}
          className="text-center font-black tracking-tighter uppercase pointer-events-none select-none px-4"
        >
          <div className="text-xs font-bold tracking-[0.3em] text-[#3B82F6] mb-4 uppercase">
            ABTALKS CORE PHILOSOPHY
          </div>
          <h2
            className="text-white leading-[0.88] drop-shadow-[0_0_50px_rgba(37,99,235,0.4)]"
            style={{ fontSize: "clamp(3.5rem, 10vw, 10rem)" }}
          >
            BECOME IMPOSSIBLE<br />
            <span className="bg-[linear-gradient(135deg,#3B82F6,#2563EB)] bg-clip-text text-transparent">
              TO IGNORE.
            </span>
          </h2>
        </div>
      </div>
    </section>
  );
}
