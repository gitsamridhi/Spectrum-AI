'use client';

import React from 'react';
import {
  Gauge, MessageSquareWarning, Volume2, Waves, Smile, AudioLines,
  Sparkles, TrendingDown, TrendingUp,
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

const AC = {
  pink: '#EC4899', pinkBg: 'rgba(236,72,153,0.10)', pinkBdr: 'rgba(236,72,153,0.28)',
  violet: '#A855F7', violetBg: 'rgba(168,85,247,0.10)', violetBdr: 'rgba(168,85,247,0.28)',
  amber: '#F59E0B', amberBg: 'rgba(245,158,11,0.10)', amberBdr: 'rgba(245,158,11,0.28)',
  green: '#10B981', greenBg: 'rgba(16,185,129,0.10)', greenBdr: 'rgba(16,185,129,0.28)',
};

const SPEED_WPM = 168;
const IDEAL_MIN = 130, IDEAL_MAX = 160, RANGE_MAX = 220;

const FILLER_WORDS = [
  { word: '"um"',      count: 6 },
  { word: '"like"',    count: 4 },
  { word: '"you know"', count: 2 },
  { word: '"so, yeah"', count: 1 },
];

const VOLUME_LEVELS = [42, 55, 48, 63, 58, 71, 66, 52, 60, 74, 69, 57, 49, 62, 68, 54];

const TONE_TRAITS = [
  { label: 'Warmth',        pct: 82 },
  { label: 'Enthusiasm',    pct: 76 },
  { label: 'Assertiveness', pct: 61 },
];

const SPEED_HISTORY = [148, 152, 145, 158, 162, 155, 168];

const RECOMMENDATIONS = [
  { icon: Gauge,               text: 'Your pace runs 8 WPM above the ideal range under pressure — try the Metronome Drill to lock in a steadier rhythm.', tag: 'Pacing' },
  { icon: MessageSquareWarning, text: 'Filler words cluster mid-answer — pause and breathe instead of filling silence with "um" or "like".',              tag: 'Filler Words' },
  { icon: Volume2,             text: 'Volume dipped during your closing statement — project through to the final word of each answer.',                    tag: 'Volume' },
];

function RangeGauge({ value, min, max, rangeMax }: { value: number; min: number; max: number; rangeMax: number }) {
  const { T } = useTheme();
  const pct = (value / rangeMax) * 100;
  const minPct = (min / rangeMax) * 100, maxPct = (max / rangeMax) * 100;
  const inRange = value >= min && value <= max;
  return (
    <div className="relative h-2.5 rounded-full" style={{ background: T.bgCard }}>
      <div className="absolute inset-y-0 rounded-full" style={{ left: `${minPct}%`, width: `${maxPct - minPct}%`, background: AC.greenBg, border: `1px solid ${AC.greenBdr}` }} />
      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full border-2"
        style={{ left: `${pct}%`, background: inRange ? AC.green : AC.pink, borderColor: T.bgSub }} />
    </div>
  );
}

export default function AuditionVoiceFeedback({ onNavigate }: { onNavigate?: (id: string) => void }) {
  const { T } = useTheme();
  const inIdealRange = SPEED_WPM >= IDEAL_MIN && SPEED_WPM <= IDEAL_MAX;
  const avgVolume = Math.round(VOLUME_LEVELS.reduce((a, b) => a + b, 0) / VOLUME_LEVELS.length);
  const totalFillers = FILLER_WORDS.reduce((a, f) => a + f.count, 0);

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: T.bg, scrollbarWidth: 'none' }}>
      <div className="px-8 pt-7 pb-10">

        <h1 className="text-[22px] font-black tracking-[-0.02em] mb-1 flex items-center gap-2" style={{ color: T.text }}>
          <AudioLines className="w-5 h-5" style={{ color: AC.green }} /> Voice Feedback
        </h1>
        <p className="text-[12px] mb-6" style={{ color: T.textMuted }}>Pacing, tone, and clarity analysis from your last session.</p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* Speaking speed */}
          <div className="rounded-2xl p-5 col-span-2" style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[12px] font-bold flex items-center gap-1.5" style={{ color: T.text }}>
                <Gauge className="w-4 h-4" style={{ color: AC.pink }} /> Speaking Speed
              </h4>
              <span className="text-[20px] font-black tracking-[-0.03em]" style={{ color: inIdealRange ? AC.green : AC.pink }}>{SPEED_WPM} <span className="text-[11px] font-medium" style={{ color: T.textMuted }}>WPM</span></span>
            </div>
            <RangeGauge value={SPEED_WPM} min={IDEAL_MIN} max={IDEAL_MAX} rangeMax={RANGE_MAX} />
            <div className="flex items-center justify-between mt-2 text-[10px]" style={{ color: T.textMuted }}>
              <span>0</span><span>Ideal: {IDEAL_MIN}–{IDEAL_MAX} WPM</span><span>{RANGE_MAX}</span>
            </div>
            {!inIdealRange && (
              <p className="text-[11px] mt-3 flex items-center gap-1.5" style={{ color: AC.pink }}>
                <TrendingUp className="w-3 h-3" /> Running {SPEED_WPM - IDEAL_MAX} WPM above the ideal range
              </p>
            )}
          </div>

          {/* Confidence + Clarity mini cards */}
          <div className="flex flex-col gap-4">
            {[{ label: 'Confidence', pct: 82, icon: Smile }, { label: 'Clarity', pct: 85, icon: Waves }].map(c => (
              <div key={c.label} className="rounded-2xl p-4 flex-1 flex flex-col justify-center" style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold flex items-center gap-1.5" style={{ color: T.textSub }}>
                    <c.icon className="w-3.5 h-3.5" style={{ color: AC.violet }} /> {c.label}
                  </span>
                  <span className="text-[13px] font-bold" style={{ color: AC.violet }}>{c.pct}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: T.bgCard }}>
                  <div className="h-full rounded-full" style={{ width: `${c.pct}%`, background: AC.violet }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Filler words */}
          <div className="rounded-2xl p-5" style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[12px] font-bold flex items-center gap-1.5" style={{ color: T.text }}>
                <MessageSquareWarning className="w-4 h-4" style={{ color: AC.amber }} /> Filler Words
              </h4>
              <span className="text-[11px] font-bold flex items-center gap-1" style={{ color: AC.green }}>
                <TrendingDown className="w-3 h-3" /> −3 vs last session
              </span>
            </div>
            <p className="text-[26px] font-black tracking-[-0.03em] mb-3" style={{ color: T.text }}>{totalFillers} <span className="text-[11px] font-medium" style={{ color: T.textMuted }}>total instances</span></p>
            <div className="space-y-2">
              {FILLER_WORDS.map(f => (
                <div key={f.word} className="flex items-center gap-2.5">
                  <span className="text-[11px] w-20 shrink-0" style={{ color: T.textSub }}>{f.word}</span>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: T.bgCard }}>
                    <div className="h-full rounded-full" style={{ width: `${(f.count / totalFillers) * 100}%`, background: AC.amber }} />
                  </div>
                  <span className="text-[10.5px] font-bold w-4 text-right" style={{ color: T.textMuted }}>{f.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Volume waveform */}
          <div className="rounded-2xl p-5" style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[12px] font-bold flex items-center gap-1.5" style={{ color: T.text }}>
                <Volume2 className="w-4 h-4" style={{ color: AC.green }} /> Volume
              </h4>
              <span className="text-[13px] font-bold" style={{ color: AC.green }}>Avg {avgVolume}%</span>
            </div>
            <div className="flex items-end gap-1" style={{ height: 56 }}>
              {VOLUME_LEVELS.map((v, i) => (
                <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${(v / 100) * 56}px`, background: v < 45 ? AC.amber : AC.green, opacity: 0.85 }} />
              ))}
            </div>
            <p className="text-[10.5px] mt-2" style={{ color: T.textMuted }}>Dips below 45% may read as under-projected on camera.</p>
          </div>
        </div>

        {/* Tone breakdown + speed trend */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="rounded-2xl p-5" style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
            <h4 className="text-[12px] font-bold mb-4" style={{ color: T.text }}>Tone · &ldquo;Warm &amp; Engaged&rdquo;</h4>
            <div className="space-y-3">
              {TONE_TRAITS.map(t => (
                <div key={t.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px]" style={{ color: T.textSub }}>{t.label}</span>
                    <span className="text-[11px] font-bold" style={{ color: T.text }}>{t.pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: T.bgCard }}>
                    <div className="h-full rounded-full" style={{ width: `${t.pct}%`, background: `linear-gradient(90deg, ${AC.pink}, ${AC.violet})` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-5" style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
            <h4 className="text-[12px] font-bold mb-4" style={{ color: T.text }}>Speed Trend · 7 Sessions</h4>
            <div className="flex items-end gap-2 justify-between" style={{ height: 56 }}>
              {SPEED_HISTORY.map((v, i) => {
                const h = Math.round((v / RANGE_MAX) * 56);
                const isLast = i === SPEED_HISTORY.length - 1;
                return <div key={i} className="flex-1 rounded-t-sm" style={{ height: h, background: isLast ? AC.pink : T.bgCard }} />;
              })}
            </div>
            <p className="text-[10.5px] mt-2" style={{ color: T.textMuted }}>Trending upward — keep pacing drills in your next 2 sessions.</p>
          </div>
        </div>

        {/* Recommendations */}
        <div className="rounded-2xl p-5" style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
          <h4 className="text-[13px] font-bold mb-4 flex items-center gap-1.5" style={{ color: T.text }}>
            <Sparkles className="w-4 h-4" style={{ color: AC.violet }} /> Recommendations
          </h4>
          <div className="space-y-2.5">
            {RECOMMENDATIONS.map((r, i) => (
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
