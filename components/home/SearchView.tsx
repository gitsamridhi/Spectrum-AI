'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, X, SlidersHorizontal, Wand2, ArrowRight, Sparkles } from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

const P = {
  vivid: '#FF7000', magenta: '#F060EE', orange: '#FFB347',
  peach: '#FFBF80', hotPink: '#FF2D6B', coral: '#FF6B86',
};

const FILTERS  = ['All', 'Images', 'Videos', 'Templates', 'Flows', 'Community'];
const HF = 'https://static.higgsfield.ai';
const RESULTS = [
  { videoSrc: `${HF}/ai-video-v2/example-2-mini.mp4`,        title: 'Portrait enhance · 4×',       type: 'Image',    prompt: 'cinematic portrait, golden hour, 35mm, Fujifilm grain',      model: 'Seedance 2.0',  seed: '4829301', ratio: '3:2' },
  { videoSrc: `${HF}/seedance-2.0-v2/examples/1-mini.mp4`,   title: 'Landscape cinematic upscale',  type: 'Image',    prompt: 'aerial establishing shot, megacity at dusk, ARRI Alexa',     model: 'Seedance 2.0',  seed: '7731044', ratio: '16:9' },
  { videoSrc: `${HF}/ai-video-v2/example-4-mini.mp4`,        title: 'Product clean-up flow',        type: 'Flow',     prompt: 'macro product photography, studio chrome lighting, 8K',      model: 'Seedance 2.0',  seed: '2290811', ratio: '1:1' },
  { videoSrc: `${HF}/seedance-2.0-v2/examples/5-mini.mp4`,   title: 'Creative portrait colorize',   type: 'Template', prompt: 'neon portrait, cyberpunk, vivid tones, film grain',           model: 'Seedance 2.0',  seed: '1029384', ratio: '1:1' },
  { videoSrc: `${HF}/seedance-2.0-v2/examples/2-mini.mp4`,   title: 'Night scene generation',       type: 'Image',    prompt: 'city nightscape, bokeh lights, cinematic grade, 4K',         model: 'Seedance 2.0',  seed: '5571293', ratio: '16:9' },
  { videoSrc: `${HF}/ai-video-v2/example-1-mini.mp4`,        title: 'Aerial view synthesis',        type: 'Video',    prompt: 'aerial drone shot, sunset city, cinematic motion',           model: 'Seedance 2.0',  seed: '9938272', ratio: '16:9' },
  { videoSrc: `${HF}/seedance-2.0-v2/examples/4-mini.mp4`,   title: 'Skin texture recovery',        type: 'Flow',     prompt: 'portrait retouching, natural skin, soft studio light',       model: 'Seedance 2.0',  seed: '3847561', ratio: '3:2' },
  { videoSrc: `${HF}/ai-video-v2/example-3-mini.mp4`,        title: '8K landscape render',          type: 'Video',    prompt: 'mountain landscape, golden hour, 8K native resolution',      model: 'Seedance 2.0',  seed: '6629018', ratio: '16:9' },
] as Array<{ videoSrc: string; title: string; type: string; prompt: string; model: string; seed: string; ratio: string }>;

const SUGGESTED_CONVERTS: Record<string, string> = {
  'neon cyberpunk': 'ultra-detailed cyberpunk cityscape, neon signs, rain-soaked streets, volumetric fog, lens flare, ARRI cinematic grade, 8K',
  'portrait': 'photorealistic portrait, natural skin texture, golden hour rim lighting, 35mm bokeh, fashion editorial, hyperrealistic, 4K',
  'landscape': 'sweeping aerial landscape, dramatic cloudscape, golden hour, IMAX 4K, cinematic LUT, wide 16:9 format',
};

function AutoVideo({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!el.src) {
          el.src = src;
          el.load();
          el.addEventListener('canplay', () => el.play().catch(() => {}), { once: true });
        } else {
          el.play().catch(() => {});
        }
      } else {
        el.pause();
      }
    }, { threshold: 0.05 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [src]);
  return <video ref={ref} loop muted playsInline preload="none" className={className ?? ''} />;
}

function ResultCard({ r, T }: { r: typeof RESULTS[number]; T: ReturnType<typeof useTheme>['T'] }) {
  return (
    <div className="group cursor-pointer">
      <div className="aspect-video rounded-2xl overflow-hidden bg-zinc-900 mb-2 relative">
        <AutoVideo src={r.videoSrc} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
        <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)' }}>
          <p className="text-[8.5px] font-mono line-clamp-1" style={{ color: 'rgba(255,255,255,0.82)' }}>{r.prompt}</p>
          <div className="flex gap-1 mt-0.5">
            <span className="text-[7.5px] bg-white/20 rounded px-1 py-0.5 font-mono" style={{ color: 'rgba(255,255,255,0.72)' }}>{r.model}</span>
            <span className="text-[7.5px] bg-white/20 rounded px-1 py-0.5 font-mono" style={{ color: 'rgba(255,255,255,0.72)' }}>{r.ratio}</span>
          </div>
        </div>
      </div>
      <p className="text-[12.5px] font-semibold truncate" style={{ color: T.text }}>{r.title}</p>
      <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: T.textMuted }}>{r.type}</span>
    </div>
  );
}

