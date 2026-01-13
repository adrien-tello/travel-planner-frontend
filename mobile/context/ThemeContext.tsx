import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  colors: typeof lightColors;
}

const lightColors = {
  // Primary - AI Purple/Blue
  primary: "#6366f1",
  primaryLight: "#818cf8",
  primaryDark: "#4f46e5",
  
  // Secondary - Teal
  secondary: "#14b8a6",
  secondaryLight: "#2dd4bf",
  secondaryDark: "#0d9488",
  
  // Accent Colors
  accent1: "#8b5cf6",
  accent2: "#ec4899",
  accent3: "#f59e0b",
  accent4: "#10b981",
  
  // Neutrals
  white: "#ffffff",
  black: "#0f172a",
  background: "#f8fafc",
  surface: "#ffffff",
  surfaceAlt: "#f1f5f9",
  
  // Text
  textPrimary: "#0f172a",
  textSecondary: "#64748b",
  textTertiary: "#94a3b8",
  
  // Borders & Dividers
  border: "#e2e8f0",
  borderLight: "#f1f5f9",
  divider: "#cbd5e1",
  
  // Status
  success: "#10b981",
  error: "#ef4444",
  warning: "#f59e0b",
  info: "#3b82f6",
  
  // Gradients
  gradientPurple: ["#8b5cf6", "#6366f1"] as const,
  gradientTeal: ["#14b8a6", "#06b6d4"] as const,
  gradientSunset: ["#f59e0b", "#ec4899"] as const,
  gradientOcean: ["#06b6d4", "#3b82f6"] as const,
  gradientMagic: ["#a855f7", "#ec4899", "#f59e0b"] as const,
  gradientTravel: ["#6366f1", "#14b8a6"] as const,
  gradientDark: ["#1e293b", "#0f172a"] as const,
};

const darkColors = {
  // Primary - AI Purple/Blue (slightly adjusted for dark mode)
  primary: "#818cf8",
  primaryLight: "#a5b4fc",
  primaryDark: "#6366f1",
  
  // Secondary - Teal
  secondary: "#2dd4bf",
  secondaryLight: "#5eead4",
  secondaryDark: "#14b8a6",
  
  // Accent Colors
  accent1: "#a78bfa",
  accent2: "#f472b6",
  accent3: "#fbbf24",
  accent4: "#34d399",
  
  // Neutrals
  white: "#0f172a",
  black: "#ffffff",
  background: "#0f172a",
  surface: "#1e293b",
  surfaceAlt: "#334155",
  
  // Text
  textPrimary: "#f1f5f9",
  textSecondary: "#cbd5e1",
  textTertiary: "#94a3b8",
  
  // Borders & Dividers
  border: "#334155",
  borderLight: "#475569",
  divider: "#64748b",
  
  // Status
  success: "#34d399",
  error: "#f87171",
  warning: "#fbbf24",
  info: "#60a5fa",
  
  // Gradients (same as light mode)
  gradientPurple: ["#a78bfa", "#818cf8"] as const,
  gradientTeal: ["#2dd4bf", "#22d3ee"] as const,
  gradientSunset: ["#fbbf24", "#f472b6"] as const,
  gradientOcean: ["#22d3ee", "#60a5fa"] as const,
  gradientMagic: ["#c084fc", "#f472b6", "#fbbf24"] as const,
  gradientTravel: ["#818cf8", "#2dd4bf"] as const,
  gradientDark: ["#334155", "#1e293b"] as const,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>('light');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        setTheme(savedTheme);
      }
    } catch (error) {
      console.log('Error loading theme:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.log('Error saving theme:', error);
    }
  };

  const colors = theme === 'light' ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};