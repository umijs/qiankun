var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.coeffvar');

require('../env.js');

suite.addBatch({
  'coeffvar': {
    'topic': function() {
      return jStat;
    },
    'return basic coeffvar': function(jStat) {
      assert.equal(jStat.coeffvar([1, 2, 3, 4]), 0.447213595499958);
    },
    'coeffvar from instance': function(jStat) {
      assert.equal(jStat([1, 2, 3, 4]).coeffvar(), 0.447213595499958);
    },
    'coeffvar matrix cols': function(jStat) {
      assert.deepEqual(jStat([[1, 2], [4, 6]]).coeffvar(), [0.6, 0.5]);
    }
  },
  '#coeffvar vector': {
    'topic': function() {
      jStat([1, 2, 3, 4]).coeffvar(this.callback);
    },
    'coeffvar callback': function(val, stat) {
      assert.equal(val, 0.447213595499958);
    }
  },
  '#coeffvar matrix cols': {
    'topic': function() {
      jStat([[1, 2], [4, 6]]).coeffvar(this.callback);
    },
    'coeffvar matrix cols callback': function(val, stat) {
      assert.deepEqual(val, [0.6, 0.5]);
    }
  }
});

suite.export(module);
