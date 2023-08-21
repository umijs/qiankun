var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat');

require('../env.js');

suite.addBatch({
  'linearalgebra': {
    'topic': function() {
      return jStat;
    },
    'aug function works': function(jStat) {
      var A = jStat([[1, 2], [3, 4]]);
      var B = [[5], [6]];
      assert.deepEqual(jStat.aug(A, B), [[1, 2, 5], [3, 4, 6]]);
    },
    'aug no mutate inputs': function(jStat) {
      var A = [[1, 2], [3, 4]];
      var B = [[5, 6], [7, 8]];
      var cloneA = cloneMatrix(A);
      var cloneB = cloneMatrix(B);
      assert.deepEqual(jStat.aug(A, B), [[1, 2, 5, 6], [3, 4, 7, 8]]);
      assert.deepEqual(A, cloneA);
      assert.deepEqual(B, cloneB);
    },
  }
});

function cloneMatrix(m) {
  var n = [];
  for (var i = 0; i < m.length; i++) {
    n.push(m[i].slice());
  }
  return n;
}

suite.export(module);
