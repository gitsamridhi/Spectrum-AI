'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Zap, Download, RefreshCw, Play, Upload, Package, Camera } from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

const HF = 'https://static.higgsfield.ai';

const P = {
  pink:    '#EC4899',
  hot:     '#F472B6',
  magenta: '#D946EF',
  crimson: '#BE185D',
  deep:    '#9D174D',
  teal:    '#0D9488',
  mint:    '#34D399',
  bg:      '#06010e',
};

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`;

const BACKGROUNDS = [
  { id: 'white',    label: 'Studio White', color: '#f8f8f8' },
  { id: 'gradient', label: 'Deep Space',   color: 'linear-gradient(135deg, #1e1b4b, #0f172a)' },
  { id: 'dark',     label: 'Void Black',   color: '#080808' },
  { id: 'pink',     label: 'Pink Blush',   color: 'linear-gradient(135deg, #fce7f3, #fbcfe8)' },
  { id: 'chrome',   label: 'Chrome',       color: 'linear-gradient(135deg, #e2e8f0, #94a3b8)' },
  { id: 'forest',   label: 'Forest',       color: 'linear-gradient(135deg, #064e3b, #065f46)' },
] as const;

const LIGHTING_OPTS = [
  { id: 'neon',     label: 'Neon Pink',    icon: '⬡' },
  { id: 'softbox',  label: 'Soft Box',     icon: '◎' },
  { id: 'golden',   label: 'Golden Hour',  icon: '✦' },
  { id: 'highkey',  label: 'High Key',     icon: '◈' },
  { id: 'rim',      label: 'Rim Light',    icon: '◑' },
  { id: 'natural',  label: 'Daylight',     icon: '☀' },
] as const;

const SHOT_TYPES = [
  { id: 'hero',      label: 'Hero Shot',   icon: Camera },
  { id: 'lifestyle', label: 'Lifestyle',   icon: Play },
  { id: 'spin360',   label: '360° Spin',   icon: RefreshCw },
  { id: 'closeup',   label: 'Close-up',    icon: Zap },
] as const;

const RESOLUTIONS  = ['1080p', '4K', '8K'];
const OUTPUT_FMTS  = ['MP4', 'PNG', 'GIF'];
const PHASES       = ['Queued', 'Processing…', 'Rendering scene…', 'Compositing…', 'Finishing…'];

const SAMPLE_VIDEOS = [
  `${HF}/ai-video-v2/example-4-mini.mp4`,
  `${HF}/seedance-2.0-v2/examples/2-mini.mp4`,
  `${HF}/ai-video-v2/example-5-mini.mp4`,
  `${HF}/seedance-2.0-v2/examples/5-mini.mp4`,
];

function AutoVideo({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        if (!el.src) { el.src = src; el.load(); el.addEventListener('canplay', () => el.play().catch(() => {}), { once: true }); }
        else { el.play().catch(() => {}); }
      } else { el.pause(); }
    }, { threshold: 0.05 });
    obs.observe(el); return () => obs.disconnect();
  }, [src]);
  return <video ref={ref} loop muted playsInline preload="none" className={className ?? ''} />;
}

export default function ProductStudioView({ onBack }: { onBack: () => void }) {
  const { isDark, T } = useTheme();
  const [prompt,     setPrompt]     = useState('');
  const [bg,         setBg]         = useState('white');
  const [lighting,   setLighting]   = useState('neon');
  const [shotType,   setShotType]   = useState('hero');
  const [resolution, setResolution] = useState('4K');
  const [outputFmt,  setOutputFmt]  = useState('MP4');
  const [hasUpload,  setHasUpload]  = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generated,  setGenerated]  = useState(false);
  const [progress,   setProgress]   = useState(0);
  const [phase,      setPhase]      = useState('');
  const [elapsed,    setElapsed]    = useState(0);
  const [shotCount,  setShotCount]  = useState(1);
  const [blink,      setBlink]      = useState(true);

  useEffect(() => {
    if (!generating) { setElapsed(0); return; }
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, [generating]);

  useEffect(() => {
    const id = setInterval(() => setBlink(b => !b), 900);
    return () => clearInterval(id);
  }, []);

  const handleGenerate = () => {
    if ((!prompt.trim() && !hasUpload) || generating) return;
    setGenerating(true); setGenerated(false); setProgress(0); setPhase(PHASES[0]);
    PHASES.forEach((ph, i) => setTimeout(() => setPhase(ph), i * 700));
    const iv = setInterval(() => setProgress(p => p >= 88 ? p : p + Math.random() * 5.5), 120);
    setTimeout(() => { setProgress(94); }, 2800);
    setTimeout(() => {
      clearInterval(iv); setProgress(100);
      setTimeout(() => { setGenerating(false); setGenerated(true); setPhase(''); setShotCount(c => c + 1); }, 200);
    }, 3800);
  };

  const canGenerate  = (prompt.trim().length > 0 || hasUpload) && !generating;
  const selectedBg   = BACKGROUNDS.find(b => b.id === bg)!;
  const selectedShot = SHOT_TYPES.find(s => s.id === shotType)!;

  const studioBg = isDark
    ? P.bg
    : `radial-gradient(ellipse 80% 75% at 15% 15%, rgba(236,72,153,.22) 0%, transparent 52%), radial-gradient(ellipse 75% 70% at 85% 85%, rgba(168,85,247,.18) 0%, transparent 52%), radial-gradient(ellipse 60% 55% at 50% 50%, rgba(244,114,182,.10) 0%, transparent 55%), ${T.bg}`;
  const panelBg  = isDark ? '#0a0415' : T.bgSub;
  const borderC  = isDark ? 'rgba(255,255,255,0.07)' : T.border;

  const activeChip  = { background: P.pink + '25', borderColor: P.pink + '75', color: P.hot, boxShadow: isDark ? `0 0 14px ${P.pink}22` : 'none' };
  const inactiveChipStyle = { background: isDark ? 'rgba(255,255,255,0.04)' : T.bgCard, borderColor: isDark ? 'rgba(255,255,255,0.09)' : T.border, color: isDark ? 'rgba(255,255,255,0.45)' : T.textSub };

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: studioBg }}>

      {/* ── BODY ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ── LEFT PANEL — Surfaces + Lighting ── */}
        <div className="w-[220px] shrink-0 flex flex-col border-r"
          style={{ borderColor: isDark ? `${P.pink}12` : T.border, background: panelBg }}>

          {/* Back button in panel header */}
          <div className="px-3 pt-3 pb-2 flex items-center gap-2 shrink-0"
            style={{ borderBottom: `1px solid ${isDark ? `${P.pink}10` : T.border}` }}>
            <button onClick={onBack}
              className="p-1 rounded-lg cursor-pointer transition-colors shrink-0"
              style={{ color: isDark ? 'rgba(255,255,255,0.4)' : T.textSub }}>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
              style={{ background: `linear-gradient(135deg, ${P.deep}, ${P.pink})` }}>
              <Package className="w-3 h-3 text-white" />
            </div>
            <span className="text-[10px] font-bold truncate" style={{ color: isDark ? 'rgba(255,255,255,.55)' : T.textSub }}>Product</span>
          </div>

          {isDark && (
            <div className="h-px w-full shrink-0"
              style={{ background: `linear-gradient(90deg, transparent, ${P.pink}30, transparent)` }} />
          )}

          <div className="px-3 pt-4 pb-2">
            <div className="flex items-center gap-1.5 mb-3">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: P.pink, boxShadow: isDark ? `0 0 6px ${P.pink}` : 'none' }} />
              <p className="text-[8.5px] font-black uppercase tracking-widest" style={{ color: isDark ? 'rgba(255,255,255,0.38)' : T.textMuted }}>Background</p>
            </div>
            <div className="space-y-1.5">
              {BACKGROUNDS.map(b => (
                <button key={b.id} onClick={() => setBg(b.id)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-xl cursor-pointer transition-all"
                  style={bg === b.id
                    ? { background: P.pink + '15', outline: `1.5px solid ${P.pink}55`, outlineOffset: '-1.5px' }
                    : { background: 'transparent' }}>
                  <div className="w-5 h-5 rounded-lg shrink-0 border"
                    style={{ background: b.color, borderColor: isDark ? 'rgba(255,255,255,0.12)' : T.border }} />
                  <span className="text-[9.5px] font-medium leading-tight text-left"
                    style={{ color: bg === b.id ? P.hot : (isDark ? 'rgba(255,255,255,0.5)' : T.textSub) }}>
                    {b.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mx-3 my-2 h-px" style={{ background: isDark ? `${P.pink}12` : T.border }} />

          <div className="px-3 py-2 flex-1">
            <div className="flex items-center gap-1.5 mb-2.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: P.magenta, boxShadow: isDark ? `0 0 5px ${P.magenta}` : 'none' }} />
              <p className="text-[8.5px] font-black uppercase tracking-widest" style={{ color: isDark ? 'rgba(255,255,255,0.38)' : T.textMuted }}>Lighting</p>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {LIGHTING_OPTS.map(l => (
                <button key={l.id} onClick={() => setLighting(l.id)}
                  className="flex flex-col items-center gap-0.5 py-1.5 rounded-lg cursor-pointer transition-all border"
                  title={l.label}
                  style={lighting === l.id
                    ? { background: P.pink + '20', borderColor: P.pink + '60', boxShadow: isDark ? `0 0 12px ${P.pink}25` : 'none' }
                    : { background: isDark ? 'rgba(255,255,255,0.03)' : T.bgCard, borderColor: isDark ? 'rgba(255,255,255,0.09)' : T.border }}>
                  <span className="text-[13px]" style={{ color: lighting === l.id ? P.hot : (isDark ? 'rgba(255,255,255,0.35)' : T.textMuted) }}>{l.icon}</span>
                </button>
              ))}
            </div>
          </div>

          {isDark && (
            <div className="px-3 pb-3 mt-auto">
              <div className="rounded-xl px-2 py-2 text-center"
                style={{ background: `${P.pink}08`, border: `1px solid ${P.pink}20` }}>
                <p className="text-[7.5px] font-black uppercase tracking-widest" style={{ color: `${P.hot}70` }}>On Set</p>
                <p className="text-[8.5px] font-mono mt-0.5" style={{ color: `${P.pink}55` }}>{resolution} · {outputFmt}</p>
              </div>
            </div>
          )}
        </div>

        {/* ── CENTER — Stage ── */}
        <div className="flex-1 flex flex-col overflow-hidden relative">

          {/* Multi-layer atmosphere */}
          {isDark && (
            <>
              <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(160deg, #080010 0%, #0d0120 50%, #080010 100%)' }} />
              {/* Top pink spotlight glow */}
              <div className="absolute inset-0 z-0 pointer-events-none"
                style={{ background: `radial-gradient(ellipse 55% 45% at 50% 0%, ${P.pink}22 0%, ${P.deep}10 35%, transparent 60%)` }} />
              {/* Center stage glow */}
              <div className="absolute inset-0 z-0 pointer-events-none"
                style={{ background: `radial-gradient(ellipse 40% 50% at 50% 48%, ${P.pink}10 0%, ${P.magenta}06 30%, transparent 60%)` }} />
              {/* Film grain */}
              <div className="absolute inset-0 z-0 pointer-events-none opacity-40"
                style={{ backgroundImage: GRAIN, backgroundSize: '200px 200px' }} />
            </>
          )}

          {/* Stage area */}
          <div className="flex-1 relative flex items-center justify-center p-8 overflow-hidden z-10">

            {/* Studio floor grid lines */}
            {isDark && (
              <div className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(${P.pink}07 1px, transparent 1px), linear-gradient(90deg, ${P.pink}07 1px, transparent 1px)`,
                  backgroundSize: '44px 44px',
                  maskImage: 'radial-gradient(ellipse 60% 70% at 50% 50%, black 30%, transparent 80%)',
                }} />
            )}

            {/* Concentric rings around product */}
            {isDark && [280, 200, 130].map((r, i) => (
              <div key={i} className="absolute rounded-full pointer-events-none"
                style={{
                  width: r * 2, height: r * 2,
                  border: `1px ${i === 0 ? 'solid' : 'dashed'} rgba(236,72,153,${0.04 + i * 0.025})`,
                  top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  boxShadow: i === 2 ? `0 0 60px ${P.pink}08 inset` : undefined,
                }} />
            ))}

            {/* Stage label */}
            {isDark && !generating && !generated && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none z-20">
                <span className="text-[8.5px] font-black uppercase tracking-[0.3em] px-3 py-1 rounded-full"
                  style={{ color: `${P.hot}55`, border: `1px solid ${P.pink}20`, background: `${P.pink}06` }}>
                  ● STAGE
                </span>
              </div>
            )}

            {/* Product display frame */}
            <div className="relative z-10"
              style={{ width: 'min(360px, 55%)', aspectRatio: '1/1' }}>

              {/* Outer glow ring */}
              {isDark && (
                <div className="absolute -inset-px rounded-3xl pointer-events-none"
                  style={{ boxShadow: `0 0 0 1px ${P.pink}25, 0 0 60px ${P.pink}18, 0 0 120px ${P.deep}20` }} />
              )}

              <div className="w-full h-full rounded-3xl overflow-hidden"
                style={{
                  background: selectedBg.color,
                  border: `1px solid ${isDark ? `${P.pink}22` : T.border}`,
                  boxShadow: isDark
                    ? `0 0 80px ${P.pink}18, 0 40px 80px rgba(0,0,0,0.7)`
                    : '0 8px 40px rgba(0,0,0,0.1)',
                }}>

                {!generating && !generated ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <button onClick={() => setHasUpload(v => !v)}
                      className="flex flex-col items-center gap-3 cursor-pointer px-8 py-6 rounded-2xl transition-all"
                      style={hasUpload
                        ? { background: `${P.pink}12`, border: `1px dashed ${P.pink}45`, boxShadow: isDark ? `0 0 24px ${P.pink}10` : 'none' }
                        : { background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.18)' }}>
                      {hasUpload ? (
                        <>
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                            style={{ background: isDark ? `${P.pink}20` : P.pink + '15', boxShadow: isDark ? `0 0 24px ${P.pink}25` : 'none' }}>
                            <Package className="w-6 h-6" style={{ color: isDark ? P.hot : P.pink }} />
                          </div>
                          <span className="text-[12px] font-semibold" style={{ color: isDark ? P.hot : P.pink }}>product.png</span>
                          <span className="text-[10px]" style={{ color: isDark ? 'rgba(255,255,255,0.3)' : T.textMuted }}>Click to remove</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8" style={{ color: isDark ? 'rgba(255,255,255,0.2)' : T.textMuted }} />
                          <div className="text-center">
                            <p className="text-[12px] font-semibold" style={{ color: isDark ? 'rgba(255,255,255,0.35)' : T.textSub }}>Drop product image</p>
                            <p className="text-[10px] mt-0.5" style={{ color: isDark ? 'rgba(255,255,255,0.18)' : T.textMuted }}>PNG · JPG · WEBP</p>
                          </div>
                        </>
                      )}
                    </button>
                  </div>

                ) : generating ? (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-5"
                    style={{ background: isDark ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.7)' }}>
                    <div className="relative w-16 h-16">
                      {[0, 1].map(ring => (
                        <div key={ring} className="absolute rounded-full animate-spin"
                          style={{
                            inset: ring * 6,
                            border: '1.5px solid transparent',
                            borderTopColor: ring === 0 ? P.pink : P.magenta + '60',
                            animationDuration: `${1.3 + ring * 0.9}s`,
                            animationDirection: ring % 2 ? 'reverse' : 'normal',
                          }} />
                      ))}
                      {isDark && (
                        <div className="absolute inset-0 rounded-full"
                          style={{ boxShadow: `0 0 40px ${P.pink}35` }} />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Package className="w-4 h-4" style={{ color: isDark ? P.hot + 'cc' : P.pink }} />
                      </div>
                    </div>
                    <p className="text-[11px] font-semibold tracking-wide" style={{ color: isDark ? P.hot + 'cc' : P.pink }}>{phase}</p>
                  </div>

                ) : (
                  <div className="relative w-full h-full">
                    <AutoVideo src={SAMPLE_VIDEOS[0]} className="absolute inset-0 w-full h-full object-cover" />
                    {isDark && (
                      <div className="absolute inset-0 pointer-events-none"
                        style={{ boxShadow: `inset 0 0 0 1px ${P.pink}30` }} />
                    )}
                    <div className="absolute top-2 right-2">
                      <button className="p-1.5 rounded-lg cursor-pointer"
                        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
                        <Download className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <span className="text-[8.5px] font-mono px-1.5 py-0.5 rounded-full"
                        style={{ background: 'rgba(0,0,0,0.65)', color: `${P.hot}cc` }}>
                        TAKE {shotCount} · {selectedShot.label} · {resolution}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Generating progress */}
            {generating && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-60 z-20">
                <div className="h-[3px] rounded-full overflow-hidden mb-1.5"
                  style={{ background: isDark ? 'rgba(255,255,255,0.06)' : T.bgCard }}>
                  <div className="h-full rounded-full transition-all duration-300 relative overflow-hidden"
                    style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${P.deep}, ${P.pink}, ${P.hot})` }}>
                    <div className="absolute inset-0 animate-pulse opacity-40" style={{ background: 'rgba(255,255,255,0.4)' }} />
                  </div>
                </div>
                <p className="text-[9.5px] text-center font-mono" style={{ color: isDark ? P.hot + '80' : T.textMuted }}>
                  {Math.round(progress)}% · {elapsed}s elapsed
                </p>
              </div>
            )}
          </div>

          {/* Bottom prompt + SHOOT */}
          <div className="px-6 pb-5 pt-3 shrink-0 relative z-10">
            {isDark && (
              <div className="absolute top-0 left-6 right-6 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${P.pink}25, transparent)` }} />
            )}
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                {isDark && prompt.length > 0 && (
                  <div className="absolute -inset-px rounded-xl pointer-events-none"
                    style={{ background: `linear-gradient(135deg, ${P.pink}25, transparent 60%)`, borderRadius: 12 }} />
                )}
                <textarea
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder="Describe your product — material, colour, finish, target audience…"
                  rows={2}
                  className="relative w-full rounded-xl px-3.5 py-2.5 text-[12.5px] leading-relaxed resize-none outline-none transition-all"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.04)' : T.inputBg,
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.09)' : T.border}`,
                    color: isDark ? 'rgba(255,255,255,0.88)' : T.text,
                    caretColor: P.pink,
                  }}
                  onFocus={e => { (e.target as HTMLTextAreaElement).style.borderColor = P.pink + '55'; (e.target as HTMLTextAreaElement).style.boxShadow = isDark ? `0 0 0 1px ${P.pink}25, 0 0 20px ${P.pink}12` : 'none'; }}
                  onBlur={e =>  { (e.target as HTMLTextAreaElement).style.borderColor = isDark ? 'rgba(255,255,255,0.09)' : T.border; (e.target as HTMLTextAreaElement).style.boxShadow = 'none'; }}
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className="flex items-center gap-2 px-6 rounded-xl text-[13px] font-black tracking-wide transition-all shrink-0 uppercase"
                style={{
                  height: 68,
                  background: !canGenerate
                    ? isDark ? 'rgba(255,255,255,0.05)' : T.bgCard
                    : `linear-gradient(135deg, ${P.deep} 0%, ${P.pink} 50%, ${P.hot} 85%, ${P.magenta} 100%)`,
                  color: !canGenerate ? (isDark ? 'rgba(255,255,255,0.18)' : T.textMuted) : '#fff',
                  cursor: !canGenerate ? 'not-allowed' : 'pointer',
                  border: `1px solid ${!canGenerate ? 'transparent' : P.pink + '50'}`,
                  boxShadow: !canGenerate ? 'none'
                    : isDark
                      ? `0 0 40px ${P.pink}50, 0 0 80px ${P.pink}20, 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)`
                      : `0 0 20px ${P.pink}30, 0 4px 16px rgba(0,0,0,0.15)`,
                  letterSpacing: '0.14em',
                }}>
                {!canGenerate ? (
                  <><Camera className="w-4 h-4" />SHOOT</>
                ) : generating ? (
                  <><div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: P.hot }} />{Math.round(progress)}%</>
                ) : generated ? (
                  <><span>✓</span>DONE</>
                ) : (
                  <><Camera className="w-4 h-4" />SHOOT</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL — Shot controls ── */}
        <div className="w-[220px] shrink-0 flex flex-col gap-4 px-4 pt-4 pb-4 overflow-y-auto border-l"
          style={{ borderColor: isDark ? `${P.pink}12` : T.border, background: panelBg, scrollbarWidth: 'none' }}>

          {isDark && (
            <div className="h-px w-full shrink-0 -mt-4 mb-0"
              style={{ background: `linear-gradient(90deg, transparent, ${P.pink}30, transparent)` }} />
          )}

          {/* Shot type */}
          <div className="mt-3">
            <div className="flex items-center gap-1.5 mb-2.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: P.pink, boxShadow: isDark ? `0 0 5px ${P.pink}` : 'none' }} />
              <p className="text-[8.5px] font-black uppercase tracking-widest" style={{ color: isDark ? 'rgba(255,255,255,0.38)' : T.textMuted }}>Shot Type</p>
            </div>
            <div className="space-y-1">
              {SHOT_TYPES.map(s => {
                const Icon = s.icon;
                return (
                  <button key={s.id} onClick={() => setShotType(s.id)}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl cursor-pointer transition-all border text-left"
                    style={shotType === s.id
                      ? { ...activeChip }
                      : { ...inactiveChipStyle }}>
                    <Icon className="w-3 h-3 shrink-0" style={{ color: shotType === s.id ? P.hot : (isDark ? 'rgba(255,255,255,0.35)' : T.textSub) }} />
                    <span className="text-[10.5px] font-medium"
                      style={{ color: shotType === s.id ? P.hot : (isDark ? 'rgba(255,255,255,0.55)' : T.textSub) }}>
                      {s.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px" style={{ background: isDark ? `${P.pink}12` : T.border }} />

          {/* Resolution */}
          <div>
            <p className="text-[8.5px] font-black uppercase tracking-widest mb-2" style={{ color: isDark ? 'rgba(255,255,255,0.38)' : T.textMuted }}>Resolution</p>
            <div className="space-y-1">
              {RESOLUTIONS.map(r => (
                <button key={r} onClick={() => setResolution(r)}
                  className="w-full py-1.5 rounded-lg text-[11px] font-semibold border text-center cursor-pointer transition-all"
                  style={resolution === r ? activeChip : inactiveChipStyle}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Output format */}
          <div>
            <p className="text-[8.5px] font-black uppercase tracking-widest mb-2" style={{ color: isDark ? 'rgba(255,255,255,0.38)' : T.textMuted }}>Output</p>
            <div className="flex gap-1">
              {OUTPUT_FMTS.map(f => (
                <button key={f} onClick={() => setOutputFmt(f)}
                  className="flex-1 py-1.5 rounded-lg text-[10px] font-bold border text-center cursor-pointer transition-all"
                  style={outputFmt === f ? activeChip : inactiveChipStyle}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Generated variants */}
          {generated && (
            <div>
              <p className="text-[8.5px] font-black uppercase tracking-widest mb-2" style={{ color: isDark ? 'rgba(255,255,255,0.38)' : T.textMuted }}>Variants</p>
              <div className="space-y-1.5">
                {SAMPLE_VIDEOS.map((src, i) => (
                  <div key={i} className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer"
                    style={{ border: `1px solid ${isDark ? `${P.pink}18` : T.border}`, boxShadow: isDark ? `0 0 12px ${P.pink}08` : 'none' }}>
                    <AutoVideo src={src} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: 'rgba(0,0,0,0.5)' }} />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Download className="w-4 h-4 text-white" />
                    </div>
                    <span className="absolute bottom-1 right-1.5 text-[7.5px] font-mono" style={{ color: isDark ? `${P.hot}80` : P.pink }}>R{i + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
