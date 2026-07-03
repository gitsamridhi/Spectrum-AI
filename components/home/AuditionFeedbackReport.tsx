'use client';

import React, { useState } from 'react';
import {
  Smile, Mic2, PersonStanding, MessageSquare, Eye, AudioLines, Zap, Gauge,
  CheckCircle2, AlertCircle, Sparkles, ChevronDown, Clock, FileText,
  TrendingUp, Download, Share2, Star, Check,
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

const AC = {
  pink: '#EC4899', pinkBg: 'rgba(236,72,153,0.10)', pinkBdr: 'rgba(236,72,153,0.28)',
  violet: '#A855F7', violetBg: 'rgba(168,85,247,0.10)', violetBdr: 'rgba(168,85,247,0.28)',
  amber: '#F59E0B', amberBg: 'rgba(245,158,11,0.10)', amberBdr: 'rgba(245,158,11,0.28)',
  green: '#10B981', greenBg: 'rgba(16,185,129,0.10)', greenBdr: 'rgba(16,185,129,0.28)',
  red:   '#EF4444', redBg:   'rgba(239,68,68,0.10)',   redBdr:   'rgba(239,68,68,0.28)',
};

const OVERALL_SCORE = 78;
const SCORE_HISTORY  = [58, 63, 66, 69, 71, 74, 75, 78];

const SUB_SCORES = [
  { id: 'confidence', label: 'Confidence',     icon: Smile,          score: 82, navId: undefined,     detail: 'Your posture and vocal steadiness project strong self-assurance, especially in the opening 20 seconds.' },
  { id: 'voice',      label: 'Voice',          icon: Mic2,           score: 75, navId: 'voice',        detail: 'Tone stayed warm throughout, though pacing sped up under the harder questions. See the full voice report.' },
  { id: 'body',       label: 'Body Language',  icon: PersonStanding, score: 68, navId: 'body',         detail: 'Gestures were natural, but shoulders tensed during the second question. Full breakdown in the body language report.' },
  { id: 'delivery',   label: 'Delivery',       icon: MessageSquare,  score: 79, navId: undefined,     detail: 'Answers were structured with clear beginnings and endings — a noticeable improvement from last session.' },
  { id: 'eye',        label: 'Eye Contact',    icon: Eye,            score: 71, navId: undefined,     detail: 'Eye contact dipped while recalling details. Try anchoring on a fixed point just beside the lens.' },
  { id: 'clarity',    label: 'Clarity',        icon: AudioLines,     score: 85, navId: 'voice',        detail: 'Articulation was crisp with minimal mumbling — your strongest metric this session.' },
  { id: 'energy',     label: 'Energy',         icon: Zap,            score: 88, navId: undefined,     detail: 'Consistently upbeat energy that matched the tone of every question asked.' },
  { id: 'pacing',     label: 'Pacing',         icon: Gauge,          score: 64, navId: 'voice',        detail: 'Speaking speed increased noticeably in the back half — a common pressure response worth practicing.' },
];

const STRENGTHS = [
  'Strong, confident opening that immediately established presence.',
  'Clear structure in every answer — setup, story, takeaway.',
  'Consistent energy that matched the tone of each question.',
  'Recovered smoothly after a brief pause in question 4.',
];

const IMPROVEMENTS = [
  'Pacing accelerates under pressure — practice deliberate pauses.',
  'Eye contact drops when recalling specific details or numbers.',
  'A few filler words ("um", "like") clustered in the middle section.',
  'Shoulders tense slightly during more challenging questions.',
];

const SUGGESTIONS = [
  { icon: Sparkles, text: 'Try the Breathing Drill before your next take to steady your pacing under pressure.', tag: 'Delivery' },
  { icon: Eye,      text: 'Practice with Teleprompter Mode to build a steadier anchor point for eye contact.',    tag: 'Eye Contact' },
  { icon: Mic2,     text: 'Run a dedicated Voice Practice session to target filler-word reduction.',             tag: 'Voice' },
];

const KEY_MOMENTS = [
  { t: 4,   label: 'Strong opening hook',                 type: 'strength'    as const },
  { t: 38,  label: 'Filler word cluster ("um, like")',     type: 'improvement' as const },
  { t: 71,  label: 'Great recovery after a pause',          type: 'strength'    as const },
  { t: 98,  label: 'Eye contact dipped while recalling data', type: 'improvement' as const },
  { t: 132, label: 'Confident, clear closing statement',    type: 'strength'    as const },
];
const TOTAL_SECONDS = 150;

function fmt(sec: number) {
  const m = Math.floor(sec / 60), s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function ScoreMeter({ score, size = 176 }: { score: number; size?: number }) {
  const { T } = useTheme();
  const R = (size - 26) / 2, C = 2 * Math.PI * R, off = C * (1 - score / 100), cx = size / 2;
  const col = score >= 85 ? AC.green : score >= 65 ? AC.pink : AC.amber;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={cx} cy={cx} r={R} fill="none" strokeWidth={12} style={{ stroke: T.bgCard }} />
        <circle cx={cx} cy={cx} r={R} fill="none" strokeWidth={12} stroke={col} strokeDasharray={C} strokeDashoffset={off}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-[38px] font-black leading-none tracking-[-0.05em]" style={{ color: col }}>{score}</span>
        <span className="text-[11px] font-semibold mt-1" style={{ color: T.textMuted }}>/100</span>
      </div>
    </div>
  );
}

export default function AuditionFeedbackReport({ onNavigate }: { onNavigate?: (id: string) => void }) {
  const { T } = useTheme();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [exported, setExported] = useState(false);
  const [shared,   setShared]   = useState(false);

  const scoreColor = (s: number) => s >= 85 ? AC.green : s >= 65 ? AC.pink : AC.amber;
  const scoreBg    = (s: number) => s >= 85 ? AC.greenBg : s >= 65 ? AC.pinkBg : AC.amberBg;

  const handleExport = () => {
    const rows = [
      ['Metric', 'Score'], ['Overall', String(OVERALL_SCORE)],
      ...SUB_SCORES.map(s => [s.label, String(s.score)]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'feedback-report.csv'; a.click();
    URL.revokeObjectURL(url);
    setExported(true); setTimeout(() => setExported(false), 1800);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(`${typeof window !== 'undefined' ? window.location.origin : ''}/audition-coach/reports/mock-interview-today`).catch(() => {});
    setShared(true); setTimeout(() => setShared(false), 1800);
  };

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: T.bg, scrollbarWidth: 'none' }}>
      <div className="px-8 pt-7 pb-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-[22px] font-black tracking-[-0.02em] mb-1" style={{ color: T.text }}>Feedback Report</h1>
            <p className="text-[12px] flex items-center gap-1.5" style={{ color: T.textMuted }}>
              Mock Interview · Behavioral round <span className="w-1 h-1 rounded-full" style={{ background: T.textMuted }} />
              <Clock className="w-3 h-3" /> {fmt(TOTAL_SECONDS)} · Today
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onNavigate?.('transcript')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11.5px] font-semibold cursor-pointer transition-colors"
              style={{ background: T.bgCard, color: T.textSub, border: `1px solid ${T.border}` }}>
              <FileText className="w-3.5 h-3.5" /> Transcript
            </button>
            <button onClick={handleExport}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11.5px] font-semibold cursor-pointer transition-colors"
              style={exported ? { background: AC.greenBg, color: AC.green, border: `1px solid ${AC.greenBdr}` } : { background: T.bgCard, color: T.textSub, border: `1px solid ${T.border}` }}>
              {exported ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />} {exported ? 'Exported' : 'Export'}
            </button>
            <button onClick={handleShare}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11.5px] font-semibold text-white cursor-pointer hover:opacity-90 transition-opacity"
              style={{ background: shared ? AC.green : `linear-gradient(135deg, ${AC.pink}, ${AC.violet})` }}>
              {shared ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />} {shared ? 'Link Copied' : 'Share'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-6 mb-8">
          {/* Overall score + history */}
          <div className="col-span-2 rounded-2xl p-6 flex flex-col items-center gap-4" style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
            <ScoreMeter score={OVERALL_SCORE} />
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full"
              style={{ background: AC.pinkBg, color: AC.pink, border: `1px solid ${AC.pinkBdr}` }}>
              <TrendingUp className="w-3 h-3" /> +16 pts since first session
            </span>

            <div className="w-full mt-1">
              <p className="text-[9px] font-semibold uppercase tracking-widest mb-2.5 text-center" style={{ color: T.textMuted }}>Score History · 8 Sessions</p>
              <div className="flex items-end gap-1.5 justify-center" style={{ height: 44 }}>
                {SCORE_HISTORY.map((v, i) => {
                  const h = Math.round((v / 100) * 44);
                  const isLast = i === SCORE_HISTORY.length - 1;
                  return <div key={i} className="flex-1 rounded-t-sm" style={{ height: h, background: isLast ? AC.pink : T.bgCard, minWidth: 8 }} />;
                })}
              </div>
            </div>
          </div>

          {/* Sub-score grid */}
          <div className="col-span-3 grid grid-cols-4 gap-3">
            {SUB_SCORES.map(s => (
              <div key={s.id} className="rounded-2xl p-3.5 flex flex-col gap-2" style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: scoreBg(s.score) }}>
                  <s.icon className="w-4 h-4" style={{ color: scoreColor(s.score) }} />
                </div>
                <span className="text-[19px] font-black tracking-[-0.03em] leading-none" style={{ color: T.text }}>{s.score}</span>
                <span className="text-[10px] font-medium leading-tight" style={{ color: T.textMuted }}>{s.label}</span>
                <div className="h-1 rounded-full overflow-hidden mt-0.5" style={{ background: T.bgCard }}>
                  <div className="h-full rounded-full" style={{ width: `${s.score}%`, background: scoreColor(s.score) }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="rounded-2xl p-5 mb-8" style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
          <h3 className="text-[13px] font-bold mb-4" style={{ color: T.text }}>Key Moments Timeline</h3>
          <div className="relative h-2 rounded-full mb-2" style={{ background: T.bgCard }}>
            {KEY_MOMENTS.map((m, i) => (
              <button key={i} type="button" onClick={() => onNavigate?.('transcript')} title={`Jump to ${fmt(m.t)} in the transcript`}
                className="group absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer bg-transparent border-0 p-0"
                style={{ left: `${(m.t / TOTAL_SECONDS) * 100}%` }}>
                <div className="w-3 h-3 rounded-full border-2 transition-transform group-hover:scale-125" style={{ background: m.type === 'strength' ? AC.green : AC.amber, borderColor: T.bgSub }} />
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 px-2.5 py-1.5 rounded-lg text-[10px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
                  style={{ background: T.text, color: T.bg }}>
                  {fmt(m.t)} · {m.label}
                </div>
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between text-[10px]" style={{ color: T.textMuted }}>
            <span>0:00</span><span>{fmt(TOTAL_SECONDS)}</span>
          </div>
          <div className="flex items-center gap-4 mt-3">
            <span className="flex items-center gap-1.5 text-[10.5px]" style={{ color: T.textSub }}>
              <span className="w-2 h-2 rounded-full" style={{ background: AC.green }} /> Strength
            </span>
            <span className="flex items-center gap-1.5 text-[10.5px]" style={{ color: T.textSub }}>
              <span className="w-2 h-2 rounded-full" style={{ background: AC.amber }} /> Needs work
            </span>
          </div>
        </div>

        {/* Strengths / Improvements */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="rounded-2xl p-5" style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
            <h4 className="text-[13px] font-bold mb-4 flex items-center gap-1.5" style={{ color: T.text }}>
              <CheckCircle2 className="w-4 h-4" style={{ color: AC.green }} /> Strengths
            </h4>
            <div className="space-y-2.5">
              {STRENGTHS.map((s, i) => (
                <div key={i} className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl" style={{ background: AC.greenBg, border: `1px solid ${AC.greenBdr}` }}>
                  <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: AC.green }} />
                  <p className="text-[11.5px] leading-relaxed" style={{ color: T.textSub }}>{s}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-5" style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
            <h4 className="text-[13px] font-bold mb-4 flex items-center gap-1.5" style={{ color: T.text }}>
              <AlertCircle className="w-4 h-4" style={{ color: AC.amber }} /> Improvements
            </h4>
            <div className="space-y-2.5">
              {IMPROVEMENTS.map((s, i) => (
                <div key={i} className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl" style={{ background: AC.amberBg, border: `1px solid ${AC.amberBdr}` }}>
                  <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: AC.amber }} />
                  <p className="text-[11.5px] leading-relaxed" style={{ color: T.textSub }}>{s}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="rounded-2xl p-5 mb-8" style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[13px] font-bold flex items-center gap-1.5" style={{ color: T.text }}>
              <Sparkles className="w-4 h-4" style={{ color: AC.violet }} /> AI Suggestions
            </h4>
            <span className="text-[9px] font-bold px-2.5 py-1 rounded-full" style={{ background: AC.violetBg, color: AC.violet, border: `1px solid ${AC.violetBdr}` }}>
              {SUGGESTIONS.length} actions
            </span>
          </div>
          <div className="space-y-2.5">
            {SUGGESTIONS.map((s, i) => (
              <div key={i} onClick={() => onNavigate?.('recommendations')}
                className="flex items-start gap-3 p-3.5 rounded-xl cursor-pointer transition-colors"
                style={{ background: T.bg, border: `1px solid ${T.border}` }}
                onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)}
                onMouseLeave={e => (e.currentTarget.style.background = T.bg)}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: AC.violetBg }}>
                  <s.icon className="w-3.5 h-3.5" style={{ color: AC.violet }} />
                </div>
                <p className="flex-1 text-[11.5px] leading-relaxed pt-0.5" style={{ color: T.textSub }}>{s.text}</p>
                <span className="text-[9px] font-bold shrink-0 px-2 py-1 rounded-full mt-0.5" style={{ background: T.bgCard, color: T.textMuted, border: `1px solid ${T.border}` }}>
                  {s.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Expandable per-metric detail */}
        <div>
          <h4 className="text-[13px] font-bold mb-3 flex items-center gap-1.5" style={{ color: T.text }}>
            <Star className="w-4 h-4" style={{ color: AC.pink }} /> Full Breakdown
          </h4>
          <div className="space-y-2">
            {SUB_SCORES.map(s => {
              const isOpen = expanded === s.id;
              return (
                <div key={s.id} className="rounded-2xl overflow-hidden" style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
                  <button onClick={() => setExpanded(isOpen ? null : s.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 cursor-pointer text-left">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: scoreBg(s.score) }}>
                      <s.icon className="w-3.5 h-3.5" style={{ color: scoreColor(s.score) }} />
                    </div>
                    <span className="text-[12.5px] font-semibold flex-1" style={{ color: T.text }}>{s.label}</span>
                    <span className="text-[11.5px] font-bold" style={{ color: scoreColor(s.score) }}>{s.score}%</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} style={{ color: T.textMuted }} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4" style={{ borderTop: `1px solid ${T.border}` }}>
                      <p className="text-[11.5px] leading-relaxed pt-3 mb-3" style={{ color: T.textSub }}>{s.detail}</p>
                      {s.navId && (
                        <button onClick={() => onNavigate?.(s.navId!)}
                          className="text-[11px] font-semibold cursor-pointer" style={{ color: AC.pink }}>
                          View detailed report →
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
