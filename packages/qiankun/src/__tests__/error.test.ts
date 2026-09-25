import { describe, expect, it } from 'vitest';
import { LoadAppTimeoutError, QiankunError, start } from 'qiankun';
import { loadEntry } from '@qiankunjs/loader';
import { createSandbox } from '@qiankunjs/sandbox';
import { QiankunError as SharedQiankunError } from '@qiankunjs/shared';
import { validateLoadingTimeout } from '../core/configuration';

describe('public QiankunError export', () => {
  it('exports the constructor shared by the runtime packages', () => {
    const error = new SharedQiankunError('micro-app failed', 'lifecycle-missing');

    expect(QiankunError).toBe(SharedQiankunError);
    expect(error).toBeInstanceOf(QiankunError);
    expect(error).toBeInstanceOf(Error);
    expect(error.code).toBe('lifecycle-missing');
  });

  it('identifies errors raised by the sandbox through the top-level export', () => {
    expect(() => createSandbox('missing-container', { styleIsolation: true })).toThrow(QiankunError);
  });

  it('identifies a loader failure with its stable code', async () => {
    const loading = loadEntry(
      { url: 'https://app.example/', res: new Response(null, { status: 204 }) },
      document.createElement('div'),
      { fetch: window.fetch },
    );

    await expect(loading).rejects.toBeInstanceOf(QiankunError);
    await expect(loading).rejects.toHaveProperty('code', 'entry-body-missing');
  });

  it('identifies a loading timeout by its subclass, shared constructor, and stable code', () => {
    const error = new LoadAppTimeoutError('timeout-app', 100, 102.4);

    expect(error).toBeInstanceOf(LoadAppTimeoutError);
    expect(error).toBeInstanceOf(QiankunError);
    expect(error.name).toBe('LoadAppTimeoutError');
    expect(error.code).toBe('load-timeout');
    expect(error.message).toContain('See https://www.qiankunjs.com/zh-CN/errors/load-timeout');
    expect([error.appName, error.timeout, error.elapsed]).toEqual(['timeout-app', 100, 102.4]);
  });

  it.each([-1, Number.NaN, Number.POSITIVE_INFINITY])(
    'reports an invalid timeout %s with its stable code',
    (timeout) => {
      expect(() => validateLoadingTimeout(timeout)).toThrow(
        expect.objectContaining({
          code: 'timeout-invalid',
          message: expect.stringContaining('errors/timeout-invalid'),
        }),
      );
      expect(() => start({ timeout })).toThrow(QiankunError);
    },
  );
});
