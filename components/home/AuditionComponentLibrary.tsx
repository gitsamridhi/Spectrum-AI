'use client';

import React, { useState } from 'react';
import {
  Square, Layers, BarChart2, Upload, FileText,
  Table2, AlertCircle, Maximize2, Play, Trash2, Eye, Download, Repeat,
  Mic, MicOff, Circle, CheckCircle2, Star, Smile, Loader2,
  ChevronDown, MessageCircle,
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

const AC = {
  pink: '#EC4899', pinkBg: 'rgba(236,72,153,0.10)', pinkBdr: 'rgba(236,72,153,0.28)',
  violet: '#A855F7', violetBg: 'rgba(168,85,247,0.10)', violetBdr: 'rgba(168,85,247,0.28)',
  amber: '#F59E0B', amberBg: 'rgba(245,158,11,0.10)', amberBdr: 'rgba(245,158,11,0.28)',
  green: '#10B981', greenBg: 'rgba(16,185,129,0.10)', greenBdr: 'rgba(16,185,129,0.28)',
  red:   '#EF4444', redBg:   'rgba(239,68,68,0.10)',   redBdr:   'rgba(239,68,68,0.28)',
};

type Category = 'buttons' | 'cards' | 'progress' | 'charts' | 'media' | 'transcript' | 'tables' | 'states' | 'overlays';

const CATEGORIES: { id: Category; icon: React.ElementType; label: string; desc: string; count: number }[] = [
  { id: 'buttons',    icon: Square,     label: 'Buttons',            desc: 'Primary, secondary, ghost, danger, pill toggle',          count: 5 },
  { id: 'cards',      icon: Layers,     label: 'Cards',               desc: 'Statistics, recommendation, session, practice cards',      count: 4 },
  { id: 'progress',   icon: BarChart2,  label: 'Score & Progress',    desc: 'Score ring, linear bar, range gauge, step indicator',       count: 4 },
  { id: 'charts',     icon: BarChart2,  label: 'Analytics Widgets',   desc: 'Sparkline, waveform, category bars, streak heatmap',        count: 4 },
  { id: 'media',      icon: Upload,     label: 'Media & Recording',  desc: 'Upload area, video player, recording controls',            count: 3 },
  { id: 'transcript', icon: FileText,   label: 'Transcript & Timeline', desc: 'Transcript card, coach comment, key-moments timeline',    count: 3 },
  { id: 'tables',     icon: Table2,     label: 'Tables',              desc: 'Session table header + row',                                count: 1 },
  { id: 'states',     icon: AlertCircle, label: 'Empty & Loading',    desc: 'Empty state, skeleton / loading state',                     count: 2 },
  { id: 'overlays',   icon: Maximize2,  label: 'Drawers & Modals',    desc: 'Modal, side drawer, tooltip / popover',                      count: 3 },
];

function SpecRow({ label, value }: { label: string; value: string }) {
  const { T } = useTheme();
  return (
    <div className="flex items-start gap-4 py-2" style={{ borderBottom: `1px solid ${T.borderMuted}` }}>
      <span className="w-28 shrink-0 text-[10px] font-bold uppercase tracking-widest" style={{ color: T.textMuted }}>{label}</span>
      <span className="text-[11px] leading-relaxed" style={{ color: T.textSub }}>{value}</span>
    </div>
  );
}

function SectionHeader({ label, desc, count }: { label: string; desc: string; count: number }) {
  const { T } = useTheme();
  return (
    <div className="flex items-start gap-4 mb-5 pb-4" style={{ borderBottom: `1px solid ${T.border}` }}>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-[17px] font-black tracking-[-0.03em]" style={{ color: T.text }}>{label}</h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: AC.pinkBg, color: AC.pink, border: `1px solid ${AC.pinkBdr}` }}>{count} variants</span>
        </div>
        <p className="text-[11.5px]" style={{ color: T.textMuted }}>{desc}</p>
      </div>
    </div>
  );
}

function Preview({ label, children, spec }: { label: string; children: React.ReactNode; spec?: Record<string, string> }) {
  const { T } = useTheme();
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
      <div className="px-5 py-6 flex items-center justify-center gap-4 flex-wrap" style={{ background: T.bgSub, minHeight: 90 }}>
        {children}
      </div>
      <div className="px-4 py-2.5 flex items-center" style={{ borderTop: `1px solid ${T.border}`, background: T.bg }}>
        <span className="text-[10.5px] font-semibold" style={{ color: T.textSub }}>{label}</span>
      </div>
      {spec && <div className="px-4 pb-3" style={{ background: T.bg }}>{Object.entries(spec).map(([k, v]) => <SpecRow key={k} label={k} value={v} />)}</div>}
    </div>
  );
}

