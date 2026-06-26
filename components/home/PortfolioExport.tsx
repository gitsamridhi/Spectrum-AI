'use client';

import React, { useState, useEffect } from 'react';
import {
  Download, Share2, CheckCircle2, FileText,
  ImageIcon, Video, Award, Package, ChevronRight, X,
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

const PA = {
  blue:'#EC4899',blueBg:'rgba(236,72,153,0.10)',blueBdr:'rgba(236,72,153,0.28)',
  teal:'#A855F7',tealBg:'rgba(168,85,247,0.10)',tealBdr:'rgba(168,85,247,0.28)',
  amber:'#F59E0B',amberBg:'rgba(245,158,11,0.10)',amberBdr:'rgba(245,158,11,0.28)',
};

const EXPORT_ITEMS = [
  { id:'resume',   icon: FileText,   label:'Resume',         desc:'PDF · ATS-optimised', size:'82KB',  included: true  },
  { id:'bio',      icon: FileText,   label:'Bio',            desc:'Text · All variants', size:'4KB',   included: true  },
  { id:'compcard', icon: Award,      label:'Comp Card',      desc:'PDF · Hi-res print',  size:'2.4MB', included: true  },
  { id:'photos',   icon: ImageIcon,  label:'Portfolio Photos', desc:'JPEG · Full resolution',size:'148MB', included: true },
  { id:'videos',   icon: Video,      label:'Videos',         desc:'MP4 · 1080p',         size:'312MB', included: false },
  { id:'docs',     icon: Package,    label:'Documents',      desc:'PDF bundle',           size:'1.2MB', included: false },
];

const FORMATS = [
  { id:'pdf',   label:'PDF Bundle',  desc:'Single file, print-ready'       },
  { id:'zip',   label:'ZIP Archive', desc:'All files individually packaged' },
  { id:'link',  label:'Share Link',  desc:'Hosted link, always up-to-date'  },
];

type Step = 1 | 2 | 3 | 4 | 5;

export default function PortfolioExport() {
  const { T } = useTheme();
  const [step,     setStep]     = useState<Step>(1);
  const [items,    setItems]    = useState(EXPORT_ITEMS.map(i => ({ ...i })));
  const [format,   setFormat]   = useState('pdf');
  const [progress, setProgress] = useState(0);

  const included    = items.filter(i => i.included);
  const totalSize   = included.reduce((acc, i) => {
    const n = parseFloat(i.size); const unit = i.size.includes('MB') ? 1 : 0.001;
    return acc + n * unit;
  }, 0);
  const totalSizeLabel = totalSize > 1 ? `${totalSize.toFixed(1)} MB` : `${Math.round(totalSize * 1000)} KB`;

  const toggleItem = (id: string) =>
    setItems(is => is.map(i => i.id === id ? { ...i, included: !i.included } : i));

  const startExport = () => {
    setStep(4);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 18 + 4;
      if (p >= 100) { p = 100; clearInterval(iv); setTimeout(() => setStep(5), 400); }
      setProgress(Math.min(Math.round(p), 100));
    }, 280);
  };

  const STEP_LABELS: Record<Step, string> = {
    1: 'Select Content',
    2: 'Choose Format',
    3: 'Review & Confirm',
    4: 'Exporting…',
    5: 'Complete',
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: T.bgSub }}>
      <div className="flex-1 flex items-start justify-center overflow-y-auto px-8 py-10" style={{ scrollbarWidth: 'none' }}>
        <div className="w-full max-w-[560px]">

          {/* Step indicator */}
          {step < 4 && (
            <div className="flex items-center justify-center gap-2 mb-8">
              {([1,2,3] as Step[]).map((s, i) => (
                <React.Fragment key={s}>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all"
                      style={step >= s
                        ? { background: 'linear-gradient(135deg, #EC4899, #A855F7)',   color: '#fff' }
                        : { background: T.bgCard,  color: T.textMuted, border: `1px solid ${T.border}` }}>
                      {step > s ? <CheckCircle2 className="w-3.5 h-3.5" /> : s}
                    </div>
                    <span className="text-[11px] font-medium hidden sm:block"
                      style={{ color: step === s ? T.text : T.textMuted }}>
                      {STEP_LABELS[s]}
                    </span>
                  </div>
                  {i < 2 && <div className="flex-1 h-px max-w-[60px]" style={{ background: step > s ? PA.blue : T.border }} />}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* ── Step 1: Select content ── */}
          {step === 1 && (
            <div className="rounded-2xl overflow-hidden" style={{ background: T.bg, border: `1px solid ${T.border}` }}>
              <div className="px-6 py-5" style={{ borderBottom: `1px solid ${T.border}` }}>
                <h2 className="text-[16px] font-bold" style={{ color: T.text, fontFamily: 'Inter Tight, sans-serif' }}>
                  What to export?
                </h2>
                <p className="text-[12px] mt-1" style={{ color: T.textMuted }}>Select the content to include in your export package.</p>
              </div>
              <div className="divide-y" style={{ borderColor: T.border }}>
                {items.map(item => (
                  <button key={item.id} onClick={() => toggleItem(item.id)}
                    className="w-full flex items-center gap-4 px-6 py-4 cursor-pointer text-left transition-colors"
                    onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={item.included
                        ? { background: PA.blueBg, border: `1px solid ${PA.blueBdr}` }
                        : { background: T.bgCard,  border: `1px solid ${T.border}` }}>
                      <item.icon className="w-4 h-4" style={{ color: item.included ? PA.blue : T.textMuted }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold" style={{ color: T.text }}>{item.label}</p>
                      <p className="text-[11px]" style={{ color: T.textMuted }}>{item.desc}</p>
                    </div>
                    <span className="text-[10.5px] shrink-0" style={{ color: T.textMuted }}>{item.size}</span>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all"
                      style={item.included
                        ? { background: 'linear-gradient(135deg, #EC4899, #A855F7)', boxShadow: '0 0 16px rgba(236,72,153,0.28)' }
                        : { background: T.bgCard, border: `1px solid ${T.border}` }}>
                      {item.included && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                  </button>
                ))}
              </div>
              <div className="px-6 py-4 flex items-center justify-between"
                style={{ borderTop: `1px solid ${T.border}`, background: T.bgSub }}>
                <span className="text-[11px]" style={{ color: T.textMuted }}>
                  {included.length} items · ~{totalSizeLabel}
                </span>
                <button onClick={() => setStep(2)}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[12px] font-semibold text-white cursor-pointer hover:opacity-90"
                  style={{ background: included.length > 0 ? PA.blue : T.bgCard,
                           color: included.length > 0 ? '#fff' : T.textMuted }}>
                  Continue <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ── Step 2: Format ── */}
          {step === 2 && (
            <div className="rounded-2xl overflow-hidden" style={{ background: T.bg, border: `1px solid ${T.border}` }}>
              <div className="px-6 py-5" style={{ borderBottom: `1px solid ${T.border}` }}>
                <h2 className="text-[16px] font-bold" style={{ color: T.text, fontFamily: 'Inter Tight, sans-serif' }}>Export Format</h2>
                <p className="text-[12px] mt-1" style={{ color: T.textMuted }}>How would you like to receive your export?</p>
              </div>
              <div className="p-6 space-y-2.5">
                {FORMATS.map(f => (
                  <button key={f.id} onClick={() => setFormat(f.id)}
                    className="w-full flex items-center gap-4 px-4 py-4 rounded-xl cursor-pointer text-left transition-all"
                    style={format === f.id
                      ? { background: PA.blueBg, border: `2px solid ${PA.blue}` }
                      : { background: T.bgSub,   border: `1px solid ${T.border}` }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={format === f.id
                        ? { background: 'linear-gradient(135deg, #EC4899, #A855F7)', boxShadow: '0 0 16px rgba(236,72,153,0.28)' }
                        : { background: T.bgCard, border: `1px solid ${T.border}` }}>
                      {f.id === 'pdf'  && <FileText  className="w-4 h-4" style={{ color: format === f.id ? '#fff' : T.textMuted }} />}
                      {f.id === 'zip'  && <Package   className="w-4 h-4" style={{ color: format === f.id ? '#fff' : T.textMuted }} />}
                      {f.id === 'link' && <Share2    className="w-4 h-4" style={{ color: format === f.id ? '#fff' : T.textMuted }} />}
                    </div>
                    <div className="flex-1">
                      <p className="text-[13px] font-semibold" style={{ color: format === f.id ? PA.blue : T.text }}>{f.label}</p>
                      <p className="text-[11px]" style={{ color: T.textMuted }}>{f.desc}</p>
                    </div>
                    {format === f.id && <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: PA.blue }} />}
                  </button>
                ))}
              </div>
              <div className="px-6 py-4 flex items-center justify-between" style={{ borderTop: `1px solid ${T.border}`, background: T.bgSub }}>
                <button onClick={() => setStep(1)} className="text-[12px] font-medium cursor-pointer" style={{ color: T.textMuted }}>← Back</button>
                <button onClick={() => setStep(3)}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[12px] font-semibold text-white cursor-pointer hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #EC4899, #A855F7)', boxShadow: '0 0 16px rgba(236,72,153,0.28)' }}>
                  Review <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ── Step 3: Review ── */}
          {step === 3 && (
            <div className="rounded-2xl overflow-hidden" style={{ background: T.bg, border: `1px solid ${T.border}` }}>
              <div className="px-6 py-5" style={{ borderBottom: `1px solid ${T.border}` }}>
                <h2 className="text-[16px] font-bold" style={{ color: T.text, fontFamily: 'Inter Tight, sans-serif' }}>Review Export</h2>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div className="rounded-xl p-4 space-y-3" style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
                  <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: T.textMuted }}>Included</p>
                  {included.map(item => (
                    <div key={item.id} className="flex items-center gap-3">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: PA.teal }} />
                      <span className="text-[12px] flex-1" style={{ color: T.text }}>{item.label}</span>
                      <span className="text-[10.5px]" style={{ color: T.textMuted }}>{item.size}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between px-4 py-3 rounded-xl"
                  style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
                  <span className="text-[12px] font-medium" style={{ color: T.textSub }}>Format</span>
                  <span className="text-[12px] font-semibold" style={{ color: T.text }}>
                    {FORMATS.find(f => f.id === format)?.label}
                  </span>
                </div>
                <div className="flex items-center justify-between px-4 py-3 rounded-xl"
                  style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
                  <span className="text-[12px] font-medium" style={{ color: T.textSub }}>Total size</span>
                  <span className="text-[12px] font-semibold" style={{ color: T.text }}>~{totalSizeLabel}</span>
                </div>
              </div>
              <div className="px-6 py-4 flex items-center justify-between" style={{ borderTop: `1px solid ${T.border}`, background: T.bgSub }}>
                <button onClick={() => setStep(2)} className="text-[12px] font-medium cursor-pointer" style={{ color: T.textMuted }}>← Back</button>
                <button onClick={startExport}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-[12px] font-bold text-white cursor-pointer hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #EC4899, #A855F7)', boxShadow: '0 0 16px rgba(236,72,153,0.28)' }}>
                  <Download className="w-3.5 h-3.5" />Start Export
                </button>
              </div>
            </div>
          )}

          {/* ── Step 4: Progress ── */}
          {step === 4 && (
            <div className="rounded-2xl p-8 text-center" style={{ background: T.bg, border: `1px solid ${T.border}` }}>
              <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                style={{ background: PA.blueBg, border: `1px solid ${PA.blueBdr}` }}>
                <Package className="w-7 h-7 animate-pulse" style={{ color: PA.blue }} />
              </div>
              <h2 className="text-[16px] font-bold mb-2" style={{ color: T.text, fontFamily: 'Inter Tight, sans-serif' }}>Preparing Export…</h2>
              <p className="text-[12px] mb-6" style={{ color: T.textMuted }}>Compiling {included.length} items into your export package.</p>
              <div className="w-full h-2 rounded-full overflow-hidden mb-3" style={{ background: T.bgCard }}>
                <div className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${PA.blue}, ${PA.teal})` }} />
              </div>
              <p className="text-[12px] font-semibold" style={{ color: PA.blue }}>{progress}%</p>
            </div>
          )}

          {/* ── Step 5: Success ── */}
          {step === 5 && (
            <div className="rounded-2xl p-8 text-center" style={{ background: T.bg, border: `1px solid ${T.border}` }}>
              <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                style={{ background: PA.tealBg, border: `1px solid ${PA.tealBdr}` }}>
                <CheckCircle2 className="w-7 h-7" style={{ color: PA.teal }} />
              </div>
              <h2 className="text-[18px] font-black mb-1" style={{ color: T.text, fontFamily: 'Inter Tight, sans-serif' }}>Export Ready</h2>
              <p className="text-[12px] mb-6" style={{ color: T.textMuted }}>
                {included.length} items · {totalSizeLabel} · {FORMATS.find(f=>f.id===format)?.label}
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <button className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[12px] font-semibold text-white cursor-pointer hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #EC4899, #A855F7)', boxShadow: '0 0 16px rgba(236,72,153,0.28)' }}>
                  <Download className="w-3.5 h-3.5" />Download
                </button>
                <button className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[12px] font-semibold cursor-pointer"
                  style={{ background: T.bgCard, color: T.textSub, border: `1px solid ${T.border}` }}>
                  <Share2 className="w-3.5 h-3.5" />Share
                </button>
                <button onClick={() => { setStep(1); setProgress(0); }}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[12px] font-medium cursor-pointer"
                  style={{ color: T.textMuted }}>
                  New Export
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
