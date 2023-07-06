import React, { version as reactVersion } from 'react';
import { version as antdVersion } from 'antd';

import Logo from './components/Logo';
import HelloModal from './components/HelloModal';

export default class App extends React.Component {
  componentDidMount() {
    console.log('render during', Date.now() - (window.startTime || performance.timing.navigationStart));
  }

  render() {
    return (
      <div className="react15-main">
        <Logo />
        <p className="react15-lib">
          React version: {reactVersion}, antd version: {antdVersion}
        </p>
        <HelloModal />
      </div>
    );
  }
}
