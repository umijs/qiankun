'use strict'
var __extends =
	(this && this.__extends) ||
	(function () {
		var extendStatics = function (d, b) {
			extendStatics =
				Object.setPrototypeOf ||
				({ __proto__: [] } instanceof Array &&
					function (d, b) {
						d.__proto__ = b
					}) ||
				function (d, b) {
					for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]
				}
			return extendStatics(d, b)
		}
		return function (d, b) {
			extendStatics(d, b)
			function __() {
				this.constructor = d
			}
			d.prototype =
				b === null ? Object.create(b) : ((__.prototype = b.prototype), new __())
		}
	})()
Object.defineProperty(exports, '__esModule', { value: true })
/** Only accept codes that are numbers, otherwise discard them */
function parseCode(code) {
	var number = Number(code)
	if (isNaN(number)) return null
	return number
}
/** Fetch the code from the value */
function fetchCode(value) {
	return (
		value &&
		(parseCode(value.exitCode) ||
			parseCode(value.errno) ||
			parseCode(value.code))
	)
}
/** Prevent [a weird error on node version 4](https://github.com/bevry/errlop/issues/1) and below. */
function isValid(value) {
	/* eslint no-use-before-define:0 */
	return value instanceof Error || Errlop.isErrlop(value)
}
var Errlop = /** @class */ (function (_super) {
	__extends(Errlop, _super)
	/**
	 * Create an instance of an error, using a message, as well as an optional parent.
	 * If the parent is provided, then the `fullStack` property will include its stack too
	 */
	function Errlop(input, parent) {
		var _this = this
		if (!input) throw new Error('Attempted to create an Errlop without a input')
		// Instantiate with the above
		_this = _super.call(this, input.message || input) || this
		// Apply
		_this.klass = Errlop
		_this.parent = parent || input.parent
		_this.ancestors = []
		var ancestor = _this.parent
		while (ancestor) {
			_this.ancestors.push(ancestor)
			ancestor = ancestor.parent
		}
		// this code must support node 0.8, as well as prevent a weird bug in node v4
		// https://travis-ci.org/bevry/editions/jobs/408828147
		var exitCode = fetchCode(input)
		if (exitCode == null) exitCode = fetchCode(_this)
		for (
			var index = 0;
			index < _this.ancestors.length && exitCode == null;
			++index
		) {
			var error = _this.ancestors[index]
			if (isValid(error)) exitCode = fetchCode(error)
		}
		// Apply
		if (exitCode != null) {
			_this.exitCode = exitCode
		}
		_this.orphanStack = (input.stack || _this.stack).toString()
		_this.stack = _this.ancestors.reduce(function (accumulator, error) {
			return (
				accumulator + '\n\u21B3 ' + (error.orphanStack || error.stack || error)
			)
		}, _this.orphanStack)
		return _this
	}
	/**
	 * Syntatic sugar for Errlop class creation.
	 * Enables `Errlop.create(...args)` to achieve `new Errlop(...args)`
	 */
	Errlop.create = function (input, parent) {
		return new this(input, parent)
	}
	/** Check whether or not the value is an Errlop instance */
	Errlop.isErrlop = function (value) {
		return value && (value instanceof this || value.klass === this)
	}
	/** Ensure that the value is an Errlop instance */
	Errlop.ensure = function (value) {
		return this.isErrlop(value) ? value : this.create(value)
	}
	return Errlop
})(Error)
exports.default = Errlop
