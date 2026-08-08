"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Activity, TrendingUp } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function DataVisualization() {
  const sectionRef = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const gridRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const path = pathRef.current;
      if (!path) return;

      const pathLength = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });

      // Sequential Scroll-Triggered Animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom 30%",
          scrub: 1,
        },
      });

      // 1. Grid & Axes Reveal
      tl.fromTo(
        gridRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 }
      );

      // 2. Line Draw Animation
      tl.to(path, {
        strokeDashoffset: 0,
        ease: "power2.out",
        duration: 2,
      });

      // 3. Glowing Node Points Stagger
      tl.fromTo(
        ".graph-node",
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.2,
          ease: "back.out(2)",
          duration: 0.8,
        },
        "-=1.5"
      );

      // 4. Node Glow Pulse
      tl.to(
        ".graph-node-glow",
        {
          scale: 1.8,
          opacity: 0.8,
          stagger: 0.15,
          duration: 0.6,
          yoyo: true,
          repeat: 1,
        },
        "-=0.5"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="analytics" className="relative py-32 border-t border-[rgba(148,163,184,0.12)]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-[#3B82F6]" />
              <span className="text-xs font-bold tracking-[0.25em] text-[#94A3B8] uppercase">
                CONSISTENCY ANALYTICS
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
              Visualizing exponential habit growth.
            </h2>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl navy-glass border border-[rgba(148,163,184,0.15)] text-xs text-[#94A3B8]">
            <TrendingUp className="w-4 h-4 text-[#34D399]" />
            <span>GitHub Commit Velocity: <strong className="text-white">+340%</strong></span>
          </div>
        </div>

        {/* SVG Graph Container */}
        <div className="navy-card p-6 md:p-12 rounded-2xl border border-[rgba(148,163,184,0.15)] relative overflow-hidden">
          {/* Subtle Ambient Glow inside Card */}
          <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-[radial-gradient(ellipse,rgba(37,99,235,0.15)_0%,transparent_70%)] pointer-events-none" />

          <svg
            viewBox="0 0 1000 400"
            className="w-full h-auto overflow-visible pointer-events-none"
          >
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="50%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#60A5FA" />
              </linearGradient>

              <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(59, 130, 246, 0.25)" />
                <stop offset="100%" stopColor="rgba(3, 7, 18, 0)" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            <g ref={gridRef} stroke="rgba(148, 163, 184, 0.08)" strokeWidth="1">
              <line x1="0" y1="80" x2="1000" y2="80" />
              <line x1="0" y1="160" x2="1000" y2="160" />
              <line x1="0" y1="240" x2="1000" y2="240" />
              <line x1="0" y1="320" x2="1000" y2="320" />

              <line x1="200" y1="0" x2="200" y2="400" />
              <line x1="400" y1="0" x2="400" y2="400" />
              <line x1="600" y1="0" x2="600" y2="400" />
              <line x1="800" y1="0" x2="800" y2="400" />
            </g>

            {/* SVG Path Stream */}
            <path
              ref={pathRef}
              d="M 50 340 C 200 320, 250 260, 400 240 C 550 220, 600 130, 750 110 C 850 95, 920 60, 950 40"
              fill="none"
              stroke="url(#lineGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              className="drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]"
            />

            {/* Graph Node Circles */}
            {[
              { x: 50,  y: 340, day: "DAY 01" },
              { x: 250, y: 260, day: "DAY 15" },
              { x: 400, y: 240, day: "DAY 30" },
              { x: 600, y: 130, day: "DAY 45" },
              { x: 750, y: 110, day: "DAY 52" },
              { x: 950, y: 40,  day: "DAY 60" },
            ].map((node, i) => (
              <g key={i} className="graph-node origin-center">
                {/* Glow ring */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="12"
                  fill="rgba(59, 130, 246, 0.2)"
                  className="graph-node-glow origin-center"
                />
                {/* Solid node */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="5"
                  fill="#3B82F6"
                  stroke="#F8FAFC"
                  strokeWidth="2"
                />
                {/* Label */}
                <text
                  x={node.x}
                  y={node.y - 18}
                  textAnchor="middle"
                  fill="#94A3B8"
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {node.day}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}
