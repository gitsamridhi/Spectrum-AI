'use client';

import React, { useState } from 'react';
import {
  TrendingUp, TrendingDown, Eye, Download, Share2,
  CheckCircle2, BarChart2, Activity, Users,
  ArrowUpRight, ArrowDownRight, Clock, Sparkles,
  Calendar,
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

const PA = {
  blue:'#EC4899',blueBg:'rgba(236,72,153,0.10)',blueBdr:'rgba(236,72,153,0.28)',
  teal:'#A855F7',tealBg:'rgba(168,85,247,0.10)',tealBdr:'rgba(168,85,247,0.28)',
  amber:'#F59E0B',amberBg:'rgba(245,158,11,0.10)',amberBdr:'rgba(245,158,11,0.28)',
  red:'#EF4444',redBg:'rgba(239,68,68,0.10)',redBdr:'rgba(239,68,68,0.28)',
  violet:'#8B5CF6',violetBg:'rgba(139,92,246,0.10)',violetBdr:'rgba(139,92,246,0.28)',
};

// ── Chart data ─────────────────────────────────────────────────────────────────
const DAILY_VIEWS = [42,38,55,61,48,72,88,76,91,85,94,78,103,115,108,122,98,134,142,128,155,167,149,171,183,176,194,201,188,214];
const DAILY_LABELS= ['Jun 1','','','','','Jun 6','','','','','Jun 11','','','','','Jun 16','','','','','Jun 21','','','','','Jun 26','','','','Today'];

const WEEKLY_APPROVALS = [
  { week:'W1', approved:2, review:1, rejected:0 },
  { week:'W2', approved:3, review:2, rejected:1 },
  { week:'W3', approved:1, review:3, rejected:0 },
  { week:'W4', approved:4, review:1, rejected:1 },
  { week:'W5', approved:2, review:2, rejected:0 },
  { week:'W6', approved:5, review:1, rejected:1 },
  { week:'W7', approved:3, review:2, rejected:0 },
  { week:'W8', approved:6, review:0, rejected:1 },
];

const COMPLETION_DONUT = [
  { label:'Identity',      pct:100, color:PA.teal   },
  { label:'Skills',        pct: 85, color:PA.blue   },
  { label:'Experience',    pct: 72, color:PA.blue   },
  { label:'Awards',        pct: 60, color:PA.amber  },
  { label:'Measurements',  pct: 45, color:PA.red    },
  { label:'Availability',  pct: 55, color:PA.violet },
];

const ACTIVITY = [
  { icon:Eye,          label:'Portfolio viewed',         who:'Elite Models NY',    time:'2h ago',   color:PA.blue   },
  { icon:Download,     label:'Comp Card downloaded',     who:'Vogue Casting',      time:'4h ago',   color:PA.teal   },
  { icon:CheckCircle2, label:'Bio approved',             who:'IMG Models NYC',     time:'1d ago',   color:PA.teal   },
  { icon:Share2,       label:'Portfolio link shared',    who:'Sarah Chen',         time:'1d ago',   color:PA.blue   },
  { icon:Users,        label:'Agency profile view',      who:'Ford Models',        time:'2d ago',   color:PA.violet },
  { icon:Eye,          label:'Resume downloaded',        who:'Vogue Casting',      time:'2d ago',   color:PA.amber  },
  { icon:Sparkles,     label:'Profile score updated',    who:'AI System',          time:'3d ago',   color:PA.violet },
  { icon:CheckCircle2, label:'Comp Card approved',       who:'Elite Models NY',    time:'4d ago',   color:PA.teal   },
];

// ── SVG Line Chart ─────────────────────────────────────────────────────────────
function LineChart({ data, color, height = 80 }: { data: number[]; color: string; height?: number }) {
  const { T } = useTheme();
  const W = 400, H = height;
  const maxV = Math.max(...data);
  const minV = Math.min(...data);
  const range = maxV - minV || 1;
  const pad = 8;

  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (W - pad * 2) + pad;
    const y = H - pad - ((v - minV) / range) * (H - pad * 2);
    return `${x},${y}`;
  }).join(' ');

  const fillPts = `${pad},${H} ${pts} ${W - pad},${H}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
      <defs>
        <linearGradient id={`lg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[0.25, 0.5, 0.75].map(f => (
        <line key={f} x1={pad} y1={H * f} x2={W - pad} y2={H * f}
          stroke={T.borderMuted} strokeWidth="0.5" strokeDasharray="3,3" />
      ))}
      {/* Fill */}
      <polygon points={fillPts} fill={`url(#lg-${color.replace('#','')})`} />
      {/* Line */}
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Last point dot */}
      {(() => {
        const last = pts.split(' ').slice(-1)[0].split(',');
        return <circle cx={last[0]} cy={last[1]} r="3.5" fill={color} stroke="white" strokeWidth="1.5" />;
      })()}
    </svg>
  );
}

