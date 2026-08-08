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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    }

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
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      ctx.revert();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("isLoggedIn");
      setIsLoggedIn(false);
      window.location.href = "/";
    }
  };

  const isHome = pathname === "/";
  const isGuidelines = pathname === "/guidelines";
  const isChallenges = pathname === "/challenges";

  const getLinkStyle = (active: boolean) => {
    return `nav-item text-xs tracking-wider transition-all px-3.5 py-1.5 rounded-lg cursor-pointer outline-none focus:outline-none border-0 ${
      active
        ? "bg-[#3B82F6]/25 text-[#3B82F6] font-bold shadow-[0_0_15px_rgba(59,130,246,0.25)] scale-105"
        : "text-[#94A3B8] font-semibold hover:text-[#F8FAFC] hover:bg-slate-900/60"
    }`;
  };

  const getMobileLinkStyle = (active: boolean) => {
    return `block text-sm py-2 px-3 rounded-lg text-left w-full transition-all ${
      active
        ? "bg-[#3B82F6]/20 text-[#3B82F6] font-bold border border-[#3B82F6]/30"
        : "font-semibold text-slate-300 hover:text-white hover:bg-slate-900/60"
    }`;
  };

  return (
    <header
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 outline-none focus:outline-none border-none ${
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

        {/* Desktop Nav Links: HOME, GUIDELINES, CHALLENGES, PLATFORM */}
        <nav className="hidden md:flex items-center gap-2">
          <Link href="/" className={getLinkStyle(isHome)}>
            HOME
          </Link>

          <Link href="/guidelines" className={getLinkStyle(isGuidelines)}>
            GUIDELINES
          </Link>

          <Link href="/challenges" className={getLinkStyle(isChallenges)}>
            CHALLENGES
          </Link>

          <Link href="/#showcase" className={getLinkStyle(false)}>
            PLATFORM
          </Link>
        </nav>

        {/* CTA & Mobile Toggle */}
        <div className="nav-item flex items-center gap-2 sm:gap-3">
          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                data-magnetic="true"
                className="relative group overflow-hidden px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-[linear-gradient(135deg,#2563EB,#1D4ED8)] text-white text-xs font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-300 flex items-center gap-1.5"
              >
                <span className="relative z-10">DASHBOARD</span>
                <ArrowUpRight className="w-3.5 h-3.5 relative z-10 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                <div className="absolute inset-0 bg-[linear-gradient(135deg,#3B82F6,#2563EB)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
              <button
                onClick={handleLogout}
                title="Sign out"
                className="px-2.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-400 hover:text-white hover:border-slate-700 transition-all hidden sm:inline-block"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              data-magnetic="true"
              className="relative group overflow-hidden px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-[linear-gradient(135deg,#2563EB,#1D4ED8)] text-white text-xs font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-300 flex items-center gap-1.5"
            >
              <span className="relative z-10">LOGIN</span>
              <ArrowUpRight className="w-3.5 h-3.5 relative z-10 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#3B82F6,#2563EB)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          )}

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
        <div className="md:hidden bg-[#07111F]/95 backdrop-blur-2xl border-b border-slate-800 px-5 py-4 space-y-2 animate-fade-in">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={getMobileLinkStyle(isHome)}
          >
            Home
          </Link>

          <Link
            href="/guidelines"
            onClick={() => setMobileMenuOpen(false)}
            className={getMobileLinkStyle(isGuidelines)}
          >
            Guidelines
          </Link>

          <Link
            href="/challenges"
            onClick={() => setMobileMenuOpen(false)}
            className={getMobileLinkStyle(isChallenges)}
          >
            Challenges
          </Link>

          <Link
            href="/#showcase"
            onClick={() => setMobileMenuOpen(false)}
            className={getMobileLinkStyle(false)}
          >
            Platform
          </Link>
        </div>
      )}
    </header>
  );
}
