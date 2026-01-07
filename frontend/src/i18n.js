import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationsRU from './locales/ru.json';
import translationsEN from './locales/en.json';

const resources = {
  ru: { translation: translationsRU },
  en: { translation: translationsEN }
};

const userLang = navigator.language || navigator.userLanguage;
const defaultLang = userLang.startsWith('ru') ? 'ru' : 'en';

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

export default i18n;