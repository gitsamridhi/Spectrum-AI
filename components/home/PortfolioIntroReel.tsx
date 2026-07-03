'use client';

import React, { useState, useRef } from 'react';
import {
  Play, Pause, SkipBack, SkipForward, Volume2,
  Plus, Scissors, Music, Clock, Download, Layers, Check,
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

const PA = {
  blue:'#EC4899',blueBg:'rgba(236,72,153,0.10)',blueBdr:'rgba(236,72,153,0.28)',
  teal:'#A855F7',tealBg:'rgba(168,85,247,0.10)',tealBdr:'rgba(168,85,247,0.28)',
  amber:'#F59E0B',amberBg:'rgba(245,158,11,0.10)',amberBdr:'rgba(245,158,11,0.28)',
};

const CLIP_LIBRARY = [
  { id:1, src:'/portfolio_h1.jpg', label:'Model Headshot · Studio', dur:'0:04' },
  { id:2, src:'/portfolio_h2.jpg', label:'Fashion Editorial · FW',  dur:'0:06' },
  { id:3, src:'/portfolio_h3.jpg', label:'High Fashion Campaign',   dur:'0:05' },
  { id:4, src:'/portfolio_h4.jpg', label:'Editorial · Spring',      dur:'0:03' },
];

const TEMPLATES = ['Cinematic Opener','Brand Story','Agency Reel','Custom'];
const MUSIC_TRACKS = ['Ambient Cinematic — 120 BPM','Uplifting Corporate — 128 BPM','Moody Piano — 90 BPM','Editorial Pulse — 110 BPM'];

interface Clip { id: number; src: string; label: string; dur: string; color: string; }

const COLORS = [PA.blue, PA.teal, PA.amber, '#8B5CF6'];

const INIT_TIMELINE: Clip[] = [
  { ...CLIP_LIBRARY[0], color: COLORS[0] },
  { ...CLIP_LIBRARY[2], color: COLORS[2] },
  { ...CLIP_LIBRARY[1], color: COLORS[1] },
];

type ReelMode = 'timeline' | 'storyboard';

export default function PortfolioIntroReel() {
  const { T, isDark } = useTheme();
  const [playing,   setPlaying]   = useState(false);
  const [progress,  setProgress]  = useState(22);
  const [mode,      setMode]      = useState<ReelMode>('timeline');
  const [timeline,  setTimeline]  = useState<Clip[]>(INIT_TIMELINE);
  const [template,  setTemplate]  = useState(0);
  const [caption,   setCaption]   = useState('Sarah Chen · Fashion Model · New York');
  const [music,     setMusic]     = useState('Ambient Cinematic — 120 BPM');
  const [musicPickerOpen, setMusicPickerOpen] = useState(false);
  const [clipLibrary, setClipLibrary] = useState(CLIP_LIBRARY);
  const [currentClipIndex, setCurrentClipIndex] = useState(0);
  const [volume, setVolume] = useState(70);
  const [exported, setExported] = useState(false);
  const dragging = useRef<number | null>(null);
  const dragOver = useRef<number | null>(null);
  const volumeBarRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addClip = (clip: typeof CLIP_LIBRARY[0]) => {
    const color = COLORS[timeline.length % COLORS.length];
    setTimeline(tl => [...tl, { ...clip, color }]);
  };

  const removeClip = (idx: number) =>
    setTimeline(tl => {
      const next = tl.filter((_, i) => i !== idx);
      setCurrentClipIndex(ci => Math.min(ci, Math.max(0, next.length - 1)));
      return next;
    });

  const goToClip = (dir: -1 | 1) =>
    setCurrentClipIndex(i => Math.max(0, Math.min(timeline.length - 1, i + dir)));

  const splitClip = () => {
    setTimeline(tl => {
      const clip = tl[currentClipIndex];
      if (!clip) return tl;
      const [m, s] = clip.dur.split(':').map(Number);
      const totalSec = Math.max(2, m * 60 + s);
      const half = Math.floor(totalSec / 2);
      const fmt = (sec: number) => `0:${String(sec).padStart(2, '0')}`;
      const partA: Clip = { ...clip, dur: fmt(half) };
      const partB: Clip = { ...clip, id: Date.now(), dur: fmt(totalSec - half) };
      const next = [...tl];
      next.splice(currentClipIndex, 1, partA, partB);
      return next;
    });
  };

  const handleImportClip = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const newClips = files.map((f, i) => ({
      id: Date.now() + i, src: URL.createObjectURL(f), label: f.name.replace(/\.[^.]+$/, ''), dur: '0:04',
    }));
    setClipLibrary(lib => [...newClips, ...lib]);
    e.target.value = '';
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = volumeBarRef.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = Math.round(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * 100);
    setVolume(pct);
  };

  const handleExport = () => {
    const summary = `Reel export\nTemplate: ${TEMPLATES[template]}\nCaption: ${caption}\nMusic: ${music}\nDuration: ${totalLabel}\nClips:\n${timeline.map((c, i) => `${i + 1}. ${c.label} (${c.dur})`).join('\n')}`;
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'intro-reel-export.txt'; a.click();
    URL.revokeObjectURL(url);
    setExported(true); setTimeout(() => setExported(false), 1800);
  };

  const onDrop = () => {
    if (dragging.current === null || dragOver.current === null) return;
    const from = dragging.current, to = dragOver.current;
    if (from !== to) {
      setTimeline(tl => {
        const arr = [...tl];
        const [el] = arr.splice(from, 1);
        arr.splice(to, 0, el);
        return arr;
      });
    }
    dragging.current = null; dragOver.current = null;
  };

  const totalDur = timeline.reduce((acc, c) => {
    const [m, s] = c.dur.split(':').map(Number);
    return acc + m * 60 + s;
  }, 0);
  const totalLabel = `0:${String(totalDur).padStart(2, '0')}`;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">

      {/* Top toolbar */}
      <div className="shrink-0 h-11 flex items-center px-5 gap-3"
        style={{ borderBottom: `1px solid ${T.border}`, background: T.bg }}>
        <div className="flex items-center gap-0.5 p-0.5 rounded-lg" style={{ background: T.bgCard }}>
          {(['timeline','storyboard'] as ReelMode[]).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className="px-3 py-1.5 rounded-md text-[11px] font-medium cursor-pointer capitalize transition-all"
              style={mode === m
                ? { background: T.bg, color: T.text, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }
                : { color: T.textMuted }}>
              {m}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 ml-2">
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
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-[11px] font-semibold" style={{ color: T.textMuted }}>
            <Clock className="w-3 h-3 inline mr-1" />{totalLabel}
          </span>
          <button onClick={handleExport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[11.5px] font-semibold text-white cursor-pointer hover:opacity-90"
            style={{ background: exported ? PA.teal : 'linear-gradient(135deg, #EC4899, #A855F7)', boxShadow: '0 0 16px rgba(236,72,153,0.28)' }}>
            {exported ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}{exported ? 'Exported' : 'Export Reel'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">

        {/* ── Left: Clip Library ── */}
        <div className="w-[190px] shrink-0 flex flex-col"
          style={{ borderRight: `1px solid ${T.border}`, background: T.bgSub }}>
          <div className="px-4 pt-4 pb-2 flex items-center justify-between shrink-0">
            <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: T.textMuted }}>Clip Library</p>
            <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleImportClip} />
            <button onClick={() => fileInputRef.current?.click()} title="Import clip" className="cursor-pointer" style={{ color: T.textMuted }}><Plus className="w-3 h-3" /></button>
          </div>
          <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-2" style={{ scrollbarWidth: 'none' }}>
            {clipLibrary.map(clip => (
              <div key={clip.id} className="group relative rounded-xl overflow-hidden cursor-pointer"
                style={{ aspectRatio: '16/9', background: T.bgCard }}
                onClick={() => addClip(clip)}>
                <img src={clip.src} alt="" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <p className="text-[9px] font-semibold text-white leading-tight opacity-0 group-hover:opacity-100 transition-opacity">{clip.label}</p>
                </div>
                <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[8px] font-bold text-white"
                  style={{ background: 'rgba(0,0,0,0.55)' }}>{clip.dur}</span>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center">
                    <Plus className="w-3.5 h-3.5 text-black" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Center: Preview + Timeline ── */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {mode === 'timeline' ? (
            <>
              {/* Preview player */}
              <div className="flex-1 flex items-center justify-center px-8 py-6"
                style={{ background: T.bgSub }}>
                <div className="relative overflow-hidden shadow-xl"
                  style={{ height: '100%', maxHeight: 380, aspectRatio: '9/16', width: 'auto', background: '#0a0a0d', borderRadius: 22 }}>
                  {timeline.length > 0 && (
                    <img src={timeline[Math.min(currentClipIndex, timeline.length - 1)].src} alt="" className="absolute inset-0 w-full h-full object-cover opacity-90" />
                  )}
                  {/* Caption overlay */}
                  <div className="absolute bottom-0 left-0 right-0 px-6 py-4 flex flex-col gap-1"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)' }}>
                    <p className="text-[13px] font-bold text-white">{caption}</p>
                  </div>
                  {/* Progress bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5">
                    <div className="h-full" style={{ width: `${progress}%`, background: 'linear-gradient(135deg, #EC4899, #A855F7)', boxShadow: '0 0 16px rgba(236,72,153,0.28)' }} />
                  </div>
                </div>
              </div>

              {/* Transport controls */}
              <div className="shrink-0 flex items-center justify-center gap-3 py-2.5"
                style={{ borderTop: `1px solid ${T.border}`, background: T.bg }}>
                <button onClick={() => goToClip(-1)} disabled={currentClipIndex <= 0}
                  className="cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed" style={{ color: T.textMuted }}>
                  <SkipBack className="w-4 h-4" />
                </button>
                <button onClick={() => setPlaying(p => !p)}
                  className="w-9 h-9 flex items-center justify-center rounded-full cursor-pointer"
                  style={{ background: T.text, color: T.bg }}>
                  {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <button onClick={() => goToClip(1)} disabled={currentClipIndex >= timeline.length - 1}
                  className="cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed" style={{ color: T.textMuted }}>
                  <SkipForward className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2 ml-4">
                  <Volume2 className="w-3.5 h-3.5" style={{ color: T.textMuted }} />
                  <div ref={volumeBarRef} onClick={handleVolumeClick} className="w-20 h-1 rounded-full overflow-hidden cursor-pointer" style={{ background: T.bgCard }}>
                    <div className="h-full rounded-full" style={{ width: `${volume}%`, background: T.textMuted }} />
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="shrink-0" style={{ borderTop: `1px solid ${T.border}`, background: T.bgSub }}>
                {/* Track labels */}
                <div className="flex items-center gap-2 px-4 pt-3 pb-2">
                  <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: T.textMuted }}>Timeline</p>
                  <div className="flex items-center gap-1 ml-auto">
                    <button onClick={splitClip} disabled={timeline.length === 0} title="Split clip at playhead"
                      className="cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed" style={{ color: T.textMuted }}>
                      <Scissors className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Clip track */}
                <div className="px-4 pb-2">
                  <div className="text-[8.5px] font-semibold uppercase tracking-widest mb-1.5 flex items-center gap-1" style={{ color: T.textMuted }}>
                    <Layers className="w-2.5 h-2.5" />Video
                  </div>
                  <div className="flex items-stretch gap-0.5 h-10 relative"
                    style={{ background: T.bgCard, borderRadius: 8, padding: '2px', overflow: 'hidden' }}>
                    {/* Timeline ruler ticks */}
                    {Array.from({length: 20}).map((_, i) => (
                      <div key={i} className="absolute top-0 bottom-0 w-px opacity-20"
                        style={{ left: `${i * 5}%`, background: T.text }} />
                    ))}
                    {/* Playhead */}
                    <div className="absolute top-0 bottom-0 w-0.5 z-10" style={{ left: `${progress}%`, background: 'linear-gradient(135deg, #EC4899, #A855F7)', boxShadow: '0 0 16px rgba(236,72,153,0.28)' }} />
                    {timeline.map((clip, i) => (
                      <div key={`${clip.id}-${i}`}
                        draggable
                        onDragStart={() => { dragging.current = i; }}
                        onDragOver={e => { e.preventDefault(); dragOver.current = i; }}
                        onDrop={onDrop}
                        className="h-full rounded flex items-center px-2 cursor-grab relative group"
                        style={{
                          flex: clip.dur === '0:06' ? 3 : clip.dur === '0:05' ? 2.5 : 2,
                          background: clip.color + '30',
                          border: `1px solid ${clip.color}55`,
                          minWidth: 0,
                        }}>
                        <p className="text-[9px] font-semibold truncate" style={{ color: clip.color }}>{clip.label}</p>
                        <button
                          onClick={() => removeClip(i)}
                          className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 w-4 h-4 flex items-center justify-center rounded"
                          style={{ background: T.bg }}>
                          <span className="text-[9px]" style={{ color: T.textMuted }}>×</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Music track */}
                <div className="px-4 pb-3 relative">
                  <div className="text-[8.5px] font-semibold uppercase tracking-widest mb-1.5 flex items-center gap-1" style={{ color: T.textMuted }}>
                    <Music className="w-2.5 h-2.5" />Music
                  </div>
                  <div onClick={() => setMusicPickerOpen(o => !o)} className="h-6 rounded flex items-center px-3 cursor-pointer"
                    style={{ background: PA.teal + '20', border: `1px solid ${PA.teal}40` }}>
                    <p className="text-[9px] font-semibold" style={{ color: PA.teal }}>{music}</p>
                  </div>
                  {musicPickerOpen && (
                    <div className="absolute left-4 right-4 bottom-full mb-1 rounded-xl overflow-hidden z-20 shadow-lg"
                      style={{ background: T.bg, border: `1px solid ${T.border}` }}>
                      {MUSIC_TRACKS.map(t => (
                        <button key={t} onClick={() => { setMusic(t); setMusicPickerOpen(false); }}
                          className="w-full text-left px-3 py-2 text-[10.5px] cursor-pointer transition-colors"
                          style={t === music ? { background: PA.tealBg, color: PA.teal } : { color: T.textSub }}
                          onMouseEnter={e => { if (t !== music) e.currentTarget.style.background = T.bgHover; }}
                          onMouseLeave={e => { if (t !== music) e.currentTarget.style.background = 'transparent'; }}>
                          {t}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Caption track */}
                <div className="px-4 pb-3">
                  <div className="text-[8.5px] font-semibold uppercase tracking-widest mb-1.5 flex items-center gap-1" style={{ color: T.textMuted }}>
                    <span style={{ color: T.textMuted }}>T</span> Caption
                  </div>
                  <input value={caption} onChange={e => setCaption(e.target.value)}
                    className="w-full px-3 py-1.5 rounded text-[11px] outline-none"
                    style={{ background: PA.amber + '15', border: `1px solid ${PA.amber}40`, color: T.text }} />
                </div>
              </div>
            </>
          ) : (
            /* Storyboard mode */
            <div className="flex-1 overflow-y-auto px-6 py-5" style={{ scrollbarWidth: 'none' }}>
              <div className="flex items-start gap-4 flex-wrap">
                {timeline.map((clip, i) => (
                  <div key={`${clip.id}-${i}`} className="flex flex-col items-center gap-2">
                    <div className="relative group rounded-xl overflow-hidden cursor-pointer"
                      style={{ width: 160, aspectRatio: '16/9', background: T.bgCard, border: `2px solid ${clip.color}40` }}>
                      <img src={clip.src} alt="" className="w-full h-full object-cover" />
                      <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded text-[8px] font-bold text-white"
                        style={{ background: 'rgba(0,0,0,0.6)' }}>{clip.dur}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
                        style={{ background: clip.color, color: '#fff' }}>{i + 1}</div>
                      <p className="text-[10px] font-medium max-w-[130px] truncate" style={{ color: T.textSub }}>{clip.label}</p>
                    </div>
                    {i < timeline.length - 1 && (
                      <div className="hidden" />
                    )}
                  </div>
                ))}
                <button onClick={() => addClip(clipLibrary[timeline.length % clipLibrary.length])}
                  className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed cursor-pointer transition-colors"
                  style={{ width: 160, aspectRatio: '16/9', borderColor: T.border, color: T.textMuted }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = PA.blue)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = T.border)}>
                  <Plus className="w-5 h-5" />
                  <span className="text-[10px] font-medium">Add Scene</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
