"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Language = "de" | "az";

type LanguageState = {
  language: Language;
  setLanguage: (language: Language) => void;
};

const LanguageContext = createContext<LanguageState>({
  language: "de",
  setLanguage: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("de");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("fisi-language");
      if (stored === "de" || stored === "az") setLanguageState(stored);
    } catch {
      // Private browsing may restrict storage; German remains the fallback.
    }
  }, []);

  function setLanguage(next: Language) {
    setLanguageState(next);
    try {
      localStorage.setItem("fisi-language", next);
    } catch {
      // Language switching works for the current session without storage.
    }
  }

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
