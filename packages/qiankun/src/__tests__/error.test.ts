import { describe, expect, it } from 'vitest';
import { QiankunError } from 'qiankun';
import { createSandbox } from '@qiankunjs/sandbox';
import { QiankunError as SharedQiankunError } from '@qiankunjs/shared';

describe('public QiankunError export', () => {
  it('exports the constructor shared by the runtime packages', () => {
    const error = new QiankunError('micro-app failed');

    expect(QiankunError).toBe(SharedQiankunError);
    expect(error).toBeInstanceOf(QiankunError);
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('[qiankun]: micro-app failed');
  });

  it('identifies errors raised by the sandbox through the top-level export', () => {
    expect(() => createSandbox('missing-container', { styleIsolation: true })).toThrow(QiankunError);
  });
});
