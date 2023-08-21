'use strict'

// As Errlop uses Editions, we should use a specific Errlop edition
// As otherwise, the circular reference may fail on some machines
// https://github.com/bevry/errlop/issues/2
import Errlop from 'errlop'

interface ErrtionOptions {
	message: string
	code: string | number
	level?: string | number
}

interface Errtion extends Errlop, ErrtionOptions {}

/**
 * Allow code and level inputs on Errlop.
 * We do this instead of a class extension, as class extensions do not interop well on node 0.8, which is our target.
 */
export function errtion(
	this: void,
	opts: ErrtionOptions,
	parent?: Errlop | Error
): Errtion {
	const { message, code, level } = opts
	const error = new Errlop(message, parent) as Errtion
	if (code) error.code = code
	if (level) error.level = level
	return error
}

/** Converts anything to a string, by returning strings and serialising objects. */
export function stringify(value: any): string {
	return typeof value === 'string' ? value : JSON.stringify(value)
}

/** Converts a version range like `4 || 6` to `>=4` */
export function simplifyRange(range: string): string {
	return range.replace(/^([.\-\w]+)(\s.+)?$/, '>=$1')
}
