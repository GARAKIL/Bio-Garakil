export type BackgroundType = 'rain' | 'snow' | 'particles' | 'gradient' | 'noise' | 'stars' | 'image' | 'video';
export type EffectOverlay = 'none' | 'rain' | 'snow' | 'particles' | 'stars';

export type CursorStyle = 'default' | 'glow' | 'trail' | 'ring' | 'custom';

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  label: string;
  enabled: boolean;
}

export interface TextStyle {
  fontFamily: 'mono' | 'sans' | 'display';
  fontSize: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  color: string;
  glow: boolean;
  animation: 'none' | 'float' | 'pulse' | 'typing';
}

export interface SiteConfig {
  // Profile
  avatar: string;
  username: string;
  bio: string;
  status: string;
  location: string;
  
  // Colors - больше цветов
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  foregroundColor: string;
  glowColor: string;
  borderColor: string;
  textColor: string;
  
  // Background
  backgroundType: BackgroundType;
  backgroundIntensity: number;
  backgroundImage: string;
  backgroundVideo: string;
  effectOverlay: EffectOverlay;
  
  // Card style
  cardOpacity: number;
  cardBlur: number;
  cardBorderOpacity: number;
  card3DEnabled: boolean;
  card3DIntensity: number;
  
  // Text
  titleStyle: TextStyle;
  bioStyle: TextStyle;
  
  // Effects
  cursorStyle: CursorStyle;
  customCursor: string;
  particlesEnabled: boolean;
  glowEnabled: boolean;
  noiseEnabled: boolean;
  
  // Music
  musicEnabled: boolean;
  musicUrl: string;
  musicVolume: number;
  musicTitle: string;
  musicAutoPlay: boolean;
  
  // Links
  links: SocialLink[];
  
  // 3D
  enable3D: boolean;
  rotationSpeed: number;
  
  // Discord card
  showDiscordCard: boolean;
  discordUsername: string;
  discordStatus: string;
  discordBadges: string[];
  discordAvatar: string;
  
  // Stats
  showViewCount: boolean;
  viewCount: number;
}

export const defaultConfig: SiteConfig = {
  avatar: '/avatar.svg',
  username: 'GARAKIL',
  bio: 'Привет я GARAKIL, занимаюсь кодингом а также хелпер на проекте Winner Client',
  status: 'online',
  location: 'HOME',
  
  primaryColor: '#ff6b9d',
  secondaryColor: '#c084fc',
  accentColor: '#f472b6',
  backgroundColor: '#0a0a0f',
  foregroundColor: '#fafafa',
  glowColor: '#ff6b9d',
  borderColor: '#ffffff',
  textColor: '#ffffff',
  
  backgroundType: 'image',
  backgroundIntensity: 100,
  backgroundImage: '',
  backgroundVideo: '',
  effectOverlay: 'none',
  
  cardOpacity: 60,
  cardBlur: 10,
  cardBorderOpacity: 20,
  card3DEnabled: true,
  card3DIntensity: 15,
  
  titleStyle: {
    fontFamily: 'display',
    fontSize: '3xl',
    color: '#ff6b9d',
    glow: true,
    animation: 'none',
  },
  
  bioStyle: {
    fontFamily: 'sans',
    fontSize: 'md',
    color: '#ff6b9d',
    glow: false,
    animation: 'none',
  },
  
  cursorStyle: 'default',
  customCursor: '',
  particlesEnabled: false,
  glowEnabled: true,
  noiseEnabled: false,
  
  musicEnabled: false,
  musicUrl: '',
  musicVolume: 30,
  musicTitle: 'RGX',
  musicAutoPlay: true,
  
  links: [
    { id: '1', platform: 'spotify', url: 'https://open.spotify.com', icon: 'spotify', label: 'Spotify', enabled: true },
    { id: '2', platform: 'discord', url: 'https://discord.gg/winnerclient', icon: 'discord', label: 'Discord', enabled: true },
    { id: '3', platform: 'telegram', url: 'https://t.me/garakil', icon: 'telegram', label: 'Telegram', enabled: true },
    { id: '4', platform: 'github', url: 'https://github.com/garakil', icon: 'github', label: 'GitHub', enabled: true },
  ],
  
  enable3D: false,
  rotationSpeed: 0.5,
  
  showDiscordCard: true,
  discordUsername: 'dokills',
  discordStatus: 'Даже если у тебя нет ничего - у тебя есть жизнь',
  discordBadges: ['nitro'],
  discordAvatar: '',
  
  showViewCount: true,
  viewCount: 21,
};
