'use client';

import React, { useState, useRef } from 'react';
import {
  ChevronLeft, ChevronDown, ChevronRight, Sparkles, ImageIcon, LayoutGrid,
  Star, User, Plus, Minus, History, Settings2, Lock, Unlock,
  Download, Wand2, X, Maximize2, Copy, Trash2, Upload, Brush, Pin, UserCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const P = {
  rose: '#C94060', orange: '#D97E3A', hotPink: '#CC4A78',
  coral: '#D46280', yellow: '#FFF6A6', darkRed: '#A33550',
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
  { id: 1, src: '/pexels-didsss-2791056.jpg',         prompt: 'cinematic portrait golden hour', ratio: '1:1',  time: '2m ago'  },
  { id: 2, src: '/pexels-ganajp-15698413.jpg',         prompt: 'aerial city skyline at night',  ratio: '16:9', time: '8m ago'  },
  { id: 3, src: '/pexels-olga-178200755-12367292.jpg', prompt: 'abstract neon geometric',       ratio: '1:1',  time: '15m ago' },
  { id: 4, src: '/pexels-prathsnap-3168209.jpg',       prompt: 'product shot white background', ratio: '3:2',  time: '1h ago'  },
  { id: 5, src: '/pexels-didsss-2791056.jpg',          prompt: 'fantasy landscape mountains',   ratio: '16:9', time: '2h ago'  },
];
const IMGS = [
  '/pexels-didsss-2791056.jpg',
  '/pexels-ganajp-15698413.jpg',
  '/pexels-olga-178200755-12367292.jpg',
  '/pexels-prathsnap-3168209.jpg',
];

const tagColor = (cat: string) => {
  if (cat === 'style')    return { bg: '#fff0f3', border: '#fecdd3', color: P.rose };
  if (cat === 'lighting') return { bg: '#fff7ed', border: '#fed7aa', color: '#c2410c' };
  return { bg: '#f0fdfa', border: '#99f6e4', color: '#0d9488' };
};

interface ImageGeneratorViewProps {
  onBack: () => void;
  pinnedChar?: { id: string; name: string; color: string; refs: string[] } | null;
}

export default function ImageGeneratorView({ onBack, pinnedChar }: ImageGeneratorViewProps) {
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
  const [toast,               setToast]               = useState<string | null>(null);
  const [deletedIds,          setDeletedIds]          = useState<Set<number>>(new Set());

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2200); };

  const selectedModel = MODELS.find(m => m.id === model)!;

  const handleGenerate = () => {
    if (!prompt.trim() || generating) return;
    setGenerating(true); setGenerated(false); setProgress(0);
    const iv = setInterval(() => setProgress(p => p >= 92 ? p : p + Math.random() * 9), 150);
    setTimeout(() => {
      clearInterval(iv); setProgress(100);
      setTimeout(() => { setGenerating(false); setGenerated(true); }, 180);
    }, 2800);
  };

  const gridCols    = layout === 1 ? 'grid-cols-1' : 'grid-cols-2';
  const displayCount = layout === 1 ? 1 : layout === 2 ? 2 : count;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white relative">
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
        <div className="shrink-0 border-r border-zinc-200 flex flex-col bg-zinc-50 overflow-hidden" style={{ width: 300 }}>

          {/* Header */}
          <div className="px-4 pt-3.5 pb-3 border-b border-zinc-200 bg-white shrink-0">
            <button onClick={onBack} className="flex items-center gap-1 text-[11px] font-medium text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer mb-2.5">
              <ChevronLeft className="w-3.5 h-3.5" />Tools
            </button>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[13.5px] font-bold text-zinc-900">Image Generator</h2>
              <button className="text-[10.5px] font-medium text-zinc-500 border border-zinc-200 px-2.5 py-1 rounded-lg hover:border-zinc-400 transition-colors cursor-pointer">Templates</button>
            </div>
            {pinnedChar && (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl mb-2.5 border"
                style={{ background: pinnedChar.color + '10', borderColor: pinnedChar.color + '35', color: pinnedChar.color }}>
                <Pin className="w-3 h-3 shrink-0" />
                <span className="text-[10.5px] font-bold truncate">Character Active: {pinnedChar.name}</span>
              </div>
            )}
            {/* Mode tabs */}
            <div className="flex bg-zinc-100 rounded-lg p-0.5 gap-0.5">
              {(['text', 'image', 'inpaint'] as const).map(tab => (
                <button key={tab} onClick={() => setModeTab(tab)}
                  className={`flex-1 py-1.5 rounded-md text-[10.5px] font-semibold capitalize transition-all cursor-pointer ${modeTab === tab ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}>
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable body — content switches per tab */}
          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">

            {/* Model selector — always visible */}
            <div>
              <label className="text-[9px] font-semibold uppercase tracking-widest text-zinc-400 block mb-1.5">Model</label>
              <div className="relative">
                <button onClick={() => setShowModels(s => !s)}
                  className="w-full flex items-center gap-2 px-3 py-2.5 bg-white border border-zinc-200 rounded-xl hover:border-zinc-300 transition-colors cursor-pointer">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" style={{ color: P.rose }} />
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-[12px] font-semibold text-zinc-900">{selectedModel.label}</p>
                    <p className="text-[10px] text-zinc-400 truncate">{selectedModel.desc}</p>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform shrink-0 ${showModels ? 'rotate-180' : ''}`} />
                </button>
                {showModels && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-xl shadow-lg z-20 overflow-hidden">
                    {MODELS.map(m => (
                      <button key={m.id} onClick={() => { setModel(m.id); setShowModels(false); }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left hover:bg-zinc-50 transition-colors cursor-pointer ${model === m.id ? 'bg-zinc-50' : ''}`}>
                        <div className="flex-1">
                          <p className="text-[12px] font-semibold text-zinc-900">{m.label}</p>
                          <p className="text-[10px] text-zinc-400">{m.desc}</p>
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
                  <label className="text-[9px] font-semibold uppercase tracking-widest text-zinc-400 block mb-1.5">Prompt</label>
                  <div className="relative">
                    <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
                      placeholder="Describe your image in detail…"
                      className="w-full min-h-[120px] px-3 py-2.5 pb-8 bg-white border border-zinc-200 rounded-xl text-[12px] text-zinc-800 placeholder-zinc-400 outline-none focus:border-rose-300 transition-colors resize-none" />
                    <button onClick={() => setPrompt(p => p ? `${p}, cinematic lighting, ultra detailed, 8K` : 'cinematic lighting, ultra detailed, 8K')}
                      className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold text-white hover:opacity-90 transition-all cursor-pointer"
                      style={{ background: P.rose }}>
                      <Wand2 className="w-3 h-3" />Enhance
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-semibold uppercase tracking-widest text-zinc-400 block mb-1.5">Quick styles</label>
                  <div className="flex flex-wrap gap-1.5">
                    {STYLE_CHIPS.slice(0, 6).map(chip => (
                      <button key={chip} onClick={() => setPrompt(p => p ? `${p}, ${chip}` : chip)}
                        className="px-2.5 py-1 bg-white border border-zinc-200 rounded-full text-[10.5px] font-medium text-zinc-600 hover:border-rose-300 hover:text-rose-700 transition-all cursor-pointer">
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-semibold uppercase tracking-widest text-zinc-400 block mb-1.5">Prompt tags</label>
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
                    <label className="text-[9px] font-semibold uppercase tracking-widest text-zinc-400">References</label>
                    <span className="text-[9px] text-zinc-400">{pinnedChar ? pinnedChar.refs.length : 0} / 8</span>
                  </div>
                  {pinnedChar ? (
                    <div className="bg-white border rounded-xl p-2.5 flex flex-col gap-2" style={{ borderColor: pinnedChar.color + '40' }}>
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="w-3 h-3 shrink-0" style={{ color: pinnedChar.color }} />
                        <span className="text-[10px] font-bold truncate" style={{ color: pinnedChar.color }}>{pinnedChar.name}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1">
                        {pinnedChar.refs.map((src, ri) => (
                          <div key={ri} className="aspect-square rounded-lg overflow-hidden border border-zinc-200">
                            <img src={src} alt="" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      {[{ icon: Star, label: 'Style' }, { icon: User, label: 'Character' }, { icon: Plus, label: 'Add' }].map(({ icon: Icon, label }) => (
                        <button key={label}
                          className="flex-1 flex flex-col items-center gap-1 py-2.5 bg-white border border-zinc-200 rounded-xl hover:border-zinc-300 transition-colors cursor-pointer">
                          <Icon className="w-3.5 h-3.5 text-zinc-400" />
                          <span className="text-[9.5px] font-medium text-zinc-500">{label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <button onClick={() => setShowNeg(s => !s)}
                    className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-widest text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer">
                    <ChevronRight className={`w-3 h-3 transition-transform ${showNeg ? 'rotate-90' : ''}`} />
                    Negative Prompt
                  </button>
                  {showNeg && (
                    <textarea value={negPrompt} onChange={e => setNegPrompt(e.target.value)}
                      placeholder="What to exclude…"
                      className="mt-2 w-full h-16 px-3 py-2 bg-white border border-zinc-200 rounded-xl text-[11.5px] text-zinc-800 placeholder-zinc-400 outline-none focus:border-rose-300 transition-colors resize-none" />
                  )}
                </div>
              </>
            )}

            {/* ── TAB: IMAGE (img2img) ── */}
            {modeTab === 'image' && (
              <>
                <div>
                  <label className="text-[9px] font-semibold uppercase tracking-widest text-zinc-400 block mb-1.5">Reference Image</label>
                  <input ref={imgInputRef} type="file" accept="image/*" className="hidden"
                    onChange={e => {
                      const f = e.target.files?.[0];
                      if (f) setRefImage(URL.createObjectURL(f));
                    }} />
                  {refImage ? (
                    <div className="relative rounded-xl overflow-hidden border border-zinc-200" style={{ aspectRatio: '4/3' }}>
                      <img src={refImage} alt="" className="w-full h-full object-cover" />
                      <button onClick={() => setRefImage(null)}
                        className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center cursor-pointer hover:bg-black/80 transition-colors">
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => imgInputRef.current?.click()}
                      className="w-full flex flex-col items-center justify-center gap-2 py-7 bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-xl hover:border-rose-300 hover:bg-rose-50/30 transition-all cursor-pointer">
                      <div className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center shadow-sm">
                        <Upload className="w-4 h-4 text-zinc-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-[12px] font-semibold text-zinc-600">Drop image here</p>
                        <p className="text-[10.5px] text-zinc-400 mt-0.5">PNG, JPG, WEBP · up to 20MB</p>
                      </div>
                    </button>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[9px] font-semibold uppercase tracking-widest text-zinc-400">Influence Strength</label>
                    <span className="text-[10px] font-bold text-zinc-700">{strength}%</span>
                  </div>
                  <input type="range" min={10} max={100} step={5} value={strength}
                    onChange={e => setStrength(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none bg-zinc-200 cursor-pointer"
                    style={{ accentColor: P.rose }} />
                  <div className="flex justify-between mt-1">
                    <span className="text-[9px] text-zinc-400">Preserve original</span>
                    <span className="text-[9px] text-zinc-400">Full AI control</span>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-semibold uppercase tracking-widest text-zinc-400 block mb-1.5">Transformation Prompt</label>
                  <div className="relative">
                    <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
                      placeholder="Describe how to transform the reference image…"
                      className="w-full min-h-[100px] px-3 py-2.5 pb-8 bg-white border border-zinc-200 rounded-xl text-[12px] text-zinc-800 placeholder-zinc-400 outline-none focus:border-rose-300 transition-colors resize-none" />
                    <button onClick={() => setPrompt(p => p ? `${p}, cinematic lighting, ultra detailed` : 'cinematic lighting, ultra detailed')}
                      className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold text-white hover:opacity-90 transition-all cursor-pointer"
                      style={{ background: P.rose }}>
                      <Wand2 className="w-3 h-3" />Enhance
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-semibold uppercase tracking-widest text-zinc-400 block mb-1.5">Quick Styles</label>
                  <div className="flex flex-wrap gap-1.5">
                    {STYLE_CHIPS.slice(0, 6).map(chip => (
                      <button key={chip} onClick={() => setPrompt(p => p ? `${p}, ${chip}` : chip)}
                        className="px-2.5 py-1 bg-white border border-zinc-200 rounded-full text-[10.5px] font-medium text-zinc-600 hover:border-rose-300 hover:text-rose-700 transition-all cursor-pointer">
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
                  <label className="text-[9px] font-semibold uppercase tracking-widest text-zinc-400 block mb-1.5">Base Image</label>
                  <input ref={inpInputRef} type="file" accept="image/*" className="hidden"
                    onChange={e => {
                      const f = e.target.files?.[0];
                      if (f) setInpaintImage(URL.createObjectURL(f));
                    }} />
                  {inpaintImage ? (
                    <div className="relative rounded-xl overflow-hidden border border-zinc-200" style={{ aspectRatio: '4/3' }}>
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
                      className="w-full flex flex-col items-center justify-center gap-2 py-7 bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-xl hover:border-rose-300 hover:bg-rose-50/30 transition-all cursor-pointer">
                      <div className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center shadow-sm">
                        <Upload className="w-4 h-4 text-zinc-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-[12px] font-semibold text-zinc-600">Upload base image</p>
                        <p className="text-[10.5px] text-zinc-400 mt-0.5">Then paint the area to edit</p>
                      </div>
                    </button>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[9px] font-semibold uppercase tracking-widest text-zinc-400">Brush Size</label>
                    <span className="text-[10px] font-bold text-zinc-700">{brushSize}px</span>
                  </div>
                  <input type="range" min={5} max={80} step={5} value={brushSize}
                    onChange={e => setBrushSize(Number(e.target.value))}
                    className="w-full h-1.5 rounded-full appearance-none bg-zinc-200 cursor-pointer"
                    style={{ accentColor: P.rose }} />
                </div>

                <div>
                  <label className="text-[9px] font-semibold uppercase tracking-widest text-zinc-400 block mb-1.5">Fill Prompt</label>
                  <div className="relative">
                    <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
                      placeholder="Describe what to replace the masked area with…"
                      className="w-full min-h-[100px] px-3 py-2.5 pb-8 bg-white border border-zinc-200 rounded-xl text-[12px] text-zinc-800 placeholder-zinc-400 outline-none focus:border-rose-300 transition-colors resize-none" />
                    <button onClick={() => setPrompt(p => p ? `${p}, seamlessly blended, photorealistic` : 'seamlessly blended, photorealistic')}
                      className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold text-white hover:opacity-90 transition-all cursor-pointer"
                      style={{ background: P.rose }}>
                      <Wand2 className="w-3 h-3" />Enhance
                    </button>
                  </div>
                </div>

                <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Mask Options</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {['Soft edge', 'Hard edge', 'Feather 5px', 'Expand mask'].map(opt => (
                      <button key={opt}
                        className="px-2.5 py-1 bg-white border border-zinc-200 rounded-full text-[10px] font-medium text-zinc-600 hover:border-rose-300 hover:text-rose-700 transition-all cursor-pointer">
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Generate button — pinned */}
          <div className="px-4 py-3.5 border-t border-zinc-200 bg-white shrink-0">
            <button onClick={handleGenerate}
              disabled={(!prompt.trim() && modeTab === 'text') || generating || (modeTab === 'image' && !refImage) || (modeTab === 'inpaint' && !inpaintImage)}
              className={`w-full flex items-center justify-center gap-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
                ((!prompt.trim() && modeTab === 'text') || generating || (modeTab === 'image' && !refImage) || (modeTab === 'inpaint' && !inpaintImage))
                  ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                  : 'text-white hover:opacity-90'
              }`}
              style={(prompt.trim() || modeTab !== 'text') && !generating ? { background: P.rose, height: 48 } : { height: 48 }}>
              {generating
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating…</>
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
          <div className="h-11 border-b border-zinc-100 flex items-center px-4 gap-2 shrink-0 bg-white">
            {/* Layout toggle */}
            <div className="flex items-center gap-0.5 bg-zinc-100 rounded-lg p-0.5">
              {([1, 2, 4] as const).map(n => (
                <button key={n} onClick={() => setLayout(n)}
                  className={`w-7 h-7 rounded-md flex items-center justify-center transition-all cursor-pointer ${layout === n ? 'bg-white shadow-sm' : 'hover:bg-zinc-200'}`}>
                  <LayoutGrid className={`w-3.5 h-3.5 ${layout === n ? 'text-zinc-800' : 'text-zinc-400'}`} />
                </button>
              ))}
            </div>

            {/* Ratio pills */}
            <div className="flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {RATIOS.map(r => (
                <button key={r} onClick={() => setRatio(r)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all shrink-0 cursor-pointer ${ratio === r ? 'text-white' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}
                  style={ratio === r ? { background: P.rose } : {}}>
                  {r}
                </button>
              ))}
            </div>

            {/* Count stepper */}
            <div className="flex items-center gap-1 ml-auto shrink-0">
              <button onClick={() => setCount(c => Math.max(1, c - 1))} className="w-6 h-6 rounded-md border border-zinc-200 flex items-center justify-center text-zinc-500 hover:border-zinc-400 cursor-pointer transition-colors"><Minus className="w-3 h-3" /></button>
              <span className="text-[12px] font-bold text-zinc-700 w-5 text-center">{count}</span>
              <button onClick={() => setCount(c => Math.min(8, c + 1))} className="w-6 h-6 rounded-md border border-zinc-200 flex items-center justify-center text-zinc-500 hover:border-zinc-400 cursor-pointer transition-colors"><Plus className="w-3 h-3" /></button>
            </div>

            {/* History toggle */}
            <button onClick={() => setShowHistory(s => !s)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10.5px] font-semibold transition-all cursor-pointer border ${showHistory ? 'bg-rose-50 border-rose-200 text-rose-700' : 'border-zinc-200 text-zinc-500 hover:border-zinc-300'}`}>
              <History className="w-3 h-3" />History
            </button>

            {/* Right panel toggle */}
            <button onClick={() => setShowRight(s => !s)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10.5px] font-semibold transition-all cursor-pointer border ${showRight ? 'bg-rose-50 border-rose-200 text-rose-700' : 'border-zinc-200 text-zinc-500 hover:border-zinc-300'}`}>
              <Settings2 className="w-3 h-3" />Controls
            </button>
          </div>

          {/* Preview area */}
          <div className="flex-1 overflow-y-auto p-5 bg-zinc-50">
            {!generated && !generating ? (
              <div className="h-full min-h-[280px] flex flex-col items-center justify-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center shadow-sm">
                  <ImageIcon className="w-6 h-6 text-zinc-300" />
                </div>
                <div className="text-center">
                  <p className="text-[13px] font-semibold text-zinc-500">No output yet</p>
                  <p className="text-[11.5px] text-zinc-400 mt-1">Write a prompt and click Generate</p>
                </div>
              </div>
            ) : generating ? (
              <div className="h-full min-h-[280px] flex flex-col items-center justify-center gap-5">
                <div className="w-10 h-10 border-2 border-zinc-200 rounded-full animate-spin" style={{ borderTopColor: P.rose }} />
                <div className="flex flex-col items-center gap-2">
                  <p className="text-[13px] font-semibold text-zinc-700">Generating {count} image{count > 1 ? 's' : ''}…</p>
                  <div className="w-56 h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress}%`, background: P.rose }} />
                  </div>
                  <p className="text-[10.5px] text-zinc-400">{Math.round(progress)}%</p>
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
                          { icon: Maximize2,  label: 'Upscale',    action: () => showToast('Upscaling image to 4×…') },
                          { icon: Copy,       label: 'Vary',       action: () => { setGenerated(false); handleGenerate(); } },
                          { icon: Download,   label: 'Save',       action: () => showToast('Image saved to library') },
                          { icon: UserCheck,  label: 'Character',  action: () => showToast('Saved to Character Library') },
                          { icon: Trash2,     label: 'Delete',     action: () => setDeletedIds(s => new Set([...s, i])) },
                        ].map(({ icon: Icon, label, action }) => (
                          <button key={label} title={label} onClick={e => { e.stopPropagation(); action(); }}
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
              className="shrink-0 border-l border-zinc-200 flex flex-col bg-white overflow-hidden">

              <div className="px-4 py-3 border-b border-zinc-100 shrink-0 flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Controls</span>
                <button onClick={() => setShowRight(false)} className="w-6 h-6 rounded-md hover:bg-zinc-100 flex items-center justify-center cursor-pointer transition-colors">
                  <X className="w-3.5 h-3.5 text-zinc-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">

                {/* Model Settings */}
                <div className="px-4 py-3.5 border-b border-zinc-100">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Model Settings</p>
                  <label className="text-[10px] font-medium text-zinc-500 block mb-1.5">Seed</label>
                  <div className="flex gap-1.5">
                    <input value={seed} onChange={e => setSeed(e.target.value)} disabled={seedLocked}
                      placeholder="Random"
                      className="flex-1 h-8 px-3 bg-zinc-50 border border-zinc-200 rounded-lg text-[11px] text-zinc-800 placeholder-zinc-400 outline-none focus:border-rose-300 disabled:opacity-50 transition-colors" />
                    <button onClick={() => setSeedLocked(s => !s)}
                      className={`w-8 h-8 rounded-lg border flex items-center justify-center cursor-pointer transition-all ${seedLocked ? 'bg-rose-50 border-rose-200' : 'bg-white border-zinc-200 hover:border-zinc-300'}`}>
                      {seedLocked
                        ? <Lock className="w-3.5 h-3.5" style={{ color: P.rose }} />
                        : <Unlock className="w-3.5 h-3.5 text-zinc-400" />}
                    </button>
                  </div>
                </div>

                {/* Output Settings */}
                <div className="px-4 py-3.5 border-b border-zinc-100">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Output Settings</p>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-medium text-zinc-500 block mb-1.5">Aspect Ratio</label>
                      <div className="grid grid-cols-3 gap-1">
                        {RATIOS.map(r => (
                          <button key={r} onClick={() => setRatio(r)}
                            className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${ratio === r ? 'text-white border-transparent' : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'}`}
                            style={ratio === r ? { background: P.rose } : {}}>
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-medium text-zinc-500 block mb-1.5">Resolution</label>
                      <div className="grid grid-cols-2 gap-1">
                        {RESOLUTIONS.map(res => (
                          <button key={res} onClick={() => setResolution(res)}
                            className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${resolution === res ? 'text-white border-transparent' : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'}`}
                            style={resolution === res ? { background: P.rose } : {}}>
                            {res}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-medium text-zinc-500 block mb-1.5">Format</label>
                      <div className="grid grid-cols-3 gap-1">
                        {FORMATS.map(f => (
                          <button key={f} onClick={() => setFormat(f)}
                            className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${format === f ? 'text-white border-transparent' : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300'}`}
                            style={format === f ? { background: P.rose } : {}}>
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Creativity */}
                <div className="px-4 py-3.5 border-b border-zinc-100">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Creativity</p>
                  <div className="space-y-4">
                    {[
                      { label: 'CFG Scale', value: cfg,   set: setCfg,   min: 1,  max: 20,  step: 1  },
                      { label: 'Steps',     value: steps, set: setSteps, min: 10, max: 100, step: 5  },
                    ].map(({ label, value, set, min, max, step }) => (
                      <div key={label}>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-[10px] font-medium text-zinc-500">{label}</label>
                          <span className="text-[10px] font-bold text-zinc-700">{value}</span>
                        </div>
                        <input type="range" min={min} max={max} step={step} value={value}
                          onChange={e => set(Number(e.target.value))}
                          className="w-full h-1.5 rounded-full appearance-none bg-zinc-200 cursor-pointer"
                          style={{ accentColor: P.rose }} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Style accordion */}
                <div className="border-b border-zinc-100">
                  <button onClick={() => setShowStyleAccordion(s => !s)}
                    className="w-full px-4 py-3.5 flex items-center justify-between cursor-pointer hover:bg-zinc-50 transition-colors">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Style Controls</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${showStyleAccordion ? 'rotate-180' : ''}`} />
                  </button>
                  {showStyleAccordion && (
                    <div className="px-4 pb-3.5">
                      <div className="flex flex-wrap gap-1.5">
                        {STYLE_CHIPS.map(chip => (
                          <button key={chip} onClick={() => setPrompt(p => p ? `${p}, ${chip}` : chip)}
                            className="px-2.5 py-1 bg-zinc-50 border border-zinc-200 rounded-full text-[10px] font-medium text-zinc-600 hover:border-rose-300 hover:text-rose-700 transition-all cursor-pointer">
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
                    className="w-full px-4 py-3.5 flex items-center justify-between cursor-pointer hover:bg-zinc-50 transition-colors">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Advanced</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-semibold bg-amber-50 border border-amber-200 text-amber-700">Caution</span>
                      <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${showAdvAccordion ? 'rotate-180' : ''}`} />
                    </div>
                  </button>
                  {showAdvAccordion && (
                    <div className="px-4 pb-4 text-[11px] text-zinc-400 text-center py-3">Advanced options coming soon.</div>
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
            className="shrink-0 border-t border-zinc-200 bg-white overflow-hidden">
            <div className="h-full flex items-center gap-3 px-4 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {HIST_ITEMS.map(item => (
                <div key={item.id} className="shrink-0 flex flex-col gap-1.5 cursor-pointer group">
                  <div className="w-[118px] h-[74px] rounded-xl overflow-hidden border border-zinc-200 group-hover:border-zinc-400 transition-colors">
                    <img src={item.src} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-[9.5px] font-medium text-zinc-600 truncate w-[118px]">{item.prompt}</p>
                    <p className="text-[9px] text-zinc-400">{item.time} · {item.ratio}</p>
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
