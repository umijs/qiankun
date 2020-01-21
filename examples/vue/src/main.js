import './public-path';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import routes from './router';
import store from './store';

Vue.config.productionTip = false;

Vue.use(ElementUI);

let router = null;
let instance = null;

function render() {
  router = new VueRouter({
    base: window.__POWERED_BY_QIANKUN__ ? '/vue' : '/',
    mode: 'history',
    routes,
  });

  instance = new Vue({
    router,
    store,
    render: h => h(App),
  }).$mount('#app');
}

if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

export async function bootstrap() {
  console.log('vue app bootstraped');
}

export async function mount(props) {
  console.log('props from main framework', props);
  render();
}

export async function unmount() {
  instance.$destroy();
  instance = null;
  router = null;
}
