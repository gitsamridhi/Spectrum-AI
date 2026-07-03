'use client';

import React from 'react';
import {
  Upload, Video, Mic, Crown, TrendingUp, Flame, Clock, Star,
  ArrowUpRight, Play, FileText, ChevronRight, Smile, Target, Zap,
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

const AC = {
  pink: '#EC4899', pinkBg: 'rgba(236,72,153,0.10)', pinkBdr: 'rgba(236,72,153,0.28)',
  violet: '#A855F7', violetBg: 'rgba(168,85,247,0.10)', violetBdr: 'rgba(168,85,247,0.28)',
  amber: '#F59E0B', amberBg: 'rgba(245,158,11,0.10)', amberBdr: 'rgba(245,158,11,0.28)',
  green: '#10B981', greenBg: 'rgba(16,185,129,0.10)', greenBdr: 'rgba(16,185,129,0.28)',
};

const QUICK_ACTIONS = [
  { id: 'upload',    label: 'Upload Self-Tape',    icon: Upload,     color: AC.pink   },
  { id: 'interview', label: 'Start Live Practice',  icon: Video,      color: AC.violet },
  { id: 'interview', label: 'Mock Interview',       icon: Mic,        color: AC.amber  },
  { id: 'pageant',   label: 'Pageant Practice',     icon: Crown,      color: AC.green  },
  { id: 'feedback',  label: 'View Progress',        icon: TrendingUp, color: AC.pink   },
];

const STATS = [
  { label: 'Total Sessions', value: '32',   icon: Video,      color: AC.pink   },
  { label: 'Average Score',  value: '78',   icon: Star,       color: AC.violet },
  { label: 'Improvement',    value: '+14%', icon: TrendingUp, color: AC.green  },
  { label: 'Practice Hours', value: '19.5', icon: Clock,      color: AC.amber  },
  { label: 'Current Streak', value: '6d',   icon: Flame,      color: AC.pink   },
];

const RECENT_ACTIVITY = [
  { id: 1, type: 'Mock Interview',   title: 'Behavioral round — Leadership',    score: 82, when: '2 hours ago' },
  { id: 2, type: 'Self Tape',        title: 'Drama monologue — "The Letter"',   score: 74, when: 'Yesterday'   },
  { id: 3, type: 'Pageant Practice', title: 'Current events Q&A',               score: 88, when: '3 days ago'  },
];

const SUGGESTIONS = [
  { icon: Target, text: 'Your pacing speeds up under pressure — try the Breathing Drill before your next take.',   tag: 'Delivery'      },
  { icon: Smile,  text: 'Eye contact dropped in your last 2 self-tapes — practice with Teleprompter Mode.',         tag: 'Body Language' },
  { icon: Zap,    text: 'Great improvement in vocal clarity this week — keep it up with a Voice Practice session.', tag: 'Voice'         },
];

const CATEGORIES = [
  { id: 'selection', label: 'Acting',     desc: 'Scene work & monologues',    icon: Video, gradient: 'linear-gradient(135deg, rgba(236,72,153,0.20), rgba(168,85,247,0.14))' },
  { id: 'interview', label: 'Interview',  desc: 'Behavioral & technical Q&A', icon: Mic,   gradient: 'linear-gradient(135deg, rgba(168,85,247,0.20), rgba(59,130,246,0.14))'  },
  { id: 'pageant',   label: 'Pageant',    desc: 'Q&A rounds & poise',         icon: Crown, gradient: 'linear-gradient(135deg, rgba(245,158,11,0.20), rgba(236,72,153,0.14))'  },
  { id: 'interview', label: 'Voice',      desc: 'Tone, pacing & clarity',     icon: Mic,   gradient: 'linear-gradient(135deg, rgba(16,185,129,0.20), rgba(59,130,246,0.14))'   },
  { id: 'interview', label: 'Confidence', desc: 'Posture & presence',         icon: Smile, gradient: 'linear-gradient(135deg, rgba(236,72,153,0.18), rgba(245,158,11,0.14))'  },
];

function ScoreRing({ score, size = 96 }: { score: number; size?: number }) {
  const R = (size - 12) / 2, C = 2 * Math.PI * R, off = C * (1 - score / 100), cx = size / 2;
  const col = score >= 85 ? AC.green : score >= 65 ? '#fff' : AC.amber;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={cx} cy={cx} r={R} fill="none" strokeWidth={7} style={{ stroke: 'rgba(255,255,255,0.22)' }} />
        <circle cx={cx} cy={cx} r={R} fill="none" strokeWidth={7} stroke={col} strokeDasharray={C} strokeDashoffset={off}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[22px] font-black leading-none text-white">{score}</span>
        <span className="text-[8px] font-semibold text-white/65 mt-0.5">/100</span>
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, desc, actionLabel, onAction }: {
  icon: React.ElementType; title: string; desc: string; actionLabel: string; onAction: () => void;
}) {
  const { T } = useTheme();
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 rounded-2xl"
      style={{ background: T.bgSub, border: `1px dashed ${T.border}` }}>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: T.bgCard }}>
        <Icon className="w-5 h-5" style={{ color: T.textMuted }} />
      </div>
      <p className="text-[12.5px] font-semibold mb-1" style={{ color: T.text }}>{title}</p>
      <p className="text-[11px] mb-4 max-w-[220px]" style={{ color: T.textMuted }}>{desc}</p>
      <button onClick={onAction}
        className="px-4 py-2 rounded-xl text-[11.5px] font-semibold text-white cursor-pointer hover:opacity-90 transition-opacity"
        style={{ background: `linear-gradient(135deg, ${AC.pink}, ${AC.violet})` }}>
        {actionLabel}
      </button>
    </div>
  );
}

