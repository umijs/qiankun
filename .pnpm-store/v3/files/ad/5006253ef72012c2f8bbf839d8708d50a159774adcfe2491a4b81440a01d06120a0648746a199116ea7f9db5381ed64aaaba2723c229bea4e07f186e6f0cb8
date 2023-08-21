var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.seq');

require('../env.js');

suite.addBatch({
  'seq': {
    'topic': function() {
      return jStat;
    },
    'return seq': function(jStat) {
      assert.deepEqual(jStat.seq(0, 1, 5), [0, 0.25, 0.5, 0.75, 1]);
      assert.deepEqual(jStat.seq(0, 1, 5, function(x) {
        return x * 2;
      }), [0, 0.5, 1, 1.5, 2]);
      assert.deepEqual(jStat.seq(-1, 1, 5), [-1, -0.5, 0, 0.5, 1]);
      assert.deepEqual(jStat.seq(1, 1, 5), [1, 1, 1, 1, 1]);
      assert.deepEqual(jStat.seq(2, 2, 6, function(x) {
        return x * 2;
      }), [4, 4, 4, 4, 4, 4]);
    },
    'seq from jStat object': function(jStat) {
      assert.deepEqual(jStat(0, 1, 5).toArray(), [0, 0.25, 0.5, 0.75, 1]);
    }
  }
});

suite.export(module);
