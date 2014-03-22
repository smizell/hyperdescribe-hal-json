var builder = require('./lib/builder');

HyperdescribeHalJSON = module.exports = {
  name: 'uber+json',
  mediaType: 'application/hal+json',
  describer: function(x) { return x },
  builder: builder
}