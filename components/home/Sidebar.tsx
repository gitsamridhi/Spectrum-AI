'use client';

import React from 'react';
import {
  Home, FolderOpen, BookOpen, Compass,
  Grid3X3, LayoutTemplate, ImageIcon, Video, Mic, Bot,
  ChevronDown, Plus, Bell, LogOut, Settings, Users,
  Clapperboard, Megaphone, Smartphone, Package, Sun, Moon,
  LayoutDashboard,
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeContext';

const NAV = [
  { icon: Home,       label: 'Home',     id: 'home'     },
  { icon: Compass,    label: 'Explore',  id: 'explore'  },
  { icon: FolderOpen, label: 'Projects', id: 'projects' },
  { icon: BookOpen,   label: 'Library',  id: 'library'  },
];

const TOOLS = [
  { icon: Grid3X3,         label: 'All tools',        id: 'all'       },
  { icon: LayoutTemplate,  label: 'Spaces',            id: 'spaces'    },
  { icon: ImageIcon,       label: 'Image Generator',   id: 'image'     },
  { icon: Video,           label: 'Video Generator',   id: 'video'     },
  { icon: Mic,             label: 'Voice Generator',   id: 'voice'     },
  { icon: Bot,             label: 'Assistant',         id: 'assistant' },
  { icon: LayoutDashboard, label: 'Portfolio Builder', id: 'portfolio' },
];

const ASSETS = [
  { icon: Users, label: 'Characters', id: 'characters' },
];

const ADVANCED = [
  { icon: Clapperboard, label: 'Cinema Studio',    id: 'cinema' },
  { icon: Megaphone,    label: 'Marketing Studio', id: 'marketing' },
  { icon: Smartphone,   label: 'Social Studio',    id: 'social' },
  { icon: Package,      label: 'Product Studio',   id: 'product' },
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

export default function Sidebar({ active, setActive, displayName, avatar, onLogout }: SidebarProps) {
  const { isDark, toggleTheme, T } = useTheme();

  const navItem = (icon: React.ElementType, label: string, id: string) => {
    const Icon = icon;
    const isActive = active === id;
    return (
      <button key={id} onClick={() => setActive(id)}
        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[12.5px] font-medium transition-all cursor-pointer text-left"
        style={isActive
          ? { background: T.text, color: T.bg }
          : { color: T.textSub, background: 'transparent' }}
        onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = T.bgHover; }}
        onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
        <Icon className="w-3.5 h-3.5 shrink-0" />
        {label}
      </button>
    );
  };

  return (
    <aside className="w-52 shrink-0 flex flex-col h-full select-none"
      style={{ borderRight: `1px solid ${T.border}`, background: T.bg }}>

      {/* Logo + project switcher */}
      <div className="px-3 pt-4 pb-3">
        <div className="flex items-center gap-2 mb-3.5 px-1">
          <div className="w-4 h-4" style={{ color: T.text }}><Logo /></div>
          <span className="text-[13px] font-bold tracking-[-0.03em]" style={{ color: T.text }}>Spectrum AI</span>
        </div>
        <button className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl transition-colors text-left"
          style={{ border: `1px solid ${T.border}`, background: T.bgSub }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = T.bgHover}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = T.bgSub}>
          <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: T.text }} />
          <span className="text-[11.5px] font-medium flex-1 truncate" style={{ color: T.textSub }}>Personal project</span>
          <ChevronDown className="w-3 h-3 shrink-0" style={{ color: T.textMuted }} />
        </button>
      </div>

      {/* Create button */}
      <div className="px-3 pb-2">
        <button onClick={() => setActive('image')}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[12px] font-semibold transition-colors cursor-pointer"
          style={{ background: T.text, color: T.bg, border: `1px solid ${T.border}` }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.88'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}>
          <Plus className="w-3.5 h-3.5" />
          Create
        </button>
      </div>

      <div className="mx-3 shrink-0" style={{ height: 1, background: T.borderMuted }} />

      {/* Scrollable nav area */}
      <div className="flex-1 overflow-y-auto min-h-0 mt-2" style={{ scrollbarWidth: 'none' }}>

        <nav className="px-2 space-y-0.5">
          {NAV.map(item => navItem(item.icon, item.label, item.id))}
        </nav>

        <div className="mx-3 my-2" style={{ height: 1, background: T.borderMuted }} />

        <div className="px-2">
          <p className="text-[9px] font-semibold uppercase tracking-widest px-2.5 mb-1.5" style={{ color: T.textMuted }}>Tools</p>
          <div className="space-y-0.5">
            {TOOLS.map(item => navItem(item.icon, item.label, item.id))}
          </div>
        </div>

        <div className="mx-3 my-2" style={{ height: 1, background: T.borderMuted }} />

        <div className="px-2">
          <p className="text-[9px] font-semibold uppercase tracking-widest px-2.5 mb-1.5" style={{ color: T.textMuted }}>Assets</p>
          <div className="space-y-0.5">
            {ASSETS.map(item => navItem(item.icon, item.label, item.id))}
          </div>
        </div>

        {/* Advanced Studios */}
        <div className="px-3 pt-3 pb-4">
          <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${T.border}`, background: '#0f0f12' }}>
            <div className="px-3 pt-3 pb-2 flex items-center gap-1.5">
              <p className="text-[9px] font-bold uppercase tracking-widest text-white/70 flex-1">Advanced</p>
              <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-full tracking-wide"
                style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.12)' }}>Pro</span>
            </div>
            <div className="px-2 pb-2 space-y-0.5">
              {ADVANCED.map(item => (
                <button key={item.id} onClick={() => setActive(item.id)}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[12.5px] font-medium transition-all cursor-pointer text-left"
                  style={active === item.id
                    ? { background: 'white', color: '#111113' }
                    : { color: 'rgba(255,255,255,0.65)', background: 'transparent' }}
                  onMouseEnter={e => { if (active !== item.id) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'; }}
                  onMouseLeave={e => { if (active !== item.id) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                  <item.icon className="w-3.5 h-3.5 shrink-0" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-3 py-3 shrink-0" style={{ borderTop: `1px solid ${T.borderMuted}` }}>
        <div className="flex items-center gap-1 mb-2.5">
          <button onClick={() => alert('Notifications: No new notifications.')}
            className="relative p-1.5 rounded-lg transition-colors cursor-pointer"
            style={{ color: T.textMuted }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = T.bgHover; (e.currentTarget as HTMLElement).style.color = T.text; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = T.textMuted; }}>
            <Bell className="w-3.5 h-3.5" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-rose-400 rounded-full" />
          </button>
          <button onClick={() => alert('Settings panel coming soon.')}
            className="p-1.5 rounded-lg transition-colors cursor-pointer"
            style={{ color: T.textMuted }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = T.bgHover; (e.currentTarget as HTMLElement).style.color = T.text; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = T.textMuted; }}>
            <Settings className="w-3.5 h-3.5" />
          </button>
          {/* Theme toggle */}
          <button onClick={toggleTheme}
            className="p-1.5 rounded-lg transition-colors cursor-pointer"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{ color: T.textMuted }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = T.bgHover; (e.currentTarget as HTMLElement).style.color = T.text; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = T.textMuted; }}>
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
          <div className="flex-1" />
          <button onClick={onLogout}
            className="p-1.5 rounded-lg transition-colors cursor-pointer"
            style={{ color: T.textMuted }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = T.bgHover; (e.currentTarget as HTMLElement).style.color = T.text; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = T.textMuted; }}>
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex items-center gap-2 px-1">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
            style={{ background: T.text, color: T.bg }}>
            {avatar}
          </div>
          <span className="text-[11.5px] font-medium truncate" style={{ color: T.textSub }}>{displayName}</span>
        </div>
      </div>
    </aside>
  );
}
