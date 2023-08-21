var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat');

require('../env.js');

suite.addBatch({
  'linearalgebra': {
    'topic': function() {
      return jStat;
    },
    'sanity: inv of ident is ident': function(jStat) {
      var A = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
      var B = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
      assert.deepEqual(jStat.inv(A), B);
    }
  }
});

suite.export(module);
