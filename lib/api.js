'use strict';

var fs = require('fs');
var esprima = require('esprima');
var gen = require('escodegen');

var parameter = require('./parameter');
var body = require('./body');

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
  var ast = parseFile(options.fileName);
  body.into(ast, options);
  generate(options.fileName, ast);
};

exports.parameter = {
  func: function(fileName, funcName, param) {
    var ast = parseFile(fileName);
    parameter.func(ast, funcName, param);
    generate(fileName, ast);
  },

  funcCall: function(filename, match, insert) {
    var ast = parseFile(filename);
    parameter.funcCall(ast, match, insert);
    generate(filename, ast);
  }
};