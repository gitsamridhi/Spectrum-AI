'use client';

import React, { useState, useRef } from 'react';
import {
  ChevronLeft, ChevronDown, ChevronRight, Sparkles, Video, Play, Plus, Minus,
  History, Settings2, Lock, Unlock, Download, Wand2, X, Maximize2, Copy, Trash2, Upload,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/app/context/ThemeContext';

const P = {
  rose: '#C94060', orange: '#D97E3A', hotPink: '#CC4A78',
  coral: '#D46280', yellow: '#FFF6A6', darkRed: '#A33550',
};

const MODELS    = [
  { id: 'auto',      label: 'Auto',       desc: 'Best model for your prompt'     },
  { id: 'cinematic', label: 'Cinematic',  desc: 'Film-grade motion & lighting'   },
  { id: 'anime',     label: 'Anime',      desc: 'Stylized animated aesthetic'    },
  { id: 'realistic', label: 'Realistic',  desc: 'Photorealistic motion'          },
];
const DURATIONS = ['2s', '4s', '6s', '8s'];
const RATIOS    = ['16:9', '9:16', '1:1', '4:3'];
const MOTIONS   = ['Subtle', 'Moderate', 'Dynamic', 'Extreme'];
const FORMATS   = ['MP4', 'MOV', 'WEBM'];
const CAMERAS   = ['Static', 'Pan', 'Zoom In', 'Zoom Out', 'Orbit', 'Dolly'];
const TAG_CHIPS = [
  { label: 'slow motion',       cat: 'style'     },
  { label: 'timelapse',         cat: 'style'     },
  { label: 'dolly zoom',        cat: 'camera'    },
  { label: 'bokeh depth',       cat: 'lighting'  },
  { label: 'anamorphic flare',  cat: 'lighting'  },
  { label: '4K resolution',     cat: 'technical' },
];
const HIST_ITEMS = [
  { id: 1, src: 'https://picsum.photos/seed/ai-gen-portrait-1/400/400', prompt: 'aerial city timelapse',         ratio: '16:9', time: '3m ago'  },
  { id: 2, src: 'https://picsum.photos/seed/ai-fashion-edit-1/400/400', prompt: 'ocean waves slow motion',       ratio: '16:9', time: '12m ago' },
  { id: 3, src: 'https://picsum.photos/seed/ai-cinematic-1/400/400',    prompt: 'neon street walk night',        ratio: '9:16', time: '25m ago' },
  { id: 4, src: 'https://picsum.photos/seed/ai-landscape-1/400/400',    prompt: 'product reveal studio',         ratio: '1:1',  time: '1h ago'  },
  { id: 5, src: 'https://picsum.photos/seed/ai-gen-portrait-1/400/400', prompt: 'mountain sunrise pan shot',     ratio: '16:9', time: '2h ago'  },
];

const tagColor = (cat: string) => {
  if (cat === 'style')    return { bg: '#fff0f3', border: '#fecdd3', color: P.rose };
  if (cat === 'camera')   return { bg: '#fff7ed', border: '#fed7aa', color: '#c2410c' };
  if (cat === 'lighting') return { bg: '#fefce8', border: '#fde68a', color: '#b45309' };
  return { bg: '#f0fdfa', border: '#99f6e4', color: '#0d9488' };
};

interface VideoGeneratorViewProps { onBack: () => void; }

export default function VideoGeneratorView({ onBack }: VideoGeneratorViewProps) {
  const { isDark, T } = useTheme();
  const [model,               setModel]               = useState('auto');
  const [prompt,              setPrompt]              = useState('');
  const [duration,            setDuration]            = useState('4s');
  const [ratio,               setRatio]               = useState('16:9');
  const [motionIntensity,     setMotionIntensity]     = useState('Moderate');
  const [camera,              setCamera]              = useState('Static');
  const [format,              setFormat]              = useState('MP4');
  const [seed,                setSeed]                = useState('');
  const [seedLocked,          setSeedLocked]          = useState(false);
  const [motionStrength,      setMotionStrength]      = useState(50);
  const [negPrompt,           setNegPrompt]           = useState('');
  const [showNeg,             setShowNeg]             = useState(false);
  const [modeTab,             setModeTab]             = useState<'text'|'image'|'video'>('text');
  const [refImage,            setRefImage]            = useState<string | null>(null);
  const [refVideo,            setRefVideo]            = useState<string | null>(null);
  const [imgStrength,         setImgStrength]         = useState(70);
  const [toast,               setToast]               = useState<string | null>(null);
  const [showModels,          setShowModels]          = useState(false);
  const imgInputRef   = useRef<HTMLInputElement>(null);
  const vidInputRef   = useRef<HTMLInputElement>(null);
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2200); };
  const [showRight,           setShowRight]           = useState(true);
  const [showHistory,         setShowHistory]         = useState(false);
  const [showMotionAccordion, setShowMotionAccordion] = useState(false);
  const [showAdvAccordion,    setShowAdvAccordion]    = useState(false);
  const [generating,          setGenerating]          = useState(false);
  const [generated,           setGenerated]           = useState(false);
  const [progress,            setProgress]            = useState(0);

  const selectedModel = MODELS.find(m => m.id === model)!;

  const handleGenerate = () => {
    if (!prompt.trim() || generating) return;
    setGenerating(true); setGenerated(false); setProgress(0);
    const iv = setInterval(() => setProgress(p => p >= 90 ? p : p + Math.random() * 7), 200);
    setTimeout(() => {
      clearInterval(iv); setProgress(100);
      setTimeout(() => { setGenerating(false); setGenerated(true); }, 200);
    }, 3200);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative" style={{ background: T.bg }}>
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="absolute top-3 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl text-[11.5px] font-semibold text-white shadow-lg pointer-events-none"
            style={{ background: P.orange }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT PANEL ── */}
        <div className="shrink-0 flex flex-col overflow-hidden" style={{ width: 300, borderRight: `1px solid ${T.border}`, background: T.bgSub }}>

          {/* Header */}
          <div className="px-4 pt-3.5 pb-3 shrink-0" style={{ borderBottom: `1px solid ${T.border}`, background: T.bg }}>
            <button onClick={onBack} className="flex items-center gap-1 text-[11px] font-medium cursor-pointer mb-2.5 transition-colors hover:opacity-80"
              style={{ color: T.textMuted }}>
              <ChevronLeft className="w-3.5 h-3.5" />Tools
            </button>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[13.5px] font-bold" style={{ color: T.text }}>Video Generator</h2>
              <button className="text-[10.5px] font-medium px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                style={{ color: T.textSub, border: `1px solid ${T.border}` }}>Templates</button>
            </div>
            {/* Mode tabs */}
            <div className="flex rounded-lg p-0.5 gap-0.5" style={{ background: T.bgCard }}>
              {(['text', 'image', 'video'] as const).map(tab => (
                <button key={tab} onClick={() => setModeTab(tab)}
                  className={`flex-1 py-1.5 rounded-md text-[10.5px] font-semibold capitalize transition-all cursor-pointer`}
                  style={modeTab === tab
                    ? { background: T.bg, color: T.text, boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }
                    : { color: T.textMuted }}>
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">

            {/* Model — always visible */}
            <div>
              <label className="text-[9px] font-semibold uppercase tracking-widest block mb-1.5" style={{ color: T.textMuted }}>Model</label>
              <div className="relative">
                <button onClick={() => setShowModels(s => !s)}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl transition-colors cursor-pointer"
                  style={{ background: T.bg, border: `1px solid ${T.border}` }}>
                  <Video className="w-3.5 h-3.5 shrink-0" style={{ color: P.orange }} />
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-[12px] font-semibold" style={{ color: T.text }}>{selectedModel.label}</p>
                    <p className="text-[10px] truncate" style={{ color: T.textMuted }}>{selectedModel.desc}</p>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${showModels ? 'rotate-180' : ''}`} style={{ color: T.textMuted }} />
                </button>
                {showModels && (
                  <div className="absolute top-full left-0 right-0 mt-1 rounded-xl shadow-lg z-20 overflow-hidden"
                    style={{ background: T.bg, border: `1px solid ${T.border}` }}>
                    {MODELS.map(m => (
                      <button key={m.id} onClick={() => { setModel(m.id); setShowModels(false); }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors cursor-pointer`}
                        style={{ background: model === m.id ? T.bgCard : undefined }}>
                        <div className="flex-1">
                          <p className="text-[12px] font-semibold" style={{ color: T.text }}>{m.label}</p>
                          <p className="text-[10px]" style={{ color: T.textMuted }}>{m.desc}</p>
                        </div>
                        {model === m.id && <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: P.orange }} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── TAB: TEXT ── */}
            {modeTab === 'text' && (
              <>
                <div>
                  <label className="text-[9px] font-semibold uppercase tracking-widest block mb-1.5" style={{ color: T.textMuted }}>Scene Description</label>
                  <div className="relative">
                    <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
                      placeholder="Describe your scene, camera movement, lighting…"
                      className="w-full min-h-[120px] px-3 py-2.5 pb-8 rounded-xl text-[12px] outline-none transition-colors resize-none"
                      style={{ background: T.bg, border: `1px solid ${T.border}`, color: T.text }} />
                    <button onClick={() => setPrompt(p => p ? `${p}, cinematic motion, dramatic lighting, 4K` : 'cinematic motion, dramatic lighting, 4K')}
                      className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold text-white hover:opacity-90 transition-all cursor-pointer"
                      style={{ background: P.orange }}>
                      <Wand2 className="w-3 h-3" />Enhance
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-semibold uppercase tracking-widest block mb-1.5" style={{ color: T.textMuted }}>Prompt tags</label>
                  <div className="flex flex-wrap gap-1.5">
                    {TAG_CHIPS.map(tag => {
                      const c = tagColor(tag.cat);
                      return (
                        <button key={tag.label} onClick={() => setPrompt(p => p ? `${p}, ${tag.label}` : tag.label)}
                          className="px-2.5 py-1 rounded-full text-[10.5px] font-medium border transition-all cursor-pointer hover:opacity-80"
                          style={{ background: c.bg, borderColor: c.border, color: c.color }}>
                          {tag.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-semibold uppercase tracking-widest block mb-1.5" style={{ color: T.textMuted }}>Motion Intensity</label>
                  <div className="grid grid-cols-2 gap-1">
                    {MOTIONS.map(m => (
                      <button key={m} onClick={() => setMotionIntensity(m)}
                        className={`py-2 rounded-lg text-[11px] font-bold border transition-all cursor-pointer`}
                        style={motionIntensity === m
                          ? { background: P.orange, color: '#fff', borderColor: 'transparent' }
                          : { background: T.bg, borderColor: T.border, color: T.textSub }}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <button onClick={() => setShowNeg(s => !s)}
                    className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-widest transition-colors cursor-pointer"
                    style={{ color: T.textMuted }}>
                    <ChevronRight className={`w-3 h-3 transition-transform ${showNeg ? 'rotate-90' : ''}`} />
                    Negative Prompt
                  </button>
                  {showNeg && (
                    <textarea value={negPrompt} onChange={e => setNegPrompt(e.target.value)}
                      placeholder="Motion artifacts, blur, distortion…"
                      className="mt-2 w-full h-16 px-3 py-2 rounded-xl text-[11.5px] outline-none transition-colors resize-none"
                      style={{ background: T.bg, border: `1px solid ${T.border}`, color: T.text }} />
                  )}
                </div>
              </>
            )}

            {/* ── TAB: IMAGE (image-to-video) ── */}
            {modeTab === 'image' && (
              <>
                <div>
                  <label className="text-[9px] font-semibold uppercase tracking-widest block mb-1.5" style={{ color: T.textMuted }}>Reference Image</label>
                  <input ref={imgInputRef} type="file" accept="image/*" className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) setRefImage(URL.createObjectURL(f)); }} />
                  {refImage ? (
                    <div className="relative rounded-xl overflow-hidden border" style={{ aspectRatio: '16/9', borderColor: T.border }}>
                      <img src={refImage} alt="" className="w-full h-full object-cover" />
                      <button onClick={() => setRefImage(null)}
                        className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center cursor-pointer hover:bg-black/80 transition-colors">
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => imgInputRef.current?.click()}
                      className="w-full flex flex-col items-center justify-center gap-2 py-7 border-2 border-dashed rounded-xl hover:border-orange-300 transition-all cursor-pointer"
                      style={{ background: T.bgSub, borderColor: T.border }}>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm"
                        style={{ background: T.bg, border: `1px solid ${T.border}` }}>
                        <Upload className="w-4 h-4" style={{ color: T.textMuted }} />
                      </div>
                      <div className="text-center">
                        <p className="text-[12px] font-semibold" style={{ color: T.textSub }}>Upload reference image</p>
                        <p className="text-[10.5px] mt-0.5" style={{ color: T.textMuted }}>AI will animate this image</p>
                      </div>
                    </button>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: T.textMuted }}>Image Adherence</label>
                    <span className="text-[10px] font-bold" style={{ color: T.text }}>{imgStrength}%</span>
                  </div>
                  <input type="range" min={10} max={100} step={5} value={imgStrength}
                    onChange={e => setImgStrength(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{ accentColor: P.orange }} />
                  <div className="flex justify-between mt-1">
                    <span className="text-[9px]" style={{ color: T.textMuted }}>More creative</span>
                    <span className="text-[9px]" style={{ color: T.textMuted }}>Stay true to image</span>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-semibold uppercase tracking-widest block mb-1.5" style={{ color: T.textMuted }}>Animation Prompt</label>
                  <div className="relative">
                    <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
                      placeholder="Describe how the image should move…"
                      className="w-full min-h-[100px] px-3 py-2.5 pb-8 rounded-xl text-[12px] outline-none transition-colors resize-none"
                      style={{ background: T.bg, border: `1px solid ${T.border}`, color: T.text }} />
                    <button onClick={() => setPrompt(p => p ? `${p}, smooth motion, cinematic` : 'smooth motion, cinematic')}
                      className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold text-white hover:opacity-90 transition-all cursor-pointer"
                      style={{ background: P.orange }}>
                      <Wand2 className="w-3 h-3" />Enhance
                    </button>
                  </div>
                </div>

              </>
            )}

            {/* ── TAB: VIDEO (video-to-video) ── */}
            {modeTab === 'video' && (
              <>
                <div>
                  <label className="text-[9px] font-semibold uppercase tracking-widest block mb-1.5" style={{ color: T.textMuted }}>Source Video</label>
                  <input ref={vidInputRef} type="file" accept="video/*" className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) setRefVideo(URL.createObjectURL(f)); }} />
                  {refVideo ? (
                    <div className="relative rounded-xl overflow-hidden border" style={{ aspectRatio: '16/9', borderColor: T.border }}>
                      <video src={refVideo} className="w-full h-full object-cover" muted autoPlay loop playsInline />
                      <button onClick={() => setRefVideo(null)}
                        className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center cursor-pointer hover:bg-black/80 transition-colors">
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => vidInputRef.current?.click()}
                      className="w-full flex flex-col items-center justify-center gap-2 py-7 border-2 border-dashed rounded-xl hover:border-orange-300 transition-all cursor-pointer"
                      style={{ background: T.bgSub, borderColor: T.border }}>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm"
                        style={{ background: T.bg, border: `1px solid ${T.border}` }}>
                        <Upload className="w-4 h-4" style={{ color: T.textMuted }} />
                      </div>
                      <div className="text-center">
                        <p className="text-[12px] font-semibold" style={{ color: T.textSub }}>Upload source video</p>
                        <p className="text-[10.5px] mt-0.5" style={{ color: T.textMuted }}>MP4, MOV · up to 100MB</p>
                      </div>
                    </button>
                  )}
                </div>

                <div>
                  <label className="text-[9px] font-semibold uppercase tracking-widest block mb-1.5" style={{ color: T.textMuted }}>Style Transformation</label>
                  <div className="flex flex-wrap gap-1.5">
                    {['Cinematic', 'Anime', 'Oil Paint', 'Watercolor', 'Neon', '3D Render'].map(style => (
                      <button key={style} onClick={() => setPrompt(p => p ? `${p}, ${style.toLowerCase()} style` : `${style.toLowerCase()} style`)}
                        className="px-2.5 py-1 rounded-full text-[10.5px] font-medium transition-all cursor-pointer"
                        style={{ background: T.bg, border: `1px solid ${T.border}`, color: T.textSub }}>
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-semibold uppercase tracking-widest block mb-1.5" style={{ color: T.textMuted }}>Transformation Prompt</label>
                  <div className="relative">
                    <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
                      placeholder="Describe the visual style to apply to your video…"
                      className="w-full min-h-[100px] px-3 py-2.5 pb-8 rounded-xl text-[12px] outline-none transition-colors resize-none"
                      style={{ background: T.bg, border: `1px solid ${T.border}`, color: T.text }} />
                    <button onClick={() => setPrompt(p => p ? `${p}, ultra detailed, cinematic grade` : 'ultra detailed, cinematic grade')}
                      className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold text-white hover:opacity-90 transition-all cursor-pointer"
                      style={{ background: P.orange }}>
                      <Wand2 className="w-3 h-3" />Enhance
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-semibold uppercase tracking-widest block mb-1.5" style={{ color: T.textMuted }}>Motion Intensity</label>
                  <div className="grid grid-cols-2 gap-1">
                    {MOTIONS.map(m => (
                      <button key={m} onClick={() => setMotionIntensity(m)}
                        className={`py-2 rounded-lg text-[11px] font-bold border transition-all cursor-pointer`}
                        style={motionIntensity === m
                          ? { background: P.orange, color: '#fff', borderColor: 'transparent' }
                          : { background: T.bg, borderColor: T.border, color: T.textSub }}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Generate button */}
          <div className="px-4 py-3.5 shrink-0" style={{ borderTop: `1px solid ${T.border}`, background: T.bg }}>
            <button onClick={handleGenerate}
              disabled={generating || (modeTab === 'text' && !prompt.trim()) || (modeTab === 'image' && !refImage) || (modeTab === 'video' && !refVideo)}
              className={`w-full flex items-center justify-center gap-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer`}
              style={(generating || (modeTab === 'text' && !prompt.trim()) || (modeTab === 'image' && !refImage) || (modeTab === 'video' && !refVideo))
                ? { background: T.bgCard, color: T.textMuted, height: 48, cursor: 'not-allowed' }
                : { background: P.orange, color: '#fff', height: 48 }}>
              {generating
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating…</>
                : modeTab === 'text'  ? <><Sparkles className="w-4 h-4" />Generate Video</>
                : modeTab === 'image' ? <><Sparkles className="w-4 h-4" />Animate Image</>
                :                       <><Sparkles className="w-4 h-4" />Transform Video</>
              }
            </button>
          </div>
        </div>

        {/* ── CENTER PANEL ── */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Toolbar */}
          <div className="h-11 flex items-center px-4 gap-2 shrink-0" style={{ borderBottom: `1px solid ${T.border}`, background: T.bg }}>
            <div className="ml-auto flex items-center gap-2">
              {/* History toggle */}
              <button onClick={() => setShowHistory(s => !s)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10.5px] font-semibold transition-all cursor-pointer border`}
                style={showHistory
                  ? { background: '#fff7ed', borderColor: '#fed7aa', color: '#c2410c' }
                  : { borderColor: T.border, color: T.textSub }}>
                <History className="w-3 h-3" />History
              </button>

              {/* Right panel toggle */}
              <button onClick={() => setShowRight(s => !s)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10.5px] font-semibold transition-all cursor-pointer border`}
                style={showRight
                  ? { background: '#fff7ed', borderColor: '#fed7aa', color: '#c2410c' }
                  : { borderColor: T.border, color: T.textSub }}>
                <Settings2 className="w-3 h-3" />Controls
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="flex-1 overflow-y-auto p-5 flex flex-col items-center justify-center" style={{ background: T.bgSub }}>
            {!generated && !generating ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"
                  style={{ background: T.bg, border: `1px solid ${T.border}` }}>
                  <Video className="w-6 h-6" style={{ color: T.textMuted }} />
                </div>
                <div className="text-center">
                  <p className="text-[13px] font-semibold" style={{ color: T.textSub }}>No video yet</p>
                  <p className="text-[11.5px] mt-1" style={{ color: T.textMuted }}>Write a scene description and click Generate</p>
                </div>
              </div>
            ) : generating ? (
              <div className="flex flex-col items-center gap-5">
                <div className="w-10 h-10 border-2 rounded-full animate-spin" style={{ borderColor: T.border, borderTopColor: P.orange }} />
                <div className="flex flex-col items-center gap-2">
                  <p className="text-[13px] font-semibold" style={{ color: T.text }}>Synthesizing video…</p>
                  <div className="w-56 h-1.5 rounded-full overflow-hidden" style={{ background: T.bgCard }}>
                    <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress}%`, background: P.orange }} />
                  </div>
                  <p className="text-[10.5px]" style={{ color: T.textMuted }}>{Math.round(progress)}%</p>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-2xl space-y-3">
                <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                  className="group relative bg-zinc-950 rounded-2xl overflow-hidden cursor-pointer"
                  style={{ aspectRatio: ratio.split(':').map(Number).reduce((a, b) => a / b) }}>
                  <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                    <source src="https://static.higgsfield.ai/seedance-2.0-v2/examples/1-mini.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center">
                      <Play className="w-5 h-5 text-zinc-900 fill-zinc-900 ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1">
                    <Play className="w-2.5 h-2.5 text-white fill-white" />
                    <span className="text-[10px] font-semibold text-white">{duration} · {ratio}</span>
                  </div>
                </motion.div>
                <div className="flex items-center justify-between">
                  <p className="text-[11px]" style={{ color: T.textMuted }}>{selectedModel.label} · {motionIntensity} · {format}</p>
                  <div className="flex gap-2">
                    <button onClick={() => { setGenerated(false); handleGenerate(); }}
                      className="px-3 py-1.5 rounded-xl text-[11px] font-medium transition-colors cursor-pointer"
                      style={{ border: `1px solid ${T.border}`, color: T.text }}>
                      Regenerate
                    </button>
                    <button onClick={() => showToast('Video saved to library')}
                      className="px-3 py-1.5 rounded-xl text-[11px] font-bold text-white hover:opacity-90 transition-colors cursor-pointer flex items-center gap-1.5"
                      style={{ background: P.orange }}>
                      <Download className="w-3 h-3" />Download
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <AnimatePresence>
          {showRight && (
            <motion.div
              initial={{ width: 0, opacity: 0 }} animate={{ width: 272, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.18 }}
              className="shrink-0 flex flex-col overflow-hidden"
              style={{ borderLeft: `1px solid ${T.border}`, background: T.bg }}>

              <div className="px-4 py-3 shrink-0 flex items-center justify-between"
                style={{ borderBottom: `1px solid ${T.border}` }}>
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: T.textSub }}>Controls</span>
                <button onClick={() => setShowRight(false)} className="w-6 h-6 rounded-md flex items-center justify-center cursor-pointer transition-colors"
                  style={{ color: T.textMuted }}>
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">

                {/* Model Settings */}
                <div className="px-4 py-3.5" style={{ borderBottom: `1px solid ${T.border}` }}>
                  <p className="text-[9px] font-bold uppercase tracking-widest mb-3" style={{ color: T.textMuted }}>Model Settings</p>
                  <label className="text-[10px] font-medium block mb-1.5" style={{ color: T.textSub }}>Seed</label>
                  <div className="flex gap-1.5">
                    <input value={seed} onChange={e => setSeed(e.target.value)} disabled={seedLocked}
                      placeholder="Random"
                      className="flex-1 h-8 px-3 rounded-lg text-[11px] outline-none disabled:opacity-50 transition-colors"
                      style={{ background: T.inputBg, border: `1px solid ${T.border}`, color: T.text }} />
                    <button onClick={() => setSeedLocked(s => !s)}
                      className={`w-8 h-8 rounded-lg border flex items-center justify-center cursor-pointer transition-all`}
                      style={seedLocked
                        ? { background: '#fff7ed', borderColor: '#fed7aa' }
                        : { background: T.bg, borderColor: T.border }}>
                      {seedLocked
                        ? <Lock className="w-3.5 h-3.5" style={{ color: P.orange }} />
                        : <Unlock className="w-3.5 h-3.5" style={{ color: T.textMuted }} />}
                    </button>
                  </div>
                </div>

                {/* Output Settings */}
                <div className="px-4 py-3.5" style={{ borderBottom: `1px solid ${T.border}` }}>
                  <p className="text-[9px] font-bold uppercase tracking-widest mb-3" style={{ color: T.textMuted }}>Output Settings</p>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-medium block mb-1.5" style={{ color: T.textSub }}>Duration</label>
                      <div className="grid grid-cols-4 gap-1">
                        {DURATIONS.map(d => (
                          <button key={d} onClick={() => setDuration(d)}
                            className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer`}
                            style={duration === d
                              ? { background: P.orange, color: '#fff', borderColor: 'transparent' }
                              : { background: T.bg, borderColor: T.border, color: T.textSub }}>
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-medium block mb-1.5" style={{ color: T.textSub }}>Aspect Ratio</label>
                      <div className="grid grid-cols-2 gap-1">
                        {RATIOS.map(r => (
                          <button key={r} onClick={() => setRatio(r)}
                            className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer`}
                            style={ratio === r
                              ? { background: P.orange, color: '#fff', borderColor: 'transparent' }
                              : { background: T.bg, borderColor: T.border, color: T.textSub }}>
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-medium block mb-1.5" style={{ color: T.textSub }}>Format</label>
                      <div className="grid grid-cols-3 gap-1">
                        {FORMATS.map(f => (
                          <button key={f} onClick={() => setFormat(f)}
                            className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer`}
                            style={format === f
                              ? { background: P.orange, color: '#fff', borderColor: 'transparent' }
                              : { background: T.bg, borderColor: T.border, color: T.textSub }}>
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Motion Controls */}
                <div className="px-4 py-3.5" style={{ borderBottom: `1px solid ${T.border}` }}>
                  <p className="text-[9px] font-bold uppercase tracking-widest mb-3" style={{ color: T.textMuted }}>Motion Controls</p>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[10px] font-medium" style={{ color: T.textSub }}>Strength</label>
                        <span className="text-[10px] font-bold" style={{ color: T.text }}>{motionStrength}%</span>
                      </div>
                      <input type="range" min={0} max={100} step={5} value={motionStrength}
                        onChange={e => setMotionStrength(Number(e.target.value))}
                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                        style={{ accentColor: P.orange }} />
                    </div>
                    <div>
                      <label className="text-[10px] font-medium block mb-1.5" style={{ color: T.textSub }}>Camera Movement</label>
                      <div className="grid grid-cols-2 gap-1">
                        {CAMERAS.map(c => (
                          <button key={c} onClick={() => setCamera(c)}
                            className={`py-1.5 rounded-lg text-[10px] font-semibold border transition-all cursor-pointer`}
                            style={camera === c
                              ? { background: P.orange, color: '#fff', borderColor: 'transparent' }
                              : { background: T.bg, borderColor: T.border, color: T.textSub }}>
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Motion Presets accordion */}
                <div style={{ borderBottom: `1px solid ${T.border}` }}>
                  <button onClick={() => setShowMotionAccordion(s => !s)}
                    className="w-full px-4 py-3.5 flex items-center justify-between cursor-pointer transition-colors"
                    onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: T.textMuted }}>Motion Presets</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showMotionAccordion ? 'rotate-180' : ''}`} style={{ color: T.textMuted }} />
                  </button>
                  {showMotionAccordion && (
                    <div className="px-4 pb-3.5">
                      <div className="flex flex-wrap gap-1.5">
                        {['Handheld', 'Drone', 'Stabilized', 'Tracking', 'Whip Pan', 'Rack Focus'].map(p => (
                          <button key={p} onClick={() => setPrompt(pr => pr ? `${pr}, ${p.toLowerCase()}` : p.toLowerCase())}
                            className="px-2.5 py-1 rounded-full text-[10px] font-medium transition-all cursor-pointer"
                            style={{ background: T.bgCard, border: `1px solid ${T.border}`, color: T.textSub }}>
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Advanced accordion */}
                <div>
                  <button onClick={() => setShowAdvAccordion(s => !s)}
                    className="w-full px-4 py-3.5 flex items-center justify-between cursor-pointer transition-colors"
                    onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: T.textMuted }}>Advanced</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-semibold bg-amber-50 border border-amber-200 text-amber-700">Caution</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAdvAccordion ? 'rotate-180' : ''}`} style={{ color: T.textMuted }} />
                    </div>
                  </button>
                  {showAdvAccordion && (
                    <div className="px-4 pb-4 text-[11px] text-center py-3" style={{ color: T.textMuted }}>Advanced options coming soon.</div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── HISTORY STRIP ── */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 120, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }}
            className="shrink-0 overflow-hidden"
            style={{ borderTop: `1px solid ${T.border}`, background: T.bg }}>
            <div className="h-full flex items-center gap-3 px-4 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {HIST_ITEMS.map(item => (
                <div key={item.id} className="shrink-0 flex flex-col gap-1.5 cursor-pointer group">
                  <div className="w-[118px] h-[74px] rounded-xl overflow-hidden transition-colors"
                    style={{ border: `1px solid ${T.border}` }}>
                    <img src={item.src} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-[9.5px] font-medium truncate w-[118px]" style={{ color: T.textSub }}>{item.prompt}</p>
                    <p className="text-[9px]" style={{ color: T.textMuted }}>{item.time} · {item.ratio}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
