'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Film, Download, Play, Sparkles, Settings, Mic, Plus, X,
         Clock, LayoutGrid, Star, Clapperboard, Layers, Wand2, Image as ImgIcon } from 'lucide-react';

const HF   = 'https://static.higgsfield.ai';
const PINK = '#EC4899';
const VIO  = '#A855F7';

const GENRES    = ['Action', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller'];
const VSTYLES   = ['Cinematic', 'Documentary', 'Music Video', 'Short Film'];
const CAMERAS   = ['Auto', 'Wide', 'Close-up', 'Drone', 'Handheld'];
const DURATIONS = ['4s', '8s', '16s'];
const RESS      = ['1080p', '4K'];
const MODELS    = ['Seedance 2.0', 'Kling 3.0', 'Wan 2.1'];
const PHASES    = ['Setting up…', 'Generating…', 'Processing…', 'Almost done…', 'Finishing…'];
const CHIPS     = ['Action sequence', 'Night scene', 'Fashion editorial', 'Drone shot', 'Close-up portrait', 'Slow motion'];
const OUT_VIDS  = [
  `${HF}/seedance-2.0-v2/examples/2-mini.mp4`,
  `${HF}/ai-video-v2/example-3-mini.mp4`,
  `${HF}/seedance-2.0-v2/examples/4-mini.mp4`,
  `${HF}/ai-video-v2/example-1-mini.mp4`,
];
const RECENT = [
  { label: 'Fashion Noir', src: `${HF}/seedance-2.0-v2/examples/2-mini.mp4` },
  { label: 'Action Cut',   src: `${HF}/ai-video-v2/example-3-mini.mp4` },
  { label: 'Aerial Shot',  src: `${HF}/seedance-2.0-v2/examples/4-mini.mp4` },
  { label: 'Night Scene',  src: `${HF}/ai-video-v2/example-1-mini.mp4` },
];
const HEADING_WORDS = ['Create', 'a', 'cinematic', 'scene'];

/* ── Hero cards – ALL PORTRAIT (h > w) ─────────────────── */
const HCARDS = [
  { id:'a', src:`${HF}/seedance-2.0-v2/examples/2-mini.mp4`, w:242,h:312,rotate:-9,  z:10, scatter:{x:-640,y:-60, rotate:-28,scale:.55,opacity:0} },
  { id:'b', src:`${HF}/ai-video-v2/example-2-mini.mp4`,       w:288,h:366,rotate:-4,  z:20, scatter:{x:-310,y:-230,rotate:-14,scale:.60,opacity:0} },
  { id:'c', src:`${HF}/seedance-2.0-v2/examples/4-mini.mp4`,  w:378,h:400,rotate:0,   z:50, scatter:{y:-380,scale:1.3,rotate:0, opacity:0} },
  { id:'d', src:`${HF}/ai-video-v2/example-1-mini.mp4`,       w:288,h:366,rotate:4,   z:20, scatter:{x:310, y:-230,rotate:14, scale:.60,opacity:0} },
  { id:'e', src:`${HF}/ai-video-v2/example-3-mini.mp4`,       w:242,h:312,rotate:9,   z:10, scatter:{x:640, y:-60, rotate:28, scale:.55,opacity:0} },
] as const;

const CARD_CONTAINER_H = 440; // fixed height; center card is 400px → 40px gap at top for glow

function AutoVideo({ src, className }: { src: string; className?: string }) {
  const r = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = r.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        if (!el.src) { el.src = src; el.load(); el.addEventListener('canplay', () => el.play().catch(() => {}), { once: true }); }
        else el.play().catch(() => {});
      } else el.pause();
    }, { threshold: 0.05 });
    obs.observe(el); return () => obs.disconnect();
  }, [src]);
  return <video ref={r} loop muted playsInline preload="none" className={className} />;
}

