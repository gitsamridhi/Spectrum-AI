'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Zap, Download, RefreshCw, Plus, ChevronDown, Sparkles, Clock, TrendingUp, ShoppingBag, Smartphone, Play } from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

const HF = 'https://static.higgsfield.ai';

const P = { rose: '#EC4899', coral: '#F472B6', darkRed: '#BE185D' };

const HOOK_OPTIONS    = ['Problem → Solution', 'Trending Sound', 'Direct CTA', 'Story Arc', 'Shock Value'];
const SETTING_OPTIONS = ['Indoor — Studio', 'Outdoor — Urban', 'Lifestyle — Home', 'Lifestyle — Office'];
const RATIO_OPTIONS   = ['9:16', '1:1', '16:9'];

const AD_TYPES = [
  { id: 'ugc',       label: 'UGC',           icon: Smartphone },
  { id: 'brand',     label: 'Brand Story',   icon: Play },
  { id: 'product',   label: 'Product Demo',  icon: ShoppingBag },
  { id: 'trending',  label: 'Trending',      icon: TrendingUp },
];

const RECENT = [
  'Skincare serum before/after',
  'Fitness app launch video',
  'Coffee brand lifestyle',
];

const SUGGESTIONS = [
  'Skincare serum launch with before/after',
  'Fitness app demo with real user',
  'Tech gadget unboxing, lifestyle feel',
  'Fashion drop with trending audio',
];

const FORMAT_CARDS = [
  { label: 'Hyper Motion', src: `${HF}/ai-video-v2/example-2-mini.mp4` },
  { label: 'Unboxing',     src: `${HF}/seedance-2.0-v2/examples/1-mini.mp4` },
  { label: 'UGC',          src: `${HF}/ai-video-v2/example-4-mini.mp4` },
  { label: 'Testimonial',  src: `${HF}/seedance-2.0-v2/examples/5-mini.mp4` },
  { label: 'Product Demo', src: `${HF}/ai-video-v2/example-3-mini.mp4` },
  { label: 'App Demo',     src: `${HF}/seedance-2.0-v2/examples/3-mini.mp4` },
];

