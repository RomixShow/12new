import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationsRU from './locales/ru.json';
import translationsEN from './locales/en.json';

const resources = {
  ru: { translation: translationsRU },
  en: { translation: translationsEN }
};

const userLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
const savedLang = localStorage.getItem('site_lang');
const defaultLang = savedLang || (userLang.startsWith('ru') ? 'ru' : 'en');

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: defaultLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('site_lang', lng);
});

export default i18n;
