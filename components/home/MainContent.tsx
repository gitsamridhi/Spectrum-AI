'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowRight, Play, Flame, Heart, Eye,
  ImageIcon, Video, Mic, Wand2, Layers, BookOpen, Users,
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

const P = {
  darkRed: '#A33550',
  coral:   '#D46280',
  yellow:  '#FFF6A6',
  hotPink: '#FFDDE9',
  orange:  '#D97E3A',
  rose:    '#C94060',
};

const TOOLS = [
  { id: 'image',      Icon: ImageIcon, label: 'Image Generation', desc: 'Text to Image',      bg: P.rose,    fg: '#fff'    },
  { id: 'video',      Icon: Video,     label: 'Video Generation', desc: 'Text/Img to Video',  bg: P.orange,  fg: '#fff'    },
  { id: 'spaces',     Icon: Layers,    label: 'Workflow Canvas',  desc: 'Build AI Pipelines', bg: P.yellow,  fg: '#78350f' },
  { id: 'characters', Icon: Users,     label: 'Characters',       desc: 'Create & Manage',    bg: P.hotPink, fg: '#C2185B' },
  { id: 'all',        Icon: Wand2,     label: 'Studio',           desc: 'Edit & Enhance',     bg: P.coral,   fg: '#fff'    },
  { id: 'library',    Icon: BookOpen,  label: 'Assets',           desc: 'Your Libraries',     bg: P.darkRed, fg: '#fff'    },
];

const GALLERY_TABS = ['All', 'Portrait', 'Fashion', 'Cinematic', 'Character'];

const GALLERY = [
  {
    src: '/pexels-didsss-2791056.jpg',
    videoSrc: '/13167255_trimmed_4s.mp4',
    views: '4.2K', likes: 892, label: 'AI Portrait · Golden Hour', tab: 'Portrait',
    creator: { initial: 'J', color: P.rose },
  },
  {
    src: '/pexels-ganajp-15698413.jpg',
    videoSrc: '/ai_trending1.mp4',
    views: '2.1K', likes: 564, label: 'Cinematic Landscape · 4K', tab: 'Cinematic',
    creator: { initial: 'S', color: '#D97E3A' },
  },
  {
    src: '/pexels-olga-178200755-12367292.jpg',
    videoSrc: '/ai_trending2.mp4',
    views: '3.8K', likes: 1203, label: 'Fashion Editorial · AI Generated', tab: 'Fashion',
    creator: { initial: 'A', color: '#D46280' },
  },
  {
    src: '/pexels-prathsnap-3168209.jpg',
    videoSrc: '/ai_trending3.mp4',
    views: '1.9K', likes: 445, label: 'Character Concept · Engine v2', tab: 'Character',
    creator: { initial: 'M', color: '#B050C0' },
  },
];

type GalleryItem = typeof GALLERY[0];

const TEMPLATES = [
  { label: 'Cinematic Trailer',    nodes: 6, bg: 'linear-gradient(135deg,#E8748A,#C94060)', accent: '#ffffff', Icon: Video     },
  { label: 'Product Ad Generator', nodes: 8, bg: 'linear-gradient(135deg,#E89850,#C97030)', accent: '#ffffff', Icon: ImageIcon },
  { label: 'Consistent Character', nodes: 7, bg: 'linear-gradient(135deg,#E870A8,#C84080)', accent: '#ffffff', Icon: Users     },
  { label: 'AI Music Video',       nodes: 9, bg: 'linear-gradient(135deg,#9880E8,#7050C0)', accent: '#ffffff', Icon: Mic       },
];


/* ── Animated Node Diagram ─────────────────────────────────────────────────── */

