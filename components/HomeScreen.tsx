'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useOnboarding } from '@/app/context/OnboardingContext';
import { useTheme } from '@/app/context/ThemeContext';
import Sidebar            from '@/components/home/Sidebar';
import CommandPalette     from '@/components/home/CommandPalette';
import MainContent        from '@/components/home/MainContent';
import ImageGeneratorView from '@/components/home/ImageGeneratorView';
import VideoGeneratorView from '@/components/home/VideoGeneratorView';
import VoiceGeneratorView from '@/components/home/VoiceGeneratorView';
import ExploreView        from '@/components/home/ExploreView';
import ProjectsView       from '@/components/home/ProjectsView';
import LibraryView        from '@/components/home/LibraryView';
import SpacesView         from '@/components/home/SpacesView';
import AllToolsView       from '@/components/home/AllToolsView';
import AssistantView      from '@/components/home/AssistantView';
import CharacterLibraryView, { PinnedChar } from '@/components/home/CharacterLibraryView';
import CinemaStudioView      from '@/components/home/CinemaStudioView';
import MarketingStudioView   from '@/components/home/MarketingStudioView';
import SocialStudioView      from '@/components/home/SocialStudioView';
import ProductStudioView     from '@/components/home/ProductStudioView';
import PortfolioBuilderView  from '@/components/home/PortfolioBuilderView';
import AuditionCoachView     from '@/components/home/AuditionCoachView';

const VIEWS_WITH_OWN_SIDEBAR = new Set(['image', 'video', 'voice', 'projects', 'cinema', 'marketing', 'social', 'product', 'portfolio', 'audition']);

function HomeScreenInner() {
  const { logoutUser, userEmail, answers } = useOnboarding();
  const { isDark, T } = useTheme();
  const [activeNav,        setActiveNav]        = useState('home');
  const [toolsOpen,        setToolsOpen]        = useState(false);
  const [paletteOpen,      setPaletteOpen]      = useState(false);
  const [pinnedChar,       setPinnedChar]       = useState<PinnedChar | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [cinemaPhase,      setCinemaPhase]      = useState<'hero' | 'workspace'>('hero');

  const displayName = answers.displayName || userEmail?.split('@')[0] || 'User';
  const avatar      = displayName[0]?.toUpperCase() ?? 'U';

  useEffect(() => {
    // Seed initial history state so back button can return here
    window.history.replaceState({ view: 'home' }, '');
  }, []);

  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const view = (e.state?.view as string) ?? 'home';
      setActiveNav(view);
      setToolsOpen(false);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

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
      window.history.pushState({ view: id }, '');
      setActiveNav(id);
      setSidebarCollapsed(VIEWS_WITH_OWN_SIDEBAR.has(id));
    }
  };

  const goHome = () => { setActiveNav('home'); setToolsOpen(false); };

  const renderMain = () => {
    switch (activeNav) {
      case 'explore':    return <ExploreView onToolClick={handleSetActive} />;
      case 'projects':   return <ProjectsView />;
      case 'library':    return <LibraryView />;
      case 'spaces':     return <SpacesView />;
      case 'image':      return <ImageGeneratorView onBack={goHome} pinnedChar={pinnedChar} />;
      case 'video':      return <VideoGeneratorView onBack={goHome} />;
      case 'voice':      return <VoiceGeneratorView onBack={goHome} />;
      case 'assistant':  return <AssistantView />;
      case 'characters': return <CharacterLibraryView pinnedChar={pinnedChar} onPinCharacter={setPinnedChar} />;
      case 'cinema':     return <CinemaStudioView onBack={goHome} onPhaseChange={setCinemaPhase} />;
      case 'marketing':  return <MarketingStudioView onBack={goHome} />;
      case 'social':     return <SocialStudioView onBack={goHome} />;
      case 'product':    return <ProductStudioView onBack={goHome} />;
      case 'portfolio':  return <PortfolioBuilderView onBack={goHome} />;
      case 'audition':   return <AuditionCoachView onBack={goHome} />;
      default:           return <MainContent displayName={displayName} onSearchClick={() => setPaletteOpen(true)} onToolClick={handleSetActive} />;
    }
  };

  const hideSidebar = activeNav === 'cinema' && cinemaPhase === 'hero';

  return (
    <div className="fixed inset-0 flex font-sans overflow-hidden" style={{ background: T.bg, zoom: '0.9' } as React.CSSProperties}>
      {!hideSidebar && (
        <Sidebar
          active={toolsOpen ? 'all' : activeNav}
          setActive={handleSetActive}
          displayName={displayName}
          avatar={avatar}
          onLogout={logoutUser}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(c => !c)}
          forceDark={activeNav === 'cinema'}
        />
      )}
      <div className="flex-1 flex overflow-hidden">
        {renderMain()}
      </div>
      <AnimatePresence>
        {toolsOpen && (
          <AllToolsView
            onClose={() => setToolsOpen(false)}
            onNavigate={(id) => { window.history.pushState({ view: id }, ''); setActiveNav(id); setToolsOpen(false); }}
          />
        )}
      </AnimatePresence>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}

export default function HomeScreen() {
  return <HomeScreenInner />;
}
