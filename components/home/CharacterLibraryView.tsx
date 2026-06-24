'use client';

import React, { useState, useRef } from 'react';
import {
  Plus, Search, Pin, PinOff, Edit3, Trash2, X, Upload,
  ChevronDown, Clock, Zap, Check, MoreHorizontal, Users,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const P = {
  rose: '#e11d48', orange: '#FFB347', hotPink: '#FF2D6B',
  coral: '#FF6B86', vivid: '#FF7000', magenta: '#F060EE',
  peach: '#FFBF80',
};

const IMGS = [
  '/pexels-didsss-2791056.jpg',
  '/pexels-ganajp-15698413.jpg',
  '/pexels-olga-178200755-12367292.jpg',
  '/pexels-prathsnap-3168209.jpg',
];

const TAGS = ['Portrait', 'Fashion', 'Action', 'Anime', 'Fantasy', 'Sci-Fi', 'Vintage', 'Other'];

export interface PinnedChar {
  id: string;
  name: string;
  color: string;
  refs: string[];
}

const TAG_COLORS: Record<string, string> = {
  Portrait: P.rose,
  Fashion: P.magenta,
  Action: P.vivid,
  Anime: P.orange,
  Fantasy: P.coral,
  'Sci-Fi': '#2563EB',
  Vintage: '#92400E',
  Other: '#71717A',
};

interface RefImg { id: string; src: string; }
interface UsageEntry { id: string; prompt: string; model: string; date: string; thumb: string; }

interface Character {
  id: string;
  name: string;
  avatar: string;
  refs: RefImg[];
  notes: string;
  usageCount: number;
  lastUsed: string;
  tag: string;
  color: string;
  usage: UsageEntry[];
}

const INIT: Character[] = [
  {
    id: '1', name: 'Aria Chen', avatar: IMGS[0], tag: 'Portrait', color: P.rose,
    refs: [{ id: 'r1', src: IMGS[0] }, { id: 'r2', src: IMGS[1] }, { id: 'r3', src: IMGS[2] }],
    notes: 'Cyberpunk protagonist. Short black hair, athletic build, high cheekbones, determined expression. Works best in neon-lit urban environments.',
    usageCount: 24, lastUsed: '2h ago',
    usage: [
      { id: 'u1', prompt: 'cinematic portrait, golden hour venetian blinds', model: 'Portrait Ultra', date: '2h ago', thumb: IMGS[0] },
      { id: 'u2', prompt: 'cyberpunk alley, neon rain, blade runner vibes', model: 'Sci-Fi', date: '1d ago', thumb: IMGS[1] },
      { id: 'u3', prompt: 'product fashion campaign, clean white studio', model: 'Product Studio', date: '3d ago', thumb: IMGS[2] },
    ],
  },
  {
    id: '2', name: 'Marcus Stone', avatar: IMGS[1], tag: 'Action', color: P.vivid,
    refs: [{ id: 'r4', src: IMGS[1] }, { id: 'r5', src: IMGS[3] }],
    notes: 'Action hero archetype. Broad shoulders, defined jawline, mid-30s stubble. Dramatic lighting elevates his look significantly.',
    usageCount: 18, lastUsed: '1d ago',
    usage: [
      { id: 'u4', prompt: 'hero landing, dust explosion, slow motion', model: 'Cinematic', date: '1d ago', thumb: IMGS[1] },
      { id: 'u5', prompt: 'arctic expedition, snowstorm, heavy parka', model: 'Landscape Pro', date: '4d ago', thumb: IMGS[3] },
    ],
  },
  {
    id: '3', name: 'Elena Vasquez', avatar: IMGS[2], tag: 'Fashion', color: P.magenta,
    refs: [{ id: 'r6', src: IMGS[2] }, { id: 'r7', src: IMGS[0] }, { id: 'r8', src: IMGS[1] }, { id: 'r9', src: IMGS[3] }],
    notes: 'Fashion editorial character. Elegant and couture-ready. Strong jaw, expressive eyes. Versatile across era styles — 1920s to 3000 AD.',
    usageCount: 31, lastUsed: '3h ago',
    usage: [
      { id: 'u6', prompt: 'Vogue editorial, avant-garde streetwear Tokyo', model: 'Portrait Ultra', date: '3h ago', thumb: IMGS[2] },
      { id: 'u7', prompt: '1920s Paris cafe, art deco interior, candlelight', model: 'Cinematic', date: '2d ago', thumb: IMGS[0] },
      { id: 'u8', prompt: 'luxury brand campaign, white studio, couture', model: 'Product Studio', date: '5d ago', thumb: IMGS[1] },
    ],
  },
  {
    id: '4', name: 'Kai Nomura', avatar: IMGS[3], tag: 'Anime', color: P.orange,
    refs: [{ id: 'r10', src: IMGS[3] }, { id: 'r11', src: IMGS[0] }],
    notes: 'Anime-inspired protagonist energy. Young, determined. Works excellently with stylized illustration models and vibrant color palettes.',
    usageCount: 9, lastUsed: '5d ago',
    usage: [
      { id: 'u9', prompt: 'anime hero, sakura petals, golden sunset', model: 'Anime Pro', date: '5d ago', thumb: IMGS[3] },
    ],
  },
];

/* ── Sub-components ────────────────────────────────────────────────────────── */

function CharacterCard({
  char, isSelected, isPinned, onClick, onPin,
}: {
  char: Character; isSelected: boolean; isPinned: boolean;
  onClick: () => void; onPin: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      onClick={onClick}
      className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-200"
      style={{
        aspectRatio: '2/3',
        outline: isSelected ? `2px solid ${char.color}` : '2px solid transparent',
        outlineOffset: 2,
      }}
    >
      <img src={char.avatar} alt={char.name} loading="lazy" className="w-full h-full object-cover" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

      {/* Tag badge */}
      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[8.5px] font-bold text-white"
        style={{ background: TAG_COLORS[char.tag] ?? P.rose }}>
        {char.tag}
      </div>

      {/* Pin badge */}
      {isPinned && (
        <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-md">
          <Pin className="w-2.5 h-2.5" style={{ color: char.color }} />
        </div>
      )}

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="text-[13px] font-bold text-white leading-snug mb-0.5">{char.name}</p>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-white/55">{char.refs.length} refs</span>
          <span className="text-white/30">·</span>
          <span className="text-[10px] text-white/55">{char.usageCount} uses</span>
          <span className="text-white/30">·</span>
          <span className="text-[10px] text-white/40">{char.lastUsed}</span>
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-12 left-0 right-0 flex items-center justify-center gap-2 px-3">
          <button
            onClick={onPin}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10.5px] font-bold text-white cursor-pointer transition-all hover:scale-105"
            style={{ background: isPinned ? 'rgba(255,255,255,0.25)' : char.color }}>
            {isPinned ? <PinOff className="w-3 h-3" /> : <Pin className="w-3 h-3" />}
            {isPinned ? 'Unpin' : 'Pin'}
          </button>
        </div>
      </div>
    </div>
  );
}

function AddCharacterCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-2xl border-2 border-dashed border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 text-zinc-400 hover:text-zinc-600"
      style={{ aspectRatio: '2/3' }}>
      <div className="w-10 h-10 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center">
        <Plus className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
      </div>
      <div className="text-center">
        <p className="text-[12px] font-semibold">New Character</p>
        <p className="text-[10px] mt-0.5 text-zinc-400">Add reference images</p>
      </div>
    </button>
  );
}

/* ── Main view ────────────────────────────────────────────────────────────── */

interface CharacterLibraryViewProps {
  pinnedChar: PinnedChar | null;
  onPinCharacter: (char: PinnedChar | null) => void;
}

export default function CharacterLibraryView({ pinnedChar, onPinCharacter }: CharacterLibraryViewProps) {
  const [characters, setCharacters] = useState<Character[]>(INIT);
  const [selected,   setSelected]   = useState<string | null>(null);
  const [query,      setQuery]       = useState('');
  const [tagFilter,  setTagFilter]   = useState('All');
  const [creating,   setCreating]    = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  /* Edit state for detail panel */
  const [editName,  setEditName]  = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editTag,   setEditTag]   = useState('');
  const [dirty,     setDirty]     = useState(false);

  /* New character state */
  const [newName,  setNewName]  = useState('');
  const [newTag,   setNewTag]   = useState('Portrait');
  const [newNotes, setNewNotes] = useState('');

  const refInputRef = useRef<HTMLInputElement>(null);
  const newImgRef   = useRef<HTMLInputElement>(null);

  const selectedChar = characters.find(c => c.id === selected) ?? null;

  const filtered = characters.filter(c => {
    const matchQ = !query || c.name.toLowerCase().includes(query.toLowerCase()) || c.tag.toLowerCase().includes(query.toLowerCase());
    const matchT = tagFilter === 'All' || c.tag === tagFilter;
    return matchQ && matchT;
  });

  const openChar = (id: string) => {
    const c = characters.find(ch => ch.id === id)!;
    setSelected(id);
    setEditName(c.name);
    setEditNotes(c.notes);
    setEditTag(c.tag);
    setDirty(false);
    setCreating(false);
    setShowHistory(false);
  };

  const saveChar = () => {
    setCharacters(prev => prev.map(c =>
      c.id === selected
        ? { ...c, name: editName, notes: editNotes, tag: editTag, color: TAG_COLORS[editTag] ?? P.rose }
        : c
    ));
    setDirty(false);
  };

  const deleteChar = (id: string) => {
    setCharacters(prev => prev.filter(c => c.id !== id));
    setSelected(null);
    if (pinnedChar?.id === id) onPinCharacter(null);
  };

  const addRefToSelected = (src: string) => {
    setCharacters(prev => prev.map(c =>
      c.id === selected && c.refs.length < 8
        ? { ...c, refs: [...c.refs, { id: `r${Date.now()}`, src }] }
        : c
    ));
  };

  const removeRef = (charId: string, refId: string) => {
    setCharacters(prev => prev.map(c =>
      c.id === charId ? { ...c, refs: c.refs.filter(r => r.id !== refId) } : c
    ));
  };

  const createCharacter = () => {
    if (!newName.trim()) return;
    const id = `char-${Date.now()}`;
    const newChar: Character = {
      id, name: newName, avatar: IMGS[0], tag: newTag,
      color: TAG_COLORS[newTag] ?? P.rose,
      refs: [{ id: `r${Date.now()}`, src: IMGS[0] }],
      notes: newNotes, usageCount: 0, lastUsed: 'Just now', usage: [],
    };
    setCharacters(prev => [...prev, newChar]);
    setNewName(''); setNewNotes(''); setNewTag('Portrait');
    setCreating(false);
    openChar(id);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, mode: 'ref' | 'new') => {
    const f = e.target.files?.[0];
    if (!f) return;
    const src = URL.createObjectURL(f);
    if (mode === 'ref') addRefToSelected(src);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">

      {/* ── Filter bar ── */}
      <div className="h-11 border-b border-zinc-100 px-5 flex items-center gap-3 shrink-0">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search characters…"
            className="pl-8 pr-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-[11.5px] text-zinc-800 placeholder-zinc-400 outline-none focus:border-zinc-400 transition-colors w-48" />
        </div>
        <div className="flex items-center gap-1">
          {['All', ...TAGS.slice(0, 5)].map(t => (
            <button key={t} onClick={() => setTagFilter(t)}
              className={`px-2.5 py-1 rounded-full text-[10.5px] font-semibold transition-all cursor-pointer ${tagFilter === t ? 'text-white' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'}`}
              style={tagFilter === t ? { background: tagFilter === 'All' ? P.rose : TAG_COLORS[t] ?? P.rose } : {}}>
              {t}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-1.5">
          <span className="text-[10.5px] text-zinc-400">{characters.length} characters</span>
          {pinnedChar && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold"
              style={{ background: pinnedChar.color + '18', color: pinnedChar.color, border: `1px solid ${pinnedChar.color}40` }}>
              <Pin className="w-2.5 h-2.5" />
              {pinnedChar.name} Active
            </div>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 flex overflow-hidden">

        {/* Character grid */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {filtered.length === 0 && !creating && (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <div className="w-14 h-14 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                <Users className="w-6 h-6 text-zinc-400" />
              </div>
              <p className="text-[13px] font-semibold text-zinc-500">No characters found</p>
              <p className="text-[11.5px] text-zinc-400">Try a different search or create a new character</p>
            </div>
          )}

          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
            {filtered.map(char => (
              <CharacterCard key={char.id} char={char}
                isSelected={selected === char.id}
                isPinned={pinnedChar?.id === char.id}
                onClick={() => openChar(char.id)}
                onPin={e => { e.stopPropagation(); onPinCharacter(pinnedChar?.id === char.id ? null : { id: char.id, name: char.name, color: char.color, refs: char.refs.map(r => r.src) }); }} />
            ))}
            <AddCharacterCard onClick={() => { setCreating(true); setSelected(null); }} />
          </div>
        </div>

        {/* ── Detail panel ── */}
        <AnimatePresence>
          {(selectedChar || creating) && (
            <motion.div key="detail"
              initial={{ x: 32, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
              exit={{ x: 32, opacity: 0 }} transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-80 shrink-0 border-l border-zinc-100 bg-white flex flex-col overflow-hidden">

              {/* Panel header */}
              <div className="px-4 py-3 border-b border-zinc-100 shrink-0 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  {creating ? 'New Character' : 'Character Detail'}
                </span>
                <button onClick={() => { setSelected(null); setCreating(false); }}
                  className="w-6 h-6 rounded-md hover:bg-zinc-100 flex items-center justify-center cursor-pointer transition-colors">
                  <X className="w-3.5 h-3.5 text-zinc-400" />
                </button>
              </div>

              {/* Panel body */}
              <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>

                {/* ── CREATE mode ── */}
                {creating && (
                  <div className="p-4 flex flex-col gap-4">
                    <div>
                      <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 block mb-1.5">Name</label>
                      <input value={newName} onChange={e => setNewName(e.target.value)}
                        placeholder="Character name…"
                        autoFocus
                        className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-[13px] font-semibold text-zinc-900 placeholder-zinc-400 outline-none focus:border-rose-300 transition-colors" />
                    </div>

                    <div>
                      <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 block mb-1.5">Type</label>
                      <div className="flex flex-wrap gap-1.5">
                        {TAGS.map(t => (
                          <button key={t} onClick={() => setNewTag(t)}
                            className="px-2.5 py-1 rounded-full text-[10.5px] font-semibold border transition-all cursor-pointer"
                            style={newTag === t
                              ? { background: TAG_COLORS[t], color: '#fff', borderColor: 'transparent' }
                              : { background: '#f4f4f5', color: '#71717a', borderColor: '#e4e4e7' }}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 block mb-1.5">Notes</label>
                      <textarea value={newNotes} onChange={e => setNewNotes(e.target.value)}
                        placeholder="Describe this character — appearance, style, personality…"
                        className="w-full h-24 px-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-[12px] text-zinc-800 placeholder-zinc-400 outline-none focus:border-rose-300 transition-colors resize-none" />
                    </div>

                    <button onClick={createCharacter} disabled={!newName.trim()}
                      className={`w-full py-3 rounded-xl text-[12.5px] font-bold transition-all cursor-pointer ${!newName.trim() ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed' : 'text-white hover:opacity-90'}`}
                      style={newName.trim() ? { background: P.rose } : {}}>
                      Create Character
                    </button>
                  </div>
                )}

                {/* ── DETAIL mode ── */}
                {selectedChar && !creating && (
                  <div className="flex flex-col">

                    {/* Avatar + Name */}
                    <div className="p-4 flex items-center gap-3 border-b border-zinc-100">
                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 shrink-0"
                        style={{ borderColor: selectedChar.color }}>
                        <img src={selectedChar.avatar} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <input value={editName} onChange={e => { setEditName(e.target.value); setDirty(true); }}
                          className="w-full text-[15px] font-black text-zinc-900 bg-transparent outline-none border-b border-transparent hover:border-zinc-300 focus:border-rose-300 transition-colors pb-0.5 leading-snug"
                          placeholder="Character name" />
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white"
                            style={{ background: TAG_COLORS[selectedChar.tag] ?? P.rose }}>
                            {selectedChar.tag}
                          </span>
                          <span className="text-[10px] text-zinc-400">{selectedChar.lastUsed}</span>
                        </div>
                      </div>
                    </div>

                    {/* Tag picker */}
                    <div className="px-4 py-3 border-b border-zinc-100">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 block mb-2">Character Type</label>
                      <div className="flex flex-wrap gap-1.5">
                        {TAGS.map(t => (
                          <button key={t} onClick={() => { setEditTag(t); setDirty(true); }}
                            className="px-2 py-0.5 rounded-full text-[9.5px] font-semibold border transition-all cursor-pointer"
                            style={editTag === t
                              ? { background: TAG_COLORS[t], color: '#fff', borderColor: 'transparent' }
                              : { background: '#f4f4f5', color: '#71717a', borderColor: '#e4e4e7' }}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Reference images */}
                    <div className="px-4 py-3 border-b border-zinc-100">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">References</label>
                        <span className="text-[9px] text-zinc-400">{selectedChar.refs.length}/8</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5">
                        {selectedChar.refs.map((ref, ri) => (
                          <div key={ref.id} className="relative group aspect-square rounded-lg overflow-hidden border border-zinc-200">
                            <img src={ref.src} alt="" className="w-full h-full object-cover" />
                            <button
                              onClick={() => removeRef(selectedChar.id, ref.id)}
                              className="absolute top-0.5 right-0.5 w-4 h-4 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                              <X className="w-2 h-2 text-white" />
                            </button>
                            {ri === 0 && (
                              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-[7px] text-white text-center py-0.5 font-bold">PRIMARY</div>
                            )}
                          </div>
                        ))}
                        {selectedChar.refs.length < 8 && (
                          <>
                            <input ref={refInputRef} type="file" accept="image/*" className="hidden"
                              onChange={e => handleFileUpload(e, 'ref')} />
                            <button onClick={() => refInputRef.current?.click()}
                              className="aspect-square rounded-lg border-2 border-dashed border-zinc-200 hover:border-rose-300 hover:bg-rose-50/30 transition-all cursor-pointer flex items-center justify-center">
                              <Plus className="w-3.5 h-3.5 text-zinc-400" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="px-4 py-3 border-b border-zinc-100">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 block mb-2">Notes</label>
                      <textarea value={editNotes} onChange={e => { setEditNotes(e.target.value); setDirty(true); }}
                        placeholder="Describe this character…"
                        className="w-full h-20 px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-[11.5px] text-zinc-800 placeholder-zinc-400 outline-none focus:border-rose-300 transition-colors resize-none" />
                    </div>

                    {/* Usage history */}
                    <div className="border-b border-zinc-100">
                      <button onClick={() => setShowHistory(s => !s)}
                        className="w-full px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-zinc-50 transition-colors">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-zinc-400" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Usage History</span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-zinc-100 text-zinc-500">
                            {selectedChar.usageCount}
                          </span>
                        </div>
                        <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${showHistory ? 'rotate-180' : ''}`} />
                      </button>
                      {showHistory && (
                        <div className="px-4 pb-3 flex flex-col gap-2">
                          {selectedChar.usage.map(u => (
                            <div key={u.id} className="flex items-center gap-2.5">
                              <div className="w-10 h-10 rounded-lg overflow-hidden border border-zinc-200 shrink-0">
                                <img src={u.thumb} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[10.5px] font-medium text-zinc-700 truncate">{u.prompt}</p>
                                <div className="flex items-center gap-1 mt-0.5">
                                  <span className="text-[9px] text-zinc-400">{u.model}</span>
                                  <span className="text-zinc-300">·</span>
                                  <span className="text-[9px] text-zinc-400">{u.date}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Panel footer */}
              {selectedChar && !creating && (
                <div className="px-4 py-3 border-t border-zinc-100 shrink-0 flex flex-col gap-2">
                  {dirty && (
                    <button onClick={saveChar}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[12px] font-bold text-white hover:opacity-90 transition-all cursor-pointer"
                      style={{ background: P.rose }}>
                      <Check className="w-3.5 h-3.5" />Save Changes
                    </button>
                  )}
                  <button
                    onClick={() => onPinCharacter(pinnedChar?.id === selectedChar.id ? null : { id: selectedChar.id, name: editName, color: TAG_COLORS[editTag] ?? P.rose, refs: selectedChar.refs.map(r => r.src) })}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[12px] font-bold transition-all cursor-pointer border"
                    style={pinnedChar?.id === selectedChar.id
                      ? { background: selectedChar.color + '18', borderColor: selectedChar.color + '40', color: selectedChar.color }
                      : { background: selectedChar.color, color: '#fff', borderColor: 'transparent' }}>
                    {pinnedChar?.id === selectedChar.id
                      ? <><PinOff className="w-3.5 h-3.5" />Unpin from Generator</>
                      : <><Pin className="w-3.5 h-3.5" />Pin to Generator</>}
                  </button>
                  <button onClick={() => deleteChar(selectedChar.id)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11.5px] font-medium text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer">
                    <Trash2 className="w-3 h-3" />Delete Character
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
