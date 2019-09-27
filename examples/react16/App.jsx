/**
 * @author Kuitos
 * @since 2019-05-16
 */

import { Button, Modal, version as antdVersion } from 'antd';
import React, { useState, version } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


function RouteExample() {
  return (
    <>
      <h2>Route Example</h2>
      <ul>
        <li>
          <Link to="/react">React</Link>
        </li>
        <li>
          <Link to="/react/route_example">Route example</Link>
        </li>
      </ul>
    </>
  );
}

function App() {

  const [visible, setVisible] = useState(false);

  return (
    <>
      <div style={{ color: 'green' }}>Hello React</div>
      <div>
        <div>Try react route</div>
        <ul>
          <li>
            <Link to="/react">React</Link>
          </li>
          <li>
            <Link to="/react/route_example">Route example</Link>
          </li>
        </ul>
      </div>

      <Button onClick={() => setVisible(true)}>open antd modal</Button>
      <Modal visible={visible} onOk={() => setVisible(false)} onCancel={() => setVisible(false)}>
        Hello React {version} and antd {antdVersion}
      </Modal>
    </>
  );
}

export default function AppRouter() {
  return (
    <Router>
      <Route path="/react" exact component={App} />
      <Route path="/react/route_example" component={RouteExample} />
    </Router>
  );
}
