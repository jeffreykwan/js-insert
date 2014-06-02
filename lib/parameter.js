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
  function createParameter(param, type) {
    if (type === 'literal') {
      return new Literal(param);
    } else {
      return new Identifier(param);
    }
  }

  function insertIntoArguments(expression, options) {
    if (options.arr || options.func) {
      _.each(expression.arguments, function (element) {
        if (element.type === 'ArrayExpression') {
          if (options.arr) {
            element.elements.push(createParameter(options.arr.parameter, options.arr.type));
          }
        } else if (element.type === 'FunctionExpression') {
          if (options.func) {
            element.params.push(createParameter(options.func.parameter, options.func.type));
          }
        }
      });
    }
  }

  replace(ast, null, function (node) {
    if (node.type === 'ExpressionStatement' &&
      node.expression.type === 'CallExpression') {
      var expression = node.expression;
      if (expression.callee.type === 'MemberExpression' &&
        expression.callee.object.name === options.obj &&
        expression.callee.property.name === options.funcName) {

        if (options.parameter) {
          expression.arguments.push(createParameter(options.parameter, options.parameterType));
        }

        insertIntoArguments(expression, options);

        return node;
      } else if (expression.callee.type === 'Identifier' &&
        expression.callee.name === options.funcName) {

        if (options.parameter) {
          expression.arguments.push(createParameter(options.parameter, options.parameterType));
        }

        insertIntoArguments(expression, options);

        return node;
      }
    }
  });
};