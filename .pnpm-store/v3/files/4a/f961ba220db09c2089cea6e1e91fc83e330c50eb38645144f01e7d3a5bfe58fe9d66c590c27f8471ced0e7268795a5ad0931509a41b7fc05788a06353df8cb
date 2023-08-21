var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.percentileOfScore');

require('../env.js');

var tol = 0.0000001;

suite.addBatch({
  'percentiles': {
    'topic': function() {
      return jStat;
    },
    'return basic percentile of score': function(jStat) {
      assert.deepEqual(jStat.percentileOfScore([1, 2, 3, 4, 5, 6], 3), 0.5);
      assert.epsilon(tol,
                     jStat.percentileOfScore([1, 2, 3, 4, 5, 6], 5),
                     0.83333333333333343);
    },
    'return basic percentile of score: left extreme': function(jStat) {
      assert.deepEqual(jStat.percentileOfScore([1, 2, 3, 4, 5, 6], -1), 0.0);
    },
    'return basic percentile of score: right extreme': function(jStat) {
      assert.deepEqual(jStat.percentileOfScore([1, 2, 3, 4, 5, 6], 6), 1.0);
    },
    'return basic percentile of score (strict)': function(jStat) {
      assert.epsilon(
          tol,
          jStat.percentileOfScore([1, 2, 3, 4, 5, 6], 5, 'strict'),
          0.66666666666666657);
    },
    'percentile of score from instance': function(jStat) {
      assert.deepEqual(jStat([1, 2, 3, 4, 5, 6]).percentileOfScore(3), 0.5);
    },
    'percentile of score matrix cols': function(jStat) {
      var mat = [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6]];
      assert.deepEqual(jStat(mat).percentileOfScore(3), [0.5, 0.5]);
    }
  }
});

suite.export(module);
