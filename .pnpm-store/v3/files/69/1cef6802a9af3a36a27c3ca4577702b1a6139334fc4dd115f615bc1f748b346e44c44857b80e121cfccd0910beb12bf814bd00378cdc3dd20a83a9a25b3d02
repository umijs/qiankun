var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.distribution');

require('../env.js');

suite.addBatch({
  'tukey cdf': {
    'topic': function() {
      return jStat;
    },
    'check cdf calculation': function(jStat) {
      var tol = 0.0000001;
      // Answers obtained from R's ptukey()
      var q = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      var k2v2 = [0.0000000, 0.4472266, 0.7071328, 0.8320894, 0.8944794, 0.9285421, 0.9487620, 0.9616160, 0.9702482, 0.9763065];
      var k2v100 = [0.0000000, 0.5188553, 0.8395949, 0.9636331, 0.9943478, 0.9993817, 0.9999506, 0.9999970, 0.9999999, 1.0000000];
      var k100v100 = [0.000000e+00, 0.000000e+00, 0.000000e+00, 5.654157e-05, 5.078565e-02, 5.034959e-01, 9.022779e-01, 9.906062e-01, 9.994254e-01, 9.999738e-01];
      var k100v500 = [0.000000e+00, 0.000000e+00, 0.000000e+00, 7.227379e-06, 3.438621e-02, 5.170646e-01, 9.304461e-01, 9.960479e-01, 9.998819e-01, 9.999979e-01];
      for (var i = 0; i < q.length; ++i) {
        assert.epsilon(tol, jStat.tukey.cdf(q[i], 2, 2), k2v2[i]);
        assert.epsilon(tol, jStat.tukey.cdf(q[i], 2, 100), k2v100[i]);
        assert.epsilon(tol, jStat.tukey.cdf(q[i], 100, 100), k100v100[i]);
        assert.epsilon(tol, jStat.tukey.cdf(q[i], 100, 500), k100v500[i]);
      }
    }
  },
  'tukey inv': {
    'topic': function() {
      return jStat;
    },
    'check inv calculation': function(jStat) {
      var tol = 0.0001;
      // Answers obtained from R's qtukey()
      var p = [0.9, 0.95, 0.997, 0.9995];
      var k2v2 = [4.128183, 6.079637, 24.226336, 40.514830];
      var k2v100 = [2.347926, 2.805759, 4.302286, 5.088820];
      var k100v100 = [5.988671, 6.312643, 7.424273, 8.046847];
      var k100v500 = [5.848500, 6.130686, 7.084854, 7.607542];
      for (var i = 0; i < p.length; ++i) {
        assert.epsilon(tol, jStat.tukey.inv(p[i], 2, 2), k2v2[i]);
        assert.epsilon(tol, jStat.tukey.inv(p[i], 2, 100), k2v100[i]);
        assert.epsilon(tol, jStat.tukey.inv(p[i], 100, 100), k100v100[i]);
        assert.epsilon(tol, jStat.tukey.inv(p[i], 100, 500), k100v500[i]);
      }
    }
  }
});

suite.export(module);
