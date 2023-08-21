var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.kurtosis');

require('../env.js');

suite.addBatch({
  'kurtosis': {
    'topic': function() {
      return jStat;
    },
    'returns accurate kurtosis value': function(jStat) {
      var set = [ // from normal distribution in R: > rnorm(12); kurtosis(set) => -0.51156
        -0.28157961, -0.75577350,  0.61554139,  0.26864022, -0.42703435, -0.99927791,
        -0.07113527, -1.39327183,  0.34871138,  1.17909042, -0.22951562,  0.22341714];
      var kurt = jStat.kurtosis(set);

      assert.isTrue( kurt > -0.51157 );
      assert.isTrue( kurt < -0.51155 );
    },
    'kurtosis from instance': function(jStat) {
      var set = [
        -0.28157961, -0.75577350,  0.61554139,  0.26864022, -0.42703435, -0.99927791,
        -0.07113527, -1.39327183,  0.34871138,  1.17909042, -0.22951562,  0.22341714];
      var kurt = jStat(set).kurtosis();

      assert.isTrue( kurt > -0.51157 );
      assert.isTrue( kurt < -0.51155 );
    }
  }
});

suite.export(module);
