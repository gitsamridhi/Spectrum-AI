'use client';

import React, { useState } from 'react';
import {
  Sparkles, Target, Zap, Shield, TrendingUp,
  Image as ImageIcon, FileText, FileCheck,
  AlertCircle, CheckCircle2, ArrowRight, X,
  Star, ChevronRight, RefreshCw, Brain,
  Layers, BarChart2, Globe,
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

const PA = {
  blue:'#EC4899',blueBg:'rgba(236,72,153,0.10)',blueBdr:'rgba(236,72,153,0.28)',
  teal:'#A855F7',tealBg:'rgba(168,85,247,0.10)',tealBdr:'rgba(168,85,247,0.28)',
  amber:'#F59E0B',amberBg:'rgba(245,158,11,0.10)',amberBdr:'rgba(245,158,11,0.28)',
  red:'#EF4444',redBg:'rgba(239,68,68,0.10)',redBdr:'rgba(239,68,68,0.28)',
  violet:'#8B5CF6',violetBg:'rgba(139,92,246,0.10)',violetBdr:'rgba(139,92,246,0.28)',
};

type Priority = 'critical' | 'high' | 'medium' | 'low';
type Category = 'all' | 'missing' | 'portfolio' | 'resume' | 'media' | 'profile' | 'actions';

interface Rec {
  id: string;
  category: Exclude<Category, 'all'>;
  priority: Priority;
  title: string;
  desc: string;
  impact: string;
  impactColor: string;
  confidence: number;
  icon: React.ElementType;
  cta: string;
  dismissed?: boolean;
}

const PRIORITY_META: Record<Priority, { label:string; color:string; bg:string; bdr:string }> = {
  critical: { label:'Critical', color:PA.red,    bg:PA.redBg,    bdr:PA.redBdr    },
  high:     { label:'High',     color:PA.amber,  bg:PA.amberBg,  bdr:PA.amberBdr  },
  medium:   { label:'Medium',   color:PA.blue,   bg:PA.blueBg,   bdr:PA.blueBdr   },
  low:      { label:'Low',      color:PA.teal,   bg:PA.tealBg,   bdr:PA.tealBdr   },
};

const CATEGORY_META: Record<Category, { label:string; icon:React.ElementType; color:string; bg:string; bdr:string }> = {
  all:       { label:'All',               icon:Layers,       color:'#475569', bg:'#f8fafc', bdr:'#e2e8f0' },
  missing:   { label:'Missing Data',      icon:AlertCircle,  color:PA.red,    bg:PA.redBg,    bdr:PA.redBdr    },
  portfolio: { label:'Portfolio Boost',   icon:ImageIcon,    color:PA.blue,   bg:PA.blueBg,   bdr:PA.blueBdr   },
  resume:    { label:'Resume Tips',       icon:FileCheck,    color:PA.teal,   bg:PA.tealBg,   bdr:PA.tealBdr   },
  media:     { label:'Media Quality',     icon:ImageIcon,    color:PA.violet, bg:PA.violetBg, bdr:PA.violetBdr },
  profile:   { label:'Profile Reach',     icon:Globe,        color:PA.teal,   bg:PA.tealBg,   bdr:PA.tealBdr   },
  actions:   { label:'Next Actions',      icon:Zap,          color:PA.amber,  bg:PA.amberBg,  bdr:PA.amberBdr  },
};

const ALL_RECS: Rec[] = [
  {
    id:'r1', category:'missing', priority:'critical',
    title:'Add Body Measurements',
    desc:'78% of casting calls on this platform require full measurements. Your profile is being filtered out of 6 active castings right now.',
    impact:'+18 score · +40% casting visibility',
    impactColor:PA.teal,
    confidence:98,
    icon:AlertCircle,
    cta:'Add Now',
  },
  {
    id:'r2', category:'missing', priority:'critical',
    title:'Upload Award Documentation',
    desc:'You have listed 3 awards but have no supporting images or certificates. Agencies require proof documentation for verified badges.',
    impact:'+12 score · Verified badge',
    impactColor:PA.blue,
    confidence:95,
    icon:AlertCircle,
    cta:'Upload Files',
  },
  {
    id:'r3', category:'missing', priority:'high',
    title:'Set Availability Calendar',
    desc:'Your availability is listed as "open" but casting agents prefer a specific calendar view to schedule bookings efficiently.',
    impact:'+6 score · +25% booking inquiries',
    impactColor:PA.amber,
    confidence:87,
    icon:Target,
    cta:'Set Calendar',
  },
  {
    id:'r4', category:'portfolio', priority:'high',
    title:'Add 3+ Seasonal Portfolio Images',
    desc:'Profiles with seasonal photography (SS & FW) receive 40% more agency views. Your current set only covers one season.',
    impact:'+40% profile views',
    impactColor:PA.blue,
    confidence:91,
    icon:ImageIcon,
    cta:'Open Media',
  },
  {
    id:'r5', category:'portfolio', priority:'medium',
    title:'Reorder Portfolio for Visual Flow',
    desc:'AI analysis suggests your strongest images are buried on page 3. Leading with editorial work increases initial engagement by 2.4x.',
    impact:'+2.4× engagement rate',
    impactColor:PA.violet,
    confidence:83,
    icon:Sparkles,
    cta:'Reorder',
  },
  {
    id:'r6', category:'portfolio', priority:'medium',
    title:'Add Before/After Transformation Shots',
    desc:'Commercial clients frequently search for versatility. A before/after section dramatically increases bookings for commercial campaigns.',
    impact:'+30% commercial bookings',
    impactColor:PA.blue,
    confidence:79,
    icon:ImageIcon,
    cta:'Add Images',
  },
  {
    id:'r7', category:'portfolio', priority:'low',
    title:'Improve Cover Image Aspect Ratio',
    desc:'Your cover image is optimized for mobile but gets cropped awkwardly on desktop agency portals. A 16:9 crop is recommended.',
    impact:'Better desktop presentation',
    impactColor:PA.teal,
    confidence:72,
    icon:ImageIcon,
    cta:'Crop Cover',
  },
  {
    id:'r8', category:'resume', priority:'high',
    title:'Strengthen Opening Statement',
    desc:'Your bio\'s opening line reads as generic. Leads that mention a specific achievement or award in the first sentence have 3× more reads.',
    impact:'+3× bio read rate',
    impactColor:PA.blue,
    confidence:94,
    icon:FileText,
    cta:'Open Bio Studio',
  },
  {
    id:'r9', category:'resume', priority:'medium',
    title:'Add Quantifiable Career Metrics',
    desc:'Replace "extensive experience" with specific numbers: years active, markets worked, number of campaigns. Agencies respond to data.',
    impact:'+22% agency response rate',
    impactColor:PA.teal,
    confidence:86,
    icon:BarChart2,
    cta:'Edit Resume',
  },
  {
    id:'r10', category:'media', priority:'high',
    title:'Replace 2 Low-Resolution Images',
    desc:'Two images in your portfolio are under 1200px wide. Agencies printing composite cards require a minimum of 2400px for print quality.',
    impact:'Print-ready quality',
    impactColor:PA.amber,
    confidence:99,
    icon:ImageIcon,
    cta:'Replace Images',
  },
  {
    id:'r11', category:'media', priority:'medium',
    title:'Add Diversity of Lighting Styles',
    desc:'Your portfolio is heavily weighted toward natural light. Adding studio lit and dramatic high-contrast shots improves versatility scoring.',
    impact:'+15% editorial fit score',
    impactColor:PA.violet,
    confidence:76,
    icon:ImageIcon,
    cta:'Upload Shots',
  },
  {
    id:'r12', category:'profile', priority:'medium',
    title:'Connect Social Profiles',
    desc:'Linking your Instagram and TikTok increases your searchability score by 18 points and makes your follower count verifiable for brands.',
    impact:'+18 score · Verified social',
    impactColor:PA.blue,
    confidence:88,
    icon:Globe,
    cta:'Connect',
  },
];

const CATEGORY_COUNTS: Record<Category, number> = {
  all:       ALL_RECS.length,
  missing:   ALL_RECS.filter(r => r.category === 'missing').length,
  portfolio: ALL_RECS.filter(r => r.category === 'portfolio').length,
  resume:    ALL_RECS.filter(r => r.category === 'resume').length,
  media:     ALL_RECS.filter(r => r.category === 'media').length,
  profile:   ALL_RECS.filter(r => r.category === 'profile').length,
  actions:   ALL_RECS.filter(r => r.priority === 'critical' || r.priority === 'high').length,
};

const PRIORITY_ORDER: Priority[] = ['critical', 'high', 'medium', 'low'];

export default function PortfolioRecommendations() {
  const { T } = useTheme();
  const [category, setCategory] = useState<Category>('all');
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [expanded,  setExpanded]  = useState<string | null>(null);

  const filtered = ALL_RECS.filter(r => {
    if (dismissed.has(r.id)) return false;
    if (category === 'all')     return true;
    if (category === 'actions') return r.priority === 'critical' || r.priority === 'high';
    return r.category === category;
  }).sort((a, b) =>
    PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority)
  );

  const criticalCount = ALL_RECS.filter(r => r.priority === 'critical' && !dismissed.has(r.id)).length;

  return (
    <div className="flex-1 flex overflow-hidden">

      {/* ── Left: Category sidebar ── */}
      <div className="w-[196px] shrink-0 flex flex-col"
        style={{ borderRight:`1px solid ${T.border}`, background:T.bgSub }}>

        {/* AI badge */}
        <div className="shrink-0 px-4 py-3 flex items-center gap-2"
          style={{ borderBottom:`1px solid ${T.border}` }}>
          <div className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background:PA.violetBg, border:`1px solid ${PA.violetBdr}` }}>
            <Brain className="w-3.5 h-3.5" style={{ color:PA.violet }} />
          </div>
          <div>
            <p className="text-[11.5px] font-bold" style={{ color:T.text }}>AI Coach</p>
            <p className="text-[9px]" style={{ color:T.textMuted }}>{ALL_RECS.length - dismissed.size} recommendations</p>
          </div>
        </div>

        {/* Critical alert */}
        {criticalCount > 0 && (
          <div className="mx-3 mt-3 px-3 py-2.5 rounded-xl"
            style={{ background:PA.redBg, border:`1px solid ${PA.redBdr}` }}>
            <div className="flex items-center gap-1.5 mb-0.5">
              <AlertCircle className="w-3 h-3" style={{ color:PA.red }} />
              <span className="text-[10px] font-bold" style={{ color:PA.red }}>
                {criticalCount} Critical
              </span>
            </div>
            <p className="text-[9.5px] leading-snug" style={{ color:PA.red + 'bb' }}>
              Address these first — they are actively limiting your reach.
            </p>
          </div>
        )}

        {/* Categories */}
        <div className="flex-1 overflow-y-auto py-3 px-2" style={{ scrollbarWidth:'none' }}>
          {(Object.keys(CATEGORY_META) as Category[]).map(cat => {
            const meta  = CATEGORY_META[cat];
            const count = cat === 'all'
              ? ALL_RECS.length - dismissed.size
              : cat === 'actions'
                ? ALL_RECS.filter(r => (r.priority==='critical'||r.priority==='high') && !dismissed.has(r.id)).length
                : ALL_RECS.filter(r => r.category === cat && !dismissed.has(r.id)).length;
            const isActive = category === cat;
            const Icon = meta.icon;

            return (
              <button key={cat} onClick={() => setCategory(cat)}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left cursor-pointer transition-all mb-0.5"
                style={isActive
                  ? { background:meta.bg, border:`1px solid ${meta.bdr}` }
                  : { border:'1px solid transparent' }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = T.bgHover; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}>
                <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: isActive ? meta.color : T.textMuted }} />
                <span className="flex-1 text-[11.5px] font-medium truncate" style={{ color: isActive ? meta.color : T.textSub }}>
                  {meta.label}
                </span>
                {count > 0 && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                    style={isActive
                      ? { background:meta.bdr, color:meta.color }
                      : { background:T.bgCard, color:T.textMuted }}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Refresh */}
        <div className="shrink-0 p-3" style={{ borderTop:`1px solid ${T.border}` }}>
          <button className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-[10.5px] font-medium cursor-pointer transition-all"
            style={{ background:T.bgCard, color:T.textSub, border:`1px solid ${T.border}` }}
            onMouseEnter={e=>(e.currentTarget.style.background=T.bgHover)}
            onMouseLeave={e=>(e.currentTarget.style.background=T.bgCard)}>
            <RefreshCw className="w-3 h-3" />Refresh Analysis
          </button>
        </div>
      </div>

      {/* ── Center: Recommendation cards ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Toolbar */}
        <div className="shrink-0 h-12 flex items-center px-5 gap-3"
          style={{ borderBottom:`1px solid ${T.border}`, background:T.bg }}>
          <div className="flex items-center gap-1.5">
            {(() => { const m = CATEGORY_META[category]; const Icon = m.icon; return (
              <>
                <Icon className="w-3.5 h-3.5" style={{ color:m.color }} />
                <span className="text-[13px] font-bold tracking-[-0.02em]" style={{ color:T.text }}>{m.label}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold ml-1"
                  style={{ background:m.bg, color:m.color, border:`1px solid ${m.bdr}` }}>
                  {filtered.length}
                </span>
              </>
            ); })()}
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-[10px]" style={{ color:T.textMuted }}>
            <Sparkles className="w-3 h-3" style={{ color:PA.violet }} />
            AI-powered · Updated just now
          </div>
        </div>

        {/* Cards */}
        <div className="flex-1 overflow-y-auto px-5 py-4" style={{ scrollbarWidth:'thin' }}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background:T.bgCard }}>
                <CheckCircle2 className="w-6 h-6" style={{ color:PA.teal }} />
              </div>
              <p className="text-[13px] font-semibold" style={{ color:T.text }}>All caught up!</p>
              <p className="text-[12px]" style={{ color:T.textMuted }}>No recommendations in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 auto-rows-min">
              {filtered.map(rec => {
                const pm    = PRIORITY_META[rec.priority];
                const cm    = CATEGORY_META[rec.category];
                const Icon  = rec.icon;
                const isExp = expanded === rec.id;

                return (
                  <div key={rec.id}
                    className="rounded-2xl overflow-hidden transition-all duration-200"
                    style={{
                      background: T.bgSub,
                      border: `1px solid ${isExp ? PA.blueBdr : T.border}`,
                      gridColumn: isExp ? 'span 2' : 'span 1',
                    }}>

                    {/* Priority indicator line */}
                    <div className="h-0.5" style={{ background: pm.color }} />

                    <div className="p-4">
                      {/* Header */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background:cm.bg, border:`1px solid ${cm.bdr}` }}>
                          <Icon className="w-4 h-4" style={{ color:cm.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                            <span className="text-[8.5px] font-bold px-1.5 py-0.5 rounded"
                              style={{ background:pm.bg, color:pm.color, border:`1px solid ${pm.bdr}` }}>
                              {pm.label}
                            </span>
                            <span className="text-[8.5px] font-bold px-1.5 py-0.5 rounded"
                              style={{ background:cm.bg, color:cm.color }}>
                              {cm.label}
                            </span>
                          </div>
                          <p className="text-[12px] font-semibold leading-snug" style={{ color:T.text }}>{rec.title}</p>
                        </div>
                        <button
                          className="w-5 h-5 flex items-center justify-center rounded-lg cursor-pointer shrink-0"
                          style={{ color:T.textMuted }}
                          onMouseEnter={e=>(e.currentTarget.style.background=T.bgHover)}
                          onMouseLeave={e=>(e.currentTarget.style.background='transparent')}
                          onClick={() => setDismissed(d => { const n=new Set(d); n.add(rec.id); return n; })}>
                          <X className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Description */}
                      <p className="text-[11px] leading-relaxed mb-3"
                        style={{ color:T.textMuted,
                                 WebkitLineClamp: isExp ? undefined : 2,
                                 overflow: isExp ? 'visible' : 'hidden',
                                 display: isExp ? 'block' : '-webkit-box',
                                 WebkitBoxOrient: 'vertical' as React.CSSProperties['WebkitBoxOrient'],
                               }}>
                        {rec.desc}
                      </p>

                      {/* Impact + Confidence */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" style={{ color:rec.impactColor }} />
                          <span className="text-[10px] font-semibold" style={{ color:rec.impactColor }}>{rec.impact}</span>
                        </div>
                        <div className="ml-auto flex items-center gap-1">
                          <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background:T.bgCard }}>
                            <div className="h-full rounded-full" style={{ width:`${rec.confidence}%`, background:PA.teal }} />
                          </div>
                          <span className="text-[9px]" style={{ color:T.textMuted }}>{rec.confidence}%</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold text-white cursor-pointer hover:opacity-90"
                          style={{ background:'linear-gradient(135deg, #EC4899, #A855F7)' }}>
                          <Zap className="w-3 h-3" />{rec.cta}
                        </button>
                        <button
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-medium cursor-pointer"
                          style={{ background:T.bgCard, color:T.textSub, border:`1px solid ${T.border}` }}
                          onClick={() => setExpanded(isExp ? null : rec.id)}>
                          {isExp ? 'Less' : 'More'}
                          <ChevronRight className="w-3 h-3 transition-transform" style={{ transform: isExp ? 'rotate(90deg)' : 'none' }} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
