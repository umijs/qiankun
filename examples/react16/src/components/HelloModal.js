import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'antd';

const dispatchUIEvent = () => {
  const $a = document.createElement('a');
  $a.onclick = () => {
    console.log('log from UIEvent');
  };
  const evt = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: false,
  });
  $a.dispatchEvent(evt);
};

export default function() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    dispatchUIEvent();
  }, []);
  return (
    <>
      <Button onClick={() => setVisible(true)}>CLICK ME</Button>
      <Modal visible={visible} onOk={() => setVisible(false)} onCancel={() => setVisible(false)} title="qiankun">
        Probably the most complete micro-frontends solution you ever met
      </Modal>
    </>
  );
}
