'use strict';

var runnel = require('runnel');

function defaultCheck (info, cb) {
  // info: { login: login, repo: 'reponame' }
  // check needs to return null if nothing found
  // needs to return same or corrected login and/or repo
}

function findUrl(check, pack, cb) {
  var url = 'some url';

  check(pack, url, function (err, ok) {
    if (err) return cb(err);
    if (ok) {
      console.error('ok');
      pack.repoUrl = url;
      return cb(null, pack)
    }
    console.error('trying another check');
  });
}

var go = module.exports = function (packages, logins, check, cb) {

  if (!cb) {
    cb = check;
    check = defaultCheck;
  }

  var separated = packages
    .reduce(function (acc, r) {
      if (r.repoUrl) acc.complete.push(r); else acc.incomplete.push(r);
      return acc;
    }, { complete: [], incomplete: [] });

  var done = separated.complete;
  var tasks = separated.incomplete
    .map(function (p) {
      return findUrl.bind(null, check, p);
    });

  runnel(tasks.concat(cb));
};

function check (repo, url, cb) {
  console.error('reponame: ', repo.name);
  console.error('url: ', url);
  cb(null, true);
}

// Test
if (!module.parent) {
  var tj = require('../test/fixtures/tj')
  var logins = require('./logins')(tj);


  /*go(tj, logins, check, function (err, repos) {
    if (err) return console.error(err);
    console.log('repos: ', repos);
  });*/
}
