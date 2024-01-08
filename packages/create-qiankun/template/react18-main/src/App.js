import "./App.css";
import subApplication from "./microApp/subs.json";
import { useState, useCallback } from "react";
import { Menu } from "antd";
import { MicroApp } from "@qiankunjs/react";
import { useNavigate } from "react-router-dom";

const menuItems = subApplication.map(({ name }) => ({
  key: name,
  label: name,
}));

function App() {
  const [curRenderMicroApp, setApp] = useState(null);
  const navigate = useNavigate();

  const changeRouterAndLoadApp = useCallback(({ key }) => {
    const app = subApplication.find((item) => item.name === key);
    if (!app || curRenderMicroApp?.name === app.name) return;

    setApp({
      name: app.name,
      entry: app.entry,
    });

    navigate(app.activeRule);
  }, []);

  return (
    <div className="app">
      <div className="main-app-title">QianKun</div>
      <div className="main-app-menu">
        <Menu
          mode="inline"
          onSelect={changeRouterAndLoadApp}
          style={{ width: "100%", height: "100%" }}
          items={menuItems}
        />
      </div>
      <div id="subapp-container">
        {curRenderMicroApp && (
          <MicroApp
            name={curRenderMicroApp.name}
            entry={curRenderMicroApp.entry}
          ></MicroApp>
        )}
      </div>
    </div>
  );
}

export default App;
