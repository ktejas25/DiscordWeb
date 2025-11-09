import { useSettings } from '@/hooks/useSettings';
import { translations, TranslationKey, Locale } from './translations';

export function useTranslation() {
  const { settings } = useSettings();
  const locale = (settings?.settings?.locale || 'en') as Locale;

  const t = (key: TranslationKey): string => {
    return translations[locale]?.[key] || translations.en[key] || key;
  };

  return { t, locale };
}
