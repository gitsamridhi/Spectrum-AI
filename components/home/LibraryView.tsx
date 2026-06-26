'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Upload, Grid3X3, List, Search, MoreHorizontal, GitFork, Layers,
  Star, Check, Download, FolderOpen, Trash2, X, Zap, Film, ChevronDown,
  SlidersHorizontal, LayoutGrid, Columns,
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

const P = { vivid: '#FF7000', orange: '#FFB347', magenta: '#F060EE', peach: '#FFBF80', coral: '#FF6B86', rose: '#e11d48' };
const TABS = ['All', 'Images', 'Videos', 'Uploads', 'Favorites'];
const HF = 'https://static.higgsfield.ai';

interface Asset {
  src: string; videoSrc?: string;
  name: string; size: string; type: string; date: string;
  prompt: string; model: string; seed: string; session: string;
  promptKey?: string;
}

const ASSETS: Asset[] = [
  { src: 'https://picsum.photos/seed/lib-p1/400/400',  videoSrc: `${HF}/ai-video-v2/example-1-mini.mp4`,        name: 'portrait_cinematic.mp4',   size: '2.1 MB',  type: 'Video', date: 'Today',        prompt: 'cinematic portrait, golden hour, 35mm grain',         model: 'Seedance 2.0',   seed: '4829301', session: 'Brand Campaign — June',  promptKey: 'portrait-golden' },
  { src: 'https://picsum.photos/seed/lib-p2/400/400',                                                             name: 'portrait_enhanced.jpg',    size: '4.2 MB',  type: 'Image', date: 'Today',        prompt: 'cinematic portrait, golden hour, 35mm grain',         model: 'Portrait Ultra', seed: '4829402', session: 'Brand Campaign — June',  promptKey: 'portrait-golden' },
  { src: 'https://picsum.photos/seed/lib-p3/400/400',                                                             name: 'portrait_v3.jpg',           size: '4.3 MB',  type: 'Image', date: 'Today',        prompt: 'cinematic portrait, golden hour, 35mm grain',         model: 'Portrait Ultra', seed: '4829503', session: 'Brand Campaign — June',  promptKey: 'portrait-golden' },
  { src: 'https://picsum.photos/seed/lib-cyber/400/400', videoSrc: `${HF}/seedance-2.0-v2/examples/2-mini.mp4`, name: 'cyberpunk_vfx.mp4',         size: '1.8 MB',  type: 'Video', date: 'Yesterday',    prompt: 'neon cyberpunk portrait, vivid tones',                model: 'Turbo v2',       seed: '1029384', session: 'Product Shoot Q2' },
  { src: 'https://picsum.photos/seed/lib-prod/400/400',  videoSrc: `${HF}/ai-video-v2/example-3-mini.mp4`,      name: 'product_floating.mp4',     size: '2.8 MB',  type: 'Video', date: '3 days ago',   prompt: 'luxury product floating in void, volumetric light',   model: 'Seedance 2.0',   seed: '5571293', session: 'Product Shoot Q2' },
  { src: 'https://picsum.photos/seed/lib-fash/400/400',  videoSrc: `${HF}/seedance-2.0-v2/examples/4-mini.mp4`, name: 'fashion_editorial.mp4',    size: '3.2 MB',  type: 'Video', date: '3 days ago',   prompt: 'fashion editorial, avant-garde, neon runway',         model: 'Seedance 2.0',   seed: '9938272', session: 'Brand Campaign — June' },
  { src: 'https://picsum.photos/seed/lib-city1/400/400', videoSrc: `${HF}/ai-video-v2/example-5-mini.mp4`,      name: 'social_reel_01.mp4',       size: '2.4 MB',  type: 'Video', date: '4 days ago',   prompt: 'city nightscape, bokeh lights, cinematic grade',      model: 'Landscape Pro',  seed: '5571293', session: 'Social Reel Pack',       promptKey: 'city-nightscape' },
  { src: 'https://picsum.photos/seed/lib-city2/400/400',                                                          name: 'social_reel_02.jpg',        size: '4.4 MB',  type: 'Image', date: '4 days ago',   prompt: 'city nightscape, bokeh lights, cinematic grade',      model: 'Landscape Pro',  seed: '5571394', session: 'Social Reel Pack',       promptKey: 'city-nightscape' },
  { src: 'https://picsum.photos/seed/lib-ups/400/400',   videoSrc: `${HF}/seedance-2.0-v2/examples/3-mini.mp4`, name: 'upscale_4k.mp4',           size: '3.6 MB',  type: 'Video', date: '1 week ago',   prompt: 'portrait retouching, natural skin, studio',           model: 'Portrait Ultra', seed: '3847561', session: 'Client Delivery #4' },
  { src: 'https://picsum.photos/seed/lib-land/400/400',  videoSrc: `${HF}/seedance-2.0-v2/examples/5-mini.mp4`, name: 'landscape_8k.mp4',          size: '12.1 MB', type: 'Video', date: '1 week ago',   prompt: 'mountain landscape, golden hour, 8K native',          model: 'Landscape Pro',  seed: '6629018', session: 'Client Delivery #4' },
  { src: 'https://picsum.photos/seed/lib-abst/400/400',  videoSrc: `${HF}/ai-video-v2/example-2-mini.mp4`,      name: 'abstract_flow.mp4',        size: '2.2 MB',  type: 'Video', date: '1 week ago',   prompt: 'abstract generative art, glowing energy vortex',     model: 'AI Video v2',    seed: '7812309', session: 'Client Delivery #4' },
  { src: 'https://picsum.photos/seed/lib-rend/400/400',  videoSrc: `${HF}/ai-video-v2/example-4-mini.mp4`,      name: 'product_render.mp4',        size: '6.8 MB',  type: 'Video', date: '2 weeks ago',  prompt: 'luxury brand campaign, minimal studio, couture',      model: 'Product Studio', seed: '8811234', session: 'Product Shoot Q2' },
  { src: 'https://picsum.photos/seed/lib-feat/400/400',  videoSrc: `${HF}/seedance-2.0-v2/examples/1-mini.mp4`, name: 'feature_reel.mp4',          size: '3.1 MB',  type: 'Video', date: '3 weeks ago',  prompt: 'sweeping aerial establishing shot, megacity at dusk', model: 'Seedance 2.0',   seed: '9911234', session: 'Client Delivery #4' },
];

