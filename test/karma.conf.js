'use strict';

module.exports = function(config) {
	config.set({
		basePath: '../',
		frameworks: ['mocha', 'sinon-expect', 'commonjs'],
		files: [
			'node_modules/react/dist/react.js',
			'lib/*.js',
			'test/*_test.js'
		],
		port: 8080,
		logLevel: config.LOG_INFO,
		autoWatch: false,
		singleRun: true,
		browsers: ['Firefox'],
		reporters: ['spec', 'coverage'],
		preprocessors: {
			'lib/*.js': ['commonjs', 'coverage'],
			'test/*_test.js': ['commonjs']
		},
		coverageReporter: {
			type : 'html',
			dir : 'coverage/'
		}
	});
};
