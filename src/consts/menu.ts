import { computed, h } from 'vue';
import { NIcon } from 'naive-ui';
import { t } from '../i18n';
import {
  Home,
  VolumeFileStorage,
  UserProfileAlt,
  Settings,
  Logout,
  Login,
} from '@vicons/carbon';

export const menu = computed(() => [
  {
    label: t('home'),
    icon: () => h(NIcon, { component: Home }),
    key: 'home',
    action: 'route',
  },
  {
    type: 'divider',
  },
  {
    label: t('file.file'),
    icon: () => h(NIcon, { component: VolumeFileStorage }),
    key: 'files',
    action: 'route',
  },
  {
    type: 'divider',
  },
  {
    label: t('user.profile'),
    icon: () => h(NIcon, { component: UserProfileAlt }),
    key: 'user-profile',
    action: 'route',
  },
  {
    label: t('user.setting'),
    icon: () => h(NIcon, { component: Settings }),
    key: 'user-setting',
    action: 'route',
  },
  {
    label: t('user.logout'),
    icon: () => h(NIcon, { component: Logout }),
    key: 'logout',
    action: 'logout',
  },
]);

export const menuLoggedOut = computed(() => [
  {
    label: `${t('user.login')}/${t('user.register')}`,
    icon: () => h(NIcon, { component: Login }),
    key: 'user-login',
    action: 'route',
  },
]);
