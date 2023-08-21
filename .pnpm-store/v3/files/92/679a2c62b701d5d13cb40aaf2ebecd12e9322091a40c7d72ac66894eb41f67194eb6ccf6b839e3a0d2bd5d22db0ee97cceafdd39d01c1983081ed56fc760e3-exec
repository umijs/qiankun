var _curry2 =
/*#__PURE__*/
require("./_curry2.js");

var _Set =
/*#__PURE__*/
require("./_Set.js");

var _xfBase =
/*#__PURE__*/
require("./_xfBase.js");

var XUniqBy =
/*#__PURE__*/
function () {
  function XUniqBy(f, xf) {
    this.xf = xf;
    this.f = f;
    this.set = new _Set();
  }

  XUniqBy.prototype['@@transducer/init'] = _xfBase.init;
  XUniqBy.prototype['@@transducer/result'] = _xfBase.result;

  XUniqBy.prototype['@@transducer/step'] = function (result, input) {
    return this.set.add(this.f(input)) ? this.xf['@@transducer/step'](result, input) : result;
  };

  return XUniqBy;
}();

var _xuniqBy =
/*#__PURE__*/
_curry2(function _xuniqBy(f, xf) {
  return new XUniqBy(f, xf);
});

module.exports = _xuniqBy;