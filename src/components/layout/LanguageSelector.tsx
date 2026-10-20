import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';

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
    // Dispatch custom event to notify services/components of language change
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
    { code: 'en', label: 'English', short: 'EN', flag: '🇬🇧', subtitle: 'English (US)' },
    { code: 'ta', label: 'தமிழ்', short: 'TA', flag: '🇮🇳', subtitle: 'Tamil' },
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
        <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#0B0F19] dark:bg-[#0F1422] text-white border border-slate-800 dark:border-slate-700 shadow-2xl z-50 py-1.5 text-xs backdrop-blur-md">
          <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[10px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
            Learning Language
          </div>
          {languages.map(lang => (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800/80 transition ${
                currentLang === lang.code
                  ? 'font-bold text-[#00E599] bg-emerald-50/50 dark:bg-emerald-950/20'
                  : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{lang.flag}</span>
                <div>
                  <div>{lang.label}</div>
                  <div className="text-[10px] text-slate-400 font-normal">{lang.subtitle}</div>
                </div>
              </div>
              {currentLang === lang.code && <Check className="w-3.5 h-3.5 text-[#00E599]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
