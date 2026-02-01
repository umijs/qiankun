/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { addGlobalUncaughtErrorHandler, removeGlobalUncaughtErrorHandler } from '../errorHandler';

describe('errorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('addGlobalUncaughtErrorHandler', () => {
    it('should add error event listener', () => {
      const handler = vi.fn();
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');

      addGlobalUncaughtErrorHandler(handler);

      expect(addEventListenerSpy).toHaveBeenCalledWith('error', handler);
      expect(addEventListenerSpy).toHaveBeenCalledWith('unhandledrejection', expect.any(Function));
    });

    it('should handle error events', () => {
      const handler = vi.fn();

      addGlobalUncaughtErrorHandler(handler);

      // Dispatch an error event
      const errorEvent = new ErrorEvent('error', { message: 'Test error' });
      window.dispatchEvent(errorEvent);

      expect(handler).toHaveBeenCalled();
    });
  });

  describe('removeGlobalUncaughtErrorHandler', () => {
    it('should remove error event listener', () => {
      const handler = vi.fn();
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

      addGlobalUncaughtErrorHandler(handler);
      removeGlobalUncaughtErrorHandler(handler);

      expect(removeEventListenerSpy).toHaveBeenCalledWith('error', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('unhandledrejection', expect.any(Function));
    });

    it('should not handle events after removal', () => {
      const handler = vi.fn();

      addGlobalUncaughtErrorHandler(handler);
      removeGlobalUncaughtErrorHandler(handler);

      // Dispatch an error event
      const errorEvent = new ErrorEvent('error', { message: 'Test error' });
      window.dispatchEvent(errorEvent);

      expect(handler).not.toHaveBeenCalled();
    });
  });
});
