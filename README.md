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

#### Constructor

##### Params

**`map`** *`Object|ReactDI instance`* *[optional]* Existing ReactDI instance or an object hash of dependencies
that will be registered on this instance. Any properties registered on this passed instance (or added to this passed object)
will be automatically available on created instance.


#### .set(name, component);

Register new component or multiple components. If `component` is `null` then it is unregistered from the resolver.

##### Params

**`name`** *`Object|String`* Name of the component or an object hash of components.

**`component`** *`Mixed`* *[optional]* Component to register. Only needed if `name` was a String.



#### .has(name);

Returns `true` if a component with given name was registered on this resolver, `false` if not.

##### Params

**`name`** *`String|Array<String>`* String name or array of names to check.


#### .hasAny(names);

Returns the **name** of first resolved component if at least one of components with given name was registered on this resolver, `false` if not.

##### Params

**`names`** *`String|Array<String>`* String name or array of names to check.


#### .get(name);<a name="resolver.get"></a>

Returns a component registered under given name, or a collection of components. Throws an error if a component was not registered.

##### Params

**`name`** *`String|Array<String>`* String name or array of names to resolve.


#### .getAny(names);

Returns first resolved component or throws an error if none of requested components was registered.

**`name`** *`String|Array<String>`* String name or array of names to resolve.
