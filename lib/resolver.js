'use strict';

var utils = require('./utils');

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

		if ('production' !== process.env.NODE_ENV) {
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
