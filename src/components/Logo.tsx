import React from "react";

interface LogoProps {
  className?: string;
  size?: number;
}

export default function Logo({ className = "w-8 h-8", size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="abLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#F1F5F9" />
          <stop offset="75%" stopColor="#CBD5E1" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>
        <radialGradient id="abBgGlow" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor="#0F172A" />
          <stop offset="60%" stopColor="#030712" />
          <stop offset="100%" stopColor="#000000" />
        </radialGradient>
      </defs>

      <rect width="512" height="512" rx="100" fill="url(#abBgGlow)" />
      <rect
        width="510"
        height="510"
        x="1"
        y="1"
        rx="99"
        fill="none"
        stroke="#1E293B"
        strokeWidth="2"
        opacity="0.6"
      />

      <g transform="translate(6, 0)">
        <path
          fill="url(#abLogoGrad)"
          fillRule="evenodd"
          d="M 98 392 L 203 117 L 323 117 C 373 117 407 147 407 192 C 407 224 387 244 352 252 C 397 262 422 289 422 332 C 422 377 387 392 323 392 Z M 213 252 L 153 392 L 108 392 L 198 187 Z M 213 162 L 248 232 L 213 232 Z M 253 147 L 318 147 C 343 147 367 160 367 187 C 367 214 343 227 318 227 L 253 227 Z M 253 262 L 323 262 C 353 262 382 277 382 312 C 382 347 353 362 323 362 L 253 362 Z"
        />
      </g>
    </svg>
  );
}
