'use strict';

var _ = require('underscore');

module.exports = function Literal(value) {
  this.type = 'Literal';
  this.value = value;
  this.raw = _.isString(value) ? "'" + value + "'" : value;
};