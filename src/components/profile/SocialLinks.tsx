'use client';

import { motion } from 'framer-motion';
import { SocialLink } from '@/types/config';
import { getIconByPlatform } from '@/components/icons';

interface SocialLinksProps {
  links: SocialLink[];
  primaryColor: string;
}

export function SocialLinks({ links, primaryColor }: SocialLinksProps) {
  return (
    <div className="flex flex-col gap-3 w-full max-w-sm">
      {links.map((link, index) => {
        const Icon = getIconByPlatform(link.platform);
        
        return (
          <motion.a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
            className="hoverable group relative overflow-hidden rounded-xl px-5 py-3.5 flex items-center gap-4 transition-all duration-300"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
            whileHover={{
              scale: 1.02,
              background: 'rgba(255, 255, 255, 0.06)',
            }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Hover glow effect */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 30% 50%, ${primaryColor}15 0%, transparent 50%)`,
              }}
            />
            
            {/* Icon with glow */}
            <div 
              className="relative z-10 flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300"
              style={{
                background: `${primaryColor}15`,
              }}
            >
              <Icon size={20} style={{ color: primaryColor }} />
            </div>
            
            {/* Label */}
            <span className="relative z-10 font-medium text-sm tracking-wide">{link.label}</span>
            
            {/* Arrow indicator */}
            <svg
              viewBox="0 0 24 24"
              className="relative z-10 w-4 h-4 ml-auto opacity-30 group-hover:opacity-60 transition-all duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            
            {/* Bottom border accent */}
            <div 
              className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-500"
              style={{ background: `linear-gradient(90deg, ${primaryColor}, transparent)` }}
            />
          </motion.a>
        );
      })}
    </div>
  );
}
