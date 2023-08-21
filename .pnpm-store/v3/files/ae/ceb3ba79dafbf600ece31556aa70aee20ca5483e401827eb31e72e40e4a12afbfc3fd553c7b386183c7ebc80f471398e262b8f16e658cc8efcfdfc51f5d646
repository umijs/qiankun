var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.unique');

require('../env.js');

suite.addBatch({
  'unique': {
    'topic': function() {
      return jStat;
    },
    'return basic unique': function(jStat) {
      assert.deepEqual(jStat.unique([1, 2, 1]), [1, 2]);
    },
    'unique from instance': function(jStat) {
      assert.deepEqual(jStat([1, 2, 1]).unique(), [1, 2]);
    },
    'unique matrix cols': function(jStat) {
      assert.deepEqual(jStat([[1, 2], [1, 4]]).unique(), [[1], [2, 4]]);
    }
  }
});

suite.export(module);
