'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { CursorStyle } from '@/types/config';

interface CustomCursorProps {
  style: CursorStyle;
  color: string;
  customCursor?: string;
}

export function CustomCursor({ style, color, customCursor }: CustomCursorProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [trail, setTrail] = useState<{ x: number; y: number }[]>([]);
  const [mounted, setMounted] = useState(false);
  const [hasMovedMouse, setHasMovedMouse] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
    console.log('CustomCursor mounted, style:', style);
  }, [style]);

  // Apply cursor hiding for glow/ring/trail styles
  useEffect(() => {
    if (!mounted) return;
    
    console.log('Applying cursor style:', style);
    
    // Remove previous styles
    const existingStyle = document.getElementById('custom-cursor-style');
    if (existingStyle) existingStyle.remove();
    document.body.classList.remove('custom-cursor-active');
    
    // Default - normal cursor
    if (style === 'default') {
      document.documentElement.style.cursor = '';
      document.body.style.cursor = '';
      return;
    }
    
    // Custom cursor image
    if (style === 'custom' && customCursor) {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = 32;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const scale = Math.min(size / img.width, size / img.height);
          const w = img.width * scale;
          const h = img.height * scale;
          ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
          const dataUrl = canvas.toDataURL();
          const styleEl = document.createElement('style');
          styleEl.id = 'custom-cursor-style';
          styleEl.textContent = `* { cursor: url("${dataUrl}") 16 16, auto !important; }`;
          document.head.appendChild(styleEl);
        }
      };
      img.src = customCursor;
      return;
    }
    
    // Glow, ring, trail - hide native cursor
    if (style === 'glow' || style === 'ring' || style === 'trail') {
      const styleEl = document.createElement('style');
      styleEl.id = 'custom-cursor-style';
      styleEl.textContent = `
        html, body, * { cursor: none !important; }
      `;
      document.head.appendChild(styleEl);
      document.body.classList.add('custom-cursor-active');
    }
    
    return () => {
      const el = document.getElementById('custom-cursor-style');
      if (el) el.remove();
      document.body.classList.remove('custom-cursor-active');
      document.documentElement.style.cursor = '';
      document.body.style.cursor = '';
    };
  }, [style, customCursor, mounted]);

  // Mouse tracking
  useEffect(() => {
    if (!mounted) return;
    if (style === 'default' || style === 'custom') return;
    
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setHasMovedMouse(true);
      
      if (style === 'trail') {
        setTrail(prev => [...prev.slice(-14), { x: e.clientX, y: e.clientY }]);
      }
    };
    
    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    
    const onMouseOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setIsHovering(
        t.tagName === 'A' || t.tagName === 'BUTTON' || 
        !!t.closest('a') || !!t.closest('button') ||
        t.classList.contains('hoverable')
      );
    };
    
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mouseover', onMouseOver);
    
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mouseover', onMouseOver);
    };
  }, [style, mounted]);

  // Don't render for default/custom or before hydration or before mouse moved
  if (!mounted) return null;
  if (style === 'default' || style === 'custom') return null;
  if (!hasMovedMouse) return null;

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
