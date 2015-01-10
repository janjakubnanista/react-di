'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var path = require('path');
var webpack = require('gulp-webpack');

gulp.task('build', function() {
	return gulp.src(path.join('lib/resolver.js'))
		.pipe(webpack({
			target: 'web',
			output: {
				library: 'ReactDI',
				libraryTarget: 'umd'
			}
		}))
		.pipe(concat('react-di.js'))
		.pipe(gulp.dest('dist'));
});

gulp.task('dev', ['build', 'test'], function() {
	gulp.watch(['lib/**', 'test/*_test.js'], ['test']);
});

gulp.task('test', ['build'], function(done) {
	var server = require('karma').server,
		options = {
			configFile: __dirname + '/test/karma.conf.js'
		};

	server.start(options, function() {
		done();
	});
});
