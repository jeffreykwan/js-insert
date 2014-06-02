'use strict';

var fs = require('fs');
var esprima = require('esprima');
var gen = require('escodegen');
var estraverse = require('estraverse');
var _ = require('underscore');

var Identifier = require('./types/identifier.js');

exports.parameter = function (fileName, funcName, param) {
  var ast = this.parse(fileName);

  this.replace(ast, null, function (node) {
    if (node.type === 'FunctionDeclaration' &&
      JSON.stringify(node.id) === JSON.stringify(new Identifier(funcName))) {
      node.params.push(new Identifier(param));
      return node;
    }
  });

  return this.generate(fileName, ast);
};

exports.parse = function (fileName) {
  return esprima.parse(fs.readFileSync(fileName));
};

exports.generate = function (fileName, ast) {
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
