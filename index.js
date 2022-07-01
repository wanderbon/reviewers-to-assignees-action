const core = require('@actions/core');
const run = require('./run');

const input = {
  githubToken: core.getInput('github-token'),
  event: core.getInput('event'),
};

run(input)
  .then(() => {
    core.setOutput('result', 'success');
  })
  .catch((error) => {
    core.setOutput('result', 'failure');
    core.info(error.message);
  });
