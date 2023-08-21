var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat');

require('../env.js');

suite.addBatch({
  'lu decomposition': {
    'topic': function() {
      return jStat;
    },
    'example1': function(jStat) {
      var A = [[2, 3, 0], [0, 1, 0], [4, 6, 0]];
      var LU = jStat.lu(A);
      var L = LU[0];
      var U = LU[1];
      var tol = 0.0001;
      assert.epsilon(tol, L[0][0], 1.0);
      assert.epsilon(tol, L[0][1], 0.0);
      assert.epsilon(tol, L[0][2], 0.0);
      assert.epsilon(tol, L[1][0], 0.0);
      assert.epsilon(tol, L[1][1], 1.0);
      assert.epsilon(tol, L[1][2], 0.0);
      assert.epsilon(tol, L[2][0], 2.0);
      assert.epsilon(tol, L[2][1], 0.0);
      assert.epsilon(tol, L[2][2], 1.0);
      assert.epsilon(tol, U[0][0], 2.0);
      assert.epsilon(tol, U[0][1], 3.0);
      assert.epsilon(tol, U[0][2], 0.0);
      assert.epsilon(tol, U[1][0], 0.0);
      assert.epsilon(tol, U[1][1], 1.0);
      assert.epsilon(tol, U[1][2], 0.0);
      assert.epsilon(tol, U[2][0], 0.0);
      assert.epsilon(tol, U[2][1], 0.0);
      assert.epsilon(tol, U[2][2], 0.0);
    }
  }
});

suite.export(module);
