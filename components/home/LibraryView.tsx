'use client';

import React, { useState } from 'react';
import {
  Upload, Grid3X3, List, Search, MoreHorizontal, GitFork, Layers,
  Star, Check, Download, FolderOpen, Trash2, X, Zap, Film,
} from 'lucide-react';

const P = { vivid: '#FF7000', orange: '#FFB347', magenta: '#F060EE', peach: '#FFBF80', coral: '#FF6B86', rose: '#e11d48' };

const TABS = ['All', 'Images', 'Videos', 'Uploads', 'Favorites'];

interface Asset {
  src: string; name: string; size: string; type: string; date: string;
  prompt: string; model: string; seed: string; session: string;
  promptKey?: string;
}

const ASSETS: Asset[] = [
  { src: '/pexels-didsss-2791056.jpg',         name: 'portrait_enhanced.jpg',   size: '4.2 MB',  type: 'Image', date: 'Today',      prompt: 'cinematic portrait, golden hour, 35mm grain',       model: 'Portrait Ultra', seed: '4829301', session: 'Brand Campaign — June',  promptKey: 'portrait-golden' },
  { src: '/pexels-ganajp-15698413.jpg',         name: 'portrait_v2.jpg',         size: '4.1 MB',  type: 'Image', date: 'Today',      prompt: 'cinematic portrait, golden hour, 35mm grain',       model: 'Portrait Ultra', seed: '4829402', session: 'Brand Campaign — June',  promptKey: 'portrait-golden' },
  { src: '/pexels-olga-178200755-12367292.jpg', name: 'portrait_v3.jpg',         size: '4.3 MB',  type: 'Image', date: 'Today',      prompt: 'cinematic portrait, golden hour, 35mm grain',       model: 'Portrait Ultra', seed: '4829503', session: 'Brand Campaign — June',  promptKey: 'portrait-golden' },
  { src: '/pexels-prathsnap-3168209.jpg',       name: 'colorized_portrait.jpg',  size: '5.6 MB',  type: 'Image', date: 'Yesterday',  prompt: 'neon cyberpunk portrait, vivid tones',              model: 'Turbo v2',      seed: '1029384', session: 'Product Shoot Q2' },
  { src: '/pexels-didsss-2791056.jpg',          name: 'social_reel_01.jpg',      size: '3.1 MB',  type: 'Image', date: '3 days ago', prompt: 'city nightscape, bokeh lights, cinematic',          model: 'Landscape Pro',  seed: '5571293', session: 'Social Reel Pack',       promptKey: 'city-nightscape' },
  { src: '/pexels-ganajp-15698413.jpg',         name: 'social_reel_02.jpg',      size: '8.4 MB',  type: 'Image', date: '3 days ago', prompt: 'city nightscape, bokeh lights, cinematic',          model: 'Landscape Pro',  seed: '5571394', session: 'Social Reel Pack',       promptKey: 'city-nightscape' },
  { src: '/pexels-olga-178200755-12367292.jpg', name: 'upscale_4k_result.jpg',   size: '18.2 MB', type: 'Image', date: '1 week ago', prompt: 'portrait retouching, natural skin, studio',         model: 'Portrait Ultra', seed: '3847561', session: 'Client Delivery #4' },
  { src: '/pexels-prathsnap-3168209.jpg',       name: 'denoise_output.png',      size: '4.9 MB',  type: 'Image', date: '1 week ago', prompt: 'mountain landscape, golden hour, 8K native',       model: 'Landscape Pro',  seed: '6629018', session: 'Client Delivery #4' },
];

const SESSIONS = [...new Set(ASSETS.map(a => a.session))];

/* ── AssetCard — quick-actions overlay + checkbox ─────────────────────────── */

