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
  const [photos, setPhotos] = useState<ImagePlaceholder[]>(() => {
    if (typeof window === 'undefined') return initialPhotos;
    const stored = localStorage.getItem(GALLERY_STORAGE_KEY);
    return stored ? JSON.parse(stored).photos : initialPhotos;
  });

  const [videos, setVideos] = useState<ImagePlaceholder[]>(() => {
    if (typeof window === 'undefined') return initialVideos;
    const stored = localStorage.getItem(GALLERY_STORAGE_KEY);
    return stored ? JSON.parse(stored).videos : initialVideos;
  });

  useEffect(() => {
    const galleryState = { photos, videos };
    localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(galleryState));
  }, [photos, videos]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === GALLERY_STORAGE_KEY && event.newValue) {
        const { photos, videos } = JSON.parse(event.newValue);
        setPhotos(photos);
        setVideos(videos);
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
