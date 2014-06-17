'use strict';

var esprima = require('esprima');
var gen = require('escodegen');
var expect = require('expect.js');

var parameter = require('../lib/parameter.js');

describe('Parameter', function () {
  describe('#Function Declaration', function () {
    it('should insert parameter into function declaration', function () {
      var ast = esprima.parse('function test() {}');
      parameter.add(ast.body[0], {param: 'a'});
      expect(gen.generate(ast)).to.contain('test(a)');
    });

    it('should insert parameter into function declared as variable', function () {
      var ast = esprima.parse('var test = function () {}');
      parameter.add(ast.body[0], {param: 'a'});
      expect(gen.generate(ast)).to.contain('function (a)');
    });
  });

  describe('#Function Call', function () {
    it('should add parameter to a function call', function () {
      var ast = esprima.parse('f1();');

      parameter.add(ast.body[0], {
        param: 'a',
        type: 'literal'
      });

      var result = gen.generate(ast);
      expect(result).to.contain('f1(\'a\')');
    });

    it('should default add a variable parameter', function () {
      var ast = esprima.parse('f1();');

      parameter.add(ast.body[0], {
        param: 'b'
      });

      expect(gen.generate(ast)).to.contain('f1(b)');
    });

    describe('Array Parameter', function () {
      it('should add parameter to array parameter', function () {
        var ast = esprima.parse('f1([a])');

        parameter.add(ast.body[0], {
          arr: {
            param: 'b',
            type: 'variable'
          }
        });

        expect(gen.generate(ast).replace(/\s+/g, ' ')).to.contain('f1([ a, b ]);');
      });
    });

    describe('Function Parameter', function () {
      it('should add parameter to function parameter', function () {
        var ast = esprima.parse('obj.f1(function (a) {})');

        parameter.add(ast.body[0], {
          func: {
            param: 'b',
            type: 'variable'
          }
        });

        expect(gen.generate(ast)).to.contain('obj.f1(function (a, b)');
      });
    });

    describe('Object Parameter', function () {
      it('should insert into an object parameter', function () {
        var ast = esprima.parse('obj.f1({a: \'hi\'});');

        parameter.add(ast.body[0], {
          obj: {
            key: 'b',
            value: 'bye'
          }
        });

        expect(gen.generate(ast).replace(/\s+/g, ' ')).to.contain('a: \'hi\', b: bye');
      });

      it('should insert into an object parameter with a string', function () {
        var ast = esprima.parse('obj.f1({a: \'hi\'});');

        parameter.add(ast.body[0], {
          obj: {
            key: 'b',
            value: 'bye',
            type: 'literal'
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

  describe('#Method Call', function () {
    it('should add parameter to member call', function () {
      var ast = esprima.parse('obj.f1(a)');

      parameter.add(ast.body[0], {
        param: 'b',
        type: 'variable'
      });

      expect(gen.generate(ast)).to.contain('obj.f1(a, b)');
    });
  });
});