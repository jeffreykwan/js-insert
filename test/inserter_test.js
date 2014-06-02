'use strict';

var fs = require('fs');
var expect = require('expect.js');

var inserter = require('../lib/inserter.js');

describe('Insert', function () {
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

  describe('parameter', function () {

    it('should insert parameter into function', function () {
      fs.writeFileSync('temp.js', 'function test() {}');
      var inserted = inserter.parameter('temp.js', 'test', 'a');
      expect(inserted).to.contain('test(a)');
    });

    it('should insert parameter to only given function name', function () {
      fs.writeFileSync('temp.js', 'function test() {function test2() {}}');
      var result = inserter.parameter('temp.js', 'test2', 'a');
      expect(result).to.contain('test()');
      expect(result).to.contain('test2(a)');
    });
  });
});