/* ── Buttons ─────────────────────────────────────────────────────────────── */
function ButtonsSection() {
  const { T } = useTheme();
  return (
    <div>
      <SectionHeader label="Buttons" desc="Primary, secondary, ghost, danger, pill toggle" count={5} />
      <div className="grid grid-cols-2 gap-4">
        <Preview label="Primary — gradient fill" spec={{ Usage: 'Main call-to-action: Start Practice, Analyze, Finish', Background: 'linear-gradient(135deg, pink, violet)' }}>
          <button className="px-5 py-2.5 rounded-xl text-[12px] font-bold text-white cursor-pointer" style={{ background: `linear-gradient(135deg, ${AC.pink}, ${AC.violet})` }}>Start Practice</button>
        </Preview>
        <Preview label="Secondary — bordered" spec={{ Usage: 'Cancel, Save Draft, secondary actions' }}>
          <button className="px-5 py-2.5 rounded-xl text-[12px] font-semibold cursor-pointer" style={{ background: T.bgCard, color: T.textSub, border: `1px solid ${T.border}` }}>Save Draft</button>
        </Preview>
        <Preview label="Icon — ghost" spec={{ Usage: 'Table/card row actions: view, download, repeat, delete' }}>
          {[Eye, Download, Repeat, Trash2].map((Icon, i) => (
            <button key={i} className="w-9 h-9 flex items-center justify-center rounded-lg cursor-pointer" style={{ background: T.bgCard, color: T.textMuted, border: `1px solid ${T.border}` }}><Icon className="w-3.5 h-3.5" /></button>
          ))}
        </Preview>
        <Preview label="Danger" spec={{ Usage: 'Destructive actions: delete session, remove file' }}>
          <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[12px] font-semibold cursor-pointer" style={{ background: AC.redBg, color: AC.red, border: `1px solid ${AC.redBdr}` }}><Trash2 className="w-3.5 h-3.5" /> Delete</button>
        </Preview>
        <Preview label="Pill toggle group" spec={{ Usage: 'View mode switches: table/cards, upload/record' }}>
          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
            <button className="px-3.5 py-1.5 rounded-lg text-[11.5px] font-semibold" style={{ background: AC.pink, color: '#fff' }}>Cards</button>
            <button className="px-3.5 py-1.5 rounded-lg text-[11.5px] font-semibold" style={{ color: T.textSub }}>Table</button>
          </div>
        </Preview>
      </div>
    </div>
  );
}

