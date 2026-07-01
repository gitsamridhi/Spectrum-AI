'use client';

import React, { useState, useEffect } from 'react';
import {
  Search, Heart, Eye, ImageIcon, Video, Mic, Wand2, BookOpen,
  LayoutTemplate, Grid3X3, Package, Plus,
  ChevronLeft, ChevronRight, ArrowRight, Sparkles,
  LayoutGrid, Rows3, Square,
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

const BANNERS = [
  {
    gradient: 'linear-gradient(120deg, #FF6B00 0%, #FF3472 55%, #B24DFF 100%)',
    title: ['Create anything', 'with AI — instantly'],
    subtitle: 'Your complete AI creative studio',
    cta: 'Explore tools', nav: 'explore',
    icons: [
      { Icon: Mic,       color: '#fff',    bg: 'linear-gradient(135deg,#2563EB,#7C3AED)', rotate: -10 },
      { Icon: Video,     color: '#fff',    bg: 'linear-gradient(135deg,#059669,#0EA5E9)', rotate: 8   },
      { Icon: ImageIcon, color: '#EC4899', bg: 'linear-gradient(135deg,#fff,#FFE4F0)',    rotate: 6   },
    ],
  },
  {
    gradient: 'linear-gradient(120deg, #1D4ED8 0%, #7C3AED 50%, #C026D3 100%)',
    title: ['Build pipelines', 'on an infinite canvas'],
    subtitle: 'Node-based AI workflow builder',
    cta: 'Open Spaces', nav: 'spaces',
    icons: [
      { Icon: Wand2,          color: '#fff',    bg: 'linear-gradient(135deg,#F97316,#EF4444)', rotate: -8 },
      { Icon: Grid3X3,        color: '#fff',    bg: 'linear-gradient(135deg,#1D4ED8,#7C3AED)', rotate: 10 },
      { Icon: LayoutTemplate, color: '#7C3AED', bg: 'linear-gradient(135deg,#fff,#EDE9FE)',    rotate: 5  },
    ],
  },
  {
    gradient: 'linear-gradient(120deg, #059669 0%, #0EA5E9 55%, #1D4ED8 100%)',
    title: ['Generate voices,', 'audio & narration'],
    subtitle: 'Neural text-to-speech, any language',
    cta: 'Try Voice Gen', nav: 'voice',
    icons: [
      { Icon: Sparkles, color: '#fff',    bg: 'linear-gradient(135deg,#0EA5E9,#1D4ED8)', rotate: -9 },
      { Icon: BookOpen, color: '#fff',    bg: 'linear-gradient(135deg,#EC4899,#F97316)', rotate: 7  },
      { Icon: Mic,      color: '#059669', bg: 'linear-gradient(135deg,#fff,#D1FAE5)',    rotate: 6  },
    ],
  },
];

const HF = 'https://static.higgsfield.ai';
const MASONRY_VIDEOS = [
  { src: `${HF}/seedance-2.0-v2/examples/1-mini.mp4`, ar: '16/9', label: 'Cinematic Scene · Neural Render',   desc: 'Ultra-realistic cinematic generation with physics-based neural rendering', views: '3.1K', likes: 712  },
  { src: `${HF}/seedance-2.0-v2/examples/2-mini.mp4`, ar: '9/16', label: 'Portrait Motion · Photorealistic',  desc: 'Hyper-detailed portrait animation with texture-preserving AI motion',     views: '2.8K', likes: 634  },
  { src: `${HF}/ai-video-v2/example-1-mini.mp4`,      ar: '1/1',  label: 'Product Showcase · Studio AI',      desc: 'Professional product visualization with dynamic studio lighting effects',  views: '1.9K', likes: 445  },
  { src: `${HF}/seedance-2.0-v2/examples/3-mini.mp4`, ar: '4/5',  label: 'Fantasy World · Environment AI',    desc: 'Immersive fantasy environment with particle and fluid simulation engine',   views: '4.2K', likes: 981  },
  { src: `${HF}/ai-video-v2/example-2-mini.mp4`,      ar: '3/4',  label: 'Fashion Editorial · Spectrum AI',   desc: 'High-fashion editorial content with cinematic depth-of-field AI motion',    views: '3.5K', likes: 820  },
  { src: `${HF}/seedance-2.0-v2/examples/4-mini.mp4`, ar: '16/9', label: 'Surreal Art · Dream Physics',       desc: 'Dreamlike physics engine meets surreal AI visual storytelling and design',  views: '2.3K', likes: 567  },
  { src: `${HF}/ai-video-v2/example-3-mini.mp4`,      ar: '1/1',  label: 'Abstract AI · Neural Flow',         desc: 'Abstract generative art with flowing neural hallucination visual patterns',  views: '1.7K', likes: 389  },
  { src: `${HF}/seedance-2.0-v2/examples/5-mini.mp4`, ar: '4/5',  label: '3D Character · AI Animation',       desc: 'Stylized 3D character with expressive cinematic AI motion rendering',       views: '5.1K', likes: 1120 },
  { src: `${HF}/ai-video-v2/example-4-mini.mp4`,      ar: '3/4',  label: 'Aerial View · Drone Cinema',        desc: 'Sweeping aerial cinematography with AI-enhanced motion stabilization',       views: '2.9K', likes: 678  },
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
  const [masonryPage,  setMasonryPage]  = useState(0);
  const [viewMode,     setViewMode]     = useState<'grid' | 'masonry' | 'large'>('grid');
  const [greetIdx,     setGreetIdx]     = useState(0);
  const [displayWords, setDisplayWords] = useState<string[]>([]);
  const [isDeleting,   setIsDeleting]   = useState(false);
  const [isPaused,     setIsPaused]     = useState(false);
  const [bannerIdx,    setBannerIdx]    = useState(0);
  const [bannerFade,   setBannerFade]   = useState(true);
  const [showWelcome,  setShowWelcome]  = useState(false);

  useEffect(() => {
    const shown = sessionStorage.getItem('spectrum_welcome');
    if (!shown) {
      const t = setTimeout(() => { setShowWelcome(true); sessionStorage.setItem('spectrum_welcome', '1'); }, 1000);
      return () => clearTimeout(t);
    }
  }, []);

  // Typewriter: word-by-word appear → pause → backspace → next sentence
  useEffect(() => {
    const words = GREETINGS[greetIdx](displayName).split(' ');
    if (isPaused) {
      const t = setTimeout(() => { setIsPaused(false); setIsDeleting(true); }, 1500);
      return () => clearTimeout(t);
    }
    if (isDeleting) {
      if (displayWords.length > 0) {
        const t = setTimeout(() => setDisplayWords(w => w.slice(0, -1)), 65);
        return () => clearTimeout(t);
      }
      setIsDeleting(false);
      setGreetIdx(i => (i + 1) % GREETINGS.length);
      return;
    }
    if (displayWords.length < words.length) {
      const t = setTimeout(() => setDisplayWords(words.slice(0, displayWords.length + 1)), 110);
      return () => clearTimeout(t);
    }
    setIsPaused(true);
  }, [displayWords, isDeleting, isPaused, greetIdx, displayName]);

  // Banner auto-rotation every 2.5s
  useEffect(() => {
    const id = setInterval(() => {
      setBannerFade(false);
      setTimeout(() => { setBannerIdx(i => (i + 1) % BANNERS.length); setBannerFade(true); }, 280);
    }, 2500);
    return () => clearInterval(id);
  }, []);

  const toggleLike = (i: number) =>
    setLiked(prev => { const s = new Set(prev); s.has(i) ? s.delete(i) : s.add(i); return s; });

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setMasonryPage(0);
  };

  /* Gallery cards for this tab (always exactly 3) */
  const tabIndices  = TAB_SETS[activeTab];
  const tabCards    = tabIndices.map(i => ({ ...GALLERY[i], galleryIdx: i }));
  const shownCards  = tabCards;

  /* Masonry pagination – 6 per page */
  const MASONRY_PER_PAGE  = 6;
  const masonryTotalPages = Math.ceil(MASONRY_VIDEOS.length / MASONRY_PER_PAGE);
  const shownMasonry      = MASONRY_VIDEOS.slice(masonryPage * MASONRY_PER_PAGE, (masonryPage + 1) * MASONRY_PER_PAGE);
  const prevMasonry = () => setMasonryPage(p => Math.max(0, p - 1));
  const nextMasonry = () => setMasonryPage(p => Math.min(masonryTotalPages - 1, p + 1));

  /* Pastel icon bg */
  const iconBg = (rgba: string) => `rgba(${rgba},${isDark ? 0.18 : 0.10})`;

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: T.bg, scrollbarWidth: 'none' }}>

      {/* ══ GREETING + SEARCH + TOOLS ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-10 pt-14 pb-10" style={{ background: T.bg }}>

        {/* Top gradient — vivid bloom from page top behind heading */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: isDark
            ? 'radial-gradient(ellipse 130% 80% at 50% -8%, rgba(168,85,247,0.42) 0%, rgba(236,72,153,0.22) 30%, rgba(59,130,246,0.12) 58%, transparent 76%),' +
              'radial-gradient(ellipse 80% 40% at 50% -2%, rgba(255,255,255,0.05) 0%, transparent 60%)'
            : 'radial-gradient(ellipse 130% 80% at 50% -8%, rgba(168,85,247,0.22) 0%, rgba(236,72,153,0.12) 30%, rgba(59,130,246,0.07) 58%, transparent 76%)',
        }} />

        {/* Greeting – typewriter */}
        <div className="relative text-center mb-8 max-w-3xl mx-auto">
          <h1 className="text-[52px] font-black tracking-[-0.05em] leading-[1.1] min-h-[64px]"
            style={{
              background: 'linear-gradient(135deg, #FF4500 0%, #FF1493 55%, #8B5CF6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
            {displayWords.join(' ')}
          </h1>
          <p className="text-[13.5px] mt-3 font-medium" style={{ color: T.textMuted }}>
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
          bg={PINK} fill={ORANGE}
          textColor="#fff" fillText="#fff"
          className="ml-auto shrink-0 px-3.5 py-1.5 rounded-xl text-[11.5px] font-semibold"
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

        {/* Platform banner – 3 rotating variants */}
        <div
          className="rounded-2xl overflow-hidden relative cursor-pointer hover:shadow-xl"
          style={{
            background: BANNERS[bannerIdx].gradient,
            minHeight: 148,
            opacity: bannerFade ? 1 : 0,
            transition: 'opacity 0.28s ease',
          }}
          onClick={() => onToolClick(BANNERS[bannerIdx].nav)}>

          <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />

          <div className="relative z-10 flex items-center h-full pl-6 pr-4 py-5 gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <p className="text-[10.5px] font-semibold text-white/80">{BANNERS[bannerIdx].subtitle}</p>
              <h3 className="text-[20px] font-black leading-snug tracking-[-0.03em] text-white">
                {BANNERS[bannerIdx].title[0]}<br />{BANNERS[bannerIdx].title[1]}
              </h3>
              <button
                className="self-start mt-1.5 px-4 py-1.5 rounded-full text-[12px] font-bold cursor-pointer transition-all hover:scale-105"
                style={{ background: 'rgba(255,255,255,0.22)', color: '#fff', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.35)' }}
                onClick={e => { e.stopPropagation(); onToolClick(BANNERS[bannerIdx].nav); }}>
                {BANNERS[bannerIdx].cta} →
              </button>
            </div>

            <div className="relative shrink-0 w-[110px] h-[110px]">
              {(['absolute bottom-2 left-0 w-11 h-11', 'absolute bottom-0 right-2 w-10 h-10', 'absolute top-0 right-0 w-14 h-14'] as const).map((pos, ii) => {
                const item = BANNERS[bannerIdx].icons[ii];
                const Icon = item.Icon as React.ElementType;
                return (
                  <div key={ii}
                    className={`${pos} rounded-2xl flex items-center justify-center shadow-xl`}
                    style={{ background: item.bg, transform: `rotate(${item.rotate}deg)`, border: '2px solid rgba(255,255,255,0.25)' }}>
                    <Icon className={ii === 2 ? 'w-7 h-7' : 'w-5 h-5'} style={{ color: item.color }} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dot indicators */}
          <div className="absolute bottom-2.5 left-6 flex items-center gap-1.5">
            {BANNERS.map((_, di) => (
              <button key={di}
                className="rounded-full cursor-pointer transition-all"
                style={{ width: di === bannerIdx ? 16 : 5, height: 5, background: di === bannerIdx ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)' }}
                onClick={e => { e.stopPropagation(); setBannerFade(false); setTimeout(() => { setBannerIdx(di); setBannerFade(true); }, 280); }} />
            ))}
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

        {/* Tabs + View toggle + Explore all */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-1">
            {CONTENT_TABS.map(tab => (
              activeTab === tab ? (
                <button key={tab}
                  className="px-4 py-2 rounded-xl text-[12.5px] font-medium cursor-pointer"
                  style={{ background: PINK, color: '#fff' }}>
                  {tab}
                </button>
              ) : (
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

          {/* View mode toggle */}
          <div className="flex items-center gap-1 px-1.5 py-1 rounded-xl" style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
            {([
              { mode: 'grid'    as const, Icon: Grid3X3,     title: '3-column grid'    },
              { mode: 'masonry' as const, Icon: Rows3,       title: 'Masonry layout'   },
              { mode: 'large'   as const, Icon: LayoutGrid,  title: '2-column large'   },
            ] as const).map(({ mode, Icon, title }) => (
              <button key={mode} title={title}
                className="p-1.5 rounded-lg cursor-pointer transition-all"
                style={viewMode === mode
                  ? { background: PINK, color: '#fff' }
                  : { color: T.textMuted, background: 'transparent' }}
                onClick={() => setViewMode(mode)}>
                <Icon className="w-3.5 h-3.5" />
              </button>
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

        {/* Cards – view mode changes cols */}
        <div className={viewMode === 'large' ? 'grid grid-cols-2 gap-4' : 'grid grid-cols-3 gap-4'}>
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

        {/* Extra video cards – masonry CSS columns in masonry mode, otherwise grid */}
        {viewMode === 'masonry' ? (
          <div className="mt-4" style={{ columnCount: 3, columnGap: '10px' }}>
            {shownMasonry.map((item, i) => (
              <div key={`mv-${i}`} style={{ breakInside: 'avoid', marginBottom: '10px' }}
                className="group relative rounded-xl overflow-hidden cursor-pointer"
                onClick={() => onToolClick('video')}>
                <video autoPlay loop muted playsInline preload="none"
                  className="w-full block"
                  style={{ aspectRatio: item.ar, objectFit: 'cover' }}>
                  <source src={item.src} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <p className="absolute bottom-2 left-2.5 right-2.5 text-[8.5px] font-semibold text-white/90 truncate opacity-0 group-hover:opacity-100 transition-opacity duration-300">{item.label}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className={`mt-4 ${viewMode === 'large' ? 'grid grid-cols-2 gap-4' : 'grid grid-cols-3 gap-4'}`}>
            {shownMasonry.map((item, i) => (
              <div key={`mv-${i}`}
                className="rounded-2xl overflow-hidden cursor-pointer group transition-all hover:shadow-lg"
                style={{ background: T.bgCard, border: `1px solid ${T.border}` }}
                onClick={() => onToolClick('video')}>

                <div className="relative overflow-hidden" style={{ paddingTop: viewMode === 'large' ? '56%' : '50%' }}>
                  <video autoPlay loop muted playsInline preload="none"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]">
                    <source src={item.src} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(0,0,0,0.50)', backdropFilter: 'blur(8px)' }}>
                    <Sparkles className="w-2.5 h-2.5 text-white/80" />
                    <span className="text-[9px] font-semibold text-white/90">{activeTab}</span>
                  </div>
                </div>

                <div className="p-3.5">
                  <h3 className="text-[12.5px] font-bold mb-1 leading-snug" style={{ color: T.text }}>
                    {item.label}
                  </h3>
                  <p className="text-[10.5px] mb-3 leading-relaxed" style={{ color: T.textMuted }}>
                    {item.desc}
                  </p>
                  <div className="flex items-center justify-between">
                    <FillBtn bg={PINK} fill={ORANGE}
                      className="px-3.5 py-1.5 rounded-xl text-[10.5px] font-semibold"
                      onClick={e => { e.stopPropagation(); onToolClick('video'); }}>
                      Try it now
                    </FillBtn>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" style={{ color: T.textMuted }} />
                        <span className="text-[10px]" style={{ color: T.textMuted }}>{item.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3" style={{ color: T.textMuted }} />
                        <span className="text-[10px]" style={{ color: T.textMuted }}>{item.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination – masonry page control */}
        <div className="flex items-center justify-center gap-4 mt-6 select-none">
          <button onClick={prevMasonry} disabled={masonryPage === 0}
            className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer disabled:opacity-30"
            style={{ background: T.bgCard, border: `1px solid ${T.border}`, color: T.textMuted, transition: 'opacity 0.2s ease' }}>
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: masonryTotalPages }, (_, i) => (
              <button key={i} onClick={() => setMasonryPage(i)}
                className="rounded-full cursor-pointer"
                style={{
                  width:      i === masonryPage ? 28 : 8,
                  height:     8,
                  background: i === masonryPage
                    ? `linear-gradient(90deg, ${PINK}, ${ORANGE})`
                    : (isDark ? 'rgba(255,255,255,0.15)' : '#D1D5DB'),
                  transition: 'width 0.35s cubic-bezier(0.4,0,0.2,1), background 0.35s ease',
                }} />
            ))}
          </div>

          <button onClick={nextMasonry} disabled={masonryPage >= masonryTotalPages - 1}
            className="w-8 h-8 flex items-center justify-center rounded-full cursor-pointer disabled:opacity-30"
            style={{ background: T.bgCard, border: `1px solid ${T.border}`, color: T.textMuted, transition: 'opacity 0.2s ease' }}>
            <ChevronRight className="w-4 h-4" />
          </button>
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
