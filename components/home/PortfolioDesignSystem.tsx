'use client';

import React, { useState } from 'react';
import {
  Layers, Square, Type, SlidersHorizontal, TrendingUp,
  GitBranch, LayoutDashboard, Image as ImageIcon, BarChart2,
  Navigation, Maximize2, CheckCircle2, AlertCircle,
  Download, Share2, Plus, X, ChevronDown,
  Eye, Sparkles, Star, Zap, ArrowRight,
  FileText, Play, Clock, Tag,
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

const PA = {
  blue:'#EC4899',blueBg:'rgba(236,72,153,0.10)',blueBdr:'rgba(236,72,153,0.28)',
  teal:'#A855F7',tealBg:'rgba(168,85,247,0.10)',tealBdr:'rgba(168,85,247,0.28)',
  amber:'#F59E0B',amberBg:'rgba(245,158,11,0.10)',amberBdr:'rgba(245,158,11,0.28)',
  red:'#EF4444',redBg:'rgba(239,68,68,0.10)',redBdr:'rgba(239,68,68,0.28)',
  violet:'#8B5CF6',violetBg:'rgba(139,92,246,0.10)',violetBdr:'rgba(139,92,246,0.28)',
};

type DSCategory = 'buttons' | 'cards' | 'inputs' | 'progress' | 'timeline' | 'kanban' | 'media' | 'charts' | 'navigation' | 'overlays';

const CATEGORIES: { id: DSCategory; icon: React.ElementType; label: string; desc: string; count: number }[] = [
  { id:'buttons',    icon:Square,           label:'Buttons',         desc:'Primary, secondary, ghost, icon actions',           count:6  },
  { id:'cards',      icon:Layers,           label:'Cards',           desc:'Stat, preview, detail, Kanban, media cards',         count:8  },
  { id:'inputs',     icon:Type,             label:'Form Controls',   desc:'Text, textarea, select, slider, toggle',             count:5  },
  { id:'progress',   icon:TrendingUp,       label:'Progress & Score',desc:'Score ring, bars, step indicators, confidence',      count:5  },
  { id:'timeline',   icon:GitBranch,        label:'Timeline',        desc:'Vertical event stream, diff timeline, version list', count:3  },
  { id:'kanban',     icon:LayoutDashboard,  label:'Kanban',          desc:'Column, card, reviewer chip, status badge',          count:4  },
  { id:'media',      icon:ImageIcon,        label:'Media Cards',     desc:'Masonry, grid, list, asset detail, upload zone',     count:4  },
  { id:'charts',     icon:BarChart2,        label:'Charts',          desc:'Line, bar, donut, sparkline, KPI card',              count:5  },
  { id:'navigation', icon:Navigation,       label:'Navigation',      desc:'Sub-nav group, active item, breadcrumb, tab pill',   count:3  },
  { id:'overlays',   icon:Maximize2,        label:'Drawers & Panels',desc:'Side drawer, modal, confirmation, tooltip',          count:4  },
];

// ── Spec table row ─────────────────────────────────────────────────────────────
function SpecRow({ label, value }: { label: string; value: string }) {
  const { T } = useTheme();
  return (
    <div className="flex items-start gap-4 py-2" style={{ borderBottom:`1px solid ${T.borderMuted}` }}>
      <span className="w-32 shrink-0 text-[10px] font-bold uppercase tracking-widest" style={{ color:T.textMuted }}>{label}</span>
      <span className="text-[11px] leading-relaxed" style={{ color:T.textSub }}>{value}</span>
    </div>
  );
}

// ── Section header ─────────────────────────────────────────────────────────────
function SectionHeader({ label, desc, count }: { label:string; desc:string; count:number }) {
  const { T } = useTheme();
  return (
    <div className="flex items-start gap-4 mb-5 pb-4" style={{ borderBottom:`1px solid ${T.border}` }}>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-[17px] font-black tracking-[-0.03em]" style={{ color:T.text, fontFamily:'Inter Tight, sans-serif' }}>{label}</h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background:PA.blueBg, color:PA.blue, border:`1px solid ${PA.blueBdr}` }}>
            {count} variants
          </span>
        </div>
        <p className="text-[11.5px]" style={{ color:T.textMuted }}>{desc}</p>
      </div>
    </div>
  );
}

// ── Preview container ──────────────────────────────────────────────────────────
function Preview({ label, children, spec }: { label: string; children: React.ReactNode; spec?: Record<string,string> }) {
  const { T } = useTheme();
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border:`1px solid ${T.border}` }}>
      <div className="px-5 py-5 flex items-center justify-center gap-4 flex-wrap"
        style={{ background:T.bgSub, minHeight:80 }}>
        {children}
      </div>
      <div className="px-4 py-2.5 flex items-center" style={{ borderTop:`1px solid ${T.border}`, background:T.bg }}>
        <span className="text-[10.5px] font-semibold" style={{ color:T.textSub }}>{label}</span>
      </div>
      {spec && (
        <div className="px-4 pb-3" style={{ background:T.bg }}>
          {Object.entries(spec).map(([k,v]) => <SpecRow key={k} label={k} value={v} />)}
        </div>
      )}
    </div>
  );
}

