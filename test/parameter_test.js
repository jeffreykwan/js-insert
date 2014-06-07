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
        func: 'f1'
      }, {
        param: 'a',
        type: 'literal'
      });

      var result = gen.generate(ast);
      expect(result).to.contain('f1(\'a\')');
    });

    it('should add parameter to member call', function () {
      var ast = esprima.parse('obj.f1(a)');

      parameter.funcCall(ast, {
        obj: 'obj',
        func: 'f1'
      }, {
        param: 'b',
        type: 'variable'
      });

      expect(gen.generate(ast)).to.contain('obj.f1(a, b)');
    });

    it('should default add a variable parameter', function () {
      var ast = esprima.parse('f1();');

      parameter.funcCall(ast, {
        func: 'f1'
      }, {
        param: 'b'
      });

      expect(gen.generate(ast)).to.contain('f1(b)');
    });

    it('should add parameter to array parameter', function () {
      var ast = esprima.parse('f1([a])');

      parameter.funcCall(ast, {
        func: 'f1'
      }, {
        arr: {
          param: 'b',
          type: 'variable'
        }
      });

      expect(gen.generate(ast).replace(/\s+/g, ' ')).to.contain('f1([ a, b ]);');
    });

    it('should add parameter to function parameter', function () {
      var ast = esprima.parse('obj.f1(function (a) {})');

      parameter.funcCall(ast, {
        obj: 'obj',
        func: 'f1'
      }, {
        func: {
          param: 'b',
          type: 'variable'
        }
      });

      expect(gen.generate(ast)).to.contain('obj.f1(function (a, b)');
    });

    xit('should insert into an object parameter', function () {
      var ast = esprima.parse('obj.f1({a: \'hi\'});');

      parameter.funcCall(ast, {
        obj: 'obj',
        func: 'f1'
      }, {
        objParam: {
          key: 'b',
          value: 'bye'
        }
      });

      expect(gen.generate(ast).replace(/\s+/g, ' ')).to.contain('a: \'hi\', b: \'bye\'');
    });

    xit('should insert into an object two levels in', function () {
      var ast = esprima.parse('obj.f1({parse: {}})');

      parameter.funcCall(ast, {
        obj: 'obj',
        func: 'f1'
      }, {
        obj: {
          obj: {
            name: 'parse',
            key: 'a',
            value: 'bbc'
          }
        }
      });

      expect(gen.generate(ast).replace(/\s+/g, ' ')).to.contain('parse: { a: \'bbc\'');
    });
  });
});