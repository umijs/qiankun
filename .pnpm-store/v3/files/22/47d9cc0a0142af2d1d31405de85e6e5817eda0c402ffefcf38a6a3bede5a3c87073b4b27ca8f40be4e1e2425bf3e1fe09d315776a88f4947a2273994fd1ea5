var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.min');

require('../env.js');

suite.addBatch({
  'min': {
    'topic': function() {
      return jStat;
    },
    'return basic min': function(jStat) {
      assert.equal(jStat.min([1, 2, 3]), 1);
    },
    'min from instance': function(jStat) {
      assert.equal(jStat([1, 2, 3]).min(), 1);
    },
    'min matrix cols': function(jStat) {
      assert.deepEqual(jStat([[1, 2], [3, 4]]).min(), [1, 2]);
    },
    'min full matrix': function(jStat) {
      assert.equal(jStat([[1, 2], [3, 4]]).min(true), 1);
    }
  },
  '#min vector': {
    'topic': function() {
      jStat([1, 2, 3]).min(this.callback);
    },
    'min callback': function(val, stat) {
      assert.equal(val, 1);
    }
  },
  '#min matrix cols': {
    'topic': function() {
      jStat([[1, 2], [3, 4]]).min(this.callback);
    },
    'min matrix cols callback': function(val, stat) {
      assert.deepEqual(val, [1, 2]);
    }
  },
  '#min full matrix': {
    'topic': function() {
      jStat([[1, 2], [3, 4]]).min(true, this.callback);
    },
    'min full matrix callback': function(val, stat) {
      assert.equal(val, 1);
    }
  }
});

suite.export(module);
