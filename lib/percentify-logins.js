'use strict';

/**
 * Calculates percentage of occurrence for each login from their counts.
 *
 * @name exports
 * @function
 * @param logins {[Object]} each item has structure: { login, count }
 * @return logins {[Object]} each item has structure: { login, percent }
 */
var go = module.exports = function (logins) {

  var total = logins
    .reduce(function (acc, l){
        acc += l.count;
        return acc;
      }, 0);

  return logins
    .map(function (l) {
      var percent = (l.count / total) * 100;
      var rounded = Math.round(percent * 100) / 100;
      return { login: l.login, percent: rounded };
    })
    .sort(function (a, b) {
      return a.percent < b.percent;
    });
};

// Test
if (!module.parent) {

  var tj = require('../test/fixtures/tj')

  var logins = require('./logins')(tj)
  go(logins);
}
