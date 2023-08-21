var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat');

require('../env.js');

suite.addBatch({
  'ztest ': {
    'topic': function() {
      return jStat;
    },
    '(value, mean, sd, sides) pattern works': function(jStat) {
      var p = jStat.ztest(1.96, 0, 1, 2);
      assert.equal(p < 0.05, true);
    },
    '(zscore, sides) pattern works': function(jStat) {
      var p = jStat.ztest(1.96, 2);
      assert.equal(p < 0.05, true);
    },
    '(value, array, sides, flag) pattern works': function(jStat) {
      var p = jStat.ztest(1.96, [1, -1], 2);
      assert.equal(p < 0.05, true);
    }
  }
});

suite.export(module);
