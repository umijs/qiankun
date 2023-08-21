var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.cumsum');

require('../env.js');

suite.addBatch({
  'cumsum': {
    'topic': function() {
      return jStat;
    },
    'return basic cumsum': function(jStat) {
      assert.deepEqual(jStat.cumsum([1, 2, 3]), [1, 3, 6]);
    },
    'cumsum from instance': function(jStat) {
      assert.deepEqual(jStat([1, 2, 3]).cumsum(), [1, 3, 6]);
    },
    'cumsum matrix cols': function(jStat) {
      assert.deepEqual(jStat([[1, 2], [3, 4]]).cumsum(), [[1, 4], [2, 6]]);
    },
    'cumsum matrix rows': function(jStat) {
      assert.deepEqual(jStat([[1, 2], [3, 4]]).cumsum(true), [[1, 3], [3, 7]]);
    }
  },
  '#cumsum vector': {
    'topic': function() {
      jStat([1, 2, 3]).cumsum(this.callback);
    },
    'cumsum callback': function(val, stat) {
      assert.deepEqual(val, [1, 3, 6]);
    }
  },
  '#cumsum matrix cols': {
    'topic': function() {
      jStat([[1, 2], [3, 4]]).cumsum(this.callback);
    },
    'cumsum matrix cols callback': function(val, stat) {
      assert.deepEqual(val, [[1, 4], [2, 6]]);
    }
  },
  '#cumsum matrix rows': {
    'topic': function() {
      jStat([[1, 2], [3, 4]]).cumsum(true, this.callback);
    },
    'cumsum matrix rows callback': function(val, stat) {
      assert.deepEqual(val, [[1, 3], [3, 7]]);
    }
  }
});

suite.export(module);
