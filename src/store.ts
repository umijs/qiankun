/**
 * @author dbkillerf6
 * @since 2020-04-10
 */

type OnGlobalStateChangeCallBack = (state: any, bucket?: string[]) => void;

type MicroAppStateActions = {
  onGlobalStateChange: (callback: OnGlobalStateChangeCallBack, fireImmediately?: boolean) => void;
  setGlobalState: (state: Record<string, any>) => boolean;
  offGlobalStateChange: () => boolean;
};

let gloabalState: Record<string, any> = {};

const deps: Record<string, OnGlobalStateChangeCallBack> = {};

// 触发全局监听
function gloablEmit(state: Record<string, any>, prevs: string[]) {
  Object.keys(deps).forEach((id: string) => {
    if (deps[id] instanceof Function) {
      deps[id](state, prevs);
    }
  });
}

export function initGlobalState(obj: Record<string, any> = {}) {
  gloabalState = { ...obj };
  gloablEmit({ ...obj }, Object.keys(gloabalState));
  return getMicroAppStateActions(`gloabal-${+new Date()}`);
}

export function getMicroAppStateActions(id: string): MicroAppStateActions | null {
  if (!(typeof id === 'string')) {
    console.error('[appId] must be string！');
    return null;
  }

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
     *   {id}: callback
     * }
     *
     * @param callback
     */
    onGlobalStateChange(callback: OnGlobalStateChangeCallBack, fireImmediately?: boolean) {
      if (!(callback instanceof Function)) {
        console.error('[callback] must be function!');
        return;
      }
      deps[id] = callback;
      if (fireImmediately) {
        callback({ ...gloabalState }, []);
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
        if (bucket in gloabalState) {
          gloabalState[bucket] = state[bucket];
          prevs.push(bucket);
        } else {
          console.warn(`[${bucket}] not declared when init state！`);
        }
      });
      if (prevs.length > 0) {
        gloablEmit({ ...gloabalState }, prevs);
      }
      return true;
    },

    // 注销该应用下的依赖
    offGlobalStateChange() {
      delete deps[id];
      return true;
    },
  };
}
