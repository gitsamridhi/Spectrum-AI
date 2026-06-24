'use client';

import React, { useState } from 'react';
import { Plus, Search, Grid3X3, List, MoreHorizontal, Lock, ArrowRight } from 'lucide-react';

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
      { src: '/pexels-didsss-2791056.jpg',         label: 'Portrait enhance',  date: 'Today' },
      { src: '/pexels-ganajp-15698413.jpg',         label: 'Landscape 8×',     date: 'Yesterday' },
      { src: '/pexels-olga-178200755-12367292.jpg', label: 'Product clean-up', date: '2 days ago' },
      { src: '/pexels-prathsnap-3168209.jpg',       label: 'Colorize batch',   date: '3 days ago' },
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

export default function ProjectsView() {
  const [selected, setSelected] = useState('personal');
  const [view,     setView]     = useState<'grid' | 'list'>('grid');
  const [query,    setQuery]    = useState('');

  const project = PROJECTS.find(p => p.id === selected)!;
  const filtered = project.items.filter(i =>
    !query || i.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex-1 flex overflow-hidden bg-white">

      {/* Left — project list panel */}
      <div className="w-64 shrink-0 border-r border-zinc-200 bg-zinc-50 flex flex-col">
        <div className="px-4 pt-5 pb-3 border-b border-zinc-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[13px] font-bold text-zinc-900">Projects</h2>
            <button className="flex items-center gap-1 text-[10px] font-medium text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <button className="w-full flex items-center gap-2.5 py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white text-[12px] font-semibold rounded-xl transition-colors cursor-pointer">
            <Plus className="w-3.5 h-3.5" />
            New project
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {PROJECTS.map(p => (
            <button key={p.id} onClick={() => setSelected(p.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all cursor-pointer ${
                selected === p.id ? 'bg-white shadow-sm border border-zinc-200' : 'hover:bg-white/70'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg ${p.color} flex items-center justify-center shrink-0`}>
                <span className={`text-[10px] font-bold ${p.color === 'bg-zinc-900' ? 'text-white' : 'text-zinc-600'}`}>
                  {p.initials}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12.5px] font-semibold text-zinc-900 truncate">{p.name}</p>
                <p className="text-[10.5px] text-zinc-400">{p.count} items · {p.updated}</p>
              </div>
              {p.upgrade && (
                <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-500 bg-zinc-200 px-1.5 py-0.5 rounded-full">
                  Upgrade
                </span>
              )}
              {p.locked && !p.upgrade && <Lock className="w-3 h-3 text-zinc-300 shrink-0" />}
            </button>
          ))}
        </div>
      </div>

      {/* Right — project contents */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Toolbar */}
        <div className="h-14 border-b border-zinc-100 flex items-center px-6 gap-4 shrink-0">
          <div className="flex items-center gap-2 flex-1">
            <div className={`w-7 h-7 rounded-lg ${project.color} flex items-center justify-center shrink-0`}>
              <span className={`text-[9px] font-bold ${project.color === 'bg-zinc-900' ? 'text-white' : 'text-zinc-600'}`}>
                {project.initials}
              </span>
            </div>
            <h1 className="text-[14px] font-bold text-zinc-900">{project.name}</h1>
            <span className="text-[11px] text-zinc-400">{project.items.length} items</span>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl w-56">
            <Search className="w-3.5 h-3.5 text-zinc-400" />
            <input value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search..." className="flex-1 text-[12px] outline-none bg-transparent text-zinc-700 placeholder-zinc-400" />
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-0.5 bg-zinc-100 rounded-lg p-0.5">
            <button onClick={() => setView('grid')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${view === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-zinc-200'}`}>
              <Grid3X3 className="w-3.5 h-3.5 text-zinc-600" />
            </button>
            <button onClick={() => setView('list')}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${view === 'list' ? 'bg-white shadow-sm' : 'hover:bg-zinc-200'}`}>
              <List className="w-3.5 h-3.5 text-zinc-600" />
            </button>
          </div>

          <button className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-[11.5px] font-semibold rounded-xl transition-colors cursor-pointer">
            <Plus className="w-3.5 h-3.5" />
            New
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {project.upgrade ? (
            <div className="h-full flex flex-col items-center justify-center gap-5 text-center">
              <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center">
                <Lock className="w-7 h-7 text-zinc-300" />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-zinc-800 mb-1">Team collaboration</p>
                <p className="text-[12px] text-zinc-400 max-w-xs leading-relaxed">
                  Upgrade to Pro to create shared team projects and collaborate with your team in real time.
                </p>
              </div>
              <button className="px-5 py-2.5 bg-rose-600 text-white text-[12px] font-bold rounded-xl hover:bg-rose-700 transition-colors cursor-pointer">
                Upgrade to Pro
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
              <p className="text-[14px] font-medium text-zinc-400">No results for "{query}"</p>
            </div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-4 gap-4">
              {filtered.map((item, i) => (
                <div key={i} className="group relative bg-zinc-50 border border-zinc-200 rounded-2xl overflow-hidden hover:shadow-md hover:border-zinc-300 transition-all cursor-pointer">
                  <div className="aspect-video overflow-hidden">
                    <img src={item.src} alt={item.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-3">
                    <p className="text-[12.5px] font-semibold text-zinc-900 truncate">{item.label}</p>
                    <p className="text-[11px] text-zinc-400">{item.date}</p>
                  </div>
                  <button className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-white">
                    <MoreHorizontal className="w-3.5 h-3.5 text-zinc-600" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-zinc-200 rounded-2xl overflow-hidden divide-y divide-zinc-100">
              {filtered.map((item, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-zinc-50 transition-colors cursor-pointer group">
                  <div className="w-12 h-9 rounded-lg overflow-hidden shrink-0">
                    <img src={item.src} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold text-zinc-900">{item.label}</p>
                    <p className="text-[11px] text-zinc-400">Image · {item.date}</p>
                  </div>
                  <button className="p-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-zinc-700 cursor-pointer">
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
