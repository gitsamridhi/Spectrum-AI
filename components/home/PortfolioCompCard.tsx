'use client';

import React, { useState } from 'react';
import {
  Download, Share2, Eye, EyeOff, Copy, Smartphone, Monitor,
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

const PA = {
  blue:'#EC4899',blueBg:'rgba(236,72,153,0.10)',blueBdr:'rgba(236,72,153,0.28)',
  teal:'#A855F7',tealBg:'rgba(168,85,247,0.10)',tealBdr:'rgba(168,85,247,0.28)',
};

const TEMPLATES = [
  { id:'minimal', label:'Minimal',   bg:'#ffffff',      text:'#111'   },
  { id:'noir',    label:'Noir',      bg:'#0f0f12',      text:'#fff'   },
  { id:'warm',    label:'Warm',      bg:'#FFF7ED',      text:'#7C2D12'},
  { id:'slate',   label:'Slate',     bg:'#0f172a',      text:'#e2e8f0'},
  { id:'sand',    label:'Sand',      bg:'#FAFAF8',      text:'#292524'},
];

const MEASUREMENTS = [
  { label:'Height',  val:'5\'10"'  },
  { label:'Bust',    val:'34"'     },
  { label:'Waist',   val:'24"'     },
  { label:'Hips',    val:'35"'     },
  { label:'Dress',   val:'4 US'    },
  { label:'Shoes',   val:'8 US'    },
  { label:'Eyes',    val:'Brown'   },
  { label:'Hair',    val:'Black'   },
];

export default function PortfolioCompCard() {
  const { T } = useTheme();
  const [tmpl,       setTmpl]       = useState(0);
  const [device,     setDevice]     = useState<'desktop'|'mobile'>('desktop');
  const [showQR,     setShowQR]     = useState(true);
  const [showMeas,   setShowMeas]   = useState(true);
  const [showContact,setShowContact]= useState(true);

  const tpl   = TEMPLATES[tmpl];
  const isDrk = tpl.id === 'noir' || tpl.id === 'slate';

  return (
    <div className="flex-1 flex overflow-hidden">

      {/* ── Left: Controls ── */}
      <div className="w-[200px] shrink-0 flex flex-col overflow-y-auto"
        style={{ borderRight: `1px solid ${T.border}`, background: T.bgSub, scrollbarWidth: 'none' }}>
        <div className="p-4 space-y-5">

          <div>
            <label className="text-[9px] font-bold uppercase tracking-widest block mb-2" style={{ color: T.textMuted }}>Template</label>
            <div className="space-y-1">
              {TEMPLATES.map((t, i) => (
                <button key={t.id} onClick={() => setTmpl(i)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer transition-all text-left"
                  style={tmpl === i
                    ? { background: PA.blueBg, border: `1px solid ${PA.blueBdr}` }
                    : { background: T.bg, border: `1px solid ${T.border}` }}
                  onMouseEnter={e => { if (tmpl !== i) e.currentTarget.style.background = T.bgHover; }}
                  onMouseLeave={e => { if (tmpl !== i) e.currentTarget.style.background = T.bg; }}>
                  <div className="w-5 h-5 rounded-md shrink-0 border"
                    style={{ background: t.bg, borderColor: T.border }} />
                  <span className="text-[11px] font-medium" style={{ color: tmpl === i ? PA.blue : T.textSub }}>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[9px] font-bold uppercase tracking-widest block mb-2" style={{ color: T.textMuted }}>Layout</label>
            <div className="grid grid-cols-2 gap-1">
              {[
                { key:'desktop' as const, icon: Monitor,    label:'Card' },
                { key:'mobile'  as const, icon: Smartphone, label:'Sheet'},
              ].map(({ key, icon: Icon, label }) => (
                <button key={key} onClick={() => setDevice(key)}
                  className="flex flex-col items-center gap-1 py-2.5 rounded-xl border cursor-pointer transition-all"
                  style={device === key
                    ? { background: PA.blueBg, borderColor: PA.blueBdr, color: PA.blue }
                    : { background: T.bg, borderColor: T.border, color: T.textMuted }}>
                  <Icon className="w-4 h-4" />
                  <span className="text-[9.5px] font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[9px] font-bold uppercase tracking-widest block mb-2" style={{ color: T.textMuted }}>Visibility</label>
            <div className="space-y-1.5">
              {[
                { label:'Measurements', on: showMeas,    set: () => setShowMeas(s => !s)    },
                { label:'Contact Info', on: showContact, set: () => setShowContact(s => !s) },
                { label:'QR Code',      on: showQR,      set: () => setShowQR(s => !s)      },
              ].map(item => (
                <button key={item.label} onClick={item.set}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl cursor-pointer"
                  style={{ background: T.bg, border: `1px solid ${T.border}` }}
                  onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)}
                  onMouseLeave={e => (e.currentTarget.style.background = T.bg)}>
                  <span className="text-[10.5px] font-medium" style={{ color: T.textSub }}>{item.label}</span>
                  {item.on
                    ? <Eye    className="w-3 h-3" style={{ color: PA.teal  }} />
                    : <EyeOff className="w-3 h-3" style={{ color: T.textMuted }} />}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Center: Card Preview ── */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ background: T.bgSub }}>
        <div className="shrink-0 flex items-center justify-center py-6 flex-1 overflow-y-auto px-8">
          <div className={`shadow-2xl overflow-hidden transition-all duration-300 ${device === 'mobile' ? 'w-[280px]' : 'w-[560px]'}`}
            style={{ background: tpl.bg, borderRadius: 20, border: `1px solid ${isDrk ? 'rgba(255,255,255,0.1)' : T.border}` }}>

            {/* Photo strip */}
            <div className="flex gap-0.5 overflow-hidden" style={{ height: device === 'mobile' ? 200 : 280 }}>
              {['/Model Headshot x.jpg', '/download (31).jpg', '/download (32).jpg'].slice(0, device === 'mobile' ? 1 : 3).map((src, i) => (
                <img key={i} src={src} alt="" className="flex-1 h-full object-cover" />
              ))}
            </div>

            {/* Card body */}
            <div className="px-6 py-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-[22px] font-black tracking-[-0.04em]" style={{ color: tpl.text, fontFamily: 'Inter Tight, sans-serif' }}>
                    Sarah Chen
                  </h2>
                  <p className="text-[11.5px] mt-0.5" style={{ color: isDrk ? 'rgba(255,255,255,0.55)' : '#94a3b8' }}>
                    Fashion Model · New York
                  </p>
                </div>
                {/* Agency mark */}
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black"
                  style={{ background: isDrk ? 'rgba(255,255,255,0.1)' : T.bgCard, color: tpl.text }}>
                  IMG
                </div>
              </div>

              {showMeas && (
                <div className="mb-4">
                  <p className="text-[8px] font-bold uppercase tracking-widest mb-2"
                    style={{ color: isDrk ? 'rgba(255,255,255,0.4)' : '#94a3b8' }}>Measurements</p>
                  <div className={`grid gap-x-4 gap-y-1.5 ${device === 'mobile' ? 'grid-cols-2' : 'grid-cols-4'}`}>
                    {MEASUREMENTS.map(m => (
                      <div key={m.label}>
                        <p className="text-[8px] uppercase tracking-widest"
                          style={{ color: isDrk ? 'rgba(255,255,255,0.35)' : '#94a3b8' }}>{m.label}</p>
                        <p className="text-[11px] font-semibold" style={{ color: tpl.text }}>{m.val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {showContact && (
                <div className="flex items-center gap-4 pb-4 mb-4"
                  style={{ borderBottom: `1px solid ${isDrk ? 'rgba(255,255,255,0.1)' : T.border}` }}>
                  {['sarah@sarahchen.com','+1 212 555 0100'].map(c => (
                    <p key={c} className="text-[10px]"
                      style={{ color: isDrk ? 'rgba(255,255,255,0.5)' : '#64748b' }}>{c}</p>
                  ))}
                </div>
              )}

              {showQR && (
                <div className="flex items-center gap-3">
                  {/* QR placeholder */}
                  <div className="w-12 h-12 rounded-lg shrink-0 grid grid-cols-3 gap-0.5 p-1.5"
                    style={{ background: isDrk ? 'rgba(255,255,255,0.08)' : T.bgCard }}>
                    {Array.from({length:9}).map((_, i) => (
                      <div key={i} className="rounded-sm"
                        style={{ background: isDrk ? (i%2===0?'rgba(255,255,255,0.5)':'transparent') : (i%2===0?'#334155':'transparent') }} />
                    ))}
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold" style={{ color: tpl.text }}>sarahchen.com/portfolio</p>
                    <p className="text-[9px]" style={{ color: isDrk ? 'rgba(255,255,255,0.35)' : '#94a3b8' }}>Scan to view live portfolio</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Export bar */}
        <div className="shrink-0 flex items-center justify-center gap-3 py-4"
          style={{ borderTop: `1px solid ${T.border}`, background: T.bg }}>
          {[
            { label:'Download PDF',  icon: Download, primary: true  },
            { label:'Download PNG',  icon: Download, primary: false },
            { label:'Copy Link',     icon: Copy,     primary: false },
            { label:'Share',         icon: Share2,   primary: false },
          ].map(btn => (
            <button key={btn.label}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11.5px] font-semibold cursor-pointer hover:opacity-90 transition-all"
              style={btn.primary
                ? { background: 'linear-gradient(135deg, #EC4899, #A855F7)', color: '#fff' }
                : { background: T.bgCard, color: T.textSub, border: `1px solid ${T.border}` }}>
              <btn.icon className="w-3.5 h-3.5" />
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Right: Details ── */}
      <div className="w-[200px] shrink-0 flex flex-col overflow-y-auto"
        style={{ borderLeft: `1px solid ${T.border}`, background: T.bgSub, scrollbarWidth: 'none' }}>
        <div className="p-4 space-y-4">

          <div>
            <label className="text-[9px] font-bold uppercase tracking-widest block mb-2" style={{ color: T.textMuted }}>Measurements</label>
            <div className="space-y-1.5">
              {MEASUREMENTS.map(m => (
                <div key={m.label} className="flex items-center justify-between px-2.5 py-1.5 rounded-xl"
                  style={{ background: T.bg, border: `1px solid ${T.border}` }}>
                  <span className="text-[10px]" style={{ color: T.textMuted }}>{m.label}</span>
                  <input defaultValue={m.val}
                    className="text-[10.5px] font-semibold w-16 text-right bg-transparent outline-none"
                    style={{ color: T.text }} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[9px] font-bold uppercase tracking-widest block mb-2" style={{ color: T.textMuted }}>Agency</label>
            <input defaultValue="IMG Models NYC"
              className="w-full px-2.5 py-2 rounded-xl text-[11px] outline-none"
              style={{ background: T.inputBg, border: `1px solid ${T.border}`, color: T.text }} />
          </div>

          <div>
            <label className="text-[9px] font-bold uppercase tracking-widest block mb-2" style={{ color: T.textMuted }}>Portfolio URL</label>
            <input defaultValue="sarahchen.com/portfolio"
              className="w-full px-2.5 py-2 rounded-xl text-[11px] outline-none"
              style={{ background: T.inputBg, border: `1px solid ${T.border}`, color: T.text }} />
          </div>

        </div>
      </div>

    </div>
  );
}
