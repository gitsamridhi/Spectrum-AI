'use client';

import React, { useState } from 'react';
import {
  Sparkles, Plus, GripVertical, Download,
  CheckCircle2, ChevronDown, BarChart2,
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

const PA = {
  blue:'#EC4899',blueBg:'rgba(236,72,153,0.10)',blueBdr:'rgba(236,72,153,0.28)',
  teal:'#A855F7',tealBg:'rgba(168,85,247,0.10)',tealBdr:'rgba(168,85,247,0.28)',
  amber:'#F59E0B',amberBg:'rgba(245,158,11,0.10)',amberBdr:'rgba(245,158,11,0.28)',
};

const SECTIONS   = ['Contact','Summary','Experience','Skills','Education','Awards'];
const TEMPLATES  = ['Minimal','Classic','Modern','Bold'];
const ATS_SCORE  = 84;

const SKILLS_LIST = ['Editorial','Commercial','High Fashion','Beauty','Runway','Film','Brand Strategy','Creative Direction'];
const EXPERIENCE  = [
  { role:'Lead Model',      company:'Vogue Paris',    period:'2021 — Present',     bullets:['Cover model for 4 consecutive issues','Worked alongside Carine Roitfeld on special edition'] },
  { role:'Brand Ambassador',company:'Dior Beauty',    period:'2019 — 2021',        bullets:['Global campaign across 22 markets','Face of Rouge Dior Lipstick 2020'] },
  { role:'Model',           company:'IMG Models NYC', period:'2016 — 2019',        bullets:['Agency representation from age 22','Booked 80+ campaigns in first 2 years'] },
];

export default function PortfolioResumeStudio() {
  const { T } = useTheme();
  const [section,   setSection]   = useState('contact');
  const [template,  setTemplate]  = useState(0);
  const [atsMode,   setAtsMode]   = useState(false);
  const [expanded,  setExpanded]  = useState<number | null>(0);

  const scoreColor = ATS_SCORE >= 80 ? PA.teal : PA.amber;
  const scoreBg    = ATS_SCORE >= 80 ? PA.tealBg : PA.amberBg;
  const scoreBdr   = ATS_SCORE >= 80 ? PA.tealBdr : PA.amberBdr;

  const accentColors = [T.text, '#1e293b', PA.blue, '#dc2626'];
  const accentColor  = accentColors[template] ?? T.text;

  return (
    <div className="flex-1 flex overflow-hidden">

      {/* ── Left: Editor ── */}
      <div className="w-[400px] shrink-0 flex flex-col" style={{ borderRight: `1px solid ${T.border}`, background: T.bgSub }}>

        {/* Editor header */}
        <div className="shrink-0 flex items-center px-5 h-11 gap-3"
          style={{ borderBottom: `1px solid ${T.border}`, background: T.bg }}>
          <span className="text-[12.5px] font-bold" style={{ color: T.text }}>Resume Editor</span>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{ background: scoreBg, border: `1px solid ${scoreBdr}` }}>
              <BarChart2 className="w-2.5 h-2.5" style={{ color: scoreColor }} />
              <span className="text-[10px] font-bold" style={{ color: scoreColor }}>ATS {ATS_SCORE}%</span>
            </div>
            <button onClick={() => setAtsMode(s => !s)}
              className="px-2.5 py-1 rounded-lg text-[10px] font-semibold cursor-pointer transition-all"
              style={atsMode
                ? { background: PA.blueBg, color: PA.blue, border: `1px solid ${PA.blueBdr}` }
                : { background: T.bgCard,  color: T.textSub, border: `1px solid ${T.border}` }}>
              ATS View
            </button>
          </div>
        </div>

        {/* Section tabs */}
        <div className="shrink-0 flex items-center gap-0.5 px-3 py-2 overflow-x-auto"
          style={{ borderBottom: `1px solid ${T.border}`, scrollbarWidth: 'none' }}>
          {SECTIONS.map(s => (
            <button key={s} onClick={() => setSection(s.toLowerCase())}
              className="px-3 py-1 rounded-lg text-[10.5px] font-medium whitespace-nowrap cursor-pointer transition-all"
              style={section === s.toLowerCase()
                ? { background: T.bgCard, color: T.text, border: `1px solid ${T.border}` }
                : { color: T.textMuted }}>
              {s}
            </button>
          ))}
        </div>

        {/* Section content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3" style={{ scrollbarWidth: 'none' }}>
          {section === 'contact' && (
            <>
              {[
                ['Full Name','Sarah Chen'],['Title','Fashion Model & Creative Director'],
                ['Email','sarah@sarahchen.com'],['Phone','+1 (212) 555-0100'],
                ['Location','New York, NY'],['Website','sarahchen.com'],
              ].map(([label, val]) => (
                <div key={label}>
                  <label className="text-[9px] font-bold uppercase tracking-widest block mb-1" style={{ color: T.textMuted }}>{label}</label>
                  <input defaultValue={val}
                    className="w-full px-3 py-2 rounded-xl text-[12px] outline-none"
                    style={{ background: T.inputBg, border: `1px solid ${T.border}`, color: T.text }} />
                </div>
              ))}
            </>
          )}

          {section === 'summary' && (
            <div>
              <label className="text-[9px] font-bold uppercase tracking-widest block mb-1" style={{ color: T.textMuted }}>Professional Summary</label>
              <textarea defaultValue="Award-winning model and creative director with 8+ years of international experience. Collaborator with Dior, Vogue, and MAC across 40+ global publications."
                className="w-full h-32 px-3 py-2.5 rounded-xl text-[12px] outline-none resize-none"
                style={{ background: T.inputBg, border: `1px solid ${T.border}`, color: T.text }} />
              <button className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold text-white cursor-pointer hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #EC4899, #A855F7)', boxShadow: '0 0 16px rgba(236,72,153,0.28)' }}>
                <Sparkles className="w-3 h-3" />AI Enhance
              </button>
            </div>
          )}

          {section === 'experience' && (
            <div className="space-y-2">
              {EXPERIENCE.map((exp, i) => (
                <div key={i} className="rounded-xl overflow-hidden"
                  style={{ background: T.bg, border: `1px solid ${T.border}` }}>
                  <button className="w-full flex items-center gap-2.5 px-3.5 py-3 cursor-pointer"
                    onClick={() => setExpanded(expanded === i ? null : i)}>
                    <GripVertical className="w-3 h-3 shrink-0" style={{ color: T.textMuted }} />
                    <div className="flex-1 text-left">
                      <p className="text-[12px] font-semibold" style={{ color: T.text }}>{exp.role}</p>
                      <p className="text-[10.5px]" style={{ color: T.textMuted }}>{exp.company} · {exp.period}</p>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded === i ? 'rotate-180' : ''}`}
                      style={{ color: T.textMuted }} />
                  </button>
                  {expanded === i && (
                    <div className="px-3.5 pb-3" style={{ borderTop: `1px solid ${T.border}` }}>
                      <div className="pt-3 space-y-1.5">
                        {exp.bullets.map((b, j) => (
                          <input key={j} defaultValue={`• ${b}`}
                            className="w-full px-2.5 py-1.5 rounded-lg text-[11px] outline-none"
                            style={{ background: T.inputBg, border: `1px solid ${T.border}`, color: T.text }} />
                        ))}
                        <button className="flex items-center gap-1 text-[10.5px] font-medium mt-1 cursor-pointer"
                          style={{ color: PA.blue }}>
                          <Plus className="w-3 h-3" />Add bullet
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <button className="flex items-center gap-1.5 text-[11px] font-medium cursor-pointer" style={{ color: PA.blue }}>
                <Plus className="w-3.5 h-3.5" />Add Experience
              </button>
            </div>
          )}

          {section === 'skills' && (
            <div>
              <label className="text-[9px] font-bold uppercase tracking-widest block mb-2" style={{ color: T.textMuted }}>Skills</label>
              <div className="flex flex-wrap gap-1.5">
                {SKILLS_LIST.map(sk => (
                  <span key={sk} className="px-2.5 py-1 rounded-full text-[11px] font-medium cursor-pointer"
                    style={{ background: PA.blueBg, color: PA.blue, border: `1px solid ${PA.blueBdr}` }}>
                    {sk}
                  </span>
                ))}
                <button className="px-2.5 py-1 rounded-full text-[11px] font-medium cursor-pointer"
                  style={{ background: T.bgCard, color: T.textMuted, border: `1px solid ${T.border}` }}>
                  + Add
                </button>
              </div>
            </div>
          )}

          {!['contact','summary','experience','skills'].includes(section) && (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: T.bgCard }}>
                <Plus className="w-4 h-4" style={{ color: T.textMuted }} />
              </div>
              <p className="text-[12px] font-medium" style={{ color: T.text }}>
                {section.charAt(0).toUpperCase() + section.slice(1)} section
              </p>
              <p className="text-[11px]" style={{ color: T.textMuted }}>Click to add content</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Right: Live preview ── */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ background: T.bgSub }}>

        {/* Template bar */}
        <div className="shrink-0 flex items-center gap-2 px-5 h-11"
          style={{ borderBottom: `1px solid ${T.border}`, background: T.bg }}>
          <span className="text-[9px] font-bold uppercase tracking-widest mr-1" style={{ color: T.textMuted }}>Template</span>
          {TEMPLATES.map((t, i) => (
            <button key={t} onClick={() => setTemplate(i)}
              className="px-2.5 py-1 rounded-lg text-[10.5px] font-medium cursor-pointer transition-all"
              style={template === i
                ? { background: 'linear-gradient(135deg, #EC4899, #A855F7)', color: '#fff' }
                : { background: T.bgCard, color: T.textSub, border: `1px solid ${T.border}` }}>
              {t}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            {atsMode && (
              <span className="text-[9.5px] font-semibold px-2.5 py-0.5 rounded-full"
                style={{ background: PA.amberBg, color: PA.amber, border: `1px solid ${PA.amberBdr}` }}>
                ATS Mode
              </span>
            )}
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold cursor-pointer"
              style={{ background: T.bgCard, color: T.textSub, border: `1px solid ${T.border}` }}>
              <Download className="w-3 h-3" />Export PDF
            </button>
          </div>
        </div>

        {/* Resume preview */}
        <div className="flex-1 overflow-y-auto flex justify-center px-8 py-8" style={{ scrollbarWidth: 'none' }}>
          <div className="w-full max-w-[580px] rounded-2xl overflow-hidden shadow-md"
            style={{ background: '#fff', border: `1px solid ${T.border}` }}>

            {/* Resume head */}
            <div className="px-9 py-7"
              style={{ background: template === 1 ? '#0f172a' : template === 2 ? PA.blueBg : template === 3 ? '#7f1d1d' : '#fff' }}>
              <h1 className="text-[30px] font-black tracking-[-0.04em]"
                style={{ color: [1,3].includes(template) ? '#fff' : template === 2 ? PA.blue : '#0f172a', fontFamily: 'Inter Tight, sans-serif' }}>
                Sarah Chen
              </h1>
              <p className="text-[13px] mt-0.5 font-medium"
                style={{ color: [1,3].includes(template) ? 'rgba(255,255,255,0.6)' : template === 2 ? PA.blue + 'aa' : '#64748b' }}>
                Fashion Model & Creative Director
              </p>
              {atsMode ? (
                <p className="text-[10.5px] mt-2" style={{ color: '#94a3b8' }}>
                  sarah@sarahchen.com · +1 212 555 0100 · New York, NY
                </p>
              ) : (
                template > 0 && (
                  <div className="flex items-center gap-3 mt-2.5 flex-wrap">
                    {['sarah@sarahchen.com','+1 (212) 555-0100','New York, NY'].map(c => (
                      <span key={c} className="text-[10.5px]"
                        style={{ color: [1,3].includes(template) ? 'rgba(255,255,255,0.55)' : '#94a3b8' }}>
                        {c}
                      </span>
                    ))}
                  </div>
                )
              )}
            </div>

            {/* Body */}
            <div className="px-9 py-6 space-y-5">
              {[{
                title: 'Summary',
                content: <p className="text-[11.5px] leading-relaxed" style={{ color: '#475569' }}>Award-winning model with 8+ years of international experience spanning high-fashion editorial and commercial campaigns. Collaborator with Dior, Vogue, and MAC Cosmetics.</p>,
              },{
                title: 'Experience',
                content: (
                  <div className="space-y-3">
                    {EXPERIENCE.slice(0,2).map((exp,i) => (
                      <div key={i}>
                        <div className="flex items-baseline justify-between">
                          <p className="text-[12px] font-semibold" style={{ color: '#1e293b' }}>{exp.role}</p>
                          <span className="text-[10px]" style={{ color: '#94a3b8' }}>{exp.period}</span>
                        </div>
                        <p className="text-[11px]" style={{ color: '#64748b' }}>{exp.company}</p>
                      </div>
                    ))}
                  </div>
                ),
              },{
                title: 'Skills',
                content: (
                  <div className="flex flex-wrap gap-1.5">
                    {SKILLS_LIST.slice(0,6).map(sk => (
                      <span key={sk} className="px-2 py-0.5 rounded-full text-[10px]"
                        style={atsMode
                          ? { color: '#475569' }
                          : { background: '#f1f5f9', color: '#475569' }}>
                        {sk}{atsMode ? ' •' : ''}
                      </span>
                    ))}
                  </div>
                ),
              }].map(sec => (
                <div key={sec.title}>
                  <h3 className="text-[9px] font-bold uppercase tracking-widest mb-2.5"
                    style={{ color: template === 2 ? PA.blue : template === 3 ? '#dc2626' : '#94a3b8' }}>
                    {sec.title}
                  </h3>
                  {sec.content}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
