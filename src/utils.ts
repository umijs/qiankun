/**
 * @author Kuitos
 * @since 2019-05-15
 */

export async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function isConstructable(fn: () => void | FunctionConstructor) {
  const constructableFunctionRegex = /^function\b\s[A-Z].*/;
  const classRegex = /^class\b/;

  return fn.prototype
    && Object.keys(fn.prototype).length
    && (constructableFunctionRegex.test(fn.toString()) || classRegex.test(fn.toString()));
}
