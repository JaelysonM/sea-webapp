import { initReactI18next, useTranslation } from 'react-i18next';
import i18n, { TOptions } from 'i18next';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: 'pt',
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false,
    },
    backend: { loadPath: '/locales/{{lng}}/{{ns}}.json' },
  });

export default i18n;

export { useTranslation } from 'react-i18next';

export const useTranslationX = (baseKey: string, namespace?: string | string[]) => {
  const props = useTranslation(namespace);

  return {
    ...props,
    tx: (key: string, options?: TOptions) => props.t(`${baseKey}.${key}`, options),
  };
};
