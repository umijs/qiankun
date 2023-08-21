import _curry2 from "./_curry2.js";
import _Set from "./_Set.js";
import _xfBase from "./_xfBase.js";

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

export default _xuniqBy;