'use client';

import React, { useState } from 'react';
import { ArrowRight, Heart, Zap, Film, Wand2, Users, Check } from 'lucide-react';

const P = {
  rose: '#D97B8C', orange: '#F5B080', hotPink: '#F093AA',
  coral: '#F0A4AF', peach: '#FFBF80', vivid: '#F5956A',
  magenta: '#D490CC', yellow: '#FFF6A6',
};

const IMGS = [
  '/pexels-didsss-2791056.jpg',
  '/pexels-ganajp-15698413.jpg',
  '/pexels-olga-178200755-12367292.jpg',
  '/pexels-prathsnap-3168209.jpg',
];

/* Small 4s clips for hover preview — light on bandwidth */
const V = {
  v1: '/13167255_trimmed_4s.mp4',
  v2: '/14674120_trimmed_4s.mp4',
  v3: '/8312047_trimmed_4s.mp4',
  v4: '/18120715_trimmed_4s.mp4',
  v5: '/16034575_trimmed_4s.mp4',
  v6: '/15498647_trimmed_4s.mp4',
  showcase: '/trimmed_15475072_3840_2160_30fps.mp4',
};

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

interface MasonryAsset extends Asset {
  ar: string;
}

/* ── Masonry feed — true mixed image/video grid ───────────────────────────── */

const MASONRY_ASSETS: MasonryAsset[] = [
  { src: IMGS[0], prompt: 'cinematic portrait, golden hour venetian blinds, 35mm Fujifilm grain', model: 'Portrait Ultra', seed: '4829301', ratio: '3:2', type: 'image', tag: 'Portrait', likes: 2841, ar: '3/2', creatorInitial: 'J', creatorColor: P.rose },
  { src: IMGS[1], prompt: 'vertical fashion editorial, neon city background, ultra-sharp Vogue', model: 'Portrait Ultra', seed: '8811234', ratio: '9:16', type: 'video', videoSrc: V.v5, tag: 'Fashion', likes: 5600, ar: '9/16', creatorInitial: 'K', creatorColor: P.vivid },
  { src: IMGS[2], prompt: 'macro product photography, luxury timepiece, razor-sharp depth of field', model: 'Product Studio', seed: '2290811', ratio: '1:1', type: 'image', tag: 'Studio', likes: 3104, ar: '1/1', creatorInitial: 'A', creatorColor: P.hotPink },
  { src: IMGS[3], prompt: 'aerial establishing shot, megacity at dusk, neon reflections on wet streets', model: 'Landscape Pro', seed: '7731044', ratio: '16:9', type: 'video', videoSrc: V.showcase, tag: 'Aerial', likes: 1923, ar: '16/9', creatorInitial: 'S', creatorColor: P.magenta },
  { src: IMGS[0], prompt: 'avant-garde streetwear, Tokyo alley, Vogue magazine editorial shoot', model: 'Portrait Ultra', seed: '1239087', ratio: '2:3', type: 'video', videoSrc: V.v2, tag: 'Streetwear', likes: 4400, ar: '2/3', creatorInitial: 'M', creatorColor: P.orange },
  { src: IMGS[1], prompt: 'cinematic sky and clouds, dramatic lighting, golden hour wide landscape', model: 'Cinematic', seed: '9938272', ratio: '16:9', type: 'image', tag: 'Landscape', likes: 1204, ar: '16/9', creatorInitial: 'R', creatorColor: P.coral },
  { src: IMGS[2], prompt: 'neon cyberpunk portrait, fast turbo generation, vivid tones', model: 'Turbo v2', seed: '1029384', ratio: '1:1', type: 'image', tag: 'Cyberpunk', likes: 892, ar: '1/1', creatorInitial: 'N', creatorColor: P.peach },
  { src: IMGS[3], prompt: 'luxury brand campaign, white studio, couture model, high-key lighting', model: 'Product Studio', seed: '3344551', ratio: '2:3', type: 'video', videoSrc: V.v6, tag: 'Luxury', likes: 3900, ar: '2/3', creatorInitial: 'V', creatorColor: P.rose },
  { src: IMGS[0], prompt: 'golden hour street portrait, warm cinematic grade, film grain overlay', model: 'Turbo v2', seed: '6629018', ratio: '3:2', type: 'image', tag: 'Street', likes: 740, ar: '3/2', creatorInitial: 'L', creatorColor: P.vivid },
  { src: IMGS[1], prompt: 'abstract geometric neon, instant generation, bold electric colors', model: 'Turbo v2', seed: '3847561', ratio: '9:16', type: 'video', videoSrc: V.v4, tag: 'Abstract', likes: 540, ar: '9/16', creatorInitial: 'T', creatorColor: P.magenta },
];

