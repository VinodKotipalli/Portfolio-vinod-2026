import React, { createContext, useContext, useState, useEffect } from 'react';
import { portfolioData, PortfolioData } from '../data/portfolioData';

type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('saivinod_theme_preference');
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'light'; // Start with light introductory editorial palette, toggleable anytime
  });

  useEffect(() => {
    try {
      localStorage.setItem('saivinod_theme_preference', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {
      // Ignore storage errors
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: setThemeState }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

interface PortfolioContextValue {
  data: PortfolioData;
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <PortfolioContext.Provider value={{ data: portfolioData }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider');
  return ctx;
};
