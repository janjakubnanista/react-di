'use strict';

var utils = require('./utils');

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
