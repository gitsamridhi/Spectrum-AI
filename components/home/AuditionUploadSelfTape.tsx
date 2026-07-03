'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload, Camera, Film, CheckCircle2, Lightbulb, Volume2,
  Frame, Eye, Sparkles, Trash2, Play, Pause, Circle, Check,
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

const AC = {
  pink: '#EC4899', pinkBg: 'rgba(236,72,153,0.10)', pinkBdr: 'rgba(236,72,153,0.28)',
  violet: '#A855F7', violetBg: 'rgba(168,85,247,0.10)', violetBdr: 'rgba(168,85,247,0.28)',
  amber: '#F59E0B', amberBg: 'rgba(245,158,11,0.10)', amberBdr: 'rgba(245,158,11,0.28)',
  green: '#10B981', greenBg: 'rgba(16,185,129,0.10)', greenBdr: 'rgba(16,185,129,0.28)',
};

const GUIDELINES = [
  { icon: Lightbulb, title: 'Lighting',   text: 'Face a window or soft light source — avoid strong backlight.' },
  { icon: Frame,      title: 'Framing',    text: 'Center yourself, waist-up, with headroom above your head.'     },
  { icon: Volume2,    title: 'Sound',      text: 'Record somewhere quiet; use an external mic if you have one.'  },
  { icon: Eye,        title: 'Eye line',   text: 'Look just beside the lens, not directly into the camera.'      },
];

