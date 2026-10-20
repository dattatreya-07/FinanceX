import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface BootExperienceProps {
  onComplete: () => void;
}

const BOOT_SESSION_KEY = 'hasSeenFinanceXBoot';

/**
 * High-Fidelity Boot Animation for FinanceX:
 * - 100% Full-screen, fully responsive container (desktop & mobile)
 * - Primary source: FinanceX_BootFinal.mp4
 * - Strict dark charcoal/black background with central radial lighting glow
 * - No follow-up animation after the boot video
 * - Full prefers-reduced-motion & keyboard skip support
 */
export const BootExperience: React.FC<BootExperienceProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'video' | 'exit'>('video');
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const isDismissedRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const dismiss = () => {
    if (isDismissedRef.current) return;
    isDismissedRef.current = true;
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(BOOT_SESSION_KEY, 'true');
      } catch {
        // The app must still open when storage is disabled or unavailable.
      }
    }
    setPhase('exit');
    setTimeout(() => {
      onComplete();
    }, 450);
  };

  useEffect(() => {
    // A media request can remain pending forever on a dev server or a blocked
    // browser. Never let the boot screen prevent the app from rendering.
    const videoFallbackTimer = setTimeout(() => {
      if (!isDismissedRef.current && phase === 'video') {
        dismiss();
      }
    }, 5000);

    // Check prefers-reduced-motion
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mediaQuery.matches) {
        setIsReducedMotion(true);
        const timer = setTimeout(dismiss, 600);
        return () => {
          clearTimeout(timer);
          clearTimeout(videoFallbackTimer);
        };
      }
    }

    // Attempt video playback on mount
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        dismiss();
      });
    }

    // Keyboard shortcut to skip
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        dismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(videoFallbackTimer);
    };
  }, [phase]);

  return (
    <AnimatePresence>
      {phase !== 'exit' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 w-full h-full min-h-[100dvh] max-h-[100dvh] z-[999999] flex items-center justify-center bg-[#07090E] text-white select-none overflow-hidden m-0 p-0"
          id="financex-boot-experience"
        >
          {/* Ambient Dark Radial Glow Background */}
          <div className="absolute inset-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#0F172A]/40 via-[#07090E]/90 to-[#05070B] pointer-events-none" />

          {/* Soft Glow Accents */}
          <div className="absolute w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full bg-gradient-to-tr from-[#00E599]/10 via-transparent to-[#FF2E7E]/10 blur-3xl pointer-events-none" />

          {/* Top-Right Skip Control */}
          <button
            onClick={dismiss}
            className="absolute top-4 right-4 sm:top-8 sm:right-8 z-50 flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-xs sm:text-sm font-mono text-slate-300 hover:text-white border border-slate-700/60 backdrop-blur-md transition-all cursor-pointer shadow-2xl active:scale-95"
            aria-label="Skip Boot Animation"
          >
            <span>Skip</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00E599]" />
          </button>

          {/* Video Boot Animation (Fully Responsive Across All Media Types) */}
          {phase === 'video' ? (
            <div className="relative z-20 w-full h-full max-h-[100dvh] flex items-center justify-center overflow-hidden p-2 sm:p-6 md:p-8">
              <video
                ref={videoRef}
                src="/FinanceX_BootFinal.mp4"
                autoPlay
                muted
                playsInline
                onEnded={dismiss}
                onError={() => {
                  dismiss();
                }}
                className="max-w-full max-h-[92dvh] w-auto h-auto object-contain filter drop-shadow-[0_16px_40px_rgba(4,120,87,0.3)] rounded-2xl"
              />
            </div>
          ) : null}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
