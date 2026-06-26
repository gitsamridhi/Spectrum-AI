'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface ThemeTokens {
  bg:          string;
  bgSub:       string;
  bgCard:      string;
  bgHover:     string;
  border:      string;
  borderMuted: string;
  text:        string;
  textSub:     string;
  textMuted:   string;
  inputBg:     string;
  navActive:   string;
  navInactive: string;
}

export const LIGHT: ThemeTokens = {
  bg:          '#ffffff',
  bgSub:       '#f5f5f7',
  bgCard:      '#f0f0f2',
  bgHover:     '#eaeaed',
  border:      '#e4e4e7',
  borderMuted: '#ececef',
  text:        '#0f0f11',
  textSub:     '#3a3a42',
  textMuted:   '#64646e',
  inputBg:     '#f5f5f7',
  navActive:   '#0f0f11',
  navInactive: '#3a3a42',
};

export const DARK: ThemeTokens = {
  bg:          '#15151a',
  bgSub:       '#1e1e25',
  bgCard:      '#272730',
  bgHover:     '#30303c',
  border:      'rgba(255,255,255,0.12)',
  borderMuted: 'rgba(255,255,255,0.07)',
  text:        '#f5f5f8',
  textSub:     'rgba(245,245,248,0.76)',
  textMuted:   'rgba(245,245,248,0.48)',
  inputBg:     'rgba(255,255,255,0.08)',
  navActive:   '#f5f5f8',
  navInactive: 'rgba(245,245,248,0.6)',
};

interface ThemeContextValue {
  isDark:       boolean;
  toggleTheme:  () => void;
  T:            ThemeTokens;
}

const ThemeContext = createContext<ThemeContextValue>({
  isDark:      false,
  toggleTheme: () => {},
  T:           LIGHT,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const toggleTheme = useCallback(() => setIsDark(d => !d), []);
  const T = isDark ? DARK : LIGHT;
  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, T }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
