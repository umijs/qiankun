import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', name: 'home', component: () => import(/* webpackChunkName: "home" */ '@/views/Home') },
  { path: '/about', name: 'about', component: () => import(/* webpackChunkName: "about" */ '@/views/About') },
];

const routerObj = createRouter({
  history: createWebHistory(window.__POWERED_BY_QIANKUN__ ? '/vue3' : '/'),
  routes,
});

export default routerObj;
