import { appByPath } from './apps';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import Stage from './components/Stage';
import { usePathname } from './router';

export default function App() {
  const pathname = usePathname();
  const activeApp = appByPath(pathname);

  return (
    <div className="flex min-h-screen bg-paper text-ink">
      <Sidebar activePath={pathname} />
      {/* the route picks the app, <MicroApp /> does the mounting — leaving the stage means
          unmounting it, which is exactly the lifecycle we want on display */}
      <main className="min-w-0 flex-1 px-10 py-8">
        {activeApp ? <Stage app={activeApp} /> : <Dashboard />}
      </main>
    </div>
  );
}
