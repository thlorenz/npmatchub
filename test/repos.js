'use strict';
/*jshint asi: true */

var test = require('tap').test
var repos = require('..').repos

var fix = {
  // given same name

    // correcting 'cluster.git' to 'cluster'
    // TODO:, 'cluster': { login: 'LearnBoost', repo: 'cluster', repoUrl: 'git://github.com/LearnBoost/cluster' }

  // given different name

    'canvas': { login: 'learnboost', repo: 'node-canvas', repoUrl: 'git://github.com/learnboost/node-canvas' }
    // correcting 'builder.js.git' to 'builder.js'
    // TODO:, 'component-builder': { login: 'component', repo: 'builder', repoUrl: 'https://github.com/component/builder.js' }

  // not given - same name

    , 'lingo': { login: 'visionmedia', repo: 'lingo', repoUrl: 'https://github.com/visionmedia/lingo' }
    , 'indexof': { login: 'component', repo: 'indexof', repoUrl: 'https://github.com/component/indexof'}

  // not given - different name
    , 'is-code': { login: 'visionmedia', repo: 'node-is-code', repoUrl: 'https://github.com/visionmedia/node-is-code' }
    , 'bytes': { login: 'visionmedia', repo: 'bytes.js', repoUrl: 'https://github.com/visionmedia/bytes.js' }
}


test('\nfixing TJs repos', function (t) {
  var tj = require('../test/fixtures/tj')
    .filter(function (r) {
      return !!fix[r.name];
    })

  var opts = {
      packages :  tj
    , trust    :  true
  };

  repos(opts, function (err, repos) {
    t.notOk(err, 'no error');

    var fixed = repos.reduce(function (acc, r) { acc[r.name] = r; return acc; }, {});
   // console.error('fixed: ', fixed);


    function check(name, msg) {
      t.ok(fixed[name], 'fixed ' + name);
      if (!fixed[name]) return;

      t.equal(fixed[name].login, fix[name].login, msg + ' - login')
      t.equal(fixed[name].repo, fix[name].repo, msg + ' - repo')
      t.equal(fixed[name].repoUrl, fix[name].repoUrl, msg + ' - repoUrl')
    }

    check('canvas', 'verifies info for existing url with different name')
//    check('lingo', 'finds info for non-existing url whith same name')
//    check('indexOf', 'finds info for non-existing url whith same name')
    t.end()
  });

})
