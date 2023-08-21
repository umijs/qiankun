var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.covariance');

require('../env.js');

suite.addBatch({
  'covariance': {
    'topic': function() {
      return jStat;
    },
    'return basic covariance': function(jStat) {
      assert.equal(jStat.covariance([1, 2, 3, 4], [4, 5, 6, 7]),
                   1.6666666666666667);
    }
  }
});

suite.export(module);
