'use client';

import React, { useState } from 'react';
import {
  Globe, Eye, EyeOff, Link, Copy, Share2,
  Smartphone, Monitor, ChevronDown, CheckCircle2,
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

const PA = {
  blue:'#EC4899',blueBg:'rgba(236,72,153,0.10)',blueBdr:'rgba(236,72,153,0.28)',
  teal:'#A855F7',tealBg:'rgba(168,85,247,0.10)',tealBdr:'rgba(168,85,247,0.28)',
  amber:'#F59E0B',amberBg:'rgba(245,158,11,0.10)',amberBdr:'rgba(245,158,11,0.28)',
};

const PROFILE_VIEWS = [
  { id:'public',   label:'Public',   desc:'Anyone with the link'  },
  { id:'agency',   label:'Agency',   desc:'Registered agencies'   },
  { id:'casting',  label:'Casting',  desc:'Casting directors'      },
  { id:'client',   label:'Client',   desc:'Direct client access'  },
];

const SECTION_TOGGLES = [
  { id:'bio',          label:'Bio',           on: true  },
  { id:'portfolio',    label:'Portfolio',     on: true  },
  { id:'measurements', label:'Measurements',  on: true  },
  { id:'compcard',     label:'Comp Card',     on: true  },
  { id:'introreel',    label:'Intro Reel',    on: false },
  { id:'sociallinks',  label:'Social Links',  on: true  },
  { id:'contact',      label:'Contact Info',  on: false },
  { id:'availability', label:'Availability',  on: true  },
];

const THEMES = [
  { id:'clean',  label:'Clean',  bg:'#ffffff', accent:'#EC4899' },
  { id:'noir',   label:'Noir',   bg:'#0f0f12', accent:'#e2e8f0' },
  { id:'warm',   label:'Warm',   bg:'#FAFAF5', accent:'#C2410C' },
  { id:'violet', label:'Violet', bg:'#f5f3ff', accent:'#8B5CF6' },
];

type DevicePreview = 'desktop' | 'mobile';

export default function PortfolioPublicBuilder() {
  const { T } = useTheme();
  const [profileView, setProfileView] = useState('public');
  const [sections,    setSections]    = useState(SECTION_TOGGLES.map(s => ({ ...s })));
  const [theme,       setTheme]       = useState(0);
  const [device,      setDevice]      = useState<DevicePreview>('desktop');
  const [slug,        setSlug]        = useState('sarahchen');
  const [copied,      setCopied]      = useState(false);

  const selectedTheme = THEMES[theme];

  const toggleSection = (id: string) =>
    setSections(ss => ss.map(s => s.id === id ? { ...s, on: !s.on } : s));

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const visibleSections = sections.filter(s => s.on);

  return (
    <div className="flex-1 flex overflow-hidden">

      {/* ── Left: Configuration ── */}
      <div className="w-[280px] shrink-0 flex flex-col overflow-y-auto"
        style={{ borderRight: `1px solid ${T.border}`, background: T.bgSub, scrollbarWidth: 'none' }}>
        <div className="p-5 space-y-6">

          {/* Profile view type */}
          <div>
            <label className="text-[9px] font-bold uppercase tracking-widest block mb-2.5" style={{ color: T.textMuted }}>Profile View</label>
            <div className="space-y-1">
              {PROFILE_VIEWS.map(v => (
                <button key={v.id} onClick={() => setProfileView(v.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all text-left"
                  style={profileView === v.id
                    ? { background: PA.blueBg, border: `1px solid ${PA.blueBdr}` }
                    : { background: T.bg, border: `1px solid ${T.border}` }}
                  onMouseEnter={e => { if (profileView !== v.id) e.currentTarget.style.background = T.bgHover; }}
                  onMouseLeave={e => { if (profileView !== v.id) e.currentTarget.style.background = T.bg; }}>
                  <Globe className="w-3.5 h-3.5 shrink-0" style={{ color: profileView === v.id ? PA.blue : T.textMuted }} />
                  <div>
                    <p className="text-[11.5px] font-semibold" style={{ color: profileView === v.id ? PA.blue : T.text }}>{v.label}</p>
                    <p className="text-[10px]" style={{ color: T.textMuted }}>{v.desc}</p>
                  </div>
                  {profileView === v.id && <CheckCircle2 className="w-3.5 h-3.5 ml-auto shrink-0" style={{ color: PA.blue }} />}
                </button>
              ))}
            </div>
          </div>

          {/* Section visibility */}
          <div>
            <label className="text-[9px] font-bold uppercase tracking-widest block mb-2.5" style={{ color: T.textMuted }}>Sections</label>
            <div className="space-y-1.5">
              {sections.map(s => (
                <button key={s.id} onClick={() => toggleSection(s.id)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all"
                  style={{ background: T.bg, border: `1px solid ${T.border}` }}
                  onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)}
                  onMouseLeave={e => (e.currentTarget.style.background = T.bg)}>
                  <span className="text-[11.5px] font-medium" style={{ color: s.on ? T.text : T.textMuted }}>{s.label}</span>
                  {s.on
                    ? <Eye    className="w-3.5 h-3.5 shrink-0" style={{ color: PA.teal  }} />
                    : <EyeOff className="w-3.5 h-3.5 shrink-0" style={{ color: T.textMuted }} />}
                </button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div>
            <label className="text-[9px] font-bold uppercase tracking-widest block mb-2.5" style={{ color: T.textMuted }}>Theme</label>
            <div className="grid grid-cols-4 gap-1.5">
              {THEMES.map((t, i) => (
                <button key={t.id} onClick={() => setTheme(i)}
                  className="flex flex-col items-center gap-1 cursor-pointer">
                  <div className="w-full aspect-square rounded-xl border-2 transition-all"
                    style={{
                      background: t.bg,
                      borderColor: theme === i ? PA.blue : T.border,
                    }}>
                    <div className="w-2/3 h-0.5 rounded-full mx-auto mt-3" style={{ background: t.accent }} />
                    <div className="w-1/2 h-0.5 rounded-full mx-auto mt-1.5" style={{ background: t.accent + '70' }} />
                  </div>
                  <span className="text-[9.5px] font-medium" style={{ color: theme === i ? PA.blue : T.textMuted }}>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* URL */}
          <div>
            <label className="text-[9px] font-bold uppercase tracking-widest block mb-2" style={{ color: T.textMuted }}>Public URL</label>
            <div className="flex items-center gap-1 px-3 py-2 rounded-xl"
              style={{ background: T.inputBg, border: `1px solid ${T.border}` }}>
              <span className="text-[11px] shrink-0" style={{ color: T.textMuted }}>spectrum.ai/</span>
              <input value={slug} onChange={e => setSlug(e.target.value)}
                className="flex-1 text-[11px] font-semibold bg-transparent outline-none"
                style={{ color: T.text }} />
            </div>
          </div>

          {/* SEO preview */}
          <div>
            <label className="text-[9px] font-bold uppercase tracking-widest block mb-2" style={{ color: T.textMuted }}>SEO Preview</label>
            <div className="px-3 py-2.5 rounded-xl" style={{ background: T.bg, border: `1px solid ${T.border}` }}>
              <p className="text-[10.5px] font-semibold" style={{ color: PA.blue }}>Sarah Chen — Fashion Model · Spectrum AI</p>
              <p className="text-[9.5px] mt-0.5" style={{ color: PA.teal }}>spectrum.ai/{slug}</p>
              <p className="text-[9.5px] mt-1 leading-relaxed" style={{ color: T.textMuted }}>Award-winning model and creative director based in New York. View my portfolio, comp card, and intro reel.</p>
            </div>
          </div>

          {/* Share actions */}
          <div className="flex flex-col gap-2">
            <button onClick={handleCopy}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-[11.5px] font-semibold text-white cursor-pointer hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #EC4899, #A855F7)', boxShadow: '0 0 16px rgba(236,72,153,0.28)' }}>
              {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
            <button className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-[11.5px] font-semibold cursor-pointer"
              style={{ background: T.bgCard, color: T.textSub, border: `1px solid ${T.border}` }}>
              <Share2 className="w-3.5 h-3.5" />Share Profile
            </button>
          </div>

        </div>
      </div>

      {/* ── Right: Live preview ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Preview toolbar */}
        <div className="shrink-0 h-11 flex items-center px-5 gap-3"
          style={{ borderBottom: `1px solid ${T.border}`, background: T.bg }}>
          <div className="flex items-center gap-0.5 p-0.5 rounded-lg" style={{ background: T.bgCard }}>
            {([['desktop', Monitor], ['mobile', Smartphone]] as [DevicePreview, React.ElementType][]).map(([d, Icon]) => (
              <button key={d} onClick={() => setDevice(d)}
                className="w-7 h-7 flex items-center justify-center rounded-md cursor-pointer transition-all"
                style={device === d
                  ? { background: T.bg, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }
                  : {}}>
                <Icon className="w-3.5 h-3.5" style={{ color: device === d ? T.text : T.textMuted }} />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
            style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
            <Link className="w-3 h-3" style={{ color: T.textMuted }} />
            <span className="text-[10.5px] font-medium" style={{ color: T.textSub }}>spectrum.ai/{slug}</span>
          </div>
          <span className="ml-auto text-[10px]" style={{ color: T.textMuted }}>Live Preview</span>
        </div>

        {/* Preview area */}
        <div className="flex-1 overflow-y-auto flex items-start justify-center py-6 px-8"
          style={{ background: T.bgSub, scrollbarWidth: 'none' }}>
          <div className="transition-all duration-300"
            style={{ width: device === 'mobile' ? 320 : '100%', maxWidth: device === 'mobile' ? 320 : 680 }}>

            <div className="overflow-hidden shadow-xl rounded-2xl"
              style={{ background: selectedTheme.bg, border: `1px solid rgba(0,0,0,0.08)` }}>

              {/* Profile header */}
              <div className="relative overflow-hidden" style={{ height: 160 }}>
                <img src="/pexels-didsss-2791056.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 40%, ${selectedTheme.bg})` }} />
              </div>

              <div className="px-7 pb-7 -mt-10 relative z-10">
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <h1 className="text-[22px] font-black tracking-[-0.04em]"
                      style={{ color: selectedTheme.id === 'noir' ? '#fff' : '#0f172a', fontFamily: 'Inter Tight, sans-serif' }}>
                      Sarah Chen
                    </h1>
                    <p className="text-[12px] mt-0.5" style={{ color: selectedTheme.accent }}>
                      Fashion Model · Creative Director
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black"
                    style={{ background: selectedTheme.accent, color: '#fff' }}>SC</div>
                </div>

                {/* Visible sections preview */}
                <div className="space-y-4">
                  {visibleSections.slice(0, 5).map(s => (
                    <div key={s.id}>
                      <p className="text-[8.5px] font-bold uppercase tracking-widest mb-1.5"
                        style={{ color: selectedTheme.accent + '99' }}>{s.label}</p>
                      <div className="h-2 rounded-full" style={{ background: selectedTheme.id === 'noir' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', width: s.id === 'bio' ? '90%' : s.id === 'portfolio' ? '100%' : '70%' }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-center text-[10px] mt-3" style={{ color: T.textMuted }}>
              {visibleSections.length} sections visible · {selectedTheme.label} theme · {profileView} view
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
