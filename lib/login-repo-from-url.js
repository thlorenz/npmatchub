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
  if (!/\//.test(url)) return null;

  var parsed = parseUrl(url);
  if (!parsed.path || parsed.path.length < 2) return null;

  var parts = parsed.path.split('/')
    // support github.com/login/repo and just login/repo
    , hasdomain = parts.length >= 3
    , offset =  hasdomain ? 1 : 0

  // fill in incomplete urls with domain and protocol
  if (!hasdomain) url = 'github.com/' + url;
  if (!parsed.protocol) url = 'https://' + url;

  var login = parts[offset]
    , repogit = parts[offset + 1]
    , extlen = path.extname(repogit).length
    , repo = extlen ? repogit.slice(0, -extlen) : repogit;

  return { login: login, repo: repo, repoUrl: url.replace(/\.git$/, '') };
};
