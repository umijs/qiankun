/**
 * @author 有知 <youzhi.lk@antfin.com>
 * @since 2019-05-16
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { registerMicroApps, start } from '../../esm/index';
import Framework from './Framework';

registerMicroApps(
  [
    { name: 'react app', entry: '//localhost:7100', routerPrefix: '/react' },
    { name: 'vue app', entry: '//localhost:7101', routerPrefix: '/vue' },
  ],
  {
    renderFunction({ appContent, loading }) {
      const container = document.getElementById('container');
      ReactDOM.render(<Framework loading={loading} content={appContent}/>, container);
    },
    activeRule(app) {
      return location.pathname.startsWith(app.routerPrefix);
    },
  });

start({});