const SESSIONS = [...new Set(ASSETS.map(a => a.session))];

/* ── AutoVideo — IntersectionObserver autoplay, no poster, plays when in view ─ */

function AutoVideo({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!el.src) {
          el.src = src;
          el.load();
          el.addEventListener('canplay', () => el.play().catch(() => {}), { once: true });
        } else {
          el.play().catch(() => {});
        }
      } else {
        el.pause();
      }
    }, { threshold: 0.05 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [src]);
  return <video ref={ref} loop muted playsInline preload="none" className={className ?? ''} />;
}

/* ── ActionStrip — Upscale / Animate / Fork, fades in above HUD ────────────── */

function ActionStrip({ onFork, asset }: { onFork: (a: Asset) => void; asset: Asset }) {
  return (
    <div className="absolute z-20 left-2.5 right-2.5 flex gap-1.5 items-center
                    opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0
                    transition-all duration-200 pointer-events-none group-hover:pointer-events-auto"
      style={{ bottom: 48 }}>
      <button onClick={e => e.stopPropagation()}
        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9.5px] font-bold text-white cursor-pointer"
        style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.18)' }}>
        <Zap className="w-2.5 h-2.5" />Upscale
      </button>
      <button onClick={e => e.stopPropagation()}
        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9.5px] font-bold text-white cursor-pointer"
        style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.18)' }}>
        <Film className="w-2.5 h-2.5" />Animate
      </button>
      <button onClick={e => { e.stopPropagation(); onFork(asset); }}
        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[9.5px] font-bold text-white cursor-pointer ml-auto"
        style={{ background: P.vivid }}>
        <GitFork className="w-2.5 h-2.5" />Fork & Remix
      </button>
    </div>
  );
}

/* ── BottomHUD — always-visible gradient with filename + meta ───────────────── */

