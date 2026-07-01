'use client';

import React, { useState, useEffect } from 'react';
import {
  Search, Heart, Eye, ImageIcon, Video, Mic, Wand2, BookOpen,
  LayoutTemplate, Grid3X3, Package, Plus,
  ChevronLeft, ChevronRight, ArrowRight, Sparkles,
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

/* ── Brand colours ─────────────────────────────────────────────────────────── */
const PINK   = '#EC4899';
const ORANGE = '#F97316';

/* ── Tool icons – pastel/minimal ────────────────────────────────────────────── */
const HOME_TOOLS = [
  { id: 'spaces',    Icon: LayoutTemplate, label: 'Spaces',    rgba: '124,58,237',  ic: '#7C3AED' },
  { id: 'image',     Icon: ImageIcon,      label: 'Image',     rgba: '236,72,153',  ic: '#EC4899' },
  { id: 'video',     Icon: Video,          label: 'Video',     rgba: '5,150,105',   ic: '#059669' },
  { id: 'voice',     Icon: Mic,            label: 'Audio',     rgba: '37,99,235',   ic: '#2563EB' },
  { id: 'all',       Icon: Wand2,          label: 'Design',    rgba: '249,115,22',  ic: '#F97316' },
  { id: 'product',   Icon: Package,        label: '3D',        rgba: '245,158,11',  ic: '#D97706' },
  { id: 'library',   Icon: BookOpen,       label: 'Stock',     rgba: '100,116,139', ic: '#64748B' },
  { id: 'assistant', Icon: Grid3X3,        label: 'All tools', rgba: '107,114,128', ic: '#6B7280' },
];

const AI_LOGOS = [
  { label: '✦', bg: `linear-gradient(135deg, ${PINK}, ${ORANGE})` },
  { label: 'G', bg: '#10A37F' },
  { label: '⌥', bg: '#2563EB' },
  { label: '◆', bg: '#374151' },
];

const GALLERY = [
  {
    src: '/pexels-didsss-2791056.jpg',
    videoSrc: '/13167255_trimmed_4s.mp4',
    label: 'AI Portrait · Golden Hour',
    desc: 'Next-gen portrait enhancement with atmospheric cinematic lighting',
    views: '4.2K', likes: 892,
  },
  {
    src: '/pexels-ganajp-15698413.jpg',
    videoSrc: '/ai_trending1.mp4',
    label: 'Cinematic Landscape · 4K',
    desc: 'Ultra-high resolution landscape generation with natural depth',
    views: '2.1K', likes: 564,
  },
  {
    src: '/pexels-olga-178200755-12367292.jpg',
    videoSrc: '/ai_trending2.mp4',
    label: 'Fashion Editorial · AI Generated',
    desc: 'Professional-grade fashion content for editorial campaigns',
    views: '3.8K', likes: 1203,
  },
  {
    src: '/pexels-prathsnap-3168209.jpg',
    videoSrc: '/ai_trending3.mp4',
    label: 'Character Concept · Engine v2',
    desc: 'Advanced character design and immersive concept visualization',
    views: '1.9K', likes: 445,
  },
];

/* Curated item sets per tab so clicking genuinely changes content */
const TAB_SETS: Record<string, number[]> = {
  "What's new": [0, 1, 2],
  'Use cases':  [1, 2, 3],
  'Academy':    [0, 2, 3],
};

const CONTENT_TABS = Object.keys(TAB_SETS);

const GREETINGS = [
  (n: string)  => `Hey ${n}! ✦ Ready to create?`,
  (_n: string) => `What will you make today? ✦`,
  (n: string)  => `Welcome back, ${n} ✦`,
  (_n: string) => `The studio is ready for you`,
  (_n: string) => `Let's build something amazing ✦`,
  (n: string)  => `${n} — time to turn ideas into reality`,
];

const HF = 'https://static.higgsfield.ai';
const MASONRY_VIDEOS = [
  { src: `${HF}/seedance-2.0-v2/examples/1-mini.mp4`, label: 'Cinematic Landscape · AI',  ar: '16/9' },
  { src: `${HF}/seedance-2.0-v2/examples/2-mini.mp4`, label: 'Portrait · Motion',          ar: '9/16' },
  { src: `${HF}/ai-video-v2/example-1-mini.mp4`,      label: 'Product Visualization',      ar: '1/1'  },
  { src: `${HF}/seedance-2.0-v2/examples/3-mini.mp4`, label: 'Fantasy Environment',        ar: '16/9' },
  { src: `${HF}/ai-video-v2/example-2-mini.mp4`,      label: 'Fashion Editorial',          ar: '2/3'  },
  { src: `${HF}/seedance-2.0-v2/examples/4-mini.mp4`, label: 'Surreal Landscape',          ar: '16/9' },
  { src: `${HF}/ai-video-v2/example-3-mini.mp4`,      label: 'Abstract Art · Generative', ar: '1/1'  },
  { src: `${HF}/seedance-2.0-v2/examples/5-mini.mp4`, label: '3D Character · Animation',  ar: '2/3'  },
];

/* ── Fill-from-bottom animated button ─────────────────────────────────────── */
interface FillBtnProps {
  children: React.ReactNode;
  bg: string;
  fill: string;
  textColor?: string;
  fillText?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
}

function FillBtn({
  children, bg, fill,
  textColor = '#fff', fillText = '#fff',
  className = '', style = {}, onClick,
}: FillBtnProps) {
  const [hov, setHov] = useState(false);
  return (
    <button
      className={`relative overflow-hidden cursor-pointer ${className}`}
      style={{ ...style, background: bg }}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}>
      {/* Rising fill */}
      <span
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height:     hov ? '100%' : '0%',
          background: fill,
          transition: 'height 0.28s cubic-bezier(0.4,0,0.2,1)',
        }}
      />
      {/* Label stays above fill */}
      <span
        className="relative z-10 flex items-center gap-1.5"
        style={{
          color:      hov ? fillText : textColor,
          transition: 'color 0.15s ease',
        }}>
        {children}
      </span>
    </button>
  );
}

