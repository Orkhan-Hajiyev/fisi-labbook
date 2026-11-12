"use client";

import { createContext, useContext, useEffect, useSyncExternalStore } from "react";

export type Language = "de" | "az";
type LanguageState = { language: Language; setLanguage: (language: Language) => void };
const KEY = "fisi-language";
const EVENT = "fisi-language-updated";
const LanguageContext = createContext<LanguageState>({ language: "de", setLanguage: () => {} });

function readLanguage(): Language {
  try {
    const stored = window.localStorage.getItem(KEY);
    return stored === "az" ? "az" : "de";
  } catch {
    return "de";
  }
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENT, callback);
  };
}

function getServerLanguage(): Language {
  return "de";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useSyncExternalStore(subscribe, readLanguage, getServerLanguage);

  function setLanguage(next: Language) {
    try {
      window.localStorage.setItem(KEY, next);
    } catch {
      // Language remains German when browser storage is unavailable.
    }
    window.dispatchEvent(new Event(EVENT));
  }

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
