
"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';

import en from '@/lib/locales/en.json';
import kn from '@/lib/locales/kn.json';

const translations = { en, kn };

export type Language = 'en' | 'kn';

interface LocalizationContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof typeof en) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'vva-language';

export function LocalizationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const storedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
    if (storedLang && (storedLang === 'en' || storedLang === 'kn')) {
      setLanguageState(storedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  };

  const t = useCallback((key: keyof typeof en): string => {
    return translations[language][key] || translations['en'][key] || key;
  }, [language]);

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
}
