import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  LayoutDashboard, 
  BookOpen, 
  FileQuestion, 
  Clock, 
  TrendingUp, 
  BrainCircuit, 
  Calculator, 
  CalendarDays, 
  Users, 
  Zap, 
  Award, 
  ShieldCheck, 
  X,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Globe
} from 'lucide-react';
import { AppNavView, User } from '../../types/schema';
import { adminService } from '../../services/adminService';

interface FloatingRadialMenuProps {
  currentView: AppNavView;
  onNavigate: (view: AppNavView, payload?: any) => void;
  user: User;
}

interface MenuItem {
  id: AppNavView;
  label: string;
  icon: React.ReactNode;
  color: string;
}

export const FloatingRadialMenu: React.FC<FloatingRadialMenuProps> = ({
  currentView,
  onNavigate,
  user
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rotationOffset, setRotationOffset] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const touchStartYRef = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);

  const isAdmin = adminService.hasAdminPrivileges(user);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const allItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, color: '#FF5722' },
    { id: 'learn', label: 'NISM XV Lessons', icon: <BookOpen className="w-4 h-4" />, color: '#00E599' },
    { id: 'courses', label: 'Curriculum Catalog', icon: <Compass className="w-4 h-4" />, color: '#38BDF8' },
    { id: 'practice-lab', label: 'Trading Lab', icon: <TrendingUp className="w-4 h-4" />, color: '#10B981' },
    { id: 'argus-fin', label: 'Argus Fin Platform', icon: <Globe className="w-4 h-4" />, color: '#34D399' },
    { id: 'quizzes', label: 'Topic Quizzes', icon: <FileQuestion className="w-4 h-4" />, color: '#F59E0B' },
    { id: 'mock-exams', label: 'Mock Exams (100M)', icon: <Clock className="w-4 h-4" />, color: '#EC4899' },
    { id: 'ai-tutor', label: 'AI Financial Tutor', icon: <BrainCircuit className="w-4 h-4" />, color: '#8B5CF6' },
    { id: 'calculators', label: 'NISM Ratios Calc', icon: <Calculator className="w-4 h-4" />, color: '#06B6D4' },
    { id: 'study-plans', label: 'Study Calendar', icon: <CalendarDays className="w-4 h-4" />, color: '#6366F1' },
    { id: 'arena', label: 'Competitive Arena', icon: <Zap className="w-4 h-4" />, color: '#EAB308' },
    { id: 'community', label: 'Community Forum', icon: <Users className="w-4 h-4" />, color: '#14B8A6' },
    { id: 'certifications', label: 'Certifications', icon: <Award className="w-4 h-4" />, color: '#3B82F6' },
  ];

  if (isAdmin) {
    allItems.push({ id: 'admin', label: 'Admin Portal', icon: <ShieldCheck className="w-4 h-4" />, color: '#A855F7' });
  }

  // Handle clicking empty space / outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (isOpen && menuContainerRef.current && !menuContainerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKey);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isOpen]);

  // Handle mouse wheel over the dial to smoothly rotate
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setRotationOffset((prev) => prev + (e.deltaY > 0 ? 1 : -1));
  };

  // Touch gesture handling for mobile finger swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
    isDraggingRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartYRef.current === null) return;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - touchStartYRef.current;
    
    // Threshold of 22px for a step rotation
    if (Math.abs(deltaY) > 22) {
      setRotationOffset((prev) => prev + (deltaY > 0 ? -1 : 1));
      touchStartYRef.current = currentY;
      isDraggingRef.current = true;
    }
  };

  const handleTouchEnd = () => {
    touchStartYRef.current = null;
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 80);
  };

  // Semi-circle radius and angular distribution
  // Mobile uses a tighter radius so buttons fit easily on narrow phone screens
  const radius = isMobile ? Math.min(125, Math.max(95, Math.floor(window.innerWidth * 0.32))) : 175;
  const visibleCount = isMobile ? 5 : 7;
  const totalItems = allItems.length;

  // Infinite cyclic rotation wrapping
  const visibleItems = Array.from({ length: visibleCount }, (_, i) => {
    const rawIndex = rotationOffset + i;
    const itemIndex = ((rawIndex % totalItems) + totalItems) % totalItems;
    return {
      ...allItems[itemIndex],
      virtualKey: `${allItems[itemIndex].id}-${rawIndex}`
    };
  });

  return (
    <div ref={menuContainerRef} className="fixed left-0 top-1/2 -translate-y-1/2 z-50 pointer-events-auto select-none">
      {/* 1. FLOATING DOCKED TRIGGER BUTTON */}
      <motion.button
        whileHover={{ scale: 1.06, x: 3 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative flex items-center justify-center w-11 h-14 rounded-r-2xl shadow-[0_8px_25px_rgba(5,150,105,0.35)] transition-all duration-200 cursor-pointer border-t border-r border-b ${
          isOpen
            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-700 dark:border-white/40'
            : 'bg-gradient-to-r from-[#047857] via-[#059669] to-[#047857] text-white border-amber-300/40'
        }`}
        title="Quick Semi-Circular Menu (Swipe or Scroll to rotate)"
        aria-label="Toggle Navigation Dial"
      >
        {isOpen ? (
          <X className="w-5 h-5 transition-transform duration-200" />
        ) : (
          <div className="flex flex-col items-center gap-0.5">
            <Compass className="w-5 h-5 animate-spin-slow group-hover:rotate-45 transition-transform text-amber-300" />
            <ChevronRight className="w-3 h-3 text-white/80" />
          </div>
        )}

        {/* Pulse glow indicator */}
        {!isOpen && (
          <span className="absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-white animate-pulse" />
        )}
      </motion.button>

      {/* 2. SEMI-CIRCULAR RADIAL DIAL MENU OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for click-to-close on empty space */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-950/40 dark:bg-black/60 backdrop-blur-xs -z-10"
            />

            {/* The Semi-Circular Arc Container with Touch & Wheel Listeners */}
            <div 
              onWheel={handleWheel}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-[280px] sm:w-[320px] h-[360px] sm:h-[420px] pointer-events-auto touch-none"
            >
              {/* Decorative Subtle Glowing Track */}
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full border border-dashed border-emerald-500/25 dark:border-emerald-400/25 pointer-events-none shadow-[0_0_50px_rgba(5,150,105,0.15)]"
                style={{
                  width: `${radius * 2}px`,
                  height: `${radius * 2}px`,
                  transform: 'translate(-50%, -50%)'
                }}
              />

              {/* Mobile Thumb Step Buttons: Rotate Up & Down with ease */}
              <div className="absolute left-2.5 top-2 flex flex-col gap-2 z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setRotationOffset((prev) => prev - 1);
                  }}
                  className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-emerald-500 hover:bg-emerald-50 active:scale-95 transition cursor-pointer"
                  title="Rotate Dial Up"
                  aria-label="Rotate Dial Up"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
              </div>

              <div className="absolute left-2.5 bottom-2 flex flex-col gap-2 z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setRotationOffset((prev) => prev + 1);
                  }}
                  className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-emerald-500 hover:bg-emerald-50 active:scale-95 transition cursor-pointer"
                  title="Rotate Dial Down"
                  aria-label="Rotate Dial Down"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Arc Item Nodes */}
              {visibleItems.map((item, idx) => {
                // Compute angle along the visible right half arc (-68° to +68°)
                const totalAngle = isMobile ? 120 : 136; // degrees
                const startAngle = -(totalAngle / 2);
                const angleDeg = startAngle + (idx / (visibleCount - 1)) * totalAngle;
                const angleRad = (angleDeg * Math.PI) / 180;

                // X from the left edge = radius * cos(angle)
                // Y from the vertical center = radius * sin(angle)
                const x = Math.round(radius * Math.cos(angleRad));
                const y = Math.round(radius * Math.sin(angleRad));

                const isActive = currentView === item.id;

                return (
                  <motion.div
                    key={item.virtualKey}
                    initial={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
                    animate={{ opacity: 1, x, y, scale: 1 }}
                    exit={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
                    transition={{ type: 'spring', stiffness: 360, damping: 26, delay: idx * 0.015 }}
                    className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                  >
                    <button
                      onClick={() => {
                        if (isDraggingRef.current) return;
                        onNavigate(item.id);
                        setIsOpen(false);
                      }}
                      className={`group relative flex items-center gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl shadow-lg transition-all duration-200 cursor-pointer border max-w-[170px] sm:max-w-none ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white border-amber-300/60 scale-105 shadow-[0_8px_20px_rgba(5,150,105,0.4)]'
                          : 'bg-white/95 dark:bg-[#0F1422]/95 hover:bg-emerald-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-white/10 hover:border-emerald-300 dark:hover:border-emerald-500/40 backdrop-blur-md'
                      }`}
                      style={{ transformOrigin: 'left center' }}
                    >
                      <div 
                        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${
                          isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                        style={{ color: isActive ? '#FFFFFF' : item.color }}
                      >
                        {item.icon}
                      </div>

                      <span className="text-[11px] sm:text-xs font-bold whitespace-nowrap pr-1 tracking-tight truncate">
                        {item.label}
                      </span>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
