var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.deviation');

require('../env.js');

suite.addBatch({
  'deviation': {
    'topic': function() {
      return jStat;
    },
    'return basic deviation': function(jStat) {
      assert.deepEqual(jStat.deviation([1, 5, 2]),
                       [-1.6666666666666665, 2.3333333333333335, -0.6666666666666665]);
    },
    'deviation from instance': function(jStat) {
      assert.deepEqual(jStat([1, 5, 2]).deviation(),
                       [-1.6666666666666665, 2.3333333333333335, -0.6666666666666665]);
    },
    'deviation matrix cols': function(jStat) {
      assert.deepEqual(jStat([[1, 2], [2, 1]]).deviation(),
                       [[-0.5, 0.5], [0.5, -0.5]]);
    },
    'return deviation with equal numbers': function(jStat) {
      assert.deepEqual(jStat.deviation([1, 1, 1]),
                       [0, 0, 0]);
    }
  }
});

suite.export(module);
