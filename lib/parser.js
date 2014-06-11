'use strict';

var _ = require('underscore');

var objMatcher = require('./matchers/object');
var funcMatcher = require('./matchers/function');

exports.parseNode = function (node, match) {
  var nodes = [];
  var iter;
  if (match.obj && match.func) {
    if (objMatcher.matches(node, match.obj, match.func)) {
      if (match.nested) {
        iter = objMatcher.isCall(node) ? node.expression.arguments :
          node.expression.right.body.body;

        _.each(iter, function (body) {
          nodes.push(exports.parseNode(body, match.nested));
        });

        return _.compact(nodes);
      } else {
        return node;
      }
    }
  } else if (match.func) {
    if (funcMatcher.matches(node, match.func)) {
      if (match.nested) {
        if (funcMatcher.isCall(node)) {
          return exports.parseNode(node.arguments, match.nested);
        } else {
          iter = funcMatcher.isDeclaration(node) ? node.body.body :
            node.declarations[0].init.body.body;

          _.each(iter, function (body) {
            nodes.push(exports.parseNode(body, match.nested));
          });

          return _.compact(nodes);
        }
      } else {
        return node;
      }
    }
  }
};

exports.parse = function(ast, matchers) {
  var expectedNodes = [];
  var body = ast.body;

  _.each(body, function (node) {
    expectedNodes.push(exports.parseNode(node, matchers));
  });

  if (_.isEmpty(matchers)) {
    expectedNodes.push(body);
  }

  return _.flatten(_.compact(expectedNodes));
};