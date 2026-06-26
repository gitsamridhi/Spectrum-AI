'use client';

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { ChevronLeft, Zap, Download, RefreshCw, Play, Music2, Hash, Smartphone } from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

const HF = 'https://static.higgsfield.ai';

const P = { violet: '#7C3AED', purple: '#9333EA', indigo: '#4F46E5', faint: '#A78BFA' };

const VIBES     = ['Trending', 'Cinematic', 'Lo-Fi', 'Hype', 'Aesthetic', 'Minimal'];
const CUTS      = ['Auto-cut', 'Beat sync', 'Jump cut', 'Glitch'];
const CAPTIONS  = ['None', 'Auto subtitle', 'Bold pop', 'Minimal'];
const PLATFORMS = ['TikTok', 'Instagram', 'YouTube', 'Shorts'];
const DURATIONS = ['15s', '30s', '60s'];

const SAMPLE_VIDEOS = [
  `${HF}/seedance-2.0-v2/examples/1-mini.mp4`,
  `${HF}/ai-video-v2/example-2-mini.mp4`,
  `${HF}/seedance-2.0-v2/examples/3-mini.mp4`,
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

function NodeCard({ title, dot, children, cardRef }: { title: string; dot: string; children: React.ReactNode; cardRef?: React.Ref<HTMLDivElement> }) {
  const { isDark, T } = useTheme();
  return (
    <div ref={cardRef} className="rounded-2xl p-4"
      style={{
        background: isDark ? 'rgba(255,255,255,0.05)' : T.bgCard,
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.13)' : T.border}`,
      }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: dot }} />
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: T.textMuted }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

