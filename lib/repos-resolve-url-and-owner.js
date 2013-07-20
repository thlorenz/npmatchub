'use strict';

var hyperquest       =  require('hyperquest');
var loginRepoFromUrl =  require('./login-repo-from-url');
var asyncreduce      =  require('asyncreduce');

var setImmediate = setImmediate || function (fn) { setTimeout(fn, 0) } ;

var ghroot = 'https://github.com/';

function existsUrl(url, cb) {
  var opts = { method: 'HEAD' };

  hyperquest(url, opts,  function (err, res) {
    if (err) return cb(err);
    cb(null, res.statusCode === 200);
  }).end();
}

function exists(owner, repo, cb) {
  var url = ghroot + owner + '/' +  repo;
  existsUrl(url, cb);
}

function verifyExisting (pack, cb) {
  var urlInfo = loginRepoFromUrl(pack.repoUrl);

  exists(urlInfo.login, urlInfo.repo, function (err, yes) {
    if (err) return cb(err);
    return yes
      ? cb(null, { login: urlInfo.login, repo: urlInfo.repo, repoUrl: pack.repoUrl })
      : cb(null, null);
  });
}

function tryLogin (login, packname, cb) {
  var possibilities = [ packname, 'node-' + packname, packname + 'js' ];
  asyncreduce(
      possibilities
    , null
    , function (match, name, cb) {
        // pass the match thru the function chain once we found one
        if (match) return setImmediate(cb.bind(null, null, match))

        exists(login, name, function (err, yes) {
          if (err) return cb(err);

          return yes
            ? cb(null, { login: login, repo: name, repoUrl: ghroot + login + '/' + name })
            : cb(null, null);
        });
      }
    , cb
  );
}

function findUrl (pack, logins, cb) {
  var login = logins[0];
  tryLogin(login, pack.name, cb);
}


/**
 * Attempts to resolve the github url for the given npm package, ignoring the one that may be included.
 *
 * @name exports
 * @function
 * @param pack {Object} { owner, name, repoUrl } currently known package info
 * @param logins {Array[Object]} [ { 'login1': percent, 'login2': percent } ]
 *  known github logins of the npm user with the percentage at which they appeared in his packages
 * @param cb {Function} function (err, resolved) {}
 *  resolved: { login: corrected/verified repo login, repo: reponame, repoUrl: corrected/verified repo url }
 *    - null if url for the repo wasn't found and thus url an owner couldn't be verified/corrected
 */
var go = module.exports = function (pack, logins, cb) {

  if (pack.repoUrl) {
    verifyExisting(pack, function (err, res) {
      if (err) return cb(err);
      if (res) return cb(null, res);
      findUrl(pack, logins, cb);
    });
  } else {
    findUrl(pack, logins, cb);
  }
};

// Test
if (!module.parent) {
  var pack = { owner: 'substack', name: 'browserify' };
  var logins = [ 'substack' ];
  go(pack, logins, function (err, res) {
    if (err) return console.error(err);
    console.log('res: ', res);
  });
}
