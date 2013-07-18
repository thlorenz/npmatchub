# npmatchub
[![build status](https://secure.travis-ci.org/thlorenz/npmatchub.png)](http://travis-ci.org/thlorenz/npmatchub)

Attempts to match npm users who failed to provide their github name with a github account and do the same for their npm packages.

```js
// TODO
```

## Status

Nix, Nada, Nichevo, Nothing --> go away!

## Installation

    npm install npmatchub

## API


### Get user github login

Not fleshed out yet, but basically give me an array of a user's npm packages and it'll return all possible github logins
for that user sorted by the number of times it was found in the packages.

### Get npm package github url

Given a user's possible github user names and the metadata, it will make a best attempt to find the github url for that
package.

Things it will try in that order:

- `/<username>/<packagename>`
- `/<username>/node-<packagename>`
- `/<username>/<packagename>js`
- `/<username>/js-<packagename>`


## License

MIT
