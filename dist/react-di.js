(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["ReactDI"] = factory();
	else
		root["ReactDI"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var utils = __webpack_require__(1);

	var Mixin = module.exports = function Mixin(map) {
		var proto = (map instanceof Mixin) ? map.map : map || null;

		this.map = Object.create(proto);
	};

	Mixin.prototype.register = function(description, component) {
		if (utils.isObject(description)) {
			Object.keys(description).forEach(function(name) {
				this.__register(name, description[name]);
			}.bind(this));
		} else {
			return this.__register(description, component);
		}
	};

	Mixin.prototype.resolve = function(name) {
		if (utils.isArray(name)) {
			return name.reduce(function(hash, name) {
				hash[name] = this.__resolve(name);

				return hash;
			}.bind(this), {});
		}

		return this.__resolve(name);
	};

	Mixin.prototype.__register = function(name, component) {
		this.map[name] = component;
	};

	Mixin.prototype.__resolve = function(name) {
		if (name in this.map) {
			return this.map[name];
		}

		throw new Error('DI: Component "' + name + '" not found');
	};

	Mixin.prototype.__canResolve = function(name) {
		return name in this.map;
	};

	Mixin.prototype.canResolve = function(name) {
		if (utils.isArray(name)) {
			return name.reduce(function(found, name) {
				return found && this.__canResolve(name);
			}.bind(this), true);
		}

		return this.__canResolve(name);
	};


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.isArray = function(object) {
		return Object.prototype.toString.call(object) === '[object Array]';
	};

	exports.isObject = function(object) {
		return (object !== null) && (typeof(object) === 'object');
	};


/***/ }
/******/ ])
});