// ── Section renderers ──────────────────────────────────────────────────────────
function ButtonsSection() {
  const { T } = useTheme();
  return (
    <div className="space-y-4">
      <SectionHeader label="Buttons" desc="All interactive call-to-action elements used across Portfolio Builder. Consistent sizing, font-weight, and border-radius." count={6} />
      <div className="grid grid-cols-2 gap-4">
        <Preview label="Primary — Blue (CTA)"
          spec={{ Purpose:'Main action per screen. Max 1 per view.', States:'default · hover (opacity 0.9) · disabled (opacity 0.5)', Radius:'rounded-xl (12px)', Font:'11.5px semibold' }}>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11.5px] font-semibold text-white" style={{ background:'linear-gradient(135deg, #EC4899, #A855F7)' }}>
            <Zap className="w-3.5 h-3.5" />Primary Action
          </button>
        </Preview>
        <Preview label="Secondary — Card style"
          spec={{ Purpose:'Supporting actions, adjacent to primary.', States:'default · hover (bgHover) · active (bgCard)', Radius:'rounded-xl (12px)' }}>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11.5px] font-semibold"
            style={{ background:T.bgCard, color:T.textSub, border:`1px solid ${T.border}` }}>
            <Download className="w-3.5 h-3.5" />Secondary
          </button>
        </Preview>
        <Preview label="Accent variants — teal · amber · violet">
          <button className="px-4 py-2 rounded-xl text-[11.5px] font-semibold text-white" style={{ background:PA.teal }}>Approve</button>
          <button className="px-4 py-2 rounded-xl text-[11.5px] font-semibold" style={{ background:PA.amberBg, color:PA.amber, border:`1px solid ${PA.amberBdr}` }}>Restore</button>
          <button className="px-4 py-2 rounded-xl text-[11.5px] font-semibold text-white" style={{ background:PA.violet }}>AI Enhance</button>
        </Preview>
        <Preview label="Danger — red pastel"
          spec={{ Purpose:'Destructive or rejection actions only.', States:'default · hover (opacity 0.9)', Note:'Never used as a default action' }}>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11.5px] font-semibold"
            style={{ background:PA.redBg, color:PA.red, border:`1px solid ${PA.redBdr}` }}>
            <X className="w-3.5 h-3.5" />Reject
          </button>
        </Preview>
        <Preview label="Icon-only buttons">
          {[PA.blue, PA.teal, PA.amber, PA.violet].map((c, i) => (
            <button key={i} className="w-8 h-8 flex items-center justify-center rounded-xl cursor-pointer"
              style={{ background:c + '18', border:`1px solid ${c}40`, color:c }}>
              {[Plus, Share2, Tag, Sparkles][i] && React.createElement([Plus, Share2, Tag, Sparkles][i], { className:'w-3.5 h-3.5' })}
            </button>
          ))}
        </Preview>
        <Preview label="Full-width action bar"
          spec={{ Usage:'Sticky bottom bar or drawer footer.', Width:'100% of container' }}>
          <div className="w-full flex gap-2">
            <button className="flex-1 py-2 rounded-xl text-[11.5px] font-semibold text-white" style={{ background:'linear-gradient(135deg, #EC4899, #A855F7)' }}>Save Changes</button>
            <button className="flex-1 py-2 rounded-xl text-[11.5px] font-semibold" style={{ background:T.bgCard, color:T.textSub, border:`1px solid ${T.border}` }}>Cancel</button>
          </div>
        </Preview>
      </div>
    </div>
  );
}

function CardsSection() {
  const { T } = useTheme();
  return (
    <div className="space-y-4">
      <SectionHeader label="Cards" desc="Card containers used for data groups, previews, Kanban items, and score widgets." count={8} />
      <div className="grid grid-cols-2 gap-4">
        <Preview label="Stat card — KPI"
          spec={{ Purpose:'Top-row summary metrics (Analytics screen).', Radius:'rounded-2xl', Pattern:'icon + large value + delta badge' }}>
          <div className="w-full p-4 rounded-2xl" style={{ background:T.bg, border:`1px solid ${T.border}` }}>
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background:PA.blueBg, border:`1px solid ${PA.blueBdr}` }}>
                <Eye className="w-4 h-4" style={{ color:PA.blue }} />
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background:PA.tealBg, color:PA.teal, border:`1px solid ${PA.tealBdr}` }}>+23%</span>
            </div>
            <p className="text-[22px] font-black tracking-[-0.04em]" style={{ color:T.text, fontFamily:'Inter Tight, sans-serif' }}>4,821</p>
            <p className="text-[10.5px]" style={{ color:T.textMuted }}>Profile Views</p>
          </div>
        </Preview>
        <Preview label="Recommendation card"
          spec={{ Purpose:'AI coaching suggestions (Recommendations screen).', States:'default · expanded (spans 2 cols) · dismissed' }}>
          <div className="w-full rounded-2xl overflow-hidden" style={{ border:`1px solid ${T.border}` }}>
            <div className="h-0.5" style={{ background:PA.red }} />
            <div className="p-3.5 space-y-2" style={{ background:T.bgSub }}>
              <div className="flex items-center gap-1.5">
                <span className="text-[8.5px] font-bold px-1.5 py-0.5 rounded" style={{ background:PA.redBg, color:PA.red }}>Critical</span>
                <span className="text-[8.5px] font-bold px-1.5 py-0.5 rounded" style={{ background:PA.amberBg, color:PA.amber }}>Missing Data</span>
              </div>
              <p className="text-[11.5px] font-semibold" style={{ color:T.text }}>Add Body Measurements</p>
              <p className="text-[10.5px]" style={{ color:T.textMuted }}>78% of castings require this data.</p>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 rounded-xl text-[11px] font-semibold text-white" style={{ background:'linear-gradient(135deg, #EC4899, #A855F7)' }}>Add Now</button>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background:T.bgCard }}>
                  <div className="h-full rounded-full" style={{ width:'98%', background:PA.teal }} />
                </div>
                <span className="text-[9px]" style={{ color:T.textMuted }}>98%</span>
              </div>
            </div>
          </div>
        </Preview>
        <Preview label="Section completion card"
          spec={{ Usage:'Sections Manager tab, Dashboard widget.', Layout:'Label + progress bar + pct badge + action' }}>
          <div className="w-full px-4 py-3 rounded-xl flex items-center gap-3" style={{ background:T.bgSub, border:`1px solid ${T.border}` }}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11.5px] font-semibold" style={{ color:T.text }}>Identity</span>
                <span className="text-[10px] font-bold" style={{ color:PA.teal }}>100%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background:T.bgCard }}>
                <div className="h-full rounded-full" style={{ width:'100%', background:PA.teal }} />
              </div>
            </div>
            <Eye className="w-3.5 h-3.5 shrink-0" style={{ color:T.textMuted }} />
          </div>
        </Preview>
        <Preview label="Version history card"
          spec={{ Usage:'Version History left panel.', States:'default · selected (blueBg) · compare (tealBg)', Pattern:'version tag + label + date + author init' }}>
          <div className="w-full px-3 py-2.5 rounded-xl" style={{ background:PA.blueBg, border:`1px solid ${PA.blueBdr}` }}>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[11.5px] font-bold" style={{ color:PA.blue }}>v5.0</span>
              <span className="text-[8px] font-bold px-1 py-0.5 rounded" style={{ background:PA.blueBdr + '80', color:PA.blue }}>Current</span>
            </div>
            <p className="text-[10px] font-semibold" style={{ color:PA.blue }}>Agency Final</p>
            <div className="flex items-center gap-1 mt-1">
              <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[6px] font-black text-white" style={{ background:PA.teal }}>SC</div>
              <span className="text-[9.5px]" style={{ color:T.textMuted }}>Today · 2h ago</span>
            </div>
          </div>
        </Preview>
      </div>
    </div>
  );
}

