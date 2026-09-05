import React from 'react';
import { motion } from 'motion/react';

export interface FinanceXLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  variant?: 'icon' | 'full' | 'compact';
  animated?: boolean;
  glow?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * Official FinanceX Brand Mark:
 * Uses the supplied favicon.png asset as the primary source of truth.
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
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00E599]/30 to-[#FF2E7E]/30 blur-sm transform scale-110 pointer-events-none" />
      )}
      <img
        src="/favicon.png"
        alt="FinanceX Mark"
        style={{ width: size, height: size }}
        className="relative z-10 object-contain drop-shadow-md"
      />
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
}> = ({ fontSize = 'text-xl sm:text-2xl', className = '' }) => {
  return (
    <div className={`inline-flex items-baseline tracking-tight font-display select-none ${className}`}>
      <span className={`font-black text-slate-900 dark:text-white tracking-tight ${fontSize}`}>
        Finan
      </span>
      <span className={`font-black text-emerald-600 dark:text-[#00E599] ${fontSize}`}>
        ce
      </span>
      <span className={`font-black text-[#FF2E7E] ml-0.5 ${fontSize}`}>
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
  onClick
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
          <Wordmark fontSize={current.fontSize} />
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
