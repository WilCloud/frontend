import { createI18n } from 'vue-i18n';
import enLocale from './en';
import zhLocale from './zh';

const messages = {
  en: {
    ...enLocale,
  },
  zh: {
    ...zhLocale,
  },
};

const i18n = createI18n({
  legacy: false,
  locale: 'zh',
  fallbackLocale: 'zh',
  messages: messages,
});

export default i18n;
export const _ = i18n.global.t;
