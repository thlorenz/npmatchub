'use strict';

var hyperquest       =  require('hyperquest');
var loginRepoFromUrl =  require('./login-repo-from-url');
var asyncreduce      =  require('asyncreduce');

var setImmediate = setImmediate || function (fn) { setTimeout(fn, 0) } ;

var ghroot = 'https://github.com/';

function exists(owner, repo, cb) {

  function existsUrl(url, cb) {
    var opts = { method: 'HEAD' };

    hyperquest(url, opts,  function (err, res) {
      if (err) return cb(err);
      cb(null, res.statusCode === 200);
    }).end();
  }

  var url = ghroot + owner + '/' +  repo;
  existsUrl(url, cb);
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
function processExistingRepoUrl(pack, logins, trust, cb) {
  var githubInfo = loginRepoFromUrl(pack.repoUrl);
  if (trust) return setImmediate(cb.bind(null, null, githubInfo));

  function verifyExisting (pack, githubInfo, cb) {
    exists(githubInfo.login, githubInfo.repo, function (err, yes) {
      if (err) return cb(err);
      return yes
        ? cb(null, { login: githubInfo.login, repo: githubInfo.repo, repoUrl: pack.repoUrl })
        : cb(null, null);
    });
  }

  verifyExisting(pack, githubInfo, function (err, res) {
    if (err) return cb(err);
    if (res) return cb(null, res);
    findGithubInfo(pack, logins, cb);
  });
}

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
function findGithubInfo (pack, logins, cb) {
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

  console.error('processing: ', pack.name);

  if (pack.repoUrl)
    processExistingRepoUrl(pack, logins, trust, cb);
  else
    findGithubInfo(pack, logins, cb);
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
