'use strict';

var CreateDataPropertyOrThrow = require('es-abstract/2022/CreateDataPropertyOrThrow');
var OrdinaryObjectCreate = require('es-abstract/2022/OrdinaryObjectCreate');

var forEach = require('es-abstract/helpers/forEach');

var GroupBy = require('./aos/GroupBy'); // TODO: replace with es-abstract 2024 implementation

module.exports = function groupBy(items, callbackfn) {
	var groups = GroupBy(items, callbackfn, 'property'); // step 1

	var obj = OrdinaryObjectCreate(null); // step 2

	forEach(groups, function (g) { // step 3
		CreateDataPropertyOrThrow(obj, g['[[Key]]'], g['[[Elements]]']); // steps 3.a - 3.b
	});

	return obj; // step 4
};
