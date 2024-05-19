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
];

export default routes;
