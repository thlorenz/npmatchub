'use strict';

var asyncreduce     =  require('asyncreduce');
var xtend           =  require('xtend');
var resolveRepoInfo =  require('./resolve-repo-url-and-owner');
var setImmediate    =  setImmediate || function (fn) { setTimeout(fn, 0) } ;

function findUrl(resolve, fallbackResolve, trust, pack, cb) {
  if (trust && pack.repoUrl) return setImmediate(cb.bind(null, pack.repoUrl));

  resolve(pack, function (err, url) {
    if (err)  return cb(err);
    if (!url && fallbackResolve) return fallbackResolve(pack, cb);

    cb(null, url);
  });
}

var go = module.exports = function (opts, cb) {

  var packages =  opts.packages;
  var logins   =  opts.logins;
  var trust    =  typeof opts.trust ===  'undefined' ? true : opts.trust

  // less likely to be provided, the default should be pretty solid
  var resolve  =  opts.resolve || resolveRepoInfo;

  // fallbackResolve can be provided to provide another alternative to find url
  var fallbackResolve =  opts.fallbackResolve;

  asyncreduce(
      packages
    , []
    , function url (acc, pack, cb_) {
        findUrl(resolve, fallbackResolve, trust, pack, function (err, resolved) {
          if (err) return cb_(err);
          acc.push(xtend(pack, resolved))
          cb_(null, acc);
        });
      }
    , cb
  )
};

// Test
if (!module.parent) {
  var tj = require('../test/fixtures/tj')

  var opts = {
      logins   :  require('./logins')(tj)
    , packages :  tj
    , trust    :  false
  };

  go(opts, function (err, repos) {
    if (err) return console.error(err);
    console.log('repos: ', repos);
  });
}
