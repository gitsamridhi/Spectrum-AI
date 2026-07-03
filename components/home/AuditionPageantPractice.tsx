'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Shuffle, Crown, Clock, Lock, Sparkles, Mic, Square, History, CheckCircle2,
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

const AC = {
  pink: '#EC4899', pinkBg: 'rgba(236,72,153,0.10)', pinkBdr: 'rgba(236,72,153,0.28)',
  violet: '#A855F7', violetBg: 'rgba(168,85,247,0.10)', violetBdr: 'rgba(168,85,247,0.28)',
  amber: '#F59E0B', amberBg: 'rgba(245,158,11,0.10)', amberBdr: 'rgba(245,158,11,0.28)',
  green: '#10B981', greenBg: 'rgba(16,185,129,0.10)', greenBdr: 'rgba(16,185,129,0.28)',
};

const CATEGORIES = ['Opening Intro', 'Current Events', 'Platform Q&A', 'Personal Story', 'Hypothetical', 'Rapid Fire'] as const;

const QUESTION_BANK: Record<typeof CATEGORIES[number], string[]> = {
  'Opening Intro':   ['Introduce yourself to the judges in 30 seconds.', 'What is one word your friends would use to describe you, and why?'],
  'Current Events':  ['What global issue do you think deserves more attention this year?', 'How should communities respond to the rise of AI in daily life?'],
  'Platform Q&A':    ['Tell us about your platform and the impact you hope to create.', 'How would you bring your platform to a rural community with limited resources?'],
  'Personal Story':  ['Describe a moment that changed how you see the world.', 'What is the biggest challenge you have overcome?'],
  'Hypothetical':    ['If you won the title today, what would your first action be?', 'If you could change one law, what would it be and why?'],
  'Rapid Fire':      ['Mountains or ocean — and why?', 'What is your personal motto in five words or fewer?'],
};

const INITIAL_HISTORY = [
  { question: 'What legacy do you want to leave behind?', category: 'Personal Story', score: 84, duration: '0:52', when: 'Yesterday' },
  { question: 'Mountains or ocean — and why?',             category: 'Rapid Fire',     score: 76, duration: '0:24', when: '2 days ago' },
];

const ANSWER_SECONDS = 45;

