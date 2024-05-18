import { nextTick } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import naiveui from '../plugins/naiveui';
import { routes } from './routes';
import { useStore } from '../stores';
import { _ } from '../i18n';
import getTitle from '../utils/title';

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  naiveui.loadingBar.start();
  const store = useStore();
  if (to.meta.requiredLogin && !store.loggedIn) {
    next({ name: 'user-login', query: { next: to.fullPath } });
  } else {
    next();
  }
});

router.afterEach((to, from) => {
  naiveui.loadingBar.finish();
  if (!from || to.path !== from.path) {
    naiveui.loadingBar.finish();
    if (to.hash && to.hash !== from.hash) {
      nextTick(() => {
        const el = document.querySelector(to.hash);
        if (el) el.scrollIntoView();
      });
    }
    nextTick(() => getTitle(to.name));
  }
});

export default router;
