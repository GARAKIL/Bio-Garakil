'use client';

import { motion } from 'framer-motion';

interface AvatarProps {
  src: string;
  alt: string;
  status?: 'online' | 'idle' | 'dnd' | 'offline';
  glowColor?: string;
  size?: number;
}

export function Avatar({ src, alt, status = 'online', glowColor = '#a855f7', size = 128 }: AvatarProps) {
  const statusColors = {
    online: '#22c55e',
    idle: '#eab308',
    dnd: '#ef4444',
    offline: '#6b7280',
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', duration: 0.8, bounce: 0.3 }}
      className="relative inline-block"
    >
      {/* Outer glow ring */}
      <motion.div
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -inset-2 rounded-full"
        style={{
          background: `radial-gradient(circle, ${glowColor}30 0%, transparent 70%)`,
        }}
      />
      
      {/* Secondary glow */}
      <div
        className="absolute -inset-1 rounded-full blur-md"
        style={{
          background: `${glowColor}20`,
        }}
      />
      
      {/* Avatar container */}
      <div
        className="relative rounded-full overflow-hidden"
        style={{
          width: size,
          height: size,
          boxShadow: `
            0 0 0 2px ${glowColor}60,
            0 0 20px ${glowColor}30,
            inset 0 0 20px rgba(0,0,0,0.3)
          `,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          width={size}
          height={size}
          className="object-cover w-full h-full"
        />
        
        {/* Inner highlight */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
          }}
        />
      </div>

      {/* Status indicator with pulse */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.6, type: 'spring' }}
        className="absolute bottom-1 right-1"
      >
        {/* Status pulse */}
        {status === 'online' && (
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: statusColors[status] }}
          />
        )}
        {/* Status dot */}
        <div
          className="relative rounded-full border-[3px]"
          style={{
            width: size * 0.22,
            height: size * 0.22,
            backgroundColor: statusColors[status],
            borderColor: 'var(--color-background)',
            boxShadow: `0 0 8px ${statusColors[status]}80`,
          }}
        />
      </motion.div>
    </motion.div>
  );
}
