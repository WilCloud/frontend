import type { RouteRecordName } from 'vue-router';
import { t } from '../i18n';

export default (name?: RouteRecordName | null) => {
  const h1s = document.getElementsByTagName('h1');
  if (name === 'home') {
    document.title = t('site.name');
  } else if (h1s.length !== 0) {
    document.title = h1s[0].textContent + ' - ' + t('site.name');
  }
};
