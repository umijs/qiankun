var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat');

require('../env.js');

suite.addBatch({
  'linearalgebra': {
    'topic': function() {
      return jStat;
    },
    "test det on 2x2 matrix": function (jStat) {
      var A = [
        [4, 6],
        [3, 8],
      ];
      assert.equal(jStat.det(A), 14);
    },
    'test det works': function(jStat) {
      var A = [[1, 2, 3], [4, 5, -6], [7, -8, 9]];
      assert.equal(jStat.det(A), -360);
    },
    "test bug #270": function (jStat) {
      var A = [
        [310, -228, -190, 108],
        [-228, 310, 108, -190],
        [-190, 108, 310, -228],
        [108, -190, -228, 310],
      ];
      assert.equal(jStat.det(A), 0);
    },
  }
});

suite.export(module);
