import React from 'react';
import { motion } from 'motion/react';

export interface FinanceXLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  variant?: 'icon' | 'full' | 'compact';
  animated?: boolean;
  glow?: boolean;
  className?: string;
  onClick?: () => void;
  inverse?: boolean;
}

/**
 * Official FinanceX Brand Mark:
 * Renders a crisp, glowing institutional crest with emerald & gold tones.
 */
export const FinanceXMark: React.FC<{
  size?: number;
  glow?: boolean;
  className?: string;
  isDark?: boolean;
}> = ({ size = 40, glow = true, className = '' }) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {glow && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400/40 via-teal-400/30 to-amber-400/40 blur-sm transform scale-110 pointer-events-none" />
      )}
      <div 
        className="relative z-10 w-full h-full rounded-xl bg-gradient-to-br from-[#064E3B] via-[#047857] to-[#032B25] border border-amber-300/40 p-1 flex items-center justify-center shadow-md shadow-emerald-950/50"
      >
        <span className="font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-white to-amber-300 select-none text-[65%] leading-none">
          FX
        </span>
      </div>
    </div>
  );
};

export const BrandMark: React.FC<{
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}> = ({ size = 'md', className = '' }) => {
  const pixelMap = {
    sm: 32,
    md: 40,
    lg: 56,
    xl: 80
  };

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-2xl bg-white dark:bg-[#0B0F19] p-1 shadow-xs border border-slate-200 dark:border-slate-800 ${className}`}
    >
      <FinanceXMark size={pixelMap[size]} glow={true} />
    </span>
  );
};

export const Wordmark: React.FC<{
  fontSize?: string;
  className?: string;
  inverse?: boolean;
}> = ({ fontSize = 'text-xl sm:text-2xl', className = '', inverse = false }) => {
  return (
    <div className={`inline-flex items-baseline tracking-tight font-display select-none ${className}`}>
      <span className={`font-black tracking-tight ${inverse ? 'text-white' : 'text-slate-900 dark:text-white'} ${fontSize}`}>
        Finan
      </span>
      <span className={`font-black text-emerald-400 dark:text-[#00E599] ${fontSize}`}>
        ce
      </span>
      <span className={`font-black text-amber-400 dark:text-amber-300 ml-0.5 ${fontSize}`}>
        X
      </span>
    </div>
  );
};

export const FinanceXLogo: React.FC<FinanceXLogoProps> = ({
  size = 'md',
  variant = 'full',
  animated = false,
  glow = true,
  className = '',
  onClick,
  inverse = false
}) => {
  const sizeConfig = {
    sm: { markSize: 28, fontSize: 'text-lg', subtitle: false },
    md: { markSize: 36, fontSize: 'text-xl', subtitle: false },
    lg: { markSize: 48, fontSize: 'text-2xl', subtitle: true },
    xl: { markSize: 64, fontSize: 'text-4xl', subtitle: true },
    hero: { markSize: 96, fontSize: 'text-5xl sm:text-6xl', subtitle: true }
  };

  const current = sizeConfig[size];

  const MarkElement = (
    <FinanceXMark size={current.markSize} glow={glow} />
  );

  if (variant === 'icon') {
    return (
      <div 
        onClick={onClick} 
        className={`inline-flex items-center justify-center ${onClick ? 'cursor-pointer' : ''} ${className}`}
        id="financex-icon-logo"
      >
        {animated ? (
          <motion.div
            whileHover={{ scale: 1.06, rotate: 2 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
          >
            {MarkElement}
          </motion.div>
        ) : (
          MarkElement
        )}
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      id="financex-brand-logo"
    >
      {animated ? (
        <motion.div
          whileHover={{ scale: 1.05, rotate: 1.5 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 400, damping: 18 }}
        >
          {MarkElement}
        </motion.div>
      ) : (
        MarkElement
      )}

      {variant !== 'compact' && (
        <div className="flex flex-col">
          <Wordmark fontSize={current.fontSize} inverse={inverse} />
          {current.subtitle && (
            <span className="text-[9px] sm:text-[10px] tracking-widest uppercase font-mono font-bold text-slate-500 dark:text-slate-400 -mt-0.5">
              AI FINANCIAL ACADEMY & MARKETS
            </span>
          )}
        </div>
      )}
    </div>
  );
};
