var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat');

require('../env.js');

suite.addBatch({
  'linearalgebra ': {
    'topic': function() {
      return jStat;
    },
    'adding matricies works': function(jStat) {
      var A = jStat([[1, 2, 3]]);
      var B = [[4, 5, -6]];
      assert.deepEqual(A.add(B), jStat([[5, 7, -3]]));
    },
    'adding a scalar works': function(jStat) {
      var A = jStat([[1, 2, 3]]);
      assert.deepEqual(A.add(100), jStat([[101, 102, 103]]));
    }
  }
});

suite.export(module);
