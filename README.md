# ReactDI [![Build Status](https://travis-ci.org/janjakubnanista/react-di.svg?branch=master)](https://travis-ci.org/janjakubnanista/react-di)

ReactDI is a simple DI container originaly built for [React.js](https://github.com/facebook/react).
It is a general solution that allows you to register arbitrary objects to be passed down component hierarchy.

To install, please run

    npm install react-di

or via bower

    bower install react-di

## Usage

### Basic setup

To setup ReactDI, you have to obtain an instance of ReactDI first.

```javascript
// If you're using Node.js, Browserify, Webpack or similar
var ReactDI = require('react-di');

// If you're just loading the file without any dependency management library
var ReactDI = window.ReactDI;

// Create an instance of resolver
var resolver = new ReactDI();

// Passing an object hash will automatically register
// all of its properties
var resolver = new ReactDI({
    message: aMessageService,
    alert: anAlertService
});
```

### ReactJS setup (preferred)

Despite its name, you can use ReactDI without ReactJS. However, if you do, ReactDI
provides a way to make your dependency injection much more straightforward.

After you have obtained an instance of ReactDI, you have to explicitly tell it to work with React object.

```javascript
resolver.inject(React);
```

This causes ReactDI to intercept every call to `React.createElement`. ReactDI then enhances your
element's `props` with `di` property. This property is a callable function that proxies calls to `resolver.get()` method ([See below](#resolver.get)).

As a consequence, you can access your dependencies in your component methods:

```javascript
React.createClass({
    render: function() {
        var message = this.props.di('message'); // A message service was previously registered
        var text = message.say('something'); // Our message service does some work here

        return (
            <div>{text}</div>
        );
    }
});
```

Furthermore, calling `di()` without any arguments returns a reference to your ReactDI instance, so you can do some advanced logic too:

```javascript
React.createClass({
    render: function() {
        var resolver = this.props.di(); // Instance of our original resolver
        var hasMessage = resolver.has('message');
        var text = hasMessage ?
            this.props.di('message').say('something') :
            'something else'; // Pretty advanced, right?

        return (
            <div>{text}</div>
        );
    }
});
```

#### Dependency validation

**Only available when using development version of ReactDI**.

If you create your React component class with `statics.dependencies` property, ReactDI checks
whether all required dependencies are available on resolver. If not, warning is displayed.
**Furthermore**, dependencies declared this way are available as read-only properties on `di` object:

```javascript
React.createClass({
    statics: {
        dependencies: ['message']
    },
    render: function() {
        var message = this.props.di.message; // A message service is now available as a property
        var text = message.say('something'); // Our message service does some work here

        return (
            <div>{text}</div>
        );
    }
});
```

#### Dependency aliasing

If you create your React component class with `statics.dependencies` set to an object hash,
your dependencies will be available on `di` object under their aliases based on this object:

```javascript
React.createClass({
    statics: {
        dependencies: {
            msg: 'message'
        }
    },
    render: function() {
        var message = this.props.di.msg; // A message service is now aliased as `msg`
        var text = message.say('something');

        return (
            <div>{text}</div>
        );
    }
});
```

#### Removing ReactDI injection

To remove `React.createElement` interception (you should rarely need to do this), just call

```javascript
resolver.remove(React);
```

### ReactJS independent setup

You can use ReactDI without automatic injection. You can simply take your ReactDI instance
and pass it around via `props` (in ReactJS) or by any other means in any other framework
or just plain old vanilla JavaScript.

This might allow you to pass different resolvers to different components for example.

To use it with React, try this:

```javascript
var Application = React.createClass({
    render: function() {
        var message = this.props.resolver.get('message'); // A message service was previously registered
        var text = message.say('something');

        // Pass resolver down the component hierarchy
        return (
            <AnotherComponent
                resolver={this.props.resolver}
                text={text}/>
        );
    }
});

// Pass the resolver to components
React.render(<Application resolver={resolver}/>, document.body);
```

## API

- [constructor](#resolver.constructor)
- [set(name, component)](#resolver.set)
- [has(name)](#resolver.has)
- [hasAny(names)](#resolver.hasAny)
- [get(name)](#resolver.get)
- [getAny(name)](#resolver.getAny)

### constructor<a name="resolver.constructor"></a>

	new ReactDI(
		[object|ReactDI map]
	)

`map` is an existing ReactDI instance or an object hash of dependencies
that will be registered on this instance. Any properties registered on this passed instance (or added to this passed object)
will be automatically available on created instance.


### .set(name, component)<a name="resolver.set"></a>

	reactDI set(
		String|Object name,
		[Object component]
	)

When passed a `String` and an object, this method registers `component` under the name `name`. If `component` is null, it will be unregistered.

Wen passed an `Object` as the first parameter its keys will be used as names and corresponding values as components.

This method returns the `ReactDI` instancefor easy chaining.


### .has(name)<a name="resolver.has"></a>

	Boolean has(
		String name
	)

Returns `true` if a component with given name was registered on this resolver, `false` if not.


### .hasAny(names)<a name="resolver.hasAny"></a>

	String hasAny(
		String|Array[String] names
	)

Returns the **name** of first resolved component if at least one of components with given name was registered on this resolver, `false` if not.


### .get(names)<a name="resolver.get"></a>

	Object get(
		String|Array[String] names
	)

When called with `String` this method returns a component registered under this `name`.

When called with an array of names this method returns an `Object` with its keys corresponding to array elements.

This method throws an error if any of requested components was not registered.


### .getAny(names)<a name="resolver.getAny"></a>

	Object getAny(
		String|Array[String] names
	)

Returns first resolved component or throws an error if none of requested components was registered.
