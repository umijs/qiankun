var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat');

require('../env.js');

suite.addBatch({
  'anovafscore ': {
    'topic': function() {
      return jStat;
    },
    'anovafscore control test': function(jStat) {
      var control = [433.579, 471.484, 487.407, 518.166, 444.534,
                     434.615, 447.401, 525.873, 421.322, 425.949];
      var test = [356.139, 315.869, 327.203, 335.308, 332.547, 336.871,
                  353.809, 333.462, 349.203, 340.051];
      assert.equal(jStat.anovafscore(control, test), 94.76896135161758);
      assert.equal(jStat.anovafscore(test, control), 94.76896135161758);
    }
  }
});

suite.export(module);
