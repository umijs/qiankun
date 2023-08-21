var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.sumsqrd');

require('../env.js');

suite.addBatch({
  'sumsqrd': {
    'topic': function() {
      return jStat;
    },
    'return basic sumsqrd': function(jStat) {
      assert.equal(jStat.sumsqrd([1, 2, 3]), 14);
    },
    'sumsqrd from instance': function(jStat) {
      assert.equal(jStat([1, 2, 3]).sumsqrd(), 14);
    },
    'sumsqrd matrix cols': function(jStat) {
      assert.deepEqual(jStat([[1, 2], [3, 4]]).sumsqrd(), [10, 20]);
    },
    'sumsqrd full matrix': function(jStat) {
      assert.equal(jStat([[1, 2], [3, 4]]).sumsqrd(true), 650);
    }
  },
  '#sumsqrd vector': {
    'topic': function() {
      jStat([1, 2, 3]).sumsqrd(this.callback);
    },
    'sumsqrd callback': function(val, stat) {
      assert.equal(val, 14);
    }
  },
  '#sumsqrd matrix cols': {
    'topic': function() {
      jStat([[1, 2], [3, 4]]).sumsqrd(this.callback);
    },
    'sumsqrd matrix cols callback': function(val, stat) {
      assert.deepEqual(val, [10, 20]);
    }
  },
  '#sumsqrd full matrix': {
    'topic': function() {
      jStat([[1, 2], [3, 4]]).sumsqrd(true, this.callback);
    },
    'sumsqrd full matrix callback': function(val, stat) {
      assert.equal(val, 650);
    }
  }
});

suite.export(module);
