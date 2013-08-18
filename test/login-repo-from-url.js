'use strict';
/*jshint asi: true */

var test = require('tap').test
var loginRepo = require('../lib/login-repo-from-url')

test('\ndetermines the user login and repo name correcctly from the url', function (t) {

  t.deepEqual({ login: 'component' ,  repo: 'throttle'        ,  repoUrl: 'git://github.com/component/throttle' }         ,  loginRepo('git://github.com/component/throttle.git'))
  t.deepEqual({ login: 'component' ,  repo: 'throttle'        ,  repoUrl: 'https://github.com/component/throttle'}        ,  loginRepo('https://github.com/component/throttle.git'))
  t.deepEqual({ login: 'substack'  ,  repo: 'node-browserify' ,  repoUrl: 'https://github.com/substack/node-browserify' } ,  loginRepo('https://github.com/substack/node-browserify.git'))
  t.deepEqual({ login: 'substack'  ,  repo: 'node-browserify' ,  repoUrl: 'https://github.com/substack/node-browserify'}  ,  loginRepo('https://github.com/substack/node-browserify'))
  t.deepEqual({ login: 'thlorenz'  ,  repo: 'runnel'          ,  repoUrl: 'https://github.com/thlorenz/runnel' }          ,  loginRepo('github.com/thlorenz/runnel'))
  t.deepEqual({ login: 'thlorenz'  ,  repo: 'runnel'          ,  repoUrl: 'https://github.com/thlorenz/runnel' }          ,  loginRepo('thlorenz/runnel'))
  t.deepEqual({ login: 'substack'  ,  repo: 'hyperquest'      ,  repoUrl: 'git://github.com/substack/hyperquest' }        ,  loginRepo('git@github.com:substack/hyperquest.git'))
  t.deepEqual({ login: 'sax1johno' ,  repo: 'msr'             ,  repoUrl: 'https://github.com/sax1johno/msr' }            ,  loginRepo('github.com/sax1johno/msr.git'))

  t.end()
})

test('\nfaulty urls return null', function (t) {
  t.equal(null , loginRepo('git://github.com.git'))
  t.equal(null , loginRepo('https://github.com.git'))
  t.equal(null , loginRepo('github.com.git'))
  t.end()
})
