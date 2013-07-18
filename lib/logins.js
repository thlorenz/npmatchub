'use strict';

var parseUrl = require('url').parse;

/**
 * Uses the packages that do have a github url specified to guess about what the npm user's github login is
 *
 * @name logins
 * @function
 * @param packages {Array{Object}} npm metadata of the user's packages as returned by a call to
 *  'https://registry.npmjs.org/-/all/' for all users
 * @return {Array} possible user logins sorted by how many times they were found with that count as value
 */
var go = module.exports = function (packages) {

  function getLogin(url) {
    var parsed = parseUrl(url)
      , parts = parsed.path.split('/')

    return parts[1];
  }

  var hash = packages
    .filter(function (p) {
      return p.repoUrl;
    })
    .reduce(function (acc, p) {
      var login = getLogin(p.repoUrl);

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