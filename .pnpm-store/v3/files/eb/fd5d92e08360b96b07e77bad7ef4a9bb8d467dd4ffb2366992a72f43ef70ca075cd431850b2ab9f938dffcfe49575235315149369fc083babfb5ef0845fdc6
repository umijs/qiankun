var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat');

require('../env.js');

suite.addBatch({
  'slice-test': {
    'topic': function() {
      return jStat;
    },
    'example1': function(jStat) {
      var A = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
      var B = jStat.slice(A, { row: { start: 1 }, col: { start: 1 }});
      var tol = 0.001;
      assert.epsilon(tol, B[0][0], A[1][1]);
      assert.epsilon(tol, B[0][1], A[1][2]);
      assert.epsilon(tol, B[1][0], A[2][1]);
      assert.epsilon(tol, B[1][1], A[2][2]);
    },
    'example2': function(jStat) {
      var A = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
      var B = jStat.slice(A, { row: { end: 1 }, col: { start: 1 }});
      var tol = 0.001;
      assert.epsilon(tol, B[0][0], A[0][1]);
      assert.epsilon(tol, B[0][1], A[0][2]);
    },
    'example3': function(jStat) {
      var A = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
      var B = jStat.slice(A, { row: 2 });
      assert.deepEqual(B, [7, 8, 9]);
    },
    'example3': function(jStat) {
      var A = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
      var n = jStat.slice(A, { row: 2, col: 2 });
      assert.equal(n,9);
    }
  }
});

suite.export(module);
