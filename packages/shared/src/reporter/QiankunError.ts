export class QiankunError extends Error {
  constructor(message: string) {
    super(`[qiankun]: ${message}`);
  }
}
