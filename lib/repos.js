'use strict';

var asyncreduce = require('asyncreduce');
var xtend = require('xtend');
var setImmediate = setImmediate || function (fn) { setTimeout(fn, 0) } ;

// most likely not overridden
function defaultCheck (pack, cb) {
  // info: { owner: owner, name: 'reponame', repoUrl: 'repo url if it was given' }
  // check needs to return null if nothing found
  // needs to return same or corrected login and/or repo

  // call back with error if something went wrong
  // call back with null if no url could be resolved
  // call back with url if it was resolved
  cb(null, null);
  //cb(null, 'some url');
}

// more likely overridden
function defaultFallbackCheck (pack, cb) {
  cb(null, 'fallback url');
}

function findUrl(check, fallbackCheck, trust, pack, cb) {
  if (trust && pack.repoUrl) return setImmediate(cb.bind(null, pack.repoUrl));

  check(pack, function (err, url) {
    if (err)  return cb(err);
    if (!url) return fallbackCheck(pack, cb);

    cb(null, url);
  });
}

var go = module.exports = function (opts, cb) {

  var packages      =  opts.packages;
  var logins        =  opts.logins;
  var trust         =  typeof opts.trust === 'undefined' ? true : opts.trust
  var check         =  opts.check         || defaultCheck;
  var fallbackCheck =  opts.fallbackCheck || defaultFallbackCheck;

  asyncreduce(
      packages
    , []
    , function url (acc, pack, cb_) {
        findUrl(check, fallbackCheck, trust, pack, function (err, url) {
          if (err) return cb_(err);
          acc.push(xtend(pack, { repoUrl: url }))
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
    console.log('repos: ', repos.length);
  });
}
