import { registerMicroApps, start } from 'qiankun';
import { microApps } from './apps';

let registered = false;

/**
 * Route-based registration: every app runs with the JS sandbox and runtime style
 * isolation (@scope) explicitly enabled — the shell's whole point is to show them working.
 */
export function registerAll(container: HTMLElement, onLoading: (name: string, loading: boolean) => void): void {
  if (registered) return;
  registered = true;

  registerMicroApps(
    microApps.map((app) => ({
      name: app.name,
      entry: app.entry,
      container,
      activeRule: app.path,
      loader: (loading: boolean) => onLoading(app.name, loading),
      configuration: {
        sandbox: true,
        styleIsolation: true,
      },
    })),
  );

  start();
}
