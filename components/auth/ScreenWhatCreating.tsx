"use client";

import React from "react";
import { Camera, Video, Megaphone, Diamond, Clapperboard, Sparkles } from "lucide-react";
import { useOnboarding } from "@/app/context/OnboardingContext";
import { useTheme } from "@/app/context/ThemeContext";

const TILE_COLORS: Record<string, { bg: string; color: string }> = {
  images:       { bg: '#FDF2F8', color: '#BE185D' },
  videos:       { bg: '#EDE9FE', color: '#7C3AED' },
  marketing:    { bg: '#FFF7ED', color: '#EA580C' },
  brand:        { bg: '#EFF6FF', color: '#2563EB' },
  storytelling: { bg: '#F0FDF4', color: '#16A34A' },
  exploring:    { bg: '#FFFBEB', color: '#D97706' },
};

export default function ScreenWhatCreating() {
  const { answers, updateAnswers } = useOnboarding();
  const { isDark, T } = useTheme();

  const tiles = [
    { id: "images",       icon: <Camera className="w-5 h-5" />,      title: "Images & Illustrations",  desc: "Portraits, product shots, concept art" },
    { id: "videos",       icon: <Video className="w-5 h-5" />,        title: "Videos & Reels",           desc: "Short-form, cinematic, social" },
    { id: "marketing",    icon: <Megaphone className="w-5 h-5" />,    title: "Marketing Assets",         desc: "Ads, banners, social posts" },
    { id: "brand",        icon: <Diamond className="w-5 h-5" />,      title: "Brand Visuals",            desc: "Identity, style guides, brand kits" },
    { id: "storytelling", icon: <Clapperboard className="w-5 h-5" />, title: "Storytelling & Film",      desc: "Storyboards, character sheets" },
    { id: "exploring",    icon: <Sparkles className="w-5 h-5" />,     title: "Just exploring",           desc: "I'm new to AI enhancement" },
  ];

  const toggleSelect = (id: string) => {
    const current = [...answers.creating];
    updateAnswers({ creating: current.includes(id) ? current.filter(i => i !== id) : [...current, id] });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-[28px] md:text-[32px] font-black tracking-[-0.04em] leading-[1.1]" style={{ color: T.text }}>
          What will you be creating?
        </h2>
        <p className="text-[14px]" style={{ color: T.textMuted }}>Select all that apply — we'll tailor your experience.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {tiles.map(tile => {
          const sel = answers.creating.includes(tile.id);
          return (
            <button key={tile.id} onClick={() => toggleSelect(tile.id)}
              className={`relative flex flex-col justify-between items-start text-left p-5 rounded-2xl border h-[130px] w-full transition-all duration-200 cursor-pointer ${
                sel ? "border-orange-400 bg-orange-50 shadow-md scale-[1.01]" : ""
              }`}
              style={!sel ? { borderColor: T.border, background: T.bg } : {}}>
              <div className="flex justify-between items-center w-full">
                <div className="p-2 rounded-lg"
                  style={sel
                    ? { background: '#FEF3C7', color: '#F97316' }
                    : isDark
                      ? { background: (TILE_COLORS[tile.id]?.color ?? '#888') + '22', color: TILE_COLORS[tile.id]?.color ?? T.textMuted }
                      : { background: TILE_COLORS[tile.id]?.bg ?? T.bgCard, color: TILE_COLORS[tile.id]?.color ?? T.textMuted }}>
                  {tile.icon}
                </div>
                {sel && (
                  <div className="w-5 h-5 rounded-full bg-orange-400 flex items-center justify-center">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
              <div>
                <p className="text-[13px] font-bold leading-snug"
                  style={{ color: sel ? '#7C2D12' : T.text }}>{tile.title}</p>
                <p className="text-[11px] mt-0.5"
                  style={{ color: sel ? '#EA580C' : T.textMuted }}>{tile.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
