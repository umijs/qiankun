var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat');

require('../env.js');

suite.addBatch({
  'linearalgebra': {
    'topic': function() {
      return jStat;
    },
    'log function works': function(jStat) {
      var A = jStat([[1, Math.E], [Math.exp(5), Math.exp(10)]]);
      assert.deepEqual(A.log(), jStat([[0, 1], [5, 10]]));
    }
  }
});

suite.export(module);