// ── SVG Bar Chart ──────────────────────────────────────────────────────────────
function BarChart({ data }: { data: typeof WEEKLY_APPROVALS }) {
  const { T } = useTheme();
  const W = 400, H = 80;
  const maxTotal = Math.max(...data.map(d => d.approved + d.review + d.rejected));
  const barW = (W / data.length) * 0.6;
  const gap   = (W / data.length) * 0.4;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full" style={{ height: 80 }}>
      {data.map((d, i) => {
        const x     = i * (W / data.length) + gap / 2;
        const total = d.approved + d.review + d.rejected;
        const scale = (total / maxTotal) * (H - 10);
        let y = H;
        return (
          <g key={d.week}>
            {([ [d.rejected, PA.red], [d.review, PA.amber], [d.approved, PA.teal] ] as [number,string][])
              .filter(([v]) => v > 0)
              .map(([val, col]) => {
                const h = (val / total) * scale;
                y -= h;
                return <rect key={col} x={x} y={y} width={barW} height={h} fill={col} rx="2" opacity="0.85" />;
              })
            }
            <text x={x + barW / 2} y={H - 1} textAnchor="middle" fontSize="6" fill={T.textMuted}>{d.week}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Donut Segment ──────────────────────────────────────────────────────────────
function CompletionDonut({ segments }: { segments: typeof COMPLETION_DONUT }) {
  const { T } = useTheme();
  const size = 120, cx = 60, cy = 60, R = 46, strokeW = 10;
  const C = 2 * Math.PI * R;
  const avg = Math.round(segments.reduce((s, x) => s + x.pct, 0) / segments.length);

  let offset = 0;
  const arcs = segments.map(seg => {
    const len = (seg.pct / 100) * (C / segments.length);
    const gap = C / segments.length - len;
    const o   = offset;
    offset   += C / segments.length;
    return { ...seg, dasharray: `${len} ${C - len}`, dashoffset: -(o) };
  });

  return (
    <div className="relative shrink-0" style={{ width:size, height:size }}>
      <svg width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
        <circle cx={cx} cy={cy} r={R} fill="none" strokeWidth={strokeW} style={{ stroke:T.bgCard }} />
        {arcs.map((arc, i) => (
          <circle key={i} cx={cx} cy={cy} r={R} fill="none" strokeWidth={strokeW}
            stroke={arc.color}
            strokeDasharray={arc.dasharray}
            strokeDashoffset={arc.dashoffset}
            strokeLinecap="round" />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[22px] font-black leading-none" style={{ color:T.text }}>{avg}</span>
        <span className="text-[9px] font-semibold" style={{ color:T.textMuted }}>avg %</span>
      </div>
    </div>
  );
}

// ── KPI Card ───────────────────────────────────────────────────────────────────
function KPICard({
  label, value, delta, deltaLabel, positive, icon: Icon, color, bg, bdr,
}: {
  label:string; value:string; delta:string; deltaLabel:string;
  positive:boolean; icon:React.ElementType; color:string; bg:string; bdr:string;
}) {
  const { T } = useTheme();
  return (
    <div className="flex-1 p-4 rounded-2xl flex flex-col gap-2"
      style={{ background:T.bgSub, border:`1px solid ${T.border}` }}>
      <div className="flex items-center justify-between">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background:bg, border:`1px solid ${bdr}` }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full"
          style={{ background: positive ? PA.tealBg : PA.redBg, border:`1px solid ${positive ? PA.tealBdr : PA.redBdr}` }}>
          {positive
            ? <ArrowUpRight className="w-2.5 h-2.5" style={{ color:PA.teal }} />
            : <ArrowDownRight className="w-2.5 h-2.5" style={{ color:PA.red }} />}
          <span className="text-[9px] font-bold" style={{ color: positive ? PA.teal : PA.red }}>{delta}</span>
        </div>
      </div>
      <div>
        <p className="text-[24px] font-black tracking-[-0.04em] leading-tight" style={{ color:T.text, fontFamily:'Inter Tight, sans-serif' }}>
          {value}
        </p>
        <p className="text-[10.5px] font-medium" style={{ color:T.textMuted }}>{label}</p>
      </div>
      <p className="text-[9.5px]" style={{ color:T.textMuted }}>{deltaLabel}</p>
    </div>
  );
}

type TimeRange = '7d' | '30d' | '90d';

export default function PortfolioAnalytics() {
  const { T } = useTheme();
  const [range, setRange] = useState<TimeRange>('30d');

  const viewData  = range === '7d'  ? DAILY_VIEWS.slice(-7)
                  : range === '30d' ? DAILY_VIEWS
                  : DAILY_VIEWS.flatMap(v => [v, Math.round(v * 1.1)]).slice(0, 90);
  const totalViews = viewData.reduce((s, v) => s + v, 0).toLocaleString();

  return (
    <div className="flex-1 overflow-y-auto" style={{ background:T.bg, scrollbarWidth:'thin' }}>
      <div className="max-w-[1100px] mx-auto px-6 py-5 space-y-5">

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[16px] font-black tracking-[-0.03em]" style={{ color:T.text, fontFamily:'Inter Tight, sans-serif' }}>
              Portfolio Analytics
            </h2>
            <p className="text-[11.5px]" style={{ color:T.textMuted }}>Performance data · Updated live</p>
          </div>
          {/* Range selector */}
          <div className="flex items-center gap-0.5 p-0.5 rounded-xl" style={{ background:T.bgCard }}>
            {(['7d','30d','90d'] as TimeRange[]).map(r => (
              <button key={r} onClick={() => setRange(r)}
                className="px-3 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer transition-all"
                style={range === r
                  ? { background:T.bg, color:T.text, boxShadow:'0 1px 3px rgba(0,0,0,0.08)' }
                  : { color:T.textMuted }}>
                {r === '7d' ? '7 days' : r === '30d' ? '30 days' : '90 days'}
              </button>
            ))}
          </div>
        </div>

        {/* ── KPI Row ── */}
        <div className="flex gap-3">
          <KPICard label="Profile Views"    value={totalViews} delta="+23%" deltaLabel="vs. previous period" positive icon={Eye}          color={PA.blue}   bg={PA.blueBg}   bdr={PA.blueBdr}   />
          <KPICard label="Downloads"        value="142"        delta="+8%"  deltaLabel="vs. previous period" positive icon={Download}     color={PA.teal}   bg={PA.tealBg}   bdr={PA.tealBdr}   />
          <KPICard label="Portfolio Shares" value="89"         delta="+31%" deltaLabel="vs. previous period" positive icon={Share2}       color={PA.violet} bg={PA.violetBg} bdr={PA.violetBdr} />
          <KPICard label="Approval Rate"    value="78%"        delta="-3%"  deltaLabel="vs. previous period" positive={false} icon={CheckCircle2} color={PA.amber} bg={PA.amberBg} bdr={PA.amberBdr} />
        </div>

        {/* ── Charts row ── */}
        <div className="grid grid-cols-2 gap-4">

          {/* Views trend */}
          <div className="rounded-2xl p-5" style={{ background:T.bgSub, border:`1px solid ${T.border}` }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[12.5px] font-bold" style={{ color:T.text }}>Profile Views</p>
                <p className="text-[10px]" style={{ color:T.textMuted }}>Daily · last {range}</p>
              </div>
              <div className="flex items-center gap-1" style={{ color:PA.teal }}>
                <TrendingUp className="w-3.5 h-3.5" />
                <span className="text-[11px] font-bold">+23%</span>
              </div>
            </div>
            <LineChart data={viewData} color={PA.blue} height={88} />
            {/* X-axis labels — first and last */}
            <div className="flex justify-between mt-1.5">
              <span className="text-[9px]" style={{ color:T.textMuted }}>{range === '7d' ? '7 days ago' : range === '30d' ? 'Jun 1' : '3 months ago'}</span>
              <span className="text-[9px]" style={{ color:T.textMuted }}>Today</span>
            </div>
          </div>

          {/* Weekly approvals bar chart */}
          <div className="rounded-2xl p-5" style={{ background:T.bgSub, border:`1px solid ${T.border}` }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[12.5px] font-bold" style={{ color:T.text }}>Approval Activity</p>
                <p className="text-[10px]" style={{ color:T.textMuted }}>Weekly breakdown · 8 weeks</p>
              </div>
              <div className="flex items-center gap-3">
                {[['Approved',PA.teal],['Review',PA.amber],['Rejected',PA.red]].map(([l,c]) => (
                  <div key={l} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ background:c }} />
                    <span className="text-[9px]" style={{ color:T.textMuted }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
            <BarChart data={WEEKLY_APPROVALS} />
          </div>
        </div>

        {/* ── Completion + Activity ── */}
        <div className="grid grid-cols-3 gap-4">

          {/* Completion breakdown */}
          <div className="rounded-2xl p-5" style={{ background:T.bgSub, border:`1px solid ${T.border}` }}>
            <p className="text-[12.5px] font-bold mb-4" style={{ color:T.text }}>Section Completion</p>
            <div className="flex items-center gap-4 mb-5">
              <CompletionDonut segments={COMPLETION_DONUT} />
              <div className="space-y-1.5 flex-1 min-w-0">
                {COMPLETION_DONUT.map(s => (
                  <div key={s.label}>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[9.5px] font-medium truncate" style={{ color:T.textSub }}>{s.label}</span>
                      <span className="text-[9.5px] font-bold" style={{ color:s.color }}>{s.pct}%</span>
                    </div>
                    <div className="h-1 rounded-full overflow-hidden" style={{ background:T.bgCard }}>
                      <div className="h-full rounded-full" style={{ width:`${s.pct}%`, background:s.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity timeline */}
          <div className="col-span-2 rounded-2xl p-5" style={{ background:T.bgSub, border:`1px solid ${T.border}` }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-[12.5px] font-bold" style={{ color:T.text }}>Activity Timeline</p>
              <div className="flex items-center gap-1" style={{ color:T.textMuted }}>
                <Activity className="w-3 h-3" />
                <span className="text-[10px]">Last 7 days</span>
              </div>
            </div>
            <div className="space-y-2">
              {ACTIVITY.map((ev, i) => {
                const Icon = ev.icon;
                return (
                  <div key={i}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                    style={{ background:T.bg, border:`1px solid ${T.border}` }}>
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background:ev.color + '18', border:`1px solid ${ev.color}30` }}>
                      <Icon className="w-3.5 h-3.5" style={{ color:ev.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11.5px] font-semibold" style={{ color:T.text }}>{ev.label}</p>
                      <p className="text-[10px]" style={{ color:T.textMuted }}>by {ev.who}</p>
                    </div>
                    <span className="text-[9.5px] shrink-0" style={{ color:T.textMuted }}>{ev.time}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* ── Growth metrics row ── */}
        <div className="grid grid-cols-4 gap-3 pb-2">
          {[
            { label:'Avg. Session Duration', value:'3m 42s',  trend:'+14%', up:true,  color:PA.blue   },
            { label:'Return Visitor Rate',   value:'41%',     trend:'+7%',  up:true,  color:PA.teal   },
            { label:'Agency Reach',          value:'28',      trend:'+4',   up:true,  color:PA.violet },
            { label:'Profile Completeness',  value:'78 / 100',trend:'+5',   up:true,  color:PA.amber  },
          ].map(m => (
            <div key={m.label} className="px-4 py-3 rounded-2xl"
              style={{ background:T.bgSub, border:`1px solid ${T.border}` }}>
              <p className="text-[10px] mb-1" style={{ color:T.textMuted }}>{m.label}</p>
              <p className="text-[18px] font-black tracking-[-0.03em]" style={{ color:T.text, fontFamily:'Inter Tight, sans-serif' }}>{m.value}</p>
              <div className="flex items-center gap-1 mt-1">
                {m.up
                  ? <ArrowUpRight className="w-2.5 h-2.5" style={{ color:PA.teal }} />
                  : <ArrowDownRight className="w-2.5 h-2.5" style={{ color:PA.red }} />}
                <span className="text-[9.5px] font-semibold" style={{ color: m.up ? PA.teal : PA.red }}>{m.trend}</span>
                <span className="text-[9.5px]" style={{ color:T.textMuted }}>this period</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
