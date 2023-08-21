var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.antidiag');

require('../env.js');

suite.addBatch({
  'antidiag': {
    'topic': function() {
      return jStat;
    },
    'return antidiag': function(jStat) {
      assert.deepEqual(jStat.antidiag([[1, 2], [3, 4]]), [[2], [3]]);
      assert.deepEqual(jStat([[1, 2], [3, 4]]).antidiag().toArray(),
                       [[2], [3]]);
    }
  },
  '#antidiag': {
    'topic': function() {
      jStat([[1, 2], [3, 4]]).antidiag(this.callback);
    },
    'antidiag callback': function(val, stat) {
      assert.deepEqual(val.toArray(), [[2], [3]]);
    }
  }
});

suite.export(module);
