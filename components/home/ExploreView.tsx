'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowRight, Heart, Zap, Film, Wand2, Check,
  Search, X, SlidersHorizontal, Sparkles,
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

const P = {
  rose: '#C94060', orange: '#D97E3A', hotPink: '#CC4A78',
  coral: '#D46280', peach: '#FFBF80', vivid: '#D46030',
  magenta: '#B050C0', yellow: '#FFF6A6',
};

const IMGS = [
  '/pexels-didsss-2791056.jpg',
  '/pexels-ganajp-15698413.jpg',
  '/pexels-olga-178200755-12367292.jpg',
  '/pexels-prathsnap-3168209.jpg',
];

const HF = 'https://static.higgsfield.ai';

/* ── Search data ─────────────────────────────────────────────────────────── */

const SEARCH_FILTERS = ['All', 'Images', 'Videos', 'Templates', 'Flows', 'Community'];
const RECENT_SEARCHES = ['portrait upscale', 'cinematic landscape', 'product background remove', 'neon cyberpunk', '8K enhance'];

const RESULTS = [
  { videoSrc: `${HF}/ai-video-v2/example-2-mini.mp4`,      title: 'Portrait enhance · 4×',      type: 'Images',    prompt: 'cinematic portrait, golden hour, 35mm, Fujifilm grain',     model: 'Seedance 2.0', seed: '4829301', ratio: '3:2'  },
  { videoSrc: `${HF}/seedance-2.0-v2/examples/1-mini.mp4`, title: 'Landscape cinematic upscale', type: 'Images',    prompt: 'aerial establishing shot, megacity at dusk, ARRI Alexa',    model: 'Seedance 2.0', seed: '7731044', ratio: '16:9' },
  { videoSrc: `${HF}/ai-video-v2/example-4-mini.mp4`,      title: 'Product clean-up flow',       type: 'Flows',     prompt: 'macro product photography, studio chrome lighting, 8K',     model: 'Seedance 2.0', seed: '2290811', ratio: '1:1'  },
  { videoSrc: `${HF}/seedance-2.0-v2/examples/5-mini.mp4`, title: 'Creative portrait colorize',  type: 'Templates', prompt: 'neon portrait, cyberpunk, vivid tones, film grain',          model: 'Seedance 2.0', seed: '1029384', ratio: '1:1'  },
  { videoSrc: `${HF}/seedance-2.0-v2/examples/2-mini.mp4`, title: 'Night scene generation',      type: 'Images',    prompt: 'city nightscape, bokeh lights, cinematic grade, 4K',        model: 'Seedance 2.0', seed: '5571293', ratio: '16:9' },
  { videoSrc: `${HF}/ai-video-v2/example-1-mini.mp4`,      title: 'Aerial view synthesis',       type: 'Videos',    prompt: 'aerial drone shot, sunset city, cinematic motion',          model: 'Seedance 2.0', seed: '9938272', ratio: '16:9' },
  { videoSrc: `${HF}/seedance-2.0-v2/examples/4-mini.mp4`, title: 'Skin texture recovery',       type: 'Flows',     prompt: 'portrait retouching, natural skin, soft studio light',      model: 'Seedance 2.0', seed: '3847561', ratio: '3:2'  },
  { videoSrc: `${HF}/ai-video-v2/example-3-mini.mp4`,      title: '8K landscape render',         type: 'Videos',    prompt: 'mountain landscape, golden hour, 8K native resolution',     model: 'Seedance 2.0', seed: '6629018', ratio: '16:9' },
] as Array<{ videoSrc: string; title: string; type: string; prompt: string; model: string; seed: string; ratio: string }>;

const SUGGESTED_CONVERTS: Record<string, string> = {
  'neon cyberpunk': 'ultra-detailed cyberpunk cityscape, neon signs, rain-soaked streets, volumetric fog, lens flare, ARRI cinematic grade, 8K',
  'portrait': 'photorealistic portrait, natural skin texture, golden hour rim lighting, 35mm bokeh, fashion editorial, hyperrealistic, 4K',
  'landscape': 'sweeping aerial landscape, dramatic cloudscape, golden hour, IMAX 4K, cinematic LUT, wide 16:9 format',
};

/* ── Explore feed data ───────────────────────────────────────────────────── */

interface Asset {
  src: string;
  prompt: string;
  model: string;
  seed: string;
  ratio: string;
  type: 'image' | 'video';
  videoSrc?: string;
  tag?: string;
  likes?: number;
  creatorInitial?: string;
  creatorColor?: string;
}

