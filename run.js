const { github, unique } = require('./common');

const availableActions = ['opened', 'edited', 'synchronize'];

async function run(input) {
  let event;

  try {
    event = JSON.parse(input.event);
  } catch (e) {
    throw new Error('JSON parse error. "event" input is invalid.');
  }

  if (!event.action || !event.pull_request) {
    throw new Error('Use this action in "pull_request" or "push" workflow.');
  }

  if (!availableActions.includes(event.action)) {
    console.warn(event.action);
    // throw new Error('Use this action with "opened" or "edited" action type');
  }

  await setAssignees(input, event);
}

async function setAssignees(input, event) {
  const reviewers = unique(await github.getRequestedReviewers(event, input.githubToken));

  if (reviewers.length === 0) {
    throw new Error('Reviewers list is empty');
  }

  await github.setAssignees(event, input.githubToken, reviewers);

  console.log(`Set assignees: ${reviewers.join(' ')}`);
}

module.exports = run;
