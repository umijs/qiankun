var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat');

require('../env.js');

suite.addBatch({
  'linearalgebra': {
    'topic': function() {
      return jStat;
    },
    'exp function works': function(jStat) {
      var A = jStat([[-1, 0], [1, 2]]);
      assert.deepEqual(A.exp(), jStat([[Math.exp(-1), 1], [Math.E, Math.exp(2)]]));
    }
  }
});

suite.export(module);