function NodeDiagram({ n, cardId, color = 'rgba(255,255,255,0.22)' }: { n: number; cardId: string; color?: string }) {
  const all: [number, number][] = [
    [15, 50], [35, 28], [35, 72], [55, 50], [75, 28], [75, 72], [90, 50], [55, 15], [55, 85],
  ];
  const pts = all.slice(0, n);
  const filterId = `glow-${cardId}`;

  const connections: { x1: number; y1: number; x2: number; y2: number; delay: number; dur: number }[] = [];
  pts.forEach(([x, y], i) => {
    if (i > 0) {
      connections.push({
        x1: pts[i - 1][0], y1: pts[i - 1][1],
        x2: x, y2: y,
        delay: i * 0.35,
        dur: 1.6 + (i % 3) * 0.4,
      });
    }
  });

  return (
    <svg viewBox="0 0 105 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id={filterId} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {connections.map((c, i) => (
        <line key={i} x1={c.x1} y1={c.y1} x2={c.x2} y2={c.y2}
          stroke={color} strokeWidth="1.2" />
      ))}

      {connections.map((c, i) =>
        React.createElement(
          'circle',
          { key: `dot${i}`, r: 2.5, fill: color, opacity: 0.9, filter: `url(#${filterId})` },
          React.createElement('animateMotion', {
            dur: `${c.dur}s`,
            repeatCount: 'indefinite',
            begin: `${c.delay}s`,
            path: `M ${c.x1} ${c.y1} L ${c.x2} ${c.y2}`,
          })
        )
      )}

      {pts.map(([x, y], i) => (
        <rect key={i} x={x - 9} y={y - 6} width="18" height="12" rx="2.5" fill={color} fillOpacity="0.35" />
      ))}
    </svg>
  );
}

/* ── Trending Card ────────────────────────────────────────────────────────── */

function TrendingCard({
  g, i, liked, onToggleLike, onOpen,
}: {
  g: GalleryItem; i: number; liked: Set<number>; onToggleLike: (i: number) => void; onOpen: () => void;
}) {
  return (
    <div onClick={onOpen} className="group relative rounded-2xl overflow-hidden cursor-pointer aspect-video">
      <img src={g.src} alt="" loading="lazy"
        className="absolute inset-0 w-full h-full object-cover" />
      <video autoPlay loop muted playsInline preload="auto"
        className="absolute inset-0 w-full h-full object-cover">
        <source src={g.videoSrc} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

      {/* Creator avatar — top-left HUD */}
      <div className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-1 group-hover:translate-y-0">
        <div className="w-7 h-7 rounded-full border-2 border-white/60 flex items-center justify-center text-[10px] font-bold text-white shadow-lg"
          style={{ background: g.creator.color }}>
          {g.creator.initial}
        </div>
      </div>

      {/* Bottom info + Remix button */}
      <div className="absolute bottom-0 left-0 right-0 p-3 flex items-end justify-between">
        <div>
          <p className="text-[11.5px] font-semibold text-white mb-1">{g.label}</p>
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-white/65" />
              <span className="text-[9.5px] text-white/65">{g.views}</span>
            </div>
            <button onClick={e => { e.stopPropagation(); onToggleLike(i); }}
              className="flex items-center gap-1 cursor-pointer">
              <Heart className={`w-3 h-3 ${liked.has(i) ? 'fill-rose-400 text-rose-400' : 'text-white/65'}`} />
              <span className="text-[9.5px] text-white/65">{liked.has(i) ? g.likes + 1 : g.likes}</span>
            </button>
          </div>
        </div>

        {/* Glassmorphism Remix ✦ button */}
        <div className="flex flex-col items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
          <button onClick={e => e.stopPropagation()}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black text-white cursor-pointer hover:scale-110 transition-transform"
            style={{
              background: 'rgba(255,255,255,0.18)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.35)',
              boxShadow: '0 4px 14px rgba(0,0,0,0.35)',
            }}>
            ✦
          </button>
          <span className="text-[7.5px] font-bold text-white/70 uppercase tracking-wide">Remix</span>
        </div>
      </div>
    </div>
  );
}

