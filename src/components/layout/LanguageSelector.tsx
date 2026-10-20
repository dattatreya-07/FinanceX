import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check, Sparkles } from 'lucide-react';

interface LanguageSelectorProps {
  variant?: 'header' | 'compact' | 'full';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ variant = 'header' }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const currentLang = i18n.language || 'en';

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('financex_language', lang);
    // Dispatch custom event to notify all components/services
    window.dispatchEvent(new CustomEvent('financex-language-change', { detail: { language: lang } }));
    setIsOpen(false);
  };

  // Close on outside click
  React.useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutside);
    }
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isOpen]);

  const languages = [
    { code: 'en', label: 'English', short: 'EN', flag: '🇬🇧', subtitle: 'English (US & Global)' },
    { code: 'ta', label: 'தமிழ்', short: 'TA', flag: '🇮🇳', subtitle: 'Tamil (தமிழ்)' },
  ];

  const currentObj = languages.find(l => l.code === currentLang) || languages[0];

  return (
    <div className="relative inline-block text-left" id="language-selector" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select learning language"
        className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-medium backdrop-blur-sm transition shadow-xs cursor-pointer focus:outline-hidden"
      >
        <Globe className="w-3.5 h-3.5 text-amber-300 sm:text-[#00E599]" />
        <span className="font-bold text-[11px] sm:hidden">{currentObj.short}</span>
        <span className="hidden sm:inline font-medium">{currentObj.label}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#0B1322] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-emerald-500/30 shadow-[0_16px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.7)] z-50 py-2 text-xs backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3.5 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[10px] font-mono font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase flex items-center justify-between">
            <span>Learning Language</span>
            <Sparkles className="w-3 h-3 text-amber-500" />
          </div>
          <div className="p-1 space-y-1">
            {languages.map(lang => {
              const isActive = currentLang === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800/60'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base select-none">{lang.flag}</span>
                    <div>
                      <div className="text-xs leading-none font-bold">{lang.label}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-normal">
                        {lang.subtitle}
                      </div>
                    </div>
                  </div>
                  {isActive && (
                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
