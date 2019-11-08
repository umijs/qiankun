import Vue from 'vue';
import { registerMicroApps, runAfterFirstMounted, setDefaultMountApp, start } from 'qiankun';
import fetch from 'isomorphic-fetch';
import App from './App.vue';
import router from './router';
import store from './store';


Vue.config.productionTip = false;
let app = null;

function render({ appContent, loading }) {
  /* examples for vue */
  if (!app) {
    app = new Vue({
      el: '#container',
      router,
      store,
      data() {
        return {
          content: appContent,
          loading,
        };
      },
      render(h) {
        return h(App, {
          props: {
            content: this.content,
            loading: this.loading,
          },
        });
      },
    });
  } else {
    app.content = appContent;
    app.loading = loading;
  }
}

function genActiveRule(routerPrefix) {
  return location => location.pathname.startsWith(routerPrefix);
}

render({ loading: true });

// 支持自定义获取请参阅: https://github.com/kuitos/import-html-entry/blob/91d542e936a74408c6c8cd1c9eebc5a9f83a8dc0/src/index.js#L163
const request = url =>
  fetch(url, {
    referrerPolicy: 'origin-when-cross-origin',
  });

// 注册子应用
registerMicroApps(
  [
    { name: 'vue sub-app1', entry: '//localhost:7100', render, activeRule: genActiveRule('/sub-app1') },
    { name: 'vue sub-app2', entry: '//localhost:7101', render, activeRule: genActiveRule('/sub-app2') },
    // { name: 'vue admin', entry: '//localhost:9428', render, activeRule: genActiveRule('/admin') },
  ],
  {
    beforeLoad: [
      app => {
        console.log('before load', app);
      },
    ],
    beforeMount: [
      app => {
        console.log('before mount', app);
      },
    ],
    afterUnmount: [
      app => {
        console.log('after unload', app);
      },
    ],
  },
  {
    fetch: request,
  },
);

// 设置默认加载的应用
setDefaultMountApp('/sub-app1');

// 第一个应用构建完成后执行
runAfterFirstMounted(() => console.info('first app mounted'));

// 启动主应用
start();
// start({ prefetch: true, fetch: request });

// new Vue({
//   router,
//   store,
//   render: h => h(App)
// }).$mount('#app')
