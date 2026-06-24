"use client";

import React, { useState } from "react";
import { AlertCircle, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { useOnboarding } from "@/app/context/OnboardingContext";
import BrandingPanel from "./BrandingPanel";
import OAuthRow from "./OAuthRow";
import PasswordInput from "./PasswordInput";

const StarLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
    <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
  </svg>
);

export default function SignInScreen() {
  const {
    setScreen, goBack, emailSignIn, setEmailSignIn,
    passwordSignIn, setPasswordSignIn,
    signInError, setSignInError,
    signInLoading, setSignInLoading, loginUser,
  } = useOnboarding();

  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSignInError(null);
    if (!emailSignIn || !emailSignIn.includes("@")) { setLocalError("Please enter a valid email address."); return; }
    if (!passwordSignIn) { setLocalError("Please enter your password."); return; }
    setSignInLoading(true);
    setTimeout(() => {
      setSignInLoading(false);
      if (emailSignIn.toLowerCase() === "error@example.com" || passwordSignIn === "wrong") {
        setLocalError("Incorrect email or password.");
      } else {
        loginUser(emailSignIn);
        setScreen("ONBOARDING");
      }
    }, 1200);
  };

  const handleOAuthSelect = (provider: string) => {
    setSignInLoading(true);
    setTimeout(() => {
      setSignInLoading(false);
      loginUser(`oauth.${provider}@example.com`);
      setScreen("ONBOARDING");
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex h-screen w-screen overflow-hidden font-sans select-none">
      {/* Left panel */}
      <BrandingPanel />

      {/* Right form panel — white/grey */}
      <div className="flex-1 overflow-y-auto bg-white px-6 py-12 md:p-14 lg:p-20 flex flex-col justify-center items-center h-full relative">

        {/* Back button — top left */}
        <button onClick={goBack}
          className="absolute top-6 left-6 flex items-center gap-1.5 text-[11px] font-medium text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer">
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <div className="w-5 h-5 text-zinc-900"><StarLogo /></div>
          <span className="text-[13px] font-semibold text-zinc-900 tracking-[-0.02em]">Spectrum AI</span>
        </div>

        <div className="w-full max-w-[360px] space-y-7">
          <div className="space-y-1.5">
            <h1 className="text-[28px] font-black text-zinc-900 tracking-[-0.04em] leading-[1.1]">
              Welcome back
            </h1>
            <p className="text-zinc-400 text-[13px]">Sign in to your Spectrum AI account</p>
          </div>

          {/* OAuth */}
          <OAuthRow onSelect={handleOAuthSelect} />

          {/* Divider */}
          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-px bg-zinc-200" />
            <span className="text-[11px] text-zinc-400 font-medium">or continue with email</span>
            <div className="flex-1 h-px bg-zinc-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-600 uppercase tracking-widest block">Email</label>
              <input
                type="email" value={emailSignIn} onChange={e => setEmailSignIn(e.target.value)}
                placeholder="you@example.com" required
                className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl h-11 px-4 text-[13px] placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/20 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-semibold text-zinc-600 uppercase tracking-widest block">Password</label>
                <button type="button" onClick={() => setScreen("FORGOT_PASSWORD_1")}
                  className="text-[11px] text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer font-medium">
                  Forgot password?
                </button>
              </div>
              <PasswordInput value={passwordSignIn} onChange={setPasswordSignIn} showStrength={false} />
            </div>

            {(localError || signInError) && (
              <div className="flex items-start gap-2 text-red-600 bg-red-50 border border-red-100 px-3.5 py-2.5 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="text-[12px] leading-normal">{localError || signInError}</span>
              </div>
            )}

            <button type="submit" disabled={signInLoading}
              className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white font-bold uppercase tracking-widest text-[11px] rounded-full flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer mt-2">
              {signInLoading
                ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Signing in...</span></>
                : <><span>Sign In</span><ArrowRight className="w-3.5 h-3.5" /></>
              }
            </button>
          </form>

          <p className="text-center text-[13px] text-zinc-400">
            Don't have an account?{" "}
            <button onClick={() => setScreen("SIGN_UP")} className="text-zinc-900 font-semibold hover:underline cursor-pointer">
              Create one free
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
