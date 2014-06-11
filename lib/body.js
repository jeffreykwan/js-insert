'use strict';

var esprima = require('esprima');
var _ = require('underscore');

var funcMatcher = require('./matchers/function');
var objMatcher = require('./matchers/object');

exports.findBody = function (node) {
  if (node.type === 'Program') {
    return node.body;
  } else if (funcMatcher.isDeclaration(node)) {
    return node.body.body;
  } else if (funcMatcher.isVariableDeclaration(node)) {
    return node.declarations[0].init.body.body;
  }
};

exports.in = function (node, options) {
  var codeAst = esprima.parse(options.code).body;

  if (!options.before && !options.after) {
    Array.prototype.push.apply(
      exports.findBody(node), [].concat(codeAst));
  } else {
    var beforeIdx, afterIdx;

    _.each(exports.findBody(node), function (element, index) {
      if (options.before && ((element.type === 'ReturnStatement' && options.before.ret) ||
        funcMatcher.matches(element, options.before.func) ||
        objMatcher.matches(element, options.before.obj, options.before.func))) {
        beforeIdx = index;
      }

      if (options.after && (funcMatcher.matches(element, options.after.func) ||
        objMatcher.matches(element, options.after.obj, options.after.func))) {
        afterIdx = index+1;
      }
    });

    if (options.before) {
      Array.prototype.splice.apply(exports.findBody(node), [beforeIdx, 0].concat(codeAst));
    }

    if (options.after) {
      Array.prototype.splice.apply(exports.findBody(node), [afterIdx, 0].concat(codeAst));
    }
  }
};