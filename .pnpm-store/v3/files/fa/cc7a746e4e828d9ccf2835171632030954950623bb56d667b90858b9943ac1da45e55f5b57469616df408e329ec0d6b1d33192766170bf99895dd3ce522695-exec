var _isFunction =
/*#__PURE__*/
require("./_isFunction.js");

var _toString =
/*#__PURE__*/
require("./_toString.js");

function _assertPromise(name, p) {
  if (p == null || !_isFunction(p.then)) {
    throw new TypeError('`' + name + '` expected a Promise, received ' + _toString(p, []));
  }
}

module.exports = _assertPromise;