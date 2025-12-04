'use client';

import { memo } from 'react';

interface NoiseBackgroundProps {
  intensity?: number;
  animated?: boolean;
}

// SVG noise filter - no canvas, no JS animation
export const NoiseBackground = memo(function NoiseBackground({ 
  intensity = 50 
}: NoiseBackgroundProps) {
  const opacity = (intensity / 100) * 0.1;

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-10"
      style={{ opacity }}
    >
      <svg className="w-full h-full">
        <filter id="noise">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.8" 
            numOctaves="4" 
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" opacity="0.5" />
      </svg>
    </div>
  );
});
