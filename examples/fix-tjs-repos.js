'use strict';

var repos = require('..').repos;

var tj = require('../test/fixtures/tj')
var opts = {
    packages :  tj
  , trust    :  true
};

repos(opts, function (err, repos) {
  if (err) return console.error(err);
  require('fs').writeFileSync(__dirname + '/../test/fixtures/tj-fixed.js', JSON.stringify(repos,null,2), 'utf8');
  console.log('repos: ', repos.length);
})
.on('processing', function (pack) {
  process.stderr.write('.');
})
.on('processed', function (pack, github) {
  if (github) console.error('%s: \t%s/%s', pack.name, github.login, github.repo);
  else console.error('%s: \tNOT FOUND', pack.name);
});
