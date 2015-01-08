'use strict';

require('mocha');

var expect = require('expect.js');
var mixinFactory = require('../lib/mixin');

describe('Mixin', function() {
	beforeEach(function() {
		this.mixin = mixinFactory();
	});

	afterEach(function() {
		delete this.mixin;
	});

	describe('resolve()', function() {
		it('should throw an error if no component was found', function() {
			expect(function() {
				this.mixin.resolve('message');
			}.bind(this)).to.throwError('DI: component "message" not found');
		});
	});

	describe('canResolve()', function() {
		it('should return false if no such component was registered', function() {
			expect(this.component.canResolve('message')).to.be(false);
		});
	});
});
