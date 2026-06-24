"use client";

import React from "react";
import { User, Users } from "lucide-react";
import { useOnboarding } from "@/app/context/OnboardingContext";

export default function ScreenSoloTeam() {
  const { answers, updateAnswers } = useOnboarding();

  const handleSelectType = (type: "solo" | "team") => {
    updateAnswers({
      workspaceType: type,
      teamSize: type === "solo" ? undefined : answers.teamSize || "2-5",
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-[28px] md:text-[32px] font-black text-zinc-900 tracking-[-0.04em] leading-[1.1]">
          Solo or team?
        </h2>
        <p className="text-zinc-400 text-[14px]">We'll customize your workspace accordingly.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2">
        <button onClick={() => handleSelectType("solo")}
          className={`flex flex-col items-center justify-center p-6 rounded-2xl border h-[148px] text-center transition-all duration-200 cursor-pointer ${
            answers.workspaceType === "solo"
              ? "border-zinc-900 bg-zinc-900 shadow-lg scale-[1.02]"
              : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
          }`}>
          <div className={`p-3 rounded-full mb-3 ${answers.workspaceType === "solo" ? "bg-white/10" : "bg-zinc-100"}`}>
            <User className={`w-5 h-5 ${answers.workspaceType === "solo" ? "text-white" : "text-zinc-500"}`} />
          </div>
          <span className={`text-[13px] font-bold block ${answers.workspaceType === "solo" ? "text-white" : "text-zinc-900"}`}>Solo Workspace</span>
          <span className={`text-[11px] mt-1 ${answers.workspaceType === "solo" ? "text-white/60" : "text-zinc-400"}`}>Just me — personal projects</span>
        </button>

        <button onClick={() => handleSelectType("team")}
          className={`flex flex-col items-center justify-center p-6 rounded-2xl border h-[148px] text-center transition-all duration-200 cursor-pointer ${
            answers.workspaceType === "team"
              ? "border-zinc-900 bg-zinc-900 shadow-lg scale-[1.02]"
              : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
          }`}>
          <div className={`p-3 rounded-full mb-3 ${answers.workspaceType === "team" ? "bg-white/10" : "bg-zinc-100"}`}>
            <Users className={`w-5 h-5 ${answers.workspaceType === "team" ? "text-white" : "text-zinc-500"}`} />
          </div>
          <span className={`text-[13px] font-bold block ${answers.workspaceType === "team" ? "text-white" : "text-zinc-900"}`}>Team Workspace</span>
          <span className={`text-[11px] mt-1 ${answers.workspaceType === "team" ? "text-white/60" : "text-zinc-400"}`}>With others — shared creative hub</span>
        </button>
      </div>

      {answers.workspaceType === "team" && (
        <div className="pt-4 border-t border-zinc-100 animate-[fade-in_0.25s_ease-out]">
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-zinc-600 uppercase tracking-widest block">
              How large is your team?
            </label>
            <div className="relative">
              <select value={answers.teamSize || "2-5"} onChange={(e) => updateAnswers({ teamSize: e.target.value })}
                className="w-full h-11 bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl px-4 text-[13px] focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/20 cursor-pointer appearance-none transition-all">
                <option value="2-5">2 – 5 members</option>
                <option value="6-15">6 – 15 members</option>
                <option value="16-50">16 – 50 members</option>
                <option value="50+">50+ members</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 text-[10px]">▼</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
