"use client";

import React, { useRef, useEffect } from "react";
import { useOnboarding } from "@/app/context/OnboardingContext";

export default function ScreenHowFound() {
  const { answers, updateAnswers } = useOnboarding();
  const otherInputRef = useRef<HTMLInputElement>(null);

  const channels = [
    { id: "search", label: "Search engine (Google, Bing, etc.)" },
    { id: "social", label: "Social media (Instagram, X / Twitter, TikTok)" },
    { id: "youtube", label: "YouTube video or tutorial" },
    { id: "recommendation", label: "Friend or colleague recommendation" },
    { id: "community", label: "Designer / developer community (Reddit, Discord)" },
    { id: "newsletter", label: "Newsletter or email" },
    { id: "podcast", label: "Podcast or article" },
    { id: "comparison", label: "AI tools comparison site" },
    { id: "event", label: "Attended an event or webinar" },
    { id: "influencer", label: "Influencer or creator I follow" },
    { id: "freepik", label: "I've used Magnific AI / Freepik before" },
    { id: "other", label: "Other" },
  ];

  const handleSelectChannel = (id: string) => {
    updateAnswers({ howFound: id, howFoundOther: id === "other" ? answers.howFoundOther || "" : undefined });
  };

  useEffect(() => {
    if (answers.howFound === "other" && otherInputRef.current) {
      otherInputRef.current.focus();
    }
  }, [answers.howFound]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-[28px] md:text-[32px] font-black text-zinc-900 tracking-[-0.04em] leading-[1.1]">
          How did you find us?
        </h2>
        <p className="text-zinc-400 text-[14px]">This helps us reach more creators like you.</p>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {channels.map((ch) => {
          const sel = answers.howFound === ch.id;
          return (
            <button key={ch.id} onClick={() => handleSelectChannel(ch.id)}
              className={`w-full flex items-center justify-between px-5 h-12 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                sel ? "border-orange-400 bg-orange-50" : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
              }`}>
              <span className={`text-[13px] font-semibold ${sel ? "text-orange-900" : "text-zinc-700"}`}>{ch.label}</span>
              <div className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                sel ? "border-orange-400 bg-orange-400" : "border-zinc-300"
              }`}>
                {sel && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </button>
          );
        })}
      </div>

      {answers.howFound === "other" && (
        <div className="space-y-2 pt-3 border-t border-zinc-100 animate-[fade-in_0.25s_ease-out]">
          <label className="text-[11px] font-semibold text-zinc-600 uppercase tracking-widest block">Please specify</label>
          <input ref={otherInputRef} type="text" value={answers.howFoundOther || ""}
            onChange={(e) => updateAnswers({ howFoundOther: e.target.value })}
            placeholder="Tell us how you found Spectrum AI..."
            className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl h-11 px-4 text-[13px] placeholder-zinc-400 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400/20 transition-all" />
        </div>
      )}
    </div>
  );
}
