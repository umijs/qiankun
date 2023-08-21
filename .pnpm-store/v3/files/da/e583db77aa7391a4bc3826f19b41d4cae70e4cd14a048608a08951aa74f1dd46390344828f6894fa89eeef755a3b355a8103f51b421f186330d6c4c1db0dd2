var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat');

require('../env.js');

suite.addBatch({
  'cholesky decomposition': {
    'topic': function() {
      return jStat;
    },
    'example1': function(jStat) {
      var A = [[4, 6, 10], [6, 58, 29], [10, 29, 38]];
      var T = jStat.cholesky(A);
      var tol=0.0001;
      assert.epsilon(tol, T[0][0], 2.0);
      assert.epsilon(tol, T[0][1], 0.0);
      assert.epsilon(tol, T[0][2], 0.0);
      assert.epsilon(tol, T[1][0], 3.0);
      assert.epsilon(tol, T[1][1], 7.0);
      assert.epsilon(tol, T[1][2], 0.0);
      assert.epsilon(tol, T[2][0], 5.0);
      assert.epsilon(tol, T[2][1], 2.0);
      assert.epsilon(tol, T[2][2], 3.0);
    }
  }
});

suite.export(module);