interface MasonryAsset extends Asset { ar: string; }

const MASONRY_ASSETS: MasonryAsset[] = [
  { src: IMGS[0], prompt: 'AI cinematic landscape, neural render, hyperrealistic terrain morph',       model: 'Seedance 2.0', seed: '1',  ratio: '16:9', type: 'video', videoSrc: `${HF}/seedance-2.0-v2/examples/1-mini.mp4`, tag: 'Cinematic', likes: 4821, ar: '16/9', creatorInitial: 'J', creatorColor: P.rose },
  { src: IMGS[1], prompt: 'AI generated human portrait in motion, photorealistic, studio light',       model: 'Seedance 2.0', seed: '2',  ratio: '9:16', type: 'video', videoSrc: `${HF}/seedance-2.0-v2/examples/2-mini.mp4`, tag: 'Portrait',  likes: 6340, ar: '9/16', creatorInitial: 'K', creatorColor: P.vivid },
  { src: IMGS[2], prompt: 'AI product visualization, floating in void, cinematic volumetric light',    model: 'AI Video',    seed: '3',  ratio: '1:1',  type: 'video', videoSrc: `${HF}/ai-video-v2/example-1-mini.mp4`,       tag: 'Product',   likes: 2104, ar: '1/1',  creatorInitial: 'A', creatorColor: P.hotPink },
  { src: IMGS[3], prompt: 'AI fantasy environment, dramatic atmosphere, particle simulation',           model: 'Seedance 2.0', seed: '4',  ratio: '16:9', type: 'video', videoSrc: `${HF}/seedance-2.0-v2/examples/3-mini.mp4`, tag: 'Fantasy',   likes: 5200, ar: '16/9', creatorInitial: 'S', creatorColor: P.magenta },
  { src: IMGS[0], prompt: 'AI fashion editorial, hyperrealistic model, neon-lit runway slow motion',   model: 'AI Video',    seed: '5',  ratio: '2:3',  type: 'video', videoSrc: `${HF}/ai-video-v2/example-2-mini.mp4`,       tag: 'Fashion',   likes: 7100, ar: '2/3',  creatorInitial: 'M', creatorColor: P.orange },
  { src: IMGS[1], prompt: 'AI surreal landscape morph, dreamlike physics, neural hallucination',       model: 'Seedance 2.0', seed: '6',  ratio: '16:9', type: 'video', videoSrc: `${HF}/seedance-2.0-v2/examples/4-mini.mp4`, tag: 'Surreal',   likes: 3812, ar: '16/9', creatorInitial: 'R', creatorColor: P.coral },
  { src: IMGS[2], prompt: 'AI abstract generative art, flowing particles, glowing energy vortex',      model: 'AI Video',    seed: '7',  ratio: '1:1',  type: 'video', videoSrc: `${HF}/ai-video-v2/example-3-mini.mp4`,       tag: 'Abstract',  likes: 2940, ar: '1/1',  creatorInitial: 'N', creatorColor: P.peach },
  { src: IMGS[3], prompt: 'AI 3D character animation, stylized render, expressive cinematic motion',   model: 'Seedance 2.0', seed: '8',  ratio: '2:3',  type: 'video', videoSrc: `${HF}/seedance-2.0-v2/examples/5-mini.mp4`, tag: '3D',        likes: 5890, ar: '2/3',  creatorInitial: 'V', creatorColor: P.rose },
  { src: IMGS[0], prompt: 'AI sci-fi environment, volumetric light shafts, dystopian atmosphere',      model: 'AI Video',    seed: '9',  ratio: '16:9', type: 'video', videoSrc: `${HF}/ai-video-v2/example-4-mini.mp4`,       tag: 'Sci-Fi',    likes: 3730, ar: '16/9', creatorInitial: 'L', creatorColor: P.vivid },
  { src: IMGS[1], prompt: 'AI generated human in motion, ultra-detailed skin texture, film grain',     model: 'AI Video',    seed: '10', ratio: '9:16', type: 'video', videoSrc: `${HF}/ai-video-v2/example-5-mini.mp4`,       tag: 'Human',     likes: 8200, ar: '9/16', creatorInitial: 'T', creatorColor: P.magenta },
  { src: IMGS[2], prompt: 'neon-soaked cityscape at midnight, rain on asphalt, blade runner aesthetic',model: 'Seedance 2.0', seed: '11', ratio: '16:9', type: 'video', videoSrc: `${HF}/seedance-2.0-v2/examples/1-mini.mp4`, tag: 'Neon',      likes: 5410, ar: '16/9', creatorInitial: 'D', creatorColor: P.rose },
  { src: IMGS[3], prompt: 'slow-motion water splash, macro photography, studio lighting, 8K detail',   model: 'AI Video',    seed: '12', ratio: '1:1',  type: 'video', videoSrc: `${HF}/ai-video-v2/example-2-mini.mp4`,       tag: 'Macro',     likes: 3200, ar: '1/1',  creatorInitial: 'E', creatorColor: P.orange },
  { src: IMGS[0], prompt: 'underwater scene, bioluminescent creatures, cinematic deep blue',           model: 'Seedance 2.0', seed: '13', ratio: '9:16', type: 'video', videoSrc: `${HF}/seedance-2.0-v2/examples/3-mini.mp4`, tag: 'Nature',    likes: 6700, ar: '9/16', creatorInitial: 'F', creatorColor: P.coral },
  { src: IMGS[1], prompt: 'hyperrealistic desert dunes at golden hour, sweeping aerial motion',        model: 'AI Video',    seed: '14', ratio: '16:9', type: 'video', videoSrc: `${HF}/ai-video-v2/example-3-mini.mp4`,       tag: 'Landscape', likes: 4130, ar: '16/9', creatorInitial: 'G', creatorColor: P.vivid },
  { src: IMGS[2], prompt: 'abstract fluid simulation, metallic liquid morphing, generative art',       model: 'Seedance 2.0', seed: '15', ratio: '2:3',  type: 'video', videoSrc: `${HF}/seedance-2.0-v2/examples/5-mini.mp4`, tag: 'Fluid',     likes: 2870, ar: '2/3',  creatorInitial: 'H', creatorColor: P.magenta },
  { src: IMGS[3], prompt: 'cinematic close-up of mechanical watch gears, luxury product showcase',     model: 'AI Video',    seed: '16', ratio: '1:1',  type: 'video', videoSrc: `${HF}/ai-video-v2/example-4-mini.mp4`,       tag: 'Luxury',    likes: 4450, ar: '1/1',  creatorInitial: 'I', creatorColor: P.hotPink },
  { src: IMGS[0], prompt: 'aurora borealis over mountain peaks, timelapse style, vivid color grade',   model: 'Seedance 2.0', seed: '17', ratio: '16:9', type: 'video', videoSrc: `${HF}/seedance-2.0-v2/examples/2-mini.mp4`, tag: 'Aurora',    likes: 7600, ar: '16/9', creatorInitial: 'B', creatorColor: P.peach },
  { src: IMGS[1], prompt: 'editorial portrait, dramatic chiaroscuro, fashion magazine cover',           model: 'AI Video',    seed: '18', ratio: '2:3',  type: 'video', videoSrc: `${HF}/ai-video-v2/example-1-mini.mp4`,       tag: 'Editorial', likes: 5940, ar: '2/3',  creatorInitial: 'C', creatorColor: P.vivid },
  { src: IMGS[2], prompt: 'levitating architecture, brutalist structures above cloud layer, golden light', model: 'Seedance 2.0', seed: '19', ratio: '16:9', type: 'video', videoSrc: `${HF}/seedance-2.0-v2/examples/2-mini.mp4`, tag: 'Arch',      likes: 3180, ar: '16/9', creatorInitial: 'P', creatorColor: P.orange },
  { src: IMGS[3], prompt: 'midnight bonfire on beach, embers rising slowly, slow motion crashing waves',  model: 'AI Video',    seed: '20', ratio: '2:3',  type: 'video', videoSrc: `${HF}/ai-video-v2/example-3-mini.mp4`,       tag: 'Mood',      likes: 4920, ar: '2/3',  creatorInitial: 'Q', creatorColor: P.rose },
];

