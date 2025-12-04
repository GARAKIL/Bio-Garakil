'use client';

import { motion } from 'framer-motion';
import { useConfigStore } from '@/store/configStore';

export function DiscordCard() {
  const { config } = useConfigStore();

  if (!config.showDiscordCard) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="w-full max-w-sm mx-auto mt-6"
    >
      <div 
        className="relative rounded-xl overflow-hidden"
        style={{ 
          background: 'rgba(17, 18, 23, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Banner */}
        <div 
          className="h-16 w-full"
          style={{ 
            background: `linear-gradient(135deg, ${config.primaryColor}40, ${config.secondaryColor}40)`,
          }}
        />
        
        {/* Content */}
        <div className="px-4 pb-4">
          {/* Avatar positioned over banner */}
          <div className="relative -mt-8 mb-3">
            <div 
              className="w-16 h-16 rounded-full overflow-hidden border-4"
              style={{ 
                borderColor: 'rgba(17, 18, 23, 0.9)',
                background: '#1a1b1e',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={config.avatar} 
                alt="avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Online status indicator */}
            <div 
              className="absolute bottom-0 right-0 w-5 h-5 rounded-full border-4"
              style={{ 
                borderColor: 'rgba(17, 18, 23, 0.9)',
                background: '#23a559', // Discord online green
              }}
            />
          </div>

          {/* Username and badges */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-lg text-white">
              {config.discordUsername || config.username}
            </span>
            {/* Badges */}
            <div className="flex gap-1">
              {config.discordBadges?.includes('nitro') && (
                <NitroBadge />
              )}
              {config.discordBadges?.includes('boost') && (
                <BoostBadge />
              )}
              {config.discordBadges?.includes('developer') && (
                <DeveloperBadge />
              )}
            </div>
          </div>

          {/* Discord username (small) */}
          <div className="text-sm text-zinc-400 mb-3">
            {config.discordUsername || config.username}
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-white/10 my-3" />

          {/* Status section */}
          <div>
            <div className="text-xs font-semibold text-white uppercase mb-2">
              О себе
            </div>
            <p className="text-sm text-zinc-300">
              {config.discordStatus || config.bio}
            </p>
          </div>

          {/* Note section (optional aesthetic) */}
          <div className="mt-4 pt-3 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span>В сети</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Badge components
function NitroBadge() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <path
        d="M2.98966 14.9305L9.06941 21.0103L14.1694 15.9103L8.08966 9.83057L2.98966 14.9305Z"
        fill="#FF73FA"
      />
      <path
        d="M9.84961 8.07031L14.9496 2.97031L21.0294 9.05006L15.9294 14.1501L9.84961 8.07031Z"
        fill="#FF73FA"
      />
      <path
        d="M14.5002 15.5L8.5 9.5L3 15L9 21L14.5002 15.5Z"
        fill="#B845FF"
      />
    </svg>
  );
}

function BoostBadge() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <path
        d="M12.0002 3L14.4002 8.4L20.4002 9L15.6002 13.2L17.0002 19.2L12.0002 16.2L7.0002 19.2L8.4002 13.2L3.6002 9L9.6002 8.4L12.0002 3Z"
        fill="#FF73FA"
      />
    </svg>
  );
}

function DeveloperBadge() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <path
        d="M6.89999 7L2.89999 12L6.89999 17"
        stroke="#5865F2"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.1 7L21.1 12L17.1 17"
        stroke="#5865F2"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 4L10 20"
        stroke="#5865F2"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
