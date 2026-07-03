'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic, MicOff, Video as VideoIcon, VideoOff, Circle, Pause, Play,
  RotateCcw, SkipForward, CheckCircle2, StickyNote, Sparkles, Clock, Award,
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

const AC = {
  pink: '#EC4899', pinkBg: 'rgba(236,72,153,0.10)', pinkBdr: 'rgba(236,72,153,0.28)',
  violet: '#A855F7', violetBg: 'rgba(168,85,247,0.10)', violetBdr: 'rgba(168,85,247,0.28)',
  amber: '#F59E0B', amberBg: 'rgba(245,158,11,0.10)', amberBdr: 'rgba(245,158,11,0.28)',
  green: '#10B981', greenBg: 'rgba(16,185,129,0.10)', greenBdr: 'rgba(16,185,129,0.28)',
};

const QUESTIONS = [
  { q: 'Tell me about yourself and what draws you to this role.',            cat: 'Warm-up'    },
  { q: 'Describe a time you had to adapt quickly to a change on set or in the room.', cat: 'Behavioral' },
  { q: 'What is your biggest strength as a performer, and how do you show it?', cat: 'Behavioral' },
  { q: 'Tell me about a piece of feedback that was hard to hear but helped you grow.', cat: 'Reflective' },
  { q: 'How do you prepare mentally before walking into an audition room?',    cat: 'Process'    },
  { q: 'Describe a project you are most proud of and why.',                    cat: 'Behavioral' },
  { q: 'Where do you see your craft in the next three years?',                cat: 'Closing'    },
];

const TIPS = [
  'Pause for a beat before answering — it reads as confidence, not hesitation.',
  'Anchor answers in a specific story, not a general statement.',
  'Keep your eyes just beside the lens to simulate natural eye contact.',
  'End answers with a clear conclusion rather than trailing off.',
];

const QUESTION_SECONDS = 90;

