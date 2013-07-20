'use strict';

/**
 * Attempts to resolve the github url for the given npm package, ignoring the one that may be included.
 *
 * @name exports
 * @function
 * @param pack {Object} { owner, name, repoUrl } currently known package info
 * @param logins {Array[Object]} [ { 'login1': percent, 'login2': percent } ]
 *  known github logins of the npm user with the percentage at which they appeared in his packages
 * @param cb {Function} function (err, resolved) {}
 *  resolved: { owner: corrected/verified repo owner, repoUrl: corrected/verified repo url }
 *    - null if url for the repo wasn't found and thus url an owner couldn't be verified/corrected
 */
var go = module.exports = function (pack, logins, cb) {
  cb(null, { owner: 'verified owner', repoUrl: 'verified repo url' });
};
