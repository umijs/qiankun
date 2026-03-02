import { useEffect, useRef, useCallback } from 'react';
import { loadMicroApp, MicroApp } from 'qiankun';
import { useQiankunStore } from '../store/qiankun';
import Dashboard from './Dashboard';
import { Spin, Result, Button } from 'antd';
import { ReloadOutlined, HomeOutlined } from '@ant-design/icons';

const microAppsConfig: Record<string, { entry: string }> = {
  react: { entry: '//localhost:7100' },
  vue: { entry: '//localhost:7104' },
  purehtml: { entry: '//localhost:7105' },
  vite: { entry: '//localhost:5175' },
};

export default function MicroAppContainer() {
  const { activeApp, setLoading, setError, loading, error, setActiveApp, retryCount, retry } = useQiankunStore();
  const microAppRef = useRef<MicroApp | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeApp || activeApp === 'home') {
      if (microAppRef.current) {
        microAppRef.current.unmount();
        microAppRef.current = null;
      }
      return;
    }

    const config = microAppsConfig[activeApp];
    if (!config) {
      setError(`未找到应用 "${activeApp}" 的配置`);
      return;
    }

    const loadApp = async () => {
      try {
        setLoading(true);
        setError(null);

        if (microAppRef.current) {
          await microAppRef.current.unmount();
          microAppRef.current = null;
        }

        if (!containerRef.current) {
          throw new Error('容器元素不存在');
        }

        microAppRef.current = loadMicroApp({
          name: activeApp,
          entry: config.entry,
          container: containerRef.current,
          props: { globalState: useQiankunStore.getState().globalState },
        });

        await microAppRef.current.mountPromise;
        setLoading(false);
      } catch (err) {
        console.error('加载子应用失败:', err);
        setError(err instanceof Error ? err.message : '加载子应用失败');
        setLoading(false);
      }
    };

    loadApp();

    return () => {
      if (microAppRef.current) {
        microAppRef.current.unmount();
        microAppRef.current = null;
      }
    };
  }, [activeApp, retryCount, setLoading, setError]);

  if (!activeApp || activeApp === 'home') {
    return <Dashboard />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50">
        <Result
          status="error"
          title="加载失败"
          subTitle={error}
          extra={[
            <Button key="retry" type="primary" icon={<ReloadOutlined />} onClick={retry}>
              重试
            </Button>,
            <Button key="home" icon={<HomeOutlined />} onClick={() => setActiveApp(null)}>
              返回首页
            </Button>,
          ]}
        />
      </div>
    );
  }

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm min-h-[calc(100vh-64px)]">
          <div className="text-center">
            <Spin size="large" />
            <p className="mt-4 text-gray-500">正在加载子应用...</p>
          </div>
        </div>
      )}
      <div key={`${activeApp}-${retryCount}`} ref={containerRef} className="w-full" style={{ minHeight: 'calc(100vh - 64px)' }} />
    </div>
  );
}
