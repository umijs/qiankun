var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.rows');

require('../env.js');

suite.addBatch({
  'rows': {
    'topic': function() {
      return jStat;
    },
    'number of rows': function(jStat) {
      assert.equal(jStat.rows([[1], [4], [5]]), 3);
      assert.equal(jStat([[1], [4], [5]]).rows(), 3);
      assert.isTrue(jStat([[1], [3]]).rows(function() {}) instanceof jStat);
    }
  },
  '#rows': {
    'topic': function() {
      jStat([[1, 2, 3], [4, 5, 6]]).rows(this.callback);
    },
    'rows sends value': function(val, stat) {
      assert.equal(val, 2);
    }
  }
});

suite.export(module);
