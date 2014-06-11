'use strict';

var _ = require('underscore');

exports.isCall = function (node) {
  return node.type === 'ExpressionStatement' &&
    node.expression.type === 'CallExpression';
};

exports.matchesCall = function (node, func) {
  return exports.isCall(node) &&
    ((_.isBoolean(func) && func) || node.expression.callee.name  === func);
};

exports.isDeclaration = function (node) {
  return node.type === 'FunctionDeclaration';
};

exports.matchesDeclaration = function (node, func) {
  return exports.isDeclaration(node) &&
    ((_.isBoolean(func) && func) || node.id.name === func);
};

exports.isVariableDeclaration = function (node) {
  return node.type === 'VariableDeclaration' &&
    node.declarations[0].type === 'VariableDeclarator' &&
    node.declarations[0].init.type === 'FunctionExpression';
};

exports.matchesVariableDeclaration = function (node, func) {
  return exports.isVariableDeclaration(node) &&
    ((_.isBoolean(func) && func) || node.declarations[0].id.name === func);
};

exports.isExpression = function (node) {
  return node.type === 'FunctionExpression';
}

exports.matchesExpression = function (node, func) {
  return exports.isExpression(node) &&
    ((_.isBoolean(func) && func) || node.id.name === func);
}

exports.matches = function (node, func) {
  return exports.matchesCall(node, func) ||
    exports.matchesDeclaration(node, func) ||
    exports.matchesExpression(node, func) ||
    exports.matchesVariableDeclaration(node, func);
};