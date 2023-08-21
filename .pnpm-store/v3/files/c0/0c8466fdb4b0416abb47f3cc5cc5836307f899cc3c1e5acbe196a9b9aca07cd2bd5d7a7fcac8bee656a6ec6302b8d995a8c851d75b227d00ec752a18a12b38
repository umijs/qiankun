var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat');

require('../env.js');

suite.addBatch({
  'arange-test': {
    'topic': function() {
      return jStat;
    },
    'example1': function(jStat) {
      var arr = jStat.arange(5, 1, -1);
      var tol = 0.000001;
      assert.epsilon(tol, arr[0], 5);
      assert.epsilon(tol, arr[1], 4);
      assert.epsilon(tol, arr[2], 3);
      assert.epsilon(tol, arr[3], 2);
    }
  }
});

suite.export(module);
