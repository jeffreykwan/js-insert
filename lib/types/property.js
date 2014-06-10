'use strict';

var _ = require('underscore');

var Literal = require('./literal');
var Identifier = require('./identifier');

module.exports = function Property(key, value, type) {
  this.type = 'Property';
  this.kind = 'init';
  this.key = new Identifier(key);
  this.value = type === 'literal' ? new Literal(value) : new Identifier(value);
};