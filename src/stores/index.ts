import { defineStore } from 'pinia';
import Axios from '../plugins/axios';
import { languages, themeOptionsNext } from '../consts/options';
import i18n from '../i18n';

export const useStore = defineStore('__default__', {
  state: () => {
    const _locale = window.navigator.language;
    // @ts-ignore
    const locale = languages.includes(_locale) ? _locale : 'zh-CN';
    return {
      theme: 'auto' as Theme,
      locale: locale as Language,
      user: {} as User,
    };
  },
  actions: {
    switchTheme() {
      this.theme = themeOptionsNext[this.theme];
    },
    setLocale(locale: Language) {
      this.locale = locale;
      i18n.global.locale.value = locale;
    },
    logout() {
      Axios.post('/user/logout/').then(() => {
        this.user = {} as User;
      });
    },
  },
  getters: {
    getTheme(state) {
      switch (state.theme) {
        case 'auto':
          return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
        default:
          return state.theme;
      }
    },
    loggedIn(state) {
      return state.user?.id !== undefined;
    },
  },
  persist: true,
});
