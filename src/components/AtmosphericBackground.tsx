"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function AtmosphericBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Floating ambient lighting spots animation
      gsap.to(".ambient-spot-1", {
        x: "random(-100, 100)",
        y: "random(-80, 80)",
        scale: "random(0.9, 1.2)",
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".ambient-spot-2", {
        x: "random(-120, 120)",
        y: "random(-90, 90)",
        scale: "random(0.8, 1.3)",
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-40" />

      {/* Atmospheric Radial Lights */}
      <div className="ambient-spot-1 absolute -top-40 left-1/4 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.14)_0%,transparent_70%)] blur-3xl pointer-events-none" />
      
      <div className="ambient-spot-2 absolute top-1/2 -right-40 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(11,31,58,0.4)_0%,rgba(3,7,18,0)_75%)] blur-3xl pointer-events-none" />
      
      <div className="absolute bottom-0 left-1/3 w-[900px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.08)_0%,transparent_70%)] blur-3xl pointer-events-none" />
    </div>
  );
}