/* ── Showcase sections ────────────────────────────────────────────────────── */

const CINEMATIC: Asset[] = [
  { src: IMGS[3], prompt: 'aerial establishing shot, megacity at dusk, neon reflections, ARRI Alexa cinematic', model: 'Landscape Pro', seed: '7731044', ratio: '16:9', type: 'video', videoSrc: V.showcase, tag: '4K Cinematic', likes: 2841, creatorInitial: 'J', creatorColor: P.rose },
  { src: IMGS[0], prompt: 'cinematic portrait, golden hour venetian blinds, 35mm Fujifilm grain, IMAX 4K', model: 'Portrait Ultra', seed: '4829301', ratio: '3:2', type: 'image', tag: 'Portrait', likes: 1923, creatorInitial: 'S', creatorColor: P.vivid },
  { src: IMGS[2], prompt: 'macro product photography, luxury timepiece, razor-sharp depth, studio chrome 8K', model: 'Product Studio', seed: '2290811', ratio: '1:1', type: 'image', tag: 'Studio', likes: 3104, creatorInitial: 'A', creatorColor: P.hotPink },
];

const TURBO: Asset[] = [
  { src: IMGS[3], prompt: 'neon cyberpunk portrait, fast turbo generation', model: 'Turbo v2', seed: '1029384', ratio: '1:1', type: 'video', videoSrc: V.v1, likes: 892, creatorInitial: 'N', creatorColor: P.magenta },
  { src: IMGS[0], prompt: 'minimal product shot, clean white, speed optimized', model: 'Turbo v2', seed: '5571293', ratio: '1:1', type: 'image', likes: 671, creatorInitial: 'K', creatorColor: P.orange },
  { src: IMGS[1], prompt: 'cinematic sky and clouds, fast vivid tones', model: 'Turbo v2', seed: '9938272', ratio: '16:9', type: 'video', videoSrc: V.v3, likes: 1204, creatorInitial: 'R', creatorColor: P.coral },
  { src: IMGS[2], prompt: 'abstract geometric neon, instant generation', model: 'Turbo v2', seed: '3847561', ratio: '1:1', type: 'image', likes: 540, creatorInitial: 'T', creatorColor: P.peach },
  { src: IMGS[3], prompt: 'golden hour street portrait turbo fast', model: 'Turbo v2', seed: '6629018', ratio: '3:2', type: 'video', videoSrc: V.v4, likes: 740, creatorInitial: 'L', creatorColor: P.vivid },
];

const VFX_PRESETS = [
  { title: 'CGI Breakdown', desc: 'Object dissolving into glowing particles, dark bg', prompt: 'CGI breakdown effect, object disintegrating into glowing particles, dark background, 4K VFX, cinematic', color: P.vivid },
  { title: 'Cybernetic Assembly', desc: 'Robotic structures self-assembling in slow motion', prompt: 'cybernetic assembly, metallic components forming, slow motion, chrome and neon, IMAX quality', color: P.orange },
  { title: 'Sci-Fi Portal', desc: 'Interdimensional wormhole with swirling energy', prompt: 'sci-fi energy portal opening, swirling vortex, deep space background, lens flare, cinematic color grade', color: P.coral },
  { title: 'Hero Landing', desc: 'Shockwave impact on concrete with dust particles', prompt: 'superhero landing, ground shockwave impact, dust particles, golden backlight, slow motion 240fps, IMAX', color: P.peach },
];