const TIPS = [
  'Slate your name, category, and take number before you begin.',
  'Leave 2 seconds of silence before and after your performance.',
  'Keep your camera steady — use a tripod or stable surface.',
  'Re-record if you hear background noise or the framing shifts.',
];

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDuration(sec: number) {
  const m = Math.floor(sec / 60), s = Math.round(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

interface UploadedFile { name: string; size: number; url: string; duration: number | null }

export default function AuditionUploadSelfTape({ onNavigate }: { onNavigate?: (id: string) => void }) {
  const { T } = useTheme();
  const [mode,      setMode]      = useState<'upload' | 'record'>('upload');
  const [dragOver,  setDragOver]  = useState(false);
  const [file,      setFile]      = useState<UploadedFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [recording, setRecording] = useState(false);
  const [recSeconds, setRecSeconds] = useState(0);
  const [draftSaved, setDraftSaved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!recording) return;
    const id = setInterval(() => setRecSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [recording]);

  const ingestFile = useCallback((f: File) => {
    const url = URL.createObjectURL(f);
    setFile({ name: f.name, size: f.size, url, duration: null });
    setUploading(true); setProgress(0);
    const iv = setInterval(() => setProgress(p => {
      if (p >= 100) { clearInterval(iv); return 100; }
      return Math.min(100, p + Math.random() * 18 + 6);
    }), 180);
    setTimeout(() => { setUploading(false); }, 1600);
  }, []);

  const handleBrowse = () => inputRef.current?.click();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (f) ingestFile(f);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files?.[0]; if (f) ingestFile(f);
  };
  const clearFile = () => { if (file) URL.revokeObjectURL(file.url); setFile(null); setProgress(0); };

  const canAnalyze = (!!file && !uploading) || (mode === 'record' && recSeconds > 0 && !recording);

  const handleSaveDraft = () => {
    if (!canAnalyze) return;
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 1800);
  };

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: T.bg, scrollbarWidth: 'none' }}>
      <div className="px-8 pt-7 pb-6">

        <div className="flex items-center justify-between mb-1">
          <h1 className="text-[22px] font-black tracking-[-0.02em]" style={{ color: T.text }}>Upload your self-tape</h1>
          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: T.bgCard, border: `1px solid ${T.border}` }}>
            {(['upload', 'record'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className="px-3.5 py-1.5 rounded-lg text-[11.5px] font-semibold cursor-pointer transition-all flex items-center gap-1.5"
                style={mode === m ? { background: AC.pink, color: '#fff' } : { color: T.textSub }}>
                {m === 'upload' ? <Upload className="w-3 h-3" /> : <Camera className="w-3 h-3" />}
                {m === 'upload' ? 'Upload File' : 'Record with Camera'}
              </button>
            ))}
          </div>
        </div>
        <p className="text-[12px] mb-6" style={{ color: T.textMuted }}>Submit a take for AI coaching feedback on delivery, voice, and body language.</p>

        <div className="grid grid-cols-3 gap-6">
          {/* ── Main workspace ── */}
          <div className="col-span-2">
            {mode === 'upload' ? (
              file ? (
                <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${T.border}`, background: T.bgSub }}>
                  <div className="relative bg-black" style={{ aspectRatio: '16/9' }}>
                    <video src={file.url} controls className="absolute inset-0 w-full h-full object-contain"
                      onLoadedMetadata={e => setFile(f => f ? { ...f, duration: e.currentTarget.duration } : f)} />
                  </div>
                  <div className="p-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: AC.pinkBg }}>
                      <Film className="w-4 h-4" style={{ color: AC.pink }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12.5px] font-semibold truncate" style={{ color: T.text }}>{file.name}</p>
                      <p className="text-[10.5px]" style={{ color: T.textMuted }}>
                        {formatBytes(file.size)}{file.duration ? ` · ${formatDuration(file.duration)}` : ''}
                      </p>
                    </div>
                    {uploading ? (
                      <span className="text-[11px] font-bold" style={{ color: AC.pink }}>{Math.round(progress)}%</span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-bold" style={{ color: AC.green }}>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                      </span>
                    )}
                    <button onClick={clearFile} className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors shrink-0" style={{ color: T.textMuted }}
                      onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {uploading && (
                    <div className="px-4 pb-4">
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: T.bgCard }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${AC.pink}, ${AC.violet})` }} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={handleBrowse}
                  className="rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
                  style={{
                    minHeight: 380, border: `2px dashed ${dragOver ? AC.pink : T.border}`,
                    background: dragOver ? AC.pinkBg : T.bgSub,
                  }}>
                  <input ref={inputRef} type="file" accept="video/*" className="hidden" onChange={handleInputChange} />
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: AC.pinkBg }}>
                    <Upload className="w-7 h-7" style={{ color: AC.pink }} />
                  </div>
                  <p className="text-[14px] font-bold mb-1.5" style={{ color: T.text }}>Drag & drop your video here</p>
                  <p className="text-[11.5px] mb-5" style={{ color: T.textMuted }}>MP4, MOV, or WEBM up to 500MB</p>
                  <button onClick={e => { e.stopPropagation(); handleBrowse(); }}
                    className="px-5 py-2.5 rounded-xl text-[12px] font-bold text-white cursor-pointer hover:opacity-90 transition-opacity"
                    style={{ background: `linear-gradient(135deg, ${AC.pink}, ${AC.violet})` }}>
                    Browse Files
                  </button>
                </div>
              )
            ) : (
              <div className="rounded-2xl overflow-hidden relative" style={{ minHeight: 380, background: '#0c0c0f', border: `1px solid ${T.border}` }}>
                <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-70">
                  <source src="https://static.higgsfield.ai/seedance-2.0-v2/examples/2-mini.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.55))' }} />
                {recording && (
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: 'rgba(0,0,0,0.55)' }}>
                    <Circle className="w-2 h-2 fill-red-500 text-red-500 animate-pulse" />
                    <span className="text-[11px] font-bold text-white">{formatDuration(recSeconds)}</span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center pb-6">
                  <button onClick={() => setRecording(r => !r)}
                    className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-105"
                    style={{ background: recording ? '#fff' : AC.pink, border: '3px solid rgba(255,255,255,0.5)' }}>
                    {recording ? <Pause className="w-5 h-5 text-zinc-900" /> : <Play className="w-5 h-5 fill-current text-white translate-x-0.5" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Right sidebar: guidelines + tips ── */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl p-4" style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
              <h4 className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: T.textMuted }}>Recording Guidelines</h4>
              <div className="space-y-3">
                {GUIDELINES.map(g => (
                  <div key={g.title} className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: AC.violetBg }}>
                      <g.icon className="w-3.5 h-3.5" style={{ color: AC.violet }} />
                    </div>
                    <div>
                      <p className="text-[11.5px] font-semibold" style={{ color: T.text }}>{g.title}</p>
                      <p className="text-[10.5px] leading-relaxed" style={{ color: T.textMuted }}>{g.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-4" style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
              <h4 className="text-[11px] font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5" style={{ color: T.textMuted }}>
                <Sparkles className="w-3 h-3" style={{ color: AC.amber }} /> Tips
              </h4>
              <ul className="space-y-2">
                {TIPS.map((t, i) => (
                  <li key={i} className="text-[10.5px] leading-relaxed flex items-start gap-1.5" style={{ color: T.textSub }}>
                    <span className="mt-1 w-1 h-1 rounded-full shrink-0" style={{ background: AC.pink }} />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom actions ── */}
      <div className="sticky bottom-0 flex items-center justify-end gap-2.5 px-8 py-4" style={{ background: T.bg, borderTop: `1px solid ${T.border}` }}>
        <button onClick={() => { clearFile(); setRecSeconds(0); setRecording(false); }}
          className="px-4 py-2.5 rounded-xl text-[12px] font-semibold cursor-pointer transition-colors"
          style={{ background: T.bgCard, color: T.textSub, border: `1px solid ${T.border}` }}>
          Cancel
        </button>
        <button disabled={!canAnalyze} onClick={handleSaveDraft}
          className="px-4 py-2.5 rounded-xl text-[12px] font-semibold cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
          style={draftSaved ? { background: AC.greenBg, color: AC.green, border: `1px solid ${AC.greenBdr}` } : { background: T.bgCard, color: T.textSub, border: `1px solid ${T.border}` }}>
          {draftSaved && <Check className="w-3.5 h-3.5" />} {draftSaved ? 'Draft Saved' : 'Save Draft'}
        </button>
        <button disabled={!canAnalyze} onClick={() => onNavigate?.('feedback')}
          className="px-5 py-2.5 rounded-xl text-[12px] font-bold text-white cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: `linear-gradient(135deg, ${AC.pink}, ${AC.violet})` }}>
          Analyze
        </button>
      </div>
    </div>
  );
}
