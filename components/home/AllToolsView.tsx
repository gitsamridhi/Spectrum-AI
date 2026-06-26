'use client';

import React, { useState } from 'react';
import {
  ImageIcon, Video, Mic, LayoutTemplate, Box, Zap, Maximize2, Droplets,
  Palette, Wand2, ScanLine, Layers, Bot, X, Search, Pin,
  Sparkles, Camera, Crop, Shuffle, RefreshCcw, Clapperboard,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/app/context/ThemeContext';

const CATS = ['All', 'Image', 'Video', 'Audio', 'Spaces', 'Design', '3D', 'Flows'];

const CAT_COLOR: Record<string, { bg: string; fg: string }> = {
  Image:  { bg: '#FFF0F3', fg: '#C94060' },
  Video:  { bg: '#FFF7ED', fg: '#D97E3A' },
  Audio:  { bg: '#F5F3FF', fg: '#7C3AED' },
  Spaces: { bg: '#EEF2FF', fg: '#4338CA' },
  Design: { bg: '#FFFBEB', fg: '#B45309' },
  '3D':   { bg: '#F0FDF4', fg: '#059669' },
  Flows:  { bg: '#F0F9FF', fg: '#0284C7' },
};

const TOOLS = [
  // Image
  { cat: 'Image',  icon: ImageIcon,     label: 'Image Generator',    desc: 'Create images from text prompts',          id: 'image',     pinned: true  },
  { cat: 'Image',  icon: Bot,           label: 'Assistant',          desc: 'Chat, create, and edit with AI',           id: 'assistant', pinned: true  },
  { cat: 'Image',  icon: Wand2,         label: 'Image Editor',       desc: 'Edit and modify existing images',          id: 'image',     pinned: false },
  { cat: 'Image',  icon: Zap,           label: 'Image Upscaler',     desc: 'Enhance resolution and detail',            id: 'image',     pinned: false },
  { cat: 'Image',  icon: Clapperboard,  label: 'Cinematic Shot',     desc: 'Generate cinematic compositions',          id: 'video',     pinned: false },
  { cat: 'Image',  icon: Shuffle,       label: 'Variations',         desc: 'Create variations of an image',            id: 'image',     pinned: false },
  { cat: 'Image',  icon: Droplets,      label: 'Skin Enhancer',      desc: 'Retouch and enhance skin details',         id: 'image',     pinned: false },
  { cat: 'Image',  icon: Camera,        label: 'Change Camera',      desc: 'Adjust camera angle and lens',             id: 'image',     pinned: false },
  { cat: 'Image',  icon: Layers,        label: 'Mockup Generator',   desc: 'Place designs on product mockups',         id: 'image',     pinned: false },
  { cat: 'Image',  icon: ScanLine,      label: 'Remove Background',  desc: 'Isolate subjects from backgrounds',        id: 'image',     pinned: false },
  { cat: 'Image',  icon: Palette,       label: 'Relight',            desc: 'Change lighting and atmosphere',           id: 'image',     pinned: false },
  { cat: 'Image',  icon: Crop,          label: 'Smart Crop',         desc: 'Auto-crop with subject awareness',         id: 'image',     pinned: false },
  // Video
  { cat: 'Video',  icon: Video,         label: 'Video Generator',    desc: 'Text or image to video',                   id: 'video',     pinned: true  },
  { cat: 'Video',  icon: RefreshCcw,    label: 'Video Upscaler',     desc: 'Enhance video resolution to 4K',           id: 'video',     pinned: false },
  // Audio
  { cat: 'Audio',  icon: Mic,           label: 'Voice Generator',    desc: 'Text to speech and voice cloning',         id: 'voice',     pinned: false },
  // Spaces
  { cat: 'Spaces', icon: LayoutTemplate,label: 'Spaces',             desc: 'Build and run AI workflows visually',      id: 'spaces',    pinned: false },
  // 3D
  { cat: '3D',     icon: Box,           label: '3D Generation',      desc: 'Image or text to 3D models',               id: 'image',     pinned: false },
  // Flows
  { cat: 'Flows',  icon: Layers,        label: 'Batch Process',      desc: 'Process multiple files at once',           id: 'image',     pinned: false },
  { cat: 'Flows',  icon: Maximize2,     label: 'Upscale 8×',         desc: 'Up to 8× resolution enhancement',         id: 'image',     pinned: false },
  { cat: 'Flows',  icon: Sparkles,      label: 'Consistent Character','desc': 'Keep faces consistent across scenes',    id: 'characters',pinned: false },
];

interface AllToolsViewProps {
  onClose: () => void;
  onNavigate: (id: string) => void;
}

export default function AllToolsView({ onClose, onNavigate }: AllToolsViewProps) {
  const { isDark, T } = useTheme();
  const [cat,   setCat]   = useState('All');
  const [query, setQuery] = useState('');

  const filtered = TOOLS.filter(t => {
    const matchCat = cat === 'All' || t.cat === cat;
    const matchQ   = !query || t.label.toLowerCase().includes(query.toLowerCase()) || t.desc.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQ;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
          onClick={onClose}
        />

        {/* Modal card */}
        <motion.div
          key="tools-modal"
          initial={{ scale: 0.96, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 10 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          style={{ background: T.bg, maxWidth: 920, maxHeight: '82vh' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Tab + search header */}
          <div className="px-6 pt-5 pb-4 shrink-0 flex items-center gap-4" style={{ borderBottom: `1px solid ${T.borderMuted}` }}>
            <div className="flex items-center gap-0.5 flex-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {CATS.map(c => (
                <button key={c} onClick={() => setCat(c)}
                  className="shrink-0 px-3.5 py-2 rounded-full text-[12.5px] font-semibold transition-all cursor-pointer"
                  style={cat === c
                    ? { background: T.text, color: T.bg }
                    : { color: T.textSub }}>
                  {c}
                </button>
              ))}
            </div>

            <div className="relative shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: T.textMuted }} />
              <input value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search for tools and flows"
                className="pl-9 pr-4 py-2 rounded-xl text-[12px] outline-none transition-colors w-52"
                style={{ background: T.inputBg, border: `1px solid ${T.border}`, color: T.text }} />
            </div>

            <button onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-colors shrink-0"
              style={{ color: T.textMuted }}>
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tools grid */}
          <div className="flex-1 overflow-y-auto px-5 py-4" style={{ scrollbarWidth: 'none' }}>
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-[13px]" style={{ color: T.textMuted }}>No tools match "{query}"</div>
            ) : (
              <div className="grid grid-cols-3 gap-0.5">
                {filtered.map((tool, i) => {
                  const Icon = tool.icon;
                  return (
                    <button key={i} onClick={() => { onNavigate(tool.id); onClose(); }}
                      className="group flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-colors cursor-pointer text-left"
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = T.bgHover}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                        style={{ background: isDark ? (CAT_COLOR[tool.cat]?.bg ?? '#F4F4F5') + '18' : (CAT_COLOR[tool.cat]?.bg ?? '#F4F4F5') }}>
                        <Icon className="w-[17px] h-[17px]"
                          style={{ color: CAT_COLOR[tool.cat]?.fg ?? '#52525B' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold leading-snug" style={{ color: T.text }}>{tool.label}</p>
                        <p className="text-[11px] mt-0.5 leading-snug truncate" style={{ color: T.textMuted }}>{tool.desc}</p>
                      </div>
                      {tool.pinned && (
                        <Pin className="w-3.5 h-3.5 shrink-0" style={{ color: T.textMuted }} />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