const SOCIAL_PRESETS = [
  { title: '2000s Paparazzi Flash', desc: 'Blown-out flash for instant virality', prompt: 'paparazzi flash photography, 2000s celebrity tabloid aesthetic, overexposed, 35mm film grain, viral', color: P.orange },
  { title: 'Neon Glitch', desc: 'RGB split with cyber overlays — TikTok gold', prompt: 'neon glitch effect, RGB channel split, cyber noise overlay, dark background, vertical social format 9:16', color: P.magenta },
  { title: 'Cinematic Transition', desc: 'Whip-pan with motion blur for high retention', prompt: 'cinematic whip pan transition, motion blur cut, professional grade, social media format, 9:16', color: P.hotPink },
  { title: 'Dreamy Lo-Fi', desc: 'Soft grain, pastel tones — aesthetic editorial', prompt: 'lo-fi aesthetic, soft film grain, warm pastel tones, dreamy overcast light, editorial photography', color: P.peach },
];

const CHARACTER_WORLDS: Asset[] = [
  { src: IMGS[0], prompt: 'same character — cyberpunk city alley, neon rain, blade runner, consistent identity', model: 'Character Engine', seed: '7812309', ratio: '3:2', type: 'image', tag: 'Cyberpunk', likes: 4200, creatorInitial: 'J', creatorColor: P.rose },
  { src: IMGS[1], prompt: 'same character — feudal japan, cherry blossoms, warm golden sunset', model: 'Character Engine', seed: '7812309', ratio: '3:2', type: 'image', tag: 'Feudal Japan', likes: 3800, creatorInitial: 'J', creatorColor: P.rose },
  { src: IMGS[2], prompt: 'same character — arctic expedition, snowstorm, heavy fur parka', model: 'Character Engine', seed: '7812309', ratio: '3:2', type: 'image', tag: 'Arctic', likes: 2900, creatorInitial: 'J', creatorColor: P.rose },
  { src: IMGS[3], prompt: 'same character — 1920s paris cafe, art deco interior, warm candlelight', model: 'Character Engine', seed: '7812309', ratio: '3:2', type: 'image', tag: '1920s Paris', likes: 3400, creatorInitial: 'J', creatorColor: P.rose },
];

const FASHION_ASSETS: Asset[] = [
  { src: IMGS[0], prompt: 'high fashion editorial, avant-garde streetwear, Tokyo alley, Vogue magazine', model: 'Portrait Ultra', seed: '1239087', ratio: '2:3', type: 'video', videoSrc: V.v2, likes: 5600, creatorInitial: 'M', creatorColor: P.magenta },
  { src: IMGS[1], prompt: 'luxury brand campaign, minimalist white studio, couture, Balenciaga vibe', model: 'Product Studio', seed: '8811234', ratio: '2:3', type: 'image', likes: 4400, creatorInitial: 'V', creatorColor: P.vivid },
  { src: IMGS[2], prompt: 'street style, urban fashion, vibrant color blocking, natural daylight, i-D magazine', model: 'Portrait Ultra', seed: '3344551', ratio: '2:3', type: 'image', likes: 3900, creatorInitial: 'K', creatorColor: P.hotPink },
];

/* ── MediaCard — unified image/video card with hover play + HUD ──────────── */

function MediaCard({
  asset, className, style: styleProp,
}: {
  asset: Asset; className?: string; style?: React.CSSProperties;
}) {
  return (
    <div className={`group relative overflow-hidden cursor-pointer ${className ?? ''}`} style={styleProp}>
      {/* Fallback image shown while video loads */}
      <img src={asset.src} alt="" loading="lazy"
        className="w-full h-full object-cover" />
      {asset.type === 'video' && asset.videoSrc && (
        <video autoPlay loop muted playsInline preload="auto"
          className="absolute inset-0 w-full h-full object-cover">
          <source src={asset.videoSrc} type="video/mp4" />
        </video>
      )}
    </div>
  );
}

/* ── HUD Overlay — creator avatar + action buttons + bottom prompt bar ───── */

