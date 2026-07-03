'use client';

import React, { useState, useMemo } from 'react';
import {
  CalendarCheck, Flame, CheckCircle2, Circle, Clock, Video, Mic, Crown, Smile,
  ListTodo, CalendarClock, Play, ChevronRight,
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

const AC = {
  pink: '#EC4899', pinkBg: 'rgba(236,72,153,0.10)', pinkBdr: 'rgba(236,72,153,0.28)',
  violet: '#A855F7', violetBg: 'rgba(168,85,247,0.10)', violetBdr: 'rgba(168,85,247,0.28)',
  amber: '#F59E0B', amberBg: 'rgba(245,158,11,0.10)', amberBdr: 'rgba(245,158,11,0.28)',
  green: '#10B981', greenBg: 'rgba(16,185,129,0.10)', greenBdr: 'rgba(16,185,129,0.28)',
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TODAY_IDX = 2; // Wed, for demo purposes

interface Exercise { id: number; day: number; title: string; category: string; duration: string; navId: string; done: boolean }

const INITIAL_EXERCISES: Exercise[] = [
  { id: 1, day: 0, title: 'Vocal warm-up drill',              category: 'Voice',     duration: '8 min',  navId: 'interview', done: true  },
  { id: 2, day: 1, title: 'Monologue run-through',             category: 'Acting',    duration: '15 min', navId: 'upload',    done: true  },
  { id: 3, day: 2, title: 'Behavioral Q&A — Leadership',       category: 'Interview', duration: '20 min', navId: 'interview', done: false },
  { id: 4, day: 3, title: 'Confidence posture check-in',       category: 'Confidence', duration: '10 min', navId: 'interview', done: false },
  { id: 5, day: 4, title: 'Pageant rapid-fire round',          category: 'Pageant',   duration: '8 min',  navId: 'pageant',   done: false },
  { id: 6, day: 5, title: 'Self-tape retake — Scene 2',         category: 'Acting',    duration: '12 min', navId: 'upload',    done: false },
  { id: 7, day: 6, title: 'Weekly reflection & goal setting',   category: 'Confidence', duration: '5 min',  navId: 'plan',     done: false },
];

const UPCOMING = [
  { label: 'Group mock panel interview', when: 'Fri · 4:00 PM', category: 'Interview' },
  { label: 'Recorded callback prep',      when: 'Sat · 10:00 AM', category: 'Acting'    },
];

const QUICK_START = [
  { id: 'selection', label: 'Acting',     icon: Video, gradient: 'linear-gradient(135deg, rgba(236,72,153,0.20), rgba(168,85,247,0.14))' },
  { id: 'interview',  label: 'Interview',  icon: Mic,   gradient: 'linear-gradient(135deg, rgba(168,85,247,0.20), rgba(59,130,246,0.14))' },
  { id: 'pageant',    label: 'Pageant',    icon: Crown, gradient: 'linear-gradient(135deg, rgba(245,158,11,0.20), rgba(236,72,153,0.14))' },
  { id: 'interview',  label: 'Voice',      icon: Mic,   gradient: 'linear-gradient(135deg, rgba(16,185,129,0.20), rgba(59,130,246,0.14))'  },
  { id: 'interview',  label: 'Confidence', icon: Smile, gradient: 'linear-gradient(135deg, rgba(236,72,153,0.18), rgba(245,158,11,0.14))' },
];

const CATEGORY_ICON: Record<string, React.ElementType> = { Voice: Mic, Acting: Video, Interview: Mic, Confidence: Smile, Pageant: Crown };

export default function AuditionPracticePlan({ onNavigate }: { onNavigate?: (id: string) => void }) {
  const { T } = useTheme();
  const [exercises, setExercises] = useState(INITIAL_EXERCISES);

  const toggleDone = (id: number) => setExercises(es => es.map(e => e.id === id ? { ...e, done: !e.done } : e));

  const today       = exercises.find(e => e.day === TODAY_IDX);
  const assigned    = useMemo(() => exercises.filter(e => !e.done), [exercises]);
  const completed   = useMemo(() => exercises.filter(e => e.done), [exercises]);
  const weekPct     = Math.round((completed.length / exercises.length) * 100);

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: T.bg, scrollbarWidth: 'none' }}>
      <div className="px-8 pt-7 pb-10">

        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-[22px] font-black tracking-[-0.02em] mb-1" style={{ color: T.text }}>Practice Plan</h1>
            <p className="text-[12px]" style={{ color: T.textMuted }}>Your coach-assigned schedule for this week.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-[11.5px] font-bold px-3 py-1.5 rounded-full" style={{ background: AC.amberBg, color: AC.amber, border: `1px solid ${AC.amberBdr}` }}>
              <Flame className="w-3.5 h-3.5" /> 6-day streak
            </span>
            <span className="flex items-center gap-1.5 text-[11.5px] font-bold px-3 py-1.5 rounded-full" style={{ background: AC.greenBg, color: AC.green, border: `1px solid ${AC.greenBdr}` }}>
              <CheckCircle2 className="w-3.5 h-3.5" /> {weekPct}% this week
            </span>
          </div>
        </div>

        {/* Today's practice */}
        {today && (
          <div className="rounded-3xl overflow-hidden relative mb-7" style={{ background: 'linear-gradient(120deg, #EC4899 0%, #A855F7 100%)', minHeight: 128 }}>
            <div className="relative z-10 flex items-center justify-between h-full px-7 py-6 flex-wrap gap-4">
              <div>
                <p className="text-[10.5px] font-semibold text-white/75 mb-1.5 uppercase tracking-widest">Today&apos;s Practice</p>
                <h2 className="text-[19px] font-black text-white tracking-[-0.02em] mb-1">{today.title}</h2>
                <p className="text-[12px] text-white/70 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> {today.duration} · {today.category}
                </p>
              </div>
              <button onClick={() => onNavigate?.(today.navId)}
                className="px-5 py-2.5 rounded-full text-[12.5px] font-bold bg-white text-zinc-900 hover:scale-105 transition-transform cursor-pointer flex items-center gap-2 shrink-0">
                <Play className="w-3.5 h-3.5 fill-current" /> Start Now
              </button>
            </div>
          </div>
        )}

        {/* Weekly plan strip */}
        <div className="mb-7">
          <h3 className="text-[13px] font-bold mb-3 flex items-center gap-1.5" style={{ color: T.text }}>
            <CalendarCheck className="w-3.5 h-3.5" /> Weekly Plan
          </h3>
          <div className="grid grid-cols-7 gap-2.5">
            {DAYS.map((d, i) => {
              const ex = exercises.find(e => e.day === i);
              const isToday = i === TODAY_IDX;
              const Icon = ex ? CATEGORY_ICON[ex.category] ?? Circle : Circle;
              return (
                <div key={d} className="rounded-2xl p-3 flex flex-col items-center gap-2 text-center"
                  style={{
                    background: isToday ? AC.pinkBg : T.bgSub,
                    border: `1px solid ${isToday ? AC.pinkBdr : T.border}`,
                  }}>
                  <span className="text-[9.5px] font-bold uppercase tracking-widest" style={{ color: isToday ? AC.pink : T.textMuted }}>{d}</span>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: ex?.done ? AC.greenBg : T.bgCard }}>
                    {ex ? <Icon className="w-3.5 h-3.5" style={{ color: ex.done ? AC.green : T.textSub }} /> : <span className="text-[10px]" style={{ color: T.textMuted }}>—</span>}
                  </div>
                  <span className="text-[9px] leading-tight" style={{ color: T.textMuted }}>{ex ? ex.duration : 'Rest day'}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Assigned + completed */}
          <div className="col-span-2 flex flex-col gap-6">
            <div>
              <h3 className="text-[13px] font-bold mb-3 flex items-center gap-1.5" style={{ color: T.text }}>
                <ListTodo className="w-3.5 h-3.5" /> Assigned Exercises · {assigned.length}
              </h3>
              {assigned.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-8 rounded-2xl" style={{ background: T.bgSub, border: `1px dashed ${T.border}` }}>
                  <p className="text-[12px]" style={{ color: T.textMuted }}>All exercises complete for this week. Nice work!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {assigned.map(e => {
                    const Icon = CATEGORY_ICON[e.category] ?? Circle;
                    return (
                      <div key={e.id} className="flex items-center gap-3.5 px-4 py-3 rounded-2xl" style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
                        <button onClick={() => toggleDone(e.id)} className="cursor-pointer shrink-0" style={{ color: T.textMuted }}>
                          <Circle className="w-4 h-4" />
                        </button>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: AC.pinkBg }}>
                          <Icon className="w-3.5 h-3.5" style={{ color: AC.pink }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-semibold truncate" style={{ color: T.text }}>{e.title}</p>
                          <p className="text-[10.5px]" style={{ color: T.textMuted }}>{DAYS[e.day]} · {e.duration} · {e.category}</p>
                        </div>
                        <button onClick={() => onNavigate?.(e.navId)}
                          className="flex items-center gap-1 text-[11px] font-semibold cursor-pointer shrink-0" style={{ color: AC.pink }}>
                          Start <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-[13px] font-bold mb-3 flex items-center gap-1.5" style={{ color: T.text }}>
                <CheckCircle2 className="w-3.5 h-3.5" style={{ color: AC.green }} /> Completed Exercises · {completed.length}
              </h3>
              {completed.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-8 rounded-2xl" style={{ background: T.bgSub, border: `1px dashed ${T.border}` }}>
                  <p className="text-[12px]" style={{ color: T.textMuted }}>Nothing completed yet this week — start with today&apos;s practice.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {completed.map(e => (
                    <div key={e.id} className="flex items-center gap-3.5 px-4 py-3 rounded-2xl opacity-70" style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
                      <button onClick={() => toggleDone(e.id)} className="cursor-pointer shrink-0" style={{ color: AC.green }}>
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold truncate line-through" style={{ color: T.textSub }}>{e.title}</p>
                        <p className="text-[10.5px]" style={{ color: T.textMuted }}>{DAYS[e.day]} · {e.duration} · {e.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Upcoming tasks */}
          <div>
            <h3 className="text-[13px] font-bold mb-3 flex items-center gap-1.5" style={{ color: T.text }}>
              <CalendarClock className="w-3.5 h-3.5" /> Upcoming Tasks
            </h3>
            <div className="space-y-2.5">
              {UPCOMING.map((u, i) => (
                <div key={i} className="p-3.5 rounded-2xl" style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
                  <p className="text-[11.5px] font-semibold mb-1" style={{ color: T.text }}>{u.label}</p>
                  <p className="text-[10.5px]" style={{ color: T.textMuted }}>{u.when} · {u.category}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl p-4 mt-4" style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: T.textMuted }}>Weekly Progress</p>
              <div className="h-2 rounded-full overflow-hidden mb-2" style={{ background: T.bgCard }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${weekPct}%`, background: `linear-gradient(90deg, ${AC.pink}, ${AC.violet})` }} />
              </div>
              <p className="text-[10.5px]" style={{ color: T.textMuted }}>{completed.length} of {exercises.length} exercises done</p>
            </div>
          </div>
        </div>

        {/* Quick start */}
        <div>
          <h3 className="text-[13px] font-bold mb-3" style={{ color: T.text }}>Quick Start</h3>
          <div className="grid grid-cols-5 gap-3 max-[900px]:grid-cols-3 max-[560px]:grid-cols-2">
            {QUICK_START.map(c => (
              <button key={c.label} onClick={() => onNavigate?.(c.id)}
                className="group relative rounded-2xl overflow-hidden text-left cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5"
                style={{ border: `1px solid ${T.border}`, minHeight: 100 }}>
                <div className="absolute inset-0" style={{ background: c.gradient }} />
                <div className="relative z-10 p-3.5 flex flex-col justify-between h-full">
                  <c.icon className="w-4 h-4 transition-transform group-hover:scale-110" style={{ color: T.text }} />
                  <p className="text-[12px] font-bold" style={{ color: T.text }}>{c.label}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
