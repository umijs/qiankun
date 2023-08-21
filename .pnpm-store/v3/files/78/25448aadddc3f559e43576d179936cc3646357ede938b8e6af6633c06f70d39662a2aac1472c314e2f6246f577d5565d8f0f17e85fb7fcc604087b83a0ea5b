var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.rand');

require('../env.js');

suite.addBatch({
  'rand': {
    'topic': function() {
      return jStat;
    },
    'return rand': function(jStat) {
      assert.isTrue(jStat.rand(2) instanceof Array);
    },
    'rand from empty jStat object': function (jStat) {
      assert.isTrue(jStat().rand(2) instanceof jStat);
    }
  }
});

suite.export(module);
