import { useTranslation } from 'react-i18next';

/**
 * Hook to get localized field from data object
 * Returns English version if current language is English, otherwise returns default field
 */
export function useLocalizedField() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const getField = (item, fieldName) => {
    if (!item) return '';
    
    // If English, try to get _en version first
    if (currentLang === 'en') {
      const enField = item[`${fieldName}_en`];
      if (enField) return enField;
    }
    
    // Fallback to default field
    return item[fieldName] || '';
  };

  return { getField, currentLang };
}
