var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.meandev');

require('../env.js');

suite.addBatch({
  'meandev': {
    'topic': function() {
      return jStat;
    },
    'return basic meandev': function(jStat) {
      assert.equal(jStat.meandev([4, 5, 7, 22, 90, 1, 4, 5]), 19.375);
    },
    'meandev from instance': function(jStat) {
      assert.equal(jStat([1, 2, 3, 4]).meandev(), 1);
    },
    'meandev matrix cols': function(jStat) {
      assert.deepEqual(jStat([[1, 2], [3, 4]]).meandev(), [1, 1]);
    }
  },
  '#meandev vector': {
    'topic': function() {
      jStat([1, 2, 3, 4]).meandev(this.callback);
    },
    'meandev callback': function(val, stat) {
      assert.equal(val, 1);
    }
  },
  '#meandev matrix cols': {
    'topic': function() {
      jStat([[1, 2], [3, 4]]).meandev(this.callback);
    },
    'meandev matrix cols callback': function(val, stat) {
      assert.deepEqual(val, [1, 1]);
    }
  }
});

suite.export(module);
