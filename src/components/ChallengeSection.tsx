"use client";

import { useEffect, useRef, useState } from "react";

const phases = [
  { day: 1,  name: "START",      pct: 2 },
  { day: 15, name: "BUILD",      pct: 24 },
  { day: 30, name: "MOMENTUM",   pct: 50 },
  { day: 45, name: "VISIBILITY", pct: 75 },
  { day: 60, name: "SHIP",       pct: 100 },
];

function getPhaseIdx(day: number) {
  if (day < 15) return 0;
  if (day < 30) return 1;
  if (day < 45) return 2;
  if (day < 60) return 3;
  return 4;
}

export default function ChallengeSection() {
  const [day, setDay] = useState(4);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const winH = window.innerHeight;
      const sectionH = el.offsetHeight;
      const progress = 1 - (rect.top - winH * 0.2) / (sectionH + winH * 0.6);
      const clamped = Math.max(0, Math.min(1, progress));
      setDay(Math.round(1 + clamped * 59));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const pct = Math.round(((day - 1) / 59) * 100);
  const phaseIdx = getPhaseIdx(day);
  const phase = phases[phaseIdx];

  return (
    <section ref={sectionRef} id="challenge" className="border-t border-[#1e2030] py-32">
      <div className="max-w-[820px] mx-auto px-8">
        <p className="text-[0.75rem] font-semibold tracking-[0.18em] text-[#6b7280] uppercase mb-1">
          THE CHALLENGE
        </p>
        <p className="text-sm font-medium tracking-widest text-[#6b7280] uppercase mb-2">DAY</p>

        {/* Huge Day Counter */}
        <div
          className="font-black text-white leading-[0.85] mb-8 transition-all duration-500"
          style={{ fontSize: "clamp(8rem, 20vw, 16rem)", letterSpacing: "-0.05em" }}
        >
          {String(day).padStart(2, "0")}
        </div>

        {/* Phase bar */}
        <div className="mb-12">
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-[0.82rem] font-bold tracking-[0.15em] text-[#5b80f5] uppercase">
              {phase.name}
            </span>
            <span className="text-[0.82rem] text-[#6b7280] font-medium">{pct}%</span>
          </div>
          <div className="w-full h-0.5 bg-[#1e2030] rounded-full mb-4 overflow-hidden">
            <div
              className="h-full bg-[#5b80f5] rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          {/* Milestones */}
          <div className="flex justify-between">
            {phases.map((p, i) => (
              <div key={p.name} className="flex flex-col items-center gap-1">
                <div
                  className={`w-2 h-2 rounded-full border-2 transition-all duration-300 ${
                    i <= phaseIdx
                      ? "bg-[#5b80f5] border-[#5b80f5] shadow-[0_0_0_3px_rgba(91,128,245,0.2)]"
                      : "bg-[#374151] border-[#374151]"
                  }`}
                />
                <span className={`text-[0.7rem] font-medium tracking-wide ${i === phaseIdx ? "text-white" : "text-[#6b7280]"}`}>
                  {String(p.day).padStart(2, "0")}
                </span>
                <span className="text-[0.62rem] tracking-wider text-[#6b7280] uppercase">{p.name}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[#6b7280] text-[0.95rem] max-w-md leading-relaxed">
          Sixty days. One build a day. A trail of proof that nobody can argue with.
        </p>
      </div>
    </section>
  );
}
