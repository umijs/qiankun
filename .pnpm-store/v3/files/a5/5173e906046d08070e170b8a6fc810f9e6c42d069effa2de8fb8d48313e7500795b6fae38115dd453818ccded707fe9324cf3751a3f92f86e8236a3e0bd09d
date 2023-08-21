var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.distribution');

require('../env.js');

suite.addBatch({
  'negbin pdf': {
    'topic': function() {
      return jStat;
    },
    'check pdf calculation': function(jStat) {
      var k = 10; // number of failures
      var r = 5; // threshold number of successes
      var p = 0.25; // probability of a success
      assert(jStat.negbin.pdf(k, r, p), 0.05504866037517786);
    }
  },

  'negbin cdf': {
    'topic': function() {
      return jStat;
    },
    'check pdf calculation': function(jStat) {
      var k = 10; // number of failures
      var r = 5; // threshold number of successes
      var p = 0.25; // probability of a success
      assert(jStat.negbin.cdf(k, r, p), 0.3135140584781766);
    }
  },
});

suite.export(module);
