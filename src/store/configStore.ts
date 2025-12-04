import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SiteConfig, defaultConfig } from '@/types/config';

// Clear corrupted or oversized localStorage on load
if (typeof window !== 'undefined') {
  try {
    const stored = localStorage.getItem('bio-config');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Check if stored data is too large (> 2MB indicates base64 images stored)
      if (stored.length > 2 * 1024 * 1024) {
        console.warn('localStorage data too large, clearing...');
        localStorage.removeItem('bio-config');
      }
    }
  } catch {
    localStorage.removeItem('bio-config');
  }
}

interface ConfigStore {
  config: SiteConfig;
  isSettingsOpen: boolean;
  isLoading: boolean;
  
  setConfig: (config: Partial<SiteConfig>) => void;
  resetConfig: () => void;
  toggleSettings: () => void;
  setLoading: (loading: boolean) => void;
  
  // Individual setters for common operations
  setAvatar: (avatar: string) => void;
  setUsername: (username: string) => void;
  setBio: (bio: string) => void;
  setBackgroundType: (type: SiteConfig['backgroundType']) => void;
  setCursorStyle: (style: SiteConfig['cursorStyle']) => void;
  toggleMusic: () => void;
  setMusicVolume: (volume: number) => void;
  setPrimaryColor: (color: string) => void;
  setSecondaryColor: (color: string) => void;
  setAccentColor: (color: string) => void;
}

export const useConfigStore = create<ConfigStore>()(
  persist(
    (set) => ({
      config: defaultConfig,
      isSettingsOpen: false,
      isLoading: false,
      
      setConfig: (newConfig) =>
        set((state) => ({
          config: { ...state.config, ...newConfig },
        })),
      
      resetConfig: () => set({ config: defaultConfig }),
      
      toggleSettings: () =>
        set((state) => ({ isSettingsOpen: !state.isSettingsOpen })),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setAvatar: (avatar) =>
        set((state) => ({
          config: { ...state.config, avatar },
        })),
      
      setUsername: (username) =>
        set((state) => ({
          config: { ...state.config, username },
        })),
      
      setBio: (bio) =>
        set((state) => ({
          config: { ...state.config, bio },
        })),
      
      setBackgroundType: (backgroundType) =>
        set((state) => ({
          config: { ...state.config, backgroundType },
        })),
      
      setCursorStyle: (cursorStyle) =>
        set((state) => ({
          config: { ...state.config, cursorStyle },
        })),
      
      toggleMusic: () =>
        set((state) => ({
          config: { ...state.config, musicEnabled: !state.config.musicEnabled },
        })),
      
      setMusicVolume: (musicVolume) =>
        set((state) => ({
          config: { ...state.config, musicVolume },
        })),
      
      setPrimaryColor: (primaryColor) =>
        set((state) => ({
          config: { ...state.config, primaryColor },
        })),
      
      setSecondaryColor: (secondaryColor) =>
        set((state) => ({
          config: { ...state.config, secondaryColor },
        })),
      
      setAccentColor: (accentColor) =>
        set((state) => ({
          config: { ...state.config, accentColor },
        })),
    }),
    {
      name: 'bio-config',
      // Exclude large base64 data from localStorage to prevent quota exceeded errors
      partialize: (state) => ({
        ...state,
        config: {
          ...state.config,
          // Don't persist large base64 images
          avatar: state.config.avatar?.startsWith('data:') ? '/avatar.svg' : state.config.avatar,
          customCursor: '', // Never persist cursor in localStorage
          // Reset cursor style to default if custom cursor was used (since we don't persist the image)
          cursorStyle: state.config.cursorStyle === 'custom' ? 'default' : state.config.cursorStyle,
          backgroundImage: state.config.backgroundImage?.startsWith('data:') ? '' : state.config.backgroundImage,
          discordAvatar: state.config.discordAvatar?.startsWith('data:') ? '' : state.config.discordAvatar,
          musicData: '', // Never persist music data
        },
      }),
    }
  )
);
