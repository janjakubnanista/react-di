# ReactDI

ReactDI is a simple DI container originaly built for [React.js](https://github.com/facebook/react).
It is a general solution that allows you to register arbitrary objects to be passed down component hierarchy.

To install, please run

    npm install react-di

or via bower

    bower install react-di

## Usage

    // If you're using Node.js, Browserify, Webpack or similar
    var ReactDI = require('react-di');

    // If you're just loading the file without any dependency management library
    var ReactDI = window.ReactDI;

    // Create a few components. These will probably reside in their own files.

    // Create an item component
    var Item = React.createClass({
        render: function() {
            var formatter = this.props.resolver.resolve('formatter'),
                text = formatter.format(this.props.text);

            return (
                <div>{text}</div>
            );
        }
    });

    var Collection = React.createClass({
        render: function() {
            var Item = this.props.resolver.resolve('item');

            return (
                <Item resolver={this.props.resolver} text={Hello}/>
                <Item resolver={this.props.resolver} text={Hi}/>
                <Item resolver={this.props.resolver} text={Hola}/>
            );
        }
    });

    var Application = React.createClass({
        render: function() {
            var Collection = this.props.resolver.resolve('collection');

            return (
                <Collection resolver={this.props.resolver}/>
            );
        }
    });

    // Create an arbitrary service
    var Formatter = {
        format: function(text) {
            return text.toUpperCase();
        }
    };

    // Create an instance of resolver
    // Passing an object hash will automatically register all properties
    // as components
    var resolver = new ReactDI({
        collection: Collection,
        item: Item
    });

    // Register additional dependency
    // (This is here to demonstrate the functionality, of course you could pass
    // this dependency along with others to constructor)
    resolver.register('formatter', Formatter);

    // Pass the resolver to components
    React.render(<Application resolver={resolver}/>, document.body);

## API

`new ReactDI(map)`

Constructor.

**`map`** *`Object|ReactDI instance`* *[optional]* Existing ReactDI instance or an object hash of dependencies
that will be registered on this instance. Any properties registered on this passed instance (or added to this passed object)
will be automatically available on created instance.

`resolver.register(name, component);`

Register new component or multiple components.

**`name`** *`Object|String`* Name of the component or an object hash of components.

**`component`** *`Mixed`* *[optional]* Component to register. Only needed if `name` was a String.

`resolver.canResolve(name);`

Returns `true` if a component with given name was registered on this resolver, `false` if not.

**`name`** *`String|Array<String>`* String name or array of names to check.

`resolver.resolve(name);`

Returns a component registered under given name, or a collection of components.

**`name`** *`String|Array<String>`* String name or array of names to resolve.