const CINEMATIC: Asset[] = [
  { src: IMGS[3], prompt: 'aerial establishing shot, megacity at dusk, neon reflections, AI Cinematic 4K',     model: 'Seedance 2.0', seed: '7731044', ratio: '16:9', type: 'video', videoSrc: `${HF}/ai-video-v2/example-1-mini.mp4`,       tag: '4K Cinematic', likes: 2841, creatorInitial: 'J', creatorColor: P.rose },
  { src: IMGS[0], prompt: 'cinematic portrait, golden hour venetian blinds, 35mm grain, AI Portrait Ultra',    model: 'Seedance 2.0', seed: '4829301', ratio: '3:2',  type: 'video', videoSrc: `${HF}/ai-video-v2/example-3-mini.mp4`,       tag: 'Portrait',     likes: 1923, creatorInitial: 'S', creatorColor: P.vivid },
  { src: IMGS[2], prompt: 'macro product photography, luxury timepiece, razor-sharp depth, AI Product Studio', model: 'AI Video v2', seed: '2290811', ratio: '1:1',  type: 'video', videoSrc: `${HF}/ai-video-v2/example-5-mini.mp4`,       tag: 'Studio',       likes: 3104, creatorInitial: 'A', creatorColor: P.hotPink },
];


const VFX_PRESETS = [
  { title: 'CGI Breakdown',      desc: 'Object dissolving into glowing particles, dark bg',            prompt: 'CGI breakdown effect, object disintegrating into glowing particles, dark background, 4K VFX, cinematic', color: P.vivid },
  { title: 'Cybernetic Assembly', desc: 'Robotic structures self-assembling in slow motion',            prompt: 'cybernetic assembly, metallic components forming, slow motion, chrome and neon, IMAX quality',         color: P.orange },
  { title: 'Sci-Fi Portal',      desc: 'Interdimensional wormhole with swirling energy',               prompt: 'sci-fi energy portal opening, swirling vortex, deep space background, lens flare, cinematic color grade', color: P.coral },
  { title: 'Hero Landing',       desc: 'Shockwave impact on concrete with dust particles',              prompt: 'superhero landing, ground shockwave impact, dust particles, golden backlight, slow motion 240fps, IMAX',  color: P.peach },
];

