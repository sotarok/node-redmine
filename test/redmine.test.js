var path = require('path');
var assert = require('assert');

var basedir = path.join(__dirname, '..');
var libdir = path.join(basedir, 'lib');
var assert = require('assert');

var Redmine = require(path.join(libdir, 'redmine.js'));

assert.ok('TEST_REDMINE_APIKEY' in process.env);
assert.ok('TEST_REDMINE_HOST' in process.env);

var config = {
  host:   process.env.TEST_REDMINE_HOST,
  apiKey: process.env.TEST_REDMINE_APIKEY
};

var redmine = new Redmine(config);

// TODO
module.exports = {
  config: function(beforeExit, assert)
  {
    assert.ok(process.env.TEST_REDMINE_HOST == redmine.getHost())
    assert.ok(process.env.TEST_REDMINE_APIKEY == redmine.getApiKey())
  }
};
