'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, X, SlidersHorizontal, Wand2, ArrowRight, Sparkles } from 'lucide-react';

const P = {
  vivid: '#FF7000', magenta: '#F060EE', orange: '#FFB347',
  peach: '#FFBF80', hotPink: '#FF2D6B', coral: '#FF6B86',
};

const FILTERS  = ['All', 'Images', 'Videos', 'Templates', 'Flows', 'Community'];
const RESULTS  = [
  { src: '/pexels-didsss-2791056.jpg',         title: 'Portrait enhance · 4×',       type: 'Image',    prompt: 'cinematic portrait, golden hour, 35mm, Fujifilm grain', model: 'Portrait Ultra', seed: '4829301', ratio: '3:2' },
  { src: '/pexels-ganajp-15698413.jpg',         title: 'Landscape cinematic upscale',  type: 'Image',    prompt: 'aerial establishing shot, megacity at dusk, ARRI Alexa', model: 'Landscape Pro', seed: '7731044', ratio: '16:9' },
  { src: '/pexels-olga-178200755-12367292.jpg', title: 'Product clean-up flow',        type: 'Flow',     prompt: 'macro product photography, studio chrome lighting, 8K', model: 'Product Studio', seed: '2290811', ratio: '1:1' },
  { src: '/pexels-prathsnap-3168209.jpg',       title: 'Creative portrait colorize',   type: 'Template', prompt: 'neon portrait, cyberpunk, vivid tones, film grain', model: 'Turbo v2', seed: '1029384', ratio: '1:1' },
  { src: '/pexels-didsss-2791056.jpg',          title: 'Night scene generation',        type: 'Image',    prompt: 'city nightscape, bokeh lights, cinematic grade, 4K', model: 'Landscape Pro', seed: '5571293', ratio: '16:9' },
  { src: '/pexels-ganajp-15698413.jpg',         title: 'Aerial view synthesis',         type: 'Video',    prompt: 'aerial drone shot, sunset city, cinematic motion', model: 'Cinematic', seed: '9938272', ratio: '16:9' },
  { src: '/pexels-olga-178200755-12367292.jpg', title: 'Skin texture recovery',         type: 'Flow',     prompt: 'portrait retouching, natural skin, soft studio light', model: 'Portrait Ultra', seed: '3847561', ratio: '3:2' },
  { src: '/pexels-prathsnap-3168209.jpg',       title: '8K landscape render',           type: 'Image',    prompt: 'mountain landscape, golden hour, 8K native resolution', model: 'Landscape Pro', seed: '6629018', ratio: '16:9' },
];

const SUGGESTED_CONVERTS: Record<string, string> = {
  'neon cyberpunk': 'ultra-detailed cyberpunk cityscape, neon signs, rain-soaked streets, volumetric fog, lens flare, ARRI cinematic grade, 8K',
  'portrait': 'photorealistic portrait, natural skin texture, golden hour rim lighting, 35mm bokeh, fashion editorial, hyperrealistic, 4K',
  'landscape': 'sweeping aerial landscape, dramatic cloudscape, golden hour, IMAX 4K, cinematic LUT, wide 16:9 format',
};

export default function SearchView() {
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
    <div className="flex-1 flex flex-col overflow-hidden bg-white">

      {/* Search header */}
      <div className="border-b border-zinc-200 px-8 py-5 space-y-3 shrink-0">
        {/* Search bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl focus-within:border-zinc-400 transition-colors">
          <Search className="w-4.5 h-4.5 text-zinc-400 shrink-0" style={{ width: 18, height: 18 }} />
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search tools, flows, templates… or describe a video motion in plain language"
            className="flex-1 text-[14px] text-zinc-900 placeholder-zinc-400 bg-transparent outline-none" />
          {query && (
            <button onClick={() => { setQuery(''); setConverted(null); }}
              className="text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          )}
          <button className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 border border-zinc-200 px-3 py-1.5 rounded-xl hover:border-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer">
            <SlidersHorizontal className="w-3.5 h-3.5" />Filters
          </button>
        </div>

        {/* AI Convert bar — appears when there's a keyword match */}
        {query && !converted && (
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border" style={{ borderColor: P.vivid + '40', background: P.vivid + '08' }}>
            <Sparkles className="w-3.5 h-3.5 shrink-0" style={{ color: P.vivid }} />
            <span className="text-[12px] text-zinc-600 flex-1">
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
              className={`px-4 py-1.5 rounded-full text-[11.5px] font-medium transition-all cursor-pointer ${filter === f ? 'text-white' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}
              style={filter === f ? { background: P.vivid } : {}}>
              {f}
            </button>
          ))}
          {(query || filter !== 'All') && (
            <span className="text-[11px] text-zinc-400 ml-2">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
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
                <p className="text-[13px] font-bold text-zinc-800 mb-1">Action Search</p>
                <p className="text-[12px] text-zinc-500 leading-relaxed">
                  Try <span className="font-semibold text-zinc-700">"clips where a car drifts"</span> or <span className="font-semibold text-zinc-700">"portraits with bokeh background"</span> — our AI understands natural language motions and scenes.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-[11px] font-bold text-zinc-500 mb-3 uppercase tracking-widest">Recent searches</h2>
              <div className="flex flex-wrap gap-2">
                {['portrait upscale', 'cinematic landscape', 'product background remove', 'neon cyberpunk', '8K enhance'].map(s => (
                  <button key={s} onClick={() => setQuery(s)}
                    className="px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-full text-[12px] text-zinc-600 hover:bg-zinc-100 hover:border-zinc-400 transition-colors cursor-pointer flex items-center gap-1.5">
                    <Search className="w-3 h-3 text-zinc-400" />{s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Trending</h2>
                <button className="flex items-center gap-1 text-[11.5px] text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer">
                  View all <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {RESULTS.slice(0, 4).map((r, i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="aspect-video rounded-2xl overflow-hidden bg-zinc-100 mb-2 relative">
                      <img src={r.src} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                      <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-[8.5px] font-mono text-white/60 line-clamp-1">{r.prompt}</p>
                        <div className="flex gap-1 mt-0.5">
                          <span className="text-[7.5px] bg-white/20 rounded px-1 py-0.5 text-white/50 font-mono">{r.model}</span>
                          <span className="text-[7.5px] bg-white/20 rounded px-1 py-0.5 text-white/50 font-mono">{r.ratio}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[12.5px] font-semibold text-zinc-900">{r.title}</p>
                    <p className="text-[11px] text-zinc-400">{r.type}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-4 gap-4">
            {filtered.map((r, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-video rounded-2xl overflow-hidden bg-zinc-100 mb-2 relative">
                  <img src={r.src} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-[8.5px] font-mono text-white/60 line-clamp-1">{r.prompt}</p>
                    <div className="flex gap-1 mt-0.5">
                      <span className="text-[7.5px] bg-white/20 rounded px-1 py-0.5 text-white/50 font-mono">{r.model}</span>
                      <span className="text-[7.5px] bg-white/20 rounded px-1 py-0.5 text-white/50 font-mono">{r.ratio}</span>
                    </div>
                  </div>
                </div>
                <p className="text-[12.5px] font-semibold text-zinc-900 truncate">{r.title}</p>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">{r.type}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center gap-4 text-center min-h-[200px]">
            <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center">
              <Search className="w-7 h-7 text-zinc-300" />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-zinc-800">No results for "{query}"</p>
              <p className="text-[12px] text-zinc-400 mt-1">Try a different term — or use Convert to Prompt to generate</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
