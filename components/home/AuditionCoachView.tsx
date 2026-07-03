'use client';

import React, { useState } from 'react';
import {
  ChevronLeft, LayoutDashboard, ListChecks, Upload, Video, Crown,
  BarChart2, FileText, AudioLines, PersonStanding, Mic,
  CalendarCheck, LineChart, Table2, Users, Sparkles, Layers,
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';
import AuditionCoachHome         from './AuditionCoachHome';
import AuditionPracticePlan      from './AuditionPracticePlan';
import AuditionPracticeSelection from './AuditionPracticeSelection';
import AuditionUploadSelfTape    from './AuditionUploadSelfTape';
import AuditionLiveMockInterview from './AuditionLiveMockInterview';
import AuditionPageantPractice   from './AuditionPageantPractice';
import AuditionProgressHistory   from './AuditionProgressHistory';
import AuditionSessionHistory    from './AuditionSessionHistory';
import AuditionRecommendations   from './AuditionRecommendations';
import AuditionFeedbackReport    from './AuditionFeedbackReport';
import AuditionTranscriptViewer  from './AuditionTranscriptViewer';
import AuditionVoiceFeedback     from './AuditionVoiceFeedback';
import AuditionBodyLanguageReport from './AuditionBodyLanguageReport';
import AuditionCoachReviewMode   from './AuditionCoachReviewMode';
import AuditionComponentLibrary  from './AuditionComponentLibrary';

const AC = { pink: '#EC4899', pinkBg: 'rgba(236,72,153,0.10)', pinkBdr: 'rgba(236,72,153,0.28)', violet: '#A855F7' };

type ViewId =
  | 'home' | 'plan' | 'selection' | 'upload'
  | 'interview' | 'pageant'
  | 'progress' | 'sessions' | 'recommendations'
  | 'feedback' | 'transcript' | 'voice' | 'body'
  | 'coach' | 'components';

const NAV_GROUPS: { label: string; items: { id: ViewId; icon: React.ElementType; label: string }[] }[] = [
  {
    label: 'Practice',
    items: [
      { id: 'home',      icon: LayoutDashboard, label: 'Home'              },
      { id: 'plan',      icon: CalendarCheck,   label: 'Practice Plan'     },
      { id: 'selection', icon: ListChecks,      label: 'Practice Selection' },
      { id: 'upload',    icon: Upload,          label: 'Upload Self-Tape'  },
    ],
  },
  {
    label: 'Live Coaching',
    items: [
      { id: 'interview', icon: Video, label: 'Mock Interview'  },
      { id: 'pageant',   icon: Crown, label: 'Pageant Practice' },
    ],
  },
  {
    label: 'Progress',
    items: [
      { id: 'progress',        icon: LineChart, label: 'Progress History' },
      { id: 'sessions',        icon: Table2,    label: 'Session History'  },
      { id: 'recommendations', icon: Sparkles,  label: 'Recommendations'  },
    ],
  },
  {
    label: 'Reports',
    items: [
      { id: 'feedback',   icon: BarChart2,      label: 'Feedback Report'  },
      { id: 'transcript', icon: FileText,       label: 'Transcript'       },
      { id: 'voice',      icon: AudioLines,      label: 'Voice Feedback'   },
      { id: 'body',       icon: PersonStanding,  label: 'Body Language'    },
    ],
  },
  {
    label: 'Coaching',
    items: [
      { id: 'coach', icon: Users, label: 'Coach Review Mode' },
    ],
  },
  {
    label: 'System',
    items: [
      { id: 'components', icon: Layers, label: 'Component Library' },
    ],
  },
];

export default function AuditionCoachView({ onBack }: { onBack?: () => void }) {
  const { T } = useTheme();
  const [view, setView] = useState<ViewId>('home');
  const navigate = (id: string) => setView(id as ViewId);

  return (
    <div className="flex-1 flex overflow-hidden" style={{ background: T.bg }}>

      {/* ── Left sub-nav ── */}
      <div className="w-[178px] shrink-0 flex flex-col" style={{ borderRight: `1px solid ${T.border}`, background: T.bgSub }}>

        {/* Brand strip */}
        <div className="shrink-0 flex items-center gap-2 px-3 h-12" style={{ borderBottom: `1px solid ${T.border}` }}>
          {onBack && (
            <button onClick={onBack}
              className="w-6 h-6 flex items-center justify-center rounded-lg shrink-0 cursor-pointer transition-all"
              style={{ color: T.textMuted }}
              onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}
          <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.20), rgba(168,85,247,0.18))', border: `1px solid ${AC.pinkBdr}` }}>
            <Mic className="w-3.5 h-3.5" style={{ color: AC.pink }} />
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-bold tracking-[-0.02em] leading-tight" style={{ color: T.text }}>Audition Coach</p>
            <p className="text-[9.5px] font-semibold leading-tight" style={{ background: `linear-gradient(90deg, ${AC.pink}, ${AC.violet})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              AI performance coaching
            </p>
          </div>
        </div>

        {/* Nav groups */}
        <div className="flex-1 overflow-y-auto py-3 px-2" style={{ scrollbarWidth: 'none' }}>
          {NAV_GROUPS.map(group => (
            <div key={group.label} className="mb-4">
              <p className="text-[8.5px] font-bold uppercase tracking-widest px-2 mb-1" style={{ color: T.textMuted }}>{group.label}</p>
              {group.items.map(item => {
                const Icon = item.icon;
                const active = view === item.id;
                return (
                  <button key={item.id} onClick={() => setView(item.id)}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left cursor-pointer transition-all mb-0.5"
                    style={active
                      ? { background: 'linear-gradient(135deg, rgba(236,72,153,0.14) 0%, rgba(168,85,247,0.11) 100%)', color: AC.pink, border: `1px solid ${AC.pinkBdr}`, borderLeft: `2px solid ${AC.pink}` }
                      : { color: T.textSub }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.background = T.bgHover; }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
                    <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: active ? AC.pink : T.textMuted }} />
                    <span className="text-[11.5px] font-medium truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Quick start */}
        <div className="shrink-0 p-3" style={{ borderTop: `1px solid ${T.border}` }}>
          <button onClick={() => setView('selection')}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-semibold text-white cursor-pointer hover:opacity-90 transition-opacity"
            style={{ background: `linear-gradient(135deg, ${AC.pink}, ${AC.violet})`, boxShadow: '0 0 18px rgba(236,72,153,0.28)' }}>
            <Video className="w-3 h-3" /> New Practice Session
          </button>
        </div>
      </div>

      {/* ── Content area ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {view === 'home'            && <AuditionCoachHome onNavigate={navigate} />}
        {view === 'plan'            && <AuditionPracticePlan onNavigate={navigate} />}
        {view === 'selection'       && <AuditionPracticeSelection onNavigate={navigate} />}
        {view === 'upload'          && <AuditionUploadSelfTape onNavigate={navigate} />}
        {view === 'interview'       && <AuditionLiveMockInterview onNavigate={navigate} />}
        {view === 'pageant'         && <AuditionPageantPractice onNavigate={navigate} />}
        {view === 'progress'        && <AuditionProgressHistory onNavigate={navigate} />}
        {view === 'sessions'        && <AuditionSessionHistory onNavigate={navigate} />}
        {view === 'recommendations' && <AuditionRecommendations onNavigate={navigate} />}
        {view === 'feedback'        && <AuditionFeedbackReport onNavigate={navigate} />}
        {view === 'transcript'      && <AuditionTranscriptViewer onNavigate={navigate} />}
        {view === 'voice'           && <AuditionVoiceFeedback onNavigate={navigate} />}
        {view === 'body'            && <AuditionBodyLanguageReport onNavigate={navigate} />}
        {view === 'coach'           && <AuditionCoachReviewMode onNavigate={navigate} />}
        {view === 'components'      && <AuditionComponentLibrary onNavigate={navigate} />}
      </div>

    </div>
  );
}