function AssetCard({
  asset,
  isSelected, isStarred,
  onFork, onToggleSelect, onToggleStar,
}: {
  asset: Asset;
  isSelected: boolean; isStarred: boolean;
  onFork: (a: Asset) => void;
  onToggleSelect: (name: string) => void;
  onToggleStar: (name: string) => void;
}) {
  return (
    <div className="group cursor-pointer">
      <div className={`relative aspect-square rounded-2xl overflow-hidden bg-zinc-100 border transition-colors mb-2 ${isSelected ? 'border-orange-400 ring-2 ring-orange-400/30' : 'border-zinc-200 hover:border-zinc-300'}`}>
        <img src={asset.src} alt={asset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

        {/* Hover/selected dim */}
        <div className={`absolute inset-0 transition-colors ${isSelected ? 'bg-orange-500/10' : 'bg-black/0 group-hover:bg-black/40'}`} />

        {/* Checkbox — top left, always visible when selected, hover-visible otherwise */}
        <button
          onClick={e => { e.stopPropagation(); onToggleSelect(asset.name); }}
          className={`absolute top-2 left-2 z-20 w-5 h-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${
            isSelected ? 'bg-orange-500 border-orange-500 opacity-100' : 'border-white/70 bg-black/30 opacity-0 group-hover:opacity-100'
          }`}>
          {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
        </button>

        {/* Star — top right, hover-visible */}
        <button
          onClick={e => { e.stopPropagation(); onToggleStar(asset.name); }}
          className={`absolute top-2 right-2 z-20 p-1.5 rounded-lg transition-all cursor-pointer ${
            isStarred ? 'opacity-100 bg-amber-500/80' : 'opacity-0 group-hover:opacity-100 bg-black/40 hover:bg-black/60'
          }`}>
          <Star className={`w-3 h-3 ${isStarred ? 'fill-white text-white' : 'text-white/80'}`} />
        </button>

        {/* Hover overlay — quick actions + fork */}
        <div className="absolute inset-0 flex flex-col justify-end p-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <div>
            <p className="text-[8.5px] text-white/70 leading-snug line-clamp-2 mb-1.5">{asset.prompt}</p>
            <div className="grid grid-cols-2 gap-1 mb-1.5">
              <button onClick={e => e.stopPropagation()}
                className="py-1 rounded-lg text-[9px] font-bold bg-white/15 hover:bg-white/25 text-white cursor-pointer transition-colors flex items-center justify-center gap-1">
                <Zap className="w-2.5 h-2.5" />Upscale
              </button>
              <button onClick={e => e.stopPropagation()}
                className="py-1 rounded-lg text-[9px] font-bold bg-white/15 hover:bg-white/25 text-white cursor-pointer transition-colors flex items-center justify-center gap-1">
                <Film className="w-2.5 h-2.5" />Animate
              </button>
            </div>
            <button onClick={e => { e.stopPropagation(); onFork(asset); }}
              className="w-full py-1.5 rounded-lg text-[10px] font-bold text-white flex items-center justify-center gap-1 cursor-pointer hover:opacity-90 transition-all"
              style={{ background: P.vivid }}>
              <GitFork className="w-3 h-3" />Fork & Remix
            </button>
          </div>
        </div>
      </div>
      <p className="text-[11.5px] font-medium text-zinc-800 truncate">{asset.name}</p>
      <p className="text-[10.5px] text-zinc-400">{asset.size} · {asset.date}</p>
    </div>
  );
}

/* ── VersionStackCard — stacked card with version badge + carousel ────────── */

function VersionStackCard({
  groupKey, assets,
  isExpanded, activeIndex,
  onExpand, onSetVersion,
  isSelected, onToggleSelect,
  isStarred, onToggleStar,
  onFork,
}: {
  groupKey: string; assets: Asset[];
  isExpanded: boolean; activeIndex: number;
  onExpand: (key: string | null) => void;
  onSetVersion: (key: string, idx: number) => void;
  isSelected: boolean; onToggleSelect: (name: string) => void;
  isStarred: boolean; onToggleStar: (name: string) => void;
  onFork: (a: Asset) => void;
}) {
  const top = assets[activeIndex] || assets[0];

  return (
    <div className="group cursor-pointer">
      <div className={`relative aspect-square rounded-2xl overflow-hidden bg-zinc-100 border transition-colors mb-2 ${isSelected ? 'border-orange-400 ring-2 ring-orange-400/30' : 'border-zinc-200 hover:border-zinc-300'}`}>

        {/* Stack depth shadows */}
        {assets.length >= 3 && (
          <div className="absolute inset-0 rounded-2xl bg-zinc-300 -z-20" style={{ transform: 'translateX(5px) translateY(5px)' }} />
        )}
        {assets.length >= 2 && (
          <div className="absolute inset-0 rounded-2xl bg-zinc-200 -z-10" style={{ transform: 'translateX(3px) translateY(3px)' }} />
        )}

        <img src={top.src} alt={top.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className={`absolute inset-0 transition-colors ${isSelected ? 'bg-orange-500/10' : 'bg-black/0 group-hover:bg-black/40'}`} />

        {/* Checkbox */}
        <button
          onClick={e => { e.stopPropagation(); onToggleSelect(top.name); }}
          className={`absolute top-2 left-2 z-20 w-5 h-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${
            isSelected ? 'bg-orange-500 border-orange-500 opacity-100' : 'border-white/70 bg-black/30 opacity-0 group-hover:opacity-100'
          }`}>
          {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
        </button>

        {/* Version badge — top right */}
        <button
          onClick={e => { e.stopPropagation(); onExpand(isExpanded ? null : groupKey); }}
          className="absolute top-2 right-2 z-20 px-2 py-0.5 rounded-full text-[10px] font-bold text-white cursor-pointer hover:opacity-90 transition-opacity"
          style={{ background: P.vivid }}>
          v{assets.length}
        </button>

        {/* Hover quick actions */}
        <div className="absolute inset-0 flex flex-col justify-end p-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <div>
            <p className="text-[8.5px] text-white/70 leading-snug line-clamp-2 mb-1.5">{top.prompt}</p>
            <div className="grid grid-cols-2 gap-1 mb-1.5">
              <button onClick={e => e.stopPropagation()}
                className="py-1 rounded-lg text-[9px] font-bold bg-white/15 hover:bg-white/25 text-white cursor-pointer transition-colors flex items-center justify-center gap-1">
                <Zap className="w-2.5 h-2.5" />Upscale
              </button>
              <button onClick={e => e.stopPropagation()}
                className="py-1 rounded-lg text-[9px] font-bold bg-white/15 hover:bg-white/25 text-white cursor-pointer transition-colors flex items-center justify-center gap-1">
                <Film className="w-2.5 h-2.5" />Animate
              </button>
            </div>
            <button onClick={e => { e.stopPropagation(); onFork(top); }}
              className="w-full py-1.5 rounded-lg text-[10px] font-bold text-white flex items-center justify-center gap-1 cursor-pointer hover:opacity-90 transition-all"
              style={{ background: P.vivid }}>
              <GitFork className="w-3 h-3" />Fork & Remix
            </button>
          </div>
        </div>

        {/* Version carousel — slides up when expanded */}
        {isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 z-30 flex gap-1.5 p-2 overflow-x-auto"
            style={{ background: 'rgba(0,0,0,0.82)', scrollbarWidth: 'none' }}>
            {assets.map((a, vi) => (
              <button key={vi}
                onClick={e => { e.stopPropagation(); onSetVersion(groupKey, vi); }}
                className={`shrink-0 w-11 h-11 rounded-xl overflow-hidden border-2 cursor-pointer transition-colors ${activeIndex === vi ? 'border-white' : 'border-transparent hover:border-white/40'}`}>
                <img src={a.src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
      <p className="text-[11.5px] font-medium text-zinc-800 truncate">{top.name}</p>
      <p className="text-[10.5px] text-zinc-400">{top.size} · {assets.length} versions</p>
    </div>
  );
}

/* ── Main ──────────────────────────────────────────────────────────────────── */

export default function LibraryView() {
  const [tab,            setTab]            = useState('All');
  const [view,           setView]           = useState<'grid' | 'list' | 'bundles'>('grid');
  const [q,              setQ]              = useState('');
  const [forked,         setForked]         = useState<string | null>(null);
  const [selectedNames,  setSelectedNames]  = useState<Set<string>>(new Set());
  const [starredNames,   setStarredNames]   = useState<Set<string>>(new Set());
  const [expandedStack,  setExpandedStack]  = useState<string | null>(null);
  const [activeVersions, setActiveVersions] = useState<Record<string, number>>({});

  const filtered = ASSETS.filter(a =>
    (tab === 'All' || a.type === tab || tab === 'Uploads') &&
    (!q || a.name.toLowerCase().includes(q.toLowerCase()))
  );

  const handleFork = (asset: Asset) => {
    setForked(asset.name);
    setTimeout(() => setForked(null), 2000);
  };

  const toggleSelect = (name: string) =>
    setSelectedNames(prev => { const s = new Set(prev); s.has(name) ? s.delete(name) : s.add(name); return s; });

  const toggleStar = (name: string) =>
    setStarredNames(prev => { const s = new Set(prev); s.has(name) ? s.delete(name) : s.add(name); return s; });

  const clearSelection = () => setSelectedNames(new Set());

  // Build grouped items for grid view
  const seenKeys = new Set<string>();
  const groupedItems: Array<{ key?: string; assets: Asset[] }> = [];
  filtered.forEach(asset => {
    if (!asset.promptKey) {
      groupedItems.push({ assets: [asset] });
    } else if (!seenKeys.has(asset.promptKey)) {
      seenKeys.add(asset.promptKey);
      const group = filtered.filter(a => a.promptKey === asset.promptKey);
      groupedItems.push({ key: asset.promptKey, assets: group });
    }
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">

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
          <span className="text-[12px] font-semibold text-white/70">{selectedNames.size} selected</span>
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
          <button onClick={clearSelection} className="p-1.5 rounded-lg text-white/40 hover:text-white cursor-pointer transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-zinc-100 px-8 py-5 flex items-center gap-4 shrink-0">
        <h1 className="text-[16px] font-bold text-zinc-900">Library</h1>
        <div className="flex-1" />
        <div className="flex items-center gap-2 px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl w-56">
          <Search className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search assets..."
            className="flex-1 text-[12px] outline-none bg-transparent text-zinc-700 placeholder-zinc-400" />
        </div>
        <div className="flex items-center gap-0.5 bg-zinc-100 rounded-lg p-0.5">
          <button onClick={() => setView('grid')}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${view === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-zinc-200'}`}>
            <Grid3X3 className="w-3.5 h-3.5 text-zinc-600" />
          </button>
          <button onClick={() => setView('list')}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${view === 'list' ? 'bg-white shadow-sm' : 'hover:bg-zinc-200'}`}>
            <List className="w-3.5 h-3.5 text-zinc-600" />
          </button>
          <button onClick={() => setView('bundles')} title="Bundles"
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${view === 'bundles' ? 'bg-white shadow-sm' : 'hover:bg-zinc-200'}`}>
            <Layers className="w-3.5 h-3.5 text-zinc-600" />
          </button>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2.5 text-white text-[12px] font-semibold rounded-xl transition-colors cursor-pointer hover:opacity-90"
          style={{ background: P.vivid }}>
          <Upload className="w-3.5 h-3.5" />Upload
        </button>
      </div>

      {/* Tab bar */}
      <div className="border-b border-zinc-100 px-8 flex items-center gap-1 shrink-0">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-3 text-[12.5px] font-medium border-b-2 transition-all cursor-pointer -mb-px ${
              tab === t ? 'text-zinc-900 border-orange-400' : 'text-zinc-400 border-transparent hover:text-zinc-700'
            }`}>
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {filtered.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-5 min-h-[200px]">
            <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center">
              <Upload className="w-7 h-7 text-zinc-300" />
            </div>
            <div className="text-center">
              <p className="text-[15px] font-semibold text-zinc-700">Nothing here yet</p>
              <p className="text-[12px] text-zinc-400 mt-1">Upload images or generate content to fill your library</p>
            </div>
            <button className="flex items-center gap-1.5 px-5 py-2.5 text-white text-[12px] font-bold rounded-xl hover:opacity-90 transition-colors cursor-pointer"
              style={{ background: P.vivid }}>
              <Upload className="w-3.5 h-3.5" />Upload files
            </button>
          </div>

        ) : view === 'bundles' ? (
          <div className="space-y-8">
            {SESSIONS.map(session => {
              const sessionAssets = filtered.filter(a => a.session === session);
              if (!sessionAssets.length) return null;
              return (
                <div key={session}>
                  <div className="flex items-center gap-2.5 mb-3">
                    <Layers className="w-3.5 h-3.5" style={{ color: P.orange }} />
                    <h3 className="text-[13px] font-bold text-zinc-900">{session}</h3>
                    <span className="text-[10px] text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">{sessionAssets.length} assets</span>
                    <div className="flex-1 h-px bg-zinc-100 ml-2" />
                    <button className="flex items-center gap-1 text-[11px] font-medium cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ color: P.vivid }}>
                      <GitFork className="w-3 h-3" />Fork session
                    </button>
                  </div>
                  <div className="grid grid-cols-5 gap-3">
                    {sessionAssets.map((a, i) => (
                      <AssetCard key={i} asset={a}
                        isSelected={selectedNames.has(a.name)} isStarred={starredNames.has(a.name)}
                        onFork={handleFork} onToggleSelect={toggleSelect} onToggleStar={toggleStar} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

        ) : view === 'grid' ? (
          <div className="grid grid-cols-5 gap-4">
            {groupedItems.map((group, gi) => {
              if (group.assets.length === 1) {
                const a = group.assets[0];
                return (
                  <AssetCard key={gi} asset={a}
                    isSelected={selectedNames.has(a.name)} isStarred={starredNames.has(a.name)}
                    onFork={handleFork} onToggleSelect={toggleSelect} onToggleStar={toggleStar} />
                );
              }
              const key = group.key!;
              const activeIdx = activeVersions[key] ?? 0;
              const topAsset = group.assets[activeIdx] || group.assets[0];
              return (
                <VersionStackCard key={gi}
                  groupKey={key} assets={group.assets}
                  isExpanded={expandedStack === key} activeIndex={activeIdx}
                  onExpand={setExpandedStack}
                  onSetVersion={(k, idx) => setActiveVersions(prev => ({ ...prev, [k]: idx }))}
                  isSelected={selectedNames.has(topAsset.name)} isStarred={starredNames.has(topAsset.name)}
                  onToggleSelect={toggleSelect} onToggleStar={toggleStar}
                  onFork={handleFork} />
              );
            })}
          </div>

        ) : (
          <div className="border border-zinc-200 rounded-2xl overflow-hidden divide-y divide-zinc-100">
            <div className="grid px-5 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-400 bg-zinc-50"
              style={{ gridTemplateColumns: '3fr 1fr 1fr 1fr 100px' }}>
              <span>Name</span><span>Type</span><span>Size</span><span>Modified</span><span>Actions</span>
            </div>
            {filtered.map((a, i) => (
              <div key={i} className="group grid items-center px-5 py-3.5 hover:bg-zinc-50 transition-colors cursor-pointer"
                style={{ gridTemplateColumns: '3fr 1fr 1fr 1fr 100px' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-8 rounded-lg overflow-hidden shrink-0">
                    <img src={a.src} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[12.5px] font-medium text-zinc-900 block truncate">{a.name}</span>
                    <span className="text-[10px] text-zinc-400 font-mono">{a.model} · #{a.seed.slice(0, 6)}</span>
                  </div>
                </div>
                <span className="text-[12px] text-zinc-500">{a.type}</span>
                <span className="text-[12px] text-zinc-500">{a.size}</span>
                <span className="text-[12px] text-zinc-500">{a.date}</span>
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleFork(a)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold text-white cursor-pointer hover:opacity-90"
                    style={{ background: P.vivid }}>
                    <GitFork className="w-3 h-3" />Fork
                  </button>
                  <button onClick={() => toggleStar(a.name)}
                    className={`p-1.5 rounded-lg cursor-pointer transition-colors ${starredNames.has(a.name) ? 'text-amber-500' : 'text-zinc-400 hover:text-zinc-700'}`}>
                    <Star className={`w-4 h-4 ${starredNames.has(a.name) ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-1.5 text-zinc-400 hover:text-zinc-700 cursor-pointer">
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
