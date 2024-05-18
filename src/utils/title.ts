import { _ } from '../i18n';

export default (name: string) => {
  const h1s = document.getElementsByTagName('h1');
  if (name === 'home') {
    document.title = _('site.name');
  } else if (h1s.length !== 0) {
    document.title = h1s[0].textContent + ' - ' + _('site.name');
  }
};
