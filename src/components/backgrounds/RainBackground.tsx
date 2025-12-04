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
  const dropCount = Math.floor((intensity / 100) * 100);

  const drops = useMemo(() => {
    return Array.from({ length: dropCount }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      duration: Math.random() * 0.4 + 0.3,
      delay: Math.random() * 3,
      height: Math.random() * 25 + 15,
      width: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      angle: Math.random() * 10 - 5,
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
            top: '-30px',
            width: `${d.width}px`,
            height: d.height,
            background: `linear-gradient(to bottom, transparent 0%, ${color}40 30%, ${color} 100%)`,
            opacity: d.opacity,
            animationDuration: `${d.duration}s`,
            animationDelay: `${d.delay}s`,
            transform: `rotate(${d.angle}deg)`,
            borderRadius: '50%',
          }}
        />
      ))}
      {/* Rain splash effect at bottom */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
        style={{
          background: `linear-gradient(to top, ${color}10, transparent)`,
        }}
      />
      <style jsx>{`
        @keyframes rain {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 0.8; }
          100% { transform: translateY(105vh) translateX(10px); opacity: 0; }
        }
        .animate-rain {
          animation: rain linear infinite;
        }
      `}</style>
    </div>
  );
});
