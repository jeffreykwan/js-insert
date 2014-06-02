'use strict';

var _ = require('underscore');

var replace = require('./replace').replace;
var Identifier = require('./types/identifier');
var Literal = require('./types/literal');

exports.func = function (ast, funcName, param) {
  replace(ast, null, function (node) {
    if (node.type === 'FunctionDeclaration' &&
      JSON.stringify(node.id) === JSON.stringify(new Identifier(funcName))) {
      node.params.push(new Identifier(param));
      return node;
    }
  });

  return ast;
};

exports.funcCall = function (ast, options) {
  replace(ast, null, function (node) {
    if (node.type === 'ExpressionStatement' &&
      node.expression.type === 'CallExpression') {
      var expression = node.expression;
      if (expression.callee.type === 'MemberExpression' &&
        expression.callee.object.name === options.obj &&
        expression.callee.property.name === options.funcName) {

        //TODO: Need way to determine if parameter is a String or variable
        expression.arguments.push(new Literal(options.parameter));

        return node;
      } else if (expression.callee.type === 'Identifier' &&
        expression.callee.name === options.funcName) {

        //TODO: Need way to determine if parameter is a String or variable
        expression.arguments.push(new Literal(options.parameter));
        return node;
        // _.each(node.expression.arguments, function (element) {
        //   if (element.type === 'ArrayExpression') {
        //     element.elements.push(new Literal(options.parameter));
        //   } else if (element.type === 'FunctionExpression') {

        //   }
        // });
      }
    }
  });
};