/* ══════════════════════════════════════════════════════════════
   HERO
   Layout: flex col, justifyContent center (equal top/bottom space)
   Glow: NARROW absolute div, only center-card width → glow behind center only
   Cards: all portrait (h > w)
══════════════════════════════════════════════════════════════ */
function HeroScreen({ onGetStarted }: { onGetStarted: (p: string) => void }) {
  const [prompt,     setPrompt]     = useState('');
  const [scattering, setScattering] = useState(false);
  const go = () => { if (scattering) return; setScattering(true); setTimeout(() => onGetStarted(prompt), 660); };

  return (
    <motion.div
      key="hero"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative',
        /* Full-screen glow — radiates from where the center card sits (≈58% down) */
        background:
          'radial-gradient(ellipse 85% 95% at 50% 58%,' +
          ' rgba(205,42,255,.86) 0%,'  +
          ' rgba(165,22,235,.60) 18%,' +
          ' rgba(210,52,210,.30) 42%,' +
          ' rgba(150,25,190,.10) 60%,' +
          ' transparent 74%),' +
          '#09090b',
      }}
    >
      {/* Dot grid – static, no separate animation */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.22) 1.5px, transparent 1.5px)',
        backgroundSize: '28px 28px',
      }} />

      {/* ── Centering wrapper: equal space above & below ── */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 120,
        position: 'relative', zIndex: 1, overflow: 'hidden',
      }}>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: .06, duration: .6, ease: [.16, 1, .3, 1] }}
          style={{ textAlign: 'center', padding: '0 24px', marginBottom: 30, flexShrink: 0 }}
        >
          <h1 style={{ fontSize: 76, fontWeight: 300, letterSpacing: '-.03em', color: '#fff', margin: 0, lineHeight: 1.08 }}>
            Build with <span style={{ color: PINK }}>Cinema Studio</span>
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,.34)', marginTop: 12 }}>
            Go from concept to cinematic scene with Seedance 2.0 and Kling 3.0
          </p>
        </motion.div>

        {/* ── Cards row ── fixed height, overflow clips edge cards ── */}
        <div style={{
          height: CARD_CONTAINER_H,
          width: '100%', flexShrink: 0,
          overflow: 'hidden', position: 'relative',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        }}>
          {/*
            GLOW: narrow column, only as wide as the center card + small margin.
            This confines the purple bloom to behind the center card ONLY.
            The glow is z:2 so cards (z:10–50) render on top.
          */}
          {HCARDS.map((card, i) => (
            <motion.div key={card.id}
              initial={{ y: 65, opacity: 0, rotate: card.rotate, scale: .91 }}
              animate={scattering ? { ...card.scatter } : { y: 0, opacity: 1, rotate: card.rotate, scale: 1 }}
              transition={scattering
                ? { duration: .48, delay: i * .06, ease: [.55, 0, 1, .42] }
                : { duration: .7,  delay: .16 + i * .09, ease: [.16, 1, .3, 1] }}
              style={{
                flexShrink: 0, width: card.w, height: card.h,
                marginLeft: i === 0 ? 0 : -54, zIndex: card.z,
                borderRadius: 14, overflow: 'hidden', position: 'relative',
                boxShadow: i === 2
                  ? '0 24px 80px rgba(0,0,0,.92),0 0 0 1px rgba(255,255,255,.07)'
                  : '0 14px 48px rgba(0,0,0,.82),0 0 0 1px rgba(255,255,255,.04)',
              }}
            >
              <AutoVideo src={card.src} className="absolute inset-0 w-full h-full object-cover" />
              {/* Top vignette: dark → transparent, lets the glow bleed through top portion */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to bottom, rgba(9,9,11,.88) 0%, rgba(9,9,11,.15) 28%, transparent 46%, transparent 62%, rgba(0,0,0,.55) 100%)',
              }} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Prompt: absolute at bottom, overlaps card cluster ── */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={scattering ? { opacity: 0 } : { opacity: 1, y: 0 }}
        transition={scattering ? { duration: .22 } : { delay: .52, duration: .55, ease: [.16, 1, .3, 1] }}
        style={{
          position: 'absolute', bottom: 62, left: 0, right: 0,
          display: 'flex', justifyContent: 'center',
          padding: '0 24px', zIndex: 200,
        }}
      >
        <div style={{
          width: '100%', maxWidth: 560,
          background: 'rgba(20,20,22,.97)', borderRadius: 22,
          border: '1px solid rgba(255,255,255,.1)',
          padding: '16px 18px 14px',
          boxShadow: '0 8px 56px rgba(0,0,0,.82)',
          backdropFilter: 'blur(12px)',
        }}>
          <textarea
            value={prompt} onChange={e => setPrompt(e.target.value.slice(0, 500))}
            placeholder="Describe your cinematic scene…" rows={2}
            style={{ width: '100%', background: 'transparent', color: '#fff', fontSize: 16, lineHeight: 1.6, outline: 'none', resize: 'none', border: 'none', fontFamily: 'inherit', caretColor: PINK }}
            onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) go(); }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <motion.button onClick={go} disabled={scattering}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: .96 }}
              style={{ background: `linear-gradient(135deg,${PINK},${VIO})`, padding: '10px 26px', borderRadius: 28, color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', opacity: scattering ? .38 : 1 }}>
              Get started
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
   WORKSPACE  —  AI-Studio layout
══════════════════════════════════════════════════════════════ */
type NavId = 'new' | 'my-scenes' | 'templates' | 'storyboards' | 'archived' | 'gallery' | 'trending' | 'community' | 'examples' | 'vfx' | 'color';

function WorkspaceView({ initialPrompt, onBack }: { initialPrompt: string; onBack: () => void }) {
  const [prompt,       setPrompt]  = useState(initialPrompt);
  const [activeNav,    setNav]     = useState<NavId>('new');
  const [settingsOpen, setSettings]= useState(false);
  const [generating,   setGen]     = useState(false);
  const [generated,    setDone]    = useState(false);
  const [progress,     setProgress]= useState(0);
  const [phase,        setPhase]   = useState('');
  const [take,         setTake]    = useState(1);
  const [genres,       setGenres]  = useState<string[]>([]);
  const [vstyle,       setVstyle]  = useState('Cinematic');
  const [camera,       setCamera]  = useState('Auto');
  const [duration,     setDur]     = useState('8s');
  const [resolution,   setRes]     = useState('4K');
  const [model,        setModel]   = useState('Seedance 2.0');

  /* animated heading */
  const [wordIdx, setWordIdx] = useState(0);
  useEffect(() => {
    const timers = HEADING_WORDS.map((_, i) => setTimeout(() => setWordIdx(i + 1), 500 + i * 280));
    return () => timers.forEach(clearTimeout);
  }, []);

  const startGen = useCallback(() => {
    setGen(true); setDone(false); setProgress(0); setPhase(PHASES[0]);
    PHASES.forEach((p, i) => setTimeout(() => setPhase(p), i * 700));
    const iv = setInterval(() => setProgress(p => p >= 88 ? p : p + Math.random() * 5), 120);
    setTimeout(() => setProgress(94), 2900);
    setTimeout(() => { clearInterval(iv); setProgress(100); setTimeout(() => { setGen(false); setDone(true); setPhase(''); setTake(t => t + 1); }, 200); }, 3900);
  }, []);

  const toggleGenre = (g: string) => setGenres(p => p.includes(g) ? p.filter(x => x !== g) : [...p, g]);
  const chip = (on: boolean): React.CSSProperties => on
    ? { background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.26)', color: '#fff' }
    : { background: 'transparent', border: '1px solid rgba(255,255,255,.08)', color: 'rgba(255,255,255,.38)' };

  /* sidebar nav item helper */
  const navBtn = (id: NavId, label: string, icon?: React.ReactNode) => (
    <button key={id} onClick={() => { setNav(id); if (id !== 'new') { setDone(false); setGen(false); } else { setDone(false); setGen(false); setPrompt(''); } }}
      style={{
        width: '100%', textAlign: 'left', padding: '7px 8px', borderRadius: 8,
        fontSize: 12.5, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
        background: activeNav === id ? 'rgba(255,255,255,.1)' : 'transparent',
        color: activeNav === id ? '#fff' : 'rgba(255,255,255,.42)',
      }}>
      {icon && <span style={{ opacity: .6, display: 'flex' }}>{icon}</span>}
      {label}
    </button>
  );

  /* what shows in main content area */
  const showGallery = activeNav === 'gallery' || activeNav === 'trending' || activeNav === 'community';
  const showExamples = activeNav === 'examples' || activeNav === 'storyboards';

  return (
    <motion.div key="ws"
      initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: .45, ease: [.16, 1, .3, 1] }}
      style={{ flex: 1, display: 'flex', overflow: 'hidden', background: '#09090b' }}
    >
      {/* ── LEFT SIDEBAR ─────────────────────────── */}
      <div style={{ width: 206, flexShrink: 0, background: '#0f0f11', borderRight: '1px solid rgba(255,255,255,.06)', display: 'flex', flexDirection: 'column' }}>

        {/* header */}
        <div style={{ padding: '13px 12px 11px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid rgba(255,255,255,.06)', flexShrink: 0 }}>
          <button onClick={onBack} style={{ color: 'rgba(255,255,255,.28)', cursor: 'pointer', background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'center' }}>
            <ChevronLeft style={{ width: 16, height: 16 }} />
          </button>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,.52)' }}>Cinema Studio</span>
        </div>

        {/* new scene */}
        <div style={{ padding: '10px 10px 6px', flexShrink: 0 }}>
          <button onClick={() => { setNav('new'); setDone(false); setGen(false); setPrompt(''); }}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 10, background: `rgba(236,72,153,.1)`, border: `1px solid rgba(236,72,153,.22)`, color: PINK, fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>
            <Plus style={{ width: 13, height: 13 }} /> New scene
          </button>
        </div>

        {/* nav */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '2px 10px 10px', scrollbarWidth: 'none' }}>

          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.14em', color: 'rgba(255,255,255,.2)', textTransform: 'uppercase', padding: '10px 6px 5px', margin: 0 }}>SCENES</p>
          {navBtn('my-scenes',   'My scenes',    <Clapperboard style={{ width: 11, height: 11 }} />)}
          {navBtn('templates',   'Templates',    <LayoutGrid   style={{ width: 11, height: 11 }} />)}
          {navBtn('storyboards', 'Storyboards',  <Layers       style={{ width: 11, height: 11 }} />)}
          {navBtn('archived',    'Archived',     <Clock        style={{ width: 11, height: 11 }} />)}

          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.14em', color: 'rgba(255,255,255,.2)', textTransform: 'uppercase', padding: '12px 6px 5px', margin: 0 }}>TOOLS</p>
          {navBtn('vfx',   'VFX Editor',    <Wand2   style={{ width: 11, height: 11 }} />)}
          {navBtn('color', 'Color Grading', <ImgIcon style={{ width: 11, height: 11 }} />)}

          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.14em', color: 'rgba(255,255,255,.2)', textTransform: 'uppercase', padding: '12px 6px 5px', margin: 0 }}>EXPLORE</p>
          {navBtn('gallery',   'Gallery',   <Star   style={{ width: 11, height: 11 }} />)}
          {navBtn('trending',  'Trending',  <Film   style={{ width: 11, height: 11 }} />)}
          {navBtn('community', 'Community', <Plus   style={{ width: 11, height: 11 }} />)}
          {navBtn('examples',  'Examples',  <Play   style={{ width: 11, height: 11 }} />)}
        </div>

        {/* bottom info */}
        <div style={{ padding: '8px 12px 12px', borderTop: '1px solid rgba(255,255,255,.06)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: PINK, boxShadow: `0 0 6px ${PINK}` }} />
            <p style={{ fontSize: 10.5, color: 'rgba(255,255,255,.2)', margin: 0 }}>Take {take} · {resolution} · {model.split(' ')[0]}</p>
          </div>
        </div>
      </div>

      {/* ── MAIN AREA ────────────────────────────── */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
        background:
          'radial-gradient(ellipse 70% 62% at 22% 14%, rgba(140,18,240,.52) 0%, rgba(110,10,200,.28) 38%, transparent 60%),' +
          'radial-gradient(ellipse 62% 58% at 78% 88%, rgba(230,30,145,.42) 0%, rgba(180,20,130,.22) 40%, transparent 60%),' +
          'radial-gradient(ellipse 45% 42% at 50% 50%, rgba(80,0,160,.18) 0%, transparent 55%),' +
          '#09090b',
      }}>

        {/* settings toggle */}
        <button onClick={() => setSettings(s => !s)} title="Settings"
          style={{ position: 'absolute', top: 16, right: 16, padding: 8, borderRadius: 10, background: settingsOpen ? 'rgba(255,255,255,.1)' : 'transparent', border: `1px solid ${settingsOpen ? 'rgba(255,255,255,.14)' : 'rgba(255,255,255,.06)'}`, cursor: 'pointer', color: 'rgba(255,255,255,.4)', display: 'flex' }}>
          <Settings style={{ width: 16, height: 16 }} />
        </button>

        {/* ── IDLE / CREATE ── */}
        {!generating && !generated && activeNav === 'new' && (
          <div style={{ width: '100%', maxWidth: 820, padding: '0 28px', textAlign: 'center' }}>

            {/* animated heading */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 30 }}>
              <h2 style={{ fontSize: 36, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-.025em' }}>
                {HEADING_WORDS.map((w, i) => (
                  <motion.span key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={i < wordIdx ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                    transition={{ duration: .35, ease: [.16, 1, .3, 1] }}
                    style={{ display: 'inline-block', marginRight: '.28em' }}
                  >{w}</motion.span>
                ))}
              </h2>
              <motion.div initial={{ opacity: 0, scale: .6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.6, duration: .4 }}>
                <Sparkles style={{ width: 28, height: 28, color: PINK, flexShrink: 0 }} />
              </motion.div>
            </div>

            {/* gradient-border prompt box — wider than before */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3, duration: .5 }}>
              <div style={{ background: `linear-gradient(135deg,${PINK}60,${VIO}60,${PINK}38)`, borderRadius: 22, padding: 1.5 }}>
                <div style={{ background: '#141416', borderRadius: '20.5px', padding: '20px 22px 16px' }}>
                  <textarea value={prompt} onChange={e => setPrompt(e.target.value.slice(0, 500))}
                    placeholder="Describe your scene…" rows={3}
                    style={{ width: '100%', background: 'transparent', color: '#fff', fontSize: 16, lineHeight: 1.65, outline: 'none', resize: 'none', border: 'none', fontFamily: 'inherit', caretColor: PINK }}
                    onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) startGen(); }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: 12 }}>
                    <button style={{ padding: '7px 9px', borderRadius: 9, background: 'rgba(255,255,255,.06)', border: 'none', cursor: 'pointer', display: 'flex' }}>
                      <Mic style={{ width: 15, height: 15, color: 'rgba(255,255,255,.45)' }} />
                    </button>
                    <button style={{ padding: '7px 9px', borderRadius: 9, background: 'rgba(255,255,255,.06)', border: 'none', cursor: 'pointer', display: 'flex', marginLeft: 7 }}>
                      <ImgIcon style={{ width: 15, height: 15, color: 'rgba(255,255,255,.45)' }} />
                    </button>
                    <div style={{ flex: 1 }} />
                    <motion.button onClick={startGen} whileHover={{ scale: 1.04 }} whileTap={{ scale: .96 }}
                      style={{ background: `linear-gradient(135deg,${PINK},${VIO})`, padding: '10px 26px', borderRadius: 26, color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' }}>
                      Generate
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* quick chips */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .55, duration: .5 }}
              style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 18 }}>
              {CHIPS.map(c => (
                <button key={c} onClick={() => setPrompt(p => p ? p + ', ' + c : c)}
                  style={{ padding: '7px 15px', borderRadius: 24, fontSize: 12, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', color: 'rgba(255,255,255,.52)', cursor: 'pointer' }}>
                  {c}
                </button>
              ))}
            </motion.div>

            {/* recent scenes */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .75, duration: .5 }}
              style={{ marginTop: 36, textAlign: 'left' }}>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,.28)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '.1em' }}>Recent scenes</p>
              <div style={{ display: 'flex', gap: 10 }}>
                {RECENT.map(r => (
                  <div key={r.label} className="group" style={{ flex: 1, height: 80, borderRadius: 10, overflow: 'hidden', position: 'relative', cursor: 'pointer', border: '1px solid rgba(255,255,255,.07)' }}>
                    <AutoVideo src={r.src} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                    <p style={{ position: 'absolute', bottom: 6, left: 8, fontSize: 9.5, color: 'rgba(255,255,255,.7)', margin: 0 }}>{r.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* ── GALLERY / EXPLORE view ── */}
        {!generating && !generated && showGallery && (
          <div style={{ width: '100%', height: '100%', padding: 28, overflow: 'auto', boxSizing: 'border-box' }}>
            <p style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 20, textTransform: 'capitalize' }}>{activeNav}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {OUT_VIDS.concat(OUT_VIDS).slice(0, 6).map((src, i) => (
                <div key={i} style={{ borderRadius: 12, overflow: 'hidden', aspectRatio: '16/10', position: 'relative', border: '1px solid rgba(255,255,255,.07)' }}>
                  <AutoVideo src={src} className="absolute inset-0 w-full h-full object-cover" />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '6px 10px', background: 'linear-gradient(to top, rgba(0,0,0,.7), transparent)' }}>
                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,.7)', margin: 0 }}>Scene {i + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── EXAMPLES / STORYBOARDS ── */}
        {!generating && !generated && showExamples && (
          <div style={{ width: '100%', maxWidth: 760, padding: '0 28px', textAlign: 'center' }}>
            <p style={{ fontSize: 18, fontWeight: 600, color: '#fff', marginBottom: 24, textTransform: 'capitalize' }}>{activeNav}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {['Action chase · downtown', 'Fashion editorial · night', 'Sci-fi corridor · blue neon', 'Aerial ocean · golden hour'].map((label, i) => (
                <button key={i} onClick={() => { setNav('new'); setPrompt(label); }}
                  style={{ padding: '14px 18px', borderRadius: 14, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', textAlign: 'left', cursor: 'pointer' }}>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,.75)', margin: '0 0 4px', fontWeight: 500 }}>{label}</p>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,.28)', margin: 0 }}>Click to use this prompt →</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── TOOLS (VFX / Color) ── */}
        {!generating && !generated && (activeNav === 'vfx' || activeNav === 'color') && (
          <div style={{ textAlign: 'center', padding: '0 28px' }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(236,72,153,.1)', border: '1px solid rgba(236,72,153,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
              {activeNav === 'vfx' ? <Wand2 style={{ width: 28, height: 28, color: `${PINK}99` }} /> : <ImgIcon style={{ width: 28, height: 28, color: `${PINK}99` }} />}
            </div>
            <p style={{ fontSize: 18, fontWeight: 600, color: 'rgba(255,255,255,.55)', margin: '0 0 8px' }}>{activeNav === 'vfx' ? 'VFX Editor' : 'Color Grading'}</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,.25)' }}>Coming soon</p>
          </div>
        )}

        {/* ── My scenes / templates / archived ── */}
        {!generating && !generated && (activeNav === 'my-scenes' || activeNav === 'templates' || activeNav === 'archived') && (
          <div style={{ textAlign: 'center', padding: '0 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <Clapperboard style={{ width: 40, height: 40, color: 'rgba(255,255,255,.18)' }} />
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,.28)', margin: 0 }}>No {activeNav.replace('-', ' ')} yet</p>
            <button onClick={() => { setNav('new'); setPrompt(''); }}
              style={{ padding: '9px 20px', borderRadius: 22, background: `linear-gradient(135deg,${PINK},${VIO})`, border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Create your first scene
            </button>
          </div>
        )}

        {/* ── Generating ── */}
        {generating && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
            <div style={{ position: 'relative', width: 80, height: 80 }}>
              {[0, 1].map(i => (
                <motion.div key={i}
                  animate={{ rotate: i % 2 ? -360 : 360 }}
                  transition={{ duration: 1.8 + i * 1.2, repeat: Infinity, ease: 'linear' }}
                  style={{ position: 'absolute', inset: i * 10, borderRadius: '50%', border: `${i === 0 ? 2 : 1.5}px solid transparent`, borderTopColor: i === 0 ? PINK : VIO + '80' }}
                />
              ))}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Film style={{ width: 22, height: 22, color: 'rgba(236,72,153,.8)' }} />
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,.72)', fontWeight: 500, margin: 0 }}>{phase}</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,.22)', marginTop: 5 }}>{Math.round(progress)}%</p>
            </div>
            <div style={{ width: 240, height: 2, borderRadius: 9999, background: 'rgba(255,255,255,.06)', overflow: 'hidden' }}>
              <motion.div animate={{ width: `${progress}%` }} transition={{ duration: .3 }}
                style={{ height: '100%', background: `linear-gradient(90deg,${PINK},${VIO})`, borderRadius: 9999 }} />
            </div>
          </div>
        )}

        {/* ── Generated ── */}
        {generated && (
          <div style={{ width: '100%', height: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, maxWidth: 840, padding: '24px 24px 96px', boxSizing: 'border-box' }}>
            {OUT_VIDS.map((src, idx) => (
              <div key={idx} className="group" style={{ position: 'relative', borderRadius: 12, overflow: 'hidden' }}>
                <AutoVideo src={src} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(0,0,0,.2)' }}>
                  <button style={{ padding: 8, borderRadius: 10, background: 'rgba(0,0,0,.68)', border: 'none', cursor: 'pointer', display: 'flex' }}>
                    <Play style={{ width: 13, height: 13, color: '#fff', fill: '#fff' }} />
                  </button>
                  <button style={{ padding: 8, borderRadius: 10, background: 'rgba(0,0,0,.68)', border: 'none', cursor: 'pointer', display: 'flex' }}>
                    <Download style={{ width: 13, height: 13, color: '#fff' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* bottom prompt bar when generated */}
        {generated && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px 20px 16px' }}>
            <div style={{ background: 'rgba(255,255,255,.05)', borderRadius: 16, border: '1px solid rgba(255,255,255,.08)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <textarea value={prompt} onChange={e => setPrompt(e.target.value.slice(0, 500))}
                placeholder="Refine your scene…" rows={1}
                style={{ flex: 1, background: 'transparent', color: 'rgba(255,255,255,.75)', fontSize: 14, lineHeight: 1.5, outline: 'none', resize: 'none', border: 'none', fontFamily: 'inherit', caretColor: PINK }}
              />
              <button onClick={startGen}
                style={{ flexShrink: 0, background: `linear-gradient(135deg,${PINK},${VIO})`, padding: '9px 18px', borderRadius: 22, color: '#fff', fontWeight: 600, fontSize: 13, border: 'none', cursor: 'pointer' }}>
                Regenerate
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── RIGHT SETTINGS PANEL ─────────────────── */}
      <AnimatePresence>
        {settingsOpen && (
          <motion.div
            initial={{ width: 0 }} animate={{ width: 256 }} exit={{ width: 0 }}
            transition={{ duration: .25, ease: [.16, 1, .3, 1] }}
            style={{ flexShrink: 0, overflow: 'hidden', background: '#0f0f11', borderLeft: '1px solid rgba(255,255,255,.06)' }}
          >
            <div style={{ width: 256, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '14px 14px 12px', display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,.06)', flexShrink: 0 }}>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,.5)', flex: 1 }}>Settings</span>
                <button onClick={() => setSettings(false)} style={{ color: 'rgba(255,255,255,.3)', cursor: 'pointer', background: 'none', border: 'none', display: 'flex', padding: 0 }}>
                  <X style={{ width: 14, height: 14 }} />
                </button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 16, scrollbarWidth: 'none' }}>
                {[
                  { label: 'GENRE',  items: GENRES,  active: (x: string) => genres.includes(x), toggle: (x: string) => toggleGenre(x) },
                  { label: 'STYLE',  items: VSTYLES, active: (x: string) => vstyle === x,        toggle: (x: string) => setVstyle(x)   },
                  { label: 'CAMERA', items: CAMERAS, active: (x: string) => camera === x,        toggle: (x: string) => setCamera(x)   },
                ].map(sec => (
                  <div key={sec.label}>
                    <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.14em', color: 'rgba(255,255,255,.24)', textTransform: 'uppercase', margin: '0 0 8px' }}>{sec.label}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {sec.items.map(item => (
                        <button key={item} onClick={() => sec.toggle(item)}
                          style={{ ...chip(sec.active(item)), padding: '5px 9px', borderRadius: 7, fontSize: 11, fontWeight: 500, cursor: 'pointer' }}>
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[
                    { label: 'DURATION',   items: DURATIONS, val: duration,   set: setDur },
                    { label: 'RESOLUTION', items: RESS,      val: resolution, set: setRes },
                  ].map(sec => (
                    <div key={sec.label}>
                      <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.14em', color: 'rgba(255,255,255,.24)', textTransform: 'uppercase', margin: '0 0 7px' }}>{sec.label}</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {sec.items.map(item => (
                          <button key={item} onClick={() => sec.set(item)}
                            style={{ ...chip(sec.val === item), padding: '5px', borderRadius: 7, fontSize: 11, fontWeight: 500, cursor: 'pointer', textAlign: 'center' }}>
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.14em', color: 'rgba(255,255,255,.24)', textTransform: 'uppercase', margin: '0 0 7px' }}>MODEL</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {MODELS.map(m => (
                      <button key={m} onClick={() => setModel(m)}
                        style={{ ...chip(model === m), padding: '7px 10px', borderRadius: 9, fontSize: 11, fontWeight: 500, cursor: 'pointer', textAlign: 'center' }}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ paddingTop: 8 }}>
                  <motion.button onClick={startGen} disabled={generating}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: .97 }}
                    style={{ width: '100%', height: 44, background: `linear-gradient(135deg,${PINK},${VIO})`, borderRadius: 12, border: 'none', cursor: 'pointer', color: '#fff', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: generating ? .5 : 1 }}>
                    <Sparkles style={{ width: 14, height: 14 }} /> Generate
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Root ─────────────────────────────────────────────────── */
export default function CinemaStudioView({ onBack }: { onBack: () => void }) {
  const [phase,  setPhase]  = useState<'hero' | 'workspace'>('hero');
  const [prompt, setPrompt] = useState('');
  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden', background: '#09090b' }}>
      <AnimatePresence mode="wait">
        {phase === 'hero'
          ? <HeroScreen key="hero" onGetStarted={p => { setPrompt(p); setPhase('workspace'); }} />
          : <WorkspaceView key="ws" initialPrompt={prompt} onBack={() => setPhase('hero')} />
        }
      </AnimatePresence>
    </div>
  );
}
