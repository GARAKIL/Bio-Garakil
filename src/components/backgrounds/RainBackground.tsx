'use client';

import { useMemo, memo } from 'react';

interface RainBackgroundProps {
  intensity?: number;
  color?: string;
}

export const RainBackground = memo(function RainBackground({ 
  intensity = 50, 
  color = '#6366f1' 
}: RainBackgroundProps) {
  const dropCount = Math.floor((intensity / 100) * 40);

  const drops = useMemo(() => {
    return Array.from({ length: dropCount }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      duration: Math.random() * 0.5 + 0.5,
      delay: Math.random() * 2,
      height: Math.random() * 15 + 10,
      opacity: Math.random() * 0.4 + 0.1,
    }));
  }, [dropCount]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {drops.map((d) => (
        <div
          key={d.id}
          className="absolute animate-rain"
          style={{
            left: d.left,
            top: '-20px',
            width: '1px',
            height: d.height,
            background: `linear-gradient(to bottom, transparent, ${color})`,
            opacity: d.opacity,
            animationDuration: `${d.duration}s`,
            animationDelay: `${d.delay}s`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes rain {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        .animate-rain {
          animation: rain linear infinite;
        }
      `}</style>
    </div>
  );
});
