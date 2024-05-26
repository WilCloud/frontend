import { createI18n } from 'vue-i18n';
import enLocale from './en.json';
import zhCNLocale from './zh-CN.json';

const messages = {
  'en-US': {
    ...enLocale,
  },
  'en-UK': {
    ...enLocale,
  },
  'zh-CN': {
    ...zhCNLocale,
  },
};

const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages: messages,
});

export default i18n;
export const t = i18n.global.t;
