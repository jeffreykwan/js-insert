'use strict';

var fs = require('fs');
var esprima = require('esprima');
var gen = require('escodegen');

var parameter = require('./parameter');

function parse(fileName) {
  return esprima.parse(fs.readFileSync(fileName));
}

function generate(fileName, ast) {
  ast = gen.generate(ast);
  fs.writeFileSync(fileName, ast);

  return ast;
}

exports.parse = parse;
exports.generate = generate;

exports.parameter = {
  func: function(fileName, funcName, param) {
    var ast = parse(fileName);
    parameter.func(ast, funcName, param);
    generate(fileName, ast);
  }
};