import { defineStore } from 'pinia';
import naiveui from '../plugins/naiveui';
import Axios from '../plugins/axios';
import { _ } from '../i18n';

export const useStore = defineStore('__default__', {
  state: () => ({
    theme: 'light',
    locale: window.navigator.language.substr(0, 2) as Language,
    user: {} as User | null,
  }),
  actions: {
    switchTheme() {
      this.theme = this.theme === 'dark' ? 'light' : 'dark';
    },
    setLocale(locale: Language) {
      this.locale = locale;
      naiveui.message.info(_('locale.switch'));
    },
    logout() {
      Axios.post('/user/logout/').then(() => {
        this.user = null;
      });
    },
  },
  getters: {
    loggedIn(state) {
      return state.user !== null;
    },
  },
  persist: true,
});
