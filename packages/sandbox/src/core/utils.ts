/**
 * @author Kuitos
 * @since 2023-11-15
 */
/**
 * transform the array to a truthy object for better performance with in operator check later
 * @param array
 */
export function array2TruthyObject(array: string[]): Record<string, true> {
  return array.reduce(
    (obj, key) => {
      obj[key] = true;
      return obj;
    },
    // Notes that babel will transpile spread operator to Object.assign({}, ...args), which will keep the prototype of Object in merged object,
    // while this result used as Symbol.unscopables, it will make properties in Object.prototype always be escaped from proxy sandbox as unscopables check will look up prototype chain as well,
    // such as hasOwnProperty, toString, valueOf, etc.
    // so we should use Object.create(null) to create a pure object without prototype chain here.
    Object.create(null) as Record<string, true>,
  );
}
