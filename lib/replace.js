'use strict';

var estraverse = require('estraverse');
var _ = require('underscore');

exports.replace = function(ast, enter, leave) {
  estraverse.replace(ast, {
    enter: function (node, parent) {
      if (_.isFunction(enter)) {
        enter(node, parent);
      }
    },

    leave: function (node, parent) {
      if (_.isFunction(leave)) {
        leave(node, parent);
      }
    }
  });
};