"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const TABS = ["IMAGE", "VIDEO", "AUDIO", "SPACES", "3D"] as const;
type Tab = typeof TABS[number];

const StarLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
    <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
  </svg>
);

// Logo overlay — sits on top of every panel's media
const LogoOverlay = () => (
  <div className="absolute top-6 left-6 z-20 flex items-center gap-2 pointer-events-none">
    <div className="w-4 h-4 text-white/80"><StarLogo /></div>
    <span className="text-[12px] font-semibold text-white/80 tracking-[-0.02em]">Spectrum AI</span>
  </div>
);

// ── IMAGE ──────────────────────────────────────────────────────────────────────
const ImagePanel = () => (
  <div className="absolute inset-0 flex flex-col">
    <LogoOverlay />
    <div className="grid grid-cols-2 flex-1 min-h-0">
      {[
        { src: "/pexels-didsss-2791056.jpg", label: "Portrait Enhancement" },
        { src: "/pexels-ganajp-15698413.jpg", label: "Landscape 4×" },
        { src: "/pexels-olga-178200755-12367292.jpg", label: "Detail Recovery" },
        { src: "/pexels-prathsnap-3168209.jpg", label: "Color Restore" },
      ].map((img, i) => (
        <div key={i} className="relative overflow-hidden group cursor-pointer">
          <img src={img.src} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          <span className="absolute bottom-3 left-3 text-[10px] font-semibold text-white/80">{img.label}</span>
        </div>
      ))}
    </div>
    {/* Caption over bottom-left image */}
    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none">
      <h3 className="text-[20px] font-bold text-white tracking-tight leading-snug">Enhance any image<br />with AI precision.</h3>
      <p className="text-zinc-400 text-[12px] mt-1">Upscale, restore, and perfect every pixel.</p>
    </div>
  </div>
);

// ── VIDEO ──────────────────────────────────────────────────────────────────────
const VideoPanel = () => (
  <div className="absolute inset-0">
    <LogoOverlay />
    <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
      <source src="/15498647_trimmed_4s.mp4" type="video/mp4" />
    </video>
    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/20" />
    <div className="absolute bottom-6 left-6 right-6">
      <span className="text-[9px] font-bold uppercase tracking-widest text-blue-400 bg-blue-400/10 border border-blue-400/20 px-2 py-0.5 rounded-full">AI Enhanced</span>
      <h3 className="text-[22px] font-bold text-white mt-2.5 tracking-tight leading-snug">Video-quality<br />visual output.</h3>
      <p className="text-zinc-400 text-[12px] mt-1.5">Generate cinematic clarity on every frame.</p>
    </div>
  </div>
);

// ── AUDIO ──────────────────────────────────────────────────────────────────────
const AudioPanel = () => (
  <div className="absolute inset-0 flex flex-col justify-between p-8">
    <LogoOverlay />
    <div className="flex-1 flex flex-col items-center justify-center gap-6 pt-10">
      {/* Waveform */}
      <div className="flex items-center justify-center gap-[3px] h-32 w-full">
        {Array.from({ length: 52 }, (_, i) => {
          const h = [20,35,55,40,70,85,60,45,80,50,30,65,90,75,40,55,70,45,30,60,85,50,40,70,55,80,35,60,45,75,50,65,80,40,55,70,90,45,60,35,80,55,40,70,50,65,45,30,55,70,40,60][i % 52];
          const isActive = i > 18 && i < 38;
          return (
            <div key={i} className={`rounded-full shrink-0 ${isActive ? "bg-blue-400" : "bg-zinc-700"}`}
              style={{ width: "3px", height: `${h}%` }} />
          );
        })}
      </div>
      {/* Player */}
      <div className="w-full max-w-xs space-y-3">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white ml-0.5"><path d="M8 5v14l11-7z"/></svg>
          </div>
          <div className="flex-1">
            <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-400 rounded-full" style={{ width: "45%" }} />
            </div>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono shrink-0">3:08</span>
        </div>
      </div>
    </div>
    <div>
      <h3 className="text-[22px] font-bold text-white tracking-tight leading-snug">Audio-visual<br />alignment.</h3>
      <p className="text-zinc-400 text-[12px] mt-1.5">Sync enhanced visuals with your sound projects.</p>
    </div>
  </div>
);

