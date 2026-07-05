import { useEffect, useRef, useState } from 'react';
import { appByPath } from './apps';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import Stage from './components/Stage';
import { registerAll } from './register';
import { usePathname } from './router';

export default function App() {
  const pathname = usePathname();
  const activeApp = appByPath(pathname);
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadingApps, setLoadingApps] = useState<Record<string, boolean>>({});

  // register once the stage container exists in the DOM; registerAll self-guards,
  // so StrictMode's double effect is harmless
  useEffect(() => {
    if (containerRef.current) {
      registerAll(containerRef.current, (name, loading) => {
        setLoadingApps((prev) => (prev[name] === loading ? prev : { ...prev, [name]: loading }));
      });
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-paper text-ink">
      <Sidebar activePath={pathname} />
      <main className="min-w-0 flex-1 px-10 py-8">
        {!activeApp && <Dashboard />}
        {/* the stage (and its container) stays mounted forever — qiankun holds the element
            captured at registration, so this subtree must never be keyed or unmounted */}
        <div className={activeApp ? 'stage-lift' : ''}>
          <Stage app={activeApp} loading={activeApp ? !!loadingApps[activeApp.name] : false} containerRef={containerRef} />
        </div>
      </main>
    </div>
  );
}
