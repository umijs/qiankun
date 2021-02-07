import { version as reactVersion } from "react";
import { version as antdVersion } from "antd";
import { logo } from "../images";

export const LibVersion = () => {
  return (
    <>
      <img style={{ width: "128px" }} src={logo} alt="react17" />
      <h1 className="app-title">React 17 Demo</h1>
      <p className="app-lib">
        React version: {reactVersion}, AntD version: {antdVersion}
      </p>
      <p className="app-lib">$ yarn add qiankun # or npm i qiankun -S</p>
    </>
  );
};
