'use strict';

// info: { owner: owner, name: 'reponame', repoUrl: 'repo url if it was given' }
// check needs to return null if nothing found
// needs to return same or corrected login and/or repo

// call back with error if something went wrong
// call back with null if no url could be resolved
// call back with url if it was resolved
var go = module.exports = function (pack, cb) {
  cb(null, 'some url');
};
