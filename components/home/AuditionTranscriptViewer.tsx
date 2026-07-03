'use client';

import React, { useState, useRef, useMemo } from 'react';
import {
  Search, Copy, CheckCheck, MessageSquare, AlertCircle, CheckCircle2, Play, Pause,
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

const AC = {
  pink: '#EC4899', pinkBg: 'rgba(236,72,153,0.10)', pinkBdr: 'rgba(236,72,153,0.28)',
  violet: '#A855F7', violetBg: 'rgba(168,85,247,0.10)',
  amber: '#F59E0B', amberBg: 'rgba(245,158,11,0.10)', amberBdr: 'rgba(245,158,11,0.28)',
  green: '#10B981', greenBg: 'rgba(16,185,129,0.10)', greenBdr: 'rgba(16,185,129,0.28)',
};

interface Line { t: number; speaker: 'You' | 'Coach'; text: string; feedback?: 'strength' | 'improvement'; comment?: string }

const TRANSCRIPT: Line[] = [
  { t: 0,   speaker: 'Coach', text: 'Tell me about yourself and what draws you to this role.' },
  { t: 4,   speaker: 'You',   text: 'Sure — I have spent the last four years training in physical theatre and voice work, and what draws me here is the chance to combine both disciplines.', feedback: 'strength', comment: 'Strong, confident opening — great pacing.' },
  { t: 22,  speaker: 'You',   text: 'Um, I think, like, my biggest strength is really adapting quickly on set.', feedback: 'improvement', comment: 'Filler words clustered here — try pausing instead.' },
  { t: 38,  speaker: 'Coach', text: 'Describe a time you had to adapt quickly to a change on set.' },
  { t: 43,  speaker: 'You',   text: 'During a student film, the director rewrote my scene ten minutes before we shot it, and I had to re-block my blocking on the spot.' },
  { t: 71,  speaker: 'You',   text: 'I paused, took a breath, and just trusted the given circumstances of the scene.', feedback: 'strength', comment: 'Great recovery — the pause reads as composure, not hesitation.' },
  { t: 98,  speaker: 'You',   text: 'It was, uh, around three, no, four takes before we got the timing the way the director wanted, I think.', feedback: 'improvement', comment: 'Eye contact dropped here while recalling the number of takes.' },
  { t: 132, speaker: 'You',   text: 'Overall, that experience taught me that flexibility is just as important as preparation.', feedback: 'strength', comment: 'Confident, clear closing statement.' },
];

const VIDEO_SRC = 'https://static.higgsfield.ai/ai-video-v2/example-3-mini.mp4';

function fmt(sec: number) {
  const m = Math.floor(sec / 60), s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

function highlight(text: string, term: string) {
  if (!term) return text;
  const idx = text.toLowerCase().indexOf(term.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: AC.amberBg, color: AC.amber, borderRadius: 3, padding: '0 2px' }}>{text.slice(idx, idx + term.length)}</mark>
      {text.slice(idx + term.length)}
    </>
  );
}

