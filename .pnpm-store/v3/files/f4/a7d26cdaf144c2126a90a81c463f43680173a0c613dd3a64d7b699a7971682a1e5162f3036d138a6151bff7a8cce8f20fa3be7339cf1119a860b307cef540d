var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.rank');

require('../env.js');

suite.addBatch({
  'rank': {
    'topic': function() {
      return jStat;
    },
    'return basic rank': function(jStat) {
      assert.deepEqual(jStat.rank([1, 5, 2]), [1, 3, 2]);
    },
    'rank from instance': function(jStat) {
      assert.deepEqual(jStat([1, 5, 2]).rank(), [1, 3, 2]);
    },
    'rank matrix cols': function(jStat) {
      assert.deepEqual(jStat([[1, 2], [2, 4]]).rank(), [[1, 2], [1, 2]]);
    },
    'return rank with ties': function(jStat) {
      assert.deepEqual(jStat.rank([5, 5, 2]), [2.5, 2.5, 1]);
    }
  }
});

suite.export(module);
