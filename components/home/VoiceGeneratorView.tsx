'use client';

import React, { useState } from 'react';
import {
  ChevronLeft, ChevronDown, ChevronRight, Sparkles, Mic, Play, Pause,
  Download, Volume2, History, Settings2, X, Wand2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/app/context/ThemeContext';

const P = {
  rose:    '#C94060',
  orange:  '#D97E3A',
  coral:   '#D46280',
  peach:   '#FFBF80',
  vivid:   '#D46030',
  magenta: '#B050C0',
  yellow:  '#FFF6A6',
};

/* ── Pastel pill helper — tinted background, colored border ──────────────── */
const pastel = (color: string, darkText?: string) => ({
  background: color + '20',
  borderColor: color + 'bb',
  color: darkText ?? color,
});

const VOICES = [
  { id: 'nova',   label: 'Nova',   desc: 'Professional female · Clear',   color: P.coral   },
  { id: 'atlas',  label: 'Atlas',  desc: 'Authoritative male · Deep',     color: P.vivid   },
  { id: 'echo',   label: 'Echo',   desc: 'Warm neutral · Conversational', color: P.orange  },
  { id: 'aurora', label: 'Aurora', desc: 'Energetic female · Bright',     color: P.magenta },
];
const STYLES   = ['Natural', 'Expressive', 'Calm', 'Narrative'];
const SPEEDS   = ['0.75×', '1.0×', '1.25×', '1.5×'];
const FORMATS  = ['MP3', 'WAV', 'OGG'];
const EMOTIONS = ['Neutral', 'Happy', 'Sad', 'Excited', 'Serious', 'Whispery'];
const MAX      = 2000;

const HIST_ITEMS = [
  { id: 1, prompt: 'Product launch intro', voice: 'Nova',   duration: '0:18', time: '4m ago',  color: P.coral   },
  { id: 2, prompt: 'Podcast outro script', voice: 'Atlas',  duration: '0:32', time: '20m ago', color: P.vivid   },
  { id: 3, prompt: 'App onboarding guide', voice: 'Echo',   duration: '1:04', time: '45m ago', color: P.orange  },
  { id: 4, prompt: 'Brand tagline reads',  voice: 'Aurora', duration: '0:09', time: '2h ago',  color: P.magenta },
  { id: 5, prompt: 'Tutorial narration',   voice: 'Nova',   duration: '2:11', time: '3h ago',  color: P.coral   },
];

/* Waveform bar colors cycling through palette */
const WAVE_COLORS = [P.coral, P.orange, P.peach, P.magenta];
const waveColor = (i: number) => WAVE_COLORS[i % WAVE_COLORS.length];

interface VoiceGeneratorViewProps { onBack: () => void; }

export default function VoiceGeneratorView({ onBack }: VoiceGeneratorViewProps) {
  const { isDark, T } = useTheme();
  const [voice,                setVoice]                = useState('nova');
  const [text,                 setText]                 = useState('');
  const [style,                setStyle]                = useState('Natural');
  const [speed,                setSpeed]                = useState('1.0×');
  const [emotion,              setEmotion]              = useState('Neutral');
  const [format,               setFormat]               = useState('MP3');
  const [pitch,                setPitch]                = useState(0);
  const [showVoices,           setShowVoices]           = useState(false);
  const [showRight,            setShowRight]            = useState(true);
  const [showHistory,          setShowHistory]          = useState(false);
  const [showEmotionAccordion, setShowEmotionAccordion] = useState(false);
  const [showAdvAccordion,     setShowAdvAccordion]     = useState(false);
  const [generating,           setGenerating]           = useState(false);
  const [generated,            setGenerated]            = useState(false);
  const [playing,              setPlaying]              = useState(false);
  const [progress,             setProgress]             = useState(0);
  const [playProgress,         setPlayProgress]         = useState(35);

  const selectedVoice = VOICES.find(v => v.id === voice)!;
  const charCount = text.length;

  const handleGenerate = () => {
    if (!text.trim() || generating) return;
    setGenerating(true); setGenerated(false); setProgress(0);
    const iv = setInterval(() => setProgress(p => p >= 90 ? p : p + Math.random() * 10), 130);
    setTimeout(() => {
      clearInterval(iv); setProgress(100);
      setTimeout(() => { setGenerating(false); setGenerated(true); }, 180);
    }, 2200);
  };

  const genGradient = `linear-gradient(135deg, ${P.coral}, ${P.magenta})`;

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: T.bg }}>
      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT PANEL ── */}
        <div className="shrink-0 flex flex-col overflow-hidden" style={{ width: 300, borderRight: `1px solid ${T.border}`, background: T.bgSub }}>

          {/* Header */}
          <div className="px-4 pt-3.5 pb-3 shrink-0" style={{ borderBottom: `1px solid ${T.border}`, background: T.bg }}>
            <button onClick={onBack} className="flex items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer mb-2.5" style={{ color: T.textMuted }}>
              <ChevronLeft className="w-3.5 h-3.5" />Tools
            </button>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[13.5px] font-bold" style={{ color: T.text }}>Voice Generator</h2>
              <button className="text-[10.5px] font-medium px-2.5 py-1 rounded-lg transition-colors cursor-pointer" style={{ color: T.textSub, border: `1px solid ${T.border}` }}>Templates</button>
            </div>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">

            {/* Voice selector */}
            <div>
              <label className="text-[9px] font-semibold uppercase tracking-widest block mb-1.5" style={{ color: T.textMuted }}>Voice</label>
              <div className="relative">
                <button onClick={() => setShowVoices(s => !s)}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl transition-colors cursor-pointer"
                  style={{ background: T.bg, border: `1px solid ${T.border}` }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: selectedVoice.color + '30', border: `1.5px solid ${selectedVoice.color}70` }}>
                    <Volume2 className="w-3 h-3" style={{ color: selectedVoice.color }} />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-[12px] font-semibold" style={{ color: T.text }}>{selectedVoice.label}</p>
                    <p className="text-[10px] truncate" style={{ color: T.textMuted }}>{selectedVoice.desc}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 transition-transform shrink-0" style={{ color: T.textMuted, transform: showVoices ? 'rotate(180deg)' : undefined }} />
                </button>
                {showVoices && (
                  <div className="absolute top-full left-0 right-0 mt-1 rounded-xl shadow-lg z-20 overflow-hidden" style={{ background: T.bg, border: `1px solid ${T.border}` }}>
                    {VOICES.map(v => (
                      <button key={v.id} onClick={() => { setVoice(v.id); setShowVoices(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors cursor-pointer"
                        style={{ background: voice === v.id ? T.bgHover : 'transparent' }}>
                        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: v.color + '20', border: `1.5px solid ${v.color}60` }}>
                          <Volume2 className="w-3.5 h-3.5" style={{ color: v.color }} />
                        </div>
                        <div className="flex-1">
                          <p className="text-[12px] font-semibold" style={{ color: T.text }}>{v.label}</p>
                          <p className="text-[10px]" style={{ color: T.textMuted }}>{v.desc}</p>
                        </div>
                        {voice === v.id && <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: v.color }} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Text */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: T.textMuted }}>Script</label>
                <span className="text-[9px] font-medium" style={{ color: charCount > MAX * 0.9 ? '#ef4444' : T.textMuted }}>{charCount}/{MAX}</span>
              </div>
              <div className="relative">
                <textarea value={text} onChange={e => { if (e.target.value.length <= MAX) setText(e.target.value); }}
                  placeholder="Type or paste text to convert to speech…"
                  className="w-full min-h-[130px] px-3 py-2.5 pb-8 rounded-xl text-[12px] outline-none focus:border-orange-300 transition-colors resize-none"
                  style={{ background: T.inputBg, border: `1px solid ${T.border}`, color: T.text }} />
                <button className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold text-white hover:opacity-90 transition-all cursor-pointer"
                  style={{ background: P.vivid }}>
                  <Wand2 className="w-3 h-3" />Improve
                </button>
              </div>
            </div>

            {/* Style — coral pastel */}
            <div>
              <label className="text-[9px] font-semibold uppercase tracking-widest block mb-1.5" style={{ color: T.textMuted }}>Style</label>
              <div className="grid grid-cols-2 gap-1">
                {STYLES.map(s => (
                  <button key={s} onClick={() => setStyle(s)}
                    className="py-2 rounded-lg text-[11px] font-bold border transition-all cursor-pointer"
                    style={style === s
                      ? { background: P.coral, color: '#fff', borderColor: 'transparent' }
                      : { background: T.bg, borderColor: T.border, color: T.textSub }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Emotion — magenta pastel */}
            <div>
              <button onClick={() => setShowEmotionAccordion(s => !s)}
                className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-widest transition-colors cursor-pointer mb-1.5"
                style={{ color: T.textMuted }}>
                <ChevronRight className={`w-3 h-3 transition-transform ${showEmotionAccordion ? 'rotate-90' : ''}`} />
                Emotion Tone
              </button>
              {showEmotionAccordion && (
                <div className="grid grid-cols-2 gap-1">
                  {EMOTIONS.map(e => (
                    <button key={e} onClick={() => setEmotion(e)}
                      className="py-1.5 rounded-lg text-[10.5px] font-semibold border transition-all cursor-pointer"
                      style={emotion === e
                        ? { background: P.magenta, color: '#fff', borderColor: 'transparent' }
                        : { background: T.bg, borderColor: T.border, color: T.textSub }}>
                      {e}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Generate button — coral → magenta gradient */}
          <div className="px-4 py-3.5 shrink-0" style={{ borderTop: `1px solid ${T.border}`, background: T.bg }}>
            <button onClick={handleGenerate} disabled={!text.trim() || generating}
              className="w-full flex items-center justify-center gap-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer"
              style={text.trim() && !generating
                ? { background: genGradient, color: '#fff', height: 48 }
                : { background: T.bgCard, color: T.textMuted, height: 48, cursor: 'not-allowed' }}>
              {generating
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating…</>
                : <><Sparkles className="w-4 h-4" />Generate Voice</>
              }
            </button>
          </div>
        </div>

        {/* ── CENTER PANEL ── */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Toolbar */}
          <div className="h-11 flex items-center px-4 gap-2 shrink-0" style={{ borderBottom: `1px solid ${T.borderMuted}`, background: T.bg }}>
            <span className="text-[11px]" style={{ color: T.textMuted }}>
              {generated ? `${selectedVoice.label} · ${style} · ${speed}` : 'Voice output'}
            </span>
            <div className="ml-auto flex items-center gap-2">
              <button onClick={() => setShowHistory(s => !s)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10.5px] font-semibold transition-all cursor-pointer border"
                style={showHistory
                  ? { borderColor: P.coral + '60', color: P.coral, background: P.coral + '12' }
                  : { background: T.bgCard, borderColor: T.border, color: T.textSub }}>
                <History className="w-3 h-3" />History
              </button>
              <button onClick={() => setShowRight(s => !s)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10.5px] font-semibold transition-all cursor-pointer border"
                style={showRight
                  ? { borderColor: P.coral + '60', color: P.coral, background: P.coral + '12' }
                  : { borderColor: '#e4e4e7', color: '#71717a' }}>
                <Settings2 className="w-3 h-3" />Controls
              </button>
            </div>
          </div>

          {/* Preview area */}
          <div className="flex-1 overflow-y-auto p-5 flex flex-col items-center justify-center" style={{ background: T.bgSub }}>
            {!generated && !generating ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm" style={{ background: T.bg, border: `1px solid ${T.border}` }}>
                  <Mic className="w-6 h-6" style={{ color: T.textMuted }} />
                </div>
                <div className="text-center">
                  <p className="text-[13px] font-semibold" style={{ color: T.textSub }}>No audio yet</p>
                  <p className="text-[11.5px] mt-1" style={{ color: T.textMuted }}>Enter your script and click Generate</p>
                </div>
              </div>

            ) : generating ? (
              <div className="flex flex-col items-center gap-5">
                {/* Multi-color animated waveform */}
                <div className="flex items-end justify-center gap-0.5 h-12">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="w-1.5 rounded-full animate-pulse"
                      style={{
                        height: `${8 + Math.abs(Math.sin(i * 0.7)) * 30}px`,
                        background: waveColor(i),
                        opacity: 0.55 + (i % 3) * 0.15,
                        animationDelay: `${i * 60}ms`,
                      }} />
                  ))}
                </div>
                <div className="flex flex-col items-center gap-2">
                  <p className="text-[13px] font-semibold" style={{ color: T.textSub }}>Synthesizing voice…</p>
                  <div className="w-56 h-1.5 rounded-full overflow-hidden" style={{ background: T.bgCard }}>
                    <div className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${progress}%`, background: genGradient }} />
                  </div>
                  <p className="text-[10.5px]" style={{ color: T.textMuted }}>{Math.round(progress)}%</p>
                </div>
              </div>

            ) : (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-xl space-y-4">
                {/* Waveform player */}
                <div className="rounded-2xl p-5 shadow-sm" style={{ background: T.bg, border: `1px solid ${T.border}` }}>
                  {/* Multi-color waveform bars */}
                  <div className="flex items-end justify-center gap-0.5 mb-4" style={{ height: 56 }}>
                    {Array.from({ length: 64 }).map((_, i) => {
                      const played = i < (playProgress / 100) * 64;
                      return (
                        <div key={i} className="w-1 rounded-full"
                          style={{
                            height: `${6 + Math.abs(Math.sin(i * 0.45)) * 44}px`,
                            background: played ? waveColor(i) : '#e4e4e7',
                            opacity: played ? (0.7 + (i % 3) * 0.1) : 1,
                            transition: 'background 0.1s',
                          }} />
                      );
                    })}
                  </div>

                  {/* Scrubber */}
                  <div className="mb-3">
                    <div className="h-1.5 rounded-full overflow-hidden cursor-pointer" style={{ background: T.bgCard }}
                      onClick={e => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setPlayProgress(Math.round(((e.clientX - rect.left) / rect.width) * 100));
                      }}>
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${playProgress}%`, background: genGradient }} />
                    </div>
                    <div className="flex justify-between text-[10px] mt-1" style={{ color: T.textMuted }}>
                      <span>0:{String(Math.round(playProgress * 0.14)).padStart(2, '0')}</span>
                      <span>0:14</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-[11px]" style={{ color: T.textSub }}>{selectedVoice.label} · {style} · {speed}</p>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setPlaying(p => !p)}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all hover:opacity-90 cursor-pointer"
                        style={{ background: genGradient }}>
                        {playing
                          ? <Pause className="w-4 h-4" />
                          : <Play className="w-4 h-4 fill-white ml-0.5" />
                        }
                      </button>
                      <button className="w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                        style={{ border: `1px solid ${T.border}`, color: T.textSub }}>
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 justify-center">
                  <button onClick={() => setGenerated(false)}
                    className="px-4 py-2.5 rounded-xl text-[12px] font-medium transition-colors cursor-pointer"
                    style={{ border: `1px solid ${T.border}`, color: T.textSub }}>
                    Regenerate
                  </button>
                  <button className="px-4 py-2.5 rounded-xl text-[12px] font-bold text-white hover:opacity-90 transition-all cursor-pointer flex items-center gap-1.5"
                    style={{ background: genGradient }}>
                    <Download className="w-3.5 h-3.5" />Download {format}
                  </button>
                </div>
              </motion.div>
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

                {/* Voice Settings */}
                <div className="px-4 py-3.5" style={{ borderBottom: `1px solid ${T.borderMuted}` }}>
                  <p className="text-[9px] font-bold uppercase tracking-widest mb-3" style={{ color: T.textMuted }}>Voice Settings</p>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[10px] font-medium" style={{ color: T.textSub }}>Pitch</label>
                      <span className="text-[10px] font-bold" style={{ color: T.text }}>{pitch > 0 ? `+${pitch}` : pitch}</span>
                    </div>
                    <input type="range" min={-12} max={12} step={1} value={pitch}
                      onChange={e => setPitch(Number(e.target.value))}
                      className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                      style={{ background: T.bgCard, accentColor: P.coral } as React.CSSProperties} />
                  </div>
                </div>

                {/* Output Settings */}
                <div className="px-4 py-3.5" style={{ borderBottom: `1px solid ${T.borderMuted}` }}>
                  <p className="text-[9px] font-bold uppercase tracking-widest mb-3" style={{ color: T.textMuted }}>Output Settings</p>
                  <div className="space-y-3">
                    {/* Format — orange pastel */}
                    <div>
                      <label className="text-[10px] font-medium block mb-1.5" style={{ color: T.textSub }}>Format</label>
                      <div className="grid grid-cols-3 gap-1">
                        {FORMATS.map(f => (
                          <button key={f} onClick={() => setFormat(f)}
                            className="py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer"
                            style={format === f
                              ? { background: P.orange, color: '#fff', borderColor: 'transparent' }
                              : { background: T.bg, borderColor: T.border, color: T.textSub }}>
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-medium block mb-1.5" style={{ color: T.textSub }}>Sample Rate</label>
                      <div className="grid grid-cols-2 gap-1">
                        {['22kHz', '44.1kHz', '48kHz', '96kHz'].map(r => (
                          <button key={r}
                            className="py-1.5 rounded-lg text-[10px] font-semibold border transition-all cursor-pointer"
                            style={{ background: T.bg, borderColor: T.border, color: T.textSub }}>
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery */}
                <div className="px-4 py-3.5" style={{ borderBottom: `1px solid ${T.borderMuted}` }}>
                  <p className="text-[9px] font-bold uppercase tracking-widest mb-3" style={{ color: T.textMuted }}>Delivery</p>
                  <div className="space-y-3">
                    {/* Style — coral pastel */}
                    <div>
                      <label className="text-[10px] font-medium block mb-1.5" style={{ color: T.textSub }}>Style</label>
                      <div className="grid grid-cols-2 gap-1">
                        {STYLES.map(s => (
                          <button key={s} onClick={() => setStyle(s)}
                            className="py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer"
                            style={style === s
                              ? { background: P.coral, color: '#fff', borderColor: 'transparent' }
                              : { background: T.bgCard, borderColor: T.border, color: T.textSub }}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Speed — orange pastel */}
                    <div>
                      <label className="text-[10px] font-medium block mb-1.5" style={{ color: T.textSub }}>Speed</label>
                      <div className="grid grid-cols-4 gap-1">
                        {SPEEDS.map(s => (
                          <button key={s} onClick={() => setSpeed(s)}
                            className="py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer"
                            style={speed === s
                              ? { background: P.orange, color: '#fff', borderColor: 'transparent' }
                              : { background: T.bgCard, borderColor: T.border, color: T.textSub }}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Emotion accordion — magenta pastel */}
                <div className="" style={{ borderBottom: `1px solid ${T.borderMuted}` }}>
                  <button onClick={() => setShowEmotionAccordion(s => !s)}
                    className="w-full px-4 py-3.5 flex items-center justify-between cursor-pointer transition-colors"
                    style={{ color: T.textMuted }}
                    onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <span className="text-[9px] font-bold uppercase tracking-widest">Emotion Tones</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showEmotionAccordion ? 'rotate-180' : ''}`} />
                  </button>
                  {showEmotionAccordion && (
                    <div className="px-4 pb-3.5">
                      <div className="grid grid-cols-2 gap-1">
                        {EMOTIONS.map(e => (
                          <button key={e} onClick={() => setEmotion(e)}
                            className="py-1.5 rounded-lg text-[10px] font-semibold border transition-all cursor-pointer"
                            style={emotion === e
                              ? { background: P.magenta, color: '#fff', borderColor: 'transparent' }
                              : { background: T.bgCard, borderColor: T.border, color: T.textSub }}>
                            {e}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Advanced */}
                <div>
                  <button onClick={() => setShowAdvAccordion(s => !s)}
                    className="w-full px-4 py-3.5 flex items-center justify-between cursor-pointer transition-colors"
                    style={{ color: T.textMuted }}
                    onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <span className="text-[9px] font-bold uppercase tracking-widest">Advanced</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-semibold bg-amber-50 border border-amber-200 text-amber-700">Caution</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAdvAccordion ? 'rotate-180' : ''}`} />
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
                  <div className="w-[140px] h-[68px] rounded-xl border transition-colors flex flex-col items-center justify-center gap-1.5 px-3"
                    style={{ background: T.bgCard, borderColor: T.border }}>
                    {/* Per-voice color mini waveform */}
                    <div className="flex items-end gap-0.5" style={{ height: 20 }}>
                      {Array.from({ length: 18 }).map((_, i) => (
                        <div key={i} className="w-1 rounded-full"
                          style={{
                            height: `${3 + Math.abs(Math.sin(i * 0.6)) * 14}px`,
                            background: item.color,
                            opacity: 0.45 + (i % 3) * 0.18,
                          }} />
                      ))}
                    </div>
                    <span className="text-[9px] font-bold" style={{ color: T.textMuted }}>{item.duration}</span>
                  </div>
                  <div>
                    <p className="text-[9.5px] font-medium truncate w-[140px]" style={{ color: T.textSub }}>{item.prompt}</p>
                    <p className="text-[9px]" style={{ color: T.textMuted }}>{item.time} · {item.voice}</p>
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
