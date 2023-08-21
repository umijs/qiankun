var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.identity');

require('../env.js');

suite.addBatch({
  'identity': {
    'topic': function() {
      return jStat;
    },
    'return identity': function(jStat) {
      assert.deepEqual(jStat.identity(2), [[1, 0], [0, 1]]);
    },
    'identity from empty jStat object': function(jStat) {
      assert.isTrue(jStat().identity(2) instanceof jStat);
      assert.deepEqual(jStat().identity(2).toArray(), [[1, 0], [0, 1]]);
    }
  }
});

suite.export(module);
