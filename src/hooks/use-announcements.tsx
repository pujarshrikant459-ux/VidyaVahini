"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { announcements as initialAnnouncements } from "@/lib/data";
import type { Announcement } from "@/lib/types";

interface AnnouncementsContextType {
  announcements: Announcement[];
  addAnnouncement: (title: string, content: string) => void;
  deleteAnnouncement: (id: string) => void;
}

const AnnouncementsContext = createContext<AnnouncementsContextType | undefined>(undefined);

export function AnnouncementsProvider({ children }: { children: ReactNode }) {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);

  const addAnnouncement = (title: string, content: string) => {
    const newAnnouncement: Announcement = {
      id: `anno-${Date.now()}`,
      title,
      content,
      date: new Date().toISOString(),
    };
    setAnnouncements(prev => [newAnnouncement, ...prev]);
  };
  
  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  }

  return (
    <AnnouncementsContext.Provider value={{ announcements, addAnnouncement, deleteAnnouncement }}>
      {children}
    </AnnouncementsContext.Provider>
  );
}

export function useAnnouncements() {
  const context = useContext(AnnouncementsContext);
  if (context === undefined) {
    throw new Error('useAnnouncements must be used within an AnnouncementsProvider');
  }
  return context;
}
