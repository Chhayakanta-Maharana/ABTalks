"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ArrowUpRight } from "lucide-react";

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Entrance Animation
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".nav-item",
        { opacity: 0, y: -20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          delay: 0.2,
        }
      );
    }, navRef);

    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      ctx.revert();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "py-3 navy-glass border-b border-[rgba(148,163,184,0.12)] shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          : "py-6 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="nav-item flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-[linear-gradient(135deg,#2563EB,#0B1F3A)] p-[1px]">
            <div className="w-full h-full bg-[#030712] rounded-[7px] flex items-center justify-center font-black text-xs text-[#3B82F6] group-hover:text-white transition-colors">
              AB
            </div>
          </div>
          <span className="text-xs font-black tracking-[0.3em] text-[#F8FAFC] uppercase">
            ABTALKS
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#challenge"
            className="nav-item text-xs font-semibold tracking-wider text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
          >
            CHALLENGE
          </Link>
          <Link
            href="#loop"
            className="nav-item text-xs font-semibold tracking-wider text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
          >
            METHODOLOGY
          </Link>
          <Link
            href="#showcase"
            className="nav-item text-xs font-semibold tracking-wider text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
          >
            PLATFORM
          </Link>
          <Link
            href="#stats"
            className="nav-item text-xs font-semibold tracking-wider text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
          >
            METRICS
          </Link>
        </nav>

        {/* CTA */}
        <div className="nav-item flex items-center gap-4">
          <Link
            href="#cta"
            data-magnetic="true"
            className="relative group overflow-hidden px-5 py-2.5 rounded-lg bg-[linear-gradient(135deg,#2563EB,#1D4ED8)] text-white text-xs font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-300 flex items-center gap-1.5"
          >
            <span className="relative z-10">START 60 DAYS</span>
            <ArrowUpRight className="w-3.5 h-3.5 relative z-10 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#3B82F6,#2563EB)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        </div>
      </div>
    </header>
  );
}
