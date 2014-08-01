'use strict';

var fs = require('fs');
var esprima = require('esprima');
var gen = require('escodegen');

var parser = require('./parser');
var injector = require('./injector');

function parse(src) {
  return esprima.parse(src, {
    range: true,
    tokens: true,
    comment: true
  });
}

function parseFile(fileName) {
  return parse(fs.readFileSync(fileName), {encoding: 'utf8'});
}

function generate(fileName, ast) {
  ast = gen.attachComments(ast, ast.comments, ast.tokens);

  fs.writeFileSync(fileName, gen.generate(ast, {
    comment: true
  }));

  return ast;
}

exports.parse = parse;
exports.parseFile = parseFile;
exports.generate = generate;

exports.into = function(filename, matcher, values) {
  var ast = parseFile(filename);
  var nodes = parser.parse(ast, matcher);
  injector.inject(nodes, values);
  generate(filename, ast);
};