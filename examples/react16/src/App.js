import { Button, Modal, version as antdVersion } from 'antd';
import 'antd/dist/antd.min.css';
import React, { lazy, Suspense, useState, version } from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import './App.css';

const User = lazy(() => import('./User'));

function App() {
  const [visible, setVisible] = useState(false);

  return (
    <Router basename={window.__POWERED_BY_QIANKUN__ ? '/react' : '/'}>
      <div className="App">
        <header className="App-header">
          <div style={{ color: 'green' }}>Hello React</div>
          <Button onClick={() => setVisible(true)}>open antd modal</Button>
          <Modal visible={visible} onOk={() => setVisible(false)} onCancel={() => setVisible(false)}>
            Hello React {version} and antd {antdVersion}
          </Modal>
        </header>

        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/users">Users</Link>
            </li>
          </ul>
        </nav>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route path="/about" component={About} />
            <Route path="/users" component={User} />
            <Route path="/" component={Home} />
          </Switch>
        </Suspense>
      </div>
    </Router>
  );
}

function Home() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

export default App;
