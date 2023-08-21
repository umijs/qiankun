'use strict';

var GetIntrinsic = require('get-intrinsic');

var $TypeError = GetIntrinsic('%TypeError%');

var Call = require('es-abstract/2022/Call');
var CompletionRecord = require('es-abstract/2022/CompletionRecord');
var GetMethod = require('es-abstract/2022/GetMethod');
var Type = require('es-abstract/2022/Type');

var assertRecord = require('es-abstract/helpers/assertRecord');

// https://262.ecma-international.org/14.0/#sec-iteratorclose

module.exports = function IteratorClose(iteratorRecord, completion) {
	assertRecord(Type, 'Iterator Record', 'iteratorRecord', iteratorRecord);
	if (Type(iteratorRecord['[[Iterator]]']) !== 'Object') {
		throw new $TypeError('Assertion failed: iteratorRecord.[[Iterator]] must be an Object'); // step 1
	}

	if (!(completion instanceof CompletionRecord)) { // step 2
		throw new $TypeError('Assertion failed: completion is not a Completion Record instance');
	}
	var completionThunk = function () {
		var value = completion.value();
		if (completion.type() === 'throw') {
			throw value;
		}
		return value;
	};

	var iterator = iteratorRecord['[[Iterator]]']; // step 3

	var iteratorReturn;
	try {
		iteratorReturn = GetMethod(iterator, 'return'); // step 4
	} catch (e) {
		completionThunk(); // throws if `completion` is a throw completion // step 6
		completionThunk = null; // ensure it's not called twice.
		throw e; // step 7
	}
	if (typeof iteratorReturn === 'undefined') {
		return completionThunk(); // step 5.a - 5.b
	}

	var innerResult;
	try {
		innerResult = Call(iteratorReturn, iterator, []);
	} catch (e) {
		// if we hit here, then "e" is the innerResult completion that needs re-throwing

		completionThunk(); // throws if `completion` is a throw completion // step 6
		completionThunk = null; // ensure it's not called twice.

		// if not, then return the innerResult completion
		throw e; // step 7
	}
	var completionRecord = completionThunk(); // if innerResult worked, then throw if the completion does
	completionThunk = null; // ensure it's not called twice.

	if (Type(innerResult) !== 'Object') {
		throw new $TypeError('iterator .return must return an object');
	}

	return completionRecord;
};
