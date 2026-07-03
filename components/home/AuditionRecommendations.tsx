'use client';

import React, { useState } from 'react';
import {
  Mic2, Smile, Video, MessageSquare, Crown, Play, Sparkles, Filter,
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

const AC = {
  pink: '#EC4899', pinkBg: 'rgba(236,72,153,0.10)', pinkBdr: 'rgba(236,72,153,0.28)',
  violet: '#A855F7', violetBg: 'rgba(168,85,247,0.10)', violetBdr: 'rgba(168,85,247,0.28)',
  amber: '#F59E0B', amberBg: 'rgba(245,158,11,0.10)', amberBdr: 'rgba(245,158,11,0.28)',
  green: '#10B981', greenBg: 'rgba(16,185,129,0.10)', greenBdr: 'rgba(16,185,129,0.28)',
};

type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';
const CATEGORY_FILTERS = ['All', 'Voice', 'Confidence', 'Acting', 'Interview', 'Pageant'] as const;

interface Rec {
  id: number; category: typeof CATEGORY_FILTERS[number]; title: string; desc: string;
  duration: string; difficulty: Difficulty; navId: string; icon: React.ElementType;
}

const RECOMMENDATIONS: Rec[] = [
  { id: 1, category: 'Voice',      icon: Mic2,          title: 'Pacing Control Drill',        desc: 'Target the pacing spike your last two sessions flagged, with a metronome-guided reading exercise.', duration: '10 min', difficulty: 'Intermediate', navId: 'interview'  },
  { id: 2, category: 'Voice',      icon: Mic2,          title: 'Filler Word Reduction',       desc: 'Structured pause-training to replace "um" and "like" with confident silence.',                    duration: '8 min',  difficulty: 'Beginner',     navId: 'interview'  },
  { id: 3, category: 'Confidence', icon: Smile,         title: 'Posture & Presence Reset',    desc: 'A short grounding routine to release shoulder tension before high-pressure questions.',           duration: '6 min',  difficulty: 'Beginner',     navId: 'interview'  },
  { id: 4, category: 'Confidence', icon: Smile,         title: 'Eye Contact Anchor Practice', desc: 'Teleprompter-style drill to build a steady focal point and reduce gaze drift.',                   duration: '10 min', difficulty: 'Intermediate', navId: 'interview'  },
  { id: 5, category: 'Acting',     icon: Video,         title: 'Emotional Range Warm-up',     desc: 'Cycle through five emotional beats on the same line to loosen up before a self-tape.',             duration: '12 min', difficulty: 'Intermediate', navId: 'upload'     },
  { id: 6, category: 'Acting',     icon: Video,         title: 'Cold Read Challenge',         desc: 'Sight-read an unfamiliar scene with a 60-second prep window — great for callback prep.',           duration: '15 min', difficulty: 'Advanced',     navId: 'upload'     },
  { id: 7, category: 'Interview',  icon: MessageSquare, title: 'Behavioral Story Bank',       desc: 'Build three go-to stories using the STAR method for common behavioral questions.',                 duration: '20 min', difficulty: 'Intermediate', navId: 'interview'  },
  { id: 8, category: 'Interview',  icon: MessageSquare, title: 'Rapid Q&A Under Pressure',    desc: 'Answer 10 surprise questions back-to-back to build composure under time pressure.',               duration: '15 min', difficulty: 'Advanced',     navId: 'interview'  },
  { id: 9, category: 'Pageant',    icon: Crown,         title: 'Current Events Sprint',       desc: 'Form a confident 30-second opinion on a headline topic, on the clock.',                            duration: '8 min',  difficulty: 'Advanced',     navId: 'pageant'    },
  { id: 10, category: 'Pageant',   icon: Crown,         title: 'Opening Intro Polish',        desc: 'Refine your 30-second self-introduction for stage-ready delivery.',                                duration: '10 min', difficulty: 'Beginner',     navId: 'pageant'    },
];

function DifficultyBadge({ level }: { level: Difficulty }) {
  const map = {
    Beginner:     { c: AC.green, bg: AC.greenBg, bdr: AC.greenBdr },
    Intermediate: { c: AC.amber, bg: AC.amberBg, bdr: AC.amberBdr },
    Advanced:     { c: AC.pink,  bg: AC.pinkBg,  bdr: AC.pinkBdr  },
  } as const;
  const m = map[level];
  return <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full" style={{ background: m.bg, color: m.c, border: `1px solid ${m.bdr}` }}>{level}</span>;
}

export default function AuditionRecommendations({ onNavigate }: { onNavigate?: (id: string) => void }) {
  const { T } = useTheme();
  const [category, setCategory] = useState<typeof CATEGORY_FILTERS[number]>('All');

  const filtered = RECOMMENDATIONS.filter(r => category === 'All' || r.category === category);

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: T.bg, scrollbarWidth: 'none' }}>
      <div className="px-8 pt-7 pb-10">

        <h1 className="text-[22px] font-black tracking-[-0.02em] mb-1 flex items-center gap-2" style={{ color: T.text }}>
          <Sparkles className="w-5 h-5" style={{ color: AC.violet }} /> Recommendations
        </h1>
        <p className="text-[12px] mb-6" style={{ color: T.textMuted }}>Personalized practice picks based on your recent feedback reports.</p>

        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <Filter className="w-3.5 h-3.5 shrink-0" style={{ color: T.textMuted }} />
          {CATEGORY_FILTERS.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className="px-3 py-1.5 rounded-lg text-[11.5px] font-semibold cursor-pointer transition-all"
              style={category === c ? { background: AC.violet, color: '#fff' } : { background: T.bgCard, color: T.textSub, border: `1px solid ${T.border}` }}>
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {filtered.map(r => (
            <div key={r.id} className="rounded-2xl p-5 flex flex-col gap-3" style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
              <div className="flex items-start justify-between gap-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: AC.violetBg }}>
                  <r.icon className="w-4 h-4" style={{ color: AC.violet }} />
                </div>
                <DifficultyBadge level={r.difficulty} />
              </div>
              <div>
                <h3 className="text-[13.5px] font-bold mb-1" style={{ color: T.text }}>{r.title}</h3>
                <p className="text-[11.5px] leading-relaxed" style={{ color: T.textMuted }}>{r.desc}</p>
              </div>
              <div className="flex items-center justify-between mt-auto pt-1">
                <span className="text-[10.5px] font-medium px-2 py-1 rounded-full" style={{ background: T.bgCard, color: T.textSub }}>{r.duration} · {r.category}</span>
                <button onClick={() => onNavigate?.(r.navId)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[11px] font-bold text-white cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ background: `linear-gradient(135deg, ${AC.pink}, ${AC.violet})` }}>
                  <Play className="w-3 h-3 fill-current" /> Start Practice
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
