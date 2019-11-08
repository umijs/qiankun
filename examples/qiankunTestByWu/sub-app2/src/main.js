import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

let instance = null;

export async function bootstrap() {
  console.log('react app bootstraped');
}

export async function mount(props) {
  console.log('props from main framework', props);
  instance = new Vue({
    router,
    store,
    render: h => h(App),
  }).$mount('#app');
}

export async function unmount() {
  instance.$destroy();
  instance = null;
}
