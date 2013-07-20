'use strict';

/**
 * Attempts to resolve the github url for the given npm package, ignoring the one that may be included.
 *
 * @name exports
 * @function
 * @param pack {Object} { owner, name, repoUrl } currently known package info
 * @param cb {Function} function (err, resolved) {}
 *  resolved: { owner: corrected/verified repo owner, repoUrl: corrected/verified repo url }
 *    - null if url for the repo wasn't found and thus url an owner couldn't be verified/corrected
 */
var go = module.exports = function (pack, cb) {

  cb(null, { owner: 'verified owner', repoUrl: 'verified repo url' });
};
