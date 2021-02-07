import { useState } from "react";
import { Button, Modal, Popover } from "antd";

export const HelloModal = () => {
  const [isVisible, setVisible] = useState<boolean>(false);
  return (
    <>
      <Popover content="https://qiankun.umijs.org/" title="qiankun">
        <Button onClick={() => setVisible(true)}>CLICK ME</Button>
      </Popover>
      <Modal
        visible={isVisible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        title="qiankun"
      >
        Probably the most complete micro-frontends solution you ever met
      </Modal>
    </>
  );
};