export default function SocialStudioView({ onBack }: { onBack: () => void }) {
  const { isDark, T } = useTheme();
  const [brief,     setBrief]     = useState('');
  const [platform,  setPlatform]  = useState('TikTok');
  const [duration,  setDuration]  = useState('30s');
  const [vibe,      setVibe]      = useState('Trending');
  const [cut,       setCut]       = useState('Auto-cut');
  const [caption,   setCaption]   = useState('Auto subtitle');
  const [musicOn,   setMusicOn]   = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generated,  setGenerated]  = useState(false);
  const [progress,   setProgress]   = useState(0);
  const [phase,      setPhase]      = useState('');
  const [elapsed,    setElapsed]    = useState(0);

  const canvasRef = useRef<HTMLDivElement>(null);
  const briefRef  = useRef<HTMLDivElement>(null);
  const platRef   = useRef<HTMLDivElement>(null);
  const procRef   = useRef<HTMLDivElement>(null);
  const outRef    = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState({ w: 0, h: 0, p1: '', p2: '', p3: '' });

  const computePaths = () => {
    const cv = canvasRef.current; if (!cv) return;
    const cb = cv.getBoundingClientRect();
    const get = (el: HTMLElement | null) => {
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return { rx: b.right - cb.left, lx: b.left - cb.left, cy: (b.top + b.bottom) / 2 - cb.top };
    };
    const br = get(briefRef.current), pl = get(platRef.current), pr = get(procRef.current), ou = get(outRef.current);
    if (!br || !pl || !pr || !ou) return;
    const mx1 = (br.rx + pr.lx) / 2;
    const mx2 = (pr.rx + ou.lx) / 2;
    setSvg({
      w: cb.width, h: cb.height,
      p1: `M ${br.rx} ${br.cy} C ${mx1} ${br.cy} ${mx1} ${pr.cy} ${pr.lx} ${pr.cy}`,
      p2: `M ${pl.rx} ${pl.cy} C ${mx1} ${pl.cy} ${mx1} ${pr.cy} ${pr.lx} ${pr.cy}`,
      p3: `M ${pr.rx} ${pr.cy} C ${mx2} ${pr.cy} ${mx2} ${ou.cy} ${ou.lx} ${ou.cy}`,
    });
  };

  useLayoutEffect(() => {
    computePaths();
    window.addEventListener('resize', computePaths);
    return () => window.removeEventListener('resize', computePaths);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!generating) { setElapsed(0); return; }
    const id = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(id);
  }, [generating]);

  const handleGenerate = () => {
    if (!brief.trim() || generating) return;
    setGenerating(true); setGenerated(false); setProgress(0); setPhase('Queued');
    setTimeout(() => setPhase('Analysing brief…'), 400);
    setTimeout(() => setPhase('Generating clips…'), 900);
    const iv = setInterval(() => setProgress(p => p >= 88 ? p : p + Math.random() * 6), 120);
    setTimeout(() => { setPhase('Applying cuts…'); setProgress(94); }, 2800);
    setTimeout(() => { clearInterval(iv); setProgress(100); setTimeout(() => { setGenerating(false); setGenerated(true); setPhase(''); computePaths(); }, 200); }, 3600);
  };

  const inactiveBtn = { background: T.bgCard, borderColor: T.border, color: T.textSub };

  const chipStyle = (active: boolean) => ({
    className: 'px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer border',
    style: active
      ? { background: P.violet + '30', borderColor: P.violet + '80', color: P.faint }
      : inactiveBtn,
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: isDark ? '#07070a' : T.bg }}>

      {/* Header */}
      <div className="flex items-center px-6 py-3.5 gap-4 border-b shrink-0"
        style={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : T.border }}>
        <button onClick={onBack}
          className="p-1.5 rounded-lg cursor-pointer transition-colors"
          style={{ color: T.textSub }}>
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4" style={{ color: P.faint }} />
          <span className="text-[14px] font-bold tracking-tight" style={{ color: T.text }}>Social Studio</span>
          <span className="text-[10px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded-full"
            style={{ background: P.violet + '28', color: P.faint }}>Advanced</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-medium" style={{ color: T.textMuted }}>Active</span>
        </div>
      </div>

      {/* Canvas */}
      <div ref={canvasRef} className="flex-1 relative flex gap-5 px-8 py-7 overflow-hidden"
        style={{
          backgroundImage: `radial-gradient(circle, ${isDark ? 'rgba(255,255,255,0.04)' : T.borderMuted} 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}>

        {/* SVG connections */}
        {svg.w > 0 && (
          <svg className="absolute inset-0 pointer-events-none" width={svg.w} height={svg.h}>
            <defs>
              <filter id="glow-social">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            {[svg.p1, svg.p2, svg.p3].map((d, i) => (
              <path key={i} d={d} fill="none" strokeWidth="1.5" strokeDasharray="5 4"
                stroke={P.violet + '88'} filter="url(#glow-social)" />
            ))}
            {[svg.p1, svg.p2, svg.p3].map((d, i) => {
              const parts = d.split(' ');
              const ex = parseFloat(parts[parts.length - 2]);
              const ey = parseFloat(parts[parts.length - 1]);
              return <circle key={`dot-${i}`} cx={ex} cy={ey} r="3" fill={P.violet} opacity="0.7" />;
            })}
          </svg>
        )}

        {/* Column 1: Brief + Platform */}
        <div className="flex flex-col gap-4 shrink-0" style={{ width: 248 }}>
          <NodeCard title="Content Brief" dot={P.faint} cardRef={briefRef}>
            <textarea
              value={brief}
              onChange={e => setBrief(e.target.value)}
              placeholder={"Describe your content idea…\ne.g. Satisfying latte art pour, warm tones, chill vibe"}
              rows={5}
              className="w-full bg-transparent outline-none text-[12px] leading-relaxed resize-none"
              style={{
                color: T.text,
                borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : T.borderMuted}`,
                paddingBottom: '10px', marginBottom: '10px',
              }}
            />
            <div className="flex gap-1.5">
              {DURATIONS.map(d => (
                <button key={d} onClick={() => setDuration(d)}
                  className="flex-1 py-1 rounded-lg text-[10.5px] font-semibold border text-center cursor-pointer transition-colors"
                  style={duration === d
                    ? { background: P.violet + '30', borderColor: P.violet + '80', color: P.faint }
                    : inactiveBtn}>
                  {d}
                </button>
              ))}
            </div>
          </NodeCard>

          <NodeCard title="Platform" dot={P.indigo + 'dd'} cardRef={platRef}>
            <div className="grid grid-cols-2 gap-1.5">
              {PLATFORMS.map(pl => (
                <button key={pl} onClick={() => setPlatform(pl)}
                  className="py-1.5 rounded-lg text-[11px] font-medium border text-center cursor-pointer transition-colors"
                  style={platform === pl
                    ? { background: P.violet + '30', borderColor: P.violet + '80', color: P.faint }
                    : inactiveBtn}>
                  {pl}
                </button>
              ))}
            </div>
          </NodeCard>
        </div>

        {/* Column 2: Processing node */}
        <div className="flex flex-col justify-center" style={{ width: 260 }}>
          <NodeCard title="Processing" dot={P.purple} cardRef={procRef}>
            <div className="space-y-4">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest mb-1.5" style={{ color: T.textMuted }}>Vibe</p>
                <div className="flex flex-wrap gap-1">
                  {VIBES.map(v => <button key={v} onClick={() => setVibe(v)} {...chipStyle(vibe === v)}>{v}</button>)}
                </div>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest mb-1.5" style={{ color: T.textMuted }}>Cut Style</p>
                <div className="flex flex-wrap gap-1">
                  {CUTS.map(c => <button key={c} onClick={() => setCut(c)} {...chipStyle(cut === c)}>{c}</button>)}
                </div>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest mb-1.5" style={{ color: T.textMuted }}>Captions</p>
                <div className="flex flex-wrap gap-1">
                  {CAPTIONS.map(c => <button key={c} onClick={() => setCaption(c)} {...chipStyle(caption === c)}>{c}</button>)}
                </div>
              </div>
              <button onClick={() => setMusicOn(m => !m)}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl border transition-all cursor-pointer"
                style={musicOn
                  ? { background: P.violet + '22', borderColor: P.violet + '55' }
                  : { background: isDark ? 'rgba(255,255,255,0.04)' : T.bgCard, borderColor: isDark ? 'rgba(255,255,255,0.12)' : T.border }}>
                <Music2 className="w-3.5 h-3.5 shrink-0" style={{ color: musicOn ? P.faint : T.textSub }} />
                <span className="text-[11px] font-medium" style={{ color: musicOn ? P.faint : T.textSub }}>
                  {musicOn ? 'AI soundtrack on' : 'No music'}
                </span>
                <div className="ml-auto rounded-full transition-colors"
                  style={{ background: musicOn ? P.violet : isDark ? 'rgba(255,255,255,0.1)' : T.bgHover, width: 28, height: 16, position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 2, left: musicOn ? 14 : 2, width: 12, height: 12, borderRadius: '50%', background: 'white', transition: 'left 0.2s' }} />
                </div>
              </button>
            </div>
          </NodeCard>
        </div>

        {/* Column 3: Output */}
        <div className="flex flex-col flex-1 min-w-0">
          <div ref={outRef} className="flex-1 rounded-2xl overflow-hidden flex flex-col"
            style={{
              background: isDark ? 'rgba(255,255,255,0.04)' : T.bgCard,
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.09)' : T.border}`,
            }}>
            <div className="flex items-center gap-2 px-4 py-3 border-b shrink-0"
              style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : T.border }}>
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: generated ? '#34D399' : T.textMuted }} />
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: T.textMuted }}>
                {generated ? 'Output Ready' : 'Generated Output'}
              </span>
              {generated && (
                <div className="ml-auto flex gap-2">
                  <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10.5px] cursor-pointer border transition-colors"
                    style={{ borderColor: isDark ? 'rgba(255,255,255,0.15)' : T.border, color: T.textSub }}>
                    <RefreshCw className="w-3 h-3" />
                  </button>
                  <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10.5px] cursor-pointer font-semibold"
                    style={{ background: P.violet + '30', color: P.faint, border: `1px solid ${P.violet}55` }}>
                    <Download className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 flex items-center justify-center p-4">
              {!generating && !generated ? (
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{
                      background: isDark ? `linear-gradient(135deg, ${P.violet}25, ${P.indigo}15)` : P.violet + '15',
                      border: `1px solid ${P.violet}35`,
                      boxShadow: isDark ? `0 0 24px ${P.violet}18` : 'none',
                    }}>
                    <Hash className="w-7 h-7" style={{ color: P.faint + 'cc' }} />
                  </div>
                  <p className="text-[13px] font-semibold" style={{ color: T.text }}>Output appears here</p>
                  <div className="flex gap-2 mt-1">
                    {SAMPLE_VIDEOS.map((src, i) => (
                      <div key={i} className="rounded-xl overflow-hidden relative" style={{ width: 68, aspectRatio: '9/16' }}>
                        <AutoVideo src={src} className="absolute inset-0 w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : generating ? (
                <div className="flex flex-col items-center gap-5 text-center">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full animate-spin" style={{ border: '2px solid transparent', borderTopColor: P.purple, animationDuration: '1.5s' }} />
                    <div className="absolute inset-2 rounded-full animate-spin" style={{ border: '2px solid transparent', borderTopColor: P.indigo + '66', animationDuration: '2.5s', animationDirection: 'reverse' }} />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold" style={{ color: T.text }}>{phase}</p>
                    <p className="text-[11px] font-mono mt-0.5" style={{ color: T.textMuted }}>{elapsed}s · {Math.round(progress)}%</p>
                  </div>
                  <div className="w-full max-w-[160px]">
                    <div className="h-0.5 rounded-full overflow-hidden"
                      style={{ background: isDark ? 'rgba(255,255,255,0.06)' : T.bgCard }}>
                      <div className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${P.indigo}, ${P.purple})` }} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 h-full py-2">
                  {SAMPLE_VIDEOS.map((src, i) => (
                    <div key={i} className="group relative flex-1 rounded-xl overflow-hidden cursor-pointer">
                      <AutoVideo src={src} className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors" />
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 bg-black/60 rounded-lg cursor-pointer">
                          <Play className="w-3 h-3 text-white" />
                        </button>
                      </div>
                      <div className="absolute bottom-2 left-2">
                        <span className="text-[9px] font-mono text-white/50">V{i + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-8 py-4 border-t shrink-0 flex items-center gap-4"
        style={{
          borderColor: isDark ? 'rgba(255,255,255,0.06)' : T.border,
          background: isDark ? 'rgba(0,0,0,0.4)' : T.bgSub,
        }}>
        <div className="text-[11px] font-medium" style={{ color: T.textSub }}>
          {platform} · {duration} · {vibe} · {cut}
        </div>
        <div className="flex-1" />
        <button
          onClick={handleGenerate}
          disabled={!brief.trim() || generating}
          className="flex items-center gap-2 px-7 py-2.5 rounded-xl text-[13px] font-bold transition-all"
          style={{
            background: (!brief.trim() || generating) ? isDark ? 'rgba(255,255,255,0.05)' : T.bgCard : `linear-gradient(135deg, ${P.indigo}, ${P.purple})`,
            color: (!brief.trim() || generating) ? T.textMuted : 'white',
            cursor: (!brief.trim() || generating) ? 'not-allowed' : 'pointer',
            boxShadow: (!brief.trim() || generating) ? 'none' : `0 0 20px ${P.violet}44`,
          }}>
          <Zap className="w-4 h-4" />
          {generating ? `${phase} · ${elapsed}s` : 'Generate Content'}
        </button>
      </div>
    </div>
  );
}
