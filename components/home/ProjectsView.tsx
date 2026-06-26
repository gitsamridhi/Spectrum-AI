'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Plus, Search, Grid3X3, List, MoreHorizontal, Lock, ArrowRight, X, SlidersHorizontal, LayoutGrid, Columns } from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

const HF = 'https://static.higgsfield.ai';

const PROJECTS = [
  {
    id: 'personal',
    name: 'Personal',
    color: 'bg-zinc-900',
    initials: 'P',
    count: 12,
    updated: 'Today',
    locked: true,
    items: [
      { videoSrc: `${HF}/ai-video-v2/example-2-mini.mp4`,      label: 'Portrait enhance',  date: 'Today' },
      { videoSrc: `${HF}/seedance-2.0-v2/examples/1-mini.mp4`, label: 'Landscape 8×',     date: 'Yesterday' },
      { videoSrc: `${HF}/ai-video-v2/example-4-mini.mp4`,      label: 'Product clean-up', date: '2 days ago' },
      { videoSrc: `${HF}/seedance-2.0-v2/examples/5-mini.mp4`, label: 'Colorize batch',   date: '3 days ago' },
    ],
  },
  {
    id: 'team',
    name: 'Team project',
    color: 'bg-zinc-300',
    initials: 'T',
    count: 0,
    updated: '—',
    locked: true,
    upgrade: true,
    items: [],
  },
];

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

type ViewMode = 'grid-sm' | 'grid' | 'grid-lg' | 'masonry' | 'list';

