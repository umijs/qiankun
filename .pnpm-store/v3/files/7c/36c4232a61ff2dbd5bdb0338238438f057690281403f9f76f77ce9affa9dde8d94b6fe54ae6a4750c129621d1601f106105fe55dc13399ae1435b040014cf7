var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.histogram');

require('../env.js');

suite.addBatch({
  'histogram': {
    'topic': function() {
      return jStat;
    },
    'returns histogram (bin counts)': function(jStat) {
      assert.deepEqual(
          jStat.histogram([1, 1, 2, 2, 3, 4, 5, 5, 6, 7, 8]), [4, 2, 3, 2]);
    },
    'histogram from instance': function(jStat) {
      assert.deepEqual(
          jStat([1, 1, 2, 2, 3, 4, 5, 5, 6, 7, 8]).histogram(), [4, 2, 3, 2]);
    },
    'histogram with numBins parameter': function(jStat) {
      assert.deepEqual(
          jStat([1, 1, 2, 2, 3, 4, 5, 5, 6, 7, 8, 10]).histogram(10),
          [2, 2, 1, 1, 2, 1, 1, 1, 0, 1]);
    },
    'histogram with floating point values': function(jStat) {
      assert.deepEqual(
          jStat([0.1, 0.1, 0.3, 0.5]).histogram(3), [2, 1, 1]);
    },
    'documentation values': function(jStat) {
      assert.deepEqual(
        jStat.histogram([100, 101, 102, 230, 304, 305, 400], 3), [3, 1, 3]);
    }
  }
});

suite.export(module);
