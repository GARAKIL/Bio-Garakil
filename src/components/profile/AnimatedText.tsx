'use client';

import { motion } from 'framer-motion';
import { TextStyle } from '@/types/config';

interface AnimatedTextProps {
  text: string;
  style: TextStyle;
  className?: string;
}

const fontSizeMap = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
};

const fontFamilyMap = {
  mono: 'font-mono',
  sans: 'font-sans',
  display: 'font-display',
};

export function AnimatedText({ text, style, className = '' }: AnimatedTextProps) {
  const baseClasses = `${fontSizeMap[style.fontSize]} ${fontFamilyMap[style.fontFamily]} ${className}`;
  
  const renderText = () => {
    switch (style.animation) {
      case 'float':
        return (
          <motion.span
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className={`inline-block ${baseClasses}`}
            style={{ color: style.color }}
          >
            {text}
          </motion.span>
        );
      
      case 'pulse':
        return (
          <motion.span
            animate={{
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className={baseClasses}
            style={{ color: style.color }}
          >
            {text}
          </motion.span>
        );
      
      case 'typing':
        return (
          <motion.span
            className={baseClasses}
            style={{ color: style.color }}
          >
            {text.split('').map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                {char}
              </motion.span>
            ))}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-[2px] h-[1em] ml-1 align-middle"
              style={{ backgroundColor: style.color }}
            />
          </motion.span>
        );
      
      default:
        return (
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={baseClasses}
            style={{ color: style.color }}
          >
            {text}
          </motion.span>
        );
    }
  };

  return (
    <div className={style.glow ? 'glow-text' : ''}>
      {renderText()}
    </div>
  );
}
