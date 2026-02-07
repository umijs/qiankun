/// <reference types="vite/client" />

declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean;
    startTime?: number;
    evalStart?: number;
    useRuntimeDeps?: boolean;
  }
}

export {};
