'use strict';

var repos = require('..').repos;
var resolve = require('..').resolve;

var tj = require('../test/fixtures/tj')

function resolveWrap (pack, logins, trust, cb) {
  // if that thing containse 'component' in the name, I know where the hell that is
  // and we can spare us that check -- risky? -- maybe

  // we'll defer non components to the default resolve
  if (!~pack.name.indexOf('component')) return resolve(pack, logins, trust, cb);

  console.error('--- quick resolving: ', pack.name);

  var name = pack.name
    .replace('component-', '')
    .replace('-component', '');

  var res = { login: 'component', repo: name, repoUrl: 'https://github.com/component/' + name };
  cb(null, res);
}

var opts = {
    packages :  tj
  , trust    :  true
  , resolve  :  resolveWrap
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