const SOCIAL_PRESETS = [
  { title: '2000s Paparazzi Flash', desc: 'Blown-out flash for instant virality',           prompt: 'paparazzi flash photography, 2000s celebrity tabloid aesthetic, overexposed, 35mm film grain, viral',          color: P.orange },
  { title: 'Neon Glitch',           desc: 'RGB split with cyber overlays — TikTok gold',   prompt: 'neon glitch effect, RGB channel split, cyber noise overlay, dark background, vertical social format 9:16',      color: P.magenta },
  { title: 'Cinematic Transition',  desc: 'Whip-pan with motion blur for high retention',  prompt: 'cinematic whip pan transition, motion blur cut, professional grade, social media format, 9:16',                 color: P.hotPink },
  { title: 'Dreamy Lo-Fi',          desc: 'Soft grain, pastel tones — aesthetic editorial', prompt: 'lo-fi aesthetic, soft film grain, warm pastel tones, dreamy overcast light, editorial photography',             color: P.peach },
];


/* ── Components ──────────────────────────────────────────────────────────── */

function LazyVideoMedia({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!el.src) { el.src = src; el.load(); el.addEventListener('canplay', () => el.play().catch(() => {}), { once: true }); }
        else { el.play().catch(() => {}); }
      } else { el.pause(); }
    }, { threshold: 0.05 });
    obs.observe(el); return () => obs.disconnect();
  }, [src]);
  return <video ref={ref} loop muted playsInline preload="none" className={className ?? ''} />;
}

