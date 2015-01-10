'use strict';

var utils = require('./utils');

var Resolver = module.exports = function(map) {
	var proto = (map instanceof Resolver) ? map.map : map || null;

	this.map = Object.create(proto);
};

Resolver.prototype.__diFor = function(specification) {
	var resolver = this;

	// Create dependency getter function
	var di = function(name) {
		return resolver.resolve(name);
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
				return !resolver.canResolve(name);
			});

			if (cannotResolve.length) {
				return new Error('DI: ' + componentName + ' requires `' + cannotResolve.join(', '));
			}
		};
	}

	return di;
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

Resolver.prototype.register = function(description, component) {
	if (utils.isObject(description)) {
		Object.keys(description).forEach(function(name) {
			this.__register(name, description[name]);
		}.bind(this));
	} else {
		return this.__register(description, component);
	}
};

Resolver.prototype.resolve = function(name) {
	if (utils.isArray(name)) {
		return name.reduce(function(hash, name) {
			hash[name] = this.__resolve(name);

			return hash;
		}.bind(this), {});
	}

	return this.__resolve(name);
};

Resolver.prototype.canResolve = function(name) {
	if (utils.isArray(name)) {
		return name.reduce(function(found, name) {
			return found && this.__canResolve(name);
		}.bind(this), true);
	}

	return this.__canResolve(name);
};

Resolver.prototype.__register = function(name, component) {
	this.map[name] = component;
};

Resolver.prototype.__resolve = function(name) {
	if (this.map[name]) {
		return this.map[name];
	}

	throw new Error('DI: Component "' + name + '" not found');
};

Resolver.prototype.__canResolve = function(name) {
	return !!this.map[name];
};
