"use client";

import React, { useState, useRef } from "react";
import { Camera } from "lucide-react";
import { useOnboarding } from "@/app/context/OnboardingContext";

export default function ScreenSetupWorkspace() {
  const { answers, updateAnswers } = useOnboarding();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const useCaseMap: { [key: string]: string } = {
    images: "Image Generation & Upscaling",
    videos: "Video Generation & Motion Synth",
    marketing: "Marketing Assets & Brand Ad Layouts",
    brand: "Brand Visuals & Typography Vectors",
    storytelling: "Storyboards & Cinematic Scenes",
    exploring: "General Exploration & Learning",
  };

  const selectedKeys = answers.creating.length > 0 ? answers.creating : ["exploring"];
  const optionsList = selectedKeys.map((k) => ({ key: k, label: useCaseMap[k] || "General Synthesis" }));

  React.useEffect(() => {
    if (!answers.primaryUseCase && optionsList.length > 0) {
      updateAnswers({ primaryUseCase: optionsList[0].key });
    }
  }, [answers.primaryUseCase, optionsList, updateAnswers]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files?.[0]) {
      const reader = new FileReader();
      reader.onload = () => updateAnswers({ profilePicture: reader.result as string });
      reader.readAsDataURL(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = () => updateAnswers({ profilePicture: reader.result as string });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-[28px] md:text-[32px] font-black text-zinc-900 tracking-[-0.04em] leading-[1.1]">
          Set up your workspace
        </h2>
        <p className="text-zinc-400 text-[14px]">Almost there — personalise your profile.</p>
      </div>

      <div className="space-y-5">
        {/* Avatar upload */}
        <div className="flex flex-col items-center gap-3">
          <div onDragOver={(e) => e.preventDefault()} onDragEnter={() => setIsDragOver(true)}
            onDragLeave={() => setIsDragOver(false)} onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`w-20 h-20 rounded-full border-2 border-dashed flex flex-col items-center justify-center relative cursor-pointer overflow-hidden transition-all duration-200 ${
              isDragOver ? "border-orange-400 bg-orange-50 scale-105" : answers.profilePicture ? "border-orange-400" : "border-zinc-300 bg-zinc-50 hover:border-zinc-500"
            }`}>
            {answers.profilePicture ? (
              <img src={answers.profilePicture} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center text-zinc-400">
                <Camera className="w-5 h-5 mb-0.5" />
                <span className="text-[8px] font-semibold uppercase tracking-wider">Upload</span>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </div>
          {answers.profilePicture ? (
            <button onClick={(e) => { e.stopPropagation(); updateAnswers({ profilePicture: null }); }}
              className="text-[11px] text-red-500 hover:text-red-700 transition-colors font-medium">Remove photo</button>
          ) : (
            <span className="text-[11px] text-zinc-400">Drag & drop or click to upload</span>
          )}
        </div>

        {/* Display Name */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-semibold text-zinc-600 uppercase tracking-widest">Display Name</label>
            <span className="text-[10px] text-zinc-400">Visible to other creators</span>
          </div>
          <input type="text" value={answers.displayName || ""} onChange={(e) => updateAnswers({ displayName: e.target.value })}
            placeholder="Your creative alias"
            className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl h-11 px-4 text-[13px] placeholder-zinc-400 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400/20 transition-all" />
        </div>

        {/* Workspace Name */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-zinc-600 uppercase tracking-widest block">Workspace Name</label>
          <input type="text" value={answers.workspaceName || ""} onChange={(e) => updateAnswers({ workspaceName: e.target.value })}
            placeholder="My Spectrum Studio"
            className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl h-11 px-4 text-[13px] placeholder-zinc-400 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400/20 transition-all" />
        </div>

        {/* Primary Use Case */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-zinc-600 uppercase tracking-widest block">Primary Use Case</label>
          <div className="relative">
            <select value={answers.primaryUseCase || "exploring"} onChange={(e) => updateAnswers({ primaryUseCase: e.target.value })}
              className="w-full h-11 bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-xl px-4 text-[13px] focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400/20 cursor-pointer appearance-none transition-all">
              <option value="images">Image Upscaling & Enhancement</option>
              <option value="videos">Video Quality & Rendering</option>
              <option value="marketing">Marketing & Brand Assets</option>
              <option value="brand">Brand Identity Visuals</option>
              <option value="storytelling">Cinematic & Storyboard Work</option>
              <option value="exploring">General Exploration</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 text-[10px]">▼</div>
          </div>
        </div>
      </div>
    </div>
  );
}
