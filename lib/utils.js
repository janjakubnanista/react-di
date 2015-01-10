'use strict';

exports.isArray = function(object) {
	return Object.prototype.toString.call(object) === '[object Array]';
};

exports.isObject = function(object) {
	return (object !== null) && (Object.prototype.toString.call(object) === '[object Object]');
};
