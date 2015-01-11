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
		reporters: ['spec'],
		preprocessors: {
			'lib/*.js': ['commonjs'],
			'test/*_test.js': ['commonjs']
		}
	});
};
