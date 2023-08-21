#!/usr/bin/env node

const { check } = require('../src/checker');

check(process.argv[2]).then((conflicts) => {
	if (conflicts && conflicts.length) {
		process.exitCode = 1;
		console.error(
			'Conflicting rule(s) detected in your stylelint configuration:\n' +
				conflicts.join('\n')
		);
	} else {
		console.log(
			'No conflicting rules detected in your stylelint configuration!'
		);
	}
});