/* ── Cards ──────────────────────────────────────────────────────────────── */
function CardsSection() {
  const { T } = useTheme();
  return (
    <div>
      <SectionHeader label="Cards" desc="Statistics, recommendation, session, practice cards" count={4} />
      <div className="grid grid-cols-2 gap-4">
        <Preview label="Statistics card" spec={{ Used_in: 'Home, Body Language Report, Feedback Report' }}>
          <div className="rounded-2xl p-4 flex flex-col gap-2.5 w-40" style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: AC.pinkBg }}><Star className="w-4 h-4" style={{ color: AC.pink }} /></div>
            <span className="text-[22px] font-black" style={{ color: T.text }}>78</span>
            <span className="text-[10.5px] font-medium" style={{ color: T.textMuted }}>Average Score</span>
          </div>
        </Preview>
        <Preview label="Recommendation card" spec={{ Used_in: 'Recommendations, Home suggestions' }}>
          <div className="rounded-2xl p-4 flex flex-col gap-2 w-56" style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: AC.violetBg }}><Smile className="w-4 h-4" style={{ color: AC.violet }} /></div>
            <p className="text-[12px] font-bold" style={{ color: T.text }}>Posture Reset</p>
            <button className="self-start px-3 py-1 rounded-lg text-[10.5px] font-bold text-white" style={{ background: `linear-gradient(135deg, ${AC.pink}, ${AC.violet})` }}>Start Practice</button>
          </div>
        </Preview>
        <Preview label="Session card" spec={{ Used_in: 'Session History (card view)' }}>
          <div className="rounded-2xl overflow-hidden w-48" style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
            <div className="h-16" style={{ background: `linear-gradient(135deg, ${AC.pink}55, ${AC.violet}55)` }} />
            <div className="p-3"><p className="text-[11.5px] font-bold" style={{ color: T.text }}>Mock Interview</p><p className="text-[10px]" style={{ color: T.textMuted }}>Jul 3 · 18:24</p></div>
          </div>
        </Preview>
        <Preview label="Practice card" spec={{ Used_in: 'Practice Selection, Practice Plan quick start' }}>
          <div className="rounded-2xl overflow-hidden w-40 text-left" style={{ border: `1px solid ${T.border}` }}>
            <div className="h-14" style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.20), rgba(168,85,247,0.14))' }} />
            <div className="p-3"><p className="text-[11.5px] font-bold" style={{ color: T.text }}>Acting</p><p className="text-[9.5px]" style={{ color: T.textMuted }}>Scene work</p></div>
          </div>
        </Preview>
      </div>
    </div>
  );
}

/* ── Score & Progress ──────────────────────────────────────────────────── */
function ProgressSection() {
  const { T } = useTheme();
  const score = 78, R = 34, C = 2 * Math.PI * R;
  return (
    <div>
      <SectionHeader label="Score & Progress" desc="Score ring, linear bar, range gauge, step indicator" count={4} />
      <div className="grid grid-cols-2 gap-4">
        <Preview label="Score ring" spec={{ Used_in: 'Home, Feedback Report, Pageant confidence meter' }}>
          <div className="relative" style={{ width: 88, height: 88 }}>
            <svg width={88} height={88} style={{ transform: 'rotate(-90deg)' }}>
              <circle cx={44} cy={44} r={R} fill="none" strokeWidth={8} style={{ stroke: T.bgCard }} />
              <circle cx={44} cy={44} r={R} fill="none" strokeWidth={8} stroke={AC.pink} strokeDasharray={C} strokeDashoffset={C * (1 - score / 100)} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[18px] font-black" style={{ color: T.text }}>{score}</div>
          </div>
        </Preview>
        <Preview label="Linear progress bar" spec={{ Used_in: 'Upload progress, weekly plan completion' }}>
          <div className="w-40 h-2 rounded-full overflow-hidden" style={{ background: T.bgCard }}>
            <div className="h-full rounded-full" style={{ width: '64%', background: `linear-gradient(90deg, ${AC.pink}, ${AC.violet})` }} />
          </div>
        </Preview>
        <Preview label="Range gauge" spec={{ Used_in: 'Voice Feedback — ideal speaking-speed range' }}>
          <div className="relative w-40 h-2.5 rounded-full" style={{ background: T.bgCard }}>
            <div className="absolute inset-y-0 rounded-full" style={{ left: '40%', width: '25%', background: AC.greenBg, border: `1px solid ${AC.greenBdr}` }} />
            <div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2" style={{ left: '58%', background: AC.pink, borderColor: T.bgSub }} />
          </div>
        </Preview>
        <Preview label="Step / segmented indicator" spec={{ Used_in: 'Weekly plan day strip, streak tracking' }}>
          <div className="flex gap-1">
            {[1, 1, 0, 1, 1, 0, 0].map((v, i) => <div key={i} className="w-5 h-5 rounded" style={{ background: v ? AC.pink : T.bgCard }} />)}
          </div>
        </Preview>
      </div>
    </div>
  );
}

