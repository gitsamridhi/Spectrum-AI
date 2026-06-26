"use client";

import React, { useState } from "react";
import { Mail, RefreshCw, ArrowLeft } from "lucide-react";
import { useOnboarding } from "@/app/context/OnboardingContext";
import { useTheme } from "@/app/context/ThemeContext";
import BrandingPanel from "./BrandingPanel";

export default function EmailVerificationScreen() {
  const {
    setScreen,
    email,
    resendCountdown,
    startResendTimer,
  } = useOnboarding();
  const { T } = useTheme();

  const [notification, setNotification] = useState<string | null>(null);

  const handleResend = () => {
    if (resendCountdown > 0) return;
    startResendTimer();
    setNotification("A fresh activation link has been sent to your server.");
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex h-screen w-screen overflow-hidden font-sans select-none"
      style={{ background: T.bg, color: T.text }}>
      {/* Branding left panel continues */}
      <BrandingPanel />

      {/* Right panel: Verification panel */}
      <div className="flex-1 overflow-y-auto px-6 py-12 md:p-16 lg:p-24 flex flex-col justify-between items-center h-full relative"
        style={{ background: T.bg }}>
        
        {/* Style block for Envelope flap animation */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes open-flap {
            0%, 100% { transform: rotateX(0deg); }
            50% { transform: rotateX(-140deg); }
          }
          @keyframes float-letter {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
          .animate-flap {
            animation: open-flap 4s ease-in-out infinite;
            transform-origin: top;
          }
          .animate-letter {
            animation: float-letter 4s ease-in-out infinite;
          }
        `}} />

        {/* Back Link Top Left */}
        <div className="w-full text-left">
          <button
            onClick={() => setScreen("SIGN_UP")}
            className="text-xs font-mono flex items-center gap-2 transition-colors cursor-pointer bg-transparent border-none mt-2"
            style={{ color: T.textMuted }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign Up</span>
          </button>
        </div>

        {/* Dynamic Center Card - Section 02.4 */}
        <div className="w-full max-w-sm my-auto text-center space-y-8">
          
          {/* Animated Envelope Illustration */}
          <div className="relative flex justify-center mx-auto w-32 h-32 items-center rounded-2xl shadow-inner"
            style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
            <svg
              className="w-20 h-20 overflow-visible"
              viewBox="0 0 100 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Back & Sides of Mail Container */}
              <rect x="5" y="25" width="90" height="50" rx="6" fill="#1e1b4b" stroke="#312e81" strokeWidth="2" />
              
              {/* Floating Letter (Middle) */}
              <g className="animate-letter">
                <rect x="15" y="10" width="70" height="40" rx="3" fill="#f8fafc" />
                <line x1="25" y1="20" x2="55" y2="20" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" />
                <line x1="25" y1="28" x2="75" y2="28" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
                <line x1="25" y1="36" x2="65" y2="36" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
              </g>

              {/* Front flap diagonals */}
              <path d="M5 75 L50 48 L95 75" fill="none" stroke="#4338ca" strokeWidth="3" strokeLinejoin="round" />

              {/* Animated Top Flap */}
              <polygon
                points="5,25 50,55 95,25"
                fill="#4f46e5"
                stroke="#6366f1"
                strokeWidth="2"
                className="animate-flap"
                style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.4))" }}
              />
            </svg>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: T.text }}>
              Check your inbox
            </h1>
            <p className="text-xs leading-relaxed max-w-xs mx-auto" style={{ color: T.textMuted }}>
              We sent a verification link to <span className="font-mono text-violet-400 font-bold bg-violet-950/35 px-1.5 py-0.5 rounded border border-violet-900/40 text-[11px]">{email || "you@example.com"}</span>. Click it to activate your account.
            </p>
          </div>

          {/* Verification link actions */}
          <div className="space-y-4 pt-2">
            {/* Countdown / Resend trigger */}
            {resendCountdown > 0 ? (
              <div className="text-[11px] font-mono font-bold uppercase tracking-widest py-3 rounded-full flex items-center justify-center gap-2"
                style={{ color: T.textMuted, background: T.bgCard, border: `1px solid ${T.border}` }}>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ color: T.textMuted }} />
                Resend window locked: {resendCountdown}s
              </div>
            ) : (
              <button
                onClick={handleResend}
                className="w-full text-[11px] font-mono font-black text-center uppercase tracking-widest text-violet-400 hover:text-violet-500 hover:border-violet-500/50 py-3 rounded-full hover:bg-violet-500/5 cursor-pointer transition-all"
                style={{ background: T.bgCard, border: `1px solid ${T.border}` }}
              >
                Didn&apos;t get it? Resend email
              </button>
            )}

            {/* Simulated verification skip helper for high interactive preview index */}
            <button
              onClick={() => {
                setScreen("ONBOARDING");
              }}
              className="w-full py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-[11px] font-extrabold uppercase tracking-widest text-white cursor-pointer shadow-[0_4px_14px_rgba(124,58,237,0.30)] flex items-center justify-center gap-1"
            >
              Skip and Enter Onboarding ➔
            </button>
          </div>

          {/* Toast feedback */}
          {notification && (
            <div className="text-[11px] font-mono font-bold text-center text-emerald-400 uppercase tracking-widest animate-pulse max-w-xs mx-auto">
              ✓ {notification}
            </div>
          )}

        </div>

        {/* Use a different email links - section 02.4 */}
        <div className="mt-8 font-medium">
          <button
            onClick={() => setScreen("SIGN_UP")}
            className="text-xs hover:underline transition-colors tracking-wide bg-transparent border-none cursor-pointer"
            style={{ color: T.textMuted }}
          >
            Use a different email
          </button>
        </div>

      </div>
    </div>
  );
}
