const { github, unique } = require('./common');

const availableActions = ['opened', 'edited', 'synchronize', 'review_requested'];

async function run(input) {
  let event;

  try {
    event = JSON.parse(input.event);
  } catch (e) {
    console.log(e.message);
    return;
  }

  if (!event.action || !event.pull_request) {
    console.log('Use this action in "pull_request" or "push" workflow.');
    return;
  }

  if (!availableActions.includes(event.action)) {
    console.log(`Use this action with ${availableActions.join(', ')} action types`);
    return;
  }

  await setAssignees(input, event);
}

async function setAssignees(input, event) {
  // const assignees = unique(await github.)
  const reviewers = unique(await github.getRequestedReviewers(event, input.githubToken));

  if (reviewers.length === 0) {
    console.log('Reviewers list is empty');
    return;
  }

  await github.setAssignees(event, input.githubToken, reviewers);

  console.log(`Set assignees: ${reviewers.join(' ')}`);
}

module.exports = run;
