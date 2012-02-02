var http = require('http');
var util = require('util');
var url = require('url');
var querystring = require('querystring');
var util = require('util');

function escapeJSONString(key, value) {
  if (typeof value == 'string') {
    return value.replace(/[^ -~\b\t\n\f\r"\\]/g, function(a) {
      return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
    });
  }
  return value;
}
function JSONStringify(data) {
  return JSON.stringify(data, escapeJSONString).replace(/\\\\u([\da-f]{4}?)/g, '\\u$1');
}

/**
 *  Redmine
 */
function Redmine(config) {
  if (!config.apiKey || !config.host) {
    throw new Error("Error: apiKey and host must be configured.");
  }

  this.setApiKey(config.apiKey);
  this.setHost(config.host);
}

Redmine.prototype.version = '0.2.3';

Redmine.JSONStringify = JSONStringify;

Redmine.prototype.setApiKey = function(key) {
  this.apiKey = key;
};

Redmine.prototype.getApiKey = function() {
  return this.apiKey;
};

Redmine.prototype.setHost = function(host) {
  this.host = host;
};

Redmine.prototype.getHost = function() {
  return this.host;
};

Redmine.prototype.generatePath = function(path, params) {
  if (path.slice(0, 1) != '/') {
    path = '/' + path;
  }
  return path + '?' + querystring.stringify(params);
};

Redmine.prototype.request = function(method, path, params, callback) {
  if (!this.getApiKey() || !this.getHost()) {
    throw new Error("Error: apiKey and host must be configured.");
  }

  var options = {
    host: this.getHost(),
    path: method == 'GET' ? this.generatePath(path, params) : path,
    method: method,
    headers: {
      'X-Redmine-API-Key': this.getApiKey()
    }
  };

  var req = http.request(options, function(res) {
    //console.log('STATUS: ' + res.statusCode);
    //console.log('HEADERS: ' + JSON.stringify(res.headers));

    if (res.statusCode != 200 && res.statusCode != 201) {
      callback({message: 'Server returns stats code: ' + res.statusCode, response: res}, null);
      callback = null;
      return ;
    }

    var body = "";
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      body += chunk;
    });
    res.on('end', function(e) {
      var data = JSON.parse(body);
      callback(null, data);
      callback = null;
    });
  });

  req.on('error', function(err) {
    callback(err, null);
    callback = null;
  });

  if (method != 'GET') {
    var body = JSONStringify(params);
    req.setHeader('Content-Length', body.length);
    req.setHeader('Content-Type', 'application/json');
    req.write(body);
  }
  req.end();
};

/**
 *  crud apis
 */
Redmine.prototype.getIssue = function(id, callback) {
  if (typeof id == 'integer') {
    throw new Error('Error: Argument #1 id must be integer');
  }
  this.request('GET', '/issues/' + id + '.json', {}, callback);
};

Redmine.prototype.getIssues = function(params, callback) {
  this.request('GET', '/issues.json', params, callback);
};

Redmine.prototype.postIssue = function(params, callback) {
  this.request('POST', '/issues.json', {issue: params}, callback);
};

Redmine.prototype.updateIssue = function(id, params, callback) {
  this.request('PUT', '/issues/' + id + '.json', {issue: params}, callback);
};

Redmine.prototype.deleteIssue = function(id, callback) {
  this.request('DELETE', '/issues/' + id + '.json', {}, callback);
};


/*
 * Exports
 */
module.exports = Redmine;
