'use client';

import { useEffect, useState, useCallback, useRef, memo } from 'react';
import { motion } from 'framer-motion';
import { useConfigStore } from '@/store/configStore';
import { BackgroundManager } from '@/components/backgrounds';
import { CustomCursor } from '@/components/cursor';
import { SettingsPanel } from '@/components/settings';
import { DiscordIcon, TelegramIcon, SpotifyIcon, YouTubeIcon, TwitchIcon, GitHubIcon, TwitterIcon, InstagramIcon } from '@/components/icons';
import { useViewCounter } from '@/hooks/useViewCounter';

// Icon mapping
const iconMap: Record<string, React.FC<{ size?: number; className?: string }>> = {
  discord: DiscordIcon,
  telegram: TelegramIcon,
  spotify: SpotifyIcon,
  youtube: YouTubeIcon,
  twitch: TwitchIcon,
  github: GitHubIcon,
  twitter: TwitterIcon,
  instagram: InstagramIcon,
};

// SVG Icons without emojis
const LocationIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

const ViewIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
  </svg>
);

const GlobeIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
  </svg>
);

const PlayIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z"/>
  </svg>
);

const PauseIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
  </svg>
);

// Memoized background
const Background = memo(function Background({
  backgroundType, backgroundIntensity, primaryColor, secondaryColor, accentColor,
  noiseEnabled, backgroundImage, backgroundVideo, effectOverlay,
}: {
  backgroundType: string; backgroundIntensity: number; primaryColor: string;
  secondaryColor: string; accentColor: string; noiseEnabled: boolean;
  backgroundImage?: string; backgroundVideo?: string; effectOverlay?: string;
}) {
  return (
    <BackgroundManager
      type={backgroundType as any}
      intensity={backgroundIntensity}
      primaryColor={primaryColor}
      secondaryColor={secondaryColor}
      accentColor={accentColor}
      noiseEnabled={noiseEnabled}
      backgroundImage={backgroundImage}
      backgroundVideo={backgroundVideo}
      effectOverlay={effectOverlay as any}
    />
  );
});

