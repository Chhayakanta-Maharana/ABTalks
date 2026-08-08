"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  { num: "01", name: "BUILD",  desc: "Create something real." },
  { num: "02", name: "COMMIT", desc: "Leave your proof on GitHub." },
  { num: "03", name: "SHARE",  desc: "Make your progress visible." },
  { num: "04", name: "GROW",   desc: "Turn consistency into opportunity." },
];

export default function DailyLoop() {
  const [activeIdx, setActiveIdx] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const winH = window.innerHeight;
      const progress = (winH - rect.top) / (winH + rect.height);
      const clamped = Math.max(0, Math.min(1, progress));
      setActiveIdx(Math.min(steps.length - 1, Math.floor(clamped * steps.length)));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={sectionRef} id="daily-loop" className="border-t border-[#1e2030] py-32">
      <div className="max-w-[820px] mx-auto px-8">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-6">
          <span className="w-7 h-0.5 bg-[#5b80f5]" />
          <span className="text-[0.75rem] font-semibold tracking-[0.2em] text-[#6b7280] uppercase">THE DAILY LOOP</span>
        </div>

        <h2 className="font-extrabold text-white leading-[1.05] mb-14"
          style={{ fontSize: "clamp(2.6rem, 5vw, 4.5rem)", letterSpacing: "-0.03em" }}>
          One loop.<br />Every single day.
        </h2>

        {/* Steps */}
        <div className="flex flex-col">
          {steps.map((step, i) => {
            const isActive = i === activeIdx;
            return (
              <div
                key={step.num}
                className="flex items-stretch border-t border-[#1e2030] py-7 last:border-b last:border-[#1e2030] transition-all duration-300"
              >
                {/* Blue accent bar (only on active) */}
                {isActive && (
                  <div className="w-0.5 bg-[#5b80f5] rounded-full mr-6 self-stretch min-h-10 flex-shrink-0" />
                )}
                <div className={`flex items-center gap-6 ${!isActive ? "ml-[1.625rem]" : ""}`}>
                  <span className="text-[0.72rem] font-semibold text-[#6b7280] tracking-wider min-w-[24px]">
                    {step.num}
                  </span>
                  <div>
                    <div className={`font-extrabold tracking-tight transition-colors duration-300 ${
                      isActive ? "text-white" : "text-[#6b7280]"
                    }`} style={{ fontSize: "1.5rem" }}>
                      {step.name}
                    </div>
                    <div className={`text-sm mt-1 transition-colors duration-300 ${
                      isActive ? "text-[#6b7280]" : "text-[#374151]"
                    }`}>
                      {step.desc}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
