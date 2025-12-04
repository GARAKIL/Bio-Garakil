'use client';

import { useEffect, useRef, useState } from 'react';

interface MusicPlayerProps {
  enabled: boolean;
  url: string;
  volume: number;
  onToggle: () => void;
}

export function MusicPlayer({ enabled, url, volume, onToggle }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(url);
      audioRef.current.loop = true;
    }

    audioRef.current.volume = volume / 100;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [url, volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current || !hasInteracted) return;

    if (enabled) {
      audioRef.current.play().catch(() => {
        // Autoplay was prevented
      });
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [enabled, hasInteracted]);

  const handleClick = () => {
    setHasInteracted(true);
    onToggle();
  };

  return (
    <button
      onClick={handleClick}
      className="hoverable fixed bottom-6 right-6 z-50 w-12 h-12 glass rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group"
      title={enabled ? 'Выключить музыку' : 'Включить музыку'}
    >
      <svg
        viewBox="0 0 24 24"
        className="w-6 h-6 transition-colors duration-300"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ color: enabled ? 'var(--color-primary)' : 'var(--color-foreground)' }}
      >
        {enabled && isPlaying ? (
          <>
            {/* Music playing icon with waves */}
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
            {/* Sound waves */}
            <path 
              className="animate-pulse" 
              d="M22 9c1.5 1.5 1.5 4 0 5.5" 
              opacity="0.6"
            />
            <path 
              className="animate-pulse" 
              style={{ animationDelay: '0.1s' }}
              d="M24 7c2.5 2.5 2.5 7 0 9.5" 
              opacity="0.4"
            />
          </>
        ) : (
          <>
            {/* Music muted icon */}
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
            {/* X mark for muted */}
            <path d="M22 8l-4 4m0-4l4 4" opacity="0.6" />
          </>
        )}
      </svg>
      
      {/* Pulse animation when playing */}
      {enabled && isPlaying && (
        <div 
          className="absolute inset-0 rounded-full animate-ping opacity-30"
          style={{ backgroundColor: 'var(--color-primary)' }}
        />
      )}
    </button>
  );
}
