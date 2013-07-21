'use strict';

var exists      =  require('./repos-exists');
var asyncreduce =  require('asyncreduce');
var ghroot      =  'https://github.com/';

var setImmediate = setImmediate || function (fn) { setTimeout(fn, 0) };

/**
 * Tries to find the github repo for the given login, first with the packname and then some other names derived from it.
 *
 * @name tryLogin
 * @function
 * @param login {String} github login
 * @param packname {String} npm package name
 * @param cb {Function} called back with matching github info or null if none was found
 */
function tryLogin (login, packname, cb) {
  var possibilities = [ packname, 'node-' + packname, packname + 'js' ];
  asyncreduce(
      possibilities
    , null
    , function (match, name, cb_) {
        // pass the match thru the function chain once we found one
        if (match) return setImmediate(cb_.bind(null, null, match))

        exists(login, name, function (err, yes) {
          if (err) return cb_(err);

          return yes
            ? cb_(null, { login: login, repo: name, repoUrl: ghroot + login + '/' + name })
            : cb_(null, null);
        });
      }
    , cb
  );
}

/**
 * Tries to find the github info for each login, trying them in the order they are given
 *
 * @name findGithubInfo
 * @function
 * @param pack {Object} npm package metadata
 * @param logins {[String]} known github logins of the npm package owner
 * @param cb {Function} called with github info or null if no match was found
 */
module.exports = function githubInfo (pack, logins, cb) {
  asyncreduce(
      logins
    , null
    , function (match, login, cb_) {
        // pass the match thru the function chain once we found one
        if (match) return setImmediate(cb_.bind(null, null, match))
        tryLogin(login, pack.name, cb_);
      }
    , cb
  );
}
