'use strict';
const chalk = require('chalk');
const cliCursor = require('cli-cursor');
const cliSpinners = require('cli-spinners');
const logSymbols = require('log-symbols');

class Ora {
	constructor(options) {
		if (typeof options === 'string') {
			options = {
				text: options
			};
		}

		this.options = Object.assign({
			text: '',
			color: 'cyan',
			stream: process.stderr
		}, options);

		const sp = this.options.spinner;
		this.spinner = typeof sp === 'object' ? sp : (process.platform === 'win32' ? cliSpinners.line : (cliSpinners[sp] || cliSpinners.dots)); // eslint-disable-line no-nested-ternary

		if (this.spinner.frames === undefined) {
			throw new Error('Spinner must define `frames`');
		}

		this.text = this.options.text;
		this.color = this.options.color;
		this.interval = this.options.interval || this.spinner.interval || 100;
		this.stream = this.options.stream;
		this.id = null;
		this.frameIndex = 0;
		this.enabled = typeof this.options.enabled === 'boolean' ? this.options.enabled : ((this.stream && this.stream.isTTY) && !process.env.CI);
	}
	frame() {
		const frames = this.spinner.frames;
		let frame = frames[this.frameIndex];

		if (this.color) {
			frame = chalk[this.color](frame);
		}

		this.frameIndex = ++this.frameIndex % frames.length;

		return frame + ' ' + this.text;
	}
	clear() {
		if (!this.enabled) {
			return this;
		}

		this.stream.clearLine();
		this.stream.cursorTo(0);

		return this;
	}
	render() {
		this.clear();
		this.stream.write(this.frame());

		return this;
	}
	start(text) {
		if (text) {
			this.text = text;
		}

		if (!this.enabled || this.id) {
			return this;
		}

		cliCursor.hide(this.stream);
		this.render();
		this.id = setInterval(this.render.bind(this), this.interval);

		return this;
	}
	stop() {
		if (!this.enabled) {
			return this;
		}

		clearInterval(this.id);
		this.id = null;
		this.frameIndex = 0;
		this.clear();
		cliCursor.show(this.stream);

		return this;
	}
	succeed(text) {
		return this.stopAndPersist({symbol: logSymbols.success, text});
	}
	fail(text) {
		return this.stopAndPersist({symbol: logSymbols.error, text});
	}
	warn(text) {
		return this.stopAndPersist({symbol: logSymbols.warning, text});
	}
	info(text) {
		return this.stopAndPersist({symbol: logSymbols.info, text});
	}
	stopAndPersist(options) {
		if (!this.enabled) {
			return this;
		}

		// Legacy argument
		// TODO: Deprecate sometime in the future
		if (typeof options === 'string') {
			options = {
				symbol: options
			};
		}

		options = options || {};

		this.stop();
		this.stream.write(`${options.symbol || ' '} ${options.text || this.text}\n`);

		return this;
	}
}

module.exports = function (opts) {
	return new Ora(opts);
};

module.exports.promise = (action, options) => {
	if (typeof action.then !== 'function') {
		throw new TypeError('Parameter `action` must be a Promise');
	}

	const spinner = new Ora(options);
	spinner.start();

	action.then(
		() => {
			spinner.succeed();
		},
		() => {
			spinner.fail();
		}
	);

	return spinner;
};
