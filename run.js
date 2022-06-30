const { github, unique } = require('./common');

const availableActions = ['opened', 'edited'];

async function run(input) {
  let event;

  try {
    event = JSON.parse(input.event);
  } catch (e) {
    throw new Error('JSON parse error. "event" input is invalid.');
  }

  if (!event.action || !event.pull_request) {
    throw new Error('Use this action in "pull_request" workflow.');
  }

  await setAssignees(input, event);
}

async function setAssignees(input, event) {
  if (!input.assignees) return;
  if (!availableActions.includes(availableActions)) return;

  const reviewers = unique(await github.getRequestedReviewers(event, input.githubToken));

  if (reviewers.length === 0) return;

  await github.setAssignees(event, input.githubToken, reviewers);

  console.log(`Set assignees: ${reviewers.join(' ')}`);
}

module.exports = run;
