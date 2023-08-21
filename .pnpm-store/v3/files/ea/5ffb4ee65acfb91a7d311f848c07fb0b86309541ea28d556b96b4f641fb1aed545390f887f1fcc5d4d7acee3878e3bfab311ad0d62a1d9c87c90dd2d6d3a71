var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat');

require('../env.js');

suite.addBatch({
  'linearalgebra': {
    'topic': function() {
      return jStat;
    },
    'test that multipling by a scalar works': function(jStat) {
      var A = jStat([[1, 2, 3]]);
      assert.deepEqual(A.multiply(5), jStat([[5, 10, 15]]));
    },
    'test that multiplying by a matrix works': function(jStat) {
      var A = jStat([[1, 2], [3, 4]]);
      var B = [[1, 0], [0, 1]];
      assert.deepEqual(A.multiply(B), jStat([[1, 2], [3, 4]]));
    },
    'test that multiplying by a nonidentity matrix works': function(jStat) {
      var A = jStat([[1, 2], [3, 4]]);
      var B = [[1, 2], [3, 4]];
      assert.deepEqual(A.multiply(B), jStat([[7, 10], [15, 22]]));
    }
  }
});

suite.export(module);
