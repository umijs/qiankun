import Store from './constructor';

function createStore(obj: Record<string, any>) {
  return new Store(obj);
}

export { createStore, Store };

export default {
  createStore,
  Store,
};
