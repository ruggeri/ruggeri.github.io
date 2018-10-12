const BASE_URL = "https://7n5x5r84kc.execute-api.us-west-2.amazonaws.com/production/comments";

const callbacks = [];
let comments = [];

async function submitComment(comment) {
  const payload = {
    author_name: comment.author_name,
    entry_id: entryId,
    text: comment.text,
  }

  const responseJson = await (await fetch(
    BASE_URL, {
      cors: true,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      method: "POST",
      body: JSON.stringify(payload),
    })
  ).json();
  console.log(responseJson);

  // Fetch the newly posted comment.
  fetchComments();
}

async function fetchComments() {
  const url = `${BASE_URL}?entry_id=${entryId}`;
  const responseBody = await (await fetch(url, { cors: true })).json();
  console.log(responseBody);

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
