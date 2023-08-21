var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.percentile');

require('../env.js');

//could be compared against MS Excel percentile function
suite.addBatch({
  'percentile': {
    'topic': function() {
      return jStat;
    },
    '30th percentile of the list in the range': function(jStat) {
      assert.deepEqual(jStat.percentile([1, 2, 3, 4], 0.3), 1.9);
    },
    '30th percentile of the list in the range with exclusive flag true': function(jStat) {
      assert.deepEqual(jStat.percentile([1, 2, 3, 4], 0.3, true), 1.5);
    },
    '30th percentile of the list in the range, unsorted': function(jStat) {
      assert.deepEqual(jStat.percentile([3, 1, 4, 2], 0.3), 1.9);
    },
    '40th percentile of the list in the range with exclusive flag false': function(jStat) {
      assert.epsilon(0.0000001, jStat.percentile([15, 20, 35, 40, 50], 0.4, false), 29);
    },
    '40th percentile of the list in the range with exclusive flag true': function(jStat) {
      assert.epsilon(0.0000001, jStat.percentile([15, 20, 35, 40, 50], 0.4, true), 26);
    },
    '10th percentile of the list in the range with exclusive flag false': function(jStat) {
      assert.epsilon(0.0000001, jStat.percentile([15, 20, 35, 40, 50], 0.1, false), 17);
    },
    '10th percentile of the list in the range with exclusive flag true': function(jStat) {
      assert(isNaN(jStat.percentile([15, 20, 35, 40, 50], 0.1, true)));
    },
    '100th percentile of the list in the range with exclusive flag false': function(jStat) {
      assert.epsilon(0.0000001, jStat.percentile([15, 20, 35, 40, 50], 1, false), 50);
    },
    '100th percentile of the list in the range with exclusive flag true': function(jStat) {
      assert(isNaN(jStat.percentile([15, 20, 35, 40, 50], 1, true)));
    }
  }
});

suite.export(module);
