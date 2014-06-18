'use strict';

var _ = require('underscore');

var funcMatcher = require('./matchers/function');
var objMatcher = require('./matchers/object');

var Identifier = require('./types/identifier');
var Literal = require('./types/literal');
var Property = require('./types/property');

exports.createParameter = function (param, type) {
  if (type === 'literal') {
    return new Literal(param);
  } else {
    return new Identifier(param);
  }
};

exports.insertIntoArguments = function (args, params) {
  _.each(args, function (element) {
    if (element.type === 'ArrayExpression' && params.arr) {
      element.elements.push(exports.createParameter(params.arr.param, params.arr.type));
    } else if (element.type === 'FunctionExpression' && params.func) {
      element.params.push(exports.createParameter(params.func.param, params.func.type));
    } else if (element.type === 'ObjectExpression' && params.obj) {
      element.properties.push(new Property(params.obj.key,
        params.obj.value, params.obj.type));
    }
  });
};

exports.add = function (node, params) {
  if (node.type === 'ObjectExpression' && params.obj) {
    node.properties.push(new Property(params.obj.key,
        params.obj.value, params.obj.type));
  } else if (funcMatcher.isCall(node) || objMatcher.isCall(node)) {
    var args = node.expression.arguments;

    if (params.param) {
      args.push(exports.createParameter(params.param, params.type));
    }

    exports.insertIntoArguments(args, params);
  } else if (funcMatcher.isDeclaration(node)) {
    if (params.param) {
      node.params.push(exports.createParameter(params.param, params.type));
    }
  } else if (funcMatcher.isVariableDeclaration(node)) {
    if (params.param) {
      node.declarations[0].init.params.push(exports.createParameter(params.param, params.type));
    }
  }
};