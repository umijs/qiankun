var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat');

require('../env.js');

suite.addBatch({
  'linearalgebra': {
    'topic': function() {
      return jStat;
    },
    'abs function works': function(jStat) {
      var A = jStat([[1, -1, 0, -10]]);
      assert.deepEqual(A.abs(), jStat([[1, 1, 0, 10]]));
    }
  }
});

suite.export(module);
