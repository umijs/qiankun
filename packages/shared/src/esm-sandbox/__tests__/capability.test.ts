import { afterEach, describe, expect, it, vi } from 'vitest';
import { QiankunError } from '../../reporter/QiankunError';
import { assertEsmSupport } from '../capability';

function setup() {
  const host = document.implementation.createHTMLDocument();
  const probe = document.implementation.createHTMLDocument();
  const probeWindow = {};
  Object.defineProperty(probe, 'defaultView', { value: probeWindow });
  const frame = host.createElement('iframe');
  Object.defineProperty(frame, 'contentDocument', { value: probe });
  vi.spyOn(host, 'createElement').mockReturnValueOnce(frame);
  let sequence = 0;
  vi.spyOn(URL, 'createObjectURL').mockImplementation(() => `blob:probe-${String(++sequence)}`);
  const revoke = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
  const pending: HTMLScriptElement[] = [];
  const append = probe.head.appendChild.bind(probe.head);
  vi.spyOn(probe.head, 'appendChild').mockImplementation(<T extends Node>(node: T): T => {
    if (node instanceof HTMLScriptElement && node.type === 'module') {
      pending.push(node);
      return node;
    }
    return append(node);
  });
  const modules = () => pending;
  const cleanup = () => {
    expect(frame.isConnected).toBe(false);
    expect(revoke).toHaveBeenCalledTimes(sequence);
    for (const script of modules()) {
      expect(script.onload).toBeNull();
      expect(script.onerror).toBeNull();
    }
  };
  const load = (step: number) => {
    Reflect.set(probeWindow, '__qiankunEsmCapabilityStep__', step);
    modules()[step - 1].dispatchEvent(new Event('load'));
  };
  return { host, probe, frame, modules, cleanup, load };
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('ESM capability detection', () => {
  it('shares one check per document and resolves only after a second map is used after module loading', async () => {
    const world = setup();
    const check = assertEsmSupport(world.host);
    const concurrentCheck = assertEsmSupport(world.host);
    expect(world.host.querySelectorAll('iframe')).toHaveLength(1);
    expect(world.host.querySelectorAll('script[type="importmap"]')).toHaveLength(0);
    expect(world.modules()).toHaveLength(1);
    world.load(1);
    expect(world.probe.querySelectorAll('script[type="importmap"]')).toHaveLength(2);
    expect(world.modules()).toHaveLength(2);
    let resolved = false;
    void check.then(() => {
      resolved = true;
    });
    await Promise.resolve();
    expect(resolved).toBe(false);
    world.load(2);
    await check;
    await concurrentCheck;
    await assertEsmSupport(world.host);
    world.cleanup();
  });

  it.each([1, 2])('reports an unsupported environment when module %i cannot resolve its map', async (step) => {
    const world = setup();
    const check = assertEsmSupport(world.host);
    if (step === 2) world.load(1);
    world.modules()[step - 1].dispatchEvent(new Event('error'));
    await expect(check).rejects.toBeInstanceOf(QiankunError);
    await expect(check).rejects.toMatchObject({ code: 'esm-unsupported' });
    await expect(check).rejects.toThrow('https://www.qiankunjs.com/zh-CN/errors/esm-unsupported');
    world.cleanup();
  });

  it('distinguishes an enforced CSP failure from unsupported import maps', async () => {
    const world = setup();
    const check = assertEsmSupport(world.host);
    world.probe.dispatchEvent(
      Object.assign(new Event('securitypolicyviolation'), {
        disposition: 'enforce',
        effectiveDirective: 'script-src-elem',
      }),
    );
    await expect(check).rejects.toMatchObject({
      code: 'esm-capability-check-failed',
      cause: expect.objectContaining({ message: expect.stringContaining('script-src-elem') }),
    });
    world.cleanup();
  });

  it('ignores report-only CSP violations', async () => {
    const world = setup();
    const check = assertEsmSupport(world.host);
    world.probe.dispatchEvent(
      Object.assign(new Event('securitypolicyviolation'), {
        disposition: 'report',
        effectiveDirective: 'script-src-elem',
      }),
    );
    world.load(1);
    world.load(2);
    await check;
    world.cleanup();
  });

  it('bounds a stalled probe and removes its frame, handlers and blob URLs', async () => {
    vi.useFakeTimers();
    const world = setup();
    const check = assertEsmSupport(world.host);
    const rejection = expect(check).rejects.toMatchObject({ code: 'esm-capability-check-failed' });
    await vi.advanceTimersByTimeAsync(5000);
    await rejection;
    world.cleanup();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('preserves a synchronous setup failure as the cause', async () => {
    const world = setup();
    const cause = new Error('embedding is blocked');
    vi.spyOn(world.host.documentElement, 'appendChild').mockImplementation(() => {
      throw cause;
    });
    await expect(assertEsmSupport(world.host)).rejects.toMatchObject({ code: 'esm-capability-check-failed', cause });
    world.cleanup();
  });

  it('requires evidence of module evaluation even when the browser fires load', async () => {
    const world = setup();
    const check = assertEsmSupport(world.host);
    world.modules()[0].dispatchEvent(new Event('load'));
    await expect(check).rejects.toMatchObject({ code: 'esm-unsupported' });
    world.cleanup();
  });

  it('reuses failed detection but gives each caller an independent error for app annotations', async () => {
    const world = setup();
    const first = assertEsmSupport(world.host).catch((error: unknown) => error);
    const second = assertEsmSupport(world.host).catch((error: unknown) => error);
    world.modules()[0].dispatchEvent(new Event('error'));
    const [firstError, secondError] = await Promise.all([first, second]);
    expect(firstError).toBeInstanceOf(QiankunError);
    expect(secondError).toBeInstanceOf(QiankunError);
    expect(firstError).not.toBe(secondError);
    expect(world.modules()).toHaveLength(1);
    world.cleanup();
  });
});
