'use client';

import React, { useState, useRef } from 'react';
import {
  Sparkles, RotateCcw, RotateCw, Plus, Clock,
  AlertCircle, CheckCircle2, Wand2,
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

const PA = {
  blue:    '#EC4899',   blueBg:  'rgba(236,72,153,0.10)',  blueBdr:  'rgba(236,72,153,0.28)',
  teal:    '#A855F7',   tealBg:  'rgba(168,85,247,0.10)',  tealBdr:  'rgba(168,85,247,0.28)',
  amber:   '#F59E0B',   amberBg: 'rgba(245,158,11,0.10)',  amberBdr: 'rgba(245,158,11,0.28)',
};

const TONES    = ['Professional','Conversational','Creative','Bold','Warm'];
const STYLES   = ['Third Person','First Person'];
const LENGTHS  = ['Short · 50w','Medium · 100w','Long · 200w'];
const FOCUS    = ['Modeling','Commercial','Editorial','Fashion','Film','Beauty'];
const PROMPTS  = ['Mention brand collaborations','Highlight editorial range','Include travel availability'];

const VARIANTS = [
  `Sarah Chen is a New York–based model and creative director with eight years of international experience spanning high-fashion editorial, commercial campaigns, and luxury brand partnerships. Her portfolio includes collaborations with Dior, MAC Cosmetics, and twelve international editions of Vogue. Sarah's distinctive aesthetic — understated yet commanding — has made her a sought-after presence across forty global publications.`,
  `I'm Sarah Chen — a model, creative director, and storyteller based in New York. Eight years of shooting across three continents has taught me that the best images come from genuine connection. Whether it's a Dior fragrance campaign or an editorial for Vogue Paris, I bring focus, range, and an eye for what's quietly unforgettable.`,
  `Eight years. Forty publications. Three continents. Sarah Chen doesn't follow fashion — she shapes it. Based in New York, working everywhere.`,
];

const VERSION_HISTORY = [
  { id: 'current', v: 'Current', t: 'Just now',   bio: VARIANTS[0] },
  { id: 'v2',      v: 'v2',      t: '1 hour ago',  bio: VARIANTS[1] },
  { id: 'v1',      v: 'v1',      t: 'Yesterday',   bio: VARIANTS[2] },
];

export default function PortfolioBioStudio() {
  const { T } = useTheme();
  const [tone,        setTone]        = useState('Professional');
  const [style,       setStyle]       = useState('Third Person');
  const [length,      setLength]      = useState('Medium · 100w');
  const [focus,       setFocus]       = useState(['Modeling','Commercial']);
  const [prompt,      setPrompt]      = useState('');
  const [variant,     setVariant]     = useState(0);
  const [generating,  setGenerating]  = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [bio,         setBio]         = useState(VARIANTS[0]);
  const [applied,     setApplied]     = useState(false);
  const [selectedVersion, setSelectedVersion] = useState('current');
  const [bioHistory,  setBioHistory]  = useState<string[]>([VARIANTS[0]]);
  const [histIndex,   setHistIndex]   = useState(0);
  const bioRef = useRef<HTMLTextAreaElement>(null);

  const pushHistory = (newBio: string) => {
    setBioHistory(h => [...h.slice(0, histIndex + 1), newBio]);
    setHistIndex(i => i + 1);
    setBio(newBio);
  };

  const undo = () => { if (histIndex > 0) { setHistIndex(i => i - 1); setBio(bioHistory[histIndex - 1]); } };
  const redo = () => { if (histIndex < bioHistory.length - 1) { setHistIndex(i => i + 1); setBio(bioHistory[histIndex + 1]); } };

  const generate = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); pushHistory(VARIANTS[variant]); }, 1600);
  };

  const applyBio = () => { setApplied(true); setTimeout(() => setApplied(false), 1800); };

  const applyFormat = (marker: string) => {
    const el = bioRef.current;
    if (!el) return;
    const { selectionStart: start, selectionEnd: end } = el;
    if (start === end) return;
    const next = bio.slice(0, start) + marker + bio.slice(start, end) + marker + bio.slice(end);
    setBio(next);
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(start, end + marker.length * 2); });
  };

  const toggleFocus = (tag: string) =>
    setFocus(f => f.includes(tag) ? f.filter(x => x !== tag) : [...f, tag]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">

      {/* Sticky action bar */}
      <div className="shrink-0 h-11 flex items-center px-5 gap-3"
        style={{ borderBottom: `1px solid ${T.border}`, background: T.bg }}>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-[10px]" style={{ color: T.textMuted }}>Autosaved</span>
        </div>
        <div className="flex items-center gap-1 ml-2">
          <button onClick={undo} disabled={histIndex <= 0} title="Undo"
            className="w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ color: T.textMuted }}
            onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button onClick={redo} disabled={histIndex >= bioHistory.length - 1} title="Redo"
            className="w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ color: T.textMuted }}
            onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => setShowCompare(s => !s)}
            className="px-3 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer transition-all"
            style={showCompare
              ? { background: PA.blueBg, color: PA.blue, border: `1px solid ${PA.blueBdr}` }
              : { background: T.bgCard,  color: T.textSub, border: `1px solid ${T.border}` }}>
            Before / After
          </button>
          <button onClick={applyBio}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[11.5px] font-semibold text-white cursor-pointer hover:opacity-90"
            style={{ background: applied ? PA.teal : 'linear-gradient(135deg, #EC4899, #A855F7)', boxShadow: '0 0 16px rgba(236,72,153,0.28)' }}>
            {applied ? <CheckCircle2 className="w-3.5 h-3.5" /> : null} {applied ? 'Applied' : 'Apply Bio'}
          </button>
        </div>
      </div>

      {/* Three-panel body */}
      <div className="flex-1 flex overflow-hidden">

        {/* ── Left controls ── */}
        <div className="w-[210px] shrink-0 flex flex-col overflow-y-auto"
          style={{ borderRight: `1px solid ${T.border}`, background: T.bgSub, scrollbarWidth: 'none' }}>
          <div className="p-4 space-y-5">

            <div>
              <label className="text-[9px] font-bold uppercase tracking-widest block mb-2" style={{ color: T.textMuted }}>Tone</label>
              <div className="flex flex-wrap gap-1">
                {TONES.map(t => (
                  <button key={t} onClick={() => setTone(t)}
                    className="px-2.5 py-1 rounded-lg text-[10.5px] font-medium border cursor-pointer transition-all"
                    style={tone === t
                      ? { background: 'linear-gradient(135deg, #EC4899, #A855F7)', color:'#fff', borderColor:'transparent' }
                      : { background: T.bg, borderColor: T.border, color: T.textSub }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[9px] font-bold uppercase tracking-widest block mb-2" style={{ color: T.textMuted }}>Writing Style</label>
              <div className="grid grid-cols-2 gap-1">
                {STYLES.map(s => (
                  <button key={s} onClick={() => setStyle(s)}
                    className="py-1.5 rounded-lg text-[10px] font-medium border cursor-pointer transition-all"
                    style={style === s
                      ? { background: 'linear-gradient(135deg, #EC4899, #A855F7)', color:'#fff', borderColor:'transparent' }
                      : { background: T.bg, borderColor: T.border, color: T.textSub }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[9px] font-bold uppercase tracking-widest block mb-2" style={{ color: T.textMuted }}>Length</label>
              <div className="space-y-1">
                {LENGTHS.map(l => (
                  <button key={l} onClick={() => setLength(l)}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[10.5px] font-medium border cursor-pointer transition-all text-left"
                    style={length === l
                      ? { background: PA.blueBg, color: PA.blue, borderColor: PA.blueBdr }
                      : { background: T.bg, borderColor: T.border, color: T.textSub }}>
                    {length === l && <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'linear-gradient(135deg, #EC4899, #A855F7)', boxShadow: '0 0 16px rgba(236,72,153,0.28)' }} />}
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[9px] font-bold uppercase tracking-widest block mb-2" style={{ color: T.textMuted }}>Focus Areas</label>
              <div className="flex flex-wrap gap-1">
                {FOCUS.map(tag => {
                  const on = focus.includes(tag);
                  return (
                    <button key={tag} onClick={() => toggleFocus(tag)}
                      className="px-2 py-0.5 rounded-full text-[10px] font-medium border cursor-pointer transition-all"
                      style={on
                        ? { background: PA.tealBg, color: PA.teal, borderColor: PA.tealBdr }
                        : { background: T.bg, borderColor: T.border, color: T.textMuted }}>
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-[9px] font-bold uppercase tracking-widest block mb-2" style={{ color: T.textMuted }}>Additional Context</label>
              <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
                placeholder="Specific achievements, brand voice, key details…"
                className="w-full h-[72px] px-3 py-2 rounded-xl text-[11px] outline-none resize-none"
                style={{ background: T.inputBg, border: `1px solid ${T.border}`, color: T.text }} />
              <div className="mt-2 space-y-1">
                {PROMPTS.map(p => (
                  <button key={p} onClick={() => setPrompt(prev => prev ? `${prev}. ${p}` : p)}
                    className="w-full flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] text-left cursor-pointer transition-colors"
                    style={{ color: T.textMuted, background: T.bg, border: `1px solid ${T.border}` }}
                    onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)}
                    onMouseLeave={e => (e.currentTarget.style.background = T.bg)}>
                    <Plus className="w-2.5 h-2.5 shrink-0" />{p}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={generate}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-bold cursor-pointer transition-all"
              style={generating
                ? { background: T.bgCard, color: T.textMuted }
                : { background: 'linear-gradient(135deg, #EC4899, #A855F7)', color: '#fff', boxShadow: '0 0 18px rgba(236,72,153,0.3)' }}>
              {generating
                ? <><div className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />Generating…</>
                : <><Sparkles className="w-3.5 h-3.5" />Generate Bio</>}
            </button>
          </div>
        </div>

        {/* ── Center editor ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Variant tabs + meta */}
          <div className="shrink-0 h-10 flex items-center px-5 gap-1"
            style={{ borderBottom: `1px solid ${T.border}` }}>
            {['Variant 1','Variant 2','Variant 3'].map((v, i) => (
              <button key={i} onClick={() => { setVariant(i); pushHistory(VARIANTS[i]); }}
                className="px-3 py-1 rounded-lg text-[11px] font-medium cursor-pointer transition-all"
                style={variant === i
                  ? { background: T.bgCard, color: T.text, border: `1px solid ${T.border}` }
                  : { color: T.textMuted }}>
                {v}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-3">
              <span className="text-[10px]" style={{ color: T.textMuted }}>{bio.split(' ').length} words</span>
              <span className="text-[10px] font-semibold" style={{ color: PA.teal }}>AI Confidence 94%</span>
            </div>
          </div>

          {showCompare ? (
            <div className="flex-1 grid grid-cols-2 overflow-hidden" style={{ borderColor: T.border }}>
              {['Before','After'].map((label, i) => (
                <div key={i} className="flex flex-col overflow-hidden"
                  style={{ borderRight: i === 0 ? `1px solid ${T.border}` : 'none' }}>
                  <div className="shrink-0 px-5 py-2 flex items-center gap-2"
                    style={{ borderBottom: `1px solid ${T.border}` }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: i === 0 ? PA.amber : PA.teal }} />
                    <span className="text-[10px] font-bold uppercase tracking-widest"
                      style={{ color: i === 0 ? PA.amber : PA.teal }}>{label}</span>
                  </div>
                  <div className="flex-1 overflow-y-auto px-7 py-6">
                    <p className="text-[13.5px] leading-[1.9]" style={{ color: T.text }}>{VARIANTS[i]}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto px-8 py-6">
              <div className="flex items-center gap-1 pb-3 mb-4" style={{ borderBottom: `1px solid ${T.border}` }}>
                {[['B', '**'], ['I', '_'], ['U', '__']].map(([f, marker]) => (
                  <button key={f} onClick={() => applyFormat(marker)} title={`Select text, then click to wrap in ${marker}`}
                    className="w-7 h-7 flex items-center justify-center rounded text-[11px] font-bold cursor-pointer"
                    style={{ color: T.textSub }}
                    onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    {f}
                  </button>
                ))}
                <div className="w-px h-4 mx-1" style={{ background: T.border }} />
                <button onClick={generate} disabled={generating}
                  className="flex items-center gap-1 px-2 py-1 rounded text-[10.5px] font-semibold cursor-pointer disabled:opacity-50"
                  style={{ color: PA.blue }}
                  onMouseEnter={e => (e.currentTarget.style.background = PA.blueBg)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <Wand2 className="w-3 h-3" />AI Rewrite
                </button>
              </div>
              {generating ? (
                <div className="space-y-3.5">
                  {[100,90,78,85].map((w,i) => (
                    <div key={i} className="h-3.5 rounded-full animate-pulse" style={{ width: `${w}%`, background: T.bgCard }} />
                  ))}
                </div>
              ) : (
                <textarea ref={bioRef} value={bio} onChange={e => setBio(e.target.value)}
                  className="w-full outline-none resize-none bg-transparent text-[14px] leading-[1.9]"
                  style={{ color: T.text, minHeight: 280 }} />
              )}
            </div>
          )}
        </div>

        {/* ── Right context panel ── */}
        <div className="w-[210px] shrink-0 flex flex-col overflow-y-auto"
          style={{ borderLeft: `1px solid ${T.border}`, background: T.bgSub, scrollbarWidth: 'none' }}>
          <div className="p-4 space-y-5">

            {/* Confidence meter */}
            <div>
              <label className="text-[9px] font-bold uppercase tracking-widest block mb-2.5" style={{ color: T.textMuted }}>AI Confidence</label>
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 shrink-0">
                  <svg width="44" height="44" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="22" cy="22" r="16" fill="none" strokeWidth="5" style={{ stroke: T.bgCard }} />
                    <circle cx="22" cy="22" r="16" fill="none" strokeWidth="5" stroke={PA.teal}
                      strokeDasharray={`${2*Math.PI*16}`} strokeDashoffset={`${2*Math.PI*16*0.06}`} strokeLinecap="round" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[8.5px] font-bold" style={{ color: PA.teal }}>94%</span>
                </div>
                <div>
                  <p className="text-[11px] font-semibold" style={{ color: T.text }}>High</p>
                  <p className="text-[10px]" style={{ color: T.textMuted }}>Profile complete</p>
                </div>
              </div>
            </div>

            {/* Facts used */}
            <div>
              <label className="text-[9px] font-bold uppercase tracking-widest block mb-2" style={{ color: T.textMuted }}>Facts Used</label>
              <div className="flex flex-wrap gap-1">
                {['8 yrs exp.','NYC','Vogue','Dior','MAC','40+ pubs'].map(f => (
                  <span key={f} className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9.5px] font-medium"
                    style={{ background: T.bgCard, color: T.textSub, border: `1px solid ${T.border}` }}>
                    <CheckCircle2 className="w-2.5 h-2.5" style={{ color: PA.teal }} />
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {/* Version history */}
            <div>
              <label className="text-[9px] font-bold uppercase tracking-widest block mb-2" style={{ color: T.textMuted }}>Version History</label>
              <div className="space-y-1.5">
                {VERSION_HISTORY.map((item) => {
                  const on = selectedVersion === item.id;
                  return (
                    <button key={item.id} onClick={() => { setSelectedVersion(item.id); pushHistory(item.bio); }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl cursor-pointer transition-colors text-left"
                      style={on
                        ? { background: PA.blueBg, border: `1px solid ${PA.blueBdr}` }
                        : { background: T.bg,      border: `1px solid ${T.border}` }}
                      onMouseEnter={e => { if (!on) e.currentTarget.style.background = T.bgHover; }}
                      onMouseLeave={e => { if (!on) e.currentTarget.style.background = T.bg; }}>
                      <Clock className="w-2.5 h-2.5 shrink-0" style={{ color: on ? PA.blue : T.textMuted }} />
                      <span className="text-[10.5px] font-medium flex-1" style={{ color: on ? PA.blue : T.textSub }}>{item.v}</span>
                      <span className="text-[9px]" style={{ color: T.textMuted }}>{item.t}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Suggestions */}
            <div>
              <label className="text-[9px] font-bold uppercase tracking-widest block mb-2" style={{ color: T.textMuted }}>AI Suggestions</label>
              <div className="space-y-1.5">
                {['Add campaign names for credibility','Mention awards or press features','Include current representation'].map((s,i) => (
                  <div key={i} onClick={() => setPrompt(prev => prev ? `${prev}. ${s}` : s)}
                    className="flex items-start gap-2 px-2.5 py-2 rounded-xl cursor-pointer"
                    style={{ background: T.bg, border: `1px solid ${T.border}` }}
                    onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)}
                    onMouseLeave={e => (e.currentTarget.style.background = T.bg)}>
                    <Sparkles className="w-2.5 h-2.5 mt-0.5 shrink-0" style={{ color: PA.blue }} />
                    <p className="text-[10px] leading-relaxed" style={{ color: T.textSub }}>{s}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing info */}
            <div>
              <label className="text-[9px] font-bold uppercase tracking-widest block mb-2" style={{ color: T.textMuted }}>Missing Info</label>
              {['Agency name','Recent campaign list'].map((m,i) => (
                <div key={i} className="flex items-center gap-2 px-2.5 py-2 mb-1.5 rounded-xl"
                  style={{ background: PA.amberBg, border: `1px solid ${PA.amberBdr}` }}>
                  <AlertCircle className="w-3 h-3 shrink-0" style={{ color: PA.amber }} />
                  <p className="text-[10px]" style={{ color: PA.amber }}>{m}</p>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
