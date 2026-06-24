'use client';

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Upload, Zap, Download, ChevronDown, LogOut, History,
  Maximize2, RotateCcw, SlidersHorizontal, Image as ImageIcon,
  Settings, Sparkles, Grid3X3, Star
} from "lucide-react";
import { useOnboarding } from "@/app/context/OnboardingContext";
import { motion, AnimatePresence } from "framer-motion";

const Logo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
    <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
  </svg>
);

const MODES = ["Enhance", "Upscale", "Denoise", "Restore", "Colorize"];
const STYLES = ["Standard", "Photo", "Cinematic", "Art", "Portrait"];
const SCALES = ["2×", "4×", "8×"];

const sampleImages = [
  "/pexels-didsss-2791056.jpg",
  "/pexels-ganajp-15698413.jpg",
  "/pexels-olga-178200755-12367292.jpg",
  "/pexels-prathsnap-3168209.jpg",
];

interface SliderProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (v: number) => void;
  color?: string;
}
const SettingSlider = ({ label, value, min = 0, max = 10, step = 1, onChange, color = "bg-white" }: SliderProps) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <label className="text-[11px] text-white/50 font-medium">{label}</label>
      <span className="text-[11px] font-semibold text-white tabular-nums">{value}</span>
    </div>
    <div className="relative h-1 bg-white/8 rounded-full">
      <div className={`absolute inset-y-0 left-0 ${color} rounded-full`} style={{ width: `${((value - min) / (max - min)) * 100}%` }} />
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="absolute inset-0 w-full opacity-0 cursor-pointer h-1" />
    </div>
  </div>
);

