'use client';

import React from 'react';
import {
  Home, Search, FolderOpen, BookOpen, Compass,
  Grid3X3, LayoutTemplate, ImageIcon, Video, Mic, Bot,
  ChevronDown, Plus, Bell, LogOut, Settings, Users,
} from 'lucide-react';

const NAV = [
  { icon: Home,       label: 'Home',      id: 'home' },
  { icon: Search,     label: 'Search',    id: 'search' },
  { icon: Compass,    label: 'Explore',   id: 'explore' },
  { icon: FolderOpen, label: 'Projects',  id: 'projects' },
  { icon: BookOpen,   label: 'Library',   id: 'library' },
];

const TOOLS = [
  { icon: Grid3X3,        label: 'All tools',       id: 'all' },
  { icon: LayoutTemplate, label: 'Spaces',           id: 'spaces' },
  { icon: ImageIcon,      label: 'Image Generator',  id: 'image' },
  { icon: Video,          label: 'Video Generator',  id: 'video' },
  { icon: Mic,            label: 'Voice Generator',  id: 'voice' },
  { icon: Bot,            label: 'Assistant',        id: 'assistant' },
];

const ASSETS = [
  { icon: Users, label: 'Characters', id: 'characters' },
];

const Logo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
    <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
  </svg>
);

interface SidebarProps {
  active: string;
  setActive: (id: string) => void;
  displayName: string;
  avatar: string;
  onLogout: () => void;
}

function NavItem({ icon: Icon, label, id, active, onClick }: {
  icon: React.ElementType; label: string; id: string; active: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[12.5px] font-medium transition-all cursor-pointer text-left ${
        active
          ? 'bg-zinc-900 text-white shadow-sm'
          : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'
      }`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      {label}
    </button>
  );
}

export default function Sidebar({ active, setActive, displayName, avatar, onLogout }: SidebarProps) {
  return (
    <aside className="w-52 shrink-0 border-r border-zinc-200 bg-white flex flex-col h-full select-none">
      {/* Logo + project switcher */}
      <div className="px-3 pt-4 pb-3">
        <div className="flex items-center gap-2 mb-3.5 px-1">
          <div className="w-4 h-4 text-zinc-900"><Logo /></div>
          <span className="text-[13px] font-bold text-zinc-900 tracking-[-0.03em]">Spectrum AI</span>
        </div>
        <button className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl hover:bg-zinc-100 border border-zinc-200 transition-colors text-left group">
          <div className="w-2.5 h-2.5 rounded-sm bg-zinc-900 shrink-0" />
          <span className="text-[11.5px] font-medium text-zinc-700 flex-1 truncate">Personal project</span>
          <ChevronDown className="w-3 h-3 text-zinc-400 shrink-0" />
        </button>
      </div>

      {/* Create button */}
      <div className="px-3 pb-2">
        <button onClick={() => setActive('image')}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white text-[12px] font-semibold transition-colors cursor-pointer border border-zinc-800">
          <Plus className="w-3.5 h-3.5" />
          Create
        </button>
      </div>

      <div className="mx-3 border-t border-zinc-100 mb-2" />

      {/* Main nav */}
      <nav className="px-2 space-y-0.5">
        {NAV.map(item => (
          <NavItem key={item.id} {...item} active={active === item.id} onClick={() => setActive(item.id)} />
        ))}
      </nav>

      <div className="mx-3 border-t border-zinc-100 my-2" />

      {/* Tools */}
      <div className="px-2">
        <p className="text-[9px] font-semibold uppercase tracking-widest text-zinc-400 px-2.5 mb-1.5">Tools</p>
        <div className="space-y-0.5">
          {TOOLS.map(item => (
            <NavItem key={item.id} {...item} active={active === item.id} onClick={() => setActive(item.id)} />
          ))}
        </div>
      </div>

      <div className="mx-3 border-t border-zinc-100 my-2" />

      {/* Assets */}
      <div className="px-2">
        <p className="text-[9px] font-semibold uppercase tracking-widest text-zinc-400 px-2.5 mb-1.5">Assets</p>
        <div className="space-y-0.5">
          {ASSETS.map(item => (
            <NavItem key={item.id} {...item} active={active === item.id} onClick={() => setActive(item.id)} />
          ))}
        </div>
      </div>

      <div className="flex-1" />

      {/* Bottom */}
      <div className="px-3 py-3 border-t border-zinc-100">
        <div className="flex items-center gap-2 mb-2">
          <button onClick={() => alert('Notifications: No new notifications.')}
            className="relative p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer">
            <Bell className="w-3.5 h-3.5" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-rose-500 rounded-full" />
          </button>
          <button onClick={() => alert('Settings panel coming soon. You can customize models, themes, and API keys here.')}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer">
            <Settings className="w-3.5 h-3.5" />
          </button>
          <div className="flex-1" />
          <button onClick={onLogout} className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer">
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex items-center gap-2 px-1">
          <div className="w-6 h-6 rounded-full bg-zinc-900 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
            {avatar}
          </div>
          <span className="text-[11.5px] text-zinc-600 font-medium truncate">{displayName}</span>
        </div>
      </div>
    </aside>
  );
}
