var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.stdev');

require('../env.js');

suite.addBatch({
  'stdev': {
    'topic': function() {
      return jStat;
    },
    'return basic stdev': function(jStat) {
      assert.equal(jStat.stdev([1, 2, 3, 4]), 1.118033988749895);
    },
    'return basic stdev using sample': function(jStat) {
      assert.equal(jStat.stdev([1, 2, 3, 4, 5], true), 1.5811388300841898);
    },
    'stdev from instance': function(jStat) {
      assert.equal(jStat([1, 2, 3, 4]).stdev(), 1.118033988749895);
    },
    'stdev matrix cols': function(jStat) {
      assert.deepEqual(jStat([[1, 2], [3, 4]]).stdev(), [1, 1]);
    }
  },
  '#stdev vector': {
    'topic': function() {
      jStat([1, 2, 3, 4]).stdev(this.callback);
    },
    'stdev callback': function(val, stat) {
      assert.equal(val, 1.118033988749895);
    }
  },
  '#stdev matrix cols': {
    'topic': function() {
      jStat([[1, 2], [3, 4]]).stdev(this.callback);
    },
    'stdev matrix cols callback': function(val, stat) {
      assert.deepEqual(val, [1, 1]);
    }
  }
});

suite.export(module);
