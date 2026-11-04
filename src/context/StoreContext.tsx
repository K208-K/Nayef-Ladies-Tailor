import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  Category,
  Design,
  BoutiqueHotspot,
  GalleryItem,
  Testimonial,
  SiteSettings,
} from '../types/boutique';
import { INITIAL_BOUTIQUE_DB } from '../data/seedData';

interface StoreContextValue {
  categories: Category[];
  designs: Design[];
  hotspots: BoutiqueHotspot[];
  gallery: GalleryItem[];
  testimonials: Testimonial[];
  settings: SiteSettings;
  loading: boolean;
  refreshStore: () => Promise<void>;
  adminToken: string | null;
  setAdminToken: (token: string | null) => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

const TOKEN_STORAGE_KEY = 'amani_couture_admin_token';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>(INITIAL_BOUTIQUE_DB.categories);
  const [designs, setDesigns] = useState<Design[]>(INITIAL_BOUTIQUE_DB.designs);
  const [hotspots, setHotspots] = useState<BoutiqueHotspot[]>(INITIAL_BOUTIQUE_DB.hotspots);
  const [gallery, setGallery] = useState<GalleryItem[]>(INITIAL_BOUTIQUE_DB.gallery);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(INITIAL_BOUTIQUE_DB.testimonials);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_BOUTIQUE_DB.settings);
  const [loading, setLoading] = useState<boolean>(false);
  const [adminToken, setAdminTokenState] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem(TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  });

  const setAdminToken = useCallback((token: string | null) => {
    setAdminTokenState(token);
    try {
      if (token) sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
      else sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch {
      // Ignore storage restrictions
    }
  }, []);

  const refreshStore = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/bootstrap');
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.categories)) setCategories(data.categories);
      if (Array.isArray(data.designs)) setDesigns(data.designs);
      if (Array.isArray(data.hotspots)) setHotspots(data.hotspots);
      if (Array.isArray(data.gallery)) setGallery(data.gallery);
      if (Array.isArray(data.testimonials)) setTestimonials(data.testimonials);
      if (data.settings) setSettings(data.settings);
    } catch {
      // Fallback to seeded client state if offline
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshStore();
  }, [refreshStore]);

  return (
    <StoreContext.Provider
      value={{
        categories,
        designs,
        hotspots,
        gallery,
        testimonials,
        settings,
        loading,
        refreshStore,
        adminToken,
        setAdminToken,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
