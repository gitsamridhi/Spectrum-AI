"use client";

import React from "react";
import { User, Users } from "lucide-react";
import { useOnboarding } from "@/app/context/OnboardingContext";
import { useTheme } from "@/app/context/ThemeContext";

export default function ScreenSoloTeam() {
  const { answers, updateAnswers } = useOnboarding();
  const { T } = useTheme();

  const handleSelectType = (type: "solo" | "team") => {
    updateAnswers({
      workspaceType: type,
      teamSize: type === "solo" ? undefined : answers.teamSize || "2-5",
    });
  };

  const isSolo = answers.workspaceType === "solo";
  const isTeam = answers.workspaceType === "team";

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-[28px] md:text-[32px] font-black tracking-[-0.04em] leading-[1.1]" style={{ color: T.text }}>
          Solo or team?
        </h2>
        <p className="text-[14px]" style={{ color: T.textMuted }}>We'll customize your workspace accordingly.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2">
        <button onClick={() => handleSelectType("solo")}
          className={`flex flex-col items-center justify-center p-6 rounded-2xl border h-[148px] text-center transition-all duration-200 cursor-pointer ${
            isSolo ? "border-orange-400 bg-orange-50 shadow-md scale-[1.02]" : ""
          }`}
          style={!isSolo ? { borderColor: T.border, background: T.bg } : {}}>
          <div className="p-3 rounded-full mb-3"
            style={isSolo ? { background: '#FEF3C7' } : { background: T.bgCard }}>
            <User className="w-5 h-5" style={{ color: isSolo ? '#F97316' : T.textSub }} />
          </div>
          <span className="text-[13px] font-bold block"
            style={{ color: isSolo ? '#7C2D12' : T.text }}>Solo Workspace</span>
          <span className="text-[11px] mt-1"
            style={{ color: isSolo ? '#EA580C' : T.textMuted }}>Just me — personal projects</span>
        </button>

        <button onClick={() => handleSelectType("team")}
          className={`flex flex-col items-center justify-center p-6 rounded-2xl border h-[148px] text-center transition-all duration-200 cursor-pointer ${
            isTeam ? "border-orange-400 bg-orange-50 shadow-md scale-[1.02]" : ""
          }`}
          style={!isTeam ? { borderColor: T.border, background: T.bg } : {}}>
          <div className="p-3 rounded-full mb-3"
            style={isTeam ? { background: '#FEF3C7' } : { background: T.bgCard }}>
            <Users className="w-5 h-5" style={{ color: isTeam ? '#F97316' : T.textSub }} />
          </div>
          <span className="text-[13px] font-bold block"
            style={{ color: isTeam ? '#7C2D12' : T.text }}>Team Workspace</span>
          <span className="text-[11px] mt-1"
            style={{ color: isTeam ? '#EA580C' : T.textMuted }}>With others — shared creative hub</span>
        </button>
      </div>

      {answers.workspaceType === "team" && (
        <div className="pt-4 border-t animate-[fade-in_0.25s_ease-out]" style={{ borderColor: T.borderMuted }}>
          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-widest block" style={{ color: T.textSub }}>
              How large is your team?
            </label>
            <div className="relative">
              <select value={answers.teamSize || "2-5"} onChange={(e) => updateAnswers({ teamSize: e.target.value })}
                className="w-full h-11 rounded-xl px-4 text-[13px] focus:outline-none cursor-pointer appearance-none transition-all"
                style={{ background: T.inputBg, border: `1px solid ${T.border}`, color: T.text }}>
                <option value="2-5">2 – 5 members</option>
                <option value="6-15">6 – 15 members</option>
                <option value="16-50">16 – 50 members</option>
                <option value="50+">50+ members</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[10px]"
                style={{ color: T.textMuted }}>▼</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
