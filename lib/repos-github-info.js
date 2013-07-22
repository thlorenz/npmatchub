'use strict';

var exists      =  require('./repos-exists');
var asyncreduce =  require('asyncreduce');
var getStabs       =  require('./repos-stabs');
var ghroot      =  'https://github.com/';

var setImmediate = setImmediate || function (fn) { setTimeout(fn, 0) };

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
  var stabs = getStabs(logins, pack.name);

  asyncreduce(
      stabs
    , null
    , function (match, stab, cb_) {
        // pass the match thru the function chain once we found one
        if (match) return setImmediate(cb_.bind(null, null, match))

        var login = stab.login;
        var repo = stab.repo;

        exists(login, repo, function (err, yes) {
          if (err) return cb_(err);

          return yes
            ? cb_(null, { login: login, repo: repo, repoUrl: ghroot + login + '/' + repo })
            : cb_(null, null);
        });
      }
    , cb
  );
}
