'use strict';
module.exports = input => {
	const isExtendedLengthPath = /^\\\\\?\\/.test(input);

	if (isExtendedLengthPath) {
		return input;
	}

	return input.replace(/\\/g, '/');
};