/* ── Analytics widgets ─────────────────────────────────────────────────── */
function ChartsSection() {
  const { T } = useTheme();
  const bars = [40, 55, 48, 63, 58, 71, 66];
  return (
    <div>
      <SectionHeader label="Analytics Widgets" desc="Sparkline, waveform, category bars, streak heatmap" count={4} />
      <div className="grid grid-cols-2 gap-4">
        <Preview label="Sparkline bar chart" spec={{ Used_in: 'Progress History timeline, Feedback score history' }}>
          <div className="flex items-end gap-1" style={{ height: 48 }}>{bars.map((v, i) => <div key={i} className="w-2.5 rounded-t-sm" style={{ height: v * 0.6, background: i === bars.length - 1 ? AC.pink : T.bgCard }} />)}</div>
        </Preview>
        <Preview label="Volume waveform" spec={{ Used_in: 'Voice Feedback volume card' }}>
          <div className="flex items-end gap-0.5" style={{ height: 48 }}>{bars.concat(bars).map((v, i) => <div key={i} className="w-1.5 rounded-t-sm" style={{ height: v * 0.55, background: AC.green, opacity: 0.85 }} />)}</div>
        </Preview>
        <Preview label="Category comparison bars" spec={{ Used_in: 'Progress History category scores' }}>
          <div className="w-44 space-y-2">
            {[['Confidence', 82], ['Voice', 75]].map(([l, v]) => (
              <div key={l as string}>
                <span className="text-[9.5px]" style={{ color: T.textMuted }}>{l}</span>
                <div className="h-1.5 rounded-full overflow-hidden mt-1" style={{ background: T.bgCard }}><div className="h-full rounded-full" style={{ width: `${v}%`, background: AC.violet }} /></div>
              </div>
            ))}
          </div>
        </Preview>
        <Preview label="Streak heatmap" spec={{ Used_in: 'Progress History practice streak' }}>
          <div className="space-y-1">
            {[[1, 2, 0, 3], [2, 3, 2, 1]].map((w, wi) => (
              <div key={wi} className="flex gap-1">{w.map((v, di) => <div key={di} className="w-4 h-4 rounded-sm" style={{ background: v === 0 ? T.bgCard : v === 1 ? AC.pinkBg : v === 2 ? 'rgba(236,72,153,0.45)' : AC.pink }} />)}</div>
            ))}
          </div>
        </Preview>
      </div>
    </div>
  );
}

/* ── Media & Recording ─────────────────────────────────────────────────── */
function MediaSection() {
  const { T } = useTheme();
  const [micOn, setMicOn] = useState(true);
  return (
    <div>
      <SectionHeader label="Media & Recording" desc="Upload area, video player, recording controls" count={3} />
      <div className="grid grid-cols-2 gap-4">
        <Preview label="Upload dropzone" spec={{ Used_in: 'Upload Self-Tape' }}>
          <div className="w-56 py-6 rounded-2xl flex flex-col items-center gap-2" style={{ border: `2px dashed ${T.border}` }}>
            <Upload className="w-5 h-5" style={{ color: AC.pink }} />
            <span className="text-[10.5px] font-semibold" style={{ color: T.textSub }}>Drag & drop video</span>
          </div>
        </Preview>
        <Preview label="Video player controls" spec={{ Used_in: 'Transcript Viewer, Coach Review Mode' }}>
          <div className="w-56 h-24 rounded-xl relative overflow-hidden" style={{ background: '#000' }}>
            <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2">
              <Play className="w-3.5 h-3.5 text-white" />
              <div className="flex-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.25)' }}><div className="h-full rounded-full" style={{ width: '40%', background: AC.pink }} /></div>
            </div>
          </div>
        </Preview>
        <Preview label="Recording controls" spec={{ Used_in: 'Live Mock Interview, Upload Self-Tape (camera mode)' }}>
          <div className="flex items-center gap-2">
            <button onClick={() => setMicOn(m => !m)} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: micOn ? T.bgCard : AC.redBg }}>
              {micOn ? <Mic className="w-4 h-4" style={{ color: T.textSub }} /> : <MicOff className="w-4 h-4" style={{ color: AC.red }} />}
            </button>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: T.bgCard }}><Circle className="w-2 h-2 fill-red-500 text-red-500" /><span className="text-[10.5px] font-bold" style={{ color: T.text }}>0:24</span></span>
          </div>
        </Preview>
      </div>
    </div>
  );
}

