import { useState } from 'react';
import { Layout, Menu, Typography, Space, Tag } from 'antd';
import { useQiankunStore } from '../store/qiankun';
import {
  HomeOutlined,
  CodeOutlined,
  NodeIndexOutlined,
  ThunderboltOutlined,
  Html5Outlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;
const { Title, Text } = Typography;

const microApps = [
  { key: 'home', name: '首页', icon: <HomeOutlined />, description: 'Dashboard 概览' },
  { key: 'react', name: 'React', icon: <CodeOutlined />, description: 'React 19 + Vite 8', color: '#61DAFB' },
  { key: 'vue', name: 'Vue', icon: <NodeIndexOutlined />, description: 'Vue 3.5 + Vite 8', color: '#4FC08D' },
  { key: 'purehtml', name: 'Pure HTML', icon: <Html5Outlined />, description: 'Vanilla JS + Modern UI', color: '#E34F26' },
  { key: 'vite', name: 'Vite App', icon: <ThunderboltOutlined />, description: 'React 19 + Vite 8', color: '#646CFF' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { activeApp, setActiveApp } = useQiankunStore();

  const handleMenuClick = (key: string) => {
    setActiveApp(key === 'home' ? null : key);
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={260}
      className="bg-white border-r border-gray-200"
      style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'auto' }}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <Space className={collapsed ? 'hidden' : 'flex'}>
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <ExperimentOutlined className="text-white text-lg" />
          </div>
          <div>
            <Title level={5} className="!m-0 !text-base">Qiankun</Title>
            <Text className="text-xs text-gray-400">Micro-Frontend</Text>
          </div>
        </Space>
        <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
      </div>

      <Menu
        mode="inline"
        selectedKeys={[activeApp || 'home']}
        onClick={({ key }) => handleMenuClick(key)}
        className="border-0 pt-2"
        style={{ background: 'transparent' }}
      >
        {microApps.map((app) => (
          <Menu.Item key={app.key} icon={app.icon} className="!mx-3 !rounded-lg !mb-1 hover:!bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="font-medium">{app.name}</span>
              {app.color && !collapsed && (
                <Tag className="!text-xs !border-0" style={{ backgroundColor: `${app.color}15`, color: app.color }}>
                  {app.key.includes('react') ? 'React' : app.key.includes('vue') ? 'Vue' : app.key.includes('angular') ? 'Angular' : 'Other'}
                </Tag>
              )}
            </div>
            {!collapsed && <div className="text-xs text-gray-400 mt-0.5">{app.description}</div>}
          </Menu.Item>
        ))}
      </Menu>

      {!collapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <Text className="text-xs text-gray-400">统一设计系统</Text>
            <Text className="text-xs text-gray-400">v3 examples</Text>
          </div>
        </div>
      )}
    </Sider>
  );
}
