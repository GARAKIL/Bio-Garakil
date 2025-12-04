'use client';

import { memo } from 'react';
import { BackgroundType, EffectOverlay } from '@/types/config';
import { RainBackground } from './RainBackground';
import { SnowBackground } from './SnowBackground';
import { ParticlesBackground } from './ParticlesBackground';
import { StarsBackground } from './StarsBackground';
import { GradientBackground } from './GradientBackground';
import { NoiseBackground } from './NoiseBackground';

interface BackgroundManagerProps {
  type: BackgroundType;
  intensity: number;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  noiseEnabled: boolean;
  backgroundImage?: string;
  backgroundVideo?: string;
  effectOverlay?: EffectOverlay;
}

export const BackgroundManager = memo(function BackgroundManager({
  type,
  intensity,
  primaryColor,
  secondaryColor,
  accentColor,
  noiseEnabled,
  backgroundImage,
  backgroundVideo,
  effectOverlay = 'none',
}: BackgroundManagerProps) {
  
  // Render effect overlay (can be shown over image/video background)
  const renderEffectOverlay = () => {
    if (effectOverlay === 'none') return null;
    
    switch (effectOverlay) {
      case 'rain':
        return <RainBackground intensity={intensity} color={primaryColor} />;
      case 'snow':
        return <SnowBackground intensity={intensity} />;
      case 'particles':
        return <ParticlesBackground intensity={intensity} color={primaryColor} />;
      case 'stars':
        return <StarsBackground intensity={intensity} color={accentColor} />;
      default:
        return null;
    }
  };

  const renderBackground = () => {
    switch (type) {
      case 'video':
        return backgroundVideo ? (
          <div className="fixed inset-0 z-0 overflow-hidden">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute w-full h-full object-cover"
              style={{ filter: `brightness(${intensity / 100})` }}
            >
              <source src={backgroundVideo} type="video/mp4" />
            </video>
            {/* Dark overlay */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)',
              }}
            />
          </div>
        ) : (
          <GradientBackground
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            accentColor={accentColor}
          />
        );
        
      case 'image':
        return backgroundImage ? (
          <div 
            className="fixed inset-0 z-0"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              filter: `brightness(${intensity / 100})`,
            }}
          >
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 100%)',
              }}
            />
          </div>
        ) : (
          <GradientBackground
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            accentColor={accentColor}
          />
        );
        
      case 'rain':
        return <RainBackground intensity={intensity} color={primaryColor} />;
      case 'snow':
        return <SnowBackground intensity={intensity} />;
      case 'particles':
        return <ParticlesBackground intensity={intensity} color={primaryColor} />;
      case 'stars':
        return <StarsBackground intensity={intensity} color={accentColor} />;
      case 'gradient':
        return (
          <GradientBackground
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            accentColor={accentColor}
          />
        );
      case 'noise':
        return <NoiseBackground intensity={intensity} />;
      default:
        return <ParticlesBackground intensity={intensity} color={primaryColor} />;
    }
  };

  return (
    <>
      {renderBackground()}
      {/* Effect overlay on top of image/video */}
      {(type === 'image' || type === 'video') && renderEffectOverlay()}
      {noiseEnabled && type !== 'noise' && (
        <NoiseBackground intensity={20} />
      )}
    </>
  );
});
