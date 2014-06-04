'use strict';

var fs = require('fs');
var esprima = require('esprima');
var gen = require('escodegen');

var parameter = require('./parameter');

function parse(src) {
  return esprima.parse(src);
}

function parseFile(fileName) {
  return parse(fs.readFileSync(fileName), {encoding: 'utf8'});
}

function generate(fileName, ast) {
  ast = gen.generate(ast);
  fs.writeFileSync(fileName, ast);

  return ast;
}

exports.parse = parse;
exports.parseFile = parseFile;
exports.generate = generate;

exports.into = function(options) {

};

exports.parameter = {
  func: function(fileName, funcName, param) {
    var ast = parseFile(fileName);
    parameter.func(ast, funcName, param);
    generate(fileName, ast);
  },

  funcCall: function(options) {
    var ast = parseFile(options.fileName);
    parameter.funcCall(ast, options);
    generate(options.fileName, ast);
  }
};