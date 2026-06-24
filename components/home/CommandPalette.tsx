'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Search, ImageIcon, Video, Mic, FolderOpen,
  LayoutTemplate, Layers, Star, Keyboard, GraduationCap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ACTIONS = [
  { icon: Star,          label: 'Search stock',       shortcut: 'Ctrl S' },
  { icon: ImageIcon,     label: 'Create image',       shortcut: 'Ctrl F' },
  { icon: Layers,        label: 'Edit Image',         shortcut: 'Ctrl E' },
  { icon: ImageIcon,     label: 'Image Upscaler',     shortcut: 'Ctrl U' },
  { icon: LayoutTemplate,label: 'Create a space',     shortcut: 'Ctrl L' },
  { icon: Video,         label: 'Create video',       shortcut: 'Ctrl V' },
  { icon: Video,         label: 'Edit video',         shortcut: null },
  { icon: Mic,           label: 'Create audio',       shortcut: null },
  { icon: FolderOpen,    label: 'Go to projects',     shortcut: 'Ctrl O' },
  { icon: GraduationCap, label: 'Learn with Academy', shortcut: null },
  { icon: Keyboard,      label: 'Keyboard shortcuts', shortcut: null },
];

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery]   = useState('');
  const [focused, setFocused] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = ACTIONS.filter(a =>
    !query || a.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (open) {
      setQuery('');
      setFocused(0);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') { e.preventDefault(); setFocused(f => Math.min(f + 1, filtered.length - 1)); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setFocused(f => Math.max(f - 1, 0)); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, filtered.length, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh]"
          onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
          <div className="absolute inset-0 bg-black/15 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg bg-white border border-zinc-200/80 rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.15)] overflow-hidden"
          >
            {/* Input row */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-zinc-100">
              <Search className="w-4 h-4 text-zinc-400 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={e => { setQuery(e.target.value); setFocused(0); }}
                placeholder="Ask Spectrum or navigate to tools"
                className="flex-1 text-[14px] text-zinc-900 placeholder-zinc-400 outline-none bg-transparent"
              />
              <span className="text-[10px] text-zinc-400 font-mono bg-zinc-100 px-2 py-0.5 rounded-md">Ctrl K</span>
            </div>

            {/* Quick actions list */}
            <div className="py-2 max-h-72 overflow-y-auto">
              {filtered.length > 0 && (
                <p className="text-[9px] font-semibold uppercase tracking-widest text-zinc-400 px-4 py-1.5">Quick Actions</p>
              )}
              {filtered.map((action, i) => {
                const Icon = action.icon;
                const isActive = focused === i;
                return (
                  <button
                    key={action.label}
                    onMouseEnter={() => setFocused(i)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer ${
                      isActive ? 'bg-zinc-50' : ''
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                      isActive ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-500'
                    }`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className={`flex-1 text-[13px] font-medium transition-colors ${
                      isActive ? 'text-zinc-900' : 'text-zinc-600'
                    }`}>
                      {action.label}
                    </span>
                    {action.shortcut && (
                      <span className="text-[10px] text-zinc-400 font-mono bg-zinc-100 px-1.5 py-0.5 rounded-md">{action.shortcut}</span>
                    )}
                    {isActive && (
                      <span className="text-[10px] text-zinc-400 font-mono bg-zinc-100 px-1.5 py-0.5 rounded-md">↵</span>
                    )}
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <p className="text-center text-[13px] text-zinc-400 py-8">No results for "{query}"</p>
              )}
            </div>

            {/* Footer hints */}
            <div className="flex items-center gap-5 px-4 py-2.5 border-t border-zinc-100">
              <span className="text-[10px] text-zinc-400">↑↓ Navigate</span>
              <span className="text-[10px] text-zinc-400">↵ Select</span>
              <span className="text-[10px] text-zinc-400">ESC Close</span>
              <span className="text-[10px] text-zinc-400 ml-auto">⇧↵ Open in new tab</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
