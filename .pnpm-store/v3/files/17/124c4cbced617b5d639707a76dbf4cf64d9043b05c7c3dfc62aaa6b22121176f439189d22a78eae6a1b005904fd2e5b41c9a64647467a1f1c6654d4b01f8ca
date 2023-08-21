var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat');

require('../env.js');

suite.addBatch({
  'linearalgebra': {
    'topic': function() {
      return jStat;
    },
    // See "gauss elimination {{1, -3, 1, 4}, {2, -8, 8, -2}, {-6, 3, -15, 9}}"
    // on Wolfram Alpha
    'gauss elimination example 1': function(jStat) {
      var A = [[1, -3, 1], [2, -8, 8], [-6, 3, -15]];
      var B = [[4], [-2], [9]];
      var tol = 0.000001;
      var result = jStat.gauss_elimination(A, B);
      assert.epsilon(tol, result[0], 3);
      assert.epsilon(tol, result[1], -1);
      assert.epsilon(tol, result[2], -2);
    },
    // See "gauss elimination {{1, 1, 3}, {3, -2, 4}}" on Wolfram Alpha
    'gauss elimination example 2': function(jStat) {
      var A = [[1, 1], [3, -2]];
      var B = [[3], [4]];
      var tol = 0.000001;
      var result = jStat.gauss_elimination(A, B);
      assert.epsilon(tol, result[0], 2);
      assert.epsilon(tol, result[1], 1);
    },
    //Sanity check, should not do anything if already solved
    'gauss elimination example 3': function(jStat) {
      var A = jStat.identity(4);
      var B = [[1], [2], [3], [4]];
      var result = jStat.gauss_elimination(A, B);
      var tol = 0.000001;
      assert.epsilon(tol, result[0], 1);
      assert.epsilon(tol, result[1], 2);
      assert.epsilon(tol, result[2], 3);
      assert.epsilon(tol, result[3], 4);
    },
    // Use "{{1,1,1,1,10}, {0,1,1,1,9},{0,0,1,1,7},{0,0,0,1,4}}" on Wolfram
    // Since the matrix already has a lower left hand zero triangle, this just
    // tests the back-substitution portion of the algorithm
    'gauss elimination example 4': function(jStat) {
      var A = [[1,1,1,1],[0,1,1,1],[0,0,1,1],[0,0,0,1]];
      var B = [[10], [9], [7], [4]];
      var result = jStat.gauss_elimination(A, B);
      var tol = 0.000001;
      assert.epsilon(tol, result[3], 4);
      assert.epsilon(tol, result[2], 3);
      assert.epsilon(tol, result[1], 2);
      assert.epsilon(tol, result[0], 1);
    }
  }
});

suite.export(module);
