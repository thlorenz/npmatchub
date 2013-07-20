
'use strict';
/*jshint asi: true */

var test = require('tap').test
var percentify = require('../lib/percentify-logins')


test('\ncorrectly maps counts to percents for each login rounded to 2 decimals sorted highest percent to lowest', function (t) {
  var logins = [
    { login: 'visionmedia', count: 41 },
    { login: 'LearnBoost', count: 7 },
    { login: 'component', count: 4 },
    { login: 'learnboost', count: 2 },
    { login: 'senchalabs', count: 1 },
    { login: 'ScottHamper', count: 1 },
    { login: 'dominictarr', count: 1 },
    { login: 'chjj', count: 1 },
    { login: 'timrwood', count: 1 } ]

  var percentified = percentify(logins);

  t.deepEqual(
      percentified
    , [ { login: 'visionmedia', percent: 69.49 },
        { login: 'LearnBoost', percent: 11.86 },
        { login: 'component', percent: 6.78 },
        { login: 'learnboost', percent: 3.39 },
        { login: 'senchalabs', percent: 1.69 },
        { login: 'ScottHamper', percent: 1.69 },
        { login: 'dominictarr', percent: 1.69 },
        { login: 'chjj', percent: 1.69 },
        { login: 'timrwood', percent: 1.69 } ]
  );

  t.end()

})