// ── SPACES — Magnific-style node canvas ────────────────────────────────────────
const NodeLabel = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex items-center gap-1.5 mb-1.5 px-0.5">
    {icon}
    <span className="text-[9px] text-white/35 font-medium tracking-wide">{label}</span>
  </div>
);

const IconText = () => (
  <svg viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="rgba(255,255,255,0.38)">
    <rect y="0.5" width="10" height="1.5" rx="0.75"/><rect y="3.5" width="7.5" height="1.5" rx="0.75"/><rect y="6.5" width="8.5" height="1.5" rx="0.75"/>
  </svg>
);
const IconImage = () => (
  <svg viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="none" stroke="rgba(255,255,255,0.38)" strokeWidth="0.9">
    <rect x="0.5" y="0.5" width="9" height="9" rx="1.2"/>
    <circle cx="3.2" cy="3.2" r="1.1" fill="rgba(255,255,255,0.38)" stroke="none"/>
    <path d="M0.5 7l2.5-2.5 2 2 1.5-1.5 3.5 3.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconVideo = () => (
  <svg viewBox="0 0 10 10" className="w-2.5 h-2.5" fill="rgba(255,255,255,0.38)">
    <path d="M0.5 2a.5.5 0 01.5-.5h5a.5.5 0 01.5.5v6a.5.5 0 01-.5.5h-5A.5.5 0 01.5 8V2zm6 1l3-1.5v7L6.5 7V3z"/>
  </svg>
);

