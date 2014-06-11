'use strict';

var expect = require('expect.js');
var esprima = require('esprima');
var gen = require('escodegen');

var injector = require('../lib/injector');

describe('Inserter', function () {
  describe('Parameter', function () {
    it('should insert into array parameter', function () {
      var ast = esprima.parse('define([])');
      injector.inject(ast.body, {param: {arr: {param: 'a'}}});
      expect(gen.generate(ast)).to.contain('define([a])');
    });

    it('should insert into object parameter', function () {
      var ast = esprima.parse('obj({})');
      injector.inject(ast.body, {param: {obj: {key: 'a', value: 'b'}}});
      expect(gen.generate(ast)).to.contain('{ a: b }');
    });

    it('should insert into functions parameter', function () {
      var ast = esprima.parse('obj(function () {})');
      injector.inject(ast.body, {param: {func: {param: 'a'}}});
      expect(gen.generate(ast)).to.contain('function (a)');
    });
  });
});