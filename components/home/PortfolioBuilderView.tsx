'use client';

import React, { useState, useRef } from 'react';
import {
  LayoutDashboard, User, List, ChevronLeft,
  Share2, Download, Eye, EyeOff,
  Plus, Trash2, Copy, GripVertical, ChevronDown,
  CheckCircle2, AlertCircle, Sparkles, Star,
  Globe, Award, Briefcase, Clock, Zap,
  Search, Target, Shield, ArrowUpRight,
  BarChart2, Calendar, Link,
  FileText, FileCheck, CreditCard, Film, Package, ImageIcon,
  KanbanSquare, GitBranch, Brain, AreaChart, Layers,
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';
import PortfolioBioStudio      from './PortfolioBioStudio';
import PortfolioResumeStudio   from './PortfolioResumeStudio';
import PortfolioCompCard       from './PortfolioCompCard';
import PortfolioMediaCurator   from './PortfolioMediaCurator';
import PortfolioIntroReel      from './PortfolioIntroReel';
import PortfolioPublicBuilder  from './PortfolioPublicBuilder';
import PortfolioExport         from './PortfolioExport';
import PortfolioApprovals      from './PortfolioApprovals';
import PortfolioVersionHistory from './PortfolioVersionHistory';
import PortfolioRecommendations from './PortfolioRecommendations';
import PortfolioAnalytics      from './PortfolioAnalytics';
import PortfolioDesignSystem   from './PortfolioDesignSystem';

// ── Palette ──────────────────────────────────────────────────────────────────
const PA = {
  blue:     '#EC4899',
  blueBg:   'rgba(236,72,153,0.10)',
  blueBdr:  'rgba(236,72,153,0.28)',
  teal:     '#A855F7',
  tealBg:   'rgba(168,85,247,0.10)',
  tealBdr:  'rgba(168,85,247,0.28)',
  amber:    '#F59E0B',
  amberBg:  'rgba(245,158,11,0.10)',
  amberBdr: 'rgba(245,158,11,0.28)',
  red:      '#EF4444',
  redBg:    'rgba(239,68,68,0.10)',
  redBdr:   'rgba(239,68,68,0.28)',
};

type TabId  = 'dashboard' | 'score' | 'sections';
type ViewId = TabId | 'bio' | 'resume' | 'compcard' | 'media' | 'reel' | 'public' | 'export'
           | 'approvals' | 'versions' | 'recommendations' | 'analytics' | 'design-system';

// ── Static data ───────────────────────────────────────────────────────────────
const SCORE_TOTAL = 78;

const BREAKDOWN = [
  { label: 'Identity',     pct: 100, color: PA.teal  },
  { label: 'Skills',       pct:  85, color: PA.blue  },
  { label: 'Experience',   pct:  72, color: PA.blue  },
  { label: 'Awards',       pct:  60, color: PA.amber },
  { label: 'Measurements', pct:  45, color: PA.red   },
  { label: 'Languages',    pct:  90, color: PA.teal  },
  { label: 'Social Links', pct:  70, color: PA.blue  },
  { label: 'Availability', pct:  55, color: PA.amber },
];

const MISSING_FIELDS = [
  { section: 'Measurements', field: 'Waist & Hip measurements',  urgency: 'high' as const },
  { section: 'Awards',       field: 'Award certificate image',   urgency: 'high' as const },
  { section: 'Availability', field: 'Travel preference',         urgency: 'med'  as const },
  { section: 'Experience',   field: 'Social media statistics',   urgency: 'med'  as const },
];

const SUGGESTIONS = [
  { icon: Sparkles, text: 'Add 3 portfolio images to increase visibility by 40%',   tag: 'High Impact'  },
  { icon: Target,   text: 'Fill Measurements — required for 78% of casting calls',  tag: 'Missing Data' },
  { icon: Zap,      text: 'Connect Instagram to auto-sync follower count',           tag: 'Quick Win'    },
  { icon: Shield,   text: 'Request profile verification to build agency trust',      tag: 'Trust Score'  },
];

const VERSIONS = [
  { name: 'Casting — Commercial',      updated: '2 hours ago',  items: 12, published: true  },
  { name: 'Agency Submission v3',      updated: 'Yesterday',    items:  9, published: false },
  { name: 'Editorial — High Fashion',  updated: '3 days ago',   items: 15, published: false },
];

const REVIEWS = [
  { from: 'Elite Models NY', status: 'pending', sent: '1 day ago',  initials: 'EM', color: PA.blue },
  { from: 'Vogue Casting',   status: 'viewed',  sent: '2 days ago', initials: 'VC', color: PA.teal },
];

// Local model photos from public folder — # chars must be %23 in URL paths
const PORTFOLIO_PHOTOS = {
  h1: '/Model Headshot x.jpg',
  h2: '/download (31).jpg',
  h3: '/download (32).jpg',
  h4: '/download (33).jpg',
  h5: '/VSS Studio Shoot - Come as you are _@vogue_college __styled by_ @anya__reed @sashavonstauffenberg @lucinda_chow @holden_e_peterson _model_ @adaugarangbior _makeup_ @makeupbyjohnmendez __picture not taken by me.jpg',
  h6: '/Результат поиска Google для https___d29c1z66frfv6c_cloudfront.net_pub_media_catalog_product_zoom_a35d69724bed4dea273c3bee36ed661ff0eee6b5_xxl-1.jpg',
  h7: '/𝖡𝗈𝗅𝗎𝗐𝖺𝗍𝗂𝖿𝖾 𝗍𝖾𝗌𝗍 𝗌𝗁𝗈𝗈𝗍 𝗐𝗂𝗍𝗁 @polaroidsbynuel ______%23wlmsmodels %23beunbound %23testshoot %23femalemodel %23femalefashionmodel %23fashionmodeling.jpg',
};

const OUTPUTS = [
  { src: PORTFOLIO_PHOTOS.h1, label: 'Headshot · Studio' },
  { src: PORTFOLIO_PHOTOS.h2, label: 'Fashion Editorial' },
  { src: PORTFOLIO_PHOTOS.h3, label: 'High Fashion Campaign' },
  { src: PORTFOLIO_PHOTOS.h4, label: 'Editorial · Spring' },
];

const SCORE_HISTORY = [62, 65, 68, 70, 72, 75, 75, 78];

interface Section {
  id: string;
  label: string;
  icon: React.ElementType;
  visible: boolean;
  pct: number;
  fields: number;
  filled: number;
}

const INIT_SECTIONS: Section[] = [
  { id: 'identity',     label: 'Identity',     icon: User,      visible: true,  pct: 100, fields: 8, filled: 8 },
  { id: 'skills',       label: 'Skills',       icon: Zap,       visible: true,  pct:  85, fields: 10, filled: 8 },
  { id: 'experience',   label: 'Experience',   icon: Briefcase, visible: true,  pct:  72, fields: 7,  filled: 5 },
  { id: 'awards',       label: 'Awards',       icon: Award,     visible: true,  pct:  60, fields: 5,  filled: 3 },
  { id: 'measurements', label: 'Measurements', icon: BarChart2, visible: true,  pct:  45, fields: 9,  filled: 4 },
  { id: 'languages',    label: 'Languages',    icon: Globe,     visible: true,  pct:  90, fields: 4,  filled: 4 },
  { id: 'social',       label: 'Social Links', icon: Link,      visible: true,  pct:  70, fields: 5,  filled: 3 },
  { id: 'availability', label: 'Availability', icon: Calendar,  visible: false, pct:  55, fields: 6,  filled: 3 },
];

// ── Score Meter SVG ───────────────────────────────────────────────────────────
function ScoreMeter({ score, size = 180 }: { score: number; size?: number }) {
  const { T } = useTheme();
  const R   = (size - 28) / 2;
  const C   = 2 * Math.PI * R;
  const off = C * (1 - score / 100);
  const cx  = size / 2;
  const col = score >= 85 ? PA.teal : score >= 65 ? PA.blue : PA.amber;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={cx} cy={cx} r={R} fill="none" strokeWidth={12} style={{ stroke: T.bgCard }} />
        <circle cx={cx} cy={cx} r={R} fill="none" strokeWidth={12}
          stroke={col} strokeDasharray={C} strokeDashoffset={off}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-[38px] font-black leading-none tracking-[-0.05em]" style={{ color: col }}>{score}</span>
        <span className="text-[11px] font-semibold mt-1" style={{ color: T.textMuted }}>/100</span>
      </div>
    </div>
  );
}

