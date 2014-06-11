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

      body.in(ast, {
        code: code
      });

      expect(escodegen.generate(ast)).to.contain(code);
    });

    it('should insert code into specified function', function () {
      var expected = '\'Hello World\'';
      var ast = esprima.parse('function define() {}');

      body.in(ast.body[0], {
        code: expected
      });

      expect(escodegen.generate(ast)).
      to.contain('define() {\n    ' + expected);
    });

    it('should insert code into function defined as a variable', function () {
      var code = '\'Hello World\'';
      var ast = esprima.parse('var define = function () {}');

      body.in(ast.body[0], {
        code: code
      });

      expect(escodegen.generate(ast)).
      to.contain('function () {\n    ' + code);
    });

    it('should insert code before specified function call', function () {
      var code = 'var a = 1;';
      var ast = esprima.parse('b();');

      body.in(ast, {
        code: code,
        before: {
          func: 'b'
        }
      });

      expect(escodegen.generate(ast)).
      to.contain('var a = 1;\nb()');
    });

    it('should insert code before specified method call', function () {
      var code = 'var a = 1;';
      var ast = esprima.parse('obj.b();');

      body.in(ast, {
        code: code,
        before: {
          obj: 'obj',
          func: 'b'
        }
      });

      expect(escodegen.generate(ast)).
      to.contain('var a = 1;\nobj.b()');
    });

    it('should insert code in a function before a method call', function () {
      var code = 'ab();';
      var ast = esprima.parse('function define() { obj.a(); }');

      body.in(ast.body[0], {
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

      body.in(ast.body[0], {
        code: code,
        before: {
          ret: true
        }
      });

      expect(escodegen.generate(ast)).to.contain('var a = 1;\n    return');
    });

    it('should insert before function declaration', function () {
      var code = 'var a = 1';
      var ast = esprima.parse('function define() {}');

      body.in(ast, {
        code: code,
        before: {
          func: 'define'
        }
      });

      expect(escodegen.generate(ast)).to.contain('var a = 1;\nfunction define()');
    });

    it('should insert before function declaration using variable', function () {
      var code = 'var a = 1';
      var ast = esprima.parse('var define = function () {}');

      body.in(ast, {
        code: code,
        before: {
          func: 'define'
        }
      });

      expect(escodegen.generate(ast)).to.contain('var a = 1;\nvar define');
    });

    it('should insert before method declaration', function () {
      var code = 'var a = 1';
      var ast = esprima.parse('obj1.f1 = function () {}');

      body.in(ast, {
        code: code,
        before: {
          obj: 'obj1',
          func: 'f1'
        }
      });

      expect(escodegen.generate(ast)).to.contain('var a = 1;\nobj1.f1');
    });

    it('should insert code after specified function call', function () {
      var code = 'var a = 1';
      var ast = esprima.parse('f1()');

      body.in(ast, {
        code: code,
        after: {
          func: 'f1'
        }
      });

      expect(escodegen.generate(ast)).to.contain('f1();\nvar a = 1');
    });

    it('should insert code after specified method call', function () {
      var code = 'var a = 1';
      var ast = esprima.parse('obj.f1()');

      body.in(ast, {
        code: code,
        after: {
          obj: 'obj',
          func: 'f1'
        }
      });

      expect(escodegen.generate(ast)).to.contain('obj.f1();\nvar a = 1');
    });

    it('should insert after function declaration', function () {
      var code = 'var a = 1';
      var ast = esprima.parse('function f1() {}');

      body.in(ast, {
        code: code,
        after: {
          func: 'f1'
        }
      });

      expect(escodegen.generate(ast)).to.contain('function f1() {\n}\nvar a = 1;');
    });

    it('should insert after method declaration', function () {
      var code = 'var a = 1';
      var ast = esprima.parse('obj1.f1 = function () {}');

      body.in(ast, {
        code: code,
        after: {
          obj: 'obj1',
          func: 'f1'
        }
      });

      expect(escodegen.generate(ast)).to.contain('function () {\n};\nvar a = 1;');
    });
  });
});