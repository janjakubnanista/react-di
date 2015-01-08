'use strict';

require('mocha');

var expect = require('expect.js');
var Mixin = require('../lib/mixin');

describe('Mixin', function() {
	describe('constructor', function() {
		context('if called with null', function() {
			it('should not throw an error', function() {
				expect(function() {
					new Mixin();
				}).to.not.throwException();
			});
		});

		context('if called with an object', function() {
			it('should register all properties of passed object', function() {
				var message = {},
					collection = {},
					map = {
						message: message,
						collection: collection
					};

				var mixin = new Mixin(map);
				expect(mixin.resolve('message')).to.be(message);
				expect(mixin.resolve('collection')).to.be(collection);
			});
		});
	});

	describe('methods', function() {
		beforeEach(function() {
			this.mixin = new Mixin();
		});

		afterEach(function() {
			delete this.mixin;
		});

		describe('resolve()', function() {
			it('should throw an error if no component was found', function() {
				expect(function() {
					this.mixin.resolve('message');
				}.bind(this)).to.throwException(/^DI: Component "message" not found$/);
			});

			it('should return registered component if found', function() {
				var message = {};
				this.mixin.register('message', message);

				expect(this.mixin.resolve('message')).to.be(message);
			});
		});

		describe('canResolve()', function() {
			it('should return false if no such component was registered', function() {
				expect(this.mixin.canResolve('message')).to.be(false);
			});

			it('should return true if a component was registered', function() {
				this.mixin.register('message', {});

				expect(this.mixin.canResolve('message')).to.be(true);
			});
		});
	});
});
