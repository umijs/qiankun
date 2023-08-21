var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.cols');

require('../env.js');

suite.addBatch({
  'cols': {
    'topic': function() {
      return jStat;
    },
    'number of columns': function(jStat) {
      assert.equal(jStat.cols([[1], [4], [5]]), 1);
      assert.equal(jStat([[1], [4], [5]]).cols(), 1);
      assert.isTrue(jStat([[1, 3]]).cols(function() {}) instanceof jStat);
    }
  },
  '#cols': {
    'topic': function() {
      jStat([[1, 2, 3], [4, 5, 6]]).cols(this.callback);
    },
    'cols sends value': function(val, stat) {
      assert.equal(val, 3);
    }
  }
});

suite.export(module);
