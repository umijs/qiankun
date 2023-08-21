import { EventEmitter } from 'node:events';
import { HMRPayload as HMRPayload$1, Plugin } from 'vite';
import { h as ViteNodeRunner, H as HotContext } from './types-e8623e9c.js';
import 'vite/types/hot';
import './types.d-7442d07f.js';

type EventType = string | symbol;
type Handler<T = unknown> = (event: T) => void;
interface Emitter<Events extends Record<EventType, unknown>> {
    on<Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>): void;
    off<Key extends keyof Events>(type: Key, handler?: Handler<Events[Key]>): void;
    emit<Key extends keyof Events>(type: Key, event: Events[Key]): void;
    emit<Key extends keyof Events>(type: undefined extends Events[Key] ? Key : never): void;
}
type HMREmitter = Emitter<{
    'message': HMRPayload$1;
}> & EventEmitter;
declare module 'vite' {
    interface ViteDevServer {
        emitter: HMREmitter;
    }
}
declare function createHmrEmitter(): HMREmitter;
declare function viteNodeHmrPlugin(): Plugin;

type HMRPayload =
  | ConnectedPayload
  | UpdatePayload
  | FullReloadPayload
  | CustomPayload
  | ErrorPayload
  | PrunePayload

interface ConnectedPayload {
  type: 'connected'
}

interface UpdatePayload {
  type: 'update'
  updates: Update[]
}

interface Update {
  type: 'js-update' | 'css-update'
  path: string
  acceptedPath: string
  timestamp: number
  /**
   * @experimental internal
   */
  explicitImportRequired?: boolean | undefined
}

interface PrunePayload {
  type: 'prune'
  paths: string[]
}

interface FullReloadPayload {
  type: 'full-reload'
  path?: string
}

interface CustomPayload {
  type: 'custom'
  event: string
  data?: any
}

interface ErrorPayload {
  type: 'error'
  err: {
    [name: string]: any
    message: string
    stack: string
    id?: string
    frame?: string
    plugin?: string
    pluginCode?: string
    loc?: {
      file?: string
      line: number
      column: number
    }
  }
}

interface CustomEventMap {
  'vite:beforeUpdate': UpdatePayload
  'vite:afterUpdate': UpdatePayload
  'vite:beforePrune': PrunePayload
  'vite:beforeFullReload': FullReloadPayload
  'vite:error': ErrorPayload
  'vite:invalidate': InvalidatePayload
}

interface InvalidatePayload {
  path: string
  message: string | undefined
}

type ModuleNamespace = Record<string, any> & {
    [Symbol.toStringTag]: 'Module';
};
type InferCustomEventPayload<T extends string> = T extends keyof CustomEventMap ? CustomEventMap[T] : any;
interface HotModule {
    id: string;
    callbacks: HotCallback[];
}
interface HotCallback {
    deps: string[];
    fn: (modules: (ModuleNamespace | undefined)[]) => void;
}
interface CacheData {
    hotModulesMap: Map<string, HotModule>;
    dataMap: Map<string, any>;
    disposeMap: Map<string, (data: any) => void | Promise<void>>;
    pruneMap: Map<string, (data: any) => void | Promise<void>>;
    customListenersMap: Map<string, ((data: any) => void)[]>;
    ctxToListenersMap: Map<string, Map<string, ((data: any) => void)[]>>;
    messageBuffer: string[];
    isFirstUpdate: boolean;
    pending: boolean;
    queued: Promise<(() => void) | undefined>[];
}
declare function getCache(runner: ViteNodeRunner): CacheData;
declare function sendMessageBuffer(runner: ViteNodeRunner, emitter: HMREmitter): void;
declare function reload(runner: ViteNodeRunner, files: string[]): Promise<any[]>;
declare function handleMessage(runner: ViteNodeRunner, emitter: HMREmitter, files: string[], payload: HMRPayload): Promise<void>;
declare function createHotContext(runner: ViteNodeRunner, emitter: HMREmitter, files: string[], ownerPath: string): HotContext;

export { Emitter, EventType, HMREmitter, Handler, HotCallback, HotModule, InferCustomEventPayload, ModuleNamespace, createHmrEmitter, createHotContext, getCache, handleMessage, reload, sendMessageBuffer, viteNodeHmrPlugin };
