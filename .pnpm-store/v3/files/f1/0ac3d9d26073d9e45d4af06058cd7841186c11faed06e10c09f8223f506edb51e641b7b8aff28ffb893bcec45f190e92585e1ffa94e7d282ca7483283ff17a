var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat');

require('../env.js');

suite.addBatch({
  'linearalgebra': {
    'topic': function() {
      return jStat;
    },
    'subtracting a matrix works': function(jStat) {
      var A = jStat([[1, 2, 3]]);
      var B = [[4, 5, -6]];
      assert.deepEqual(A.subtract(B), jStat([[-3, -3, 9]]));
    },
    'subtracting a scalar works': function(jStat) {
      var A = jStat([[1, 2, 3]]);
      assert.deepEqual(A.subtract(100), jStat([[-99, -98, -97]]));
    }
  }
});

suite.export(module);
