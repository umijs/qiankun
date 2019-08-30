/**
 * @author Kuitos
 * @since 2019-05-16
 */

import { Button, Modal, version as antdVersion } from 'antd';
import React, { useState, version, useEffect } from 'react';

export default function App() {

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const cssCode = '.react16-style { border: solid 1px #000 }'
    const styleElement = document.createElement('style');

    styleElement.type = 'text/css';
    if (styleElement.styleSheet) {
      styleElement.styleSheet.cssText = cssCode;
    } else {
      styleElement.appendChild(document.createTextNode(cssCode));
    }
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(styleElement);
  }, []);

  return (
    <>
      <div className='react16-style' style={{ color: 'green' }}>Hello React</div>
      <Button onClick={() => setVisible(true)}>open antd modal</Button>
      <Modal visible={visible} onOk={() => setVisible(false)} onCancel={() => setVisible(false)}>
        Hello React {version} and antd {antdVersion}
      </Modal>
    </>
  );
}
