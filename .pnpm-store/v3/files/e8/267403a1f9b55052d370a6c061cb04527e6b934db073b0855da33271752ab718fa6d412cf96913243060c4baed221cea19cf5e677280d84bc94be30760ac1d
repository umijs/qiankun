var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat');

require('../env.js');

suite.addBatch({
  'QR decomposition': {
    'topic': function() {
      return jStat;
    },
    'example1': function(jStat) {
      var A = [[12, -51, 4], [6, 167, -68], [-4, 24, -41]];
      var QR = jStat.QR(A);
      var Q = QR[0];
      var R = QR[1];
      var tol = 0.0001;
      assert.epsilon(tol, Q[0][0], 0.8571428571428571);
      assert.epsilon(tol, Q[0][1], -0.39428571428571446);
      assert.epsilon(tol, Q[0][2], -0.3314285714285714);
      assert.epsilon(tol, Q[1][0], 0.4285714285714286);
      assert.epsilon(tol, Q[1][1], 0.902857142857143);
      assert.epsilon(tol, Q[1][2], 0.034285714285714315);
      assert.epsilon(tol, Q[2][0], -0.28571428571428575);
      assert.epsilon(tol, Q[2][1], 0.1714285714285711);
      assert.epsilon(tol, Q[2][2], -0.9428571428571428);
      assert.epsilon(tol, R[0][0], 13.999999999999998);
      assert.epsilon(tol, R[0][1], 21.00000000000001);
      assert.epsilon(tol, R[0][2], -14.0);
      assert.epsilon(tol, R[1][0], 5.506706202140777e-16);
      assert.epsilon(tol, R[1][1], 175.00000000000003);
      assert.epsilon(tol, R[1][2], -70.0);
      assert.epsilon(tol, R[2][0], 3.0198066269804255e-16);
      assert.epsilon(tol, R[2][1], 9.237055564881295e-16);
      assert.epsilon(tol, R[2][2], 35.0);
    }
  }
});

suite.export(module);
