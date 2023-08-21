const DEFAULT_TIMEOUT = 6e4;
function defaultSerialize(i) {
  return i;
}
const defaultDeserialize = defaultSerialize;
const { setTimeout } = globalThis;
const random = Math.random.bind(Math);
function createBirpc(functions, options) {
  const {
    post,
    on,
    eventNames = [],
    serialize = defaultSerialize,
    deserialize = defaultDeserialize,
    resolver,
    timeout = DEFAULT_TIMEOUT
  } = options;
  const rpcPromiseMap = /* @__PURE__ */ new Map();
  let _promise;
  const rpc = new Proxy({}, {
    get(_, method) {
      if (method === "$functions")
        return functions;
      const sendEvent = (...args) => {
        post(serialize({ m: method, a: args, t: "q" }));
      };
      if (eventNames.includes(method)) {
        sendEvent.asEvent = sendEvent;
        return sendEvent;
      }
      const sendCall = async (...args) => {
        await _promise;
        return new Promise((resolve, reject) => {
          const id = nanoid();
          rpcPromiseMap.set(id, { resolve, reject });
          post(serialize({ m: method, a: args, i: id, t: "q" }));
          if (timeout >= 0) {
            setTimeout(() => {
              reject(new Error(`[birpc] timeout on calling "${method}"`));
              rpcPromiseMap.delete(id);
            }, timeout);
          }
        });
      };
      sendCall.asEvent = sendEvent;
      return sendCall;
    }
  });
  _promise = on(async (data, ...extra) => {
    const msg = deserialize(data);
    if (msg.t === "q") {
      const { m: method, a: args } = msg;
      let result, error;
      const fn = resolver ? resolver(method, functions[method]) : functions[method];
      if (!fn) {
        error = new Error(`[birpc] function "${method}" not found`);
      } else {
        try {
          result = await fn.apply(rpc, args);
        } catch (e) {
          error = e;
        }
      }
      if (msg.i) {
        if (error && options.onError)
          options.onError(error, method, args);
        post(serialize({ t: "s", i: msg.i, r: result, e: error }), ...extra);
      }
    } else {
      const { i: ack, r: result, e: error } = msg;
      const promise = rpcPromiseMap.get(ack);
      if (promise) {
        if (error)
          promise.reject(error);
        else
          promise.resolve(result);
      }
      rpcPromiseMap.delete(ack);
    }
  });
  return rpc;
}
const urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
function nanoid(size = 21) {
  let id = "";
  let i = size;
  while (i--)
    id += urlAlphabet[random() * 64 | 0];
  return id;
}

export { createBirpc as c };
