var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.create');

require('../env.js');

suite.addBatch({
  'create': {
    'topic': function() {
      return jStat;
    },
    'return create': function(jStat) {
      assert.deepEqual(jStat.create(2, 3, function(row, col) {
        return row + col;
      }), [[0, 1, 2], [1, 2, 3]]);
      assert.deepEqual(jStat.create(2, function(row, col) {
        return row + col;
      }), [[0, 1], [1, 2]]);
    },
    'create from empty jStat object': function (jStat) {
      assert.isTrue(
          jStat().create(2, function() { return 1; }) instanceof jStat);
      assert.deepEqual(jStat().create(2, function(row, col) {
        return row + col;
      }).toArray(), [[0, 1], [1, 2]]);
    }
  }
});

suite.export(module);
