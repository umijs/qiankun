var assert = require('assert');
var humps = require('../humps');

describe('humps', function() {
  'use strict';
  var actual;

  // =========
  // = Setup =
  // =========

  beforeEach(function() {
    this.simple_obj = {
      attr_one: 'foo',
      attr_two: 'bar'
    };

    this.simpleCamelObj = {
      attrOne: 'foo',
      attrTwo: 'bar'
    };

    this.simplePascalObj = {
      AttrOne: 'foo',
      AttrTwo: 'bar'
    };

    this.complex_obj = {
      attr_one: 'foo',
      attr_two: {
        nested_attr1: 'bar'
      },
      attr_three: {
        nested_attr2: {
          nested_attr3: [{
            nested_in_array1: 'baz'
          }, {
            nested_in_array2: 'hello'
          }, {
            nested_in_array3: ['world', 'boo']
          }]
        }
      }
    };

    this.complexCamelObj = {
      attrOne: 'foo',
      attrTwo: {
        nestedAttr1: 'bar'
      },
      attrThree: {
        nestedAttr2: {
          nestedAttr3: [{
            nestedInArray1: 'baz'
          }, {
            nestedInArray2: 'hello'
          }, {
            nestedInArray3: ['world', 'boo']
          }]
        }
      }
    };

    this.complexPascalObj = {
      AttrOne: 'foo',
      AttrTwo: {
        NestedAttr1: 'bar'
      },
      AttrThree: {
        NestedAttr2: {
          NestedAttr3: [{
            NestedInArray1: 'baz'
          }, {
            NestedInArray2: 'hello'
          }, {
            NestedInArray3: ['world', 'boo']
          }]
        }
      }
    };

    this.complexIgnoringNumbersObj = {
      attr_one: 'foo',
      attr_two: {
        nested_attr1: 'bar'
      },
      attr_three: {
        nested_attr2: {
          nested_attr3: [{
            nested_in_array1: 'baz'
          }, {
            nested_in_array2: 'hello'
          }, {
            nested_in_array3: ['world', 'boo']
          }]
        }
      }
    };

    this.complexCustomObj = {
      'attr-one': 'foo',
      'attr-two': {
        'nested-attr1': 'bar'
      },
      'attr-three': {
        'nested-attr2': {
          'nested-attr3': [{
            'nested-in-array1': 'baz'
          }, {
            'nested-in-array2': 'hello'
          }, {
            'nested-in-array3': ['world', 'boo']
          }]
        }
      }
    };
  });

  // =========
  // = Specs =
  // =========

  describe('.camelizeKeys', function() {
    it('converts simple object keys to camelcase', function() {
      assert.deepEqual(humps.camelizeKeys(this.simple_obj), this.simpleCamelObj);
    });

    it('converts complex object keys to camelcase', function() {
      assert.deepEqual(humps.camelizeKeys(this.complex_obj), this.complexCamelObj);
    });

    it('does not attempt to process dates', function() {
      'work in progress';
      var date = new Date();
      var _object = {
        a_date: date
      };
      var convertedObject = {
        aDate: date
      };
      assert.deepEqual(humps.camelizeKeys(_object), convertedObject);
    });

    it('converts keys within arrays of objects', function() {
      var array = [{first_name: 'Sam'}, {first_name: 'Jenna'}],
        convertedArray = [{firstName: 'Sam'}, {firstName: 'Jenna'}],
        result = humps.camelizeKeys(array);
      assert.deepEqual(result, convertedArray);
      // Ensure it’s an array, and not an object with numeric keys
      assert.deepEqual(toString.call(result), '[object Array]');
    });

    describe("when the value is a function", function() {
      it('converts the key and assigns the function', function() {
        function myFunction() {
        }
        var _object = {
          a_function: myFunction
        };

        var result = humps.camelizeKeys(_object);
        // deepEqual treats functions as the same as an empty object
        assert.strictEqual(result.aFunction, myFunction);
      });
    });

    it('uses a custom convertion callback', function() {
      actual = humps.camelizeKeys(this.simple_obj, function(key, convert) {
        return key === 'attr_one' ? key : convert(key);
      });
      assert.deepEqual(actual, { attr_one: 'foo', attrTwo: 'bar' });
    });
  });

  describe('.decamelizeKeys', function() {
    it('converts simple objects with camelcased keys to underscored', function() {
      assert.deepEqual(humps.decamelizeKeys(this.simpleCamelObj), this.simple_obj);
    });

    it('converts complex objects with camelcased keys to underscored', function() {
      assert.deepEqual(humps.decamelizeKeys(this.complexCamelObj), this.complex_obj);
    });

    it('decamelizes keys with a custom separator', function() {
      actual = humps.decamelizeKeys(this.complexCamelObj, { separator: '-' });
      assert.deepEqual(actual, this.complexCustomObj);
    });

    it('uses a custom split regexp', function() {
      actual = humps.decamelizeKeys({ attr1: 'foo' }, { split: /(?=[A-Z0-9])/ });
      assert.deepEqual(actual, { attr_1: 'foo' });
    });

    it('uses a custom convertion callback', function() {
      actual = humps.decamelizeKeys(this.simpleCamelObj, function(key, convert, options) {
        return key === 'attrOne' ? key : convert(key, options);
      });
      assert.deepEqual(actual, { attrOne: 'foo', attr_two: 'bar' });
    });

    describe("when the value is a function", function() {
      it('converts the key and assigns the function', function() {
        function myFunction() {
        }
        var _object = {
          aFunction: myFunction
        };

        var result = humps.decamelizeKeys(_object);
        // deepEqual treats functions as the same as an empty object
        assert.strictEqual(result.a_function, myFunction);
      });
    });

    it('uses a custom convertion callback as an option', function() {
      actual = humps.decamelizeKeys(this.simpleCamelObj, {
        process: function(key, convert, options) {
          return key === 'attrOne' ? key : convert(key, options);
        }
      });
      assert.deepEqual(actual, { attrOne: 'foo', attr_two: 'bar' });
    });
  });

  describe('.pascalizeKeys', function() {
    it('converts simple object keys to PascalCase', function() {
      assert.deepEqual(humps.pascalizeKeys(this.simple_obj), this.simplePascalObj);
    });

    it('converts complex object keys to PascalCase', function() {
      assert.deepEqual(humps.pascalizeKeys(this.complex_obj), this.complexPascalObj);
    });

    it('does not attempt to process dates', function() {
      'work in progress';
      var date = new Date();
      var _object = {
        a_date: date
      };
      var convertedObject = {
        ADate: date
      };
      assert.deepEqual(humps.pascalizeKeys(_object), convertedObject);
    });

    it('uses a custom convertion callback', function() {
      actual = humps.pascalizeKeys(this.simple_obj, function(key, convert) {
        return key === 'attr_one' ? key : convert(key);
      });
      assert.deepEqual(actual, { attr_one: 'foo', AttrTwo: 'bar' });
    });
  });

  describe('.depascalizeKeys', function() {
    it('converts simple object with PascalCase keys to underscored', function() {
      assert.deepEqual(humps.depascalizeKeys(this.simplePascalObj), this.simple_obj);
    });

    it('converts complex object with PascalCase keys to underscored', function() {
      assert.deepEqual(humps.depascalizeKeys(this.complexPascalObj), this.complex_obj);
    });

    it('depascalizes keys with a custom separator', function() {
      actual = humps.depascalizeKeys(this.complexPascalObj, { separator: '-' });
      assert.deepEqual(actual, this.complexCustomObj);
    });
  });

  describe('.camelize', function() {
    it('converts underscored strings to camelcase', function() {
      assert.equal(humps.camelize('hello_world'), 'helloWorld');
    });

    it('converts hyphenated strings to camelcase', function() {
      assert.equal(humps.camelize('hello-world'), 'helloWorld');
      assert.equal(humps.camelize('hello-world-1'), 'helloWorld1');
    });

    it('converts space-separated strings to camelcase', function() {
      assert.equal(humps.camelize('hello world'), 'helloWorld');
    });

    it('converts PascalCased strings to camelcase', function() {
      assert.equal(humps.camelize('HelloWorld'), 'helloWorld');
    });

    it('keeps numbers unchanged', function() {
      assert.equal(humps.camelize('-1'), '-1');
      assert.equal(humps.camelize('1'), '1');
    });
  });

  describe('.decamelize', function() {
    it('converts camelcased strings to underscored', function() {
      assert.equal(humps.decamelize('helloWorld'), 'hello_world');
    });

    it('decamelizes strings with custom separator', function() {
      actual = humps.decamelize('helloWorld', { separator: '-' });
      assert.equal(actual, 'hello-world');
    });

    it('does not separate on digits', function() {
      assert.equal(humps.decamelize('helloWorld1'), 'hello_world1');
    });

    it('uses a custom split regexp', function() {
      assert.equal(humps.decamelize('helloWorld1', { split: /(?=[A-Z0-9])/ }),
        'hello_world_1');
    });
  });

  describe('.pascalize', function() {
    it('converts underscored strings to PascalCase', function() {
      assert.equal(humps.pascalize('hello_world'), 'HelloWorld');
    });

    it('converts hyphenated strings to PascalCase', function() {
      assert.equal(humps.pascalize('hello-world'), 'HelloWorld');
    });

    it('converts space-separated strings to PascalCase', function() {
      assert.equal(humps.pascalize('hello world'), 'HelloWorld');
    });
  });
});
