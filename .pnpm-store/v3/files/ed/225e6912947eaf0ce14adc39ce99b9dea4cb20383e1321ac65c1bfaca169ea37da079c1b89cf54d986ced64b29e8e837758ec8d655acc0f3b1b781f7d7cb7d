'use strict'

type PotentialError = Errlop | Error | ErrorCodeHolder | string
interface ErrorCodeHolder {
	exitCode?: string | number
	errno?: string | number
	code?: string | number
}

/** Only accept codes that are numbers, otherwise discard them */
function parseCode(code: any): number | null {
	const number = Number(code)
	if (isNaN(number)) return null
	return number
}

/** Fetch the code from the value */
function fetchCode(value: any): string | number | null {
	return (
		value &&
		(parseCode(value.exitCode) ||
			parseCode(value.errno) ||
			parseCode(value.code))
	)
}

/** Prevent [a weird error on node version 4](https://github.com/bevry/errlop/issues/1) and below. */
function isValid(value: any): boolean {
	/* eslint no-use-before-define:0 */
	return value instanceof Error || Errlop.isErrlop(value)
}

export default class Errlop extends Error {
	/** Duck typing as node 4 and intanceof does not work for error extensions */
	public klass: typeof Errlop

	/**
	 * The parent error if it was provided.
	 * If a parent was provided, then use that, otherwise use the input's parent, if it exists.
	 */
	public parent?: Errlop | Error

	/** An array of all the ancestors. From parent, to grand parent, and so on. */
	public ancestors: Array<Errlop | Error>

	/**
	 * A numeric code to use for the exit status if desired by the consumer.
	 * It cycles through [input, this, ...ancestors] until it finds the first [exitCode, errno, code] that is valid.
	 */
	public exitCode?: string | number

	/**
	 * The stack for our instance alone, without any parents.
	 * If the input contained a stack, then use that.
	 */
	public orphanStack: string

	/**
	 * The stack which now contains the accumalated stacks of its ancestors.
	 * This is used instead of an alias like `fullStack` or the like, to ensure existing code that uses `err.stack` doesn't need to be changed to remain functional.
	 */
	public stack: string

	/**
	 * Syntatic sugar for Errlop class creation.
	 * Enables `Errlop.create(...args)` to achieve `new Errlop(...args)`
	 */
	static create(input: PotentialError, parent?: Errlop | Error): Errlop {
		return new this(input, parent)
	}

	/**
	 * Create an instance of an error, using a message, as well as an optional parent.
	 * If the parent is provided, then the `fullStack` property will include its stack too
	 */
	constructor(input: PotentialError, parent?: Errlop | Error) {
		if (!input) throw new Error('Attempted to create an Errlop without a input')

		// Instantiate with the above
		super((input as any).message || input)

		// Apply
		this.klass = Errlop
		this.parent = parent || (input as Errlop).parent
		this.ancestors = []
		let ancestor = this.parent
		while (ancestor) {
			this.ancestors.push(ancestor)
			ancestor = (ancestor as Errlop).parent
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
		this.orphanStack = ((input as any).stack || (this as any).stack).toString()
		this.stack = this.ancestors.reduce<string>(
			(accumulator, error) =>
				`${accumulator}\n↳ ${
					(error as Errlop).orphanStack || (error as Error).stack || error
				}`,
			this.orphanStack
		)
	}

	/** Check whether or not the value is an Errlop instance */
	static isErrlop(value: any): boolean {
		return value && (value instanceof this || value.klass === this)
	}

	/** Ensure that the value is an Errlop instance */
	static ensure(value: any): Errlop {
		return this.isErrlop(value) ? value : this.create(value)
	}
}
