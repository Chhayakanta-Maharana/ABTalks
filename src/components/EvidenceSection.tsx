"use client";

const evSteps = [
  { num: "01", name: "BUILD" },
  { num: "02", name: "GITHUB COMMIT" },
  { num: "03", name: "LINKEDIN POST" },
  { num: "04", name: "PUBLIC PROOF" },
  { num: "05", name: "VISIBILITY" },
];

export default function EvidenceSection() {
  return (
    <section id="evidence" className="border-t border-[#1e2030] py-32">
      <div className="max-w-[820px] mx-auto px-8">
        <h2
          className="font-extrabold leading-[1.05] mb-16"
          style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", letterSpacing: "-0.03em" }}
        >
          <span className="text-white">Every day leaves</span>
          <br />
          <span className="text-[#5b80f5]">evidence.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* Left: step list */}
          <div className="flex flex-col">
            {evSteps.map((step, i) => (
              <div key={step.num}>
                <div className="flex items-center gap-4 py-2">
                  <span className="text-[0.72rem] font-semibold text-[#6b7280] tracking-wider min-w-[24px]">
                    {step.num}
                  </span>
                  <span className="text-[1rem] font-bold tracking-[0.05em] text-white uppercase">
                    {step.name}
                  </span>
                </div>
                {i < evSteps.length - 1 && (
                  <div className="relative ml-[11px]">
                    <div
                      className={`w-0.5 h-7 my-0.5 ${
                        i === 1 ? "bg-[#5b80f5]" : "bg-[#1e2030]"
                      }`}
                    />
                    {i === 1 && (
                      <div className="absolute -left-[3px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#5b80f5] shadow-[0_0_0_3px_rgba(91,128,245,0.25)]" />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right: GitHub commit card */}
          <div className="bg-[#131520] border border-[#1e2030] rounded-xl overflow-hidden mt-16">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1e2030]">
              <span className="font-mono text-[0.8rem] text-[#6b7280]">
                chhayakanta/abtalks-day12
              </span>
              <span className="bg-[rgba(91,128,245,0.15)] text-[#5b80f5] border border-[rgba(91,128,245,0.3)] px-3 py-0.5 rounded-full text-[0.72rem] font-semibold tracking-wide">
                main
              </span>
            </div>
            <div className="px-5 py-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-[#5b80f5] flex-shrink-0" />
                <span className="font-mono text-[0.92rem] font-semibold text-white">
                  feat: responsive dashboard layout
                </span>
              </div>
              <p className="font-mono text-[0.78rem] text-[#6b7280] pl-5">
                abc123f · 2 hours ago ·{" "}
                <span className="text-[#4ade80]">+248</span>{" "}
                <span className="text-[#f87171]">−31</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
