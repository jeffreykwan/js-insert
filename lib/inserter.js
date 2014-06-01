'use strict';

var fs = require('fs');
var esprima = require('esprima');
var gen = require('escodegen');
var estraverse = require('estraverse');
var _ = require('underscore');

exports.read = function (path) {
  return fs.readSync(path);
};

exports.parameter = function (fileName, funcName, param) {
  var ast = esprima.parse(fs.readFileSync(fileName));

  this.replace(ast, null, function (node) {
    if (node.type === 'FunctionDeclaration' && _.isEqual(node.id, {"type": "Identifier", "name": funcName})) {
      node.params.push({"type": "Identifier", "name": param});
      return node;
    }
  });

  ast = gen.generate(ast);
  fs.writeFileSync(fileName, ast);

  return ast;
};

exports.replace = function(ast, enter, leave) {
  estraverse.replace(ast, {
    enter: function (node, parent) {
      if (_.isFunction(enter)) {
        enter(node, parent);
      }
    },

    leave: function (node, parent) {
      if (_.isFunction(leave)) {
        leave(node, parent);
      }
    }
  });
};
