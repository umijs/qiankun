var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.extend');

require('../env.js');

suite.addBatch({
  'jStat': {
    'topic': function() {
      return jStat.extend;
    },
    'extending': function(extend) {
      assert.deepEqual(extend({ happy: 'sad' }, { here: 'there' }),
                       { happy: 'sad', here: 'there' });
      assert.deepEqual(extend({ one: 'two' }, { one: 'more' }),
                       { one: 'more' });
    }
  }
});

suite.export(module);
