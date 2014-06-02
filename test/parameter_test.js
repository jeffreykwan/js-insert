'use strict';

var esprima = require('esprima');
var gen = require('escodegen');
var expect = require('expect.js');

var parameter = require('../lib/parameter.js');

describe('Parameter', function () {

  describe('function declaration', function () {

    it('should insert parameter into function', function () {
      var ast = esprima.parse('function test() {}');
      parameter.func(ast, 'test', 'a');
      expect(gen.generate(ast)).to.contain('test(a)');
    });

    it('should insert parameter to only given function name', function () {
      var ast = esprima.parse('function test() {function test2() {}}');
      parameter.func(ast, 'test2', 'a');

      var result = gen.generate(ast);
      expect(result).to.contain('test()');
      expect(result).to.contain('test2(a)');
    });
  });
});