export class QiankunError extends Error {
  constructor(message: string, code?: number,  ...args: string[]) {
    let errorMessage = `[qiankun #${code}]: ${message ? message + ' ' : ''}`;
    if (process.env.NODE_ENV === 'production' && typeof(code) !== 'undefined') {
      errorMessage += `See https://qiankun.umijs.org/error/?code=${code}${
        args.length ? `&arg=${args.join('&arg=')}` : ''
      }`;
    } else {
      console.warn('args', ...args);
    }
    super(errorMessage);
  }
}
