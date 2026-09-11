import { describe, expect, it } from 'vitest';
import { QiankunError } from 'qiankun';
import { loadEntry } from '@qiankunjs/loader';
import { createSandbox } from '@qiankunjs/sandbox';
import { QiankunError as SharedQiankunError } from '@qiankunjs/shared';

describe('public QiankunError export', () => {
  it('exports the constructor shared by the runtime packages', () => {
    const error = new QiankunError('micro-app failed');

    expect(QiankunError).toBe(SharedQiankunError);
    expect(error).toBeInstanceOf(QiankunError);
    expect(error).toBeInstanceOf(Error);
    expect(error.code).toBe('custom-error');
    expect(error.message).toBe('[qiankun]: micro-app failed\nSee https://www.qiankunjs.com/zh-CN/errors/custom-error');
  });

  it('identifies errors raised by the sandbox through the top-level export', () => {
    expect(() => createSandbox('missing-container', { styleIsolation: true })).toThrow(QiankunError);
  });

  it('identifies a loader failure with its stable code and solution link', async () => {
    const loading = loadEntry(
      { url: 'https://app.example/', res: new Response(null, { status: 204 }) },
      document.createElement('div'),
      { fetch: window.fetch },
    );

    await expect(loading).rejects.toBeInstanceOf(QiankunError);
    await expect(loading).rejects.toMatchObject({
      code: 'entry-body-missing',
      message: expect.stringContaining('See https://www.qiankunjs.com/zh-CN/errors/entry-body-missing'),
    });
  });
});
