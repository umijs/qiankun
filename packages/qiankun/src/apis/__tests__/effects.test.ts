/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock single-spa before importing effects
vi.mock('single-spa', () => ({
  getMountedApps: vi.fn(() => []),
  navigateToUrl: vi.fn(),
}));

import { setDefaultMountApp, runAfterFirstMounted } from '../effects';
import { getMountedApps, navigateToUrl } from 'single-spa';

describe('setDefaultMountApp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should navigate to default app when no apps are mounted', () => {
    (getMountedApps as ReturnType<typeof vi.fn>).mockReturnValue([]);

    setDefaultMountApp('/app1');

    // Dispatch the single-spa:no-app-change event
    window.dispatchEvent(new CustomEvent('single-spa:no-app-change'));

    expect(navigateToUrl).toHaveBeenCalledWith('/app1');
  });

  it('should not navigate when apps are already mounted', () => {
    (getMountedApps as ReturnType<typeof vi.fn>).mockReturnValue(['existingApp']);

    setDefaultMountApp('/app1');

    // Dispatch the single-spa:no-app-change event
    window.dispatchEvent(new CustomEvent('single-spa:no-app-change'));

    expect(navigateToUrl).not.toHaveBeenCalled();
  });

  it('should only listen once', () => {
    (getMountedApps as ReturnType<typeof vi.fn>).mockReturnValue([]);

    setDefaultMountApp('/app1');

    // Dispatch twice
    window.dispatchEvent(new CustomEvent('single-spa:no-app-change'));
    window.dispatchEvent(new CustomEvent('single-spa:no-app-change'));

    // Should only navigate once
    expect(navigateToUrl).toHaveBeenCalledTimes(1);
  });
});

describe('runAfterFirstMounted', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should run effect after first mount event', () => {
    const effect = vi.fn();

    runAfterFirstMounted(effect);

    // Effect should not be called yet
    expect(effect).not.toHaveBeenCalled();

    // Dispatch the single-spa:first-mount event
    window.dispatchEvent(new CustomEvent('single-spa:first-mount'));

    expect(effect).toHaveBeenCalledTimes(1);
  });

  it('should only run effect once', () => {
    const effect = vi.fn();

    runAfterFirstMounted(effect);

    // Dispatch twice
    window.dispatchEvent(new CustomEvent('single-spa:first-mount'));
    window.dispatchEvent(new CustomEvent('single-spa:first-mount'));

    // Effect should only be called once
    expect(effect).toHaveBeenCalledTimes(1);
  });
});
