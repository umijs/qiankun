/**
 * @author Kuitos
 * @since 2020-02-21
 */

// Re-export single-spa error handlers
export { addErrorHandler, removeErrorHandler } from 'single-spa';

/**
 * Add a global uncaught error handler
 * @param errorHandler - The error handler function
 */
export function addGlobalUncaughtErrorHandler(errorHandler: OnErrorEventHandlerNonNull): void {
  window.addEventListener('error', errorHandler);
  window.addEventListener('unhandledrejection', errorHandler as EventListener);
}

/**
 * Remove a global uncaught error handler
 * @param errorHandler - The error handler function to remove
 */
export function removeGlobalUncaughtErrorHandler(errorHandler: (...args: unknown[]) => void): void {
  window.removeEventListener('error', errorHandler as EventListener);
  window.removeEventListener('unhandledrejection', errorHandler as EventListener);
}
