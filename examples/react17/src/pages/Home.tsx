import { Alert } from "antd";

export const Home = () => {
  return (
    <Alert
      style={{ marginTop: "16px" }}
      message="Informational Notes"
      description="You are on the home page."
      type="info"
      showIcon
      closable
    />
  );
};
