'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useOnboarding } from '@/app/context/OnboardingContext';
import Sidebar            from '@/components/home/Sidebar';
import CommandPalette     from '@/components/home/CommandPalette';
import MainContent        from '@/components/home/MainContent';
import ImageGeneratorView from '@/components/home/ImageGeneratorView';
import VideoGeneratorView from '@/components/home/VideoGeneratorView';
import VoiceGeneratorView from '@/components/home/VoiceGeneratorView';
import ExploreView        from '@/components/home/ExploreView';
import SearchView         from '@/components/home/SearchView';
import ProjectsView       from '@/components/home/ProjectsView';
import LibraryView        from '@/components/home/LibraryView';
import SpacesView         from '@/components/home/SpacesView';
import AllToolsView       from '@/components/home/AllToolsView';
import AssistantView      from '@/components/home/AssistantView';
import CharacterLibraryView, { PinnedChar } from '@/components/home/CharacterLibraryView';

export default function HomeScreen() {
  const { logoutUser, userEmail, answers } = useOnboarding();
  const [activeNav,   setActiveNav]   = useState('home');
  const [toolsOpen,   setToolsOpen]   = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [pinnedChar,  setPinnedChar]  = useState<PinnedChar | null>(null);

  const displayName = answers.displayName || userEmail?.split('@')[0] || 'User';
  const avatar      = displayName[0]?.toUpperCase() ?? 'U';

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen(p => !p);
      }
      if (e.key === 'Escape') {
        setToolsOpen(false);
        setPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleSetActive = (id: string) => {
    if (id === 'all') {
      setToolsOpen(prev => !prev);
    } else {
      setToolsOpen(false);
      setActiveNav(id);
    }
  };

  const goHome = () => setActiveNav('home');

  const renderMain = () => {
    switch (activeNav) {
      case 'search':    return <SearchView />;
      case 'explore':   return <ExploreView onToolClick={handleSetActive} />;
      case 'projects':  return <ProjectsView />;
      case 'library':   return <LibraryView />;
      case 'spaces':    return <SpacesView />;
      case 'image':     return <ImageGeneratorView onBack={goHome} pinnedChar={pinnedChar} />;
      case 'video':     return <VideoGeneratorView onBack={goHome} />;
      case 'voice':     return <VoiceGeneratorView onBack={goHome} />;
      case 'assistant':  return <AssistantView />;
      case 'characters': return <CharacterLibraryView pinnedChar={pinnedChar} onPinCharacter={setPinnedChar} />;
      default:           return <MainContent displayName={displayName} onSearchClick={() => setPaletteOpen(true)} onToolClick={handleSetActive} />;
    }
  };

  return (
    <div className="fixed inset-0 flex font-sans overflow-hidden bg-white">
      <Sidebar
        active={toolsOpen ? 'all' : activeNav}
        setActive={handleSetActive}
        displayName={displayName}
        avatar={avatar}
        onLogout={logoutUser}
      />

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {renderMain()}
      </div>

      {/* All-Tools modal overlay — fixed, outside flex row */}
      <AnimatePresence>
        {toolsOpen && (
          <AllToolsView
            onClose={() => setToolsOpen(false)}
            onNavigate={(id) => { setActiveNav(id); setToolsOpen(false); }}
          />
        )}
      </AnimatePresence>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
