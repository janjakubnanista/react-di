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
