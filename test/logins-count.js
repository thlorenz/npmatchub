'use strict';
/*jshint asi: true */

var test = require('tap').test
var logins = require('..').logins

test('\ndetermines tjholowaychuk correctly', function (t) {
  var tj = require('./fixtures/tj');
  t.deepEqual(
      logins(tj)
    , [ { login: 'visionmedia', count: 41 },
        { login: 'LearnBoost', count: 7 },
        { login: 'component', count: 4 },
        { login: 'learnboost', count: 2 },
        { login: 'senchalabs', count: 1 },
        { login: 'ScottHamper', count: 1 },
        { login: 'dominictarr', count: 1 },
        { login: 'chjj', count: 1 },
        { login: 'timrwood', count: 1 } ]
    , 'gets all of tjs packages github logins including other people\'s with correct counts and ordered by count'
  )
  t.end()
})
