var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.clear');

require('../env.js');

suite.addBatch({
  'clear': {
    'topic': function() {
      return jStat;
    },
    'return clear': function(jStat) {
      var toclear = [[1, 2], [3, 4]];
      jStat.clear(toclear);
      assert.deepEqual(toclear, [[0, 0], [0, 0]]);
    },
    'clear from empty jStat object': function (jStat) {
      var toclear = jStat([[1, 2], [3, 4]]);
      toclear.clear();
      assert.isTrue(toclear instanceof jStat);
      assert.deepEqual(toclear.toArray(), [[0, 0], [0, 0]]);
    }
  }
});

suite.export(module);