function ResultCard({ r, T }: { r: typeof RESULTS[number]; T: ReturnType<typeof useTheme>['T'] }) {
  return (
    <div className="group cursor-pointer">
      <div className="aspect-video rounded-2xl overflow-hidden mb-2 relative" style={{ background: T.bgCard }}>
        <LazyVideoMedia src={r.videoSrc} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
        <div className="absolute bottom-0 left-0 right-0 p-2.5 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)' }}>
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

function MediaCard({ asset, className, style: styleProp }: { asset: Asset; className?: string; style?: React.CSSProperties }) {
  const { T } = useTheme();
  return (
    <div className={`group relative overflow-hidden cursor-pointer ${className ?? ''}`}
      style={{ background: T.bgCard, ...styleProp }}>
      {asset.type === 'video' && asset.videoSrc
        ? <LazyVideoMedia src={asset.videoSrc} className="w-full h-full object-cover" />
        : <img src={asset.src} alt="" loading="lazy" className="w-full h-full object-cover" />
      }
    </div>
  );
}

function HUDOverlay({ asset }: { asset: Asset }) {
  return (
    <>
      {asset.creatorInitial && (
        <div className="absolute top-2.5 left-2.5 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-0.5 group-hover:translate-y-0">
          <div className="w-7 h-7 rounded-full border-2 border-white/60 flex items-center justify-center text-[9px] font-bold text-white shadow-md"
            style={{ background: asset.creatorColor || P.vivid }}>
            {asset.creatorInitial}
          </div>
        </div>
      )}
      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0">
        <button className="w-7 h-7 rounded-full flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform"
          style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)' }}
          onClick={e => e.stopPropagation()}>
          <Heart className="w-3 h-3" />
        </button>
        <button className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-white cursor-pointer hover:scale-110 transition-transform"
          style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)' }}
          onClick={e => e.stopPropagation()}>
          ✦
        </button>
      </div>
      <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 100%)', padding: '28px 12px 12px' }}>
        <p className="text-[9px] leading-snug line-clamp-2 mb-1.5" style={{ color: 'rgba(255,255,255,0.82)' }}>{asset.prompt}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 flex-wrap">
            {asset.tag && (
              <span className="inline-block text-[8px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: P.vivid + 'cc', color: '#fff' }}>
                {asset.tag}
              </span>
            )}
            <span className="text-[8px] font-mono" style={{ color: 'rgba(255,255,255,0.65)' }}>{asset.model}</span>
          </div>
          {asset.likes && (
            <div className="flex items-center gap-1 shrink-0">
              <Heart className="w-2.5 h-2.5 text-rose-400 fill-rose-400" />
              <span className="text-[8.5px]" style={{ color: 'rgba(255,255,255,0.72)' }}>{asset.likes.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function MasonryCard({ asset }: { asset: MasonryAsset }) {
  return (
    <div className="group relative rounded-2xl overflow-hidden cursor-pointer" style={{ aspectRatio: asset.ar }}>
      <MediaCard asset={asset} className="absolute inset-0 w-full h-full rounded-2xl" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
      <HUDOverlay asset={asset} />
    </div>
  );
}

function SectionHeader({ label, badge, color, action, onAction, T }: {
  label: string; badge?: string; color?: string; action?: string; onAction?: () => void;
  T: ReturnType<typeof useTheme>['T'];
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2.5">
        {badge && (
          <span className="text-[8.5px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border"
            style={{ color, borderColor: color, background: `${color}15` }}>
            {badge}
          </span>
        )}
        <h2 className="text-[17px] font-black tracking-[-0.02em]" style={{ color: T.text }}>{label}</h2>
      </div>
      {action && (
        <button onClick={onAction}
          className="flex items-center gap-1 text-[11.5px] font-medium transition-colors cursor-pointer"
          style={{ color: T.textMuted }}>
          {action} <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

/* ── Main ────────────────────────────────────────────────────────────────── */

export default function ExploreView({ onToolClick = () => {} }: { onToolClick?: (id: string) => void }) {
  const { T, isDark } = useTheme();
  const [query,        setQuery]        = useState('');
  const [searchFilter, setSearchFilter] = useState('All');
  const [assetFilter,  setAssetFilter]  = useState('All');
  const [ratioFilter,  setRatioFilter]  = useState('All');
  const [converted,    setConverted]    = useState<string | null>(null);
  const [copied,       setCopied]       = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const matchedConvert = Object.keys(SUGGESTED_CONVERTS).find(k => query.toLowerCase().includes(k));

  const handleConvert = () => {
    if (matchedConvert) {
      const expanded = SUGGESTED_CONVERTS[matchedConvert];
      setConverted(expanded);
      setQuery(expanded);
    }
  };

  const filteredResults = RESULTS.filter(r =>
    (searchFilter === 'All' || r.type === searchFilter) &&
    (!query || r.title.toLowerCase().includes(query.toLowerCase()) || r.prompt.toLowerCase().includes(query.toLowerCase()))
  );

  const filteredMasonry = MASONRY_ASSETS.filter(a => {
    if (assetFilter === 'Audio') return false;
    const typeMatch = assetFilter === 'All'
      || (assetFilter === 'Images' && a.type === 'image')
      || (assetFilter === 'Video'  && a.type === 'video');
    const ratioMatch = ratioFilter === 'All' || a.ratio === ratioFilter;
    return typeMatch && ratioMatch;
  });

  const tryPreset = (title: string) => { setCopied(title); setTimeout(() => setCopied(null), 1800); };

  const isSearching = query.length > 0 || searchFilter !== 'All';

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{ background: T.bg }}>

      {/* ── Fixed search header ── */}
      <div className="px-8 py-4 space-y-3 shrink-0" style={{ borderBottom: `1px solid ${T.border}` }}>

        {/* Big search bar */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors"
          style={{ background: T.inputBg, border: `1px solid ${T.border}` }}>
          <Search style={{ width: 18, height: 18, color: T.textMuted, flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setConverted(null); }}
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

        {/* AI Convert bar */}
        {query && !converted && matchedConvert && (
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border"
            style={{ borderColor: P.vivid + '40', background: P.vivid + '08' }}>
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
          {SEARCH_FILTERS.map(f => (
            <button key={f} onClick={() => setSearchFilter(f)}
              className="px-4 py-1.5 rounded-full text-[11.5px] font-medium transition-all cursor-pointer"
              style={searchFilter === f
                ? { background: P.vivid, color: '#fff' }
                : { background: T.bgCard, color: T.textSub }}>
              {f}
            </button>
          ))}
          {isSearching && (
            <span className="text-[11px] ml-2" style={{ color: T.textMuted }}>
              {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto">

        {isSearching ? (
          /* ── Search / results mode ── */
          <div className="px-8 py-6">
            {!query && searchFilter !== 'All' ? (
              /* Filter-only: show trending for that category */
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[11px] font-bold uppercase tracking-widest" style={{ color: T.textMuted }}>
                    Trending · {searchFilter}
                  </h2>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {filteredResults.slice(0, 8).map((r, i) => <ResultCard key={i} r={r} T={T} />)}
                </div>
              </div>
            ) : filteredResults.length > 0 ? (
              <div className="grid grid-cols-4 gap-4">
                {filteredResults.map((r, i) => <ResultCard key={i} r={r} T={T} />)}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 text-center min-h-[280px]">
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

        ) : (
          /* ── Explore mode ── */
          <div className="px-8 py-6 space-y-12">

            {/* Recent searches */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest mr-1 self-center" style={{ color: T.textMuted }}>Recent:</span>
              {RECENT_SEARCHES.map(s => (
                <button key={s} onClick={() => setQuery(s)}
                  className="px-3 py-1.5 rounded-full text-[11.5px] cursor-pointer flex items-center gap-1.5 transition-colors"
                  style={{ background: T.bgSub, border: `1px solid ${T.border}`, color: T.textSub }}
                  onMouseEnter={e => (e.currentTarget.style.background = T.bgHover)}
                  onMouseLeave={e => (e.currentTarget.style.background = T.bgSub)}>
                  <Search className="w-3 h-3" style={{ color: T.textMuted }} />{s}
                </button>
              ))}
            </div>

            {/* ══ ACTION ZONE ══ */}
            <section>
              <SectionHeader label="Click-to-Run Presets" badge="ACTION ZONE" color={P.hotPink} action="Browse all presets" onAction={() => onToolClick('explore')} T={T} />

              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <Wand2 className="w-3.5 h-3.5" style={{ color: P.coral }} />
                  <span className="text-[10.5px] font-bold uppercase tracking-widest" style={{ color: T.textMuted }}>Hollywood VFX</span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {VFX_PRESETS.map((preset, i) => (
                    <div key={i}
                      className="group rounded-2xl p-5 cursor-pointer transition-colors relative overflow-hidden flex flex-col"
                      style={{ minHeight: 190, background: isDark ? '#09090b' : T.bgCard, border: `1px solid ${T.border}` }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = isDark ? '#18181b' : T.bgHover; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = isDark ? '#09090b' : T.bgCard; }}>
                      <div className="absolute top-0 right-0 w-28 h-28 rounded-full blur-3xl opacity-25 -translate-y-6 translate-x-6 pointer-events-none"
                        style={{ background: preset.color }} />
                      <div className="relative flex flex-col flex-1">
                        <span className="self-start text-[8.5px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-3"
                          style={{ color: preset.color, background: preset.color + '20', border: `1px solid ${preset.color}40` }}>
                          ✦ VFX
                        </span>
                        <h3 className="text-[13.5px] font-black mb-1.5 leading-snug" style={{ color: T.text }}>{preset.title}</h3>
                        <p className="text-[11px] leading-normal flex-1" style={{ color: T.textSub }}>{preset.desc}</p>
                        <button onClick={() => tryPreset(preset.title + '-vfx')}
                          className="mt-4 w-full py-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          style={copied === preset.title + '-vfx' ? { background: '#22c55e', color: '#fff' } : { background: preset.color, color: '#fff' }}>
                          {copied === preset.title + '-vfx' ? <><Check className="w-3 h-3" />Copied!</> : <>✦ Try This Preset</>}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-3.5 h-3.5" style={{ color: P.magenta }} />
                  <span className="text-[10.5px] font-bold uppercase tracking-widest" style={{ color: T.textMuted }}>Social Media Hooks</span>
                  <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full" style={{ background: T.bgCard, color: T.textSub }}>TikTok · Reels · Shorts</span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {SOCIAL_PRESETS.map((preset, i) => (
                    <div key={i}
                      className="rounded-2xl p-5 cursor-pointer transition-colors relative overflow-hidden flex flex-col"
                      style={{ minHeight: 190, background: isDark ? '#09090b' : T.bgCard, border: `1px solid ${T.border}` }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = isDark ? '#18181b' : T.bgHover; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = isDark ? '#09090b' : T.bgCard; }}>
                      <div className="absolute top-0 right-0 w-28 h-28 rounded-full blur-3xl opacity-25 -translate-y-6 translate-x-6 pointer-events-none"
                        style={{ background: preset.color }} />
                      <div className="relative flex flex-col flex-1">
                        <span className="self-start text-[8.5px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-3"
                          style={{ color: preset.color, background: preset.color + '20', border: `1px solid ${preset.color}40` }}>
                          ✦ Social
                        </span>
                        <h3 className="text-[13.5px] font-black mb-1.5 leading-snug" style={{ color: T.text }}>{preset.title}</h3>
                        <p className="text-[11px] leading-normal flex-1" style={{ color: T.textSub }}>{preset.desc}</p>
                        <button onClick={() => tryPreset(preset.title + '-social')}
                          className="mt-4 w-full py-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          style={copied === preset.title + '-social' ? { background: '#22c55e', color: '#fff' } : { background: preset.color, color: '#fff' }}>
                          {copied === preset.title + '-social' ? <><Check className="w-3 h-3" />Copied!</> : <>✦ Use This Hook</>}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ══ STUDIO MODULES ══ */}
            <section>
              <SectionHeader label="Studio Modules" badge="UPSELL" color={P.orange} action="Open Studios" onAction={() => onToolClick('spaces')} T={T} />
              <div className="grid grid-cols-2 gap-4">

                <div onClick={() => onToolClick('image')}
                  className="rounded-2xl p-6 relative overflow-hidden cursor-pointer transition-colors"
                  style={{ minHeight: 230, background: isDark ? '#09090b' : T.bgCard, border: `1px solid ${T.border}` }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = isDark ? '#18181b' : T.bgHover; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = isDark ? '#09090b' : T.bgCard; }}>
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: `radial-gradient(circle at 85% 15%, ${P.vivid}35 0%, transparent 55%)` }} />
                  <div className="relative">
                    <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                      style={{ color: P.vivid, background: P.vivid + '20', border: `1px solid ${P.vivid}40` }}>Marketing</span>
                    <h3 className="text-[20px] font-black mt-3 mb-2 leading-tight" style={{ color: T.text }}>Marketing &<br />Ad Automation</h3>
                    <p className="text-[12px] mb-4 leading-relaxed max-w-xs" style={{ color: T.textSub }}>
                      One product prompt generates a full ad campaign — social variants, banners, and reels automatically.
                    </p>
                    <div className="flex gap-2">
                      {IMGS.slice(0, 3).map((src, i) => (
                        <div key={i} className="flex-1 aspect-square rounded-xl overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
                          <img src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
                        </div>
                      ))}
                      <div className="flex-1 aspect-square rounded-xl flex items-center justify-center" style={{ border: `1px solid ${T.border}`, background: T.bgSub }}>
                        <span className="text-[11px] font-bold" style={{ color: T.textMuted }}>+12</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div onClick={() => onToolClick('spaces')}
                  className="rounded-2xl p-6 relative overflow-hidden cursor-pointer transition-colors"
                  style={{ minHeight: 230, background: isDark ? '#09090b' : T.bgCard, border: `1px solid ${T.border}` }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = isDark ? '#18181b' : T.bgHover; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = isDark ? '#09090b' : T.bgCard; }}>
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: `radial-gradient(circle at 15% 85%, ${P.magenta}30 0%, transparent 55%)` }} />
                  <div className="relative">
                    <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                      style={{ color: P.magenta, background: P.magenta + '20', border: `1px solid ${P.magenta}40` }}>Canvas</span>
                    <h3 className="text-[20px] font-black mt-3 mb-2 leading-tight" style={{ color: T.text }}>Infinite<br />Workflow Canvas</h3>
                    <p className="text-[12px] mb-4 leading-relaxed max-w-xs" style={{ color: T.textSub }}>
                      Chain AI nodes visually. Drag Text → Image → Video → Upscale on one spatial board.
                    </p>
                    <div className="rounded-xl px-4 py-3 relative overflow-hidden" style={{ background: T.bgSub, border: `1px solid ${T.border}` }}>
                      <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '14px 14px' }} />
                      <div className="relative flex items-center gap-2">
                        {[
                          { label: 'Text',    color: P.vivid   },
                          { label: 'Image',   color: P.orange  },
                          { label: 'Video',   color: P.coral   },
                          { label: 'Upscale', color: P.magenta },
                        ].map((node, i) => (
                          <React.Fragment key={node.label}>
                            <div className="shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-bold"
                              style={{ border: `1px solid ${node.color}60`, color: node.color, background: node.color + '18' }}>
                              {node.label}
                            </div>
                            {i < 3 && <div className="flex-1 h-px min-w-[12px]" style={{ borderTop: `1px dashed ${T.border}` }} />}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ══ MODEL SHOWCASES ══ */}
            <section>
              <SectionHeader label="Model Showcases" badge="FLEX ZONE" color={P.vivid} action="View all models" onAction={() => onToolClick('explore')} T={T} />

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Film className="w-3.5 h-3.5" style={{ color: P.vivid }} />
                  <span className="text-[10.5px] font-bold uppercase tracking-widest" style={{ color: T.textMuted }}>4K · Native Cinematic</span>
                </div>
                <div className="grid gap-3" style={{ gridTemplateColumns: '2fr 1fr 1fr', height: 300 }}>
                  {CINEMATIC.map((asset, i) => (
                    <div key={i} onClick={() => onToolClick('video')} className="group relative rounded-2xl overflow-hidden cursor-pointer">
                      <MediaCard asset={asset} className="absolute inset-0 w-full h-full" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[8.5px] font-bold text-white pointer-events-none"
                        style={{ background: P.vivid + 'dd' }}>
                        {asset.type === 'video' ? '▶ ' : '✦ '}{asset.tag}
                      </div>
                      <HUDOverlay asset={asset} />
                    </div>
                  ))}
                </div>
              </div>

            </section>

            {/* ══ LIVE FEED — featured creations at bottom ══ */}
            <section>
              <SectionHeader label="Featured Creations" badge="LIVE FEED" color={P.rose} action="View all" onAction={() => onToolClick('explore')} T={T} />

              {/* Feed filters */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {['All', 'Images', 'Video', 'Audio'].map(f => (
                    <button key={f} onClick={() => setAssetFilter(f)}
                      className="px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer"
                      style={assetFilter === f
                        ? { background: P.vivid, color: '#fff' }
                        : { background: T.bgCard, color: T.textSub }}>
                      {f}
                    </button>
                  ))}
                </div>
                <div className="w-px h-4" style={{ background: T.border }} />
                <div className="flex items-center gap-1">
                  {['All', '9:16', '16:9', '1:1'].map(r => (
                    <button key={r} onClick={() => setRatioFilter(r)}
                      className="px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer"
                      style={ratioFilter === r
                        ? { background: P.magenta, color: '#fff' }
                        : { background: T.bgCard, color: T.textSub }}>
                      {r}
                    </button>
                  ))}
                </div>
                <span className="text-[10.5px] font-medium ml-auto" style={{ color: T.textMuted }}>Hover to play video · reveal prompt</span>
              </div>

              {filteredMasonry.length > 0 ? (
                <div style={{ columnCount: 4, columnGap: '12px' }}>
                  {filteredMasonry.map((asset, i) => (
                    <div key={i} onClick={() => onToolClick(asset.type === 'video' ? 'video' : 'image')} style={{ breakInside: 'avoid', marginBottom: '12px' }}>
                      <MasonryCard asset={asset} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center text-[13px] font-medium" style={{ color: T.textMuted }}>
                  No {assetFilter !== 'All' ? assetFilter.toLowerCase() : ''} content matching current filters
                </div>
              )}
            </section>

          </div>
        )}
      </div>
    </div>
  );
}
