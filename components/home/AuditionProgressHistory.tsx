'use client';

import React, { useState, useMemo } from 'react';
import {
  Search, TrendingUp, Trophy, Star, Flame, Award, Smile, Mic2,
  PersonStanding, MessageSquare, CalendarClock, LineChart,
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

const AC = {
  pink: '#EC4899', pinkBg: 'rgba(236,72,153,0.10)', pinkBdr: 'rgba(236,72,153,0.28)',
  violet: '#A855F7', violetBg: 'rgba(168,85,247,0.10)', violetBdr: 'rgba(168,85,247,0.28)',
  amber: '#F59E0B', amberBg: 'rgba(245,158,11,0.10)', amberBdr: 'rgba(245,158,11,0.28)',
  green: '#10B981', greenBg: 'rgba(16,185,129,0.10)', greenBdr: 'rgba(16,185,129,0.28)',
};

const RANGES = ['7 days', '30 days', '90 days', 'All time'] as const;
type Range = typeof RANGES[number];

const TIMELINE_BY_RANGE: Record<Range, number[]> = {
  '7 days':   [69, 71, 70, 74, 75, 73, 78],
  '30 days':  [58, 61, 63, 66, 65, 69, 71, 70, 74, 75, 73, 77, 76, 78],
  '90 days':  [42, 46, 50, 53, 58, 55, 61, 63, 66, 65, 69, 71, 70, 74, 75, 73, 77, 76, 78],
  'All time': [30, 35, 38, 42, 46, 50, 53, 58, 55, 61, 63, 66, 65, 69, 71, 70, 74, 75, 73, 77, 76, 78],
};

const CATEGORY_TREND_SCALE: Record<Range, number> = { '7 days': 0.3, '30 days': 1, '90 days': 1.8, 'All time': 2.6 };
const HEATMAP_WEEKS: Record<Range, number> = { '7 days': 1, '30 days': 4, '90 days': 8, 'All time': 12 };

const CATEGORY_SCORES = [
  { label: 'Confidence',    score: 82, icon: Smile,          trend: 6  },
  { label: 'Voice',         score: 75, icon: Mic2,           trend: 4  },
  { label: 'Body Language', score: 68, icon: PersonStanding, trend: 2  },
  { label: 'Delivery',      score: 79, icon: MessageSquare,  trend: 9  },
];

const HEATMAP_PATTERN = [1, 2, 0, 3, 2, 1, 0, 2, 3, 2, 1, 0, 2, 3, 0, 1, 2, 3, 3, 2, 1, 2, 3, 3, 2, 1, 2, 3];
function genHeatmap(weeks: number): number[][] {
  return Array.from({ length: weeks }, (_, wi) =>
    Array.from({ length: 7 }, (_, di) => HEATMAP_PATTERN[(wi * 7 + di) % HEATMAP_PATTERN.length])
  );
}

const ACHIEVEMENTS = [
  { icon: Trophy, label: '5-Session Streak',        earned: true,  date: '2 days ago' },
  { icon: Star,   label: 'First Perfect Score',      earned: true,  date: '1 week ago' },
  { icon: Flame,  label: '10-Day Streak',            earned: false, date: '4 days to go' },
  { icon: Award,  label: 'Category Master: Voice',   earned: false, date: 'Reach 90 in Voice' },
];

const MILESTONES = [
  { label: 'Completed your 25th practice session', date: 'Jun 20' },
  { label: 'Broke an 80 average score',             date: 'Jun 15' },
  { label: 'Completed your first Feedback Report',  date: 'May 8'  },
  { label: 'Joined Audition Coach',                 date: 'May 2'  },
];

const RECENT_SESSIONS = [
  { title: 'Behavioral round — Leadership',  category: 'Interview', score: 82, when: '2 hours ago' },
  { title: 'Drama monologue — "The Letter"', category: 'Acting',    score: 74, when: 'Yesterday'   },
  { title: 'Current events Q&A',             category: 'Pageant',   score: 88, when: '3 days ago'  },
];

export default function AuditionProgressHistory({ onNavigate }: { onNavigate?: (id: string) => void }) {
  const { T } = useTheme();
  const [range,  setRange]  = useState<Range>('30 days');
  const [search, setSearch] = useState('');

  const filteredSessions = useMemo(
    () => RECENT_SESSIONS.filter(s => !search || s.title.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  const timeline    = TIMELINE_BY_RANGE[range];
  const trendScale   = CATEGORY_TREND_SCALE[range];
  const weeks        = HEATMAP_WEEKS[range];
  const streakHeatmap = useMemo(() => genHeatmap(weeks), [weeks]);
  const overallTrend = timeline[timeline.length - 1] - timeline[0];

  const heatColor = (v: number) => v === 0 ? T.bgCard : v === 1 ? AC.pinkBg : v === 2 ? 'rgba(236,72,153,0.45)' : AC.pink;

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: T.bg, scrollbarWidth: 'none' }}>
      <div className="px-8 pt-7 pb-10">

        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-[22px] font-black tracking-[-0.02em] mb-1 flex items-center gap-2" style={{ color: T.text }}>
              <LineChart className="w-5 h-5" style={{ color: AC.pink }} /> Progress History
            </h1>
            <p className="text-[12px]" style={{ color: T.textMuted }}>Track your growth across every practice category.</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
              {RANGES.map(r => (
                <button key={r} onClick={() => setRange(r)}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer transition-all"
                  style={range === r ? { background: AC.pink, color: '#fff' } : { color: T.textSub }}>
                  {r}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: T.inputBg, border: `1px solid ${T.border}` }}>
              <Search className="w-3.5 h-3.5 shrink-0" style={{ color: T.textMuted }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search sessions…"
                className="text-[12px] bg-transparent outline-none w-32" style={{ color: T.text }} />
            </div>
          </div>
        </div>

        {/* Performance timeline */}
        <div className="rounded-2xl p-5 mb-6" style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[13px] font-bold" style={{ color: T.text }}>Performance Timeline · {range}</h3>
            <span className="text-[11px] font-bold flex items-center gap-1" style={{ color: overallTrend >= 0 ? AC.green : AC.amber }}>
              <TrendingUp className="w-3 h-3" /> {overallTrend >= 0 ? '+' : ''}{overallTrend} pts over {range}
            </span>
          </div>
          <div className="flex items-end gap-1.5" style={{ height: 90 }}>
            {timeline.map((v, i) => {
              const h = Math.round((v / 100) * 90);
              const isLast = i === timeline.length - 1;
              return (
                <div key={i} className="group relative flex-1">
                  <div className="rounded-t-sm transition-all" style={{ height: h, background: isLast ? AC.pink : T.bgCard, minWidth: 6 }} />
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md text-[9.5px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{ background: T.text, color: T.bg }}>
                    {v}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Category scores */}
          <div className="col-span-2 rounded-2xl p-5" style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
            <h3 className="text-[13px] font-bold mb-4" style={{ color: T.text }}>Category Scores</h3>
            <div className="space-y-4">
              {CATEGORY_SCORES.map(c => (
                <div key={c.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[12px] font-medium flex items-center gap-1.5" style={{ color: T.textSub }}>
                      <c.icon className="w-3.5 h-3.5" style={{ color: AC.violet }} /> {c.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold" style={{ color: AC.green }}>+{Math.max(1, Math.round(c.trend * trendScale))}</span>
                      <span className="text-[12.5px] font-bold" style={{ color: T.text }}>{c.score}%</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: T.bgCard }}>
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${c.score}%`, background: `linear-gradient(90deg, ${AC.pink}, ${AC.violet})` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Streak heatmap */}
          <div className="rounded-2xl p-5" style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[13px] font-bold" style={{ color: T.text }}>Practice Streak</h3>
              <span className="flex items-center gap-1 text-[11px] font-bold" style={{ color: AC.amber }}>
                <Flame className="w-3.5 h-3.5" /> 6d
              </span>
            </div>
            <div className="space-y-1">
              {streakHeatmap.map((week, wi) => (
                <div key={wi} className="flex gap-1">
                  {week.map((v, di) => <div key={di} className="flex-1 rounded-sm" style={{ height: 12, background: heatColor(v) }} />)}
                </div>
              ))}
            </div>
            <p className="text-[10px] mt-3" style={{ color: T.textMuted }}>Last {weeks} week{weeks > 1 ? 's' : ''} · darker = more practice</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Achievements */}
          <div className="rounded-2xl p-5" style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
            <h3 className="text-[13px] font-bold mb-4" style={{ color: T.text }}>Achievements</h3>
            <div className="grid grid-cols-2 gap-3">
              {ACHIEVEMENTS.map(a => (
                <div key={a.label} className="rounded-xl p-3.5 flex flex-col items-center text-center gap-2"
                  style={{ background: a.earned ? AC.amberBg : T.bgCard, border: `1px solid ${a.earned ? AC.amberBdr : T.border}`, opacity: a.earned ? 1 : 0.6 }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: a.earned ? 'rgba(255,255,255,0.5)' : T.bgSub }}>
                    <a.icon className="w-4 h-4" style={{ color: a.earned ? AC.amber : T.textMuted }} />
                  </div>
                  <p className="text-[10.5px] font-semibold leading-tight" style={{ color: T.text }}>{a.label}</p>
                  <p className="text-[9px]" style={{ color: T.textMuted }}>{a.date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones */}
          <div className="rounded-2xl p-5" style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
            <h3 className="text-[13px] font-bold mb-4" style={{ color: T.text }}>Milestones</h3>
            <div className="space-y-3">
              {MILESTONES.map((m, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: AC.pink }} />
                  <div className="flex-1">
                    <p className="text-[11.5px] font-medium" style={{ color: T.textSub }}>{m.label}</p>
                    <p className="text-[10px]" style={{ color: T.textMuted }}>{m.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent sessions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[13px] font-bold flex items-center gap-1.5" style={{ color: T.text }}>
              <CalendarClock className="w-3.5 h-3.5" /> Previous Sessions
            </h3>
            <button onClick={() => onNavigate?.('sessions')} className="text-[11px] font-semibold cursor-pointer" style={{ color: AC.pink }}>
              View all sessions →
            </button>
          </div>
          {filteredSessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-10 rounded-2xl" style={{ background: T.bgSub, border: `1px dashed ${T.border}` }}>
              <p className="text-[12px]" style={{ color: T.textMuted }}>No sessions match &ldquo;{search}&rdquo;.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredSessions.map((s, i) => (
                <div key={i} className="flex items-center gap-3.5 px-4 py-3 rounded-2xl" style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold truncate" style={{ color: T.text }}>{s.title}</p>
                    <p className="text-[10.5px]" style={{ color: T.textMuted }}>{s.category} · {s.when}</p>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0"
                    style={{ background: s.score >= 80 ? AC.greenBg : AC.amberBg, color: s.score >= 80 ? AC.green : AC.amber, border: `1px solid ${s.score >= 80 ? AC.greenBdr : AC.amberBdr}` }}>
                    {s.score}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
