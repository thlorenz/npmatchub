'use strict';

var hyperquest =  require('hyperquest');
var ghroot     =  'https://github.com/';

function existsUrl(url, cb) {
  var opts = { method: 'HEAD' };

  hyperquest(url, opts,  function (err, res) {
    if (err) return cb(err);
    cb(null, res.statusCode === 200);
  }).end();
}

module.exports = function exists(owner, repo, cb) {
  var url = ghroot + owner + '/' +  repo;
  existsUrl(url, cb);
};
