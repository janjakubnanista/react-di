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

		context('if called with an instance of Mixin', function() {
			it('should register all of its registered components', function() {
				var message = {};
				var mixin = new Mixin({
					message: message
				});

				var childMixin = new Mixin(mixin);

				expect(mixin.resolve('message')).to.be(childMixin.resolve('message'));
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
			context('called with a string', function() {
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

			context('called with an array', function() {
				beforeEach(function() {
					this.message = {};
					this.alert = {};

					this.mixin.register('message', this.message);
					this.mixin.register('alert', this.alert);
				});

				afterEach(function() {
					delete this.message;
					delete this.alert;
				});

				it('should return an object with resolved dependencies as attributes', function() {
					var resolved = this.mixin.resolve(['message', 'alert']);

					expect(resolved).to.eql({
						message: this.message,
						alert: this.alert
					});
				});

				it('should throw an error if dependency was not found', function() {
					expect(function() {
						this.mixin.resolve(['message', 'confirmation']);
					}.bind(this)).to.throwException();
				});
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

		describe('register()', function() {
			beforeEach(function() {
				this.message = {};
				this.alert = {};
			});

			afterEach(function() {
				delete this.message;
				delete this.alert;
			});

			context('called with an object hash', function() {
				it('should register all object properties as components', function() {
					this.mixin.register({
						message: this.message,
						alert: this.alert
					});

					expect(this.mixin.resolve('message')).to.be(this.message);
					expect(this.mixin.resolve('alert')).to.be(this.alert);
				});

				it('should rewrite previously registered components', function() {
					this.mixin.register('message', {});
					this.mixin.register({
						message: this.message,
						alert: this.alert
					});

					expect(this.mixin.resolve('message')).to.be(this.message);
					expect(this.mixin.resolve('alert')).to.be(this.alert);
				});
			});
		});
	});
});
