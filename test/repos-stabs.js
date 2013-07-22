'use strict';
/*jshint asi: true */

var test = require('tap').test
var getStabs = require('../lib/repos-stabs')

function inspect(obj, depth) {
  return require('util').inspect(obj, false, depth || 5, true);
}

var logins = ['visionmedia', 'component'];

function straightForward (name) {
  return [
    { login: 'visionmedia' ,  repo: name },
    { login: 'visionmedia' ,  repo: 'node-' + name },
    { login: 'visionmedia' ,  repo: name + 'js' },
    { login: 'visionmedia' ,  repo: name + '.js' },
    { login: 'component'   ,  repo: name },
    { login: 'component'   ,  repo: 'node-' + name  },
    { login: 'component'   ,  repo: name + 'js' },
    { login: 'component'   ,  repo: name + '.js' }
  ]
}

function makeCheck (t, stabs) {
  return function check(expected) {
    var stab = stabs.shift();
    t.deepEqual(stab, expected, inspect(stab))
  }
}

test('\ngiven logins: ' + logins + ', straight forward matches for foobar', function (t) {
  var stabs = getStabs(logins, 'foobar')
  var check = makeCheck(t, stabs)
  straightForward('foobar').forEach(check)
  t.equal(stabs.length, 0, 'nothing else');

  t.end()
})

test('\ngiven logins: ' + logins + ', extra matches for foobar-component', function (t) {
  var stabs = getStabs(logins, 'foobar-component')
  var check = makeCheck(t, stabs)
  straightForward('foobar-component').forEach(check)
  check({ login: 'component', repo: 'foobar'})

  t.equal(stabs.length, 0, 'nothing else');
  t.end()
})

test('\ngiven logins: ' + logins + ', extra matches for component-foobar', function (t) {
  var stabs = getStabs(logins, 'component-foobar')
  var check = makeCheck(t, stabs)
  straightForward('component-foobar').forEach(check)
  check({ login: 'component', repo: 'foobar'})

  t.equal(stabs.length, 0, 'nothing else');
  t.end()
})

test('\ngiven logins: ' + logins + ', extra matches for component-foobar-component', function (t) {
  var stabs = getStabs(logins, 'component-foobar-component')
  var check = makeCheck(t, stabs)
  straightForward('component-foobar-component').forEach(check)
  check({ login: 'component', repo: 'foobar-component'})
  check({ login: 'component', repo: 'component-foobar'})

  t.equal(stabs.length, 0, 'nothing else');
  t.end()
})

// node is not one of the logins, so it shouldn't try any extra stabs
test('\ngiven logins: ' + logins + ', no extra matches for node-foobar', function (t) {
  var stabs = getStabs(logins, 'node-foobar')
  var check = makeCheck(t, stabs)
  straightForward('node-foobar').forEach(check)

  t.equal(stabs.length, 0, 'nothing else');
  t.end()
})
