"use client";

import React from "react";
import { Sparkles, Compass, ShieldAlert, Award } from "lucide-react";
import { useOnboarding } from "@/app/context/OnboardingContext";
import { useTheme } from "@/app/context/ThemeContext";

export default function ScreenExperiences() {
  const { answers, updateAnswers } = useOnboarding();
  const { isDark, T } = useTheme();

  const stops = [
    { value: 0, label: "Just starting", desc: "I've never tried AI generation before", icon: <Sparkles className="w-4 h-4" /> },
    { value: 1, label: "Curious",        desc: "I've tried a few tools but I'm still learning", icon: <Compass className="w-4 h-4" /> },
    { value: 2, label: "Comfortable",    desc: "I use AI tools regularly", icon: <ShieldAlert className="w-4 h-4" /> },
    { value: 3, label: "Expert",          desc: "I know prompts, models, and parameters inside out", icon: <Award className="w-4 h-4" /> },
  ];

  const currentLevel = answers.experienceLevel;
  const currentStop = stops[currentLevel] || stops[1];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-[28px] md:text-[32px] font-black tracking-[-0.04em] leading-[1.1]" style={{ color: T.text }}>
          Your AI experience level?
        </h2>
        <p className="text-[14px]" style={{ color: T.textMuted }}>Slide or click to specify your level.</p>
      </div>

      <div className="space-y-8 py-2">
        {/* Active card */}
        <div className="p-5 rounded-2xl flex items-center gap-4 h-[90px] transition-all duration-300"
          style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: T.text, color: T.bg }}>
            {currentStop.icon}
          </div>
          <div className="space-y-1 text-left">
            <h4 className="text-[12px] font-bold uppercase tracking-widest leading-none" style={{ color: T.text }}>
              {currentStop.label}
            </h4>
            <p className="text-[12px] leading-normal" style={{ color: T.textMuted }}>{currentStop.desc}</p>
          </div>
        </div>

        {/* Slider */}
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[3px] rounded-full"
              style={{ background: T.bgCard }} />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[3px] bg-orange-400 rounded-full transition-all duration-300"
              style={{ width: `${(currentLevel / 3) * 100}%` }} />
            <div className="relative flex justify-between">
              {stops.map((stop) => {
                const isActive = stop.value <= currentLevel;
                const isSelected = stop.value === currentLevel;
                return (
                  <button key={stop.value} onClick={() => updateAnswers({ experienceLevel: stop.value })}
                    className="relative focus:outline-none" type="button">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${
                      isSelected ? "scale-110 shadow-md" : ""
                    }`}
                      style={isSelected
                        ? { background: '#FB923C', borderColor: '#FB923C' }
                        : isActive
                          ? { background: '#FED7AA', borderColor: '#FDBA74' }
                          : { background: T.bg, borderColor: T.border }}>
                      <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : "bg-transparent"}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider select-none">
            {["Novice", "Curious", "Regular", "Pro"].map((l, i) => (
              <span key={l} style={{ color: currentLevel === i ? T.text : T.textMuted }}>{l}</span>
            ))}
          </div>
        </div>

        {/* Info chip */}
        <div className="px-4 py-3 rounded-xl text-[12px] text-center leading-normal"
          style={{ background: T.bgSub, border: `1px solid ${T.border}`, color: T.textMuted }}>
          {currentLevel === 0 && "Beginner templates & guided prompts will be enabled for you."}
          {currentLevel === 1 && "Foundational blueprints & model tutorial cards loaded."}
          {currentLevel === 2 && "Full production pipelines & advanced configurations available."}
          {currentLevel === 3 && "High-density parameters & sidebar prompt logs active by default."}
        </div>
      </div>
    </div>
  );
}
