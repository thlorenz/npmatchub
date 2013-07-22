'use strict';

var loginRepoFromUrl =  require('./login-repo-from-url');
var githubInfo       =  require('./repos-github-info');
var exists           =  require('./repos-exists');

var setImmediate = setImmediate || function (fn) { setTimeout(fn, 0) };

function verifyExisting (pack, githubInfo, cb) {
  exists(githubInfo.login, githubInfo.repo, function (err, yes) {
    if (err) return cb(err);

    return yes
      ? cb(null, { login: githubInfo.login, repo: githubInfo.repo, repoUrl: githubInfo.repoUrl })
      : cb(null, null);
  });
}

/**
 * Verifies existing github urls or tries alternatives if it doesn't exist.
 *
 * @name processExistingRepoUrl
 * @function
 * @param pack {Object} package metadata
 * @param logins {[String]} known logins for the package owner
 * @param trust {Boolean} trust the existing url, no check is performed
 * @param cb {Function} called back with verified or corrected github info, or null if no match is found
 */
module.exports = function processExistingRepoUrl(pack, logins, trust, cb) {
  var githubInfo = loginRepoFromUrl(pack.repoUrl);
  if (trust) return setImmediate(cb.bind(null, null, githubInfo));

  verifyExisting(pack, githubInfo, function (err, res) {
    if (err) return cb(err);
    if (res) return cb(null, res);
    githubInfo(pack, logins, cb);
  });
}
