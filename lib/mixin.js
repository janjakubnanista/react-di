'use strict';

var Mixin = module.exports = function Mixin(map) {
	this.map = Object.create(map || null);
};

Mixin.prototype.register = function(name, component) {
	this.map[name] = component;
};

Mixin.prototype.resolve = function(name) {
	if (name in this.map) {
		return this.map[name];
	}

	throw new Error('DI: Component "' + name + '" not found');
};

Mixin.prototype.canResolve = function(name) {
	return name in this.map;
};
