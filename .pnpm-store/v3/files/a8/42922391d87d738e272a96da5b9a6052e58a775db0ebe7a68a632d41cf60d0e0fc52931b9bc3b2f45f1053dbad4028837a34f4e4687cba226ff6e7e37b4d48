var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat');

require('../env.js');

suite.addBatch({
  'differenceOfProportions ': {
    'topic': function() {
      return jStat;
    },
    'finds the one sided difference of proportions': function(jStat) {
      var p = jStat.fn.oneSidedDifferenceOfProportions(.12, 500, .14, 1000);
      assert.isTrue(p > 0.14);
      assert.isTrue(p < 0.15);

      p = jStat.fn.oneSidedDifferenceOfProportions(.5, 134, .51, 101);
      assert.isTrue(p > 0.43);
      assert.isTrue(p < 0.44);
    },
    'finds the two sided difference of proportions': function(jStat) {
      var p = jStat.fn.twoSidedDifferenceOfProportions(.12, 500, .14, 1000);
      assert.isTrue(p > 0.28);
      assert.isTrue(p < 0.29);

      p = jStat.fn.twoSidedDifferenceOfProportions(.5, 134, .51, 101);
      assert.isTrue(p > 0.87);
      assert.isTrue(p < 0.88);
    }
  }
});

suite.export(module);
