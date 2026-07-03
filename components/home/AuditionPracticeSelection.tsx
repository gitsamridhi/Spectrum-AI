'use client';

import React, { useState } from 'react';
import {
  Search, Mic, Crown, Clapperboard, MessageSquare,
  Clock, Play, SlidersHorizontal, X,
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

const AC = {
  pink: '#EC4899', pinkBg: 'rgba(236,72,153,0.10)', pinkBdr: 'rgba(236,72,153,0.28)',
  violet: '#A855F7', violetBg: 'rgba(168,85,247,0.10)', violetBdr: 'rgba(168,85,247,0.28)',
  amber: '#F59E0B', amberBg: 'rgba(245,158,11,0.10)', amberBdr: 'rgba(245,158,11,0.28)',
  green: '#10B981', greenBg: 'rgba(16,185,129,0.10)', greenBdr: 'rgba(16,185,129,0.28)',
};

const HF = 'https://static.higgsfield.ai';
const CATEGORY_FILTERS   = ['All', 'Acting', 'Interview', 'Pageant', 'Voice'] as const;
const DIFFICULTY_FILTERS = ['All levels', 'Beginner', 'Intermediate', 'Advanced'] as const;

type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

interface Practice {
  id: string; navId: string; title: string; desc: string; category: string;
  duration: string; difficulty: Difficulty; thumb: string; featured?: boolean;
}

const PRACTICES: Practice[] = [
  {
    id: 'acting', navId: 'upload', title: 'Acting Audition', category: 'Acting',
    desc: 'Perform a scripted scene or monologue and get AI feedback on delivery, emotion, and pacing.',
    duration: '10–15 min', difficulty: 'Intermediate', thumb: `${HF}/seedance-2.0-v2/examples/1-mini.mp4`, featured: true,
  },
  {
    id: 'selftape', navId: 'upload', title: 'Self Tape', category: 'Acting',
    desc: 'Upload a pre-recorded take for detailed scene-by-scene coaching notes.',
    duration: '5–10 min', difficulty: 'Beginner', thumb: `${HF}/ai-video-v2/example-2-mini.mp4`, featured: true,
  },
  {
    id: 'interview', navId: 'interview', title: 'Mock Interview', category: 'Interview',
    desc: 'Answer behavioral and technical questions live, with real-time pacing and filler-word tracking.',
    duration: '20 min', difficulty: 'Intermediate', thumb: `${HF}/seedance-2.0-v2/examples/3-mini.mp4`,
  },
  {
    id: 'pageant', navId: 'pageant', title: 'Pageant Q&A', category: 'Pageant',
    desc: 'Random on-stage questions with a countdown timer to sharpen composure under pressure.',
    duration: '8 min', difficulty: 'Advanced', thumb: `${HF}/ai-video-v2/example-1-mini.mp4`,
  },
  {
    id: 'voice', navId: 'interview', title: 'Voice Practice', category: 'Voice',
    desc: 'Work on tone, pacing, and clarity with live vocal analysis and coaching cues.',
    duration: '12 min', difficulty: 'Beginner', thumb: `${HF}/seedance-2.0-v2/examples/4-mini.mp4`,
  },
];

function DifficultyBadge({ level }: { level: Difficulty }) {
  const map = {
    Beginner:     { c: AC.green,  bg: AC.greenBg,  bdr: AC.greenBdr  },
    Intermediate: { c: AC.amber,  bg: AC.amberBg,  bdr: AC.amberBdr  },
    Advanced:     { c: AC.pink,   bg: AC.pinkBg,   bdr: AC.pinkBdr   },
  } as const;
  const m = map[level];
  return (
    <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full"
      style={{ background: m.bg, color: m.c, border: `1px solid ${m.bdr}` }}>
      {level}
    </span>
  );
}

function PracticeCard({ p, large, onStart }: { p: Practice; large?: boolean; onStart: () => void }) {
  const { T } = useTheme();
  return (
    <div className="group rounded-2xl overflow-hidden cursor-pointer transition-all hover:shadow-lg"
      style={{ background: T.bgCard, border: `1px solid ${T.border}` }} onClick={onStart}>
      <div className="relative overflow-hidden" style={{ paddingTop: large ? '48%' : '58%' }}>
        <video autoPlay loop muted playsInline preload="none"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]">
          <source src={p.thumb} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full text-white/90" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
            {p.category}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1 text-white/85">
            <Clock className="w-3 h-3" /><span className="text-[10px] font-medium">{p.duration}</span>
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: 'rgba(255,255,255,0.9)' }}>
            <Play className="w-3.5 h-3.5 fill-current text-zinc-900 translate-x-0.5" />
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="text-[13px] font-bold" style={{ color: T.text }}>{p.title}</h3>
          <DifficultyBadge level={p.difficulty} />
        </div>
        <p className="text-[11px] leading-relaxed mb-3.5" style={{ color: T.textMuted }}>{p.desc}</p>
        <button onClick={e => { e.stopPropagation(); onStart(); }}
          className="w-full py-2 rounded-xl text-[11.5px] font-bold text-white cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
          style={{ background: `linear-gradient(135deg, ${AC.pink}, ${AC.violet})` }}>
          <Play className="w-3 h-3 fill-current" /> Start
        </button>
      </div>
    </div>
  );
}

