'use strict';

var ReactDI = require('../lib/resolver');
var React = require('react');

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
			context('React.createElement', function() {
				var div = React.DOM.div();

				function renderSpecification(specification, callback) {
					React.render(React.createElement(React.createClass(specification)), document.body, callback);
				}

				beforeEach(function() {
					this.createElement = sinon.spy(React, 'createElement');
					this.warn = sinon.spy(console, 'warn');

					this.mixin.inject(React);
				});

				afterEach(function() {
					this.mixin.remove(React);

					this.createElement.restore();
					this.warn.restore();

					delete this.createElement;
					delete this.warn;
				});

				it('should overwrite original React.createElement method', function() {
					var createElement = function() {},
						React = { createElement: createElement };

					this.mixin.inject(React);
					expect(React.createElement).to.not.be(createElement);
				});

				it('should add di object to props', function(done) {
					var specification = {
						render: function() {
							expect(this.props.di).to.be.a(Function);

							return div;
						}
					};

					renderSpecification(specification, done);
				});

				it('should resolve a dependency by calling props.di with name', function(done) {
					this.mixin.set('message', message);

					var specification = {
						render: function() {
							expect(this.props.di('message')).to.be(message);

							return div;
						}
					};

					renderSpecification(specification, done);
				});

				it('should return resolver instance of calling di() without parameters', function(done) {
					var mixin = this.mixin;

					var specification = {
						render: function() {
							expect(this.props.di()).to.be(mixin);

							return div;
						}
					};

					renderSpecification(specification, done);
				});

				it('should inject di object even if class was created before inject was called', function(done) {
					this.mixin.remove(React);

					var specification = {
						render: function() {
							expect(this.props.di).to.be.a(Function);

							return div;
						}
					};

					var clazz = React.createClass(specification);

					this.mixin.inject(React);
					React.render(React.createElement(clazz), document.body, done);
				});

				it('should cache di object for type', function(done) {
					var di;
					var specification = {
						render: function() {
							if (di) {
								expect(this.props.di).to.be(di);
							}

							di = this.props.di;

							return div;
						}
					};

					var type = React.createClass(specification);

					var element1 = React.createElement(type),
						element2 = React.createElement(type);

					React.render(element1, document.body, function() {
						React.render(element2, document.body, done);
					});
				});

				context('if statics.deps is an array', function() {
					it('should register all dependencies as properties of props.di object', function(done) {
						this.mixin.set({
							message: message,
							alert: alert
						});

						var specification = {
							statics: {
								dependencies: ['message', 'alert']
							},
							render: function() {
								expect(this.props.di.message).to.be(message);
								expect(this.props.di.alert).to.be(alert);

								return div;
							}
						};

						renderSpecification(specification, done);
					});

					it('should warn user about unmet dependency', function(done) {
						var warn = this.warn;
						var specification = {
							displayName: 'test',
							statics: {
								dependencies: ['message', 'alert']
							},
							render: function() {
								expect(warn).to.be.calledOnce();
								expect(warn).to.be.calledWith('ReactDI: Component test requires message, alert but they are not registered');

								return div;
							}
						};

						renderSpecification(specification, done);
					});
				});

				context('if statics.deps is an object', function() {
					it('should register all dependencies as properties of props.di object under aliased names', function(done) {
						this.mixin.set({
							message: message,
							alert: alert
						});

						var specification = {
							statics: {
								dependencies: {
									alrt: 'alert',
									msg: 'message'
								}
							},
							render: function() {
								expect(this.props.di.msg).to.be(message);
								expect(this.props.di.alrt).to.be(alert);

								return div;
							}
						};

						renderSpecification(specification, done);
					});

					it('should warn user about unmet dependency', function(done) {
						var warn = this.warn;
						var specification = {
							displayName: 'test',
							statics: {
								dependencies: {
									confrm: 'confirmation'
								}
							},
							render: function() {
								expect(warn).to.be.calledOnce();
								expect(warn).to.be.calledWith('ReactDI: Component test requires confirmation but they are not registered');

								return div;
							}
						};

						renderSpecification(specification, done);
					});
				});
			});
		});

		describe('remove()', function() {
			it('should restore original createElement method', function() {
				var createElement = function() {},
					React = { createElement: createElement };

				this.mixin.remove(React);
				expect(React.createElement).to.be(createElement);
			});

			it('should cause React.createElement to not inject di into prototypes anymore', function(done) {
				this.mixin.inject(React);
				this.mixin.remove(React);

				var specification = {
					render: function() {
						expect(this.di).to.not.be.ok();

						return React.DOM.div();
					}
				};

				var clazz = React.createClass(specification);
				React.render(React.createElement(clazz), document.body, done);
			});
		});
	});
});