const SpacesPanel = () => (
  <div className="absolute inset-0 overflow-hidden bg-[#0c0c0c] flex items-center justify-center">

    {/* Subtle dot-grid canvas background */}
    <div className="absolute inset-0 pointer-events-none" style={{
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
      backgroundSize: "26px 26px",
    }} />

    <style dangerouslySetInnerHTML={{ __html: `
      @keyframes sp-a { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
      @keyframes sp-b { 0%,100%{transform:translateY(0)} 50%{transform:translateY(6px)} }
      @keyframes sp-c { 0%,100%{transform:translate(0,0)} 50%{transform:translate(4px,-5px)} }
      @keyframes sp-d { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
      @keyframes sp-e { 0%,100%{transform:translateY(0)} 50%{transform:translateY(5px)} }
      .spn-a{animation:sp-a 5.2s ease-in-out infinite}
      .spn-b{animation:sp-b 6.8s ease-in-out infinite}
      .spn-c{animation:sp-c 5.5s ease-in-out infinite}
      .spn-d{animation:sp-d 7.1s ease-in-out infinite}
      .spn-e{animation:sp-e 4.9s ease-in-out infinite 0.8s}
    `}} />

    {/* ── Centered canvas viewport ── */}
    <div className="relative" style={{ width: 556, height: 556, transform: "scale(1.13)", transformOrigin: "center center", zIndex: 2 }}>

    {/* ── SVG: solid smooth bezier connections ── */}
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
      {/* Text → ImgGen output (top curve) */}
      <path d="M 172 84 C 234 84 234 112 294 112"
        fill="none" stroke="#6366f1" strokeWidth="1.6" opacity="0.7" strokeLinecap="round"/>
      {/* ImgGen input → ImgGen output (middle curve) */}
      <path d="M 222 250 C 260 250 260 196 294 196"
        fill="none" stroke="#7c3aed" strokeWidth="1.6" opacity="0.8" strokeLinecap="round"/>
      {/* ImgGen input → VideoGen (bottom curve) */}
      <path d="M 222 266 C 248 266 248 450 270 450"
        fill="none" stroke="#6366f1" strokeWidth="1.6" opacity="0.6" strokeLinecap="round"/>

      {/* Source dots */}
      <circle cx="172" cy="84"  r="3.5" fill="#818cf8" />
      <circle cx="222" cy="250" r="3.5" fill="#7c3aed" />
      <circle cx="222" cy="266" r="3"   fill="#6366f1" opacity="0.75" />
      {/* Target dots */}
      <circle cx="294" cy="112" r="4"   fill="#818cf8" />
      <circle cx="294" cy="196" r="4"   fill="#7c3aed" />
      <circle cx="270" cy="450" r="4"   fill="#6366f1" opacity="0.75" />

      {/* Output indicator dots — right edge of VideoGen */}
      <circle cx="548" cy="410" r="5.5" fill="#34d399" />
      <circle cx="548" cy="428" r="5.5" fill="#6366f1" />
    </svg>

    {/* ── NODE: Text (top-left) ── */}
    <div className="spn-a absolute" style={{ left: 22, top: 26, width: 148, zIndex: 2 }}>
      <NodeLabel icon={<IconText />} label="Text" />
      <div className="bg-[#1c1c1e] rounded-[10px] border border-white/[0.07] shadow-xl p-3 space-y-[7px]">
        <div className="h-[7px] bg-white/[0.13] rounded-full w-full" />
        <div className="h-[7px] bg-white/[0.09] rounded-full w-[85%]" />
        <div className="h-[7px] bg-white/[0.07] rounded-full w-[72%]" />
        <div className="h-px bg-white/[0.06] my-1" />
        <div className="h-[7px] bg-white/[0.10] rounded-full w-full" />
        <div className="h-[7px] bg-white/[0.07] rounded-full w-[65%]" />
      </div>
    </div>

    {/* ── NODE: Image Generator (input) ── left-center */}
    <div className="spn-b absolute" style={{ left: 22, top: 148, width: 198, zIndex: 2 }}>
      <NodeLabel icon={<IconImage />} label="Image Generator" />
      <div className="bg-[#1c1c1e] rounded-[10px] border border-white/[0.07] shadow-xl overflow-hidden">
        <img src="/pexels-olga-178200755-12367292.jpg" alt=""
          className="w-full object-cover block" style={{ height: 186 }} />
      </div>
    </div>

    {/* ── NODE: Image Generator (output) — large, top-right ── */}
    <div className="spn-c absolute" style={{ left: 294, top: 18, width: 248, zIndex: 2 }}>
      <NodeLabel icon={<IconImage />} label="Image Generator" />
      <div className="bg-[#1c1c1e] rounded-[10px] border border-white/[0.07] shadow-2xl overflow-hidden">
        <img src="/pexels-didsss-2791056.jpg" alt=""
          className="w-full object-cover block" style={{ height: 250 }} />
      </div>
    </div>

    {/* Ivan cursor — on the ImgGen→ImgGen curve midpoint */}
    <div className="absolute flex items-center gap-1 pointer-events-none" style={{ left: 252, top: 218, zIndex: 10 }}>
      <svg viewBox="0 0 12 16" className="w-[11px] h-[14px] drop-shadow" fill="#f43f5e" stroke="white" strokeWidth="0.7" strokeLinejoin="round">
        <path d="M1.5 1.5 L10.5 7.5 L6.5 8.8 L5 14.5 Z"/>
      </svg>
      <span className="bg-[#f43f5e] text-white text-[9px] font-bold px-2 py-[2px] rounded-full shadow-lg leading-none">Ivan</span>
    </div>

    {/* ── NODE: Video Generator — bottom-right ── */}
    <div className="spn-d absolute" style={{ left: 270, top: 346, width: 272, zIndex: 2 }}>
      <NodeLabel icon={<IconVideo />} label="Video Generator" />
      <div className="bg-[#1c1c1e] rounded-[10px] border border-white/[0.07] shadow-xl overflow-hidden relative">
        <video autoPlay loop muted playsInline className="w-full object-cover block" style={{ height: 168 }}>
          <source src="/14674120_trimmed_4s.mp4" type="video/mp4" />
        </video>
        {/* Lau cursor tag */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 pointer-events-none">
          <svg viewBox="0 0 12 16" className="w-[10px] h-[13px]" fill="#a78bfa" stroke="white" strokeWidth="0.7" strokeLinejoin="round">
            <path d="M1.5 1.5 L10.5 7.5 L6.5 8.8 L5 14.5 Z"/>
          </svg>
          <span className="bg-[#7c3aed] text-white text-[8px] font-bold px-2 py-[2px] rounded-full leading-none">Lau</span>
        </div>
        {/* Play button */}
        <div className="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="white" className="w-[14px] h-[14px] ml-0.5"><path d="M8 5v14l11-7z"/></svg>
        </div>
      </div>
    </div>

    {/* ── NODE: Text (bottom-left, secondary) ── */}
    <div className="spn-e absolute" style={{ left: 22, top: 370, width: 145, zIndex: 2 }}>
      <NodeLabel icon={<IconText />} label="Text" />
      <div className="bg-[#1c1c1e] rounded-[10px] border border-white/[0.07] shadow-xl p-3 space-y-[7px]">
        <div className="h-[7px] bg-white/[0.11] rounded-full w-full" />
        <div className="h-[7px] bg-white/[0.08] rounded-full w-[80%]" />
        <div className="h-[7px] bg-white/[0.06] rounded-full w-[58%]" />
        <div className="h-6 bg-white/[0.07] rounded-full flex items-center justify-center mt-1">
          <span className="text-[8px] text-white/30 font-medium">Generate</span>
        </div>
      </div>
    </div>

    </div>{/* ── end centered canvas viewport ── */}

    {/* ── Bottom caption — outside canvas, pinned to panel bottom ── */}
    <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ zIndex: 10 }}>
      <div className="px-6 pb-6 pt-16 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-[#0c0c0c]/90 to-transparent" />
        <div className="relative">
          <h3 className="text-[22px] font-black text-white tracking-tight leading-tight">Build together, faster</h3>
          <p className="text-zinc-500 text-[12px] mt-1">Node-based workflows on an infinite canvas.</p>
        </div>
      </div>
    </div>
  </div>
);

