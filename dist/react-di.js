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

	var Resolver = module.exports = function(map) {
		var proto = (map instanceof Resolver) ? map.map : map || null;

		this.map = Object.create(proto);
	};

	Resolver.prototype.__normalizeDeps = function(deps) {
		if (utils.isArray(deps)) {
			return deps.reduce(function(deps, name) {
				deps[name] = name;

				return deps;
			}, {});
		}

		return deps || {};
	};

	Resolver.prototype.inject = function(React) {
		var createElement = React.createElement,
			resolver = this;

		var newCreateElement = function() {
			var args = Array.prototype.slice.call(arguments),
				type = args[0],
				props = (args[1] = args[1] || {});

			props.di = type.__reactDI__ = (type.__reactDI__ || resolver.__diFor(type));

			if (true) {
				var deps = resolver.__normalizeDeps(type.dependencies),
					depAliases = Object.keys(deps);

				var unknown = depAliases
					.map(function(alias) { return deps[alias]; })
					.filter(function(name) { return !resolver.has(name); });

				if (unknown.length) {
					console.warn(
						'ReactDI: Component ' + type.displayName + ' requires ' + unknown.join(', ') +
						' but they are not registered'
					);
				}
			}

			return createElement.apply(React, args);
		};

		newCreateElement.restore = function() {
			React.createElement = createElement;
		};

		React.createElement = newCreateElement;
	};

	Resolver.prototype.remove = function(React) {
		if (React.createElement.restore) {
			React.createElement.restore();
		}
	};

	Resolver.prototype.set = function(description, component) {
		if (utils.isObject(description)) {
			Object.keys(description).forEach(function(name) {
				this.__set(name, description[name]);
			}.bind(this));
		} else {
			return this.__set(description, component);
		}
	};

	Resolver.prototype.get = function(name) {
		if (utils.isArray(name)) {
			return name.reduce(function(hash, name) {
				hash[name] = this.__get(name);

				return hash;
			}.bind(this), {});
		}

		return this.__get(name);
	};

	Resolver.prototype.getAny = function(names) {
		if (!utils.isArray(names)) {
			return this.__get(names);
		}

		var found = names.reduce(function(found, name) {
			return found || (this.has(name) && this.get(name));
		}.bind(this), null);

		if (!found) {
			throw new Error('ReactDI: None of ' + names.join(', ') + ' was found');
		}

		return found;
	};

	Resolver.prototype.has = function(name) {
		if (utils.isArray(name)) {
			return name.reduce(function(found, name) {
				return found && this.__has(name);
			}.bind(this), true);
		}

		return this.__has(name);
	};

	Resolver.prototype.hasAny = function(names) {
		if (!utils.isArray(names)) {
			return this.__has(names) && names;
		}

		return names.reduce(function(found, name) {
			return found || (this.has(name) && name);
		}.bind(this), false);
	};

	Resolver.prototype.__set = function(name, component) {
		this.map[name] = component;
	};

	Resolver.prototype.__get = function(name) {
		if (this.map[name]) {
			return this.map[name];
		}

		throw new Error('ReactDI: Component ' + name + ' not found');
	};

	Resolver.prototype.__has = function(name) {
		return !!this.map[name];
	};

	Resolver.prototype.__diFor = function(type) {
		var resolver = this;

		var di = function(name) {
			if (arguments.length === 0) {
				return resolver;
			}

			return resolver.get(name);
		};

		var deps = resolver.__normalizeDeps(type.dependencies),
			depAliases = Object.keys(deps),
			diProperties = depAliases.reduce(function(diProperties, alias) {
			diProperties[alias] = {
				enumerable: true,
				get: di.bind(null, deps[alias])
			};

			return diProperties;
		}, {});

		Object.defineProperties(di, diProperties);

		return di;
	};


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.isArray = function(object) {
		return Object.prototype.toString.call(object) === '[object Array]';
	};

	exports.isObject = function(object) {
		return (object !== null) && (Object.prototype.toString.call(object) === '[object Object]');
	};


/***/ }
/******/ ])
});
