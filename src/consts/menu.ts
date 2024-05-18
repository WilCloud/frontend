import { computed } from 'vue';
import { _ } from '../i18n';

export const menu = computed(() => [
  {
    label: _('home'),
    key: 'home',
    action: 'route',
  },
  {
    type: 'divider',
  },
  {
    label: _('files'),
    key: 'files',
    action: 'route',
  },
  {
    type: 'divider',
  },
  {
    label: _('user.profile'),
    key: 'user-profile',
    action: 'route',
  },
  {
    label: _('user.logout'),
    key: 'logout',
    action: 'logout',
  },
]);

export const menuLoggedOut = computed(() => [
  {
    label: `${_('user.login')}/${_('user.register')}`,
    key: 'user-login',
    action: 'route',
  },
]);
