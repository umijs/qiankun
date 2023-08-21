function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

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

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _toArray(arr) {
  return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;

      var F = function () {};

      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function () {
      it = it.call(o);
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

/*
 ** Copyright 2020 Bloomberg Finance L.P.
 **
 ** Licensed under the Apache License, Version 2.0 (the "License");
 ** you may not use this file except in compliance with the License.
 ** You may obtain a copy of the License at
 **
 **     http://www.apache.org/licenses/LICENSE-2.0
 **
 ** Unless required by applicable law or agreed to in writing, software
 ** distributed under the License is distributed on an "AS IS" BASIS,
 ** WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ** See the License for the specific language governing permissions and
 ** limitations under the License.
 */
var ARRAY_KEYED_MAP_VALUE = Symbol("ArrayKeyedMap-value");
var ArrayKeyedMap = /*#__PURE__*/function () {
  function ArrayKeyedMap(root) {
    _classCallCheck(this, ArrayKeyedMap);

    this._map = new Map();
    this._root = root ? root : this;
    this._size = 0;
  }

  _createClass(ArrayKeyedMap, [{
    key: "size",
    get: function get() {
      return this._root._size;
    }
  }, {
    key: "_updateSize",
    value: function _updateSize(diff) {
      this._root._size += diff;
    }
  }, {
    key: "set",
    value: function set(key, value) {
      if (_typeof(key) === "symbol") {
        return this._map.set(key, value);
      } else if (Array.isArray(key)) {
        if (key.length === 0) {
          if (!this._map.has(ARRAY_KEYED_MAP_VALUE)) {
            this._updateSize(1);
          }

          this._map.set(ARRAY_KEYED_MAP_VALUE, value);

          return this;
        }

        var _key = _toArray(key),
            first = _key[0],
            rest = _key.slice(1);

        var next = this._map.get(first);

        if (!next) {
          next = new ArrayKeyedMap(this._root);

          this._map.set(first, next);
        }

        next.set(rest, value);
      } else {
        throw new TypeError("key must be an Array or Symbol");
      }
    }
  }, {
    key: "has",
    value: function has(key) {
      if (_typeof(key) === "symbol") {
        return this._map.has(key);
      } else if (Array.isArray(key)) {
        if (key.length === 0) {
          return this._map.has(ARRAY_KEYED_MAP_VALUE);
        }

        var _key2 = _toArray(key),
            first = _key2[0],
            rest = _key2.slice(1);

        var next = this._map.get(first);

        return next ? next.has(rest) : false;
      } else {
        throw new TypeError("key must be an Array or Symbol");
      }
    }
  }, {
    key: "get",
    value: function get(key) {
      if (_typeof(key) === "symbol") {
        return this._map.get(key);
      } else if (Array.isArray(key)) {
        if (key.length === 0) {
          return this._map.get(ARRAY_KEYED_MAP_VALUE);
        }

        var _key3 = _toArray(key),
            first = _key3[0],
            rest = _key3.slice(1);

        var next = this._map.get(first);

        return next ? next.get(rest) : undefined;
      } else {
        throw new TypeError("key must be an Array or Symbol");
      }
    }
  }, {
    key: "delete",
    value: function _delete(key) {
      if (_typeof(key) === "symbol") {
        return this._map["delete"](key);
      } else if (Array.isArray(key)) {
        if (key.length === 0) {
          var didDelete = this._map["delete"](ARRAY_KEYED_MAP_VALUE);

          if (didDelete) {
            this._updateSize(-1);
          }

          return didDelete;
        }

        var _key4 = _toArray(key),
            first = _key4[0],
            rest = _key4.slice(1);

        var next = this._map.get(first);

        if (next) {
          var _didDelete = next["delete"](rest);

          if (this._root._size === 0) {
            this._map["delete"](first);
          }

          return _didDelete;
        }

        return false;
      } else {
        throw new TypeError("key must be an Array or Symbol");
      }
    }
  }]);

  return ArrayKeyedMap;
}();

var GRAPH_VALUE = Symbol("GRAPH_VALUE");
var GRAPH_PARENT = Symbol("GRAPH_PARENT");
var GRAPH_REFCOUNT = Symbol("GRAPH_REFCOUNT");
var InternGraph = /*#__PURE__*/function () {
  function InternGraph(creator) {
    _classCallCheck(this, InternGraph);

    this._creator = creator;
    this._map = new ArrayKeyedMap();
    this._finalizers = new WeakMap();
  }

  _createClass(InternGraph, [{
    key: "size",
    get: function get() {
      return this._map.size;
    }
  }, {
    key: "clear",
    value: function clear() {
      this._map = new ArrayKeyedMap();
    }
  }, {
    key: "get",
    value: function get(values) {
      var map = this._map;
      var maps = [map];

      var _iterator = _createForOfIteratorHelper(values),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _value = _step.value;

          if (!map.has(_value)) {
            var newMap = new ArrayKeyedMap();
            newMap.set(GRAPH_PARENT, {
              parent: map,
              value: _value
            });
            map.set(_value, newMap);
          }

          map = map.get(_value);
          maps.push(map);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      var ref = map.get(GRAPH_VALUE);

      if (ref && ref.deref()) {
        return ref.deref();
      }

      for (var _i = 0, _maps = maps; _i < _maps.length; _i++) {
        var _map = _maps[_i];
        var refcount = _map.get(GRAPH_REFCOUNT) || 0;

        _map.set(GRAPH_REFCOUNT, refcount + 1);
      }

      var value = this._creator(values);

      ref = new WeakRef(value);
      map.set(GRAPH_VALUE, ref);
      var group = new FinalizationRegistry(function cleanup(heldValues) {
        var map = Array.from(heldValues)[0];

        while (map && map !== this._map) {
          var mapParent = map.get(GRAPH_PARENT);

          var _refcount = map.get(GRAPH_REFCOUNT);

          if (_refcount - 1 === 0) {
            mapParent.parent["delete"](mapParent.value);
          }

          map.set(GRAPH_REFCOUNT, _refcount - 1);
          map = mapParent.parent;
        }
      }.bind(this));
      group.register(value, map);

      this._finalizers.set(value, group);

      return value;
    }
  }, {
    key: "getFinalizer",
    value: function getFinalizer(value) {
      return this._finalizers.get(value);
    }
  }]);

  return InternGraph;
}();

/*
 ** Copyright 2020 Bloomberg Finance L.P.
 **
 ** Licensed under the Apache License, Version 2.0 (the "License");
 ** you may not use this file except in compliance with the License.
 ** You may obtain a copy of the License at
 **
 **     http://www.apache.org/licenses/LICENSE-2.0
 **
 ** Unless required by applicable law or agreed to in writing, software
 ** distributed under the License is distributed on an "AS IS" BASIS,
 ** WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ** See the License for the specific language governing permissions and
 ** limitations under the License.
 */
function isObject(v) {
  return _typeof(v) === "object" && v !== null;
}
function isFunction(v) {
  return typeof v === "function";
}
function isIterableObject(v) {
  return isObject(v) && typeof v[Symbol.iterator] === "function";
}
function objectFromEntries(iterable) {
  return _toConsumableArray(iterable).reduce(function (obj, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        val = _ref2[1];

    obj[key] = val;
    return obj;
  }, {});
}
var RECORD_WEAKSET = new WeakSet();
var TUPLE_WEAKMAP = new WeakMap(); // tuple -> length

function isRecord(value) {
  return RECORD_WEAKSET.has(value);
}
function isTuple(value) {
  return TUPLE_WEAKMAP.has(value);
}
function markRecord(value) {
  RECORD_WEAKSET.add(value);
}
function markTuple(value, length) {
  TUPLE_WEAKMAP.set(value, length);
}
function getTupleLength(value) {
  return TUPLE_WEAKMAP.get(value);
}
var BOX_TO_VALUE = new WeakMap();
var VALUE_TO_BOX = new WeakMap();
function isBox(arg) {
  return BOX_TO_VALUE.has(arg);
}
function unboxBox(box) {
  if (!isBox(box)) {
    throw new Error("unboxBox: invalid argument");
  }

  return BOX_TO_VALUE.get(box);
}
function findBox(value) {
  return VALUE_TO_BOX.get(value);
}
function markBox(box, value) {
  BOX_TO_VALUE.set(box, value);
  VALUE_TO_BOX.set(value, box);
}

function isRecordOrTuple(value) {
  return isRecord(value) || isTuple(value);
}

function validateProperty(value) {
  if (isObject(value) && !isRecordOrTuple(value) && !isBox(value)) {
    throw new Error("TypeError: cannot use an object as a value in a record");
  } else if (isFunction(value)) {
    throw new Error("TypeError: cannot use a function as a value in a record");
  }

  return value;
}
function define(obj, props) {
  var _iterator = _createForOfIteratorHelper(Reflect.ownKeys(props)),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var key = _step.value;

      var _Object$getOwnPropert = Object.getOwnPropertyDescriptor(props, key),
          get = _Object$getOwnPropert.get,
          set = _Object$getOwnPropert.set,
          value = _Object$getOwnPropert.value;

      var desc = get || set ? {
        get: get,
        set: set,
        configurable: true
      } : {
        value: value,
        writable: true,
        configurable: true
      };
      Object.defineProperty(obj, key, desc);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}
var _WeakMap = globalThis["WeakMap"];
var _WeakRef = globalThis["WeakRef"];

var _FinalizationRegistry = globalThis["FinalizationRegistry"] || globalThis["FinalizationGroup"];

function assertFeatures() {
  if (!_WeakMap || !_WeakRef || !_FinalizationRegistry) {
    throw new Error("WeakMap, WeakRef, and FinalizationRegistry are required for @bloomberg/record-tuple-polyfill");
  }
}

function createFreshRecordFromProperties(properties) {
  var record = Object.create(Record.prototype);

  var _iterator = _createForOfIteratorHelper(properties),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _step$value = _slicedToArray(_step.value, 2),
          name = _step$value[0],
          value = _step$value[1];

      record[name] = validateProperty(value);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  Object.freeze(record);
  markRecord(record);
  return record;
}

var RECORD_GRAPH = new InternGraph(createFreshRecordFromProperties);

function createRecordFromObject(value) {
  assertFeatures();

  if (!isObject(value)) {
    throw new Error("invalid value, expected object argument");
  } // sort all property names by the order specified by
  // the argument's OwnPropertyKeys internal slot
  // EnumerableOwnPropertyNames - 7.3.22


  var properties = Object.entries(value).sort(function (_ref, _ref2) {
    var _ref3 = _slicedToArray(_ref, 1),
        a = _ref3[0];

    var _ref4 = _slicedToArray(_ref2, 1),
        b = _ref4[0];

    if (a < b) return -1;else if (a > b) return 1;
    return 0;
  }).map(function (_ref5) {
    var _ref6 = _slicedToArray(_ref5, 2),
        name = _ref6[0],
        value = _ref6[1];

    return [name, validateProperty(value)];
  });
  return RECORD_GRAPH.get(properties);
}

function Record(value) {
  return createRecordFromObject(value);
} // ensure that Record.name is "Record" even if this
// source is aggressively minified or bundled.

if (Record.name !== "Record") {
  Object.defineProperty(Record, "name", {
    value: "Record",
    configurable: true
  });
}

define(Record, {
  isRecord: isRecord,
  fromEntries: function fromEntries(iterator) {
    return createRecordFromObject(objectFromEntries(iterator));
  }
});
Record.prototype = Object.create(null);
define(Record.prototype, {
  constructor: Record,
  toString: function toString() {
    return "[record Record]";
  }
});

function createFreshTupleFromIterableObject(value) {
  if (!isIterableObject(value)) {
    throw new Error("invalid value, expected an array or iterable as the argument.");
  }

  var length = 0;
  var tuple = Object.create(Tuple.prototype); // eslint-disable-next-line no-constant-condition

  var _iterator = _createForOfIteratorHelper(value),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var val = _step.value;
      tuple[length] = validateProperty(val);
      length++;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  Object.freeze(tuple);
  markTuple(tuple, length);
  return tuple;
}

var TUPLE_GRAPH = new InternGraph(function (values) {
  var elements = Array.from(values).map(function (v) {
    return v[0];
  });
  return createFreshTupleFromIterableObject(elements);
});
function createTupleFromIterableObject(value) {
  assertFeatures();

  if (!isIterableObject(value)) {
    throw new Error("invalid value, expected an array or iterable as the argument.");
  }

  var validated = Array.from(value).map(function (v) {
    return [validateProperty(v)];
  });
  return TUPLE_GRAPH.get(validated);
}

function assertTuple(value, methodName) {
  if (!isTuple(value)) {
    throw new TypeError("'Tuple.prototype.".concat(methodName, "' called on incompatible receiver."));
  }
}

function Tuple() {
  for (var _len = arguments.length, values = new Array(_len), _key = 0; _key < _len; _key++) {
    values[_key] = arguments[_key];
  }

  return createTupleFromIterableObject(values);
} // ensure that Tuple.name is "Tuple" even if this
// source is aggressively minified or bundled.

if (Tuple.name !== "Tuple") {
  Object.defineProperty(Tuple, "name", {
    value: "Tuple",
    configurable: true
  });
}

define(Tuple, {
  isTuple: isTuple,
  from: function from(arrayLike, mapFn, thisArg) {
    return createTupleFromIterableObject(Array.from(arrayLike, mapFn, thisArg));
  },
  of: function of() {
    return createTupleFromIterableObject(Array.of.apply(Array, arguments));
  }
});
Tuple.prototype = Object.create(null);
Object.defineProperty(Tuple.prototype, Symbol.toStringTag, {
  value: "Tuple",
  configurable: true
});
define(Tuple.prototype, {
  constructor: Tuple,

  get length() {
    assertTuple(this, "length");
    return getTupleLength(this);
  },

  valueOf: function valueOf() {
    assertTuple(this, "valueOf");
    return this;
  },
  popped: arrayMethodUpdatingTuple("pop", "popped"),
  pushed: arrayMethodUpdatingTuple("push", "pushed"),
  reversed: arrayMethodUpdatingTuple("reverse", "reversed"),
  shifted: arrayMethodUpdatingTuple("shift", "shifted"),
  unshifted: arrayMethodUpdatingTuple("unshift", "unshifted"),
  sorted: arrayMethodUpdatingTuple("sort", "sorted"),
  spliced: arrayMethodUpdatingTuple("splice", "spliced"),
  concat: function concat() {
    assertTuple(this, "concat");
    var elements = Array.from(this);

    for (var _len2 = arguments.length, values = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      values[_key2] = arguments[_key2];
    }

    do {
      var value = values.shift();

      if (Tuple.isTuple(value)) {
        elements.push.apply(elements, _toConsumableArray(value));
      } else {
        elements.push(value);
      }
    } while (values.length > 0);

    return Tuple.from(elements);
  },
  includes: arrayMethod("includes"),
  indexOf: arrayMethod("indexOf"),
  join: arrayMethod("join"),
  lastIndexOf: arrayMethod("lastIndexOf"),
  slice: arrayMethodReturningTuple("slice"),
  entries: arrayMethod("entries"),
  every: arrayMethod("every"),
  filter: arrayMethodReturningTuple("filter"),
  find: arrayMethod("find"),
  findIndex: arrayMethod("findIndex"),
  flat: function flat(depth) {
    var _this = this;

    assertTuple(this, "flat");

    if (depth === undefined) {
      depth = 1;
    } else {
      depth = Number(depth);
    }

    if (depth === 0) {
      return Tuple.prototype.slice.call(this);
    }

    return this.reduce(function (acc, cur) {
      if (Tuple.isTuple(cur)) {
        return acc.pushed.apply(acc, _this.flat.call(cur, depth - 1));
      } else {
        return acc.pushed(cur);
      }
    }, Tuple());
  },
  flatMap: function flatMap() {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return Tuple.prototype.map.apply(this, args).flat();
  },
  forEach: arrayMethod("forEach"),
  keys: arrayMethod("keys"),
  map: arrayMethodReturningTuple("map"),
  reduce: arrayMethod("reduce"),
  reduceRight: arrayMethod("reduceRight"),
  some: arrayMethod("some"),
  values: arrayMethod("values"),
  toString: arrayMethod("toString"),
  toLocaleString: arrayMethod("toLocaleString"),
  "with": function _with(index, value) {
    assertTuple(this, "with");
    if (typeof index !== "number") throw new TypeError("index provided to .with() must be a number");
    var array = Array.from(this);
    array[index] = value;
    return createTupleFromIterableObject(array);
  }
});
define(Tuple.prototype, _defineProperty({}, Symbol.iterator, Tuple.prototype.values)); // Array methods that already work as-is with tuples

function arrayMethod(name) {
  var method = Array.prototype[name];
  return function () {
    assertTuple(this, name);
    return method.apply(this, arguments);
  };
} // Array methods that return an array, but should return a tuple


function arrayMethodReturningTuple(name) {
  var method = Array.prototype[name];
  return function () {
    assertTuple(this, name);
    return createTupleFromIterableObject(method.apply(this, arguments));
  };
} // Array methods that would try to mutate the existing tuple


function arrayMethodUpdatingTuple(name, newName) {
  var method = Array.prototype[name];
  return function () {
    assertTuple(this, newName);
    var arr = Array.from(this);
    method.apply(arr, arguments);
    return createTupleFromIterableObject(arr);
  };
}

var JSON$stringify = JSON.stringify;
var JSON$parse = JSON.parse;
function stringify(value, replacer, space) {
  var props;

  if (Array.isArray(replacer)) {
    props = new Set();
    replacer.forEach(function (v) {
      if (typeof v === "string" || typeof v === "number" || v instanceof Number || v instanceof String) {
        props.add(String(v));
      }
    });
  }

  var isTopLevel = true;
  return JSON$stringify(value, function stringifyReplacer(key, val) {
    if (props && !isTopLevel && !props.has(key)) {
      return undefined;
    }

    isTopLevel = false; // The top-level value is never excluded

    if (typeof replacer === "function") {
      val = replacer.call(this, key, val);
    }

    if (isRecord(val)) return _objectSpread2({}, val);
    if (isTuple(val)) return Array.from(val);

    if (isBox(val)) {
      throw new TypeError("Box value can't be serialized in JSON");
    }

    return val;
  }, space);
}
function parseImmutable(text, reviver) {
  return JSON$parse(text, function parseImmutableReviver(key, value) {
    if (_typeof(value) === "object") {
      if (Array.isArray(value)) {
        value = createTupleFromIterableObject(value);
      } else if (value !== null) {
        value = Record(value);
      }
    } // This should check IsCallable(reviver)


    if (typeof reviver === "function") {
      value = reviver(key, value);
      validateProperty(value);
    }

    return value;
  });
}

assertFeatures();
function Box(value) {
  if (!isObject(value) && !isFunction(value)) {
    throw new TypeError("Box can only wrap objects");
  }

  var box = findBox(value);

  if (box) {
    return box;
  } else {
    box = Object.create(Box.prototype);
    Object.freeze(box);
    markBox(box, value);
    return box;
  }
}

function assertBox(value, methodName) {
  if (!isBox(value)) {
    throw new TypeError("'Box.prototype.".concat(methodName, "' called on incompatible receiver."));
  }
}

Object.defineProperty(Box.prototype, Symbol.toStringTag, {
  value: "Box",
  configurable: true
});

function recursiveContainsBox(arg) {
  if (isBox(arg)) {
    return true;
  } else if (isRecord(arg)) {
    for (var _i = 0, _Object$keys = Object.keys(arg); _i < _Object$keys.length; _i++) {
      var key = _Object$keys[_i];

      if (recursiveContainsBox(arg[key])) {
        return true;
      }
    }

    return false;
  } else if (isTuple(arg)) {
    var _iterator = _createForOfIteratorHelper(arg),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var value = _step.value;

        if (recursiveContainsBox(value)) {
          return true;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }

  return false;
}

define(Box, {
  containsBoxes: function containsBoxes(arg) {
    if (isRecord(arg) || isTuple(arg) || isBox(arg)) {
      return recursiveContainsBox(arg);
    } else {
      throw new TypeError("Box.containsBoxes called with imcompatible argument");
    }
  },
  unbox: function unbox(box) {
    assertBox(box, "unbox");
    return unboxBox(box);
  }
});
define(Box.prototype, {
  constructor: Box,
  valueOf: function valueOf() {
    assertBox(this, "valueOf");
    return this;
  }
});

/*
 ** Copyright 2020 Bloomberg Finance L.P.
 **
 ** Licensed under the Apache License, Version 2.0 (the "License");
 ** you may not use this file except in compliance with the License.
 ** You may obtain a copy of the License at
 **
 **     http://www.apache.org/licenses/LICENSE-2.0
 **
 ** Unless required by applicable law or agreed to in writing, software
 ** distributed under the License is distributed on an "AS IS" BASIS,
 ** WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ** See the License for the specific language governing permissions and
 ** limitations under the License.
 */

if (!globalThis.Record) {
  globalThis.Record = Record;
}

if (!globalThis.Tuple) {
  globalThis.Tuple = Tuple;
}

if (!globalThis.Box) {
  globalThis.Box = Box;
}

JSON.stringify = stringify;
JSON.parseImmutable = parseImmutable;

export { Box, Record, Tuple, parseImmutable, stringify };
