import '@vitest/utils';

function collectOwnProperties(obj, collector) {
  const collect = typeof collector === "function" ? collector : (key) => collector.add(key);
  Object.getOwnPropertyNames(obj).forEach(collect);
  Object.getOwnPropertySymbols(obj).forEach(collect);
}
function groupBy(collection, iteratee) {
  return collection.reduce((acc, item) => {
    const key = iteratee(item);
    acc[key] || (acc[key] = []);
    acc[key].push(item);
    return acc;
  }, {});
}
function isPrimitive(value) {
  return value === null || typeof value !== "function" && typeof value !== "object";
}
function getAllMockableProperties(obj, isModule, constructors) {
  const {
    Map,
    Object: Object2,
    Function,
    RegExp,
    Array: Array2
  } = constructors;
  const allProps = new Map();
  let curr = obj;
  do {
    if (curr === Object2.prototype || curr === Function.prototype || curr === RegExp.prototype)
      break;
    collectOwnProperties(curr, (key) => {
      const descriptor = Object2.getOwnPropertyDescriptor(curr, key);
      if (descriptor)
        allProps.set(key, { key, descriptor });
    });
  } while (curr = Object2.getPrototypeOf(curr));
  if (isModule && !allProps.has("default") && "default" in obj) {
    const descriptor = Object2.getOwnPropertyDescriptor(obj, "default");
    if (descriptor)
      allProps.set("default", { key: "default", descriptor });
  }
  return Array2.from(allProps.values());
}
function slash(str) {
  return str.replace(/\\/g, "/");
}
function noop() {
}
function toArray(array) {
  if (array === null || array === void 0)
    array = [];
  if (Array.isArray(array))
    return array;
  return [array];
}
function toString(v) {
  return Object.prototype.toString.call(v);
}
function isPlainObject(val) {
  return toString(val) === "[object Object]" && (!val.constructor || val.constructor.name === "Object");
}
function deepMerge(target, ...sources) {
  if (!sources.length)
    return target;
  const source = sources.shift();
  if (source === void 0)
    return target;
  if (isMergeableObject(target) && isMergeableObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isMergeableObject(source[key])) {
        if (!target[key])
          target[key] = {};
        deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    });
  }
  return deepMerge(target, ...sources);
}
function isMergeableObject(item) {
  return isPlainObject(item) && !Array.isArray(item);
}
function stdout() {
  return console._stdout || process.stdout;
}
class AggregateErrorPonyfill extends Error {
  errors;
  constructor(errors, message = "") {
    super(message);
    this.errors = [...errors];
  }
}

export { AggregateErrorPonyfill as A, stdout as a, getAllMockableProperties as b, deepMerge as d, groupBy as g, isPrimitive as i, noop as n, slash as s, toArray as t };
