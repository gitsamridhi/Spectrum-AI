"use client";

import React, { useState } from "react";
import { ArrowLeft, KeyRound, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useOnboarding } from "@/app/context/OnboardingContext";
import { useTheme } from "@/app/context/ThemeContext";
import BrandingPanel from "./BrandingPanel";
import PasswordInput from "./PasswordInput";

export default function ForgotPasswordFlow() {
  const {
    currentScreen,
    setScreen,
    resetEmail,
    setResetEmail,
    newPassword,
    setNewPassword,
    confirmNewPassword,
    setConfirmNewPassword,
  } = useOnboarding();

  const { T } = useTheme();
  const [loading, setLoading] = useState(false);
  const [errorLocal, setErrorLocal] = useState<string | null>(null);

  const handleSendLink = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorLocal(null);

    if (!resetEmail || !resetEmail.includes("@")) {
      setErrorLocal("Please enter a valid work or personal email address.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setScreen("FORGOT_PASSWORD_2");
    }, 1200);
  };

  const handleSetNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorLocal(null);

    if (!newPassword || newPassword.length < 6) {
      setErrorLocal("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorLocal("Passwords do not match.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setScreen("FORGOT_PASSWORD_4");
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex h-screen w-screen overflow-hidden font-sans select-none"
      style={{ background: T.bg, color: T.text }}>
      {/* Reusable left panel */}
      <BrandingPanel />

      {/* Style block for envelope and float card transitions */}
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

      {/* Right panel with step switches */}
      <div className="flex-1 overflow-y-auto px-6 py-12 md:p-16 lg:p-24 flex flex-col justify-between items-center h-full relative"
        style={{ background: T.bg }}>
        
        {/* Back Link Top Left */}
        <div className="w-full text-left">
          <button
            onClick={() => setScreen("SIGN_IN")}
            className="text-xs font-mono flex items-center gap-2 transition-colors cursor-pointer bg-transparent border-none mt-2"
            style={{ color: T.textMuted }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </button>
        </div>

        {/* Dynamic Inner views */}
        <div className="w-full max-w-sm my-auto text-center space-y-6">

          {/* SCREEN 1: EMAIL INPUT FOR RESET LINK */}
          {currentScreen === "FORGOT_PASSWORD_1" && (
            <div className="space-y-6 text-left">
              <div className="space-y-2 text-center lg:text-left">
                <div className="mx-auto lg:mx-0 w-12 h-12 rounded-2xl flex items-center justify-center mb-1"
                  style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
                  <KeyRound className="w-5 h-5 text-violet-400" />
                </div>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: T.text }}>
                  Reset password
                </h1>
                <p className="text-xs" style={{ color: T.textMuted }}>
                  Enter your email address and we&apos;ll send a reset authorization link.
                </p>
              </div>

              <form onSubmit={handleSendLink} className="space-y-4 pt-1">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-wider uppercase font-bold block"
                    style={{ color: T.textMuted }}>
                    Work or personal email
                  </label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-xl h-11 px-4 text-sm focus:outline-none transition-all font-mono"
                    style={{ background: T.inputBg, border: `1px solid ${T.border}`, color: T.text }}
                    onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#7C3AED'}
                    onBlur={e =>  (e.target as HTMLInputElement).style.borderColor = T.border}
                  />
                </div>

                {errorLocal && (
                  <div className="flex items-start space-x-2 text-rose-500 bg-rose-950/20 border border-rose-950 px-3.5 py-2.5 rounded-xl">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="text-[11px] font-mono leading-normal">{errorLocal}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-violet-600 hover:bg-violet-500 font-bold uppercase tracking-widest text-[11px] text-white rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_4px_14px_rgba(124,58,237,0.3)]"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Send Reset Link</span>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* SCREEN 2: CONFIRMATION LAPSED ENVELOPE */}
          {currentScreen === "FORGOT_PASSWORD_2" && (
            <div className="space-y-8">
              {/* Animated illustration container */}
              <div className="relative flex justify-center mx-auto w-32 h-32 items-center rounded-2xl shadow-inner"
                style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
                <svg
                  className="w-20 h-20 overflow-visible"
                  viewBox="0 0 100 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="5" y="25" width="90" height="50" rx="6" fill="#1e1b4b" stroke="#312e81" strokeWidth="2" />
                  <g className="animate-letter">
                    <rect x="15" y="10" width="70" height="40" rx="3" fill="#f8fafc" />
                    <line x1="25" y1="20" x2="55" y2="20" stroke="#cbd5e1" strokeWidth="3" />
                    <line x1="25" y1="28" x2="75" y2="28" stroke="#cbd5e1" strokeWidth="2" />
                  </g>
                  <path d="M5 75 L50 48 L95 75" fill="none" stroke="#4338ca" strokeWidth="3" />
                  <polygon
                    points="5,25 50,55 95,25"
                    fill="#4f46e5"
                    stroke="#6366f1"
                    strokeWidth="2"
                    className="animate-flap"
                  />
                </svg>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: T.text }}>
                  Check your inbox
                </h1>
                <p className="text-xs px-4 mx-auto max-w-xs leading-normal" style={{ color: T.textMuted }}>
                  We sent a secure password reset link to <span className="font-mono text-violet-400 font-bold">{resetEmail || "your email"}</span>.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {/* Simulation button to trigger step 3 easily */}
                <button
                  onClick={() => setScreen("FORGOT_PASSWORD_3")}
                  className="w-full py-3 h-11 rounded-full bg-violet-600 hover:bg-violet-500 text-[10px] font-mono tracking-widest uppercase text-white font-extrabold cursor-pointer"
                >
                  Bypass & Set New Password ➔
                </button>
                <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: T.textMuted }}>
                  Select bypass to prototype the rest of the flow
                </p>
              </div>
            </div>
          )}

          {/* SCREEN 3: SET NEW PASSWORD FORM */}
          {currentScreen === "FORGOT_PASSWORD_3" && (
            <div className="space-y-6 text-left">
              <div className="space-y-1.5 text-center lg:text-left">
                <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-none" style={{ color: T.text }}>
                  Set new password
                </h1>
                <p className="text-xs" style={{ color: T.textMuted }}>
                  Choose a robust password to re-synchronize your studio environment.
                </p>
              </div>

              <form onSubmit={handleSetNewPassword} className="space-y-4 pt-2">
                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-wider uppercase font-bold block" style={{ color: T.textMuted }}>
                    New Password
                  </label>
                  <PasswordInput
                    value={newPassword}
                    onChange={setNewPassword}
                    showStrength={true}
                    id="new-password"
                  />
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-wider uppercase font-bold block" style={{ color: T.textMuted }}>
                    Confirm New Password
                  </label>
                  <PasswordInput
                    value={confirmNewPassword}
                    onChange={setConfirmNewPassword}
                    showStrength={false}
                    id="confirm-password"
                    placeholder="Confirm new password"
                  />
                </div>

                {errorLocal && (
                  <div className="flex items-start space-x-2 text-rose-500 bg-rose-950/20 border border-rose-950 px-3.5 py-2.5 rounded-xl">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="text-[11px] font-mono leading-normal">{errorLocal}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-violet-600 hover:bg-violet-500 font-bold uppercase tracking-widest text-[11px] text-white rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_4px_14px_rgba(124,58,237,0.3)]"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <span>Set New Password</span>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* SCREEN 4: SUCCESS CARD */}
          {currentScreen === "FORGOT_PASSWORD_4" && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/5 animate-[bounce_1.5s_infinite]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
              </div>

              <div className="space-y-1">
                <h1 className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: T.text }}>
                  Success!
                </h1>
                <p className="text-xs max-w-xs mx-auto leading-normal" style={{ color: T.textMuted }}>
                  Your password has been securely updated. Your credentials are now synchronized on the ledger node.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setScreen("SIGN_IN")}
                  className="w-full h-11 bg-violet-600 hover:bg-violet-500 font-bold uppercase tracking-widest text-[11px] text-white rounded-full flex items-center justify-center transition-all cursor-pointer shadow-[0_4px_14px_rgba(124,58,237,0.3)]"
                >
                  Sign In Now
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Spacer to align with branding panel */}
        <div className="h-8" />

      </div>
    </div>
  );
}