// 3D Card component
// 3D Card component with parallax effect
const Card3D = ({ children, enabled, intensity = 10, style, className }: {
  children: React.ReactNode;
  enabled: boolean;
  intensity?: number;
  style?: React.CSSProperties;
  className?: string;
}) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!enabled || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -intensity;
    const rotateY = ((x - centerX) / centerX) * intensity;
    // Parallax translation for depth effect
    const translateX = ((x - centerX) / centerX) * 8;
    const translateY = ((y - centerY) / centerY) * 8;
    setRotation({ x: rotateX, y: rotateY });
    setTranslate({ x: translateX, y: translateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setTranslate({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      className={className}
      style={{
        ...style,
        transform: enabled 
          ? `perspective(800px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(1.02, 1.02, 1.02)` 
          : undefined,
        transition: 'transform 0.15s ease-out',
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Inner content with parallax depth */}
      <div 
        style={{ 
          transform: enabled ? `translateX(${translate.x}px) translateY(${translate.y}px) translateZ(40px)` : undefined,
          transition: 'transform 0.15s ease-out',
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export function BioPage() {
  const { config, toggleSettings, loadConfigFromServer } = useConfigStore();
  const { viewCount } = useViewCounter();
  const [mounted, setMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [verificationStep, setVerificationStep] = useState<'click' | 'done'>('click'); // Этапы: click -> done
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const keySequenceRef = useRef<string[]>([]);

  // Загрузка конфига с сервера при монтировании
  useEffect(() => {
    loadConfigFromServer();
  }, [loadConfigFromServer]);

  // Анимация заголовка вкладки
  useEffect(() => {
    if (!mounted) return;
    
    const titles = [
      'Bio-GARAKIL',
      'Bio-GARAKIL ✨',
      'Bio-GARAKIL ⭐',
      'Bio-GARAKIL 🔥',
      'Bio-GARAKIL 💎',
    ];
    let index = 0;
    
    const interval = setInterval(() => {
      document.title = titles[index];
      index = (index + 1) % titles.length;
    }, 1000);
    
    return () => clearInterval(interval);
  }, [mounted]);

  // Обработка клика на экране "Click Anywhere"
  const handleEnterSite = useCallback(() => {
    setVerificationStep('done');
    
    // Запускаем музыку после клика
    if (config.musicUrl && config.musicAutoPlay && !audioRef.current) {
      const audio = new Audio(config.musicUrl);
      audio.volume = config.musicVolume / 100;
      audio.loop = true;
      audioRef.current = audio;
      
      audio.play().then(() => {
        setIsPlaying(true);
        console.log('Music started after click!');
      }).catch((e) => {
        console.log('Music play failed:', e);
      });
    }
  }, [config.musicUrl, config.musicAutoPlay, config.musicVolume]);

  // Shift + ↑↑↓↓ для открытия настроек (два раза вверх, два раза вниз)
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.shiftKey && (e.code === 'ArrowUp' || e.code === 'ArrowDown')) {
      e.preventDefault();
      keySequenceRef.current.push(e.code);
      
      const seq = keySequenceRef.current;
      if (seq.length >= 4) {
        const last4 = seq.slice(-4);
        // Проверяем ↑↑↓↓
        if (last4[0] === 'ArrowUp' && last4[1] === 'ArrowUp' && 
            last4[2] === 'ArrowDown' && last4[3] === 'ArrowDown') {
          toggleSettings();
          keySequenceRef.current = [];
        }
      }
      
      // Очищаем если слишком много нажатий
      if (keySequenceRef.current.length > 10) {
        keySequenceRef.current = [];
      }
    }
  }, [toggleSettings]);

  useEffect(() => {
    setMounted(true);
    document.documentElement.style.setProperty('--color-primary', config.primaryColor);
  }, [config]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Play music function
  const playMusic = useCallback((url: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    
    const audio = new Audio(url);
    audio.volume = config.musicVolume / 100;
    audio.loop = true;
    audioRef.current = audio;
    
    audio.play().then(() => {
      setIsPlaying(true);
    }).catch(() => {
      setIsPlaying(false);
    });
  }, [config.musicVolume]);

  // Listen for music loaded event - only play if verification is done
  useEffect(() => {
    const handleMusicLoaded = (e: CustomEvent) => {
      if (e.detail?.url && verificationStep === 'done') {
        playMusic(e.detail.url);
      }
    };

    window.addEventListener('musicLoaded', handleMusicLoaded as EventListener);
    return () => {
      window.removeEventListener('musicLoaded', handleMusicLoaded as EventListener);
    };
  }, [playMusic, verificationStep]);

  // Update volume when changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = config.musicVolume / 100;
    }
  }, [config.musicVolume]);

  // Update audio source when musicUrl changes
  const prevMusicUrlRef = useRef<string | undefined>(config.musicUrl);
  useEffect(() => {
    // Only handle music changes AFTER user has clicked through (verificationStep === 'done')
    if (verificationStep !== 'done') return;
    
    // Check if musicUrl actually changed (not just on mount)
    if (prevMusicUrlRef.current !== config.musicUrl && config.musicUrl) {
      // Stop current audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      // Create new audio with new URL
      const audio = new Audio(config.musicUrl);
      audio.volume = config.musicVolume / 100;
      audio.loop = true;
      audioRef.current = audio;
      
      // Auto play new track if was playing or autoplay enabled
      if (isPlaying || config.musicAutoPlay) {
        audio.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          setIsPlaying(false);
        });
      }
    }
    prevMusicUrlRef.current = config.musicUrl;
  }, [config.musicUrl, config.musicVolume, config.musicAutoPlay, isPlaying, verificationStep]);

  // Audio control
  const toggleAudio = () => {
    if (!audioRef.current && config.musicUrl) {
      audioRef.current = new Audio(config.musicUrl);
      audioRef.current.volume = config.musicVolume / 100;
      audioRef.current.loop = true;
    }
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin" 
          style={{ borderColor: config.primaryColor, borderTopColor: 'transparent' }} />
      </div>
    );
  }

  const enabledLinks = config.links.filter(l => l.enabled);

  // Экран "Click Anywhere" для запуска музыки
  if (verificationStep === 'click') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer"
        style={{ 
          background: `linear-gradient(135deg, ${config.primaryColor}40 0%, ${config.backgroundColor} 50%, ${config.secondaryColor}40 100%)`,
          backgroundColor: config.backgroundColor,
        }}
        onClick={handleEnterSite}
      >
        {/* Фоновые частицы */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{ 
                background: config.primaryColor,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
        
        <motion.div
          className="text-center z-10"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-4"
            style={{ 
              color: config.primaryColor,
              textShadow: `0 0 30px ${config.primaryColor}80, 0 0 60px ${config.primaryColor}40`,
            }}
            animate={{ 
              textShadow: [
                `0 0 30px ${config.primaryColor}80, 0 0 60px ${config.primaryColor}40`,
                `0 0 50px ${config.primaryColor}90, 0 0 80px ${config.primaryColor}60`,
                `0 0 30px ${config.primaryColor}80, 0 0 60px ${config.primaryColor}40`,
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Click Anywhere
          </motion.h1>
          
          <motion.p
            className="text-white/50 text-sm"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            нажмите чтобы войти
          </motion.p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Background */}
      <Background
        backgroundType={config.backgroundType}
        backgroundIntensity={config.backgroundIntensity}
        primaryColor={config.primaryColor}
        secondaryColor={config.secondaryColor}
        accentColor={config.accentColor}
        noiseEnabled={config.noiseEnabled}
        backgroundImage={config.backgroundImage}
        backgroundVideo={config.backgroundVideo}
        effectOverlay={config.effectOverlay}
      />

      {/* Custom cursor */}
      <CustomCursor 
        style={config.cursorStyle} 
        color={config.primaryColor}
        customCursor={config.customCursor}
      />

      {/* Music button - top right */}
      {config.musicUrl && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={toggleAudio}
          className="fixed top-4 right-4 z-30 flex items-center gap-2 px-3 py-1.5 rounded-full text-sm hoverable"
          style={{
            background: `rgba(0,0,0,${config.cardOpacity / 100})`,
            backdropFilter: `blur(${config.cardBlur}px)`,
            border: `1px solid rgba(255,255,255,${config.cardBorderOpacity / 100})`,
          }}
        >
          <span style={{ color: config.textColor }}>
            {isPlaying ? <PauseIcon size={14} /> : <PlayIcon size={14} />}
          </span>
          <span style={{ color: config.textColor, opacity: 0.8 }}>{config.musicTitle || 'Music'}</span>
        </motion.button>
      )}

      {/* Main content - wrapped in 3D card */}
      <Card3D
        enabled={config.card3DEnabled}
        intensity={config.card3DIntensity}
        className="relative z-10 w-full max-w-lg"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center p-6 rounded-3xl"
          style={{
            background: `rgba(0,0,0,${config.cardOpacity / 100})`,
            backdropFilter: `blur(${config.cardBlur}px)`,
            border: `1px solid rgba(255,255,255,${config.cardBorderOpacity / 100})`,
          }}
        >
          {/* Avatar with glow effect */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring' }}
            className="relative mb-4"
          >
            {/* Glow ring */}
            {config.glowEnabled && (
              <div 
                className="absolute inset-0 rounded-full blur-xl opacity-60 animate-pulse"
                style={{ 
                  background: `radial-gradient(circle, ${config.glowColor} 0%, transparent 70%)`,
                  transform: 'scale(1.3)',
                }}
              />
            )}
            
            {/* Avatar */}
            <div 
              className="relative w-28 h-28 rounded-full overflow-hidden"
              style={{
                border: `3px solid ${config.borderColor}`,
                boxShadow: config.glowEnabled 
                  ? `0 0 30px ${config.glowColor}60, 0 0 60px ${config.glowColor}30` 
                  : 'none',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={config.avatar} 
                alt={config.username}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Username */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold tracking-wider mb-2"
            style={{ 
              color: config.primaryColor,
              textShadow: config.glowEnabled ? `0 0 20px ${config.glowColor}80` : 'none',
            }}
          >
            {config.username}
          </motion.h1>

          {/* Bio */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-3 px-4 max-w-md"
            style={{ color: config.textColor }}
          >
            {config.bio}
          </motion.p>

          {/* Location */}
          {config.location && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="flex items-center gap-1 mb-4 text-sm"
              style={{ color: config.primaryColor }}
            >
              <LocationIcon size={14} />
              <span>{config.location}</span>
            </motion.div>
          )}

          {/* Discord Card */}
          {config.showDiscordCard && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="w-full max-w-sm mb-4 rounded-2xl overflow-hidden"
              style={{
                background: `rgba(255,255,255,0.05)`,
                border: `1px solid rgba(255,255,255,0.1)`,
              }}
            >
              <div className="p-4 flex items-center gap-3">
                {/* Discord avatar */}
                <div 
                  className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-white/5"
                  style={{ border: `2px solid ${config.primaryColor}40` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={config.discordAvatar || config.avatar || '/avatar.svg'} 
                    alt="" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/avatar.svg';
                    }}
                  />
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold truncate" style={{ color: config.textColor }}>
                      {config.discordUsername || config.username || 'User'}
                    </span>
                  </div>
                  <p className="text-sm truncate flex items-center gap-1" style={{ color: `${config.textColor}99` }}>
                    <GlobeIcon size={12} />
                    <span>{config.discordStatus || 'Online'}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-3 mb-4"
          >
            {enabledLinks.map((link) => {
              const IconComponent = iconMap[link.icon] || DiscordIcon;
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={link.label}
                  className="hoverable p-3 rounded-xl transition-all duration-300 hover:scale-110"
                  style={{
                    background: `rgba(255,255,255,0.05)`,
                    border: `1px solid rgba(255,255,255,0.1)`,
                  }}
                >
                  <IconComponent size={24} className="text-white/80" />
                </a>
              );
            })}
          </motion.div>

          {/* View count */}
          {config.showViewCount && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-1.5 text-sm"
              style={{ color: config.primaryColor }}
            >
              <ViewIcon size={14} />
              <span>{viewCount} просмотров</span>
            </motion.div>
          )}
        </motion.div>
      </Card3D>

      {/* Settings Panel - always available */}
      <SettingsPanel />

      {/* Vignette */}
      <div 
        className="fixed inset-0 pointer-events-none z-20"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
        }}
      />
    </main>
  );
}
