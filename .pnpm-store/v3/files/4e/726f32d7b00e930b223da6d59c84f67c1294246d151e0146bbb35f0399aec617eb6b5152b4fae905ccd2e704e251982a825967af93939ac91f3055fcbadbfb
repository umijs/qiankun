var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.meansqerr');

require('../env.js');

suite.addBatch({
  'meansqerr': {
    'topic': function() {
      return jStat;
    },
    'return basic meansqerr': function(jStat) {
      assert.equal(jStat.meansqerr([1, 2, 3, 4]), 1.25);
    },
    'meansqerr from instance': function(jStat) {
      assert.equal(jStat([1, 2, 3, 4]).meansqerr(), 1.25);
    },
    'meansqerr matrix cols': function(jStat) {
      assert.deepEqual(jStat([[1, 2], [3, 4]]).meansqerr(), [1, 1]);
    }
  },
  '#meansqerr vector': {
    'topic': function() {
      jStat([1, 2, 3, 4]).meansqerr(this.callback);
    },
    'meansqerr callback': function(val, stat) {
      assert.equal(val, 1.25);
    }
  },
  '#meansqerr matrix cols': {
    'topic': function() {
      jStat([[1, 2], [3, 4]]).meansqerr(this.callback);
    },
    'meansqerr matrix cols callback': function(val, stat) {
      assert.deepEqual(val, [1, 1]);
    }
  }
});

suite.export(module);
