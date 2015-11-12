'use strict';

module.exports = function(config) {
	config.set({
		basePath: '../',
		frameworks: ['mocha', 'sinon-expect'],
		files: [
			'test/*_test.js'
		],
		logLevel: config.LOG_INFO,
		autoWatch: false,
		singleRun: true,
		browsers: ['Firefox'],
		reporters: ['spec'],
		preprocessors: {
			'test/*_test.js': ['webpack']
		}
	});
};
