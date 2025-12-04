'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';
import { useConfigStore } from '@/store/configStore';
import { CloseIcon, SettingsIcon } from '@/components/icons';
import { BackgroundType, CursorStyle, EffectOverlay, SocialLink } from '@/types/config';

// View counter hook for settings (uses API)
const useAdminViewCount = () => {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchViews = useCallback(async () => {
    try {
      const response = await fetch('/api/views');
      const data = await response.json();
      setCount(data.views || 0);
    } catch (error) {
      console.error('Failed to fetch views:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchViews();
  }, [fetchViews]);
  
  const updateCount = async (newCount: number) => {
    try {
      const response = await fetch('/api/views', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ views: newCount }),
      });
      const data = await response.json();
      setCount(data.views || newCount);
    } catch (error) {
      console.error('Failed to update views:', error);
    }
  };
  
  const resetCount = async () => {
    await updateCount(0);
    sessionStorage.removeItem('bio-viewed-session');
  };
  
  return { count, isLoading, updateCount, resetCount, refetch: fetchViews };
};

// Compact Icons
const Icons = {
  profile: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>,
  background: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>,
  effects: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3zm13.71-9.37l-1.34-1.34c-.39-.39-1.02-.39-1.41 0L9 12.25 11.75 15l8.96-8.96c.39-.39.39-1.02 0-1.41z"/></svg>,
  links: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>,
  discord: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>,
  image: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>,
  video: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>,
  particles: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>,
  gradient: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>,
  snow: <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M22 11h-4.17l3.24-3.24-1.41-1.42L15 11h-2V9l4.66-4.66-1.42-1.41L13 6.17V2h-2v4.17L7.76 2.93 6.34 4.34 11 9v2H9L4.34 6.34 2.93 7.76 6.17 11H2v2h4.17l-3.24 3.24 1.41 1.42L9 13h2v2l-4.66 4.66 1.42 1.41L11 17.83V22h2v-4.17l3.24 3.24 1.42-1.41L13 15v-2h2l4.66 4.66 1.41-1.42L17.83 13H22z"/></svg>,
  rain: <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z"/></svg>,
  stars: <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>,
  music: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>,
  check: <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>,
  cube: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44c-.16.12-.36.18-.57.18s-.41-.06-.57-.18l-7.9-4.44A.991.991 0 0 1 3 16.5v-9c0-.38.21-.71.53-.88l7.9-4.44c.16-.12.36-.18.57-.18s.41.06.57.18l7.9 4.44c.32.17.53.5.53.88v9z"/></svg>,
  cursor: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M13.64 21.97C13.14 22.21 12.54 22 12.31 21.5L10.13 16.76L7.62 18.78C7.45 18.92 7.24 19 7.02 19C6.44 19 6 18.55 6 18V3C6 2.44 6.44 2 7 2C7.21 2 7.43 2.08 7.62 2.22L19.78 11.69C20.13 11.95 20.23 12.42 20.03 12.8C19.89 13.06 19.62 13.24 19.31 13.26L14.45 13.67L16.69 18.47C16.94 18.96 16.72 19.55 16.22 19.8L13.64 21.97Z"/></svg>,
  upload: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z"/></svg>,
  trash: <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>,
  plus: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>,
  palette: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>,
};

// Section component
const Section = ({ title, icon, children, className = '' }: { title?: string; icon?: React.ReactNode; children: React.ReactNode; className?: string }) => (
  <div className={`rounded-xl p-4 ${className}`} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
    {title && (
      <h4 className="text-sm font-medium mb-3 flex items-center gap-2 text-white/90">
        {icon}
        {title}
      </h4>
    )}
    {children}
  </div>
);

// Toggle component
const Toggle = ({ label, checked, onChange, color }: { label: string; checked: boolean; onChange: (v: boolean) => void; color: string }) => (
  <label className="flex items-center justify-between py-1.5 cursor-pointer group">
    <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors">{label}</span>
    <div 
      className="w-10 h-5 rounded-full relative transition-all duration-200 cursor-pointer"
      style={{ background: checked ? color : 'rgba(255,255,255,0.1)' }}
      onClick={() => onChange(!checked)}
    >
      <div 
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-200"
        style={{ left: checked ? '22px' : '2px' }}
      />
    </div>
  </label>
);

