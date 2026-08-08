"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ArrowUpRight, Menu, X } from "lucide-react";

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");

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
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Track active section when on Landing Page (/)
      if (pathname === "/") {
        const challengeEl = document.getElementById("challenge");
        const showcaseEl = document.getElementById("showcase");

        const scrollPos = window.scrollY + 200;

        if (showcaseEl && scrollPos >= showcaseEl.offsetTop) {
          setActiveSection("showcase");
        } else if (challengeEl && scrollPos >= challengeEl.offsetTop) {
          setActiveSection("challenge");
        } else {
          setActiveSection("home");
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      ctx.revert();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  // Route-based active section fallback
  const currentActive =
    pathname === "/dashboard"
      ? "dashboard"
      : pathname?.startsWith("/day")
      ? "day12"
      : activeSection;

  const getLinkStyle = (key: string) => {
    const isActive = currentActive === key;
    return `nav-item text-xs tracking-wider transition-all px-3.5 py-1.5 rounded-lg cursor-pointer ${
      isActive
        ? "bg-[#3B82F6]/20 text-[#3B82F6] font-bold border border-[#3B82F6]/40 shadow-[0_0_15px_rgba(59,130,246,0.3)] scale-105"
        : "text-[#94A3B8] font-semibold hover:text-[#F8FAFC] hover:bg-slate-900/60"
    }`;
  };

  const scrollToSection = (id: string) => {
    if (pathname === "/") {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        setActiveSection(id);
      }
    }
  };

  return (
    <header
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "py-3 navbar-glass shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
          : "py-6 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex items-center justify-between">
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

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-2">
          <Link href="/" className={getLinkStyle("home")}>
            HOME
          </Link>
          <Link href="/dashboard" className={getLinkStyle("dashboard")}>
            DASHBOARD
          </Link>
          <Link href="/day/12" className={getLinkStyle("day12")}>
            DAY 12 TASK
          </Link>
          {pathname === "/" ? (
            <button
              onClick={() => scrollToSection("challenge")}
              className={getLinkStyle("challenge")}
            >
              CHALLENGE
            </button>
          ) : (
            <Link href="/#challenge" className={getLinkStyle("challenge")}>
              CHALLENGE
            </Link>
          )}
          {pathname === "/" ? (
            <button
              onClick={() => scrollToSection("showcase")}
              className={getLinkStyle("showcase")}
            >
              PLATFORM
            </button>
          ) : (
            <Link href="/#showcase" className={getLinkStyle("showcase")}>
              PLATFORM
            </Link>
          )}
        </nav>

        {/* CTA & Mobile Toggle */}
        <div className="nav-item flex items-center gap-3">
          <Link
            href="/dashboard"
            data-magnetic="true"
            className="relative group overflow-hidden px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-[linear-gradient(135deg,#2563EB,#1D4ED8)] text-white text-xs font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-300 flex items-center gap-1.5"
          >
            <span className="relative z-10">DASHBOARD</span>
            <ArrowUpRight className="w-3.5 h-3.5 relative z-10 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#3B82F6,#2563EB)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="md:hidden p-2 rounded-lg bg-[#07111F] border border-slate-800 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (390px Viewport) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#07111F]/95 backdrop-blur-2xl border-b border-slate-800 px-6 py-4 space-y-3 animate-fade-in">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block text-sm py-1.5 ${currentActive === "home" ? "font-bold text-[#3B82F6]" : "font-semibold text-slate-300 hover:text-white"}`}
          >
            Home Page
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className={`block text-sm py-1.5 ${currentActive === "dashboard" ? "font-bold text-[#3B82F6]" : "font-semibold text-slate-300 hover:text-white"}`}
          >
            Student Dashboard (/dashboard)
          </Link>
          <Link
            href="/day/12"
            onClick={() => setMobileMenuOpen(false)}
            className={`block text-sm py-1.5 ${currentActive === "day12" ? "font-bold text-[#3B82F6]" : "font-semibold text-slate-300 hover:text-white"}`}
          >
            Challenge Day (/day/12)
          </Link>
          {pathname === "/" ? (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                scrollToSection("challenge");
              }}
              className={`block text-sm py-1.5 text-left w-full ${currentActive === "challenge" ? "font-bold text-[#3B82F6]" : "font-semibold text-slate-300 hover:text-white"}`}
            >
              The Challenge
            </button>
          ) : (
            <Link
              href="/#challenge"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-300 hover:text-white py-1.5"
            >
              The Challenge
            </Link>
          )}
          {pathname === "/" ? (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                scrollToSection("showcase");
              }}
              className={`block text-sm py-1.5 text-left w-full ${currentActive === "showcase" ? "font-bold text-[#3B82F6]" : "font-semibold text-slate-300 hover:text-white"}`}
            >
              Platform Showcase
            </button>
          ) : (
            <Link
              href="/#showcase"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-300 hover:text-white py-1.5"
            >
              Platform Showcase
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