// ── Dashboard Tab ─────────────────────────────────────────────────────────────
function DashboardTab({ onSwitchTab }: { onSwitchTab: (t: ViewId) => void }) {
  const { T } = useTheme();

  const ALL_PHOTOS = [
    PORTFOLIO_PHOTOS.h1, PORTFOLIO_PHOTOS.h2, PORTFOLIO_PHOTOS.h3,
    PORTFOLIO_PHOTOS.h4, PORTFOLIO_PHOTOS.h5, PORTFOLIO_PHOTOS.h6, PORTFOLIO_PHOTOS.h7,
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: T.bg }}>

      <style>{`
        @keyframes ph-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .ph-marquee { display: flex; gap: 6px; width: max-content; animation: ph-marquee 28s linear infinite; }
        .ph-marquee:hover { animation-play-state: paused; }
      `}</style>

      {/* ── BODY ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* ── MAIN ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 18, scrollbarWidth: 'none' }}>

          {/* Portfolio Showcase */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: T.text, margin: 0 }}>Portfolio Showcase</h3>
              <button style={{ fontSize: 10, color: PA.blue, cursor: 'pointer', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 3 }}>
                View all <ArrowUpRight style={{ width: 10, height: 10 }} />
              </button>
            </div>

            {/* One large landscape hero card */}
            <div style={{ borderRadius: 14, overflow: 'hidden', position: 'relative', height: 244, marginBottom: 8, background: T.bgCard, cursor: 'pointer' }}>
              <video
                src="/hero_video2.mp4"
                autoPlay
                loop
                muted
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', top: 10, left: 10, padding: '3px 9px', borderRadius: 20, background: 'rgba(236,72,153,.88)', color: '#fff', fontSize: 8, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase' }}>
                FEATURED
              </div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '22px 14px 12px', background: 'linear-gradient(to top, rgba(0,0,0,.58) 0%, transparent 100%)' }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#fff', margin: 0 }}>Portfolio Showcase · Sarah Chen</p>
              </div>
            </div>

            {/* Horizontal animated scroll strip */}
            <div style={{ overflow: 'hidden', borderRadius: 8 }}>
              <div className="ph-marquee">
                {[...ALL_PHOTOS, ...ALL_PHOTOS].map((src, i) => (
                  <div key={i} style={{ flexShrink: 0, width: 130, height: 94, borderRadius: 8, overflow: 'hidden', background: T.bgCard, cursor: 'pointer' }}>
                    <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent AI Outputs */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: T.text, margin: 0 }}>Recent AI Outputs</h3>
              <button style={{ fontSize: 10, color: T.textMuted, cursor: 'pointer', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: 3 }}>
                View all <ArrowUpRight style={{ width: 10, height: 10 }} />
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
              {OUTPUTS.map((o, i) => (
                <div key={i} style={{ aspectRatio: '3/4', borderRadius: 12, overflow: 'hidden', position: 'relative', background: T.bgCard, cursor: 'pointer' }}>
                  <img src={o.src} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 9px 8px', background: 'linear-gradient(to top, rgba(0,0,0,.65) 0%, transparent 100%)' }}>
                    <p style={{ fontSize: 9, fontWeight: 600, color: '#fff', lineHeight: 1.3, margin: 0 }}>{o.label}</p>
                  </div>
                  <div style={{ position: 'absolute', top: 6, left: 6, width: 17, height: 17, borderRadius: '50%', background: 'linear-gradient(135deg,#EC4899,#A855F7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7.5, fontWeight: 900, color: '#fff' }}>
                    {i + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── RIGHT SIDEBAR (flush to right edge) ── */}
        <div style={{ width: 264, flexShrink: 0, borderLeft: `1px solid ${T.border}`, overflowY: 'auto', display: 'flex', flexDirection: 'column', scrollbarWidth: 'none' }}>

          {/* Profile Score */}
          <div style={{ padding: '18px 16px 14px', borderBottom: `1px solid ${T.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <p style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.12em', color: T.textMuted, margin: 0 }}>Profile Score</p>
              <button onClick={() => onSwitchTab('score')} style={{ fontSize: 9.5, color: PA.blue, cursor: 'pointer', background: 'none', border: 'none' }}>Details →</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginBottom: 8 }}>
              <span style={{ fontSize: 58, fontWeight: 900, lineHeight: 1, letterSpacing: '-.05em', background: 'linear-gradient(135deg,#EC4899,#A855F7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' } as React.CSSProperties}>78</span>
              <span style={{ fontSize: 14, fontWeight: 500, color: T.textMuted }}>/100</span>
            </div>
            <div style={{ height: 4, borderRadius: 9999, background: T.bgCard, overflow: 'hidden', marginBottom: 10 }}>
              <div style={{ height: '100%', width: '78%', borderRadius: 9999, background: 'linear-gradient(90deg,#EC4899,#A855F7)', boxShadow: '0 0 8px rgba(236,72,153,.3)' }} />
            </div>
            {BREAKDOWN.slice(0, 4).map(b => (
              <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                <span style={{ fontSize: 9, color: T.textMuted, width: 74, flexShrink: 0 }}>{b.label}</span>
                <div style={{ flex: 1, height: 2.5, borderRadius: 9999, background: T.bgCard, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${b.pct}%`, borderRadius: 9999, background: b.color }} />
                </div>
                <span style={{ fontSize: 8, fontWeight: 700, color: T.textSub, width: 20, textAlign: 'right' }}>{b.pct}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div style={{ padding: '12px 16px', borderBottom: `1px solid ${T.border}` }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
              {[
                { label: 'Outputs',  val: 24, col: PA.blue  },
                { label: 'Versions', val: 3,  col: PA.teal  },
                { label: 'Reviews',  val: 2,  col: PA.amber },
              ].map(s => (
                <div key={s.label} style={{ borderRadius: 9, padding: '9px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, background: T.bgSub, border: `1px solid ${T.border}` }}>
                  <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-.03em', color: s.col, lineHeight: 1 }}>{s.val}</span>
                  <span style={{ fontSize: 8.5, color: T.textMuted }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Versions */}
          <div style={{ padding: '12px 16px', borderBottom: `1px solid ${T.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <p style={{ fontSize: 10.5, fontWeight: 700, color: T.text, margin: 0 }}>Versions</p>
              <button style={{ fontSize: 9.5, color: PA.blue, cursor: 'pointer', background: 'none', border: 'none' }}>+ New</button>
            </div>
            {VERSIONS.map((v, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 9px', borderRadius: 9, marginBottom: 3, background: T.bgSub, border: `1px solid ${T.border}`, cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)}
                onMouseLeave={e => (e.currentTarget.style.background = T.bgSub)}>
                <div style={{ width: 15, height: 15, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: v.published ? PA.blueBg : T.bgCard, border: `1px solid ${v.published ? PA.blueBdr : T.border}` }}>
                  {v.published
                    ? <CheckCircle2 style={{ width: 8.5, height: 8.5, color: PA.blue }} />
                    : <Star style={{ width: 8.5, height: 8.5, color: T.textMuted }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 9.5, fontWeight: 600, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: T.text }}>{v.name}</p>
                  <p style={{ fontSize: 8.5, color: T.textMuted, margin: 0 }}>{v.items} items · {v.updated}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pending Reviews */}
          <div style={{ padding: '12px 16px', borderBottom: `1px solid ${T.border}` }}>
            <p style={{ fontSize: 10.5, fontWeight: 700, color: T.text, marginBottom: 8, marginTop: 0 }}>Pending Reviews</p>
            {REVIEWS.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 9px', borderRadius: 9, marginBottom: 3, background: T.bgSub, border: `1px solid ${T.border}` }}>
                <div style={{ width: 25, height: 25, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8.5, fontWeight: 700, color: '#fff', flexShrink: 0, background: `linear-gradient(135deg,${r.color},${r.color}bb)` }}>{r.initials}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 9.5, fontWeight: 600, margin: 0, color: T.text }}>{r.from}</p>
                  <p style={{ fontSize: 8.5, color: T.textMuted, margin: 0 }}>{r.sent}</p>
                </div>
                <span style={{ fontSize: 7.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', padding: '2px 6px', borderRadius: 20, background: r.status === 'pending' ? PA.amberBg : PA.tealBg, color: r.status === 'pending' ? PA.amber : PA.teal, border: `1px solid ${r.status === 'pending' ? PA.amberBdr : PA.tealBdr}` }}>{r.status}</span>
              </div>
            ))}
          </div>

          {/* AI Suggestions */}
          <div style={{ padding: '12px 16px' }}>
            <p style={{ fontSize: 10.5, fontWeight: 700, color: T.text, marginBottom: 8, marginTop: 0 }}>AI Suggestions</p>
            {SUGGESTIONS.slice(0, 3).map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, padding: '7px 9px', borderRadius: 9, marginBottom: 4, background: T.bgSub, border: `1px solid ${T.border}`, cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)}
                onMouseLeave={e => (e.currentTarget.style.background = T.bgSub)}>
                <div style={{ width: 14, height: 14, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1.5, background: PA.blueBg }}>
                  <s.icon style={{ width: 8, height: 8, color: PA.blue }} />
                </div>
                <div>
                  <p style={{ fontSize: 9.5, lineHeight: 1.4, color: T.textSub, margin: '0 0 3px' }}>{s.text}</p>
                  <span style={{ fontSize: 8, fontWeight: 700, padding: '1.5px 5px', borderRadius: 4, background: PA.blueBg, color: PA.blue }}>{s.tag}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Profile Score Tab ─────────────────────────────────────────────────────────
function ProfileScoreTab() {
  const { T } = useTheme();

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: T.bg }}>
      <div className="max-w-[1000px] mx-auto px-8 py-7">
        <div className="grid grid-cols-5 gap-8">

          {/* Left: meter + history + missing */}
          <div className="col-span-2 flex flex-col gap-5">

            <div className="rounded-2xl p-6 flex flex-col items-center gap-4"
              style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
              <ScoreMeter score={SCORE_TOTAL} size={190} />
              <div className="text-center">
                <span className="inline-block text-[11px] font-bold px-3 py-1 rounded-full"
                  style={{ background: PA.blueBg, color: PA.blue, border: `1px solid ${PA.blueBdr}` }}>
                  Portfolio Ready
                </span>
                <p className="text-[11px] mt-2 leading-relaxed" style={{ color: T.textMuted }}>
                  Next tier: <strong style={{ color: T.text }}>Optimized</strong> at 85+
                </p>
              </div>

              {/* Score history bar chart */}
              <div className="w-full">
                <p className="text-[9px] font-semibold uppercase tracking-widest mb-2.5 text-center" style={{ color: T.textMuted }}>
                  Score History · 8 Weeks
                </p>
                <div className="flex items-end gap-1.5 justify-center" style={{ height: 44 }}>
                  {SCORE_HISTORY.map((v, i) => {
                    const h = Math.round((v / 100) * 44);
                    const isLast = i === SCORE_HISTORY.length - 1;
                    return (
                      <div key={i} className="flex-1 rounded-t-sm"
                        style={{ height: h, background: isLast ? PA.blue : T.bgCard, minWidth: 8 }} />
                    );
                  })}
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-[9px]" style={{ color: T.textMuted }}>8w ago</span>
                  <span className="text-[9px] font-bold" style={{ color: PA.blue }}>+16 pts</span>
                  <span className="text-[9px]" style={{ color: T.textMuted }}>Now</span>
                </div>
              </div>
            </div>

            {/* Missing fields */}
            <div className="rounded-2xl p-4" style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
              <h4 className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: T.textMuted }}>
                Missing Fields
              </h4>
              <div className="space-y-2">
                {MISSING_FIELDS.map((m, i) => (
                  <div key={i} className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl"
                    style={{
                      background: m.urgency === 'high' ? PA.redBg  : PA.amberBg,
                      border:     `1px solid ${m.urgency === 'high' ? PA.redBdr : PA.amberBdr}`,
                    }}>
                    <AlertCircle className="w-3 h-3 mt-0.5 shrink-0"
                      style={{ color: m.urgency === 'high' ? PA.red : PA.amber }} />
                    <div>
                      <p className="text-[10.5px] font-semibold leading-tight"
                        style={{ color: m.urgency === 'high' ? PA.red : PA.amber }}>{m.field}</p>
                      <p className="text-[9.5px] mt-0.5"
                        style={{ color: m.urgency === 'high' ? '#991B1B' : '#92400E' }}>{m.section}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: breakdown + suggestions */}
          <div className="col-span-3 flex flex-col gap-5">

            <div className="rounded-2xl p-5" style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
              <h4 className="text-[14px] font-bold mb-5" style={{ color: T.text }}>Completion Breakdown</h4>
              <div className="space-y-4">
                {BREAKDOWN.map(b => (
                  <div key={b.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[12.5px] font-medium" style={{ color: T.textSub }}>{b.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11.5px] font-bold" style={{ color: b.color }}>{b.pct}%</span>
                        {b.pct === 100 && <CheckCircle2 className="w-3.5 h-3.5" style={{ color: PA.teal }} />}
                        {b.pct < 60   && <AlertCircle  className="w-3.5 h-3.5" style={{ color: b.color }} />}
                      </div>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: T.bgCard }}>
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${b.pct}%`, background: b.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Suggestions */}
            <div className="rounded-2xl p-5" style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[14px] font-bold" style={{ color: T.text }}>AI Suggestions</h4>
                <span className="text-[9px] font-bold px-2.5 py-1 rounded-full"
                  style={{ background: PA.blueBg, color: PA.blue, border: `1px solid ${PA.blueBdr}` }}>
                  {SUGGESTIONS.length} actions
                </span>
              </div>
              <div className="space-y-2.5">
                {SUGGESTIONS.map((s, i) => (
                  <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl cursor-pointer transition-colors"
                    style={{ background: T.bg, border: `1px solid ${T.border}` }}
                    onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)}
                    onMouseLeave={e => (e.currentTarget.style.background = T.bg)}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: PA.blueBg, border: `1px solid ${PA.blueBdr}` }}>
                      <s.icon className="w-3.5 h-3.5" style={{ color: PA.blue }} />
                    </div>
                    <p className="flex-1 text-[11.5px] leading-relaxed pt-0.5" style={{ color: T.textSub }}>{s.text}</p>
                    <span className="text-[9px] font-bold shrink-0 px-2 py-1 rounded-full mt-0.5"
                      style={{ background: T.bgCard, color: T.textMuted, border: `1px solid ${T.border}` }}>
                      {s.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sections Manager Tab ──────────────────────────────────────────────────────
function SectionsManagerTab() {
  const { T } = useTheme();
  const [sections,  setSections]  = useState<Section[]>(INIT_SECTIONS);
  const [search,    setSearch]    = useState('');
  const [expanded,  setExpanded]  = useState<string | null>('identity');
  const [dragging,  setDragging]  = useState<string | null>(null);
  const dragOverId = useRef<string | null>(null);

  const filtered = sections.filter(s =>
    !search || s.label.toLowerCase().includes(search.toLowerCase())
  );

  const toggleVisible = (id: string) =>
    setSections(ss => ss.map(s => s.id === id ? { ...s, visible: !s.visible } : s));

  const deleteSection = (id: string) => {
    if (expanded === id) setExpanded(null);
    setSections(ss => ss.filter(s => s.id !== id));
  };

  const duplicateSection = (id: string) => {
    setSections(ss => {
      const idx = ss.findIndex(s => s.id === id);
      if (idx < 0) return ss;
      const orig = ss[idx];
      const copy: Section = { ...orig, id: `${orig.id}_${Date.now()}`, label: `${orig.label} (Copy)` };
      return [...ss.slice(0, idx + 1), copy, ...ss.slice(idx + 1)];
    });
  };

  const onDragStart = (id: string) => setDragging(id);
  const onDragOver  = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.preventDefault();
    dragOverId.current = id;
  };
  const onDrop = () => {
    const from = dragging;
    const to   = dragOverId.current;
    if (from && to && from !== to) {
      setSections(ss => {
        const arr  = [...ss];
        const fi   = arr.findIndex(s => s.id === from);
        const ti   = arr.findIndex(s => s.id === to);
        const [el] = arr.splice(fi, 1);
        arr.splice(ti, 0, el);
        return arr;
      });
    }
    setDragging(null);
    dragOverId.current = null;
  };

  const pctColor = (p: number) => p >= 85 ? PA.teal : p >= 65 ? PA.blue : p >= 40 ? PA.amber : PA.red;

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: T.bg }}>
      <div className="max-w-[780px] mx-auto px-8 py-7">

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-2">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: T.inputBg, border: `1px solid ${T.border}` }}>
            <Search className="w-3.5 h-3.5 shrink-0" style={{ color: T.textMuted }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search sections…"
              className="flex-1 text-[12px] bg-transparent outline-none"
              style={{ color: T.text }} />
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-semibold text-white cursor-pointer hover:opacity-90 transition-all"
            style={{ background: 'linear-gradient(135deg, #EC4899, #A855F7)', boxShadow: '0 0 16px rgba(236,72,153,0.28)' }}>
            <Plus className="w-3.5 h-3.5" />Add Section
          </button>
        </div>
        <p className="text-[11px] mb-5" style={{ color: T.textMuted }}>
          {filtered.length} sections · Drag to reorder · Click row to expand
        </p>

        {/* Section items */}
        <div className="space-y-2">
          {filtered.map(section => {
            const isOpen = expanded === section.id;
            const isDrag = dragging === section.id;
            const Icon   = section.icon;
            const col    = pctColor(section.pct);

            return (
              <div key={section.id}
                draggable
                onDragStart={() => onDragStart(section.id)}
                onDragOver={e => onDragOver(e, section.id)}
                onDrop={onDrop}
                className="rounded-2xl overflow-hidden transition-all"
                style={{
                  border:     `1px solid ${isDrag ? PA.blue : T.border}`,
                  background: T.bgSub,
                  opacity:    isDrag ? 0.45 : 1,
                  boxShadow:  isDrag ? `0 0 0 2px ${PA.blueBdr}` : 'none',
                }}>

                {/* Header row */}
                <div className="flex items-center gap-3 px-4 py-3.5">
                  <GripVertical className="w-3.5 h-3.5 cursor-grab shrink-0" style={{ color: T.textMuted }} />

                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
                    <Icon className="w-3.5 h-3.5" style={{ color: T.textSub }} />
                  </div>

                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setExpanded(isOpen ? null : section.id)}>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold" style={{ color: T.text }}>{section.label}</span>
                      <span className="text-[10.5px] font-bold" style={{ color: col }}>{section.pct}%</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="h-1 w-20 rounded-full overflow-hidden" style={{ background: T.bgCard }}>
                        <div className="h-full rounded-full" style={{ width: `${section.pct}%`, background: col }} />
                      </div>
                      <span className="text-[9.5px]" style={{ color: T.textMuted }}>
                        {section.filled}/{section.fields} fields
                      </span>
                    </div>
                  </div>

                  {/* Visibility */}
                  <button onClick={() => toggleVisible(section.id)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9.5px] font-semibold transition-all cursor-pointer"
                    style={section.visible
                      ? { background: PA.tealBg, color: PA.teal, border: `1px solid ${PA.tealBdr}` }
                      : { background: T.bgCard,  color: T.textMuted, border: `1px solid ${T.border}` }}>
                    {section.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {section.visible ? 'Visible' : 'Hidden'}
                  </button>

                  {/* Actions */}
                  <div className="flex items-center gap-0.5">
                    <button onClick={() => duplicateSection(section.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors cursor-pointer"
                      style={{ color: T.textMuted }}
                      onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      title="Duplicate">
                      <Copy className="w-3 h-3" />
                    </button>
                    <button onClick={() => deleteSection(section.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors cursor-pointer"
                      style={{ color: T.textMuted }}
                      onMouseEnter={e => { e.currentTarget.style.background = PA.redBg; (e.currentTarget.style as { color: string }).color = PA.red; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; (e.currentTarget.style as { color: string }).color = T.textMuted; }}
                      title="Delete">
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <button onClick={() => setExpanded(isOpen ? null : section.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg transition-all cursor-pointer"
                      style={{ color: T.textMuted }}
                      onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Expanded fields */}
                {isOpen && (
                  <div className="px-4 pb-5" style={{ borderTop: `1px solid ${T.border}` }}>
                    <div className="pt-4 grid grid-cols-2 gap-3">
                      {Array.from({ length: section.filled }).map((_, i) => (
                        <div key={i} className="flex flex-col gap-1">
                          <label className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: T.textMuted }}>
                            Field {i + 1}
                          </label>
                          <input
                            className="px-3 py-2 rounded-xl text-[12px] outline-none transition-colors"
                            style={{ background: T.inputBg, border: `1px solid ${T.border}`, color: T.text }}
                            placeholder={`Enter ${section.label.toLowerCase()} detail…`}
                            defaultValue={i < 2 ? 'Sample value' : ''}
                          />
                        </div>
                      ))}
                      {Array.from({ length: section.fields - section.filled }).map((_, i) => (
                        <div key={`empty-${i}`} className="flex flex-col gap-1">
                          <label className="text-[9px] font-semibold uppercase tracking-widest flex items-center gap-1"
                            style={{ color: PA.amber }}>
                            <AlertCircle className="w-2.5 h-2.5" />Field {section.filled + i + 1} — Missing
                          </label>
                          <input
                            className="px-3 py-2 rounded-xl text-[12px] outline-none transition-colors"
                            style={{ background: T.inputBg, border: `1px solid ${PA.amberBdr}`, color: T.text }}
                            placeholder="Click to fill in…"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end mt-4">
                      <button className="px-4 py-2 rounded-xl text-[11.5px] font-semibold text-white cursor-pointer hover:opacity-90 transition-all"
                        style={{ background: 'linear-gradient(135deg, #EC4899, #A855F7)', boxShadow: '0 0 16px rgba(236,72,153,0.28)' }}>
                        Save Changes
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

// ── Nav config ────────────────────────────────────────────────────────────────
const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { id: 'dashboard' as ViewId, icon: LayoutDashboard, label: 'Dashboard'        },
      { id: 'score'     as ViewId, icon: BarChart2,       label: 'Profile Score'    },
      { id: 'sections'  as ViewId, icon: List,            label: 'Sections'         },
    ],
  },
  {
    label: 'Studio',
    items: [
      { id: 'bio'      as ViewId, icon: FileText,   label: 'Bio Studio'    },
      { id: 'resume'   as ViewId, icon: FileCheck,  label: 'Resume Studio' },
      { id: 'compcard' as ViewId, icon: CreditCard, label: 'Comp Card'     },
    ],
  },
  {
    label: 'Assets',
    items: [
      { id: 'media' as ViewId, icon: ImageIcon, label: 'Media Curator' },
      { id: 'reel'  as ViewId, icon: Film,      label: 'Intro Reel'   },
    ],
  },
  {
    label: 'Publish',
    items: [
      { id: 'public' as ViewId, icon: Globe,    label: 'Public Profile' },
      { id: 'export' as ViewId, icon: Package,  label: 'Export'         },
    ],
  },
  {
    label: 'Workflow',
    items: [
      { id: 'approvals' as ViewId, icon: KanbanSquare, label: 'Approvals'       },
      { id: 'versions'  as ViewId, icon: GitBranch,    label: 'Version History' },
    ],
  },
  {
    label: 'Insights',
    items: [
      { id: 'recommendations' as ViewId, icon: Brain,     label: 'Recommendations' },
      { id: 'analytics'       as ViewId, icon: AreaChart, label: 'Analytics'       },
    ],
  },
  {
    label: 'System',
    items: [
      { id: 'design-system' as ViewId, icon: Layers, label: 'Design System' },
    ],
  },
];

// ── Main exported view ────────────────────────────────────────────────────────
export default function PortfolioBuilderView({ onBack }: { onBack?: () => void }) {
  const { T } = useTheme();
  const [view, setView] = useState<ViewId>('dashboard');

  return (
    <div className="flex-1 flex overflow-hidden" style={{ background: T.bg }}>

      {/* ── Left sub-nav (compact icon-only) ── */}
      <div className="w-12 shrink-0 flex flex-col"
        style={{ borderRight: `1px solid ${T.border}`, background: T.bgSub }}>

        {/* Back + logo */}
        <div className="shrink-0 flex flex-col items-center gap-1 py-2.5"
          style={{ borderBottom: `1px solid ${T.border}` }}>
          {onBack && (
            <button onClick={onBack} title="Back"
              className="w-8 h-8 flex items-center justify-center rounded-xl cursor-pointer transition-all"
              style={{ color: T.textMuted }}
              onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(236,72,153,.18), rgba(168,85,247,.15))', border: `1px solid rgba(236,72,153,.28)` }}>
            <LayoutDashboard className="w-3.5 h-3.5" style={{ color: PA.blue }} />
          </div>
        </div>

        {/* Nav icons */}
        <div className="flex-1 overflow-y-auto py-2" style={{ scrollbarWidth: 'none' }}>
          {NAV_GROUPS.map((group, gi) => (
            <div key={group.label}>
              {gi > 0 && <div className="mx-3 my-1" style={{ height: 1, background: T.borderMuted }} />}
              {group.items.map(item => {
                const Icon = item.icon;
                const active = view === item.id;
                return (
                  <div key={item.id} className="flex justify-center py-0.5">
                    <button onClick={() => setView(item.id)} title={item.label}
                      className="w-8 h-8 flex items-center justify-center rounded-xl cursor-pointer transition-all"
                      style={active
                        ? { background: PA.blueBg, border: `1px solid ${PA.blueBdr}` }
                        : { border: '1px solid transparent' }}
                      onMouseEnter={e => { if (!active) e.currentTarget.style.background = T.bgHover; }}
                      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
                      <Icon className="w-3.5 h-3.5" style={{ color: active ? PA.blue : T.textMuted }} />
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Share */}
        <div className="shrink-0 flex justify-center py-2.5"
          style={{ borderTop: `1px solid ${T.border}` }}>
          <button onClick={() => setView('export')} title="Share Portfolio"
            className="w-8 h-8 flex items-center justify-center rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(135deg, #EC4899, #A855F7)', boxShadow: '0 0 14px rgba(236,72,153,.25)' }}>
            <Share2 className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>

      {/* ── Content area ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {view === 'dashboard'        && <DashboardTab onSwitchTab={setView} />}
        {view === 'score'            && <ProfileScoreTab />}
        {view === 'sections'         && <SectionsManagerTab />}
        {view === 'bio'              && <PortfolioBioStudio />}
        {view === 'resume'           && <PortfolioResumeStudio />}
        {view === 'compcard'         && <PortfolioCompCard />}
        {view === 'media'            && <PortfolioMediaCurator />}
        {view === 'reel'             && <PortfolioIntroReel />}
        {view === 'public'           && <PortfolioPublicBuilder />}
        {view === 'export'           && <PortfolioExport />}
        {view === 'approvals'        && <PortfolioApprovals />}
        {view === 'versions'         && <PortfolioVersionHistory />}
        {view === 'recommendations'  && <PortfolioRecommendations />}
        {view === 'analytics'        && <PortfolioAnalytics />}
        {view === 'design-system'    && <PortfolioDesignSystem />}
      </div>

    </div>
  );
}
