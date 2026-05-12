import { Row, Col, Card, Statistic, Typography, Tag, Space, Button } from 'antd';
import {
  AppstoreOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  GlobalOutlined,
  RocketOutlined,
  CodeOutlined,
  BranchesOutlined,
} from '@ant-design/icons';
import { useQiankunStore } from '../store/qiankun';

const { Title, Text, Paragraph } = Typography;

const microApps = [
  { key: 'react', name: 'React', icon: '⚛️', color: '#61DAFB', status: 'active' },
  { key: 'vue', name: 'Vue', icon: '💚', color: '#4FC08D', status: 'active' },
  { key: 'purehtml', name: 'Pure HTML', icon: '🌐', color: '#E34F26', status: 'active' },
  { key: 'vite', name: 'Vite App', icon: '⚡', color: '#646CFF', status: 'active' },
];

const features = [
  { icon: <ThunderboltOutlined />, title: '极速加载', desc: '基于 Qiankun 的微前端架构，实现秒级应用切换' },
  { icon: <SafetyOutlined />, title: '沙箱隔离', desc: '完善的 JS/CSS 沙箱机制，确保应用间互不干扰' },
  { icon: <GlobalOutlined />, title: '技术栈无关', desc: '支持 React、Vue 等多种前端框架' },
  { icon: <AppstoreOutlined />, title: '状态共享', desc: '内置全局状态管理，实现跨应用数据通信' },
];

export default function Dashboard() {
  const { setActiveApp } = useQiankunStore();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
            <RocketOutlined className="text-white text-2xl" />
          </div>
          <div>
            <Title level={2} className="!mb-0 !text-2xl">欢迎使用 Qiankun</Title>
            <Text type="secondary">下一代微前端解决方案演示平台</Text>
          </div>
        </div>

        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} md={16}>
              <Paragraph className="!mb-4 text-gray-600">
                本示例基于 qiankun v3 与最新前端工具链，展示 React/Vue/Vanilla 子应用在统一主应用中的一致体验与稳定挂载。
              </Paragraph>
              <Space>
                <Button type="primary" size="large" icon={<CodeOutlined />} onClick={() => setActiveApp('react')}>
                  开始体验
                </Button>
                <Button size="large" icon={<BranchesOutlined />} onClick={() => window.open('https://qiankun.umijs.org/', '_blank')}>
                  查看文档
                </Button>
              </Space>
            </Col>
            <Col xs={24} md={8} className="hidden md:block">
              <div className="text-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  4
                </div>
                <div className="text-gray-500 mt-2">可切换子应用</div>
              </div>
            </Col>
          </Row>
        </Card>
      </div>

      <Row gutter={[16, 16]} className="mb-8">
        {[
          { title: '已接入应用', value: 4, suffix: '个', color: '#0ea5e9' },
          { title: '支持框架', value: 3, suffix: '种', color: '#10b981' },
          { title: '在线用户', value: 128, suffix: '人', color: '#f59e0b' },
          { title: '系统运行', value: 99.9, suffix: '%', color: '#8b5cf6' },
        ].map((stat, index) => (
          <Col xs={12} md={6} key={index}>
            <Card hoverable className="text-center">
              <Statistic
                title={stat.title}
                value={stat.value}
                suffix={stat.suffix}
                styles={{ content: { color: stat.color } }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Card title={<div className="flex items-center justify-between"><span>子应用列表</span><Button type="link">查看全部</Button></div>} className="mb-8">
        <Row gutter={[16, 16]}>
          {microApps.map((app) => (
            <Col xs={12} sm={8} md={6} key={app.name}>
              <Card
                hoverable
                className="text-center transition-all duration-300 hover:shadow-md"
                styles={{ body: { padding: '20px' } }}
                onClick={() => setActiveApp(app.key)}
              >
                <div className="text-3xl mb-2">{app.icon}</div>
                <div className="font-medium text-gray-900 mb-1">{app.name}</div>
                <Tag color={app.status === 'active' ? 'success' : 'default'}>
                  {app.status === 'active' ? '运行中' : '即将上线'}
                </Tag>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        {features.map((feature, index) => (
          <Col xs={24} sm={12} md={6} key={index}>
            <Card className="h-full hover:shadow-md transition-shadow">
              <div className="text-blue-500 text-2xl mb-3">{feature.icon}</div>
              <div className="font-medium text-gray-900 mb-2">{feature.title}</div>
              <div className="text-sm text-gray-500">{feature.desc}</div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
