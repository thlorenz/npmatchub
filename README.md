# npmatchub
[![build status](https://secure.travis-ci.org/thlorenz/npmatchub.png)](http://travis-ci.org/thlorenz/npmatchub)

Attempts to match npm users who failed to provide their github name with a github account and do the same for their npm packages.

#### Attempt to find TJs repos on github
```js
var repos = require('npmatchub').repos;

// metadata of TJs npm packages
var tj = require('../test/fixtures/tj'); 
var opts = {
    packages :  tj
  , trust    :  true // if github url is provided, we trust it
};

repos(opts, function (err, repos) {
  if (err) return console.error(err);
  console.log('repos: ', repos.length);
})
.on('processing', function (pack) {
  process.stderr.write('.');
})
.on('processed', function (pack, github) {
  if (github) console.error('%s: \t%s/%s', pack.name, github.login, github.repo);
  else console.error('%s: \tNOT FOUND', pack.name);
});
```

## Status

Alpha - `logins` and `repos` are working but some more testing still needs to be done

## Installation

    npm install npmatchub

## API

###*npmmatchub.logins(packages)*

```
/**
 * Uses the packages that do have a github url specified to guess about what the npm user's github login is
 *
 * @name logins
 * @function
 * @param packages {Array{Object}} npm metadata of the user's packages as returned by a call to
 *  'https://registry.npmjs.org/-/all/' for all users
 * @return {[Object]} possible user logins sorted by how many times they were found with that count as value
 *  each item has structure: { login, count }
 */
 ```

###*npmatchub.repos(opts, cb)*

```
/**
 * Attempts to find repo urls for the given npm packages for which it is missing.
 *
 * @name repos
 * @function
 * @param opts {
 *  packages: {[Object]} - npm packages metadata
 *  logins: {[String]} (optional) - known login names for the npm package owner, derived from packages if not supplied
 *  trust: {Boolean} - (optional) if true given repo urls will not be verified and/or fixed, default: true
 *  resolve: {Function} - (optional) overrides the algorithm that resolves github information of a package
 * @param cb {Function} calls back with a copy of the npm packages metadata with extra repo urls.
 * @return {EventEmitter} - emits 'processing' and 'processed' events
 */
var go = module.exports = function (opts, cb) {
```

Given a user's npm packages metadata, it will make a best attempt to find the github url for each package.

It will try in that order:

- `/<username>/<packagename>`
- `/<username>/node-<packagename>`
- `/<username>/<packagename>js`
- `/<username>/js-<packagename>`


## License

MIT
