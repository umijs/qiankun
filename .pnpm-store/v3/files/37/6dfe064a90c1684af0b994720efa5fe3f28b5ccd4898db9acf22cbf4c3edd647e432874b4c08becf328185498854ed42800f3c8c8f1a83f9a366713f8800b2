var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.median');

require('../env.js');

suite.addBatch({
  'median': {
    'topic': function() {
      return jStat;
    },
    'return basic median': function(jStat) {
      assert.equal(jStat.median([1, 2, 3]), 2);
    },
    'median from instance': function(jStat) {
      assert.equal(jStat([1, 2, 3]).median(), 2);
    },
    'median matrix cols': function(jStat) {
      assert.deepEqual(jStat([[1, 2], [3, 4]]).median(), [2, 3]);
    },
    'median full matrix': function(jStat) {
      assert.equal(jStat([[1, 2], [3, 4]]).median(true), 2.5);
    }
  },
  '#median vector': {
    'topic': function() {
      jStat([1, 2, 3]).median(this.callback);
    },
    'median callback': function(val, stat) {
      assert.equal(val, 2);
    }
  },
  '#median matrix cols': {
    'topic': function() {
      jStat([[1, 2], [3, 4]]).median(this.callback);
    },
    'median matrix cols callback': function(val, stat) {
      assert.deepEqual(val, [2, 3]);
    }
  },
  '#median full matrix': {
    'topic': function() {
      jStat([[1, 2], [3, 4]]).median(true, this.callback);
    },
    'median full matrix callback': function(val, stat) {
      assert.equal(val, 2.5);
    }
  }
});

suite.export(module);
