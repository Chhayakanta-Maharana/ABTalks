"use client";

const timeline = [
  { day: "DAY 01", text: "You don't need to be ready." },
  { day: "DAY 15", text: "Your GitHub starts telling a story." },
  { day: "DAY 30", text: "Consistency becomes a habit." },
  { day: "DAY 45", text: "Your work starts getting noticed." },
  { day: "DAY 60", text: "You didn't just learn. You built." },
];

const closing = ["YOU SHOWED UP.", "YOU BUILT.", "YOU SHIPPED."];

export default function TransformationSection() {
  return (
    <section className="border-t border-[#1e2030] py-32">
      <div className="max-w-[820px] mx-auto px-8">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-6">
          <span className="w-7 h-0.5 bg-[#5b80f5]" />
          <span className="text-[0.75rem] font-semibold tracking-[0.2em] text-[#6b7280] uppercase">
            60-DAY TRANSFORMATION
          </span>
        </div>

        <h2
          className="font-extrabold text-white leading-[1.1] mb-16"
          style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)", letterSpacing: "-0.03em" }}
        >
          What changes<br />along the way.
        </h2>

        {/* Timeline */}
        <div className="relative pl-10 mb-24">
          {/* Vertical line */}
          <div
            className="absolute left-[7px] top-0 bottom-0 w-0.5 rounded-full"
            style={{ background: "linear-gradient(to bottom, #5b80f5, transparent)" }}
          />
          {timeline.map((item, i) => (
            <div key={item.day} className={`relative ${i < timeline.length - 1 ? "pb-12" : ""}`}>
              {/* Dot */}
              <div className="absolute -left-[1.9rem] top-1 w-2.5 h-2.5 rounded-full border-2 border-[#5b80f5] bg-[#09090b]" />
              <span className="block text-[0.7rem] font-bold tracking-[0.18em] text-[#5b80f5] uppercase mb-2">
                {item.day}
              </span>
              <p className="text-[1.1rem] font-semibold text-white leading-snug">{item.text}</p>
            </div>
          ))}
        </div>

        {/* Bold closing lines */}
        <div className="flex flex-col">
          {closing.map((line, i) => (
            <div
              key={line}
              className={`font-black text-white py-5 border-t border-[#1e2030] ${
                i === closing.length - 1 ? "border-b border-[#1e2030]" : ""
              }`}
              style={{ fontSize: "clamp(2rem, 5vw, 4rem)", letterSpacing: "-0.02em" }}
            >
              {line}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
