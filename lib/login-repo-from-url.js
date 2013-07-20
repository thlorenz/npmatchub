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
  url = url.replace('git@github.com:', 'git://github.com/');
  var parsed = parseUrl(url)
    , parts = parsed.path.split('/')
    // support github.com/login/repo and just login/repo
    , offset = parts.length >= 3 ? 1 : 0

  var login = parts[offset]
    , repogit = parts[offset + 1]
    , extlen = path.extname(repogit).length
    , repo = extlen ? repogit.slice(0, -extlen) : repogit;

  return { login: login, repo: repo };
};