function InputsSection() {
  const { T } = useTheme();
  const [val, setVal] = useState('Sarah Chen');
  const [on, setOn]   = useState(true);
  const [sl, setSl]   = useState(65);
  return (
    <div className="space-y-4">
      <SectionHeader label="Form Controls" desc="All input primitives. Consistent token-driven styling: inputBg, border, text." count={5} />
      <div className="grid grid-cols-2 gap-4">
        <Preview label="Text input"
          spec={{ Background:'T.inputBg', Border:`1px solid T.border`, Focus:'border-color: PA.blue (outline: none)', Radius:'rounded-xl' }}>
          <input value={val} onChange={e=>setVal(e.target.value)} className="w-full px-3 py-2 rounded-xl text-[12px] outline-none"
            style={{ background:T.inputBg, border:`1px solid ${T.border}`, color:T.text }} />
        </Preview>
        <Preview label="Inline label + input"
          spec={{ Usage:'URL fields, measurement inputs.', Layout:'prefix label (textMuted) + editable value inline' }}>
          <div className="w-full flex items-center gap-1 px-3 py-2 rounded-xl" style={{ background:T.inputBg, border:`1px solid ${T.border}` }}>
            <span className="text-[11px] shrink-0" style={{ color:T.textMuted }}>spectrum.ai/</span>
            <input defaultValue="sarahchen" className="flex-1 text-[11px] font-semibold bg-transparent outline-none" style={{ color:T.text }} />
          </div>
        </Preview>
        <Preview label="Textarea"
          spec={{ Usage:'Bio editor, caption input, comment box.', Resize:'none (handled by layout)', MinHeight:'80px' }}>
          <textarea defaultValue="Award-winning fashion model and creative director based in New York City." rows={3}
            className="w-full px-3 py-2 rounded-xl text-[12px] outline-none resize-none"
            style={{ background:T.inputBg, border:`1px solid ${T.border}`, color:T.text }} />
        </Preview>
        <Preview label="Range slider"
          spec={{ Usage:'Pitch, speed, confidence controls.', Styling:'accentColor: accent color per context', Track:'T.bgCard background' }}>
          <div className="w-full space-y-1">
            <div className="flex justify-between">
              <span className="text-[10px]" style={{ color:T.textMuted }}>Confidence</span>
              <span className="text-[10px] font-bold" style={{ color:PA.teal }}>{sl}%</span>
            </div>
            <input type="range" min={0} max={100} value={sl} onChange={e=>setSl(+e.target.value)}
              className="w-full h-1.5 rounded-full outline-none cursor-pointer appearance-none"
              style={{ background:T.bgCard, accentColor:PA.teal } as React.CSSProperties} />
          </div>
        </Preview>
        <Preview label="Toggle switch"
          spec={{ Usage:'Section visibility, feature flags, export options.', States:'on (blue) · off (bgCard)', Size:'w-9 h-5' }}>
          <button onClick={() => setOn(o=>!o)}
            className="relative flex items-center w-9 h-5 rounded-full transition-colors cursor-pointer"
            style={{ background: on ? PA.blue : T.bgCard, border:`1px solid ${on ? PA.blue : T.border}` }}>
            <span className="absolute w-3.5 h-3.5 bg-white rounded-full shadow transition-transform"
              style={{ transform: on ? 'translateX(18px)' : 'translateX(2px)' }} />
          </button>
        </Preview>
      </div>
    </div>
  );
}

