var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat');

require('../env.js');

suite.addBatch({
  'least squard solver by QR decomposition': {
    'topic': function() {
      return jStat;
    },
    'matrix call': function(jStat) {
      var A=jStat.arange(100).map(function() {
        return jStat.arange(3).map(function() {
          return jStat.normal.sample(0, 1)
        });
      });
      var e=jStat.arange(100).map(function() {
        return [jStat.normal.sample(0, 1) * 0.001];
      });
      var coef = [[1], [2], [3]];
      var y = jStat.add(jStat.multiply(A, coef), e);
      var coef_bar = jStat.lstsq(A, y);
      var tol = 0.1;
      assert.epsilon(tol, coef_bar[0][0] ,1);
      assert.epsilon(tol, coef_bar[1][0] ,2);
      assert.epsilon(tol, coef_bar[2][0] ,3);
    },
    'array call': function(jStat) {
      var A = jStat.arange(100).map(function() {
        return jStat.arange(3).map(function() {
          return jStat.normal.sample(0, 1);
        });
      });
      var e = jStat.arange(100).map(function() {
        return [jStat.normal.sample(0, 1) * 0.001];
      });
      var coef = [[1], [2], [3]];
      var y = jStat.add(jStat.multiply(A, coef), e);
      y = y.map(function(i){ return i[0] });
      var coef_bar = jStat.lstsq(A,y);
      var tol = 0.1;
      assert.epsilon(tol, coef_bar[0] ,1);
      assert.epsilon(tol, coef_bar[1] ,2);
      assert.epsilon(tol, coef_bar[2] ,3);
    }
  }
});

suite.export(module);
