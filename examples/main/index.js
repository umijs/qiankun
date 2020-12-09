import 'whatwg-fetch';
import 'custom-event-polyfill';
// import 'core-js/proposals/global-this'
// import 'core-js/stable/global-this';
import 'core-js/stable/promise';
import 'core-js/stable/symbol';
import 'core-js/stable/string/starts-with';
import 'core-js/web/url';
import 'core-js/stable/object/assign'
import 'core-js/stable/string/includes'
import 'core-js/stable/array/includes'

import { registerMicroApps, runAfterFirstMounted, setDefaultMountApp, start, initGlobalState } from '../../es';
import './index.less';

// for angular subapp
import 'zone.js';

/**
 * 主应用 **可以使用任意技术栈**
 * 以下分别是 React 和 Vue 的示例，可切换尝试
 */
import render from './render/ReactRender';
// import render from './render/VueRender'

/**
 * Step1 初始化应用（可选）
 */
render({ loading: true });

const loader = loading => render({ loading });

/**
 * Step2 注册子应用
 */

registerMicroApps(
  [
    // {
    //   name: 'react16',
    //   entry: '//localhost:7100',
    //   container: '#subapp-viewport',
    //   loader,
    //   activeRule: '/react16',
    // },
    // {
    //   name: 'react15',
    //   entry: '//localhost:7102',
    //   container: '#subapp-viewport',
    //   loader,
    //   activeRule: '/react15',
    // },
    // {
    //   name: 'vue',
    //   entry: '//localhost:7101',
    //   container: '#subapp-viewport',
    //   loader,
    //   activeRule: '/vue',
    // },
    // {
    //   name: 'angular9',
    //   entry: '//localhost:7103',
    //   container: '#subapp-viewport',
    //   loader,
    //   activeRule: '/angular9',
    // },
    // {
    //   name: 'purehtml',
    //   entry: '//localhost:7104',
    //   container: '#subapp-viewport',
    //   loader,
    //   activeRule: '/purehtml',
    // },
    {
      name: 'child-app-2',
      entry: '//localhost:7102',
      container: '#subapp-viewport',
      loader,
      activeRule: '/child-app-2',
    },
    {
      name: 'child-app-1',
      entry: '//localhost:7101',
      container: '#subapp-viewport',
      loader,
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

/**
 * Step3 设置默认进入的子应用
 */
// setDefaultMountApp('/react16');

/**
 * Step4 启动应用
 */
start({
  excludeAssetFilter: (url)=>{
    console.log(66666666666, url);
    return false;
  }
});

runAfterFirstMounted(() => {
  console.log('[MainApp] first app mounted');
});
