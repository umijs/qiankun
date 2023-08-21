'use strict';
const fs = require('fs');
const path = require('path');

// Prevent caching of this module so module.parent is always accurate
delete require.cache[__filename];
const parentFile = module.parent.filename;
const parentDir = path.dirname(parentFile);

module.exports = (dir, opts) => {
	dir = path.resolve(parentDir, dir || '');
	opts = Object.assign({camelize: true}, opts);

	let files;

	try {
		files = fs.readdirSync(dir);
	} catch (err) {
		return {};
	}

	const done = new Set();
	const ret = {};

	// Adhere to the Node.js require algorithm by trying each extension in order
	for (const ext of Object.keys(require.extensions)) {
		for (const file of files) {
			const stem = path.basename(file).replace(/\.\w+$/, '');
			const fullPath = path.join(dir, file);

			if (done.has(stem) ||
				fullPath === parentFile ||
				path.extname(file) !== ext ||
				stem[0] === '_' ||
				stem[0] === '.') {
				continue;
			}

			const exportKey = opts.camelize ? stem.replace(/-(\w)/g, (m, p1) => p1.toUpperCase()) : stem;

			ret[exportKey] = require(fullPath);
			done.add(stem);
		}
	}

	return ret;
};