const OUTPUT_VIDEOS = [
  `${HF}/ai-video-v2/example-1-mini.mp4`,
  `${HF}/seedance-2.0-v2/examples/2-mini.mp4`,
  `${HF}/ai-video-v2/example-5-mini.mp4`,
  `${HF}/seedance-2.0-v2/examples/4-mini.mp4`,
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

export default function MarketingStudioView({ onBack }: { onBack: () => void }) {
  const { isDark, T } = useTheme();
  const [adText,     setAdText]     = useState('');
  const [activeTab,  setActiveTab]  = useState('UGC');
  const [adType,     setAdType]     = useState('ugc');
  const [hook,       setHook]       = useState('Problem → Solution');
  const [setting,    setSetting]    = useState('Indoor — Studio');
  const [ratio,      setRatio]      = useState('9:16');
  const [hasProduct, setHasProduct] = useState(false);
  const [hasAvatar,  setHasAvatar]  = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generated,  setGenerated]  = useState(false);
  const [progress,   setProgress]   = useState(0);
  const [phase,      setPhase]      = useState('');
  const [elapsed,    setElapsed]    = useState(0);

  useEffect(() => {
    if (!generating) { setElapsed(0); return; }
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, [generating]);

  const handleGenerate = () => {
    if (!adText.trim() || generating) return;
    setGenerating(true); setGenerated(false); setProgress(0); setPhase('Queued');
    setTimeout(() => setPhase('Assembling pipeline…'), 400);
    setTimeout(() => setPhase('Generating ad…'), 900);
    const iv = setInterval(() => setProgress(p => p >= 88 ? p : p + Math.random() * 6), 120);
    setTimeout(() => { setPhase('Finalising…'); setProgress(94); }, 2800);
    setTimeout(() => { clearInterval(iv); setProgress(100); setTimeout(() => { setGenerating(false); setGenerated(true); setPhase(''); }, 200); }, 3600);
  };

  const tabOptions  = activeTab === 'Hook' ? HOOK_OPTIONS : activeTab === 'Setting' ? SETTING_OPTIONS : activeTab === 'Ratio' ? RATIO_OPTIONS : [];
  const tabValue    = activeTab === 'Hook' ? hook : activeTab === 'Setting' ? setting : activeTab === 'Ratio' ? ratio : '';
  const setTabValue = (v: string) => { if (activeTab === 'Hook') setHook(v); else if (activeTab === 'Setting') setSetting(v); else if (activeTab === 'Ratio') setRatio(v); };

  const inactiveTabBtn = isDark
    ? { background: 'transparent', borderColor: 'rgba(255,255,255,0.13)', color: 'rgba(255,255,255,0.65)' }
    : { background: 'transparent', borderColor: T.border, color: T.textSub };

  const inactiveChip = isDark
    ? { background: 'transparent', borderColor: 'rgba(255,255,255,0.11)', color: 'rgba(255,255,255,0.6)' }
    : { background: T.bgCard, borderColor: T.border, color: T.textSub };

  return (
    <div className="flex-1 flex overflow-hidden relative" style={{ background: isDark ? '#0b0810' : T.bg }}>

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {isDark ? (
          <>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 55% at 60% 0%, rgba(236,72,153,0.25) 0%, rgba(190,24,93,0.08) 45%, transparent 68%)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 35% 35% at 85% 85%, rgba(236,72,153,0.07) 0%, transparent 60%)' }} />
          </>
        ) : (
          <>
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 55% at 60% 0%, rgba(236,72,153,0.10) 0%, rgba(244,114,182,0.04) 45%, transparent 68%)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 35% 35% at 85% 85%, rgba(236,72,153,0.05) 0%, transparent 60%)' }} />
          </>
        )}
      </div>

      {/* Left Sidebar */}
      <div className="relative z-10 w-[220px] shrink-0 flex flex-col border-r py-5 px-4"
        style={{
          borderColor: isDark ? 'rgba(255,255,255,0.07)' : T.border,
          background: isDark ? 'rgba(0,0,0,0.25)' : T.bgSub,
        }}>

        <button onClick={onBack}
          className="flex items-center gap-2 px-2 py-2 rounded-xl cursor-pointer transition-colors mb-6 w-fit"
          style={{ color: T.textSub }}>
          <ChevronLeft className="w-4 h-4" />
          <span className="text-[12px] font-medium">Back</span>
        </button>

        <div className="flex items-center gap-2 px-2 mb-6">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: `linear-gradient(135deg, ${P.darkRed}, ${P.rose})` }}>
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <div>
            <p className="text-[12px] font-bold leading-none" style={{ color: T.text }}>Marketing</p>
            <p className="text-[10px] mt-0.5" style={{ color: T.textMuted }}>Studio</p>
          </div>
        </div>

        <p className="text-[9px] font-bold uppercase tracking-widest px-2 mb-2" style={{ color: T.textMuted }}>Ad Type</p>
        <div className="space-y-0.5 mb-6">
          {AD_TYPES.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setAdType(t.id)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12px] font-medium cursor-pointer transition-all text-left"
                style={adType === t.id
                  ? { background: P.rose + '20', color: P.coral }
                  : { color: T.textSub, background: 'transparent' }}>
                <Icon className="w-3.5 h-3.5 shrink-0" />
                {t.label}
              </button>
            );
          })}
        </div>

        <p className="text-[9px] font-bold uppercase tracking-widest px-2 mb-2" style={{ color: T.textMuted }}>Recent</p>
        <div className="space-y-0.5 flex-1">
          {RECENT.map(r => (
            <button key={r} onClick={() => setAdText(r)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all text-left"
              style={{ color: T.textMuted }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = isDark ? 'rgba(255,255,255,0.05)' : T.bgHover}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
              <Clock className="w-3 h-3 shrink-0 opacity-60" />
              <span className="text-[11px] truncate">{r}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 px-2 mt-4">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-medium" style={{ color: T.textMuted }}>Active</span>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        <div className="mx-auto w-full" style={{ maxWidth: 820 }}>

          {/* Hero */}
          <div className="flex flex-col items-center pt-12 pb-8 px-6 text-center">
            <div className="flex items-center gap-2 mb-5 px-3.5 py-1.5 rounded-full border"
              style={{
                background: isDark ? 'rgba(236,72,153,0.12)' : P.rose + '12',
                borderColor: isDark ? 'rgba(236,72,153,0.28)' : P.rose + '40',
              }}>
              <Sparkles className="w-3 h-3" style={{ color: P.coral }} />
              <span className="text-[11px] font-semibold" style={{ color: P.coral }}>AI-powered video ads</span>
            </div>
            <h1 className="font-bold leading-tight tracking-tight mb-3"
              style={{ fontSize: 'clamp(30px, 3.8vw, 52px)', color: T.text }}>
              Create video ads<br />
              <span style={{ color: P.coral }}>that actually convert</span>
            </h1>
            <p className="text-[13.5px] font-normal leading-relaxed max-w-sm" style={{ color: T.textSub }}>
              Describe your product, pick a format, and let AI produce scroll-stopping ads in seconds.
            </p>
          </div>

          {/* Input card */}
          <div className="px-6">
            <div className="rounded-2xl overflow-hidden shadow-2xl"
              style={{
                background: isDark ? 'rgba(255,255,255,0.07)' : T.bgCard,
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.14)' : T.border}`,
                backdropFilter: isDark ? 'blur(16px)' : 'none',
              }}>

              <div className="flex items-start gap-3 px-5 py-4">
                <Plus className="w-4 h-4 mt-0.5 shrink-0" style={{ color: T.textMuted }} />
                <textarea
                  value={adText}
                  onChange={e => setAdText(e.target.value)}
                  placeholder="Describe what happens in the ad…"
                  rows={2}
                  className="flex-1 bg-transparent outline-none text-[13.5px] leading-relaxed resize-none"
                  style={{ color: T.text, caretColor: P.coral }}
                />
              </div>

              <div style={{ height: 1, background: isDark ? 'rgba(255,255,255,0.08)' : T.borderMuted }} />

              <div className="flex items-center gap-2 px-4 py-3 flex-wrap">
                {(['UGC', 'Hook', 'Setting', 'Ratio'] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all cursor-pointer border"
                    style={activeTab === tab
                      ? { background: P.rose + '28', borderColor: P.rose + '70', color: P.coral }
                      : inactiveTabBtn}>
                    {tab} <ChevronDown className="w-3 h-3 opacity-60" />
                  </button>
                ))}
                <div className="flex-1" />
                <button onClick={() => setHasProduct(v => !v)}
                  className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer"
                  style={hasProduct
                    ? { borderColor: P.rose + '70', background: P.rose + '18', color: P.coral }
                    : { borderColor: isDark ? 'rgba(255,255,255,0.13)' : T.border, color: T.textSub }}>
                  <Plus className="w-3.5 h-3.5" />
                  <span className="text-[8px] font-bold uppercase tracking-widest">Product</span>
                </button>
                <button onClick={() => setHasAvatar(v => !v)}
                  className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer"
                  style={hasAvatar
                    ? { borderColor: P.rose + '70', background: P.rose + '18', color: P.coral }
                    : { borderColor: isDark ? 'rgba(255,255,255,0.13)' : T.border, color: T.textSub }}>
                  <Plus className="w-3.5 h-3.5" />
                  <span className="text-[8px] font-bold uppercase tracking-widest">Avatar</span>
                </button>
                <button onClick={handleGenerate} disabled={!adText.trim() || generating}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[12.5px] font-bold transition-all"
                  style={{
                    background: (!adText.trim() || generating) ? isDark ? 'rgba(255,255,255,0.07)' : T.bgCard : `linear-gradient(135deg, ${P.darkRed}, ${P.rose})`,
                    color: (!adText.trim() || generating) ? T.textMuted : 'white',
                    cursor: (!adText.trim() || generating) ? 'not-allowed' : 'pointer',
                    boxShadow: (!adText.trim() || generating) ? 'none' : `0 0 28px ${P.rose}50`,
                  }}>
                  <Zap className="w-3.5 h-3.5" />
                  {generating ? `${Math.round(progress)}%` : 'Generate'}
                </button>
              </div>

              {activeTab !== 'UGC' && tabOptions.length > 0 && (
                <div className="px-4 py-3 flex flex-wrap gap-1.5"
                  style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : T.borderMuted}` }}>
                  {tabOptions.map(opt => (
                    <button key={opt} onClick={() => setTabValue(opt)}
                      className="px-3 py-1 rounded-lg text-[11.5px] font-medium cursor-pointer border transition-colors"
                      style={tabValue === opt
                        ? { background: P.rose + '22', borderColor: P.rose + '60', color: P.coral }
                        : inactiveChip}>
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {generating && (
                <div className="px-4 pb-3 pt-2"
                  style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : T.borderMuted}` }}>
                  <div className="h-1 rounded-full overflow-hidden mb-1.5"
                    style={{ background: isDark ? 'rgba(255,255,255,0.08)' : T.bgCard }}>
                    <div className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${P.darkRed}, ${P.rose})` }} />
                  </div>
                  <p className="text-[11px] font-medium" style={{ color: T.textMuted }}>{phase} · {elapsed}s</p>
                </div>
              )}
            </div>
          </div>

          {/* Suggestions */}
          {!generated && !generating && (
            <div className="px-6 mt-5">
              <p className="text-[11.5px] mb-3 font-medium" style={{ color: T.textMuted }}>
                Not sure where to start? Try one of these:
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map(s => (
                  <button key={s} onClick={() => setAdText(s)}
                    className="px-3.5 py-2 rounded-xl text-[12px] font-medium cursor-pointer border transition-all"
                    style={{
                      borderColor: isDark ? 'rgba(255,255,255,0.11)' : T.border,
                      color: T.textSub,
                      background: isDark ? 'rgba(255,255,255,0.03)' : T.bgCard,
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = isDark ? 'rgba(255,255,255,0.06)' : T.bgHover}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = isDark ? 'rgba(255,255,255,0.03)' : T.bgCard}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Formats / Output */}
          <div className="px-6 mt-8 pb-10">
            {!generated ? (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-3.5 h-3.5" style={{ color: P.rose }} />
                  <span className="text-[13px] font-semibold" style={{ color: T.textSub }}>Popular formats</span>
                  <span className="text-[11px]" style={{ color: T.textMuted }}>— scroll to explore</span>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                  {FORMAT_CARDS.map((card, i) => (
                    <div key={i} className="shrink-0 group relative rounded-2xl overflow-hidden cursor-pointer"
                      style={{ width: 112, aspectRatio: '9/16', border: `1px solid ${isDark ? 'rgba(255,255,255,0.11)' : T.border}` }}>
                      <AutoVideo src={card.src} className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 50%)' }} />
                      <div className="absolute bottom-2 left-2.5">
                        <span className="text-[9.5px] font-semibold text-white">{card.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[12px] font-semibold" style={{ color: isDark ? '#34D399' : '#059669' }}>Ad generated</span>
                  <div className="flex-1" />
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11.5px] font-medium cursor-pointer border transition-colors"
                    style={{ borderColor: isDark ? 'rgba(255,255,255,0.13)' : T.border, color: T.textSub }}>
                    <RefreshCw className="w-3 h-3" /> Regenerate
                  </button>
                  <button className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[11.5px] font-semibold cursor-pointer"
                    style={{ background: P.rose + '28', color: P.coral, border: `1px solid ${P.rose}50` }}>
                    <Download className="w-3 h-3" /> Export all
                  </button>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                  {OUTPUT_VIDEOS.map((src, i) => (
                    <div key={i} className="shrink-0 group relative rounded-2xl overflow-hidden cursor-pointer"
                      style={{ width: 155, aspectRatio: '9/16' }}>
                      <AutoVideo src={src} className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 bg-black/70 rounded-lg cursor-pointer">
                          <Download className="w-3 h-3 text-white" />
                        </button>
                      </div>
                      <div className="absolute bottom-2 left-2.5">
                        <span className="text-[10px] font-mono text-white/55">V{i + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
