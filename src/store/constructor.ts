/**
 * @author dbkillerf6
 * @since 2020-04-08
 */

type OnGlobalStateChangeCallBack = (state: any, bucket?: string[]) => void;

export default class Store {
  private readonly __store: Record<string, any>;

  private readonly __globalDeps: Record<string, OnGlobalStateChangeCallBack>;

  private readonly __bucketDeps: Record<string, Record<string, OnGlobalStateChangeCallBack>>;

  constructor(obj: Record<string, any> = {}) {
    this.__globalDeps = {};
    this.__bucketDeps = {};
    this.__store = obj;
  }

  // 触发 bucket 监听
  private __bucketEmit(state: Record<string, any>, bucket: string) {
    const self = this;
    const bucketDeps = self.__bucketDeps;
    self.__store[bucket] = state[bucket];
    Object.keys(bucketDeps).forEach((subName: string) => {
      if (bucketDeps[subName] && bucketDeps[subName][bucket] instanceof Function) {
        bucketDeps[subName][bucket](self.__store[bucket]);
      }
    });
  }

  // 触发全局监听
  private __gloablEmit(state: Record<string, any>, prevs: string[]) {
    const self = this;
    const globalDeps = self.__globalDeps;
    prevs.forEach(bucket => {
      self.__bucketEmit(state, bucket);
    });
    Object.keys(globalDeps).forEach((subName: string) => {
      if (globalDeps[subName] instanceof Function) {
        globalDeps[subName](state, prevs);
      }
    });
  }

  getMethods(subName: string) {
    const self = this;
    self.__bucketDeps[subName] = self.__bucketDeps[subName] || {};

    return {
      /**
       * onStateChange 全局依赖监听
       *
       * 收集 setState 时所需要触发的依赖
       *
       * 限制条件：每个子应用只有一个激活状态的全局监听，新监听覆盖旧监听，若只是监听部分属性，请使用 onStateChange
       *
       * 这么设计是为了减少全局监听滥用倒是的内存爆炸
       *
       * 依赖数据结构为：
       * {
       *   {appName}: callback
       * }
       *
       * @param callback
       */
      onGlobalStateChange(callback: OnGlobalStateChangeCallBack) {
        if (!(callback instanceof Function)) {
          console.error('[callback] must be function!');
          return;
        }
        self.__globalDeps[subName] = callback;
        callback({ ...self.__store }, []);
      },

      /**
       * onStateChange Bucket 依赖监听
       *
       * bucket：store 的第一层属性名称，如 store = { user: { name: 'qiankun' }, others: '1' }，bucket 则为 user、others
       *
       * 收集 setState 时有 bucket 遭到更改时需要触发的依赖
       *
       * 限制条件：每个子应用同一 bucket 只有一个激活状态的监听，新监听覆盖旧监听
       *
       * 这么设计是为了减少 bucket 监听滥用倒是的内存爆炸
       *
       * 依赖数据结构为：
       * {
       *   {appName}: {
       *     {bucket}: callback
       *   }
       * }
       *
       * @param bucket
       * @param callback
       */
      onStateChange(bucket: string, callback: OnGlobalStateChangeCallBack) {
        if (!(callback instanceof Function)) {
          console.error('[callback] must be function!');
          return;
        }
        const deps = self.__bucketDeps[subName];
        self.__bucketDeps[subName] = { ...deps, [bucket]: callback };
        callback(self.__store[bucket]);
      },

      /**
       * setState 更新 store 数据
       *
       * 1. 对输入 state 的第一层属性做校验，只有初始化时声明过的第一层（bucket）属性才会被更改
       * 2. 修改 store 并触发全局监听和 bucket 监听
       *
       * @param state
       */
      setState(state: Record<string, any> = {}) {
        const prevs: string[] = [];
        Object.keys(state).forEach(bucket => {
          if (bucket in self.__store) {
            prevs.push(bucket);
          } else {
            console.warn(`[${bucket}] not declared when create store！`);
          }
        });
        if (prevs.length > 0) {
          self.__gloablEmit(state, prevs);
        }
        return true;
      },
    };
  }

  // 应用 unmont 的时候，自动注销该应用下的依赖
  unmout(subName: string) {
    delete this.__globalDeps[subName];
    this.__bucketDeps[subName] = {};
    return true;
  }
}
