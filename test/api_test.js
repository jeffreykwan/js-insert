'use strict';

var fs = require('fs');
var esprima = require('esprima');
var gen = require('escodegen');
var expect = require('expect.js');

var api = require('../lib/api');

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

  describe('parseFile', function () {
    it('should be able to parse a file into AST', function () {
      fs.writeFileSync('temp.js', 'function test() {}');

      var ast = JSON.stringify(api.parseFile('temp.js'));

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

  describe('into', function () {
    describe('body', function () {
      it('should read file, add code to function, write file', function () {
        fs.writeFileSync('temp.js', 'function abc(a) {}');

        api.into('temp.js', {func: 'abc'}, {code: {code: 'var a = 1'}});

        expect(fs.readFileSync('temp.js', {encoding: 'utf8'})).to.contain('var a = 1');

      });
    });
    describe('parameter', function () {
      it('should read file, add a parameter to function call, write file', function () {
        fs.writeFileSync('temp.js', 'abc(a)');

        api.into('temp.js', {func: 'abc'}, {param: {param: 'b'}});

        expect(fs.readFileSync('temp.js', {encoding: 'utf8'})).to.contain('abc(a, b)');
      });

      it('should read file, add a parameter to function declaration, write file', function () {
        fs.writeFileSync('temp.js', 'function abc(a) {}');

        api.into('temp.js', {func: 'abc'}, {param: {param: 'b'}});

        expect(fs.readFileSync('temp.js', {encoding: 'utf8'})).to.contain('abc(a, b)');
      });

      it('funcCall: should read file, add parameter to a function call, write file', function () {
        fs.writeFileSync('temp.js', 'define([a], function (a) {})');

        api.into('temp.js', {
          func: 'define'
        }, {
          param: {
            arr: {
              param: 'b',
              type: 'variable'
            }
          }
        });

        expect(fs.readFileSync('temp.js', {encoding: 'utf8'})).to.contain('define([\n    a,\n    b\n]');
      });

      it('should insert into an object of an object parmeter', function () {
        fs.writeFileSync('temp.js', 'obj.f1({parse: {a: \'b\'}})');

        api.into('temp.js', {
          obj: 'obj', func: 'f1', nested: {
            nested: {
              key: 'parse'
            }
          }
        }, {
          param: {
            obj: {
              key: 'b',
              value: 'hi',
              type: 'variable'
            }
          }
        });

        expect(fs.readFileSync('temp.js', {encoding: 'utf8'}).replace(/\s+/g, ' ')).to.contain('b: hi');
      });

      it('should insert into a nested object of an object parameter', function () {
        fs.writeFileSync('temp.js', 'obj.f1({parse: {a: {b: \'t\' }}})');

        api.into('temp.js', {
          obj: 'obj', func: 'f1', nested: {
            nested: {
              nested: {
                key: 'b'
              }
            }
          }
        }, {
          param: {
            obj: {
              key: 'c',
              value: 'hi',
              type: 'variable'
            }
          }
        });

        expect(fs.readFileSync('temp.js', {encoding: 'utf8'}).replace(/\s+/g, ' ')).to.contain('c: hi');
      });
    });
  });
});