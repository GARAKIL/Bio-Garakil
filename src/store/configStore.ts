import { create } from 'zustand';
import { SiteConfig, defaultConfig } from '@/types/config';

// Поля с большими данными - сохраняем только в localStorage (только base64)
const LOCAL_ONLY_FIELDS: (keyof SiteConfig)[] = ['backgroundVideo', 'customCursor'];

// Сохранить большие base64 данные в localStorage
function saveLargeDataToLocal(config: Partial<SiteConfig>) {
  if (typeof window === 'undefined') return;
  
  try {
    const largeData: Record<string, string> = {};
    for (const field of LOCAL_ONLY_FIELDS) {
      const value = config[field] as string | undefined;
      // Сохраняем только base64 данные
      if (value && value.startsWith('data:')) {
        largeData[field] = value;
      }
    }
    // Также сохраняем большие base64 для фона и музыки если они есть
    if (config.backgroundImage && (config.backgroundImage as string).startsWith('data:')) {
      largeData.backgroundImage = config.backgroundImage;
    }
    if (config.musicUrl && (config.musicUrl as string).startsWith('data:')) {
      largeData.musicUrl = config.musicUrl;
    }
    
    if (Object.keys(largeData).length > 0) {
      localStorage.setItem('bio-large-data', JSON.stringify(largeData));
    }
  } catch (e) {
    console.warn('Failed to save large data to localStorage:', e);
  }
}

// Загрузить большие данные из localStorage
function loadLargeDataFromLocal(): Partial<SiteConfig> {
  if (typeof window === 'undefined') return {};
  
  try {
    const data = localStorage.getItem('bio-large-data');
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn('Failed to load large data from localStorage:', e);
  }
  return {};
}

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
      
      console.log('loadConfigFromServer response:', data);
      
      if (data.success && data.data) {
        // Загружаем конфиг с сервера
        let loadedConfig = { ...defaultConfig, ...data.data };
        
        // Загружаем локальные base64 данные (только если на сервере пусто)
        const localData = loadLargeDataFromLocal();
        for (const [key, value] of Object.entries(localData)) {
          // Применяем локальные данные только если серверные пусты
          if (!loadedConfig[key as keyof SiteConfig]) {
            (loadedConfig as Record<string, unknown>)[key] = value;
          }
        }
        
        console.log('Loaded config cursorStyle:', loadedConfig.cursorStyle);
        set({ config: loadedConfig, draftConfig: loadedConfig });
      } else {
        // Если на сервере нет данных, пробуем загрузить из localStorage
        const localData = loadLargeDataFromLocal();
        if (Object.keys(localData).length > 0) {
          const loadedConfig = { ...defaultConfig, ...localData };
          set({ config: loadedConfig, draftConfig: loadedConfig });
        }
      }
    } catch (error) {
      console.error('Failed to load config:', error);
      // При ошибке пробуем localStorage
      const localData = loadLargeDataFromLocal();
      if (Object.keys(localData).length > 0) {
        const loadedConfig = { ...defaultConfig, ...localData };
        set({ config: loadedConfig, draftConfig: loadedConfig });
      }
    } finally {
      set({ isLoading: false });
    }
  },
  
  saveConfigToServer: async () => {
    const { draftConfig, password } = get();
    
    try {
      set({ isLoading: true });
      
      // Сохраняем большие данные в localStorage
      saveLargeDataToLocal(draftConfig);
      
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, config: draftConfig }),
      });
      
      const data = await response.json();
      console.log('saveConfigToServer response:', data);
      
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
