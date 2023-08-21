var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.corrcoeff');

require('../env.js');

suite.addBatch({
  'corrcoeff': {
    'topic': function() {
      return jStat;
    },
    'return basic corrcoeff': function(jStat) {
      assert.equal(jStat.corrcoeff([1, 2, 3, 4], [4, 5, 6, 7]),
                   1.0000000000000002);
    }
  }
});

suite.export(module);
