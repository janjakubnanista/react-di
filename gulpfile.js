'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var path = require('path');
var webpack = require('gulp-webpack');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');

var argv = require('yargs').argv;
var minify = !!argv.minify;
var output = minify ? 'react-di.min.js' : 'react-di.js';
var env = minify ? 'production' : 'development';

var uglifyOptions = {
	mangle: true,
	compress: {
		sequences: true,
		dead_code: true,
		conditionals: true,
		booleans: true,
		unused: true,
		if_return: true,
		join_vars: true
	}
};

gulp.task('build', function() {
	return gulp.src(path.join('lib/resolver.js'))
		.pipe(webpack({
			target: 'web',
			output: {
				library: 'ReactDI',
				libraryTarget: 'umd',
				sourcePrefix: '\t'
			},
			plugins: [
				new webpack.webpack.DefinePlugin({
					'process.env': {
						NODE_ENV: JSON.stringify(env)
					}
				})
			]
		}))
		.pipe(concat(output))
		.pipe(gulpif(minify, uglify(uglifyOptions)))
		.pipe(gulp.dest('dist'));
});
