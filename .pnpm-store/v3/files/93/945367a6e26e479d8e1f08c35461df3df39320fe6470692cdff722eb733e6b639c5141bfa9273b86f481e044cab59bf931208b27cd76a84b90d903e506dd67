var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat');

require('../env.js');

suite.addBatch({
  'sliceAssign': {
    'topic': function() {
      return jStat;
    },
    'crop assign': function(jStat) {
      var A = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
      jStat.sliceAssign(
          A, { row: { start: 1 }, col: { start: 1 }}, [[1, 0], [0, 1]]);
      assert.deepEqual(A, [[1, 2, 3], [4, 1, 0], [7, 0, 1]]);
    },
    'row assign': function(jStat) {
      var A = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
      jStat.sliceAssign(A, { row: 1 }, [-1, -1, -1]);
      assert.deepEqual(A, [[1, 2, 3], [-1, -1, -1], [7, 8, 9]]);
    },
    'col assign':function(jStat){
      var A = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
      jStat.sliceAssign(A, { col: 1 }, [-1, -1, -1]);
      assert.deepEqual(A, [[1, -1, 3], [4, -1, 6], [7, -1, 9]]);
    }
  }
});

suite.export(module);
