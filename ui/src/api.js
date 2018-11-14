import User from './user.js';

const BASE_URL = "https://7n5x5r84kc.execute-api.us-west-2.amazonaws.com/production/comments";

const callbacks = [];
let comments = [];

async function submitComment(commentText) {
  const user = User.getUserFromCookies();

  if (!user) {
    throw "You can't create a comment without logging in!";
  }

  const payload = {
    author_github_id: user.githubId,
    author_secret_code: user.secretCode,
    entry_id: entryId,
    comment_text: commentText,
  }

  const responseJson = await (await fetch(
    BASE_URL, {
      cors: true,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      method: "POST",
      body: JSON.stringify(payload),
    })
  ).json();

  // Fetch the newly posted comment.
  fetchComments();
}

async function fetchComments() {
  const url = `${BASE_URL}?entry_id=${entryId}`;
  const responseBody = await (await fetch(url, { cors: true })).json();

  comments = responseBody.comments;

  triggerCallbacks();
}

function triggerCallbacks() {
  callbacks.forEach(cb => cb(comments));
}

function listenForComments(cb) {
  callbacks.push(cb);
}

const API = {
  fetchComments,
  listenForComments,
  submitComment,
};

export default API;