function formatTime(sec: number) {
  const m = Math.floor(sec / 60), s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function AuditionLiveMockInterview({ onNavigate }: { onNavigate?: (id: string) => void }) {
  const { T } = useTheme();
  const [idx,        setIdx]        = useState(0);
  const [running,    setRunning]    = useState(true);
  const [timeLeft,   setTimeLeft]   = useState(QUESTION_SECONDS);
  const [elapsed,    setElapsed]    = useState(0);
  const [micOn,      setMicOn]      = useState(true);
  const [camOn,      setCamOn]      = useState(true);
  const [notes,      setNotes]      = useState('');
  const [finished,   setFinished]   = useState(false);
  const notesRef = useRef<HTMLTextAreaElement>(null);

  const total = QUESTIONS.length;
  const question = QUESTIONS[idx];

  useEffect(() => {
    if (!running || finished) return;
    const id = setInterval(() => {
      setElapsed(e => e + 1);
      setTimeLeft(t => {
        if (t <= 1) {
          if (idx < total - 1) { setIdx(i => i + 1); return QUESTION_SECONDS; }
          setFinished(true); return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, finished, idx, total]);

  const skipQuestion = () => {
    if (idx < total - 1) { setIdx(i => i + 1); setTimeLeft(QUESTION_SECONDS); }
    else setFinished(true);
  };
  const restart = () => { setIdx(0); setTimeLeft(QUESTION_SECONDS); setElapsed(0); setFinished(false); setRunning(true); };
  const pctLeft = (timeLeft / QUESTION_SECONDS) * 100;

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative" style={{ background: '#0c0c0f' }}>

      {/* ── Session complete overlay ── */}
      {finished && (
        <div className="absolute inset-0 z-30 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}>
          <div className="max-w-sm w-full mx-4 rounded-3xl p-7 text-center" style={{ background: '#141416', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: AC.greenBg }}>
              <CheckCircle2 className="w-7 h-7" style={{ color: AC.green }} />
            </div>
            <h3 className="text-[17px] font-bold text-white mb-1.5">Session complete</h3>
            <p className="text-[12px] text-white/50 mb-6">You answered {total} questions in {formatTime(elapsed)}. Your AI coach has prepared a full feedback report.</p>
            <div className="flex gap-2.5">
              <button onClick={restart}
                className="flex-1 py-2.5 rounded-xl text-[12px] font-semibold text-white/70 cursor-pointer transition-colors" style={{ background: 'rgba(255,255,255,0.06)' }}>
                Practice Again
              </button>
              <button onClick={() => onNavigate?.('feedback')}
                className="flex-1 py-2.5 rounded-xl text-[12px] font-bold text-white cursor-pointer hover:opacity-90 transition-opacity"
                style={{ background: `linear-gradient(135deg, ${AC.pink}, ${AC.violet})` }}>
                View Feedback Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-6 py-3 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2">
          <span className="text-[12.5px] font-bold text-white">Mock Interview</span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: AC.violetBg, color: '#c4b5fd' }}>{question.cat}</span>
        </div>
        <div className="flex items-center gap-1.5 text-white/40">
          <Clock className="w-3 h-3" /><span className="text-[11px] font-medium">{formatTime(elapsed)} elapsed</span>
        </div>
      </div>

      {/* ── Body: 3 columns ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* ── LEFT: question panel ── */}
        <div className="w-[300px] shrink-0 flex flex-col p-5 gap-5" style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/35">Question {idx + 1} of {total}</span>
            </div>
            <div className="h-1 rounded-full overflow-hidden mb-4" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${((idx) / total) * 100}%`, background: `linear-gradient(90deg, ${AC.pink}, ${AC.violet})` }} />
            </div>
            <p className="text-[17px] font-semibold leading-snug text-white">{question.q}</p>
          </div>

          <div className="mt-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/35">Time to answer</span>
              <span className="text-[13px] font-bold" style={{ color: timeLeft <= 15 ? '#f87171' : '#fff' }}>{formatTime(timeLeft)}</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${pctLeft}%`, background: timeLeft <= 15 ? '#f87171' : AC.green }} />
            </div>
          </div>
        </div>

        {/* ── CENTER: camera preview ── */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
          <div className="relative rounded-2xl overflow-hidden w-full max-w-[560px]" style={{ aspectRatio: '16/10', background: '#000' }}>
            {camOn ? (
              <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-80">
                <source src="https://static.higgsfield.ai/ai-video-v2/example-3-mini.mp4" type="video/mp4" />
              </video>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <VideoOff className="w-8 h-8 text-white/20" />
              </div>
            )}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.35))' }} />
            {running && !finished && (
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: 'rgba(0,0,0,0.55)' }}>
                <Circle className="w-2 h-2 fill-red-500 text-red-500 animate-pulse" />
                <span className="text-[10.5px] font-bold text-white">REC</span>
              </div>
            )}
            <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-3">
              <button onClick={() => setMicOn(m => !m)}
                className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors"
                style={{ background: micOn ? 'rgba(255,255,255,0.14)' : '#f87171' }}>
                {micOn ? <Mic className="w-4 h-4 text-white" /> : <MicOff className="w-4 h-4 text-white" />}
              </button>
              <button onClick={() => setCamOn(c => !c)}
                className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors"
                style={{ background: camOn ? 'rgba(255,255,255,0.14)' : '#f87171' }}>
                {camOn ? <VideoIcon className="w-4 h-4 text-white" /> : <VideoOff className="w-4 h-4 text-white" />}
              </button>
            </div>
          </div>
          <p className="text-[10.5px] text-white/30 mt-3">Your AI coach is listening — speak naturally and take your time.</p>
        </div>

        {/* ── RIGHT: notes + tips + session info ── */}
        <div className="w-[268px] shrink-0 flex flex-col overflow-y-auto p-4 gap-4" style={{ borderLeft: '1px solid rgba(255,255,255,0.06)', scrollbarWidth: 'none' }}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/35 mb-2 flex items-center gap-1.5">
              <StickyNote className="w-3 h-3" /> Notes
            </p>
            <textarea ref={notesRef} value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Jot quick thoughts between questions…" rows={5}
              className="w-full rounded-xl p-3 text-[11.5px] outline-none resize-none text-white/80 placeholder:text-white/25"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/35 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" style={{ color: AC.amber }} /> Practice Tips
            </p>
            <ul className="space-y-2">
              {TIPS.map((t, i) => (
                <li key={i} className="text-[10.5px] leading-relaxed text-white/50 flex items-start gap-1.5">
                  <span className="mt-1 w-1 h-1 rounded-full shrink-0" style={{ background: AC.pink }} />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl p-3.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/35 mb-2.5 flex items-center gap-1.5">
              <Award className="w-3 h-3" /> Session Info
            </p>
            <div className="space-y-1.5">
              {[['Mode', 'Mock Interview'], ['Difficulty', 'Intermediate'], ['Coach persona', 'Casting Director'], ['Mic', micOn ? 'On' : 'Muted']].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between">
                  <span className="text-[10.5px] text-white/40">{k}</span>
                  <span className="text-[10.5px] font-semibold text-white/75">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom controls ── */}
      <div className="flex items-center justify-center gap-3 py-4 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={() => setRunning(r => !r)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[12px] font-semibold text-white cursor-pointer transition-colors"
          style={{ background: 'rgba(255,255,255,0.08)' }}>
          {running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />} {running ? 'Pause' : 'Resume'}
        </button>
        <button onClick={restart}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[12px] font-semibold text-white/70 cursor-pointer transition-colors"
          style={{ background: 'rgba(255,255,255,0.05)' }}>
          <RotateCcw className="w-3.5 h-3.5" /> Restart
        </button>
        <button onClick={skipQuestion}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[12px] font-semibold text-white/70 cursor-pointer transition-colors"
          style={{ background: 'rgba(255,255,255,0.05)' }}>
          <SkipForward className="w-3.5 h-3.5" /> Skip Question
        </button>
        <button onClick={() => setFinished(true)}
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[12px] font-bold text-white cursor-pointer hover:opacity-90 transition-opacity"
          style={{ background: `linear-gradient(135deg, ${AC.pink}, ${AC.violet})` }}>
          <CheckCircle2 className="w-3.5 h-3.5" /> Finish
        </button>
      </div>
    </div>
  );
}
