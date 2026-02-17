import { useEffect } from 'react';
import { Layout } from 'antd';
import { useQiankunStore } from './store/qiankun';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MicroAppContainer from './components/MicroAppContainer';

const { Content } = Layout;

function App() {
  const { initGlobalState } = useQiankunStore();

  useEffect(() => {
    // Initialize qiankun global state
    initGlobalState({
      user: {
        name: 'Qiankun User',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=qiankun',
      },
      theme: 'light',
    });
  }, [initGlobalState]);

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Sidebar />
      <Layout className="transition-all duration-300">
        <Header />
        <Content className="m-0 p-0 overflow-hidden">
          <MicroAppContainer />
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
