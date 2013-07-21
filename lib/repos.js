'use strict';

var asyncreduce   =  require('asyncreduce');
var xtend         =  require('xtend');
var EventEmitter  =  require('events').EventEmitter;
var resolveGithub =  require('./repos-resolve-github');
var loginsCount   =  require('./logins-count');
var loginsPercent =  require('./logins-percent');

var setImmediate = setImmediate || function (fn) { setTimeout(fn, 0) } ;

function getLogins (packages) {
  var counts = loginsCount(packages);
  var percents = loginsPercent(counts);

  return percents
    .filter(function (p) { return p.percent > 5 })
    .map(function (p) { return p.login });
}

var go = module.exports = function (opts, cb) {

  var event = new EventEmitter();
  var packages =  opts.packages;
  var logins   =  opts.logins || getLogins(opts.packages);
  var trust    =  typeof opts.trust ===  'undefined' ? true : opts.trust

  // can be overriden if default should be wrapped or totally changed
  var resolve  =  opts.resolve || resolveGithub;

  asyncreduce(
      packages
    , []
    , function url (acc, pack, cb_) {
        event.emit('processing', pack);
        resolve(pack, logins, trust, function (err, github) {
          if (err) return cb_(err);
          event.emit('processed', pack, github);
          acc.push(xtend(pack, github))
          cb_(null, acc);
        });
      }
    , cb
  )

  return event;
};

// Test
if (!module.parent) {
  var tj = require('../test/fixtures/tj')
  var opts = {
      packages :  tj
    , trust    :  true
  };

  go(opts, function (err, repos) {
    if (err) return console.error(err);
    require('fs').writeFileSync(__dirname + '/../test/fixtures/tj-fixed.js', JSON.stringify(repos,null,2), 'utf8');
    console.log('repos: ', repos.length);
  })
  .on('processing', function (pack) {
    //console.error('processing: ', pack.name);
  })
  .on('processed', function (pack, github) {
    if (github) console.error('%s: \t%s/%s', pack.name, github.login, github.repo);
    else console.error('%s: \tNOT FOUND', pack.name);
  });
}
