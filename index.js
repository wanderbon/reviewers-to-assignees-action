const core = require('@actions/core');
const run = require('./run');

const input = {
  reviewers: core.getInput('reviewers'),
  githubToken: core.getInput('github-token'),
  event: core.getInput('event'),
};

run(input)
  .then(() => {
    core.setOutput('result', 'success');
  })
  .catch((error) => {
    core.setOutput('result', 'failure');
    core.setFailed(error.message);
  });
