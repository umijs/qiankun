type OnGlobalStateChangeCallBack = (state: any, namespace: string) => void;

export default class Store {
  private readonly __store: Record<string, any>;

  private readonly __subDeps: Record<string, Record<string, OnGlobalStateChangeCallBack>>;

  constructor(obj: Record<string, any> = {}) {
    const self = this;
    this.__subDeps = {};
    this.__store = new Proxy(obj, {
      set(_obj: Record<string, any>, namespace: string, state) {
        const oldStore = _obj;
        const subs = self.__subDeps;
        Object.keys(subs).forEach((subName: string) => {
          if (subs[subName] && subs[subName][namespace] instanceof Function) {
            subs[subName][namespace](state, namespace);
          }
        });
        oldStore[namespace] = state;
        return true;
      },
    });
  }

  getMethods(subName: string) {
    const self = this;
    self.__subDeps[subName] = self.__subDeps[subName] || {};

    return {
      onStateChange(namespace: string, callback: OnGlobalStateChangeCallBack) {
        const deps = self.__subDeps[subName];
        self.__subDeps[subName] = { ...deps, [namespace]: callback };
        callback(self.__store[namespace], namespace);
      },
      setState(namespace: string, state: any) {
        if (!namespace) {
          console.error('[namespace] should be string!');
          return false;
        }
        self.__store[namespace] = state;
        return true;
      },
    };
  }

  unmout(subName: string) {
    this.__subDeps[subName] = {};
    return true;
  }
}
