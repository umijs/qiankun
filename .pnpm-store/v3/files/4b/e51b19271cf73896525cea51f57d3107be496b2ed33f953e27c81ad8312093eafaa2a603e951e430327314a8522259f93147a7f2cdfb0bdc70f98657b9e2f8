var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.spearmancoeff');

require('../env.js');

var tol = 0.0000001;

suite.addBatch({
  'spearman': {
    'topic': function() {
      return jStat;
    },
    'return basic spearmancoeff': function(jStat) {
      assert.epsilon(tol, jStat.spearmancoeff([1, 2, 3, 4], [5, 6, 9, 7]), 0.8);
    },
    'return spearmancoeff with ties': function(jStat) {
      assert.epsilon(tol,
                     jStat.spearmancoeff([1, 2, 3, 4], [5, 5, 9, 7]),
                     0.7378647873726218);
    },
    'return spearmancoeff all ties': function(jStat) {
      assert.equal(isNaN(jStat.spearmancoeff([1, 2, 3, 4], [5, 5, 5, 5])),
                   true);
    },
    'return spearmancoeff unequal arrays': function(jStat) {
      assert.equal(isNaN(jStat.spearmancoeff([1, 2, 3, 4], [5, 6, 7])),
                   true);
    }
  }
});

suite.export(module);
