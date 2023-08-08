import React, { version as reactVersion } from 'react';
import { version as antdVersion } from 'antd';

import Logo from './components/Logo';
import HelloModal from './components/HelloModal';

export default class App extends React.Component {
  componentDidMount() {
    const now = Date.now();
    const during = now - (window.startTime || performance.timing.navigationStart);
    const mount = now - window.evalStart;
    console.log('render during', during);
    this.setState({ during, mount });
  }

  render() {
    const { during, mount } = this.state || {};

    return (
      <div className="react15-main">
        <Logo />
        {during ? (
          <b>
            qiankun rendering cost {during} ms {window.useRuntimeDeps ? 'with' : 'without'} runtime deps reused
          </b>
        ) : null}
        <b>app self rendering cost {mount} ms</b>
        <p className="react15-lib">
          React version: {reactVersion}, antd version: {antdVersion}
        </p>
        <HelloModal />
      </div>
    );
  }
}
