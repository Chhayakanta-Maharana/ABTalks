"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Quote, Star } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote: "60 Days of ABTalks completely transformed my engineering career. I went from tutorial hell to landing a Senior Frontend role with a live portfolio.",
    author: "Alex Rivera",
    role: "Senior Frontend Engineer",
    company: "TechScale",
    avatar: "AR",
  },
  {
    quote: "The GitHub commit verification made me accountable. Building in public gave me instant recruiter visibility.",
    author: "Elena Rostova",
    role: "Full-Stack Developer",
    company: "SaaS Studio",
    avatar: "ER",
  },
  {
    quote: "The discipline of shipping something real every single day is unmatched. ABTalks is the ultimate builder incubator.",
    author: "Marcus Chen",
    role: "Product Architect",
    company: "DevFlow",
    avatar: "MC",
  },
];

export default function Testimonials() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".testi-card",
        { opacity: 0, y: 60, scale: 0.92, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative py-32 border-t border-[rgba(148,163,184,0.12)]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[2px] bg-[#3B82F6]" />
            <span className="text-xs font-bold tracking-[0.25em] text-[#94A3B8] uppercase">
              BUILDER TESTIMONIALS
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Transformed by daily execution.
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="testi-card p-8 rounded-2xl navy-card backdrop-blur-xl border border-[rgba(148,163,184,0.12)] flex flex-col justify-between group hover:border-[#3B82F6]/40 transition-all duration-300"
            >
              <div>
                <div className="flex items-center gap-1 text-[#F59E0B] mb-6">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-sm text-[#F8FAFC] leading-relaxed mb-8 italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-4 pt-6 border-t border-[rgba(148,163,184,0.1)]">
                <div className="w-10 h-10 rounded-full bg-[#2563EB]/20 border border-[#2563EB]/40 flex items-center justify-center font-bold text-xs text-[#3B82F6]">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{t.author}</h4>
                  <p className="text-[11px] text-[#94A3B8]">{t.role} · {t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
