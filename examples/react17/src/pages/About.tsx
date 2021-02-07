import { Alert } from "antd";

export const About = () => {
  return (
    <Alert
      style={{ marginTop: "16px" }}
      message="Success !"
      description="You has been redirected to About page."
      type="success"
      showIcon
      closable
    />
  );
};
