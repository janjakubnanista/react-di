'use strict';

module.exports = function(config) {
	config.set({
		basePath: '../',
		frameworks: ['mocha', 'sinon-expect', 'browserify'],
		files: [
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
			'lib/*.js': ['browserify', 'coverage'],
			'test/*_test.js': ['browserify']
		},
		coverageReporter: {
			type : 'html',
			dir : 'coverage/'
		},
		browserify: {
			transform: [['envify', { NODE_ENV: 'development' }]]
		}
	});
};
