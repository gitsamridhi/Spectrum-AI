"use client";

import React from "react";
import { Camera, Video, Megaphone, Diamond, Clapperboard, Sparkles } from "lucide-react";
import { useOnboarding } from "@/app/context/OnboardingContext";

export default function ScreenWhatCreating() {
  const { answers, updateAnswers } = useOnboarding();

  const tiles = [
    { id: "images", icon: <Camera className="w-5 h-5" />, title: "Images & Illustrations", desc: "Portraits, product shots, concept art" },
    { id: "videos", icon: <Video className="w-5 h-5" />, title: "Videos & Reels", desc: "Short-form, cinematic, social" },
    { id: "marketing", icon: <Megaphone className="w-5 h-5" />, title: "Marketing Assets", desc: "Ads, banners, social posts" },
    { id: "brand", icon: <Diamond className="w-5 h-5" />, title: "Brand Visuals", desc: "Identity, style guides, brand kits" },
    { id: "storytelling", icon: <Clapperboard className="w-5 h-5" />, title: "Storytelling & Film", desc: "Storyboards, character sheets" },
    { id: "exploring", icon: <Sparkles className="w-5 h-5" />, title: "Just exploring", desc: "I'm new to AI enhancement" },
  ];

  const toggleSelect = (id: string) => {
    const current = [...answers.creating];
    updateAnswers({ creating: current.includes(id) ? current.filter(i => i !== id) : [...current, id] });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-[28px] md:text-[32px] font-black text-zinc-900 tracking-[-0.04em] leading-[1.1]">
          What will you be creating?
        </h2>
        <p className="text-zinc-400 text-[14px]">Select all that apply — we'll tailor your experience.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {tiles.map(tile => {
          const sel = answers.creating.includes(tile.id);
          return (
            <button key={tile.id} onClick={() => toggleSelect(tile.id)}
              className={`relative flex flex-col justify-between items-start text-left p-5 rounded-2xl border h-[130px] w-full transition-all duration-200 cursor-pointer ${
                sel ? "border-zinc-900 bg-zinc-900 shadow-lg scale-[1.01]" : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
              }`}>
              <div className="flex justify-between items-center w-full">
                <div className={`p-2 rounded-lg ${sel ? "bg-white/10 text-white" : "bg-zinc-100 text-zinc-500"}`}>
                  {tile.icon}
                </div>
                {sel && (
                  <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="#09090b" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
              <div>
                <p className={`text-[13px] font-bold leading-snug ${sel ? "text-white" : "text-zinc-900"}`}>{tile.title}</p>
                <p className={`text-[11px] mt-0.5 ${sel ? "text-white/60" : "text-zinc-400"}`}>{tile.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