export default function SearchView() {
  const { isDark, T } = useTheme();
  const [query,   setQuery]   = useState('');
  const [filter,  setFilter]  = useState('All');
  const [converted, setConverted] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const filtered = RESULTS.filter(r =>
    (filter === 'All' || r.type === filter) &&
    (!query || r.title.toLowerCase().includes(query.toLowerCase()))
  );

  const matchedConvert = Object.keys(SUGGESTED_CONVERTS).find(k =>
    query.toLowerCase().includes(k)
  );

  const handleConvert = () => {
    if (matchedConvert) {
      setConverted(SUGGESTED_CONVERTS[matchedConvert]);
      setQuery(SUGGESTED_CONVERTS[matchedConvert]);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: T.bg }}>

      {/* Search header */}
      <div className="px-8 py-5 space-y-3 shrink-0" style={{ borderBottom: `1px solid ${T.border}` }}>
        {/* Search bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-colors"
          style={{ background: T.inputBg, border: `1px solid ${T.border}` }}>
          <Search className="w-4.5 h-4.5 shrink-0" style={{ width: 18, height: 18, color: T.textMuted }} />
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search tools, flows, templates… or describe a video motion in plain language"
            className="flex-1 text-[14px] bg-transparent outline-none"
            style={{ color: T.text }}
          />
          {query && (
            <button onClick={() => { setQuery(''); setConverted(null); }}
              className="transition-colors cursor-pointer"
              style={{ color: T.textMuted }}>
              <X className="w-4 h-4" />
            </button>
          )}
          <button className="flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
            style={{ color: T.textSub, border: `1px solid ${T.border}` }}>
            <SlidersHorizontal className="w-3.5 h-3.5" />Filters
          </button>
        </div>

        {/* AI Convert bar — appears when there's a keyword match */}
        {query && !converted && (
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border" style={{ borderColor: P.vivid + '40', background: P.vivid + '08' }}>
            <Sparkles className="w-3.5 h-3.5 shrink-0" style={{ color: P.vivid }} />
            <span className="text-[12px] flex-1" style={{ color: T.textSub }}>
              AI can expand <span className="font-semibold" style={{ color: P.vivid }}>"{query}"</span> into a cinematic generation prompt
            </span>
            <button onClick={handleConvert}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11.5px] font-bold text-white cursor-pointer hover:opacity-90 transition-all"
              style={{ background: P.vivid }}>
              <Wand2 className="w-3 h-3" />Convert to Prompt
            </button>
          </div>
        )}
        {converted && (
          <div className="px-4 py-2.5 rounded-xl border border-green-200 bg-green-50 text-[11.5px] text-green-700 font-medium">
            ✓ Prompt ready — you can now generate or refine it
          </div>
        )}

        {/* Filter chips */}
        <div className="flex items-center gap-2">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-[11.5px] font-medium transition-all cursor-pointer`}
              style={filter === f
                ? { background: P.vivid, color: '#fff' }
                : { background: T.bgCard, color: T.textSub }}>
              {f}
            </button>
          ))}
          {(query || filter !== 'All') && (
            <span className="text-[11px] ml-2" style={{ color: T.textMuted }}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        {!query && filter === 'All' ? (
          <div className="space-y-8">
            {/* Action Search hint */}
            <div className="rounded-2xl border p-5 flex items-start gap-4" style={{ borderColor: P.vivid + '30', background: P.vivid + '05' }}>
              <Wand2 className="w-5 h-5 mt-0.5 shrink-0" style={{ color: P.vivid }} />
              <div>
                <p className="text-[13px] font-bold mb-1" style={{ color: T.text }}>Action Search</p>
                <p className="text-[12px] leading-relaxed" style={{ color: T.textSub }}>
                  Try <span className="font-semibold" style={{ color: T.text }}>"clips where a car drifts"</span> or <span className="font-semibold" style={{ color: T.text }}>"portraits with bokeh background"</span> — our AI understands natural language motions and scenes.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-[11px] font-bold mb-3 uppercase tracking-widest" style={{ color: T.textMuted }}>Recent searches</h2>
              <div className="flex flex-wrap gap-2">
                {['portrait upscale', 'cinematic landscape', 'product background remove', 'neon cyberpunk', '8K enhance'].map(s => (
                  <button key={s} onClick={() => setQuery(s)}
                    className="px-4 py-2 rounded-full text-[12px] cursor-pointer flex items-center gap-1.5 transition-colors"
                    style={{ background: T.bgSub, border: `1px solid ${T.border}`, color: T.textSub }}>
                    <Search className="w-3 h-3" style={{ color: T.textMuted }} />{s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[11px] font-bold uppercase tracking-widest" style={{ color: T.textMuted }}>Trending</h2>
                <button className="flex items-center gap-1 text-[11.5px] transition-colors cursor-pointer" style={{ color: T.textMuted }}>
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {RESULTS.slice(0, 4).map((r, i) => <ResultCard key={i} r={r} T={T} />)}
              </div>
            </div>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-4 gap-4">
            {filtered.map((r, i) => <ResultCard key={i} r={r} T={T} />)}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center gap-4 text-center min-h-[200px]">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: T.bgCard }}>
              <Search className="w-7 h-7" style={{ color: T.textMuted }} />
            </div>
            <div>
              <p className="text-[15px] font-semibold" style={{ color: T.text }}>No results for "{query}"</p>
              <p className="text-[12px] mt-1" style={{ color: T.textMuted }}>Try a different term — or use Convert to Prompt to generate</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
