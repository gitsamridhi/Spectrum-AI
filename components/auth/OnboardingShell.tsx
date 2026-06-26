"use client";

import React from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useOnboarding } from "@/app/context/OnboardingContext";
import { useTheme } from "@/app/context/ThemeContext";

import ScreenWhatCreating from "./ScreenWhatCreating";
import ScreenDescribeYourself from "./ScreenDescribeYourself";
import ScreenSoloTeam from "./ScreenSoloTeam";
import ScreenExperiences from "./ScreenExperiences";
import ScreenHowFound from "./ScreenHowFound";
import ScreenSetupWorkspace from "./ScreenSetupWorkspace";

export default function OnboardingShell() {
  const { onboardingStep, setOnboardingStep, setScreen } = useOnboarding();
  const { T } = useTheme();

  const handleNext = () => {
    if (onboardingStep === 6) setScreen("WELCOME_LOADING");
    else setOnboardingStep(onboardingStep + 1);
  };

  const handleBack = () => {
    if (onboardingStep > 1) setOnboardingStep(onboardingStep - 1);
  };

  const handleSkipAll = () => setScreen("WELCOME_LOADING");

  const renderStepScreen = () => {
    switch (onboardingStep) {
      case 1: return <ScreenWhatCreating />;
      case 2: return <ScreenDescribeYourself />;
      case 3: return <ScreenSoloTeam />;
      case 4: return <ScreenExperiences />;
      case 5: return <ScreenHowFound />;
      case 6: return <ScreenSetupWorkspace />;
      default: return <ScreenWhatCreating />;
    }
  };

  const progressPct = ((onboardingStep - 1) / 5) * 100;

  return (
    <div className="fixed inset-0 z-[1100] flex flex-col font-sans select-none overflow-hidden"
      style={{ background: T.bg }}>

      {/* Progress bar */}
      <div className="h-1 shrink-0" style={{ background: T.bgCard }}>
        <div className="h-full transition-all duration-500 ease-out" style={{ width: `${progressPct}%`, background: 'linear-gradient(to right, #FFB347, #FF7000)' }} />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 shrink-0">
        <div className="w-24">
          {onboardingStep > 1 && (
            <button onClick={handleBack}
              className="text-[12px] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              style={{ color: T.textMuted }}>
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          )}
        </div>

        <div className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: T.textMuted }}>
          {onboardingStep} / 6
        </div>

        <div className="w-24 text-right">
          <button onClick={handleSkipAll}
            className="text-[12px] font-medium transition-colors cursor-pointer"
            style={{ color: T.textMuted }}>
            Skip all
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-6 py-4 overflow-y-auto">
        <div className="w-full max-w-[600px]">
          <div className="mb-8">
            {renderStepScreen()}
          </div>

          <button onClick={handleNext}
            className="w-full h-12 text-white rounded-full flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-[11px] transition-all cursor-pointer hover:opacity-90"
            style={{ background: 'linear-gradient(to right, #FFB347, #FF7000)' }}>
            <span>{onboardingStep === 6 ? "Go to Spectrum AI →" : "Continue"}</span>
            {onboardingStep < 6 && <ChevronRight className="w-4 h-4" />}
          </button>

          <div className="text-center mt-4">
            <button onClick={handleNext}
              className="text-[12px] transition-colors cursor-pointer"
              style={{ color: T.textMuted }}>
              Skip this question
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
