import { useState } from 'react';
import { Layout, Menu, Typography, Space, Tag, type MenuProps } from 'antd';
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

  const items: MenuProps['items'] = microApps.map((app) => ({
    key: app.key,
    icon: app.icon,
    label: (
      <div className="sidebar-item">
        <div className="sidebar-item-title-row">
          <span className="sidebar-item-title">{app.name}</span>
          {app.color && !collapsed && (
            <Tag className="sidebar-item-tag" style={{ backgroundColor: `${app.color}15`, color: app.color }}>
              {{ react: 'React', vue: 'Vue', vite: 'React', purehtml: 'Vanilla' }[app.key] ?? app.key}
            </Tag>
          )}
        </div>
        {!collapsed && <div className="sidebar-item-desc">{app.description}</div>}
      </div>
    ),
  }));

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={260}
      className="bg-white border-r border-gray-200"
      style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'auto' }}
    >
      <div className="h-full flex flex-col">
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
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[activeApp || 'home']}
          onClick={({ key }) => handleMenuClick(String(key))}
          items={items}
          className="sidebar-menu border-0 pt-2 flex-1"
          style={{ background: 'transparent' }}
        />

        {!collapsed && (
          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <Text className="text-xs text-gray-400">统一设计系统</Text>
              <Text className="text-xs text-gray-400">v3 examples</Text>
            </div>
          </div>
        )}
      </div>
    </Sider>
  );
}
