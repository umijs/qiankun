import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const baseUrl = '/sub-app1';

const routes = [
  {
    path: `${baseUrl}/`,
    name: 'home',
    component: Home,
  },
  {
    path: `${baseUrl}/about`,
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;
