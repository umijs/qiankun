import { Layout, Button, Avatar, Space, Typography, theme } from 'antd';
import { GithubOutlined, FullscreenOutlined, FullscreenExitOutlined, UserOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useQiankunStore } from '../store/qiankun';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

export default function Header() {
  const { globalState } = useQiankunStore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { token } = theme.useToken();

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <AntHeader
      style={{
        background: token.colorBgContainer,
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        zIndex: 100,
      }}
    >
      <div className="flex items-center gap-4">
        <div className="hidden md:block">
          <Text strong>Qiankun 微前端控制台</Text>
          <div>
            <Text type="secondary">统一现代化主应用 · 实时加载多技术栈子应用</Text>
          </div>
        </div>
      </div>

      <Space size="middle">
        <Button
          type="text"
          icon={<GithubOutlined />}
          className="text-gray-500 hover:text-blue-500"
          onClick={() => window.open('https://github.com/umijs/qiankun', '_blank')}
        />

        <Button
          type="text"
          icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
          className="text-gray-500 hover:text-blue-500"
          onClick={toggleFullscreen}
        />

        <Space className="px-2 py-1 rounded-lg bg-slate-50">
          <Avatar src={globalState.user?.avatar} icon={<UserOutlined />} size="small" />
          <span className="text-sm text-gray-700 hidden md:inline">{globalState.user?.name || 'User'}</span>
        </Space>
      </Space>
    </AntHeader>
  );
}
