import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import commonEn from './locales/en/common.json';
import navigationEn from './locales/en/navigation.json';
import learningEn from './locales/en/learning.json';
import quizEn from './locales/en/quiz.json';

import commonTa from './locales/ta/common.json';
import navigationTa from './locales/ta/navigation.json';
import learningTa from './locales/ta/learning.json';
import quizTa from './locales/ta/quiz.json';

const savedLanguage = typeof window !== 'undefined' 
  ? localStorage.getItem('financex_language') || 'en'
  : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: commonEn,
        navigation: navigationEn,
        learning: learningEn,
        quiz: quizEn,
      },
      ta: {
        common: commonTa,
        navigation: navigationTa,
        learning: learningTa,
        quiz: quizTa,
      },
    },
    lng: savedLanguage,
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

export default i18n;
