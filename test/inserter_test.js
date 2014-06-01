'use strict';

var fs = require('fs');
var expect = require('expect.js');

var inserter = require('../lib/inserter.js');

describe('Inserter', function () {
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
    beforeEach(function () {
      fs.writeFileSync('temp.js', 'function test() {}');
    });

    it('should insert parameter into function', function () {
      var inserted = inserter.parameter('temp.js', 'test', 'a');
      expect(JSON.stringify(inserted)).to.contain('test(a)');
    });
  });
});