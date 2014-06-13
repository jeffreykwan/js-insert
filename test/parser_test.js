'use strict';

var esprima = require('esprima');
var expect = require('expect.js');

var parser = require('../lib/parser');

describe('Parser', function () {
  describe('#Function Declaration', function () {
    it('should find function declaration node', function () {
      var ast = esprima.parse('function test() {}');
      var node = parser.parse(ast, {func: 'test'});
      expect(node).eql(ast.body);
    });

    it('should find function declared as variable', function () {
      var ast = esprima.parse('var test = function () {}');
      var node = parser.parse(ast, {func: 'test'});
      expect(node).eql(ast.body);
    });

    it('should find nested function declaration with no identifier', function () {
      var ast = esprima.parse('define(function () {});');
      var node = parser.parse(ast, {func: 'define', nested: {func: true}});
      expect(JSON.stringify(node)).to.contain('"type":"FunctionExpression","id":null');
    });
  });

  describe('#Function Call', function () {
    it('should find function call node', function () {
      var ast = esprima.parse('test();');
      var node = parser.parse(ast, {func: 'test'});
      expect(node).eql(ast.body);
    });

    it('should find a nested function call in function declaration node', function () {
      var ast = esprima.parse('function test() {test1(); test3();}');
      var node = parser.parse(ast, {func: 'test', nested: {func: 'test1'}});
      expect(node).eql(esprima.parse('test1();').body);
    });

    it('should find second function call in func declaration node', function () {
      var ast = esprima.parse('function test() {test1(); test3();}');
      var node = parser.parse(ast, {func: 'test', nested: {func: 'test3'}});
      expect(node).eql(esprima.parse('test3();').body);
    });
  });

  describe('#Method Declaration', function () {
    it('should find method declaration node', function () {
      var ast = esprima.parse('obj.f1 = function () {}');
      var node = parser.parse(ast, {obj: 'obj', func: 'f1'});
      expect(node).eql(ast.body);
    });

    it('should find nested method declaration node', function () {
      var ast = esprima.parse('obj.f1 = function () {obj.f3 = function () {} }');
      var node = parser.parse(ast, {obj: 'obj', func: 'f1', nested: {obj: 'obj', func: 'f3'}});
      expect(node).to.eql(esprima.parse('obj.f3 = function () {}').body);
    });

  });

  describe('#Method Call', function () {
    it('should find method call node', function () {
      var ast = esprima.parse('obj.f1()');
      var node = parser.parse(ast, {obj: 'obj', func: 'f1'});
      expect(node).eql(ast.body);
    });

    it('should find nested method call inside method declaration', function () {
      var ast = esprima.parse('obj.f1 = function () { obj.f2(); }');
      var node = parser.parse(ast, {obj: 'obj', func: 'f1', nested: { obj: 'obj', func: 'f2'}});
      expect(node).eql(esprima.parse('obj.f2()').body);
    });
  });

  describe('#Object Expression', function () {
    it('should find object expression', function () {
      var ast = esprima.parse('def.o1({})');
      var node = parser.parse(ast, {obj: 'def', func: 'o1', nested: {obj: true, func: true}});
      expect(node[0].type).to.equal('ObjectExpression');
    });

    it('should find keys of an object expression', function () {
      var ast = esprima.parse('obj.a({paths: {}})');
      var node = parser.parse(ast, {
      obj: 'obj', func: 'a', nested: {
        obj: true, func: true, nested: {
          obj: true, func: true, key: 'paths'}}});
      expect(node[0].type).to.equal('Property');
      expect(node[0].key.name).to.equal('paths');
    });
  });

});