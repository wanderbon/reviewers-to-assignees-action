const axios = require('axios');

const API_BASE_URL = 'https://api.github.com/repos';

async function setAssignees(event, token, assignees) {
  try {
    await axios({
      method: 'post',
      url: `${API_BASE_URL}/${event.repository.full_name}/issues/${event.pull_request.number}/assignees`,
      data: {
        assignees,
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `token ${token}`,
      },
    });
  } catch (e) {
    throw new Error(createErrorMessage(e));
  }
}

async function getRequestedReviewers(event, token) {
  let requestedReviewers;

  try {
    const res = await axios({
      url: `${API_BASE_URL}/${event.repository.full_name}/pulls/${event.pull_request.number}/requested_reviewers`,
      headers: {
        Authorization: `token ${token}`,
      },
    });

    requestedReviewers = res.data.users;
  } catch (e) {
    throw new Error(createErrorMessage(e));
  }

  return requestedReviewers;
}

function createErrorMessage(e, hint) {
  let message = `GitHub API error (message: ${e.message}).`;

  if (!hint) {
    message = `${message} "github-token" may not be correct.`;
  } else {
    message = `${message} ${hint}`;
  }

  return message;
}

function unique(array) {
  return Array.from(new Set(array));
}

module.exports = {
  github: {
    setAssignees,
    getRequestedReviewers,
  },
  unique,
};
