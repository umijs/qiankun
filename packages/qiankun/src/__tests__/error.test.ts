import { describe, expect, it } from 'vitest';
import { LoadAppTimeoutError, QiankunError } from 'qiankun';
import { loadEntry } from '@qiankunjs/loader';
import { createSandbox } from '@qiankunjs/sandbox';
import { QiankunError as SharedQiankunError } from '@qiankunjs/shared';

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
    expect([error.appName, error.loadTimeout, error.elapsed]).toEqual(['timeout-app', 100, 102.4]);
  });
});
