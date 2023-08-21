var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.alter');

require('../env.js');

suite.addBatch({
  'alter': {
    'topic': function() {
      return jStat;
    },
    'return alter': function(jStat) {
      assert.deepEqual(jStat.alter([[1, 2], [3, 4]], function(x) {
        return x * 2;
      }), [[2, 4], [6, 8]]);
      assert.deepEqual(jStat([[1, 2], [3, 4]]).alter(function(x) {
        return x * 2;
      }).toArray(), [[2, 4], [6, 8]]);
    }
  }
});

suite.export(module);