function HUDOverlay({ asset }: { asset: Asset }) {
  return (
    <>
      {/* Creator avatar — top left */}
      {asset.creatorInitial && (
        <div className="absolute top-2.5 left-2.5 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-0.5 group-hover:translate-y-0">
          <div className="w-7 h-7 rounded-full border-2 border-white/60 flex items-center justify-center text-[9px] font-bold text-white shadow-md"
            style={{ background: asset.creatorColor || P.vivid }}>
            {asset.creatorInitial}
          </div>
        </div>
      )}

      {/* Floating Heart + Remix — right */}
      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0">
        <button
          className="w-7 h-7 rounded-full flex items-center justify-center text-white cursor-pointer hover:scale-110 transition-transform"
          style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)' }}
          onClick={e => e.stopPropagation()}>
          <Heart className="w-3 h-3" />
        </button>
        <button
          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-white cursor-pointer hover:scale-110 transition-transform"
          style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)' }}
          onClick={e => e.stopPropagation()}>
          ✦
        </button>
      </div>

      {/* Bottom gradient — prompt + tag + likes */}
      <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, transparent 100%)', padding: '28px 12px 12px' }}>
        <p className="text-[9px] text-white/75 leading-snug line-clamp-2 mb-1.5">{asset.prompt}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 flex-wrap">
            {asset.tag && (
              <span className="inline-block text-[8px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: P.vivid + 'cc', color: '#fff' }}>
                {asset.tag}
              </span>
            )}
            <span className="text-[8px] font-mono text-white/40">{asset.model}</span>
          </div>
          {asset.likes && (
            <div className="flex items-center gap-1 shrink-0">
              <Heart className="w-2.5 h-2.5 text-rose-400 fill-rose-400" />
              <span className="text-[8.5px] text-white/50">{asset.likes.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ── Masonry card — uses MediaCard + HUDOverlay ───────────────────────────── */

function MasonryCard({ asset }: { asset: MasonryAsset }) {
  return (
    <div className="group relative rounded-2xl overflow-hidden cursor-pointer" style={{ aspectRatio: asset.ar }}>
      <MediaCard asset={asset} className="absolute inset-0 w-full h-full rounded-2xl" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
      <HUDOverlay asset={asset} />
    </div>
  );
}

function SectionHeader({ label, badge, color, action, onAction }: { label: string; badge?: string; color?: string; action?: string; onAction?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2.5">
        {badge && (
          <span className="text-[8.5px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border"
            style={{ color, borderColor: color, background: `${color}15` }}>
            {badge}
          </span>
        )}
        <h2 className="text-[17px] font-black text-zinc-900 tracking-[-0.02em]">{label}</h2>
      </div>
      {action && (
        <button onClick={onAction}
          className="flex items-center gap-1 text-[11.5px] font-medium text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer">
          {action} <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

export default function ExploreView({ onToolClick = () => {} }: { onToolClick?: (id: string) => void }) {
  const [assetFilter, setAssetFilter] = useState('All');
  const [ratioFilter, setRatioFilter] = useState('All');
  const [copied, setCopied]           = useState<string | null>(null);

  const tryPreset = (title: string) => {
    setCopied(title);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">

      {/* ── Filter bar ── */}
      <div className="h-11 border-b border-zinc-100 px-6 flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-1">
          {['All', 'Images', 'Video', 'Audio'].map(f => (
            <button key={f} onClick={() => setAssetFilter(f)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${assetFilter === f ? 'text-white' : 'text-zinc-500 bg-zinc-100 hover:bg-zinc-200'}`}
              style={assetFilter === f ? { background: P.vivid } : {}}>
              {f}
            </button>
          ))}
        </div>
        <div className="w-px h-4 bg-zinc-200" />
        <div className="flex items-center gap-1">
          {['All', '9:16', '16:9', '1:1'].map(r => (
            <button key={r} onClick={() => setRatioFilter(r)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${ratioFilter === r ? 'text-white' : 'text-zinc-500 bg-zinc-100 hover:bg-zinc-200'}`}
              style={ratioFilter === r ? { background: P.magenta } : {}}>
              {r}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <span className="text-[10.5px] text-zinc-400 font-medium">Hover to play video · reveal prompt + seed</span>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-8 py-7 space-y-14">

          {/* ══ MASONRY FEED ══ */}
          <section>
            <SectionHeader label="Featured Creations" badge="LIVE FEED" color={P.rose} action="View all" onAction={() => onToolClick('explore')} />
            <div style={{ columnCount: 4, columnGap: '12px' }}>
              {MASONRY_ASSETS.map((asset, i) => (
                <div key={i} onClick={() => onToolClick('image')} style={{ breakInside: 'avoid', marginBottom: '12px' }}>
                  <MasonryCard asset={asset} />
                </div>
              ))}
            </div>
          </section>

          {/* ══ SECTION 1: Model Showcases ══ */}
          <section>
            <SectionHeader label="Model Showcases" badge="FLEX ZONE" color={P.vivid} action="View all models" onAction={() => onToolClick('explore')} />

            {/* 4K Cinematic — first card is video */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Film className="w-3.5 h-3.5" style={{ color: P.vivid }} />
                <span className="text-[10.5px] font-bold uppercase tracking-widest text-zinc-500">4K · Native Cinematic</span>
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

            {/* Speed / Turbo — mix of video + image */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-3.5 h-3.5" style={{ color: P.orange }} />
                <span className="text-[10.5px] font-bold uppercase tracking-widest text-zinc-500">Speed · Turbo Mode</span>
                <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-orange-600">
                  ⚡ Under 10 seconds
                </span>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                {TURBO.map((asset, i) => (
                  <div key={i} onClick={() => onToolClick('image')} className="group relative shrink-0 w-44 h-44 rounded-2xl overflow-hidden cursor-pointer border border-zinc-200 hover:border-zinc-300 transition-colors">
                    <MediaCard asset={asset} className="absolute inset-0 w-full h-full" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute top-2 right-2 text-[8px] font-bold px-1.5 py-0.5 rounded-full text-white pointer-events-none"
                      style={{ background: P.orange + 'cc' }}>
                      {asset.type === 'video' ? '▶' : '⚡'} Turbo
                    </div>
                    <HUDOverlay asset={asset} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ══ SECTION 2: Click-to-Run Presets ══ */}
          <section>
            <SectionHeader label="Click-to-Run Presets" badge="ACTION ZONE" color={P.hotPink} action="Browse all presets" onAction={() => onToolClick('explore')} />

            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <Wand2 className="w-3.5 h-3.5" style={{ color: P.coral }} />
                <span className="text-[10.5px] font-bold uppercase tracking-widest text-zinc-500">Hollywood VFX</span>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {VFX_PRESETS.map((preset, i) => (
                  <div key={i} className="group bg-zinc-950 rounded-2xl p-5 cursor-pointer hover:bg-zinc-900 transition-colors relative overflow-hidden flex flex-col" style={{ minHeight: 190 }}>
                    <div className="absolute top-0 right-0 w-28 h-28 rounded-full blur-3xl opacity-25 -translate-y-6 translate-x-6 pointer-events-none"
                      style={{ background: preset.color }} />
                    <div className="relative flex flex-col flex-1">
                      <span className="self-start text-[8.5px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-3"
                        style={{ color: preset.color, background: preset.color + '20', border: `1px solid ${preset.color}40` }}>
                        ✦ VFX
                      </span>
                      <h3 className="text-[13.5px] font-black text-white mb-1.5 leading-snug">{preset.title}</h3>
                      <p className="text-[11px] text-white/40 leading-normal flex-1">{preset.desc}</p>
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
                <span className="text-[10.5px] font-bold uppercase tracking-widest text-zinc-500">Social Media Hooks</span>
                <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-500">TikTok · Reels · Shorts</span>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {SOCIAL_PRESETS.map((preset, i) => (
                  <div key={i} className="bg-zinc-950 rounded-2xl p-5 cursor-pointer hover:bg-zinc-900 transition-colors relative overflow-hidden flex flex-col" style={{ minHeight: 190 }}>
                    <div className="absolute top-0 right-0 w-28 h-28 rounded-full blur-3xl opacity-25 -translate-y-6 translate-x-6 pointer-events-none"
                      style={{ background: preset.color }} />
                    <div className="relative flex flex-col flex-1">
                      <span className="self-start text-[8.5px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-3"
                        style={{ color: preset.color, background: preset.color + '20', border: `1px solid ${preset.color}40` }}>
                        ✦ Social
                      </span>
                      <h3 className="text-[13.5px] font-black text-white mb-1.5 leading-snug">{preset.title}</h3>
                      <p className="text-[11px] text-white/40 leading-normal flex-1">{preset.desc}</p>
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

          {/* ══ SECTION 3: Studio Modules ══ */}
          <section>
            <SectionHeader label="Studio Modules" badge="UPSELL" color={P.orange} action="Open Studios" onAction={() => onToolClick('spaces')} />
            <div className="grid grid-cols-2 gap-4">

              <div onClick={() => onToolClick('image')} className="bg-zinc-950 rounded-2xl p-6 relative overflow-hidden cursor-pointer hover:bg-zinc-900 transition-colors" style={{ minHeight: 230 }}>
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 85% 15%, ${P.vivid}35 0%, transparent 55%)` }} />
                <div className="relative">
                  <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                    style={{ color: P.vivid, background: P.vivid + '20', border: `1px solid ${P.vivid}40` }}>
                    Marketing
                  </span>
                  <h3 className="text-[20px] font-black text-white mt-3 mb-2 leading-tight">Marketing &<br />Ad Automation</h3>
                  <p className="text-[12px] text-white/50 mb-4 leading-relaxed max-w-xs">
                    One product prompt generates a full ad campaign — social variants, banners, and reels automatically.
                  </p>
                  <div className="flex gap-2">
                    {IMGS.slice(0, 3).map((src, i) => (
                      <div key={i} className="flex-1 aspect-square rounded-xl overflow-hidden border border-white/10">
                        <img src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    <div className="flex-1 aspect-square rounded-xl border border-white/10 bg-white/5 flex items-center justify-center">
                      <span className="text-[11px] font-bold text-white/30">+12</span>
                    </div>
                  </div>
                </div>
              </div>

              <div onClick={() => onToolClick('spaces')} className="bg-zinc-950 rounded-2xl p-6 relative overflow-hidden cursor-pointer hover:bg-zinc-900 transition-colors" style={{ minHeight: 230 }}>
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 15% 85%, ${P.magenta}30 0%, transparent 55%)` }} />
                <div className="relative">
                  <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                    style={{ color: P.magenta, background: P.magenta + '20', border: `1px solid ${P.magenta}40` }}>
                    Canvas
                  </span>
                  <h3 className="text-[20px] font-black text-white mt-3 mb-2 leading-tight">Infinite<br />Workflow Canvas</h3>
                  <p className="text-[12px] text-white/50 mb-4 leading-relaxed max-w-xs">
                    Chain AI nodes visually. Drag Text → Image → Video → Upscale on one spatial board.
                  </p>
                  <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 relative overflow-hidden">
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
                          {i < 3 && <div className="flex-1 h-px border-t border-dashed border-white/20 min-w-[12px]" />}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ══ SECTION 4: Character & Identity ══ */}
          <section>
            <SectionHeader label="Character & Identity" badge="COMMUNITY" color={P.peach} action="Explore characters" onAction={() => onToolClick('characters')} />

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-3.5 h-3.5" style={{ color: P.peach }} />
                <span className="text-[10.5px] font-bold uppercase tracking-widest text-zinc-500">Same Character, New World</span>
                <span className="text-[9px] font-medium text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">Seed locked · Identity consistent</span>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                {CHARACTER_WORLDS.map((asset, i) => (
                  <div key={i} onClick={() => onToolClick('characters')} className="group relative shrink-0 rounded-2xl overflow-hidden cursor-pointer border border-zinc-200 hover:border-zinc-300 transition-colors"
                    style={{ width: 220, height: 150 }}>
                    <img src={asset.src} alt="" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[8.5px] font-bold"
                      style={{ background: P.peach + 'cc', color: '#78350f' }}>
                      {asset.tag}
                    </div>
                    <HUDOverlay asset={asset} />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: P.magenta }} />
                <span className="text-[10.5px] font-bold uppercase tracking-widest text-zinc-500">Culture & Fashion</span>
                <span className="text-[9px] text-zinc-400 font-medium">Ultra-stylized · Brand managers & designers</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {FASHION_ASSETS.map((asset, i) => (
                  <div key={i} onClick={() => onToolClick('image')} className="group relative rounded-2xl overflow-hidden cursor-pointer" style={{ aspectRatio: '2/3' }}>
                    <MediaCard asset={asset} className="absolute inset-0 w-full h-full" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                    <HUDOverlay asset={asset} />
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
