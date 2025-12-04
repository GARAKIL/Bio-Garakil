import { create } from 'zustand';
import { SiteConfig, defaultConfig } from '@/types/config';

interface ConfigStore {
  config: SiteConfig;
  draftConfig: SiteConfig; // Временные изменения (до сохранения)
  isSettingsOpen: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  password: string;
  
  setConfig: (config: Partial<SiteConfig>) => void;
  setDraftConfig: (config: Partial<SiteConfig>) => void;
  resetDraft: () => void;
  applyDraft: () => void;
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
  draftConfig: defaultConfig,
  isSettingsOpen: false,
  isLoading: false,
  isAuthenticated: false,
  password: '',
  
  setConfig: (newConfig) =>
    set((state) => ({
      config: { ...state.config, ...newConfig },
    })),
  
  // Изменения в панели настроек идут в draft
  setDraftConfig: (newConfig) =>
    set((state) => ({
      draftConfig: { ...state.draftConfig, ...newConfig },
    })),
  
  // Сбросить draft к текущему config
  resetDraft: () =>
    set((state) => ({
      draftConfig: { ...state.config },
    })),
  
  // Применить draft к config (после успешного сохранения)
  applyDraft: () =>
    set((state) => ({
      config: { ...state.draftConfig },
    })),
  
  resetConfig: () => set({ config: defaultConfig, draftConfig: defaultConfig }),
  
  toggleSettings: () =>
    set((state) => {
      // При открытии панели - копируем config в draft
      if (!state.isSettingsOpen) {
        return { isSettingsOpen: true, draftConfig: { ...state.config } };
      }
      return { isSettingsOpen: false };
    }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setPassword: (password) => set({ password }),
  
  setAuthenticated: (auth) => set({ isAuthenticated: auth }),
  
  loadConfigFromServer: async () => {
    try {
      set({ isLoading: true });
      const response = await fetch('/api/config');
      const data = await response.json();
      
      if (data.success && data.data) {
        const loadedConfig = { ...defaultConfig, ...data.data };
        set({ config: loadedConfig, draftConfig: loadedConfig });
      }
    } catch (error) {
      console.error('Failed to load config:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  saveConfigToServer: async () => {
    const { draftConfig, password } = get();
    
    try {
      set({ isLoading: true });
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, config: draftConfig }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Применяем draft к основному config только после успешного сохранения
        set({ isAuthenticated: true, config: { ...draftConfig } });
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
