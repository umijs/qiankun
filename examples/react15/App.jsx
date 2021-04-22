import React, { version as reactVersion } from 'react';
import { version as antdVersion } from 'antd';

import Logo from './components/Logo'
import HelloModal from './components/HelloModal'

export default class App extends React.Component {
  
  componentDidMount() {
    document.body.innerHTML = "";
  }
  
  render() {
    return (
      <div className="react15-main">
        <Logo />
        <p className="react15-lib">
          React version: {reactVersion}, AntD version: {antdVersion}
        </p>
        <HelloModal />
      </div>
    );
  }
}
