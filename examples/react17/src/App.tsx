import "./App.css";
import { HelloModal, LibVersion } from "./components";
import { RouteExample } from "./routes";
import { Divider } from "antd";

function App() {
  return (
    <div className="app-main">
      <LibVersion />
      <HelloModal />
      <Divider />
      <RouteExample />
    </div>
  );
}

export default App;
