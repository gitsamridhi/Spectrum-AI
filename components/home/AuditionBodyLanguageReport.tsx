'use client';

import React from 'react';
import {
  PersonStanding, HandMetal, Eye, ScanFace, Camera, Sparkles,
  AlertCircle, CheckCircle2,
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

const AC = {
  pink: '#EC4899', pinkBg: 'rgba(236,72,153,0.10)', pinkBdr: 'rgba(236,72,153,0.28)',
  violet: '#A855F7', violetBg: 'rgba(168,85,247,0.10)', violetBdr: 'rgba(168,85,247,0.28)',
  amber: '#F59E0B', amberBg: 'rgba(245,158,11,0.10)', amberBdr: 'rgba(245,158,11,0.28)',
  green: '#10B981', greenBg: 'rgba(16,185,129,0.10)', greenBdr: 'rgba(16,185,129,0.28)',
};

const METRICS = [
  { label: 'Posture',              icon: PersonStanding, score: 74 },
  { label: 'Gestures',              icon: HandMetal,      score: 81 },
  { label: 'Eye Contact',           icon: Eye,             score: 68 },
  { label: 'Facial Expressions',    icon: ScanFace,        score: 87 },
  { label: 'Camera Presence',       icon: Camera,          score: 79 },
];

const TIMELINE = [
  { t: 6,   label: 'Strong, open posture at the start', type: 'strength'    as const },
  { t: 41,  label: 'Shoulders tensed under pressure',    type: 'improvement' as const },
  { t: 84,  label: 'Natural hand gestures while explaining', type: 'strength' as const },
  { t: 112, label: 'Eye contact dropped while recalling detail', type: 'improvement' as const },
  { t: 138, label: 'Relaxed, confident closing posture', type: 'strength'    as const },
];
const TOTAL_SECONDS = 150;

const IMPROVEMENTS = [
  { icon: PersonStanding, text: 'Shoulders rise slightly when answering harder questions — a grounding breath before responding can help.', tag: 'Posture' },
  { icon: Eye,            text: 'Eye contact breaks most often while recalling specific facts — practice anchoring on one point during those moments.', tag: 'Eye Contact' },
  { icon: HandMetal,      text: 'Gestures occasionally happen below frame — keep hand movement within the upper two-thirds of the shot.', tag: 'Gestures' },
];

function fmt(sec: number) {
  const m = Math.floor(sec / 60), s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function AuditionBodyLanguageReport({ onNavigate }: { onNavigate?: (id: string) => void }) {
  const { T } = useTheme();
  const scoreColor = (s: number) => s >= 85 ? AC.green : s >= 65 ? AC.pink : AC.amber;
  const scoreBg    = (s: number) => s >= 85 ? AC.greenBg : s >= 65 ? AC.pinkBg : AC.amberBg;

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: T.bg, scrollbarWidth: 'none' }}>
      <div className="px-8 pt-7 pb-10">

        <h1 className="text-[22px] font-black tracking-[-0.02em] mb-1 flex items-center gap-2" style={{ color: T.text }}>
          <PersonStanding className="w-5 h-5" style={{ color: AC.pink }} /> Body Language Report
        </h1>
        <p className="text-[12px] mb-6" style={{ color: T.textMuted }}>Posture, gestures, and presence analysis from your last session.</p>

        {/* Score cards */}
        <div className="grid grid-cols-5 gap-3 mb-8 max-[900px]:grid-cols-3">
          {METRICS.map(m => (
            <div key={m.label} className="rounded-2xl p-4 flex flex-col gap-2.5" style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: scoreBg(m.score) }}>
                <m.icon className="w-4 h-4" style={{ color: scoreColor(m.score) }} />
              </div>
              <span className="text-[20px] font-black tracking-[-0.03em] leading-none" style={{ color: T.text }}>{m.score}</span>
              <span className="text-[10.5px] font-medium leading-tight" style={{ color: T.textMuted }}>{m.label}</span>
              <div className="h-1 rounded-full overflow-hidden mt-0.5" style={{ background: T.bgCard }}>
                <div className="h-full rounded-full" style={{ width: `${m.score}%`, background: scoreColor(m.score) }} />
              </div>
            </div>
          ))}
        </div>

        {/* Illustration placeholders */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { title: 'Posture Overlay',   desc: 'Full-body pose skeleton overlay',    icon: PersonStanding },
            { title: 'Gesture Heatmap',   desc: 'Hand movement density across frame', icon: HandMetal      },
            { title: 'Gaze Tracking',     desc: 'Eye-line focus points over time',     icon: Eye            },
          ].map(p => (
            <div key={p.title} className="rounded-2xl overflow-hidden relative flex flex-col items-center justify-center gap-3 py-9"
              style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.08), rgba(168,85,247,0.08))', border: `1px dashed ${T.border}` }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: T.bgCard }}>
                <p.icon className="w-6 h-6" style={{ color: T.textMuted }} />
              </div>
              <div className="text-center px-4">
                <p className="text-[12px] font-bold" style={{ color: T.text }}>{p.title}</p>
                <p className="text-[10.5px] mt-1" style={{ color: T.textMuted }}>{p.desc}</p>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ background: T.bgCard, color: T.textMuted, border: `1px solid ${T.border}` }}>
                Visualization coming soon
              </span>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="rounded-2xl p-5 mb-8" style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
          <h3 className="text-[13px] font-bold mb-4" style={{ color: T.text }}>Presence Timeline</h3>
          <div className="relative h-2 rounded-full mb-2" style={{ background: T.bgCard }}>
            {TIMELINE.map((m, i) => (
              <button key={i} type="button" onClick={() => onNavigate?.('transcript')} title={`Jump to ${fmt(m.t)} in the transcript`}
                className="group absolute top-1/2 -translate-y-1/2 -translate-x-1/2 cursor-pointer bg-transparent border-0 p-0" style={{ left: `${(m.t / TOTAL_SECONDS) * 100}%` }}>
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
              <span className="w-2 h-2 rounded-full" style={{ background: AC.green }} /> Strong presence
            </span>
            <span className="flex items-center gap-1.5 text-[10.5px]" style={{ color: T.textSub }}>
              <span className="w-2 h-2 rounded-full" style={{ background: AC.amber }} /> Needs attention
            </span>
          </div>
        </div>

        {/* Strength / improvement note strip */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="rounded-2xl p-4 flex items-start gap-3" style={{ background: AC.greenBg, border: `1px solid ${AC.greenBdr}` }}>
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: AC.green }} />
            <p className="text-[11.5px] leading-relaxed" style={{ color: T.textSub }}>
              Facial expressiveness was consistently strong — your reactions read as genuine and engaged throughout.
            </p>
          </div>
          <div className="rounded-2xl p-4 flex items-start gap-3" style={{ background: AC.amberBg, border: `1px solid ${AC.amberBdr}` }}>
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: AC.amber }} />
            <p className="text-[11.5px] leading-relaxed" style={{ color: T.textSub }}>
              Eye contact was the weakest metric this session — worth focused practice before your next take.
            </p>
          </div>
        </div>

        {/* Improvement cards */}
        <div className="rounded-2xl p-5" style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
          <h4 className="text-[13px] font-bold mb-4 flex items-center gap-1.5" style={{ color: T.text }}>
            <Sparkles className="w-4 h-4" style={{ color: AC.violet }} /> Improvement Suggestions
          </h4>
          <div className="space-y-2.5">
            {IMPROVEMENTS.map((r, i) => (
              <div key={i} onClick={() => onNavigate?.('recommendations')}
                className="flex items-start gap-3 p-3.5 rounded-xl cursor-pointer transition-colors"
                style={{ background: T.bg, border: `1px solid ${T.border}` }}
                onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)}
                onMouseLeave={e => (e.currentTarget.style.background = T.bg)}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: AC.violetBg }}>
                  <r.icon className="w-3.5 h-3.5" style={{ color: AC.violet }} />
                </div>
                <p className="flex-1 text-[11.5px] leading-relaxed pt-0.5" style={{ color: T.textSub }}>{r.text}</p>
                <span className="text-[9px] font-bold shrink-0 px-2 py-1 rounded-full mt-0.5" style={{ background: T.bgCard, color: T.textMuted, border: `1px solid ${T.border}` }}>
                  {r.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
