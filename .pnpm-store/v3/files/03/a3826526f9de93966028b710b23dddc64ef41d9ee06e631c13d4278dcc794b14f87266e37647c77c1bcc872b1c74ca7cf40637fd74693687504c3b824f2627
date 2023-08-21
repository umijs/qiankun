var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat');

require('../env.js');

suite.addBatch({
  'linearalgebra': {
    'topic': function() {
      return jStat;
    },
    'scalar division works': function(jStat) {
      var A = jStat([[10, 20, 30]]);
      assert.deepEqual(A.divide(10), jStat([[1, 2, 3]]));
    }
  }
});

suite.export(module);
