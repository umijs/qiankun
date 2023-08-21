var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.diag');

require('../env.js');

suite.addBatch({
  'diag': {
    'topic': function() {
      return jStat;
    },
    'return diag': function(jStat) {
      assert.deepEqual(jStat.diag([[1, 2], [3, 4]]), [[1], [4]]);
      assert.deepEqual(jStat([[1, 2], [3, 4]]).diag().toArray(), [[1], [4]]);
    }
  },
  '#diag': {
    'topic': function() {
      jStat([[1, 2], [3, 4]]).diag(this.callback);
    },
    'diag callback': function(val, stat) {
      assert.deepEqual(val.toArray(), [[1], [4]]);
    }
  }
});

suite.export(module);
