var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.variance');

require('../env.js');

suite.addBatch({
  'variance': {
    'topic': function() {
      return jStat;
    },
    'return basic variance': function(jStat) {
      assert.equal(jStat.variance([1, 2, 3, 4]), 1.25);
    },
    'return basic variance using sample': function(jStat) {
      assert.equal(jStat.variance([1, 2, 3, 4, 5], true), 2.5);
    },
    'variance from instance': function(jStat) {
      assert.equal(jStat([1, 2, 3, 4]).variance(), 1.25);
    },
    'variance matrix cols': function(jStat) {
      assert.deepEqual(jStat([[1, 2], [3, 4]]).variance(), [1, 1]);
    }
  },
  '#variance vector': {
    'topic': function() {
      jStat([1, 2, 3, 4]).variance(this.callback);
    },
    'variance callback': function(val, stat) {
      assert.equal(val, 1.25);
    }
  },
  '#variance matrix cols': {
    'topic': function() {
      jStat([[1, 2], [3, 4]]).variance(this.callback);
    },
    'variance matrix cols callback': function(val, stat) {
      assert.deepEqual(val, [1, 1]);
    }
  }
});

suite.export(module);
