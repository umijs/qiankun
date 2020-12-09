import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';

import 'whatwg-fetch';
import 'custom-event-polyfill';
// import 'core-js/proposals/global-this'
// import 'core-js/stable/global-this';
import 'core-js/stable/object';
import 'core-js/stable/array';
import 'core-js/stable/promise';
import 'core-js/stable/symbol';
import 'core-js/stable/string/starts-with';
import 'core-js/web/url';
import 'core-js/stable/object/assign'
import 'core-js/stable/string/includes'
import 'core-js/stable/array/includes'

import { registerMicroApps, runAfterFirstMounted, setDefaultMountApp, start, initGlobalState } from '../../../es';

/**
 * 注册子应用
 */

registerMicroApps(
  [
    {
      name: 'child-app-2',
      entry: '//localhost:7102',
      container: '#subview',
      activeRule: '/child-app-2',
    },
    {
      name: 'child-app-1',
      entry: '//localhost:7101',
      container: '#subview',
      activeRule: '/child-app-1',
    },
  ],
  {
    beforeLoad: [
      app => {
        console.log('[LifeCycle] before load %c%s', 'color: green;', app.name);
      },
    ],
    beforeMount: [
      app => {
        console.log('[LifeCycle] before mount %c%s', 'color: green;', app.name);
      },
    ],
    afterUnmount: [
      app => {
        console.log('[LifeCycle] after unmount %c%s', 'color: green;', app.name);
      },
    ],
  },
);

const { onGlobalStateChange, setGlobalState } = initGlobalState({
  user: 'qiankun',
});

onGlobalStateChange((value, prev) => console.log('[onGlobalStateChange - master]:', value, prev));

setGlobalState({
  ignore: 'master',
  user: {
    name: 'master',
  },
});

// start();

runAfterFirstMounted(() => {
  console.log('[MainApp] first app mounted');
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');



// V.ajax.requestConfig = config => {
//   console.log(`[main-vue] requestConfig baseURL:   ${V.conf.baseURL}`);
//   console.log(`[main-vue] requestConfig Authorization:   ${V.conf.Authorization}`);
//   config.baseURL = V.conf.baseURL;
//   config.headers["Authorization"] = V.conf.Authorization;
//   return config;
// };

// V.ajax.requestError = err => {
//   return Promise.reject(err);
// };

// // response
// V.ajax.responseRes = response => {
//   const { state, msg } = response.data;
//   alert(msg);
//   if (state !== 0) {
//     // notification.error({
//     //   message: "请求失败",
//     //   description: msg
//     // });
//   }
//   return response.data;
// };

// V.ajax.responseError = err => {
//   return Promise.reject(err);
// };
