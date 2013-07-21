'use strict';

var processExistingRepoUrl = require('./repos-process-existing');
var githubInfo = require('./repos-github-info');

var setImmediate = setImmediate || function (fn) { setTimeout(fn, 0) };

/**
 * Attempts to resolve the github url for the given npm package, ignoring the one that may be included.
 *
 * @name exports
 * @function
 * @param pack {Object} { owner, name, repoUrl } currently known package info
 * @param githubLogins {[String]} [ login1', 'login2' ]
 *  known github logins of the npm user ordered descencing by how may times they were found
 * @param cb {Function} function (err, resolved) {}
 *  resolved: { login: corrected/verified repo login, repo: reponame, repoUrl: corrected/verified repo url }
 *    - null if url for the repo wasn't found and thus url an owner couldn't be verified/corrected
 */
var go = module.exports = function (pack, logins, trust, cb) {
  if (pack.repoUrl)
    processExistingRepoUrl(pack, logins, trust, cb);
  else
    githubInfo(pack, logins, cb);
};

// Test
if (!module.parent) {
  var pack = { owner: 'substack', name: 'browserify' };
  var logins = [ 'substack' ];
  go(pack, logins, true, function (err, res) {
    if (err) return console.error(err);
    console.log('res: ', res);
  });
}