export default function HomeScreen() {
  const { logoutUser, userEmail, answers } = useOnboarding();
  const [mode, setMode] = useState("Enhance");
  const [uploadedSrc, setUploadedSrc] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [progressVal, setProgressVal] = useState(0);
  const [sliderX, setSliderX] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Settings
  const [creativity, setCreativity] = useState(5);
  const [resemblance, setResemblance] = useState(7);
  const [noise, setNoise] = useState(3);
  const [scale, setScale] = useState("4×");
  const [style, setStyle] = useState("Standard");

  const displayName = answers.displayName || userEmail?.split("@")[0] || "User";
  const avatar = displayName[0]?.toUpperCase() ?? "U";

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setUploadedSrc(ev.target?.result as string);
      setProcessed(false);
      setProgressVal(0);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleEnhance = () => {
    if (!uploadedSrc || processing) return;
    setProcessing(true);
    setProcessed(false);
    setProgressVal(0);
    const iv = setInterval(() => setProgressVal(p => Math.min(p + 2, 100)), 50);
    setTimeout(() => {
      clearInterval(iv);
      setProgressVal(100);
      setProcessing(false);
      setProcessed(true);
    }, 2600);
  };

  const handleReset = () => {
    setUploadedSrc(null);
    setProcessed(false);
    setProgressVal(0);
    setSliderX(50);
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging || !containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    setSliderX(Math.max(5, Math.min(95, x)));
  }, [dragging]);

  return (
    <div className="fixed inset-0 bg-[#0c0c0c] flex flex-col font-sans overflow-hidden text-white">

      {/* ── TOP NAV ── */}
      <header className="h-11 border-b border-white/[0.06] flex items-center px-4 gap-3 shrink-0 bg-[#0c0c0c] z-20">
        {/* Logo */}
        <div className="flex items-center gap-2 mr-3">
          <div className="w-4 h-4 text-white"><Logo /></div>
          <span className="text-[13px] font-semibold tracking-[-0.02em]">Spectrum AI</span>
        </div>

        {/* Mode tabs */}
        <div className="flex items-center gap-0.5 bg-white/[0.05] rounded-lg p-0.5 border border-white/[0.06]">
          {MODES.map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                mode === m ? "bg-white text-zinc-900 shadow-sm" : "text-white/40 hover:text-white/70"
              }`}>
              {m}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {/* Credits */}
        <div className="flex items-center gap-1.5 border border-white/8 rounded-full px-3 py-1.5">
          <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          <span className="text-[11px] font-semibold text-white">250</span>
          <span className="text-[10px] text-white/30">credits</span>
        </div>

        {/* History toggle */}
        <button onClick={() => setShowHistory(h => !h)}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${showHistory ? "bg-white/10 text-white" : "text-white/30 hover:text-white/60 hover:bg-white/5"}`}>
          <History className="w-4 h-4" />
        </button>

        {/* User */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[11px] font-bold text-white select-none">
            {avatar}
          </div>
          <span className="text-[12px] text-white/60 font-medium hidden md:block">{displayName}</span>
          <button onClick={logoutUser} className="p-1.5 rounded-lg text-white/25 hover:text-white/60 hover:bg-white/5 transition-colors cursor-pointer">
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ── BODY ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ── HISTORY SIDEBAR ── */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 200, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="border-r border-white/[0.06] bg-[#0a0a0a] overflow-hidden shrink-0 flex flex-col"
            >
              <div className="p-3 border-b border-white/[0.05]">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30">Recent</p>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
                {sampleImages.map((img, i) => (
                  <button key={i} onClick={() => { setUploadedSrc(img); setProcessed(false); }}
                    className="w-full relative aspect-video rounded-lg overflow-hidden group cursor-pointer">
                    <img src={img} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-90 transition-opacity" />
                    <div className="absolute bottom-1 left-1 text-[8px] text-white/60 font-medium bg-black/40 px-1.5 py-0.5 rounded">
                      #{i + 1}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── CANVAS ── */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden"
          onDragOver={e => e.preventDefault()} onDrop={handleDrop}>

          {/* Background subtle grid */}
          <div className="absolute inset-0 opacity-[0.02]"
            style={{ backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

          <AnimatePresence mode="wait">
            {!uploadedSrc ? (
              /* Upload zone */
              <motion.label key="upload"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35 }}
                className="relative flex flex-col items-center justify-center w-full max-w-2xl aspect-video border border-dashed border-white/10 rounded-2xl cursor-pointer group hover:border-white/20 transition-all bg-white/[0.01]"
              >
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="w-14 h-14 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center group-hover:border-white/20 group-hover:bg-white/8 transition-all">
                    <Upload className="w-5 h-5 text-white/30 group-hover:text-white/60 transition-colors" />
                  </div>
                  <div>
                    <p className="text-[14px] text-white/50 font-medium">Drop an image here, or click to upload</p>
                    <p className="text-[11px] text-white/20 mt-1.5">PNG, JPG, WEBP up to 20MB · Max 4096 × 4096 px</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    {sampleImages.slice(0,3).map((img, i) => (
                      <button key={i} type="button" onClick={e => { e.preventDefault(); setUploadedSrc(img); }}
                        className="relative w-14 h-10 rounded-lg overflow-hidden border border-white/10 hover:border-white/30 transition-colors">
                        <img src={img} alt="" className="w-full h-full object-cover opacity-50 hover:opacity-80 transition-opacity" />
                      </button>
                    ))}
                    <span className="text-[10px] text-white/20 ml-1">try a sample</span>
                  </div>
                </div>
                <input type="file" accept="image/*" className="sr-only" onChange={handleUpload} />
              </motion.label>
            ) : (
              /* Image comparison canvas */
              <motion.div key="canvas"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-3xl"
              >
                {/* Top action bar */}
                <div className="absolute -top-10 left-0 right-0 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-white/30 font-medium uppercase tracking-widest">{mode}</span>
                    {processed && <span className="text-[9px] text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full font-semibold uppercase tracking-widest">Done</span>}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {processed && (
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-zinc-900 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-100 transition-colors cursor-pointer">
                        <Download className="w-3 h-3" /> Export
                      </button>
                    )}
                    <button onClick={handleReset}
                      className="p-1.5 text-white/30 hover:text-white/70 hover:bg-white/5 rounded-lg transition-colors cursor-pointer">
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Canvas */}
                <div ref={containerRef}
                  className="relative w-full aspect-video rounded-xl overflow-hidden select-none cursor-col-resize border border-white/8"
                  onMouseMove={handleMouseMove}
                  onMouseUp={() => setDragging(false)}
                  onMouseLeave={() => setDragging(false)}
                >
                  {/* After (enhanced) */}
                  <img src={uploadedSrc} alt="Enhanced"
                    className="absolute inset-0 w-full h-full object-contain"
                    style={{ filter: processed ? "contrast(1.05) saturate(1.12) brightness(1.02)" : "none" }}
                  />

                  {/* Before (original) - clipped */}
                  {processed && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ width: `${sliderX}%` }}>
                      <img src={uploadedSrc} alt="Original"
                        className="absolute inset-0 h-full object-contain"
                        style={{ width: `${(100 / sliderX) * 100}%` }}
                      />
                    </div>
                  )}

                  {/* Slider handle */}
                  {processed && (
                    <div className="absolute inset-y-0 z-10 pointer-events-none" style={{ left: `${sliderX}%` }}>
                      <div className="relative h-full flex items-center justify-center" style={{ transform: "translateX(-50%)" }}>
                        <div className="w-px h-full bg-white/70" />
                        <div
                          onMouseDown={() => setDragging(true)}
                          className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-2xl flex items-center justify-center cursor-col-resize pointer-events-auto border-2 border-zinc-200"
                        >
                          <span className="text-zinc-700 text-[11px] font-bold select-none">⟺</span>
                        </div>
                        {/* Labels */}
                        <div className="absolute left-3 top-3 text-[8px] font-bold uppercase tracking-widest text-white/70 bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm">Before</div>
                        <div className="absolute right-0 translate-x-full top-3 ml-3 text-[8px] font-bold uppercase tracking-widest text-white/70 bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm">After</div>
                      </div>
                    </div>
                  )}

                  {/* Processing overlay */}
                  <AnimatePresence>
                    {processing && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center gap-5 z-20"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 text-blue-400 animate-spin"><Logo /></div>
                          <p className="text-[13px] text-white/80 font-medium">Enhancing with AI...</p>
                        </div>
                        <div className="w-56 h-[3px] bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 via-indigo-400 to-blue-500 rounded-full transition-all duration-100"
                            style={{ width: `${progressVal}%` }} />
                        </div>
                        <p className="text-[10px] text-white/30 font-medium uppercase tracking-widest">{progressVal.toFixed(0)}%</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Scale info */}
                <div className="absolute -bottom-8 left-0 right-0 flex items-center justify-center gap-3">
                  <span className="text-[10px] text-white/25 font-medium">Scale {scale} · {style} · Creativity {creativity}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="w-64 border-l border-white/[0.06] bg-[#0a0a0a] flex flex-col shrink-0">
          {/* Panel header */}
          <div className="h-11 border-b border-white/[0.05] flex items-center px-4 gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-white/30" />
            <span className="text-[11px] font-semibold text-white/60 uppercase tracking-widest">Settings</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Scale */}
            <div className="space-y-2">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-white/30 block">Scale Factor</label>
              <div className="grid grid-cols-3 gap-1.5">
                {SCALES.map(s => (
                  <button key={s} onClick={() => setScale(s)}
                    className={`py-2 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                      scale === s ? "bg-white text-zinc-900" : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70 border border-white/5"
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Style */}
            <div className="space-y-2">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-white/30 block">Style</label>
              <div className="space-y-1">
                {STYLES.map(s => (
                  <button key={s} onClick={() => setStyle(s)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                      style === s ? "bg-white/10 text-white border border-white/15" : "text-white/35 hover:text-white/60 hover:bg-white/5"
                    }`}>
                    {s}
                    {style === s && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-4">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-white/30 block">Fine-tune</label>
              <SettingSlider label="Creativity" value={creativity} onChange={setCreativity} color="bg-blue-500" />
              <SettingSlider label="Resemblance" value={resemblance} onChange={setResemblance} color="bg-indigo-400" />
              <SettingSlider label="Noise Reduction" value={noise} onChange={setNoise} color="bg-violet-400" />
            </div>

            {/* Info */}
            <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-3 space-y-1.5">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-white/30">Mode</span>
                <span className="text-white/60 font-medium">{mode}</span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-white/30">Engine</span>
                <span className="text-white/60 font-medium">Spectrum v2.1</span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-white/30">Cost</span>
                <span className="text-yellow-400 font-semibold flex items-center gap-1"><Zap className="w-2.5 h-2.5 fill-current" />3 credits</span>
              </div>
            </div>
          </div>

          {/* Enhance button */}
          <div className="p-4 border-t border-white/[0.05]">
            <button onClick={handleEnhance}
              disabled={!uploadedSrc || processing}
              className={`w-full h-10 rounded-xl text-[12px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                uploadedSrc && !processing
                  ? "bg-white text-zinc-900 hover:bg-zinc-100 shadow-[0_4px_20px_rgba(255,255,255,0.1)]"
                  : "bg-white/5 text-white/20 cursor-not-allowed"
              }`}>
              {processing ? (
                <><div className="w-3.5 h-3.5 animate-spin text-zinc-400"><Logo /></div> Processing...</>
              ) : (
                <><Sparkles className="w-3.5 h-3.5" /> {processed ? "Re-enhance" : "Enhance"}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
