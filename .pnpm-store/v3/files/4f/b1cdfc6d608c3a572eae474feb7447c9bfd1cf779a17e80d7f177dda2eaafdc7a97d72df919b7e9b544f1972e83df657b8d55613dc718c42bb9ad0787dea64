'use strict'
/** Only accept codes that are numbers, otherwise discard them */
function parseCode(code) {
	const number = Number(code)
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
export default class Errlop extends Error {
	/**
	 * Create an instance of an error, using a message, as well as an optional parent.
	 * If the parent is provided, then the `fullStack` property will include its stack too
	 */
	constructor(input, parent) {
		if (!input) throw new Error('Attempted to create an Errlop without a input')
		// Instantiate with the above
		super(input.message || input)
		// Apply
		this.klass = Errlop
		this.parent = parent || input.parent
		this.ancestors = []
		let ancestor = this.parent
		while (ancestor) {
			this.ancestors.push(ancestor)
			ancestor = ancestor.parent
		}
		// this code must support node 0.8, as well as prevent a weird bug in node v4
		// https://travis-ci.org/bevry/editions/jobs/408828147
		let exitCode = fetchCode(input)
		if (exitCode == null) exitCode = fetchCode(this)
		for (
			let index = 0;
			index < this.ancestors.length && exitCode == null;
			++index
		) {
			const error = this.ancestors[index]
			if (isValid(error)) exitCode = fetchCode(error)
		}
		// Apply
		if (exitCode != null) {
			this.exitCode = exitCode
		}
		this.orphanStack = (input.stack || this.stack).toString()
		this.stack = this.ancestors.reduce(
			(accumulator, error) =>
				`${accumulator}\n↳ ${error.orphanStack || error.stack || error}`,
			this.orphanStack
		)
	}
	/**
	 * Syntatic sugar for Errlop class creation.
	 * Enables `Errlop.create(...args)` to achieve `new Errlop(...args)`
	 */
	static create(input, parent) {
		return new this(input, parent)
	}
	/** Check whether or not the value is an Errlop instance */
	static isErrlop(value) {
		return value && (value instanceof this || value.klass === this)
	}
	/** Ensure that the value is an Errlop instance */
	static ensure(value) {
		return this.isErrlop(value) ? value : this.create(value)
	}
}
