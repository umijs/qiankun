import { Suspense } from "react";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import { Divider, Spin } from "antd";
import { About, Home } from "../pages";
import { LoadingOutlined } from "@ant-design/icons";

export const RouteExample = () => {
  const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;
  return (
    // @ts-ignore
    <Router basename={window.__POWERED_BY_QIANKUN__ ? "/react17" : "/"}>
      <nav>
        <Link to="/">Home</Link>
        <Divider type="vertical" />
        <Link to="/about">About</Link>
      </nav>
      <Suspense fallback={<Spin indicator={antIcon} />}>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/about" component={About} />
        </Switch>
      </Suspense>
    </Router>
  );
};
