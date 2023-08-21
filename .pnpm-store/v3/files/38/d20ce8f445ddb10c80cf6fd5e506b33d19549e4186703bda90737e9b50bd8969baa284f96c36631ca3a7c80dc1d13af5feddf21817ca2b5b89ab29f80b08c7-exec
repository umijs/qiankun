var _curry2 =
/*#__PURE__*/
require("./_curry2.js");

var _includesWith =
/*#__PURE__*/
require("./_includesWith.js");

var _xfBase =
/*#__PURE__*/
require("./_xfBase.js");

var XUniqWith =
/*#__PURE__*/
function () {
  function XUniqWith(pred, xf) {
    this.xf = xf;
    this.pred = pred;
    this.items = [];
  }

  XUniqWith.prototype['@@transducer/init'] = _xfBase.init;
  XUniqWith.prototype['@@transducer/result'] = _xfBase.result;

  XUniqWith.prototype['@@transducer/step'] = function (result, input) {
    if (_includesWith(this.pred, input, this.items)) {
      return result;
    } else {
      this.items.push(input);
      return this.xf['@@transducer/step'](result, input);
    }
  };

  return XUniqWith;
}();

var _xuniqWith =
/*#__PURE__*/
_curry2(function _xuniqWith(pred, xf) {
  return new XUniqWith(pred, xf);
});

module.exports = _xuniqWith;