import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import defaultLogo from "@/assets/logo-mockup-pesantren-alhikmah.png";

export type LogoMode = "complete" | "manual";

export const DEFAULT_LOGO_URL = defaultLogo;

interface LogoState {
  logoMode: LogoMode;
  logoUrl: string | null;
  /** Logo yang selalu tersedia (fallback ke logo bawaan pesantren) */
  displayLogoUrl: string;
  institutionName: string;
  tagline: string;
  setLogoMode: (mode: LogoMode) => void;
  setLogoUrl: (url: string | null) => void;
  setInstitutionName: (name: string) => void;
  setTagline: (tagline: string) => void;
}

const LogoContext = createContext<LogoState | undefined>(undefined);

const STORAGE_KEY = "boardingcore_logo";

interface StoredLogo {
  logoMode: LogoMode;
  logoUrl: string | null;
  institutionName: string;
  tagline: string;
}

function loadStored(): StoredLogo {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    logoMode: "manual",
    logoUrl: null,
    institutionName: "Pesantren Al-Hikmah",
    tagline: "Modern Islamic Boarding School",
  };
}

export function LogoProvider({ children }: { children: ReactNode }) {
  const stored = loadStored();
  const [logoMode, setLogoMode] = useState<LogoMode>(stored.logoMode);
  const [logoUrl, setLogoUrl] = useState<string | null>(stored.logoUrl);
  const [institutionName, setInstitutionName] = useState(stored.institutionName);
  const [tagline, setTagline] = useState(stored.tagline);

  useEffect(() => {
    const data: StoredLogo = { logoMode, logoUrl, institutionName, tagline };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [logoMode, logoUrl, institutionName, tagline]);

  return (
    <LogoContext.Provider value={{ logoMode, logoUrl, institutionName, tagline, setLogoMode, setLogoUrl, setInstitutionName, setTagline }}>
      {children}
    </LogoContext.Provider>
  );
}

export function useLogo() {
  const ctx = useContext(LogoContext);
  if (!ctx) throw new Error("useLogo must be used within LogoProvider");
  return ctx;
}
