'use strict';

var getRepoLogin = require('./login-repo-from-url');

/**
 * Uses the packages that do have a github url specified to guess about what the npm user's github login is
 *
 * @name logins
 * @function
 * @param packages {Array{Object}} npm metadata of the user's packages as returned by a call to
 *  'https://registry.npmjs.org/-/all/' for all users
 * @return {[Object]} possible user logins sorted by how many times they were found with that count as value
 *  each item has structure: { login, count }
 */
var go = module.exports = function (packages) {

  var hash = packages
    .filter(function (p) {
      return p.repoUrl && p.repoUrl.trim().length;
    })
    .reduce(function (acc, p) {
      var repoLogin = getRepoLogin(p.repoUrl);
      if (!repoLogin) return acc;

      var login = repoLogin.login

      if (!acc[login]) acc[login] = 1; else acc[login]++;
      return acc;
    }, {});

  return Object.keys(hash)
    .sort(function (a, b) {
      return hash[a] < hash[b]
    })
    .map(function (x) {
      return { login: x, count: hash[x] };
    });
};
