var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.symmetric');

require('../env.js');

suite.addBatch({
  'symmetric': {
    'topic': function() {
      return jStat;
    },
    'return symmetric': function(jStat) {
      assert.isTrue(jStat.symmetric([[1, 2], [2, 1]]));
      assert.isFalse(jStat.symmetric([[1, 2], [1, 2]]));
    },
    'symmetric from jStat object': function(jStat) {
      assert.isTrue(jStat([[1, 2], [2, 1]]).symmetric());
      assert.isFalse(jStat([[1, 2], [1, 2]]).symmetric());
    }
  }
});

suite.export(module);
