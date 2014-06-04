'use strict';

var esprima = require('esprima');
var replace = require('./replace').replace;

exports.into = function (ast, options) {
  var codeAst = esprima.parse(options.code).body;

  function intoBody(body) {
    if (!options.before && !options.after) {
      Array.prototype.push.apply(body, [].concat(codeAst));
    } else {
      var beforeIndex, afterIndex;

      for (var i = 0; i < body.length; i++) {
        if (options.before) {
          if (body[i].expression.type === 'CallExpression' &&
            body[i].expression.callee.name === options.before.funcName) {
            beforeIndex = i;
          }
        }

        if (options.after) {
          if (body[i].expression.type === 'CallExpression' &&
            body[i].expression.callee.name === options.after.funcName) {
            afterIndex = i+1;
          }
        }
      }

      if (options.before) {
        Array.prototype.splice.apply(body, [beforeIndex, 0].concat(codeAst));
      } else if (options.after) {
        //Add support for doing before and after. The index needs to change
        Array.prototype.splice.apply(body, [afterIndex, 0].concat(codeAst));
      }
    }
  }

  replace(ast, null, function (node) {
    if (!options.funcName) {
      if (node.type === 'Program') {
        intoBody(node.body);
      }
    } else {
      if (node.type === 'FunctionDeclaration' &&
        node.id.name === options.funcName) {
        Array.prototype.push.apply(node.body.body, [].concat(codeAst));
      } else if (node.type === 'VariableDeclarator' &&
        node.id.name === options.funcName &&
        node.init.type === 'FunctionExpression') {
        Array.prototype.push.apply(node.init.body.body, [].concat(codeAst));
      }
    }
  });
};