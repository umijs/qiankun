import { createApp, App as VueApp } from 'vue';
import { createRouter, createWebHistory, Router } from 'vue-router';
import App from './App.vue';
import Home from './views/Home.vue';
import About from './views/About.vue';

let app: VueApp | null = null;
let router: Router | null = null;

function render(props: { container?: HTMLElement } = {}) {
  const { container } = props;
  
  router = createRouter({
    history: createWebHistory(window.__POWERED_BY_QIANKUN__ ? '/vue' : '/'),
    routes: [
      { path: '/', component: Home },
      { path: '/about', component: About },
    ],
  });

  app = createApp(App);
  app.use(router);
  app.mount(container ? container.querySelector('#app') : '#app');
}

export async function bootstrap() {
  console.log('[vue] bootstrap');
}

export async function mount(props: { container?: HTMLElement }) {
  console.log('[vue] mount', props);
  render(props);
}

export async function unmount() {
  console.log('[vue] unmount');
  if (app) {
    app.unmount();
    app = null;
  }
  router = null;
}

if (!window.__POWERED_BY_QIANKUN__) {
  render();
}
