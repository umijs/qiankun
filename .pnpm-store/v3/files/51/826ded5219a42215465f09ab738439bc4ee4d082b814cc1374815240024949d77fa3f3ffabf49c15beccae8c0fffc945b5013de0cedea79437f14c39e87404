var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat');

require('../env.js');

suite.addBatch({
  'triaLowSolve': {
    'topic': function() {
      return jStat;
    },
    'array call': function(jStat) {
      var A = [[1, 0, 0], [2, 3, 0], [4, 5, 6]];
      var b = [7, 8, 9];
      var coef = jStat.triaLowSolve(A, b);
      var tol = 0.0001;
      assert.epsilon(tol, coef[0], 7.0);
      assert.epsilon(tol, coef[1], -2.0);
      assert.epsilon(tol, coef[2], -1.5);
    },
    'matrix call': function(jStat) {
      var A = [[1, 0, 0], [2, 3, 0], [4, 5, 6]];
      var b = [[7], [8], [9]];
      var coef = jStat.triaLowSolve(A, b);
      var tol = 0.0001;
      assert.epsilon(tol, coef[0][0], 7.0);
      assert.epsilon(tol, coef[1][0], -2.0);
      assert.epsilon(tol, coef[2][0], -1.5);
    }
  }
});

suite.export(module);