function ProgressSection() {
  const { T } = useTheme();
  const R = 40, C = 2 * Math.PI * R;
  return (
    <div className="space-y-4">
      <SectionHeader label="Progress & Score" desc="Visual indicators for completion, confidence, and multi-step flows." count={5} />
      <div className="grid grid-cols-2 gap-4">
        <Preview label="Score ring — primary metric"
          spec={{ Component:'ScoreMeter SVG', Color:'teal ≥85 · blue ≥65 · amber <65', Animation:'stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1)' }}>
          <div className="relative" style={{ width:100, height:100 }}>
            <svg width={100} height={100} style={{ transform:'rotate(-90deg)' }}>
              <circle cx={50} cy={50} r={R} fill="none" strokeWidth={10} style={{ stroke:T.bgCard }} />
              <circle cx={50} cy={50} r={R} fill="none" strokeWidth={10} stroke={PA.blue}
                strokeDasharray={C} strokeDashoffset={C * (1 - 78/100)} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[22px] font-black" style={{ color:PA.blue }}>78</span>
              <span className="text-[9px]" style={{ color:T.textMuted }}>/100</span>
            </div>
          </div>
        </Preview>
        <Preview label="Segmented donut — multi-section"
          spec={{ Usage:'Analytics completion widget.', Pattern:'One arc segment per section, gap between segments', Color:'Per-section color from PA palette' }}>
          <div className="relative" style={{ width:80, height:80 }}>
            <svg width={80} height={80} style={{ transform:'rotate(-90deg)' }}>
              <circle cx={40} cy={40} r={30} fill="none" strokeWidth={8} style={{ stroke:T.bgCard }} />
              {[PA.teal,PA.blue,PA.amber,PA.red].map((col,i) => {
                const segC = 2 * Math.PI * 30;
                const segLen = segC / 4 * 0.82;
                return (
                  <circle key={i} cx={40} cy={40} r={30} fill="none" strokeWidth={8}
                    stroke={col} strokeDasharray={`${segLen} ${segC - segLen}`}
                    strokeDashoffset={-(i * (segC / 4))} strokeLinecap="round" />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[14px] font-black" style={{ color:T.text }}>78</span>
            </div>
          </div>
        </Preview>
        <Preview label="Linear progress bar"
          spec={{ Height:'h-1.5 (6px)', Track:'T.bgCard', Fill:'Per-context accent color', Radius:'rounded-full', Usage:'Section cards, storage, confidence bars' }}>
          <div className="w-full space-y-3">
            {[[100,PA.teal,'Identity'],[85,PA.blue,'Skills'],[45,PA.red,'Measurements']].map(([p,c,l]) => (
              <div key={String(l)}>
                <div className="flex justify-between mb-1">
                  <span className="text-[10.5px]" style={{ color:T.textSub }}>{l}</span>
                  <span className="text-[10px] font-bold" style={{ color:c as string }}>{p}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background:T.bgCard }}>
                  <div className="h-full rounded-full" style={{ width:`${p}%`, background:c as string }} />
                </div>
              </div>
            ))}
          </div>
        </Preview>
        <Preview label="Step indicator — wizard"
          spec={{ Usage:'Export wizard (PortfolioExport.tsx).', States:'completed (filled circle + tick) · active (blue border) · pending (muted)', Animation:'Step state transitions on step advance' }}>
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(n => (
              <React.Fragment key={n}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={n < 3
                    ? { background:PA.blue, color:'#fff' }
                    : n === 3
                      ? { background:PA.blueBg, color:PA.blue, border:`2px solid ${PA.blue}` }
                      : { background:T.bgCard, color:T.textMuted, border:`2px solid ${T.border}` }}>
                  {n < 3 ? '✓' : n}
                </div>
                {n < 5 && (
                  <div className="flex-1 h-0.5 rounded-full" style={{ background: n < 3 ? PA.blue : T.bgCard, minWidth:16 }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </Preview>
        <Preview label="Confidence bar — AI outputs"
          spec={{ Usage:'Bio Studio, Recommendations.', Display:'Thin bar + percentage text', Color:PA.teal }}>
          <div className="w-full flex items-center gap-3">
            <span className="text-[11px]" style={{ color:T.textMuted }}>AI Confidence</span>
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background:T.bgCard }}>
              <div className="h-full rounded-full" style={{ width:'94%', background:PA.teal }} />
            </div>
            <span className="text-[10px] font-bold" style={{ color:PA.teal }}>94%</span>
          </div>
        </Preview>
      </div>
    </div>
  );
}

function TimelineSection() {
  const { T } = useTheme();
  return (
    <div className="space-y-4">
      <SectionHeader label="Timeline" desc="Vertical event streams for approval history, version tracking, and activity feeds." count={3} />
      <div className="grid grid-cols-2 gap-4">
        <Preview label="Approval status timeline"
          spec={{ Pattern:'Dot (colored) + label + timestamp', Connector:'1px vertical line (T.borderMuted)', Spacing:'mb-3 per event' }}>
          <div className="w-full relative pl-5">
            <div className="absolute left-[9px] top-1 bottom-1 w-px" style={{ background:T.borderMuted }} />
            {[
              { label:'Created',   time:'3d ago',  color:PA.teal  },
              { label:'Submitted', time:'2d ago',  color:PA.blue  },
              { label:'In Review', time:'5h ago',  color:PA.amber },
            ].map((ev,i) => (
              <div key={i} className="flex items-start gap-3 mb-3 relative">
                <div className="w-3.5 h-3.5 rounded-full shrink-0 mt-0.5 z-10" style={{ background:ev.color }} />
                <div>
                  <p className="text-[11.5px] font-semibold" style={{ color:T.text }}>{ev.label}</p>
                  <p className="text-[9.5px]" style={{ color:T.textMuted }}>{ev.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Preview>
        <Preview label="Version history timeline"
          spec={{ Pattern:'Filled circle for current, ring for selected, plain for rest', Labels:'Version tag + optional label + author init', Interaction:'Click to select (changes compare pair)' }}>
          <div className="w-full relative pl-5">
            <div className="absolute left-[9px] top-1 bottom-1 w-px" style={{ background:T.borderMuted }} />
            {[
              { v:'v5.0', label:'Agency Final', col:PA.blue,  isCurrent:true  },
              { v:'v4.2', label:'',             col:PA.teal,  isCurrent:false },
              { v:'v4.1', label:'Reviewer Edit',col:PA.amber, isCurrent:false },
            ].map((v,i) => (
              <div key={i} className="flex items-start gap-3 mb-3 relative">
                <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 z-10"
                  style={{ background:v.isCurrent?v.col:T.bgCard, border:`2px solid ${v.col}` }}>
                  {v.isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold" style={{ color:v.isCurrent?v.col:T.text }}>{v.v}</span>
                    {v.isCurrent && <span className="text-[8px] font-bold px-1 rounded" style={{ background:PA.blueBg, color:PA.blue }}>Current</span>}
                  </div>
                  {v.label && <p className="text-[10px]" style={{ color:T.textMuted }}>{v.label}</p>}
                </div>
              </div>
            ))}
          </div>
        </Preview>
        <Preview label="Activity feed row"
          spec={{ Usage:'Analytics screen bottom section.', Pattern:'Icon chip (colored bg) + event label + actor + timestamp', Interaction:'Row hover highlights with T.bgHover' }}>
          <div className="w-full space-y-1.5">
            {[
              { icon:Eye,     label:'Portfolio viewed',  who:'Elite Models NY', time:'2h ago', color:PA.blue },
              { icon:Download,label:'Comp Card downloaded',who:'Vogue Casting', time:'4h ago', color:PA.teal },
            ].map((ev,i) => {
              const Icon = ev.icon;
              return (
                <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-xl" style={{ background:T.bgCard, border:`1px solid ${T.border}` }}>
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background:ev.color+'18' }}>
                    <Icon className="w-3 h-3" style={{ color:ev.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-semibold" style={{ color:T.text }}>{ev.label}</p>
                    <p className="text-[9.5px]" style={{ color:T.textMuted }}>{ev.who}</p>
                  </div>
                  <span className="text-[9.5px]" style={{ color:T.textMuted }}>{ev.time}</span>
                </div>
              );
            })}
          </div>
        </Preview>
      </div>
    </div>
  );
}

function KanbanSection() {
  const { T } = useTheme();
  return (
    <div className="space-y-4">
      <SectionHeader label="Kanban" desc="Column structure, card anatomy, reviewer chips, and status badges for the Approvals board." count={4} />
      <div className="grid grid-cols-2 gap-4">
        <Preview label="Kanban column header"
          spec={{ Width:'234px fixed', Pattern:'Dot + label + count badge + add button', Hover:'column border transitions to category accent' }}>
          <div className="w-full rounded-xl overflow-hidden" style={{ border:`1px solid ${T.border}` }}>
            <div className="flex items-center justify-between px-3.5 py-2.5" style={{ borderBottom:`1px solid ${T.border}`, background:T.bgSub }}>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ background:PA.amber }} />
                <span className="text-[11.5px] font-bold" style={{ color:T.text }}>In Review</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background:PA.amberBg, color:PA.amber, border:`1px solid ${PA.amberBdr}` }}>3</span>
              </div>
              <Plus className="w-3 h-3" style={{ color:T.textMuted }} />
            </div>
          </div>
        </Preview>
        <Preview label="Kanban card"
          spec={{ Pattern:'Type badge + priority badge + title + footer (time + comments)', Hover:'border transitions to blue·60 opacity', Selected:'blueBg background + blueBdr border' }}>
          <div className="w-full rounded-xl p-3" style={{ background:T.bgSub, border:`1px solid ${PA.blueBdr}` }}>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="px-1.5 py-0.5 rounded text-[8.5px] font-bold" style={{ background:PA.tealBg, color:PA.teal, border:`1px solid ${PA.tealBdr}` }}>Resume</span>
              <span className="px-1.5 py-0.5 rounded text-[8.5px] font-bold ml-auto" style={{ background:PA.redBg, color:PA.red, border:`1px solid ${PA.redBdr}` }}>High</span>
            </div>
            <p className="text-[11.5px] font-semibold mb-2" style={{ color:PA.blue }}>Resume — Agency Edition</p>
            <div className="flex items-center gap-1.5 mb-2">
              <Clock className="w-3 h-3" style={{ color:T.textMuted }} />
              <span className="text-[10px]" style={{ color:T.textMuted }}>3d ago</span>
              <div className="flex items-center gap-1 ml-auto">
                <FileText className="w-3 h-3" style={{ color:T.textMuted }} />
                <span className="text-[10px]" style={{ color:T.textMuted }}>3</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 pt-2" style={{ borderTop:`1px solid ${T.borderMuted}` }}>
              <div className="w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-black text-white" style={{ background:PA.violet }}>IM</div>
              <span className="text-[10px]" style={{ color:T.textMuted }}>IMG Models NYC</span>
            </div>
          </div>
        </Preview>
        <Preview label="Status badges — all 5 states">
          <div className="flex flex-wrap gap-2">
            {[
              { label:'Draft',     color:'#64748b', bg:'#f8fafc', bdr:'#e2e8f0' },
              { label:'In Review', color:PA.amber,  bg:PA.amberBg, bdr:PA.amberBdr },
              { label:'Approved',  color:PA.teal,   bg:PA.tealBg,  bdr:PA.tealBdr  },
              { label:'Published', color:PA.blue,   bg:PA.blueBg,  bdr:PA.blueBdr  },
              { label:'Rejected',  color:PA.red,    bg:PA.redBg,   bdr:PA.redBdr   },
            ].map(s => (
              <span key={s.label} className="px-2 py-0.5 rounded-full text-[9px] font-bold"
                style={{ background:s.bg, color:s.color, border:`1px solid ${s.bdr}` }}>
                {s.label}
              </span>
            ))}
          </div>
        </Preview>
        <Preview label="Reviewer chip"
          spec={{ Pattern:'Avatar initials (colorful) + agency name truncated', Usage:'Bottom of Kanban card, Drawer header' }}>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background:T.bgSub, border:`1px solid ${T.border}` }}>
            <div className="w-7 h-7 rounded-xl flex items-center justify-center text-[9px] font-black text-white" style={{ background:'linear-gradient(135deg, #EC4899, #A855F7)' }}>EM</div>
            <div>
              <p className="text-[11.5px] font-semibold" style={{ color:T.text }}>Elite Models NY</p>
              <p className="text-[9.5px]" style={{ color:T.textMuted }}>Agency · Active now</p>
            </div>
            <ArrowRight className="w-3.5 h-3.5 ml-auto" style={{ color:T.textMuted }} />
          </div>
        </Preview>
      </div>
    </div>
  );
}

function MediaSection() {
  const { T } = useTheme();
  return (
    <div className="space-y-4">
      <SectionHeader label="Media Cards" desc="Asset presentation modes from the Media Curator: masonry, grid, list, and detail drawer." count={4} />
      <div className="grid grid-cols-2 gap-4">
        <Preview label="Masonry/Grid cell — hover overlay"
          spec={{ Hover:'black/40 overlay + title slide-up + checkbox reveal', Featured:'Star icon top-left (amber)', Radius:'rounded-xl overflow-hidden' }}>
          <div className="relative rounded-xl overflow-hidden cursor-pointer group" style={{ width:160, height:120, background:T.bgCard }}>
            <img src="/pexels-didsss-2791056.jpg" alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
            <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-[9.5px] font-semibold text-white">Portrait · Golden Hour</p>
            </div>
            <Star className="absolute top-2 left-2 w-3 h-3 fill-amber-400 text-amber-400" />
          </div>
        </Preview>
        <Preview label="List view row"
          spec={{ Layout:'Thumbnail 56×40 + label + tags + size + date + star', Hover:'row highlights with T.bgHover', Usage:'Media Curator list mode' }}>
          <div className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl" style={{ background:T.bgSub, border:`1px solid ${T.border}` }}>
            <div className="w-12 h-9 rounded-lg overflow-hidden shrink-0">
              <img src="/pexels-ganajp-15698413.jpg" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11.5px] font-semibold" style={{ color:T.text }}>Cinematic Wide · 4K</p>
              <div className="flex gap-1 mt-0.5">
                <span className="text-[9px] px-1 py-0.5 rounded" style={{ background:T.bgCard, color:T.textMuted }}>Cinematic</span>
                <span className="text-[9px] px-1 py-0.5 rounded" style={{ background:T.bgCard, color:T.textMuted }}>Wide</span>
              </div>
            </div>
            <span className="text-[10px]" style={{ color:T.textMuted }}>6.1MB</span>
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          </div>
        </Preview>
        <Preview label="Asset detail panel"
          spec={{ Width:'240px', Pattern:'Square preview + tags (PA.blue chips) + metadata table + action buttons', Trigger:'Click any asset in Masonry / Grid / List' }}>
          <div className="w-[180px] rounded-xl overflow-hidden" style={{ border:`1px solid ${T.border}` }}>
            <div className="aspect-square overflow-hidden">
              <img src="/pexels-prathsnap-3168209.jpg" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="p-2.5">
              <div className="flex gap-1 mb-2">
                <span className="px-1.5 py-0.5 rounded-full text-[8.5px] font-semibold" style={{ background:PA.blueBg, color:PA.blue, border:`1px solid ${PA.blueBdr}` }}>Portrait</span>
                <span className="px-1.5 py-0.5 rounded-full text-[8.5px] font-semibold" style={{ background:PA.blueBg, color:PA.blue, border:`1px solid ${PA.blueBdr}` }}>Studio</span>
              </div>
              <button className="w-full py-1.5 rounded-xl text-[10px] font-semibold text-white" style={{ background:'linear-gradient(135deg, #EC4899, #A855F7)' }}>
                Download
              </button>
            </div>
          </div>
        </Preview>
        <Preview label="Upload zone"
          spec={{ Style:'Dashed border (T.border) · hover transitions to PA.blue border', Pattern:'Icon + instruction text', Usage:'Any upload context in Portfolio Builder' }}>
          <div className="w-full flex flex-col items-center justify-center gap-2 py-6 rounded-xl border-2 border-dashed cursor-pointer"
            style={{ borderColor:T.border }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background:T.bgCard }}>
              <ImageIcon className="w-4 h-4" style={{ color:T.textMuted }} />
            </div>
            <p className="text-[11px]" style={{ color:T.textMuted }}>Drop files or click to upload</p>
          </div>
        </Preview>
      </div>
    </div>
  );
}

function ChartsSection() {
  const { T } = useTheme();
  const sparkData = [14,22,18,31,28,40,35,48,44,57];
  const W = 80, H = 32;
  const max = Math.max(...sparkData);
  const pts = sparkData.map((v,i) => `${(i/(sparkData.length-1))*(W-4)+2},${H-2-((v/max)*(H-4))}`).join(' ');
  return (
    <div className="space-y-4">
      <SectionHeader label="Charts" desc="SVG-based data visualisations. No external library — all rendered with viewBox polylines and rects." count={5} />
      <div className="grid grid-cols-2 gap-4">
        <Preview label="Line chart with gradient fill"
          spec={{ ViewBox:'400 × 80', Fill:`linearGradient from color·18% to color·0%`, Line:'stroke-width 2, strokeLinecap round', Terminal:'Filled dot (r=3.5) + white stroke ring' }}>
          <div className="w-full" style={{ height:60 }}>
            <svg viewBox="0 0 400 60" preserveAspectRatio="none" className="w-full h-full">
              <defs>
                <linearGradient id="demo-lg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={PA.blue} stopOpacity="0.18" />
                  <stop offset="100%" stopColor={PA.blue} stopOpacity="0.01" />
                </linearGradient>
              </defs>
              <polygon points={`2,60 ${[42,38,55,61,48,72,88,76,91,85,94,78,103,115,108,122,98,134,142].map((v,i)=>`${(i/18)*396+2},${60-2-((v/142)*56)}`).join(' ')} 398,60`} fill="url(#demo-lg)" />
              <polyline points={[42,38,55,61,48,72,88,76,91,85,94,78,103,115,108,122,98,134,142].map((v,i)=>`${(i/18)*396+2},${60-2-((v/142)*56)}`).join(' ')} fill="none" stroke={PA.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </Preview>
        <Preview label="Stacked bar chart"
          spec={{ ViewBox:'400 × 80', Bars:'Stacked rects with color per status (teal/amber/red)', Labels:'Week labels in SVG text, 6px fontSize' }}>
          <div className="w-full" style={{ height:60 }}>
            <svg viewBox="0 0 400 60" preserveAspectRatio="none" className="w-full h-full">
              {[2,3,1,4,2,5,3,6].map((n,i) => {
                const x = i*50+5, bW=35;
                return (
                  <g key={i}>
                    <rect x={x} y={60-n*8-8}   width={bW} height={n*8}   fill={PA.teal}  rx="2" opacity="0.85" />
                    <rect x={x} y={60-n*8-8-8}  width={bW} height={8}    fill={PA.amber} rx="2" opacity="0.85" />
                    <text x={x+bW/2} y={59} textAnchor="middle" fontSize="5" fill={T.textMuted}>W{i+1}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </Preview>
        <Preview label="Donut — score ring"
          spec={{ Pattern:'Single-stroke circle, strokeDasharray for arc length', Transform:'rotate(-90deg) so 0° starts at top', Color:'teal ≥85 · blue ≥65 · amber <65' }}>
          <div className="relative" style={{ width:72, height:72 }}>
            <svg width={72} height={72} style={{ transform:'rotate(-90deg)' }}>
              <circle cx={36} cy={36} r={28} fill="none" strokeWidth={8} style={{ stroke:T.bgCard }} />
              <circle cx={36} cy={36} r={28} fill="none" strokeWidth={8} stroke={PA.teal}
                strokeDasharray={2*Math.PI*28} strokeDashoffset={2*Math.PI*28*(1-0.78)} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[16px] font-black" style={{ color:PA.teal }}>78</span>
            </div>
          </div>
        </Preview>
        <Preview label="Sparkline + KPI card"
          spec={{ Usage:'Compact trend indicator within stat cards or list rows.', Size:'80 × 32px SVG', Color:'Inherits accent from context' }}>
          <div className="flex items-center gap-4 px-4 py-3 rounded-xl w-full" style={{ background:T.bgSub, border:`1px solid ${T.border}` }}>
            <div>
              <p className="text-[10px]" style={{ color:T.textMuted }}>Downloads</p>
              <p className="text-[20px] font-black" style={{ color:T.text, fontFamily:'Inter Tight, sans-serif' }}>142</p>
            </div>
            <div className="ml-auto" style={{ width:W, height:H }}>
              <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full h-full">
                <polyline points={pts} fill="none" stroke={PA.teal} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </Preview>
        <Preview label="Multi-segment completion donut">
          <div className="relative" style={{ width:72, height:72 }}>
            <svg width={72} height={72} style={{ transform:'rotate(-90deg)' }}>
              <circle cx={36} cy={36} r={28} fill="none" strokeWidth={8} style={{ stroke:T.bgCard }} />
              {[PA.teal,PA.blue,PA.amber,PA.red,PA.violet,'#94a3b8'].map((col,i) => {
                const segC = 2*Math.PI*28;
                const sLen = segC/6*0.8;
                return (
                  <circle key={i} cx={36} cy={36} r={28} fill="none" strokeWidth={8}
                    stroke={col} strokeDasharray={`${sLen} ${segC-sLen}`}
                    strokeDashoffset={-(i*(segC/6))} strokeLinecap="round" />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[12px] font-black" style={{ color:T.text }}>73</span>
            </div>
          </div>
        </Preview>
      </div>
    </div>
  );
}

function NavigationSection() {
  const { T } = useTheme();
  return (
    <div className="space-y-4">
      <SectionHeader label="Navigation" desc="Sub-nav groups, active item states, tab pills, and breadcrumb patterns used in Portfolio Builder." count={3} />
      <div className="grid grid-cols-2 gap-4">
        <Preview label="Left sub-nav group"
          spec={{ Width:'168px', GroupLabel:'8.5px font, bold, uppercase, tracking-widest, T.textMuted', Active:'PA.blueBg bg + PA.blueBdr border + PA.blue text+icon', Hover:'T.bgHover on inactive items' }}>
          <div className="w-full space-y-0.5">
            <p className="text-[8.5px] font-bold uppercase tracking-widest px-2 mb-1" style={{ color:T.textMuted }}>Studio</p>
            {[
              { label:'Bio Studio',    active:true  },
              { label:'Resume Studio', active:false },
              { label:'Comp Card',     active:false },
            ].map(item => (
              <div key={item.label}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl cursor-pointer"
                style={item.active
                  ? { background:PA.blueBg, border:`1px solid ${PA.blueBdr}` }
                  : { border:'1px solid transparent', color:T.textSub }}>
                <FileText className="w-3.5 h-3.5 shrink-0" style={{ color:item.active ? PA.blue : T.textMuted }} />
                <span className="text-[11.5px] font-medium" style={{ color:item.active ? PA.blue : T.textSub }}>{item.label}</span>
              </div>
            ))}
          </div>
        </Preview>
        <Preview label="Tab pill switcher"
          spec={{ Pattern:'p-0.5 pill container (T.bgCard) + child buttons (rounded-lg)', Active:'T.bg bg + box-shadow 0 1px 3px rgba(0,0,0,0.08)', Usage:'View mode toggles (Timeline/Storyboard, Split/Unified, Desktop/Mobile)' }}>
          <div className="flex items-center gap-0.5 p-0.5 rounded-xl" style={{ background:T.bgCard }}>
            {['Timeline','Storyboard'].map((t,i) => (
              <button key={t}
                className="px-3 py-1.5 rounded-lg text-[11.5px] font-medium cursor-pointer transition-all"
                style={i===0
                  ? { background:T.bg, color:T.text, boxShadow:'0 1px 3px rgba(0,0,0,0.08)' }
                  : { color:T.textMuted }}>
                {t}
              </button>
            ))}
          </div>
        </Preview>
        <Preview label="Time range selector"
          spec={{ Usage:'Analytics header.', Items:'7d · 30d · 90d', Style:'Same pill pattern as tab switcher' }}>
          <div className="flex items-center gap-0.5 p-0.5 rounded-xl" style={{ background:T.bgCard }}>
            {['7 days','30 days','90 days'].map((t,i) => (
              <button key={t}
                className="px-3 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer transition-all"
                style={i===1
                  ? { background:T.bg, color:T.text, boxShadow:'0 1px 3px rgba(0,0,0,0.08)' }
                  : { color:T.textMuted }}>
                {t}
              </button>
            ))}
          </div>
        </Preview>
      </div>
    </div>
  );
}

function OverlaysSection() {
  const { T } = useTheme();
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="space-y-4">
      <SectionHeader label="Drawers & Panels" desc="Side drawers, confirmation modals, and overlay patterns across Portfolio Builder." count={4} />
      <div className="grid grid-cols-2 gap-4">
        <Preview label="Side detail drawer (right)"
          spec={{ Width:'340px (Approvals) / 240px (Media Curator)', Pattern:'Header with X close + scrollable body + sticky footer input bar', Trigger:'Clicking any Kanban card or media asset' }}>
          <div className="w-full rounded-2xl overflow-hidden" style={{ border:`1px solid ${T.border}` }}>
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom:`1px solid ${T.border}`, background:T.bgSub }}>
              <p className="text-[12px] font-bold" style={{ color:T.text }}>Portfolio Set — FW24</p>
              <X className="w-3.5 h-3.5" style={{ color:T.textMuted }} />
            </div>
            <div className="px-4 py-3 space-y-2" style={{ background:T.bg }}>
              <p className="text-[10.5px]" style={{ color:T.textMuted }}>Status timeline · Comments · Reviewer · Actions</p>
              <div className="h-px" style={{ background:T.borderMuted }} />
              <div className="flex gap-2">
                <button className="flex-1 py-1.5 rounded-xl text-[10.5px] font-semibold text-white" style={{ background:PA.teal }}>Approve</button>
                <button className="flex-1 py-1.5 rounded-xl text-[10.5px] font-semibold" style={{ background:PA.redBg, color:PA.red, border:`1px solid ${PA.redBdr}` }}>Reject</button>
              </div>
            </div>
          </div>
        </Preview>
        <Preview label="Confirmation modal"
          spec={{ MaxWidth:'340px centered', Pattern:'Icon + heading + description + Cancel/Confirm button pair', Backdrop:'rgba(0,0,0,0.35)', Example:'Version restore, project delete' }}>
          <div className="w-full rounded-2xl p-5" style={{ background:T.bg, border:`1px solid ${T.border}`, boxShadow:'0 8px 40px rgba(0,0,0,0.14)' }}>
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center mb-3" style={{ background:PA.amberBg, border:`1px solid ${PA.amberBdr}` }}>
              <AlertCircle className="w-4 h-4" style={{ color:PA.amber }} />
            </div>
            <p className="text-[13px] font-bold mb-1" style={{ color:T.text }}>Restore to v4.1?</p>
            <p className="text-[11px] mb-4" style={{ color:T.textMuted }}>A new version will be created. Current work is preserved.</p>
            <div className="flex gap-2">
              <button className="flex-1 py-2 rounded-xl text-[11.5px] font-semibold" style={{ background:T.bgCard, color:T.textSub, border:`1px solid ${T.border}` }}>Cancel</button>
              <button className="flex-1 py-2 rounded-xl text-[11.5px] font-semibold text-white" style={{ background:PA.amber }}>Restore</button>
            </div>
          </div>
        </Preview>
        <Preview label="Section label bar"
          spec={{ Height:'h-8 (32px)', Usage:'Diff view, toolbar sub-rows.', Pattern:'Context label (9px uppercase) + separator dots + secondary info' }}>
          <div className="w-full flex items-center px-4 h-8 gap-2" style={{ background:T.bgSub, border:`1px solid ${T.border}`, borderRadius:8 }}>
            <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color:T.textMuted }}>Section: Bio</span>
            <span className="text-[9px]" style={{ color:T.textMuted }}>·</span>
            <span className="text-[9.5px]" style={{ color:T.textMuted }}>11 lines compared</span>
          </div>
        </Preview>
        <Preview label="Empty state"
          spec={{ Usage:'Kanban columns with no cards, filtered lists with no results.', Pattern:'Icon container (T.bgCard) + message text', Border:'Dashed border (T.border)' }}>
          <div className="flex flex-col items-center gap-2 px-8 py-6 rounded-2xl border-2 border-dashed w-full" style={{ borderColor:T.border }}>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background:T.bgCard }}>
              <Layers className="w-5 h-5" style={{ color:T.textMuted }} />
            </div>
            <p className="text-[12px] font-semibold" style={{ color:T.text }}>Nothing here yet</p>
            <p className="text-[11px]" style={{ color:T.textMuted }}>Add items to get started</p>
          </div>
        </Preview>
      </div>
    </div>
  );
}

export default function PortfolioDesignSystem() {
  const { T } = useTheme();
  const [cat, setCat] = useState<DSCategory>('buttons');

  const SECTION_MAP: Record<DSCategory, React.ReactNode> = {
    buttons:    <ButtonsSection />,
    cards:      <CardsSection />,
    inputs:     <InputsSection />,
    progress:   <ProgressSection />,
    timeline:   <TimelineSection />,
    kanban:     <KanbanSection />,
    media:      <MediaSection />,
    charts:     <ChartsSection />,
    navigation: <NavigationSection />,
    overlays:   <OverlaysSection />,
  };

  return (
    <div className="flex-1 flex overflow-hidden">

      {/* ── Left nav ── */}
      <div className="w-[192px] shrink-0 flex flex-col"
        style={{ borderRight:`1px solid ${T.border}`, background:T.bgSub }}>

        <div className="shrink-0 px-4 py-3 flex items-center gap-2" style={{ borderBottom:`1px solid ${T.border}` }}>
          <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background:PA.violetBg, border:`1px solid ${PA.violetBdr}` }}>
            <Layers className="w-3 h-3" style={{ color:PA.violet }} />
          </div>
          <span className="text-[12px] font-bold" style={{ color:T.text }}>Design System</span>
        </div>

        <div className="flex-1 overflow-y-auto py-2 px-2" style={{ scrollbarWidth:'none' }}>
          {CATEGORIES.map(c => {
            const isActive = cat === c.id;
            const Icon = c.icon;
            return (
              <button key={c.id} onClick={() => setCat(c.id)}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left cursor-pointer transition-all mb-0.5"
                style={isActive
                  ? { background:PA.violetBg, border:`1px solid ${PA.violetBdr}` }
                  : { border:'1px solid transparent' }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = T.bgHover; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}>
                <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: isActive ? PA.violet : T.textMuted }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[11.5px] font-medium truncate" style={{ color: isActive ? PA.violet : T.textSub }}>{c.label}</p>
                </div>
                <span className="text-[9px] font-bold shrink-0" style={{ color: isActive ? PA.violet : T.textMuted }}>{c.count}</span>
              </button>
            );
          })}
        </div>

        {/* Version */}
        <div className="shrink-0 px-4 py-3" style={{ borderTop:`1px solid ${T.border}` }}>
          <p className="text-[9px]" style={{ color:T.textMuted }}>Portfolio Builder · Design System</p>
          <p className="text-[9px]" style={{ color:T.textMuted }}>v1.0 · {CATEGORIES.reduce((s,c)=>s+c.count,0)} components</p>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto px-7 py-6" style={{ scrollbarWidth:'thin' }}>
        {SECTION_MAP[cat]}
      </div>
    </div>
  );
}
