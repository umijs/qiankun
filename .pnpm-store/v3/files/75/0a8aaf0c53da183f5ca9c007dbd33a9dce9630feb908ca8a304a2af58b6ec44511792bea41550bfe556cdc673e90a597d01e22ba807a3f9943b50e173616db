var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.max');

require('../env.js');

suite.addBatch({
  'max': {
    'topic': function() {
      return jStat;
    },
    'return basic max': function(jStat) {
      assert.equal(jStat.max([1, 2, 3]), 3);
    },
    'max from instance': function(jStat) {
      assert.equal(jStat([1, 2, 3]).max(), 3);
    },
    'max matrix cols': function(jStat) {
      assert.deepEqual(jStat([[1, 2], [3, 4]]).max(), [3, 4]);
    },
    'max full matrix': function(jStat) {
      assert.equal(jStat([[1, 2], [3, 4]]).max(true), 4);
    }
  },
  '#max vector': {
    'topic': function() {
      jStat([1, 2, 3]).max(this.callback);
    },
    'max callback': function(val, stat) {
      assert.equal(val, 3);
    }
  },
  '#max matrix cols': {
    'topic': function() {
      jStat([[1, 2], [3, 4]]).max(this.callback);
    },
    'max matrix cols callback': function(val, stat) {
      assert.deepEqual(val, [3, 4]);
    }
  },
  '#max full matrix': {
    'topic': function() {
      jStat([[1, 2], [3, 4]]).max(true, this.callback);
    },
    'max full matrix callback': function(val, stat) {
      assert.equal(val, 4);
    }
  }
});

suite.export(module);
