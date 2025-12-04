'use client';

import { useMemo, memo } from 'react';

interface SnowBackgroundProps {
  intensity?: number;
  color?: string;
}

export const SnowBackground = memo(function SnowBackground({ 
  intensity = 50, 
  color = '#ffffff' 
}: SnowBackgroundProps) {
  const flakeCount = Math.floor((intensity / 100) * 30);

  const flakes = useMemo(() => {
    return Array.from({ length: flakeCount }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 5 + 8,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.5 + 0.2,
      drift: (Math.random() - 0.5) * 100,
    }));
  }, [flakeCount]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {flakes.map((f) => (
        <div
          key={f.id}
          className="absolute rounded-full animate-snow"
          style={{
            left: f.left,
            top: '-10px',
            width: f.size,
            height: f.size,
            backgroundColor: color,
            opacity: f.opacity,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
            ['--drift' as string]: `${f.drift}px`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes snow {
          0% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(50vh) translateX(var(--drift)); }
          100% { transform: translateY(100vh) translateX(0); }
        }
        .animate-snow {
          animation: snow linear infinite;
        }
      `}</style>
    </div>
  );
});
