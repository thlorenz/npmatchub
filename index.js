'use strict';

// main functionality
exports.logins = require('./lib/logins-count');
exports.repos = require('./lib/repos');

// exposed to allow calling the original when overriding 'resolve' for repos
exports.resolve = require('./lib/repos-resolve-github');

// exposed utilities
exports.loginsPercent = require('./lib/logins-percent');
exports.stabs = require('./lib/repos-stabs');
