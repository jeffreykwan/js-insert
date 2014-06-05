'use strict';

var esprima = require('esprima');
var escodegen = require('escodegen');
var expect = require('expect.js');

var body = require('../lib/body');

describe('Body', function () {
  describe('#into', function () {
    it('should insert code into empty file', function () {
      var code = '\'Hello World!\'';
      var ast = esprima.parse('');

      body.into(ast, {
        code: code
      });

      expect(escodegen.generate(ast)).to.contain(code);
    });

    it('should insert code into specified function', function () {
      var code = '\'Hello World\'';
      var ast = esprima.parse('function define() {}');

      body.into(ast, {
        funcName: 'define',
        code: code
      });

      expect(escodegen.generate(ast)).
      to.contain('define() {\n    ' + code);
    });

    it('should insert code into function defined as a variable', function () {
      var code = '\'Hello World\'';
      var ast = esprima.parse('var define = function () {}');

      body.into(ast, {
        funcName: 'define',
        code: code
      });

      expect(escodegen.generate(ast)).
      to.contain('function () {\n    ' + code);
    });

    it('should insert code before specified function call', function () {
      var code = 'var a = 1;';
      var ast = esprima.parse('b();');

      body.into(ast, {
        code: code,
        before: {
          funcName: 'b'
        }
      });

      expect(escodegen.generate(ast)).
      to.contain('var a = 1;\nb()');
    });

    it('should insert code before specified method call', function () {
      var code = 'var a = 1;';
      var ast = esprima.parse('obj.b();');

      body.into(ast, {
        code: code,
        before: {
          obj: 'obj',
          funcName: 'b'
        }
      });

      expect(escodegen.generate(ast)).
      to.contain('var a = 1;\nobj.b()');
    });

    it('should insert code in a function before a method call', function () {
      var code = 'ab();';
      var ast = esprima.parse('function define() { obj.a(); }');

      body.into(ast, {
        funcName: 'define',
        code: code,
        before: {
          obj: 'obj',
          funcName: 'a'
        }
      });

      expect(escodegen.generate(ast)).
      to.contain('define() {\n    ab();\n    obj.a');
    });

    it('should insert before return call', function () {
      var code = 'var a = 1';
      var ast = esprima.parse('function define() { return true; }');

      body.into(ast, {
        code: code,
        funcName: 'define',
        before: {
          returnCall: true
        }
      });

      expect(escodegen.generate(ast)).to.contain('var a = 1;\n    return');
    });

    it('should insert before function declaration', function () {
      var code = 'var a = 1';
      var ast = esprima.parse('function define() {}');

      body.into(ast, {
        code: code,
        before: {
          funcName: 'define',
          declaration: true
        }
      });

      expect(escodegen.generate(ast)).to.contain('var a = 1;\nfunction define()');
    });

    it('should insert before function declaration using variable', function () {
      var code = 'var a = 1';
      var ast = esprima.parse('var define = function () {}');

      body.into(ast, {
        code: code,
        before: {
          funcName: 'define',
          declaration: true
        }
      });

      expect(escodegen.generate(ast)).to.contain('var a = 1;\nvar define');
    });

    it('should insert before method declaration', function () {

    });

    it('should insert code after specified function call', function () {

    });

    it('should insert code after specified method call', function () {

    });

    it('should insert after function declaration', function () {

    });

    it('should insert after method declaration', function () {

    });
  });
});