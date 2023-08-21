var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.map');

require('../env.js');

suite.addBatch({
  'map': {
    'topic': function() {
      return jStat;
    },
    'return map': function(jStat) {
      assert.deepEqual(jStat.map([[1, 2], [3, 4]], function(x) {
        return x * 2;
      }), [[2, 4], [6, 8]]);
      assert.deepEqual(jStat([[1, 2], [3, 4]]).map(function(x) {
        return x * 2;
      }).toArray(), [[2, 4], [6, 8]]);
    }
  }
});

suite.export(module);
