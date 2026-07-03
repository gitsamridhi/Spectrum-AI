'use client';

import React, { useState } from 'react';
import {
  Search, CheckCircle2, AlertCircle, MessageCircle, Send,
  ThumbsUp, RotateCcw, Star, Smile, Mic2, PersonStanding,
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

const AC = {
  pink: '#EC4899', pinkBg: 'rgba(236,72,153,0.10)', pinkBdr: 'rgba(236,72,153,0.28)',
  violet: '#A855F7', violetBg: 'rgba(168,85,247,0.10)',
  amber: '#F59E0B', amberBg: 'rgba(245,158,11,0.10)', amberBdr: 'rgba(245,158,11,0.28)',
  green: '#10B981', greenBg: 'rgba(16,185,129,0.10)', greenBdr: 'rgba(16,185,129,0.28)',
  red:   '#EF4444', redBg:   'rgba(239,68,68,0.10)',   redBdr:   'rgba(239,68,68,0.28)',
};

type Approval = 'pending' | 'approved' | 'changes';

interface Submission { id: number; title: string; type: string; date: string; score: number; approval: Approval }
interface Student { id: number; name: string; avatar: string; avgScore: number; submissions: Submission[] }

const STUDENTS: Student[] = [
  { id: 1, name: 'Maya Alvarez',   avatar: 'MA', avgScore: 81, submissions: [
    { id: 101, title: 'Behavioral round — Leadership',  type: 'Interview', date: 'Today',      score: 82, approval: 'pending'  },
    { id: 102, title: 'Drama monologue — "The Letter"', type: 'Acting',    date: 'Yesterday',   score: 74, approval: 'approved' },
  ]},
  { id: 2, name: 'Jordan Blake',   avatar: 'JB', avgScore: 76, submissions: [
    { id: 201, title: 'Pageant Q&A — current events',   type: 'Pageant',   date: '2 days ago',  score: 88, approval: 'pending' },
  ]},
  { id: 3, name: 'Priya Nandan',   avatar: 'PN', avgScore: 69, submissions: [
    { id: 301, title: 'Voice pacing drill',              type: 'Voice',    date: '3 days ago',  score: 64, approval: 'changes'  },
    { id: 302, title: 'Self-tape — Scene 4',              type: 'Acting',   date: '5 days ago',  score: 71, approval: 'pending'  },
  ]},
];

interface Comment { author: string; text: string; when: string }
const INITIAL_COMMENTS: Record<number, Comment[]> = {
  101: [{ author: 'Coach', text: 'Strong opening — watch your pacing in the second half.', when: '1h ago' }],
  201: [],
  301: [{ author: 'Coach', text: 'Pacing has improved, but let’s work on filler words next session.', when: '2d ago' }],
  302: [],
  102: [{ author: 'Coach', text: 'Approved — great emotional range in this take.', when: '1d ago' }],
};

function ApprovalBadge({ approval }: { approval: Approval }) {
  const map = {
    pending:  { c: AC.amber, bg: AC.amberBg, bdr: AC.amberBdr, label: 'Pending Review' },
    approved: { c: AC.green, bg: AC.greenBg, bdr: AC.greenBdr, label: 'Approved'        },
    changes:  { c: AC.red,   bg: AC.redBg,   bdr: AC.redBdr,   label: 'Changes Requested' },
  } as const;
  const m = map[approval];
  return <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full" style={{ background: m.bg, color: m.c, border: `1px solid ${m.bdr}` }}>{m.label}</span>;
}

export default function AuditionCoachReviewMode({ onNavigate: _onNavigate }: { onNavigate?: (id: string) => void }) {
  const { T } = useTheme();
  const [search,       setSearch]       = useState('');
  const [selStudent,   setSelStudent]   = useState(STUDENTS[0].id);
  const [selSubmission, setSelSubmission] = useState(STUDENTS[0].submissions[0]?.id ?? null);
  const [students,     setStudents]     = useState(STUDENTS);
  const [comments,     setComments]     = useState(INITIAL_COMMENTS);
  const [draft,        setDraft]        = useState('');

  const student    = students.find(s => s.id === selStudent) ?? students[0];
  const submission = student.submissions.find(s => s.id === selSubmission) ?? student.submissions[0];
  const pendingCount = (s: Student) => s.submissions.filter(x => x.approval === 'pending').length;
  const totalPending = students.reduce((a, s) => a + pendingCount(s), 0);

  const filteredStudents = students.filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()));

  const setApproval = (approval: Approval) => {
    if (!submission) return;
    setStudents(ss => ss.map(s => s.id !== student.id ? s : {
      ...s, submissions: s.submissions.map(sub => sub.id === submission.id ? { ...sub, approval } : sub),
    }));
  };

  const addComment = () => {
    if (!draft.trim() || !submission) return;
    setComments(c => ({ ...c, [submission.id]: [...(c[submission.id] ?? []), { author: 'Coach', text: draft.trim(), when: 'Just now' }] }));
    setDraft('');
  };

  return (
    <div className="flex-1 flex overflow-hidden" style={{ background: T.bg }}>

      {/* ── Student list ── */}
      <div className="w-[236px] shrink-0 flex flex-col" style={{ borderRight: `1px solid ${T.border}` }}>
        <div className="p-4 shrink-0" style={{ borderBottom: `1px solid ${T.border}` }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[13px] font-bold" style={{ color: T.text }}>Students</h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: AC.amberBg, color: AC.amber, border: `1px solid ${AC.amberBdr}` }}>
              {totalPending} pending
            </span>
          </div>
          <div className="flex items-center gap-2 px-2.5 py-2 rounded-xl" style={{ background: T.inputBg, border: `1px solid ${T.border}` }}>
            <Search className="w-3 h-3 shrink-0" style={{ color: T.textMuted }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students…"
              className="flex-1 text-[11.5px] bg-transparent outline-none" style={{ color: T.text }} />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2" style={{ scrollbarWidth: 'none' }}>
          {filteredStudents.map(s => {
            const active = s.id === selStudent;
            const pc = pendingCount(s);
            return (
              <button key={s.id}
                onClick={() => { setSelStudent(s.id); setSelSubmission(s.submissions[0]?.id ?? null); }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl cursor-pointer transition-all mb-1 text-left"
                style={active ? { background: AC.pinkBg, border: `1px solid ${AC.pinkBdr}` } : { border: '1px solid transparent' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10.5px] font-bold text-white shrink-0" style={{ background: `linear-gradient(135deg, ${AC.pink}, ${AC.violet})` }}>
                  {s.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold truncate" style={{ color: T.text }}>{s.name}</p>
                  <p className="text-[10px]" style={{ color: T.textMuted }}>Avg score {s.avgScore}</p>
                </div>
                {pc > 0 && <span className="text-[9.5px] font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: AC.amber, color: '#fff' }}>{pc}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Submissions list ── */}
      <div className="w-[268px] shrink-0 flex flex-col overflow-hidden" style={{ borderRight: `1px solid ${T.border}` }}>
        <div className="p-4 shrink-0" style={{ borderBottom: `1px solid ${T.border}` }}>
          <h3 className="text-[12.5px] font-bold" style={{ color: T.text }}>{student.name}&apos;s Submissions</h3>
          <p className="text-[10.5px]" style={{ color: T.textMuted }}>{student.submissions.length} total</p>
        </div>
        <div className="flex-1 overflow-y-auto p-2.5" style={{ scrollbarWidth: 'none' }}>
          {student.submissions.map(sub => {
            const active = sub.id === selSubmission;
            return (
              <button key={sub.id} onClick={() => setSelSubmission(sub.id)}
                className="w-full text-left p-3 rounded-xl cursor-pointer transition-all mb-2"
                style={active ? { background: T.bgSub, border: `1px solid ${AC.pinkBdr}` } : { background: T.bgSub, border: `1px solid ${T.border}` }}>
                <p className="text-[11.5px] font-semibold mb-1 truncate" style={{ color: T.text }}>{sub.title}</p>
                <p className="text-[10px] mb-2" style={{ color: T.textMuted }}>{sub.type} · {sub.date}</p>
                <div className="flex items-center justify-between">
                  <ApprovalBadge approval={sub.approval} />
                  <span className="text-[11px] font-bold" style={{ color: sub.score >= 80 ? AC.green : AC.amber }}>{sub.score}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Detailed review panel ── */}
      <div className="flex-1 overflow-y-auto p-6" style={{ scrollbarWidth: 'none' }}>
        {submission ? (
          <>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <div>
                <h2 className="text-[17px] font-bold" style={{ color: T.text }}>{submission.title}</h2>
                <p className="text-[11.5px]" style={{ color: T.textMuted }}>{submission.type} · {submission.date}</p>
              </div>
              <ApprovalBadge approval={submission.approval} />
            </div>

            <div className="relative rounded-2xl overflow-hidden mb-5" style={{ background: '#000', aspectRatio: '16/8' }}>
              <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-80">
                <source src="https://static.higgsfield.ai/seedance-2.0-v2/examples/3-mini.mp4" type="video/mp4" />
              </video>
            </div>

            {/* Performance summary */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[{ label: 'Confidence', pct: 82, icon: Smile }, { label: 'Voice', pct: 75, icon: Mic2 }, { label: 'Body Language', pct: 68, icon: PersonStanding }].map(m => (
                <div key={m.label} className="rounded-xl p-3.5" style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <m.icon className="w-3.5 h-3.5" style={{ color: AC.violet }} />
                    <span className="text-[10.5px] font-medium" style={{ color: T.textSub }}>{m.label}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: T.bgCard }}>
                    <div className="h-full rounded-full" style={{ width: `${m.pct}%`, background: AC.violet }} />
                  </div>
                  <span className="text-[11px] font-bold mt-1 block" style={{ color: T.text }}>{m.pct}%</span>
                </div>
              ))}
            </div>

            {/* Comment section */}
            <div className="rounded-2xl p-4 mb-5" style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
              <h4 className="text-[11px] font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5" style={{ color: T.textMuted }}>
                <MessageCircle className="w-3.5 h-3.5" /> Coach Comments
              </h4>
              <div className="space-y-2.5 mb-3">
                {(comments[submission.id] ?? []).length === 0 ? (
                  <p className="text-[11px]" style={{ color: T.textMuted }}>No comments yet — add feedback below.</p>
                ) : (comments[submission.id] ?? []).map((c, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0" style={{ background: AC.violet }}>C</div>
                    <div>
                      <p className="text-[11.5px] leading-relaxed" style={{ color: T.textSub }}>{c.text}</p>
                      <p className="text-[9.5px] mt-0.5" style={{ color: T.textMuted }}>{c.when}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') addComment(); }}
                  placeholder="Add a comment for this student…"
                  className="flex-1 px-3 py-2 rounded-xl text-[11.5px] outline-none" style={{ background: T.inputBg, border: `1px solid ${T.border}`, color: T.text }} />
                <button onClick={addComment} className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 cursor-pointer text-white"
                  style={{ background: `linear-gradient(135deg, ${AC.pink}, ${AC.violet})` }}>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Approval actions */}
            <div className="flex items-center gap-2.5">
              <button onClick={() => setApproval('approved')}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[12px] font-semibold cursor-pointer transition-colors"
                style={submission.approval === 'approved' ? { background: AC.green, color: '#fff' } : { background: AC.greenBg, color: AC.green, border: `1px solid ${AC.greenBdr}` }}>
                <ThumbsUp className="w-3.5 h-3.5" /> Approve
              </button>
              <button onClick={() => setApproval('changes')}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[12px] font-semibold cursor-pointer transition-colors"
                style={submission.approval === 'changes' ? { background: AC.red, color: '#fff' } : { background: AC.redBg, color: AC.red, border: `1px solid ${AC.redBdr}` }}>
                <AlertCircle className="w-3.5 h-3.5" /> Request Changes
              </button>
              <button onClick={() => setApproval('pending')}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[12px] font-semibold cursor-pointer transition-colors"
                style={{ background: T.bgCard, color: T.textSub, border: `1px solid ${T.border}` }}>
                <RotateCcw className="w-3.5 h-3.5" /> Mark Pending
              </button>
              {submission.approval === 'approved' && (
                <span className="flex items-center gap-1 text-[11px] font-semibold ml-1" style={{ color: AC.green }}>
                  <CheckCircle2 className="w-3.5 h-3.5" /> Reviewed
                </span>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Star className="w-8 h-8 mb-3" style={{ color: T.textMuted }} />
            <p className="text-[12.5px]" style={{ color: T.textMuted }}>Select a submission to begin reviewing.</p>
          </div>
        )}
      </div>
    </div>
  );
}
