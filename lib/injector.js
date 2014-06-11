'use strict';

var _ = require('underscore');

var parameter = require('./parameter');
var body = require('./body');

exports.inject = function (nodes, value) {
  _.each(nodes, function(node) {
    if (value.code) {
      body.in(node, value.code);
    } else if (value.param) {
      parameter.add(node, value.param);
    }
  });
};