export default function AuditionCoachHome({ onNavigate }: { onNavigate?: (id: string) => void }) {
  const { T } = useTheme();

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: T.bg, scrollbarWidth: 'none' }}>
      <div className="px-8 pt-7 pb-10">

        {/* ── Hero ── */}
        <div className="rounded-3xl overflow-hidden relative mb-7" style={{
          background: 'linear-gradient(120deg, #EC4899 0%, #A855F7 55%, #F59E0B 100%)', minHeight: 172,
        }}>
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />
          <div className="relative z-10 flex items-center h-full px-8 py-7 gap-8 flex-wrap">
            <div className="flex-1 min-w-[280px]">
              <p className="text-[11px] font-semibold text-white/75 mb-2 uppercase tracking-widest">Audition Coach</p>
              <h1 className="text-[28px] font-black text-white tracking-[-0.03em] leading-tight mb-2">
                Ready for your next take?
              </h1>
              <p className="text-[12.5px] text-white/70 max-w-md mb-5 leading-relaxed">
                Pick up where you left off, or jump into a brand-new coaching session — your AI coach is ready when you are.
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <button onClick={() => onNavigate?.('interview')}
                  className="px-5 py-2.5 rounded-full text-[12.5px] font-bold bg-white text-zinc-900 hover:scale-105 transition-transform cursor-pointer flex items-center gap-2">
                  <Play className="w-3.5 h-3.5 fill-current" /> Continue Practice
                </button>
                <button onClick={() => onNavigate?.('selection')}
                  className="px-5 py-2.5 rounded-full text-[12.5px] font-bold border border-white/35 text-white hover:bg-white/10 transition-colors cursor-pointer">
                  Start New Session
                </button>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 shrink-0">
              <ScoreRing score={82} />
              <p className="text-[10px] font-semibold text-white/75 text-center leading-tight">Recent Performance<br />Score</p>
            </div>
          </div>
        </div>

        {/* ── Quick actions ── */}
        <div className="grid grid-cols-5 gap-3 mb-7 max-[900px]:grid-cols-3 max-[560px]:grid-cols-2">
          {QUICK_ACTIONS.map((a, i) => (
            <button key={a.label + i} onClick={() => onNavigate?.(a.id)}
              className="group flex flex-col items-center gap-2.5 py-5 rounded-2xl transition-all cursor-pointer"
              style={{ background: T.bgSub, border: `1px solid ${T.border}` }}
              onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)}
              onMouseLeave={e => (e.currentTarget.style.background = T.bgSub)}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ background: `${a.color}1A` }}>
                <a.icon className="w-5 h-5" style={{ color: a.color }} />
              </div>
              <span className="text-[11px] font-semibold text-center px-2 leading-tight" style={{ color: T.textSub }}>{a.label}</span>
            </button>
          ))}
        </div>

        {/* ── Statistics ── */}
        <div className="grid grid-cols-5 gap-3 mb-8 max-[900px]:grid-cols-3 max-[560px]:grid-cols-2">
          {STATS.map(s => (
            <div key={s.label} className="rounded-2xl p-4 flex flex-col gap-2.5"
              style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${s.color}1A` }}>
                <s.icon className="w-4 h-4" style={{ color: s.color }} />
              </div>
              <span className="text-[22px] font-black tracking-[-0.03em] leading-none" style={{ color: T.text }}>{s.value}</span>
              <span className="text-[10.5px] font-medium" style={{ color: T.textMuted }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Recent activity + Suggested practice ── */}
        <div className="grid grid-cols-3 gap-6 mb-8 max-[900px]:grid-cols-1">
          <div className="col-span-2 max-[900px]:col-span-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[14px] font-bold" style={{ color: T.text }}>Recent Activity</h3>
              <button onClick={() => onNavigate?.('feedback')}
                className="text-[11px] font-semibold flex items-center gap-1 cursor-pointer" style={{ color: AC.pink }}>
                View all <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            {RECENT_ACTIVITY.length === 0 ? (
              <EmptyState icon={FileText} title="No practice sessions yet"
                desc="Start your first session to see reports and feedback here."
                actionLabel="Start New Session" onAction={() => onNavigate?.('selection')} />
            ) : (
              <div className="space-y-2">
                {RECENT_ACTIVITY.map(r => (
                  <div key={r.id} onClick={() => onNavigate?.('feedback')}
                    className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl cursor-pointer transition-colors"
                    style={{ background: T.bgSub, border: `1px solid ${T.border}` }}
                    onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)}
                    onMouseLeave={e => (e.currentTarget.style.background = T.bgSub)}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: AC.pinkBg }}>
                      <FileText className="w-4 h-4" style={{ color: AC.pink }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12.5px] font-semibold truncate" style={{ color: T.text }}>{r.title}</p>
                      <p className="text-[10.5px]" style={{ color: T.textMuted }}>{r.type} · {r.when}</p>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0"
                      style={{
                        background: r.score >= 80 ? AC.greenBg : AC.amberBg,
                        color: r.score >= 80 ? AC.green : AC.amber,
                        border: `1px solid ${r.score >= 80 ? AC.greenBdr : AC.amberBdr}`,
                      }}>{r.score}</span>
                    <ChevronRight className="w-4 h-4 shrink-0" style={{ color: T.textMuted }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-[14px] font-bold mb-3" style={{ color: T.text }}>Suggested Practice</h3>
            <div className="space-y-2.5">
              {SUGGESTIONS.map((s, i) => (
                <div key={i} onClick={() => onNavigate?.('recommendations')}
                  className="flex items-start gap-2.5 p-3.5 rounded-2xl cursor-pointer transition-colors"
                  style={{ background: T.bgSub, border: `1px solid ${T.border}` }}
                  onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)}
                  onMouseLeave={e => (e.currentTarget.style.background = T.bgSub)}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: AC.violetBg }}>
                    <s.icon className="w-3.5 h-3.5" style={{ color: AC.violet }} />
                  </div>
                  <div>
                    <p className="text-[11.5px] leading-relaxed mb-1.5" style={{ color: T.textSub }}>{s.text}</p>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: AC.violetBg, color: AC.violet }}>{s.tag}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Practice categories ── */}
        <div>
          <h3 className="text-[14px] font-bold mb-3" style={{ color: T.text }}>Practice Categories</h3>
          <div className="grid grid-cols-5 gap-3 max-[900px]:grid-cols-3 max-[560px]:grid-cols-2">
            {CATEGORIES.map(c => (
              <button key={c.label} onClick={() => onNavigate?.(c.id)}
                className="group relative rounded-2xl overflow-hidden text-left cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5"
                style={{ border: `1px solid ${T.border}`, minHeight: 132 }}>
                <div className="absolute inset-0" style={{ background: c.gradient }} />
                <div className="relative z-10 p-4 flex flex-col justify-between h-full">
                  <c.icon className="w-5 h-5 transition-transform group-hover:scale-110" style={{ color: T.text }} />
                  <div>
                    <p className="text-[13px] font-bold" style={{ color: T.text }}>{c.label}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: T.textMuted }}>{c.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
