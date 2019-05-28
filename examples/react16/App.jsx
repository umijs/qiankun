/**
 * @author Kuitos
 * @since 2019-05-16
 */

import { Button, Modal, version as antdVersion } from 'antd';
import React, { useState, version } from 'react';

export default function App() {

  const [visible, setVisible] = useState(false);

  return (
    <>
      <div style={{ color: 'green' }}>Hello React</div>
      <Button onClick={() => setVisible(true)}>open antd modal</Button>
      <Modal visible={visible} onOk={() => setVisible(false)} onCancel={() => setVisible(false)}>
        Hello React {version} and antd {antdVersion}
      </Modal>
    </>
  );
}
