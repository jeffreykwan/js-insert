'use strict';

exports.isAssignment = function (node) {
  return node.type === 'ExpressionStatement' &&
    node.expression.type === 'AssignmentExpression' &&
    node.expression.left.type === 'MemberExpression' &&
    node.expression.right.type === 'FunctionExpression';
};

exports.matchesAssignment = function (node, obj, func) {
  return exports.isAssignment(node) &&
    node.expression.left.object.name === obj &&
    node.expression.left.property.name === func;
};

exports.isCall = function (node) {
  return node.type === 'ExpressionStatement' &&
    node.expression.type === 'CallExpression' &&
    node.expression.callee.type === 'MemberExpression';
};

exports.matchesCall = function (node, obj, func) {
  return exports.isCall(node) &&
    node.expression.callee.object.name === obj &&
    node.expression.callee.property.name === func;
};

exports.matches = function (node, obj, func) {
  return exports.matchesCall(node, obj, func) ||
    exports.matchesAssignment(node, obj, func);
};