'use strict';

var go = module.exports = function getStabs(logins, packname) {

  var stabs = [];
  var i, j;

  var names = [ packname, 'node-' + packname, packname + 'js', packname + '.js', 'js' + packname ];

  for (i = 0; i < logins.length; i++) {
    for (j = 0; j < names.length; j++) {
      stabs.push({ login: logins[i], repo: names[j] });
    }
  }

  // as last resort try 'once' if packname is 'once-component' or 'component-once' and 'component' is a login
  if (~packname.indexOf('-')) {
    var parts = packname.split('-');
    var fst = parts[0];
    var lst = parts[ parts.length - 1 ];

    var fstLoginIdx = logins.indexOf(fst);
    if (~fstLoginIdx) stabs.push({ login: logins[fstLoginIdx], repo: parts.slice(1).join('-') });

    var lstLoginIdx = logins.indexOf(lst);
    if (~lstLoginIdx) stabs.push({ login: logins[lstLoginIdx], repo: parts.slice(0, -1).join('-') });
  }

  return stabs;
};

// Test
if (!module.parent) {
  var logins = [ 'visionmedia', 'component' ]
  var name = 'foobar'
  go(logins, name);
}
