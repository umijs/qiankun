/**
 * @author Kuitos
 * @since 2020-02-21
 */

export { addErrorHandler, removeErrorHandler } from 'single-spa';

export function addGlobalUncaughtErrorHandler(errorHandler: (...args: any[]) => any): void {
  const rawOnError = window.onerror;
  // eslint-disable-next-line no-param-reassign
  (errorHandler as any).rawOnError = rawOnError;
  window.onerror = (...args: Parameters<OnErrorEventHandlerNonNull>) => {
    if (rawOnError) {
      rawOnError.apply(window, args);
    }

    if (errorHandler) {
      return errorHandler.apply(window, args);
    }

    return null;
  };

  window.addEventListener('error', errorHandler);
  window.addEventListener('unhandledrejection', errorHandler);
}

export function removeGlobalUncaughtErrorHandler(errorHandler: (...args: any[]) => any) {
  window.removeEventListener('error', errorHandler);
  window.removeEventListener('unhandledrejection', errorHandler);
}
