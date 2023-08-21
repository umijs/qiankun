var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat');

require('../env.js');

suite.addBatch({
  'copy-test': {
    'topic': function() {
      return jStat;
    },
    'example1': function(jStat) {
      var A = [[1,2],[3,4]];
      var B = A;
      B[0][0] = 0;
      assert.equal(A[0][0], 0);
      var C = jStat.copy(A);
      C[0][0] = -1;
      assert.equal(A[0][0], 0);
    }
  }
});

suite.export(module);