// Slider component
const Slider = ({ label, value, onChange, min = 0, max = 100, unit = '', color }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; unit?: string; color: string }) => (
  <div className="py-1.5">
    <div className="flex justify-between text-xs mb-1.5">
      <span className="text-white/50">{label}</span>
      <span className="text-white/70 font-mono">{value}{unit}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
      style={{ 
        background: `linear-gradient(to right, ${color} 0%, ${color} ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) 100%)`,
      }}
    />
  </div>
);

// Color picker component
const ColorPicker = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div className="flex items-center justify-between py-1.5">
    <span className="text-sm text-white/70">{label}</span>
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border border-white/10 p-0.5"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-20 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-center"
      />
    </div>
  </div>
);

// Option button component
const OptionButton = ({ selected, onClick, children, color }: { selected: boolean; onClick: () => void; children: React.ReactNode; color: string }) => (
  <button
    onClick={onClick}
    className="px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 font-medium"
    style={{
      background: selected ? color : 'rgba(255,255,255,0.05)',
      color: selected ? '#000' : 'rgba(255,255,255,0.6)',
      border: selected ? 'none' : '1px solid rgba(255,255,255,0.08)',
    }}
  >
    {children}
  </button>
);

export function SettingsPanel() {
  const { config, draftConfig, isSettingsOpen, toggleSettings, setDraftConfig, resetDraft, resetConfig, password, setPassword, isAuthenticated, saveConfigToServer, isLoading } = useConfigStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'background' | 'effects' | 'links'>('profile');
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const { count: viewCount, updateCount: setViewCount, resetCount: resetViewCount, isLoading: viewsLoading } = useAdminViewCount();
  
  // Use draftConfig for editing in settings panel
  const editConfig = draftConfig;
  const setConfig = setDraftConfig;
  
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const musicInputRef = useRef<HTMLInputElement>(null);
  const cursorInputRef = useRef<HTMLInputElement>(null);
  const discordAvatarInputRef = useRef<HTMLInputElement>(null);

  const backgroundOptions: { value: BackgroundType; label: string; icon: React.ReactNode }[] = [
    { value: 'image', label: 'Фото', icon: Icons.image },
    { value: 'video', label: 'Видео', icon: Icons.video },
    { value: 'particles', label: 'Частицы', icon: Icons.particles },
    { value: 'gradient', label: 'Градиент', icon: Icons.gradient },
  ];

  const effectOverlayOptions: { value: EffectOverlay; label: string; icon: React.ReactNode | null }[] = [
    { value: 'none', label: 'Нет', icon: null },
    { value: 'snow', label: 'Снег', icon: Icons.snow },
    { value: 'rain', label: 'Дождь', icon: Icons.rain },
    { value: 'particles', label: 'Частицы', icon: Icons.particles },
    { value: 'stars', label: 'Звёзды', icon: Icons.stars },
  ];

  const cursorOptions: { value: CursorStyle; label: string }[] = [
    { value: 'default', label: 'Обычный' },
    { value: 'glow', label: 'Свечение' },
    { value: 'ring', label: 'Кольцо' },
    { value: 'trail', label: 'След' },
    { value: 'custom', label: 'Свой' },
  ];

  const iconOptions = ['discord', 'telegram', 'spotify', 'youtube', 'twitch', 'github', 'twitter', 'instagram'];

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'avatar' | 'background' | 'video' | 'music' | 'cursor' | 'discordAvatar'
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (type === 'music') {
      // Convert music to base64 so it persists in localStorage
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setConfig({ musicUrl: result, musicTitle: file.name.replace(/\.[^/.]+$/, ''), musicAutoPlay: true });
        // Dispatch custom event to trigger music playback
        window.dispatchEvent(new CustomEvent('musicLoaded', { detail: { url: result } }));
      };
      reader.readAsDataURL(file);
      return;
    }

    if (type === 'video') {
      // For video we use blob URL since base64 would be too large
      const url = URL.createObjectURL(file);
      setConfig({ backgroundVideo: url, backgroundType: 'video' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      switch (type) {
        case 'avatar':
          setConfig({ avatar: result });
          break;
        case 'background':
          setConfig({ backgroundImage: result, backgroundType: 'image' });
          break;
        case 'cursor':
          // Set custom cursor and switch to default style first to show it properly
          setConfig({ customCursor: result, cursorStyle: 'custom' });
          break;
        case 'discordAvatar':
          setConfig({ discordAvatar: result });
          break;
      }
    };
    reader.readAsDataURL(file);
  };

  const addLink = () => {
    const newLink: SocialLink = {
      id: `link-${Date.now()}`,
      platform: 'discord',
      label: 'Новая ссылка',
      url: 'https://',
      icon: 'discord',
      enabled: true,
    };
    setConfig({ links: [...editConfig.links, newLink] });
  };

  const updateLink = (id: string, updates: Partial<SocialLink>) => {
    setConfig({
      links: editConfig.links.map(link => link.id === id ? { ...link, ...updates } : link)
    });
  };

  const deleteLink = (id: string) => {
    setConfig({ links: editConfig.links.filter(link => link.id !== id) });
  };

  const tabs = [
    { id: 'profile', label: 'Профиль', icon: Icons.profile },
    { id: 'background', label: 'Фон', icon: Icons.background },
    { id: 'effects', label: 'Эффекты', icon: Icons.effects },
    { id: 'links', label: 'Ссылки', icon: Icons.links },
  ];

  return (
    <AnimatePresence>
      {isSettingsOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100]"
            onClick={toggleSettings}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md z-[101] overflow-hidden flex flex-col"
            style={{ 
              background: 'linear-gradient(180deg, rgba(15,15,20,0.98) 0%, rgba(10,10,15,0.99) 100%)',
              borderLeft: `1px solid ${editConfig.primaryColor}20`,
              boxShadow: `-20px 0 60px rgba(0,0,0,0.5)`,
            }}
          >
            {/* Header */}
            <div className="p-5 flex items-center justify-between" style={{ borderBottom: `1px solid ${editConfig.primaryColor}20` }}>
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${editConfig.primaryColor}20` }}
                >
                  <SettingsIcon size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Настройки</h2>
                  <p className="text-xs text-white/40">Кастомизация профиля</p>
                </div>
              </div>
              <button
                onClick={toggleSettings}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105 hover:bg-white/10"
              >
                <CloseIcon size={20} className="text-white/60" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex px-4 py-2 gap-1" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className="flex-1 py-2.5 rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 font-medium"
                  style={{
                    background: activeTab === tab.id ? `${editConfig.primaryColor}20` : 'transparent',
                    color: activeTab === tab.id ? editConfig.primaryColor : 'rgba(255,255,255,0.4)',
                    border: activeTab === tab.id ? `1px solid ${editConfig.primaryColor}30` : '1px solid transparent',
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">{/* Profile Tab */}
              {activeTab === 'profile' && (
                <>
                  {/* Avatar Section */}
                  <Section title="Аватар" icon={Icons.profile}>
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-20 h-20 rounded-2xl overflow-hidden"
                        style={{ 
                          boxShadow: `0 0 0 2px black, 0 0 0 4px ${editConfig.primaryColor}` 
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={editConfig.avatar} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <button
                          onClick={() => avatarInputRef.current?.click()}
                          className="w-full px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                          style={{ background: `${editConfig.primaryColor}20`, color: editConfig.primaryColor, border: `1px solid ${editConfig.primaryColor}30` }}
                        >
                          {Icons.upload}
                          Загрузить
                        </button>
                        <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'avatar')} />
                        <p className="text-[10px] text-white/30 text-center">PNG, JPG до 5MB</p>
                      </div>
                    </div>
                  </Section>

                  {/* Info Section */}
                  <Section title="Информация" icon={Icons.profile}>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-white/40 mb-1.5">Имя пользователя</label>
                        <input
                          type="text"
                          value={editConfig.username}
                          onChange={(e) => setConfig({ username: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-white/20 text-sm"
                          placeholder="Ваше имя"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-white/40 mb-1.5">Описание</label>
                        <textarea
                          value={editConfig.bio}
                          onChange={(e) => setConfig({ bio: e.target.value })}
                          rows={2}
                          className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-white/20 resize-none text-sm"
                          placeholder="О себе..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-white/40 mb-1.5">Локация</label>
                        <input
                          type="text"
                          value={editConfig.location}
                          onChange={(e) => setConfig({ location: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 focus:outline-none focus:border-white/20 text-sm"
                          placeholder="Город, Страна"
                        />
                      </div>
                    </div>
                  </Section>

                  {/* Colors Section */}
                  <Section title="Цвета" icon={Icons.palette}>
                    <div className="space-y-1">
                      <ColorPicker label="Основной" value={editConfig.primaryColor} onChange={(v) => setConfig({ primaryColor: v })} />
                      <ColorPicker label="Текст" value={editConfig.textColor} onChange={(v) => setConfig({ textColor: v })} />
                      <ColorPicker label="Рамки" value={editConfig.borderColor} onChange={(v) => setConfig({ borderColor: v })} />
                      <ColorPicker label="Свечение" value={editConfig.glowColor} onChange={(v) => setConfig({ glowColor: v })} />
                    </div>
                  </Section>

                  {/* Discord Card Section */}
                  <Section title="Discord карточка" icon={Icons.discord}>
                    <Toggle 
                      label="Показывать карточку" 
                      checked={editConfig.showDiscordCard} 
                      onChange={(v) => setConfig({ showDiscordCard: v })} 
                      color={editConfig.primaryColor} 
                    />
                    
                    {editConfig.showDiscordCard && (
                      <div className="mt-3 pt-3 border-t border-white/5 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/10 flex-shrink-0 bg-white/5">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                              src={editConfig.discordAvatar || editConfig.avatar || '/avatar.svg'} 
                              alt="" 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/avatar.svg';
                              }}
                            />
                          </div>
                          <button
                            onClick={() => discordAvatarInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-lg text-xs transition-all"
                            style={{ background: `${editConfig.primaryColor}15`, color: editConfig.primaryColor }}
                          >
                            Изменить аватар
                          </button>
                          <input ref={discordAvatarInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'discordAvatar')} />
                        </div>
                        <input
                          type="text"
                          value={editConfig.discordUsername}
                          onChange={(e) => setConfig({ discordUsername: e.target.value })}
                          placeholder="Discord имя"
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm"
                        />
                        <input
                          type="text"
                          value={editConfig.discordStatus}
                          onChange={(e) => setConfig({ discordStatus: e.target.value })}
                          placeholder="Статус"
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm"
                        />
                      </div>
                    )}
                  </Section>

                  {/* Stats */}
                  <Section title="Статистика" icon={Icons.profile}>
                    <Toggle 
                      label="Показывать просмотры" 
                      checked={editConfig.showViewCount} 
                      onChange={(v) => setConfig({ showViewCount: v })} 
                      color={editConfig.primaryColor} 
                    />
                    
                    {editConfig.showViewCount && (
                      <div className="mt-3 pt-3 border-t border-white/5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white/70">Всего просмотров</span>
                          <span className="text-lg font-bold" style={{ color: editConfig.primaryColor }}>
                            {viewsLoading ? '...' : viewCount}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={viewCount}
                            onChange={(e) => setViewCount(Math.max(0, parseInt(e.target.value) || 0))}
                            className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm"
                            min="0"
                            disabled={viewsLoading}
                          />
                          <button
                            onClick={resetViewCount}
                            disabled={viewsLoading}
                            className="px-3 py-2 rounded-lg text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all disabled:opacity-50"
                          >
                            Сброс
                          </button>
                        </div>
                        <p className="text-[10px] text-white/30">
                          Счётчик увеличивается при каждом новом посещении
                        </p>
                      </div>
                    )}
                  </Section>
                </>
              )}

              {/* Background Tab */}
              {activeTab === 'background' && (
                <>
                  <Section title="Тип фона" icon={Icons.background}>
                    <div className="grid grid-cols-4 gap-2">
                      {backgroundOptions.map((option) => (
                        <OptionButton
                          key={option.value}
                          selected={editConfig.backgroundType === option.value}
                          onClick={() => setConfig({ backgroundType: option.value })}
                          color={editConfig.primaryColor}
                        >
                          <div className="flex flex-col items-center gap-1">
                            {option.icon}
                            <span className="text-[10px]">{option.label}</span>
                          </div>
                        </OptionButton>
                      ))}
                    </div>
                  </Section>

                  {/* Image Upload */}
                  {editConfig.backgroundType === 'image' && (
                    <Section title="Изображение" icon={Icons.image}>
                      {/* URL Input */}
                      <input
                        type="text"
                        value={editConfig.backgroundImage?.startsWith('data:') ? '' : (editConfig.backgroundImage || '')}
                        onChange={(e) => setConfig({ backgroundImage: e.target.value })}
                        placeholder="Вставьте URL изображения (рекомендуется)"
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm mb-2"
                      />
                      <p className="text-[10px] text-white/40 mb-3">
                        💡 Загрузите на imgur.com или Discord и вставьте ссылку
                      </p>
                      
                      <div className="text-center text-white/30 text-xs mb-2">или</div>
                      
                      <button
                        onClick={() => backgroundInputRef.current?.click()}
                        className="w-full h-24 rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-sm text-white/40 hover:border-white/20 hover:text-white/60 transition-all overflow-hidden"
                        style={editConfig.backgroundImage ? { 
                          backgroundImage: `url(${editConfig.backgroundImage})`, 
                          backgroundSize: 'cover', 
                          backgroundPosition: 'center',
                          borderStyle: 'solid',
                          borderColor: `${editConfig.primaryColor}40`,
                        } : {}}
                      >
                        {!editConfig.backgroundImage && (
                          <>
                            {Icons.upload}
                            <span className="mt-1 text-xs">Загрузить файл (только для вас)</span>
                          </>
                        )}
                      </button>
                      <input ref={backgroundInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'background')} />
                      {editConfig.backgroundImage && (
                        <button 
                          onClick={() => setConfig({ backgroundImage: '' })} 
                          className="mt-2 text-xs text-red-400 flex items-center gap-1 hover:text-red-300"
                        >
                          {Icons.trash} Удалить
                        </button>
                      )}
                    </Section>
                  )}

                  {/* Video Upload */}
                  {editConfig.backgroundType === 'video' && (
                    <Section title="Видео" icon={Icons.video}>
                      <button
                        onClick={() => videoInputRef.current?.click()}
                        className="w-full h-32 rounded-xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-sm text-white/40 hover:border-white/20 transition-all"
                        style={editConfig.backgroundVideo ? { borderColor: `${editConfig.primaryColor}40`, borderStyle: 'solid' } : {}}
                      >
                        {editConfig.backgroundVideo ? (
                          <span className="flex items-center gap-2 text-green-400">{Icons.check} Видео загружено</span>
                        ) : (
                          <>
                            {Icons.upload}
                            <span className="mt-2">MP4 или WebM</span>
                          </>
                        )}
                      </button>
                      <input ref={videoInputRef} type="file" accept="video/mp4,video/webm" className="hidden" onChange={(e) => handleFileUpload(e, 'video')} />
                      {editConfig.backgroundVideo && (
                        <button 
                          onClick={() => setConfig({ backgroundVideo: '' })} 
                          className="mt-2 text-xs text-red-400 flex items-center gap-1"
                        >
                          {Icons.trash} Удалить
                        </button>
                      )}
                    </Section>
                  )}

                  {/* Effect Overlay */}
                  {(editConfig.backgroundType === 'image' || editConfig.backgroundType === 'video') && (
                    <Section title="Эффект поверх" icon={Icons.particles}>
                      <div className="grid grid-cols-5 gap-1.5">
                        {effectOverlayOptions.map((option) => (
                          <OptionButton
                            key={option.value}
                            selected={editConfig.effectOverlay === option.value}
                            onClick={() => setConfig({ effectOverlay: option.value })}
                            color={editConfig.primaryColor}
                          >
                            <div className="flex flex-col items-center gap-0.5">
                              {option.icon}
                              <span className="text-[10px]">{option.label}</span>
                            </div>
                          </OptionButton>
                        ))}
                      </div>
                    </Section>
                  )}

                  <Section title="Настройки" icon={Icons.effects}>
                    <Slider 
                      label="Яркость" 
                      value={config.backgroundIntensity} 
                      onChange={(v) => setConfig({ backgroundIntensity: v })} 
                      min={10} 
                      max={100} 
                      unit="%" 
                      color={editConfig.primaryColor} 
                    />
                  </Section>
                </>
              )}

              {/* Effects Tab */}
              {activeTab === 'effects' && (
                <>
                  <Section title="3D Эффект карточек" icon={Icons.cube}>
                    <Toggle 
                      label="Включить 3D" 
                      checked={editConfig.card3DEnabled} 
                      onChange={(v) => setConfig({ card3DEnabled: v })} 
                      color={editConfig.primaryColor} 
                    />
                    {editConfig.card3DEnabled && (
                      <Slider 
                        label="Интенсивность" 
                        value={editConfig.card3DIntensity} 
                        onChange={(v) => setConfig({ card3DIntensity: v })} 
                        min={5} 
                        max={30} 
                        unit="deg" 
                        color={editConfig.primaryColor} 
                      />
                    )}
                  </Section>

                  <Section title="Стиль карточек" icon={Icons.background}>
                    <Slider 
                      label="Прозрачность" 
                      value={editConfig.cardOpacity} 
                      onChange={(v) => setConfig({ cardOpacity: v })} 
                      unit="%" 
                      color={editConfig.primaryColor} 
                    />
                    <Slider 
                      label="Размытие" 
                      value={editConfig.cardBlur} 
                      onChange={(v) => setConfig({ cardBlur: v })} 
                      max={30} 
                      unit="px" 
                      color={editConfig.primaryColor} 
                    />
                    <Slider 
                      label="Обводка" 
                      value={editConfig.cardBorderOpacity} 
                      onChange={(v) => setConfig({ cardBorderOpacity: v })} 
                      unit="%" 
                      color={editConfig.primaryColor} 
                    />
                  </Section>

                  <Section title="Эффекты" icon={Icons.effects}>
                    <Toggle 
                      label="Свечение аватара" 
                      checked={editConfig.glowEnabled} 
                      onChange={(v) => setConfig({ glowEnabled: v })} 
                      color={editConfig.primaryColor} 
                    />
                    <Toggle 
                      label="Шум поверх" 
                      checked={config.noiseEnabled} 
                      onChange={(v) => setConfig({ noiseEnabled: v })} 
                      color={editConfig.primaryColor} 
                    />
                  </Section>

                  <Section title="Курсор" icon={Icons.cursor}>
                    <div className="grid grid-cols-5 gap-1.5 mb-3">
                      {cursorOptions.map((option) => (
                        <OptionButton
                          key={option.value}
                          selected={editConfig.cursorStyle === option.value}
                          onClick={() => setConfig({ cursorStyle: option.value })}
                          color={editConfig.primaryColor}
                        >
                          <span className="text-[10px]">{option.label}</span>
                        </OptionButton>
                      ))}
                    </div>
                    {editConfig.cursorStyle === 'custom' && (
                      <>
                        <button
                          onClick={() => cursorInputRef.current?.click()}
                          className="w-full px-4 py-2.5 rounded-lg text-sm border border-dashed border-white/20 flex items-center justify-center gap-2 hover:border-white/30 transition-all"
                        >
                          {config.customCursor ? <><span className="text-green-400">{Icons.check}</span> Загружено</> : <>{Icons.upload} Загрузить PNG</>}
                        </button>
                        <input ref={cursorInputRef} type="file" accept="image/png" className="hidden" onChange={(e) => handleFileUpload(e, 'cursor')} />
                      </>
                    )}
                  </Section>

                  <Section title="Музыка" icon={Icons.music}>
                    {/* URL Input for music */}
                    <input
                      type="text"
                      value={editConfig.musicUrl?.startsWith('data:') ? '' : (editConfig.musicUrl || '')}
                      onChange={(e) => setConfig({ musicUrl: e.target.value, musicEnabled: !!e.target.value })}
                      placeholder="Вставьте URL аудио (MP3)"
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm mb-2"
                    />
                    <p className="text-[10px] text-white/40 mb-3">
                      💡 Загрузите MP3 на файлообменник и вставьте прямую ссылку
                    </p>
                    
                    <div className="text-center text-white/30 text-xs mb-2">или</div>
                    
                    <button
                      onClick={() => musicInputRef.current?.click()}
                      className="w-full px-4 py-2.5 rounded-lg text-sm border border-dashed border-white/20 flex items-center justify-center gap-2 hover:border-white/30 transition-all mb-3"
                    >
                      {editConfig.musicUrl ? (
                        <span className="flex items-center gap-2">
                          <span className="text-green-400">{Icons.music}</span>
                          {editConfig.musicTitle || 'Трек загружен'}
                        </span>
                      ) : (
                        <>{Icons.upload} Загрузить файл (только для вас)</>
                      )}
                    </button>
                    <input ref={musicInputRef} type="file" accept="audio/*" className="hidden" onChange={(e) => handleFileUpload(e, 'music')} />

                    {editConfig.musicUrl && (
                      <div className="space-y-3 pt-3 border-t border-white/5">
                        <input
                          type="text"
                          value={editConfig.musicTitle}
                          onChange={(e) => setConfig({ musicTitle: e.target.value })}
                          placeholder="Название трека"
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm"
                        />
                        <Toggle 
                          label="Автовоспроизведение" 
                          checked={editConfig.musicAutoPlay} 
                          onChange={(v) => setConfig({ musicAutoPlay: v })} 
                          color={editConfig.primaryColor} 
                        />
                        <Slider 
                          label="Громкость" 
                          value={editConfig.musicVolume} 
                          onChange={(v) => setConfig({ musicVolume: v })} 
                          unit="%" 
                          color={editConfig.primaryColor} 
                        />
                        <button 
                          onClick={() => setConfig({ musicUrl: '', musicTitle: '' })} 
                          className="text-xs text-red-400 flex items-center gap-1"
                        >
                          {Icons.trash} Удалить музыку
                        </button>
                      </div>
                    )}
                  </Section>
                </>
              )}

              {/* Links Tab */}
              {activeTab === 'links' && (
                <>
                  {editConfig.links.map((link, index) => (
                    <Section key={link.id} title={`Ссылка ${index + 1}`} icon={Icons.links}>
                      <div className="flex items-center justify-between mb-3">
                        <Toggle 
                          label="Активна" 
                          checked={link.enabled} 
                          onChange={(v) => updateLink(link.id, { enabled: v })} 
                          color={editConfig.primaryColor} 
                        />
                        <button
                          onClick={() => deleteLink(link.id)}
                          className="text-red-400 hover:text-red-300 transition-colors p-1"
                        >
                          {Icons.trash}
                        </button>
                      </div>

                      <div className="space-y-2">
                        <select
                          value={link.icon}
                          onChange={(e) => updateLink(link.id, { icon: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm"
                        >
                          {iconOptions.map(icon => (
                            <option key={icon} value={icon}>{icon.charAt(0).toUpperCase() + icon.slice(1)}</option>
                          ))}
                        </select>

                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => updateLink(link.id, { label: e.target.value })}
                          placeholder="Название"
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm"
                        />

                        <input
                          type="url"
                          value={link.url}
                          onChange={(e) => updateLink(link.id, { url: e.target.value })}
                          placeholder="https://..."
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm"
                        />
                      </div>
                    </Section>
                  ))}

                  <button
                    onClick={addLink}
                    className="w-full py-4 rounded-xl border-2 border-dashed border-white/10 text-sm text-white/40 hover:border-white/20 hover:text-white/60 transition-all flex items-center justify-center gap-2"
                  >
                    {Icons.plus} Добавить ссылку
                  </button>
                </>
              )}
            </div>

            {/* Footer with Password & Save */}
            <div className="p-4 space-y-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              {/* Password input */}
              <div>
                <label className="block text-xs text-white/40 mb-1.5">Пароль для сохранения</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введите пароль..."
                  className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm"
                />
              </div>

              {/* Save status */}
              {saveStatus.type && (
                <div className={`px-3 py-2 rounded-lg text-sm ${saveStatus.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {saveStatus.message}
                </div>
              )}

              {/* Save button */}
              <button
                onClick={async () => {
                  if (!password) {
                    setSaveStatus({ type: 'error', message: 'Введите пароль' });
                    return;
                  }
                  setSaveStatus({ type: null, message: '' });
                  const result = await saveConfigToServer();
                  if (result.success) {
                    setSaveStatus({ type: 'success', message: 'Настройки сохранены!' });
                  } else {
                    setSaveStatus({ type: 'error', message: result.error || 'Ошибка сохранения' });
                  }
                  setTimeout(() => setSaveStatus({ type: null, message: '' }), 3000);
                }}
                disabled={isLoading}
                className="w-full py-3 rounded-xl text-white font-medium transition-all text-sm flex items-center justify-center gap-2 hover:scale-[1.02]"
                style={{ background: editConfig.primaryColor }}
              >
                {isLoading ? 'Сохранение...' : `${Icons.check} Сохранить на сервер`}
              </button>

              {/* Reset button */}
              <button
                onClick={resetConfig}
                className="w-full py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all text-sm font-medium flex items-center justify-center gap-2"
              >
                {Icons.trash} Сбросить
              </button>
              
              <p className="text-[10px] text-white/20 text-center">
                Shift + ↑↑↓↓ для открытия панели
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
