var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.sum');

require('../env.js');

suite.addBatch({
  'sum': {
    'topic': function() {
      return jStat;
    },
    'return basic sum': function(jStat) {
      assert.equal(jStat.sum([1, 2, 3]), 6);
    },
    'sum from instance': function(jStat) {
      assert.equal(jStat([1, 2, 3]).sum(), 6);
    },
    'sum matrix cols': function(jStat) {
      assert.deepEqual(jStat([[1, 2], [3, 4]]).sum(), [4, 6]);
    },
    'sum full matrix': function(jStat) {
      assert.equal(jStat([[1, 2], [3, 4]]).sum(true), 10);
    }
  },
  '#sum vector': {
    'topic': function() {
      jStat([1, 2, 3]).sum(this.callback);
    },
    'sum callback': function(val, stat) {
      assert.equal(val, 6);
    }
  },
  '#sum matrix cols': {
    'topic': function() {
      jStat([[1, 2], [3, 4]]).sum(this.callback);
    },
    'sum matrix cols callback': function(val, stat) {
      assert.deepEqual(val, [4, 6]);
    }
  },
  '#sum full matrix': {
    'topic': function() {
      jStat([[1, 2], [3, 4]]).sum(true, this.callback);
    },
    'sum full matrix callback': function(val, stat) {
      assert.equal(val, 10);
    }
  }
});

suite.export(module);
