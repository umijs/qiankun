var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.sumrow');

require('../env.js');

suite.addBatch({
  'sumrow': {
    'topic': function() {
      return jStat;
    },
    'return basic sumrow': function(jStat) {
      assert.equal(jStat.sumrow([1, 2, 3]), 6);
    },
    'sumrow from instance': function(jStat) {
      assert.equal(jStat([1, 2, 3]).sumrow(), 6);
    },
    'sumrow matrix cols': function(jStat) {
      assert.deepEqual(jStat([[1, 2], [3, 4]]).sumrow(), [3, 7]);
    },
    'sumrow full matrix': function(jStat) {
      assert.equal(jStat([[1, 2], [3, 4]]).sumrow(true), 10);
    }
  },
  '#sumrow vector': {
    'topic': function() {
      jStat([1, 2, 3]).sumrow(this.callback);
    },
    'sumrow callback': function(val, stat) {
      assert.equal(val, 6);
    }
  },
  '#sumrow matrix cols': {
    'topic': function() {
      jStat([[1, 2], [3, 4]]).sumrow(this.callback);
    },
    'sumrow matrix cols callback': function(val, stat) {
      assert.deepEqual(val, [3, 7]);
    }
  },
  '#sumrow full matrix': {
    'topic': function() {
      jStat([[1, 2], [3, 4]]).sumrow(true, this.callback);
    },
    'sumrow full matrix callback': function(val, stat) {
      assert.equal(val, 10);
    }
  }
});

suite.export(module);
