var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.sumsqerr');

require('../env.js');

suite.addBatch({
  'sumsqerr': {
    'topic': function() {
      return jStat;
    },
    'return basic sumsqerr': function(jStat) {
      assert.equal(jStat.sumsqerr([1, 2, 3]), 2);
    },
    'sumsqerr from instance': function(jStat) {
      assert.equal(jStat([1, 2, 3]).sumsqerr(), 2);
    },
    'sumsqerr matrix cols': function(jStat) {
      assert.deepEqual(jStat([[1, 2], [3, 4]]).sumsqerr(), [2, 2]);
    }
  },
  '#sumsqerr vector': {
    'topic': function() {
      jStat([1, 2, 3]).sumsqerr(this.callback);
    },
    'sumsqerr callback': function(val, stat) {
      assert.equal(val, 2);
    }
  },
  '#sumsqerr matrix cols': {
    'topic': function() {
      jStat([[1, 2], [3, 4]]).sumsqerr(this.callback);
    },
    'sumsqerr matrix cols callback': function(val, stat) {
      assert.deepEqual(val, [2, 2]);
    }
  }
});

suite.export(module);
