export function merge() {
  return mutate({}, ...arguments);
}

export function clone(target) {
  if (Array.isArray(target)) {
    return target.map((element) => clone(element));
  } else if (target && typeof target === "object") {
    return mutate({}, target);
  } else {
    return target;
  }
}

export function mutate() {
  let target = arguments[0];
  for (let i = 1; i < arguments.length; i++) {
    const source = arguments[i];
    if (is_object_literal(source)) {
      if (!is_object_literal(target)) {
        target = {};
      }
      for (const name of Object.keys(source)) {
        if (/__proto__|prototype/.test(name)) {
          // See
          // https://github.com/adaltas/node-mixme/issues/1
          // https://github.com/adaltas/node-mixme/issues/2
          // continue if /__proto__|constructor|prototype|eval|function|\*|\+|;|\s|\(|\)|!/.test name
          // Unless proven wrong, I consider ok to copy any properties named eval
          // or function, we are not executing those, only copying.
          continue;
        }
        target[name] = mutate(target[name], source[name]);
      }
    } else if (Array.isArray(source)) {
      target = source.map((element) => clone(element));
    } else if (source !== undefined) {
      target = source;
    }
  }
  return target;
}

export function snake_case(source, convert = true) {
  let target = {};
  if (is_object_literal(source)) {
    const u =
      typeof convert === "number" && convert > 0 ? convert - 1 : convert;
    for (let name of Object.keys(source)) {
      let src = source[name];
      if (convert) {
        name = _snake_case(name);
      }
      target[name] = snake_case(src, u);
    }
  } else {
    target = source;
  }
  return target;
}

export function compare(el1, el2) {
  if (is_object_literal(el1)) {
    if (!is_object_literal(el2)) {
      return false;
    }
    const keys1 = Object.keys(el1).sort();
    const keys2 = Object.keys(el2).sort();
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (let i = 0; i < keys1.length; i++) {
      const key = keys1[i];
      if (key !== keys2[i]) {
        return false;
      }
      if (!compare(el1[key], el2[key])) {
        return false;
      }
    }
  } else if (Array.isArray(el1)) {
    if (!Array.isArray(el2)) {
      return false;
    }
    if (el1.length !== el2.length) {
      return false;
    }
    for (let i = 0; i < el1.length; i++) {
      if (!compare(el1[i], el2[i])) {
        return false;
      }
    }
  } else if (el1 !== el2) {
    return false;
  }
  return true;
}

function _snake_case(str) {
  return str.replace(/([A-Z])/g, (_, match) => {
    return "_" + match.toLowerCase();
  });
}

export function is_object(obj) {
  return obj && typeof obj === "object" && !Array.isArray(obj);
}

export function is_object_literal(obj) {
  let test = obj;
  if (typeof obj !== "object" || obj === null) {
    return false;
  } else {
    if (Object.getPrototypeOf(test) === null) {
      return true;
    }
    while (
      Object.getPrototypeOf((test = Object.getPrototypeOf(test))) !== null
    ) {
      true;
    }
    return Object.getPrototypeOf(obj) === test;
  }
}
