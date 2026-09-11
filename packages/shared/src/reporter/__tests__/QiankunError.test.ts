import { describe, expect, it } from 'vitest';
import { QiankunError } from '../QiankunError';

describe('QiankunError', () => {
  it('keeps the original diagnostic context and appends a stable solution URL', () => {
    const error = new QiankunError('Entry https://app.example/ failed\nOriginal detail', 'entry-script-failed');

    expect(error).toBeInstanceOf(Error);
    expect(error.code).toBe('entry-script-failed');
    expect(error.message).toBe(
      '[qiankun]: Entry https://app.example/ failed\nOriginal detail\nSee https://www.qiankunjs.com/zh-CN/errors/entry-script-failed',
    );
    expect(error.stack).toContain(error.message);
  });

  it('preserves message-only construction with a documented fallback code', () => {
    const error = new QiankunError('Caller-provided detail');

    expect(error.code).toBe('custom-error');
    expect(error.message).toBe(
      '[qiankun]: Caller-provided detail\nSee https://www.qiankunjs.com/zh-CN/errors/custom-error',
    );
  });
});
