'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Stringifier = require('postcss/lib/stringifier');

module.exports = function (_Stringifier) {
  _inherits(SassStringifier, _Stringifier);

  function SassStringifier() {
    _classCallCheck(this, SassStringifier);

    return _possibleConstructorReturn(this, (SassStringifier.__proto__ || Object.getPrototypeOf(SassStringifier)).apply(this, arguments));
  }

  _createClass(SassStringifier, [{
    key: 'block',
    value: function block(node, start) {
      this.builder(start, node, 'start');
      if (node.nodes && node.nodes.length) {
        this.body(node);
      }
    }
  }, {
    key: 'decl',
    value: function decl(node) {
      _get(SassStringifier.prototype.__proto__ || Object.getPrototypeOf(SassStringifier.prototype), 'decl', this).call(this, node, false);
    }
  }, {
    key: 'comment',
    value: function comment(node) {
      var left = this.raw(node, 'left', 'commentLeft');
      var right = this.raw(node, 'right', 'commentRight');

      if (node.raws.inline) {
        this.builder('//' + left + node.text + right, node);
      } else {
        this.builder('/*' + left + node.text + right + '*/', node);
      }
    }
  }]);

  return SassStringifier;
}(Stringifier);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0cmluZ2lmaWVyLmVzNiJdLCJuYW1lcyI6WyJTdHJpbmdpZmllciIsInJlcXVpcmUiLCJtb2R1bGUiLCJleHBvcnRzIiwibm9kZSIsInN0YXJ0IiwiYnVpbGRlciIsIm5vZGVzIiwibGVuZ3RoIiwiYm9keSIsImxlZnQiLCJyYXciLCJyaWdodCIsInJhd3MiLCJpbmxpbmUiLCJ0ZXh0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxJQUFNQSxjQUFjQyxRQUFRLHlCQUFSLENBQXBCOztBQUVBQyxPQUFPQyxPQUFQO0FBQUE7O0FBQUE7QUFBQTs7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQSwwQkFDU0MsSUFEVCxFQUNlQyxLQURmLEVBQ3NCO0FBQ2xCLFdBQUtDLE9BQUwsQ0FBYUQsS0FBYixFQUFvQkQsSUFBcEIsRUFBMEIsT0FBMUI7QUFDQSxVQUFJQSxLQUFLRyxLQUFMLElBQWNILEtBQUtHLEtBQUwsQ0FBV0MsTUFBN0IsRUFBcUM7QUFDbkMsYUFBS0MsSUFBTCxDQUFVTCxJQUFWO0FBQ0Q7QUFDRjtBQU5IO0FBQUE7QUFBQSx5QkFRUUEsSUFSUixFQVFjO0FBQ1YsNkhBQVdBLElBQVgsRUFBaUIsS0FBakI7QUFDRDtBQVZIO0FBQUE7QUFBQSw0QkFZV0EsSUFaWCxFQVlpQjtBQUNiLFVBQUlNLE9BQU8sS0FBS0MsR0FBTCxDQUFTUCxJQUFULEVBQWUsTUFBZixFQUF1QixhQUF2QixDQUFYO0FBQ0EsVUFBSVEsUUFBUSxLQUFLRCxHQUFMLENBQVNQLElBQVQsRUFBZSxPQUFmLEVBQXdCLGNBQXhCLENBQVo7O0FBRUEsVUFBSUEsS0FBS1MsSUFBTCxDQUFVQyxNQUFkLEVBQXNCO0FBQ3BCLGFBQUtSLE9BQUwsQ0FBYSxPQUFPSSxJQUFQLEdBQWNOLEtBQUtXLElBQW5CLEdBQTBCSCxLQUF2QyxFQUE4Q1IsSUFBOUM7QUFDRCxPQUZELE1BRU87QUFDTCxhQUFLRSxPQUFMLENBQWEsT0FBT0ksSUFBUCxHQUFjTixLQUFLVyxJQUFuQixHQUEwQkgsS0FBMUIsR0FBa0MsSUFBL0MsRUFBcURSLElBQXJEO0FBQ0Q7QUFDRjtBQXJCSDs7QUFBQTtBQUFBLEVBQStDSixXQUEvQyIsImZpbGUiOiJzdHJpbmdpZmllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IFN0cmluZ2lmaWVyID0gcmVxdWlyZSgncG9zdGNzcy9saWIvc3RyaW5naWZpZXInKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFNhc3NTdHJpbmdpZmllciBleHRlbmRzIFN0cmluZ2lmaWVyIHtcbiAgYmxvY2sgKG5vZGUsIHN0YXJ0KSB7XG4gICAgdGhpcy5idWlsZGVyKHN0YXJ0LCBub2RlLCAnc3RhcnQnKVxuICAgIGlmIChub2RlLm5vZGVzICYmIG5vZGUubm9kZXMubGVuZ3RoKSB7XG4gICAgICB0aGlzLmJvZHkobm9kZSlcbiAgICB9XG4gIH1cblxuICBkZWNsIChub2RlKSB7XG4gICAgc3VwZXIuZGVjbChub2RlLCBmYWxzZSlcbiAgfVxuXG4gIGNvbW1lbnQgKG5vZGUpIHtcbiAgICBsZXQgbGVmdCA9IHRoaXMucmF3KG5vZGUsICdsZWZ0JywgJ2NvbW1lbnRMZWZ0JylcbiAgICBsZXQgcmlnaHQgPSB0aGlzLnJhdyhub2RlLCAncmlnaHQnLCAnY29tbWVudFJpZ2h0JylcblxuICAgIGlmIChub2RlLnJhd3MuaW5saW5lKSB7XG4gICAgICB0aGlzLmJ1aWxkZXIoJy8vJyArIGxlZnQgKyBub2RlLnRleHQgKyByaWdodCwgbm9kZSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5idWlsZGVyKCcvKicgKyBsZWZ0ICsgbm9kZS50ZXh0ICsgcmlnaHQgKyAnKi8nLCBub2RlKVxuICAgIH1cbiAgfVxufVxuIl19