export default function AuditionTranscriptViewer({ onNavigate: _onNavigate }: { onNavigate?: (id: string) => void }) {
  const { T } = useTheme();
  const [search,  setSearch]  = useState('');
  const [copied,  setCopied]  = useState(false);
  const [playing, setPlaying] = useState(false);
  const [current,  setCurrent] = useState(0);
  const [activeComment, setActiveComment] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const filtered = useMemo(() => TRANSCRIPT.filter(l => !search || l.text.toLowerCase().includes(search.toLowerCase())), [search]);

  const jumpTo = (t: number) => {
    if (videoRef.current) { videoRef.current.currentTime = t; videoRef.current.play().catch(() => {}); setPlaying(true); }
  };

  const togglePlay = () => {
    const v = videoRef.current; if (!v) return;
    if (v.paused) { v.play().catch(() => {}); setPlaying(true); } else { v.pause(); setPlaying(false); }
  };

  const copyTranscript = () => {
    const text = TRANSCRIPT.map(l => `[${fmt(l.t)}] ${l.speaker}: ${l.text}`).join('\n');
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(true); setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="flex-1 flex overflow-hidden" style={{ background: T.bg }}>

      {/* ── LEFT: video player ── */}
      <div className="w-[46%] shrink-0 flex flex-col p-6" style={{ borderRight: `1px solid ${T.border}` }}>
        <div className="relative rounded-2xl overflow-hidden mb-4" style={{ background: '#000', aspectRatio: '16/9' }}>
          <video ref={videoRef} src={VIDEO_SRC} className="absolute inset-0 w-full h-full object-cover"
            onTimeUpdate={e => setCurrent(e.currentTarget.currentTime)}
            onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
          <button onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center cursor-pointer transition-opacity"
            style={{ background: playing ? 'transparent' : 'rgba(0,0,0,0.25)' }}>
            {!playing && (
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.92)' }}>
                <Play className="w-5 h-5 fill-current text-zinc-900 translate-x-0.5" />
              </div>
            )}
          </button>
          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2.5">
            <button onClick={togglePlay} className="cursor-pointer text-white">
              {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
            <span className="text-[10.5px] font-medium text-white/85 tabular-nums">{fmt(current)}</span>
            <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.25)' }}>
              <div className="h-full rounded-full" style={{ width: `${Math.min(100, (current / 150) * 100)}%`, background: AC.pink }} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-4 flex-1" style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
          <h4 className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: T.textMuted }}>Session Info</h4>
          <div className="space-y-1.5">
            {[['Type', 'Mock Interview'], ['Duration', '2:30'], ['Words spoken', '312'], ['Filler words', '4']].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between">
                <span className="text-[11px]" style={{ color: T.textMuted }}>{k}</span>
                <span className="text-[11px] font-semibold" style={{ color: T.text }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT: transcript ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center gap-3 px-6 pt-6 pb-4 shrink-0">
          <div className="flex-1 flex items-center gap-2 px-3.5 py-2.5 rounded-xl" style={{ background: T.inputBg, border: `1px solid ${T.border}` }}>
            <Search className="w-3.5 h-3.5 shrink-0" style={{ color: T.textMuted }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search transcript…"
              className="flex-1 text-[12.5px] bg-transparent outline-none" style={{ color: T.text }} />
          </div>
          <button onClick={copyTranscript}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-[11.5px] font-semibold cursor-pointer transition-colors shrink-0"
            style={copied ? { background: AC.greenBg, color: AC.green, border: `1px solid ${AC.greenBdr}` } : { background: T.bgCard, color: T.textSub, border: `1px solid ${T.border}` }}>
            {copied ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} {copied ? 'Copied' : 'Copy transcript'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6" style={{ scrollbarWidth: 'none' }}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-16 rounded-2xl" style={{ background: T.bgSub, border: `1px dashed ${T.border}` }}>
              <p className="text-[12px]" style={{ color: T.textMuted }}>No transcript lines match &ldquo;{search}&rdquo;.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filtered.map((line, i) => (
                <div key={i} className="group flex gap-3 px-3 py-2.5 rounded-xl transition-colors relative"
                  style={{
                    background: line.feedback === 'strength' ? AC.greenBg : line.feedback === 'improvement' ? AC.amberBg : 'transparent',
                    borderLeft: line.feedback ? `3px solid ${line.feedback === 'strength' ? AC.green : AC.amber}` : '3px solid transparent',
                  }}>
                  <button onClick={() => jumpTo(line.t)}
                    className="shrink-0 text-[10.5px] font-mono font-bold px-1.5 py-0.5 rounded-md cursor-pointer h-fit transition-colors"
                    style={{ background: T.bgCard, color: AC.pink }}>
                    {fmt(line.t)}
                  </button>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wide mr-2" style={{ color: line.speaker === 'You' ? AC.violet : T.textMuted }}>
                      {line.speaker}
                    </span>
                    <span className="text-[12.5px] leading-relaxed" style={{ color: T.textSub }}>{highlight(line.text, search)}</span>
                  </div>
                  {line.comment && (
                    <div className="relative shrink-0">
                      <button onClick={() => setActiveComment(activeComment === i ? null : i)}
                        className="w-6 h-6 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                        style={{ background: line.feedback === 'strength' ? AC.greenBg : AC.amberBg, color: line.feedback === 'strength' ? AC.green : AC.amber }}>
                        {line.feedback === 'strength' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                      </button>
                      {activeComment === i && (
                        <div className="absolute right-0 top-7 z-10 w-56 p-3 rounded-xl text-[11px] leading-relaxed shadow-xl"
                          style={{ background: T.text, color: T.bg }}>
                          <span className="flex items-center gap-1 font-bold mb-1"><MessageSquare className="w-3 h-3" /> Coach note</span>
                          {line.comment}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
