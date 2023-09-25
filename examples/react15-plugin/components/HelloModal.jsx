import React from 'react';
import { Button, Modal } from 'antd';

export default class HelloModal extends React.Component {

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
        <Button onClick={() => this.setVisible(true)}>
          CLICK ME
        </Button>
        <Modal
          visible={visible}
          closable={false}
          onOk={() => this.setVisible(false)}
          onCancel={() => this.setVisible(false)}
          title="Install"
        >
          <code>$ yarn add qiankun  # or npm i qiankun -S</code>
        </Modal>
      </div>
    );
  }
}
