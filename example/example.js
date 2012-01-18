var Redmine = require('../lib/redmine');

var redmine = new Redmine({
  host: 'redmine host',
  apiKey: 'redmine api key',
});


// get issue
redmine.getIssues({project_id: 1}, function(err, data) {
  if (err) {
    console.log("Error: " + err.message);
    return;
  }

  console.log("Issues:");
  console.log(data);
});


// create issue
var issue = {
  project_id: 1,
  subject: "This is test issue on " + Date.now(),
  description: "Test issue description"
};
redmine.postIssue(issue, function(err, data) {
  if (err) {
    console.log("Error: " + err.message);
    return;
  }

  console.log(data);
});


// update issue
var issueId = 4; // exist id
var issueUpdate = {
  notes: "this is comment"
};
redmine.updateIssue(issueId, issueUpdate, function(err, data) {
  if (err) {
    console.log("Error: " + err.message);
    return;
  }

  console.log(data);
});

// delte issue
var issueId = 4;
redmine.deleteIssue(issueId, function(err, data) {
  if (err) {
    console.log("Error: " + err.message);
    return;
  }

  console.log(data);
});
