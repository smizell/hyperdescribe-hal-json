Hyperdescribe for HAL+JSON Media Type
======================================

This is a library for converting from HAL+JSON to Hyperdescribe and back

## Usage

To install:

```javascript
npm install hyperdescribe-hal-json
```

### Converting to Hyperdescribe

```javascript
var halDoc = require('./examples/source.hal'),
    HyperdescribehalJSON = require('hyperdescribe-hal-json'),
    hyperdescribeDoc = HyperdescribeHalJSON.describer(halDoc);
```


### Converting from Hyperdescribe

```javascript
var hyperdescribeDoc = require('./examples/source.hyperdescribe'),
    HyperdescribehalJSON = require('hyperdescribe-hal-json'),
    halDoc = HyperdescribeHalJSON.builder(hyperdescribeDoc);
```

## Browser Version

There is also a browser version in the `dist` directory.

* [Development](dist/haljson.hyperdescribe.js)
* [Production](dist/haljson.hyperdescribe.min.js)

## Documented Code

Literate Coffeescript was used to document the code.

* [Describer](src/describer.litcoffee)
* [Builder](src/builder.litcoffee)
