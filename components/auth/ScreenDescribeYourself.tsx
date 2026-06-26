"use client";

import React from "react";
import { useOnboarding } from "@/app/context/OnboardingContext";
import { useTheme } from "@/app/context/ThemeContext";

export default function ScreenDescribeYourself() {
  const { answers, updateAnswers } = useOnboarding();
  const { T } = useTheme();

  const roles = [
    { id: "freelance",         title: "Freelance Designer or Illustrator",     desc: "Clients, personal projects, creative work" },
    { id: "creative_director", title: "Creative Director / Art Director",       desc: "Brand strategy, campaigns, team leadership" },
    { id: "filmmaker",         title: "Filmmaker or Animator",                  desc: "Video production, motion, storytelling" },
    { id: "marketer",          title: "Marketing or Social Media Manager",      desc: "Content creation at scale" },
    { id: "product_designer",  title: "Product Designer or UX Designer",        desc: "UI, prototyping, user flows" },
    { id: "developer",         title: "Developer or Technical Creator",         desc: "Building with AI tools and APIs" },
    { id: "hobbyist",          title: "Hobbyist or Student",                    desc: "Learning and experimenting" },
    { id: "other",             title: "Other",                                  desc: "Something else entirely" },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-[28px] md:text-[32px] font-black tracking-[-0.04em] leading-[1.1]" style={{ color: T.text }}>
          How do you describe yourself?
        </h2>
        <p className="text-[14px]" style={{ color: T.textMuted }}>Choose the one that fits best.</p>
      </div>

      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
        {roles.map((role) => {
          const sel = answers.role === role.id;
          return (
            <button key={role.id} onClick={() => updateAnswers({ role: role.id })}
              className={`w-full flex items-center justify-between px-5 h-16 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                sel ? "border-orange-400 bg-orange-50 shadow-sm" : ""
              }`}
              style={!sel ? { borderColor: T.border, background: T.bg } : {}}>
              <div className="space-y-0.5">
                <p className="text-[13px] font-bold"
                  style={{ color: sel ? '#7C2D12' : T.text }}>{role.title}</p>
                <p className="text-[11px]"
                  style={{ color: sel ? '#EA580C' : T.textMuted }}>{role.desc}</p>
              </div>
              <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ml-4 transition-all"
                style={sel ? { borderColor: '#FB923C', background: '#FB923C' } : { borderColor: T.border }}>
                {sel && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
