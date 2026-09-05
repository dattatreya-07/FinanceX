import React from 'react';
import { motion } from 'motion/react';

interface CoinFlipLoaderProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CoinFlipLoader: React.FC<CoinFlipLoaderProps> = ({
  label = 'Loading market telemetry...',
  size = 'md'
}) => {
  const dimensionMap = {
    sm: 'w-10 h-10 text-base',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-24 h-24 text-4xl'
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 select-none" id="coin-flip-loader">
      <div className="perspective-1000 my-2">
        <motion.div
          animate={{ rotateY: [0, 180, 360, 540, 720] }}
          transition={{
            repeat: Infinity,
            duration: 2.2,
            ease: [0.45, 0.05, 0.55, 0.95]
          }}
          className={`relative ${dimensionMap[size]} preserve-3d`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Side 1: Indian Rupee (₹) with Mint Glow Rim */}
          <div
            className="absolute inset-0 rounded-full flex items-center justify-center font-mono font-black text-[#00E599] bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#020617] border-2 border-[#00E599] shadow-[0_0_20px_rgba(0,229,153,0.4)] backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="relative flex items-center justify-center">
              <span>₹</span>
              <div className="absolute inset-0 rounded-full border border-white/20 scale-90 pointer-events-none" />
            </div>
          </div>

          {/* Side 2: US Dollar ($) with Hot Pink Glow Rim */}
          <div
            className="absolute inset-0 rounded-full flex items-center justify-center font-mono font-black text-[#FF2E7E] bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#020617] border-2 border-[#FF2E7E] shadow-[0_0_20px_rgba(255,46,126,0.4)] backface-hidden"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <div className="relative flex items-center justify-center">
              <span>$</span>
              <div className="absolute inset-0 rounded-full border border-white/20 scale-90 pointer-events-none" />
            </div>
          </div>
        </motion.div>
      </div>

      {label && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="text-xs font-mono text-slate-400 mt-4 tracking-wider uppercase text-center"
        >
          {label}
        </motion.p>
      )}
    </div>
  );
};
