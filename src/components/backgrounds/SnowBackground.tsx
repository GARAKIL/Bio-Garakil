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
  const flakeCount = Math.floor((intensity / 100) * 80);

  const flakes = useMemo(() => {
    return Array.from({ length: flakeCount }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 8,
      opacity: Math.random() * 0.7 + 0.3,
      drift: (Math.random() - 0.5) * 150,
      wobble: Math.random() * 30 + 10,
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
            boxShadow: `0 0 ${f.size}px ${color}`,
            ['--drift' as string]: `${f.drift}px`,
            ['--wobble' as string]: `${f.wobble}px`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes snow {
          0% { transform: translateY(0) translateX(0) rotate(0deg); }
          25% { transform: translateY(25vh) translateX(var(--wobble)) rotate(90deg); }
          50% { transform: translateY(50vh) translateX(var(--drift)) rotate(180deg); }
          75% { transform: translateY(75vh) translateX(calc(var(--wobble) * -1)) rotate(270deg); }
          100% { transform: translateY(105vh) translateX(0) rotate(360deg); }
        }
        .animate-snow {
          animation: snow ease-in-out infinite;
        }
      `}</style>
    </div>
  );
});
