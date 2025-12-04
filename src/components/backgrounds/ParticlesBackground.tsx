'use client';

import { useMemo, memo } from 'react';

interface ParticlesBackgroundProps {
  intensity?: number;
  color?: string;
}

// CSS-based particles - much more performant than canvas
export const ParticlesBackground = memo(function ParticlesBackground({ 
  intensity = 50, 
  color = '#a855f7',
}: ParticlesBackgroundProps) {
  const particleCount = Math.floor((intensity / 100) * 50);

  const particles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 5 + 2,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * -15,
      opacity: Math.random() * 0.6 + 0.2,
      moveX: (Math.random() - 0.5) * 100,
      moveY: (Math.random() - 0.5) * 100,
    }));
  }, [particleCount]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-float"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            backgroundColor: color,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            boxShadow: `0 0 ${p.size * 3}px ${color}, 0 0 ${p.size * 6}px ${color}40`,
            ['--moveX' as string]: `${p.moveX}px`,
            ['--moveY' as string]: `${p.moveY}px`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          25% { transform: translate(var(--moveX), var(--moveY)) scale(1.2); opacity: 0.8; }
          50% { transform: translate(calc(var(--moveX) * -0.5), calc(var(--moveY) * 0.5)) scale(0.8); opacity: 0.5; }
          75% { transform: translate(calc(var(--moveX) * 0.3), calc(var(--moveY) * -1)) scale(1.1); opacity: 0.7; }
        }
        .animate-float {
          animation: float ease-in-out infinite;
        }
      `}</style>
    </div>
  );
});
