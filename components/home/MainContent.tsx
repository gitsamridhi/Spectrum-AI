'use client';

import React, { useState } from 'react';
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
  const [activeTab,  setActiveTab]  = useState("What's new");
  const [liked,      setLiked]      = useState<Set<number>>(new Set());
  const [cardIndex,  setCardIndex]  = useState(0);

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

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

        {/* Greeting */}
        <h1 className="text-[26px] font-black text-center tracking-[-0.03em] mb-6"
          style={{ color: T.text }}>
          {greeting}, start creating!
        </h1>

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
                <span className="text-[12.5px] font-medium flex-1" style={{ color: T.text }}>{proj.name}</span>
                {proj.badge && (
                  <span className="text-[8.5px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: `rgba(236,72,153,0.12)`, color: PINK, border: `1px solid rgba(236,72,153,0.25)` }}>
                    {proj.badge}
                  </span>
                )}
                <span className="text-[13px]" style={{ color: T.textMuted }}>🔒</span>
              </div>
            ))}
          </div>
        </div>

        {/* Create a space */}
        <div
          className="rounded-2xl flex flex-col items-center justify-center gap-3 py-7 px-6 cursor-pointer group transition-all hover:shadow-sm"
          style={{
            border: `1px solid ${T.border}`,
            background: isDark
              ? `linear-gradient(135deg, rgba(249,115,22,0.05) 0%, rgba(236,72,153,0.04) 100%)`
              : `linear-gradient(135deg, #FFF7F0 0%, #FFF0F7 100%)`,
          }}
          onClick={() => onToolClick('spaces')}>
          {/* Workflow nodes illustration */}
          <div className="flex flex-col gap-2 mb-1">
            <div className="flex items-center gap-2">
              {['Text', 'Image', 'Upscale'].map((lbl, i) => (
                <React.Fragment key={lbl}>
                  {i > 0 && <div className="w-5 h-px" style={{ background: T.border }} />}
                  <div className="px-2.5 py-1 rounded-lg text-[9.5px] font-semibold shadow-sm"
                    style={{ background: T.bg, border: `1px solid ${T.border}`, color: T.textSub }}>{lbl}</div>
                </React.Fragment>
              ))}
            </div>
            <div className="flex items-center gap-2 justify-center">
              {['Style', 'Video'].map((lbl, i) => (
                <React.Fragment key={lbl}>
                  {i > 0 && <div className="w-5 h-px" style={{ background: T.border }} />}
                  <div className="px-2.5 py-1 rounded-lg text-[9.5px] font-semibold shadow-sm"
                    style={{ background: T.bg, border: `1px solid ${T.border}`, color: T.textSub }}>{lbl}</div>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-[14px] font-bold mb-0.5" style={{ color: T.text }}>Create a space</h3>
            <p className="text-[11.5px]" style={{ color: T.textMuted }}>Build creative workflows on an infinite canvas</p>
          </div>
          <FillBtn
            bg={T.bg} fill={PINK}
            textColor={T.text} fillText="#fff"
            className="px-4 py-2 rounded-xl text-[11.5px] font-semibold"
            style={{ border: `1px solid ${T.border}` }}
            onClick={e => { e.stopPropagation(); onToolClick('spaces'); }}>
            <Plus className="w-3.5 h-3.5" />New space
          </FillBtn>
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
      </section>

    </div>
  );
}
