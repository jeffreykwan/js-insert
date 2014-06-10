'use strict';

var _ = require('underscore');

var replace = require('./replace').replace;
var Identifier = require('./types/identifier');
var Literal = require('./types/literal');
var Property = require('./types/property');

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

exports.funcCall = function (ast, match, insert) {
  function createParameter(param, type) {
    if (type === 'literal') {
      return new Literal(param);
    } else {
      return new Identifier(param);
    }
  }

  function insertIntoArguments(expression) {
    if (insert.arr || insert.func || insert.obj) {
      _.each(expression.arguments, function (element) {
        if (element.type === 'ArrayExpression') {
          if (insert.arr) {
            element.elements.push(createParameter(insert.arr.param, insert.arr.type));
          }
        } else if (element.type === 'FunctionExpression') {
          if (insert.func) {
            element.params.push(createParameter(insert.func.param, insert.func.type));
          }
        } else if (element.type === 'ObjectExpression') {
          if (insert.obj) {
            element.properties.push(new Property(insert.obj.key, 
              insert.obj.value, insert.obj.type));
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
        expression.callee.object.name === match.obj &&
        expression.callee.property.name === match.func) {

        if (insert.param) {
          expression.arguments.push(createParameter(insert.param, insert.type));
        }

        insertIntoArguments(expression);

        return node;
      } else if (expression.callee.type === 'Identifier' &&
        expression.callee.name === match.func) {

        if (insert.param) {
          expression.arguments.push(createParameter(insert.param, insert.type));
        }

        insertIntoArguments(expression);

        return node;
      }
    }
  });
};