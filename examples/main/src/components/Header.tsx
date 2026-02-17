import { Layout, Button, Badge, Avatar, Dropdown, Space, Typography, Tooltip, theme } from 'antd';
import {
  BellOutlined,
  GithubOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  GlobalOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
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

  const userMenuItems = [
    { key: 'profile', icon: <UserOutlined />, label: '个人中心' },
    { key: 'settings', icon: <SettingOutlined />, label: '系统设置' },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', danger: true },
  ];

  const notificationItems = [
    {
      key: '1',
      label: (
        <div>
          <div className="font-medium">React 16 应用已加载</div>
          <div className="text-xs text-gray-400">2 分钟前</div>
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div>
          <div className="font-medium">Vue 3 应用加载失败</div>
          <div className="text-xs text-gray-400">5 分钟前</div>
        </div>
      ),
    },
  ];

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
        <Text className="text-gray-500 hidden md:inline">欢迎使用 Qiankun 微前端演示平台</Text>
      </div>

      <Space size="middle">
        <Tooltip title="切换语言">
          <Button type="text" icon={<GlobalOutlined />} className="text-gray-500 hover:text-blue-500">
            中文
          </Button>
        </Tooltip>

        <Tooltip title="GitHub">
          <Button
            type="text"
            icon={<GithubOutlined />}
            className="text-gray-500 hover:text-blue-500"
            onClick={() => window.open('https://github.com/umijs/qiankun', '_blank')}
          />
        </Tooltip>

        <Tooltip title={isFullscreen ? '退出全屏' : '全屏'}>
          <Button
            type="text"
            icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
            className="text-gray-500 hover:text-blue-500"
            onClick={toggleFullscreen}
          />
        </Tooltip>

        <Dropdown menu={{ items: notificationItems }} placement="bottomRight">
          <Badge count={2} size="small">
            <Button type="text" icon={<BellOutlined />} className="text-gray-500 hover:text-blue-500" />
          </Badge>
        </Dropdown>

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Space className="cursor-pointer hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors">
            <Avatar src={globalState.user?.avatar} icon={<UserOutlined />} size="small" />
            <span className="text-sm text-gray-700 hidden md:inline">{globalState.user?.name || 'User'}</span>
          </Space>
        </Dropdown>
      </Space>
    </AntHeader>
  );
}
