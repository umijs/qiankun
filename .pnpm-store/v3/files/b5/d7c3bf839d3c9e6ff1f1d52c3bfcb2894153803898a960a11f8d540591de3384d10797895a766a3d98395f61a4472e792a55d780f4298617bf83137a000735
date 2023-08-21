var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.meddev');

require('../env.js');

suite.addBatch({
  'meddev': {
    'topic': function() {
      return jStat;
    },
    'return basic meddev': function(jStat) {
      assert.equal(jStat.meddev([4, 5, 7, 22, 90, 1, 4, 5]), 1.5);
    },
    'meddev from instance': function(jStat) {
      assert.equal(jStat([1, 2, 3, 4]).meddev(), 1);
    },
    'meddev matrix cols': function(jStat) {
      assert.deepEqual(jStat([[1, 2], [3, 4]]).meddev(), [1, 1]);
    }
  },
  '#meddev vector': {
    'topic': function() {
      jStat([1, 2, 3, 4]).meddev(this.callback);
    },
    'meddev callback': function(val, stat) {
      assert.equal(val, 1);
    }
  },
  '#meddev matrix cols': {
    'topic': function() {
      jStat([[1, 2], [3, 4]]).meddev(this.callback);
    },
    'meddev matrix cols callback': function(val, stat) {
      assert.deepEqual(val, [1, 1]);
    }
  }
});

suite.export(module);