// ── 3D ────────────────────────────────────────────────────────────────────────
const ThreeDPanel = () => (
  <div className="absolute inset-0">
    <LogoOverlay />
    <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
      <source src="/16034575_trimmed_4s.mp4" type="video/mp4" />
    </video>
    <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-black/20" />
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/15 to-transparent" />
    <div className="absolute bottom-6 left-6 right-6">
      <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-400 bg-indigo-400/10 border border-indigo-400/20 px-2 py-0.5 rounded-full">3D Rendering</span>
      <h3 className="text-[22px] font-bold text-white mt-2.5 tracking-tight leading-snug">3D-ready visual<br />enhancement.</h3>
      <p className="text-zinc-400 text-[12px] mt-1.5">Upscale renders and preserve depth maps.</p>
    </div>
  </div>
);

const PANEL_MAP: Record<Tab, React.FC> = {
  IMAGE: ImagePanel,
  VIDEO: VideoPanel,
  AUDIO: AudioPanel,
  SPACES: SpacesPanel,
  "3D": ThreeDPanel,
};

export default function BrandingPanel() {
  const [activeTab, setActiveTab] = useState<Tab>("IMAGE");

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab(prev => TABS[(TABS.indexOf(prev) + 1) % TABS.length]);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const ActivePanel = PANEL_MAP[activeTab];

  return (
    <div className="hidden lg:flex flex-col w-1/2 bg-[#0A0A0A] border-r border-zinc-900 relative overflow-hidden h-full select-none">

      {/* Content fills entire panel — logo overlaid inside each panel */}
      <div className="flex-1 relative overflow-hidden min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <ActivePanel />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Tab bar at bottom */}
      <div className="shrink-0 border-t border-zinc-900 relative z-10 bg-[#0A0A0A]">
        <div className="flex">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 relative py-3.5 text-[10px] font-bold uppercase tracking-widest transition-colors duration-200 cursor-pointer ${
                activeTab === tab ? "text-white" : "text-zinc-600 hover:text-zinc-400"
              }`}>
              {tab}
              {activeTab === tab && (
                <motion.div layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-px bg-white"
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