function pickQuestion(cat: typeof CATEGORIES[number]) {
  const bank = QUESTION_BANK[cat];
  return bank[Math.floor(Math.random() * bank.length)];
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60), s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function AuditionPageantPractice({ onNavigate }: { onNavigate?: (id: string) => void }) {
  const { T } = useTheme();
  const [category, setCategory] = useState<typeof CATEGORIES[number]>('Opening Intro');
  const [question, setQuestion] = useState(() => pickQuestion('Opening Intro'));
  const [phase,    setPhase]    = useState<'ready' | 'answering' | 'analyzing' | 'done'>('ready');
  const [timeLeft, setTimeLeft] = useState(ANSWER_SECONDS);
  const [elapsed,  setElapsed]  = useState(0);
  const [confidence, setConfidence] = useState(0);
  const [history,  setHistory]  = useState(INITIAL_HISTORY);

  const finishAnswer = () => {
    setPhase('analyzing');
    setTimeout(() => {
      const score = Math.floor(60 + Math.random() * 35);
      setConfidence(score);
      setHistory(h => [{ question, category, score, duration: formatTime(elapsed || ANSWER_SECONDS - timeLeft), when: 'Just now' }, ...h]);
      setPhase('done');
    }, 1200);
  };

  useEffect(() => {
    if (phase !== 'answering') return;
    const id = setInterval(() => {
      setElapsed(e => e + 1);
      setTimeLeft(t => {
        if (t <= 1) { finishAnswer(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const shuffle = (cat = category) => {
    setQuestion(pickQuestion(cat));
    setPhase('ready'); setTimeLeft(ANSWER_SECONDS); setElapsed(0); setConfidence(0);
  };

  const selectCategory = (cat: typeof CATEGORIES[number]) => { setCategory(cat); shuffle(cat); };
  const pctLeft = (timeLeft / ANSWER_SECONDS) * 100;
  const confColor = confidence >= 80 ? AC.green : confidence >= 60 ? AC.amber : AC.pink;

  const avgScore = useMemo(() => Math.round(history.reduce((a, h) => a + h.score, 0) / (history.length || 1)), [history]);

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: T.bg, scrollbarWidth: 'none' }}>
      <div className="px-8 pt-7 pb-10">

        <div className="flex items-center justify-between mb-1">
          <h1 className="text-[22px] font-black tracking-[-0.02em] flex items-center gap-2" style={{ color: T.text }}>
            <Crown className="w-5 h-5" style={{ color: AC.amber }} /> Pageant Practice
          </h1>
          <span className="text-[11px] font-semibold" style={{ color: T.textMuted }}>Avg. confidence: <strong style={{ color: T.text }}>{avgScore}</strong></span>
        </div>
        <p className="text-[12px] mb-6" style={{ color: T.textMuted }}>Answer surprise questions on the clock — just like the real stage.</p>

        {/* Category chips */}
        <div className="flex items-center gap-2 flex-wrap mb-6">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => selectCategory(c)}
              className="px-3 py-1.5 rounded-lg text-[11.5px] font-semibold cursor-pointer transition-all"
              style={category === c ? { background: AC.amber, color: '#fff' } : { background: T.bgCard, color: T.textSub, border: `1px solid ${T.border}` }}>
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* ── Main: question + timer ── */}
          <div className="col-span-2 flex flex-col gap-5">
            <div className="rounded-2xl p-7 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.14), rgba(236,72,153,0.10))', border: `1px solid ${T.border}` }}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ background: AC.amberBg, color: AC.amber, border: `1px solid ${AC.amberBdr}` }}>
                  {category}
                </span>
                <button onClick={() => shuffle()}
                  className="flex items-center gap-1.5 text-[11.5px] font-semibold cursor-pointer transition-colors" style={{ color: T.textSub }}>
                  <Shuffle className="w-3.5 h-3.5" /> Shuffle
                </button>
              </div>
              <p className="text-[20px] font-bold leading-snug mb-6" style={{ color: T.text }}>{question}</p>

              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5" style={{ color: T.textMuted }}>
                  <Clock className="w-3 h-3" /> Time to answer
                </span>
                <span className="text-[15px] font-bold" style={{ color: timeLeft <= 10 && phase === 'answering' ? '#EF4444' : T.text }}>{formatTime(timeLeft)}</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden mb-6" style={{ background: T.bgCard }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${pctLeft}%`, background: timeLeft <= 10 && phase === 'answering' ? '#EF4444' : `linear-gradient(90deg, ${AC.amber}, ${AC.pink})` }} />
              </div>

              {phase === 'ready' && (
                <button onClick={() => setPhase('answering')}
                  className="w-full py-3 rounded-xl text-[13px] font-bold text-white cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  style={{ background: `linear-gradient(135deg, ${AC.amber}, ${AC.pink})` }}>
                  <Mic className="w-4 h-4" /> Start Answering
                </button>
              )}
              {phase === 'answering' && (
                <button onClick={finishAnswer}
                  className="w-full py-3 rounded-xl text-[13px] font-bold text-white cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center gap-2 animate-pulse"
                  style={{ background: '#EF4444' }}>
                  <Square className="w-3.5 h-3.5 fill-current" /> I&apos;m Done Answering
                </button>
              )}
              {phase === 'analyzing' && (
                <div className="w-full py-3 rounded-xl text-[13px] font-bold text-center" style={{ background: T.bgCard, color: T.textMuted }}>
                  Analyzing your response…
                </div>
              )}
              {phase === 'done' && (
                <button onClick={() => shuffle()}
                  className="w-full py-3 rounded-xl text-[13px] font-bold cursor-pointer transition-colors flex items-center justify-center gap-2"
                  style={{ background: T.bgCard, color: T.textSub, border: `1px solid ${T.border}` }}>
                  <Shuffle className="w-3.5 h-3.5" /> Next Question
                </button>
              )}
            </div>

            {/* Answer history */}
            <div>
              <h3 className="text-[13px] font-bold mb-3 flex items-center gap-1.5" style={{ color: T.text }}>
                <History className="w-3.5 h-3.5" /> Answer History
              </h3>
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-10 rounded-2xl" style={{ background: T.bgSub, border: `1px dashed ${T.border}` }}>
                  <p className="text-[12px]" style={{ color: T.textMuted }}>No answers yet — your first response will appear here.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {history.map((h, i) => (
                    <div key={i} className="flex items-center gap-3.5 px-4 py-3 rounded-2xl" style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: AC.amberBg }}>
                        <Crown className="w-3.5 h-3.5" style={{ color: AC.amber }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold truncate" style={{ color: T.text }}>{h.question}</p>
                        <p className="text-[10.5px]" style={{ color: T.textMuted }}>{h.category} · {h.duration} · {h.when}</p>
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0"
                        style={{ background: h.score >= 80 ? AC.greenBg : AC.amberBg, color: h.score >= 80 ? AC.green : AC.amber, border: `1px solid ${h.score >= 80 ? AC.greenBdr : AC.amberBdr}` }}>
                        {h.score}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Confidence meter placeholder ── */}
          <div className="rounded-2xl p-6 flex flex-col items-center text-center h-fit" style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
            <h4 className="text-[11px] font-bold uppercase tracking-widest mb-5" style={{ color: T.textMuted }}>AI Confidence Analysis</h4>
            <div className="relative mb-4" style={{ width: 140, height: 140 }}>
              <svg width={140} height={140} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={70} cy={70} r={58} fill="none" strokeWidth={10} style={{ stroke: T.bgCard }} />
                {phase === 'done' && (
                  <circle cx={70} cy={70} r={58} fill="none" strokeWidth={10} stroke={confColor}
                    strokeDasharray={2 * Math.PI * 58} strokeDashoffset={2 * Math.PI * 58 * (1 - confidence / 100)}
                    strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)' }} />
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {phase === 'done' ? (
                  <>
                    <span className="text-[30px] font-black leading-none" style={{ color: confColor }}>{confidence}</span>
                    <span className="text-[9px] font-semibold mt-0.5" style={{ color: T.textMuted }}>/100</span>
                  </>
                ) : (
                  <Lock className="w-6 h-6" style={{ color: T.textMuted }} />
                )}
              </div>
            </div>
            {phase === 'done' ? (
              <div className="w-full space-y-2">
                {[['Poise', confidence + 4 > 100 ? 100 : confidence + 4], ['Clarity', confidence - 6], ['Composure', confidence + 2 > 100 ? 100 : confidence + 2]].map(([label, val]) => (
                  <div key={label as string} className="flex items-center gap-2">
                    <span className="text-[10px] w-16 text-left shrink-0" style={{ color: T.textMuted }}>{label}</span>
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: T.bgCard }}>
                      <div className="h-full rounded-full" style={{ width: `${val}%`, background: confColor }} />
                    </div>
                  </div>
                ))}
                <p className="text-[10.5px] mt-3 flex items-center justify-center gap-1.5" style={{ color: AC.green }}>
                  <CheckCircle2 className="w-3 h-3" /> Analysis complete
                </p>
              </div>
            ) : (
              <p className="text-[11px] leading-relaxed" style={{ color: T.textMuted }}>
                {phase === 'answering' ? 'Listening to your answer…' : phase === 'analyzing' ? 'Crunching the numbers…' : 'Complete an answer to unlock your poise, clarity, and composure analysis.'}
              </p>
            )}

            <div className="w-full mt-5 pt-5 flex items-center gap-2 justify-center" style={{ borderTop: `1px solid ${T.border}` }}>
              <Sparkles className="w-3.5 h-3.5" style={{ color: AC.violet }} />
              <button onClick={() => onNavigate?.('feedback')} className="text-[11px] font-semibold cursor-pointer" style={{ color: AC.violet }}>
                View full feedback report →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
