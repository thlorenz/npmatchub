# npmatchub [![build status](https://secure.travis-ci.org/thlorenz/npmatchub.png)](http://travis-ci.org/thlorenz/npmatchub)

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

function countUrls (packages) {
  return packages.filter(function (x) { return x.repoUrl }).length;
}

repos(opts, function (err, repos) {
  if (err) return console.error(err);
  console.log('Originals have %s known repoUrls and fixed ones have %s', countUrls(tj), countUrls(repos));
})
.on('processing', function (pack) {
  process.stderr.write('.');
})
.on('processed', function (pack, github) {
  if (github) console.error('%s: \t%s/%s', pack.name, github.login, github.repo);
  else console.error('%s: \tNOT FOUND', pack.name);
});
```

```
.Lingo:   visionmedia/Lingo
.api-schema:  NOT FOUND
.asset:   visionmedia/asset
.audio-component:   component/audio
[ .. ]

Originals have 59 known repoUrls and fixed ones have 264
```

[full example](https://github.com/thlorenz/npmatchub/blob/master/examples/fix-tjs-repos.js)

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
 * Attempts to find repo information for the given npm packages for which a gitub url is missing.
 *
 * @name repos
 * @function
 * @param opts {
 *    packages :  {[Object]} - npm packages metadata
 *    logins   :  {[String]} (optional) - known login names for the npm package owner, derived from packages if not supplied
 *    trust    :  {Boolean}  (optional) - if true given repo urls will not be verified and/or fixed, default: true
 *    resolve  :  {Function} (optional) - overrides the algorithm that resolves github information of a package
 * }
 * @param cb {Function} calls back with a copy of the npm packages metadata with extra repo urls.
 * @return {EventEmitter} - emits 'processing' and 'processed' events
 */
```

Given a user's npm packages metadata, it will make a best attempt to find the github url for each package.

It will try in that order:

- `/<username>/<packagename>`
- `/<username>/node-<packagename>`
- `/<username>/<packagename>js`
- `/<username>/<packagename>.js`
- other magic, i.e. deducing login name from partial names found in package name

###*npmatchub.resolve(pack, logins, cb)*

This is the function that is used to resolve github information for a package and is exposed for you to use in case you
decide to override `resolve` and want to delegate some calls to it in your implementation, as demonstrated in [this
example](https://github.com/thlorenz/npmatchub/blob/master/examples/fix-tjs-repos-wrap-resolve.js).

###*npmatchub.stabs(logins, packname) : [ github infos to try ]*

This is the function that is used in order to generate the possible `login/repo` combinations that npmatchub will take a
stab at when trying to find a github repository for a given package.

It is exposed here in case you want to use it when you override the `resolve` function.

###*npmatchub.loginPercents(loginCounts) : [ logins with percentage of their occurrence ]*

This is the function used in order to convert the login counts, i.e. `[ { login: 'foo', count: 2 } , .. ]` into an array
with percentages rounded to two decimals, i.e. `[ { login: 'foo', percent: 66.66 } .. ]`.

It is exposed here in case you are more interested in percentages then in the counts returned
by `npmatchub.logins`.

## License

MIT
