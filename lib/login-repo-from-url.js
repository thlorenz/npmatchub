'use strict';
var parseUrl = require('url').parse;
var path = require('path');


/**
 * Extracts user login and repo name from a given github url.
 * Example: 'git://github.com/component/throttle.git' => { login: component, repo: throttle }
 *
 * @name exports
 * @function
 * @param url {String} github repository url (git:// or https://)
 */
var go = module.exports = function (url) {
  var parsed = parseUrl(url)
    , parts = parsed.path.split('/');

  var login = parts[1]
    , repogit = parts[2]
    , repo = repogit.slice(0, -path.extname(repogit).length);

  return { login: login, repo: repo };
};

// Test
if (!module.parent) {
  var url = 'git://github.com/component/throttle.git';
  go(url);
}
