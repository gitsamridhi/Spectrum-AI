'use client';

import React, { useState, useMemo } from 'react';
import {
  Search, Table2, LayoutGrid, Eye, Download, Repeat, Trash2,
  Clock, CheckCircle2, Loader2, FileEdit,
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

const AC = {
  pink: '#EC4899', pinkBg: 'rgba(236,72,153,0.10)', pinkBdr: 'rgba(236,72,153,0.28)',
  violet: '#A855F7', violetBg: 'rgba(168,85,247,0.10)',
  amber: '#F59E0B', amberBg: 'rgba(245,158,11,0.10)', amberBdr: 'rgba(245,158,11,0.28)',
  green: '#10B981', greenBg: 'rgba(16,185,129,0.10)', greenBdr: 'rgba(16,185,129,0.28)',
  red:   '#EF4444', redBg:   'rgba(239,68,68,0.10)',   redBdr:   'rgba(239,68,68,0.28)',
};

const HF = 'https://static.higgsfield.ai';
type Status = 'Completed' | 'Processing' | 'Draft';

interface Session {
  id: number; title: string; type: string; navId: string; thumb: string;
  date: string; duration: string; score: number | null; status: Status;
}

const INITIAL_SESSIONS: Session[] = [
  { id: 1, title: 'Behavioral round — Leadership',    type: 'Interview', navId: 'interview', thumb: `${HF}/seedance-2.0-v2/examples/2-mini.mp4`, date: 'Jul 3',  duration: '18:24', score: 82,  status: 'Completed' },
  { id: 2, title: 'Drama monologue — "The Letter"',    type: 'Acting',    navId: 'upload',    thumb: `${HF}/ai-video-v2/example-2-mini.mp4`,       date: 'Jul 2',  duration: '2:41',  score: 74,  status: 'Completed' },
  { id: 3, title: 'Current events Q&A',                type: 'Pageant',   navId: 'pageant',   thumb: `${HF}/ai-video-v2/example-1-mini.mp4`,       date: 'Jun 30', duration: '0:52',  score: 88,  status: 'Completed' },
  { id: 4, title: 'Voice pacing drill',                type: 'Voice',     navId: 'interview', thumb: `${HF}/seedance-2.0-v2/examples/4-mini.mp4`,  date: 'Jun 29', duration: '11:03', score: 69,  status: 'Completed' },
  { id: 5, title: 'Self-tape retake — Scene 2',        type: 'Acting',    navId: 'upload',    thumb: `${HF}/seedance-2.0-v2/examples/3-mini.mp4`,  date: 'Jun 27', duration: '3:12',  score: null, status: 'Processing' },
  { id: 6, title: 'Confidence check-in (unfinished)',  type: 'Confidence', navId: 'interview', thumb: `${HF}/ai-video-v2/example-3-mini.mp4`,       date: 'Jun 25', duration: '0:38',  score: null, status: 'Draft'      },
];

const STATUS_FILTERS: ('All' | Status)[] = ['All', 'Completed', 'Processing', 'Draft'];

function StatusBadge({ status }: { status: Status }) {
  const map = {
    Completed:  { c: AC.green, bg: AC.greenBg, bdr: AC.greenBdr, Icon: CheckCircle2 },
    Processing: { c: AC.amber, bg: AC.amberBg, bdr: AC.amberBdr, Icon: Loader2      },
    Draft:      { c: AC.pink,  bg: AC.pinkBg,  bdr: AC.pinkBdr,  Icon: FileEdit     },
  } as const;
  const m = map[status];
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: m.bg, color: m.c, border: `1px solid ${m.bdr}` }}>
      <m.Icon className={`w-3 h-3 ${status === 'Processing' ? 'animate-spin' : ''}`} /> {status}
    </span>
  );
}