/* ── Transcript & Timeline ─────────────────────────────────────────────── */
function TranscriptSection() {
  const { T } = useTheme();
  return (
    <div>
      <SectionHeader label="Transcript & Timeline" desc="Transcript card, coach comment, key-moments timeline" count={3} />
      <div className="grid grid-cols-2 gap-4">
        <Preview label="Transcript line" spec={{ Used_in: 'Transcript Viewer' }}>
          <div className="w-64 flex gap-2 p-2.5 rounded-xl" style={{ background: AC.greenBg, borderLeft: `3px solid ${AC.green}` }}>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded" style={{ background: T.bgCard, color: AC.pink }}>0:04</span>
            <span className="text-[11px]" style={{ color: T.textSub }}>Strong, confident opening line.</span>
          </div>
        </Preview>
        <Preview label="Coach comment popover" spec={{ Used_in: 'Transcript Viewer, Coach Review Mode' }}>
          <div className="w-52 p-3 rounded-xl text-[10.5px]" style={{ background: T.text, color: T.bg }}>
            <span className="flex items-center gap-1 font-bold mb-1"><MessageCircle className="w-3 h-3" /> Coach note</span>
            Great recovery after the pause.
          </div>
        </Preview>
        <Preview label="Key-moments timeline" spec={{ Used_in: 'Feedback Report, Body Language Report' }}>
          <div className="relative h-1.5 w-56 rounded-full" style={{ background: T.bgCard }}>
            {[15, 45, 75].map((p, i) => <div key={i} className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2" style={{ left: `${p}%`, background: i === 1 ? AC.amber : AC.green, borderColor: T.bgSub }} />)}
          </div>
        </Preview>
      </div>
    </div>
  );
}

/* ── Tables ─────────────────────────────────────────────────────────────── */
function TablesSection() {
  const { T } = useTheme();
  return (
    <div>
      <SectionHeader label="Tables" desc="Session table header + row" count={1} />
      <Preview label="Session table row" spec={{ Used_in: 'Session History (table view)' }}>
        <div className="w-full rounded-xl overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
          <div className="grid grid-cols-4 gap-3 px-3 py-2" style={{ background: T.bgCard }}>{['Practice', 'Date', 'Score', 'Status'].map(h => <span key={h} className="text-[9px] font-bold uppercase" style={{ color: T.textMuted }}>{h}</span>)}</div>
          <div className="grid grid-cols-4 gap-3 px-3 py-2.5 items-center" style={{ background: T.bg }}>
            <span className="text-[11px] font-semibold" style={{ color: T.text }}>Mock Interview</span>
            <span className="text-[11px]" style={{ color: T.textSub }}>Jul 3</span>
            <span className="text-[11px] font-bold" style={{ color: AC.green }}>82</span>
            <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full w-fit" style={{ background: AC.greenBg, color: AC.green }}>Completed</span>
          </div>
        </div>
      </Preview>
    </div>
  );
}

/* ── Empty & loading states ────────────────────────────────────────────── */
function StatesSection() {
  const { T } = useTheme();
  return (
    <div>
      <SectionHeader label="Empty & Loading States" desc="Empty state, skeleton / loading state" count={2} />
      <div className="grid grid-cols-2 gap-4">
        <Preview label="Empty state" spec={{ Used_in: 'Every list/grid across the module (dashed border + CTA)' }}>
          <div className="w-56 flex flex-col items-center text-center py-6 rounded-2xl" style={{ border: `1px dashed ${T.border}` }}>
            <AlertCircle className="w-5 h-5 mb-2" style={{ color: T.textMuted }} />
            <p className="text-[11px]" style={{ color: T.textMuted }}>No results found</p>
          </div>
        </Preview>
        <Preview label="Loading / processing state" spec={{ Used_in: 'Upload progress, Pageant analysis, generation phases' }}>
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" style={{ color: AC.pink }} />
            <span className="text-[11.5px] font-medium" style={{ color: T.textSub }}>Analyzing your response…</span>
          </div>
        </Preview>
      </div>
    </div>
  );
}

/* ── Drawers & modals ──────────────────────────────────────────────────── */
function OverlaysSection() {
  const { T } = useTheme();
  return (
    <div>
      <SectionHeader label="Drawers & Modals" desc="Modal, side drawer, tooltip / popover" count={3} />
      <div className="grid grid-cols-2 gap-4">
        <Preview label="Confirmation modal" spec={{ Used_in: 'Live Mock Interview session-complete overlay' }}>
          <div className="w-56 rounded-2xl p-4 text-center" style={{ background: T.bg, border: `1px solid ${T.border}` }}>
            <CheckCircle2 className="w-6 h-6 mx-auto mb-2" style={{ color: AC.green }} />
            <p className="text-[11.5px] font-bold" style={{ color: T.text }}>Session complete</p>
          </div>
        </Preview>
        <Preview label="Side drawer / settings panel" spec={{ Used_in: 'Live Mock Interview notes/tips panel' }}>
          <div className="w-16 h-24 rounded-xl flex items-center justify-center" style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
            <ChevronDown className="w-4 h-4 rotate-90" style={{ color: T.textMuted }} />
          </div>
        </Preview>
        <Preview label="Tooltip" spec={{ Used_in: 'Sidebar collapsed nav, timeline markers' }}>
          <div className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold" style={{ background: T.text, color: T.bg }}>Voice Feedback</div>
        </Preview>
      </div>
    </div>
  );
}

/* ── Root ───────────────────────────────────────────────────────────────── */
export default function AuditionComponentLibrary({ onNavigate: _onNavigate }: { onNavigate?: (id: string) => void }) {
  const { T } = useTheme();
  const [active, setActive] = useState<Category>('buttons');

  return (
    <div className="flex-1 flex overflow-hidden" style={{ background: T.bg }}>
      <div className="w-[210px] shrink-0 overflow-y-auto py-4 px-2.5" style={{ borderRight: `1px solid ${T.border}`, background: T.bgSub, scrollbarWidth: 'none' }}>
        {CATEGORIES.map(c => {
          const isActive = active === c.id;
          return (
            <button key={c.id} onClick={() => setActive(c.id)}
              className="w-full text-left flex items-start gap-2.5 px-2.5 py-2.5 rounded-xl cursor-pointer transition-all mb-1"
              style={isActive ? { background: AC.pinkBg, border: `1px solid ${AC.pinkBdr}` } : { border: '1px solid transparent' }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = T.bgHover; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}>
              <c.icon className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: isActive ? AC.pink : T.textMuted }} />
              <div className="min-w-0">
                <p className="text-[11.5px] font-semibold" style={{ color: isActive ? AC.pink : T.text }}>{c.label}</p>
                <p className="text-[9.5px] leading-snug mt-0.5" style={{ color: T.textMuted }}>{c.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-7" style={{ scrollbarWidth: 'none' }}>
        {active === 'buttons'    && <ButtonsSection />}
        {active === 'cards'      && <CardsSection />}
        {active === 'progress'   && <ProgressSection />}
        {active === 'charts'     && <ChartsSection />}
        {active === 'media'      && <MediaSection />}
        {active === 'transcript' && <TranscriptSection />}
        {active === 'tables'     && <TablesSection />}
        {active === 'states'     && <StatesSection />}
        {active === 'overlays'   && <OverlaysSection />}
      </div>
    </div>
  );
}
