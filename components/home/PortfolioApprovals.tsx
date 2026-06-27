'use client';

import React, { useState } from 'react';
import {
  MessageSquare, Clock, Plus, Filter,
  CheckCircle2, XCircle, Send, Layers,
  X, AlertCircle, ArrowRight, MoreHorizontal,
  FileText, FileCheck, CreditCard, Image as ImageIcon,
  Eye, ChevronRight,
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

const PA = {
  blue:'#EC4899',blueBg:'rgba(236,72,153,0.10)',blueBdr:'rgba(236,72,153,0.28)',
  teal:'#A855F7',tealBg:'rgba(168,85,247,0.10)',tealBdr:'rgba(168,85,247,0.28)',
  amber:'#F59E0B',amberBg:'rgba(245,158,11,0.10)',amberBdr:'rgba(245,158,11,0.28)',
  red:'#EF4444',redBg:'rgba(239,68,68,0.10)',redBdr:'rgba(239,68,68,0.28)',
  violet:'#8B5CF6',violetBg:'rgba(139,92,246,0.10)',violetBdr:'rgba(139,92,246,0.28)',
};

type ColId = 'draft' | 'review' | 'approved' | 'published' | 'rejected';

interface ApprovalCard {
  id: string;
  col: ColId;
  title: string;
  type: 'bio' | 'resume' | 'compcard' | 'portfolio' | 'media';
  priority: 'high' | 'med' | 'low';
  date: string;
  comments: number;
  reviewer?: string;
  reviewerInit?: string;
  reviewerColor?: string;
}

const TYPE_META = {
  bio:       { label:'Bio',        icon: FileText,    color:PA.blue,   bg:PA.blueBg,   bdr:PA.blueBdr   },
  resume:    { label:'Resume',     icon: FileCheck,   color:PA.teal,   bg:PA.tealBg,   bdr:PA.tealBdr   },
  compcard:  { label:'Comp Card',  icon: CreditCard,  color:PA.violet, bg:PA.violetBg, bdr:PA.violetBdr },
  portfolio: { label:'Portfolio',  icon: ImageIcon,   color:PA.amber,  bg:PA.amberBg,  bdr:PA.amberBdr  },
  media:     { label:'Media',      icon: ImageIcon,   color:PA.teal,   bg:PA.tealBg,   bdr:PA.tealBdr   },
};

const PRIORITY_META = {
  high: { label:'High',   color:PA.red,   bg:PA.redBg,   bdr:PA.redBdr   },
  med:  { label:'Medium', color:PA.amber, bg:PA.amberBg, bdr:PA.amberBdr },
  low:  { label:'Low',    color:PA.teal,  bg:PA.tealBg,  bdr:PA.tealBdr  },
};

const COL_META: Record<ColId, { label:string; color:string; bg:string; bdr:string; dot:string }> = {
  draft:     { label:'Draft',      color:'#64748b', bg:'#F8FAFC', bdr:'#E2E8F0', dot:'#94a3b8' },
  review:    { label:'In Review',  color:PA.amber,  bg:PA.amberBg, bdr:PA.amberBdr, dot:PA.amber  },
  approved:  { label:'Approved',   color:PA.teal,   bg:PA.tealBg,  bdr:PA.tealBdr,  dot:PA.teal   },
  published: { label:'Published',  color:PA.blue,   bg:PA.blueBg,  bdr:PA.blueBdr,  dot:PA.blue   },
  rejected:  { label:'Rejected',   color:PA.red,    bg:PA.redBg,   bdr:PA.redBdr,   dot:PA.red    },
};

const CARDS: ApprovalCard[] = [
  { id:'c1', col:'draft',     title:'Bio — Agency Submission v5',        type:'bio',       priority:'high', date:'2h ago',   comments:0 },
  { id:'c2', col:'draft',     title:'Resume — Commercial Casting',       type:'resume',    priority:'med',  date:'1d ago',   comments:2 },
  { id:'c3', col:'draft',     title:'Comp Card — Summer 2025',           type:'compcard',  priority:'low',  date:'3d ago',   comments:0 },
  { id:'c4', col:'review',    title:'Portfolio Set — FW24 Submission',   type:'portfolio', priority:'high', date:'5h ago',   comments:4,  reviewer:'Elite Models NY', reviewerInit:'EM', reviewerColor:PA.blue   },
  { id:'c5', col:'review',    title:'Bio — Editorial Version',           type:'bio',       priority:'med',  date:'1d ago',   comments:1,  reviewer:'Vogue Casting',   reviewerInit:'VC', reviewerColor:PA.teal   },
  { id:'c6', col:'review',    title:'Media Pack — SS25 Campaign',        type:'media',     priority:'high', date:'2d ago',   comments:6,  reviewer:'IMG Models NYC',  reviewerInit:'IM', reviewerColor:PA.violet },
  { id:'c7', col:'approved',  title:'Resume — Agency Edition',           type:'resume',    priority:'high', date:'3d ago',   comments:3,  reviewer:'IMG Models NYC',  reviewerInit:'IM', reviewerColor:PA.violet },
  { id:'c8', col:'approved',  title:'Comp Card — Minimal Theme',         type:'compcard',  priority:'med',  date:'4d ago',   comments:2 },
  { id:'c9', col:'published', title:'Portfolio — Casting Book v3',       type:'portfolio', priority:'high', date:'1 week',   comments:7,  reviewer:'Elite Models NY', reviewerInit:'EM', reviewerColor:PA.blue   },
  { id:'c10',col:'rejected',  title:'Bio — First Draft (needs rework)',  type:'bio',       priority:'low',  date:'2 weeks',  comments:5,  reviewer:'Vogue Casting',   reviewerInit:'VC', reviewerColor:PA.teal   },
];

interface Comment { id:number; author:string; init:string; color:string; time:string; text:string; }
const ALL_COMMENTS: Comment[] = [
  { id:1, author:'Elite Models NY', init:'EM', color:PA.blue,   time:'3h ago',  text:'Please update the measurements section and add recent runway work from the FW24 season.' },
  { id:2, author:'Sarah Chen',      init:'SC', color:PA.teal,   time:'2h ago',  text:'Updated measurements and added 6 new runway photos from FW24 Milan show.' },
  { id:3, author:'Elite Models NY', init:'EM', color:PA.blue,   time:'1h ago',  text:'Looking much better! Just need the agency exclusivity clause confirmed.' },
  { id:4, author:'IMG Models NYC',  init:'IM', color:PA.violet, time:'5h ago',  text:'The media pack quality is excellent. Requesting one landscape crop for print.' },
  { id:5, author:'Vogue Casting',   init:'VC', color:PA.teal,   time:'2d ago',  text:'The bio needs a stronger opening statement. Current version is too generic.' },
  { id:6, author:'Sarah Chen',      init:'SC', color:PA.teal,   time:'1d ago',  text:'Revised the opening with award-winning credentials and signature style context.' },
  { id:7, author:'Vogue Casting',   init:'VC', color:PA.teal,   time:'18h ago', text:'This is much stronger. Approved for editorial submission use.' },
];

const TIMELINE_EVENTS = [
  { label:'Created',     time:'3 days ago',  color:PA.teal  },
  { label:'Submitted',   time:'2 days ago',  color:PA.blue  },
  { label:'In Review',   time:'5 hours ago', color:PA.amber },
  { label:'Comment',     time:'3 hours ago', color:'#94a3b8'},
];

export default function PortfolioApprovals() {
  const { T } = useTheme();
  const [cards]          = useState<ApprovalCard[]>(CARDS);
  const [detail, setDetail]   = useState<ApprovalCard | null>(null);
  const [comment, setComment] = useState('');
  const [hoverCol, setHoverCol] = useState<string | null>(null);

  const cols: ColId[] = ['draft', 'review', 'approved', 'published', 'rejected'];
  const cardsFor = (col: ColId) => cards.filter(c => c.col === col);
  const totalActive = cards.filter(c => c.col !== 'published' && c.col !== 'rejected').length;

  const detailComments = detail
    ? ALL_COMMENTS.slice(0, Math.min(detail.comments + 1, ALL_COMMENTS.length))
    : [];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">

      {/* ── Toolbar ── */}
      <div className="shrink-0 h-12 flex items-center px-6 gap-3"
        style={{ borderBottom:`1px solid ${T.border}`, background:T.bg }}>
        <span className="text-[13px] font-bold tracking-[-0.02em]" style={{ color:T.text }}>Approvals</span>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full ml-1"
          style={{ background:T.bgCard, color:T.textMuted, border:`1px solid ${T.border}` }}>
          {totalActive} active
        </span>

        {/* Column count chips */}
        <div className="flex items-center gap-1.5 ml-3">
          {cols.map(c => {
            const m = COL_META[c];
            const n = cardsFor(c).length;
            if (n === 0) return null;
            return (
              <span key={c} className="px-2 py-0.5 rounded-full text-[9px] font-bold"
                style={{ background:m.bg, color:m.color, border:`1px solid ${m.bdr}` }}>
                {m.label} · {n}
              </span>
            );
          })}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-medium cursor-pointer transition-all"
            style={{ background:T.bgCard, color:T.textSub, border:`1px solid ${T.border}` }}
            onMouseEnter={e=>(e.currentTarget.style.background=T.bgHover)}
            onMouseLeave={e=>(e.currentTarget.style.background=T.bgCard)}>
            <Filter className="w-3 h-3" />Filter
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11.5px] font-semibold text-white cursor-pointer hover:opacity-90"
            style={{ background:'linear-gradient(135deg, #EC4899, #A855F7)' }}>
            <Plus className="w-3.5 h-3.5" />New Submission
          </button>
        </div>
      </div>

      {/* ── Board + Drawer ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* Kanban board */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden" style={{ scrollbarWidth:'thin' }}>
          <div className="flex gap-3 h-full px-5 py-4" style={{ minWidth: cols.length * 170 + 40 }}>
            {cols.map(colId => {
              const meta = COL_META[colId];
              const col  = cardsFor(colId);
              const isHovered = hoverCol === colId;

              return (
                <div key={colId}
                  className="flex flex-col rounded-2xl overflow-hidden transition-all duration-200"
                  style={{
                    flex: '1 1 0',
                    minWidth: 160,
                    background: T.bgSub,
                    border: `1px solid ${isHovered ? meta.bdr : T.border}`,
                  }}
                  onMouseEnter={() => setHoverCol(colId)}
                  onMouseLeave={() => setHoverCol(null)}>

                  {/* Column header */}
                  <div className="shrink-0 flex items-center justify-between px-3.5 py-2.5"
                    style={{ borderBottom:`1px solid ${T.border}` }}>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ background:meta.dot }} />
                      <span className="text-[11.5px] font-bold" style={{ color:T.text }}>{meta.label}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background:meta.bg, color:meta.color, border:`1px solid ${meta.bdr}` }}>
                        {col.length}
                      </span>
                    </div>
                    <button className="w-5 h-5 flex items-center justify-center rounded-lg cursor-pointer transition-colors"
                      style={{ color:T.textMuted }}
                      onMouseEnter={e=>(e.currentTarget.style.background=T.bgHover)}
                      onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Cards */}
                  <div className="flex-1 overflow-y-auto px-2.5 py-2.5 space-y-2" style={{ scrollbarWidth:'none' }}>
                    {col.map(card => {
                      const tm = TYPE_META[card.type];
                      const pm = PRIORITY_META[card.priority];
                      const isSelected = detail?.id === card.id;

                      return (
                        <div key={card.id}
                          className="rounded-xl p-3 cursor-pointer transition-all"
                          style={{
                            background: isSelected ? PA.blueBg : T.bg,
                            border: `1px solid ${isSelected ? PA.blueBdr : T.border}`,
                          }}
                          onMouseEnter={e => {
                            if (!isSelected) {
                              e.currentTarget.style.background = T.bgHover;
                              e.currentTarget.style.borderColor = meta.bdr;
                            }
                          }}
                          onMouseLeave={e => {
                            if (!isSelected) {
                              e.currentTarget.style.background = T.bg;
                              e.currentTarget.style.borderColor = T.border;
                            }
                          }}
                          onClick={() => setDetail(isSelected ? null : card)}>

                          {/* Badges row */}
                          <div className="flex items-center gap-1 mb-2">
                            <span className="px-1.5 py-0.5 rounded text-[8.5px] font-bold"
                              style={{ background:tm.bg, color:tm.color, border:`1px solid ${tm.bdr}` }}>
                              {tm.label}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[8.5px] font-bold ml-auto"
                              style={{ background:pm.bg, color:pm.color, border:`1px solid ${pm.bdr}` }}>
                              {pm.label}
                            </span>
                          </div>

                          {/* Title */}
                          <p className="text-[11.5px] font-semibold leading-snug mb-2.5"
                            style={{ color: isSelected ? PA.blue : T.text }}>{card.title}</p>

                          {/* Footer */}
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3 h-3 shrink-0" style={{ color:T.textMuted }} />
                            <span className="text-[10px]" style={{ color:T.textMuted }}>{card.date}</span>
                            {card.comments > 0 && (
                              <div className="flex items-center gap-1 ml-auto">
                                <MessageSquare className="w-3 h-3" style={{ color:T.textMuted }} />
                                <span className="text-[10px]" style={{ color:T.textMuted }}>{card.comments}</span>
                              </div>
                            )}
                          </div>

                          {/* Reviewer chip */}
                          {card.reviewer && (
                            <div className="mt-2 flex items-center gap-1.5 pt-2"
                              style={{ borderTop:`1px solid ${T.borderMuted}` }}>
                              <div className="w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-black text-white shrink-0"
                                style={{ background:card.reviewerColor }}>
                                {card.reviewerInit}
                              </div>
                              <span className="text-[10px] truncate" style={{ color:T.textMuted }}>{card.reviewer}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {col.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-10 gap-2 rounded-xl border-2 border-dashed"
                        style={{ borderColor:T.border }}>
                        <Layers className="w-5 h-5" style={{ color:T.textMuted }} />
                        <p className="text-[10px]" style={{ color:T.textMuted }}>Empty</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Detail drawer ── */}
        {detail && (
          <div className="w-[344px] shrink-0 flex flex-col"
            style={{ borderLeft:`1px solid ${T.border}`, background:T.bg }}>

            {/* Header */}
            <div className="shrink-0 flex items-start gap-3 px-5 py-4"
              style={{ borderBottom:`1px solid ${T.border}` }}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center flex-wrap gap-1.5 mb-1.5">
                  <span className="px-1.5 py-0.5 rounded text-[8.5px] font-bold"
                    style={{ background:TYPE_META[detail.type].bg, color:TYPE_META[detail.type].color, border:`1px solid ${TYPE_META[detail.type].bdr}` }}>
                    {TYPE_META[detail.type].label}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[8.5px] font-bold"
                    style={{ background:COL_META[detail.col].bg, color:COL_META[detail.col].color, border:`1px solid ${COL_META[detail.col].bdr}` }}>
                    {COL_META[detail.col].label}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[8.5px] font-bold"
                    style={{ background:PRIORITY_META[detail.priority].bg, color:PRIORITY_META[detail.priority].color, border:`1px solid ${PRIORITY_META[detail.priority].bdr}` }}>
                    {PRIORITY_META[detail.priority].label} Priority
                  </span>
                </div>
                <p className="text-[13px] font-bold leading-snug" style={{ color:T.text }}>{detail.title}</p>
              </div>
              <button onClick={() => setDetail(null)}
                className="w-6 h-6 flex items-center justify-center rounded-lg shrink-0 cursor-pointer"
                style={{ color:T.textMuted }}
                onMouseEnter={e=>(e.currentTarget.style.background=T.bgHover)}
                onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth:'none' }}>

              {/* Primary action */}
              {detail.col === 'review' && (
                <div className="px-5 py-3.5 flex gap-2" style={{ borderBottom:`1px solid ${T.border}` }}>
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-semibold text-white cursor-pointer hover:opacity-90"
                    style={{ background:PA.teal }}>
                    <CheckCircle2 className="w-3.5 h-3.5" />Approve
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-semibold cursor-pointer hover:opacity-90"
                    style={{ background:PA.redBg, color:PA.red, border:`1px solid ${PA.redBdr}` }}>
                    <XCircle className="w-3.5 h-3.5" />Reject
                  </button>
                  <button className="w-9 flex items-center justify-center rounded-xl cursor-pointer"
                    style={{ background:T.bgCard, border:`1px solid ${T.border}`, color:T.textSub }}>
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              )}
              {detail.col === 'draft' && (
                <div className="px-5 py-3.5" style={{ borderBottom:`1px solid ${T.border}` }}>
                  <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11.5px] font-semibold text-white cursor-pointer hover:opacity-90"
                    style={{ background:'linear-gradient(135deg, #EC4899, #A855F7)' }}>
                    <ArrowRight className="w-3.5 h-3.5" />Submit for Review
                  </button>
                </div>
              )}
              {detail.col === 'approved' && (
                <div className="px-5 py-3.5" style={{ borderBottom:`1px solid ${T.border}` }}>
                  <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11.5px] font-semibold text-white cursor-pointer hover:opacity-90"
                    style={{ background:'linear-gradient(135deg, #EC4899, #A855F7)' }}>
                    <Eye className="w-3.5 h-3.5" />Publish Now
                  </button>
                </div>
              )}

              {/* Timeline */}
              <div className="px-5 py-4" style={{ borderBottom:`1px solid ${T.border}` }}>
                <p className="text-[9px] font-bold uppercase tracking-widest mb-3" style={{ color:T.textMuted }}>Status Timeline</p>
                <div className="relative pl-4">
                  <div className="absolute left-[7px] top-1 bottom-1 w-px" style={{ background:T.borderMuted }} />
                  {TIMELINE_EVENTS.map((ev, i) => (
                    <div key={i} className="flex items-start gap-3 mb-3 relative">
                      <div className="w-3 h-3 rounded-full shrink-0 mt-0.5 ring-2 ring-offset-1 z-10"
                        style={{
                          background: ev.color,
                          ringColor: ev.color + '40',
                          ringOffsetColor: T.bg,
                        } as React.CSSProperties} />
                      <div>
                        <p className="text-[11px] font-semibold" style={{ color:T.text }}>{ev.label}</p>
                        <p className="text-[9.5px]" style={{ color:T.textMuted }}>{ev.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviewer */}
              {detail.reviewer && (
                <div className="px-5 py-4" style={{ borderBottom:`1px solid ${T.border}` }}>
                  <p className="text-[9px] font-bold uppercase tracking-widest mb-2.5" style={{ color:T.textMuted }}>Assigned Reviewer</p>
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                    style={{ background:T.bgSub, border:`1px solid ${T.border}` }}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[9px] font-black text-white shrink-0"
                      style={{ background:detail.reviewerColor }}>
                      {detail.reviewerInit}
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold" style={{ color:T.text }}>{detail.reviewer}</p>
                      <p className="text-[9.5px]" style={{ color:T.textMuted }}>Agency · Active now</p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 ml-auto" style={{ color:T.textMuted }} />
                  </div>
                </div>
              )}

              {/* Comments */}
              <div className="px-5 py-4">
                <p className="text-[9px] font-bold uppercase tracking-widest mb-3" style={{ color:T.textMuted }}>
                  Comments · {detail.comments}
                </p>
                {detailComments.length === 0 && (
                  <div className="flex items-center gap-2 px-3 py-3 rounded-xl"
                    style={{ background:T.bgSub, border:`1px dashed ${T.border}` }}>
                    <MessageSquare className="w-3.5 h-3.5" style={{ color:T.textMuted }} />
                    <p className="text-[11px]" style={{ color:T.textMuted }}>No comments yet</p>
                  </div>
                )}
                <div className="space-y-3.5">
                  {detailComments.map(c => (
                    <div key={c.id} className="flex gap-2.5">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[7.5px] font-black text-white shrink-0 mt-0.5"
                        style={{ background:c.color }}>
                        {c.init}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] font-semibold" style={{ color:T.text }}>{c.author}</span>
                          <span className="text-[9.5px]" style={{ color:T.textMuted }}>{c.time}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed" style={{ color:T.textSub }}>{c.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Comment input */}
            <div className="shrink-0 px-4 py-3" style={{ borderTop:`1px solid ${T.border}` }}>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[7.5px] font-black text-white shrink-0"
                  style={{ background:PA.teal }}>SC</div>
                <input value={comment} onChange={e => setComment(e.target.value)}
                  placeholder="Add a comment…"
                  className="flex-1 px-3 py-1.5 rounded-xl text-[11.5px] outline-none"
                  style={{ background:T.inputBg, border:`1px solid ${T.border}`, color:T.text }} />
                <button
                  className="w-7 h-7 flex items-center justify-center rounded-xl cursor-pointer transition-all"
                  style={{ background: comment.trim() ? PA.blue : T.bgCard, color: comment.trim() ? '#fff' : T.textMuted }}>
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