/* ── Props ─────────────────────────────────────────────────────────────────── */

interface MainContentProps {
  displayName: string;
  onSearchClick: () => void;
  onToolClick: (id: string) => void;
}

/* ── Component ─────────────────────────────────────────────────────────────── */

export default function MainContent({ displayName, onSearchClick, onToolClick }: MainContentProps) {
  const { isDark, T } = useTheme();
  const [galleryTab, setGalleryTab] = useState('All');
  const [liked, setLiked]           = useState<Set<number>>(new Set());
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => { if (videoRef.current) videoRef.current.playbackRate = 0.5; }, []);

  const filtered  = galleryTab === 'All' ? GALLERY : GALLERY.filter(g => g.tab === galleryTab);
  const displayed = filtered.length > 0 ? filtered : GALLERY;

  const toggleLike = (i: number) =>
    setLiked(prev => { const s = new Set(prev); s.has(i) ? s.delete(i) : s.add(i); return s; });

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: T.bg }}>

      {/* ── First viewport: hero + tool strip + create section ──────────── */}
      <div className="flex flex-col" style={{ minHeight: '100vh' }}>

        {/* ══ 01 · HERO ════════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-zinc-900" style={{ minHeight: 380 }}>
          <video autoPlay loop muted playsInline preload="auto" ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover">
            <source src="/hero_comp.mp4" type="video/mp4" />
          </video>
          <div className="relative z-10 flex items-center px-10" style={{ minHeight: 380 }}>
            <div className="bg-white/76 backdrop-blur-2xl rounded-3xl px-7 py-6 max-w-[400px] shadow-2xl border border-white/50">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4"
                style={{ background: P.hotPink + '80', border: `1px solid ${P.hotPink}` }}>
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#C2185B' }} />
                <span className="text-[10.5px] font-semibold" style={{ color: '#C2185B' }}>
                  AI Creative Suite for Professionals
                </span>
              </div>
              <h1 className="text-[42px] font-black leading-[1.0] tracking-[-0.04em] mb-3" style={{ color: '#0f0f11' }}>
                Create without<br /><span style={{ color: P.rose }}>limits.</span>
              </h1>
              <p className="text-[13px] leading-relaxed mb-5 max-w-[300px]" style={{ color: '#3a3a42' }}>
                Generate, edit, and scale your ideas with the most advanced AI tools.
              </p>
              <div className="flex items-center gap-2.5 mb-5">
                <button onClick={() => onToolClick('image')}
                  className="flex items-center gap-2 px-5 py-2.5 text-white text-[12.5px] font-bold rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ background: P.rose }}>
                  Start Creating
                </button>
                <button onClick={() => onToolClick('explore')}
                  className="flex items-center gap-2 px-4 py-2.5 border border-zinc-300/70 bg-white/60 hover:bg-white text-zinc-700 text-[12.5px] font-medium rounded-xl transition-all cursor-pointer">
                  <Play className="w-3 h-3 fill-current" />Explore
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[P.rose, '#C2185B', P.orange, '#059669'].map((c, idx) => (
                    <div key={idx} className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[7px] font-bold text-white"
                      style={{ background: c }}>{String.fromCharCode(65 + idx)}</div>
                  ))}
                </div>
                <p className="text-[11px]" style={{ color: '#64646e' }}>
                  <span className="font-semibold" style={{ color: '#0f0f11' }}>50,000+</span> creators worldwide
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══ 02 · TOOL STRIP ══════════════════════════════════════════════ */}
        <section style={{ borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, background: T.bg }}>
          <div className="px-10 grid grid-cols-6">
            {TOOLS.map(({ id, Icon, label, desc, bg, fg }, i) => (
              <button key={i} onClick={() => onToolClick(id)}
                className="group flex flex-col items-center gap-2 px-3 py-3.5 border-r last:border-r-0 transition-all cursor-pointer"
                style={{ borderColor: T.border }}
                onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform"
                  style={{ background: bg }}>
                  <Icon className="w-4 h-4" style={{ color: fg }} />
                </div>
                <div className="text-center">
                  <p className="text-[10.5px] font-bold leading-tight" style={{ color: T.text }}>{label}</p>
                  <p className="text-[9px] mt-0.5" style={{ color: T.textMuted }}>{desc}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ══ 03 · CREATE A SPACE ══════════════════════════════════════════ */}
        <section className="flex-1 flex items-stretch px-6 py-5" style={{ background: T.bg }}>
          <div className="w-full rounded-2xl flex items-center px-12 gap-8 relative overflow-hidden"
            style={{
              border: `1.5px dashed ${isDark ? 'rgba(196,181,253,0.35)' : '#C4B5FD'}`,
              background: isDark
                ? 'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(168,85,247,0.06) 40%, rgba(99,102,241,0.08) 100%)'
                : 'linear-gradient(135deg, #FFF1F5 0%, #FAF0FF 30%, #EFF6FF 65%, #F0FDF9 100%)',
            }}>
            {/* dot-grid canvas background */}
            <div className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(circle, ${isDark ? 'rgba(196,181,253,0.4)' : '#C4B5FD'} 1px, transparent 1px)`,
                backgroundSize: '22px 22px', opacity: isDark ? 0.25 : 0.35,
              }} />

            {/* Node workflow illustration */}
            <div className="relative z-10 flex flex-col gap-3 shrink-0">
              {[['Text', 'Image'], ['Image', 'Video', 'Upscale']].map((row, ri) => (
                <div key={ri} className="flex items-center gap-2">
                  {row.map((lbl, i) => (
                    <React.Fragment key={lbl + ri}>
                      {i > 0 && <div className="w-7 h-px" style={{ background: T.border }} />}
                      <div className="px-3 py-1.5 rounded-lg text-[11px] font-semibold"
                        style={{
                          background: isDark ? 'rgba(196,181,253,0.12)' : '#FFF7ED',
                          border: `1px solid ${isDark ? 'rgba(196,181,253,0.3)' : '#FDBA74'}`,
                          color: isDark ? '#C4B5FD' : '#C2410C',
                        }}>
                        {lbl}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              ))}
            </div>

            {/* Create action */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-3">
              <button onClick={() => onToolClick('spaces')}
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-[26px] font-light transition-colors cursor-pointer"
                style={{ background: T.bg, border: `1.5px solid ${T.border}`, color: T.textSub }}>
                +
              </button>
              <div className="text-center">
                <h3 className="text-[15px] font-bold mb-0.5" style={{ color: T.text }}>Create a new space</h3>
                <p className="text-[12px]" style={{ color: T.textMuted }}>Blank canvas or template — node-based AI chaining</p>
              </div>
            </div>
          </div>
        </section>

      </div>{/* end first viewport */}

      {/* ══ 04 · TRENDING CREATIONS ════════════════════════════════════════ */}
      <section className="px-10 py-8" style={{ background: T.bg }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-3.5 h-3.5" style={{ color: P.orange }} />
            <h2 className="text-[15px] font-bold tracking-[-0.02em]" style={{ color: T.text }}>Trending Creations</h2>
          </div>
          <button onClick={() => onToolClick('explore')}
            className="flex items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer"
            style={{ color: T.textMuted }}
            onMouseEnter={e => (e.currentTarget.style.color = T.text)}
            onMouseLeave={e => (e.currentTarget.style.color = T.textMuted)}>
            View all <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="flex items-center gap-1.5 mb-3 flex-wrap">
          {GALLERY_TABS.map(tab => {
            const active = galleryTab === tab;
            return (
              <button key={tab} onClick={() => setGalleryTab(tab)}
                className={`px-3 py-1 rounded-full text-[10.5px] font-medium transition-all cursor-pointer`}
                style={active
                  ? { background: P.rose, color: '#fff' }
                  : { background: T.bgCard, color: T.textSub }}>
                {tab}
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {displayed.map((g, i) => (
            <TrendingCard key={`${g.src}-${i}`} g={g} i={i} liked={liked} onToggleLike={toggleLike}
              onOpen={() => onToolClick('image')} />
          ))}
        </div>
      </section>

      {/* ══ 05 · WORKFLOW TEMPLATES — animated node paths ══════════════════ */}
      <section className="px-10 py-5" style={{ background: T.bgSub, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ background: P.yellow, outline: `1.5px solid ${P.orange}` }} />
            <h2 className="text-[15px] font-bold tracking-[-0.02em]" style={{ color: T.text }}>Featured Workflow Templates</h2>
          </div>
          <button onClick={() => onToolClick('spaces')}
            className="flex items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer"
            style={{ color: T.textMuted }}
            onMouseEnter={e => (e.currentTarget.style.color = T.text)}
            onMouseLeave={e => (e.currentTarget.style.color = T.textMuted)}>
            View all <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {TEMPLATES.map(({ label, nodes, bg, accent, Icon }, i) => (
            <div key={i}
              onClick={() => onToolClick('spaces')}
              className="group relative rounded-2xl overflow-hidden cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all duration-200 border"
              style={{ height: 130, background: bg, borderColor: accent + '30' }}>
              <div className="absolute inset-0 opacity-40 p-2">
                <NodeDiagram n={nodes} cardId={`tmpl-${i}`} color={accent + '55'} />
              </div>
              <div className="relative z-10 p-4 h-full flex flex-col justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: accent + '18' }}>
                    <Icon className="w-3 h-3" style={{ color: accent }} />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: accent + 'aa' }}>{nodes} Nodes</span>
                </div>
                <div>
                  <p className="text-[12.5px] font-bold leading-snug" style={{ color: accent }}>{label}</p>
                  <button onClick={e => { e.stopPropagation(); onToolClick('spaces'); }}
                    className="mt-1 flex items-center gap-1 text-[9.5px] font-semibold transition-colors cursor-pointer"
                    style={{ color: accent + '99' }}>
                    Use template <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ 05 · CTA BANNER ════════════════════════════════════════════════ */}
      <section className="px-10 py-5" style={{ background: T.bg }}>
        <div className="relative bg-zinc-950 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{
            background: [
              `radial-gradient(circle at 12% 70%, ${P.rose}25 0%, transparent 40%)`,
              `radial-gradient(circle at 45% 25%, #C2185B18 0%, transparent 40%)`,
              `radial-gradient(circle at 80% 60%, ${P.orange}20 0%, transparent 40%)`,
            ].join(', '),
          }} />
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle,white 1px,transparent 1px)', backgroundSize: '28px 28px' }} />
          <div className="relative px-8 py-5 flex items-center justify-between gap-6">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.65)' }}>Spectrum AI Pro</p>
              <h3 className="text-[22px] font-black text-white tracking-[-0.03em] leading-tight mb-1">
                Unlock unlimited generations.
              </h3>
              <p className="text-[11.5px]" style={{ color: 'rgba(255,255,255,0.72)' }}>8K upscale · priority GPU · team workspaces · workflow canvas</p>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <button onClick={() => alert("Pro upgrade coming soon! You'll get 8K upscale, priority GPU, team workspaces & more.")}
                className="px-5 py-2.5 text-white text-[12.5px] font-bold rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                style={{ background: P.rose }}>
                Upgrade to Pro
              </button>
              <button onClick={() => alert('Plan details: Starter (free) · Pro ($19/mo) · Team ($49/mo). Full plans page coming soon.')}
                className="px-4 py-2 border border-white/20 hover:border-white/40 text-[11px] font-medium rounded-xl transition-all cursor-pointer"
                style={{ color: 'rgba(255,255,255,0.72)' }}>
                See plans →
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
