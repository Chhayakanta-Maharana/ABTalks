"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show on desktop pointers
    if (window.matchMedia("(pointer: coarse)").matches) return;

    setIsVisible(true);

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    const xTo = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3" });
    
    const dotXTo = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power2" });
    const dotYTo = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power2" });

    const handleMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      dotXTo(e.clientX);
      dotYTo(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.dataset.magnetic === "true"
      ) {
        gsap.to(cursor, {
          scale: 1.8,
          borderColor: "rgba(59, 130, 246, 0.6)",
          backgroundColor: "rgba(37, 99, 235, 0.15)",
          duration: 0.3,
        });
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.dataset.magnetic === "true"
      ) {
        gsap.to(cursor, {
          scale: 1,
          borderColor: "rgba(59, 130, 246, 0.35)",
          backgroundColor: "transparent",
          duration: 0.3,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-9 h-9 rounded-full border border-[rgba(59,130,246,0.35)] pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 backdrop-blur-[1px] transition-transform duration-100 ease-out hidden md:block"
        style={{ boxShadow: "0 0 20px rgba(37, 99, 235, 0.25)" }}
      />
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-[#3B82F6] pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden md:block"
        style={{ boxShadow: "0 0 10px #3B82F6" }}
      />
    </>
  );
}
