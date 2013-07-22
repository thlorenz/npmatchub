'use strict';

var repos = require('..').repos;

var tj = require('../test/fixtures/tj')
var opts = {
    packages :  tj
  , trust    :  true
};

function countUrls (packages) {
  return packages.filter(function (x) { return x.repoUrl }).length;
}

repos(opts, function (err, repos) {
  if (err) return console.error(err);
  require('fs').writeFileSync(__dirname + '/../test/fixtures/tj-fixed.js', JSON.stringify(repos,null,2), 'utf8');
  console.log('Originals have %s known repoUrls and fixed ones have %s', countUrls(tj), countUrls(repos));
})
.on('processing', function (pack) {
  process.stderr.write('.');
})
.on('processed', function (pack, github) {
  if (github) console.error('%s: \t%s/%s', pack.name, github.login, github.repo);
  else console.error('%s: \tNOT FOUND', pack.name);
});
