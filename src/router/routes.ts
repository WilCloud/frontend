export const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../pages/home.vue'),
  },
  {
    path: '/user/login/',
    name: 'user-login',
    component: () => import('../pages/user/login.vue'),
  },
  {
    path: '/user/setting/',
    name: 'user-setting',
    component: () => import('../pages/user/setting.vue'),
  },
  {
    path: '/root/:path(.*)?',
    name: 'files',
    component: () => import('../pages/files.vue'),
  },
];

export default routes;
