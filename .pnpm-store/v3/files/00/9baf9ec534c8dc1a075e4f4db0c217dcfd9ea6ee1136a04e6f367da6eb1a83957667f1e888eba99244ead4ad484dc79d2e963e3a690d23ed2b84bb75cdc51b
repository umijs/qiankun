var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.ones');

require('../env.js');

suite.addBatch({
  'ones': {
    'topic': function() {
      return jStat;
    },
    'return ones': function(jStat) {
      assert.deepEqual(jStat.ones(2, 3), [[1, 1, 1], [1, 1, 1]]);
      assert.deepEqual(jStat.ones(2), [[1, 1], [1, 1]]);
    },
    'ones from empty jStat object': function (jStat) {
      assert.isTrue(jStat().ones(2) instanceof jStat);
      assert.deepEqual(jStat().ones(2, 3).toArray(), [[1, 1, 1], [1, 1, 1]]);
    }
  }
});

suite.export(module);
