var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.zeros');

require('../env.js');

suite.addBatch({
  'zeros': {
    'topic': function() {
      return jStat;
    },
    'return zeros': function(jStat) {
      assert.deepEqual(jStat.zeros(2, 3), [[0, 0, 0], [0, 0, 0]]);
      assert.deepEqual(jStat.zeros(2), [[0, 0], [0, 0]]);
    },
    'zeros from empty jStat object': function (jStat) {
      assert.isTrue(jStat().zeros(2) instanceof jStat);
      assert.deepEqual(jStat().zeros(2, 3).toArray(), [[0, 0, 0], [0, 0, 0]]);
    }
  }
});

suite.export(module);
