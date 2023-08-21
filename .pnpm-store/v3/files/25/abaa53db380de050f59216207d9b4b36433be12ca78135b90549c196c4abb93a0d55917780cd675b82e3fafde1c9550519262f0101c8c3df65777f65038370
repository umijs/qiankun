var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.dimensions');

require('../env.js');

function noop() { }

suite.addBatch({
  'dimensions': {
    'topic': function() {
      return jStat;
    },
    'dimention of matrix': function(jStat) {
      assert.deepEqual(jStat.dimensions([[1], [4], [5]]), { rows: 3, cols: 1 });
      assert.deepEqual(jStat([[1], [4], [5]]).dimensions(),
                       { rows: 3, cols: 1 });
      assert.isTrue(jStat([[1], [3]]).dimensions(noop) instanceof jStat);
    }
  },
  '#dimensions': {
    'topic': function() {
      jStat([[1, 2, 3], [4, 5, 6]]).dimensions(this.callback);
    },
    'dimensions sends value': function(val, stat) {
      assert.deepEqual(val, { rows: 2, cols: 3 });
    }
  }
});

suite.export(module);
