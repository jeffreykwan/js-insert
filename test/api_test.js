'use strict';

var fs = require('fs');
var esprima = require('esprima');
var gen = require('escodegen');
var expect = require('expect.js');

var api = require('../lib/api.js');

describe('API', function () {
  before(function () {
    var tmpDir = __dirname + '/.tmp';

    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir);
    }

    process.chdir(tmpDir);
  });

  beforeEach(function () {
    fs.openSync('temp.js', 'w');
  });

  describe('parse', function () {
    it('should be able to parse a file into AST', function () {
      fs.writeFileSync('temp.js', 'function test() {}');

      var ast = JSON.stringify(api.parse('temp.js'));

      expect(ast).to.equal(JSON.stringify(esprima.parse('function test() {}')));
    });
  });

  describe('generate', function () {
    it('should be able to create a file with code from ast', function () {
      var ast = esprima.parse('function test() {function test2() {}}');

      api.generate('temp.js', ast);

      expect(fs.readFileSync('temp.js', {encoding: 'utf8'})).to.equal(gen.generate(ast));
    });
  });

  describe('parameter', function () {
    it('func: should read file, add a parameter to function, write file', function () {
      fs.writeFileSync('temp.js', 'function abc(a) {}');

      api.parameter.func('temp.js', 'abc', 'b');

      expect(fs.readFileSync('temp.js', {encoding: 'utf8'})).to.contain('abc(a, b)');
    });
  });
});