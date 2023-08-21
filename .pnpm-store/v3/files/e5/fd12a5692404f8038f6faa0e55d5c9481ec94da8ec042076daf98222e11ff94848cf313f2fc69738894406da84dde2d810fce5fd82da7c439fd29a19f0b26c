function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function merge() {
  return mutate.apply(void 0, [{}].concat(Array.prototype.slice.call(arguments)));
}
function clone(target) {
  if (Array.isArray(target)) {
    return target.map(function (element) {
      return clone(element);
    });
  } else if (target && _typeof(target) === "object") {
    return mutate({}, target);
  } else {
    return target;
  }
}
function mutate() {
  var target = arguments[0];

  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    if (is_object_literal(source)) {
      if (!is_object_literal(target)) {
        target = {};
      }

      for (var _i = 0, _Object$keys = Object.keys(source); _i < _Object$keys.length; _i++) {
        var name = _Object$keys[_i];

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
      target = source.map(function (element) {
        return clone(element);
      });
    } else if (source !== undefined) {
      target = source;
    }
  }

  return target;
}
function snake_case(source) {
  var convert = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var target = {};

  if (is_object_literal(source)) {
    var u = typeof convert === "number" && convert > 0 ? convert - 1 : convert;

    for (var _i2 = 0, _Object$keys2 = Object.keys(source); _i2 < _Object$keys2.length; _i2++) {
      var name = _Object$keys2[_i2];
      var src = source[name];

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
function compare(el1, el2) {
  if (is_object_literal(el1)) {
    if (!is_object_literal(el2)) {
      return false;
    }

    var keys1 = Object.keys(el1).sort();
    var keys2 = Object.keys(el2).sort();

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (var i = 0; i < keys1.length; i++) {
      var key = keys1[i];

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

    for (var _i3 = 0; _i3 < el1.length; _i3++) {
      if (!compare(el1[_i3], el2[_i3])) {
        return false;
      }
    }
  } else if (el1 !== el2) {
    return false;
  }

  return true;
}

function _snake_case(str) {
  return str.replace(/([A-Z])/g, function (_, match) {
    return "_" + match.toLowerCase();
  });
}

function is_object(obj) {
  return obj && _typeof(obj) === "object" && !Array.isArray(obj);
}
function is_object_literal(obj) {
  var test = obj;

  if (_typeof(obj) !== "object" || obj === null) {
    return false;
  } else {
    if (Object.getPrototypeOf(test) === null) {
      return true;
    }

    while (Object.getPrototypeOf(test = Object.getPrototypeOf(test)) !== null) {
    }

    return Object.getPrototypeOf(obj) === test;
  }
}

export { clone, compare, is_object, is_object_literal, merge, mutate, snake_case };
