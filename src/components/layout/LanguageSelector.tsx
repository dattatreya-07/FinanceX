import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';

interface LanguageSelectorProps {
  variant?: 'header' | 'compact' | 'full';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ variant = 'header' }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);
  const currentLang = i18n.language || 'en';

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('financex_language', lang);
    // Dispatch custom event to notify services/components of language change
    window.dispatchEvent(new CustomEvent('financex-language-change', { detail: { language: lang } }));
    setIsOpen(false);
  };

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧', subtitle: 'English (US)' },
    { code: 'ta', label: 'தமிழ்', flag: '🇮🇳', subtitle: 'Tamil' },
  ];

  const currentObj = languages.find(l => l.code === currentLang) || languages[0];

  return (
    <div className="relative inline-block text-left" id="language-selector">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select learning language"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 transition shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#00E599]/50"
      >
        <Globe className="w-3.5 h-3.5 text-[#00E599]" />
        <span className="font-medium">{currentObj.label}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-[#0F1422] border border-slate-200 dark:border-slate-700 shadow-xl z-50 py-1.5 text-xs theme-transition">
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
