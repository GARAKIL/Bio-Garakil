'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { CursorStyle } from '@/types/config';

interface CustomCursorProps {
  style: CursorStyle;
  color: string;
  customCursor?: string;
}

export function CustomCursor({ style, color, customCursor }: CustomCursorProps) {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([]);
  const rafRef = useRef<number>(0);

  // Apply custom cursor CSS
  useEffect(() => {
    // Default cursor or custom without image - show normal cursor
    if (style === 'default' || (style === 'custom' && !customCursor)) {
      document.body.style.cursor = 'auto';
      document.body.classList.remove('custom-cursor-active');
      // Remove any custom cursor styles
      const existingStyle = document.getElementById('custom-cursor-style');
      if (existingStyle) existingStyle.remove();
      return;
    }

    if (style === 'custom' && customCursor) {
      document.body.classList.remove('custom-cursor-active');
      
      // Create a resized cursor image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        // Create canvas to resize cursor (max 32x32 for browser compatibility)
        const canvas = document.createElement('canvas');
        const maxSize = 32;
        let width = img.width;
        let height = img.height;
        
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const resizedCursor = canvas.toDataURL('image/png');
          
          // Hotspot at center of cursor image
          const hotspotX = Math.floor(width / 2);
          const hotspotY = Math.floor(height / 2);
          
          // Remove existing style
          const existingStyle = document.getElementById('custom-cursor-style');
          if (existingStyle) existingStyle.remove();
          
          // Add new style for all elements with centered hotspot
          const styleEl = document.createElement('style');
          styleEl.id = 'custom-cursor-style';
          styleEl.textContent = `
            html, body, *, *::before, *::after {
              cursor: url("${resizedCursor}") ${hotspotX} ${hotspotY}, auto !important;
            }
            a, button, [role="button"], input, select, textarea, .hoverable {
              cursor: url("${resizedCursor}") ${hotspotX} ${hotspotY}, pointer !important;
            }
          `;
          document.head.appendChild(styleEl);
        }
      };
      img.onerror = () => {
        console.error('Failed to load custom cursor image');
        document.body.style.cursor = 'auto';
      };
      img.src = customCursor;
      
      return () => {
        document.body.style.cursor = 'auto';
        const existingStyle = document.getElementById('custom-cursor-style');
        if (existingStyle) existingStyle.remove();
      };
    }

    // For other styles (glow, ring, trail), hide default cursor
    document.body.classList.add('custom-cursor-active');
    document.body.style.cursor = 'none';
    
    // Remove any custom cursor styles
    const existingStyle = document.getElementById('custom-cursor-style');
    if (existingStyle) existingStyle.remove();

    return () => {
      document.body.style.cursor = 'auto';
      document.body.classList.remove('custom-cursor-active');
    };
  }, [style, customCursor]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    
    rafRef.current = requestAnimationFrame(() => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      if (style === 'trail') {
        setTrail(prev => {
          const newTrail = [...prev, { x: e.clientX, y: e.clientY }];
          if (newTrail.length > 15) {
            return newTrail.slice(-15);
          }
          return newTrail;
        });
      }
    });
  }, [style]);

  useEffect(() => {
    // Skip for default or custom cursor
    if (style === 'default' || style === 'custom') return;

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        !!target.closest('a') ||
        !!target.closest('button') ||
        target.classList.contains('hoverable') ||
        !!target.closest('.hoverable');
      setIsHovering(!!isInteractive);
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleElementHover);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleElementHover);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [style, handleMouseMove]);

  // Don't render anything for default or custom cursor
  if (style === 'default' || style === 'custom' || !isVisible) return null;

  const renderCursor = () => {
    switch (style) {
      case 'glow':
        return (
          <>
            {/* Outer glow */}
            <div
              className="fixed pointer-events-none rounded-full"
              style={{
                left: position.x - 20,
                top: position.y - 20,
                width: isHovering ? 50 : 40,
                height: isHovering ? 50 : 40,
                background: `radial-gradient(circle, ${color}50 0%, transparent 70%)`,
                transform: `scale(${isClicking ? 0.8 : 1})`,
                transition: 'width 0.15s, height 0.15s, transform 0.1s',
                zIndex: 9999,
              }}
            />
            {/* Inner dot */}
            <div
              className="fixed pointer-events-none rounded-full"
              style={{
                left: position.x - 4,
                top: position.y - 4,
                width: 8,
                height: 8,
                backgroundColor: color,
                boxShadow: `0 0 10px ${color}, 0 0 20px ${color}80`,
                transform: `scale(${isClicking ? 0.5 : 1})`,
                transition: 'transform 0.1s',
                zIndex: 9999,
              }}
            />
          </>
        );

      case 'ring':
        return (
          <>
            {/* Outer ring */}
            <div
              className="fixed pointer-events-none rounded-full border-2"
              style={{
                left: position.x - (isHovering ? 25 : 18),
                top: position.y - (isHovering ? 25 : 18),
                width: isHovering ? 50 : 36,
                height: isHovering ? 50 : 36,
                borderColor: color,
                opacity: isClicking ? 0.5 : 0.8,
                transform: `scale(${isClicking ? 0.9 : 1})`,
                transition: 'all 0.15s ease-out',
                zIndex: 9999,
              }}
            />
            {/* Inner dot */}
            <div
              className="fixed pointer-events-none rounded-full"
              style={{
                left: position.x - 3,
                top: position.y - 3,
                width: 6,
                height: 6,
                backgroundColor: color,
                zIndex: 9999,
              }}
            />
          </>
        );

      case 'trail':
        return (
          <>
            {trail.map((pos, index) => (
              <div
                key={index}
                className="fixed pointer-events-none rounded-full"
                style={{
                  left: pos.x - 3,
                  top: pos.y - 3,
                  width: 6,
                  height: 6,
                  backgroundColor: color,
                  opacity: (index / trail.length) * 0.6,
                  transform: `scale(${0.3 + (index / trail.length) * 0.7})`,
                  zIndex: 9998,
                }}
              />
            ))}
            {/* Main cursor */}
            <div
              className="fixed pointer-events-none rounded-full"
              style={{
                left: position.x - 5,
                top: position.y - 5,
                width: isHovering ? 14 : 10,
                height: isHovering ? 14 : 10,
                backgroundColor: color,
                boxShadow: `0 0 10px ${color}80`,
                transform: `scale(${isClicking ? 0.7 : 1})`,
                transition: 'width 0.1s, height 0.1s, transform 0.1s',
                zIndex: 9999,
              }}
            />
          </>
        );

      default:
        return null;
    }
  };

  return <>{renderCursor()}</>;
}
