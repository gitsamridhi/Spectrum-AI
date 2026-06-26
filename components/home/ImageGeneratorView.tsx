'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft, ChevronDown, ChevronRight, Sparkles, ImageIcon, LayoutGrid,
  Star, User, Plus, Minus, History, Settings2, Lock, Unlock,
  Download, Wand2, X, Maximize2, Copy, Trash2, Upload, Brush, Pin, UserCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/app/context/ThemeContext';

const P = {
  rose: '#C2410C', orange: '#D97706', hotPink: '#EA580C',
  coral: '#B45309', yellow: '#FEF3C7', darkRed: '#92400E',
};

const PHASES = ['queued', 'init', 'diffusing', 'postprocess'] as const;
type Phase = typeof PHASES[number] | 'complete' | 'failed';
const PHASE_META: Record<string, { label: string; desc: string; color: string }> = {
  queued:      { label: 'Queued',          desc: 'Waiting for GPU slot…',        color: '#6B7280' },
  init:        { label: 'Initialising',    desc: 'Loading model weights…',       color: '#D97706' },
  diffusing:   { label: 'Generating',      desc: 'Diffusing latents…',           color: '#EA580C' },
  postprocess: { label: 'Post-processing', desc: 'Upsampling & sharpening…',     color: '#16A34A' },
  complete:    { label: 'Complete',        desc: 'Output ready',                 color: '#16A34A' },
  failed:      { label: 'Failed',          desc: 'Something went wrong',         color: '#DC2626' },
};

const MODELS = [
  { id: 'auto',      label: 'Auto',      desc: "AI picks what's best" },
  { id: 'portrait',  label: 'Portrait',  desc: 'Faces & skin detail' },
  { id: 'landscape', label: 'Landscape', desc: 'Scenery & environments' },
  { id: 'scifi',     label: 'Sci-Fi',    desc: 'Fantasy & abstract' },
  { id: 'product',   label: 'Product',   desc: 'Studio product shots' },
];
const RATIOS      = ['1:1', '3:2', '16:9', '9:16', '4:3', '2:3'];
const RESOLUTIONS = ['512px', '1024px', '2048px', '4K'];
const FORMATS     = ['PNG', 'JPG', 'WEBP'];
const STYLE_CHIPS = ['Cinematic', 'Photorealistic', 'Oil Painting', 'Anime', 'Watercolor', 'Sketch', 'Neon', '3D Render', 'Vintage', 'Minimalist'];
const TAG_CHIPS   = [
  { label: 'golden hour',       cat: 'lighting'   },
  { label: '8K detail',         cat: 'technical'  },
  { label: 'bokeh',             cat: 'lighting'   },
  { label: 'film grain',        cat: 'style'      },
  { label: 'dramatic lighting', cat: 'lighting'   },
  { label: 'hyperrealistic',    cat: 'technical'  },
];
const HIST_ITEMS = [
  { id: 1, src: 'https://picsum.photos/seed/ai-gen-portrait-1/400/400',  prompt: 'cinematic portrait golden hour', ratio: '1:1',  time: '2m ago'  },
  { id: 2, src: 'https://picsum.photos/seed/ai-fashion-edit-1/400/400',  prompt: 'aerial city skyline at night',  ratio: '16:9', time: '8m ago'  },
  { id: 3, src: 'https://picsum.photos/seed/ai-cinematic-1/400/400',     prompt: 'abstract neon geometric',       ratio: '1:1',  time: '15m ago' },
  { id: 4, src: 'https://picsum.photos/seed/ai-landscape-1/400/400',     prompt: 'product shot white background', ratio: '3:2',  time: '1h ago'  },
  { id: 5, src: 'https://picsum.photos/seed/ai-gen-portrait-1/400/400',  prompt: 'fantasy landscape mountains',   ratio: '16:9', time: '2h ago'  },
];
const IMGS = [
  'https://picsum.photos/seed/ai-gen-portrait-1/400/400',
  'https://picsum.photos/seed/ai-fashion-edit-1/400/400',
  'https://picsum.photos/seed/ai-cinematic-1/400/400',
  'https://picsum.photos/seed/ai-landscape-1/400/400',
];

const tagColor = (cat: string) => {
  if (cat === 'style')    return { bg: '#fff7ed', border: '#fed7aa', color: P.rose };
  if (cat === 'lighting') return { bg: '#fff7ed', border: '#fed7aa', color: P.coral };
  return { bg: '#f0fdfa', border: '#99f6e4', color: '#0d9488' };
};

