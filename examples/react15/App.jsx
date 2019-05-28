/**
 * @author Kuitos
 * @since 2019-05-16
 */

import { Button, Modal, version as antdVersion } from 'antd';
import React, { version } from 'react';

export default class App extends React.Component {

  constructor() {
    super();
    this.state = {
      visible: false,
    };

    this.setVisible = visible => this.setState({ visible });
  }

  render() {

    const { visible } = this.state;

    return (
      <div>
        <div style={{ color: 'green' }}>Hello React15</div>
        <Button onClick={() => this.setVisible(true)}>open antd modal</Button>
        <Modal visible={visible} onCancel={() => this.setVisible(false)} onOk={() => this.setVisible(false)}>
          Hello React {version} and antd {antdVersion}
        </Modal>
      </div>
    );
  }
}
