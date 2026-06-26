'use client';

import React, { useState } from 'react';
import {
  Clock, RotateCcw, Tag, ChevronDown, ChevronRight,
  GitBranch, CheckCircle2, AlertCircle, Plus,
  Copy, Eye, ArrowLeftRight, List,
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

const PA = {
  blue:'#EC4899',blueBg:'rgba(236,72,153,0.10)',blueBdr:'rgba(236,72,153,0.28)',
  teal:'#A855F7',tealBg:'rgba(168,85,247,0.10)',tealBdr:'rgba(168,85,247,0.28)',
  amber:'#F59E0B',amberBg:'rgba(245,158,11,0.10)',amberBdr:'rgba(245,158,11,0.28)',
  red:'#EF4444',redBg:'rgba(239,68,68,0.10)',redBdr:'rgba(239,68,68,0.28)',
  green:'#16a34a',greenBg:'rgba(34,197,94,0.10)',greenBdr:'rgba(34,197,94,0.28)',
};

interface Version {
  id: string;
  version: string;
  label?: string;
  section: string;
  date: string;
  author: string;
  authorInit: string;
  authorColor: string;
  changes: number;
  isCurrent?: boolean;
  tags?: string[];
}

const VERSIONS: Version[] = [
  { id:'v5', version:'v5.0', label:'Agency Final',   section:'Bio',    date:'Today · 2h ago',   author:'Sarah Chen',      authorInit:'SC', authorColor:PA.teal,   changes:8,  isCurrent:true,  tags:['Approved','Agency'] },
  { id:'v4', version:'v4.2',                         section:'Bio',    date:'Yesterday · 4h',   author:'Sarah Chen',      authorInit:'SC', authorColor:PA.teal,   changes:3 },
  { id:'v3', version:'v4.1', label:'Reviewer Edit',  section:'Bio',    date:'2 days ago',        author:'Elite Models NY', authorInit:'EM', authorColor:PA.blue,   changes:5,  tags:['Reviewed'] },
  { id:'v2', version:'v4.0',                         section:'Bio',    date:'3 days ago',        author:'Sarah Chen',      authorInit:'SC', authorColor:PA.teal,   changes:12 },
  { id:'v1', version:'v3.0', label:'Original Draft', section:'Bio',    date:'1 week ago',        author:'Sarah Chen',      authorInit:'SC', authorColor:PA.teal,   changes:0,  tags:['Draft'] },
];

type DiffStatus = 'same' | 'removed' | 'added' | 'changed-old' | 'changed-new';

interface DiffLine { status: DiffStatus; text: string; lineNum?: number; }

const DIFF_BEFORE: DiffLine[] = [
  { status:'same',        text:'Sarah Chen is a creative professional based in New York City.',                          lineNum:1  },
  { status:'removed',     text:'She works in the fashion and modeling industry.',                                         lineNum:2  },
  { status:'same',        text:'',                                                                                        lineNum:3  },
  { status:'changed-old', text:'With a focus on editorial and commercial work, Sarah has collaborated with brands.',      lineNum:4  },
  { status:'same',        text:'Her background spans runway, print, and digital campaigns.',                              lineNum:5  },
  { status:'removed',     text:'Sarah is available for bookings through her agency.',                                     lineNum:6  },
  { status:'same',        text:'',                                                                                        lineNum:7  },
  { status:'same',        text:'Previous clients include H&M, Zara, and several independent labels.',                    lineNum:8  },
  { status:'removed',     text:'Contact: sarah@sarahchen.com',                                                           lineNum:9  },
  { status:'same',        text:'',                                                                                        lineNum:10 },
  { status:'same',        text:'She is based in the Soho neighborhood and works internationally.',                        lineNum:11 },
];

const DIFF_AFTER: DiffLine[] = [
  { status:'same',        text:'Sarah Chen is a creative professional based in New York City.',                          lineNum:1  },
  { status:'added',       text:'Award-winning fashion model with 8+ years of international runway experience.',          lineNum:2  },
  { status:'same',        text:'',                                                                                        lineNum:3  },
  { status:'changed-new', text:'With a signature editorial aesthetic, Sarah has headlined campaigns for global brands.', lineNum:4  },
  { status:'same',        text:'Her background spans runway, print, and digital campaigns.',                              lineNum:5  },
  { status:'added',       text:'Represented exclusively by IMG Models NYC for commercial and editorial assignments.',     lineNum:6  },
  { status:'same',        text:'',                                                                                        lineNum:7  },
  { status:'same',        text:'Previous clients include H&M, Zara, and several independent labels.',                    lineNum:8  },
  { status:'added',       text:'Vogue Italia · Harper\'s Bazaar · ELLE · Dior · Chanel SS25 Campaign.',                  lineNum:9  },
  { status:'same',        text:'',                                                                                        lineNum:10 },
  { status:'same',        text:'She is based in the Soho neighborhood and works internationally.',                        lineNum:11 },
];

type ViewMode = 'split' | 'unified';

function DiffLine({ line, side }: { line: DiffLine; side: 'before' | 'after' }) {
  const { T } = useTheme();

  const bgMap: Partial<Record<DiffStatus, string>> = {
    removed:     PA.redBg,
    added:       PA.greenBg,
    'changed-old': '#fff7ed',
    'changed-new': 'rgba(34,197,94,0.10)',
    same: 'transparent',
  };
  const colorMap: Partial<Record<DiffStatus, string>> = {
    removed:     PA.red,
    added:       PA.green,
    'changed-old': PA.amber,
    'changed-new': PA.teal,
    same: T.text,
  };
  const prefixMap: Partial<Record<DiffStatus, string>> = {
    removed:     '−',
    added:       '+',
    'changed-old': '~',
    'changed-new': '~',
  };

  const showLine = side === 'before'
    ? ['same','removed','changed-old'].includes(line.status)
    : ['same','added','changed-new'].includes(line.status);

  if (!showLine) return (
    <div className="flex items-start gap-2 px-3 py-0.5 min-h-[22px]"
      style={{ background:'transparent' }}>
      <span className="w-3 text-[9px] font-mono shrink-0" style={{ color:'transparent' }}>–</span>
      <span className="text-[11px] font-mono" style={{ color:'transparent' }}>·</span>
    </div>
  );

  const bg     = bgMap[line.status] || 'transparent';
  const color  = colorMap[line.status] || T.text;
  const prefix = prefixMap[line.status] || ' ';

  return (
    <div className="flex items-start gap-2 px-3 py-0.5 min-h-[22px]" style={{ background:bg }}>
      <span className="w-3 text-[9px] font-mono shrink-0 mt-0.5 select-none" style={{ color }}>{prefix}</span>
      <span className="text-[11px] font-mono leading-relaxed flex-1" style={{ color: line.text === '' ? 'transparent' : T.text }}>
        {line.text || '​'}
      </span>
    </div>
  );
}

export default function PortfolioVersionHistory() {
  const { T } = useTheme();
  const [selected, setSelected]   = useState<string>('v5');
  const [compare,  setCompare]    = useState<string>('v4');
  const [viewMode, setViewMode]   = useState<ViewMode>('split');
  const [showRestore, setShowRestore] = useState(false);
  const [labelInput, setLabelInput]   = useState('');
  const [showLabelForm, setShowLabelForm] = useState(false);

  const selectedVersion = VERSIONS.find(v => v.id === selected)!;
  const compareVersion  = VERSIONS.find(v => v.id === compare)!;

  const added   = DIFF_AFTER.filter(l => l.status === 'added' || l.status === 'changed-new').length;
  const removed = DIFF_BEFORE.filter(l => l.status === 'removed' || l.status === 'changed-old').length;

  return (
    <div className="flex-1 flex overflow-hidden">

      {/* ── Left: Version timeline ── */}
      <div className="w-[234px] shrink-0 flex flex-col"
        style={{ borderRight:`1px solid ${T.border}`, background:T.bgSub }}>

        {/* Header */}
        <div className="shrink-0 px-4 py-3 flex items-center justify-between"
          style={{ borderBottom:`1px solid ${T.border}` }}>
          <div className="flex items-center gap-2">
            <GitBranch className="w-3.5 h-3.5" style={{ color:T.textMuted }} />
            <span className="text-[11.5px] font-bold" style={{ color:T.text }}>Version History</span>
          </div>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
            style={{ background:T.bgCard, color:T.textMuted, border:`1px solid ${T.border}` }}>
            {VERSIONS.length}
          </span>
        </div>

        {/* Versions */}
        <div className="flex-1 overflow-y-auto py-3 px-2" style={{ scrollbarWidth:'none' }}>
          <div className="relative">
            <div className="absolute left-[22px] top-0 bottom-0 w-px" style={{ background:T.borderMuted }} />

            {VERSIONS.map((v, i) => {
              const isSel  = selected === v.id;
              const isCmp  = compare  === v.id;
              return (
                <div key={v.id} className="relative mb-1">
                  <button
                    className="w-full flex items-start gap-2.5 px-2 py-2.5 rounded-xl cursor-pointer text-left transition-all"
                    style={isSel
                      ? { background:PA.blueBg, border:`1px solid ${PA.blueBdr}` }
                      : isCmp
                        ? { background:PA.tealBg, border:`1px solid ${PA.tealBdr}` }
                        : { border:'1px solid transparent' }}
                    onMouseEnter={e => { if (!isSel && !isCmp) e.currentTarget.style.background = T.bgHover; }}
                    onMouseLeave={e => { if (!isSel && !isCmp) e.currentTarget.style.background = 'transparent'; }}
                    onClick={() => {
                      if (v.id !== selected) {
                        setCompare(selected);
                        setSelected(v.id);
                      }
                    }}>

                    {/* Timeline dot */}
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 z-10 relative"
                      style={{
                        background: isSel ? PA.blue : isCmp ? PA.teal : T.bgCard,
                        border: `2px solid ${isSel ? PA.blue : isCmp ? PA.teal : T.border}`,
                      }}>
                      {v.isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Version + label */}
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[11.5px] font-bold" style={{ color: isSel ? PA.blue : isCmp ? PA.teal : T.text }}>
                          {v.version}
                        </span>
                        {v.isCurrent && (
                          <span className="text-[8px] font-bold px-1 py-0.5 rounded"
                            style={{ background:PA.blueBg, color:PA.blue }}>
                            Current
                          </span>
                        )}
                        {isCmp && !v.isCurrent && (
                          <span className="text-[8px] font-bold px-1 py-0.5 rounded"
                            style={{ background:PA.tealBg, color:PA.teal }}>
                            Compare
                          </span>
                        )}
                      </div>

                      {v.label && (
                        <p className="text-[10px] font-semibold mb-0.5" style={{ color: isSel ? PA.blue : T.textSub }}>
                          {v.label}
                        </p>
                      )}

                      <p className="text-[9.5px]" style={{ color:T.textMuted }}>{v.date}</p>

                      {/* Author */}
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[6px] font-black text-white"
                          style={{ background:v.authorColor }}>
                          {v.authorInit}
                        </div>
                        <span className="text-[9.5px] truncate" style={{ color:T.textMuted }}>{v.author}</span>
                      </div>

                      {/* Tags */}
                      {v.tags && v.tags.length > 0 && (
                        <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                          {v.tags.map(tag => (
                            <span key={tag} className="text-[8px] font-bold px-1 py-0.5 rounded"
                              style={{ background:T.bgCard, color:T.textMuted }}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add label action */}
        <div className="shrink-0 p-3" style={{ borderTop:`1px solid ${T.border}` }}>
          {showLabelForm ? (
            <div className="flex gap-1.5">
              <input value={labelInput} onChange={e => setLabelInput(e.target.value)}
                autoFocus
                placeholder="Version label…"
                className="flex-1 px-2.5 py-1.5 rounded-xl text-[11px] outline-none"
                style={{ background:T.inputBg, border:`1px solid ${T.border}`, color:T.text }} />
              <button
                className="px-2.5 py-1.5 rounded-xl text-[11px] font-semibold text-white cursor-pointer"
                style={{ background:'linear-gradient(135deg, #EC4899, #A855F7)' }}
                onClick={() => { setLabelInput(''); setShowLabelForm(false); }}>
                Save
              </button>
            </div>
          ) : (
            <button
              className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-[11px] font-medium cursor-pointer"
              style={{ background:T.bgCard, color:T.textSub, border:`1px solid ${T.border}` }}
              onClick={() => setShowLabelForm(true)}>
              <Tag className="w-3 h-3" />Label This Version
            </button>
          )}
        </div>
      </div>

      {/* ── Center: Diff view ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Diff toolbar */}
        <div className="shrink-0 h-12 flex items-center px-5 gap-3"
          style={{ borderBottom:`1px solid ${T.border}`, background:T.bg }}>

          {/* Version selectors */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
              style={{ background:PA.tealBg, border:`1px solid ${PA.tealBdr}` }}>
              <div className="w-2 h-2 rounded-full" style={{ background:PA.teal }} />
              <span className="text-[11px] font-semibold" style={{ color:PA.teal }}>
                {compareVersion?.version} {compareVersion?.label ? `· ${compareVersion.label}` : ''}
              </span>
            </div>
            <ArrowLeftRight className="w-3 h-3" style={{ color:T.textMuted }} />
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
              style={{ background:PA.blueBg, border:`1px solid ${PA.blueBdr}` }}>
              <div className="w-2 h-2 rounded-full" style={{ background:'linear-gradient(135deg, #EC4899, #A855F7)' }} />
              <span className="text-[11px] font-semibold" style={{ color:PA.blue }}>
                {selectedVersion?.version} {selectedVersion?.isCurrent ? '· Current' : (selectedVersion?.label ?? '')}
              </span>
            </div>
          </div>

          {/* Change summary */}
          <div className="flex items-center gap-2 ml-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background:PA.greenBg, color:PA.green, border:`1px solid ${PA.greenBdr}` }}>
              +{added} added
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background:PA.redBg, color:PA.red, border:`1px solid ${PA.redBdr}` }}>
              −{removed} removed
            </span>
          </div>

          {/* View mode toggle */}
          <div className="ml-auto flex items-center gap-1 p-0.5 rounded-lg" style={{ background:T.bgCard }}>
            {([['split','Split'] as const, ['unified','Unified'] as const]).map(([m, label]) => (
              <button key={m} onClick={() => setViewMode(m)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[10.5px] font-medium cursor-pointer transition-all"
                style={viewMode === m
                  ? { background:T.bg, color:T.text, boxShadow:'0 1px 3px rgba(0,0,0,0.08)' }
                  : { color:T.textMuted }}>
                {m === 'split' ? <ArrowLeftRight className="w-3 h-3" /> : <List className="w-3 h-3" />}
                {label}
              </button>
            ))}
          </div>

          {/* Restore */}
          {!selectedVersion?.isCurrent && (
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold cursor-pointer hover:opacity-90"
              style={{ background:PA.amberBg, color:PA.amber, border:`1px solid ${PA.amberBdr}` }}
              onClick={() => setShowRestore(true)}>
              <RotateCcw className="w-3.5 h-3.5" />Restore
            </button>
          )}
        </div>

        {/* Section label bar */}
        <div className="shrink-0 flex items-center px-5 h-8 gap-3"
          style={{ background:T.bgSub, borderBottom:`1px solid ${T.border}` }}>
          <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color:T.textMuted }}>
            Section: {selectedVersion?.section ?? 'Bio'}
          </span>
          <span className="text-[9.5px]" style={{ color:T.textMuted }}>·</span>
          <span className="text-[9.5px]" style={{ color:T.textMuted }}>
            {DIFF_BEFORE.length} lines compared
          </span>
        </div>

        {/* Diff content */}
        {viewMode === 'split' ? (
          <div className="flex-1 flex overflow-hidden">
            {/* Before */}
            <div className="flex-1 flex flex-col overflow-hidden" style={{ borderRight:`1px solid ${T.border}` }}>
              <div className="shrink-0 px-3 py-2 flex items-center gap-2"
                style={{ background:PA.tealBg, borderBottom:`1px solid ${PA.tealBdr}` }}>
                <div className="w-2 h-2 rounded-full" style={{ background:PA.teal }} />
                <span className="text-[10px] font-bold" style={{ color:PA.teal }}>
                  {compareVersion?.version} — Before
                </span>
              </div>
              <div className="flex-1 overflow-y-auto py-2" style={{ scrollbarWidth:'none', fontFamily:'monospace' }}>
                {DIFF_BEFORE.map((line, i) => (
                  <DiffLine key={i} line={line} side="before" />
                ))}
              </div>
            </div>
            {/* After */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="shrink-0 px-3 py-2 flex items-center gap-2"
                style={{ background:PA.blueBg, borderBottom:`1px solid ${PA.blueBdr}` }}>
                <div className="w-2 h-2 rounded-full" style={{ background:'linear-gradient(135deg, #EC4899, #A855F7)' }} />
                <span className="text-[10px] font-bold" style={{ color:PA.blue }}>
                  {selectedVersion?.version} — After {selectedVersion?.isCurrent ? '(Current)' : ''}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto py-2" style={{ scrollbarWidth:'none', fontFamily:'monospace' }}>
                {DIFF_AFTER.map((line, i) => (
                  <DiffLine key={i} line={line} side="after" />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Unified diff */
          <div className="flex-1 overflow-y-auto py-2" style={{ scrollbarWidth:'none', fontFamily:'monospace' }}>
            {DIFF_BEFORE.map((bLine, i) => {
              const aLine = DIFF_AFTER[i];
              if (bLine.status === 'same') {
                return <DiffLine key={`s-${i}`} line={bLine} side="after" />;
              }
              return (
                <React.Fragment key={`u-${i}`}>
                  {(bLine.status === 'removed' || bLine.status === 'changed-old') && (
                    <DiffLine line={bLine} side="before" />
                  )}
                  {aLine && (aLine.status === 'added' || aLine.status === 'changed-new') && (
                    <DiffLine line={aLine} side="after" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* Restore confirmation overlay */}
        {showRestore && (
          <div className="absolute inset-0 flex items-center justify-center z-20"
            style={{ background:'rgba(0,0,0,0.35)' }}>
            <div className="rounded-2xl p-6 w-[340px] shadow-2xl"
              style={{ background:T.bg, border:`1px solid ${T.border}` }}>
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3"
                style={{ background:PA.amberBg, border:`1px solid ${PA.amberBdr}` }}>
                <RotateCcw className="w-5 h-5" style={{ color:PA.amber }} />
              </div>
              <h3 className="text-[14px] font-bold mb-1" style={{ color:T.text }}>Restore to {selectedVersion?.version}?</h3>
              <p className="text-[12px] leading-relaxed mb-5" style={{ color:T.textMuted }}>
                This will create a new version with the content from <strong>{selectedVersion?.version}</strong>.
                Your current version {VERSIONS.find(v=>v.isCurrent)?.version} will be preserved in history.
              </p>
              <div className="flex gap-2">
                <button onClick={() => setShowRestore(false)}
                  className="flex-1 py-2 rounded-xl text-[12px] font-semibold cursor-pointer"
                  style={{ background:T.bgCard, color:T.textSub, border:`1px solid ${T.border}` }}>
                  Cancel
                </button>
                <button onClick={() => setShowRestore(false)}
                  className="flex-1 py-2 rounded-xl text-[12px] font-semibold text-white cursor-pointer hover:opacity-90"
                  style={{ background:PA.amber }}>
                  Restore Version
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
