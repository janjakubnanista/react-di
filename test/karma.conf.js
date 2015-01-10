'use strict';

module.exports = function(config) {
	config.set({
		basePath: '',
		frameworks: ['mocha', 'sinon-expect'],
		files: [
			'../node_modules/react/dist/react.js',
			'../dist/react-di.js',
			'*_test.js'
		],
		port: 8080,
		logLevel: config.LOG_INFO,
		autoWatch: false,
		singleRun: true,
		browsers: ['Firefox'],
		reporters: ['spec']
	});
};