export default function AuditionSessionHistory({ onNavigate }: { onNavigate?: (id: string) => void }) {
  const { T } = useTheme();
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
  const [search,   setSearch]   = useState('');
  const [status,   setStatus]   = useState<'All' | Status>('All');
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);

  const filtered = useMemo(
    () => sessions.filter(s => (status === 'All' || s.status === status) && (!search || s.title.toLowerCase().includes(search.toLowerCase()) || s.type.toLowerCase().includes(search.toLowerCase()))),
    [sessions, search, status]
  );

  const deleteSession = (id: number) => setSessions(s => s.filter(x => x.id !== id));

  const downloadSession = (s: Session) => {
    const a = document.createElement('a');
    a.href = s.thumb;
    a.download = `${s.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.mp4`;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a); a.click(); a.remove();
  };

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: T.bg, scrollbarWidth: 'none' }}>
      <div className="px-8 pt-7 pb-10">

        <div className="flex items-center justify-between mb-1 flex-wrap gap-3">
          <h1 className="text-[22px] font-black tracking-[-0.02em]" style={{ color: T.text }}>Session History</h1>
          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
            {([['table', Table2], ['cards', LayoutGrid]] as const).map(([mode, Icon]) => (
              <button key={mode} onClick={() => setViewMode(mode)}
                className="p-1.5 rounded-lg cursor-pointer transition-all"
                style={viewMode === mode ? { background: AC.pink, color: '#fff' } : { color: T.textMuted }}>
                <Icon className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>
        </div>
        <p className="text-[12px] mb-5" style={{ color: T.textMuted }}>Every practice you&apos;ve recorded, in one place.</p>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            {STATUS_FILTERS.map(f => (
              <button key={f} onClick={() => setStatus(f)}
                className="px-3 py-1.5 rounded-lg text-[11.5px] font-semibold cursor-pointer transition-all"
                style={status === f ? { background: AC.pink, color: '#fff' } : { background: T.bgCard, color: T.textSub, border: `1px solid ${T.border}` }}>
                {f}
              </button>
            ))}
          </div>
          <div className="flex-1 min-w-[200px] flex items-center gap-2 px-3.5 py-2 rounded-xl" style={{ background: T.inputBg, border: `1px solid ${T.border}` }}>
            <Search className="w-3.5 h-3.5 shrink-0" style={{ color: T.textMuted }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search sessions…"
              className="flex-1 text-[12.5px] bg-transparent outline-none" style={{ color: T.text }} />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 rounded-2xl" style={{ background: T.bgSub, border: `1px dashed ${T.border}` }}>
            <p className="text-[12.5px] font-semibold mb-1" style={{ color: T.text }}>No sessions found</p>
            <p className="text-[11px]" style={{ color: T.textMuted }}>Try a different search term or status filter.</p>
          </div>
        ) : viewMode === 'table' ? (
          <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
            <div className="grid grid-cols-[64px_1.6fr_0.9fr_0.7fr_0.6fr_0.9fr_1fr] gap-3 px-4 py-2.5" style={{ background: T.bgCard, borderBottom: `1px solid ${T.border}` }}>
              {['', 'Practice', 'Date', 'Duration', 'Score', 'Status', 'Actions'].map(h => (
                <span key={h} className="text-[9.5px] font-bold uppercase tracking-widest" style={{ color: T.textMuted }}>{h}</span>
              ))}
            </div>
            {filtered.map(s => (
              <div key={s.id} className="grid grid-cols-[64px_1.6fr_0.9fr_0.7fr_0.6fr_0.9fr_1fr] gap-3 px-4 py-3 items-center"
                style={{ background: T.bgSub, borderBottom: `1px solid ${T.border}` }}>
                <div className="w-11 h-8 rounded-md overflow-hidden shrink-0" style={{ background: '#000' }}>
                  <video muted loop preload="none" className="w-full h-full object-cover" poster="">
                    <source src={s.thumb} type="video/mp4" />
                  </video>
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold truncate" style={{ color: T.text }}>{s.title}</p>
                  <p className="text-[10px]" style={{ color: T.textMuted }}>{s.type}</p>
                </div>
                <span className="text-[11.5px]" style={{ color: T.textSub }}>{s.date}</span>
                <span className="text-[11.5px] flex items-center gap-1" style={{ color: T.textSub }}><Clock className="w-3 h-3" />{s.duration}</span>
                <span className="text-[12px] font-bold" style={{ color: s.score === null ? T.textMuted : s.score >= 80 ? AC.green : AC.amber }}>{s.score ?? '—'}</span>
                <StatusBadge status={s.status} />
                <div className="flex items-center gap-1">
                  <button onClick={() => onNavigate?.('feedback')} title="View" className="w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer transition-colors" style={{ color: T.textMuted }}
                    onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => downloadSession(s)} title="Download" className="w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer transition-colors" style={{ color: T.textMuted }}
                    onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => onNavigate?.(s.navId)} title="Repeat Practice" className="w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer transition-colors" style={{ color: T.textMuted }}
                    onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <Repeat className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => deleteSession(s.id)} title="Delete" className="w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer transition-colors" style={{ color: T.textMuted }}
                    onMouseEnter={e => { e.currentTarget.style.background = AC.redBg; e.currentTarget.style.color = AC.red; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.textMuted; }}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 max-[900px]:grid-cols-2">
            {filtered.map(s => (
              <div key={s.id} className="rounded-2xl overflow-hidden group" style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
                <div className="relative overflow-hidden" style={{ paddingTop: '56%' }}>
                  <video autoPlay loop muted playsInline preload="none" className="absolute inset-0 w-full h-full object-cover">
                    <source src={s.thumb} type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                  <div className="absolute top-2.5 left-2.5"><StatusBadge status={s.status} /></div>
                  {s.score !== null && (
                    <span className="absolute top-2.5 right-2.5 text-[11px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: 'rgba(0,0,0,0.55)' }}>{s.score}</span>
                  )}
                  <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 text-white/85">
                    <Clock className="w-3 h-3" /><span className="text-[10px] font-medium">{s.duration}</span>
                  </div>
                </div>
                <div className="p-3.5">
                  <p className="text-[12px] font-bold truncate mb-0.5" style={{ color: T.text }}>{s.title}</p>
                  <p className="text-[10.5px] mb-3" style={{ color: T.textMuted }}>{s.type} · {s.date}</p>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => onNavigate?.('feedback')} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10.5px] font-semibold cursor-pointer transition-colors" style={{ background: T.bgSub, color: T.textSub, border: `1px solid ${T.border}` }}>
                      <Eye className="w-3 h-3" /> View
                    </button>
                    <button onClick={() => downloadSession(s)} className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-colors shrink-0" style={{ background: T.bgSub, color: T.textMuted, border: `1px solid ${T.border}` }} title="Download">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => onNavigate?.(s.navId)} className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-colors shrink-0" style={{ background: T.bgSub, color: T.textMuted, border: `1px solid ${T.border}` }} title="Repeat Practice">
                      <Repeat className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => deleteSession(s.id)} className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-colors shrink-0" style={{ background: T.bgSub, color: T.textMuted, border: `1px solid ${T.border}` }} title="Delete"
                      onMouseEnter={e => { e.currentTarget.style.background = AC.redBg; e.currentTarget.style.color = AC.red; }}
                      onMouseLeave={e => { e.currentTarget.style.background = T.bgSub; e.currentTarget.style.color = T.textMuted; }}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