/* ── Props ──────────────────────────────────────────────────────────────────── */
interface MainContentProps {
  displayName: string;
  onSearchClick: () => void;
  onToolClick: (id: string) => void;
}

/* ── Component ──────────────────────────────────────────────────────────────── */
export default function MainContent({ displayName, onSearchClick, onToolClick }: MainContentProps) {
  const { isDark, T } = useTheme();
  const [activeTab,    setActiveTab]    = useState("What's new");
  const [liked,        setLiked]        = useState<Set<number>>(new Set());
  const [cardIndex,    setCardIndex]    = useState(0);
  const [greetIdx,     setGreetIdx]     = useState(0);
  const [greetVisible, setGreetVisible] = useState(true);
  const [showWelcome,  setShowWelcome]  = useState(false);

  useEffect(() => {
    const shown = sessionStorage.getItem('spectrum_welcome');
    if (!shown) {
      const t = setTimeout(() => { setShowWelcome(true); sessionStorage.setItem('spectrum_welcome', '1'); }, 1000);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setGreetVisible(false);
      setTimeout(() => { setGreetIdx(i => (i + 1) % GREETINGS.length); setGreetVisible(true); }, 380);
    }, 3800);
    return () => clearInterval(id);
  }, []);

  const toggleLike = (i: number) =>
    setLiked(prev => { const s = new Set(prev); s.has(i) ? s.delete(i) : s.add(i); return s; });

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCardIndex(0);
  };

  /* Cards for this tab (always exactly 3) */
  const tabIndices  = TAB_SETS[activeTab];
  const tabCards    = tabIndices.map(i => ({ ...GALLERY[i], galleryIdx: i }));
  const visibleN    = 3;
  const maxIdx      = Math.max(0, tabCards.length - visibleN);
  const shownCards  = tabCards.slice(cardIndex, cardIndex + visibleN);

  const prevCard = () => setCardIndex(i => Math.max(0, i - 1));
  const nextCard = () => setCardIndex(i => Math.min(maxIdx, i + 1));

  /* Pastel icon bg */
  const iconBg = (rgba: string) => `rgba(${rgba},${isDark ? 0.18 : 0.10})`;

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: T.bg, scrollbarWidth: 'none' }}>

      {/* ══ GREETING + SEARCH + TOOLS ══════════════════════════════════════════ */}
      <section className="px-10 pt-12 pb-8" style={{ background: T.bg }}>

        {/* Greeting – animated rotation */}
        <div className="text-center mb-6">
          <div style={{
            opacity: greetVisible ? 1 : 0,
            transform: greetVisible ? 'translateY(0px)' : 'translateY(10px)',
            transition: 'opacity 0.38s ease, transform 0.38s ease',
          }}>
            <h1 className="text-[36px] font-black tracking-[-0.04em] leading-tight"
              style={{
                background: `linear-gradient(135deg, ${ORANGE} 0%, ${PINK} 60%, #A855F7 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
              {GREETINGS[greetIdx](displayName)}
            </h1>
          </div>
          <p className="text-[12.5px] mt-1.5 font-medium" style={{ color: T.textMuted }}>
            Your AI creative studio is ready.
          </p>
        </div>

        {/* Search bar */}
        <div className="max-w-[580px] mx-auto mb-8 cursor-pointer" onClick={onSearchClick}>
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border transition-shadow hover:shadow-sm"
            style={{ background: isDark ? T.bgSub : '#F9FAFB', borderColor: isDark ? T.border : '#E5E7EB' }}>
            <Search className="w-4 h-4 shrink-0" style={{ color: T.textMuted }} />
            <span className="flex-1 text-[13px]" style={{ color: T.textMuted }}>
              Ask Spectrum or search
            </span>
            <kbd className="px-2 py-0.5 rounded-md text-[10px] font-medium"
              style={{ background: isDark ? 'rgba(255,255,255,0.08)' : '#F3F4F6', color: T.textMuted, border: `1px solid ${T.border}` }}>
              Ctrl K
            </kbd>
          </div>
        </div>

        {/* Tool icon strip – pastel backgrounds, coloured icons */}
        <div className="flex items-center justify-center gap-5 flex-wrap">
          {HOME_TOOLS.map(({ id, Icon, label, rgba, ic }) => (
            <button key={id + label} onClick={() => onToolClick(id)}
              className="flex flex-col items-center gap-2 cursor-pointer group">
              <div className="w-[54px] h-[54px] rounded-2xl flex items-center justify-center group-hover:scale-[1.07] transition-transform duration-150"
                style={{ background: iconBg(rgba) }}>
                <Icon className="w-[22px] h-[22px]" style={{ color: ic }} />
              </div>
              <span className="text-[11px] font-medium" style={{ color: T.textSub }}>{label}</span>
            </button>
          ))}
        </div>
      </section>

      <div style={{ height: 1, background: T.border }} />

      {/* ══ AI AGENT BANNER ═════════════════════════════════════════════════════ */}
      <section className="px-8 py-3 flex items-center gap-4"
        style={{ background: isDark ? T.bgSub : '#FAFAFA', borderBottom: `1px solid ${T.border}` }}>
        <div className="flex items-center -space-x-1.5 shrink-0">
          {AI_LOGOS.map((logo, i) => (
            <div key={i}
              className="w-6 h-6 rounded-full flex items-center justify-center text-[9.5px] font-bold text-white border-2"
              style={{ background: logo.bg, borderColor: isDark ? T.bgSub : '#FAFAFA' }}>
              {logo.label}
            </div>
          ))}
        </div>
        <p className="text-[12px]" style={{ color: T.textSub }}>
          <span className="font-semibold" style={{ color: T.text }}>
            Your AI agent can now use Spectrum AI
          </span>
          {' '}— Use it directly from Claude, ChatGPT, and more
        </p>
        <FillBtn
          bg={T.bgCard} fill={PINK}
          textColor={T.text} fillText="#fff"
          className="ml-auto shrink-0 px-3.5 py-1.5 rounded-xl text-[11.5px] font-semibold"
          style={{ border: `1px solid ${T.border}` }}
          onClick={() => onToolClick('assistant')}>
          Connect MCP <ArrowRight className="w-3.5 h-3.5" />
        </FillBtn>
      </section>

      {/* ══ PROJECTS + CREATE SPACE ══════════════════════════════════════════════ */}
      <section className="px-8 py-6 grid grid-cols-2 gap-5" style={{ background: T.bg }}>

        {/* Projects */}
        <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${T.border}`, background: T.bgSub }}>
          <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: `1px solid ${T.border}` }}>
            <button
              className="flex items-center gap-1 text-[13px] font-bold cursor-pointer hover:opacity-70 transition-opacity"
              style={{ color: T.text }}
              onClick={() => onToolClick('projects')}>
              Projects <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
            <button
              className="w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer transition-colors"
              style={{ color: T.textMuted }}
              onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="p-3 space-y-1">
            {[
              { name: 'Personal',       dot: '#F97316', badge: null      },
              { name: 'Pro Workspace',  dot: PINK,      badge: 'UPGRADE' },
            ].map(proj => (
              <div key={proj.name}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all"
                onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: proj.dot }} />
                <span className="text-[14px] font-semibold flex-1" style={{ color: T.text }}>{proj.name}</span>
                {proj.badge && (
                  <span className="text-[8.5px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: `rgba(236,72,153,0.12)`, color: PINK, border: `1px solid rgba(236,72,153,0.25)` }}>
                    {proj.badge}
                  </span>
                )}
                <span className="text-[17px]" style={{ color: T.textMuted }}>🔒</span>
              </div>
            ))}
          </div>
        </div>

        {/* Platform banner */}
        <div className="rounded-2xl overflow-hidden relative cursor-pointer transition-all hover:scale-[1.01] hover:shadow-xl"
          style={{ background: 'linear-gradient(120deg, #FF6B00 0%, #FF3472 55%, #B24DFF 100%)', minHeight: 148 }}
          onClick={() => onToolClick('explore')}>

          {/* Subtle noise texture overlay */}
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />

          {/* Left content */}
          <div className="relative z-10 flex items-center h-full pl-6 pr-4 py-5 gap-4">
            <div className="flex flex-col gap-2.5 flex-1">
              <p className="text-[10.5px] font-semibold text-white/80">Your complete AI creative studio</p>
              <h3 className="text-[20px] font-black leading-snug tracking-[-0.03em] text-white">
                Create anything<br />with AI — instantly
              </h3>
              <button
                className="self-start mt-1 px-4 py-2 rounded-full text-[12px] font-bold transition-all hover:scale-105 cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.22)', color: '#fff', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.35)' }}
                onClick={e => { e.stopPropagation(); onToolClick('explore'); }}>
                Explore tools →
              </button>
            </div>

            {/* Floating icon cluster */}
            <div className="relative shrink-0 w-[110px] h-[110px]">
              {/* Back-left icon */}
              <div className="absolute bottom-2 left-0 w-11 h-11 rounded-2xl flex items-center justify-center shadow-xl rotate-[-10deg]"
                style={{ background: 'linear-gradient(135deg,#2563EB,#7C3AED)', border: '2px solid rgba(255,255,255,0.25)' }}>
                <Mic className="w-5 h-5 text-white" />
              </div>
              {/* Bottom-right icon */}
              <div className="absolute bottom-0 right-2 w-10 h-10 rounded-2xl flex items-center justify-center shadow-xl rotate-[8deg]"
                style={{ background: 'linear-gradient(135deg,#059669,#0EA5E9)', border: '2px solid rgba(255,255,255,0.25)' }}>
                <Video className="w-5 h-5 text-white" />
              </div>
              {/* Center-top (largest, front) */}
              <div className="absolute top-0 right-0 w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl rotate-[6deg]"
                style={{ background: 'linear-gradient(135deg,#fff,#FFE4F0)', border: '2px solid rgba(255,255,255,0.5)' }}>
                <ImageIcon className="w-7 h-7" style={{ color: PINK }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* My work link */}
      <div className="flex justify-center py-2.5" style={{ background: T.bg, borderTop: `1px solid ${T.border}` }}>
        <FillBtn
          bg="transparent" fill={`rgba(236,72,153,0.08)`}
          textColor={T.textMuted} fillText={PINK}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[12px] font-medium"
          onClick={() => onToolClick('library')}>
          My work <ArrowRight className="w-3.5 h-3.5" />
        </FillBtn>
      </div>

      {/* ══ WHAT'S NEW / TRENDING CAROUSEL ══════════════════════════════════════ */}
      <section className="px-8 pt-5 pb-8" style={{ background: T.bg, borderTop: `1px solid ${T.border}` }}>

        {/* Tabs + Explore all */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-1">
            {CONTENT_TABS.map(tab => (
              activeTab === tab ? (
                /* Active tab – solid pink, no animation needed */
                <button key={tab}
                  className="px-4 py-2 rounded-xl text-[12.5px] font-medium cursor-pointer"
                  style={{ background: PINK, color: '#fff' }}>
                  {tab}
                </button>
              ) : (
                /* Inactive tab – fills pink on hover */
                <FillBtn key={tab}
                  bg={T.bgCard} fill={PINK}
                  textColor={T.textSub} fillText="#fff"
                  className="px-4 py-2 rounded-xl text-[12.5px] font-medium"
                  onClick={() => handleTabChange(tab)}>
                  {tab}
                </FillBtn>
              )
            ))}
          </div>
          <FillBtn
            bg="transparent" fill={`rgba(236,72,153,0.08)`}
            textColor={T.textMuted} fillText={PINK}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-medium"
            onClick={() => onToolClick('explore')}>
            Explore all <ArrowRight className="w-3.5 h-3.5" />
          </FillBtn>
        </div>

        {/* Cards – slightly compact image area, video overlay */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          {shownCards.map((item, i) => {
            const actualIdx = item.galleryIdx;
            return (
              <div key={`${activeTab}-${actualIdx}`}
                className="rounded-2xl overflow-hidden cursor-pointer group transition-all hover:shadow-lg"
                style={{ background: T.bgCard, border: `1px solid ${T.border}` }}
                onClick={() => onToolClick('image')}>

                {/* Media area (shorter: 50% ratio) */}
                <div className="relative overflow-hidden" style={{ paddingTop: '50%' }}>
                  {/* Fallback image */}
                  <img
                    src={item.src}
                    alt={item.label}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Video plays on top of image */}
                  <video
                    autoPlay loop muted playsInline preload="none"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]">
                    <source src={item.videoSrc} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                  {/* Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(0,0,0,0.50)', backdropFilter: 'blur(8px)' }}>
                    <Sparkles className="w-2.5 h-2.5 text-white/80" />
                    <span className="text-[9px] font-semibold text-white/90">{activeTab}</span>
                  </div>
                </div>

                {/* Text content */}
                <div className="p-3.5">
                  <h3 className="text-[12.5px] font-bold mb-1 leading-snug" style={{ color: T.text }}>
                    {item.label}
                  </h3>
                  <p className="text-[10.5px] mb-3 leading-relaxed" style={{ color: T.textMuted }}>
                    {item.desc}
                  </p>
                  <div className="flex items-center justify-between">
                    {/* Try it now – pink → orange fill */}
                    <FillBtn
                      bg={PINK} fill={ORANGE}
                      className="px-3.5 py-1.5 rounded-xl text-[10.5px] font-semibold"
                      onClick={e => { e.stopPropagation(); onToolClick('image'); }}>
                      Try it now
                    </FillBtn>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" style={{ color: T.textMuted }} />
                        <span className="text-[10px]" style={{ color: T.textMuted }}>{item.views}</span>
                      </div>
                      <button
                        className="flex items-center gap-1 cursor-pointer"
                        onClick={e => { e.stopPropagation(); toggleLike(actualIdx); }}>
                        <Heart
                          className={`w-3 h-3 ${liked.has(actualIdx) ? 'fill-rose-400 text-rose-400' : ''}`}
                          style={!liked.has(actualIdx) ? { color: T.textMuted } : {}} />
                        <span className="text-[10px]" style={{ color: T.textMuted }}>
                          {liked.has(actualIdx) ? item.likes + 1 : item.likes}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination dots + arrows */}
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-1.5">
            {tabCards.map((_, i) => (
              <button key={i} onClick={() => setCardIndex(Math.min(i, maxIdx))}
                className="rounded-full cursor-pointer"
                style={{
                  width:      i === cardIndex ? 22 : 8,
                  height:     8,
                  background: i === cardIndex
                    ? `linear-gradient(135deg, ${PINK}, ${ORANGE})`
                    : (isDark ? 'rgba(255,255,255,0.18)' : '#E2E8F0'),
                  transition: 'width 0.2s ease, background 0.2s ease',
                }} />
            ))}
          </div>
          <div className="flex items-center gap-1">
            <button onClick={prevCard} disabled={cardIndex === 0}
              className="w-7 h-7 flex items-center justify-center rounded-full cursor-pointer transition-all disabled:opacity-40 hover:opacity-70"
              style={{ background: T.bgCard, border: `1px solid ${T.border}`, color: T.textMuted }}>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={nextCard} disabled={cardIndex >= maxIdx}
              className="w-7 h-7 flex items-center justify-center rounded-full cursor-pointer transition-all disabled:opacity-40 hover:opacity-70"
              style={{ background: T.bgCard, border: `1px solid ${T.border}`, color: T.textMuted }}>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Masonry video grid */}
        <div className="mt-5" style={{ columnCount: 4, columnGap: '8px' }}>
          {MASONRY_VIDEOS.map((item, i) => (
            <div key={i} style={{ breakInside: 'avoid', marginBottom: '8px' }}
              className="group relative rounded-xl overflow-hidden cursor-pointer"
              onClick={() => onToolClick('video')}>
              <video
                autoPlay loop muted playsInline preload="none"
                className="w-full object-cover block"
                style={{ aspectRatio: item.ar }}>
                <source src={item.src} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <p className="absolute bottom-1.5 left-2 right-2 text-[8px] font-semibold text-white/90 truncate opacity-0 group-hover:opacity-100 transition-opacity duration-300">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ WELCOME POPUP ════════════════════════════════════════════════════════ */}
      {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }}
          onClick={() => setShowWelcome(false)}>
          <div className="max-w-sm w-full mx-4 rounded-3xl overflow-hidden shadow-2xl"
            style={{ background: T.bg, border: `1px solid ${T.border}` }}
            onClick={e => e.stopPropagation()}>
            <div className="h-28 relative flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${ORANGE}, ${PINK})` }}>
              <div className="absolute inset-0 opacity-15"
                style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              <div className="relative text-center text-white">
                <div className="text-[28px] font-black tracking-[-0.04em]">Spectrum AI</div>
                <div className="text-[11px] opacity-80 mt-0.5">Your complete AI creative studio</div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-[16px] font-bold mb-3" style={{ color: T.text }}>
                Welcome, {displayName}!
              </h3>
              <div className="space-y-2.5 mb-5">
                {[
                  ['✦', 'Enhance & upscale images up to 8×'],
                  ['▶', 'Generate cinematic AI videos'],
                  ['◎', 'Build AI workflows on a canvas'],
                  ['♪', 'Synthesize voice with AI'],
                ].map(([icon, text]) => (
                  <div key={text} className="flex items-center gap-3">
                    <span className="text-[13px] font-bold w-4 text-center" style={{ color: ORANGE }}>{icon}</span>
                    <span className="text-[12.5px]" style={{ color: T.textSub }}>{text}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <FillBtn
                  bg={`linear-gradient(135deg,${ORANGE},${PINK})`} fill={PINK}
                  className="flex-1 py-2.5 rounded-xl text-[12px] font-bold justify-center"
                  onClick={() => { setShowWelcome(false); onToolClick('explore'); }}>
                  Start exploring
                </FillBtn>
                <button className="px-4 py-2.5 rounded-xl text-[12px] font-medium cursor-pointer transition-colors"
                  style={{ background: T.bgCard, border: `1px solid ${T.border}`, color: T.textSub }}
                  onClick={() => setShowWelcome(false)}>
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
