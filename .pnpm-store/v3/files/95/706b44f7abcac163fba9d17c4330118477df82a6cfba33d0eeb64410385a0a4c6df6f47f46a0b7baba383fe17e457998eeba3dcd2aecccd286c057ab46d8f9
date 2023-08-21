var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.geomean');

require('../env.js');

suite.addBatch({
  'geomean': {
    'topic': function() {
      return jStat;
    },
    'return basic geomean': function(jStat) {
      assert.equal(jStat.geomean([1, 2, 3]), 1.8171205928321397);
    },
    'geomean from instance': function(jStat) {
      assert.equal(jStat([1, 2, 3]).geomean(), 1.8171205928321397);
    },
    'geomean matrix cols': function(jStat) {
      assert.deepEqual(jStat([[1, 2], [3, 4]]).geomean(),
                       [1.7320508075688772, 2.8284271247461903]);
    },
    'geomean full matrix': function(jStat) {
      assert.equal(jStat([[1, 2], [3, 4]]).geomean(true), 2.2133638394006434);
    }
  },
  '#geomean vector': {
    'topic': function() {
      jStat([1, 2, 3]).geomean(this.callback);
    },
    'geomean callback': function(val, stat) {
      assert.equal(val, 1.8171205928321397);
    }
  },
  '#geomean matrix cols': {
    'topic': function() {
      jStat([[1, 2], [3, 4]]).geomean(this.callback);
    },
    'geomean matrix cols callback': function(val, stat) {
      assert.deepEqual(val, [1.7320508075688772, 2.8284271247461903]);
    }
  },
  '#geomean full matrix': {
    'topic': function() {
      jStat([[1, 2], [3, 4]]).geomean(true, this.callback);
    },
    'geomean full matrix callback': function(val, stat) {
      assert.equal(val, 2.2133638394006434);
    }
  }
});

suite.export(module);
