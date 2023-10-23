export class QiankunError extends Error {
  constructor(message: string) {
    super(`[qiankun]: ${message}`);
  }
}

export class QiankunError2 extends Error {
  constructor(code: number, message: string, ...args: string[]) {
    super(`[qiankun #${code}]: ${message ? message + " " : ""}See https://qiankun.umijs.org/error/?code=${code}${args.length ? `&arg=${args.join("&arg=")}` : ""
      }`);
  }
}
