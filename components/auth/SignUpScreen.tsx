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

export default function SignUpScreen() {
  const {
    setScreen, goBack, email, setEmail,
    passwordSignUp, setPasswordSignUp,
    termsAccepted, setTermsAccepted,
    signUpError, setSignUpError,
    signUpLoading, setSignUpLoading, startResendTimer,
  } = useOnboarding();

  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSignUpError(null);
    if (!email || !email.includes("@")) { setLocalError("Please enter a valid email address."); return; }
    if (!passwordSignUp || passwordSignUp.length < 6) { setLocalError("Password must be at least 6 characters."); return; }
    if (!termsAccepted) { setLocalError("Please agree to the Terms of Service."); return; }
    setSignUpLoading(true);
    setTimeout(() => {
      setSignUpLoading(false);
      if (email.toLowerCase() === "error@example.com") {
        setLocalError("That email is already registered.");
      } else {
        startResendTimer();
        setScreen("EMAIL_VERIFICATION");
      }
    }, 1500);
  };

  const handleOAuthSelect = (provider: string) => {
    setSignUpLoading(true);
    setTimeout(() => {
      setSignUpLoading(false);
      setEmail(`oauth.${provider}@example.com`);
      setScreen("ONBOARDING");
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex h-screen w-screen overflow-hidden font-sans select-none">
      <BrandingPanel />

      {/* Right form panel — white */}
      <div className="flex-1 overflow-y-auto bg-white px-6 py-12 md:p-14 lg:p-20 flex flex-col justify-center items-center h-full relative">

        {/* Back button */}
        <button onClick={goBack}
          className="absolute top-6 left-6 flex items-center gap-1.5 text-[11px] font-medium text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer">
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>

        <div className="lg:hidden flex items-center gap-2 mb-10">
          <div className="w-5 h-5 text-zinc-900"><StarLogo /></div>
          <span className="text-[13px] font-semibold text-zinc-900 tracking-[-0.02em]">Spectrum AI</span>
        </div>

        <div className="w-full max-w-[360px] space-y-7">
          <div className="space-y-1.5">
            <h1 className="text-[28px] font-black text-zinc-900 tracking-[-0.04em] leading-[1.1]">
              Create an account
            </h1>
            <p className="text-zinc-400 text-[13px]">Start enhancing visuals with Spectrum AI — free.</p>
          </div>

          <OAuthRow onSelect={handleOAuthSelect} />

          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-px bg-zinc-200" />
            <span className="text-[11px] text-zinc-400 font-medium">or continue with email</span>
            <div className="flex-1 h-px bg-zinc-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-600 uppercase tracking-widest block">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" required
                className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl h-11 px-4 text-[13px] placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/20 transition-all" />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-600 uppercase tracking-widest block">Password</label>
              <PasswordInput value={passwordSignUp} onChange={setPasswordSignUp} showStrength={true} />
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2.5 pt-1">
              <div className="relative mt-0.5">
                <input type="checkbox" id="terms" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)}
                  className="sr-only" />
                <div onClick={() => setTermsAccepted(!termsAccepted)}
                  className={`w-4 h-4 rounded border-2 cursor-pointer flex items-center justify-center transition-all ${termsAccepted ? "bg-zinc-900 border-zinc-900" : "border-zinc-300 bg-white"}`}>
                  {termsAccepted && (
                    <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              </div>
              <label htmlFor="terms" className="text-[12px] text-zinc-500 cursor-pointer leading-relaxed" onClick={() => setTermsAccepted(!termsAccepted)}>
                I agree to the{" "}
                <a href="#" className="text-zinc-900 font-semibold hover:underline" onClick={e => e.stopPropagation()}>Terms of Service</a>
                {" "}and{" "}
                <a href="#" className="text-zinc-900 font-semibold hover:underline" onClick={e => e.stopPropagation()}>Privacy Policy</a>
              </label>
            </div>

            {(localError || signUpError) && (
              <div className="flex items-start gap-2 text-red-600 bg-red-50 border border-red-100 px-3.5 py-2.5 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="text-[12px] leading-normal">{localError || signUpError}</span>
              </div>
            )}

            <button type="submit" disabled={signUpLoading}
              className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 text-white font-bold uppercase tracking-widest text-[11px] rounded-full flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer mt-1">
              {signUpLoading
                ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Creating account...</span></>
                : <><span>Create Account</span><ArrowRight className="w-3.5 h-3.5" /></>
              }
            </button>
          </form>

          <p className="text-center text-[13px] text-zinc-400">
            Already have an account?{" "}
            <button onClick={() => setScreen("SIGN_IN")} className="text-zinc-900 font-semibold hover:underline cursor-pointer">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