export default function AuditionPracticeSelection({ onNavigate }: { onNavigate?: (id: string) => void }) {
  const { T } = useTheme();
  const [search,     setSearch]     = useState('');
  const [category,   setCategory]   = useState<typeof CATEGORY_FILTERS[number]>('All');
  const [difficulty, setDifficulty] = useState<typeof DIFFICULTY_FILTERS[number]>('All levels');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const featured = PRACTICES.filter(p => p.featured);

  const filtered = PRACTICES.filter(p => {
    const matchesSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || p.category === category;
    const matchesDifficulty = difficulty === 'All levels' || p.difficulty === difficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const resetFilters = () => { setSearch(''); setCategory('All'); setDifficulty('All levels'); };

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: T.bg, scrollbarWidth: 'none' }}>
      <div className="px-8 pt-7 pb-10">

        <h1 className="text-[22px] font-black tracking-[-0.02em] mb-1" style={{ color: T.text }}>Choose your practice</h1>
        <p className="text-[12px] mb-6" style={{ color: T.textMuted }}>Pick a session type below — every practice ends with detailed AI coaching feedback.</p>

        {/* Search + filters */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="flex-1 min-w-[220px] flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
            style={{ background: T.inputBg, border: `1px solid ${T.border}` }}>
            <Search className="w-3.5 h-3.5 shrink-0" style={{ color: T.textMuted }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search practices…" className="flex-1 text-[12.5px] bg-transparent outline-none" style={{ color: T.text }} />
            {search && (
              <button onClick={() => setSearch('')} className="cursor-pointer" style={{ color: T.textMuted }}>
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button onClick={() => setFiltersOpen(o => !o)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-[12px] font-semibold cursor-pointer transition-colors"
            style={filtersOpen
              ? { background: AC.pinkBg, color: AC.pink, border: `1px solid ${AC.pinkBdr}` }
              : { background: T.bgCard, color: T.textSub, border: `1px solid ${T.border}` }}>
            <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
          </button>
        </div>

        {filtersOpen && (
          <div className="flex items-center gap-5 mb-5 flex-wrap p-4 rounded-2xl" style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-widest mr-1" style={{ color: T.textMuted }}>Category</span>
              {CATEGORY_FILTERS.map(c => (
                <button key={c} onClick={() => setCategory(c)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium cursor-pointer transition-all"
                  style={category === c ? { background: AC.pink, color: '#fff' } : { background: T.bgCard, color: T.textSub, border: `1px solid ${T.border}` }}>
                  {c}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-widest mr-1" style={{ color: T.textMuted }}>Difficulty</span>
              {DIFFICULTY_FILTERS.map(d => (
                <button key={d} onClick={() => setDifficulty(d)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium cursor-pointer transition-all"
                  style={difficulty === d ? { background: AC.violet, color: '#fff' } : { background: T.bgCard, color: T.textSub, border: `1px solid ${T.border}` }}>
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Featured */}
        {!search && category === 'All' && difficulty === 'All levels' && (
          <div className="mb-8">
            <h3 className="text-[13px] font-bold mb-3 flex items-center gap-1.5" style={{ color: T.text }}>
              <Crown className="w-3.5 h-3.5" style={{ color: AC.amber }} /> Featured practices
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {featured.map(p => (
                <PracticeCard key={p.id} p={p} large onStart={() => onNavigate?.(p.navId)} />
              ))}
            </div>
          </div>
        )}

        {/* All practices grid */}
        <h3 className="text-[13px] font-bold mb-3" style={{ color: T.text }}>All practices · {filtered.length}</h3>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 rounded-2xl"
            style={{ background: T.bgSub, border: `1px dashed ${T.border}` }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: T.bgCard }}>
              <Search className="w-5 h-5" style={{ color: T.textMuted }} />
            </div>
            <p className="text-[12.5px] font-semibold mb-1" style={{ color: T.text }}>No practices match your search</p>
            <p className="text-[11px] mb-4" style={{ color: T.textMuted }}>Try a different keyword or clear your filters.</p>
            <button onClick={resetFilters}
              className="px-4 py-2 rounded-xl text-[11.5px] font-semibold cursor-pointer transition-colors"
              style={{ background: T.bgCard, color: T.textSub, border: `1px solid ${T.border}` }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 max-[900px]:grid-cols-2">
            {filtered.map(p => (
              <PracticeCard key={p.id} p={p} onStart={() => onNavigate?.(p.navId)} />
            ))}
          </div>
        )}

        {/* Category quick-jump strip */}
        <div className="grid grid-cols-4 gap-3 mt-9">
          {[
            { icon: Clapperboard,   label: 'Acting',    color: AC.pink   },
            { icon: MessageSquare,  label: 'Interview',  color: AC.violet },
            { icon: Crown,          label: 'Pageant',    color: AC.amber  },
            { icon: Mic,            label: 'Voice',      color: AC.green  },
          ].map(c => (
            <button key={c.label} onClick={() => setCategory(c.label as typeof CATEGORY_FILTERS[number])}
              className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl cursor-pointer transition-colors"
              style={{ background: T.bgSub, border: `1px solid ${T.border}` }}
              onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)}
              onMouseLeave={e => (e.currentTarget.style.background = T.bgSub)}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${c.color}1A` }}>
                <c.icon className="w-4 h-4" style={{ color: c.color }} />
              </div>
              <span className="text-[11.5px] font-semibold" style={{ color: T.textSub }}>{c.label}</span>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
