var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat');

require('../env.js');

suite.addBatch({
  'linearalgebra': {
    'topic': function() {
      return jStat;
    },
    'p-norm works for vector defaults to p = 2': function(jStat) {
      var A = jStat([[3, 4]]);
      assert.equal(A.norm(), 5);
      var B = jStat([[-3, 4]]);
      assert.equal(B.norm(), 5);
    },
    'p norm works for vector with p = 1': function(jStat) {
      var A = jStat([[1, 2, 3]]);
      assert.equal(A.norm(1), 6);
    },
    'p norm works for a matrix with p = 2': function(jStat) {
      var A = jStat([[3, 4], [1, 2]]);
      assert.equal(A.norm(), 5);
    }
  }
});

suite.export(module);
