/**
 * @author dbkillerf6
 * @since 2020-04-08
 */

type OnGlobalStateChangeCallBack = (state: any, bucket?: string[]) => void;

export default class Store {
  private __store: Record<string, any>;

  private readonly __globalDeps: Record<string, OnGlobalStateChangeCallBack>;

  constructor(obj: Record<string, any> = {}) {
    this.__globalDeps = {};
    this.__store = obj;
  }

  // 触发全局监听
  private __gloablEmit(state: Record<string, any>, prevs: string[]) {
    const self = this;
    const globalDeps = self.__globalDeps;
    Object.keys(globalDeps).forEach((subName: string) => {
      if (globalDeps[subName] instanceof Function) {
        globalDeps[subName](state, prevs);
      }
    });
  }

  initMasterState(obj: Record<string, any> = {}) {
    this.__store = obj;
    return this.getMethods(`gloabal-${+new Date()}`);
  }

  getMethods(subName: string) {
    const self = this;

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
      onGlobalStateChange(callback: OnGlobalStateChangeCallBack, fireImmediately?: boolean) {
        if (!(callback instanceof Function)) {
          console.error('[callback] must be function!');
          return;
        }
        self.__globalDeps[subName] = callback;
        if (fireImmediately) {
          callback({ ...self.__store }, []);
        }
      },

      /**
       * setGlobalState 更新 store 数据
       *
       * 1. 对输入 state 的第一层属性做校验，只有初始化时声明过的第一层（bucket）属性才会被更改
       * 2. 修改 store 并触发全局监听
       *
       * @param state
       */
      setGlobalState(state: Record<string, any> = {}) {
        const prevs: string[] = [];
        Object.keys(state).forEach(bucket => {
          if (bucket in self.__store) {
            self.__store[bucket] = state[bucket];
            prevs.push(bucket);
          } else {
            console.warn(`[${bucket}] not declared when create store！`);
          }
        });
        if (prevs.length > 0) {
          self.__gloablEmit({ ...self.__store }, prevs);
        }
        return true;
      },
    };
  }

  // 应用 unmont 的时候，自动注销该应用下的依赖
  unmout(subName: string) {
    delete this.__globalDeps[subName];
    return true;
  }
}
