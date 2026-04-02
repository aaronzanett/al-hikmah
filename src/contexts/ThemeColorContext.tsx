import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ThemePreset {
  id: string;
  name: string;
  primary: string;
  ring: string;
  sidebarBg: string;
  sidebarAccent: string;
  sidebarBorder: string;
  success: string;
  preview: string; // hex for visual swatch
}

export const themePresets: ThemePreset[] = [
  {
    id: "green",
    name: "Hijau Pesantren",
    primary: "152 45% 28%",
    ring: "152 45% 28%",
    sidebarBg: "152 35% 16%",
    sidebarAccent: "152 30% 22%",
    sidebarBorder: "152 25% 24%",
    success: "152 55% 40%",
    preview: "#2d6b4f",
  },
  {
    id: "blue",
    name: "Biru Langit",
    primary: "210 60% 35%",
    ring: "210 60% 35%",
    sidebarBg: "210 50% 16%",
    sidebarAccent: "210 40% 22%",
    sidebarBorder: "210 35% 24%",
    success: "210 55% 45%",
    preview: "#24568a",
  },
  {
    id: "teal",
    name: "Teal Modern",
    primary: "180 50% 30%",
    ring: "180 50% 30%",
    sidebarBg: "180 40% 14%",
    sidebarAccent: "180 35% 20%",
    sidebarBorder: "180 30% 22%",
    success: "180 50% 40%",
    preview: "#267373",
  },
  {
    id: "purple",
    name: "Ungu Elegan",
    primary: "270 45% 35%",
    ring: "270 45% 35%",
    sidebarBg: "270 35% 16%",
    sidebarAccent: "270 30% 22%",
    sidebarBorder: "270 25% 24%",
    success: "270 45% 45%",
    preview: "#5b3a8a",
  },
  {
    id: "maroon",
    name: "Merah Marun",
    primary: "0 50% 30%",
    ring: "0 50% 30%",
    sidebarBg: "0 40% 14%",
    sidebarAccent: "0 35% 20%",
    sidebarBorder: "0 30% 22%",
    success: "152 55% 40%",
    preview: "#733126",
  },
  {
    id: "navy",
    name: "Navy Klasik",
    primary: "230 50% 28%",
    ring: "230 50% 28%",
    sidebarBg: "230 40% 14%",
    sidebarAccent: "230 35% 20%",
    sidebarBorder: "230 30% 22%",
    success: "152 55% 40%",
    preview: "#243a6b",
  },
];

interface ThemeColorContextType {
  activeTheme: string;
  customColor: string;
  setTheme: (themeId: string) => void;
  setCustomColor: (hsl: string) => void;
  applyTheme: (themeId: string, customHsl?: string) => void;
}

const ThemeColorContext = createContext<ThemeColorContextType | undefined>(undefined);

function applyCSS(preset: ThemePreset) {
  const root = document.documentElement;
  root.style.setProperty('--primary', preset.primary);
  root.style.setProperty('--ring', preset.ring);
  root.style.setProperty('--sidebar-background', preset.sidebarBg);
  root.style.setProperty('--sidebar-accent', preset.sidebarAccent);
  root.style.setProperty('--sidebar-border', preset.sidebarBorder);
}

function hslStringFromHex(hex: string): string {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function makeCustomPreset(hex: string): ThemePreset {
  const hsl = hslStringFromHex(hex);
  const parts = hsl.split(' ');
  const hue = parts[0];
  return {
    id: "custom",
    name: "Custom",
    primary: hsl,
    ring: hsl,
    sidebarBg: `${hue} 35% 16%`,
    sidebarAccent: `${hue} 30% 22%`,
    sidebarBorder: `${hue} 25% 24%`,
    success: "152 55% 40%",
    preview: hex,
  };
}

export function ThemeColorProvider({ children }: { children: ReactNode }) {
  const [activeTheme, setActiveTheme] = useState(() => localStorage.getItem('theme_color_id') || 'green');
  const [customColor, setCustomColorState] = useState(() => localStorage.getItem('theme_custom_hex') || '#2d6b4f');

  useEffect(() => {
    // Apply saved theme on mount
    if (activeTheme === 'custom') {
      applyCSS(makeCustomPreset(customColor));
    } else {
      const preset = themePresets.find(t => t.id === activeTheme);
      if (preset) applyCSS(preset);
    }
  }, []);

  const applyTheme = (themeId: string, customHex?: string) => {
    if (themeId === 'custom' && customHex) {
      applyCSS(makeCustomPreset(customHex));
      localStorage.setItem('theme_color_id', 'custom');
      localStorage.setItem('theme_custom_hex', customHex);
      setActiveTheme('custom');
      setCustomColorState(customHex);
    } else {
      const preset = themePresets.find(t => t.id === themeId);
      if (preset) {
        applyCSS(preset);
        localStorage.setItem('theme_color_id', themeId);
        setActiveTheme(themeId);
      }
    }
  };

  return (
    <ThemeColorContext.Provider value={{
      activeTheme,
      customColor,
      setTheme: setActiveTheme,
      setCustomColor: setCustomColorState,
      applyTheme,
    }}>
      {children}
    </ThemeColorContext.Provider>
  );
}

export function useThemeColor() {
  const ctx = useContext(ThemeColorContext);
  if (!ctx) throw new Error('useThemeColor must be used within ThemeColorProvider');
  return ctx;
}
