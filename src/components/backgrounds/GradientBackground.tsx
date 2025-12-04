'use client';

import { memo } from 'react';

interface GradientBackgroundProps {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export const GradientBackground = memo(function GradientBackground({ 
  primaryColor = '#a855f7',
  secondaryColor = '#3b82f6',
  accentColor = '#06b6d4'
}: GradientBackgroundProps) {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Static gradient - no animation for performance */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 20%, ${primaryColor}30 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, ${secondaryColor}30 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, ${accentColor}15 0%, transparent 70%)
          `,
        }}
      />
      
      {/* Single static orb */}
      <div 
        className="absolute w-80 h-80 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${primaryColor}20 0%, transparent 70%)`,
          top: '20%',
          left: '20%',
        }}
      />
    </div>
  );
});
