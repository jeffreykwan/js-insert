'use strict';

var _ = require('underscore');

exports.isAssignment = function (node) {
  return node.type === 'ExpressionStatement' &&
    node.expression.type === 'AssignmentExpression' &&
    node.expression.left.type === 'MemberExpression' &&
    node.expression.right.type === 'FunctionExpression';
};

exports.matchesAssignment = function (node, obj, func) {
  return exports.isAssignment(node) &&
    ((_.isBoolean(obj) && obj) || node.expression.left.object.name === obj) &&
    ((_.isBoolean(func) && func) || node.expression.left.property.name === func);
};

exports.isCall = function (node) {
  return node.type === 'ExpressionStatement' &&
    node.expression.type === 'CallExpression' &&
    node.expression.callee.type === 'MemberExpression';
};

exports.matchesCall = function (node, obj, func) {
  return exports.isCall(node) &&
    ((_.isBoolean(obj) && obj) || node.expression.callee.object.name === obj) &&
    ((_.isBoolean(func) && func) || node.expression.callee.property.name === func);
};

exports.isExpression = function (node) {
  return node.type === 'ObjectExpression';
};

exports.isProperty = function (node) {
  return node.type === 'Property';
};

exports.matchesProperty = function (node, key) {
  return exports.isProperty(node) && node.key.name === key;
};

exports.matches = function (node, obj, func) {
  return exports.matchesCall(node, obj, func) ||
    exports.matchesAssignment(node, obj, func) ||
    exports.isExpression(node);
};