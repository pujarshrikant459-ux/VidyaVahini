
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { PlaceHolderImages, type ImagePlaceholder } from "@/lib/placeholder-images";

interface GalleryContextType {
  photos: ImagePlaceholder[];
  videos: ImagePlaceholder[];
  addGalleryItem: (type: 'photo' | 'video', item: ImagePlaceholder) => void;
  deleteGalleryItem: (type: 'photo' | 'video', id: string) => void;
}

const GalleryContext = createContext<GalleryContextType | undefined>(undefined);

const GALLERY_STORAGE_KEY = 'vva-gallery';

const initialPhotos = PlaceHolderImages.filter(p => !p.id.startsWith('video-'));
const initialVideos = PlaceHolderImages.filter(p => p.id.startsWith('video-'));


export function GalleryProvider({ children }: { children: ReactNode }) {
  const [photos, setPhotos] = useState<ImagePlaceholder[]>(initialPhotos);
  const [videos, setVideos] = useState<ImagePlaceholder[]>(initialVideos);

  useEffect(() => {
    // This effect runs only on the client-side
    const stored = localStorage.getItem(GALLERY_STORAGE_KEY);
    if (stored) {
      try {
        const { photos: storedPhotos, videos: storedVideos } = JSON.parse(stored);
        if (storedPhotos) setPhotos(storedPhotos);
        if (storedVideos) setVideos(storedVideos);
      } catch (e) {
        console.error("Failed to parse gallery from localStorage", e);
        // If parsing fails, we stick with the initial data
      }
    }
  }, []);

  useEffect(() => {
    // This effect also runs only on the client-side
    const galleryState = { photos, videos };
    // We don't want to write the initial server data to localStorage immediately
    if (JSON.stringify(photos) !== JSON.stringify(initialPhotos) || JSON.stringify(videos) !== JSON.stringify(initialVideos)) {
      localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(galleryState));
    }
  }, [photos, videos]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === GALLERY_STORAGE_KEY && event.newValue) {
        try {
            const { photos, videos } = JSON.parse(event.newValue);
            setPhotos(photos);
            setVideos(videos);
        } catch (e) {
            console.error("Failed to parse gallery from storage event", e);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const addGalleryItem = (type: 'photo' | 'video', item: ImagePlaceholder) => {
    if (type === 'photo') {
      setPhotos(prev => [item, ...prev]);
    } else {
      setVideos(prev => [item, ...prev]);
    }
  };
  
  const deleteGalleryItem = (type: 'photo' | 'video', id: string) => {
     if (type === 'photo') {
      setPhotos(prev => prev.filter(p => p.id !== id));
    } else {
      setVideos(prev => prev.filter(v => v.id !== id));
    }
  }

  return (
    <GalleryContext.Provider value={{ photos, videos, addGalleryItem, deleteGalleryItem }}>
      {children}
    </GalleryContext.Provider>
  );
}

export function useGallery() {
  const context = useContext(GalleryContext);
  if (context === undefined) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
}
