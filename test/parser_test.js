'use strict';

var esprima = require('esprima');
var expect = require('expect.js');

var parser = require('../lib/parser');

describe('Parser', function () {
  describe('#Function Declaration', function () {
    it('should find function declaration node', function () {
      var ast = esprima.parse('function test() {}');
      var node = parser.parse(ast, {func: 'test'});
      expect(ast.body).eql(node);
    });

    it('should find function declared as variable', function () {
      var ast = esprima.parse('var test = function () {}');
      var node = parser.parse(ast, {func: 'test'});
      expect(ast.body).eql(node);
    });
  });

  describe('#Function Call', function () {
    it('should find function call node', function () {
      var ast = esprima.parse('test();');
      var node = parser.parse(ast, {func: 'test'});
      expect(ast.body).eql(node);
    });

    it('should find a nested function call in function declaration node', function () {
      var ast = esprima.parse('function test() {test1(); test3();}');
      var node = parser.parse(ast, {func: 'test', nested: {func: 'test1'}});
      expect(esprima.parse('test1();').body).eql(node);
    });

    it('should find second function call in func declaration node', function () {
      var ast = esprima.parse('function test() {test1(); test3();}');
      var node = parser.parse(ast, {func: 'test', nested: {func: 'test3'}});
      expect(esprima.parse('test3();').body).eql(node);
    });
  });

  describe('#Method Declaration', function () {
    it('should find method declaration node', function () {
      var ast = esprima.parse('obj.f1 = function () {}');
      var node = parser.parse(ast, {obj: 'obj', func: 'f1'});
      expect(ast.body).eql(node);
    });

    it('should find nested method declaration node', function () {
      var ast = esprima.parse('obj.f1 = function () {obj.f3 = function () {} }');
      var node = parser.parse(ast, {obj: 'obj', func: 'f1', nested: {obj: 'obj', func: 'f3'}});
      expect(esprima.parse('obj.f3 = function () {}').body).eql(node);
    });

  });

  describe('#Method Call', function () {
    it('should find method call node', function () {
      var ast = esprima.parse('obj.f1()');
      var node = parser.parse(ast, {obj: 'obj', func: 'f1'});
      expect(ast.body).eql(node);
    });

    it('should find nested method call inside method declaration', function () {
      var ast = esprima.parse('obj.f1 = function () { obj.f2(); }');
      var node = parser.parse(ast, {obj: 'obj', func: 'f1', nested: { obj: 'obj', func: 'f2'}});
      expect(esprima.parse('obj.f2()').body).eql(node);
    });
  });

});