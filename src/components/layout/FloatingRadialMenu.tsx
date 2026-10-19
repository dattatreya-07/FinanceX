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
  ChevronRight
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
  const menuContainerRef = useRef<HTMLDivElement>(null);

  const isAdmin = adminService.hasAdminPrivileges(user);

  const allItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, color: '#FF5722' },
    { id: 'learn', label: 'NISM XV Lessons', icon: <BookOpen className="w-4 h-4" />, color: '#00E599' },
    { id: 'courses', label: 'Curriculum Catalog', icon: <Compass className="w-4 h-4" />, color: '#38BDF8' },
    { id: 'practice-lab', label: 'Trading Lab', icon: <TrendingUp className="w-4 h-4" />, color: '#10B981' },
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

  // Handle mouse wheel over the dial to smoothly and infinitely rotate the semi-circle menu
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setRotationOffset((prev) => prev + (e.deltaY > 0 ? 1 : -1));
  };

  // Semi-circle radius and angular distribution
  const radius = 175; // px from edge
  const visibleCount = 7;
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
        title="Quick Semi-Circular Menu"
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
              className="fixed inset-0 bg-slate-950/30 dark:bg-black/50 backdrop-blur-xs -z-10"
            />

            {/* The Semi-Circular Arc Container */}
            <div 
              onWheel={handleWheel}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-[240px] h-[400px] pointer-events-none"
            >
              {/* Decorative Subtle Glowing Track */}
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 w-[340px] h-[340px] -translate-x-1/2 rounded-full border border-dashed border-emerald-500/20 dark:border-emerald-400/20 pointer-events-none shadow-[0_0_50px_rgba(5,150,105,0.1)]"
              />

              {visibleItems.map((item, idx) => {
                // Compute angle along the visible right half arc (-70° to +70°)
                const totalAngle = 140; // degrees
                const startAngle = -70;
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
                    transition={{ type: 'spring', stiffness: 350, damping: 25, delay: idx * 0.02 }}
                    className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                  >
                    <button
                      onClick={() => {
                        onNavigate(item.id);
                        setIsOpen(false);
                      }}
                      className={`group relative flex items-center gap-2.5 px-3 py-2 rounded-2xl shadow-lg transition-all duration-200 cursor-pointer border ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white border-amber-300/60 scale-110 shadow-[0_8px_20px_rgba(5,150,105,0.4)]'
                          : 'bg-white/95 dark:bg-[#0F1422]/95 hover:bg-emerald-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-white/10 hover:border-emerald-300 dark:hover:border-emerald-500/40 backdrop-blur-md'
                      }`}
                      style={{ transformOrigin: 'left center' }}
                    >
                      <div 
                        className={`w-7 h-7 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                          isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                        style={{ color: isActive ? '#FFFFFF' : item.color }}
                      >
                        {item.icon}
                      </div>

                      <span className="text-xs font-bold whitespace-nowrap pr-1 tracking-tight">
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
