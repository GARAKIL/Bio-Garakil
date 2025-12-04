import { create } from 'zustand';
import { SiteConfig, defaultConfig } from '@/types/config';

interface ConfigStore {
  config: SiteConfig;
  isSettingsOpen: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  password: string;
  
  setConfig: (config: Partial<SiteConfig>) => void;
  resetConfig: () => void;
  toggleSettings: () => void;
  setLoading: (loading: boolean) => void;
  setPassword: (password: string) => void;
  setAuthenticated: (auth: boolean) => void;
  loadConfigFromServer: () => Promise<void>;
  saveConfigToServer: () => Promise<{ success: boolean; error?: string }>;
  
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

export const useConfigStore = create<ConfigStore>()((set, get) => ({
  config: defaultConfig,
  isSettingsOpen: false,
  isLoading: false,
  isAuthenticated: false,
  password: '',
  
  setConfig: (newConfig) =>
    set((state) => ({
      config: { ...state.config, ...newConfig },
    })),
  
  resetConfig: () => set({ config: defaultConfig }),
  
  toggleSettings: () =>
    set((state) => ({ isSettingsOpen: !state.isSettingsOpen })),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setPassword: (password) => set({ password }),
  
  setAuthenticated: (auth) => set({ isAuthenticated: auth }),
  
  loadConfigFromServer: async () => {
    try {
      set({ isLoading: true });
      const response = await fetch('/api/config');
      const data = await response.json();
      
      if (data.success && data.data) {
        set({ config: { ...defaultConfig, ...data.data } });
      }
    } catch (error) {
      console.error('Failed to load config:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  saveConfigToServer: async () => {
    const { config, password } = get();
    
    try {
      set({ isLoading: true });
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, config }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        set({ isAuthenticated: true });
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Ошибка сохранения' };
      }
    } catch (error) {
      console.error('Failed to save config:', error);
      return { success: false, error: 'Ошибка сети' };
    } finally {
      set({ isLoading: false });
    }
  },
  
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
}));
