var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.distribution');

require('../env.js');

suite.addBatch({
  'studentt pdf': {
    'topic': function() {
      return jStat;
    },
    //Checked against R dt(x,df)
    'check pdf calculation': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.studentt.pdf(0.5, 40), 0.3489195);
      assert.epsilon(tol, jStat.studentt.pdf(-1.0, 20), 0.2360456);
    },
    'check pdf calculation for large parameters': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.studentt.pdf(0.45, 400), 0.3602198);
      assert.epsilon(tol, jStat.studentt.pdf(2.95, 525), 0.005283244);
    },
    //Checked against R's pt(x, df)
    'check cdf calculation': function(jStat) {
      var tol = 0.0000001;
      var x = 0.5;
      var df = 40;
      assert.epsilon(tol, jStat.studentt.cdf(x, df), 0.6900926);
    },
    //Checked against R's qt(x, df)
    'check inv calculation': function(jStat) {
      var tol = 0.0000001;
      assert.epsilon(tol, jStat.studentt.inv(0.5, 40), 0);
      assert.epsilon(tol, jStat.studentt.inv(0.7, 20), 0.5328628);
      assert.epsilon(tol, jStat.studentt.inv(0.2, 10), -0.8790578);
    }
  },
});

suite.export(module);
