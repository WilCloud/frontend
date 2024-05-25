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
    path: '/root/:path(.*)?',
    name: 'files',
    component: () => import('../pages/files.vue'),
  },
  {
    path: '/icon/:path(.*)?',
    name: 'files-icon',
    component: () => import('../pages/files-icon.vue'),
  },
];

export default routes;
