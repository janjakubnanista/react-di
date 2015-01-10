'use strict';

/* global ReactDI,React */
describe('Resolver', function() {
	var message = { 'message': true },
		alert = { 'alert': true };

	describe('constructor', function() {
		context('if called with null', function() {
			it('should not throw an error', function() {
				expect(function() {
					new ReactDI();
				}).to.not.throwException();
			});
		});

		context('if called with an object', function() {
			it('should register all properties of passed object', function() {
				var map = {
						message: message,
						alert: alert
					};

				var mixin = new ReactDI(map);
				expect(mixin.get('message')).to.be(message);
				expect(mixin.get('alert')).to.be(alert);
			});
		});

		context('if called with an instance of ReactDI', function() {
			it('should register all of its registered components', function() {
				var mixin = new ReactDI({
					message: message
				});

				var childReactDI = new ReactDI(mixin);

				expect(mixin.get('message')).to.be(childReactDI.get('message'));
			});
		});
	});

	describe('methods', function() {
		beforeEach(function() {
			this.mixin = new ReactDI();
		});

		afterEach(function() {
			delete this.mixin;
		});

		describe('get()', function() {
			context('called with a string', function() {
				it('should throw an error if no component was found', function() {
					expect(function() {
						this.mixin.get('message');
					}.bind(this)).to.throwException(/^DI: Component message not found$/);
				});

				it('should return registered component if found', function() {
					this.mixin.set('message', message);

					expect(this.mixin.get('message')).to.be(message);
				});

				it('should throw an error if dependency was overwritten to falsy value', function() {
					this.mixin.set('message', null);

					expect(function() {
						this.mixin.get('message');
					}.bind(this)).to.throwException();
				});
			});

			context('called with an array', function() {
				beforeEach(function() {
					this.mixin.set('message', message);
					this.mixin.set('alert', alert);
				});

				it('should return an object with resolved dependencies as attributes', function() {
					var resolved = this.mixin.get(['message', 'alert']);

					expect(resolved).to.eql({
						message: message,
						alert: alert
					});
				});

				it('should throw an error if dependency was not registered', function() {
					expect(function() {
						this.mixin.get(['message', 'confirmation']);
					}.bind(this)).to.throwException();
				});

				it('should throw an error if dependency was overwritten to falsy value', function() {
					this.mixin.set('message', null);

					expect(function() {
						this.mixin.get(['message', 'confirmation']);
					}.bind(this)).to.throwException();
				});
			});
		});

		describe('getAny()', function() {
			context('called with a string', function() {
				it('should throw an error if no component was found', function() {
					expect(function() {
						this.mixin.getAny('message');
					}.bind(this)).to.throwException(/^DI: Component message not found$/);
				});

				it('should return registered component if found', function() {
					this.mixin.set('message', message);

					expect(this.mixin.getAny('message')).to.be(message);
				});

				it('should throw an error if dependency was overwritten to falsy value', function() {
					this.mixin.set('message', null);

					expect(function() {
						this.mixin.getAny('message');
					}.bind(this)).to.throwException();
				});
			});

			context('called with an array', function() {
				beforeEach(function() {
					this.mixin.set('message', message);
					this.mixin.set('alert', alert);
				});

				it('should return first resolved dependency', function() {
					expect(this.mixin.getAny(['confirmation', 'message', 'alert'])).to.be(message);
				});

				it('should throw an error if dependency was not registered', function() {
					expect(function() {
						this.mixin.getAny(['shouter', 'confirmation']);
					}.bind(this)).to.throwException(/^DI: None of shouter, confirmation was found$/);
				});

				it('should throw an error if dependency was overwritten to falsy value', function() {
					this.mixin.set('message', null);

					expect(function() {
						this.mixin.getAny(['message', 'confirmation']);
					}.bind(this)).to.throwException(/^DI: None of message, confirmation was found$/);
				});
			});
		});

		describe('has()', function() {
			context('called with a string', function() {
				it('should return false if no such component was registered', function() {
					expect(this.mixin.has('message')).to.be(false);
				});

				it('should return false if component was overwritten to falsy value', function() {
					this.mixin.set('message', null);

					expect(this.mixin.has('message')).to.be(false);
				});

				it('should return true if a component was registered', function() {
					this.mixin.set('message', {});

					expect(this.mixin.has('message')).to.be(true);
				});
			});

			context('called with an array', function() {
				beforeEach(function() {
					this.mixin.set('message', message);
					this.mixin.set('alert', alert);
				});

				it('should return true if all dependencies were found', function() {
					expect(this.mixin.has(['message', 'alert'])).to.be(true);
				});

				it('should return false if dependency was not found', function() {
					expect(this.mixin.has(['message', 'alert', 'confirmation'])).to.be(false);
				});
			});
		});

		describe('hasAny()', function() {
			context('called with a string', function() {
				it('should return false if no such component was registered', function() {
					expect(this.mixin.hasAny('message')).to.be(false);
				});

				it('should return false if component was overwritten to falsy value', function() {
					this.mixin.set('message', null);

					expect(this.mixin.hasAny('message')).to.be(false);
				});

				it('should return name if a component was registered', function() {
					this.mixin.set('message', {});

					expect(this.mixin.hasAny('message')).to.be('message');
				});
			});

			context('called with an array', function() {
				beforeEach(function() {
					this.mixin.set('message', message);
					this.mixin.set('alert', alert);
				});

				it('should return name if at least one dependency was found', function() {
					expect(this.mixin.hasAny(['confirmation', 'message', 'shouter'])).to.be('message');
				});

				it('should return false if no dependency was found', function() {
					expect(this.mixin.has(['shouter', 'confirmation'])).to.be(false);
				});
			});
		});

		describe('set()', function() {
			context('called with an object hash', function() {
				it('should register all object properties as components', function() {
					this.mixin.set({
						message: message,
						alert: alert
					});

					expect(this.mixin.get('message')).to.be(message);
					expect(this.mixin.get('alert')).to.be(alert);
				});

				it('should rewrite previously registered components', function() {
					this.mixin.set('message', {});
					this.mixin.set({
						message: message,
						alert: alert
					});

					expect(this.mixin.get('message')).to.be(message);
					expect(this.mixin.get('alert')).to.be(alert);
				});
			});
		});

		describe('inject()', function() {
			beforeEach(function() {
				this.createClass = sinon.spy(React, 'createClass');
				this.createElement = sinon.spy(React, 'createElement');
				this.specification = { render: function() { return React.DOM.div(); } };

				this.mixin.inject(React);
			});

			afterEach(function() {
				this.mixin.remove(React);

				this.createClass.restore();
				this.createElement.restore();

				delete this.createClass;
				delete this.createElement;
				delete this.specification;
			});

			context('React.createClass', function() {
				beforeEach(function() {
					this.mixin.set('message', message);
					this.mixin.set('alert', alert);
				});

				it('should call original method', function() {
					React.createClass(this.specification);

					expect(this.createClass).to.be.calledOnce();
				});

				it('should add a di property with resolver instance', function() {
					React.createClass(this.specification);

					var di = this.createClass.getCall(0).args[0].di;
					expect(di).to.be.a(Function);
					expect(di.resolver).to.be(this.mixin);
				});

				it('should resolve arbitrary dependency when calling di property as a function', function() {
					React.createClass(this.specification);

					var di = this.createClass.getCall(0).args[0].di;

					expect(di('message')).to.be(message);
				});
			});

			context('React.render', function() {
				function renderSpecification(specification, callback) {
					React.render(React.createElement(React.createClass(specification)), document.body, callback);
				}

				it('should have di object accessible', function(done) {
					var specification = {
						render: function() {
							expect(this.di).to.be.a(Function);

							return React.DOM.div();
						}
					};

					renderSpecification(specification, done);
				});

				it('should have arbitrary dependency accessible on di object', function(done) {
					this.mixin.set({
						message: message,
						alert: alert
					});

					var specification = {
						render: function() {
							expect(this.di('message')).to.be(message);
							expect(this.di('alert')).to.be(alert);

							return React.DOM.div();
						}
					};

					renderSpecification(specification, done);
				});
			});
		});
	});
});
