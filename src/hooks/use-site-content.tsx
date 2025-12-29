
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

const defaultAboutContent = "Shiksha Connect is a modern, professional portal for Karnataka Government Schools, designed to bridge the communication gap between parents, students, and teachers. Our mission is to provide an easy-to-use platform for all school-related information, promoting transparency and collaboration.";

interface SiteContentContextType {
  aboutContent: string;
  setAboutContent: (content: string) => void;
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

const ABOUT_CONTENT_STORAGE_KEY = 'vva-about-content';

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [aboutContent, setAboutContentState] = useState<string>(defaultAboutContent);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, after the initial render.
    const storedContent = localStorage.getItem(ABOUT_CONTENT_STORAGE_KEY);
    if (storedContent) {
      setAboutContentState(storedContent);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    // This effect saves to localStorage only after the state has been initialized.
    if (isInitialized) {
        localStorage.setItem(ABOUT_CONTENT_STORAGE_KEY, aboutContent);
    }
  }, [aboutContent, isInitialized]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === ABOUT_CONTENT_STORAGE_KEY && event.newValue) {
        setAboutContentState(event.newValue);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const setAboutContent = (content: string) => {
    setAboutContentState(content);
  };

  return (
    <SiteContentContext.Provider value={{ aboutContent, setAboutContent }}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);
  if (context === undefined) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return context;
}
