var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.distribution');

require('../env.js');

suite.addBatch({
  'non-central-t cdf': {
    'topic': function() {
      return jStat;
    },
    //Checked against R pt(x,df,ncp)
    'check cdf calculation': function(jStat) {
      var tol = 0.0000001;
        assert.epsilon(tol, jStat.noncentralt.cdf(-0.5, 3, 2), 0.007800301076444027);
        assert.epsilon(tol, jStat.noncentralt.cdf(0.5, 3, 2), 0.06547898556460677);
        assert.epsilon(tol, jStat.noncentralt.cdf(7, 3, 2), 0.9527511310481739);

        assert.epsilon(tol, jStat.noncentralt.cdf(23, 8, 25), 0.3084615014611897);
        assert.epsilon(tol, jStat.noncentralt.cdf(30, 8, 25), 0.695466162732754);

        assert.epsilon(tol, jStat.noncentralt.cdf(2, 28, 5), 0.001787373536766708);
        assert.epsilon(tol, jStat.noncentralt.cdf(8, 28, 5), 0.9790186262147481);
    },
    //Checked against R's dt(x, df, ncp)
    'check pdf calculation': function(jStat) {
      var tol = 0.0000001;
        assert.epsilon(tol, jStat.noncentralt.pdf(-0.5, 3, 2), 0.0159905834194889);
        assert.epsilon(tol, jStat.noncentralt.pdf(0.5, 3, 2), 0.1296653879954894);
        assert.epsilon(tol, jStat.noncentralt.pdf(7, 3, 2), 0.01796331192039574);

        assert.epsilon(tol, jStat.noncentralt.pdf(23, 8, 25), 0.06329514733502346);
        assert.epsilon(tol, jStat.noncentralt.pdf(30, 8, 25), 0.04088472607966773);

        assert.epsilon(tol, jStat.noncentralt.pdf(2, 28, 5), 0.006044279465609167);
        assert.epsilon(tol, jStat.noncentralt.pdf(8, 28, 5), 0.02883829067311495);

    }
  },
});

suite.export(module);
