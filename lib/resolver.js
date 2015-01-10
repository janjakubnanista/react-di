'use strict';

var utils = require('./utils');

var Resolver = module.exports = function(map) {
	var proto = (map instanceof Resolver) ? map.map : map || null;

	this.map = Object.create(proto);
};

Resolver.prototype.inject = function(React) {
	var createClass = React.createClass,
		resolver = this;

	var newCreateClass = function(specification) {
		// Add to class specification
		specification.di = resolver.__diFor(specification);

		return createClass.call(React, specification);
	};

	newCreateClass.restore = function() {
		React.createClass = createClass;
	};

	React.createClass = newCreateClass;
};

Resolver.prototype.remove = function(React) {
	if (React.createClass.restore) {
		React.createClass.restore();
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
		throw new Error('DI: None of ' + names.join(', ') + ' was found');
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

	throw new Error('DI: Component ' + name + ' not found');
};

Resolver.prototype.__has = function(name) {
	return !!this.map[name];
};

Resolver.prototype.__diFor = function(specification) {
	var resolver = this;

	// Create dependency getter function
	var di = function(name) {
		return resolver.get(name);
	};

	// Expose underlying resolver instance for advanced use
	Object.defineProperty(di, 'resolver', {
		enumerable: true,
		writable: false,
		value: resolver
	});

	// Check for required dependencies
	var deps = specification.statics && specification.statics.dependencies;
	if (deps && deps.length) {
		// Get names of all dependencies
		var depNames = Object.keys(deps);

		// Make sure propTypes object exists
		specification.propTypes = specification.propTypes || {};

		// Add validator function that makes sure all dependecies can be resolved
		specification.propTypes.di = function(props, propName, componentName) {
			var cannotResolve = depNames.filter(function(name) {
				return !resolver.has(name);
			});

			if (cannotResolve.length) {
				return new Error('DI: ' + componentName + ' requires `' + cannotResolve.join(', '));
			}
		};
	}

	return di;
};