function BottomHUD({ name, meta }: { name: string; meta: string }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 px-3 pb-2.5 pt-8 pointer-events-none"
      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.45) 55%, transparent 100%)' }}>
      <p className="text-[10.5px] font-semibold truncate leading-snug" style={{ color: 'rgba(255,255,255,0.9)' }}>{name}</p>
      <p className="text-[9px] font-mono mt-0.5" style={{ color: 'rgba(255,255,255,0.65)' }}>{meta}</p>
    </div>
  );
}

/* ── MediaTile — borderless tile, single asset ──────────────────────────────── */

function MediaTile({
  asset, isSelected, isStarred, onFork, onToggleSelect, onToggleStar,
}: {
  asset: Asset; isSelected: boolean; isStarred: boolean;
  onFork: (a: Asset) => void; onToggleSelect: (n: string) => void; onToggleStar: (n: string) => void;
}) {
  const isVideo = !!asset.videoSrc;

  return (
    <div className="group relative overflow-hidden cursor-pointer aspect-square bg-zinc-950">

      {isVideo ? (
        <AutoVideo src={asset.videoSrc!} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <img src={asset.src} alt={asset.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      )}

      {/* Hover dim */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 pointer-events-none" />
      {isSelected && <div className="absolute inset-0 ring-2 ring-orange-400 ring-inset pointer-events-none z-30" />}

      {/* Checkbox */}
      <button onClick={e => { e.stopPropagation(); onToggleSelect(asset.name); }}
        className={`absolute top-2.5 left-2.5 z-20 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-150 cursor-pointer ${
          isSelected ? 'bg-orange-500 border-orange-500 opacity-100' : 'border-white/70 bg-black/30 opacity-0 group-hover:opacity-100'
        }`}>
        {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
      </button>

      {/* Star */}
      <button onClick={e => { e.stopPropagation(); onToggleStar(asset.name); }}
        className={`absolute top-2.5 right-2.5 z-20 p-1.5 rounded-lg transition-all duration-150 cursor-pointer ${
          isStarred ? 'opacity-100 bg-amber-500/80' : 'opacity-0 group-hover:opacity-100 bg-black/40 hover:bg-black/60'
        }`}>
        <Star className={`w-3 h-3 ${isStarred ? 'fill-white text-white' : 'text-white/80'}`} />
      </button>

      {/* Video badge */}
      {isVideo && (
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <span className="px-2 py-0.5 rounded-full text-[7.5px] font-bold tracking-widest bg-black/50" style={{ color: 'rgba(255,255,255,0.82)' }}>▶ VIDEO</span>
        </div>
      )}

      <ActionStrip onFork={onFork} asset={asset} />
      <BottomHUD name={asset.name} meta={`${asset.size} · ${asset.date}`} />
    </div>
  );
}

/* ── VersionTile — multi-version tile with dropdown pill ────────────────────── */

function VersionTile({
  groupKey, assets, activeIndex, onSetVersion,
  isSelected, onToggleSelect, isStarred, onToggleStar, onFork,
}: {
  groupKey: string; assets: Asset[]; activeIndex: number;
  onSetVersion: (key: string, idx: number) => void;
  isSelected: boolean; onToggleSelect: (n: string) => void;
  isStarred: boolean; onToggleStar: (n: string) => void;
  onFork: (a: Asset) => void;
}) {
  const [vOpen, setVOpen] = useState(false);
  const top = assets[activeIndex] ?? assets[0];
  const isVideo = !!top.videoSrc;

  return (
    <div className="group relative overflow-hidden cursor-pointer aspect-square bg-zinc-950">

      {isVideo ? (
        <AutoVideo src={top.videoSrc!} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <img src={top.src} alt={top.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      )}

      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 pointer-events-none" />
      {isSelected && <div className="absolute inset-0 ring-2 ring-orange-400 ring-inset pointer-events-none z-30" />}

      {/* Checkbox */}
      <button onClick={e => { e.stopPropagation(); onToggleSelect(top.name); }}
        className={`absolute top-2.5 left-2.5 z-20 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-150 cursor-pointer ${
          isSelected ? 'bg-orange-500 border-orange-500 opacity-100' : 'border-white/70 bg-black/30 opacity-0 group-hover:opacity-100'
        }`}>
        {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
      </button>

      {/* Version dropdown pill */}
      <div className="absolute top-2.5 right-2.5 z-30">
        <button onClick={e => { e.stopPropagation(); setVOpen(v => !v); }}
          className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9.5px] font-bold text-white cursor-pointer"
          style={{ background: P.vivid, boxShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
          v{assets.length} <ChevronDown className="w-2.5 h-2.5" />
        </button>

        {vOpen && (
          <div className="absolute top-full right-0 mt-1.5 z-50 rounded-xl overflow-hidden shadow-2xl"
            style={{ background: 'rgba(8,8,8,0.97)', border: '1px solid rgba(255,255,255,0.1)', minWidth: 150 }}>
            {assets.map((a, vi) => (
              <button key={vi}
                onClick={e => { e.stopPropagation(); onSetVersion(groupKey, vi); setVOpen(false); }}
                className="flex items-center gap-2.5 w-full px-3 py-2.5 text-[11px] transition-colors cursor-pointer hover:bg-white/8"
                style={{ background: activeIndex === vi ? 'rgba(255,255,255,0.12)' : undefined, color: activeIndex === vi ? '#fff' : 'rgba(255,255,255,0.72)' }}>
                <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0 border border-white/10">
                  <img src={a.src} alt="" className="w-full h-full object-cover" />
                </div>
                <span className="font-medium">Version {vi + 1}</span>
                {activeIndex === vi && <Check className="w-3 h-3 ml-auto" style={{ color: P.vivid }} />}
              </button>
            ))}
          </div>
        )}
      </div>

      <ActionStrip onFork={onFork} asset={top} />
      <BottomHUD name={top.name} meta={`${top.size} · ${assets.length} versions`} />
    </div>
  );
}

/* ── Main ──────────────────────────────────────────────────────────────────── */

export default function LibraryView() {
  const { isDark, T } = useTheme();
  const [tab,            setTab]            = useState('All');
  const [view,           setView]           = useState<'grid-sm' | 'grid' | 'grid-lg' | 'masonry' | 'list' | 'bundles'>('grid');
  const [q,              setQ]              = useState('');
  const [forked,         setForked]         = useState<string | null>(null);
  const [selectedNames,  setSelectedNames]  = useState<Set<string>>(new Set());
  const [starredNames,   setStarredNames]   = useState<Set<string>>(new Set());
  const [activeVersions, setActiveVersions] = useState<Record<string, number>>({});
  const [loading,        setLoading]        = useState(true);
  const [filterOpen,     setFilterOpen]     = useState(false);
  const [modelFilter,    setModelFilter]    = useState('All');
  const [sessionFilter,  setSessionFilter]  = useState('All');

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  const filtered = ASSETS.filter(a => {
    const typeMatch = tab === 'All' || tab === 'Uploads'
      || (tab === 'Images'    && a.type === 'Image')
      || (tab === 'Videos'    && a.type === 'Video')
      || (tab === 'Favorites' && starredNames.has(a.name));
    const queryMatch = !q || a.name.toLowerCase().includes(q.toLowerCase()) || a.prompt.toLowerCase().includes(q.toLowerCase());
    const modelMatch = modelFilter === 'All' || a.model === modelFilter;
    const sessionMatch = sessionFilter === 'All' || a.session === sessionFilter;
    return typeMatch && queryMatch && modelMatch && sessionMatch;
  });

  const handleFork    = (asset: Asset) => { setForked(asset.name); setTimeout(() => setForked(null), 2000); };
  const toggleSelect  = (name: string) => setSelectedNames(prev => { const s = new Set(prev); s.has(name) ? s.delete(name) : s.add(name); return s; });
  const toggleStar    = (name: string) => setStarredNames(prev => { const s = new Set(prev); s.has(name) ? s.delete(name) : s.add(name); return s; });
  const clearSelection = () => setSelectedNames(new Set());

  const seenKeys = new Set<string>();
  const groupedItems: Array<{ key?: string; assets: Asset[] }> = [];
  filtered.forEach(asset => {
    if (!asset.promptKey) {
      groupedItems.push({ assets: [asset] });
    } else if (!seenKeys.has(asset.promptKey)) {
      seenKeys.add(asset.promptKey);
      groupedItems.push({ key: asset.promptKey, assets: filtered.filter(a => a.promptKey === asset.promptKey) });
    }
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: T.bg }}>

      {/* Fork toast */}
      {forked && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-[12px] font-semibold shadow-lg"
          style={{ background: P.vivid }}>
          <GitFork className="w-3.5 h-3.5" />Remixing {forked} — settings copied to workspace
        </div>
      )}

      {/* Floating batch action bar */}
      {selectedNames.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl"
          style={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.1)' }}>
          <span className="text-[12px] font-semibold" style={{ color: 'rgba(255,255,255,0.82)' }}>{selectedNames.size} selected</span>
          <div className="w-px h-5 bg-white/20" />
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-white bg-white/10 hover:bg-white/20 cursor-pointer transition-colors">
            <Download className="w-3 h-3" />Bulk Download
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-white bg-white/10 hover:bg-white/20 cursor-pointer transition-colors">
            <FolderOpen className="w-3 h-3" />Assign to Space
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-white bg-red-500/80 hover:bg-red-500 cursor-pointer transition-colors">
            <Trash2 className="w-3 h-3" />Delete Selected
          </button>
          <button onClick={clearSelection} className="p-1.5 rounded-lg cursor-pointer transition-colors" style={{ color: 'rgba(255,255,255,0.65)' }}>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="px-8 py-5 flex items-center gap-3 shrink-0" style={{ borderBottom: `1px solid ${T.border}` }}>
        <h1 className="text-[16px] font-bold" style={{ color: T.text }}>Library</h1>
        <div className="flex-1" />
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl w-52" style={{ background: T.inputBg, border: `1px solid ${T.border}` }}>
          <Search className="w-3.5 h-3.5 shrink-0" style={{ color: T.textMuted }} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search assets..."
            className="flex-1 text-[12px] outline-none bg-transparent"
            style={{ color: T.text }} />
        </div>

        {/* Filter button */}
        <div className="relative">
          <button onClick={() => setFilterOpen(v => !v)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11.5px] font-medium transition-colors cursor-pointer"
            style={{
              background: (modelFilter !== 'All' || sessionFilter !== 'All') ? P.vivid : T.bgCard,
              color: (modelFilter !== 'All' || sessionFilter !== 'All') ? '#fff' : T.textSub,
              border: `1px solid ${(modelFilter !== 'All' || sessionFilter !== 'All') ? P.vivid : T.border}`,
            }}>
            <SlidersHorizontal className="w-3.5 h-3.5" />Filter
            {(modelFilter !== 'All' || sessionFilter !== 'All') && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
          </button>
          {filterOpen && (
            <div className="absolute right-0 top-full mt-1.5 z-50 w-72 rounded-2xl shadow-xl p-4 space-y-4"
              style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: T.textMuted }}>Model</p>
                <div className="flex flex-wrap gap-1.5">
                  {['All', 'Seedance 2.0', 'AI Video v2', 'Portrait Ultra', 'Landscape Pro', 'Product Studio'].map(m => (
                    <button key={m} onClick={() => setModelFilter(m)}
                      className="px-2.5 py-1 rounded-full text-[10.5px] font-medium cursor-pointer transition-all"
                      style={modelFilter === m ? { background: P.vivid, color: '#fff' } : { background: T.bgCard, color: T.textSub, border: `1px solid ${T.border}` }}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: T.textMuted }}>Session</p>
                <div className="flex flex-wrap gap-1.5">
                  {['All', ...SESSIONS].map(s => (
                    <button key={s} onClick={() => setSessionFilter(s)}
                      className="px-2.5 py-1 rounded-full text-[10.5px] font-medium cursor-pointer transition-all"
                      style={sessionFilter === s ? { background: P.vivid, color: '#fff' } : { background: T.bgCard, color: T.textSub, border: `1px solid ${T.border}` }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => { setModelFilter('All'); setSessionFilter('All'); setFilterOpen(false); }}
                className="w-full py-1.5 rounded-xl text-[11px] font-semibold cursor-pointer transition-colors"
                style={{ background: T.bgCard, color: T.textMuted, border: `1px solid ${T.border}` }}>
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* View mode */}
        <div className="flex items-center gap-0.5 rounded-lg p-0.5" style={{ background: T.bgCard }}>
          {([
            ['grid-sm', Grid3X3, 'Small grid'],
            ['grid', LayoutGrid, 'Medium grid'],
            ['masonry', Columns, 'Masonry'],
            ['list', List, 'List'],
            ['bundles', Layers, 'Bundles'],
          ] as const).map(([v, Icon, title]) => (
            <button key={v} onClick={() => setView(v as typeof view)} title={title}
              className="p-1.5 rounded-md transition-colors cursor-pointer"
              style={view === v ? { background: T.bg, boxShadow: '0 1px 2px rgba(0,0,0,0.1)' } : {}}>
              <Icon className="w-3.5 h-3.5" style={{ color: T.textSub }} />
            </button>
          ))}
        </div>

        <button className="flex items-center gap-1.5 px-4 py-2.5 text-white text-[12px] font-semibold rounded-xl transition-colors cursor-pointer hover:opacity-90"
          style={{ background: P.vivid }}>
          <Upload className="w-3.5 h-3.5" />Upload
        </button>
      </div>

      {/* Tab bar */}
      <div className="px-8 flex items-center gap-1 shrink-0" style={{ borderBottom: `1px solid ${T.border}` }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-3 text-[12.5px] font-medium border-b-2 transition-all cursor-pointer -mb-px`}
            style={tab === t
              ? { color: T.text, borderColor: '#f97316' }
              : { color: T.textMuted, borderColor: 'transparent' }}>
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">

        {loading ? (
          <div className="grid grid-cols-5 gap-px" style={{ background: '#111' }}>
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="aspect-square bg-zinc-900 relative overflow-hidden"
                style={{ animationDelay: `${i * 55}ms` }}>
                <div className="absolute inset-0 animate-pulse bg-zinc-800" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent" />
              </div>
            ))}
          </div>

        ) : filtered.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-5 min-h-[320px] px-8">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center" style={{ background: T.bgCard }}>
              <Film className="w-8 h-8" style={{ color: T.textMuted }} />
            </div>
            <div className="text-center">
              <p className="text-[16px] font-bold" style={{ color: T.text }}>Your creations live here</p>
              <p className="text-[12.5px] mt-1.5 max-w-xs leading-relaxed" style={{ color: T.textMuted }}>
                Generate images and videos to build your library, or upload existing media.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1.5 px-5 py-2.5 text-white text-[12px] font-bold rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
                style={{ background: P.vivid }}>
                <Zap className="w-3.5 h-3.5" />Start Generating
              </button>
              <button className="flex items-center gap-1.5 px-5 py-2.5 text-[12px] font-bold rounded-xl transition-colors cursor-pointer"
                style={{ background: T.bgCard, color: T.textSub }}>
                <Upload className="w-3.5 h-3.5" />Upload files
              </button>
            </div>
          </div>

        ) : view === 'bundles' ? (
          <div className="px-8 py-6 space-y-8">
            {SESSIONS.map(session => {
              const sessionAssets = filtered.filter(a => a.session === session);
              if (!sessionAssets.length) return null;
              return (
                <div key={session}>
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <Layers className="w-3.5 h-3.5" style={{ color: P.orange }} />
                    <h3 className="text-[13px] font-bold" style={{ color: T.text }}>{session}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ color: T.textMuted, background: T.bgCard }}>{sessionAssets.length} assets</span>
                    <div className="flex-1 h-px ml-2" style={{ background: T.border }} />
                    <button className="flex items-center gap-1 text-[11px] font-medium cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ color: P.vivid }}>
                      <GitFork className="w-3 h-3" />Fork session
                    </button>
                  </div>
                  <div className="grid grid-cols-6 gap-px overflow-hidden rounded-xl" style={{ background: '#111' }}>
                    {sessionAssets.map((a, i) => (
                      <MediaTile key={i} asset={a}
                        isSelected={selectedNames.has(a.name)} isStarred={starredNames.has(a.name)}
                        onFork={handleFork} onToggleSelect={toggleSelect} onToggleStar={toggleStar} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

        ) : view === 'masonry' ? (
          <div style={{ columnCount: 4, columnGap: 0, background: '#111' }}>
            {groupedItems.map((group, gi) => {
              const a = group.assets.length === 1 ? group.assets[0] : (group.assets[activeVersions[group.key!] ?? 0] ?? group.assets[0]);
              return (
                <div key={gi} style={{ breakInside: 'avoid', marginBottom: 1, display: 'block' }}>
                  <MediaTile asset={a}
                    isSelected={selectedNames.has(a.name)} isStarred={starredNames.has(a.name)}
                    onFork={handleFork} onToggleSelect={toggleSelect} onToggleStar={toggleStar} />
                </div>
              );
            })}
          </div>
        ) : view === 'grid-sm' || view === 'grid' || view === 'grid-lg' ? (
          <div className="grid gap-px"
            style={{ background: '#111', gridTemplateColumns: view === 'grid-sm' ? 'repeat(6,1fr)' : view === 'grid-lg' ? 'repeat(3,1fr)' : 'repeat(5,1fr)' }}>
            {groupedItems.map((group, gi) => {
              if (group.assets.length === 1) {
                const a = group.assets[0];
                return (
                  <MediaTile key={gi} asset={a}
                    isSelected={selectedNames.has(a.name)} isStarred={starredNames.has(a.name)}
                    onFork={handleFork} onToggleSelect={toggleSelect} onToggleStar={toggleStar} />
                );
              }
              const key = group.key!;
              const activeIdx = activeVersions[key] ?? 0;
              const topAsset = group.assets[activeIdx] ?? group.assets[0];
              return (
                <VersionTile key={gi}
                  groupKey={key} assets={group.assets} activeIndex={activeIdx}
                  onSetVersion={(k, idx) => setActiveVersions(prev => ({ ...prev, [k]: idx }))}
                  isSelected={selectedNames.has(topAsset.name)} isStarred={starredNames.has(topAsset.name)}
                  onToggleSelect={toggleSelect} onToggleStar={toggleStar} onFork={handleFork} />
              );
            })}
          </div>

        ) : (
          <div style={{ borderTop: `1px solid ${T.border}` }}>
            <div className="grid px-6 py-3 text-[10px] font-semibold uppercase tracking-widest"
              style={{ gridTemplateColumns: '3fr 1fr 1fr 1fr 100px', color: T.textMuted, background: T.bgSub, borderBottom: `1px solid ${T.border}` }}>
              <span>Name</span><span>Type</span><span>Size</span><span>Modified</span><span>Actions</span>
            </div>
            {filtered.map((a, i) => (
              <div key={i} className="group grid items-center px-6 py-3.5 transition-colors cursor-pointer"
                style={{ gridTemplateColumns: '3fr 1fr 1fr 1fr 100px', borderBottom: `1px solid ${T.borderMuted}` }}
                onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-8 rounded-lg overflow-hidden shrink-0 bg-zinc-900 relative">
                    <img src={a.src} alt="" className="w-full h-full object-cover" />
                    {a.videoSrc && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-black/60 flex items-center justify-center">
                          <span className="text-[8px] text-white">▶</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="text-[12.5px] font-medium block truncate" style={{ color: T.text }}>{a.name}</span>
                    <span className="text-[10px] font-mono" style={{ color: T.textMuted }}>{a.model} · #{a.seed.slice(0, 6)}</span>
                  </div>
                </div>
                <span className="text-[12px]" style={{ color: T.textSub }}>{a.type}</span>
                <span className="text-[12px]" style={{ color: T.textSub }}>{a.size}</span>
                <span className="text-[12px]" style={{ color: T.textSub }}>{a.date}</span>
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleFork(a)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold text-white cursor-pointer hover:opacity-90"
                    style={{ background: P.vivid }}>
                    <GitFork className="w-3 h-3" />Fork
                  </button>
                  <button onClick={() => toggleStar(a.name)}
                    className={`p-1.5 rounded-lg cursor-pointer transition-colors ${starredNames.has(a.name) ? 'text-amber-500' : ''}`}
                    style={!starredNames.has(a.name) ? { color: T.textMuted } : {}}>
                    <Star className={`w-4 h-4 ${starredNames.has(a.name) ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-1.5 cursor-pointer" style={{ color: T.textMuted }}>
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
