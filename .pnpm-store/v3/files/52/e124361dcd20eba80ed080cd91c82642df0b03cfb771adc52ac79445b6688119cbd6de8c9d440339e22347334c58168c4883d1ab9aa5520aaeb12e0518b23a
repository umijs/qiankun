var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.product');

require('../env.js');

suite.addBatch({
  'product': {
    'topic': function() {
      return jStat;
    },
    'return basic product': function(jStat) {
      assert.equal(jStat.product([1, 2, 3]), 6);
    },
    'product from instance': function(jStat) {
      assert.equal(jStat([1, 2, 3]).product(), 6);
    },
    'product matrix cols': function(jStat) {
      assert.deepEqual(jStat([[1, 2], [3, 4]]).product(), [3, 8]);
    },
    'product full matrix': function(jStat) {
      assert.equal(jStat([[1, 2], [3, 4]]).product(true), 24);
    }
  },
  '#product vector': {
    'topic': function() {
      jStat([1, 2, 3]).product(this.callback);
    },
    'product callback': function(val, stat) {
      assert.equal(val, 6);
    }
  },
  '#product matrix cols': {
    'topic': function() {
      jStat([[1, 2], [3, 4]]).product(this.callback);
    },
    'product matrix cols callback': function(val, stat) {
      assert.deepEqual(val, [3, 8]);
    }
  },
  '#product full matrix': {
    'topic': function() {
      jStat([[1, 2], [3, 4]]).product(true, this.callback);
    },
    'product full matrix callback': function(val, stat) {
      assert.equal(val, 24);
    }
  }
});

suite.export(module);
