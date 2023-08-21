var vows = require('vows');
var assert = require('assert');
var suite = vows.describe('jStat.utils');

require('../env.js');

suite.addBatch({
  'jStat': {
    'topic': function() {
      return jStat.utils;
    },
    'calcRdx': function(utils) {
      assert.equal(utils.calcRdx(1e5, 1e10), 1e7);
    },
    'isArray': function(utils) {
      assert.isFalse(utils.isArray(true));
      assert.isFalse(utils.isArray({}));
      assert.isFalse(utils.isArray('123'));
      assert.isFalse(utils.isArray(/reg/));
      assert.isFalse(utils.isArray(1234));
      assert.isFalse(utils.isArray(function() {}));
      assert.isTrue(utils.isArray([]));
    },
    'isFunction': function(utils) {
      assert.isFalse(utils.isFunction(true));
      assert.isFalse(utils.isFunction([]));
      assert.isFalse(utils.isFunction({}));
      assert.isFalse(utils.isFunction('123'));
      assert.isFalse(utils.isFunction(/reg/));
      assert.isFalse(utils.isFunction(1234));
      assert.isTrue(utils.isFunction(function() {}));
    },
    'isNumber': function(utils) {
      assert.isTrue(utils.isNumber(5e3));
      assert.isTrue(utils.isNumber(0xff));
      assert.isTrue(utils.isNumber(-1.1));
      assert.isTrue(utils.isNumber(0));
      assert.isTrue(utils.isNumber(1));
      assert.isTrue(utils.isNumber(1.1));
      assert.isTrue(utils.isNumber(10));
      assert.isTrue(utils.isNumber(10.10));
      assert.isTrue(utils.isNumber(100));
      assert.isTrue(utils.isNumber(parseInt('012')));
      assert.isTrue(utils.isNumber(parseFloat('012')));

      assert.isFalse(utils.isNumber('-1.1'));
      assert.isFalse(utils.isNumber('0'));
      assert.isFalse(utils.isNumber('012'));
      assert.isFalse(utils.isNumber('0xff'));
      assert.isFalse(utils.isNumber('1'));
      assert.isFalse(utils.isNumber('1.1'));
      assert.isFalse(utils.isNumber('10'));
      assert.isFalse(utils.isNumber('10.10'));
      assert.isFalse(utils.isNumber('100'));
      assert.isFalse(utils.isNumber('5e3'));
      assert.isFalse(utils.isNumber(Infinity));
      assert.isFalse(utils.isNumber(NaN));
      assert.isFalse(utils.isNumber(null));
      assert.isFalse(utils.isNumber(undefined));
      assert.isFalse(utils.isNumber(''));
      assert.isFalse(utils.isNumber('   '));
      assert.isFalse(utils.isNumber('foo'));
      assert.isFalse(utils.isNumber([1]));
      assert.isFalse(utils.isNumber([]));
      assert.isFalse(utils.isNumber(function () {}));
      assert.isFalse(utils.isNumber({}));
    }
  }
});

suite.export(module);
