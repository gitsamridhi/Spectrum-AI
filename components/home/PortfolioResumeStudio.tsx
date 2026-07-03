'use client';

import React, { useState } from 'react';
import {
  Sparkles, Plus, GripVertical, Download,
  CheckCircle2, ChevronDown, BarChart2, X, Check,
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

const SUMMARY_DEFAULT  = 'Award-winning model and creative director with 8+ years of international experience. Collaborator with Dior, Vogue, and MAC across 40+ global publications.';
const SUMMARY_ENHANCED = 'Internationally recognized model and creative director with 8+ years shaping campaigns for Dior, Vogue, and MAC Cosmetics across 40+ global publications — bringing editorial vision and commercial precision to every collaboration.';

interface ExperienceEntry { role: string; company: string; period: string; bullets: string[] }

export default function PortfolioResumeStudio() {
  const { T } = useTheme();
  const [section,   setSection]   = useState('contact');
  const [template,  setTemplate]  = useState(0);
  const [atsMode,   setAtsMode]   = useState(false);
  const [expanded,  setExpanded]  = useState<number | null>(0);

  const [contactFields, setContactFields] = useState<[string, string][]>([
    ['Full Name','Sarah Chen'],['Title','Fashion Model & Creative Director'],
    ['Email','sarah@sarahchen.com'],['Phone','+1 (212) 555-0100'],
    ['Location','New York, NY'],['Website','sarahchen.com'],
  ]);
  const getContact = (label: string) => contactFields.find(([l]) => l === label)?.[1] ?? '';
  const updateContact = (i: number, val: string) =>
    setContactFields(fs => fs.map((f, idx) => idx === i ? [f[0], val] : f));

  const [summary, setSummary]     = useState(SUMMARY_DEFAULT);
  const [enhancing, setEnhancing] = useState(false);

  const [experience, setExperience] = useState<ExperienceEntry[]>(EXPERIENCE.map(e => ({ ...e, bullets: [...e.bullets] })));
  const updateBullet = (i: number, j: number, val: string) =>
    setExperience(ex => ex.map((e, idx) => idx === i ? { ...e, bullets: e.bullets.map((b, bj) => bj === j ? val : b) } : e));
  const addBullet = (i: number) =>
    setExperience(ex => ex.map((e, idx) => idx === i ? { ...e, bullets: [...e.bullets, ''] } : e));
  const addExperience = () => {
    setExperience(ex => [...ex, { role: 'New Role', company: 'Company Name', period: 'Present', bullets: [''] }]);
    setExpanded(experience.length);
  };

  const [skills, setSkills]         = useState<string[]>(SKILLS_LIST);
  const [addingSkill, setAddingSkill] = useState(false);
  const [skillDraft, setSkillDraft]   = useState('');
  const removeSkill = (sk: string) => setSkills(s => s.filter(x => x !== sk));
  const confirmAddSkill = () => {
    if (skillDraft.trim()) setSkills(s => [...s, skillDraft.trim()]);
    setSkillDraft(''); setAddingSkill(false);
  };

  const [otherContent, setOtherContent] = useState<Record<string, string>>({});
  const [exported, setExported] = useState(false);

  const scoreColor = ATS_SCORE >= 80 ? PA.teal : PA.amber;
  const scoreBg    = ATS_SCORE >= 80 ? PA.tealBg : PA.amberBg;
  const scoreBdr   = ATS_SCORE >= 80 ? PA.tealBdr : PA.amberBdr;

  const handleEnhance = () => {
    setEnhancing(true);
    setTimeout(() => { setSummary(SUMMARY_ENHANCED); setEnhancing(false); }, 1400);
  };

  const handleExportPdf = () => {
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${getContact('Full Name')} — Resume</title></head>` +
      `<body style="font-family:sans-serif;max-width:640px;margin:40px auto;color:#1e293b;">` +
      `<h1 style="margin-bottom:0;">${getContact('Full Name')}</h1><p style="color:#64748b;margin-top:4px;">${getContact('Title')}</p>` +
      `<p style="color:#94a3b8;font-size:13px;">${getContact('Email')} · ${getContact('Phone')} · ${getContact('Location')}</p>` +
      `<h3>Summary</h3><p>${summary}</p>` +
      `<h3>Experience</h3>${experience.map(e => `<p><strong>${e.role}</strong> — ${e.company} (${e.period})<br/>${e.bullets.filter(Boolean).join('<br/>')}</p>`).join('')}` +
      `<h3>Skills</h3><p>${skills.join(', ')}</p></body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${getContact('Full Name').replace(/\s+/g, '-').toLowerCase() || 'resume'}.html`;
    a.click();
    URL.revokeObjectURL(url);
    setExported(true); setTimeout(() => setExported(false), 1800);
  };

  const knownSections = ['contact', 'summary', 'experience', 'skills'];

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
              {contactFields.map(([label, val], i) => (
                <div key={label}>
                  <label className="text-[9px] font-bold uppercase tracking-widest block mb-1" style={{ color: T.textMuted }}>{label}</label>
                  <input value={val} onChange={e => updateContact(i, e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-[12px] outline-none"
                    style={{ background: T.inputBg, border: `1px solid ${T.border}`, color: T.text }} />
                </div>
              ))}
            </>
          )}

          {section === 'summary' && (
            <div>
              <label className="text-[9px] font-bold uppercase tracking-widest block mb-1" style={{ color: T.textMuted }}>Professional Summary</label>
              <textarea value={summary} onChange={e => setSummary(e.target.value)}
                className="w-full h-32 px-3 py-2.5 rounded-xl text-[12px] outline-none resize-none"
                style={{ background: T.inputBg, border: `1px solid ${T.border}`, color: T.text }} />
              <button onClick={handleEnhance} disabled={enhancing}
                className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold text-white cursor-pointer hover:opacity-90 disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #EC4899, #A855F7)', boxShadow: '0 0 16px rgba(236,72,153,0.28)' }}>
                <Sparkles className="w-3 h-3" />{enhancing ? 'Enhancing…' : 'AI Enhance'}
              </button>
            </div>
          )}

          {section === 'experience' && (
            <div className="space-y-2">
              {experience.map((exp, i) => (
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
                          <input key={j} value={b} onChange={e => updateBullet(i, j, e.target.value)}
                            placeholder="Describe an achievement…"
                            className="w-full px-2.5 py-1.5 rounded-lg text-[11px] outline-none"
                            style={{ background: T.inputBg, border: `1px solid ${T.border}`, color: T.text }} />
                        ))}
                        <button onClick={() => addBullet(i)} className="flex items-center gap-1 text-[10.5px] font-medium mt-1 cursor-pointer"
                          style={{ color: PA.blue }}>
                          <Plus className="w-3 h-3" />Add bullet
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <button onClick={addExperience} className="flex items-center gap-1.5 text-[11px] font-medium cursor-pointer" style={{ color: PA.blue }}>
                <Plus className="w-3.5 h-3.5" />Add Experience
              </button>
            </div>
          )}

          {section === 'skills' && (
            <div>
              <label className="text-[9px] font-bold uppercase tracking-widest block mb-2" style={{ color: T.textMuted }}>Skills</label>
              <div className="flex flex-wrap gap-1.5">
                {skills.map(sk => (
                  <span key={sk} onClick={() => removeSkill(sk)} title="Click to remove"
                    className="group flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium cursor-pointer"
                    style={{ background: PA.blueBg, color: PA.blue, border: `1px solid ${PA.blueBdr}` }}>
                    {sk}<X className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                ))}
                {addingSkill ? (
                  <span className="flex items-center gap-1 px-1.5 py-1 rounded-full" style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
                    <input autoFocus value={skillDraft} onChange={e => setSkillDraft(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') confirmAddSkill(); if (e.key === 'Escape') { setAddingSkill(false); setSkillDraft(''); } }}
                      placeholder="Skill name"
                      className="text-[11px] outline-none bg-transparent w-20" style={{ color: T.text }} />
                    <button onClick={confirmAddSkill} className="cursor-pointer" style={{ color: PA.teal }}><Check className="w-3 h-3" /></button>
                  </span>
                ) : (
                  <button onClick={() => setAddingSkill(true)} className="px-2.5 py-1 rounded-full text-[11px] font-medium cursor-pointer"
                    style={{ background: T.bgCard, color: T.textMuted, border: `1px solid ${T.border}` }}>
                    + Add
                  </button>
                )}
              </div>
            </div>
          )}

          {!knownSections.includes(section) && (
            otherContent[section] !== undefined ? (
              <div>
                <label className="text-[9px] font-bold uppercase tracking-widest block mb-1" style={{ color: T.textMuted }}>
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </label>
                <textarea value={otherContent[section]} onChange={e => setOtherContent(o => ({ ...o, [section]: e.target.value }))}
                  placeholder={`Add ${section} details…`}
                  className="w-full h-28 px-3 py-2.5 rounded-xl text-[12px] outline-none resize-none"
                  style={{ background: T.inputBg, border: `1px solid ${T.border}`, color: T.text }} />
              </div>
            ) : (
              <div onClick={() => setOtherContent(o => ({ ...o, [section]: '' }))}
                className="flex flex-col items-center justify-center py-12 text-center gap-3 cursor-pointer">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: T.bgCard }}>
                  <Plus className="w-4 h-4" style={{ color: T.textMuted }} />
                </div>
                <p className="text-[12px] font-medium" style={{ color: T.text }}>
                  {section.charAt(0).toUpperCase() + section.slice(1)} section
                </p>
                <p className="text-[11px]" style={{ color: T.textMuted }}>Click to add content</p>
              </div>
            )
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
            <button onClick={handleExportPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold cursor-pointer transition-colors"
              style={exported ? { background: PA.tealBg, color: PA.teal, border: `1px solid ${PA.tealBdr}` } : { background: T.bgCard, color: T.textSub, border: `1px solid ${T.border}` }}>
              {exported ? <CheckCircle2 className="w-3 h-3" /> : <Download className="w-3 h-3" />}{exported ? 'Exported' : 'Export PDF'}
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
                {getContact('Full Name')}
              </h1>
              <p className="text-[13px] mt-0.5 font-medium"
                style={{ color: [1,3].includes(template) ? 'rgba(255,255,255,0.6)' : template === 2 ? PA.blue + 'aa' : '#64748b' }}>
                {getContact('Title')}
              </p>
              {atsMode ? (
                <p className="text-[10.5px] mt-2" style={{ color: '#94a3b8' }}>
                  {getContact('Email')} · {getContact('Phone')} · {getContact('Location')}
                </p>
              ) : (
                template > 0 && (
                  <div className="flex items-center gap-3 mt-2.5 flex-wrap">
                    {[getContact('Email'), getContact('Phone'), getContact('Location')].map(c => (
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
                content: <p className="text-[11.5px] leading-relaxed" style={{ color: '#475569' }}>{summary}</p>,
              },{
                title: 'Experience',
                content: (
                  <div className="space-y-3">
                    {experience.slice(0,2).map((exp,i) => (
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
                    {skills.slice(0,6).map(sk => (
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
