"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { announcements as initialAnnouncements } from "@/lib/data";
import type { Announcement } from "@/lib/types";

interface AnnouncementsContextType {
  announcements: Announcement[];
  addAnnouncement: (title: string, content: string) => void;
  deleteAnnouncement: (id: string) => void;
  notificationCount: number;
  resetNotificationCount: () => void;
}

const AnnouncementsContext = createContext<AnnouncementsContextType | undefined>(undefined);

const ANNOUNCEMENTS_STORAGE_KEY = 'vva-announcements';
const NOTIFICATION_STORAGE_KEY = 'vva-notification-count';

export function AnnouncementsProvider({ children }: { children: ReactNode }) {
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    if (typeof window === 'undefined') {
      return initialAnnouncements;
    }
    const storedAnnouncements = localStorage.getItem(ANNOUNCEMENTS_STORAGE_KEY);
    return storedAnnouncements ? JSON.parse(storedAnnouncements) : initialAnnouncements;
  });
  const [notificationCount, setNotificationCount] = useState<number>(0);

  useEffect(() => {
    const storedCount = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
    setNotificationCount(storedCount ? parseInt(storedCount, 10) : 0);
  }, []);

  useEffect(() => {
    localStorage.setItem(ANNOUNCEMENTS_STORAGE_KEY, JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, notificationCount.toString());
  }, [notificationCount]);
  
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === ANNOUNCEMENTS_STORAGE_KEY && event.newValue) {
        setAnnouncements(JSON.parse(event.newValue));
      }
      if (event.key === NOTIFICATION_STORAGE_KEY && event.newValue) {
        setNotificationCount(parseInt(event.newValue, 10));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const addAnnouncement = (title: string, content: string) => {
    const newAnnouncement: Announcement = {
      id: `anno-${Date.now()}`,
      title,
      content,
      date: new Date().toISOString(),
    };
    setAnnouncements(prev => [newAnnouncement, ...prev]);
    setNotificationCount(prev => prev + 1);
  };
  
  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  }

  const resetNotificationCount = () => {
    setNotificationCount(0);
  }

  return (
    <AnnouncementsContext.Provider value={{ announcements, addAnnouncement, deleteAnnouncement, notificationCount, resetNotificationCount }}>
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
