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

  describe('function call', function () {

    it('should add parameter to a function call', function () {
      var ast = esprima.parse('f1();');

      parameter.funcCall(ast, {
        funcName: 'f1',
        parameter: 'a',
        parameterType: 'literal'
      });

      var result = gen.generate(ast);
      expect(result).to.contain('f1(\'a\')');
    });

    it('should add parameter to member call', function () {
      var ast = esprima.parse('obj.f1(a)');

      parameter.funcCall(ast, {
        obj: 'obj',
        funcName: 'f1',
        parameter: 'b',
        parameterType: 'variable'});

      expect(gen.generate(ast)).to.contain('obj.f1(a, b)');
    });

    it('should default add a variable parameter', function () {
      var ast = esprima.parse('f1();');

      parameter.funcCall(ast, {
        funcName: 'f1',
        parameter: 'b'
      });

      expect(gen.generate(ast)).to.contain('f1(b)');
    });
  });
});