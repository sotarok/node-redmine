var path = require('path');
var assert = require('assert');
var util = require('util');

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

module.exports = {
  'config': function(beforeExit, assert)
  {
    assert.ok(process.env.TEST_REDMINE_HOST == redmine.getHost())
    assert.ok(process.env.TEST_REDMINE_APIKEY == redmine.getApiKey())
  }
  ,'config error': function(beforeExit, assert)
  {
    try {
      new Redmine({});
    } catch (e) {
      assert.type(e, 'object');
      assert.includes(e.message, 'Error: apiKey and host must be configured.');
    }
  }
  ,'get issue error': function(beforeExit, assert)
  {
    try {
      redmine.getIssue({foo: 1}, function(err, data) {
      });
    } catch (e) {
      assert.type(e, 'object');
      assert.includes(e.message, 'Error: Argument #1 id must be integer');
    }
  }
  ,'get issue': function(beforeExit, assert)
  {
    redmine.getIssue(1, function(err, data) {
      assert.isNull(err, 'Err is null');

      assert.type(data.issue, 'object', 'Data issue is an object');

      var issue = data.issue;
      assert.equal(1, issue.id);
      assert.equal('Ticket1', issue.subject);
    });
  }
  ,'get issues': function(beforeExit, assert)
  {
    redmine.getIssues({project_id: 1, limit: 2}, function(err, data) {
      assert.isNull(err, 'Err is null');
      assert.equal(data.limit, 2);
    });
  }
  ,'JSONStringify': function(beforeExit, assert)
  {
    var hoge = {hoge: 1};
    assert.equal(Redmine.JSONStringify(hoge), '{"hoge":1}'); // plain JSON

    var hoge = {hoge: 'JSON with "escape string"'};
    assert.equal(Redmine.JSONStringify(hoge), '{"hoge":"JSON with \\\"escape string\\\""}');


    var hoge = {hoge: 'JSON with 日本語'};
    var converted = Redmine.JSONStringify(hoge);
    assert.equal(converted, '{"hoge":"JSON with \\u65e5\\u672c\\u8a9e"}');
    assert.eql(JSON.parse(converted), hoge); // invertible

    var hoge = {hoge: 'JSON with \n \r \b \\ \f \t '};
    var converted = Redmine.JSONStringify(hoge);
    assert.equal(converted, '{"hoge":"JSON with \\n \\r \\b \\\\ \\f \\t "}');
  }
};
