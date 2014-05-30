/*
 * inserter
 * https://github.com/jeffreykwan/js-insert
 *
 * Copyright (c) 2014 Jeffrey Kwan
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');
var esprima = require('esprima');
var gen = require('escodegen');
var traverse = require('traverse');

exports.read = function (path) {
  return fs.readSync(path);
};

exports.parameter = function (ast, funcName, param) {

};
