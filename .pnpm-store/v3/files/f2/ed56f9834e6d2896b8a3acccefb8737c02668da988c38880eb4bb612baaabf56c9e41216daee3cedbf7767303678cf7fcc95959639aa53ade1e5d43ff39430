var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat');

require('../env.js');

suite.addBatch({
  'linearalgebra': {
    'topic': function() {
      return jStat;
    },
    'dot product works': function(jStat) {
      var A = jStat([1,2,3]);
      var B = [5, -2, 10];
      assert.equal(jStat.dot(A,B), 31);
      assert.equal(A.dot(B), 31);
    }
  }
});

suite.export(module);
