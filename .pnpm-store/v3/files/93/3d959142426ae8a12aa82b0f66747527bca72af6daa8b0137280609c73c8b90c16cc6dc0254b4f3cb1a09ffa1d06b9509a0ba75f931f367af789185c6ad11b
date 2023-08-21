var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.cumprod');

require('../env.js');

suite.addBatch({
  'cumprod': {
    'topic': function() {
      return jStat;
    },
    'return basic cumprod': function(jStat) {
      assert.deepEqual(jStat.cumprod([1, 2, 3]), [1, 2, 6]);
    },
    'cumprod from instance': function(jStat) {
      assert.deepEqual(jStat([1, 2, 3]).cumprod(), [1, 2, 6]);
    },
    'cumprod matrix cols': function(jStat) {
      assert.deepEqual(jStat([[1, 2], [3, 4]]).cumprod(), [[1, 3], [2, 8]]);
    },
    'cumprod matrix rows': function(jStat) {
      assert.deepEqual(jStat([[1, 2], [3, 4]]).cumprod(true), [[1, 2], [3, 12]]);
    }
  },
  '#cumprod vector': {
    'topic': function() {
      jStat([1, 2, 3]).cumprod(this.callback);
    },
    'cumprod callback': function(val, stat) {
      assert.deepEqual(val, [1, 2, 6]);
    }
  },
  '#cumprod matrix cols': {
    'topic': function() {
      jStat([[1, 2], [3, 4]]).cumprod(this.callback);
    },
    'cumprod matrix cols callback': function(val, stat) {
      assert.deepEqual(val, [[1, 3], [2, 8]]);
    }
  },
  '#cumprod matrix rows': {
    'topic': function() {
      jStat([[1, 2], [3, 4]]).cumprod(true, this.callback);
    },
    'cumprod matrix rows callback': function(val, stat) {
      assert.deepEqual(val, [[1, 2], [3, 12]]);
    }
  }
});

suite.export(module);