export default function ProjectsView() {
  const { isDark, T } = useTheme();
  const [selected,      setSelected]      = useState('personal');
  const [view,          setView]          = useState<ViewMode>('grid');
  const [query,         setQuery]         = useState('');
  const [showNewModal,  setShowNewModal]  = useState(false);
  const [newName,       setNewName]       = useState('');
  const [filterOpen,    setFilterOpen]    = useState(false);
  const [typeFilter,    setTypeFilter]    = useState('All');
  const [dateFilter,    setDateFilter]    = useState('all');

  const project = PROJECTS.find(p => p.id === selected)!;
  const filtered = project.items.filter(i =>
    !query || i.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex-1 flex overflow-hidden" style={{ background: T.bg }}>

      {/* Left — project list panel */}
      <div className="w-64 shrink-0 flex flex-col" style={{ borderRight: `1px solid ${T.border}`, background: T.bgSub }}>
        <div className="px-4 pt-5 pb-3" style={{ borderBottom: `1px solid ${T.border}` }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[13px] font-bold" style={{ color: T.text }}>Projects</h2>
            <button className="flex items-center gap-1 text-[10px] font-medium transition-colors cursor-pointer" style={{ color: T.textMuted }}>
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <button onClick={() => { setNewName(''); setShowNewModal(true); }}
            className="w-full flex items-center gap-2.5 py-2.5 px-3 bg-orange-700 hover:bg-orange-800 text-white text-[12px] font-semibold rounded-xl transition-colors cursor-pointer">
            <Plus className="w-3.5 h-3.5" />
            New project
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {PROJECTS.map(p => (
            <button key={p.id} onClick={() => setSelected(p.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all cursor-pointer`}
              style={selected === p.id
                ? { background: T.bg, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: `1px solid ${T.border}` }
                : { border: '1px solid transparent' }}
            >
              <div className={`w-8 h-8 rounded-lg ${p.color} flex items-center justify-center shrink-0`}>
                <span className={`text-[10px] font-bold ${p.color === 'bg-zinc-900' ? 'text-white' : 'text-zinc-600'}`}>
                  {p.initials}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12.5px] font-semibold truncate" style={{ color: T.text }}>{p.name}</p>
                <p className="text-[10.5px]" style={{ color: T.textMuted }}>{p.count} items · {p.updated}</p>
              </div>
              {p.upgrade && (
                <span className="text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-full" style={{ color: T.textSub, background: T.bgCard }}>
                  Upgrade
                </span>
              )}
              {p.locked && !p.upgrade && <Lock className="w-3 h-3 shrink-0" style={{ color: T.textMuted }} />}
            </button>
          ))}
        </div>
      </div>

      {/* New Project Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="w-[360px] rounded-2xl p-6 shadow-2xl" style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[15px] font-bold" style={{ color: T.text }}>New Project</h3>
              <button onClick={() => setShowNewModal(false)}
                className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors cursor-pointer"
                style={{ color: T.textMuted }}
                onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <label className="block text-[11px] font-semibold mb-1.5" style={{ color: T.textSub }}>Project name</label>
            <input
              autoFocus
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && newName.trim()) setShowNewModal(false); }}
              placeholder="Untitled project"
              className="w-full px-3 py-2.5 rounded-xl text-[13px] outline-none mb-5"
              style={{ background: T.inputBg, border: `1px solid ${T.border}`, color: T.text }}
            />
            <div className="flex gap-2">
              <button onClick={() => setShowNewModal(false)}
                className="flex-1 py-2.5 rounded-xl text-[12px] font-semibold transition-colors cursor-pointer"
                style={{ background: T.bgCard, color: T.textSub, border: `1px solid ${T.border}` }}>
                Cancel
              </button>
              <button
                onClick={() => { if (newName.trim()) setShowNewModal(false); }}
                className="flex-1 py-2.5 rounded-xl text-[12px] font-semibold transition-colors cursor-pointer bg-orange-700 hover:bg-orange-800 text-white"
                style={{ opacity: newName.trim() ? 1 : 0.5 }}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Right — project contents */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Toolbar */}
        <div className="h-14 flex items-center px-6 gap-4 shrink-0" style={{ borderBottom: `1px solid ${T.border}` }}>
          <div className="flex items-center gap-2 flex-1">
            <div className={`w-7 h-7 rounded-lg ${project.color} flex items-center justify-center shrink-0`}>
              <span className={`text-[9px] font-bold ${project.color === 'bg-zinc-900' ? 'text-white' : 'text-zinc-600'}`}>
                {project.initials}
              </span>
            </div>
            <h1 className="text-[14px] font-bold" style={{ color: T.text }}>{project.name}</h1>
            <span className="text-[11px]" style={{ color: T.textMuted }}>{project.items.length} items</span>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl w-52" style={{ background: T.inputBg, border: `1px solid ${T.border}` }}>
            <Search className="w-3.5 h-3.5 shrink-0" style={{ color: T.textMuted }} />
            <input value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search..." className="flex-1 text-[12px] outline-none bg-transparent"
              style={{ color: T.text }} />
          </div>

          {/* Filter button */}
          <div className="relative">
            <button onClick={() => setFilterOpen(v => !v)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11.5px] font-medium transition-colors cursor-pointer"
              style={{
                background: (typeFilter !== 'All' || dateFilter !== 'all') ? '#f97316' : T.bgCard,
                color: (typeFilter !== 'All' || dateFilter !== 'all') ? '#fff' : T.textSub,
                border: `1px solid ${(typeFilter !== 'All' || dateFilter !== 'all') ? '#f97316' : T.border}`,
              }}>
              <SlidersHorizontal className="w-3.5 h-3.5" />Filter
              {(typeFilter !== 'All' || dateFilter !== 'all') && (
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </button>
            {filterOpen && (
              <div className="absolute right-0 top-full mt-1.5 z-50 w-64 rounded-2xl shadow-xl p-4 space-y-4"
                style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: T.textMuted }}>Type</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['All', 'Image', 'Video', 'Audio'].map(t => (
                      <button key={t} onClick={() => setTypeFilter(t)}
                        className="px-3 py-1 rounded-full text-[11px] font-medium cursor-pointer transition-all"
                        style={typeFilter === t ? { background: '#f97316', color: '#fff' } : { background: T.bgCard, color: T.textSub, border: `1px solid ${T.border}` }}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: T.textMuted }}>Date</p>
                  <div className="flex flex-wrap gap-1.5">
                    {[['all', 'All time'], ['today', 'Today'], ['week', 'This week'], ['month', 'This month']].map(([val, label]) => (
                      <button key={val} onClick={() => setDateFilter(val)}
                        className="px-3 py-1 rounded-full text-[11px] font-medium cursor-pointer transition-all"
                        style={dateFilter === val ? { background: '#f97316', color: '#fff' } : { background: T.bgCard, color: T.textSub, border: `1px solid ${T.border}` }}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={() => { setTypeFilter('All'); setDateFilter('all'); setFilterOpen(false); }}
                  className="w-full py-1.5 rounded-xl text-[11px] font-semibold cursor-pointer transition-colors"
                  style={{ background: T.bgCard, color: T.textMuted, border: `1px solid ${T.border}` }}>
                  Clear filters
                </button>
              </div>
            )}
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-0.5 rounded-lg p-0.5" style={{ background: T.bgCard }}>
            {([
              ['grid-sm', Grid3X3, 'Small squares'],
              ['grid', LayoutGrid, 'Medium squares'],
              ['masonry', Columns, 'Masonry'],
              ['list', List, 'List'],
            ] as const).map(([v, Icon, title]) => (
              <button key={v} onClick={() => setView(v as ViewMode)} title={title}
                className="p-1.5 rounded-md transition-colors cursor-pointer"
                style={view === v ? { background: T.bg, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } : {}}>
                <Icon className="w-3.5 h-3.5" style={{ color: T.textSub }} />
              </button>
            ))}
          </div>

          <button onClick={() => { setNewName(''); setShowNewModal(true); }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-orange-700 hover:bg-orange-800 text-white text-[11.5px] font-semibold rounded-xl transition-colors cursor-pointer">
            <Plus className="w-3.5 h-3.5" />
            New
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {project.upgrade ? (
            <div className="h-full flex flex-col items-center justify-center gap-5 text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: T.bgCard }}>
                <Lock className="w-7 h-7" style={{ color: T.textMuted }} />
              </div>
              <div>
                <p className="text-[15px] font-semibold mb-1" style={{ color: T.text }}>Team collaboration</p>
                <p className="text-[12px] max-w-xs leading-relaxed" style={{ color: T.textMuted }}>
                  Upgrade to Pro to create shared team projects and collaborate with your team in real time.
                </p>
              </div>
              <button className="px-5 py-2.5 bg-orange-700 text-white text-[12px] font-bold rounded-xl hover:bg-orange-800 transition-colors cursor-pointer">
                Upgrade to Pro
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
              <p className="text-[14px] font-medium" style={{ color: T.textMuted }}>No results for "{query}"</p>
            </div>
          ) : view === 'masonry' ? (
            <div style={{ columnCount: 3, columnGap: '12px' }}>
              {filtered.map((item, i) => (
                <div key={i} className="group relative bg-zinc-950 rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer mb-3" style={{ breakInside: 'avoid' }}>
                  <div className="relative" style={{ aspectRatio: i % 3 === 0 ? '4/3' : i % 3 === 1 ? '16/9' : '1/1' }}>
                    <AutoVideo src={item.videoSrc} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    <button className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-black/80">
                      <MoreHorizontal className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.82)' }} />
                    </button>
                  </div>
                  <div className="px-3 py-2">
                    <p className="text-[12px] font-semibold truncate" style={{ color: 'rgba(255,255,255,0.9)' }}>{item.label}</p>
                    <p className="text-[10.5px]" style={{ color: 'rgba(255,255,255,0.55)' }}>{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : view === 'grid-sm' || view === 'grid' || view === 'grid-lg' ? (
            <div className="grid gap-4"
              style={{ gridTemplateColumns: view === 'grid-sm' ? 'repeat(5,1fr)' : view === 'grid-lg' ? 'repeat(3,1fr)' : 'repeat(4,1fr)' }}>
              {filtered.map((item, i) => (
                <div key={i} className="group relative bg-zinc-950 rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer">
                  <div className="aspect-video overflow-hidden relative">
                    <AutoVideo src={item.videoSrc} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </div>
                  {view !== 'grid-sm' && (
                    <div className="p-3">
                      <p className="text-[12.5px] font-semibold truncate" style={{ color: 'rgba(255,255,255,0.9)' }}>{item.label}</p>
                      <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.65)' }}>{item.date}</p>
                    </div>
                  )}
                  <button className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-black/80">
                    <MoreHorizontal className="w-3.5 h-3.5" style={{ color: 'rgba(255,255,255,0.82)' }} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden divide-y" style={{ border: `1px solid ${T.border}`, borderColor: T.border }}>
              {filtered.map((item, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4 transition-colors cursor-pointer group"
                  style={{ borderColor: T.borderMuted }}
                  onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <div className="w-12 h-9 rounded-lg overflow-hidden shrink-0 bg-zinc-900 relative">
                    <AutoVideo src={item.videoSrc} className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold" style={{ color: T.text }}>{item.label}</p>
                    <p className="text-[11px]" style={{ color: T.textMuted }}>Image · {item.date}</p>
                  </div>
                  <button className="p-1.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" style={{ color: T.textMuted }}>
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
