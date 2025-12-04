'use client';

import { useMemo, memo } from 'react';

interface StarsBackgroundProps {
  intensity?: number;
  color?: string;
}

export const StarsBackground = memo(function StarsBackground({ 
  intensity = 50, 
  color = '#ffffff' 
}: StarsBackgroundProps) {
  const starCount = Math.floor((intensity / 100) * 100);

  const stars = useMemo(() => {
    return Array.from({ length: starCount }, (_, i) => {
      const isBright = Math.random() > 0.85;
      return {
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: isBright ? Math.random() * 3 + 2 : Math.random() * 2 + 0.5,
        duration: Math.random() * 4 + 1,
        delay: Math.random() * 5,
        opacity: isBright ? Math.random() * 0.3 + 0.7 : Math.random() * 0.5 + 0.2,
        isBright,
      };
    });
  }, [starCount]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {stars.map((s) => (
        <div
          key={s.id}
          className={`absolute rounded-full ${s.isBright ? 'animate-twinkle-bright' : 'animate-twinkle'}`}
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            backgroundColor: color,
            opacity: s.opacity,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
            boxShadow: s.isBright ? `0 0 ${s.size * 2}px ${color}, 0 0 ${s.size * 4}px ${color}60` : 'none',
          }}
        />
      ))}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        @keyframes twinkle-bright {
          0%, 100% { opacity: 0.5; transform: scale(1); filter: blur(0px); }
          25% { opacity: 1; transform: scale(1.3); filter: blur(0.5px); }
          50% { opacity: 0.7; transform: scale(0.9); filter: blur(0px); }
          75% { opacity: 1; transform: scale(1.2); filter: blur(0.5px); }
        }
        .animate-twinkle {
          animation: twinkle ease-in-out infinite;
        }
        .animate-twinkle-bright {
          animation: twinkle-bright ease-in-out infinite;
        }
      `}</style>
    </div>
  );
});
