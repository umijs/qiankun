import { useEffect, useState } from 'react';
import { Layout } from 'antd';
import { useQiankunStore } from './store/qiankun';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MicroAppContainer from './components/MicroAppContainer';

const { Content } = Layout;
const APP_KEYS = ['react', 'vue', 'purehtml', 'vite'] as const;
const APP_KEY_SET = new Set<string>(APP_KEYS);

function normalizePath(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }

  return pathname || '/';
}

function resolveAppByPath(pathname: string): string | null {
  const normalizedPath = normalizePath(pathname);

  if (normalizedPath === '/' || normalizedPath === '/home') {
    return null;
  }

  const pathWithoutLeadingSlash = normalizedPath.startsWith('/') ? normalizedPath.slice(1) : normalizedPath;
  const appKey = pathWithoutLeadingSlash.split('/')[0] || '';

  if (appKey === 'home') {
    return null;
  }

  return APP_KEY_SET.has(appKey) ? appKey : null;
}

function App() {
  const { initGlobalState, activeApp, setActiveApp } = useQiankunStore();
  const [isPathInitialized, setIsPathInitialized] = useState(false);

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

  useEffect(() => {
    const syncAppFromPath = () => {
      const appFromPath = resolveAppByPath(window.location.pathname);
      setActiveApp(appFromPath);
      setIsPathInitialized(true);
    };

    syncAppFromPath();
    window.addEventListener('popstate', syncAppFromPath);

    return () => {
      window.removeEventListener('popstate', syncAppFromPath);
    };
  }, [setActiveApp]);

  useEffect(() => {
    if (!isPathInitialized) {
      return;
    }

    const currentPath = normalizePath(window.location.pathname);
    const appFromCurrentPath = resolveAppByPath(currentPath);

    if (activeApp && activeApp === appFromCurrentPath && currentPath !== `/${activeApp}`) {
      return;
    }

    const targetPath = activeApp ? `/${activeApp}` : '/';

    if (targetPath === currentPath) {
      return;
    }

    window.history.pushState({ activeApp }, '', targetPath);
  }, [activeApp, isPathInitialized]);

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
