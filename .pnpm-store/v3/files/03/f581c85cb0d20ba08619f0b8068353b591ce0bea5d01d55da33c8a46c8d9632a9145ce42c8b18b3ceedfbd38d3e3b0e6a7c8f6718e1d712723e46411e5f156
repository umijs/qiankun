"use strict";

var flatMap = require('../index')
  , assert = require('assert');

var words = [ "one", "two", "three", "four", "five" ];

describe("flatmap function", function() {

  it("should unwrap arrays returned from iterator", function() {
    var arr = flatMap(words, function(w) {
      return w.split('');
    });
    assert.ok(Array.isArray(arr));
    assert.equal(arr.join(","), "o,n,e,t,w,o,t,h,r,e,e,f,o,u,r,f,i,v,e");
    assert.equal(arr.length, 19);
  });

  it("should return empty arrays on non-array argument", function() {
    var arr = flatMap({}, function(w) {
      return '';
    });
    assert.ok(Array.isArray(arr));
    assert.equal(arr.length, 0);
  });

  it("should return empty arrays on undefined argument", function() {
    var arr = flatMap(undefined, function(w) {
      return '';
    });
    assert.ok(Array.isArray(arr));
    assert.equal(arr.length, 0);
  });

  it("should return empty arrays when iterator returns nulls", function() {
    var arr = flatMap(words, function() {
      return null;
    });
    assert.ok(Array.isArray(arr));
    assert.equal(arr.length, 0);
  });

  it("should work like filter when iterator returns nulls", function() {
    var arr = flatMap(words, function(w) {
      return w.length % 2 == 0 ? w : null;
    });
    assert.ok(Array.isArray(arr));
    assert.equal(arr.length, 2);
    assert.equal(arr.join(''), 'fourfive');
  });

  it("augment or shrink results", function() {
    var iter = function(w) {
      return w.length % 2 == 0 ? [ 2, 2 ] : [1];
    };
    assert.equal(flatMap(['bee', 'warp'], iter).length, 3);
    assert.equal(flatMap(['be', 'warp'], iter).length, 4);
    assert.equal(flatMap([], iter).length, 0);
  });

});