interface ImageGeneratorViewProps {
  onBack: () => void;
  pinnedChar?: { id: string; name: string; color: string; refs: string[] } | null;
}

export default function ImageGeneratorView({ onBack, pinnedChar }: ImageGeneratorViewProps) {
  const { isDark, T } = useTheme();
  const [model,               setModel]               = useState('auto');
  const [prompt,              setPrompt]              = useState('');
  const [count,               setCount]               = useState(4);
  const [ratio,               setRatio]               = useState('1:1');
  const [format,              setFormat]              = useState('PNG');
  const [resolution,          setResolution]          = useState('1024px');
  const [cfg,                 setCfg]                 = useState(7);
  const [steps,               setSteps]               = useState(30);
  const [seed,                setSeed]                = useState('');
  const [seedLocked,          setSeedLocked]          = useState(false);
  const [negPrompt,           setNegPrompt]           = useState('');
  const [showNeg,             setShowNeg]             = useState(false);
  const [modeTab,             setModeTab]             = useState<'text'|'image'|'inpaint'>('text');
  const [refImage,            setRefImage]            = useState<string | null>(null);
  const [inpaintImage,        setInpaintImage]        = useState<string | null>(null);
  const [strength,            setStrength]            = useState(75);
  const [brushSize,           setBrushSize]           = useState(30);
  const [showModels,          setShowModels]          = useState(false);
  const imgInputRef   = useRef<HTMLInputElement>(null);
  const inpInputRef   = useRef<HTMLInputElement>(null);
  const [showRight,           setShowRight]           = useState(true);
  const [showHistory,         setShowHistory]         = useState(false);
  const [showStyleAccordion,  setShowStyleAccordion]  = useState(false);
  const [showAdvAccordion,    setShowAdvAccordion]    = useState(false);
  const [layout,              setLayout]              = useState<1|2|4>(4);
  const [generating,          setGenerating]          = useState(false);
  const [generated,           setGenerated]           = useState(false);
  const [progress,            setProgress]            = useState(0);
  const [genPhase,            setGenPhase]            = useState<Phase>('complete');
  const [elapsed,             setElapsed]             = useState(0);
  const [toast,               setToast]               = useState<string | null>(null);
  const [deletedIds,          setDeletedIds]          = useState<Set<number>>(new Set());

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2200); };

  const selectedModel = MODELS.find(m => m.id === model)!;

  useEffect(() => {
    if (!generating) { setElapsed(0); return; }
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, [generating]);

  const handleGenerate = () => {
    if ((!prompt.trim() && modeTab === 'text') || generating) return;
    setGenerating(true); setGenerated(false); setProgress(0); setGenPhase('queued');
    setTimeout(() => setGenPhase('init'), 350);
    setTimeout(() => setGenPhase('diffusing'), 750);
    const iv = setInterval(() => setProgress(p => p >= 88 ? p : p + Math.random() * 7), 120);
    setTimeout(() => { setGenPhase('postprocess'); setProgress(94); }, 2300);
    setTimeout(() => {
      clearInterval(iv); setProgress(100);
      setTimeout(() => { setGenerating(false); setGenerated(true); setGenPhase('complete'); }, 200);
    }, 2900);
  };

  const gridCols    = layout === 1 ? 'grid-cols-1' : 'grid-cols-2';
  const displayCount = layout === 1 ? 1 : layout === 2 ? 2 : count;

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative" style={{ background: T.bg }}>
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="absolute top-3 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl text-[11.5px] font-semibold text-white shadow-lg pointer-events-none"
            style={{ background: P.rose }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT PANEL ── */}
        <div className="shrink-0 flex flex-col overflow-hidden" style={{ width: 300, borderRight: `1px solid ${T.border}`, background: T.bgSub }}>

          {/* Header */}
          <div className="px-4 pt-3.5 pb-3 shrink-0" style={{ borderBottom: `1px solid ${T.border}`, background: T.bg }}>
            <button onClick={onBack} className="flex items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer mb-2.5" style={{ color: T.textMuted }}>
              <ChevronLeft className="w-3.5 h-3.5" />Tools
            </button>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[13.5px] font-bold" style={{ color: T.text }}>Image Generator</h2>
              <button className="text-[10.5px] font-medium px-2.5 py-1 rounded-lg transition-colors cursor-pointer" style={{ color: T.textSub, border: `1px solid ${T.border}` }}>Templates</button>
            </div>
            {pinnedChar && (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl mb-2.5 border"
                style={{ background: pinnedChar.color + '10', borderColor: pinnedChar.color + '35', color: pinnedChar.color }}>
                <Pin className="w-3 h-3 shrink-0" />
                <span className="text-[10.5px] font-bold truncate">Character Active: {pinnedChar.name}</span>
              </div>
            )}
            {/* Mode tabs */}
            <div className="flex rounded-lg p-0.5 gap-0.5" style={{ background: T.bgHover }}>
              {(['text', 'image', 'inpaint'] as const).map(tab => (
                <button key={tab} onClick={() => setModeTab(tab)}
                  className="flex-1 py-1.5 rounded-md text-[10.5px] font-semibold capitalize transition-all cursor-pointer"
                  style={modeTab === tab ? { background: T.bg, color: T.text, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } : { color: T.textMuted }}>
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable body — content switches per tab */}
          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">

            {/* Model selector — always visible */}
            <div>
              <label className="text-[9px] font-semibold uppercase tracking-widest block mb-1.5" style={{ color: T.textMuted }}>Model</label>
              <div className="relative">
                <button onClick={() => setShowModels(s => !s)}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl transition-colors cursor-pointer"
                  style={{ background: T.bg, border: `1px solid ${T.border}` }}>
                  <Sparkles className="w-3.5 h-3.5 shrink-0" style={{ color: P.rose }} />
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-[12px] font-semibold" style={{ color: T.text }}>{selectedModel.label}</p>
                    <p className="text-[10px] truncate" style={{ color: T.textMuted }}>{selectedModel.desc}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 transition-transform shrink-0" style={{ color: T.textMuted, transform: showModels ? 'rotate(180deg)' : undefined }} />
                </button>
                {showModels && (
                  <div className="absolute top-full left-0 right-0 mt-1 rounded-xl shadow-lg z-20 overflow-hidden" style={{ background: T.bg, border: `1px solid ${T.border}` }}>
                    {MODELS.map(m => (
                      <button key={m.id} onClick={() => { setModel(m.id); setShowModels(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors cursor-pointer"
                        style={{ background: model === m.id ? T.bgHover : 'transparent' }}>
                        <div className="flex-1">
                          <p className="text-[12px] font-semibold" style={{ color: T.text }}>{m.label}</p>
                          <p className="text-[10px]" style={{ color: T.textMuted }}>{m.desc}</p>
                        </div>
                        {model === m.id && <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: P.rose }} />}
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
                  <label className="text-[9px] font-semibold uppercase tracking-widest block mb-1.5" style={{ color: T.textMuted }}>Prompt</label>
                  <div className="relative">
                    <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
                      placeholder="Describe your image in detail…"
                      className="w-full min-h-[120px] px-3 py-2.5 pb-8 rounded-xl text-[12px] outline-none focus:border-orange-300 transition-colors resize-none" style={{ background: T.inputBg, border: `1px solid ${T.border}`, color: T.text }} />
                    <button onClick={() => setPrompt(p => p ? `${p}, cinematic lighting, ultra detailed, 8K` : 'cinematic lighting, ultra detailed, 8K')}
                      className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold text-white hover:opacity-90 transition-all cursor-pointer"
                      style={{ background: P.rose }}>
                      <Wand2 className="w-3 h-3" />Enhance
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-semibold uppercase tracking-widest block mb-1.5" style={{ color: T.textMuted }}>Quick styles</label>
                  <div className="flex flex-wrap gap-1.5">
                    {STYLE_CHIPS.slice(0, 6).map(chip => (
                      <button key={chip} onClick={() => setPrompt(p => p ? `${p}, ${chip}` : chip)}
                        className="px-2.5 py-1 rounded-full text-[10.5px] font-medium border transition-all cursor-pointer hover:opacity-80"
                        style={{ background: T.bgCard, borderColor: T.border, color: T.textSub }}>
                        {chip}
                      </button>
                    ))}
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
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: T.textMuted }}>References</label>
                    <span className="text-[9px]" style={{ color: T.textMuted }}>{pinnedChar ? pinnedChar.refs.length : 0} / 8</span>
                  </div>
                  {pinnedChar ? (
                    <div className="rounded-xl p-2.5 flex flex-col gap-2" style={{ background: T.bgSub, border: `1px solid ${pinnedChar.color + '40'}` }}>
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="w-3 h-3 shrink-0" style={{ color: pinnedChar.color }} />
                        <span className="text-[10px] font-bold truncate" style={{ color: pinnedChar.color }}>{pinnedChar.name}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1">
                        {pinnedChar.refs.map((src, ri) => (
                          <div key={ri} className="aspect-square rounded-lg overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
                            <img src={src} alt="" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      {[{ icon: Star, label: 'Style' }, { icon: User, label: 'Character' }, { icon: Plus, label: 'Add' }].map(({ icon: Icon, label }) => (
                        <button key={label}
                          className="flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl transition-colors cursor-pointer"
                          style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
                          <Icon className="w-3.5 h-3.5" style={{ color: T.textMuted }} />
                          <span className="text-[9.5px] font-medium" style={{ color: T.textMuted }}>{label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <button onClick={() => setShowNeg(s => !s)}
                    className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-widest transition-colors cursor-pointer" style={{ color: T.textMuted }}>
                    <ChevronRight className={`w-3 h-3 transition-transform ${showNeg ? 'rotate-90' : ''}`} />
                    Negative Prompt
                  </button>
                  {showNeg && (
                    <textarea value={negPrompt} onChange={e => setNegPrompt(e.target.value)}
                      placeholder="What to exclude…"
                      className="mt-2 w-full h-16 px-3 py-2 rounded-xl text-[11.5px] outline-none transition-colors resize-none"
                      style={{ background: T.inputBg, border: `1px solid ${T.border}`, color: T.text }} />
                  )}
                </div>
              </>
            )}

            {/* ── TAB: IMAGE (img2img) ── */}
            {modeTab === 'image' && (
              <>
                <div>
                  <label className="text-[9px] font-semibold uppercase tracking-widest block mb-1.5" style={{ color: T.textMuted }}>Reference Image</label>
                  <input ref={imgInputRef} type="file" accept="image/*" className="hidden"
                    onChange={e => {
                      const f = e.target.files?.[0];
                      if (f) setRefImage(URL.createObjectURL(f));
                    }} />
                  {refImage ? (
                    <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: '4/3', border: `1px solid ${T.border}` }}>
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
                        <p className="text-[12px] font-semibold" style={{ color: T.textSub }}>Drop image here</p>
                        <p className="text-[10.5px] mt-0.5" style={{ color: T.textMuted }}>PNG, JPG, WEBP · up to 20MB</p>
                      </div>
                    </button>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: T.textMuted }}>Influence Strength</label>
                    <span className="text-[10px] font-bold" style={{ color: T.text }}>{strength}%</span>
                  </div>
                  <input type="range" min={10} max={100} step={5} value={strength}
                    onChange={e => setStrength(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{ accentColor: P.rose, background: T.bgCard }} />
                  <div className="flex justify-between mt-1">
                    <span className="text-[9px]" style={{ color: T.textMuted }}>Preserve original</span>
                    <span className="text-[9px]" style={{ color: T.textMuted }}>Full AI control</span>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-semibold uppercase tracking-widest block mb-1.5" style={{ color: T.textMuted }}>Transformation Prompt</label>
                  <div className="relative">
                    <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
                      placeholder="Describe how to transform the reference image…"
                      className="w-full min-h-[100px] px-3 py-2.5 pb-8 rounded-xl text-[12px] outline-none focus:border-orange-300 transition-colors resize-none" style={{ background: T.inputBg, border: `1px solid ${T.border}`, color: T.text }} />
                    <button onClick={() => setPrompt(p => p ? `${p}, cinematic lighting, ultra detailed` : 'cinematic lighting, ultra detailed')}
                      className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold text-white hover:opacity-90 transition-all cursor-pointer"
                      style={{ background: P.rose }}>
                      <Wand2 className="w-3 h-3" />Enhance
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-semibold uppercase tracking-widest block mb-1.5" style={{ color: T.textMuted }}>Quick Styles</label>
                  <div className="flex flex-wrap gap-1.5">
                    {STYLE_CHIPS.slice(0, 6).map(chip => (
                      <button key={chip} onClick={() => setPrompt(p => p ? `${p}, ${chip}` : chip)}
                        className="px-2.5 py-1 rounded-full text-[10.5px] font-medium border transition-all cursor-pointer hover:opacity-80"
                        style={{ background: T.bgCard, borderColor: T.border, color: T.textSub }}>
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ── TAB: INPAINT ── */}
            {modeTab === 'inpaint' && (
              <>
                <div>
                  <label className="text-[9px] font-semibold uppercase tracking-widest block mb-1.5" style={{ color: T.textMuted }}>Base Image</label>
                  <input ref={inpInputRef} type="file" accept="image/*" className="hidden"
                    onChange={e => {
                      const f = e.target.files?.[0];
                      if (f) setInpaintImage(URL.createObjectURL(f));
                    }} />
                  {inpaintImage ? (
                    <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: '4/3', border: `1px solid ${T.border}` }}>
                      <img src={inpaintImage} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2.5 text-center shadow-lg">
                          <Brush className="w-4 h-4 mx-auto mb-1 text-zinc-600" />
                          <p className="text-[10.5px] font-semibold text-zinc-800">Paint mask on canvas</p>
                          <p className="text-[9.5px] text-zinc-500">Use brush to mark edit area</p>
                        </div>
                      </div>
                      <button onClick={() => setInpaintImage(null)}
                        className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center cursor-pointer hover:bg-black/80 transition-colors">
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => inpInputRef.current?.click()}
                      className="w-full flex flex-col items-center justify-center gap-2 py-7 border-2 border-dashed rounded-xl hover:border-orange-300 transition-all cursor-pointer"
                      style={{ background: T.bgSub, borderColor: T.border }}>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm"
                        style={{ background: T.bg, border: `1px solid ${T.border}` }}>
                        <Upload className="w-4 h-4" style={{ color: T.textMuted }} />
                      </div>
                      <div className="text-center">
                        <p className="text-[12px] font-semibold" style={{ color: T.textSub }}>Upload base image</p>
                        <p className="text-[10.5px] mt-0.5" style={{ color: T.textMuted }}>Then paint the area to edit</p>
                      </div>
                    </button>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: T.textMuted }}>Brush Size</label>
                    <span className="text-[10px] font-bold" style={{ color: T.text }}>{brushSize}px</span>
                  </div>
                  <input type="range" min={5} max={80} step={5} value={brushSize}
                    onChange={e => setBrushSize(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{ accentColor: P.rose, background: T.bgCard }} />
                </div>

                <div>
                  <label className="text-[9px] font-semibold uppercase tracking-widest block mb-1.5" style={{ color: T.textMuted }}>Fill Prompt</label>
                  <div className="relative">
                    <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
                      placeholder="Describe what to replace the masked area with…"
                      className="w-full min-h-[100px] px-3 py-2.5 pb-8 rounded-xl text-[12px] outline-none focus:border-orange-300 transition-colors resize-none" style={{ background: T.inputBg, border: `1px solid ${T.border}`, color: T.text }} />
                    <button onClick={() => setPrompt(p => p ? `${p}, seamlessly blended, photorealistic` : 'seamlessly blended, photorealistic')}
                      className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold text-white hover:opacity-90 transition-all cursor-pointer"
                      style={{ background: P.rose }}>
                      <Wand2 className="w-3 h-3" />Enhance
                    </button>
                  </div>
                </div>

                <div className="rounded-xl p-3" style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
                  <p className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: T.textMuted }}>Mask Options</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {['Soft edge', 'Hard edge', 'Feather 5px', 'Expand mask'].map(opt => (
                      <button key={opt}
                        className="px-2.5 py-1 rounded-full text-[10px] font-medium border transition-all cursor-pointer hover:opacity-80"
                        style={{ background: T.bg, borderColor: T.border, color: T.textSub }}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Generate button — pinned */}
          <div className="px-4 py-3.5 shrink-0" style={{ borderTop: `1px solid ${T.border}`, background: T.bg }}>
            <button onClick={handleGenerate}
              disabled={(!prompt.trim() && modeTab === 'text') || generating || (modeTab === 'image' && !refImage) || (modeTab === 'inpaint' && !inpaintImage)}
              className="w-full flex items-center justify-center gap-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer"
              style={(prompt.trim() || modeTab !== 'text') && !generating && !(modeTab === 'image' && !refImage) && !(modeTab === 'inpaint' && !inpaintImage)
                ? { background: P.rose, color: '#fff', height: 48 }
                : { background: T.bgCard, color: T.textMuted, height: 48, cursor: 'not-allowed' }}>
              {generating
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{PHASE_META[genPhase]?.label ?? 'Generating'}…</>
                : modeTab === 'text'    ? <><Sparkles className="w-4 h-4" />Generate Image</>
                : modeTab === 'image'   ? <><Sparkles className="w-4 h-4" />Transform Image</>
                :                        <><Sparkles className="w-4 h-4" />Inpaint & Fill</>
              }
            </button>
          </div>
        </div>

        {/* ── CENTER PANEL ── */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Toolbar */}
          <div className="h-11 flex items-center px-4 gap-2 shrink-0" style={{ borderBottom: `1px solid ${T.borderMuted}`, background: T.bg }}>
            {/* Layout toggle */}
            <div className="flex items-center gap-0.5 rounded-lg p-0.5" style={{ background: T.bgHover }}>
              {([1, 2, 4] as const).map(n => (
                <button key={n} onClick={() => setLayout(n)}
                  className="w-7 h-7 rounded-md flex items-center justify-center transition-all cursor-pointer"
                  style={layout === n ? { background: T.bg, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } : {}}>
                  <LayoutGrid className="w-3.5 h-3.5" style={{ color: layout === n ? T.text : T.textMuted }} />
                </button>
              ))}
            </div>

            {/* Count stepper */}
            <div className="flex items-center gap-1 ml-auto shrink-0">
              <button onClick={() => setCount(c => Math.max(1, c - 1))} className="w-6 h-6 rounded-md flex items-center justify-center cursor-pointer transition-colors" style={{ border: `1px solid ${T.border}`, color: T.textSub }}><Minus className="w-3 h-3" /></button>
              <span className="text-[12px] font-bold w-5 text-center" style={{ color: T.text }}>{count}</span>
              <button onClick={() => setCount(c => Math.min(8, c + 1))} className="w-6 h-6 rounded-md flex items-center justify-center cursor-pointer transition-colors" style={{ border: `1px solid ${T.border}`, color: T.textSub }}><Plus className="w-3 h-3" /></button>
            </div>

            {/* History toggle */}
            <button onClick={() => setShowHistory(s => !s)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10.5px] font-semibold transition-all cursor-pointer border"
              style={showHistory
                ? { background: '#fff7ed', borderColor: '#fed7aa', color: '#c2410c' }
                : { borderColor: T.border, color: T.textSub }}>
              <History className="w-3 h-3" />History
            </button>

            {/* Right panel toggle */}
            <button onClick={() => setShowRight(s => !s)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10.5px] font-semibold transition-all cursor-pointer border"
              style={showRight
                ? { background: '#fff7ed', borderColor: '#fed7aa', color: '#c2410c' }
                : { borderColor: T.border, color: T.textSub }}>
              <Settings2 className="w-3 h-3" />Controls
            </button>
          </div>

          {/* Preview area */}
          <div className="flex-1 overflow-y-auto p-5" style={{ background: T.bgSub }}>
            {!generated && !generating ? (
              <div className="h-full min-h-[280px] flex flex-col items-center justify-center gap-5">
                <div className="grid grid-cols-2 gap-3 opacity-30 pointer-events-none" style={{ width: 220 }}>
                  {[0,1,2,3].map(i => (
                    <div key={i} className="bg-zinc-200 rounded-xl" style={{ aspectRatio: ratio.split(':').map(Number).reduce((a,b) => a/b) || 1 }} />
                  ))}
                </div>
                <div className="text-center -mt-1">
                  <p className="text-[13px] font-semibold" style={{ color: T.textSub }}>Describe your vision</p>
                  <p className="text-[11.5px] mt-1" style={{ color: T.textMuted }}>Write a prompt and click Generate to create images</p>
                </div>
              </div>
            ) : generating ? (
              <div className="h-full min-h-[280px] flex flex-col items-center justify-center gap-5 px-8">
                {/* Phase badge */}
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold border transition-all duration-500"
                  style={{ borderColor: PHASE_META[genPhase].color + '55', background: PHASE_META[genPhase].color + '14', color: PHASE_META[genPhase].color }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse inline-block" style={{ background: PHASE_META[genPhase].color }} />
                  {PHASE_META[genPhase].label}
                </div>

                {/* Description + timer */}
                <div className="text-center">
                  <p className="text-[13px] font-semibold transition-all" style={{ color: T.textSub }}>{PHASE_META[genPhase].desc}</p>
                  <p className="text-[11px] mt-1 font-mono" style={{ color: T.textMuted }}>
                    {elapsed}s elapsed · ETA ~{Math.max(0, 3 - elapsed)}s
                  </p>
                </div>

                {/* Phase step dots */}
                <div className="flex items-center gap-2">
                  {PHASES.map((ph, idx) => {
                    const curIdx = PHASES.indexOf(genPhase as typeof PHASES[number]);
                    return (
                      <div key={ph} className="transition-all duration-300 rounded-full" style={{
                        width: idx === curIdx ? 10 : 6, height: idx === curIdx ? 10 : 6,
                        background: idx < curIdx ? P.rose : idx === curIdx ? P.hotPink : '#e4e4e7',
                        opacity: idx === curIdx ? 1 : idx < curIdx ? 0.7 : 0.4,
                      }} />
                    );
                  })}
                </div>

                {/* Progress bar */}
                <div className="w-full max-w-xs space-y-2">
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: T.bgCard }}>
                    <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${P.coral}, ${P.hotPink})` }} />
                  </div>
                  <div className="flex justify-between text-[10.5px]" style={{ color: T.textMuted }}>
                    <span>{Math.round(progress)}%</span>
                    <span>{count} image{count > 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`grid ${gridCols} gap-3`}>
                {Array.from({ length: displayCount }).map((_, i) => {
                  if (deletedIds.has(i)) return null;
                  return (
                    <motion.div key={i}
                      initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.08 }}
                      className="group relative bg-zinc-200 rounded-2xl overflow-hidden cursor-pointer border border-zinc-200 hover:border-zinc-300 transition-colors"
                      style={{ aspectRatio: ratio.split(':').map(Number).reduce((a, b) => a / b) }}>
                      <img src={IMGS[i % IMGS.length]} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors" />
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        {[
                          { icon: Maximize2,  label: 'Upscale',    tooltip: 'Upscale to 4×', action: () => showToast('Queued for 4× upscale — check Library') },
                          { icon: Copy,       label: 'Vary',       tooltip: 'Generate a variation', action: () => { setGenerated(false); handleGenerate(); } },
                          { icon: Download,   label: 'Save',       tooltip: 'Save to Library', action: () => showToast('Saved to Library') },
                          { icon: UserCheck,  label: 'Character',  tooltip: 'Save as Character reference', action: () => showToast('Added to Character Library') },
                          { icon: Trash2,     label: 'Delete',     tooltip: 'Remove this output', action: () => setDeletedIds(s => new Set([...s, i])) },
                        ].map(({ icon: Icon, label, tooltip, action }) => (
                          <button key={label} title={tooltip} aria-label={tooltip}
                            onClick={e => { e.stopPropagation(); action(); }}
                            className="flex-1 flex items-center justify-center py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-[9px] font-semibold text-zinc-800 hover:bg-white transition-colors cursor-pointer gap-0.5">
                            <Icon className="w-3 h-3 shrink-0" /><span className="hidden sm:inline truncate">{label}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
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
              className="shrink-0 flex flex-col overflow-hidden" style={{ borderLeft: `1px solid ${T.border}`, background: T.bg }}>

              <div className="px-4 py-3 shrink-0 flex items-center justify-between" style={{ borderBottom: `1px solid ${T.borderMuted}` }}>
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: T.textSub }}>Controls</span>
                <button onClick={() => setShowRight(false)} className="w-6 h-6 rounded-md flex items-center justify-center cursor-pointer transition-colors" style={{ color: T.textMuted }}>
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">

                {/* Model Settings */}
                <div className="px-4 py-3.5" style={{ borderBottom: `1px solid ${T.borderMuted}` }}>
                  <p className="text-[9px] font-bold uppercase tracking-widest mb-3" style={{ color: T.textMuted }}>Model Settings</p>
                  <label className="text-[10px] font-medium block mb-1.5" style={{ color: T.textSub }}>Seed</label>
                  <div className="flex gap-1.5">
                    <input value={seed} onChange={e => setSeed(e.target.value)} disabled={seedLocked}
                      placeholder="Random"
                      className="flex-1 h-8 px-3 rounded-lg text-[11px] outline-none focus:border-orange-300 disabled:opacity-50 transition-colors"
                      style={{ background: T.inputBg, border: `1px solid ${T.border}`, color: T.text }} />
                    <button onClick={() => setSeedLocked(s => !s)}
                      className="w-8 h-8 rounded-lg border flex items-center justify-center cursor-pointer transition-all"
                      style={seedLocked
                        ? { background: '#fff7ed', borderColor: '#fed7aa' }
                        : { background: T.bg, borderColor: T.border }}>
                      {seedLocked
                        ? <Lock className="w-3.5 h-3.5" style={{ color: P.rose }} />
                        : <Unlock className="w-3.5 h-3.5" style={{ color: T.textMuted }} />}
                    </button>
                  </div>
                </div>

                {/* Output Settings */}
                <div className="px-4 py-3.5" style={{ borderBottom: `1px solid ${T.borderMuted}` }}>
                  <p className="text-[9px] font-bold uppercase tracking-widest mb-3" style={{ color: T.textMuted }}>Output Settings</p>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-medium block mb-1.5" style={{ color: T.textSub }}>Aspect Ratio</label>
                      <div className="grid grid-cols-3 gap-1">
                        {RATIOS.map(r => (
                          <button key={r} onClick={() => setRatio(r)}
                            className="py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer"
                            style={ratio === r
                              ? { background: P.rose, color: '#fff', borderColor: 'transparent' }
                              : { background: T.bg, borderColor: T.border, color: T.textSub }}>
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-medium block mb-1.5" style={{ color: T.textSub }}>Resolution</label>
                      <div className="grid grid-cols-2 gap-1">
                        {RESOLUTIONS.map(res => (
                          <button key={res} onClick={() => setResolution(res)}
                            className="py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer"
                            style={resolution === res
                              ? { background: P.rose, color: '#fff', borderColor: 'transparent' }
                              : { background: T.bg, borderColor: T.border, color: T.textSub }}>
                            {res}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-medium block mb-1.5" style={{ color: T.textSub }}>Format</label>
                      <div className="grid grid-cols-3 gap-1">
                        {FORMATS.map(f => (
                          <button key={f} onClick={() => setFormat(f)}
                            className="py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer"
                            style={format === f
                              ? { background: P.rose, color: '#fff', borderColor: 'transparent' }
                              : { background: T.bg, borderColor: T.border, color: T.textSub }}>
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Creativity */}
                <div className="px-4 py-3.5" style={{ borderBottom: `1px solid ${T.borderMuted}` }}>
                  <p className="text-[9px] font-bold uppercase tracking-widest mb-3" style={{ color: T.textMuted }}>Creativity</p>
                  <div className="space-y-4">
                    {[
                      { label: 'CFG Scale', value: cfg,   set: setCfg,   min: 1,  max: 20,  step: 1  },
                      { label: 'Steps',     value: steps, set: setSteps, min: 10, max: 100, step: 5  },
                    ].map(({ label, value, set, min, max, step }) => (
                      <div key={label}>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-[10px] font-medium" style={{ color: T.textSub }}>{label}</label>
                          <span className="text-[10px] font-bold" style={{ color: T.textSub }}>{value}</span>
                        </div>
                        <input type="range" min={min} max={max} step={step} value={value}
                          onChange={e => set(Number(e.target.value))}
                          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                          style={{ accentColor: P.rose, background: T.bgCard }} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Style accordion */}
                <div style={{ borderBottom: `1px solid ${T.border}` }}>
                  <button onClick={() => setShowStyleAccordion(s => !s)}
                    className="w-full px-4 py-3.5 flex items-center justify-between cursor-pointer transition-colors"
                    onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: T.textMuted }}>Style Controls</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showStyleAccordion ? 'rotate-180' : ''}`} style={{ color: T.textMuted }} />
                  </button>
                  {showStyleAccordion && (
                    <div className="px-4 pb-3.5">
                      <div className="flex flex-wrap gap-1.5">
                        {STYLE_CHIPS.map(chip => (
                          <button key={chip} onClick={() => setPrompt(p => p ? `${p}, ${chip}` : chip)}
                            className="px-2.5 py-1 rounded-full text-[10px] font-medium border transition-all cursor-pointer hover:opacity-80"
                            style={{ background: T.bgCard, borderColor: T.border, color: T.textSub }}>
                            {chip}
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
            className="shrink-0 overflow-hidden" style={{ borderTop: `1px solid ${T.border}`, background: T.bg }}>
            <div className="h-full flex items-center gap-3 px-4 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {HIST_ITEMS.map(item => (
                <div key={item.id} className="shrink-0 flex flex-col gap-1.5 cursor-pointer group">
                  <div className="w-[118px] h-[74px] rounded-xl overflow-hidden transition-colors" style={{ border: `1px solid ${T.border}` }}>
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
