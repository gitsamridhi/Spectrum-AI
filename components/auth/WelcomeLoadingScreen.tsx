"use client";

import React, { useEffect, useState } from "react";
import { useOnboarding } from "@/app/context/OnboardingContext";

const StarLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
    <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
  </svg>
);

export default function WelcomeLoadingScreen() {
  const { answers, setScreen } = useOnboarding();
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);

  const phases = [
    "Preparing your workspace…",
    "Loading enhancement models…",
    "Almost ready…",
  ];

  const isTeam = answers.workspaceType === "team";
  const wsName = answers.workspaceName || (isTeam ? "your team" : "your workspace");
  const displayName = answers.displayName ? `Welcome, ${answers.displayName}.` : "Welcome to Spectrum AI.";

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(interval); return 100; }
        return prev + 3;
      });
    }, 50);

    const t1 = setTimeout(() => setPhase(1), 900);
    const t2 = setTimeout(() => setPhase(2), 1800);
    const t3 = setTimeout(() => setScreen("HOME_PERSONALISED"), 3000);

    return () => { clearInterval(interval); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [setScreen]);

  return (
    <div className="fixed inset-0 z-[1200] bg-[#050505] flex flex-col items-center justify-center font-sans overflow-hidden select-none">

      {/* Subtle radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-blue-600/5 blur-3xl" />
      </div>

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center gap-10 w-full max-w-sm px-8">

        {/* Logo */}
        <div className="w-12 h-12 text-white opacity-90">
          <StarLogo />
        </div>

        {/* Welcome text */}
        <div className="text-center space-y-1.5">
          <p className="text-white text-[22px] font-semibold tracking-[-0.03em] leading-snug">{displayName}</p>
          <p className="text-zinc-500 text-[13px]">Setting up {wsName}.</p>
        </div>

        {/* Skeleton loader — UI preview shimmer */}
        <div className="w-full space-y-3">
          {/* Top bar skeleton */}
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-zinc-800 animate-pulse shrink-0" />
            <div className="h-3 flex-1 rounded-full bg-zinc-800 animate-pulse" />
            <div className="h-3 w-12 rounded-full bg-zinc-800 animate-pulse" />
          </div>
          {/* Image placeholder */}
          <div className="w-full h-28 rounded-2xl bg-zinc-800 animate-pulse relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-700/40 to-transparent -translate-x-full animate-[shimmer_1.8s_infinite]" />
          </div>
          {/* Two column skeletons */}
          <div className="grid grid-cols-2 gap-2">
            <div className="h-16 rounded-xl bg-zinc-800 animate-pulse" />
            <div className="h-16 rounded-xl bg-zinc-800 animate-pulse" style={{ animationDelay: "150ms" }} />
          </div>
          {/* Bottom row */}
          <div className="flex gap-2">
            <div className="h-3 flex-1 rounded-full bg-zinc-800 animate-pulse" style={{ animationDelay: "80ms" }} />
            <div className="h-3 w-1/3 rounded-full bg-zinc-800 animate-pulse" style={{ animationDelay: "200ms" }} />
          </div>
        </div>

        {/* Phase copy + progress */}
        <div className="w-full space-y-3">
          <p className="text-center text-[12px] text-zinc-500 transition-all duration-500">{phases[phase]}</p>
          <div className="w-full h-[2px] bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}} />
    </div>
  );
}
