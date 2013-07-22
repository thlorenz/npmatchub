'use strict';
/*jshint asi: true */

var test = require('tap').test
var loginRepo = require('../lib/login-repo-from-url')

test('\ndetermines the user login and repo name correcctly from the url', function (t) {

  t.deepEqual({ login: 'component' ,  repo: 'throttle'        ,  repoUrl: 'git://github.com/component/throttle' }         ,  loginRepo('git://github.com/component/throttle.git'))
  t.deepEqual({ login: 'component' ,  repo: 'throttle'        ,  repoUrl: 'https://github.com/component/throttle'}        ,  loginRepo('https://github.com/component/throttle.git'))
  t.deepEqual({ login: 'substack'  ,  repo: 'node-browserify' ,  repoUrl: 'https://github.com/substack/node-browserify' } ,  loginRepo('https://github.com/substack/node-browserify.git'))
  t.deepEqual({ login: 'substack'  ,  repo: 'node-browserify' ,  repoUrl: 'https://github.com/substack/node-browserify'}  ,  loginRepo('https://github.com/substack/node-browserify'))
  t.deepEqual({ login: 'thlorenz'  ,  repo: 'runnel'          ,  repoUrl: 'github.com/thlorenz/runnel' }                  ,  loginRepo('github.com/thlorenz/runnel'))
  t.deepEqual({ login: 'thlorenz'  ,  repo: 'runnel'          ,  repoUrl: 'thlorenz/runnel' }                             ,  loginRepo('thlorenz/runnel'))
  t.deepEqual({ login: 'substack'  ,  repo: 'hyperquest'      ,  repoUrl: 'git://github.com/substack/hyperquest' }        ,  loginRepo('git@github.com:substack/hyperquest.git'))

  t.end()
})
